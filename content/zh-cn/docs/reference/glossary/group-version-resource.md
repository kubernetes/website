---
title: 组版本资源（Group Version Resource）
id: gvr
date: 2023-07-24
short_description: >
  Kubernetes API 的 API 组、API 版本和名称。

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
Means of representing unique Kubernetes API resource.
-->
表示唯一的 Kubernetes API 资源的方法。

<!--more-->

<!--
Group Version Resources (GVRs) specify the API group, API version, and resource (name for the object kind as it appears in the URI) associated with accessing a particular id of object in Kubernetes.
GVRs let you define and distinguish different Kubernetes objects, and to specify a way of accessing
objects that is stable even as APIs change.
-->
组版本资源（Group Version Resource, GVR）指定了与访问 Kubernetes 中对象的特定 id 相关联的 API 组、API
版本和资源（URI 中显示的对象类别的名称）。GVR 允许你定义和区分不同的 Kubernetes 对象，
并指定了一种访问对象的方式，即使在 API 发生变化时这也是一种稳定的访问方式。

