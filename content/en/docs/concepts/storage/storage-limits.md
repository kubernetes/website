---
reviewers:
- jsafrane
- saad-ali
- thockin
- msau42
title: Node-specific Volume Limits
content_type: concept
weight: 90
---

<!-- overview -->

This page describes the maximum number of volumes that can be attached
to a Node for various cloud providers.

Cloud providers like Google, Amazon, and Microsoft typically have a limit on
how many volumes can be attached to a Node. It is important for Kubernetes to
respect those limits. Otherwise, Pods scheduled on a Node could get stuck
waiting for volumes to attach.



<!-- body -->

## Kubernetes default limits

The Kubernetes scheduler has default limits on the number of volumes
that can be attached to a Node:

<table>
  <tr><th>Cloud service</th><th>Maximum volumes per Node</th></tr>
  <tr><td><a href="https://aws.amazon.com/ebs/">Amazon Elastic Block Store (EBS)</a></td><td>39</td></tr>
  <tr><td><a href="https://cloud.google.com/persistent-disk/">Google Persistent Disk</a></td><td>16</td></tr>
  <tr><td><a href="https://azure.microsoft.com/en-us/services/storage/main-disks/">Microsoft Azure Disk Storage</a></td><td>16</td></tr>
</table>

## Dynamic volume limits

{{< feature-state state="stable" for_k8s_version="v1.17" >}}

Dynamic volume limits are supported for following volume types.

- Amazon EBS
- Google Persistent Disk
- Azure Disk
- CSI

For volumes managed by in-tree volume plugins, Kubernetes automatically determines the Node
type and enforces the appropriate maximum number of volumes for the node. For example:

