---
title: 限制存儲使用量
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
此示例演示如何限制一個名字空間中的存儲使用量。

<!--
The following resources are used in the demonstration: [ResourceQuota](/docs/concepts/policy/resource-quotas/),
[LimitRange](/docs/tasks/administer-cluster/memory-default-namespace/),
and [PersistentVolumeClaim](/docs/concepts/storage/persistent-volumes/).
-->
演示中用到了以下資源：[ResourceQuota](/zh-cn/docs/concepts/policy/resource-quotas/)、
[LimitRange](/zh-cn/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/) 和
[PersistentVolumeClaim](/zh-cn/docs/concepts/storage/persistent-volumes/)。

## {{% heading "prerequisites" %}}

* {{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

<!--
## Scenario: Limiting Storage Consumption
-->
## 場景：限制存儲使用量

<!--
The cluster-admin is operating a cluster on behalf of a user population and the admin wants to control
how much storage a single namespace can consume in order to control cost.
-->
叢集管理員代表使用者羣操作叢集，該管理員希望控制單個名字空間可以消耗多少存儲空間以控制成本。

<!--
The admin would like to limit:
-->
該管理員想要限制：

<!--
1. The number of persistent volume claims in a namespace
2. The amount of storage each claim can request
3. The amount of cumulative storage the namespace can have
-->
1. 名字空間中持久卷申領（persistent volume claims）的數量
2. 每個申領（claim）可以請求的存儲量
3. 名字空間可以具有的累計存儲量

<!--
## LimitRange to limit requests for storage
-->
## 使用 LimitRange 限制存儲請求

<!--
Adding a `LimitRange` to a namespace enforces storage request sizes to a minimum and maximum. Storage is requested via `PersistentVolumeClaim`. The admission controller that enforces limit ranges will reject any PVC that is above or below the values set by the admin.
-->
將 `LimitRange` 添加到名字空間會爲存儲請求大小強制設置最小值和最大值。
存儲是通過 `PersistentVolumeClaim` 來發起請求的。
執行限制範圍控制的准入控制器會拒絕任何高於或低於管理員所設閾值的 PVC。

<!--
In this example, a PVC requesting 10Gi of storage would be rejected because it exceeds the 2Gi max.
-->
在此示例中，請求 10Gi 存儲的 PVC 將被拒絕，因爲它超過了最大 2Gi。

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
當底層存儲提供程序需要某些最小值時，將會用到所設置最小存儲請求值。
例如，AWS EBS volumes 的最低要求爲 1Gi。

<!--
## ResourceQuota to limit PVC count and cumulative storage capacity
-->
## 使用 ResourceQuota 限制 PVC 數目和累計存儲容量

<!--
Admins can limit the number of PVCs in a namespace as well as the cumulative capacity of those PVCs. New PVCs that exceed
either maximum value will be rejected.
-->
管理員可以限制某個名字空間中的 PVC 個數以及這些 PVC 的累計容量。
如果 PVC 的數目超過任一上限值，新的 PVC 將被拒絕。

<!--
In this example, a 6th PVC in the namespace would be rejected because it exceeds the maximum count of 5. Alternatively,
a 5Gi maximum quota when combined with the 2Gi max limit above, cannot have 3 PVCs where each has 2Gi. That would be 6Gi requested
 for a namespace capped at 5Gi.
-->
在此示例中，名字空間中的第 6 個 PVC 將被拒絕，因爲它超過了最大計數 5。
或者，當與上面的 2Gi 最大容量限制結合在一起時，
意味着 5Gi 的最大配額不能支持 3 個都是 2Gi 的 PVC。
後者實際上是向名字空間請求 6Gi 容量，而該名字空間已經設置上限爲 5Gi。

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
## 小結

限制範圍對象可以用來設置可請求的存儲量上限，而資源配額對象則可以通過申領計數和
累計存儲容量有效地限制名字空間耗用的存儲量。
這兩種機制使得叢集管理員能夠規劃其叢集存儲預算而不會發生任一項目超量分配的風險。

