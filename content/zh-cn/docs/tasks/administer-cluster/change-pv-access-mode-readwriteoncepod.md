---
title: 将 PersistentVolume 的访问模式更改为 ReadWriteOncePod
content_type: task
weight: 90
min-kubernetes-server-version: v1.22
---
<!--
title: Change the Access Mode of a PersistentVolume to ReadWriteOncePod
content_type: task
weight: 90
min-kubernetes-server-version: v1.22
-->

<!-- overview -->

<!--
This page shows how to change the access mode on an existing PersistentVolume to
use `ReadWriteOncePod`.
-->
本文演示了如何将现有 PersistentVolume 的访问模式更改为使用 `ReadWriteOncePod`。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

{{< note >}}
<!--
The `ReadWriteOncePod` access mode graduated to stable in the Kubernetes v1.29
release. If you are running a version of Kubernetes older than v1.29, you might
need to enable a feature gate. Check the documentation for your version of
Kubernetes.
-->
`ReadWriteOncePod` 访问模式在 Kubernetes v1.29 版本中已进阶至 Stable。
如果你运行的 Kubernetes 版本早于 v1.29，你可能需要启用一个特性门控。
请查阅你所用 Kubernetes 版本的文档。
{{< /note >}}

{{< note >}}
<!--
The `ReadWriteOncePod` access mode is only supported for
{{< glossary_tooltip text="CSI" term_id="csi" >}} volumes.
To use this volume access mode you will need to update the following
[CSI sidecars](https://kubernetes-csi.github.io/docs/sidecar-containers.html)
to these versions or greater:
-->
`ReadWriteOncePod` 访问模式仅支持 {{< glossary_tooltip text="CSI" term_id="csi" >}} 卷。
要使用这种卷访问模式，你需要更新以下
[CSI 边车](https://kubernetes-csi.github.io/docs/sidecar-containers.html)至下述版本或更高版本：

* [csi-provisioner:v3.0.0+](https://github.com/kubernetes-csi/external-provisioner/releases/tag/v3.0.0)
* [csi-attacher:v3.3.0+](https://github.com/kubernetes-csi/external-attacher/releases/tag/v3.3.0)
* [csi-resizer:v1.3.0+](https://github.com/kubernetes-csi/external-resizer/releases/tag/v1.3.0)
{{< /note >}}

<!--
## Why should I use `ReadWriteOncePod`?

Prior to Kubernetes v1.22, the `ReadWriteOnce` access mode was commonly used to
restrict PersistentVolume access for workloads that required single-writer
access to storage. However, this access mode had a limitation: it restricted
volume access to a single *node*, allowing multiple pods on the same node to
read from and write to the same volume simultaneously. This could pose a risk
for applications that demand strict single-writer access for data safety.

If ensuring single-writer access is critical for your workloads, consider
migrating your volumes to `ReadWriteOncePod`.
-->
## 我为什么要使用 `ReadWriteOncePod`？   {#why-should-i-use-readwriteoncepod}

在 Kubernetes v1.22 之前，`ReadWriteOnce`
访问模式通常用于限制需要单个写者存储访问模式的工作负载对 PersistentVolume 的访问。
然而，这种访问模式有一个限制：它要求只能从单个**节点**上访问卷，但允许同一节点上的多个 Pod 同时读写同一个卷。
对于需要严格遵循单个写者访问模式以确保数据安全的应用，这种模式可能形成风险。

如果确保单个写者访问模式对于你的工作负载至关重要，请考虑将你的卷迁移到 `ReadWriteOncePod`。

<!-- steps -->

<!--
## Migrating existing PersistentVolumes

If you have existing PersistentVolumes, they can be migrated to use
`ReadWriteOncePod`. Only migrations from `ReadWriteOnce` to `ReadWriteOncePod`
are supported.

In this example, there is already a `ReadWriteOnce` "cat-pictures-pvc"
PersistentVolumeClaim that is bound to a "cat-pictures-pv" PersistentVolume,
and a "cat-pictures-writer" Deployment that uses this PersistentVolumeClaim.
-->
## 迁移现有 PersistentVolume   {#migrating-existing-persistentvolumes}

如果你有一些 PersistentVolume，可以将它们迁移为使用 `ReadWriteOncePod`。
系统仅支持从 `ReadWriteOnce` 迁移到 `ReadWriteOncePod`。

在此示例中，已经有一个 `ReadWriteOnce` 的 "cat-pictures-pvc" PersistentVolumeClaim
被绑定到了 "cat-pictures-pv" PersistentVolume，还有一个使用此
PersistentVolumeClaim 的 "cat-pictures-writer" Deployment。

{{< note >}}
<!--
If your storage plugin supports
[Dynamic provisioning](/docs/concepts/storage/dynamic-provisioning/),
the "cat-picutres-pv" will be created for you, but its name may differ. To get
your PersistentVolume's name run:
-->
如果你的存储插件支持[动态制备](/zh-cn/docs/concepts/storage/dynamic-provisioning/)，
系统将为你创建 "cat-pictures-pv"，但其名称可能不同。
要获取你的 PersistentVolume 的名称，请运行以下命令：

```shell
kubectl get pvc cat-pictures-pvc -o jsonpath='{.spec.volumeName}'
```
{{< /note >}}

<!--
And you can view the PVC before you make changes. Either view the manifest
locally, or run `kubectl get pvc <name-of-pvc> -o yaml`. The output is similar
to:
-->
你可以在进行更改之前查看 PVC。你可以在本地查看清单，
或运行 `kubectl get pvc <PVC 名称> -o yaml`。这条命令的输出类似于：

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

<!--
Here's an example Deployment that relies on that PersistentVolumeClaim:
-->
以下是一个依赖于此 PersistentVolumeClaim 的 Deployment 示例：

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

<!--
As a first step, you need to edit your PersistentVolume's
`spec.persistentVolumeReclaimPolicy` and set it to `Retain`. This ensures your
PersistentVolume will not be deleted when you delete the corresponding
PersistentVolumeClaim:
-->
第一步，你需要编辑 PersistentVolume 的 `spec.persistentVolumeReclaimPolicy`
并将其设置为 `Retain`。此字段确保你在删除相应的 PersistentVolumeClaim 时不会删除 PersistentVolume：

```shell
kubectl patch pv cat-pictures-pv -p '{"spec":{"persistentVolumeReclaimPolicy":"Retain"}}'
```

<!--
Next you need to stop any workloads that are using the PersistentVolumeClaim
bound to the PersistentVolume you want to migrate, and then delete the
PersistentVolumeClaim. Avoid making any other changes to the
PersistentVolumeClaim, such as volume resizes, until after the migration is
complete.

Once that is done, you need to clear your PersistentVolume's `spec.claimRef.uid`
to ensure PersistentVolumeClaims can bind to it upon recreation:
-->
接下来，你需要停止正在使用绑定到你要迁移的这个 PersistentVolume 上的
PersistentVolumeClaim 的所有工作负载，然后删除该 PersistentVolumeClaim。
在迁移完成之前，不要对 PersistentVolumeClaim 进行任何其他更改，例如调整卷的大小。

完成后，你需要清除 PersistentVolume 的 `spec.claimRef.uid`
以确保在重新创建时 PersistentVolumeClaim 能够绑定到它：

```shell
kubectl scale --replicas=0 deployment cat-pictures-writer
kubectl delete pvc cat-pictures-pvc
kubectl patch pv cat-pictures-pv -p '{"spec":{"claimRef":{"uid":""}}}'
```

<!--
After that, replace the PersistentVolume's list of valid access modes to be
(only) `ReadWriteOncePod`:
-->
之后，将 PersistentVolume 的有效访问模式列表替换为（仅）`ReadWriteOncePod`：

```shell
kubectl patch pv cat-pictures-pv -p '{"spec":{"accessModes":["ReadWriteOncePod"]}}'
```

{{< note >}}
<!--
The `ReadWriteOncePod` access mode cannot be combined with other access modes.
Make sure `ReadWriteOncePod` is the only access mode on the PersistentVolume
when updating, otherwise the request will fail.
-->
`ReadWriteOncePod` 访问模式不能与其他访问模式结合使用。
你要确保在更新时 `ReadWriteOncePod` 是 PersistentVolume 上的唯一访问模式，否则请求将失败。
{{< /note >}}

<!--
Next you need to modify your PersistentVolumeClaim to set `ReadWriteOncePod` as
the only access mode. You should also set the PersistentVolumeClaim's
`spec.volumeName` to the name of your PersistentVolume to ensure it binds to
this specific PersistentVolume.

Once this is done, you can recreate your PersistentVolumeClaim and start up your
workloads:
-->
接下来，你需要修改 PersistentVolumeClaim，将 `ReadWriteOncePod` 设置为唯一的访问模式。
你还应将 PersistentVolumeClaim 的 `spec.volumeName` 设置为 PersistentVolume 的名称，
以确保其绑定到特定的 PersistentVolume。

完成后，你可以重新创建你的 PersistentVolumeClaim 并启动你的工作负载：

<!--
# IMPORTANT: Make sure to edit your PVC in cat-pictures-pvc.yaml before applying. You need to:
# - Set ReadWriteOncePod as the only access mode
# - Set spec.volumeName to "cat-pictures-pv"
-->
```shell
# 重要提示：在 apply 操作之前必须编辑在 cat-pictures-pvc.yaml 中的 PVC。你需要：
# - 将 ReadWriteOncePod 设置为唯一的访问模式
# - 将 spec.volumeName 设置为 "cat-pictures-pv"

kubectl apply -f cat-pictures-pvc.yaml
kubectl apply -f cat-pictures-writer-deployment.yaml
```

<!--
Lastly you may edit your PersistentVolume's `spec.persistentVolumeReclaimPolicy`
and set to it back to `Delete` if you previously changed it.
-->
最后，你可以编辑 PersistentVolume 的 `spec.persistentVolumeReclaimPolicy` 并将其设置回 `Delete`，
如果你之前更改了这个字段的话。

```shell
kubectl patch pv cat-pictures-pv -p '{"spec":{"persistentVolumeReclaimPolicy":"Delete"}}'
```

## {{% heading "whatsnext" %}}

<!--
* Learn more about [PersistentVolumes](/docs/concepts/storage/persistent-volumes/).
* Learn more about [PersistentVolumeClaims](/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims).
* Learn more about [Configuring a Pod to Use a PersistentVolume for Storage](/docs/tasks/configure-pod-container/configure-persistent-volume-storage/)
-->
* 进一步了解 [PersistentVolume](/zh-cn/docs/concepts/storage/persistent-volumes/)。
* 进一步了解 [PersistentVolumeClaim](/zh-cn/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims)。
* 进一步了解[配置 Pod 以使用 PersistentVolume 作为存储](/zh-cn/docs/tasks/configure-pod-container/configure-persistent-volume-storage/)。