* On
<a href="https://cloud.google.com/compute/">Google Compute Engine</a>,
up to 127 volumes can be attached to a node, [depending on the node
type](https://cloud.google.com/compute/docs/disks/#pdnumberlimits).

* For Amazon EBS disks on M5,C5,R5,T3 and Z1D instance types, Kubernetes allows only 25
volumes to be attached to a Node. For other instance types on
<a href="https://aws.amazon.com/ec2/">Amazon Elastic Compute Cloud (EC2)</a>,
Kubernetes allows 39 volumes to be attached to a Node.

* On Azure, up to 64 disks can be attached to a node, depending on the node type. For more details, refer to [Sizes for virtual machines in Azure](https://docs.microsoft.com/en-us/azure/virtual-machines/windows/sizes).

* If a CSI storage driver advertises a maximum number of volumes for a Node (using `NodeGetInfo`), the {{< glossary_tooltip text="kube-scheduler" term_id="kube-scheduler" >}} honors that limit.
Refer to the [CSI specifications](https://github.com/container-storage-interface/spec/blob/master/spec.md#nodegetinfo) for details.

* For volumes managed by in-tree plugins that have been migrated to a CSI driver, the maximum number of volumes will be the one reported by the CSI driver.

### Mutable CSI Node Allocatable Count

{{< feature-state feature_gate_name="MutableCSINodeAllocatableCount" >}}

CSI drivers can dynamically adjust the maximum number of volumes that can be attached to a Node at runtime. This enhances scheduling accuracy and reduces pod scheduling failures due to changes in resource availability.

To use this feature, you must enable the `MutableCSINodeAllocatableCount` feature gate on the following components:

- `kube-apiserver`
- `kubelet`

#### Periodic Updates

When enabled, CSI drivers can request periodic updates to their volume limits by setting the `nodeAllocatableUpdatePeriodSeconds` field in the `CSIDriver` specification. For example:

```yaml
apiVersion: storage.k8s.io/v1
kind: CSIDriver
metadata:
  name: hostpath.csi.k8s.io
spec:
  nodeAllocatableUpdatePeriodSeconds: 60
```

Kubernetes will periodically call the corresponding CSI driver’s `NodeGetInfo` (`ControllerGetNodeInfo` if [enabled](#controller-side-node-information)) endpoint to refresh the maximum number of attachable volumes, using the interval specified in `nodeAllocatableUpdatePeriodSeconds`.
The minimum allowed value for this field is 10 seconds.

If a volume attachment operation fails with a `ResourceExhausted` error (gRPC code 8), Kubernetes triggers an immediate update to the allocatable volume count for that Node. Additionally, kubelet marks affected pods as Failed, allowing their controllers to handle recreation. This prevents pods from getting stuck indefinitely in the `ContainerCreating` state.

### Controller-side node information

{{< feature-state feature_gate_name="CSIControllerGetNodeInfo" >}}

By default, the CSI node plugin on each Node reports the Node's topology and
maximum number of attachable volumes. Some CSI drivers need cloud API
credentials on every Node to do this. With this feature, the CSI node plugin
reports only the Node's ID, and the driver's controller supplies the topology
and volume limit instead, so Nodes do not need cloud API credentials.
This feature also makes it possible to take volumes attached outside
Kubernetes into account in the volume limit.

To use this feature:

- Use a CSI driver that supports it, and that requires attach
  (`attachRequired` in its CSIDriver is not `false`).
- Enable the `CSIControllerGetNodeInfo` feature gate on `kube-apiserver` and
  the driver's [`external-attacher`](https://github.com/kubernetes-csi/external-attacher)
  sidecar first, then on `kubelet`.

When a driver uses this feature, `external-attacher` takes over from `kubelet`
and writes the topology labels to the Node and the driver's `.spec.drivers`
entry to the CSINode. It needs extra RBAC permissions to update Node and
CSINode objects. If `nodeAllocatableUpdatePeriodSeconds` is set,
`external-attacher` also does the periodic and `ResourceExhausted`
[updates](#mutable-csi-node-allocatable-count).

To check whether a driver uses this feature on a Node, look for the driver in
`spec.driverRegistrations` of the Node's CSINode:

```shell
kubectl get csinode <node-name> -o jsonpath='{.spec.driverRegistrations}'
```

To turn the feature off, first restore any configuration that the driver needs
on Nodes (such as cloud API credentials), then disable the feature gate on
`kubelet`, then on `external-attacher` and `kube-apiserver`.

### Preventing Pod placement without CSI driver

{{< feature-state feature_gate_name="VolumeLimitScaling" >}}

The `VolumeLimitScaling`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates#VolumeLimitScaling)
is enabled by default in Kubernetes v1.37. 

However, preventing pod placement on nodes without a CSI driver requires explicit opt-in
via the `spec.preventPodSchedulingIfMissing` field of the `CSIDriver` object.

The `preventPodSchedulingIfMissing` field defaults to `false` and must be set to `true`
if you do not want pods to be scheduled on nodes without a CSI driver. This decision
to default to `false` was made for backward compatibility reasons and compatibility
with [Cluster AutoScaler](https://github.com/kubernetes/autoscaler/tree/master/cluster-autoscaler)
which may not be aware of CSI volume limits during the autoscaling
phase (see section below).

```yaml
apiVersion: storage.k8s.io/v1
kind: CSIDriver
metadata:
  name: hostpath.csi.k8s.io
spec:
  preventPodSchedulingIfMissing: true
```


### CSI volume attach limits and cluster autoscaler

[Cluster autoscaler](https://github.com/kubernetes/autoscaler/tree/master/cluster-autoscaler) can account for CSI 
volume limits when
`--enable-csi-node-aware-scheduling=true`. This option is independent of the
`VolumeLimitScaling` feature gate.

If you use cluster autoscaler, only set `spec.preventPodSchedulingIfMissing` to
`true` when cluster autoscaler is configured with
`--enable-csi-node-aware-scheduling=true`. Otherwise, its scheduling simulations
do not include the required `CSINode` information for new nodes, and cluster
autoscaler might fail to scale up for pending Pods that use CSI volumes.
