---
title: 配置聚合层
reviewers:
- lavalamp
- cheftako
- chenopis
content_template: templates/task
weight: 10
---
<!--
---
title: Configure the Aggregation Layer
reviewers:
- lavalamp
- cheftako
- chenopis
content_template: templates/task
weight: 10
---
-->

{{% capture overview %}}

配置[聚合层](/docs/concepts/api-extension/apiserver-aggregation/)允许 Kubernetes apiserver 使用其它 API 进行扩展，这些 API 不是核心 Kubernetes API 的一部分。
<!--
Configuring the [aggregation layer](/docs/concepts/api-extension/apiserver-aggregation/) allows the Kubernetes apiserver to be extended with additional APIs, which are not part of the core Kubernetes APIs.
-->

{{% /capture %}}

{{% capture prerequisites %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

{{< note >}}
**注意:** 在您的环境中启用聚合层时，如需要支持代理和扩展 apiserver 之间的双向 TLS 身份验证，需要满足一些设置要求。
Kubernetes 和 kube-apiserver 都有多个 CA，因此要确保代理的证书由聚合层 CA 签署，而不是由其它 CA （如主 CA）来签署。
{{< /note >}}
<!--
{{< note >}}
**Note:** There are a few setup requirements for getting the aggregation layer working in your environment to support mutual TLS auth between the proxy and extension apiservers. Kubernetes and the kube-apiserver have multiple CAs, so make sure that the proxy is signed by the aggregation layer CA and not by something else, like the master CA.
{{< /note >}}
-->

{{% /capture %}}

{{% capture steps %}}

## 启用 apiserver 参数

通过以下 kube-apiserver 参数启用聚合层。这一操作可能已由您的供应商完成。

    --requestheader-client-ca-file=<path to aggregator CA cert>
    --requestheader-allowed-names=front-proxy-client
    --requestheader-extra-headers-prefix=X-Remote-Extra-
    --requestheader-group-headers=X-Remote-Group
    --requestheader-username-headers=X-Remote-User
    --proxy-client-cert-file=<path to aggregator proxy cert>
    --proxy-client-key-file=<path to aggregator proxy key>

**警告**：除非您了解 CA 的风险和保护 CA 使用的机制，否则**不要**在不同的场合重复使用同一 CA。

如果您未在运行 API 服务器的主机上运行 kube-proxy ，则必须确保配置了以下 apiserver 参数：

    --enable-aggregator-routing=true
<!--
## Enable apiserver flags

Enable the aggregation layer via the following kube-apiserver flags. They may have already been taken care of by your provider.

    --requestheader-client-ca-file=<path to aggregator CA cert>
    --requestheader-allowed-names=front-proxy-client
    --requestheader-extra-headers-prefix=X-Remote-Extra-
    --requestheader-group-headers=X-Remote-Group
    --requestheader-username-headers=X-Remote-User
    --proxy-client-cert-file=<path to aggregator proxy cert>
    --proxy-client-key-file=<path to aggregator proxy key>

WARNING: do **not** reuse a CA that is used in a different context unless you understand the risks and the mechanisms to protect the CA's usage.

If you are not running kube-proxy on a host running the API server, then you must make sure that the system is enabled with the following apiserver flag:

    --enable-aggregator-routing=true
-->

{{% /capture %}}

{{% capture whatsnext %}}

* [安装一个扩展的 api-server ](/zh/docs/tasks/access-kubernetes-api/setup-extension-api-server/) 以使用聚合层。
* 有关高级概述，请参阅[使用聚合层扩展 Kubernetes API ](/docs/concepts/api-extension/apiserver-aggregation/)。
* 了解如何[使用自定义资源扩展 Kubernetes API ](/docs/tasks/access-kubernetes-api/extend-api-custom-resource-definitions/)。

<!--
* [Setup an extension api-server](/docs/tasks/access-kubernetes-api/setup-extension-api-server/) to work with the aggregation layer.
* For a high level overview, see [Extending the Kubernetes API with the aggregation layer](/docs/concepts/api-extension/apiserver-aggregation/).
* Learn how to [Extend the Kubernetes API Using Custom Resource Definitions](/docs/tasks/access-kubernetes-api/extend-api-custom-resource-definitions/).
-->

{{% /capture %}}
