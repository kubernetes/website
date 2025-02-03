---
title: Kubernetes API 聚合层
content_type: concept
weight: 20
---

<!--
title: Kubernetes API Aggregation Layer
reviewers:
- lavalamp
- cheftako
- chenopis
content_type: concept
weight: 20
-->

<!-- overview -->

<!--
The aggregation layer allows Kubernetes to be extended with additional APIs, beyond what is
offered by the core Kubernetes APIs.
The additional APIs can either be ready-made solutions such as a
[metrics server](https://github.com/kubernetes-sigs/metrics-server), or APIs that you develop yourself.
-->
使用聚合层（Aggregation Layer），用户可以通过附加的 API 扩展 Kubernetes，
而不局限于 Kubernetes 核心 API 提供的功能。
这里的附加 API 可以是现成的解决方案，比如
[metrics server](https://github.com/kubernetes-sigs/metrics-server)，
或者你自己开发的 API。

<!--
The aggregation layer is different from
[Custom Resource Definitions](/docs/concepts/extend-kubernetes/api-extension/custom-resources/),
which are a way to make the {{< glossary_tooltip term_id="kube-apiserver" text="kube-apiserver" >}}
recognise new kinds of object.
-->
聚合层不同于
[定制资源定义（Custom Resource Definitions）](/zh-cn/docs/concepts/extend-kubernetes/api-extension/custom-resources/)。
后者的目的是让 {{< glossary_tooltip term_id="kube-apiserver" text="kube-apiserver" >}}
能够识别新的对象类别（Kind）。

<!-- body -->

<!--
## Aggregation layer

The aggregation layer runs in-process with the kube-apiserver. Until an extension resource is
registered, the aggregation layer will do nothing. To register an API, you add an _APIService_
object, which "claims" the URL path in the Kubernetes API. At that point, the aggregation layer
will proxy anything sent to that API path (e.g. `/apis/myextension.mycompany.io/v1/…`) to the
registered APIService.
-->
## 聚合层  {#aggregation-layer}

聚合层在 kube-apiserver 进程内运行。在扩展资源注册之前，聚合层不做任何事情。
要注册 API，你可以添加一个 **APIService** 对象，用它来 “申领” Kubernetes API 中的 URL 路径。
自此以后，聚合层将把发给该 API 路径的所有内容（例如 `/apis/myextension.mycompany.io/v1/…`）
转发到已注册的 APIService。

<!--
The most common way to implement the APIService is to run an *extension API server* in Pod(s) that
run in your cluster. If you're using the extension API server to manage resources in your cluster,
the extension API server (also written as "extension-apiserver") is typically paired with one or
more {{< glossary_tooltip text="controllers" term_id="controller" >}}. The apiserver-builder
library provides a skeleton for both extension API servers and the associated controller(s).
-->
APIService 的最常见实现方式是在集群中某 Pod 内运行**扩展 API 服务器（Extension API Server）**。
如果你在使用扩展 API 服务器来管理集群中的资源，该扩展 API 服务器（也被写成 "extension-apiserver"）
一般需要和一个或多个{{< glossary_tooltip text="控制器" term_id="controller" >}}一起使用。
apiserver-builder 库同时提供构造扩展 API 服务器和控制器框架代码。

<!--
### Response latency

Extension API servers should have low latency networking to and from the kube-apiserver.
Discovery requests are required to round-trip from the kube-apiserver in five seconds or less.

If your extension API server cannot achieve that latency requirement, consider making changes that
let you meet it.
-->
### 响应延迟  {#response-latency}

扩展 API 服务器（Extension API Server）与 kube-apiserver 之间需要存在低延迟的网络连接。
发现请求需要在五秒钟或更短的时间内完成到 kube-apiserver 的往返。

如果你的扩展 API 服务器无法满足这一延迟要求，应考虑如何更改配置以满足需要。

## {{% heading "whatsnext" %}}

<!--
* To get the aggregator working in your environment, [configure the aggregation layer](/docs/tasks/extend-kubernetes/configure-aggregation-layer/).
* Then, [setup an extension api-server](/docs/tasks/extend-kubernetes/setup-extension-api-server/) to work with the aggregation layer.
* Read about [APIService](/docs/reference/kubernetes-api/cluster-resources/api-service-v1/) in the API reference

Alternatively: learn how to
[extend the Kubernetes API using Custom Resource Definitions](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/).
-->
* 阅读[配置聚合层](/zh-cn/docs/tasks/extend-kubernetes/configure-aggregation-layer/)文档，
  了解如何在自己的环境中启用聚合器。
* 接下来，了解[安装扩展 API 服务器](/zh-cn/docs/tasks/extend-kubernetes/setup-extension-api-server/)，
  开始使用聚合层。
* 从 API 参考资料中研究关于 [APIService](/zh-cn/docs/reference/kubernetes-api/cluster-resources/api-service-v1/) 的内容。

或者，学习如何[使用 CustomResourceDefinition 扩展 Kubernetes API](/zh-cn/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/)。
