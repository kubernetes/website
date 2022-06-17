---
title: LimitRange
id: limitrange
date: 2019-04-15
full_link:  /docs/concepts/policy/limit-range/
short_description: >
  提供約束來限制名稱空間中每個容器或 Pod 的資源消耗。

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
 提供約束來限制名稱空間中每個 {{< glossary_tooltip text="容器（Containers）" term_id="container" >}} 或 {{< glossary_tooltip text="Pod" term_id="pod" >}} 的資源消耗。

<!--more--> 
<!--
LimitRange limits the quantity of objects that can be created  by type, 
as well as the amount of compute resources that may be requested/consumed by individual {{< glossary_tooltip text="Containers" term_id="container" >}} or {{< glossary_tooltip text="Pods" term_id="pod" >}} in a namespace.
-->
LimitRange 按照型別來限制名稱空間中物件能夠建立的數量，以及單個 {{< glossary_tooltip text="容器（Containers）" term_id="container" >}} 或 {{< glossary_tooltip text="Pod" term_id="pod" >}} 可以請求/使用的計算資源量。
