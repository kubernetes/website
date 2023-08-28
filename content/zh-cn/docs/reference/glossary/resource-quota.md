---
title: 资源配额（Resource Quotas）
id: resource-quota
date: 2018-04-12
full_link: /zh-cn/docs/concepts/policy/resource-quotas/
short_description: >
  资源配额提供了限制每个命名空间的资源消耗总和的约束。

aka: 
tags:
- fundamental
- operation
- architecture
---
<!--
title: Resource Quotas
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
 Provides constraints that limit aggregate resource consumption per {{< glossary_tooltip term_id="namespace" >}}.
-->
资源配额提供了限制每个 {{< glossary_tooltip text="命名空间" term_id="namespace">}} 的资源消耗总和的约束。

<!--more--> 

<!--
Limits the quantity of objects that can be created in a namespace by type, as well as the total amount of compute resources that may be consumed by resources in that project.
-->
限制了命名空间中每种对象可以创建的数量，也限制了项目中可被资源对象利用的计算资源总数。
