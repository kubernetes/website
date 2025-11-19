---
title: 改變默認 StorageClass
content_type: task
weight: 90
---

<!-- overview -->
<!--
This page shows how to change the default Storage Class that is used to
provision volumes for PersistentVolumeClaims that have no special requirements.
-->
本文展示瞭如何改變默認的 Storage Class，它用於爲沒有特殊需求的 PersistentVolumeClaims 設定 volumes。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

<!--
## Why change the default storage class?

Depending on the installation method, your Kubernetes cluster may be deployed with
an existing StorageClass that is marked as default. This default StorageClass
is then used to dynamically provision storage for PersistentVolumeClaims
that do not require any specific storage class. See
[PersistentVolumeClaim documentation](/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims)
for details.
-->
## 爲什麼要改變默認存儲類？

取決於安裝模式，你的 Kubernetes 叢集可能和一個被標記爲默認的已有 StorageClass 一起部署。
這個默認的 StorageClass 以後將被用於動態的爲沒有特定存儲類需求的 PersistentVolumeClaims 
設定存儲。更多細節請查看
[PersistentVolumeClaim 文檔](/zh-cn/docs/concepts/storage/persistent-volumes/#perspersistentvolumeclaims)。

<!--
The pre-installed default StorageClass may not fit well with your expected workload;
for example, it might provision storage that is too expensive. If this is the case,
you can either change the default StorageClass or disable it completely to avoid
dynamic provisioning of storage.
-->
預先安裝的默認 StorageClass 可能不能很好的適應你期望的工作負載；例如，它設定的存儲可能太過昂貴。
如果是這樣的話，你可以改變默認 StorageClass，或者完全禁用它以防止動態設定存儲。

<!--
Deleting the default StorageClass may not work, as it may be re-created
automatically by the addon manager running in your cluster. Please consult the docs for your installation
for details about addon manager and how to disable individual addons.
-->
刪除默認 StorageClass 可能行不通，因爲它可能會被你叢集中的擴展管理器自動重建。
請查閱你的安裝文檔中關於擴展管理器的細節，以及如何禁用單個擴展。


<!--
## Changing the default StorageClass
-->
## 改變默認 StorageClass

<!--
1. List the StorageClasses in your cluster:
-->
1. 列出你的叢集中的 StorageClass：

   ```shell
   kubectl get storageclass
   ```

   <!--
   The output is similar to this:
   -->
   輸出類似這樣：

   ```bash
   NAME                 PROVISIONER               AGE
   standard (default)   kubernetes.io/gce-pd      1d
   gold                 kubernetes.io/gce-pd      1d
   ```

   <!--
   The default StorageClass is marked by `(default)`.
   -->
   默認 StorageClass 以 `(default)` 標記。

<!--
1. Mark the default StorageClass as non-default:
-->
2. 標記默認 StorageClass  非默認：
  
   <!--
   The default StorageClass has an annotation
   `storageclass.kubernetes.io/is-default-class` set to `true`. Any other value
   or absence of the annotation is interpreted as `false`.

   To mark a StorageClass as non-default, you need to change its value to `false`:
   -->
   默認 StorageClass 的註解 `storageclass.kubernetes.io/is-default-class` 設置爲 `true`。
   註解的其它任意值或者缺省值將被解釋爲 `false`。

   要標記一個 StorageClass 爲非默認的，你需要改變它的值爲 `false`： 
   
   ```bash
   kubectl patch storageclass standard -p '{"metadata": {"annotations":{"storageclass.kubernetes.io/is-default-class":"false"}}}'
   ```

   <!--
   where `standard` is the name of your chosen StorageClass.
   -->
   這裏的 `standard` 是你選擇的 StorageClass 的名字。

<!--
1. Mark a StorageClass as default:
-->
3. 標記一個 StorageClass 爲默認的：

   <!--
   Similar to the previous step, you need to add/set the annotation
   `storageclass.kubernetes.io/is-default-class=true`.
   -->
   和前面的步驟類似，你需要添加/設置註解 `storageclass.kubernetes.io/is-default-class=true`。

   ```bash
   kubectl patch storageclass <your-class-name> -p '{"metadata": {"annotations":{"storageclass.kubernetes.io/is-default-class":"true"}}}'
   ```

   <!--
   Please note you can have multiple `StorageClass` marked as default. If more 
   than one `StorageClass` is marked as default, a `PersistentVolumeClaim` without 
   an explicitly defined `storageClassName` will be created using the most recently 
   created default `StorageClass`.
   When a `PersistentVolumeClaim` is created with a specified `volumeName`, it remains 
   in a pending state if the static volume's `storageClassName` does not match the 
   `StorageClass` on the `PersistentVolumeClaim`.
   -->
   請注意，你可以將多個 `StorageClass` 標記爲默認值。
   如果存在多個被標記爲默認的 `StorageClass`，對於未明確指定 `storageClassName`
   的 `PersistentVolumeClaim`，將使用最近創建的默認 `StorageClass` 進行創建。
   當帶有指定 `volumeName` 的 `PersistentVolumeClaim` 被創建時，如果靜態卷的
   `storageClassName` 與 `PersistentVolumeClaim` 上的 `StorageClass` 不匹配，
   則該 `PersistentVolumeClaim` 將保持在待處理狀態。

<!--
1. Verify that your chosen StorageClass is default:
-->
4. 驗證你選用的 StorageClass 爲默認的：

   ```bash
   kubectl get storageclass
   ```

   <!--
   The output is similar to this:
   -->
   輸出類似這樣：

   ```
   NAME             PROVISIONER               AGE
   standard         kubernetes.io/gce-pd      1d
   gold (default)   kubernetes.io/gce-pd      1d
   ```

## {{% heading "whatsnext" %}}

<!--
* Learn more about [PersistentVolumes](/docs/concepts/storage/persistent-volumes/).
-->
* 進一步瞭解 [PersistentVolume](/zh-cn/docs/concepts/storage/persistent-volumes/)。
