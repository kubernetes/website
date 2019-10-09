---
title: 通过聚合层扩展 Kubernetes API
content_template: templates/concept
weight: 10
---

{{% capture overview %}}

<!--
The aggregation layer allows Kubernetes to be extended with additional APIs, beyond what is offered by the core Kubernetes APIs. 
-->

聚合层允许 Kubernetes 通过额外的 API 进行扩展，而不局限于 Kubernetes 核心 API 提供的功能。

{{% /capture %}}

{{% capture body %}}

<!--
## Overview

The aggregation layer enables installing additional Kubernetes-style APIs in your cluster. These can either be pre-built, existing 3rd party solutions, such as [service-catalog](https://github.com/kubernetes-incubator/service-catalog/blob/master/README.md), or user-created APIs like [apiserver-builder](https://github.com/kubernetes-incubator/apiserver-builder/blob/master/README.md), which can get you started.
-->
## 概述

聚合层使您的集群可以安装其他 Kubernetes 风格的 API。这些 API 可以是预编译的、第三方的解决方案提供的例如[service-catalog](https://github.com/kubernetes-incubator/service-catalog/blob/master/README.md)、或者用户创建的类似[apiserver-builder](https://github.com/kubernetes-incubator/apiserver-builder/blob/master/README.md)一样的API可以帮助你上手。

<!--
The aggregation layer runs in-process with the kube-apiserver. Until an extension resource is registered, the aggregation layer will do nothing. To register an API, users must add an APIService object, which "claims" the URL path in the Kubernetes API. At that point, the aggregation layer will proxy anything sent to that API path (e.g. /apis/myextension.mycompany.io/v1/…) to the registered APIService. 
-->

聚合层在 kube-apiserver 进程内运行。在扩展资源注册之前，聚合层不做任何事情。要注册 API，用户必须添加一个 APIService 对象，用它来申领 Kubernetes API 中的 URL 路径。自此以后，聚合层将会把发给该 API 路径的所有内容（例如 /apis/myextension.mycompany.io/v1/…）代理到已注册的 APIService。

<!--
Ordinarily, the APIService will be implemented by an *extension-apiserver* in a pod running in the cluster. This extension-apiserver will normally need to be paired with one or more controllers if active management of the added resources is needed. As a result, the apiserver-builder will actually provide a skeleton for both. As another example, when the service-catalog is installed, it provides both the extension-apiserver and controller for the services it provides.
-->

正常情况下，APIService 会实现为运行于集群中某 Pod 内的 extension-apiserver。如果需要对增加的资源进行动态管理，extension-apiserver 经常需要和一个或多个控制器一起使用。因此，apiserver-builder 同时提供用来管理新资源的 API 框架和控制器框架。另外一个例子，当安装了 service-catalog 时，它会为自己提供的服务提供 extension-apiserver 和控制器。

<!--
Extension-apiservers should have low latency connections to and from the kube-apiserver.
In particular, discovery requests are required to round-trip from the kube-apiserver in five seconds or less.
If your deployment cannot achieve this, you should consider how to change it.  For now, setting the
`EnableAggregatedDiscoveryTimeout=false` feature gate on the kube-apiserver
will disable the timeout restriction. It will be removed in a future release.
-->

扩展 api 服务与 kube-apiserver 之间的连接应该具有低延迟的特性。
特别是，发现请求和 kube-apiserver 的请求响应时间需要在五秒钟或更短的时间内。
如果您的部署无法实现此目的，则应考虑如何进行改进。
现在，利用 kube-apiserver 上的`EnableAggregatedDiscoveryTimeout = false`功能可以禁用超时限制。但是，它将在将来的版本中删除。
{{% /capture %}}

{{% capture whatsnext %}}

<!--
* To get the aggregator working in your environment, [configure the aggregation layer](/docs/tasks/access-kubernetes-api/configure-aggregation-layer/).
* Then, [setup an extension api-server](/docs/tasks/access-kubernetes-api/setup-extension-api-server/) to work with the aggregation layer.
* Also, learn how to [extend the Kubernetes API using Custom Resource Definitions](/docs/tasks/access-kubernetes-api/extend-api-custom-resource-definitions/).
-->

* 阅读[配置聚合层](/docs/tasks/access-kubernetes-api/configure-aggregation-layer/) 文档，了解如何在自己的环境中启用聚合器（aggregator）。
* 然后[安装扩展的 api-server](/docs/tasks/access-kubernetes-api/setup-extension-api-server/) 来开始使用聚合层。
* 也可以学习怎样 [使用客户资源定义扩展 Kubernetes API](/docs/tasks/access-kubernetes-api/extend-api-custom-resource-definitions/)。

{{% /capture %}}


