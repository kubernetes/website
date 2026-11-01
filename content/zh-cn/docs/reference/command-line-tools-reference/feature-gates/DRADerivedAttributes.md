---
title: DRADerivedAttributes
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.37"
---

<!--
Enables `derivedAttributes` in Dynamic Resource Allocation (DRA), letting
ResourceClaim and ResourceClaimTemplate authors compute virtual device
attributes with per-device CEL expressions, for use in `matchAttribute` and
`distinctAttribute` constraints.
-->
在动态资源分配（DRA）中启用 `derivedAttributes`，允许
ResourceClaim 和 ResourceClaimTemplate 的编写者使用逐设备的 CEL
表达式计算虚拟设备属性，以供 `matchAttribute` 和 `distinctAttribute` 约束使用。

<!--
For more information, see
[Derived attributes](/docs/concepts/resource-management/dynamic-resource-allocation/dra-api/#derived-attributes)
in the DRA API Objects documentation.
-->
更多信息，请参阅 DRA API
对象文档中的[派生属性](/zh-cn/docs/concepts/resource-management/dynamic-resource-allocation/dra-api/#derived-attributes)。
