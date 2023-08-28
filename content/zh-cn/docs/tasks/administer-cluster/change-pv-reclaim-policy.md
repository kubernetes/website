---
title: 更改 PersistentVolume 的回收策略
content_type: task
weight: 100
---

<!-- overview -->

<!--
This page shows how to change the reclaim policy of a Kubernetes
PersistentVolume.
-->
本文展示了如何更改 Kubernetes PersistentVolume 的回收策略。

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
## 为什么要更改 PersistentVolume 的回收策略

PersistentVolumes 可以有多种回收策略，包括 "Retain"、"Recycle" 和  "Delete"。
对于动态配置的 PersistentVolumes 来说，默认回收策略为 "Delete"。
这表示当用户删除对应的 PersistentVolumeClaim 时，动态配置的 volume 将被自动删除。
如果 volume 包含重要数据时，这种自动行为可能是不合适的。
那种情况下，更适合使用 "Retain" 策略。
使用 "Retain" 时，如果用户删除 PersistentVolumeClaim，对应的 PersistentVolume 不会被删除。
相反，它将变为 Released 状态，表示所有的数据可以被手动恢复。

<!--
## Changing the reclaim policy of a PersistentVolume
-->
## 更改 PersistentVolume 的回收策略

<!--
1. List the PersistentVolumes in your cluster:
-->
1. 列出你集群中的 PersistentVolumes

   ```shell
   kubectl get pv
   ```

   <!--
   The output is similar to this:
   -->
   输出类似于这样：

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
   这个列表同样包含了绑定到每个卷的 claims 名称，以便更容易的识别动态配置的卷。

<!--
1. Choose one of your PersistentVolumes and change its reclaim policy:
-->
2. 选择你的 PersistentVolumes 中的一个并更改它的回收策略：

   ```shell
   kubectl patch pv <your-pv-name> -p '{"spec":{"persistentVolumeReclaimPolicy":"Retain"}}'
   ```

   <!--
   where `<your-pv-name>` is the name of your chosen PersistentVolume.
   -->
   这里的 `<your-pv-name>` 是你选择的 PersistentVolume 的名字。

   <!--
   On Windows, you must _double_ quote any JSONPath template that contains spaces
   (not single quote as shown above for bash). This in turn means that you must
   use a single quote or escaped double quote around any literals in the template. For example:
   -->
   {{< note >}}
   在 Windows 系统上，你必须对包含空格的 JSONPath 模板加双引号（而不是像上面
   一样为 Bash 环境使用的单引号）。这也意味着你必须使用单引号或者转义的双引号
   来处理模板中的字面值。例如：

   ```cmd
   kubectl patch pv <your-pv-name> -p "{\"spec\":{\"persistentVolumeReclaimPolicy\":\"Retain\"}}"
   ```
   {{< /note >}}

<!--
1. Verify that your chosen PersistentVolume has the right policy:
-->
3. 验证你选择的 PersistentVolume 拥有正确的策略：

   ```shell
   kubectl get pv
   ```

   <!--
   The output is similar to this:
   -->
   输出类似于这样：

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
   在前面的输出中，你可以看到绑定到申领 `default/claim3` 的卷的回收策略为 `Retain`。
   当用户删除申领 `default/claim3` 时，它不会被自动删除。

## {{% heading "whatsnext" %}}

<!--
* Learn more about [PersistentVolumes](/docs/concepts/storage/persistent-volumes/).
* Learn more about [PersistentVolumeClaims](/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims).
-->
* 进一步了解 [PersistentVolumes](/zh-cn/docs/concepts/storage/persistent-volumes/)
* 进一步了解 [PersistentVolumeClaims](/zh-cn/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims)

### 参考 {#reference}

<!--
* {{< api-reference page="config-and-storage-resources/persistent-volume-v1" >}}
  * Pay attention to the `.spec.persistentVolumeReclaimPolicy`
    [field](/docs/reference/kubernetes-api/config-and-storage-resources/persistent-volume-v1/#PersistentVolumeSpec)
    of PersistentVolume.
* {{< api-reference page="config-and-storage-resources/persistent-volume-claim-v1" >}}
-->
* {{< api-reference page="config-and-storage-resources/persistent-volume-v1" >}}
  * 注意 PersistentVolume 的 `.spec.persistentVolumeReclaimPolicy`
    [字段](/zh-cn/docs/reference/kubernetes-api/config-and-storage-resources/persistent-volume-v1/#PersistentVolumeSpec)。
* {{< api-reference page="config-and-storage-resources/persistent-volume-claim-v1" >}}

