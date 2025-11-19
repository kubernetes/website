---
layout: blog
title: "用於 Kubernetes 叢集 DNS 的 CoreDNS GA 正式發佈"
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

**編者注：這篇文章是 [系列深度文章](https://kubernetes.io/blog/2018/06/27/kubernetes-1.11-release-announcement/) 中的一篇，介紹了 Kubernetes 1.11 新增的功能

<!--
## Introduction

In Kubernetes 1.11, [CoreDNS](https://coredns.io) has reached General Availability (GA) for DNS-based service discovery, as an alternative to the kube-dns addon. This means that CoreDNS will be offered as an option in upcoming versions of the various installation tools. In fact, the kubeadm team chose to make it the default option starting with Kubernetes 1.11.
--->
## 介紹

在 Kubernetes 1.11 中，[CoreDNS](https://coredns.io) 已經達到基於 DNS 服務發現的 General Availability (GA)，可以替代 kube-dns 插件。這意味着 CoreDNS 會作爲即將發佈的安裝工具的選項之一上線。實際上，從 Kubernetes 1.11 開始，kubeadm 團隊選擇將它設爲默認選項。

<!--
DNS-based service discovery has been part of Kubernetes for a long time with the kube-dns cluster addon. This has generally worked pretty well, but there have been some concerns around the reliability, flexibility and security of the implementation.

CoreDNS is a general-purpose, authoritative DNS server that provides a backwards-compatible, but extensible, integration with Kubernetes. It resolves the issues seen with kube-dns, and offers a number of unique features that solve a wider variety of use cases.

In this article, you will learn about the differences in the implementations of kube-dns and CoreDNS, and some of the helpful extensions offered by CoreDNS.
--->
很久以來， kube-dns 叢集插件一直是 Kubernetes 的一部分，用來實現基於 DNS 的服務發現。
通常，此插件運行平穩，但對於實現的可靠性、靈活性和安全性仍存在一些疑慮。

CoreDNS 是通用的、權威的 DNS 伺服器，提供與 Kubernetes 向後兼容但可擴展的集成。它解決了 kube-dns 遇到的問題，並提供了許多獨特的功能，可以解決各種用例。

在本文中，您將瞭解 kube-dns 和 CoreDNS 的實現有何差異，以及 CoreDNS 提供的一些非常有用的擴展。

<!--
## Implementation differences

In kube-dns, several containers are used within a single pod: `kubedns`, `dnsmasq`, and `sidecar`. The `kubedns`
container watches the Kubernetes API and serves DNS records based on the [Kubernetes DNS specification](https://github.com/kubernetes/dns/blob/master/docs/specification.md), `dnsmasq` provides caching and stub domain support, and `sidecar` provides metrics and health checks.
--->
## 實現差異

在 kube-dns 中，一個 Pod 中使用多個 容器：`kubedns`、`dnsmasq`、和 `sidecar`。`kubedns` 容器監視 Kubernetes API 並根據 [Kubernetes DNS 規範](https://github.com/kubernetes/dns/blob/master/docs/specification.md) 提供 DNS 記錄，`dnsmasq` 提供緩存和存根域支持，`sidecar` 提供指標和健康檢查。

<!--
This setup leads to a few issues that have been seen over time. For one, security vulnerabilities in `dnsmasq` have led to the need
for a security-patch release of Kubernetes in the past. Additionally, because `dnsmasq` handles the stub domains,
but `kubedns` handles the External Services, you cannot use a stub domain in an external service, which is very
limiting to that functionality (see [dns#131](https://github.com/kubernetes/dns/issues/131)).

All of these functions are done in a single container in CoreDNS, which is running a process written in Go. The
different plugins that are enabled replicate (and enhance) the functionality found in kube-dns.
--->
隨着時間的推移，此設置會導致一些問題。一方面，以往 `dnsmasq` 中的安全漏洞需要通過發佈 Kubernetes 的安全補丁來解決。但是，由於 `dnsmasq` 處理存根域，而 `kubedns` 處理外部服務，因此您不能在外部服務中使用存根域，導致這個功能具有侷限性（請參閱 [dns#131](https://github.com/kubernetes/dns/issues/131)）。

在 CoreDNS 中，所有這些功能都是在一個容器中完成的，該容器運行用 Go 編寫的進程。所啓用的不同插件可複製（並增強）在 kube-dns 中存在的功能。

<!--
## Configuring CoreDNS

In kube-dns, you can [modify a ConfigMap](https://kubernetes.io/blog/2017/04/configuring-private-dns-zones-upstream-nameservers-kubernetes/) to change the behavior of your service discovery. This allows the addition of
features such as serving stub domains, modifying upstream nameservers, and enabling federation.
--->
## 設定 CoreDNS

在 kube-dns 中，您可以 [修改 ConfigMap](https://kubernetes.io/blog/2017/04/configuring-private-dns-zones-upstream-nameservers-kubernetes/) 來更改服務發現的行爲。使用者可以添加諸如爲存根域提供服務、修改上游名稱伺服器以及啓用聯盟之類的功能。

<!--
In CoreDNS, you similarly can modify the ConfigMap for the CoreDNS [Corefile](https://coredns.io/2017/07/23/corefile-explained/) to change how service discovery
works. This Corefile configuration offers many more options than you will find in kube-dns, since it is the
primary configuration file that CoreDNS uses for configuration of all of its features, even those that are not
Kubernetes related.

When upgrading from kube-dns to CoreDNS using `kubeadm`, your existing ConfigMap will be used to generate the
customized Corefile for you, including all of the configuration for stub domains, federation, and upstream nameservers. See [Using CoreDNS for Service Discovery](/docs/tasks/administer-cluster/coredns/) for more details.
--->
在 CoreDNS 中，您可以類似地修改 CoreDNS [Corefile](https://coredns.io/2017/07/23/corefile-explained/) 的 ConfigMap，以更改服務發現的工作方式。這種 Corefile 設定提供了比 kube-dns 中更多的選項，因爲它是 CoreDNS 用於設定所有功能的主要設定文件，即使與 Kubernetes 不相關的功能也可以操作。

使用 `kubeadm` 將 kube-dns 升級到 CoreDNS 時，現有的 ConfigMap 將被用來爲您生成自定義的 Corefile，包括存根域、聯盟和上游名稱伺服器的所有設定。更多詳細信息，請參見
[使用 CoreDNS 進行服務發現](/zh-cn/docs/tasks/administer-cluster/coredns/)。

<!--
## Bug fixes and enhancements

There are several open issues with kube-dns that are resolved in CoreDNS, either in default configuration or with some customized configurations.
--->
## 錯誤修復和增強

在 CoreDNS 中解決了 kube-dn 的多個未解決問題，無論是默認設定還是某些自定義設定。

<!--
  * [dns#55 - Custom DNS entries for kube-dns](https://github.com/kubernetes/dns/issues/55) may be handled using the "fallthrough" mechanism in the [kubernetes plugin](https://coredns.io/plugins/kubernetes), using the [rewrite plugin](https://coredns.io/plugins/rewrite), or simply serving a subzone with a different plugin such as the [file plugin](https://coredns.io/plugins/file).

  * [dns#116 - Only one A record set for headless service with pods having single hostname](https://github.com/kubernetes/dns/issues/116). This issue is fixed without any additional configuration.
  * [dns#131 - externalName not using stubDomains settings](https://github.com/kubernetes/dns/issues/131). This issue is fixed without any additional configuration.
  * [dns#167 - enable skyDNS round robin A/AAAA records](https://github.com/kubernetes/dns/issues/167). The equivalent functionality can be configured using the [load balance plugin](https://coredns.io/plugins/loadbalance).
  * [dns#190 - kube-dns cannot run as non-root user](https://github.com/kubernetes/dns/issues/190). This issue is solved today by using a non-default image, but it will be made the default CoreDNS behavior in a future release.
  * [dns#232 - fix pod hostname to be podname for dns srv records](https://github.com/kubernetes/dns/issues/232) is an enhancement that is supported through the "endpoint_pod_names" feature described below.
--->
  * [dns#55 - kube-dns 的自定義 DNS 條目](https://github.com/kubernetes/dns/issues/55) 可以使用 [kubernetes 插件](https://coredns.io/plugins/kubernetes) 中的 "fallthrough" 機制，使用 [rewrite 插件](https://coredns.io/plugins/rewrite)，或者分區使用不同的插件，例如 [file 插件](https://coredns.io/plugins/file)。
  
  * [dns#116 - 對具有相同主機名的、提供無頭服務服務的 Pod 僅設置了一個 A 記錄](https://github.com/kubernetes/dns/issues/116)。無需任何其他設定即可解決此問題。
  * [dns#131 - externalName 未使用 stubDomains 設置](https://github.com/kubernetes/dns/issues/131)。無需任何其他設定即可解決此問題。
  * [dns#167 - 允許 skyDNS 爲 A/AAAA 記錄提供輪換](https://github.com/kubernetes/dns/issues/167)。可以使用 [負載均衡插件](https://coredns.io/plugins/loadbalance) 設定等效功能。
  * [dns#190 - kube-dns 無法以非 root 使用者身份運行](https://github.com/kubernetes/dns/issues/190)。今天，通過使用 non-default 映像檔解決了此問題，但是在將來的版本中，它將成爲默認的 CoreDNS 行爲。
  * [dns#232 - 在 dns srv 記錄中修復 pod hostname 爲 podname](https://github.com/kubernetes/dns/issues/232) 是通過下面提到的 "endpoint_pod_names" 功能進行支持的增強功能。


<!--
## Metrics

The functional behavior of the default CoreDNS configuration is the same as kube-dns. However,
one difference you need to be aware of is that the published metrics are not the same. In kube-dns,
you get separate metrics for `dnsmasq` and `kubedns` (skydns). In CoreDNS there is a completely
different set of metrics, since it is all a single process. You can find more details on these
metrics on the CoreDNS [Prometheus plugin](https://coredns.io/plugins/metrics/) page.
--->
## 指標

CoreDNS 默認設定的功能性行爲與 kube-dns 相同。但是，你需要了解的差別之一是二者發佈的指標是不同的。在 kube-dns 中，您將分別獲得 `dnsmasq` 和 `kubedns`（skydns）的度量值。在 CoreDNS 中，存在一組完全不同的指標，因爲它們在同一個進程中。您可以在 CoreDNS [Prometheus 插件](https://coredns.io/plugins/metrics/) 頁面上找到有關這些指標的更多詳細信息。

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

標準的 CoreDNS Kubernetes 設定旨在與以前的 kube-dns 在行爲上向後兼容。但是，通過進行一些設定更改，CoreDNS 允許您修改 DNS 服務發現在叢集中的工作方式。這些功能中的許多功能仍要符合 [Kubernetes DNS規範](https://github.com/kubernetes/dns/blob/master/docs/specification.md)；它們在增強了功能的同時保持向後兼容。由於 CoreDNS 並非 *僅* 用於 Kubernetes，而是通用的 DNS 伺服器，因此您可以做很多超出該規範的事情。

<!--
### Pods verified mode

In kube-dns, pod name records are "fake". That is, any "a-b-c-d.namespace.pod.cluster.local" query will
return the IP address "a.b.c.d". In some cases, this can weaken the identity guarantees offered by TLS. So,
CoreDNS offers a "pods verified" mode, which will only return the IP address if there is a pod in the
specified namespace with that IP address.
--->
### Pod 驗證模式

在 kube-dns 中，Pod 名稱記錄是 "僞造的"。也就是說，任何 "a-b-c-d.namespace.pod.cluster.local" 查詢都將返回 IP 地址 "a.b.c.d"。在某些情況下，這可能會削弱 TLS 提供的身份確認。因此，CoreDNS 提供了一種 "Pod 驗證" 的模式，該模式僅在指定名稱空間中存在具有該 IP 地址的 Pod 時才返回 IP 地址。

<!--
### Endpoint names based on pod names

In kube-dns, when using a headless service, you can use an SRV request to get a list of
all endpoints for the service:
--->
### 基於 Pod 名稱的端點名稱

在 kube-dns 中，使用無頭服務時，可以使用 SRV 請求獲取該服務的所有端點的列表：

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
但是，端點 DNS 名稱（出於實際目的）是隨機的。在 CoreDNS 中，默認情況下，您所獲得的端點 DNS 名稱是基於端點 IP 地址生成的：

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
對於某些應用程序，你會希望在這裏使用 Pod 名稱，而不是 Pod IP 地址（例如，參見 [kubernetes#47992](https://github.com/kubernetes/kubernetes/issues/47992) 和 [coredns#1190](https://github.com/coredns/coredns/pull/1190)）。要在 CoreDNS 中啓用此功能，請在 Corefile 中指定 "endpoint_pod_names" 選項，結果如下：

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
### 自動路徑

CoreDNS 還具有一項特殊功能，可以改善 DNS 中外部名稱請求的延遲。在 Kubernetes 中，Pod 的 DNS 搜索路徑指定了一長串後綴。這一特點使得你可以針對叢集中服務使用短名稱 - 例如，上面的 "headless"，而不是 "headless.default.svc.cluster.local"。但是，當請求一個外部名稱（例如 "infoblox.com"）時，客戶端會進行幾個無效的 DNS 查詢，每次都需要從客戶端到 kube-dns 往返（實際上是到 `dnsmasq`，然後到 `kubedns`），因爲 [禁用了負緩存](https://github.com/kubernetes/dns/issues/121)）

  * infoblox.com.default.svc.cluster.local -> NXDOMAIN
  * infoblox.com.svc.cluster.local -> NXDOMAIN
  * infoblox.com.cluster.local -> NXDOMAIN
  * infoblox.com.your-internal-domain.com -> NXDOMAIN
<!--
  * infoblox.com -> returns a valid record
--->
  * infoblox.com -> 返回有效記錄

<!--
In CoreDNS, an optional feature called [autopath](https://coredns.io/plugins/autopath) can be enabled that will cause this search path to be followed
*in the server*. That is, CoreDNS will figure out from the source IP address which namespace the client pod is in,
and it will walk this search list until it gets a valid answer. Since the first 3 of these are resolved internally
within CoreDNS itself, it cuts out all of the back and forth between the client and server, reducing latency.
--->
在 CoreDNS 中，可以啓用 [autopath](https://coredns.io/plugins/autopath) 的可選功能，該功能使搜索路徑在 *伺服器端* 遍歷。也就是說，CoreDNS 將基於源 IP 地址判斷客戶端 Pod 所在的命名空間，並且遍歷此搜索列表，直到獲得有效答案爲止。由於其中的前三個是在 CoreDNS 本身內部解決的，因此它消除了客戶端和伺服器之間所有的來回通信，從而減少了延遲。

<!--
### A few other Kubernetes specific features

In CoreDNS, you can use standard DNS zone transfer to export the entire DNS record set. This is useful for
debugging your services as well as importing the cluster zone into other DNS servers.

You can also filter by namespaces or a label selector. This can allow you to run specific CoreDNS instances that will only server records that match the filters, exposing only a limited set of your services via DNS.
--->
### 其他一些特定於 Kubernetes 的功能

在 CoreDNS 中，您可以使用標準 DNS 區域傳輸來導出整個 DNS 記錄集。這對於調試服務以及將叢集區導入其他 DNS 伺服器很有用。

您還可以按名稱空間或標籤選擇器進行過濾。這樣，您可以運行特定的 CoreDNS 實例，該實例僅服務與過濾器匹配的記錄，從而通過 DNS 公開受限的服務集。

<!--
## Extensibility

In addition to the features described above, CoreDNS is easily extended. It is possible to build custom versions
of CoreDNS that include your own features. For example, this ability has been used to extend CoreDNS to do recursive resolution
with the [unbound plugin](https://coredns.io/explugins/unbound), to server records directly from a database with the [pdsql plugin](https://coredns.io/explugins/pdsql), and to allow multiple CoreDNS instances to share a common level 2 cache with the [redisc plugin](https://coredns.io/explugins/redisc).

Many other interesting extensions have been added, which you will find on the [External Plugins](https://coredns.io/explugins/) page of the CoreDNS site. One that is really interesting for Kubernetes and Istio users is the [kubernetai plugin](https://coredns.io/explugins/kubernetai), which allows a single CoreDNS instance to connect to multiple Kubernetes clusters and provide service discovery across all of them.
--->
## 可擴展性

除了上述功能之外，CoreDNS 還可輕鬆擴展，構建包含您獨有的功能的自定義版本的 CoreDNS。例如，這一能力已被用於擴展 CoreDNS 來使用 [unbound 插件](https://coredns.io/explugins/unbound) 進行遞歸解析、使用 [pdsql 插件](https://coredns.io/explugins/pdsql) 直接從數據庫提供記錄，以及使用 [redisc 插件](https://coredns.io/explugins/redisc) 與多個 CoreDNS 實例共享一個公共的 2 級緩存。

已添加的還有許多其他有趣的擴展，您可以在 CoreDNS 站點的 [外部插件](https://coredns.io/explugins/) 頁面上找到這些擴展。Kubernetes 和 Istio 使用者真正感興趣的是 [kubernetai 插件](https://coredns.io/explugins/kubernetai)，它允許單個 CoreDNS 實例連接到多個 Kubernetes 叢集並在所有叢集中提供服務發現 。

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

CoreDNS 是一個獨立的項目，許多與 Kubernetes 不直接相關的功能正在開發中。但是，其中許多功能將在 Kubernetes 中具有對應的應用。例如，與策略引擎完成集成後，當請求無頭服務時，CoreDNS 能夠智能地選擇返回哪個端點。這可用於將流量分流到本地 Pod 或響應更快的 Pod。更多的其他功能正在開發中，當然作爲一個開源項目，我們歡迎您提出建議並貢獻自己的功能特性！

上述特徵和差異是幾個示例。CoreDNS 還可以做更多的事情。您可以在 [CoreDNS 博客](https://coredns.io/blog) 上找到更多信息。

<!--
### Get involved with CoreDNS

CoreDNS is an incubated [CNCF](https:://cncf.io) project.

We're most active on Slack (and GitHub):
--->
### 參與 CoreDNS

CoreDNS 是一個 [CNCF](https:://cncf.io) 孵化項目。

我們在 Slack（和 GitHub）上最活躍：

- Slack: #coredns on <https://slack.cncf.io>
- GitHub: <https://github.com/coredns/coredns>

<!--
More resources can be found:
--->
更多資源請瀏覽：

- Website: <https://coredns.io>
- Blog: <https://blog.coredns.io>
- Twitter: [@corednsio](https://twitter.com/corednsio)
- Mailing list/group: <coredns-discuss@googlegroups.com>
