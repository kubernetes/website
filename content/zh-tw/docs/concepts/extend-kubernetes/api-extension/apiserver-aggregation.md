---
title: 透過聚合層擴充套件 Kubernetes API
content_type: concept
weight: 20
---

<!--
title: Extending the Kubernetes API with the aggregation layer
reviewers:
- lavalamp
- cheftako
- chenopis
content_type: concept
weight: 20
-->

<!-- overview -->

<!--
The aggregation layer allows Kubernetes to be extended with additional APIs, beyond what is offered by the core Kubernetes APIs.
-->
使用聚合層（Aggregation Layer），使用者可以透過額外的 API 擴充套件 Kubernetes，
而不侷限於 Kubernetes 核心 API 提供的功能。

<!--
The additional APIs can either be ready-made solutions such as a [metrics server](https://github.com/kubernetes-sigs/metrics-server), or APIs that you develop yourself.

The aggregation layer is different from [Custom Resources](/docs/concepts/extend-kubernetes/api-extension/custom-resources/), which are a way to make the {{< glossary_tooltip term_id="kube-apiserver" text="kube-apiserver" >}} recognise new kinds of object.
-->
這裡的附加 API 可以是現成的解決方案比如
[metrics server](https://github.com/kubernetes-sigs/metrics-server), 
或者你自己開發的 API。

聚合層不同於
[定製資源（Custom Resources）](/zh-cn/docs/concepts/extend-kubernetes/api-extension/custom-resources/)。
後者的目的是讓 {{< glossary_tooltip term_id="kube-apiserver" text="kube-apiserver" >}}
能夠認識新的物件類別（Kind）。

<!-- body -->

<!--
## Aggregation layer

The aggregation layer runs in-process with the kube-apiserver. Until an extension resource is registered, the aggregation layer will do nothing. To register an API, users must add an APIService object, which "claims" the URL path in the Kubernetes API. At that point, the aggregation layer will proxy anything sent to that API path (e.g. /apis/myextension.mycompany.io/v1/…) to the registered APIService.
-->
## 聚合層  {#aggregation-layer}

聚合層在 kube-apiserver 程序內執行。在擴充套件資源註冊之前，聚合層不做任何事情。
要註冊 API，使用者必須新增一個 APIService 物件，用它來“申領” Kubernetes API 中的 URL 路徑。
自此以後，聚合層將會把發給該 API 路徑的所有內容（例如 `/apis/myextension.mycompany.io/v1/…`）
轉發到已註冊的 APIService。

<!--
The most common way to implement the APIService is to run an *extension API server* in Pod(s) that run in your cluster. If you're using the extension API server to manage resources in your cluster, the extension API server (also written as "extension-apiserver") is typically paired with one or more {{< glossary_tooltip text="controllers" term_id="controller" >}}. The apiserver-builder library provides a skeleton for both extension API servers and the associated controller(s).
-->
APIService 的最常見實現方式是在叢集中某 Pod 內執行 *擴充套件 API 伺服器*。
如果你在使用擴充套件 API 伺服器來管理叢集中的資源，該擴充套件 API 伺服器（也被寫成“extension-apiserver”）
一般需要和一個或多個{{< glossary_tooltip text="控制器" term_id="controller" >}}一起使用。
apiserver-builder 庫同時提供構造擴充套件 API 伺服器和控制器框架程式碼。


<!--
### Response latency

Extension API servers should have low latency networking to and from the kube-apiserver.
Discovery requests are required to round-trip from the kube-apiserver in five seconds or less.

If your extension API server cannot achieve that latency requirement, consider making changes that let you meet it.
-->
### 反應延遲  {#response-latency}

擴充套件 API 伺服器與 kube-apiserver 之間需要存在低延遲的網路連線。
發現請求需要在五秒鐘或更短的時間內完成到 kube-apiserver 的往返。

如果你的擴充套件 API 伺服器無法滿足這一延遲要求，應考慮如何更改配置以滿足需要。

## {{% heading "whatsnext" %}}

<!--
* To get the aggregator working in your environment, [configure the aggregation layer](/docs/tasks/access-kubernetes-api/configure-aggregation-layer/).
* Then, [setup an extension api-server](/docs/tasks/access-kubernetes-api/setup-extension-api-server/) to work with the aggregation layer.
* Read about [APIService](/docs/reference/kubernetes-api/cluster-resources/api-service-v1/) in the API reference

Alternatively: learn how to [extend the Kubernetes API using Custom Resource Definitions](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/).
-->
* 閱讀[配置聚合層](/zh-cn/docs/tasks/extend-kubernetes/configure-aggregation-layer/) 文件，
  瞭解如何在自己的環境中啟用聚合器。
* 接下來，瞭解[安裝擴充套件 API 伺服器](/zh-cn/docs/tasks/extend-kubernetes/setup-extension-api-server/)，
  開始使用聚合層。
* 從 API 參考資料中研究關於 [APIService](/docs/reference/kubernetes-api/cluster-resources/api-service-v1/) 的內容。

或者，學習如何[使用自定義資源定義擴充套件 Kubernetes API](/zh-cn/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/)。
