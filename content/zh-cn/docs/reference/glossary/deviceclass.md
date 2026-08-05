---
title: DeviceClass
id: deviceclass
date: 2025-05-26
full_link: /docs/concepts/scheduling-eviction/dynamic-resource-allocation/#deviceclass
short_description: >
  集群中设备的一种分类。使用户可以申领 DeviceClass 中的特定设备。
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
集群中可用于动态资源分配（DRA）
的一类{{< glossary_tooltip text="设备" term_id="device" >}}。

<!--more-->

<!--
Administrators or device owners use DeviceClasses to define a set of devices
that can be claimed and used in workloads. Devices are claimed by creating
{{< glossary_tooltip text="ResourceClaims" term_id="resourceclaim" >}}
that filter for specific device parameters in a DeviceClass.

For more information, see
[Dynamic Resource Allocation](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#deviceclass)
-->
管理员或设备所有者使用 DeviceClass 来定义一组可以被申领并用于工作负载的设备。
申领设备的方式为创建
{{< glossary_tooltip text="ResourceClaims" term_id="resourceclaim" >}}，
并针对 DeviceClass 中特定的设备参数进行筛选。

更多信息请参见[动态资源分配](/zh-cn/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#deviceclass)。
