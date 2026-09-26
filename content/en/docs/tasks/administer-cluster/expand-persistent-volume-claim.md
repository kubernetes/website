---
title: Expand a PersistentVolumeClaim
content_type: task
weight: 95
---

<!-- overview -->

This page shows how to expand a PersistentVolumeClaim (PVC) to request more
storage space.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

The PersistentVolumeClaim that you want to expand must be bound to a
PersistentVolume.

The StorageClass for the claim must support volume expansion, and its
`allowVolumeExpansion` field must be set to `true`. Check the documentation for
your storage driver to confirm that the driver supports expansion.

{{< note >}}
To identify the cluster's storage driver and check whether the StorageClass
supports volume expansion, run:

```shell
kubectl get storageclass
```

The `PROVISIONER` column shows the storage driver. The
`ALLOWVOLUMEEXPANSION` column must be `true` for the StorageClass that
your claim uses.

If the column shows `false`, expansion is turned off for the StorageClass.
The column also shows `false` when `allowVolumeExpansion` isn't set. Ask
your cluster administrator to enable expansion for the StorageClass:

```shell
kubectl patch storageclass <storage-class-name> -p '{"allowVolumeExpansion":true}'
```

Where `<storage-class-name>` is the name of the StorageClass. Enabling
expansion on the StorageClass does not add expansion support to the storage
driver.
{{< /note >}}

### Create a PersistentVolumeClaim to expand (optional)

If you don't already have a PersistentVolumeClaim to expand, create one. This
example uses the cluster's default StorageClass, which must allow volume
expansion.

{{% code_sample file="pods/storage/expandable-pvc.yaml" %}}

{{% code_sample file="pods/storage/expandable-pvc-pod.yaml" %}}

```shell
kubectl apply -f https://k8s.io/examples/pods/storage/expandable-pvc.yaml
kubectl apply -f https://k8s.io/examples/pods/storage/expandable-pvc-pod.yaml
```

<!-- steps -->

## Why expand a PersistentVolumeClaim

When data on a volume grows beyond its allocated capacity, writes to it start
failing. Kubernetes won't warn you before this happens, and it won't evict or
reschedule the Pod for you. The volume just runs out. Expanding the
PersistentVolumeClaim grows the existing volume in place, without having to
provision and migrate data to a new one.

## Key concepts

* **Desired capacity:** `.spec.resources.requests.storage` is the storage
  you're requesting for the PVC. It's mutable. Increase it to request more.
* **Actual capacity:** `.status.capacity.storage` reflects the volume's
  current usable size. This is what's live, and it can lag behind the desired
  capacity while an expansion is in progress.
* **Triggering an expansion:** Increase `.spec.resources.requests.storage`
  above the value in `.status.capacity.storage`, typically with
  `kubectl patch` or `kubectl edit` against the PVC. Kubernetes attempts to
  resize the underlying volume whenever the desired size exceeds the
  allocated capacity.
* **Allocation status (Advanced):** `.status.allocatedResourceStatuses.storage`
  tracks resize progress and terminal failures. The key is absent when no
  resize is in progress, including after one completes successfully. For most
  purposes, watch `.status.capacity` instead; check this field only when an
  expansion isn't progressing as expected.

## Expanding a PersistentVolumeClaim

1. Check the current size and StorageClass of the PersistentVolumeClaim:

   ```shell
   kubectl get pvc expandable-pvc
   ```

   The output is similar to this:

   ```none
   NAME             STATUS   VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS   VOLUMEATTRIBUTESCLASS   AGE
   expandable-pvc   Bound    pvc-03a9b47e-bc70-45bf-9472-1f50f7ced673   1Gi        RWO            standard       <unset>                 47m
   ```

   Confirm that the claim has a status of `Bound`.

2. Request a larger volume for the PersistentVolumeClaim:

   ```shell
   kubectl patch pvc expandable-pvc -p '{"spec":{"resources":{"requests":{"storage":"2Gi"}}}}'
   ```

   The output is similar to this:

   ```none
   persistentvolumeclaim/expandable-pvc patched
   ```

3. Watch the `CAPACITY` column of the PersistentVolumeClaim increase to the
   requested size:

   ```shell
   kubectl get pvc expandable-pvc --watch
   ```

   The output is similar to this:

   ```none
   NAME             STATUS   VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS   VOLUMEATTRIBUTESCLASS   AGE
   expandable-pvc   Bound    pvc-03a9b47e-bc70-45bf-9472-1f50f7ced673   1Gi        RWO            standard       <unset>                 47m
   expandable-pvc   Bound    pvc-03a9b47e-bc70-45bf-9472-1f50f7ced673   1Gi        RWO            standard       <unset>                 48m
   expandable-pvc   Bound    pvc-03a9b47e-bc70-45bf-9472-1f50f7ced673   2Gi        RWO            standard       <unset>                 48m
   ```

   The expansion can take a minute or more to complete. To check whether a
   Pod is using the claim, and to see resize progress, run:

   ```shell
   kubectl describe pvc expandable-pvc
   ```

   The `Used By` field lists the Pods that use the claim. The events show
   each stage of the resize, ending with `FileSystemResizeSuccessful`.

