---
layout: blog
title: "用于 Kubernetes 集群 DNS 的 CoreDNS GA 正式发布"
date: 2018-07-10
slug: coredns-ga-for-kubernetes-cluster-dns
---
<!--
layout: blog
title: "CoreDNS GA for Kubernetes Cluster DNS"
date: 2018-07-10
--->

<!--
**Author**: John Belamaric (Infoblox)

**Editor’s note: this post is part of a [series of in-depth articles](https://kubernetes.io/blog/2018/06/27/kubernetes-1.11-release-announcement/) on what’s new in Kubernetes 1.11**
--->
**作者**：John Belamaric (Infoblox)

**编者注：这篇文章是 [系列深度文章](https://kubernetes.io/blog/2018/06/27/kubernetes-1.11-release-announcement/) 中的一篇，介绍了 Kubernetes 1.11 新增的功能

<!--
## Introduction

In Kubernetes 1.11, [CoreDNS](https://coredns.io) has reached General Availability (GA) for DNS-based service discovery, as an alternative to the kube-dns addon. This means that CoreDNS will be offered as an option in upcoming versions of the various installation tools. In fact, the kubeadm team chose to make it the default option starting with Kubernetes 1.11.
--->
## 介绍

在 Kubernetes 1.11 中，[CoreDNS](https://coredns.io) 已经达到基于 DNS 服务发现的 General Availability (GA)，可以替代 kube-dns 插件。这意味着 CoreDNS 会作为即将发布的安装工具的选项之一上线。实际上，从 Kubernetes 1.11 开始，kubeadm 团队选择将它设为默认选项。

<!--
DNS-based service discovery has been part of Kubernetes for a long time with the kube-dns cluster addon. This has generally worked pretty well, but there have been some concerns around the reliability, flexibility and security of the implementation.

CoreDNS is a general-purpose, authoritative DNS server that provides a backwards-compatible, but extensible, integration with Kubernetes. It resolves the issues seen with kube-dns, and offers a number of unique features that solve a wider variety of use cases.

In this article, you will learn about the differences in the implementations of kube-dns and CoreDNS, and some of the helpful extensions offered by CoreDNS.
--->
很久以来， kube-dns 集群插件一直是 Kubernetes 的一部分，用来实现基于 DNS 的服务发现。
通常，此插件运行平稳，但对于实现的可靠性、灵活性和安全性仍存在一些疑虑。

CoreDNS 是通用的、权威的 DNS 服务器，提供与 Kubernetes 向后兼容但可扩展的集成。它解决了 kube-dns 遇到的问题，并提供了许多独特的功能，可以解决各种用例。

在本文中，您将了解 kube-dns 和 CoreDNS 的实现有何差异，以及 CoreDNS 提供的一些非常有用的扩展。

<!--
## Implementation differences

In kube-dns, several containers are used within a single pod: `kubedns`, `dnsmasq`, and `sidecar`. The `kubedns`
container watches the Kubernetes API and serves DNS records based on the [Kubernetes DNS specification](https://github.com/kubernetes/dns/blob/master/docs/specification.md), `dnsmasq` provides caching and stub domain support, and `sidecar` provides metrics and health checks.
--->
## 实现差异

在 kube-dns 中，一个 Pod 中使用多个 容器：`kubedns`、`dnsmasq`、和 `sidecar`。`kubedns` 容器监视 Kubernetes API 并根据 [Kubernetes DNS 规范](https://github.com/kubernetes/dns/blob/master/docs/specification.md) 提供 DNS 记录，`dnsmasq` 提供缓存和存根域支持，`sidecar` 提供指标和健康检查。

<!--
This setup leads to a few issues that have been seen over time. For one, security vulnerabilities in `dnsmasq` have led to the need
for a security-patch release of Kubernetes in the past. Additionally, because `dnsmasq` handles the stub domains,
but `kubedns` handles the External Services, you cannot use a stub domain in an external service, which is very
limiting to that functionality (see [dns#131](https://github.com/kubernetes/dns/issues/131)).

All of these functions are done in a single container in CoreDNS, which is running a process written in Go. The
different plugins that are enabled replicate (and enhance) the functionality found in kube-dns.
--->
随着时间的推移，此设置会导致一些问题。一方面，以往 `dnsmasq` 中的安全漏洞需要通过发布 Kubernetes 的安全补丁来解决。但是，由于 `dnsmasq` 处理存根域，而 `kubedns` 处理外部服务，因此您不能在外部服务中使用存根域，导致这个功能具有局限性（请参阅 [dns#131](https://github.com/kubernetes/dns/issues/131)）。

在 CoreDNS 中，所有这些功能都是在一个容器中完成的，该容器运行用 Go 编写的进程。所启用的不同插件可复制（并增强）在 kube-dns 中存在的功能。

<!--
## Configuring CoreDNS

In kube-dns, you can [modify a ConfigMap](https://kubernetes.io/blog/2017/04/configuring-private-dns-zones-upstream-nameservers-kubernetes/) to change the behavior of your service discovery. This allows the addition of
features such as serving stub domains, modifying upstream nameservers, and enabling federation.
--->
## 配置 CoreDNS

在 kube-dns 中，您可以 [修改 ConfigMap](https://kubernetes.io/blog/2017/04/configuring-private-dns-zones-upstream-nameservers-kubernetes/) 来更改服务发现的行为。用户可以添加诸如为存根域提供服务、修改上游名称服务器以及启用联盟之类的功能。

<!--
In CoreDNS, you similarly can modify the ConfigMap for the CoreDNS [Corefile](https://coredns.io/2017/07/23/corefile-explained/) to change how service discovery
works. This Corefile configuration offers many more options than you will find in kube-dns, since it is the
primary configuration file that CoreDNS uses for configuration of all of its features, even those that are not
Kubernetes related.

When upgrading from kube-dns to CoreDNS using `kubeadm`, your existing ConfigMap will be used to generate the
customized Corefile for you, including all of the configuration for stub domains, federation, and upstream nameservers. See [Using CoreDNS for Service Discovery](/docs/tasks/administer-cluster/coredns/) for more details.
--->
在 CoreDNS 中，您可以类似地修改 CoreDNS [Corefile](https://coredns.io/2017/07/23/corefile-explained/) 的 ConfigMap，以更改服务发现的工作方式。这种 Corefile 配置提供了比 kube-dns 中更多的选项，因为它是 CoreDNS 用于配置所有功能的主要配置文件，即使与 Kubernetes 不相关的功能也可以操作。

使用 `kubeadm` 将 kube-dns 升级到 CoreDNS 时，现有的 ConfigMap 将被用来为您生成自定义的 Corefile，包括存根域、联盟和上游名称服务器的所有配置。更多详细信息，请参见
[使用 CoreDNS 进行服务发现](/zh-cn/docs/tasks/administer-cluster/coredns/)。

<!--
## Bug fixes and enhancements

There are several open issues with kube-dns that are resolved in CoreDNS, either in default configuration or with some customized configurations.
--->
## 错误修复和增强

在 CoreDNS 中解决了 kube-dn 的多个未解决问题，无论是默认配置还是某些自定义配置。

<!--
  * [dns#55 - Custom DNS entries for kube-dns](https://github.com/kubernetes/dns/issues/55) may be handled using the "fallthrough" mechanism in the [kubernetes plugin](https://coredns.io/plugins/kubernetes), using the [rewrite plugin](https://coredns.io/plugins/rewrite), or simply serving a subzone with a different plugin such as the [file plugin](https://coredns.io/plugins/file).

  * [dns#116 - Only one A record set for headless service with pods having single hostname](https://github.com/kubernetes/dns/issues/116). This issue is fixed without any additional configuration.
  * [dns#131 - externalName not using stubDomains settings](https://github.com/kubernetes/dns/issues/131). This issue is fixed without any additional configuration.
  * [dns#167 - enable skyDNS round robin A/AAAA records](https://github.com/kubernetes/dns/issues/167). The equivalent functionality can be configured using the [load balance plugin](https://coredns.io/plugins/loadbalance).
  * [dns#190 - kube-dns cannot run as non-root user](https://github.com/kubernetes/dns/issues/190). This issue is solved today by using a non-default image, but it will be made the default CoreDNS behavior in a future release.
  * [dns#232 - fix pod hostname to be podname for dns srv records](https://github.com/kubernetes/dns/issues/232) is an enhancement that is supported through the "endpoint_pod_names" feature described below.
--->
  * [dns#55 - kube-dns 的自定义 DNS 条目](https://github.com/kubernetes/dns/issues/55) 可以使用 [kubernetes 插件](https://coredns.io/plugins/kubernetes) 中的 "fallthrough" 机制，使用 [rewrite 插件](https://coredns.io/plugins/rewrite)，或者分区使用不同的插件，例如 [file 插件](https://coredns.io/plugins/file)。
  
  * [dns#116 - 对具有相同主机名的、提供无头服务服务的 Pod 仅设置了一个 A 记录](https://github.com/kubernetes/dns/issues/116)。无需任何其他配置即可解决此问题。
  * [dns#131 - externalName 未使用 stubDomains 设置](https://github.com/kubernetes/dns/issues/131)。无需任何其他配置即可解决此问题。
  * [dns#167 - 允许 skyDNS 为 A/AAAA 记录提供轮换](https://github.com/kubernetes/dns/issues/167)。可以使用 [负载均衡插件](https://coredns.io/plugins/loadbalance) 配置等效功能。
  * [dns#190 - kube-dns 无法以非 root 用户身份运行](https://github.com/kubernetes/dns/issues/190)。今天，通过使用 non-default 镜像解决了此问题，但是在将来的版本中，它将成为默认的 CoreDNS 行为。
  * [dns#232 - 在 dns srv 记录中修复 pod hostname 为 podname](https://github.com/kubernetes/dns/issues/232) 是通过下面提到的 "endpoint_pod_names" 功能进行支持的增强功能。


<!--
## Metrics

The functional behavior of the default CoreDNS configuration is the same as kube-dns. However,
one difference you need to be aware of is that the published metrics are not the same. In kube-dns,
you get separate metrics for `dnsmasq` and `kubedns` (skydns). In CoreDNS there is a completely
different set of metrics, since it is all a single process. You can find more details on these
metrics on the CoreDNS [Prometheus plugin](https://coredns.io/plugins/metrics/) page.
--->
## 指标

CoreDNS 默认配置的功能性行为与 kube-dns 相同。但是，你需要了解的差别之一是二者发布的指标是不同的。在 kube-dns 中，您将分别获得 `dnsmasq` 和 `kubedns`（skydns）的度量值。在 CoreDNS 中，存在一组完全不同的指标，因为它们在同一个进程中。您可以在 CoreDNS [Prometheus 插件](https://coredns.io/plugins/metrics/) 页面上找到有关这些指标的更多详细信息。

<!--
## Some special features

The standard CoreDNS Kubernetes configuration is designed to be backwards compatible with the prior
kube-dns behavior. But with some configuration changes, CoreDNS can allow you to modify how the
DNS service discovery works in your cluster. A number of these features are intended to still be
compliant with the [Kubernetes DNS specification](https://github.com/kubernetes/dns/blob/master/docs/specification.md);
they enhance functionality but remain backward compatible. Since CoreDNS is not
*only* made for Kubernetes, but is instead a general-purpose DNS server, there are many things you
can do beyond that specification.
--->
## 一些特殊功能

标准的 CoreDNS Kubernetes 配置旨在与以前的 kube-dns 在行为上向后兼容。但是，通过进行一些配置更改，CoreDNS 允许您修改 DNS 服务发现在集群中的工作方式。这些功能中的许多功能仍要符合 [Kubernetes DNS规范](https://github.com/kubernetes/dns/blob/master/docs/specification.md)；它们在增强了功能的同时保持向后兼容。由于 CoreDNS 并非 *仅* 用于 Kubernetes，而是通用的 DNS 服务器，因此您可以做很多超出该规范的事情。

<!--
### Pods verified mode

In kube-dns, pod name records are "fake". That is, any "a-b-c-d.namespace.pod.cluster.local" query will
return the IP address "a.b.c.d". In some cases, this can weaken the identity guarantees offered by TLS. So,
CoreDNS offers a "pods verified" mode, which will only return the IP address if there is a pod in the
specified namespace with that IP address.
--->
### Pod 验证模式

在 kube-dns 中，Pod 名称记录是 "伪造的"。也就是说，任何 "a-b-c-d.namespace.pod.cluster.local" 查询都将返回 IP 地址 "a.b.c.d"。在某些情况下，这可能会削弱 TLS 提供的身份确认。因此，CoreDNS 提供了一种 "Pod 验证" 的模式，该模式仅在指定名称空间中存在具有该 IP 地址的 Pod 时才返回 IP 地址。

<!--
### Endpoint names based on pod names

In kube-dns, when using a headless service, you can use an SRV request to get a list of
all endpoints for the service:
--->
### 基于 Pod 名称的端点名称

在 kube-dns 中，使用无头服务时，可以使用 SRV 请求获取该服务的所有端点的列表：

```
dnstools# host -t srv headless
headless.default.svc.cluster.local has SRV record 10 33 0 6234396237313665.headless.default.svc.cluster.local.
headless.default.svc.cluster.local has SRV record 10 33 0 6662363165353239.headless.default.svc.cluster.local.
headless.default.svc.cluster.local has SRV record 10 33 0 6338633437303230.headless.default.svc.cluster.local.
dnstools#
```

<!--
However, the endpoint DNS names are (for practical purposes) random. In CoreDNS, by default, you get endpoint
DNS names based upon the endpoint IP address:
--->
但是，端点 DNS 名称（出于实际目的）是随机的。在 CoreDNS 中，默认情况下，您所获得的端点 DNS 名称是基于端点 IP 地址生成的：

```
dnstools# host -t srv headless
headless.default.svc.cluster.local has SRV record 0 25 443 172-17-0-14.headless.default.svc.cluster.local.
headless.default.svc.cluster.local has SRV record 0 25 443 172-17-0-18.headless.default.svc.cluster.local.
headless.default.svc.cluster.local has SRV record 0 25 443 172-17-0-4.headless.default.svc.cluster.local.
headless.default.svc.cluster.local has SRV record 0 25 443 172-17-0-9.headless.default.svc.cluster.local.
```

<!--
For some applications, it is desirable to have the pod name for this, rather than the pod IP
address (see for example [kubernetes#47992](https://github.com/kubernetes/kubernetes/issues/47992) and [coredns#1190](https://github.com/coredns/coredns/pull/1190)). To enable this in CoreDNS, you specify the "endpoint_pod_names" option in your Corefile, which results in this:
--->
对于某些应用程序，你会希望在这里使用 Pod 名称，而不是 Pod IP 地址（例如，参见 [kubernetes#47992](https://github.com/kubernetes/kubernetes/issues/47992) 和 [coredns#1190](https://github.com/coredns/coredns/pull/1190)）。要在 CoreDNS 中启用此功能，请在 Corefile 中指定 "endpoint_pod_names" 选项，结果如下：

```
dnstools# host -t srv headless
headless.default.svc.cluster.local has SRV record 0 25 443 headless-65bb4c479f-qv84p.headless.default.svc.cluster.local.
headless.default.svc.cluster.local has SRV record 0 25 443 headless-65bb4c479f-zc8lx.headless.default.svc.cluster.local.
headless.default.svc.cluster.local has SRV record 0 25 443 headless-65bb4c479f-q7lf2.headless.default.svc.cluster.local.
headless.default.svc.cluster.local has SRV record 0 25 443 headless-65bb4c479f-566rt.headless.default.svc.cluster.local.
```

<!--
### Autopath

CoreDNS also has a special feature to improve latency in DNS requests for external names. In Kubernetes, the
DNS search path for pods specifies a long list of suffixes. This enables the use of short names when requesting
services in the cluster - for example, "headless" above, rather than "headless.default.svc.cluster.local". However,
when requesting an external name  - "infoblox.com", for example - several invalid DNS queries are made by the client,
requiring a roundtrip from the client to kube-dns each time (actually to `dnsmasq` and then to `kubedns`, since [negative caching is disabled](https://github.com/kubernetes/dns/issues/121)):
--->
### 自动路径

CoreDNS 还具有一项特殊功能，可以改善 DNS 中外部名称请求的延迟。在 Kubernetes 中，Pod 的 DNS 搜索路径指定了一长串后缀。这一特点使得你可以针对集群中服务使用短名称 - 例如，上面的 "headless"，而不是 "headless.default.svc.cluster.local"。但是，当请求一个外部名称（例如 "infoblox.com"）时，客户端会进行几个无效的 DNS 查询，每次都需要从客户端到 kube-dns 往返（实际上是到 `dnsmasq`，然后到 `kubedns`），因为 [禁用了负缓存](https://github.com/kubernetes/dns/issues/121)）

  * infoblox.com.default.svc.cluster.local -> NXDOMAIN
  * infoblox.com.svc.cluster.local -> NXDOMAIN
  * infoblox.com.cluster.local -> NXDOMAIN
  * infoblox.com.your-internal-domain.com -> NXDOMAIN
<!--
  * infoblox.com -> returns a valid record
--->
  * infoblox.com -> 返回有效记录

<!--
In CoreDNS, an optional feature called [autopath](https://coredns.io/plugins/autopath) can be enabled that will cause this search path to be followed
*in the server*. That is, CoreDNS will figure out from the source IP address which namespace the client pod is in,
and it will walk this search list until it gets a valid answer. Since the first 3 of these are resolved internally
within CoreDNS itself, it cuts out all of the back and forth between the client and server, reducing latency.
--->
在 CoreDNS 中，可以启用 [autopath](https://coredns.io/plugins/autopath) 的可选功能，该功能使搜索路径在 *服务器端* 遍历。也就是说，CoreDNS 将基于源 IP 地址判断客户端 Pod 所在的命名空间，并且遍历此搜索列表，直到获得有效答案为止。由于其中的前三个是在 CoreDNS 本身内部解决的，因此它消除了客户端和服务器之间所有的来回通信，从而减少了延迟。

<!--
### A few other Kubernetes specific features

In CoreDNS, you can use standard DNS zone transfer to export the entire DNS record set. This is useful for
debugging your services as well as importing the cluster zone into other DNS servers.

You can also filter by namespaces or a label selector. This can allow you to run specific CoreDNS instances that will only server records that match the filters, exposing only a limited set of your services via DNS.
--->
### 其他一些特定于 Kubernetes 的功能

在 CoreDNS 中，您可以使用标准 DNS 区域传输来导出整个 DNS 记录集。这对于调试服务以及将集群区导入其他 DNS 服务器很有用。

您还可以按名称空间或标签选择器进行过滤。这样，您可以运行特定的 CoreDNS 实例，该实例仅服务与过滤器匹配的记录，从而通过 DNS 公开受限的服务集。

<!--
## Extensibility

In addition to the features described above, CoreDNS is easily extended. It is possible to build custom versions
of CoreDNS that include your own features. For example, this ability has been used to extend CoreDNS to do recursive resolution
with the [unbound plugin](https://coredns.io/explugins/unbound), to server records directly from a database with the [pdsql plugin](https://coredns.io/explugins/pdsql), and to allow multiple CoreDNS instances to share a common level 2 cache with the [redisc plugin](https://coredns.io/explugins/redisc).

Many other interesting extensions have been added, which you will find on the [External Plugins](https://coredns.io/explugins/) page of the CoreDNS site. One that is really interesting for Kubernetes and Istio users is the [kubernetai plugin](https://coredns.io/explugins/kubernetai), which allows a single CoreDNS instance to connect to multiple Kubernetes clusters and provide service discovery across all of them.
--->
## 可扩展性

除了上述功能之外，CoreDNS 还可轻松扩展，构建包含您独有的功能的自定义版本的 CoreDNS。例如，这一能力已被用于扩展 CoreDNS 来使用 [unbound 插件](https://coredns.io/explugins/unbound) 进行递归解析、使用 [pdsql 插件](https://coredns.io/explugins/pdsql) 直接从数据库提供记录，以及使用 [redisc 插件](https://coredns.io/explugins/redisc) 与多个 CoreDNS 实例共享一个公共的 2 级缓存。

已添加的还有许多其他有趣的扩展，您可以在 CoreDNS 站点的 [外部插件](https://coredns.io/explugins/) 页面上找到这些扩展。Kubernetes 和 Istio 用户真正感兴趣的是 [kubernetai 插件](https://coredns.io/explugins/kubernetai)，它允许单个 CoreDNS 实例连接到多个 Kubernetes 集群并在所有集群中提供服务发现 。

<!--
## What's Next?

CoreDNS is an independent project, and as such is developing many features that are not directly
related to Kubernetes. However, a number of these will have applications within Kubernetes. For example,
the upcoming integration with policy engines will allow CoreDNS to make intelligent choices about which endpoint
to return when a headless service is requested. This could be used to route traffic to a local pod, or
to a more responsive pod. Many other features are in development, and of course as an open source project, we welcome you to suggest and contribute your own features!

The features and differences described above are a few examples. There is much more you can do with CoreDNS.
You can find out more on the [CoreDNS Blog](https://coredns.io/blog).
--->
## 下一步工作

CoreDNS 是一个独立的项目，许多与 Kubernetes 不直接相关的功能正在开发中。但是，其中许多功能将在 Kubernetes 中具有对应的应用。例如，与策略引擎完成集成后，当请求无头服务时，CoreDNS 能够智能地选择返回哪个端点。这可用于将流量分流到本地 Pod 或响应更快的 Pod。更多的其他功能正在开发中，当然作为一个开源项目，我们欢迎您提出建议并贡献自己的功能特性！

上述特征和差异是几个示例。CoreDNS 还可以做更多的事情。您可以在 [CoreDNS 博客](https://coredns.io/blog) 上找到更多信息。

<!--
### Get involved with CoreDNS

CoreDNS is an incubated [CNCF](https:://cncf.io) project.

We're most active on Slack (and GitHub):
--->
### 参与 CoreDNS

CoreDNS 是一个 [CNCF](https:://cncf.io) 孵化项目。

我们在 Slack（和 GitHub）上最活跃：

- Slack: #coredns on <https://slack.cncf.io>
- GitHub: <https://github.com/coredns/coredns>

<!--
More resources can be found:
--->
更多资源请浏览：

- Website: <https://coredns.io>
- Blog: <https://blog.coredns.io>
- Twitter: [@corednsio](https://twitter.com/corednsio)
- Mailing list/group: <coredns-discuss@googlegroups.com>
