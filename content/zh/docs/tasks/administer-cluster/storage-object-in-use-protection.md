<!--
---
reviewers:
- msau42
- jsafrane
title: Storage Object in Use Protection
content_template: templates/task
---
-->

---
reviewers:
- msau42
- jsafrane

title: 保护使用的存储对象
content_template: templates/task
---

{{% capture overview %}}

<!--
Persistent volume claims (PVCs) that are in active use by a pod and persistent volumes (PVs) that are bound to PVCs can be protected from premature removal.
-->

Kubernetes 可以对被 Pod 持续使用的永久卷声明（PVCs）和绑定到 PVC 的永久卷（PVs）进行保护，以避免它们被用户不小心删除掉。

{{% /capture %}}

{{% capture prerequisites %}}

<!--
The Storage Object in Use Protection feature is enabled in one of the below Kubernetes versions:
-->

在下面列出的 Kubernetes 版本中，激活了在用存储对象的保护特性：

{{< feature-state for_k8s_version="v1.10" state="beta" >}}


{{< feature-state for_k8s_version="v1.11" state="stable" >}}

{{% /capture %}}

{{% capture steps %}}

 <!--
## Storage Object in Use Protection feature used for PVC Protection

The example below uses a GCE PD `StorageClass`, however, similar steps can be performed for any volume type.

Create a `StorageClass` for convenient storage provisioning:
-->

## 在用存储对象的保护功能用于 PVC 的保护

下面的例子中使用了 GCE PD `StorageClass`, 但是类似的步骤可以在任意的卷类型上执行。

创建 `StorageClass` 以便提供存储：

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: slow
provisioner: kubernetes.io/gce-pd
parameters:
  type: pd-standard
```

<!--
Verification scenarios follow below.
-->

下面列出了验证场景。

<!--
### Scenario 1: The PVC is not in active use by a pod
-->

### 场景1: PVC 没有被 Pod 使用

<!--
- Create a PVC:
-->

- 创建 PVC

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

<!--
- Check that the PVC has the finalizer `kubernetes.io/pvc-protection` set:
-->

- 检查 PVC 设置了终结器 `kubernetes.io/pvc-protection`：

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

<!--
- Delete the PVC and check that the PVC (not in active use by a pod) was removed successfully.
-->

- 删除 PVC 并检查 PVC （当前未被某 Pod 使用）被成功删除。

<!--
### Scenario 2: The PVC is in active use by a pod

- Again, create the same PVC.
- Create a pod that uses the PVC:
-->

### 场景 2: PVC 被 Pod 使用

- 再来一次，创建相同的 PVC。
- 创建一个 Pod ，并使用上面创建的 PVC：

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
<!--
- Wait until the pod status is `Running`, i.e. the PVC becomes in active use.
- Delete the PVC that is now in active use by a pod and verify that the PVC is not removed but its status is `Terminating`:
-->

- 等到 Pod 的状态为 `Running`，即 PVC 变为在用状态。
- 删除被 Pod 使用的 PVC 并确认其没有被删除成功，但它的状态为 `Terminating`:

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

<!--
-  Wait until the pod status is `Terminated` (either delete the pod or wait until it finishes). Afterwards, check that the PVC is removed.
-->

- 等到 Pod 的状态变为 `Terminated` （删除 Pod 或者等到它结束），紧接着确认 PVC 被删除掉了。

<!--
### Scenario 3: A pod starts using a PVC that is in Terminating state

- Again, create the same PVC.
- Create a first pod that uses the PVC:
-->

### 场景 3: Pod 开始使用正在停止状态（Terminating）的 PVC

- 再次创建相同的 PVC。
- 创建使用这个 PVC 的第一个 Pod：

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

<!--
- Wait until the pod status is `Running`, i.e. the PVC becomes in active use.
- Delete the PVC that is now in active use by a pod and verify that the PVC is not removed but its status is `Terminating`:
-->

- 等到 Pod 状态为 `Running`，即 PVC 变为使用状态。
- 删除被 Pod 使用的 PVC 并确认其没有被删除成功，但它的状态为 `Terminating`:

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

<!--
- Create a second pod that uses the same PVC:
-->

- 创建使用这个 PVC 的第二个 Pod：

```yaml
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

<!--
- Verify that the scheduling of the second pod fails with the below warning:
-->

- 检查第二个 Pod 因为下面的警告而导致调度失败：

```shell
Warning  FailedScheduling  18s (x4 over 21s)  default-scheduler persistentvolumeclaim "slzc" is being deleted
```

<!--
- Wait until the pod status of both pods is `Terminated` or `Completed` (either delete the pods or wait until they finish). Afterwards, check that the PVC is removed.
-->

- 等到两个 Pod 的状态为 `Terminated` 或者 `Completed`（删除 Pod 或者等待它们结束），紧接着检查 PVC 被删除掉了。

<!--
## Storage Object in Use Protection feature used for PV Protection

The example below uses a `HostPath` PV.

Verification scenarios follow below.

### Scenario 1: The PV is not bound to a PVC

- Create a PV:
-->

## 使用在用存储对象保护的功能来保护 PV

下面的示例使用了 `HostPath` PV。

下面列出了验证场景。

### 场景 1: PV 没有绑定到 PVC

- 创建 PV:

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

<!--
- Check that the PV has the finalizer `kubernetes.io/pv-protection` set:
-->

- 检查 PV 设置了终结器 `kubernetes.io/pv-protection`：

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

<!--
- Delete the PV and check that the PV (not bound to a PVC) is removed successfully.

### Scenario 2: The PV is bound to a PVC

- Again, create the same PV.

- Create a PVC
-->

- 删除 PV 并检查该 PV（没有绑定到 PVC ）被成功删除。

### 场景 2: PV 绑定了 PVC。

- 再次创建相同的 PV。

- 创建一个 PVC：

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

<!--
- Wait until the PV and PVC are bound to each other.
- Delete the PV and verify that the PV is not removed but its status is `Terminating`:
-->

- 等到 PV 和 PVC 相互绑定。
- 删除 PV 并确认该 PV 没有被删除掉，但它的状态是 `Terminating`：

```shell
NAME             CAPACITY     ACCESS MODES   RECLAIM POLICY   STATUS        CLAIM                   STORAGECLASS   REASON    AGE
task-pv-volume   1Gi          RWO            Delete           Terminating   default/task-pv-claim   standard                 59s

```

<!--
-  Delete the PVC and verify that the PV is removed too.
-->

- 删除 PVC 并确认 PV 也一同被删除了。

```shell
kubectl delete pvc task-pv-claim
persistentvolumeclaim "task-pv-claim" deleted
$ kubectl get pvc
No resources found.
$ kubectl get pv
No resources found.
```

{{% /capture %}}

{{% capture discussion %}}


{{% /capture %}}
