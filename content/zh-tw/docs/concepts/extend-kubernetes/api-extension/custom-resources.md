---
title: 定製資源
api_metadata:
- apiVersion: "apiextensions.k8s.io/v1"
  kind: "CustomResourceDefinition"
content_type: concept
weight: 10
---
<!--
title: Custom Resources
reviewers:
- enisoc
- deads2k
api_metadata:
- apiVersion: "apiextensions.k8s.io/v1"
  kind: "CustomResourceDefinition"
content_type: concept
weight: 10
-->

<!-- overview -->

<!--
*Custom resources* are extensions of the Kubernetes API. This page discusses when to add a custom
resource to your Kubernetes cluster and when to use a standalone service. It describes the two
methods for adding custom resources and how to choose between them.
-->
**定製資源（Custom Resource）** 是對 Kubernetes API 的擴展。
本頁討論何時向 Kubernetes 叢集添加定製資源，何時使用獨立的服務。
本頁描述添加定製資源的兩種方法以及怎樣在二者之間做出抉擇。

<!-- body -->

<!--
## Custom resources

A *resource* is an endpoint in the [Kubernetes API](/docs/concepts/overview/kubernetes-api/) that
stores a collection of {{< glossary_tooltip text="API objects" term_id="object" >}}
of a certain kind; for example, the built-in *pods* resource contains a collection of Pod objects.
-->
## 定製資源  {#custom-resources}

**資源（Resource）** 是
[Kubernetes API](/zh-cn/docs/concepts/overview/kubernetes-api/) 中的一個端點，
其中存儲的是某個類別的
{{< glossary_tooltip text="API 對象" term_id="object" >}}的一個集合。
例如內置的 **Pod** 資源包含一組 Pod 對象。

<!--
A *custom resource* is an extension of the Kubernetes API that is not necessarily available in a default
Kubernetes installation. It represents a customization of a particular Kubernetes installation. However,
many core Kubernetes functions are now built using custom resources, making Kubernetes more modular.

Custom resources can appear and disappear in a running cluster through dynamic registration,
and cluster admins can update custom resources independently of the cluster itself.
Once a custom resource is installed, users can create and access its objects using
{{< glossary_tooltip text="kubectl" term_id="kubectl" >}}, just as they do for built-in resources
like *Pods*.
-->
**定製資源（Custom Resource）** 是對 Kubernetes API 的擴展，不一定在默認的
Kubernetes 安裝中就可用。定製資源所代表的是對特定 Kubernetes 安裝的一種定製。
不過，很多 Kubernetes 核心功能現在都用定製資源來實現，這使得 Kubernetes 更加模塊化。

定製資源可以通過動態註冊的方式在運行中的叢集內或出現或消失，叢集管理員可以獨立於叢集更新定製資源。
一旦某定製資源被安裝，使用者可以使用 {{< glossary_tooltip text="kubectl" term_id="kubectl" >}}
來創建和訪問其中的對象，就像他們爲 **Pod** 這種內置資源所做的一樣。

<!--
## Custom controllers

On their own, custom resources let you store and retrieve structured data.
When you combine a custom resource with a *custom controller*, custom resources
provide a true _declarative API_.
-->
## 定製控制器   {#custom-controllers}

就定製資源本身而言，它只能用來存取結構化的數據。
當你將定製資源與**定製控制器（Custom Controller）** 結合時，
定製資源就能夠提供真正的**聲明式 API（Declarative API）**。

<!--
The Kubernetes [declarative API](/docs/concepts/overview/kubernetes-api/)
enforces a separation of responsibilities. You declare the desired state of
your resource. The Kubernetes controller keeps the current state of Kubernetes
objects in sync with your declared desired state. This is in contrast to an
imperative API, where you *instruct* a server what to do.
-->
Kubernetes [聲明式 API](/zh-cn/docs/concepts/overview/kubernetes-api/) 強制對職權做了一次分離操作。
你聲明所用資源的期望狀態，而 Kubernetes 控制器使 Kubernetes 對象的當前狀態與你所聲明的期望狀態保持同步。
聲明式 API 的這種機制與命令式 API（你**指示**伺服器要做什麼，伺服器就去做什麼）形成鮮明對比。

<!--
You can deploy and update a custom controller on a running cluster, independently
of the cluster's lifecycle. Custom controllers can work with any kind of resource,
but they are especially effective when combined with custom resources. The
[Operator pattern](/docs/concepts/extend-kubernetes/operator/) combines custom
resources and custom controllers. You can use custom controllers to encode domain knowledge
for specific applications into an extension of the Kubernetes API.
-->
你可以在一個運行中的叢集上部署和更新定製控制器，這類操作與叢集的生命週期無關。
定製控制器可以用於任何類別的資源，不過它們與定製資源結合起來時最爲有效。
[Operator 模式](/zh-cn/docs/concepts/extend-kubernetes/operator/)就是將定製資源與定製控制器相結合的。
你可以使用定製控制器來將特定於某應用的領域知識組織起來，以編碼的形式構造對 Kubernetes API 的擴展。

