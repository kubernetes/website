---
approvers:
- msau42
- jsafrane
title: Storage Object in Use Protection
---

{% capture overview %}
{% assign for_k8s_version="v1.10" %}{% include feature-state-beta.md %}

Persistent volume claims (PVCs) that are in active use by a pod and persistent volumes (PVs) that are bound to PVCs can be protected from pre-mature removal.

{% endcapture %}

{% capture prerequisites %}

- The Storage Object in Use Protection feature is enabled in a version of Kubernetes in which it is supported.

{% endcapture %}

{% capture steps %}

## Storage Object in Use Protection feature used for PVC Protection

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

Verification scenarios follow below.

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
kubectl describe pvc slzc
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

### Scenario 3: A pod starts using a PVC that is in Terminating state

- Again, create the same PVC.
- Create a first pod that uses the PVC:

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
      - "date > /mnt/app1.txt; sleep 600 && exit 0 || exit 1"
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

- Create a second pod that uses the same PVC:

```
kind: Pod
apiVersion: v1
metadata:
  name: app2
spec:
  containers:
  - name: test-pod
    image: gcr.io/google_containers/busybox:1.24
    command:
      - "/bin/sh"
    args:
      - "-c"
      - "date > /mnt/app1.txt; sleep 600 && exit 0 || exit 1"
    volumeMounts:
      - name: path-pvc
        mountPath: "/mnt"
  restartPolicy: "Never"
  volumes:
    - name: path-pvc
      persistentVolumeClaim:
        claimName: slzc
```

- Verify that the scheduling of the second pod fails with the below warning:

```
Warning  FailedScheduling  18s (x4 over 21s)  default-scheduler  persistentvolumeclaim "slzc" is being deleted
```

-  Wait until the pod status of both pods is `Terminated` or `Completed` (either delete the pods or wait until they finish). Afterwards, check that the PVC is removed.

## Storage Object in Use Protection feature used for PV Protection

The example below uses a `HostPath` PV.

Verification scenarios follow below.

### Scenario 1: The PV is not bound to a PVC

- Create a PV:

```yaml
kind: PersistentVolume
apiVersion: v1
metadata:
  name: task-pv-volume
  labels:
    type: local
spec:
  capacity:
    storage: 1Gi
  accessModes:
    - ReadWriteOnce
  persistentVolumeReclaimPolicy: Delete
  storageClassName: standard
  hostPath:
    path: "/tmp/data"
```

- Check that the PV has the finalizer `kubernetes.io/pv-protection` set:

```shell
Name:            task-pv-volume
Labels:          type=local
Annotations:     pv.kubernetes.io/bound-by-controller=yes
Finalizers:      [kubernetes.io/pv-protection]
StorageClass:    standard
Status:          Terminating (lasts 1m)
Claim:           default/task-pv-claim
Reclaim Policy:  Delete
Access Modes:    RWO
Capacity:        1Gi
Message:         
Source:
    Type:          HostPath (bare host directory volume)
    Path:          /tmp/data
    HostPathType:  
Events:            <none>
```

- Delete the PV and check that the PV (not bound to a PVC) is removed successfully.

### Scenario 2: The PV is bound to a PVC

- Again, create the same PV.

- Create a PVC

```yaml
kind: PersistentVolumeClaim
apiVersion: v1
metadata:
  name: task-pv-claim
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi
```

- Wait until the PV and PVC are bound to each other.
- Delete the PV and verify that the PV is not removed but its status is `Terminating`:

```shell
NAME             CAPACITY     ACCESS MODES   RECLAIM POLICY   STATUS        CLAIM                   STORAGECLASS   REASON    AGE
task-pv-volume   1Gi          RWO            Delete           Terminating   default/task-pv-claim   standard                 59s

```
-  Delete the PVC and verify that the PV is removed too.

```shell
kubectl delete pvc task-pv-claim
persistentvolumeclaim "task-pv-claim" deleted
$ kubectl get pvc
No resources found.
$ kubectl get pv
No resources found.
```

{% endcapture %}

{% capture discussion %}


{% endcapture %}

{% include templates/task.md %}
