---
title: Dynamically Add and Remove Ephemeral Volumes
content_type: task
weight: 217
min-kubernetes-server-version: 1.38
---

<!-- overview -->

{{< feature-state feature_gate_name="DynamicNodeLocalEphemeralVolumes" >}}

This page shows how to dynamically add and remove node-local
[ephemeral volumes](/docs/concepts/storage/ephemeral-volumes/) (`emptyDir`,
`configMap`, `secret`, `projected`, and OCI `image`) and update container
`volumeMounts` on a running Pod without recreating the Pod.

Traditionally, `.spec.volumes` and `.spec.containers[*].volumeMounts` are
immutable after Pod creation. Dynamically adding and removing node-local
ephemeral volumes allows long-running worker Pods, pre-warmed sandboxes, and
sidecar containers to mount fresh configurations, credentials, or scratch
workspaces in-place across tasks without incurring Pod scheduling, networking,
or sandbox initialization overhead.

**Key Concepts:**

* **Pod `/dynamic` subresource:** Standard updates to the `/pods` endpoint keep
  `.spec.volumes` and `volumeMounts` immutable. Dynamic volume additions,
  removals, and mount updates must target the Pod's `dynamic` subresource
  (`pods/dynamic`).
* **Container `dynamicVolumeMountPolicy`:** Adding, removing, or modifying
  `volumeMounts` on an existing container requires setting
  `dynamicVolumeMountPolicy.restartPolicy: RestartContainer` on that container.
  This instructs the kubelet to restart (recreate) that container in-place to
  actuate the updated mounts while leaving other containers in the Pod
  undisturbed.
* **Host volume status (`status.volumeStatuses`):** The kubelet reports the
  host-level lifecycle of supported ephemeral volumes in
  `status.volumeStatuses[*].hostPhase` (`Pending`, `HostMounted`, or
  `Unmounting`).
* **Container mount status (`status.containerStatuses[*].volumeMounts`):**
  Reflects the volume mounts currently active inside each running container.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

* The `DynamicNodeLocalEphemeralVolumes`
  [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
  must be enabled on `kube-apiserver` **and** `kubelet`.
* The `NodeDeclaredFeatures` feature gate must be enabled (enabled by default).
  Nodes with `DynamicNodeLocalEphemeralVolumes` enabled advertise
  `DynamicNodeLocalEphemeralVolumes` in `.status.declaredFeatures`, and updates
  targeting Pods on nodes without this declared feature are rejected.
* You must have RBAC permissions to `update` or `patch` the `pods/dynamic`
  subresource. Default user-facing roles (`admin`, `edit`, `view`) do **not**
  grant write access to `pods/dynamic`.
* Your `kubectl` client version must be v1.32 or later to use
  `--subresource=dynamic`.

<!-- steps -->

## Container dynamic volume mount policy {#container-dynamic-volume-mount-policy}

To allow `volumeMounts` to be dynamically added to or removed from an
application container while a Pod is running, configure
`dynamicVolumeMountPolicy` in the container specification:

```yaml
spec:
  containers:
  - name: worker
    image: registry.k8s.io/busybox:1.36
    dynamicVolumeMountPolicy:
      restartPolicy: RestartContainer
```

* `RestartContainer`: Permits adding, removing, or updating `volumeMounts` on an
  existing container via `/dynamic`, and instructs the kubelet to restart that
  container in-place once any newly added volumes are prepared on the host.
* `""` (omitted, default): Rejects mutating `volumeMounts` on an existing
  container. Under the default policy, volume mounts can only be added alongside
  a newly added container (such as an
  [ephemeral container](/docs/concepts/workloads/pods/ephemeral-containers/), or
  a dynamically added container when the `DynamicContainers` feature gate is
  enabled) and removed alongside a removed container.

{{< note >}}
`dynamicVolumeMountPolicy.restartPolicy` cannot be set to `RestartContainer`
when the container's `restartPolicy` (or the Pod's `restartPolicy` if no
container-level policy is set) is `Never`. You also cannot set
`dynamicVolumeMountPolicy` on `initContainers` or `ephemeralContainers`.
{{< /note >}}

## How dynamic volume allocation and actuation work {#how-it-works}

