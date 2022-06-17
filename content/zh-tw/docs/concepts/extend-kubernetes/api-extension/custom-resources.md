---
title: 定製資源
content_type: concept
weight: 10
---
<!--
title: Custom Resources
reviewers:
- enisoc
- deads2k
content_type: concept
weight: 10
-->

<!-- overview -->

<!--
*Custom resources* are extensions of the Kubernetes API. This page discusses when to add a custom
resource to your Kubernetes cluster and when to use a standalone service. It describes the two
methods for adding custom resources and how to choose between them.
-->
*定製資源（Custom Resource）* 是對 Kubernetes API 的擴充套件。
本頁討論何時向 Kubernetes 叢集新增定製資源，何時使用獨立的服務。
本頁描述新增定製資源的兩種方法以及怎樣在二者之間做出抉擇。

<!-- body -->

<!--
## Custom resources

A *resource* is an endpoint in the
[Kubernetes API](/docs/concepts/overview/kubernetes-api/) that stores a collection of
[API objects](/docs/concepts/overview/working-with-objects/kubernetes-objects/) of
a certain kind; for example, the built-in *pods* resource contains a
collection of Pod objects.
-->
## 定製資源

*資源（Resource）* 是
[Kubernetes API](/zh-cn/docs/concepts/overview/kubernetes-api/) 中的一個端點，
其中儲存的是某個類別的
[API 物件](/zh-cn/docs/concepts/overview/working-with-objects/kubernetes-objects/)
的一個集合。
例如內建的 *pods* 資源包含一組 Pod 物件。

<!--
A *custom resource* is an extension of the Kubernetes API that is not necessarily available in a default
Kubernetes installation. It represents a customization of a particular Kubernetes installation. However,
many core Kubernetes functions are now built using custom resources, making Kubernetes more modular.

Custom resources can appear and disappear in a running cluster through dynamic registration,
and cluster admins can update custom resources independently of the cluster itself.
Once a custom resource is installed, users can create and access its objects using
[kubectl](/docs/reference/kubectl/), just as they do for built-in resources like
*Pods*.
-->
*定製資源（Custom Resource）* 是對 Kubernetes API 的擴充套件，不一定在預設的
Kubernetes 安裝中就可用。定製資源所代表的是對特定 Kubernetes 安裝的一種定製。
不過，很多 Kubernetes 核心功能現在都用定製資源來實現，這使得 Kubernetes
更加模組化。

定製資源可以透過動態註冊的方式在執行中的叢集內或出現或消失，叢集管理員可以獨立於叢集
更新定製資源。一旦某定製資源被安裝，使用者可以使用 
[kubectl](/docs/reference/kubectl/)
來建立和訪問其中的物件，就像他們為 *pods* 這種內建資源所做的一樣。

<!--
## Custom controllers

On their own, custom resources let you store and retrieve structured data.
When you combine a custom resource with a *custom controller*, custom resources
provide a true _declarative API_.
-->
## 定製控制器   {#custom-controllers}

就定製資源本身而言，它只能用來存取結構化的資料。
當你將定製資源與 *定製控制器（Custom Controller）* 相結合時，定製資源就能夠
提供真正的 _宣告式 API（Declarative API）_。

<!--
A [declarative API](/docs/concepts/overview/kubernetes-api/)
allows you to _declare_ or specify the desired state of your resource and tries to
keep the current state of Kubernetes objects in sync with the desired state.
The controller interprets the structured data as a record of the user's
desired state, and continually maintains this state.
-->
使用[宣告式 API](/zh-cn/docs/concepts/overview/kubernetes-api/)，
你可以 _宣告_ 或者設定你的資源的期望狀態，並嘗試讓 Kubernetes 物件的當前狀態
同步到其期望狀態。控制器負責將結構化的資料解釋為使用者所期望狀態的記錄，並
持續地維護該狀態。

