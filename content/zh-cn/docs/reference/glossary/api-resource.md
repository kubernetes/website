---
title: API 资源
id: api-resource
date: 2025-02-09
full_link: /zh-cn/docs/reference/using-api/api-concepts/#standard-api-terminology
short_description: >
  Kubernetes 实体，表示 Kubernetes API 服务器上的端点。

aka:
 - Resource
tags:
- architecture
---
<!--
title: API resource
id: api-resource
date: 2025-02-09
full_link: /docs/reference/using-api/api-concepts/#standard-api-terminology
short_description: >
  A Kubernetes entity, representing an endpoint on the Kubernetes API server.

aka:
 - Resource
tags:
- architecture
-->

<!--
An entity in the Kubernetes type system, corresponding to an endpoint on the {{< glossary_tooltip text="Kubernetes API" term_id="kubernetes-api" >}}.
A resource typically represents an {{< glossary_tooltip text="object" term_id="object" >}}.
Some resources represent an operation on other objects, such as a permission check.
-->
Kubernetes 类别系统中的实体，对应于
{{< glossary_tooltip text="Kubernetes API" term_id="kubernetes-api" >}} 上的端点。
一个资源通常表示一个{{< glossary_tooltip text="对象" term_id="object" >}}。
一些资源表示对其他对象执行的操作，例如权限检查。

<!--more-->

<!--
Each resource represents an HTTP endpoint (URI) on the Kubernetes API server, defining the schema for the objects or operations on that resource.
-->
每个资源表示 Kubernetes API 服务器上的一个 HTTP 端点（URI），用于定义该资源的对象或操作的模式。
