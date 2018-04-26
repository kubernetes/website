---
cn-approvers:
- xiaosuiba
cn-reviewers:
- brucehex
title: 更改 PersistentVolume 的回收策略
---

{% capture overview %}
<!--
This page shows how to change the reclaim policy of a Kubernetes
PersistentVolume.
-->
本文展示了如何更改 Kubernetes PersistentVolume 的回收策略。
{% endcapture %}

{% capture prerequisites %}

{% include task-tutorial-prereqs.md %}

{% endcapture %}

{% capture steps %}

<!--
## Why change reclaim policy of a PersistentVolume
-->
## 为什么要更改 PersistentVolume 的回收策略

<!--
`PersistentVolumes` can have various reclaim policies, including "Retain",
"Recycle", and "Delete". For dynamically provisioned `PersistentVolumes`,
the default reclaim policy is "Delete". This means that a dynamically provisioned
volume is automatically deleted when a user deletes the corresponding
`PeristentVolumeClaim`. This automatic behavior might be inappropriate if the volume
contains precious data. In that case, it is more appropriate to use the "Retain"
policy. With the "Retain" policy, if a user deletes a `PersistentVolumeClaim`,
the corresponding `PersistentVolume` is not be deleted. Instead, it is moved to the
`Released` phase, where all of its data can be manually recovered.
-->
`PersistentVolumes` 可以有多种回收策略，包括 "Retain"、"Recycle" 和  "Delete"。对于动态配置的 `PersistentVolumes` 来说，默认回收策略为 "Delete"。这表示当用户删除对应的 `PeristentVolumeClaim` 时，动态配置的 volume 将被自动删除。如果 volume 包含重要数据时，这种自动行为可能是不合适的。那种情况下，更适合使用 "Retain" 策略。使用 "Retain" 时，如果用户删除 `PersistentVolumeClaim`，对应的 `PersistentVolume` 不会被删除。相反，它将变为 `Released` 状态，表示所有的数据可以被手动恢复。

<!--
## Changing the reclaim policy of a PersistentVolume
-->
## 更改 PersistentVolume 的回收策略

<!--
1. List the PersistentVolumes in your cluster:

       kubectl get pv

    The output is similar to this:
-->
1. 列出你集群中的 PersistentVolumes

       kubectl get pv
       
    输出类似于这样：

        NAME                                       CAPACITY   ACCESSMODES   RECLAIMPOLICY   STATUS    CLAIM                  REASON    AGE
        pvc-b6efd8da-b7b5-11e6-9d58-0ed433a7dd94   4Gi        RWO           Delete          Bound     default/claim1                   10s
        pvc-b95650f8-b7b5-11e6-9d58-0ed433a7dd94   4Gi        RWO           Delete          Bound     default/claim2                   6s
        pvc-bb3ca71d-b7b5-11e6-9d58-0ed433a7dd94   4Gi        RWO           Delete          Bound     default/claim3                   3s

<!--
   This list also includes the name of the claims that are bound to each volume
   for easier identification of dynamically provisioned volumes.
-->
   这个列表同样包含了绑定到每个 volume 的 claims 名称，以便更容易的识别动态配置的 volumes。

<!--
2. Chose one of your PersistentVolumes and change its reclaim policy:

       kubectl patch pv <your-pv-name> -p '{"spec":{"persistentVolumeReclaimPolicy":"Retain"}}'

    where `<your-pv-name>` is the name of your chosen PersistentVolume.
-->
2. 选择你的 PersistentVolumes 中的一个并更改它的回收策略：

       kubectl patch pv <your-pv-name> -p '{"spec":{"persistentVolumeReclaimPolicy":"Retain"}}'

    这里的 `<your-pv-name>` 是你选择的 PersistentVolume 的名字。
<!--
3. Verify that your chosen PersistentVolume has the right policy:

       kubectl get pv

    The output is similar to this:
-->
3. 验证你选择的 PersistentVolume 拥有正确的策略：

       kubectl get pv

    输出类似于这样：

        NAME                                       CAPACITY   ACCESSMODES   RECLAIMPOLICY   STATUS    CLAIM                  REASON    AGE
        pvc-b6efd8da-b7b5-11e6-9d58-0ed433a7dd94   4Gi        RWO           Delete          Bound     default/claim1                   40s
        pvc-b95650f8-b7b5-11e6-9d58-0ed433a7dd94   4Gi        RWO           Delete          Bound     default/claim2                   36s
        pvc-bb3ca71d-b7b5-11e6-9d58-0ed433a7dd94   4Gi        RWO           Retain          Bound     default/claim3                   33s

<!--
    In the preceding output, you can see that the volume bound to claim
    `default/claim3` has reclaim policy `Retain`. It will not be automatically
    deleted when a user deletes claim `default/claim3`.
-->
    在前面的输出中，你可以看到绑定到 claim `default/claim3` 的 volume 拥有的回收策略为 `Retain`。当用户删除 claim `default/claim3` 时，它不会被自动删除。

{% endcapture %}

{% capture whatsnext %}
<!--
* Learn more about [PersistentVolumes](/docs/concepts/storage/persistent-volumes/).
* Learn more about [PersistentVolumeClaims](/docs/user-guide/persistent-volumes/#persistentvolumeclaims).
-->
* 了解更多关于 [PersistentVolumes](/docs/concepts/storage/persistent-volumes/)的信息。
* 了解更多关于 [PersistentVolumeClaims](/docs/user-guide/persistent-volumes/#persistentvolumeclaims) 的信息。

<!--
### Reference
-->
### 参考

* [PersistentVolume](/docs/api-reference/{{page.version}}/#persistentvolume-v1-core)
* [PersistentVolumeClaim](/docs/api-reference/{{page.version}}/#persistentvolumeclaim-v1-core)
<!--
* See the `persistentVolumeReclaimPolicy` field of [PersistentVolumeSpec](/docs/api-reference/{{page.version}}/#persistentvolumeclaim-v1-core).
-->
* 查阅  [PersistentVolumeSpec](/docs/api-reference/{{page.version}}/#persistentvolumeclaim-v1-core) 的 `persistentVolumeReclaimPolicy` 字段。
{% endcapture %}

{% include templates/task.md %}
