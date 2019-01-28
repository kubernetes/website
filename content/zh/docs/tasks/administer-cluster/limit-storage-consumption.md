---
title: 限制存储消耗
content_template: templates/task
---
<!--
---
title: Limit Storage Consumption
content_template: templates/task
---
-->


{{% capture overview %}}

<!--
This example demonstrates an easy way to limit the amount of storage consumed in a namespace.
-->
此示例演示了一种限制命名空间中存储使用量的简便方法。

<!--
The following resources are used in the demonstration: [ResourceQuota](/docs/concepts/policy/resource-quotas/),
[LimitRange](/docs/tasks/administer-cluster/memory-default-namespace/),
and [PersistentVolumeClaim](/docs/concepts/storage/persistent-volumes/).
-->
演示中用到了以下资源：[ResourceQuota](/docs/concepts/policy/resource-quotas/)，[LimitRange](/docs/tasks/administer-cluster/memory-default-namespace/) 和 [PersistentVolumeClaim](/docs/concepts/storage/persistent-volumes/)。

{{% /capture %}}

{{% capture prerequisites %}}

* {{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

{{% /capture %}}

{{% capture steps %}}

<!--
## Scenario: Limiting Storage Consumption
-->
## 场景：限制存储消耗

<!--
The cluster-admin is operating a cluster on behalf of a user population and the admin wants to control
how much storage a single namespace can consume in order to control cost.
-->
集群管理员代表用户群操作集群，管理员希望控制单个名称空间可以消耗多少存储空间以控制成本。

<!--
The admin would like to limit:
-->
管理员想要限制：

<!--
1. The number of persistent volume claims in a namespace
2. The amount of storage each claim can request
3. The amount of cumulative storage the namespace can have
-->
1. 命名空间中 persistent volume claims 的数量
2. 每个 claim 可以请求的存储量
3. 命名空间可以具有的累积存储量

<!--
## LimitRange to limit requests for storage
-->
## LimitRange 限制存储请求

<!--
Adding a `LimitRange` to a namespace enforces storage request sizes to a minimum and maximum. Storage is requested via `PersistentVolumeClaim`. The admission controller that enforces limit ranges will reject any PVC that is above or below the values set by the admin.
-->
将 `LimitRange` 添加到命名空间会将存储请求大小强制设置为最小值和最大值。通过 `PersistentVolumeClaim` 请求存储。执行限制范围的许可控制器且拒绝任何高于或低于管理员设置的值的 PVC。

<!--
In this example, a PVC requesting 10Gi of storage would be rejected because it exceeds the 2Gi max.
-->
在此示例中，请求 10Gi 存储的 PVC 将被拒绝，因为它超过了最大 2Gi。

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
当底层存储提供程序需要某些最小值时，将使用最小存储请求。例如，AWS EBS volumes 的最低要求为 1Gi。

<!--
## StorageQuota to limit PVC count and cumulative storage capacity
-->
## StorageQuota 限制 PVC 数量和累积存储容量

<!--
Admins can limit the number of PVCs in a namespace as well as the cumulative capacity of those PVCs. New PVCs that exceed
either maximum value will be rejected.
-->
管理员可以限制命名空间中的 PVCs 数量以及这些 PVCs 的累积容量。超过任一最大值的新 PVCs 将被拒绝。

<!--
In this example, a 6th PVC in the namespace would be rejected because it exceeds the maximum count of 5. Alternatively,
a 5Gi maximum quota when combined with the 2Gi max limit above, cannot have 3 PVCs where each has 2Gi. That would be 6Gi requested
 for a namespace capped at 5Gi.
-->
在此示例中，命名空间中的第 6 个 PVC 将被拒绝，因为它超过了最大计数 5。或者，当与上面的 2Gi max 限制组合时，5Gi 最大配额不能具有 3 个 PVC，其中每个具有 2Gi。这将是 6Gi 要求的名称空间限制为 5Gi。

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

{{% /capture %}}

{{% capture discussion %}}

<!--
## Summary
-->
## 摘要

<!--
A limit range can put a ceiling on how much storage is requested while a resource quota can effectively cap the storage consumed by a namespace through claim counts and cumulative storage capacity. The allows a cluster-admin to plan their
cluster's storage budget without risk of any one project going over their allotment.
-->
限制范围可以限制请求的存储量，而资源配额可以通过 claim 计数和累积存储容量有效地限制命名空间占用的存储。允许集群管理员规划其集群的存储预算，而不会有任何一个项目超过其分配的风险。

{{% /capture %}}


