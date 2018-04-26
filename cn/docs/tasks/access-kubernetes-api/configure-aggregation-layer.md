---
title: 配置汇聚层（aggregation layer）
approvers:
- lavalamp
- cheftako
- chenopis
cn-approvers:
- zhangqx2010
---

<!--
---
title: Configure the aggregation layer
approvers:
- lavalamp
- cheftako
- chenopis
---
-->

{% capture overview %}

<!--
Configuring the [aggregation layer](/docs/concepts/api-extension/apiserver-aggregation/) allows the Kubernetes apiserver to be extended with additional APIs, which are not part of the core Kubernetes APIs.
-->
配置 [汇聚层](/docs/concepts/api-extension/apiserver-aggregation/) 使 Kubernetes apiserver 能够扩展额外的 API（非 Kubernetes 核心 API）。

{% endcapture %}

{% capture prerequisites %}

{% include task-tutorial-prereqs.md %}

<!--
**Note:** There are a few setup requirements for getting the aggregation layer working in your environment to support mutual TLS auth between the proxy and extension apiservers. Kubernetes and the kube-apiserver have multiple CAs, so make sure that the proxy is signed by the aggregation layer CA and not by something else, like the master CA.
-->
**注意：** 为了让环境中运行的汇聚层支持代理与扩展 apiserver 间的 TLS 认证，我们需要做一些配置。Kubernetes 和 kube-apiserver 有多个 CA，所以需要确保代理的签名是由汇聚层 CA 而不是其他 CA （如 master CA）完成的。

{% endcapture %}

{% capture steps %}

<!--
## Enable apiserver flags
-->
## 启用 apiserver 的标记

<!--
Enable the aggregation layer via the following kube-apiserver flags. They may have already been taken care of by your provider.
-->
通过以下 kube-apiserver 标记启用汇聚层。这些标记必须已经被服务提供商实现。

    --requestheader-client-ca-file=<path to aggregator CA cert>
    --requestheader-allowed-names=aggregator
    --requestheader-extra-headers-prefix=X-Remote-Extra-
    --requestheader-group-headers=X-Remote-Group
    --requestheader-username-headers=X-Remote-User
    --proxy-client-cert-file=<path to aggregator proxy cert>
    --proxy-client-key-file=<path to aggregator proxy key>

<!--
If you are not running kube-proxy on a host running the API server, then you must make sure that the system is enabled with the following apiserver flag:
-->
如果 kube-proxy 没有和 API server 运行在同一台主机上，那么需要确保启用了如下 apiserver 标记：

    --enable-aggregator-routing=true

{% endcapture %}

{% capture whatsnext %}

<!--
* [Setup an extension api-server](/docs/tasks/access-kubernetes-api/setup-extension-api-server/) to work with the aggregation layer.
* For a high level overview, see [Extending the Kubernetes API with the aggregation layer](/docs/concepts/api-extension/apiserver-aggregation/).
* Learn how to [Extend the Kubernetes API Using Custom Resource Definitions](/docs/tasks/access-kubernetes-api/extend-api-custom-resource-definitions/).
-->
* [安装扩展 api-server](/docs/tasks/access-kubernetes-api/setup-extension-api-server/) 并适配汇聚层。
* 从高层次的概览，参见 [使用汇聚层扩展 Kubernetes API](/docs/concepts/api-extension/apiserver-aggregation/)。
* 学习如何 [使用自定义资源扩展 Kubernetes API](/docs/tasks/access-kubernetes-api/extend-api-custom-resource-definitions/)。

{% endcapture %}

{% include templates/task.md %}

