---
title: 將 PersistentVolume 的訪問模式更改爲 ReadWriteOncePod
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
本文演示瞭如何將現有 PersistentVolume 的訪問模式更改爲使用 `ReadWriteOncePod`。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

{{< note >}}
<!--
The `ReadWriteOncePod` access mode graduated to stable in the Kubernetes v1.29
release. If you are running a version of Kubernetes older than v1.29, you might
need to enable a feature gate. Check the documentation for your version of
Kubernetes.
-->
`ReadWriteOncePod` 訪問模式在 Kubernetes v1.29 版本中已進階至 Stable。
如果你運行的 Kubernetes 版本早於 v1.29，你可能需要啓用一個特性門控。
請查閱你所用 Kubernetes 版本的文檔。
{{< /note >}}

{{< note >}}
<!--
The `ReadWriteOncePod` access mode is only supported for
{{< glossary_tooltip text="CSI" term_id="csi" >}} volumes.
To use this volume access mode you will need to update the following
[CSI sidecars](https://kubernetes-csi.github.io/docs/sidecar-containers.html)
to these versions or greater:
-->
`ReadWriteOncePod` 訪問模式僅支持 {{< glossary_tooltip text="CSI" term_id="csi" >}} 卷。
要使用這種卷訪問模式，你需要更新以下
[CSI 邊車](https://kubernetes-csi.github.io/docs/sidecar-containers.html)至下述版本或更高版本：

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
## 我爲什麼要使用 `ReadWriteOncePod`？   {#why-should-i-use-readwriteoncepod}

在 Kubernetes v1.22 之前，`ReadWriteOnce`
訪問模式通常用於限制需要單個寫者存儲訪問模式的工作負載對 PersistentVolume 的訪問。
然而，這種訪問模式有一個限制：它要求只能從單個**節點**上訪問卷，但允許同一節點上的多個 Pod 同時讀寫同一個卷。
對於需要嚴格遵循單個寫者訪問模式以確保數據安全的應用，這種模式可能形成風險。

如果確保單個寫者訪問模式對於你的工作負載至關重要，請考慮將你的卷遷移到 `ReadWriteOncePod`。

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
## 遷移現有 PersistentVolume   {#migrating-existing-persistentvolumes}

如果你有一些 PersistentVolume，可以將它們遷移爲使用 `ReadWriteOncePod`。
系統僅支持從 `ReadWriteOnce` 遷移到 `ReadWriteOncePod`。

在此示例中，已經有一個 `ReadWriteOnce` 的 "cat-pictures-pvc" PersistentVolumeClaim
被綁定到了 "cat-pictures-pv" PersistentVolume，還有一個使用此
PersistentVolumeClaim 的 "cat-pictures-writer" Deployment。

{{< note >}}
<!--
If your storage plugin supports
[Dynamic provisioning](/docs/concepts/storage/dynamic-provisioning/),
the "cat-picutres-pv" will be created for you, but its name may differ. To get
your PersistentVolume's name run:
-->
如果你的存儲插件支持[動態製備](/zh-cn/docs/concepts/storage/dynamic-provisioning/)，
系統將爲你創建 "cat-pictures-pv"，但其名稱可能不同。
要獲取你的 PersistentVolume 的名稱，請運行以下命令：

```shell
kubectl get pvc cat-pictures-pvc -o jsonpath='{.spec.volumeName}'
```
{{< /note >}}

<!--
And you can view the PVC before you make changes. Either view the manifest
locally, or run `kubectl get pvc <name-of-pvc> -o yaml`. The output is similar
to:
-->
你可以在進行更改之前查看 PVC。你可以在本地查看清單，
或運行 `kubectl get pvc <PVC 名稱> -o yaml`。這條命令的輸出類似於：

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
以下是一個依賴於此 PersistentVolumeClaim 的 Deployment 示例：

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
第一步，你需要編輯 PersistentVolume 的 `spec.persistentVolumeReclaimPolicy`
並將其設置爲 `Retain`。此字段確保你在刪除相應的 PersistentVolumeClaim 時不會刪除 PersistentVolume：

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
接下來，你需要停止正在使用綁定到你要遷移的這個 PersistentVolume 上的
PersistentVolumeClaim 的所有工作負載，然後刪除該 PersistentVolumeClaim。
在遷移完成之前，不要對 PersistentVolumeClaim 進行任何其他更改，例如調整卷的大小。

完成後，你需要清除 PersistentVolume 的 `spec.claimRef.uid`
以確保在重新創建時 PersistentVolumeClaim 能夠綁定到它：

```shell
kubectl scale --replicas=0 deployment cat-pictures-writer
kubectl delete pvc cat-pictures-pvc
kubectl patch pv cat-pictures-pv -p '{"spec":{"claimRef":{"uid":""}}}'
```

<!--
After that, replace the PersistentVolume's list of valid access modes to be
(only) `ReadWriteOncePod`:
-->
之後，將 PersistentVolume 的有效訪問模式列表替換爲（僅）`ReadWriteOncePod`：

```shell
kubectl patch pv cat-pictures-pv -p '{"spec":{"accessModes":["ReadWriteOncePod"]}}'
```

{{< note >}}
<!--
The `ReadWriteOncePod` access mode cannot be combined with other access modes.
Make sure `ReadWriteOncePod` is the only access mode on the PersistentVolume
when updating, otherwise the request will fail.
-->
`ReadWriteOncePod` 訪問模式不能與其他訪問模式結合使用。
你要確保在更新時 `ReadWriteOncePod` 是 PersistentVolume 上的唯一訪問模式，否則請求將失敗。
{{< /note >}}

<!--
Next you need to modify your PersistentVolumeClaim to set `ReadWriteOncePod` as
the only access mode. You should also set the PersistentVolumeClaim's
`spec.volumeName` to the name of your PersistentVolume to ensure it binds to
this specific PersistentVolume.

Once this is done, you can recreate your PersistentVolumeClaim and start up your
workloads:
-->
接下來，你需要修改 PersistentVolumeClaim，將 `ReadWriteOncePod` 設置爲唯一的訪問模式。
你還應將 PersistentVolumeClaim 的 `spec.volumeName` 設置爲 PersistentVolume 的名稱，
以確保其綁定到特定的 PersistentVolume。

完成後，你可以重新創建你的 PersistentVolumeClaim 並啓動你的工作負載：

<!--
# IMPORTANT: Make sure to edit your PVC in cat-pictures-pvc.yaml before applying. You need to:
# - Set ReadWriteOncePod as the only access mode
# - Set spec.volumeName to "cat-pictures-pv"
-->
```shell
# 重要提示：在 apply 操作之前必須編輯在 cat-pictures-pvc.yaml 中的 PVC。你需要：
# - 將 ReadWriteOncePod 設置爲唯一的訪問模式
# - 將 spec.volumeName 設置爲 "cat-pictures-pv"

kubectl apply -f cat-pictures-pvc.yaml
kubectl apply -f cat-pictures-writer-deployment.yaml
```

<!--
Lastly you may edit your PersistentVolume's `spec.persistentVolumeReclaimPolicy`
and set to it back to `Delete` if you previously changed it.
-->
最後，你可以編輯 PersistentVolume 的 `spec.persistentVolumeReclaimPolicy` 並將其設置回 `Delete`，
如果你之前更改了這個字段的話。

```shell
kubectl patch pv cat-pictures-pv -p '{"spec":{"persistentVolumeReclaimPolicy":"Delete"}}'
```

## {{% heading "whatsnext" %}}

<!--
* Learn more about [PersistentVolumes](/docs/concepts/storage/persistent-volumes/).
* Learn more about [PersistentVolumeClaims](/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims).
* Learn more about [Configuring a Pod to Use a PersistentVolume for Storage](/docs/tasks/configure-pod-container/configure-persistent-volume-storage/)
-->
* 進一步瞭解 [PersistentVolume](/zh-cn/docs/concepts/storage/persistent-volumes/)。
* 進一步瞭解 [PersistentVolumeClaim](/zh-cn/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims)。
* 進一步瞭解[配置 Pod 以使用 PersistentVolume 作爲存儲](/zh-cn/docs/tasks/configure-pod-container/configure-persistent-volume-storage/)。