Updates submitted through `pods/dynamic` follow a two-stage kubelet lifecycle
that separates node-level volume preparation from container runtime actuation:

1. **Admission and host preparation:** After `kube-apiserver` validates the
   update (and the Node authorizer grants the assigned node read access to any
   newly referenced `Secret` or `ConfigMap` objects), the kubelet admits the
   updated Pod specification into its local allocated state. The kubelet's
   volume manager prepares and mounts new volumes on the host filesystem
   asynchronously in the background.
2. **Container-scoped actuation:** While a newly added volume is still being
   mounted on the host (`hostPhase: Pending`), the kubelet defers restarting (or
   starting) *only* the container that mounts that volume; other containers in
   the Pod continue running uninterrupted. Once the volume reaches
   `hostPhase: HostMounted`, the kubelet restarts the target container in-place
   with the updated bind mounts and updates
   `status.containerStatuses[*].volumeMounts`.
3. **Safe unmount and teardown on removal:** When a `/dynamic` update removes a
   volume from `.spec.volumes` and removes its mount from referencing
   containers, the kubelet sets `hostPhase: Unmounting` and restarts (or stops)
   the referencing container first so the container releases its mount
   namespace reference. Only after no running container uses the volume does the
   kubelet unmount and clean up the host directory, after which the entry is
   removed from `status.volumeStatuses`.

### Tracking status via `status.volumeStatuses` {#volume-statuses}

Each entry in `status.volumeStatuses` tracks a volume by `name` and reports its
`hostPhase`:

* `Pending`: The volume has been requested in `.spec.volumes` and is awaiting
  kubelet allocation or host-level mount preparation.
* `HostMounted`: The kubelet has admitted the volume and mounted it on the node
  host. (Check `status.containerStatuses[*].volumeMounts` to confirm the mount
  has been actuated inside the restarted container.)
* `Unmounting`: Volume removal has been admitted by the kubelet, and container
  unmounting and host directory teardown are in progress. Once host teardown
  completes, the volume entry is pruned from `status.volumeStatuses`.

## Dynamically add and remove volumes on a running Pod {#walkthrough}

### Create a ConfigMap and a running Pod

1. Create a `ConfigMap` containing configuration data to mount dynamically:

   ```shell
   kubectl create configmap task-cm --from-literal=mode=batch-run
   ```

1. Create a Pod whose container sets
   `dynamicVolumeMountPolicy.restartPolicy: RestartContainer`:

   ```shell
   cat <<'EOF' | kubectl apply -f -
   apiVersion: v1
   kind: Pod
   metadata:
     name: dynamic-vol-demo
   spec:
     containers:
     - name: worker
       image: registry.k8s.io/busybox:1.36
       command: ["sh", "-c", "sleep 3600"]
       dynamicVolumeMountPolicy:
         restartPolicy: RestartContainer
   EOF
   ```

1. Wait for the Pod to enter the `Running` phase:

   ```shell
   kubectl wait --for=condition=Ready pod/dynamic-vol-demo --timeout=60s
   ```

### Dynamically mount new `emptyDir` and `configMap` volumes

1. Patch the Pod via `--subresource=dynamic` to add an `emptyDir` scratch volume
   and the `task-cm` `ConfigMap` volume, mounting both into the `worker`
   container:

   ```shell
   kubectl patch pod dynamic-vol-demo --subresource=dynamic --patch '
   {
     "spec": {
       "volumes": [
         {"name": "scratch", "emptyDir": {}},
         {"name": "task-config", "configMap": {"name": "task-cm"}}
       ],
       "containers": [
         {
           "name": "worker",
           "volumeMounts": [
             {"name": "scratch", "mountPath": "/mnt/scratch"},
             {"name": "task-config", "mountPath": "/etc/task-config", "readOnly": true}
           ]
         }
       ]
     }
   }'
   ```

   {{< note >}}
   You can also edit or replace the Pod specification interactively through the
   `dynamic` subresource using
   `kubectl edit pod dynamic-vol-demo --subresource=dynamic`.
   {{< /note >}}

