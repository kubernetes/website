---
title: API 資源
id: api-resource
date: 2025-02-09
full_link: /zh-cn/docs/reference/using-api/api-concepts/#standard-api-terminology
short_description: >
  Kubernetes 實體，表示 Kubernetes API 服務器上的端點。

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
Kubernetes 類別系統中的實體，對應於
{{< glossary_tooltip text="Kubernetes API" term_id="kubernetes-api" >}} 上的端點。
一個資源通常表示一個{{< glossary_tooltip text="對象" term_id="object" >}}。
一些資源表示對其他對象執行的操作，例如權限檢查。

<!--more-->

<!--
Each resource represents an HTTP endpoint (URI) on the Kubernetes API server, defining the schema for the objects or operations on that resource.
-->
每個資源表示 Kubernetes API 服務器上的一個 HTTP 端點（URI），用於定義該資源的對象或操作的模式。
