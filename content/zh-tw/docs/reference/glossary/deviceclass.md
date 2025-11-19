---
title: DeviceClass
id: deviceclass
date: 2025-05-26
full_link: /docs/concepts/scheduling-eviction/dynamic-resource-allocation/#deviceclass
short_description: >
  集羣中設備的一種分類。使用戶可以申領 DeviceClass 中的特定設備。
tags:
- extension
---
<!--
title: DeviceClass
id: deviceclass
date: 2025-05-26
full_link: /docs/concepts/scheduling-eviction/dynamic-resource-allocation/#deviceclass
short_description: >
  A category of devices in the cluster. Users can claim specific
  devices in a DeviceClass.
tags:
- extension
-->

<!--
A category of {{< glossary_tooltip text="devices" term_id="device" >}} in the
 cluster that can be used with dynamic resource allocation (DRA).
-->
集羣中可用於動態資源分配（DRA）
的一類{{< glossary_tooltip text="設備" term_id="device" >}}。

<!--more-->

<!--
Administrators or device owners use DeviceClasses to define a set of devices
that can be claimed and used in workloads. Devices are claimed by creating
{{< glossary_tooltip text="ResourceClaims" term_id="resourceclaim" >}}
that filter for specific device parameters in a DeviceClass.

For more information, see
[Dynamic Resource Allocation](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#deviceclass)
-->
管理員或設備所有者使用 DeviceClass 來定義一組可以被申領並用於工作負載的設備。
申領設備的方式爲創建
{{< glossary_tooltip text="ResourceClaims" term_id="resourceclaim" >}}，
並針對 DeviceClass 中特定的設備參數進行篩選。

更多信息請參見[動態資源分配](/zh-cn/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#deviceclass)。
