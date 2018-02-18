---
reviewers:
- msau42
- jsafrane
title: Persistent Volume Claim Protection
---

{% capture overview %}
{% assign for_k8s_version="v1.9" %}{% include feature-state-alpha.md %}

As of Kubernetes 1.9, persistent volume claims (PVCs) that are in active use by a pod can be protected from pre-mature removal.

{% endcapture %}

{% capture prerequisites %}

- A v1.9 or higher Kubernetes must be installed.
- As PVC Protection is a Kubernetes v1.9 alpha feature it must be enabled:
1. [Admission controller](/docs/admin/admission-controllers/) must be started with the [PVC Protection plugin](/docs/admin/admission-controllers/#persistent-volume-claim-protection-alpha).
2. All Kubernetes components must be started with the `PVCProtection` alpha features enabled.

{% endcapture %}

{% capture steps %}

## PVC Protection Verification

The example below uses a GCE PD `StorageClass`, however, similar steps can be performed for any volume type.

Create a `StorageClass` for convenient storage provisioning:
```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: slow
provisioner: kubernetes.io/gce-pd
parameters:
  type: pd-standard
```

There are two scenarios: a PVC deleted by a user is either in active use or not in active use by a pod.

### Scenario 1: The PVC is not in active use by a pod

- Create a PVC:

```yaml
kind: PersistentVolumeClaim
apiVersion: v1
metadata:
  name: slzc
spec:
  accessModes:
    - ReadWriteOnce
  storageClassName: slow
  resources:
    requests:
      storage: 3.7Gi
```

- Check that the PVC has the finalizer `kubernetes.io/pvc-protection` set:
```shell
$ kubectl describe pvc slzc
Name:          slzc
Namespace:     default
StorageClass:  slow
Status:        Bound
Volume:        pvc-bee8c30a-d6a3-11e7-9af0-42010a800002
Labels:        <none>
Annotations:   pv.kubernetes.io/bind-completed=yes
               pv.kubernetes.io/bound-by-controller=yes
               volume.beta.kubernetes.io/storage-provisioner=kubernetes.io/gce-pd
Finalizers:    [kubernetes.io/pvc-protection]
Capacity:      4Gi
Access Modes:  RWO
Events:
  Type    Reason                 Age   From                         Message
  ----    ------                 ----  ----                         -------
  Normal  ProvisioningSucceeded  2m    persistentvolume-controller  Successfully provisioned volume pvc-bee8c30a-d6a3-11e7-9af0-42010a800002 using kubernetes.io/gce-pd
```

- Delete the PVC and check that the PVC (not in active use by a pod) was removed successfully.

### Scenario 2: The PVC is in active use by a pod

- Again, create the same PVC.
- Create a pod that uses the PVC:

```yaml
kind: Pod
apiVersion: v1
metadata:
  name: app1
spec:
  containers:
  - name: test-pod
    image: k8s.gcr.io/busybox:1.24
    command:
      - "/bin/sh"
    args:
      - "-c"
      - "date > /mnt/app1.txt; sleep 60 && exit 0 || exit 1"
    volumeMounts:
      - name: path-pvc
        mountPath: "/mnt"
  restartPolicy: "Never"
  volumes:
    - name: path-pvc
      persistentVolumeClaim:
        claimName: slzc
```

- Wait until the pod status is `Running`, i.e. the PVC becomes in active use.
- Delete the PVC that is now in active use by a pod and verify that the PVC is not removed but its status is `Terminating`:

```shell
Name:          slzc
Namespace:     default
StorageClass:  slow
Status:        Terminating (since Fri, 01 Dec 2017 14:47:55 +0000)
Volume:        pvc-803a1f4d-d6a6-11e7-9af0-42010a800002
Labels:        <none>
Annotations:   pv.kubernetes.io/bind-completed=yes
               pv.kubernetes.io/bound-by-controller=yes
               volume.beta.kubernetes.io/storage-provisioner=kubernetes.io/gce-pd
Finalizers:    [kubernetes.io/pvc-protection]
Capacity:      4Gi
Access Modes:  RWO
Events:
  Type    Reason                 Age   From                         Message
  ----    ------                 ----  ----                         -------
  Normal  ProvisioningSucceeded  52s   persistentvolume-controller  Successfully provisioned volume pvc-803a1f4d-d6a6-11e7-9af0-42010a800002 using kubernetes.io/gce-pd
```
-  Wait until the pod status is `Terminated` (either delete the pod or wait until it finishes). Afterwards, check that the PVC is removed.


{% endcapture %}

{% capture discussion %}


{% endcapture %}

{% include templates/task.md %}
