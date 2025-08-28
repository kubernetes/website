---
title: 资源配额（ResourceQuota）
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
用于限制每个{{< glossary_tooltip text="命名空间" term_id="namespace" >}}的资源消耗总和的对象。

<!--more-->

<!--
A ResourceQuota can either limits the quantity of {{< glossary_tooltip text="API resources" term_id="api-resource" >}}
that can be created in a namespace by type, or it can set a limit on the total amount of
{{< glossary_tooltip text="infrastructure resources" term_id="infrastructure-resource" >}}
that may be consumed on behalf of the namespace (and the objects within it).
-->
资源配额可以限制命名空间中按类型创建的
{{< glossary_tooltip text="API 资源" term_id="api-resource" >}}的数量，
或者它可以设置代表命名空间（及其内部的对象）可消耗的
{{< glossary_tooltip text="基础设施资源" term_id="infrastructure-resource" >}}总量的限制。
