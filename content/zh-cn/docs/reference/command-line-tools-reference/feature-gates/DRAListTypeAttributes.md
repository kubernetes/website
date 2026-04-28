---
title: DRAListTypeAttributes
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.36"
---

<!--
Enables list-type attribute fields (`bools`, `ints`, `strings`, `versions`) for devices
in `ResourceSlice`, allowing a device to advertise multiple values for a single attribute.

When enabled, `matchAttribute` uses set-intersection semantics (the sets of attribute
values across all selected devices must have a non-empty intersection), and
`distinctAttribute` uses pairwise-disjoint semantics (the sets must share no values).
Scalar attributes remain backward-compatible, treated as singleton sets.
-->
为 `ResourceSlice` 中的设备启用 list 类型属性字段（`bools`、`ints`、`strings`、`versions`），
允许设备为单个属性通告多个值。

启用时，`matchAttribute` 使用集合交集（set-intersection）语义（所有选定设备的属性值集合必须有非空交集），
`distinctAttribute` 使用成对不相交语义（集合不得共享值）。
标量属性保持向后兼容，被视为单例集合。

<!--
Also adds the `includes()` helper function to CEL device selector expressions, which
works on both scalar and list-type attributes.

For more information, see
[List type attributes](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#list-type-attributes)
in the Dynamic Resource Allocation documentation.
-->
还为 CEL 设备选择器表达式添加了 `includes()` 辅助函数，
该函数可用于标量和列表类型属性。

有关更多信息，请参阅动态资源分配文档中的
[list 类型属性](/zh-cn/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#list-type-attributes)。
