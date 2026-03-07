---
layout: blog
title: "Kubernetes 1.28：用于改进集群安全升级的新（Alpha）机制"
date: 2023-08-28
slug: kubernetes-1-28-feature-mixed-version-proxy-alpha
---

<!--
layout: blog
title: "Kubernetes 1.28: A New (alpha) Mechanism For Safer Cluster Upgrades"
date: 2023-08-28
slug: kubernetes-1-28-feature-mixed-version-proxy-alpha
-->

<!--
**Author:** Richa Banker (Google)
-->
**作者：** Richa Banker (Google)

**译者：** Xin Li (DaoCloud)

<!--
This blog describes the _mixed version proxy_, a new alpha feature in Kubernetes 1.28. The
mixed version proxy enables an HTTP request for a resource to be served by the correct API server
in cases where there are multiple API servers at varied versions in a cluster. For example,
this is useful during a cluster upgrade, or when you're rolling out the runtime configuration of
the cluster's control plane.
-->
本博客介绍了**混合版本代理（Mixed Version Proxy）**，这是 Kubernetes 1.28 中的一个新的
Alpha 级别特性。当集群中存在多个不同版本的 API 服务器时，混合版本代理使对资源的 HTTP 请求能够被正确的
API 服务器处理。例如，在集群升级期间或当发布集群控制平面的运行时配置时此特性非常有用。

<!--
## What problem does this solve?
When a cluster undergoes an upgrade, the kube-apiservers existing at different
versions in that scenario can serve different sets (groups, versions, resources)
of built-in resources. A resource request made in this scenario may be served by
any of the available apiservers, potentially resulting in the request ending up
at an apiserver that may not be aware of the requested resource; consequently it
being served a 404 not found error which is incorrect. Furthermore, incorrect serving
of the 404 errors can lead to serious consequences such as namespace deletion being
blocked incorrectly or objects being garbage collected mistakenly.
-->
## 这解决了什么问题？

当集群进行升级时，集群中不同版本的 kube-apiserver 为不同的内置资源集（组、版本、资源）提供服务。
在这种情况下资源请求如果由任一可用的 apiserver 提供服务，请求可能会到达无法解析此请求资源的
apiserver 中；因此，它会收到 404（"Not Found"）的响应报错，这是不正确的。
此外，返回 404 的错误服务可能会导致严重的后果，例如命名空间的删除被错误阻止或资源对象被错误地回收。

<!--
## How do we solve the problem?

{{< figure src="/images/blog/2023-08-28-a-new-alpha-mechanism-for-safer-cluster-upgrades/mvp-flow-diagram.svg" class="diagram-large" >}}
-->
## 如何解决此问题？

{{< figure src="/images/blog/2023-08-28-a-new-alpha-mechanism-for-safer-cluster-upgrades/mvp-flow-diagram_zh.svg" class="diagram-large" >}}

<!--
The new feature “Mixed Version Proxy” provides the kube-apiserver with the capability to proxy a request to a peer kube-apiserver which is aware of the requested resource and hence can serve the request. To do this, a new filter has been added to the handler chain in the API server's aggregation layer.
-->
"混合版本代理"新特性为 kube-apiserver 提供了将请求代理到对等的、
能够感知所请求的资源并因此能够服务请求的 kube-apiserver。
为此，一个全新的过滤器已被添加到 API

