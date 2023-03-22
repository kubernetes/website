---
title: Downward API
id: downward-api
date: 2022-03-21
short_description: >
  将 Pod 和容器字段值暴露给容器中运行的代码的机制。
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
Kubernetes 将 Pod 和容器字段值暴露给容器中运行的代码的机制。

<!--more-->

<!--
It is sometimes useful for a container to have information about itself, without
needing to make changes to the container code that directly couple it to Kubernetes.
-->
在不需要修改容器代码的前提下让容器拥有关于自身的信息是很有用的。修改代码可能使容器直接耦合到 Kubernetes。

<!--
The Kubernetes downward API allows containers to consume information about themselves
or their context in a Kubernetes cluster. Applications in containers can have
access to that information, without the application needing to act as a client of
the Kubernetes API.
-->
Kubernetes Downward API 允许容器使用它们自己或它们在 Kubernetes 集群中所处环境的信息。
容器中的应用程序可以访问该信息，而不需要以 Kubernetes API 客户端的形式执行操作。

<!--
There are two ways to expose Pod and container fields to a running container:

- using [environment variables](/docs/tasks/inject-data-application/environment-variable-expose-pod-information/)
- using [a `downwardAPI` volume](/docs/tasks/inject-data-application/downward-api-volume-expose-pod-information/)

Together, these two ways of exposing Pod and container fields are called the _downward API_.
-->
有两种方法可以将 Pod 和容器字段暴露给正在运行的容器：

* 使用[环境变量](/zh-cn/docs/tasks/inject-data-application/environment-variable-expose-pod-information/)
* 使用 [`downwardAPI` 卷](/zh-cn/docs/tasks/inject-data-application/downward-api-volume-expose-pod-information/)

这两种暴露 Pod 和容器字段的方式统称为 **Downward API**。
