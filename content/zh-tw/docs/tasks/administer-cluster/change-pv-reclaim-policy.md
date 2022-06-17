---
title: 更改 PersistentVolume 的回收策略
content_type: task
---

<!-- overview -->

<!--
This page shows how to change the reclaim policy of a Kubernetes
PersistentVolume.
-->
本文展示瞭如何更改 Kubernetes PersistentVolume 的回收策略。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

<!--
## Why change reclaim policy of a PersistentVolume

PersistentVolumes can have various reclaim policies, including "Retain",
"Recycle", and "Delete". For dynamically provisioned PersistentVolumes,
the default reclaim policy is "Delete". This means that a dynamically provisioned
volume is automatically deleted when a user deletes the corresponding
PersistentVolumeClaim. This automatic behavior might be inappropriate if the volume
contains precious data. In that case, it is more appropriate to use the "Retain"
policy. With the "Retain" policy, if a user deletes a PersistentVolumeClaim,
the corresponding PersistentVolume will not be deleted. Instead, it is moved to the
Released phase, where all of its data can be manually recovered.
-->
## 為什麼要更改 PersistentVolume 的回收策略

PersistentVolumes 可以有多種回收策略，包括 "Retain"、"Recycle" 和  "Delete"。
對於動態配置的 PersistentVolumes 來說，預設回收策略為 "Delete"。
這表示當用戶刪除對應的 PersistentVolumeClaim 時，動態配置的 volume 將被自動刪除。
如果 volume 包含重要資料時，這種自動行為可能是不合適的。
那種情況下，更適合使用 "Retain" 策略。
使用 "Retain" 時，如果使用者刪除 PersistentVolumeClaim，對應的 PersistentVolume 不會被刪除。
相反，它將變為 Released 狀態，表示所有的資料可以被手動恢復。

<!--
## Changing the reclaim policy of a PersistentVolume
-->
## 更改 PersistentVolume 的回收策略

<!--
1. List the PersistentVolumes in your cluster:
-->
1. 列出你叢集中的 PersistentVolumes

   ```shell
   kubectl get pv
   ```

   <!--
   The output is similar to this:
   -->
   輸出類似於這樣：

   ```none
   NAME                                       CAPACITY   ACCESSMODES   RECLAIMPOLICY   STATUS    CLAIM             STORAGECLASS     REASON    AGE
   pvc-b6efd8da-b7b5-11e6-9d58-0ed433a7dd94   4Gi        RWO           Delete          Bound     default/claim1    manual                     10s
   pvc-b95650f8-b7b5-11e6-9d58-0ed433a7dd94   4Gi        RWO           Delete          Bound     default/claim2    manual                     6s
   pvc-bb3ca71d-b7b5-11e6-9d58-0ed433a7dd94   4Gi        RWO           Delete          Bound     default/claim3    manual                     3s
   ```

   <!--
   This list also includes the name of the claims that are bound to each volume
   for easier identification of dynamically provisioned volumes.
   -->
   這個列表同樣包含了繫結到每個卷的 claims 名稱，以便更容易的識別動態配置的卷。

<!--
1. Choose one of your PersistentVolumes and change its reclaim policy:
-->
2. 選擇你的 PersistentVolumes 中的一個並更改它的回收策略：

   ```shell
   kubectl patch pv <your-pv-name> -p '{"spec":{"persistentVolumeReclaimPolicy":"Retain"}}'
   ```

   <!--
   where `<your-pv-name>` is the name of your chosen PersistentVolume.
   -->
   這裡的 `<your-pv-name>` 是你選擇的 PersistentVolume 的名字。

   <!--
   On Windows, you must _double_ quote any JSONPath template that contains spaces
   (not single quote as shown above for bash). This in turn means that you must
   use a single quote or escaped double quote around any literals in the template. For example:
   -->
   {{< note >}}
   在 Windows 系統上，你必須對包含空格的 JSONPath 模板加雙引號（而不是像上面
   一樣為 Bash 環境使用的單引號）。這也意味著你必須使用單引號或者轉義的雙引號
   來處理模板中的字面值。例如：

   ```cmd
   kubectl patch pv <your-pv-name> -p "{\"spec\":{\"persistentVolumeReclaimPolicy\":\"Retain\"}}"
   ```
   {{< /note >}}

<!--
1. Verify that your chosen PersistentVolume has the right policy:
-->
3. 驗證你選擇的 PersistentVolume 擁有正確的策略：

   ```shell
   kubectl get pv
   ```

   <!--
   The output is similar to this:
   -->
   輸出類似於這樣：

   ```none
   NAME                                       CAPACITY   ACCESSMODES   RECLAIMPOLICY   STATUS    CLAIM             STORAGECLASS     REASON    AGE
   pvc-b6efd8da-b7b5-11e6-9d58-0ed433a7dd94   4Gi        RWO           Delete          Bound     default/claim1    manual                     40s
   pvc-b95650f8-b7b5-11e6-9d58-0ed433a7dd94   4Gi        RWO           Delete          Bound     default/claim2    manual                     36s
   pvc-bb3ca71d-b7b5-11e6-9d58-0ed433a7dd94   4Gi        RWO           Retain          Bound     default/claim3    manual                     33s
   ```

   <!--
   In the preceding output, you can see that the volume bound to claim
   `default/claim3` has reclaim policy `Retain`. It will not be automatically
   deleted when a user deletes claim `default/claim3`.
   -->
   在前面的輸出中，你可以看到繫結到申領 `default/claim3` 的卷的回收策略為 `Retain`。
   當用戶刪除申領 `default/claim3` 時，它不會被自動刪除。

## {{% heading "whatsnext" %}}

<!--
* Learn more about [PersistentVolumes](/docs/concepts/storage/persistent-volumes/).
* Learn more about [PersistentVolumeClaims](/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims).
-->
* 進一步瞭解 [PersistentVolumes](/zh-cn/docs/concepts/storage/persistent-volumes/)
* 進一步瞭解 [PersistentVolumeClaims](/zh-cn/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims)

### 參考 {#reference}

<!--
* {{< api-reference page="config-and-storage-resources/persistent-volume-v1" >}}
  * Pay attention to the `.spec.persistentVolumeReclaimPolicy`
    [field](/docs/reference/kubernetes-api/config-and-storage-resources/persistent-volume-v1/#PersistentVolumeSpec)
    of PersistentVolume.
* {{< api-reference page="config-and-storage-resources/persistent-volume-claim-v1" >}}
-->
* {{< api-reference page="config-and-storage-resources/persistent-volume-v1" >}}
  * 注意 PersistentVolume 的 `.spec.persistentVolumeReclaimPolicy`
    [欄位](/docs/reference/kubernetes-api/config-and-storage-resources/persistent-volume-v1/#PersistentVolumeSpec)。
* {{< api-reference page="config-and-storage-resources/persistent-volume-claim-v1" >}}

