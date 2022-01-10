---
title: LimitRange
id: limitrange
date: 2019-04-15
full_link:  /docs/concepts/policy/limit-range/
short_description: >
  提供约束来限制命名空间中每个容器或 Pod 的资源消耗。

aka: 
tags:
- core-object
- fundamental
- architecture
related:
 - pod
 - container

---

<!--
---
title: LimitRange
id: limitrange
date: 2019-04-15
full_link:  /docs/concepts/policy/limit-range/
short_description: >
  Provides constraints to limit resource consumption per Containers or Pods in a namespace.

aka: 
tags:
- core-object
- fundamental
- architecture
related:
 - pod
 - container

---
-->

<!--
 Provides constraints to limit resource consumption per {{< glossary_tooltip text="Containers" term_id="container" >}} or {{< glossary_tooltip text="Pods" term_id="pod" >}} in a namespace.
-->
 提供约束来限制命名空间中每个 {{< glossary_tooltip text="容器（Containers）" term_id="container" >}} 或 {{< glossary_tooltip text="Pod" term_id="pod" >}} 的资源消耗。

<!--more--> 
<!--
LimitRange limits the quantity of objects that can be created  by type, 
as well as the amount of compute resources that may be requested/consumed by individual {{< glossary_tooltip text="Containers" term_id="container" >}} or {{< glossary_tooltip text="Pods" term_id="pod" >}} in a namespace.
-->
LimitRange 按照类型来限制命名空间中对象能够创建的数量，以及单个 {{< glossary_tooltip text="容器（Containers）" term_id="container" >}} 或 {{< glossary_tooltip text="Pod" term_id="pod" >}} 可以请求/使用的计算资源量。