1. Inspect `status.volumeStatuses` and `status.containerStatuses` to confirm
   that both volumes reached `HostMounted` and the `worker` container restarted
   in-place with the new mounts:

   ```shell
   kubectl get pod dynamic-vol-demo -o yaml
   ```

   In the output, `status.volumeStatuses` shows `hostPhase: HostMounted` for
   `scratch` and `task-config`, `status.containerStatuses[0].restartCount`
   increments, and `status.containerStatuses[0].volumeMounts` lists both
   `/mnt/scratch` and `/etc/task-config`.

1. Verify access to the mounted `ConfigMap` and write a file to the `emptyDir`
   volume:

   ```shell
   kubectl exec dynamic-vol-demo -- cat /etc/task-config/mode
   kubectl exec dynamic-vol-demo -- sh -c 'echo -n persisted > /mnt/scratch/state.txt'
   ```

### Dynamically unmount and remove a volume

1. Remove the `task-config` volume and its corresponding container `volumeMount`
   in a single `--subresource=dynamic` strategic merge patch while retaining the
   `scratch` volume:

   ```shell
   kubectl patch pod dynamic-vol-demo --subresource=dynamic --patch '
   {
     "spec": {
       "volumes": [
         {"name": "task-config", "$patch": "delete"}
       ],
       "containers": [
         {
           "name": "worker",
           "volumeMounts": [
             {"mountPath": "/etc/task-config", "$patch": "delete"}
           ]
         }
       ]
     }
   }'
   ```

1. Verify that `task-config` transitions through `Unmounting` and is pruned from
   `status.volumeStatuses`, while data in the retained `scratch` `emptyDir`
   volume persists across the in-place container restart:

   ```shell
   kubectl exec dynamic-vol-demo -- cat /mnt/scratch/state.txt
   kubectl get pod dynamic-vol-demo -o jsonpath='{.status.volumeStatuses}'
   ```

### Clean up

Delete the Pod and ConfigMap created in this exercise:

```shell
kubectl delete pod dynamic-vol-demo
kubectl delete configmap task-cm
```

## Validation rules and limitations {#limitations}

For Kubernetes {{< skew currentVersion >}}, dynamic node-local ephemeral volumes
have the following constraints:

* **Supported volume types:** Only `emptyDir` (disk-backed and `medium: Memory`),
  `configMap`, `secret`, `projected`, and OCI `image` volumes can be dynamically
  added or removed. Requests to dynamically add or remove
  `persistentVolumeClaim`, `csi`, `hostPath`, `downwardAPI`, or cloud storage
  volumes are rejected. Similarly, `volumeMounts` referencing unsupported volume
  types cannot be dynamically added, removed, or modified.
* **Pod lifecycle state:** Dynamic volume updates are permitted only while the
  Pod is in the `Running` phase and all init containers have completed
  (`Initialized` condition is `True`). Updates are rejected once the Pod begins
  terminating (`metadata.deletionTimestamp` is set).
* **No dangling mounts:** You cannot remove a volume from `.spec.volumes` while
  any container in the Pod still mounts it; remove the container `volumeMount`
  (or the container itself) in the same `/dynamic` update. A mounted volume or
  `volumeMount` also cannot be removed until its initial status has been
  reported in Pod status.
* **Volume name reuse:** After removing a volume, you cannot re-add a new volume
  with the same `name` until container unmounting and host teardown finish and
  the name is cleared from `status.volumeStatuses` and all container
  `volumeMounts` statuses.
* **Container types:** Dynamic `volumeMount` mutations are not supported for
  `initContainers` (including sidecar init containers). Ephemeral containers can
  mount newly added volumes when the ephemeral container is created, though an
  existing ephemeral container's `volumeMounts` remain immutable.
* **Container restart required on existing containers:** Live hot-mounting into
  a running container without restarting that container is not supported.
* **Platform and Pod types:** Static (mirror) Pods and Windows Pods do not
  support dynamic volume updates.

## {{% heading "whatsnext" %}}

* Learn more about [Ephemeral Volumes](/docs/concepts/storage/ephemeral-volumes/)
  and [Volumes](/docs/concepts/storage/volumes/).
* Learn about [Projected Volumes](/docs/concepts/storage/projected-volumes/) and
  [Image Volumes](/docs/tasks/configure-pod-container/image-volumes/).
* Learn how to
  [resize memory-backed `emptyDir` volumes in-place](/docs/tasks/configure-pod-container/resize-container-resources/#resizing-memory-backed-emptydir-volumes).
