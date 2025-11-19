---
title: 組版本資源（Group Version Resource）
id: gvr
date: 2023-07-24
short_description: >
  Kubernetes API 的 API 組、API 版本和名稱。
aka: ["GVR"]
tags:
- architecture
---
<!--
title: Group Version Resource
id: gvr
date: 2023-07-24
short_description: >
  The API group, API version and name of a Kubernetes API.

aka: ["GVR"]
tags:
- architecture
-->

<!--
Means of representing specific Kubernetes APIs uniquely.
-->
表示特定的 Kubernetes API 的唯一方法。

<!--more-->

<!--
Group Version Resources (GVRs) specify the API group, API version, and _resource_
(name for the object kind as it appears in the URI) associated with accessing a particular id of object in Kubernetes.
GVRs let you define and distinguish different Kubernetes objects, and to specify a way of accessing
objects that is stable even as APIs change.
-->
組版本資源（Group Version Resource，GVR）指定了與訪問 Kubernetes 中對象的特定 id 相關聯的 API 組、API
版本和**資源**（URI 中顯示的對象類別的名稱）。GVR 允許你定義和區分不同的 Kubernetes 對象，
並指定了一種訪問對象的方式，即使在 API 發生變化時這也是一種穩定的訪問方式。

<!--
In this usage, _resource_ refers to an HTTP resource. Because some APIs are namespaced, a GVR may
not refer to a specific {{< glossary_tooltip text="API resource" term_id="api-resource" >}}.
-->
在本用法中，**資源**指的是 HTTP 資源。因爲某些 API 是命名空間化的，因此
GVR 可能不會引用特定的
