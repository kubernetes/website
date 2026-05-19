---
title: 混合版本代理
content_type: concept
weight: 220
---
<!--
reviewers:
- jpbetz
title: Mixed Version Proxy
content_type: concept
weight: 220
-->

<!-- overview -->

{{< feature-state feature_gate_name="UnknownVersionInteroperabilityProxy" >}}

<!--
Kubernetes {{< skew currentVersion >}} includes an alpha feature that lets an
{{< glossary_tooltip text="API Server" term_id="kube-apiserver" >}}
proxy resource requests to other _peer_ API servers. It also lets clients get 
a holistic view of resources served across the entire cluster through discovery.
This is useful when there are multiple
API servers running different versions of Kubernetes in one cluster
(for example, during a long-lived rollout to a new release of Kubernetes).
-->
Kubernetes {{<skew currentVersion>}} 包含了一个 Alpha 特性，可以让
{{<glossary_tooltip text="API 服务器" term_id="kube-apiserver">}}代理指向其他**对等**
API 服务器的资源请求。
它还允许客户通过发现功能全面了解整个集群提供的资源。
当一个集群中运行着多个 API 服务器，且各服务器的 Kubernetes 版本不同时
（例如在上线 Kubernetes 新版本的时间跨度较长时），这一特性非常有用。

<!--
This enables cluster administrators to configure highly available clusters that can be upgraded
more safely, by:
-->
这使得集群管理员能够配置高可用性集群，并能更安全地进行升级，具体方式如下：

<!--
1. ensuring that controllers relying on discovery to show a comprehensive list of resources
for important tasks always get the complete view of all resources. We call this complete cluster wide 
discovery- _Peer-aggregated discovery_ 
1. directing resource requests (made during the upgrade) to the correct kube-apiserver.
This proxying prevents users from seeing unexpected 404 Not Found errors that stem
from the upgrade process. This mechanism is called the _Mixed Version Proxy_.
-->
1. 将资源请求（在升级期间发起）导向正确的 kube-apiserver。这种代理防止用户看到由升级过程导致的意外的
   404 未找到错误。此机制被称为 **混合版本代理（Mixed Version Proxy）**。
1. 将升级过程中产生的资源请求定向到正确的 kube-apiserver。
   这种代理机制可以防止用户看到因升级过程导致的意外 404 Not Found 错误。
   这种机制称为混合版本代理。

<!--
## Enabling Peer-aggregated Discovery and Mixed Version Proxy

Ensure that `UnknownVersionInteroperabilityProxy` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/#UnknownVersionInteroperabilityProxy)
is enabled when you start the {{< glossary_tooltip text="API Server" term_id="kube-apiserver" >}}:
-->
## 启用对等聚合发现和混合版本代理

