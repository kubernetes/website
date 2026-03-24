---
title: 參考
linkTitle: "參考"
main_menu: true
weight: 70
content_type: concept
no_list: true
---
<!--
title: Reference
approvers:
- chenopis
linkTitle: "Reference"
main_menu: true
weight: 70
content_type: concept
no_list: true
-->

<!-- overview -->

<!--
This section of the Kubernetes documentation contains references.
-->
本部分為 Kubernetes 文件的參考內容。

<!-- body -->

<!--
## API Reference

* [Glossary](/docs/reference/glossary/) -  a comprehensive, standardized list of Kubernetes terminology

* [Kubernetes API Reference](/docs/reference/kubernetes-api/)
* [One-page API Reference for Kubernetes {{< param "version" >}}](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/)
* [Using The Kubernetes API](/docs/reference/using-api/) - overview of the API for Kubernetes.
* [API access control](/docs/reference/access-authn-authz/) - details on how Kubernetes controls API access
* [Well-Known Labels, Annotations and Taints](/docs/reference/labels-annotations-taints/)
-->
## API 参考  {#api-reference}

* [詞彙表](/zh-tw/docs/reference/glossary/) - Kubernetes 術語的完整標準化清單
* [Kubernetes API 参考](/zh-tw/docs/reference/kubernetes-api/)
* [Kubernetes API 單頁參考 {{< param "version" >}}](/zh-tw/docs/reference/generated/kubernetes-api/{{< param "version" >}}/)
* [使用 Kubernetes API ](/zh-tw/docs/reference/using-api/) - Kubernetes API 的概覽
* [API 存取控制](/zh-tw/docs/reference/access-authn-authz/) - 說明 Kubernetes 如何控管 API 的存取
* [常見標籤、註解與污點](/zh-tw/docs/reference/labels-annotations-taints/)

<!--
## Officially supported client libraries

To call the Kubernetes API from a programming language, you can use
[client libraries](/docs/reference/using-api/client-libraries/). Officially supported
client libraries:

