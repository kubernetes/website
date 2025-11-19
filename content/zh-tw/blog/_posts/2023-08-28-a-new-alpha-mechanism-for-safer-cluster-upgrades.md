---
layout: blog
title: "Kubernetes 1.28：用於改進集羣安全升級的新（Alpha）機制"
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

**譯者：** Xin Li (DaoCloud)

<!--
This blog describes the _mixed version proxy_, a new alpha feature in Kubernetes 1.28. The
mixed version proxy enables an HTTP request for a resource to be served by the correct API server
in cases where there are multiple API servers at varied versions in a cluster. For example,
this is useful during a cluster upgrade, or when you're rolling out the runtime configuration of
the cluster's control plane.
-->
本博客介紹了**混合版本代理（Mixed Version Proxy）**，這是 Kubernetes 1.28 中的一個新的
Alpha 級別特性。當集羣中存在多個不同版本的 API 服務器時，混合版本代理使對資源的 HTTP 請求能夠被正確的
API 服務器處理。例如，在集羣升級期間或當發佈集羣控制平面的運行時配置時此特性非常有用。

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
## 這解決了什麼問題？

當集羣進行升級時，集羣中不同版本的 kube-apiserver 爲不同的內置資源集（組、版本、資源）提供服務。
在這種情況下資源請求如果由任一可用的 apiserver 提供服務，請求可能會到達無法解析此請求資源的
apiserver 中；因此，它會收到 404（"Not Found"）的響應報錯，這是不正確的。
此外，返回 404 的錯誤服務可能會導致嚴重的後果，例如命名空間的刪除被錯誤阻止或資源對象被錯誤地回收。

<!--
## How do we solve the problem?

{{< figure src="/images/blog/2023-08-28-a-new-alpha-mechanism-for-safer-cluster-upgrades/mvp-flow-diagram.svg" class="diagram-large" >}}
-->
## 如何解決此問題？

{{< figure src="/images/blog/2023-08-28-a-new-alpha-mechanism-for-safer-cluster-upgrades/mvp-flow-diagram_zh.svg" class="diagram-large" >}}

<!--
The new feature “Mixed Version Proxy” provides the kube-apiserver with the capability to proxy a request to a peer kube-apiserver which is aware of the requested resource and hence can serve the request. To do this, a new filter has been added to the handler chain in the API server's aggregation layer.
-->
"混合版本代理"新特性爲 kube-apiserver 提供了將請求代理到對等的、
能夠感知所請求的資源並因此能夠服務請求的 kube-apiserver。
爲此，一個全新的過濾器已被添加到 API

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
1. 處理程序鏈中的新過濾器檢查請求是否爲 apiserver 無法解析的 API 組/版本/資源（使用現有的
   [StorageVersion API](https://github.com/kubernetes/kubernetes/blob/release-1.28/pkg/apis/apiserverinternal/types.go#L25-L37)）。
   如果是，它會將請求代理到 ServerStorageVersion 對象中列出的 apiserver 之一。
   如果所選的對等 apiserver 無法響應（由於網絡連接、收到的請求與在 ServerStorageVersion
   對象中註冊 apiserver-resource 信息的控制器之間的競爭等原因），則會出現 503（"Service Unavailable"）錯誤響應。
2. 爲了防止無限期地代理請求，一旦最初的 API 服務器確定無法處理該請求，就會在原始請求中添加一個
  （v1.28 新增）HTTP 請求頭 `X-Kubernetes-APIServer-Rerouted: true`。將其設置爲 true 意味着原始
   API 服務器無法處理該請求，需要對其進行代理。如果目標側對等 API 服務器看到此標頭，則不會對該請求做進一步的代理操作。
3. 要設置 kube-apiserver 的網絡位置，以供對等服務器來代理請求，將使用 `--advertise-address`
   或（當未指定`--advertise-address`時）`--bind-address` 標誌所設置的值。
   如果網絡配置中不允許用戶在對等 kube-apiserver 之間使用這些標誌中指定的地址進行通信，
   可以選擇將正確的對等地址配置在此特性引入的 `--peer-advertise-ip` 和 `--peer-advertise-port`
   參數中。

<!--
## How do I enable this feature?
Following are the required steps to enable the feature:
-->
## 如何啓用此特性？

以下是啓用此特性的步驟：

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
* 下載[Kubernetes 項目的最新版本](/zh-cn/releases/download/)（版本 `v1.28.0` 或更高版本）
* 在 kube-apiserver 上使用命令行標誌 `--feature-gates=UnknownVersionInteroperabilityProxy=true`
  打開特性門控
* 使用 kube-apiserver 的 `--peer-ca-file` 參數爲源 kube-apiserver 提供 CA 證書，
  用以驗證目標 kube-apiserver 的服務證書。注意：這是此功能正常工作所必需的參數。
  此參數沒有默認值。
* 爲本地 kube-apiserver 設置正確的 IP 和端口，在代理請求時，對等方將使用該 IP 和端口連接到此
  `--peer-advertise-port` 命令行參數來配置 kube-apiserver。
  `--peer-advertise-port` 命令行參數。
  如果未設置這兩個參數，則默認使用 `--advertise-address` 或 `--bind-address` 命令行參數的值。
  如果這些也未設置，則將使用主機的默認接口。

<!--
## What’s missing?
Currently we only proxy resource requests to a peer kube-apiserver when its determined to do so.
Next we need to address how to work discovery requests in such scenarios. Right now we are planning
to have the following capabilities for beta
-->
## 少了什麼東西？

目前，我們僅在確定時將資源請求代理到對等 kube-apiserver。
接下來我們需要解決如何在這種情況下處理發現請求。
目前我們計劃在測試版中提供以下特性：

<!--
* Merged discovery across all kube-apiservers
* Use an egress dialer for network connections made to peer kube-apiservers
-->
* 合併所有 kube-apiserver 的發現數據
* 使用出口撥號器（egress dialer）與對等 kube-apiserver 進行網絡連接

<!--
## How can I learn more?

- Read the [Mixed Version Proxy documentation](/docs/concepts/architecture/mixed-version-proxy)
- Read [KEP-4020: Unknown Version Interoperability Proxy](https://github.com/kubernetes/enhancements/tree/master/keps/sig-api-machinery/4020-unknown-version-interoperability-proxy)
-->
## 如何進一步瞭解？

- 閱讀[混合版本代理文檔](/zh-cn/docs/concepts/architecture/mixed-version-proxy)
- 閱讀 [KEP-4020：未知版本互操作代理](https://github.com/kubernetes/enhancements/tree/master/keps/sig-api-machinery/4020-unknown-version-interoperability-proxy)

<!--
## How can I get involved?
Reach us on [Slack](https://slack.k8s.io/): [#sig-api-machinery](https://kubernetes.slack.com/messages/sig-api-machinery), or through the [mailing list](https://groups.google.com/forum/#!forum/kubernetes-sig-api-machinery). 

Huge thanks to the contributors that have helped in the design, implementation, and review of this feature: Daniel Smith, Han Kang, Joe Betz, Jordan Liggit, Antonio Ojea, David Eads and Ben Luddy!
-->
## 如何參與其中？

通過 [Slack](https://slack.k8s.io/)：[#sig-api-machinery](https://kubernetes.slack.com/messages/sig-api-machinery)
或[郵件列表](https://groups.google.com/forum/#!forum/kubernetes-sig-api-machinery)
聯繫我們。

非常感謝幫助設計、實施和評審此特性的貢獻者：
Daniel Smith、Han Kang、Joe Betz、Jordan Liggit、Antonio Ojea、David Eads 和 Ben Luddy！