4. Confirm that the Pod sees the new size:

   ```shell
   kubectl exec expandable-pvc-pod -- df -h /data
   ```

   ```none
   Filesystem                Size      Used Available Use% Mounted on
   /dev/mapper/lvmvg-pvc--03a9b47e--bc70--45bf--9472--1f50f7ced673
                             1.9G    280.0K      1.9G   0% /data
   ```

   The filesystem reports slightly less than the claim's capacity, because
   the filesystem uses some of the space for its own metadata.

{{< note >}}
If `CAPACITY` stays at the old size, check the `Used By` field in
`kubectl describe pvc expandable-pvc`. If no Pod is using the claim,
start one that uses it with read-write access. The final stage of
expansion runs on the node where the Pod uses the volume. This applies
to both `Filesystem` and `Block` volumes.
{{< /note >}}

{{< note >}}
Some storage drivers support online expansion, expanding a volume
while a Pod is using it. Other drivers support only offline expansion, and
won't resize while a Pod is still using the claim.

To finish an offline expansion:

1. Stop the Pods that use the claim.
2. Wait until `kubectl describe pvc expandable-pvc` shows the
   `FileSystemResizePending` condition. This can take several minutes.
3. Start a Pod that uses the claim. The node finishes the resize as the Pod
   starts.

Starting the Pod too early stalls the resize. Check your storage driver's
documentation to see whether it supports online expansion.
{{< /note >}}

## Troubleshooting an unsuccessful expansion

Kubernetes will keep retrying a stuck expansion request. If the expansion
fails to progress, inspect the PersistentVolumeClaim:

```shell
kubectl describe pvc expandable-pvc
```

If the requested size is larger than the storage can provide, you might be
able to recover by lowering `.spec.resources.requests.storage`. This value
must still be greater than `.status.capacity.storage`.

This works only if the storage driver hasn't accepted the larger size yet. To
check where the expansion stopped, run:

```shell
kubectl get pvc expandable-pvc -o jsonpath='{.status.allocatedResourceStatuses.storage}{"\n"}'
```

If the output starts with `Controller`, such as `ControllerResizeInfeasible`,
Kubernetes retries the expansion with the lower size. If the output starts
with `Node`, such as `NodeResizePending`, the storage driver has already
accepted the larger size, and lowering the request will have no effect. In that
case, a cluster administrator must recover the claim.

For the cluster administrator recovery procedure, see
[Recovering from failure when expanding volumes](/docs/concepts/storage/persistent-volumes/#recovering-from-failure-when-expanding-volumes).

{{< note >}}
Recovery from a failed expansion by lowering the requested size requires
Kubernetes v1.32 or later.
{{< /note >}}

## Expanding a raw block volume

To expand a PVC with `volumeMode: Block`, follow the same steps as
[Expanding a PersistentVolumeClaim](#expanding-a-persistentvolumeclaim).
Increasing `.spec.resources.requests.storage` works the same way regardless
of volume mode.

To confirm the new size, use `blockdev` instead of `df`:

```shell
kubectl exec <pod-name> -- blockdev --getsize64 <device-path>
```

Where `<device-path>` is the `devicePath` of the volume in the Pod spec.

{{< caution >}}
A raw block volume has no filesystem. The application using the volume is
responsible for detecting and using the additional capacity.
{{< /caution >}}

## Shrinking a PersistentVolumeClaim

Kubernetes can't shrink a volume. You cannot set
`.spec.resources.requests.storage` to a value below
`.status.capacity.storage`. To reclaim storage space, you must migrate the
data to a new, smaller claim:

1. Stop any workloads that are currently using the claim, to prevent writes
   during the migration.
2. Create a new PersistentVolumeClaim of the desired size, with the same
   `storageClassName`, `accessModes`, and `volumeMode` as the original.
3. Copy the data from the original claim to the new one, for example from a
   temporary Pod that mounts both claims.
4. Update your workloads to use the new claim, and restart them.
5. After you've confirmed the workloads are healthy, delete the original
   claim. If the bound PersistentVolume's reclaim policy is `Delete`, this
   also deletes the underlying volume and its data. See
   [Change the Reclaim Policy of a PersistentVolume](/docs/tasks/administer-cluster/change-pv-reclaim-policy/).

## {{% heading "whatsnext" %}}

* Learn more about
  [expanding PersistentVolumeClaims](/docs/concepts/storage/persistent-volumes/#expanding-persistent-volumes-claims).
* Learn more about
  [volume expansion in a StorageClass](/docs/concepts/storage/storage-classes/#allow-volume-expansion).
* Learn more about
  [raw block volume support](/docs/concepts/storage/persistent-volumes/#raw-block-volume-support).
* Learn how to
  [change a PersistentVolume's reclaim policy](/docs/tasks/administer-cluster/change-pv-reclaim-policy/).

### References {#reference}

* {{< api-reference page="core/persistent-volume-claim-v1" >}}
  * See the `.spec.resources.requests.storage`, `.spec.volumeMode`,
    `.status.capacity`, and `.status.allocatedResourceStatuses` fields.
* {{< api-reference page="storage/storage-class-v1" >}}
  * See the `.allowVolumeExpansion` field.