<!--
You can deploy and update a custom controller on a running cluster, independently
of the cluster's lifecycle. Custom controllers can work with any kind of resource,
but they are especially effective when combined with custom resources. The
[Operator pattern](/docs/concepts/extend-kubernetes/operator/) combines custom
resources and custom controllers. You can use custom controllers to encode domain knowledge
for specific applications into an extension of the Kubernetes API.
-->
你可以在一個執行中的叢集上部署和更新定製控制器，這類操作與叢集的生命週期無關。
定製控制器可以用於任何類別的資源，不過它們與定製資源結合起來時最為有效。
[Operator 模式](/zh-cn/docs/concepts/extend-kubernetes/operator/)就是將定製資源
與定製控制器相結合的。你可以使用定製控制器來將特定於某應用的領域知識組織
起來，以編碼的形式構造對 Kubernetes API 的擴充套件。

<!--
## Should I add a custom resource to my Kubernetes Cluster?

When creating a new API, consider whether to
[aggregate your API with the Kubernetes cluster APIs](/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/)
or let your API stand alone.
-->
## 我是否應該向我的 Kubernetes 叢集新增定製資源？

在建立新的 API 時，請考慮是
[將你的 API 與 Kubernetes 叢集 API 聚合起來](/zh-cn/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/)
還是讓你的 API 獨立執行。

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
| 你的 API 是[宣告式的](#declarative-apis)。 | 你的 API 不符合[宣告式](#declarative-apis)模型。 |
| 你希望可以是使用 `kubectl` 來讀寫你的新資源類別。 | 不要求 `kubectl` 支援。 |
| 你希望在 Kubernetes UI （如儀表板）中和其他內建類別一起檢視你的新資源類別。 | 不需要 Kubernetes UI 支援。 |
| 你在開發新的 API。 | 你已經有一個提供 API 服務的程式並且工作良好。 |
| 你有意願取接受 Kubernetes 對 REST 資源路徑所作的格式限制，例如 API 組和名字空間。（參閱 [API 概述](/zh-cn/docs/concepts/overview/kubernetes-api/)） | 你需要使用一些特殊的 REST 路徑以便與已經定義的 REST API 保持相容。 |
| 你的資源可以自然地界定為叢集作用域或叢集中某個名字空間作用域。 | 叢集作用域或名字空間作用域這種二分法很不合適；你需要對資源路徑的細節進行控制。 |
| 你希望複用 [Kubernetes API 支援特性](#common-features)。  | 你不需要這類特性。 |

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
### 宣告式 APIs {#declarative-apis}

典型地，在宣告式 API 中：

 - 你的 API 包含相對而言為數不多的、尺寸較小的物件（資源）。
 - 物件定義了應用或者基礎設施的配置資訊。
 - 物件更新操作頻率較低。
 - 通常需要人來讀取或寫入物件。
 - 物件的主要操作是 CRUD 風格的（建立、讀取、更新和刪除）。
 - 不需要跨物件的事務支援：API 物件代表的是期望狀態而非確切實際狀態。

<!--
Imperative APIs are not declarative.
Signs that your API might not be declarative include:

 - The client says "do this", and then gets a synchronous response back when it is done.
 - The client says "do this", and then gets an operation ID back, and has to check a separate Operation object to determine completion of the request.
 - You talk about Remote Procedure Calls (RPCs).
 - Directly storing large amounts of data; for example, > a few kB per object, or > 1000s of objects.
 - High bandwidth access (10s of requests per second sustained) needed.
 - Store end-user data (such as images, PII, etc.) or other large-scale data processed by applications.
 - The natural operations on the objects are not CRUD-y.
 - The API is not easily modeled as objects.
 - You chose to represent pending operations with an operation ID or an operation object.
-->
命令式 API（Imperative API）與宣告式有所不同。
以下跡象表明你的 API 可能不是宣告式的：

- 客戶端發出“做這個操作”的指令，之後在該操作結束時獲得同步響應。
- 客戶端發出“做這個操作”的指令，並獲得一個操作 ID，之後需要檢查一個 Operation（操作）
  物件來判斷請求是否成功完成。
- 你會將你的 API 類比為遠端過程呼叫（Remote Procedure Call，RPCs）。
- 直接儲存大量資料；例如每個物件幾 kB，或者儲存上千個物件。
- 需要較高的訪問頻寬（長期保持每秒數十個請求）。
- 儲存有應用來處理的最終使用者資料（如圖片、個人標識資訊（PII）等）或者其他大規模資料。
- 在物件上執行的常規操作並非 CRUD 風格。
- API 不太容易用物件來建模。
- 你決定使用操作 ID 或者操作物件來表現懸決的操作。

<!--
## Should I use a configMap or a custom resource?

Use a ConfigMap if any of the following apply:

* There is an existing, well-documented config file format, such as a `mysql.cnf` or `pom.xml`.
* You want to put the entire config file into one key of a configMap.
* The main use of the config file is for a program running in a Pod on your cluster to consume the file to configure itself.
* Consumers of the file prefer to consume via file in a Pod or environment variable in a pod, rather than the Kubernetes API.
* You want to perform rolling updates via Deployment, etc., when the file is updated.
-->
## 我應該使用一個 ConfigMap 還是一個定製資源？

如果滿足以下條件之一，應該使用 ConfigMap：

* 存在一個已有的、文件完備的配置檔案格式約定，例如 `mysql.cnf` 或 `pom.xml`。
* 你希望將整個配置檔案放到某 configMap 中的一個主鍵下面。
* 配置檔案的主要用途是針對執行在叢集中 Pod 內的程式，供後者依據檔案資料配置自身行為。
* 檔案的使用者期望以 Pod 內檔案或者 Pod 內環境變數的形式來使用檔案資料，
  而不是透過 Kubernetes API。
* 你希望當檔案被更新時透過類似 Deployment 之類的資源完成滾動更新操作。

<!--
Use a [secret](/docs/concepts/configuration/secret/) for sensitive data, which is similar to a configMap but more secure.
-->
{{< note >}}
請使用 [Secret](/zh-cn/docs/concepts/configuration/secret/) 來儲存敏感資料。
Secret 類似於 configMap，但更為安全。
{{< /note >}}

<!--
Use a custom resource (CRD or Aggregated API) if most of the following apply:

* You want to use Kubernetes client libraries and CLIs to create and update the new resource.
* You want top-level support from `kubectl`; for example, `kubectl get my-object object-name`.
* You want to build new automation that watches for updates on the new object, and then CRUD other objects, or vice versa.
* You want to write automation that handles updates to the object.
* You want to use Kubernetes API conventions like `.spec`, `.status`, and `.metadata`.
* You want the object to be an abstraction over a collection of controlled resources, or a summarization of other resources.
-->
如果以下條件中大多數都被滿足，你應該使用定製資源（CRD 或者 聚合 API）：

* 你希望使用 Kubernetes 客戶端庫和 CLI 來建立和更改新的資源。
* 你希望 `kubectl` 能夠直接支援你的資源；例如，`kubectl get my-object object-name`。
* 你希望構造新的自動化機制，監測新物件上的更新事件，並對其他物件執行 CRUD
  操作，或者監測後者更新前者。
* 你希望編寫自動化元件來處理對物件的更新。
* 你希望使用 Kubernetes API 對諸如 `.spec`、`.status` 和 `.metadata` 等欄位的約定。
* 你希望物件是對一組受控資源的抽象，或者對其他資源的歸納提煉。

<!--
## Adding custom resources

Kubernetes provides two ways to add custom resources to your cluster:

- CRDs are simple and can be created without any programming.
- [API Aggregation](/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/) requires programming, but allows more control over API behaviors like how data is stored and conversion between API versions.
-->
## 新增定製資源   {#adding-custom-resources}

Kubernetes 提供了兩種方式供你向叢集中新增定製資源：

- CRD 相對簡單，建立 CRD 可以不必程式設計。
- [API 聚合](/zh-cn/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/)
  需要程式設計，但支援對 API 行為進行更多的控制，例如資料如何儲存以及在不同 API 版本間如何轉換等。

<!--
Kubernetes provides these two options to meet the needs of different users, so that neither ease of use nor flexibility is compromised.

Aggregated APIs are subordinate API servers that sit behind the primary API server, which acts as a proxy. This arrangement is called [API Aggregation](/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/) (AA). To users, the Kubernetes API is extended.

CRDs allow users to create new types of resources without adding another API server. You do not need to understand API Aggregation to use CRDs.

Regardless of how they are installed, the new resources are referred to as Custom Resources to distinguish them from built-in Kubernetes resources (like pods).
-->
Kubernetes 提供這兩種選項以滿足不同使用者的需求，這樣就既不會犧牲易用性也不會犧牲靈活性。

聚合 API 指的是一些下位的 API 伺服器，執行在主 API 伺服器後面；主 API
伺服器以代理的方式工作。這種組織形式稱作
[API 聚合（API Aggregation，AA）](/zh-cn/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/) 。
對使用者而言，看起來僅僅是 Kubernetes API 被擴充套件了。

CRD 允許使用者建立新的資源類別同時又不必新增新的 API 伺服器。
使用 CRD 時，你並不需要理解 API 聚合。

無論以哪種方式安裝定製資源，新的資源都會被當做定製資源，以便與內建的
Kubernetes 資源（如 Pods）相區分。

<!--
## CustomResourceDefinitions

The [CustomResourceDefinition](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/)
API resource allows you to define custom resources.
Defining a CRD object creates a new custom resource with a name and schema that you specify.
The Kubernetes API serves and handles the storage of your custom resource.
The name of a CRD object must be a valid
[DNS subdomain name](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names).
-->
## CustomResourceDefinitions

[CustomResourceDefinition](/zh-cn/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/)
API 資源允許你定義定製資源。
定義 CRD 物件的操作會使用你所設定的名字和模式定義（Schema）建立一個新的定製資源，
Kubernetes API 負責為你的定製資源提供儲存和訪問服務。
CRD 物件的名稱必須是合法的
[DNS 子域名](/zh-cn/docs/concepts/overview/working-with-objects/names#dns-subdomain-names)。

<!--
This frees you from writing your own API server to handle the custom resource,
but the generic nature of the implementation means you have less flexibility than with
[API server aggregation](#api-server-aggregation).

Refer to the [custom controller example](https://github.com/kubernetes/sample-controller)
for an example of how to register a new custom resource, work with instances of your new resource type,
and use a controller to handle events.
-->
CRD 使得你不必編寫自己的 API 伺服器來處理定製資源，不過其背後實現的通用性也意味著
你所獲得的靈活性要比 [API 伺服器聚合](#api-server-aggregation)少很多。

關於如何註冊新的定製資源、使用新資源類別的例項以及如何使用控制器來處理事件，
相關的例子可參見[定製控制器示例](https://github.com/kubernetes/sample-controller)。

<!--
## API server aggregation

Usually, each resource in the Kubernetes API requires code that handles REST requests and manages persistent storage of objects. The main Kubernetes API server handles built-in resources like *pods* and *services*, and can also generically handle custom resources through [CRDs](#customresourcedefinitions).

The [aggregation layer](/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/) allows you to provide specialized
implementations for your custom resources by writing and deploying your own API server.
The main API server delegates requests to your API server for the custom resources that you handle,
making them available to all of its clients.

-->
## API 伺服器聚合  {#api-server-aggregation}

通常，Kubernetes API 中的每個資源都需要處理 REST 請求和管理物件永續性儲存的程式碼。
Kubernetes API 主伺服器能夠處理諸如 *pods* 和 *services* 這些內建資源，也可以
按通用的方式透過 [CRD](#customresourcedefinitions) 來處理定製資源。

[聚合層（Aggregation Layer）](/zh-cn/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/)
使得你可以透過編寫和部署你自己的 API 伺服器來為定製資源提供特殊的實現。
主 API 伺服器將針對你要處理的定製資源的請求全部委託給你自己的 API 伺服器來處理，同時將這些資源
提供給其所有客戶端。

<!--
## Choosing a method for adding custom resources

CRDs are easier to use. Aggregated APIs are more flexible. Choose the method that best meets your needs.

Typically, CRDs are a good fit if:

* You have a handful of fields
* You are using the resource within your company, or as part of a small open-source project (as opposed to a commercial product)
-->
## 選擇新增定製資源的方法

CRD 更為易用；聚合 API 則更為靈活。請選擇最符合你的需要的方法。

通常，如何存在以下情況，CRD 可能更合適：

* 定製資源的欄位不多；
* 你在組織內部使用該資源或者在一個小規模的開源專案中使用該資源，而不是
  在商業產品中使用。

<!--
### Comparing ease of use

CRDs are easier to create than Aggregated APIs.
-->
### 比較易用性  {#compare-ease-of-use}

CRD 比聚合 API 更容易建立

<!--
| CRDs                        | Aggregated API |
| --------------------------- | -------------- |
| Do not require programming. Users can choose any language for a CRD controller. | Requires programming in Go and building binary and image. |
| No additional service to run; CRDs are handled by API server. | An additional service to create and that could fail. |
| No ongoing support once the CRD is created. Any bug fixes are picked up as part of normal Kubernetes Master upgrades. | May need to periodically pickup bug fixes from upstream and rebuild and update the Aggregated API server. |
| No need to handle multiple versions of your API; for example, when you control the client for this resource, you can upgrade it in sync with the API. | You need to handle multiple versions of your API; for example, when developing an extension to share with the world. |
-->
| CRDs                        | 聚合 API       |
| --------------------------- | -------------- |
| 無需程式設計。使用者可選擇任何語言來實現 CRD 控制器。 | 需要使用 Go 來程式設計，並構建可執行檔案和映象。 |
| 無需額外執行服務；CRD 由 API 伺服器處理。 | 需要額外建立服務，且該服務可能失效。 |
| 一旦 CRD 被建立，不需要持續提供支援。Kubernetes 主控節點升級過程中自動會帶入缺陷修復。 | 可能需要週期性地從上游提取缺陷修復並更新聚合 API 伺服器。 |
| 無需處理 API 的多個版本；例如，當你控制資源的客戶端時，你可以更新它使之與 API 同步。 | 你需要處理 API 的多個版本；例如，在開發打算與很多人共享的擴充套件時。 |

<!--
### Advanced features and flexibility

Aggregated APIs offer more advanced API features and customization of other features; for example, the storage layer.
-->
### 高階特性與靈活性  {#advanced-features-and-flexibility}

聚合 API 可提供更多的高階 API 特性，也可對其他特性實行定製；例如，對儲存層進行定製。

<!--
| Feature  | Description  | CRDs | Aggregated API   |
| -------- | ------------ | ---- | ---------------- |
| Validation | Help users prevent errors and allow you to evolve your API independently of your clients. These features are most useful when there are many clients who can't all update at the same time. | Yes.  Most validation can be specified in the CRD using [OpenAPI v3.0 validation](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#validation).  Any other validations supported by addition of a [Validating Webhook](/docs/reference/access-authn-authz/admission-controllers/#validatingadmissionwebhook-alpha-in-1-8-beta-in-1-9). | Yes, arbitrary validation checks |
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
-->
| 特性    | 描述        | CRDs | 聚合 API       |
| ------- | ----------- | ---- | -------------- |
| 合法性檢查 | 幫助使用者避免錯誤，允許你獨立於客戶端版本演化 API。這些特性對於由很多無法同時更新的客戶端的場合。| 可以。大多數驗證可以使用 [OpenAPI v3.0 合法性檢查](/zh-cn/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#validation) 來設定。其他合法性檢查操作可以透過新增[合法性檢查 Webhook](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#validatingadmissionwebhook-alpha-in-1-8-beta-in-1-9)來實現。 | 可以，可執行任何合法性檢查。|
| 預設值設定 | 同上 | 可以。可透過 [OpenAPI v3.0 合法性檢查](/zh-cn/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#defaulting)的 `default` 關鍵詞（自 1.17 正式釋出）或[更改性（Mutating）Webhook](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#mutatingadmissionwebhook)來實現（不過從 etcd 中讀取老的物件時不會執行這些 Webhook）。 | 可以。 |
| 多版本支援 | 允許透過兩個 API 版本同時提供同一物件。可幫助簡化類似欄位更名這類 API 操作。如果你能控制客戶端版本，這一特性將不再重要。 | [可以](/zh-cn/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definition-versioning)。 | 可以。 |
| 定製儲存 | 支援使用具有不同效能模式的儲存（例如，要使用時間序列資料庫而不是鍵值儲存），或者因安全性原因對儲存進行隔離（例如對敏感資訊執行加密）。 | 不可以。 | 可以。 |
| 定製業務邏輯 | 在建立、讀取、更新或刪除物件時，執行任意的檢查或操作。 | 可以。要使用 [Webhook](/zh-cn/docs/reference/access-authn-authz/extensible-admission-controllers/#admission-webhooks)。 | 可以。 |
| 支援 scale 子資源 | 允許 HorizontalPodAutoscaler 和 PodDisruptionBudget 這類子系統與你的新資源互動。 | [可以](/zh-cn/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#scale-subresource)。 | 可以。 |
| 支援 status 子資源 | 允許在使用者寫入 spec 部分而控制器寫入 status 部分時執行細粒度的訪問控制。允許在對定製資源的資料進行更改時增加物件的代際（Generation）；這需要資源對 spec 和 status 部分有明確劃分。| [可以](/zh-cn/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#status-subresource)。 | 可以。 |
| 其他子資源 | 新增 CRUD 之外的操作，例如 "logs" 或 "exec"。 | 不可以。 | 可以。 |
| strategic-merge-patch | 新的端點要支援標記了 `Content-Type: application/strategic-merge-patch+json` 的 PATCH 操作。對於更新既可在本地更改也可在伺服器端更改的物件而言是有用的。要了解更多資訊，可參見[使用 `kubectl patch` 來更新 API 物件](/zh-cn/docs/tasks/manage-kubernetes-objects/update-api-object-kubectl-patch/)。 | 不可以。 | 可以。 |
| 支援協議緩衝區 | 新的資源要支援想要使用協議緩衝區（Protocol Buffer）的客戶端。 | 不可以。 | 可以。 |
| OpenAPI Schema | 是否存在新資源類別的 OpenAPI（Swagger）Schema 可供動態從伺服器上讀取？是否存在機制確保只能設定被允許的欄位以避免使用者犯欄位拼寫錯誤？是否實施了欄位型別檢查（換言之，不允許在 `string` 欄位設定 `int` 值）？ | 可以，依據 [OpenAPI v3.0 合法性檢查](/zh-cn/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#validation) 模式（1.16 中進入正式釋出狀態）。 | 可以。|

<!--
### Common Features

When you create a custom resource, either via a CRD or an AA, you get many features for your API, compared to implementing it outside the Kubernetes platform:
-->
### 公共特性  {#common-features}

與在 Kubernetes 平臺之外實現定製資源相比，
無論是透過 CRD 還是透過聚合 API 來建立定製資源，你都會獲得很多 API 特性：

<!--
| Feature  | What it does |
| -------- | ------------ |
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
| CRUD | 新的端點支援透過 HTTP 和 `kubectl` 發起的 CRUD 基本操作 |
| 監測（Watch） | 新的端點支援透過 HTTP 發起的 Kubernetes Watch 操作 |
| 發現（Discovery） | 類似 `kubectl` 和儀表盤（Dashboard）這類客戶端能夠自動提供列舉、顯示、在欄位級編輯你的資源的操作 |
| json-patch | 新的端點支援帶 `Content-Type: application/json-patch+json` 的 PATCH 操作 |
| merge-patch | 新的端點支援帶 `Content-Type: application/merge-patch+json` 的 PATCH 操作 |
| HTTPS | 新的端點使用 HTTPS |
| 內建身份認證 | 對擴充套件的訪問會使用核心 API 伺服器（聚合層）來執行身份認證操作 |
| 內建鑑權授權 | 對擴充套件的訪問可以複用核心 API 伺服器所使用的鑑權授權機制；例如，RBAC |
| Finalizers | 在外部清除工作結束之前阻止擴充套件資源被刪除 |
| 准入 Webhooks | 在建立、更新和刪除操作中對擴充套件資源設定預設值和執行合法性檢查 |
| UI/CLI 展示 | `kubectl` 和儀表盤（Dashboard）可以顯示擴充套件資源 |
| 區分未設定值和空值 | 客戶端能夠區分哪些欄位是未設定的，哪些欄位的值是被顯式設定為零值的。  |
| 生成客戶端庫 | Kubernetes 提供通用的客戶端庫，以及用來生成特定類別客戶端庫的工具 |
| 標籤和註解 | 提供涵蓋所有物件的公共元資料結構，且工具知曉如何編輯核心資源和定製資源的這些元資料 |

<!--
## Preparing to install a custom resource

There are several points to be aware of before adding a custom resource to your cluster.
-->
## 準備安裝定製資源

在向你的叢集新增定製資源之前，有些事情需要搞清楚。

<!--
### Third party code and new points of failure

While creating a CRD does not automatically add any new points of failure (for example, by causing third party code to run on your API server), packages (for example, Charts) or other installation bundles often include CRDs as well as a Deployment of third-party code that implements the business logic for a new custom resource.

Installing an Aggregated API server always involves running a new Deployment.
-->
### 第三方程式碼和新的失效點的問題

儘管新增新的 CRD 不會自動帶來新的失效點（Point of
Failure），例如導致第三方程式碼被在 API 伺服器上執行，
類似 Helm Charts 這種軟體包或者其他安裝包通常在提供 CRD 的同時還包含帶有第三方
程式碼的 Deployment，負責實現新的定製資源的業務邏輯。

安裝聚合 API 伺服器時，也總會牽涉到執行一個新的 Deployment。

<!--
### Storage

Custom resources consume storage space in the same way that ConfigMaps do. Creating too many custom resources may overload your API server's storage space.

Aggregated API servers may use the same storage as the main API server, in which case the same warning applies.
-->
### 儲存

定製資源和 ConfigMap 一樣也會消耗儲存空間。建立過多的定製資源可能會導致
API 伺服器上的儲存空間超載。

聚合 API 伺服器可以使用主 API 伺服器的同一儲存。如果是這樣，你也要注意
此警告。

<!--
### Authentication, authorization, and auditing

CRDs always use the same authentication, authorization, and audit logging as the built-in resources of your API server.

If you use RBAC for authorization, most RBAC roles will not grant access to the new resources (except the cluster-admin role or any role created with wildcard rules). You'll need to explicitly grant access to the new resources. CRDs and Aggregated APIs often come bundled with new role definitions for the types they add.

Aggregated API servers may or may not use the same authentication, authorization, and auditing as the primary API server.
-->
### 身份認證、鑑權授權以及審計

CRD 通常與 API 伺服器上的內建資源一樣使用相同的身份認證、鑑權授權
和審計日誌機制。

如果你使用 RBAC 來執行鑑權授權，大多數 RBAC 角色都會授權對新資源的訪問
（除了 cluster-admin 角色以及使用萬用字元規則建立的其他角色）。
你要顯式地為新資源的訪問授權。CRD 和聚合 API 通常在交付時會包含
針對所新增的類別的新的角色定義。

聚合 API 伺服器可能會使用主 API 伺服器相同的身份認證、鑑權授權和審計
機制，也可能不會。

<!--
## Accessing a custom resource

Kubernetes [client libraries](/docs/reference/using-api/client-libraries/) can be used to access custom resources. Not all client libraries support custom resources. The _Go_ and _Python_ client libraries do.

When you add a custom resource, you can access it using:

- `kubectl`
- The kubernetes dynamic client.
- A REST client that you write.
- A client generated using [Kubernetes client generation tools](https://github.com/kubernetes/code-generator) (generating one is an advanced undertaking, but some projects may provide a client along with the CRD or AA).
-->
## 訪問定製資源

Kubernetes [客戶端庫](/zh-cn/docs/reference/using-api/client-libraries/)可用來訪問定製資源。
並非所有客戶端庫都支援定製資源。_Go_ 和 _Python_ 客戶端庫是支援的。

當你添加了新的定製資源後，可以用如下方式之一訪問它們：

- `kubectl`
- Kubernetes 動態客戶端
- 你所編寫的 REST 客戶端
- 使用 [Kubernetes 客戶端生成工具](https://github.com/kubernetes/code-generator)
  所生成的客戶端。生成客戶端的工作有些難度，不過某些專案可能會隨著 CRD 或
  聚合 API 一起提供一個客戶端

## {{% heading "whatsnext" %}}

<!--
* Learn how to [Extend the Kubernetes API with the aggregation layer](/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/).
* Learn how to [Extend the Kubernetes API with CustomResourceDefinition](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/).
-->
* 瞭解如何[使用聚合層擴充套件 Kubernetes API](/zh-cn/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/)
* 瞭解如何[使用 CustomResourceDefinition 來擴充套件 Kubernetes API](/zh-cn/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/)

