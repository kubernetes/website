<!--
---
title: Extending the Kubernetes API with the aggregation layer
assignees:
- lavalamp
- cheftako
- chenopis
---
-->
---
title: 使用聚合层扩展Kubernetes API  
assignees:
- lavalamp
- cheftako
- chenopis
---

{% capture overview %}

<!--
The aggregation layer allows Kubernetes to be extended with additional APIs, beyond what is offered by the core Kubernetes APIs. 
-->
聚合层允许Kubernetes使用额外的API进行扩展，超出了Kubernetes核心API所提供的范围。

{% endcapture %}

{% capture body %}
<!--
## Overview

The aggregation layer enables installing additional Kubernetes-style APIs in your cluster. These can either be pre-built, existing 3rd party solutions, such as [service-catalog](https://github.com/kubernetes-incubator/service-catalog/blob/master/README.md), or user-created APIs like [apiserver-builder](https://github.com/kubernetes-incubator/apiserver-builder/blob/master/README.md), which can get you started.
-->
## 概述

聚合层允许在你的集群中安装更多的Kubernetes风格的API。这些可以是预构建的，现有的第三方解决方案，例如[service-catalog](https://github.com/kubernetes-incubator/service-catalog/blob/master/README.md),
或者是可以让你使用的用户创建的API，如[apiserver-builder](https://github.com/kubernetes-incubator/apiserver-builder/blob/master/README.md)。

<!--
In 1.7 the aggregation layer runs in-process with the kube-apiserver. Until an extension resource is registered, the aggregation layer will do nothing. To register their API, users must add an APIService object, which "claims" the URL path in the Kubernetes API. At that point, the aggregation layer will proxy anything sent to that API path (e.g. /apis/myextension.mycompany.io/v1/…) to the registered APIService. 

Ordinarily, the APIService will be implemented by an *extension-apiserver* in a pod running in the cluster. This extension-apiserver will normally need to be paired with one or more controllers if active management of the added resources is needed. As a result, the apiserver-builder will actually provide a skeleton for both. As another example, when the service-catalog is installed, it provides both the extension-apiserver and controller for the services it provides.
-->
在1.7版本中，聚合层和kube-api-server一起运行。在扩展资源被注册前，聚合层不执行任何操作。
要注册其API,用户必选添加一个APIService对象，该对象需在Kubernetes API中声明URL路径。
在这一点上，聚合层将代理发送到该API路径(e.g. /apis/myextension.mycompany.io/v1/…)的一切到注册的APIService。

通常，通过在集群中的一个pod中运行一个*extension-apiserver*来实现APIService。如果已添加的资源需要主动管理，这个extension-apiserver通常需要和一个或多个控制器配对。
因此，apiserver构建器实际上为两者提供了一个架构。
另一个例子，当service-catalog安装后，它为它提供的服务提供了extension-apiserver和控制器。

{% endcapture %}

{% capture whatsnext %}

<!--
* To get the aggregator working in your environment, [configure the aggregation layer](/docs/tasks/access-kubernetes-api/configure-aggregation-layer/).
* Then, [setup an extension api-server](/docs/tasks/access-kubernetes-api/setup-extension-api-server/) to work with the aggregation layer.
* Also, learn how to [extend the Kubernetes API using Custom Resource Definitions](/docs/tasks/access-kubernetes-api/extend-api-custom-resource-definitions/).

-->

* 使聚合层在你的环境中工作，[配置聚合层](/docs/tasks/access-kubernetes-api/configure-aggregation-layer/)。
* 然后，[设置拓展api-server](/docs/tasks/access-kubernetes-api/setup-extension-api-server/) 与聚合层一起工作.
* 另外，学习如何[使用CRD扩展Kubernetes API](/docs/tasks/access-kubernetes-api/extend-api-custom-resource-definitions/)。

{% endcapture %}

{% include templates/concept.md %}