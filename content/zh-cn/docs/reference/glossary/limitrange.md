---
title: LimitRange
id: limitrange
date: 2019-04-15
full_link:  /zh-cn/docs/concepts/policy/limit-range/
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
-->

<!--
Constraints resource consumption per {{< glossary_tooltip text="container" term_id="container" >}}
or {{< glossary_tooltip text="Pod" term_id="pod" >}},
specified for a particular {{< glossary_tooltip text="namespace" term_id="namespace" >}}.
-->
指定特定 {{< glossary_tooltip text="命名空间（Namespace）" term_id="namespace" >}}
中每个 {{< glossary_tooltip text="容器（Containers）" term_id="container" >}}
或 {{< glossary_tooltip text="Pod" term_id="pod" >}} 的资源消耗限制。

<!--more--> 

<!--
A [LimitRange](/docs/concepts/policy/limit-range/) either limits the quantity of
{{< glossary_tooltip text="API resources" term_id="api-resource" >}}
that can be created (for a particular resource type),
or the amount of {{< glossary_tooltip text="infrastructure resources" term_id="infrastructure-resource" >}}
that may be requested/consumed by individual containers or Pods within a namespace.
-->
[LimitRange](/zh-cn/docs/concepts/policy/limit-range/) 用来限制可以创建的
{{< glossary_tooltip text="API 资源" term_id="api-resource" >}}的数量（针对特定资源类型），
或者限制命名空间内单个容器或 Pod 可请求/消耗的
{{< glossary_tooltip text="基础设施资源" term_id="infrastructure-resource" >}}的量。