<!--
## Should I add a custom resource to my Kubernetes cluster?

When creating a new API, consider whether to
[aggregate your API with the Kubernetes cluster APIs](/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/)
or let your API stand alone.
-->
## 我是否應該向我的 Kubernetes 叢集添加定製資源？   {#should-i-add-a-cr-to-my-k8s-cluster}

在創建新的 API 時，
請考慮是[將你的 API 與 Kubernetes 叢集 API 聚合起來](/zh-cn/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/)，
還是讓你的 API 獨立運行。

<!--
| Consider API aggregation if: | Prefer a stand-alone API if: |
| ---------------------------- | ---------------------------- |
| Your API is [Declarative](#declarative-apis). | Your API does not fit the [Declarative](#declarative-apis) model. |
| You want your new types to be readable and writable using `kubectl`.| `kubectl` support is not required |
| You want to view your new types in a Kubernetes UI, such as dashboard, alongside built-in types. | Kubernetes UI support is not required. |
| You are developing a new API. | You already have a program that serves your API and works well. |
| You are willing to accept the format restriction that Kubernetes puts on REST resource paths, such as API Groups and Namespaces. (See the [API Overview](/docs/concepts/overview/kubernetes-api/).) | You need to have specific REST paths to be compatible with an already defined REST API. |
| Your resources are naturally scoped to a cluster or namespaces of a cluster. | Cluster or namespace scoped resources are a poor fit; you need control over the specifics of resource paths. |
| You want to reuse [Kubernetes API support features](#common-features).  | You don't need those features. |
-->
| 考慮 API 聚合的情況 | 優選獨立 API 的情況 |
| ---------------------------- | ---------------------------- |
| 你的 API 是[聲明式的](#declarative-apis)。 | 你的 API 不符合[聲明式](#declarative-apis)模型。 |
| 你希望可以是使用 `kubectl` 來讀寫你的新資源類別。 | 不要求 `kubectl` 支持。 |
| 你希望在 Kubernetes UI （如儀表板）中和其他內置類別一起查看你的新資源類別。 | 不需要 Kubernetes UI 支持。 |
| 你在開發新的 API。 | 你已經有一個提供 API 服務的程序並且工作良好。 |
| 你有意願取接受 Kubernetes 對 REST 資源路徑所作的格式限制，例如 API 組和名字空間。（參閱 [API 概述](/zh-cn/docs/concepts/overview/kubernetes-api/)） | 你需要使用一些特殊的 REST 路徑以便與已經定義的 REST API 保持兼容。 |
| 你的資源可以自然地界定爲叢集作用域或叢集中某個名字空間作用域。 | 叢集作用域或名字空間作用域這種二分法很不合適；你需要對資源路徑的細節進行控制。 |
| 你希望複用 [Kubernetes API 支持特性](#common-features)。  | 你不需要這類特性。 |

<!--
### Declarative APIs

In a Declarative API, typically:

- Your API consists of a relatively small number of relatively small objects (resources).
- The objects define configuration of applications or infrastructure.
- The objects are updated relatively infrequently.
- Humans often need to read and write the objects.
- The main operations on the objects are CRUD-y (creating, reading, updating and deleting).
- Transactions across objects are not required: the API represents a desired state, not an exact state.
-->
### 聲明式 API   {#declarative-apis}

典型地，在聲明式 API 中：

- 你的 API 包含相對而言爲數不多的、尺寸較小的對象（資源）。
- 對象定義了應用或者基礎設施的設定信息。
- 對象更新操作頻率較低。
- 通常需要人來讀取或寫入對象。
- 對象的主要操作是 CRUD 風格的（創建、讀取、更新和刪除）。
- 不需要跨對象的事務支持：API 對象代表的是期望狀態而非確切實際狀態。

<!--
Imperative APIs are not declarative.
Signs that your API might not be declarative include:

- The client says "do this", and then gets a synchronous response back when it is done.
- The client says "do this", and then gets an operation ID back, and has to check a separate
  Operation object to determine completion of the request.
- You talk about Remote Procedure Calls (RPCs).
- Directly storing large amounts of data; for example, > a few kB per object, or > 1000s of objects.
- High bandwidth access (10s of requests per second sustained) needed.
- Store end-user data (such as images, PII, etc.) or other large-scale data processed by applications.
- The natural operations on the objects are not CRUD-y.
- The API is not easily modeled as objects.
- You chose to represent pending operations with an operation ID or an operation object.
-->
命令式 API（Imperative API）與聲明式有所不同。
以下跡象表明你的 API 可能不是聲明式的：

- 客戶端發出“做這個操作”的指令，之後在該操作結束時獲得同步響應。
- 客戶端發出“做這個操作”的指令，並獲得一個操作 ID，之後需要檢查一個 Operation（操作）
  對象來判斷請求是否成功完成。
- 你會將你的 API 類比爲遠程過程調用（Remote Procedure Call，RPC）。
- 直接存儲大量數據；例如每個對象幾 kB，或者存儲上千個對象。
- 需要較高的訪問帶寬（長期保持每秒數十個請求）。
- 存儲有應用來處理的最終使用者數據（如圖片、個人標識信息（PII）等）或者其他大規模數據。
- 在對象上執行的常規操作並非 CRUD 風格。
- API 不太容易用對象來建模。
- 你決定使用操作 ID 或者操作對象來表現懸決的操作。

<!--
## Should I use a ConfigMap or a custom resource?

Use a ConfigMap if any of the following apply:

* There is an existing, well-documented configuration file format, such as a `mysql.cnf` or
  `pom.xml`.
* You want to put the entire configuration into one key of a ConfigMap.
* The main use of the configuration file is for a program running in a Pod on your cluster to
  consume the file to configure itself.
* Consumers of the file prefer to consume via file in a Pod or environment variable in a pod,
  rather than the Kubernetes API.
* You want to perform rolling updates via Deployment, etc., when the file is updated.
-->
## 我應該使用一個 ConfigMap 還是一個定製資源？   {#should-i-use-a-configmap-or-a-cr}

如果滿足以下條件之一，應該使用 ConfigMap：

* 存在一個已有的、文檔完備的設定文件格式約定，例如 `mysql.cnf` 或 `pom.xml`。
* 你希望將整個設定文件放到某 configMap 中的一個主鍵下面。
* 設定文件的主要用途是針對運行在叢集中 Pod 內的程序，供後者依據文件數據設定自身行爲。
* 文件的使用者期望以 Pod 內文件或者 Pod 內環境變量的形式來使用文件數據，
  而不是通過 Kubernetes API。
* 你希望當文件被更新時通過類似 Deployment 之類的資源完成滾動更新操作。

{{< note >}}
<!--
Use a {{< glossary_tooltip text="Secret" term_id="secret" >}} for sensitive data, which is similar
to a ConfigMap but more secure.
-->
請使用 {{< glossary_tooltip text="Secret" term_id="secret" >}} 來保存敏感數據。
Secret 類似於 configMap，但更爲安全。
{{< /note >}}

<!--
Use a custom resource (CRD or Aggregated API) if most of the following apply:

* You want to use Kubernetes client libraries and CLIs to create and update the new resource.
* You want top-level support from `kubectl`; for example, `kubectl get my-object object-name`.
* You want to build new automation that watches for updates on the new object, and then CRUD other
  objects, or vice versa.
* You want to write automation that handles updates to the object.
* You want to use Kubernetes API conventions like `.spec`, `.status`, and `.metadata`.
* You want the object to be an abstraction over a collection of controlled resources, or a
  summarization of other resources.
-->
如果以下條件中大多數都被滿足，你應該使用定製資源（CRD 或者 聚合 API）：

* 你希望使用 Kubernetes 客戶端庫和 CLI 來創建和更改新的資源。
* 你希望 `kubectl` 能夠直接支持你的資源；例如，`kubectl get my-object object-name`。
* 你希望構造新的自動化機制，監測新對象上的更新事件，並對其他對象執行 CRUD
  操作，或者監測後者更新前者。
* 你希望編寫自動化組件來處理對對象的更新。
* 你希望使用 Kubernetes API 對諸如 `.spec`、`.status` 和 `.metadata` 等字段的約定。
* 你希望對象是對一組受控資源的抽象，或者對其他資源的歸納提煉。

<!--
## Adding custom resources

Kubernetes provides two ways to add custom resources to your cluster:

- CRDs are simple and can be created without any programming.
- [API Aggregation](/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/)
  requires programming, but allows more control over API behaviors like how data is stored and
  conversion between API versions.
-->
## 添加定製資源   {#adding-custom-resources}

Kubernetes 提供了兩種方式供你向叢集中添加定製資源：

- CRD 相對簡單，創建 CRD 可以不必編程。
- [API 聚合](/zh-cn/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/)需要編程，
  但支持對 API 行爲進行更多的控制，例如數據如何存儲以及在不同 API 版本間如何轉換等。

<!--
Kubernetes provides these two options to meet the needs of different users, so that neither ease
of use nor flexibility is compromised.

Aggregated APIs are subordinate API servers that sit behind the primary API server, which acts as
a proxy. This arrangement is called [API Aggregation](/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/)(AA).
To users, the Kubernetes API appears extended.

CRDs allow users to create new types of resources without adding another API server. You do not
need to understand API Aggregation to use CRDs.

Regardless of how they are installed, the new resources are referred to as Custom Resources to
distinguish them from built-in Kubernetes resources (like pods).
-->
Kubernetes 提供這兩種選項以滿足不同使用者的需求，這樣就既不會犧牲易用性也不會犧牲靈活性。

聚合 API 指的是一些下位的 API 伺服器，運行在主 API 伺服器後面；主 API
伺服器以代理的方式工作。這種組織形式稱作
[API 聚合（API Aggregation，AA）](/zh-cn/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/) 。
對使用者而言，看起來僅僅是 Kubernetes API 被擴展了。

CRD 允許使用者創建新的資源類別同時又不必添加新的 API 伺服器。
使用 CRD 時，你並不需要理解 API 聚合。

無論以哪種方式安裝定製資源，新的資源都會被當做定製資源，以便與內置的
Kubernetes 資源（如 Pods）相區分。

{{< note >}}
<!--
Avoid using a Custom Resource as data storage for application, end user, or monitoring data:
architecture designs that store application data within the Kubernetes API typically represent
a design that is too closely coupled.

Architecturally, [cloud native](https://www.cncf.io/about/faq/#what-is-cloud-native) application architectures
favor loose coupling between components. If part of your workload requires a backing service for
its routine operation, run that backing service as a component or consume it as an external service.
This way, your workload does not rely on the Kubernetes API for its normal operation.
-->
避免將定製資源用於存儲應用、最終使用者或監控數據：
將應用數據存儲在 Kubernetes API 內的架構設計通常代表一種過於緊密耦合的設計。

在架構上，[雲原生](https://www.cncf.io/about/faq/#what-is-cloud-native)應用架構傾向於各組件之間的鬆散耦合。
如果部分工作負載需要支持服務來維持其日常運轉，則這種支持服務應作爲一個組件運行或作爲一個外部服務來使用。
這樣，工作負載的正常運轉就不會依賴 Kubernetes API 了。
{{< /note >}}

<!--
## CustomResourceDefinitions

The [CustomResourceDefinition](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/)
API resource allows you to define custom resources.
Defining a CRD object creates a new custom resource with a name and schema that you specify.
The Kubernetes API serves and handles the storage of your custom resource.
The name of the CRD object itself must be a valid
[DNS subdomain name](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names) derived from the defined resource name and its API group; see [how to create a CRD](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions#create-a-customresourcedefinition) for more details.
Further, the name of an object whose kind/resource is defined by a CRD must also be a valid DNS subdomain name.
-->
## CustomResourceDefinitions

[CustomResourceDefinition](/zh-cn/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/)
API 資源允許你定義定製資源。
定義 CRD 對象的操作會使用你所設定的名字和模式定義（Schema）創建一個新的定製資源，
Kubernetes API 負責爲你的定製資源提供存儲和訪問服務。
CRD 對象的名稱必須是有效的 [DNS 子域名](/zh-cn/docs/concepts/overview/working-with-objects/names#dns-subdomain-names)，
該名稱由定義的資源名稱及其 API 組派生而來。有關詳細信息，
請參見[如何創建 CRD](/zh-cn/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions#create-a-customresourcedefinition)。
此外，由 CRD 定義的某種對象/資源的名稱也必須是有效的 DNS 子域名。

<!--
This frees you from writing your own API server to handle the custom resource,
but the generic nature of the implementation means you have less flexibility than with
[API server aggregation](#api-server-aggregation).

Refer to the [custom controller example](https://github.com/kubernetes/sample-controller)
for an example of how to register a new custom resource, work with instances of your new resource type,
and use a controller to handle events.
-->
CRD 使得你不必編寫自己的 API 伺服器來處理定製資源，不過其背後實現的通用性也意味着你所獲得的靈活性要比
[API 伺服器聚合](#api-server-aggregation)少很多。

關於如何註冊新的定製資源、使用新資源類別的實例以及如何使用控制器來處理事件，
相關的例子可參見[定製控制器示例](https://github.com/kubernetes/sample-controller)。

<!--
## API server aggregation

Usually, each resource in the Kubernetes API requires code that handles REST requests and manages
persistent storage of objects. The main Kubernetes API server handles built-in resources like
*pods* and *services*, and can also generically handle custom resources through
[CRDs](#customresourcedefinitions).

The [aggregation layer](/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/)
allows you to provide specialized implementations for your custom resources by writing and
deploying your own API server.
The main API server delegates requests to your API server for the custom resources that you handle,
making them available to all of its clients.
-->
## API 伺服器聚合  {#api-server-aggregation}

通常，Kubernetes API 中的每個資源都需要處理 REST 請求和管理對象持久性存儲的代碼。
Kubernetes API 主伺服器能夠處理諸如 **Pod** 和 **Service** 這些內置資源，
也可以按通用的方式通過 [CRD](#customresourcedefinitions) 來處理定製資源。

[聚合層（Aggregation Layer）](/zh-cn/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/)
使得你可以通過編寫和部署你自己的 API 伺服器來爲定製資源提供特殊的實現。
主 API 伺服器將針對你要處理的定製資源的請求全部委託給你自己的 API 伺服器來處理，
同時將這些資源提供給其所有客戶端。

<!--
## Choosing a method for adding custom resources

CRDs are easier to use. Aggregated APIs are more flexible. Choose the method that best meets your needs.

Typically, CRDs are a good fit if:

* You have a handful of fields
* You are using the resource within your company, or as part of a small open-source project (as
  opposed to a commercial product)
-->
## 選擇添加定製資源的方法   {#choosing-a-method-for-adding-cr}

CRD 更爲易用；聚合 API 則更爲靈活。請選擇最符合你的需要的方法。

通常，如果存在以下情況，CRD 可能更合適：

* 定製資源的字段不多；
* 你在組織內部使用該資源或者在一個小規模的開源項目中使用該資源，而不是在商業產品中使用。

<!--
### Comparing ease of use

CRDs are easier to create than Aggregated APIs.
-->
### 比較易用性  {#compare-ease-of-use}

CRD 比聚合 API 更容易創建。

<!--
| CRDs                        | Aggregated API |
| --------------------------- | -------------- |
| Do not require programming. Users can choose any language for a CRD controller. | Requires programming and building binary and image. |
| No additional service to run; CRDs are handled by API server. | An additional service to create and that could fail. |
| No ongoing support once the CRD is created. Any bug fixes are picked up as part of normal Kubernetes Master upgrades. | May need to periodically pickup bug fixes from upstream and rebuild and update the Aggregated API server. |
| No need to handle multiple versions of your API; for example, when you control the client for this resource, you can upgrade it in sync with the API. | You need to handle multiple versions of your API; for example, when developing an extension to share with the world. |
-->
| CRD                        | 聚合 API       |
| --------------------------- | -------------- |
| 無需編程。使用者可選擇任何語言來實現 CRD 控制器。 | 需要編程，並構建可執行文件和映像檔。 |
| 無需額外運行服務；CRD 由 API 伺服器處理。 | 需要額外創建服務，且該服務可能失效。 |
| 一旦 CRD 被創建，不需要持續提供支持。Kubernetes 主控節點升級過程中自動會帶入缺陷修復。 | 可能需要週期性地從上游提取缺陷修復並更新聚合 API 伺服器。 |
| 無需處理 API 的多個版本；例如，當你控制資源的客戶端時，你可以更新它使之與 API 同步。 | 你需要處理 API 的多個版本；例如，在開發打算與很多人共享的擴展時。 |

<!--
### Advanced features and flexibility

Aggregated APIs offer more advanced API features and customization of other features; for example, the storage layer.
-->
### 高級特性與靈活性  {#advanced-features-and-flexibility}

聚合 API 可提供更多的高級 API 特性，也可對其他特性實行定製；例如，對存儲層進行定製。

<!--
| Feature | Description | CRDs | Aggregated API |
| ------- | ----------- | ---- | -------------- |
| Validation | Help users prevent errors and allow you to evolve your API independently of your clients. These features are most useful when there are many clients who can't all update at the same time. | Yes.  Most validation can be specified in the CRD using [OpenAPI v3.0 validation](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#validation). [CRDValidationRatcheting](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#validation-ratcheting) feature gate allows failing validations specified using OpenAPI also can be ignored if the failing part of the resource was unchanged.  Any other validations supported by addition of a [Validating Webhook](/docs/reference/access-authn-authz/admission-controllers/#validatingadmissionwebhook-alpha-in-1-8-beta-in-1-9). | Yes, arbitrary validation checks |
| Defaulting | See above | Yes, either via [OpenAPI v3.0 validation](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#defaulting) `default` keyword (GA in 1.17), or via a [Mutating Webhook](/docs/reference/access-authn-authz/admission-controllers/#mutatingadmissionwebhook) (though this will not be run when reading from etcd for old objects). | Yes |
| Multi-versioning | Allows serving the same object through two API versions. Can help ease API changes like renaming fields. Less important if you control your client versions. | [Yes](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definition-versioning) | Yes |
| Custom Storage | If you need storage with a different performance mode (for example, a time-series database instead of key-value store) or isolation for security (for example, encryption of sensitive information, etc.) | No | Yes |
| Custom Business Logic | Perform arbitrary checks or actions when creating, reading, updating or deleting an object | Yes, using [Webhooks](/docs/reference/access-authn-authz/extensible-admission-controllers/#admission-webhooks). | Yes |
| Scale Subresource | Allows systems like HorizontalPodAutoscaler and PodDisruptionBudget interact with your new resource | [Yes](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#scale-subresource)  | Yes |
| Status Subresource | Allows fine-grained access control where user writes the spec section and the controller writes the status section. Allows incrementing object Generation on custom resource data mutation (requires separate spec and status sections in the resource) | [Yes](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#status-subresource) | Yes |
| Other Subresources | Add operations other than CRUD, such as "logs" or "exec". | No | Yes |
| strategic-merge-patch | The new endpoints support PATCH with `Content-Type: application/strategic-merge-patch+json`. Useful for updating objects that may be modified both locally, and by the server. For more information, see ["Update API Objects in Place Using kubectl patch"](/docs/tasks/manage-kubernetes-objects/update-api-object-kubectl-patch/) | No | Yes |
| Protocol Buffers | The new resource supports clients that want to use Protocol Buffers | No | Yes |
| OpenAPI Schema | Is there an OpenAPI (swagger) schema for the types that can be dynamically fetched from the server? Is the user protected from misspelling field names by ensuring only allowed fields are set? Are types enforced (in other words, don't put an `int` in a `string` field?) | Yes, based on the [OpenAPI v3.0 validation](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#validation) schema (GA in 1.16). | Yes |
| Instance Name | Does this extension mechanism impose any constraints on the names of objects whose kind/resource is defined this way? | Yes, such an object's name must be a valid DNS subdomain name. | No |
-->
| 特性    | 描述        | CRD | 聚合 API       |
| ------- | ----------- | ---- | -------------- |
| 合法性檢查 | 幫助使用者避免錯誤，允許你獨立於客戶端版本演化 API。這些特性對於由很多無法同時更新的客戶端的場合。| 可以。大多數驗證可以使用 [OpenAPI v3.0 合法性檢查](/zh-cn/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#validation) 來設定。[CRDValidationRatcheting](/zh-cn/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#validation-ratcheting) 特性門控允許在資源的失敗部分未發生變化的情況下，忽略 OpenAPI 指定的失敗驗證。其他合法性檢查操作可以通過添加[合法性檢查 Webhook](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#validatingadmissionwebhook-alpha-in-1-8-beta-in-1-9)來實現。 | 可以，可執行任何合法性檢查。|
| 默認值設置 | 同上 | 可以。可通過 [OpenAPI v3.0 合法性檢查](/zh-cn/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#defaulting)的 `default` 關鍵詞（自 1.17 正式發佈）或[更改性（Mutating）Webhook](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#mutatingadmissionwebhook)來實現（不過從 etcd 中讀取老的對象時不會執行這些 Webhook）。 | 可以。 |
| 多版本支持 | 允許通過兩個 API 版本同時提供同一對象。可幫助簡化類似字段更名這類 API 操作。如果你能控制客戶端版本，這一特性將不再重要。 | [可以](/zh-cn/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definition-versioning)。 | 可以。 |
| 定製存儲 | 支持使用具有不同性能模式的存儲（例如，要使用時間序列數據庫而不是鍵值存儲），或者因安全性原因對存儲進行隔離（例如對敏感信息執行加密）。 | 不可以。 | 可以。 |
| 定製業務邏輯 | 在創建、讀取、更新或刪除對象時，執行任意的檢查或操作。 | 可以。要使用 [Webhook](/zh-cn/docs/reference/access-authn-authz/extensible-admission-controllers/#admission-webhooks)。 | 可以。 |
| 支持 scale 子資源 | 允許 HorizontalPodAutoscaler 和 PodDisruptionBudget 這類子系統與你的新資源交互。 | [可以](/zh-cn/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#scale-subresource)。 | 可以。 |
| 支持 status 子資源 | 允許在使用者寫入 spec 部分而控制器寫入 status 部分時執行細粒度的訪問控制。允許在對定製資源的數據進行更改時增加對象的代際（Generation）；這需要資源對 spec 和 status 部分有明確劃分。| [可以](/zh-cn/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#status-subresource)。 | 可以。 |
| 其他子資源 | 添加 CRUD 之外的操作，例如 "logs" 或 "exec"。 | 不可以。 | 可以。 |
| strategic-merge-patch | 新的端點要支持標記了 `Content-Type: application/strategic-merge-patch+json` 的 PATCH 操作。對於更新既可在本地更改也可在伺服器端更改的對象而言是有用的。要了解更多信息，可參見[使用 `kubectl patch` 來更新 API 對象](/zh-cn/docs/tasks/manage-kubernetes-objects/update-api-object-kubectl-patch/)。 | 不可以。 | 可以。 |
| 支持協議緩衝區 | 新的資源要支持想要使用協議緩衝區（Protocol Buffer）的客戶端。 | 不可以。 | 可以。 |
| OpenAPI Schema | 是否存在新資源類別的 OpenAPI（Swagger）Schema 可供動態從伺服器上讀取？是否存在機制確保只能設置被允許的字段以避免使用者犯字段拼寫錯誤？是否實施了字段類型檢查（換言之，不允許在 `string` 字段設置 `int` 值）？ | 可以，依據 [OpenAPI v3.0 合法性檢查](/zh-cn/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#validation) 模式（1.16 中進入正式發佈狀態）。 | 可以。|
| 實例名稱 | 這種擴展機制是否對通過這種方式定義的對象（類別/資源）的名稱有任何限制? | 可以，此類對象的名稱必須是一個有效的 DNS 子域名。 | 不可以|

<!--
### Common Features

When you create a custom resource, either via a CRD or an AA, you get many features for your API,
compared to implementing it outside the Kubernetes platform:
-->
### 公共特性  {#common-features}

與在 Kubernetes 平臺之外實現定製資源相比，
無論是通過 CRD 還是通過聚合 API 來創建定製資源，你都會獲得很多 API 特性：

<!--
| Feature | What it does |
| ------- | ------------ |
| CRUD | The new endpoints support CRUD basic operations via HTTP and `kubectl` |
| Watch | The new endpoints support Kubernetes Watch operations via HTTP |
| Discovery | Clients like `kubectl` and dashboard automatically offer list, display, and field edit operations on your resources |
| json-patch | The new endpoints support PATCH with `Content-Type: application/json-patch+json` |
| merge-patch | The new endpoints support PATCH with `Content-Type: application/merge-patch+json` |
| HTTPS | The new endpoints uses HTTPS |
| Built-in Authentication | Access to the extension uses the core API server (aggregation layer) for authentication |
| Built-in Authorization | Access to the extension can reuse the authorization used by the core API server; for example, RBAC. |
| Finalizers | Block deletion of extension resources until external cleanup happens. |
| Admission Webhooks | Set default values and validate extension resources during any create/update/delete operation. |
| UI/CLI Display | Kubectl, dashboard can display extension resources. |
| Unset versus Empty | Clients can distinguish unset fields from zero-valued fields. |
| Client Libraries Generation | Kubernetes provides generic client libraries, as well as tools to generate type-specific client libraries. |
| Labels and annotations | Common metadata across objects that tools know how to edit for core and custom resources. |
-->
| 功能特性 | 具體含義     |
| -------- | ------------ |
| CRUD | 新的端點支持通過 HTTP 和 `kubectl` 發起的 CRUD 基本操作 |
| 監測（Watch） | 新的端點支持通過 HTTP 發起的 Kubernetes Watch 操作 |
| 發現（Discovery） | 類似 `kubectl` 和儀表盤（Dashboard）這類客戶端能夠自動提供列舉、顯示、在字段級編輯你的資源的操作 |
| json-patch | 新的端點支持帶 `Content-Type: application/json-patch+json` 的 PATCH 操作 |
| merge-patch | 新的端點支持帶 `Content-Type: application/merge-patch+json` 的 PATCH 操作 |
| HTTPS | 新的端點使用 HTTPS |
| 內置身份認證 | 對擴展的訪問會使用核心 API 伺服器（聚合層）來執行身份認證操作 |
| 內置鑑權授權 | 對擴展的訪問可以複用核心 API 伺服器所使用的鑑權授權機制；例如，RBAC |
| Finalizers | 在外部清除工作結束之前阻止擴展資源被刪除 |
| 准入 Webhooks | 在創建、更新和刪除操作中對擴展資源設置默認值和執行合法性檢查 |
| UI/CLI 展示 | `kubectl` 和儀表盤（Dashboard）可以顯示擴展資源 |
| 區分未設置值和空值 | 客戶端能夠區分哪些字段是未設置的，哪些字段的值是被顯式設置爲零值的  |
| 生成客戶端庫 | Kubernetes 提供通用的客戶端庫，以及用來生成特定類別客戶端庫的工具 |
| 標籤和註解 | 提供涵蓋所有對象的公共元數據結構，且工具知曉如何編輯核心資源和定製資源的這些元數據 |

<!--
## Preparing to install a custom resource

There are several points to be aware of before adding a custom resource to your cluster.
-->
## 準備安裝定製資源   {#preparing-to-install-a-cr}

在向你的叢集添加定製資源之前，有些事情需要搞清楚。

<!--
### Third party code and new points of failure

While creating a CRD does not automatically add any new points of failure (for example, by causing
third party code to run on your API server), packages (for example, Charts) or other installation
bundles often include CRDs as well as a Deployment of third-party code that implements the
business logic for a new custom resource.

Installing an Aggregated API server always involves running a new Deployment.
-->
### 第三方代碼和新的失效點的問題   {#third-party-code-and-new-points-of-failure}

儘管添加新的 CRD 不會自動帶來新的失效點（Point of
Failure），例如導致第三方代碼被在 API 伺服器上運行，
類似 Helm Charts 這種軟件包或者其他安裝包通常在提供 CRD
的同時還包含帶有第三方代碼的 Deployment，負責實現新的定製資源的業務邏輯。

安裝聚合 API 伺服器時，也總會牽涉到運行一個新的 Deployment。

<!--
### Storage

Custom resources consume storage space in the same way that ConfigMaps do. Creating too many
custom resources may overload your API server's storage space.

Aggregated API servers may use the same storage as the main API server, in which case the same
warning applies.
-->
### 存儲    {#storage}

定製資源和 ConfigMap 一樣也會消耗存儲空間。創建過多的定製資源可能會導致
API 伺服器上的存儲空間超載。

聚合 API 伺服器可以使用主 API 伺服器相同的存儲。如果是這樣，你也要注意此警告。

<!--
### Authentication, authorization, and auditing

CRDs always use the same authentication, authorization, and audit logging as the built-in
resources of your API server.

If you use RBAC for authorization, most RBAC roles will not grant access to the new resources
(except the cluster-admin role or any role created with wildcard rules). You'll need to explicitly
grant access to the new resources. CRDs and Aggregated APIs often come bundled with new role
definitions for the types they add.

Aggregated API servers may or may not use the same authentication, authorization, and auditing as
the primary API server.
-->
### 身份認證、鑑權授權以及審計    {#authentication-authorization-and-auditing}

CRD 通常與 API 伺服器上的內置資源一樣使用相同的身份認證、鑑權授權和審計日誌機制。

如果你使用 RBAC 來執行鑑權授權，大多數 RBAC 角色都不會授權對新資源的訪問
（除了 cluster-admin 角色以及使用通配符規則創建的其他角色）。
你要顯式地爲新資源的訪問授權。CRD 和聚合 API 通常在交付時會包含針對所添加的類別的新的角色定義。

聚合 API 伺服器可能會使用主 API 伺服器相同的身份認證、鑑權授權和審計機制，也可能不會。

<!--
## Accessing a custom resource

Kubernetes [client libraries](/docs/reference/using-api/client-libraries/) can be used to access
custom resources. Not all client libraries support custom resources. The _Go_ and _Python_ client
libraries do.

When you add a custom resource, you can access it using:

- `kubectl`
- The Kubernetes dynamic client.
- A REST client that you write.
- A client generated using [Kubernetes client generation tools](https://github.com/kubernetes/code-generator)
  (generating one is an advanced undertaking, but some projects may provide a client along with
  the CRD or AA).
-->
## 訪問定製資源   {#accessing-a-custom-resources}

Kubernetes [客戶端庫](/zh-cn/docs/reference/using-api/client-libraries/)可用來訪問定製資源。
並非所有客戶端庫都支持定製資源。**Go** 和 **Python** 客戶端庫是支持的。

當你添加了新的定製資源後，可以用如下方式之一訪問它們：

- `kubectl`
- Kubernetes 動態客戶端
- 你所編寫的 REST 客戶端
- 使用 [Kubernetes 客戶端生成工具](https://github.com/kubernetes/code-generator)所生成的客戶端。
  生成客戶端的工作有些難度，不過某些項目可能會隨着 CRD 或聚合 API 一起提供一個客戶端。

<!--
## Custom resource field selectors

[Field Selectors](/docs/concepts/overview/working-with-objects/field-selectors/)
let clients select custom resources based on the value of one or more resource
fields.
-->
## 定製資源字段選擇算符   {#custom-resource-field-selectors}

[字段選擇算符](/zh-cn/docs/concepts/overview/working-with-objects/field-selectors/)允許客戶端根據一個或多個資源字段的值選擇定製資源。

<!--
All custom resources support the `metadata.name` and `metadata.namespace` field
selectors.

Fields declared in a {{< glossary_tooltip term_id="CustomResourceDefinition" text="CustomResourceDefinition" >}}
may also be used with field selectors when included in the `spec.versions[*].selectableFields` field of the
{{< glossary_tooltip term_id="CustomResourceDefinition" text="CustomResourceDefinition" >}}.
-->
所有定製資源都支持 `metadata.name` 和 `metadata.namespace` 字段選擇算符。

當 {{< glossary_tooltip term_id="CustomResourceDefinition" text="CustomResourceDefinition" >}}
中聲明的字段包含在 {{< glossary_tooltip term_id="CustomResourceDefinition" text="CustomResourceDefinition" >}}
的 `spec.versions[*].selectableFields` 字段中時，也可以與字段選擇算符一起使用。

<!--
### Selectable fields for custom resources {#crd-selectable-fields}
-->
### 定製資源的可選擇字段   {#crd-selectable-fields}

{{< feature-state feature_gate_name="CustomResourceFieldSelectors" >}}

<!--
The `spec.versions[*].selectableFields` field of a {{< glossary_tooltip term_id="CustomResourceDefinition" text="CustomResourceDefinition" >}} may be used to
declare which other fields in a custom resource may be used in field selectors.

The following example adds the `.spec.color` and `.spec.size` fields as
selectable fields.
-->
你需要啓用 `CustomResourceFieldSelectors`
[特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)
來使用此行爲，然後將其應用到叢集中的所有 CustomResourceDefinitions。

{{< glossary_tooltip term_id="CustomResourceDefinition" text="CustomResourceDefinition" >}}
字段可以用來控制哪些字段可以用在字段選擇算符中。

以下示例將 `.spec.color` 和 `.spec.size` 字段添加爲可選擇字段。

{{% code_sample file="customresourcedefinition/shirt-resource-definition.yaml" %}}

<!--
Field selectors can then be used to get only resources with a `color` of `blue`:
-->
字段選擇算符隨後可用於僅獲取 `color` 爲 `blue` 的資源：

```shell
kubectl get shirts.stable.example.com --field-selector spec.color=blue
```

<!--
The output should be:
-->
輸出應該是：

```
NAME       COLOR  SIZE
example1   blue   S
example2   blue   M
```

## {{% heading "whatsnext" %}}

<!--
* Learn how to [Extend the Kubernetes API with the aggregation layer](/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/).
* Learn how to [Extend the Kubernetes API with CustomResourceDefinition](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/).
-->
* 瞭解如何[使用聚合層擴展 Kubernetes API](/zh-cn/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/)
* 瞭解如何[使用 CustomResourceDefinition 來擴展 Kubernetes API](/zh-cn/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/)

