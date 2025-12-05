---
title: Kubernetes API 聚合層
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
使用聚合層（Aggregation Layer），使用者可以通過附加的 API 擴展 Kubernetes，
而不侷限於 Kubernetes 核心 API 提供的功能。
這裏的附加 API 可以是現成的解決方案，比如
[metrics server](https://github.com/kubernetes-sigs/metrics-server)，
或者你自己開發的 API。

<!--
The aggregation layer is different from
[Custom Resource Definitions](/docs/concepts/extend-kubernetes/api-extension/custom-resources/),
which are a way to make the {{< glossary_tooltip term_id="kube-apiserver" text="kube-apiserver" >}}
recognise new kinds of object.
-->
聚合層不同於
[定製資源定義（Custom Resource Definitions）](/zh-cn/docs/concepts/extend-kubernetes/api-extension/custom-resources/)。
後者的目的是讓 {{< glossary_tooltip term_id="kube-apiserver" text="kube-apiserver" >}}
能夠識別新的對象類別（Kind）。

<!-- body -->

<!--
## Aggregation layer

The aggregation layer runs in-process with the kube-apiserver. Until an extension resource is
registered, the aggregation layer will do nothing. To register an API, you add an _APIService_
object, which "claims" the URL path in the Kubernetes API. At that point, the aggregation layer
will proxy anything sent to that API path (e.g. `/apis/myextension.mycompany.io/v1/…`) to the
registered APIService.
-->
## 聚合層  {#aggregation-layer}

聚合層在 kube-apiserver 進程內運行。在擴展資源註冊之前，聚合層不做任何事情。
要註冊 API，你可以添加一個 **APIService** 對象，用它來 “申領” Kubernetes API 中的 URL 路徑。
自此以後，聚合層將把發給該 API 路徑的所有內容（例如 `/apis/myextension.mycompany.io/v1/…`）
轉發到已註冊的 APIService。

<!--
The most common way to implement the APIService is to run an *extension API server* in Pod(s) that
run in your cluster. If you're using the extension API server to manage resources in your cluster,
the extension API server (also written as "extension-apiserver") is typically paired with one or
more {{< glossary_tooltip text="controllers" term_id="controller" >}}. The apiserver-builder
library provides a skeleton for both extension API servers and the associated controller(s).
-->
APIService 的最常見實現方式是在叢集中某 Pod 內運行**擴展 API 伺服器（Extension API Server）**。
如果你在使用擴展 API 伺服器來管理叢集中的資源，該擴展 API 伺服器（也被寫成 "extension-apiserver"）
一般需要和一個或多個{{< glossary_tooltip text="控制器" term_id="controller" >}}一起使用。
apiserver-builder 庫同時提供構造擴展 API 伺服器和控制器框架代碼。

<!--
### Response latency

Extension API servers should have low latency networking to and from the kube-apiserver.
Discovery requests are required to round-trip from the kube-apiserver in five seconds or less.

If your extension API server cannot achieve that latency requirement, consider making changes that
let you meet it.
-->
### 響應延遲  {#response-latency}

擴展 API 伺服器（Extension API Server）與 kube-apiserver 之間需要存在低延遲的網路連接。
發現請求需要在五秒鐘或更短的時間內完成到 kube-apiserver 的往返。

如果你的擴展 API 伺服器無法滿足這一延遲要求，應考慮如何更改設定以滿足需要。

## {{% heading "whatsnext" %}}

<!--
* To get the aggregator working in your environment, [configure the aggregation layer](/docs/tasks/extend-kubernetes/configure-aggregation-layer/).
* Then, [setup an extension api-server](/docs/tasks/extend-kubernetes/setup-extension-api-server/) to work with the aggregation layer.
* Read about [APIService](/docs/reference/kubernetes-api/cluster-resources/api-service-v1/) in the API reference
* Learn about [Declarative Validation Concepts](/docs/reference/using-api/declarative-validation), an internal mechanism for defining validation rules that in the future will help support validation for extension API server development.

Alternatively: learn how to
[extend the Kubernetes API using Custom Resource Definitions](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/).
-->
* 閱讀[設定聚合層](/zh-cn/docs/tasks/extend-kubernetes/configure-aggregation-layer/)文檔，
  瞭解如何在自己的環境中啓用聚合器。
* 接下來，瞭解[安裝擴展 API 伺服器](/zh-cn/docs/tasks/extend-kubernetes/setup-extension-api-server/)，
  開始使用聚合層。
* 從 API 參考資料中研究關於 [APIService](/zh-cn/docs/reference/kubernetes-api/cluster-resources/api-service-v1/) 的內容。
* 瞭解 [聲明式校驗概念](/zh-cn/docs/reference/using-api/declarative-validation)，
  一種用於定義校驗規則的內部機制，未來將有助於支持擴展 API Server 的開發過程中的校驗能力。

或者，學習如何[使用 CustomResourceDefinition 擴展 Kubernetes API](/zh-cn/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/)。