<!--
1. The new filter in the handler chain checks if the request is for a group/version/resource
   that the apiserver doesn't know about (using the existing
   [StorageVersion API](https://github.com/kubernetes/kubernetes/blob/release-1.28/pkg/apis/apiserverinternal/types.go#L25-L37)).
   If so, it proxies the request to one of the apiservers that is listed in the ServerStorageVersion object.
   If the identified peer apiserver fails to respond (due to reasons like network connectivity,
   race between the request being received and the controller registering the apiserver-resource info
   in ServerStorageVersion object), then error 503("Service Unavailable") is served.
2. To prevent indefinite proxying of the request, a (new for v1.28) HTTP header
   `X-Kubernetes-APIServer-Rerouted: true` is added to the original request once
   it is determined that the request cannot be served by the original API server.
   Setting that to true marks that the original API server couldn't handle the request
   and it should therefore be proxied. If a destination peer API server sees this header,
   it never proxies the request further.
3. To set the network location of a kube-apiserver that peers will use to proxy requests,
   the value passed in `--advertise-address` or (when `--advertise-address` is unspecified)
   the `--bind-address` flag is used. For users with network configurations that would not
   allow communication between peer kube-apiservers using the addresses specified in these flags,
   there is an option to pass in the correct peer address as `--peer-advertise-ip` and
   `--peer-advertise-port` flags that are introduced in this feature.
-->
1. 处理程序链中的新过滤器检查请求是否为 apiserver 无法解析的 API 组/版本/资源（使用现有的
   [StorageVersion API](https://github.com/kubernetes/kubernetes/blob/release-1.28/pkg/apis/apiserverinternal/types.go#L25-L37)）。
   如果是，它会将请求代理到 ServerStorageVersion 对象中列出的 apiserver 之一。
   如果所选的对等 apiserver 无法响应（由于网络连接、收到的请求与在 ServerStorageVersion
   对象中注册 apiserver-resource 信息的控制器之间的竞争等原因），则会出现 503（"Service Unavailable"）错误响应。
2. 为了防止无限期地代理请求，一旦最初的 API 服务器确定无法处理该请求，就会在原始请求中添加一个
  （v1.28 新增）HTTP 请求头 `X-Kubernetes-APIServer-Rerouted: true`。将其设置为 true 意味着原始
   API 服务器无法处理该请求，需要对其进行代理。如果目标侧对等 API 服务器看到此标头，则不会对该请求做进一步的代理操作。
3. 要设置 kube-apiserver 的网络位置，以供对等服务器来代理请求，将使用 `--advertise-address`
   或（当未指定`--advertise-address`时）`--bind-address` 标志所设置的值。
   如果网络配置中不允许用户在对等 kube-apiserver 之间使用这些标志中指定的地址进行通信，
   可以选择将正确的对等地址配置在此特性引入的 `--peer-advertise-ip` 和 `--peer-advertise-port`
   参数中。

<!--
## How do I enable this feature?
Following are the required steps to enable the feature:
-->
## 如何启用此特性？

以下是启用此特性的步骤：

<!--
* Download the [latest Kubernetes project](/releases/download/) (version `v1.28.0` or later)  
* Switch on the feature gate with the command line flag `--feature-gates=UnknownVersionInteroperabilityProxy=true`
  on the kube-apiservers
* Pass the CA bundle that will be used by source kube-apiserver to authenticate
  destination kube-apiserver's serving certs using the flag `--peer-ca-file`
  on the kube-apiservers. Note: this is a required flag for this feature to work.
  There is no default value enabled for this flag.
* Pass the correct ip and port of the local kube-apiserver that will be used by
  peers to connect to this kube-apiserver while proxying a request.
  Use the flags `--peer-advertise-ip` and `peer-advertise-port` to the kube-apiservers
  upon startup. If unset, the value passed to either `--advertise-address` or `--bind-address`
  is used. If those too, are unset, the host's default interface will be used.
-->
* 下载[Kubernetes 项目的最新版本](/zh-cn/releases/download/)（版本 `v1.28.0` 或更高版本）
* 在 kube-apiserver 上使用命令行标志 `--feature-gates=UnknownVersionInteroperabilityProxy=true`
  打开特性门控
* 使用 kube-apiserver 的 `--peer-ca-file` 参数为源 kube-apiserver 提供 CA 证书，
  用以验证目标 kube-apiserver 的服务证书。注意：这是此功能正常工作所必需的参数。
  此参数没有默认值。
* 为本地 kube-apiserver 设置正确的 IP 和端口，在代理请求时，对等方将使用该 IP 和端口连接到此
  `--peer-advertise-port` 命令行参数来配置 kube-apiserver。
  `--peer-advertise-port` 命令行参数。
  如果未设置这两个参数，则默认使用 `--advertise-address` 或 `--bind-address` 命令行参数的值。
  如果这些也未设置，则将使用主机的默认接口。

<!--
## What’s missing?
Currently we only proxy resource requests to a peer kube-apiserver when its determined to do so.
Next we need to address how to work discovery requests in such scenarios. Right now we are planning
to have the following capabilities for beta
-->
## 少了什么东西？

目前，我们仅在确定时将资源请求代理到对等 kube-apiserver。
接下来我们需要解决如何在这种情况下处理发现请求。
目前我们计划在测试版中提供以下特性：

<!--
* Merged discovery across all kube-apiservers
* Use an egress dialer for network connections made to peer kube-apiservers
-->
* 合并所有 kube-apiserver 的发现数据
* 使用出口拨号器（egress dialer）与对等 kube-apiserver 进行网络连接

<!--
## How can I learn more?

- Read the [Mixed Version Proxy documentation](/docs/concepts/architecture/mixed-version-proxy)
- Read [KEP-4020: Unknown Version Interoperability Proxy](https://github.com/kubernetes/enhancements/tree/master/keps/sig-api-machinery/4020-unknown-version-interoperability-proxy)
-->
## 如何进一步了解？

- 阅读[混合版本代理文档](/zh-cn/docs/concepts/architecture/mixed-version-proxy)
- 阅读 [KEP-4020：未知版本互操作代理](https://github.com/kubernetes/enhancements/tree/master/keps/sig-api-machinery/4020-unknown-version-interoperability-proxy)

<!--
## How can I get involved?
Reach us on [Slack](https://slack.k8s.io/): [#sig-api-machinery](https://kubernetes.slack.com/messages/sig-api-machinery), or through the [mailing list](https://groups.google.com/forum/#!forum/kubernetes-sig-api-machinery). 

Huge thanks to the contributors that have helped in the design, implementation, and review of this feature: Daniel Smith, Han Kang, Joe Betz, Jordan Liggit, Antonio Ojea, David Eads and Ben Luddy!
-->
## 如何参与其中？

通过 [Slack](https://slack.k8s.io/)：[#sig-api-machinery](https://kubernetes.slack.com/messages/sig-api-machinery)
或[邮件列表](https://groups.google.com/forum/#!forum/kubernetes-sig-api-machinery)
联系我们。

非常感谢帮助设计、实施和评审此特性的贡献者：
Daniel Smith、Han Kang、Joe Betz、Jordan Liggit、Antonio Ojea、David Eads 和 Ben Luddy！
