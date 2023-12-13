---
title: Change the Access Mode of a PersistentVolume to ReadWriteOncePod
content_type: task
weight: 90
min-kubernetes-server-version: v1.22
---

<!-- overview -->

This page shows how to change the access mode on an existing PersistentVolume to
use `ReadWriteOncePod`.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

{{< note >}}
The `ReadWriteOncePod` access mode graduated to stable in the Kubernetes v1.29
release. If you are running a version of Kubernetes older than v1.29, you might
need to enable a feature gate. Check the documentation for your version of
Kubernetes.
{{< /note >}}

{{< note >}}
The `ReadWriteOncePod` access mode is only supported for
{{< glossary_tooltip text="CSI" term_id="csi" >}} volumes.
To use this volume access mode you will need to update the following
[CSI sidecars](https://kubernetes-csi.github.io/docs/sidecar-containers.html)
to these versions or greater:

* [csi-provisioner:v3.0.0+](https://github.com/kubernetes-csi/external-provisioner/releases/tag/v3.0.0)
* [csi-attacher:v3.3.0+](https://github.com/kubernetes-csi/external-attacher/releases/tag/v3.3.0)
* [csi-resizer:v1.3.0+](https://github.com/kubernetes-csi/external-resizer/releases/tag/v1.3.0)
{{< /note >}}

## Why should I use `ReadWriteOncePod`?

Prior to Kubernetes v1.22, the `ReadWriteOnce` access mode was commonly used to
restrict PersistentVolume access for workloads that required single-writer
access to storage. However, this access mode had a limitation: it restricted
volume access to a single *node*, allowing multiple pods on the same node to
read from and write to the same volume simultaneously. This could pose a risk
for applications that demand strict single-writer access for data safety.

If ensuring single-writer access is critical for your workloads, consider
migrating your volumes to `ReadWriteOncePod`.

<!-- steps -->

## Migrating existing PersistentVolumes

If you have existing PersistentVolumes, they can be migrated to use
`ReadWriteOncePod`. Only migrations from `ReadWriteOnce` to `ReadWriteOncePod`
are supported.

In this example, there is already a `ReadWriteOnce` "cat-pictures-pvc"
PersistentVolumeClaim that is bound to a "cat-pictures-pv" PersistentVolume,
and a "cat-pictures-writer" Deployment that uses this PersistentVolumeClaim.

{{< note >}}
If your storage plugin supports
[Dynamic provisioning](/docs/concepts/storage/dynamic-provisioning/),
the "cat-picutres-pv" will be created for you, but its name may differ. To get
your PersistentVolume's name run:

```shell
kubectl get pvc cat-pictures-pvc -o jsonpath='{.spec.volumeName}'
```
{{< /note >}}

And you can view the PVC before you make changes. Either view the manifest
locally, or run `kubectl get pvc <name-of-pvc> -o yaml`. The output is similar
to:

```yaml
# cat-pictures-pvc.yaml
kind: PersistentVolumeClaim
apiVersion: v1
metadata:
  name: cat-pictures-pvc
spec:
  accessModes:
  - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi
```

Here's an example Deployment that relies on that PersistentVolumeClaim:

```yaml
# cat-pictures-writer-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: cat-pictures-writer
spec:
  replicas: 3
  selector:
    matchLabels:
      app: cat-pictures-writer
  template:
    metadata:
      labels:
        app: cat-pictures-writer
    spec:
      containers:
      - name: nginx
        image: nginx:1.14.2
        ports:
        - containerPort: 80
        volumeMounts:
        - name: cat-pictures
          mountPath: /mnt
      volumes:
      - name: cat-pictures
        persistentVolumeClaim:
          claimName: cat-pictures-pvc
          readOnly: false
```

As a first step, you need to edit your PersistentVolume's
`spec.persistentVolumeReclaimPolicy` and set it to `Retain`. This ensures your
PersistentVolume will not be deleted when you delete the corresponding
PersistentVolumeClaim:

```shell
kubectl patch pv cat-pictures-pv -p '{"spec":{"persistentVolumeReclaimPolicy":"Retain"}}'
```

Next you need to stop any workloads that are using the PersistentVolumeClaim
bound to the PersistentVolume you want to migrate, and then delete the
PersistentVolumeClaim. Avoid making any other changes to the
PersistentVolumeClaim, such as volume resizes, until after the migration is
complete.

Once that is done, you need to clear your PersistentVolume's `spec.claimRef.uid`
to ensure PersistentVolumeClaims can bind to it upon recreation:

```shell
kubectl scale --replicas=0 deployment cat-pictures-writer
kubectl delete pvc cat-pictures-pvc
kubectl patch pv cat-pictures-pv -p '{"spec":{"claimRef":{"uid":""}}}'
```

After that, replace the PersistentVolume's list of valid access modes to be
(only) `ReadWriteOncePod`:

```shell
kubectl patch pv cat-pictures-pv -p '{"spec":{"accessModes":["ReadWriteOncePod"]}}'
```

{{< note >}}
The `ReadWriteOncePod` access mode cannot be combined with other access modes.
Make sure `ReadWriteOncePod` is the only access mode on the PersistentVolume
when updating, otherwise the request will fail.
{{< /note >}}

Next you need to modify your PersistentVolumeClaim to set `ReadWriteOncePod` as
the only access mode. You should also set the PersistentVolumeClaim's
`spec.volumeName` to the name of your PersistentVolume to ensure it binds to
this specific PersistentVolume.

Once this is done, you can recreate your PersistentVolumeClaim and start up your
workloads:

```shell
# IMPORTANT: Make sure to edit your PVC in cat-pictures-pvc.yaml before applying. You need to:
# - Set ReadWriteOncePod as the only access mode
# - Set spec.volumeName to "cat-pictures-pv"

kubectl apply -f cat-pictures-pvc.yaml
kubectl apply -f cat-pictures-writer-deployment.yaml
```

Lastly you may edit your PersistentVolume's `spec.persistentVolumeReclaimPolicy`
and set to it back to `Delete` if you previously changed it.

```shell
kubectl patch pv cat-pictures-pv -p '{"spec":{"persistentVolumeReclaimPolicy":"Delete"}}'
```

## {{% heading "whatsnext" %}}

* Learn more about [PersistentVolumes](/docs/concepts/storage/persistent-volumes/).
* Learn more about [PersistentVolumeClaims](/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims).
* Learn more about [Configuring a Pod to Use a PersistentVolume for Storage](/docs/tasks/configure-pod-container/configure-persistent-volume-storage/)
