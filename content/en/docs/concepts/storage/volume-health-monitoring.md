---
reviewers:
- gnufied
- jsafrane
- msau42
- xing-yang
title: Volume Health Monitoring
content_type: concept
weight: 100
---

<!-- overview -->

{{< feature-state feature_gate_name="CSIVolumeHealth" >}}

CSI volume health monitoring lets a {{< glossary_tooltip text="CSI" term_id="csi" >}}
driver report health problems with a volume or with its storage backend directly to
Kubernetes. The driver reports through CSI RPCs, and Kubernetes surfaces the reports on
three status fields:
{{< glossary_tooltip text="PersistentVolumeClaim" term_id="persistent-volume-claim" >}}
`.status.healthStatus`, {{< glossary_tooltip text="Pod" term_id="pod" >}}
`.status.volumeHealth`, and
[CSINode](/docs/reference/kubernetes-api/storage/csi-node-v1/) `.status.storageHealth`.
Automation can watch these durable status fields instead of
having to reconstruct volume health from ephemeral
{{< glossary_tooltip text="Events" term_id="event" >}} or from vendor-specific
dashboards.

{{< note >}}
The `CSIVolumeHealth` feature gate has existed since Kubernetes v1.21, but the
mechanism described on this page is a redesign that replaces the original
alpha implementation. See [Limitations](#limitations) for what changed.
{{< /note >}}

<!-- body -->

## How it works

The CSI spec defines four RPCs for health reporting:

- On the CSI controller plugin: `ControllerListVolumeHealth` and
  `ControllerGetVolumeHealth`, for controller-observed, per-volume health.
- On the CSI node plugin: `NodeGetVolumeHealth`, for node-observed, per-volume
  health, and `NodeGetStorageHealth`, for the health of the storage backend as seen
  from that node.

A driver only needs to implement the RPCs it wants to support, and advertises support
through CSI plugin capabilities. A driver that implements none of these RPCs is never
probed, and reporting stays dormant for that driver. A driver that advertises the
controller `LIST_VOLUME_HEALTH` capability must also advertise `GET_VOLUME_HEALTH`;
the `csi-external-health-monitor-controller` sidecar enforces this requirement.

Each health report carries a `status` drawn from a small, machine-parseable set of
values, together with a driver-defined `reason` and an optional human-readable
`message`:

- Volume-level status values (used for `PersistentVolumeClaim.status.healthStatus`
  and `Pod.status.volumeHealth`): `Inaccessible`, `DataLoss`, `Degraded`.
- Storage-backend status values (used for `CSINode.status.storageHealth`):
  `StorageUnreachable`, `StorageDegraded`.

The node-side and controller-side reports are independent: a volume can be
`Inaccessible` from one node that lost its data path to the backend while the
controller plugin still reports the volume as healthy, and vice versa.

## Health reported on Pods

For volumes that use a CSI driver supporting the node-side `NodeGetVolumeHealth` RPC,
the {{< glossary_tooltip term_id="kubelet" text="kubelet" >}} periodically calls that
RPC for each CSI volume it has mounted for a Pod, and writes the result to
`pod.status.volumeHealth`, keyed by the volume name from `pod.spec.volumes`. The probe
interval is the kubelet's `volumeStatsAggPeriod` setting (the
`--volume-stats-agg-period` command line flag).

```yaml
apiVersion: v1
kind: Pod
# ...
status:
  volumeHealth:
  - name: my-volume
    healthConditions:
    - status: Inaccessible
      reason: VolumeNotFound
      message: "volume not found on the storage backend"
    lastTransitionTime: "2026-07-20T12:00:00Z"
```

The kubelet only writes `pods/status`, a subresource it is already authorized to
update for Pods bound to its own node, so no new authorization is required for this
field.

## Health reported on CSINode

For each CSI driver registered on a node that supports `NodeGetStorageHealth`, the
kubelet periodically calls that RPC and writes the result to
`csinode.status.storageHealth`, keyed by driver name.

```yaml
apiVersion: storage.k8s.io/v1
kind: CSINode
# ...
status:
  storageHealth:
  - name: csi.example.com
    healthConditions:
    - status: StorageUnreachable
      reason: NetworkPartition
      message: "data path to the storage backend is unreachable from this node"
```

A `StorageHealthCondition` entry can optionally scope itself to a specific
`accessMode` or `volumeMode`, for backends that degrade asymmetrically (for example, a
network problem that affects `ReadWriteMany` access but not `ReadWriteOnce`).

Writing to `csinodes/status` is a new capability added by this feature: the
[Node authorization mode](/docs/reference/access-authn-authz/node/) and the
NodeRestriction admission plugin only allow a kubelet to patch the `CSINode` object
that matches its own node, and only while the `CSIVolumeHealth`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/) is
enabled.

## Health reported on PersistentVolumeClaims

Controller-observed volume health is written to `persistentvolumeclaim.status.healthStatus`
by the `csi-external-health-monitor-controller` sidecar that runs alongside a CSI
driver's controller plugin. The sidecar calls `ControllerListVolumeHealth` (or falls
back to `ControllerGetVolumeHealth` per volume) and writes the result:

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
# ...
status:
  healthStatus:
    healthConditions:
    - status: Inaccessible
      reason: VolumeNotFound
      message: "volume not found on the storage backend"
    lastTransitionTime: "2026-07-20T12:00:00Z"
```

No node ever writes this field; only the sidecar, running in the control plane, does.
This keeps a compromised or misbehaving node from being able to influence what other
users of the cluster see on a PVC.

Whether this path is available for a given driver depends on that driver, and its
deployment of the `csi-external-health-monitor-controller` sidecar, having adopted the
new controller RPCs.

## Enabling volume health monitoring

Volume health monitoring is controlled by a single
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/),
`CSIVolumeHealth`, on both `kube-apiserver` and the kubelet:

- On `kube-apiserver`, enabling the feature gate allows the new status fields to be
  written and read; disabling it drops the fields on the next write to the object,
  while preserving values already stored.
- On the kubelet, enabling the feature gate starts the periodic node-side probing
  described above.

Controller-side monitoring, which populates `persistentvolumeclaim.status.healthStatus`,
does not have its own feature gate. Deploying the `csi-external-health-monitor-controller`
sidecar alongside your CSI driver's controller plugin is itself the controller-side
opt-in.

Enabling the feature gate does not, by itself, cause any health information to
appear: a CSI driver also has to advertise and implement the corresponding RPCs.
Check your CSI driver's documentation to see which of the four RPCs, if any, it
supports.

## Monitoring

The kubelet exposes a `csi_node_storage_health_status` gauge metric, labeled by
`driver_name`, `status`, and `reason`, with a value of `1` for each storage-backend
condition currently reported for a driver on that node.

## Limitations

- Kubernetes only surfaces these health reports; it does not act on them.
  Nothing in Kubernetes reschedules Pods, fails over volumes, or otherwise reacts
  to a reported condition on its own. Building a remediation controller on top of
  these status fields is left to cluster operators and vendors.
- An older, alpha implementation of the same `CSIVolumeHealth` feature gate (available
  starting in Kubernetes v1.21) reported abnormal volume conditions using Kubernetes
  Events and a `kubelet_volume_stats_health_status_abnormal` metric. That mechanism
  has been replaced by the status fields and RPCs described on this page, and no
  longer exists.

## {{% heading "whatsnext" %}}

- Read [KEP-1432](https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/1432-volume-health-monitor)
  for the full design.
- See the [CSI driver documentation](https://kubernetes-csi.github.io/docs/drivers.html)
  to find out which CSI drivers implement volume health monitoring.
