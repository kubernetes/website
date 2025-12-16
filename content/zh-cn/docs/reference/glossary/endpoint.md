---
title: 端点（Endpoints）
id: endpoints
date: 2020-04-23
full_link: /zh-cn/docs/concepts/services-networking/service/#endpoints
short_description: >
  表示 Service 端点的 API（已弃用）
tags:
- networking
---
<!--
title: Endpoints
id: endpoints
date: 2020-04-23
full_link: /docs/concepts/services-networking/service/#endpoints
short_description: >
  (Deprecated) API representing endpoints of a Service
tags:
- networking
-->

<!--
A deprecated API that represents the set of all endpoints for a
{{< glossary_tooltip text="Service" term_id="service" >}}.
-->
一个已弃用的 API，表示某个 {{< glossary_tooltip text="Service" term_id="service" >}}
的全部端点的集合。

<!--more-->

<!--
Since v1.21, Kubernetes uses 
{{< glossary_tooltip text="EndpointSlices" term_id="endpoint-slice" >}}
rather than Endpoints; the original Endpoints API was deprecated due to
concerns about scalability.

To learn more about Endpoints, read [Endpoints](/docs/concepts/services-networking/service/#endpoints).
-->
从 v1.21 起，Kubernetes 使用
{{< glossary_tooltip text="EndpointSlices" term_id="endpoint-slice" >}}
来替代 Endpoints；原始的 Endpoints API 因可扩展性方面的考量而被弃用。

有关 Endpoints 的信息，参阅
[Endpoints](/zh-cn/docs/concepts/services-networking/service/#endpoints)。
