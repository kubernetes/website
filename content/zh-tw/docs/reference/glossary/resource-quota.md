---
title: 資源配額（Resource Quotas）
id: resource-quota
date: 2018-04-12
full_link: /zh-cn/docs/concepts/policy/resource-quotas/
short_description: >
  資源配額提供了限制每個名稱空間的資源消耗總和的約束。

aka: 
tags:
- fundamental
- operation
- architecture
---

<!--
---
title: Resource Quotas
id: resource-quota
date: 2018-04-12
full_link: /zh-cn/docs/concepts/policy/resource-quotas/
short_description: >
  Provides constraints that limit aggregate resource consumption per namespace.

aka: 
tags:
- fundamental
- operation
- architecture
---
-->

<!--
 Provides constraints that limit aggregate resource consumption per {{< glossary_tooltip term_id="namespace" >}}.
-->

資源配額提供了限制每個 {{< glossary_tooltip text="名稱空間" term_id="namespace">}} 的資源消耗總和的約束。

<!--more--> 

<!--
Limits the quantity of objects that can be created in a namespace by type, as well as the total amount of compute resources that may be consumed by resources in that project.
-->

限制了名稱空間中每種物件可以建立的數量，也限制了專案中可被資源物件利用的計算資源總數。


