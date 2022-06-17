---
title: 改變預設 StorageClass
content_type: task
---

<!-- overview -->
<!--
This page shows how to change the default Storage Class that is used to
provision volumes for PersistentVolumeClaims that have no special requirements.
-->
本文展示瞭如何改變預設的 Storage Class，它用於為沒有特殊需求的 PersistentVolumeClaims 配置 volumes。

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
## 為什麼要改變預設儲存類？

取決於安裝模式，你的 Kubernetes 叢集可能和一個被標記為預設的已有 StorageClass 一起部署。
這個預設的 StorageClass 以後將被用於動態的為沒有特定儲存類需求的 PersistentVolumeClaims 
配置儲存。更多細節請檢視
[PersistentVolumeClaim 文件](/zh-cn/docs/concepts/storage/persistent-volumes/#perspersistentvolumeclaims)。

<!--
The pre-installed default StorageClass may not fit well with your expected workload;
for example, it might provision storage that is too expensive. If this is the case,
you can either change the default StorageClass or disable it completely to avoid
dynamic provisioning of storage.
-->
預先安裝的預設 StorageClass 可能不能很好的適應你期望的工作負載；例如，它配置的儲存可能太過昂貴。
如果是這樣的話，你可以改變預設 StorageClass，或者完全禁用它以防止動態配置儲存。

<!--
Deleting the default StorageClass may not work, as it may be re-created
automatically by the addon manager running in your cluster. Please consult the docs for your installation
for details about addon manager and how to disable individual addons.
-->
刪除預設 StorageClass 可能行不通，因為它可能會被你叢集中的擴充套件管理器自動重建。
請查閱你的安裝文件中關於擴充套件管理器的細節，以及如何禁用單個擴充套件。


<!--
## Changing the default StorageClass
-->
## 改變預設 StorageClass

<!--
1. List the StorageClasses in your cluster: 
-->
1. 列出你的叢集中的 StorageClasses：

   ```shell
   kubectl get storageclass
   ```

   輸出類似這樣：

   ```bash
   NAME                 PROVISIONER               AGE
   standard (default)   kubernetes.io/gce-pd      1d
   gold                 kubernetes.io/gce-pd      1d
   ```

   預設 StorageClass 以 `(default)` 標記。

<!--
1. Mark the default StorageClass as non-default:
-->
2. 標記預設 StorageClass  非預設：
  
   <!--
   The default StorageClass has an annotation
   `storageclass.kubernetes.io/is-default-class` set to `true`. Any other value
   or absence of the annotation is interpreted as `false`.

   To mark a StorageClass as non-default, you need to change its value to `false`:
   -->
   預設 StorageClass 的註解 `storageclass.kubernetes.io/is-default-class` 設定為 `true`。
   註解的其它任意值或者預設值將被解釋為 `false`。

   要標記一個 StorageClass 為非預設的，你需要改變它的值為 `false`： 
   
   ```bash
   kubectl patch storageclass standard -p '{"metadata": {"annotations":{"storageclass.kubernetes.io/is-default-class":"false"}}}'
   ```

   <!--
   where `standard` is the name of your chosen StorageClass.
   -->
   這裡的 `standard` 是你選擇的 StorageClass 的名字。

<!--
1. Mark a StorageClass as default:
-->
3. 標記一個 StorageClass 為預設的：

   <!--
   Similar to the previous step, you need to add/set the annotation
   `storageclass.kubernetes.io/is-default-class=true`.
   -->
   和前面的步驟類似，你需要新增/設定註解 `storageclass.kubernetes.io/is-default-class=true`。

   ```bash
   kubectl patch storageclass <your-class-name> -p '{"metadata": {"annotations":{"storageclass.kubernetes.io/is-default-class":"true"}}}'
   ```

   <!--
   Please note that at most one StorageClass can be marked as default. If two
   or more of them are marked as default, a `PersistentVolumeClaim` without
   `storageClassName` explicitly specified cannot be created.
   -->
   請注意，最多隻能有一個 StorageClass 能夠被標記為預設。
   如果它們中有兩個或多個被標記為預設，Kubernetes 將忽略這個註解，
   也就是它將表現為沒有預設 StorageClass。

<!--
1. Verify that your chosen StorageClass is default:
-->
4. 驗證你選用的 StorageClass 為預設的：

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
* 進一步瞭解 [PersistentVolumes](/zh-cn/docs/concepts/storage/persistent-volumes/)

