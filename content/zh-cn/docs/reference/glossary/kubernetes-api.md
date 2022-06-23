---
title: Kubernetes API
id: kubernetes-api
date: 2018-04-12
full_link: /zh-cn/docs/concepts/overview/kubernetes-api/
short_description: >
  Kubernetes API 是通过 RESTful 接口提供 Kubernetes 功能服务并负责集群状态存储的应用程序。

aka: 
tags:
- fundamental
- architecture
---

<!--
---
title: Kubernetes API
id: kubernetes-api
date: 2018-04-12
full_link: /docs/concepts/overview/kubernetes-api/
short_description: >
  The application that serves Kubernetes functionality through a RESTful interface and stores the state of the cluster.

aka: 
tags:
- fundamental
- architecture
---
-->

<!--
 The application that serves Kubernetes functionality through a RESTful interface and stores the state of the cluster.
-->

Kubernetes API 是通过 RESTful 接口提供 Kubernetes 功能服务并负责集群状态存储的应用程序。

<!--more--> 

<!--
Kubernetes resources and "records of intent" are all stored as API objects, and modified via RESTful calls to the API. The API allows configuration to be managed in a declarative way. Users can interact with the Kubernetes API directly, or via tools like `kubectl`. The core Kubernetes API is flexible and can also be extended to support custom resources.
-->

Kubernetes 资源和"意向记录"都是作为 API 对象储存的，并可以通过调用 RESTful 风格的 API 进行修改。
API 允许以声明方式管理配置。
用户可以直接和 Kubernetes API 交互，也可以通过 `kubectl` 这样的工具进行交互。
核心的 Kubernetes API 是很灵活的，可以扩展以支持定制资源。