当你启动 {{<glossary_tooltip text="API 服务器" term_id="kube-apiserver">}}时，
确保启用了 `UnknownVersionInteroperabilityProxy`
[特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/#UnknownVersionInteroperabilityProxy)：

<!--
```shell
kube-apiserver \
--feature-gates=UnknownVersionInteroperabilityProxy=true \
# required command line arguments for this feature
--peer-ca-file=<path to kube-apiserver CA cert>
--proxy-client-cert-file=<path to aggregator proxy cert>,
--proxy-client-key-file=<path to aggregator proxy key>,
--requestheader-client-ca-file=<path to aggregator CA cert>,
# requestheader-allowed-names can be set to blank to allow any Common Name
--requestheader-allowed-names=<valid Common Names to verify proxy client cert against>,

# optional flags for this feature
--peer-advertise-ip=`IP of this kube-apiserver that should be used by peers to proxy requests`
--peer-advertise-port=`port of this kube-apiserver that should be used by peers to proxy requests`

# …and other flags as usual
```
-->
```shell
kube-apiserver \
--feature-gates=UnknownVersionInteroperabilityProxy=true \
# 需要为此特性添加的命令行参数
--peer-ca-file=<指向 kube-apiserver CA 证书的路径>
--proxy-client-cert-file=<指向聚合器代理证书的路径>,
--proxy-client-key-file=<指向聚合器代理密钥的路径>,
--requestheader-client-ca-file=<指向聚合器 CA 证书的路径>,
# requestheader-allowed-names 可设置为空以允许所有 Common Name
--requestheader-allowed-names=<验证代理客户端证书的合法 Common Name>,

# 此特性的可选标志
--peer-advertise-ip=`应由对等方用于代理请求的 kube-apiserver IP`
--peer-advertise-port=`应由对等方用于代理请求的 kube-apiserver 端口`

# ... 和其他常规标志
```

<!--
### Proxy transport and authentication between API servers {#transport-and-authn}

* The source kube-apiserver reuses the
  [existing APIserver client authentication flags](/docs/tasks/extend-kubernetes/configure-aggregation-layer/#kubernetes-apiserver-client-authentication)
  `--proxy-client-cert-file` and `--proxy-client-key-file` to present its identity that
  will be verified by its peer (the destination kube-apiserver). The destination API server
  verifies that peer connection based on the configuration you specify using the
  `--requestheader-client-ca-file` command line argument.

* To authenticate the destination server's serving certs, you must configure a certificate
  authority bundle by specifying the `--peer-ca-file` command line argument to the **source** API server.
-->
### API 服务器之间的代理传输和身份验证   {#transport-and-authn}

* 源 kube-apiserver
  重用[现有的 API 服务器客户端身份验证标志](/zh-cn/docs/tasks/extend-kubernetes/configure-aggregation-layer/#kubernetes-apiserver-client-authentication)
  `--proxy-client-cert-file` 和 `--proxy-client-key-file` 来表明其身份，供对等（目标 kube-apiserver）验证。
  目标 API 服务器根据你使用 `--requestheader-client-ca-file` 命令行参数指定的配置来验证对等连接。

* 要对目标服务器所用的证书进行身份验证，必须通过指定 `--peer-ca-file` 命令行参数来为**源**
  API 服务器配置一个证书机构包。

<!--
### Configuration for peer API server connectivity

To set the network location of a kube-apiserver that peers will use to proxy requests, use the
`--peer-advertise-ip` and `--peer-advertise-port` command line arguments to kube-apiserver or specify
these fields in the API server configuration file.
If these flags are unspecified, peers will use the value from either `--advertise-address` or
`--bind-address` command line argument to the kube-apiserver.
If those too, are unset, the host's default interface is used.
-->
### 对等 API 服务器连接的配置   {#config-for-peer-apiserver-connectivity}

要设置 kube-apiserver 的网络位置以供对等方来代理请求，
使用为 kube-apiserver 设置的 `--peer-advertise-ip` 和 `--peer-advertise-port` 命令行参数，
或在 API 服务器配置文件中指定这些字段。如果未指定这些参数，对等方将使用 `--advertise-address`
或 `--bind-address` 命令行参数的值。如果这些也未设置，则使用主机的默认接口。

<!--
## Peer-aggregated discovery

When you enable the feature, discovery requests are automatically enabled to serve
a comprehensive discovery document (listing all resources served by any apiserver in the cluster)
by default. 

If you would like to request
a non peer-aggregated discovery document, you can indicate so by adding the following Accept header to the discovery request:
-->
## 对等聚合发现    {#peer-aggregated-discovery}

当你启用该特性时，默认情况下，发现请求会自动提供一个全面的发现文档
（列出集群中任何 API 服务器提供的所有资源）。

如果你想要请求一个非对等聚合的发现文档，可以通过在发现请求中添加以下 Accept 标头来表明：

```
application/json;g=apidiscovery.k8s.io;v=v2;as=APIGroupDiscoveryList;profile=nopeer
```

{{< note >}}
<!--
Peer-aggregated discovery is only supported
for [Aggregated Discovery](/docs/concepts/overview/kubernetes-api/#aggregated-discovery) requests
to the `/apis` endpoint and not for [Unaggregated (Legacy) Discovery](/docs/concepts/overview/kubernetes-api/#unaggregated-discovery) requests.
-->
对等聚合发现仅支持向 `/apis`
端点发出的[聚合发现](/zh-cn/docs/concepts/overview/kubernetes-api/#aggregated-discovery)请求，
而不支持[未聚合（旧版）发现](/zh-cn/docs/concepts/overview/kubernetes-api/#unaggregated-discovery)请求。
{{< /note >}}

<!--
## Mixed version proxying

When you enable mixed version proxying, the [aggregation layer](/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/)
loads a special filter that does the following:
-->
## 混合版本代理   {#mixed-version-proxying}

启用混合版本代理时，
[聚合层](/zh-cn/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/)会加载一个特殊的过滤器，
完成以下操作：

<!--
* When a resource request reaches an API server that cannot serve that API
  (either because it is at a version pre-dating the introduction of the API or the API is turned off on the API server)
  the API server attempts to send the request to a peer API server that can serve the requested API.
  It does so by identifying API groups / versions / resources that the local server doesn't recognise,
  and tries to proxy those requests to a peer API server that is capable of handling the request.
* If the peer API server fails to respond, the _source_ API server responds with 503 ("Service Unavailable") error.
-->
* 当资源请求到达无法提供该 API 的 API 服务器时
  （可能的原因是服务器早于该 API 的正式引入日期或该 API 在 API 服务器上被关闭），
  API 服务器会尝试将请求发送到能够提供所请求 API 的对等 API 服务器。
  API 服务器通过发现本地服务器无法识别的 API 组/版本/资源来实现这一点，
  并尝试将这些请求代理到能够处理这些请求的对等 API 服务器。
* 如果对等 API 服务器无法响应，则**源** API 服务器将以 503（"Service Unavailable"）错误进行响应。

<!--
### How it works under the hood

When an API Server receives a resource request, it first checks which API servers can
serve the requested resource. This check happens using the non peer-aggregated discovery document.
[`StorageVersion` API](/docs/reference/generated/kubernetes-api/v{{< skew currentVersion >}}/#storageversioncondition-v1alpha1-internal-apiserver-k8s-io).
-->
### 内部工作原理   {#how-it-works-under-the-hood}

当 API 服务器收到一个资源请求时，它首先检查哪些 API 服务器可以提供所请求的资源。
此检查是使用非对等聚合的发现文档进行的。


<!--
* If the resource is listed in the non peer-aggregated discovery document retrieved from the API server that received the request(for example, `GET /api/v1/pods/some-pod`), the request is handled locally.

* If the resource in a request (for example, `GET /apis/resource.k8s.io/v1beta1/resourceclaims`) is not found in the non peer-aggregated discovery document retrieved from the API server trying to handle the request (the _handling API server_), likely because the `resource.k8s.io/v1beta1` API was introduced in a newer Kubernetes version and the _handling API server_ is running an older version that does not support it, then the _handling API server_ fetches the peer API servers that do serve the relevant API group / version / resource (`resource.k8s.io/v1beta1/resourceclaims` in this case) by checking the non peer-aggregated discovery documents from all peer API servers. The _handling API server_ then proxies the request to one of the matching peer kube-apiservers that are aware of the requested resource.
-->
* 如果请求中的资源列在从接收请求的 API 服务器（例如，`GET /api/v1/pods/some-pod`）
  检索到的非对等聚合发现文档中，则该请求将在本地处理。

* 如果请求中的资源（例如，`GET /apis/resource.k8s.io/v1beta1/resourceclaims`）
  未在尝试处理该请求的 API 服务器（即处理请求的 API 服务器）检索到的非对等聚合发现文档中找到，
  可能是因为 `resource.k8s.io/v1beta1` API 是在较新的 Kubernetes 版本中引入的，
  而处理请求的 API 服务器运行的是不支持该 API 的旧版本，
  则处理请求的 API 服务器会检查所有对等 API 服务器的非对等聚合发现文档，
  以获取提供相关 API 组/版本/资源（在本例中为 `resource.k8s.io/v1beta1/resourceclaims`）
  的对等 API 服务器。
  然后，处理 API 服务器将请求代理到已知所请求资源的匹配对等 kube-apiserver 之一。

<!--
* If there is no peer known for that API group / version / resource, the handling API server
passes the request to its own handler chain which should eventually return a 404 ("Not Found") response.

* If the handling API server has identified and selected a peer API server, but that peer fails
to respond (for reasons such as network connectivity issues, or a data race between the request
being received and a controller registering the peer's info into the control plane), then the handling
API server responds with a 503 ("Service Unavailable") error.
-->
* 如果没有对等方了解所给的 API 组/版本/资源，则处理请求的 API 服务器将请求传递给自己的处理程序链，
  最终应返回 404（"Not Found"）响应。

* 如果处理请求的 API 服务器已经识别并选择了一个对等 API 服务器，但该对等方无法响应
  （原因可能是网络连接问题或正接收的请求与向控制平面注册对等信息的控制器之间存在数据竞争等），
  则处理请求的 API 服务器会以 503（"Service Unavailable"）错误进行响应。
