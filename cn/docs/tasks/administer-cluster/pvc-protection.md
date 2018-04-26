---
approvers:
- msau42
- jsafrane
title: Persistent Volume Claim 保护
cn-approvers:
- lichuqiang
---
<!--
---
approvers:
- msau42
- jsafrane
title: Persistent Volume Claim Protection
---
-->

{% capture overview %}
{% assign for_k8s_version="v1.9" %}{% include feature-state-alpha.md %}

<!--
As of Kubernetes 1.9, persistent volume claims (PVCs) that are in active use by a pod can be protected from pre-mature removal.
-->
从 Kubernetes 1.9 版本起，用户可以对正在被 pod 使用的 persistent volume claim（PVC）进行保护，
防止其在使用结束前被移除。


{% endcapture %}

{% capture prerequisites %}

<!--
- A v1.9 or higher Kubernetes must be installed.
- As PVC Protection is a Kubernetes v1.9 alpha feature it must be enabled:
1. [Admission controller](/docs/admin/admission-controllers/) must be started with the [PVC Protection plugin](/docs/admin/admission-controllers/#persistent-volume-claim-protection-alpha).
2. All Kubernetes components must be started with the `PVCProtection` alpha features enabled.
-->
- 必须安装 1.9 或更高版本的 Kubernetes。
- 由于 PVC 保护是 Kubernetes 1.9 版本的 alpha 特性，必须（按下面的方式）启用它：
1. [准入控制器](/docs/admin/admission-controllers/) 启动时须启用 [PVC 保护插件](/docs/admin/admission-controllers/#persistent-volume-claim-protection-alpha)。
2. 所有的 Kubernetes 组件在启动时都须启用 `PVCProtection` alpha 特性。

{% endcapture %}

{% capture steps %}

<!--
## PVC Protection Verification

The example below uses a GCE PD `StorageClass`, however, similar steps can be performed for any volume type.
-->
## PVC 保护验证

下面的示例使用了 GCE PD `StorageClass`，然而，您可以按照类似的步骤对任何 volume 类型执行操作：

<!--
Create a `StorageClass` for convenient storage provisioning:
-->
为方便存储供应（provisioning），创建一个 `StorageClass`：
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
There are two scenarios: a PVC deleted by a user is either in active use or not in active use by a pod.
-->
存在两种场景： 用户所删除的 PVC 正在被 pod 使用，或没有在被 pod 使用。

<!--
### Scenario 1: The PVC is not in active use by a pod

- Create a PVC:
-->
### 场景 1：PVC 没有在被 pod 使用

- 创建一个 PVC：

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
- 检查 PVC，确认其设置了 `kubernetes.io/pvc-protection` 终结器（finalizer）：
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

<!--
- Delete the PVC and check that the PVC (not in active use by a pod) was removed successfully.
-->
- 删除 PVC，并确认 PVC（没有在被 pod 使用）被成功移除。

<!--
### Scenario 2: The PVC is in active use by a pod
-->
### 场景 2：PVC 在被 pod 使用

<!--
- Again, create the same PVC.
- Create a pod that uses the PVC:
-->
- 再次创建同样的 PVC.
- 创建一个使用该 PVC 的 pod：

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
- 等待 pod 状态变为 `Running`，也就是 PVC 变成被使用的状态。
- 删除当前正在被 pod 使用的 PVC，并验证该 PVC 没有被移除，但其状态变为 `Terminating`：


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
- 等待 pod 状态变为 `Terminated`（删除 pod 或者等到它结束），然后检查，确认 PVC 被移除。


{% endcapture %}

{% capture discussion %}


{% endcapture %}

{% include templates/task.md %}
