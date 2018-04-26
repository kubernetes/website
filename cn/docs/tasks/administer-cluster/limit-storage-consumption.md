---
cn-approvers:
- xiaosuiba
cn-reviewers:
- zjj2wry
title: 限制存储使用量
---

<!--
title: Limit Storage Consumption
-->

{% capture overview %}

<!--
This example demonstrates an easy way to limit the amount of storage consumed in a namespace.

The following resources are used in the demonstration: [ResourceQuota](/docs/concepts/policy/resource-quotas/),
[LimitRange](/docs/tasks/administer-cluster/memory-default-namespace/),
and [PersistentVolumeClaim](/docs/concepts/storage/persistent-volumes/).
-->
本示例展示了一种在 namespace 中限制存储使用量总和的简便方法。

演示使用了下列资源：[ResourceQuota](/docs/concepts/policy/resource-quotas/)、[LimitRange](/docs/tasks/administer-cluster/memory-default-namespace/) 和 [PersistentVolumeClaim](/docs/concepts/storage/persistent-volumes/)。

{% endcapture %}

{% capture prerequisites %}

* {% include task-tutorial-prereqs.md %}

{% endcapture %}

{% capture steps %}
<!--
## Scenario: Limiting Storage Consumption
-->
## 场景：限制存储使用量

<!--
The cluster-admin is operating a cluster on behalf of a user population and the admin wants to control
how much storage a single namespace can consume in order to control cost.
-->
集群管理员正代表一个用户群体操作集群。管理员希望控制单个 namespace 能够使用的存储数量，以此来控制成本。

<!--
The admin would like to limit:

1. The number of persistent volume claims in a namespace
2. The amount of storage each claim can request
3. The amount of cumulative storage the namespace can have
-->
管理员希望限制：

1. Namespace 中的 persistent volume claim 的数量
2. 每个 claim 可以请求的存储数量
3. Namespace 可以拥有的存储总量

<!--
## LimitRange to limit requests for storage
-->
## 使用 LimitRange 限制存储请求

<!--
Adding a `LimitRange` to a namespace enforces storage request sizes to a minimum and maximum. Storage is requested
via `PersistentVolumeClaim`. The admission controller that enforces limit ranges will reject any PVC that is above or below
the values set by the admin.
-->
添加 `LimitRange` 到 namespace 将限制存储请求大小处于最小和最大值之间。存储通过 `PersistentVolumeClaim` 进行请求。应用了 limit range 的准入控制器会拒绝任何大于或小于管理员设置值的 PVC 请求。

<!--
In this example, a PVC requesting 10Gi of storage would be rejected because it exceeds the 2Gi max.
-->
本例中，PVC 请求的 10Gi 存储将被拒绝，因为它超出了 2Gi 的最大值。

```
apiVersion: v1
kind: LimitRange
metadata:
  name: storagelimits
spec:
  limits:
  - type: PersistentVolumeClaim
    max:
      storage: 2Gi
    min:
      storage: 1Gi
```
<!--
Minimum storage requests are used when the underlying storage provider requires certain minimums. For example,
AWS EBS volumes have a 1Gi minimum requirement.
-->
存储请求的最小值用于底层存储提供商要求某个最小值的场景。例如 AWS EBS volume 需要 1Gi 的最小值。

<!--
## StorageQuota to limit PVC count and cumulative storage capacity
-->
## 使用 StorageQuota 限制 PVC 数量和存储总量

<!--
Admins can limit the number of PVCs in a namespace as well as the cumulative capacity of those PVCs. New PVCs that exceed
either maximum value will be rejected.
-->
管理员可以限制 namespace 中 PVC 的数量及其容量的总大小。任何超过最大值的新 PVC 请求都将被拒绝。

<!--
In this example, a 6th PVC in the namespace would be rejected because it exceeds the maximum count of 5. Alternatively,
a 5Gi maximum quota when combined with the 2Gi max limit above, cannot have 3 PVCs where each has 2Gi. That would be 6Gi requested
 for a namespace capped at 5Gi.
-->
本例中， namespace 中第 6 个 PVC 请求将被拒绝，因为它超过了 5 个最大数量的限制。又或者对于拥有 5Gi 配额最大值和 2Gi 最大值限制的 namespace，不能拥有 3 个 2Gi 大小的 PVC。因为那会向具有 5Gi 上限的 namespace 请求 6Gi 的存储。

```
apiVersion: v1
kind: ResourceQuota
metadata:
  name: storagequota
spec:
  hard:
    persistentvolumeclaims: "5"
    requests.storage: "5Gi"
```

{% endcapture %}

{% capture discussion %}

<!--
## Summary
-->
## 总结

<!--
A limit range can put a ceiling on how much storage is requested while a resource quota can effectively cap the storage
consumed by a namespace through claim counts and cumulative storage capacity. The allows a cluster-admin to plan their
cluster's storage budget without risk of any one project going over their allotment.
-->
Limit range 可以为存储的请求数量设置上限，而资源配额可以通过 claim 数量和存储总大小有效的限制 namespace 使用的存储。这使得集群管理员可以规划集群的存储预算而不用担心任何单个项目超出它们的配额。

{% endcapture %}

{% include templates/task.md %}
