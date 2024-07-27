---
title: 限制存储使用量
content_type: task
weight: 240
---
<!--
title: Limit Storage Consumption
content_type: task
weight: 240
-->

<!-- overview -->

<!--
This example demonstrates how to limit the amount of storage consumed in a namespace
-->
此示例演示如何限制一个名字空间中的存储使用量。

<!--
The following resources are used in the demonstration: [ResourceQuota](/docs/concepts/policy/resource-quotas/),
[LimitRange](/docs/tasks/administer-cluster/memory-default-namespace/),
and [PersistentVolumeClaim](/docs/concepts/storage/persistent-volumes/).
-->
演示中用到了以下资源：[ResourceQuota](/zh-cn/docs/concepts/policy/resource-quotas/)、
[LimitRange](/zh-cn/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/) 和
[PersistentVolumeClaim](/zh-cn/docs/concepts/storage/persistent-volumes/)。

## {{% heading "prerequisites" %}}

* {{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

<!--
## Scenario: Limiting Storage Consumption
-->
## 场景：限制存储使用量

<!--
The cluster-admin is operating a cluster on behalf of a user population and the admin wants to control
how much storage a single namespace can consume in order to control cost.
-->
集群管理员代表用户群操作集群，该管理员希望控制单个名字空间可以消耗多少存储空间以控制成本。

<!--
The admin would like to limit:
-->
该管理员想要限制：

<!--
1. The number of persistent volume claims in a namespace
2. The amount of storage each claim can request
3. The amount of cumulative storage the namespace can have
-->
1. 名字空间中持久卷申领（persistent volume claims）的数量
2. 每个申领（claim）可以请求的存储量
3. 名字空间可以具有的累计存储量

<!--
## LimitRange to limit requests for storage
-->
## 使用 LimitRange 限制存储请求

<!--
Adding a `LimitRange` to a namespace enforces storage request sizes to a minimum and maximum. Storage is requested via `PersistentVolumeClaim`. The admission controller that enforces limit ranges will reject any PVC that is above or below the values set by the admin.
-->
将 `LimitRange` 添加到名字空间会为存储请求大小强制设置最小值和最大值。
存储是通过 `PersistentVolumeClaim` 来发起请求的。
执行限制范围控制的准入控制器会拒绝任何高于或低于管理员所设阈值的 PVC。

<!--
In this example, a PVC requesting 10Gi of storage would be rejected because it exceeds the 2Gi max.
-->
在此示例中，请求 10Gi 存储的 PVC 将被拒绝，因为它超过了最大 2Gi。

```yaml
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
当底层存储提供程序需要某些最小值时，将会用到所设置最小存储请求值。
例如，AWS EBS volumes 的最低要求为 1Gi。

<!--
## ResourceQuota to limit PVC count and cumulative storage capacity
-->
## 使用 ResourceQuota 限制 PVC 数目和累计存储容量

<!--
Admins can limit the number of PVCs in a namespace as well as the cumulative capacity of those PVCs. New PVCs that exceed
either maximum value will be rejected.
-->
管理员可以限制某个名字空间中的 PVC 个数以及这些 PVC 的累计容量。
如果 PVC 的数目超过任一上限值，新的 PVC 将被拒绝。

<!--
In this example, a 6th PVC in the namespace would be rejected because it exceeds the maximum count of 5. Alternatively,
a 5Gi maximum quota when combined with the 2Gi max limit above, cannot have 3 PVCs where each has 2Gi. That would be 6Gi requested
 for a namespace capped at 5Gi.
-->
在此示例中，名字空间中的第 6 个 PVC 将被拒绝，因为它超过了最大计数 5。
或者，当与上面的 2Gi 最大容量限制结合在一起时，
意味着 5Gi 的最大配额不能支持 3 个都是 2Gi 的 PVC。
后者实际上是向名字空间请求 6Gi 容量，而该名字空间已经设置上限为 5Gi。

```yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: storagequota
spec:
  hard:
    persistentvolumeclaims: "5"
    requests.storage: "5Gi"
```

<!-- discussion -->

<!--
## Summary

A limit range can put a ceiling on how much storage is requested while a resource quota can effectively cap the storage consumed by a namespace through claim counts and cumulative storage capacity. The allows a cluster-admin to plan their
cluster's storage budget without risk of any one project going over their allotment.
-->
## 小结

限制范围对象可以用来设置可请求的存储量上限，而资源配额对象则可以通过申领计数和
累计存储容量有效地限制名字空间耗用的存储量。
这两种机制使得集群管理员能够规划其集群存储预算而不会发生任一项目超量分配的风险。

