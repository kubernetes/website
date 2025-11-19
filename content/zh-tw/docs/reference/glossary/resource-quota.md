---
title: 資源配額（ResourceQuota）
id: resource-quota
date: 2018-04-12
full_link: /zh-cn/docs/concepts/policy/resource-quotas/
short_description: >
  資源配額提供了限制每個命名空間的資源消耗總和的約束。
aka: 
tags:
- fundamental
- operation
- architecture
---
<!--
title: ResourceQuota
id: resource-quota
date: 2018-04-12
full_link: /docs/concepts/policy/resource-quotas/
short_description: >
  Provides constraints that limit aggregate resource consumption per namespace.

aka: 
tags:
- fundamental
- operation
- architecture
-->

<!--
Object that constrains aggregate resource
consumption, per {{< glossary_tooltip term_id="namespace" >}}.
-->
用於限制每個{{< glossary_tooltip text="命名空間" term_id="namespace" >}}的資源消耗總和的對象。

<!--more-->

<!--
A ResourceQuota can either limits the quantity of {{< glossary_tooltip text="API resources" term_id="api-resource" >}}
that can be created in a namespace by type, or it can set a limit on the total amount of
{{< glossary_tooltip text="infrastructure resources" term_id="infrastructure-resource" >}}
that may be consumed on behalf of the namespace (and the objects within it).
-->
資源配額可以限制命名空間中按類型創建的
{{< glossary_tooltip text="API 資源" term_id="api-resource" >}}的數量，
或者它可以設置代表命名空間（及其內部的對象）可消耗的
{{< glossary_tooltip text="基礎設施資源" term_id="infrastructure-resource" >}}總量的限制。
