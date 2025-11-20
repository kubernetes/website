---
title: Downward API
id: downward-api
date: 2022-03-21
short_description: >
  將 Pod 和容器字段值暴露給容器中運行的代碼的機制。
aka:
full_link: /docs/concepts/workloads/pods/downward-api/
tags:
- architecture
---
<!--
title: Downward API
id: downward-api
date: 2022-03-21
short_description: >
  A mechanism to expose Pod and container field values to code running in a container.
aka:
full_link: /docs/concepts/workloads/pods/downward-api/
tags:
- architecture
-->

<!--
Kubernetes' mechanism to expose Pod and container field values to code running in a container.
-->
Kubernetes 將 Pod 和容器字段值暴露給容器中運行的代碼的機制。

<!--more-->

<!--
It is sometimes useful for a container to have information about itself, without
needing to make changes to the container code that directly couple it to Kubernetes.
-->
在不需要修改容器代碼的前提下讓容器擁有關於自身的資訊是很有用的。修改代碼可能使容器直接耦合到 Kubernetes。

<!--
The Kubernetes downward API allows containers to consume information about themselves
or their context in a Kubernetes cluster. Applications in containers can have
access to that information, without the application needing to act as a client of
the Kubernetes API.
-->
Kubernetes Downward API 允許容器使用它們自己或它們在 Kubernetes 叢集中所處環境的資訊。
容器中的應用程式可以訪問該資訊，而不需要以 Kubernetes API 客戶端的形式執行操作。

<!--
There are two ways to expose Pod and container fields to a running container:

- using [environment variables](/docs/tasks/inject-data-application/environment-variable-expose-pod-information/)
- using [a `downwardAPI` volume](/docs/tasks/inject-data-application/downward-api-volume-expose-pod-information/)

Together, these two ways of exposing Pod and container fields are called the _downward API_.
-->
有兩種方法可以將 Pod 和容器字段暴露給正在運行的容器：

* 使用[環境變量](/zh-cn/docs/tasks/inject-data-application/environment-variable-expose-pod-information/)
* 使用 [`downwardAPI` 卷](/zh-cn/docs/tasks/inject-data-application/downward-api-volume-expose-pod-information/)

這兩種暴露 Pod 和容器字段的方式統稱爲 **Downward API**。
