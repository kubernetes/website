---
title: Kubernetes API
id: kubernetes-api
date: 2018-04-12
full_link: /zh-cn/docs/concepts/overview/kubernetes-api/
short_description: >
  Kubernetes API 是通過 RESTful 介面提供 Kubernetes 功能服務並負責叢集狀態儲存的應用程式。

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

Kubernetes API 是通過 RESTful 介面提供 Kubernetes 功能服務並負責叢集狀態儲存的應用程式。

<!--more--> 

<!--
Kubernetes resources and "records of intent" are all stored as API objects, and modified via RESTful calls to the API. The API allows configuration to be managed in a declarative way. Users can interact with the Kubernetes API directly, or via tools like `kubectl`. The core Kubernetes API is flexible and can also be extended to support custom resources.
-->

Kubernetes 資源和"意向記錄"都是作爲 API 對象儲存的，並可以通過調用 RESTful 風格的 API 進行修改。
API 允許以聲明方式管理設定。
使用者可以直接和 Kubernetes API 交互，也可以通過 `kubectl` 這樣的工具進行交互。
核心的 Kubernetes API 是很靈活的，可以擴展以支持定製資源。