- [Kubernetes Go client library](https://github.com/kubernetes/client-go/)
- [Kubernetes Python client library](https://github.com/kubernetes-client/python)
- [Kubernetes Java client library](https://github.com/kubernetes-client/java)
- [Kubernetes JavaScript client library](https://github.com/kubernetes-client/javascript)
- [Kubernetes C# client library](https://github.com/kubernetes-client/csharp)
- [Kubernetes Haskell client library](https://github.com/kubernetes-client/haskell)
-->
## 官方支援的用戶端程式庫  {#officially-supported-client-libraries}

若要透過程式語言呼叫 Kubernetes API，可以使用[用戶端程式庫](/zh-tw/docs/reference/using-api/client-libraries/)。以下為官方支援的用戶端程式庫：

- [Kubernetes Go 用戶端程式庫](https://github.com/kubernetes/client-go/)
- [Kubernetes Python 用戶端程式庫](https://github.com/kubernetes-client/python)
- [Kubernetes Java 用戶端程式庫](https://github.com/kubernetes-client/java)
- [Kubernetes JavaScript 用戶端程式庫](https://github.com/kubernetes-client/javascript)
- [Kubernetes C# 用戶端程式庫](https://github.com/kubernetes-client/csharp)
- [Kubernetes Haskell 用戶端程式庫](https://github.com/kubernetes-client/haskell)

<!--
## CLI

* [kubectl](/docs/reference/kubectl/) - Main CLI tool for running commands and managing Kubernetes clusters.
  * [JSONPath](/docs/reference/kubectl/jsonpath/) - Syntax guide for using [JSONPath expressions](https://goessner.net/articles/JsonPath/) with kubectl.
* [kubeadm](/docs/reference/setup-tools/kubeadm/) - CLI tool to easily provision a secure Kubernetes cluster.
-->
## CLI

* [kubectl](/zh-tw/docs/reference/kubectl/) - 用於執行指令及管理 Kubernetes 叢集的主要 CLI 工具。
  * [JSONPath](/zh-tw/docs/reference/kubectl/jsonpath/) - 說明如何在 kubectl 中使用  
    [JSONPath 表達式](https://goessner.net/articles/JsonPath/) 的語法指南。
* [kubeadm](/zh-tw/docs/reference/setup-tools/kubeadm/) - 用於快速建立安全 Kubernetes 叢集的 CLI 工具。

<!--
## Components

* [kubelet](/docs/reference/command-line-tools-reference/kubelet/) - The
  primary agent that runs on each node. The kubelet takes a set of PodSpecs
  and ensures that the described containers are running and healthy.
* [kube-apiserver](/docs/reference/command-line-tools-reference/kube-apiserver/) -
  REST API that validates and configures data for API objects such as  pods,
  services, replication controllers.
* [kube-controller-manager](/docs/reference/command-line-tools-reference/kube-controller-manager/) -
  Daemon that embeds the core control loops shipped with Kubernetes.
* [kube-proxy](/docs/reference/command-line-tools-reference/kube-proxy/) - Can
  do simple TCP/UDP stream forwarding or round-robin TCP/UDP forwarding across
  a set of back-ends.
* [kube-scheduler](/docs/reference/command-line-tools-reference/kube-scheduler/) -
  Scheduler that manages availability, performance, and capacity.
  
  * [Scheduler Policies](/docs/reference/scheduling/policies)
  * [Scheduler Profiles](/docs/reference/scheduling/config#profiles)

* List of [ports and protocols](/docs/reference/networking/ports-and-protocols/) that
  should be open on control plane and worker nodes
-->
## 組件  {#components}

* [kubelet](/zh-tw/docs/reference/command-line-tools-reference/kubelet/) -
  在每個節點上運行的主要代理程式。kubelet 會接收一組 PodSpec，並確保其描述的容器維持正常且健康的運作狀態。
* [kube-apiserver](/zh-tw/docs/reference/command-line-tools-reference/kube-apiserver/) -
  提供 REST API，用於驗證與設定 API 物件（例如 Pod、Service 或 ReplicationController）的資料。
* [kube-controller-manager](/zh-tw/docs/reference/command-line-tools-reference/kube-controller-manager/) -
  執行 Kubernetes 核心控制迴圈的常駐程式。
* [kube-proxy](/zh-tw/docs/reference/command-line-tools-reference/kube-proxy/) -
  可進行簡單的 TCP/UDP 流量轉發，或在一組後端之間進行輪詢式 TCP/UDP 轉發。
* [kube-scheduler](/zh-tw/docs/reference/command-line-tools-reference/kube-scheduler/) -
  負責管理資源可用性、效能與容量的排程器。
  
  * [排程策略](/zh-tw/docs/reference/scheduling/policies)
  * [排程設定檔](/zh-tw/docs/reference/scheduling/config#profiles)

* 控制平面與工作節點上需開放的[連接埠與通訊協定](/zh-tw/docs/reference/networking/ports-and-protocols/)

<!--
## Config APIs

This section hosts the documentation for "unpublished" APIs which are used to
configure  kubernetes components or tools. Most of these APIs are not exposed
by the API server in a RESTful way though they are essential for a user or an
operator to use or manage a cluster.
-->
## 設定 API   {#config-apis}

本節提供用於設定 Kubernetes 組件或工具的「未公開」API 文件。
這些 API 雖未透過 RESTful 方式由 API Server 對外提供，
但對於使用者或維運人員管理叢集而言仍相當重要。

<!--
* [kubeconfig (v1)](/docs/reference/config-api/kubeconfig.v1/)
* [kuberc (v1alpha1)](/docs/reference/config-api/kuberc.v1alpha1/) and
  [kuberc (v1beta1)](/docs/reference/config-api/kuberc.v1beta1/)
* [kube-apiserver admission (v1)](/docs/reference/config-api/apiserver-admission.v1/)
* [kube-apiserver configuration (v1alpha1)](/docs/reference/config-api/apiserver-config.v1alpha1/) and
  [kube-apiserver configuration (v1beta1)](/docs/reference/config-api/apiserver-config.v1beta1/) and
  [kube-apiserver configuration (v1)](/docs/reference/config-api/apiserver-config.v1/)
* [kube-apiserver event rate limit (v1alpha1)](/docs/reference/config-api/apiserver-eventratelimit.v1alpha1/)
* [kubelet configuration (v1alpha1)](/docs/reference/config-api/kubelet-config.v1alpha1/) and
  [kubelet configuration (v1beta1)](/docs/reference/config-api/kubelet-config.v1beta1/) and
  [kubelet configuration (v1)](/docs/reference/config-api/kubelet-config.v1/)
* [kubelet credential providers (v1)](/docs/reference/config-api/kubelet-credentialprovider.v1/)
* [kube-scheduler configuration (v1)](/docs/reference/config-api/kube-scheduler-config.v1/)
* [kube-controller-manager configuration (v1alpha1)](/docs/reference/config-api/kube-controller-manager-config.v1alpha1/)
* [kube-proxy configuration (v1alpha1)](/docs/reference/config-api/kube-proxy-config.v1alpha1/)
* [`audit.k8s.io/v1` API](/docs/reference/config-api/apiserver-audit.v1/)
* [Client authentication API (v1beta1)](/docs/reference/config-api/client-authentication.v1beta1/) and 
  [Client authentication API (v1)](/docs/reference/config-api/client-authentication.v1/)
* [WebhookAdmission configuration (v1)](/docs/reference/config-api/apiserver-webhookadmission.v1/)
* [ImagePolicy API (v1alpha1)](/docs/reference/config-api/imagepolicy.v1alpha1/)
-->
* [kubeconfig（v1）](/zh-tw/docs/reference/config-api/kubeconfig.v1/)
* [kuberc（v1alpha1）](/zh-tw/docs/reference/config-api/kuberc.v1alpha1/)和
  [kuberc (v1beta1)](/zh-tw/docs/reference/config-api/kuberc.v1beta1/)
* [kube-apiserver 准入（v1）](/zh-tw/docs/reference/config-api/apiserver-admission.v1/)
* [kube-apiserver 設定（v1alpha1）](/zh-tw/docs/reference/config-api/apiserver-config.v1alpha1/)和
  [kube-apiserver 設定（v1beta1）](/zh-tw/docs/reference/config-api/apiserver-config.v1beta1/)和
  [kube-apiserver 設定（v1）](/zh-tw/docs/reference/config-api/apiserver-config.v1/)
* [kube-apiserver 事件速率限制（v1alpha1）](/zh-tw/docs/reference/config-api/apiserver-eventratelimit.v1alpha1/)
* [kubelet 設定（v1alpha1）](/zh-tw/docs/reference/config-api/kubelet-config.v1alpha1/)、
  [kubelet 設定（v1beta1）](/zh-tw/docs/reference/config-api/kubelet-config.v1beta1/)和
  [kubelet 設定（v1）](/zh-tw/docs/reference/config-api/kubelet-config.v1/)
* [kubelet 憑證提供者（v1）](/zh-tw/docs/reference/config-api/kubelet-credentialprovider.v1/)
* [kube-scheduler 設定（v1）](/zh-tw/docs/reference/config-api/kube-scheduler-config.v1/)
* [kube-controller-manager 設定（v1alpha1）](/zh-tw/docs/reference/config-api/kube-controller-manager-config.v1alpha1/)
* [kube-proxy 設定（v1alpha1）](/zh-tw/docs/reference/config-api/kube-proxy-config.v1alpha1/)
* [`audit.k8s.io/v1` API](/zh-tw/docs/reference/config-api/apiserver-audit.v1/)
* [用戶端身分驗證 API（v1beta1）](/zh-tw/docs/reference/config-api/client-authentication.v1beta1/)及
  [用戶端身分驗證 API（v1）](/zh-tw/docs/reference/config-api/client-authentication.v1/)
* [WebhookAdmission 設定（v1）](/zh-tw/docs/reference/config-api/apiserver-webhookadmission.v1/)
* [ImagePolicy API（v1alpha1）](/zh-tw/docs/reference/config-api/imagepolicy.v1alpha1/)

<!--
## Config API for kubeadm

* [v1beta3](/docs/reference/config-api/kubeadm-config.v1beta3/)
* [v1beta4](/docs/reference/config-api/kubeadm-config.v1beta4/)
-->
## kubeadm 設定 API   {#config-api-for-kubeadm}

* [v1beta3](/zh-tw/docs/reference/config-api/kubeadm-config.v1beta3/)
* [v1beta4](/zh-tw/docs/reference/config-api/kubeadm-config.v1beta4/)

<!--
## External APIs

These are the APIs defined by the Kubernetes project, but are not implemented
by the core project:

* [Metrics API (v1beta1)](/docs/reference/external-api/metrics.v1beta1/)
* [Custom Metrics API (v1beta2)](/docs/reference/external-api/custom-metrics.v1beta2)
* [External Metrics API (v1beta1)](/docs/reference/external-api/external-metrics.v1beta1)
-->
## 外部 API    {#external-apis}

這些 API 由 Kubernetes 專案所定義，但並非由核心專案實作：

* [指標 API（v1beta1）](/zh-tw/docs/reference/external-api/metrics.v1beta1/)
* [自訂指標 API（v1beta2）](/zh-tw/docs/reference/external-api/custom-metrics.v1beta2)
* [外部指標 API（v1beta1）](/zh-tw/docs/reference/external-api/external-metrics.v1beta1)

<!--
## Design Docs

An archive of the design docs for Kubernetes functionality. Good starting points are
[Kubernetes Architecture](https://git.k8s.io/design-proposals-archive/architecture/architecture.md) and
[Kubernetes Design Overview](https://git.k8s.io/design-proposals-archive).
-->
## 設計文件   {#design-docs}

此處彙整 Kubernetes 功能的設計文件。建議可從以下文件開始閱讀：
[Kubernetes 架構](https://git.k8s.io/design-proposals-archive/architecture/architecture.md)和
[Kubernetes 設計概覽](https://git.k8s.io/design-proposals-archive)

<!--
## Encodings

Tools such as {{< glossary_tooltip text="kubectl" term_id="kubectl" >}}
can work with different formats / encodings. These include:
-->
## 編碼

諸如 {{< glossary_tooltip text="kubectl" term_id="kubectl" >}} 等工具，
可處理不同的格式與編碼，包括：

<!--
* [CBOR](https://cbor.io/), used on the network but **not** available as a kubectl output format
  * See [CBOR resource encoding](/docs/reference/using-api/api-concepts/#cbor-encoding)
* [JSON](https://www.json.org/), available as a `kubectl` output format and also used at the HTTP layer
* [KYAML](/docs/reference/encodings/kyaml), a Kubernetes dialect of YAML
  * KYAML is essentially an _output format_; any place where you can provide KYAML to Kubernetes, you can also provide any other valid YAML input
* [YAML](https://yaml.org/), available as a `kubectl` output format and also used at the HTTP layer
-->
* [CBOR](https://cbor.io/)，用於網路傳輸，但**不**支援作為 kubectl 的輸出格式。
  * 請參閱 [CBOR 資源編碼](/zh-tw/docs/reference/using-api/api-concepts/#cbor-encoding)
* [JSON](https://www.json.org/)，可作為 `kubectl` 的輸出格式，也用於 HTTP 層。
* [KYAML](/zh-tw/docs/reference/encodings/kyaml)，為 Kubernetes 所使用的 YAML 方言。
  * KYAML 本質上是一種**輸出格式**；在任何可提供 KYAML 給 Kubernetes 的情境中，
    也可提供其他任何有效的 YAML 輸入。
* [YAML](https://yaml.org/)，可作為 `kubectl` 的輸出格式，也用於 HTTP 層。

<!--
Kubernetes also has a custom [protobuf encoding](/docs/reference/using-api/api-concepts/#protobuf-encoding) that is only used within HTTP messages.

The `kubectl` tool supports some other output formats, such as _custom columns_;
see [output formats](/docs/reference/kubectl/#output-options) in the kubectl reference.
-->
Kubernetes 也提供一種自訂的
[protobuf 編碼](/zh-tw/docs/reference/using-api/api-concepts/#protobuf-encoding)，
僅用於 HTTP 訊息中。

`kubectl` 工具也支援其他輸出格式，例如**自訂欄位**；
詳情請參閱 kubectl 參考文件中的[輸出格式](/zh-tw/docs/reference/kubectl/#output-options)。
