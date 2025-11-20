---
title: Kubernetes API 概念
content_type: concept
weight: 20
---
<!--
title: Kubernetes API Concepts
reviewers:
- smarterclayton
- lavalamp
- liggitt
content_type: concept
weight: 20
-->

<!-- overview -->

<!--
The Kubernetes API is a resource-based (RESTful) programmatic interface
provided via HTTP. It supports retrieving, creating, updating, and deleting
primary resources via the standard HTTP verbs (POST, PUT, PATCH, DELETE,
GET).

For some resources, the API includes additional subresources that allow
fine-grained authorization (such as separate views for Pod details and
log retrievals), and can accept and serve those resources in different
representations for convenience or efficiency.
-->
Kubernetes API 是通過 HTTP 提供的基於資源 (RESTful) 的編程介面。
它支持通過標準 HTTP 動詞（POST、PUT、PATCH、DELETE、GET）檢索、創建、更新和刪除主要資源。

對於某些資源，API 包括額外的子資源，允許細粒度授權（例如：將 Pod 的詳細資訊與檢索日誌分開），
爲了方便或者提高效率，可以以不同的表示形式接受和服務這些資源。

<!--
Kubernetes supports efficient change notifications on resources via
_watches_:
{{< glossary_definition prepend="in the Kubernetes API, watch is" term_id="watch" length="short" >}}
Kubernetes also provides consistent list operations so that API clients can
effectively cache, track, and synchronize the state of resources.

You can view the [API reference](/docs/reference/kubernetes-api/) online,
or read on to learn about the API in general.
-->
Kubernetes 支持通過 **watch** 實現高效的資源變更通知：
{{< glossary_definition prepend="在 Kubernetes API 中，watch 的是" term_id="watch" length="short" >}}
Kubernetes 還提供一致的列表操作，以便 API 客戶端可以有效地緩存、跟蹤和同步資源的狀態。

你可以在線查看 [API 參考](/zh-cn/docs/reference/kubernetes-api/)，
或繼續閱讀以瞭解 API 的一般資訊。

<!-- body -->

<!--
## Kubernetes API terminology {#standard-api-terminology}

Kubernetes generally leverages common RESTful terminology to describe the
API concepts:

* A *resource type* is the name used in the URL (`pods`, `namespaces`, `services`)
* All resource types have a concrete representation (their object schema) which is called a *kind*
* A list of instances of a resource type is known as a *collection*
* A single instance of a resource type is called a *resource*, and also usually represents an *object*
* For some resource types, the API includes one or more *sub-resources*, which are represented as URI paths below the resource
-->
## Kubernetes API 術語  {#standard-api-terminology}

Kubernetes 通常使用常見的 RESTful 術語來描述 API 概念：

* **資源類型（Resource Type）** 是 URL 中使用的名稱（`pods`、`namespaces`、`services`）
* 所有資源類型都有一個具體的表示（它們的對象模式），稱爲 **類別（Kind）**
* 資源類型的實例的列表稱爲 **集合（Collection）**
* 資源類型的單個實例稱爲 **資源（Resource）**，通常也表示一個 **對象（Object）**
* 對於某些資源類型，API 包含一個或多個 **子資源（sub-resources）**，這些子資源表示爲資源下的 URI 路徑

<!--
Most Kubernetes API resource types are
[objects](/docs/concepts/overview/working-with-objects/kubernetes-objects/#kubernetes-objects):
they represent a concrete instance of a concept on the cluster, like a
pod or namespace. A smaller number of API resource types are *virtual* in
that they often represent operations on objects, rather than objects, such
as a permission check
(use a POST with a JSON-encoded body of `SubjectAccessReview` to the
`subjectaccessreviews` resource), or the `eviction` sub-resource of a Pod
(used to trigger
[API-initiated eviction](/docs/concepts/scheduling-eviction/api-eviction/)).
-->
大多數 Kubernetes API
資源類型都是[對象](/zh-cn/docs/concepts/overview/working-with-objects/kubernetes-objects/#kubernetes-objects)：
它們代表叢集上某個概念的具體實例，例如 Pod 或名字空間。
少數 API 資源類型是“虛擬的”，它們通常代表的是操作而非對象本身，
例如權限檢查（使用帶有 JSON 編碼的 `SubjectAccessReview` 主體的 POST 到 `subjectaccessreviews` 資源），
或 Pod 的子資源 `eviction`（用於觸發 [API 發起的驅逐](/zh-cn/docs/concepts/scheduling-eviction/api-eviction/)）。

<!--
### Object names

All objects you can create via the API have a unique object
{{< glossary_tooltip text="name" term_id="name" >}} to allow idempotent creation and
retrieval, except that virtual resource types may not have unique names if they are
not retrievable, or do not rely on idempotency.
Within a {{< glossary_tooltip text="namespace" term_id="namespace" >}}, only one object
of a given kind can have a given name at a time. However, if you delete the object,
you can make a new object with the same name. Some objects are not namespaced (for
example: Nodes), and so their names must be unique across the whole cluster.
-->
### 對象名字 {#object-names}

你可以通過 API 創建的所有對象都有一個唯一的{{< glossary_tooltip text="名字" term_id="name" >}}，
以允許冪等創建和檢索，但如果虛擬資源類型不可檢索或不依賴冪等性，則它們可能沒有唯一名稱。
在{{< glossary_tooltip text="名字空間" term_id="namespace" >}}內，
同一時刻只能有一個給定類別的對象具有給定名稱。
但是，如果你刪除該對象，你可以創建一個具有相同名稱的新對象。
有些對象沒有名字空間（例如：節點），因此它們的名稱在整個叢集中必須是唯一的。

<!--
### API verbs

Almost all object resource types support the standard HTTP verbs - GET, POST, PUT, PATCH,
and DELETE. Kubernetes also uses its own verbs, which are often written in lowercase to distinguish
them from HTTP verbs.
-->
### API 動詞 {#api-verbs}

幾乎所有對象資源類型都支持標準 HTTP 動詞 - GET、POST、PUT、PATCH 和 DELETE。
Kubernetes 也使用自己的動詞，這些動詞通常寫成小寫，以區別於 HTTP 動詞。

<!--
Kubernetes uses the term **list** to describe the action of returning a [collection](#collections) of
resources, to distinguish it from retrieving a single resource which is usually called
a **get**. If you sent an HTTP GET request with the `?watch` query parameter,
Kubernetes calls this a **watch** and not a **get**
(see [Efficient detection of changes](#efficient-detection-of-changes) for more details).

For PUT requests, Kubernetes internally classifies these as either **create** or **update**
based on the state of the existing object. An **update** is different from a **patch**; the
HTTP verb for a **patch** is PATCH.
-->
Kubernetes 使用術語 **list** 來描述返回資源[集合](#collections)的操作，
以區別於檢索單個資源、通常名爲 **get** 的操作。
如果你發送帶有 `?watch` 查詢參數的 HTTP GET 請求，
Kubernetes 將其稱爲 **watch** 而不是 **get**（有關詳細資訊，請參閱[快速檢測更改](#efficient-detection-of-changes)）。

對於 PUT 請求，Kubernetes 在內部根據現有對象的狀態將它們分類爲 **create** 或 **update**。
**update** 不同於 **patch**；**patch** 的 HTTP 動詞是 PATCH。

<!--
## Resource URIs

All resource types are either scoped by the cluster (`/apis/GROUP/VERSION/*`) or to a
namespace (`/apis/GROUP/VERSION/namespaces/NAMESPACE/*`). A namespace-scoped resource
type will be deleted when its namespace is deleted and access to that resource type
is controlled by authorization checks on the namespace scope.

Note: core resources use `/api` instead of `/apis` and omit the GROUP path segment.

Examples:
-->
## 資源 URI {#resource-uris}

所有資源類型要麼是叢集作用域的（`/apis/GROUP/VERSION/*`），
要麼是名字空間作用域的（`/apis/GROUP/VERSION/namespaces/NAMESPACE/*`）。
名字空間作用域的資源類型會在其名字空間被刪除時也被刪除，
並且對該資源類型的訪問是由定義在名字空間域中的授權檢查來控制的。

注意：核心資源使用 `/api` 而不是 `/apis`，並且不包含 GROUP 路徑段。

例如：

* `/api/v1/namespaces`
* `/api/v1/pods`
* `/api/v1/namespaces/my-namespace/pods`
* `/apis/apps/v1/deployments`
* `/apis/apps/v1/namespaces/my-namespace/deployments`
* `/apis/apps/v1/namespaces/my-namespace/deployments/my-deployment`

<!--
You can also access collections of resources (for example: listing all Nodes).
The following paths are used to retrieve collections and resources:

* Cluster-scoped resources:

  * `GET /apis/GROUP/VERSION/RESOURCETYPE` - return the collection of resources of the resource type
  * `GET /apis/GROUP/VERSION/RESOURCETYPE/NAME` - return the resource with NAME under the resource type
-->
你還可以訪問資源集合（例如：列出所有 Node）。以下路徑用於檢索集合和資源：

* 叢集作用域的資源：

  * `GET /apis/GROUP/VERSION/RESOURCETYPE` - 返回指定資源類型的資源的集合
  * `GET /apis/GROUP/VERSION/RESOURCETYPE/NAME` - 返回指定資源類型下名稱爲 NAME 的資源

<!--
* Namespace-scoped resources:

  * `GET /apis/GROUP/VERSION/RESOURCETYPE` - return the collection of all
    instances of the resource type across all namespaces
  * `GET /apis/GROUP/VERSION/namespaces/NAMESPACE/RESOURCETYPE` - return
    collection of all instances of the resource type in NAMESPACE
  * `GET /apis/GROUP/VERSION/namespaces/NAMESPACE/RESOURCETYPE/NAME` -
    return the instance of the resource type with NAME in NAMESPACE
-->
* 名字空間作用域的資源：

  * `GET /apis/GROUP/VERSION/RESOURCETYPE` - 返回所有名字空間中指定資源類型的全部實例的集合
  * `GET /apis/GROUP/VERSION/namespaces/NAMESPACE/RESOURCETYPE` -
    返回名字空間 NAMESPACE 內給定資源類型的全部實例的集合
  * `GET /apis/GROUP/VERSION/namespaces/NAMESPACE/RESOURCETYPE/NAME` -
    返回名字空間 NAMESPACE 中給定資源類型的名稱爲 NAME 的實例

<!--
Since a namespace is a cluster-scoped resource type, you can retrieve the list
(“collection”) of all namespaces with `GET /api/v1/namespaces` and details about
a particular namespace with `GET /api/v1/namespaces/NAME`.
-->
由於名字空間本身是一個叢集作用域的資源類型，你可以通過 `GET /api/v1/namespaces/`
檢視所有名字空間的列表（“集合”），使用 `GET /api/v1/namespaces/NAME` 查看特定名字空間的詳細資訊。

<!--
* Cluster-scoped subresource: `GET /apis/GROUP/VERSION/RESOURCETYPE/NAME/SUBRESOURCE`
* Namespace-scoped subresource: `GET /apis/GROUP/VERSION/namespaces/NAMESPACE/RESOURCETYPE/NAME/SUBRESOURCE`

The verbs supported for each subresource will differ depending on the object -
see the [API reference](/docs/reference/kubernetes-api/) for more information. It
is not possible to access sub-resources across multiple resources - generally a new
virtual resource type would be used if that becomes necessary.
-->
* 叢集作用域的子資源：`GET /apis/GROUP/VERSION/RESOURCETYPE/NAME/SUBRESOURCE`
* 名字空間作用域的子資源：`GET /apis/GROUP/VERSION/namespaces/NAMESPACE/RESOURCETYPE/NAME/SUBRESOURCE`

取決於對象是什麼，每個子資源所支持的動詞有所不同 - 參見 [API 文檔](/zh-cn/docs/reference/kubernetes-api/)以瞭解更多資訊。
跨多個資源來訪問其子資源是不可能的 - 如果需要這一能力，則通常意味着需要一種新的虛擬資源類型了。

<!--
## HTTP media types {#alternate-representations-of-resources}

Over HTTP, Kubernetes supports JSON and Protobuf wire encodings.
-->
## HTTP 媒體類型   {#alternate-representations-of-resources}

通過 HTTP，Kubernetes 支持 JSON 和 Protobuf 網路編碼格式。

<!--
By default, Kubernetes returns objects in [JSON serialization](#json-encoding), using the
`application/json` media type. Although JSON is the default, clients may request a response in
YAML, or use the more efficient binary [Protobuf representation](#protobuf-encoding) for better performance at scale.

The Kubernetes API implements standard HTTP content type negotiation: passing an
`Accept` header with a `GET` call will request that the server tries to return
a response in your preferred media type. If you want to send an object in Protobuf to
the server for a `PUT` or `POST` request, you must set the `Content-Type` request header
appropriately.
-->
預設情況下，Kubernetes 使用 `application/json` 媒體類型以 [JSON 序列化](#json-encoding)返回對象。
雖然 JSON 是預設類型，但客戶端可以用 YAML 請求響應，或使用更高效的二進制
[Protobuf 表示](#protobuf-encoding)，以便在大規模環境中獲得更好的性能。

Kubernetes API 實現了標準的 HTTP 內容類型協商：
使用 `GET` 調用傳遞 `Accept` 頭時將請求伺服器嘗試以你首選的媒體類型返回響應。
如果你想通過 `PUT` 或 `POST` 請求將對象以 Protobuf 發送到伺服器，則必須相應地設置 `Content-Type` 請求頭。

<!--
If you request an available media type, the API server returns a response with a suitable
`Content-Type`; if none of the media types you request are supported, the API server returns
a `406 Not acceptable` error message.
All built-in resource types support the `application/json` media type.
-->
如果你請求了可用的媒體類型，API 伺服器會以合適的 `Content-Type` 返回響應；
如果你請求的媒體類型都不被支持，API 伺服器會返回 `406 Not acceptable` 錯誤消息。
所有內置資源類型都支持 `application/json` 媒體類型。

<!--
### JSON resource encoding {#json-encoding}

The Kubernetes API defaults to using [JSON](https://www.json.org/json-en.html) for encoding
HTTP message bodies.

For example:
-->
### JSON 資源編碼   {#json-encoding}

Kubernetes API 預設使用 [JSON](https://www.json.org/json-en.html) 來編碼 HTTP 消息體。

例如：

<!--
1. List all of the pods on a cluster, without specifying a preferred format
-->
1. 在不指定首選格式的情況下，列舉叢集中的所有 Pod：

   ```http
   GET /api/v1/pods
   ```

   <!--
   ```
   200 OK
   Content-Type: application/json

   … JSON encoded collection of Pods (PodList object)
   ```
   -->

   ```
   200 OK
   Content-Type: application/json

   … JSON 編碼的 Pod 集合（PodList 對象）
   ```

<!--
1. Create a pod by sending JSON to the server, requesting a JSON response.
-->
2. 通過向伺服器發送 JSON 並請求 JSON 響應來創建 Pod。

   <!--
   ```http
   POST /api/v1/namespaces/test/pods
   Content-Type: application/json
   Accept: application/json
   … JSON encoded Pod object
   ```
   -->

   ```http
   POST /api/v1/namespaces/test/pods
   Content-Type: application/json
   Accept: application/json
   … JSON 編碼的 Pod 對象
   ```

   ```
   200 OK
   Content-Type: application/json

   {
     "kind": "Pod",
     "apiVersion": "v1",
     …
   }
   ```

<!--
### YAML resource encoding {#yaml-encoding}

Kubernetes also supports the [`application/yaml`](https://www.rfc-editor.org/rfc/rfc9512.html)
media type for both requests and responses. [`YAML`](https://yaml.org/)
can be used for defining Kubernetes manifests and API interactions.

For example:
-->
### YAML 資源編碼   {#yaml-encoding}

Kubernetes 還支持 [`application/yaml`](https://www.rfc-editor.org/rfc/rfc9512.html)
媒體類型用於請求和響應。[`YAML`](https://yaml.org/) 可用於定義 Kubernetes 清單和 API 交互。

例如：

<!--
1. List all of the pods on a cluster in YAML format
-->
1. 以 YAML 格式列舉叢集上的所有 Pod：

   ```http
   GET /api/v1/pods
   Accept: application/yaml
   ```

   <!--
   ```
   200 OK
   Content-Type: application/yaml

   … YAML encoded collection of Pods (PodList object)
   ```
   -->

   ```
   200 OK
   Content-Type: application/yaml

   … YAML 編碼的 Pod 集合（PodList 對象）
   ```

<!--
1. Create a pod by sending YAML-encoded data to the server, requesting a YAML response:
-->
2. 通過向伺服器發送 YAML 編碼的資料並請求 YAML 響應來創建 Pod：

   <!--
   ```http
   POST /api/v1/namespaces/test/pods
   Content-Type: application/yaml
   Accept: application/yaml
   … YAML encoded Pod object
   ```
   -->

   ```http
   POST /api/v1/namespaces/test/pods
   Content-Type: application/yaml
   Accept: application/yaml
   … YAML 編碼的 Pod 對象
   ```
   
   ```
   200 OK
   Content-Type: application/yaml

   apiVersion: v1
   kind: Pod
   metadata:
     name: my-pod
     …
   ```

<!--
### Kubernetes Protobuf encoding {#protobuf-encoding}

Kubernetes uses an envelope wrapper to encode [Protobuf](https://protobuf.dev/) responses.
That wrapper starts with a 4 byte magic number to help identify content in disk or in etcd as Protobuf
(as opposed to JSON). The 4 byte magic number data is followed by a Protobuf encoded wrapper message, which
describes the encoding and type of the underlying object. Within the Protobuf wrapper message,
the inner object data is recorded using the `raw` field of Unknown (see the [IDL](#protobuf-encoding-idl)
for more detail).
-->
### Kubernetes Protobuf 編碼   {#protobuf-encoding}

Kubernetes 使用封套形式來對 [Protobuf](https://protobuf.dev/) 響應進行編碼。
封套外層由 4 個字節的特殊數字開頭，便於從磁盤檔案或 etcd 中辯識 Protobuf
格式的（而不是 JSON）資料。這個 4 字節的特殊數字後跟一個 Protobuf 編碼的封套消息，
此消息描述了下層對象的編碼和類型。在 Protobuf 封套消息中，內部對象資料使用 Unknown 的
`raw` 字段進行記錄（有關細節參見 [IDL](#protobuf-encoding-idl)）。

<!--
For example:
-->
例如：

<!--
1. List all of the pods on a cluster in Protobuf format.
-->
1. 以 Protobuf 格式列舉叢集中的所有 Pod。

   ```http
   GET /api/v1/pods
   Accept: application/vnd.kubernetes.protobuf
   ```

   <!--
   ```
   200 OK
   Content-Type: application/vnd.kubernetes.protobuf

   … binary encoded collection of Pods (PodList object)
   ```
   -->

   ```
   200 OK
   Content-Type: application/vnd.kubernetes.protobuf

   … 二進制編碼的 Pod 集合（PodList 對象）
   ```

<!--
1. Create a pod by sending Protobuf encoded data to the server, but request a response
   in JSON.
-->
2. 通過向伺服器發送 Protobuf 編碼的資料創建 Pod，但請求以 JSON 形式接收響應：

   <!--
   ```http
   POST /api/v1/namespaces/test/pods
   Content-Type: application/vnd.kubernetes.protobuf
   Accept: application/json
   … binary encoded Pod object
   ```
   -->

   ```http
   POST /api/v1/namespaces/test/pods
   Content-Type: application/vnd.kubernetes.protobuf
   Accept: application/json
   … 二進制編碼的 Pod 對象
   ```

   ```
   200 OK
   Content-Type: application/json

   {
     "kind": "Pod",
     "apiVersion": "v1",
     ...
   }
   ```

<!--
You can use both techniques together and use Kubernetes' Protobuf encoding to interact with any API that
supports it, for both reads and writes. Only some API resource types are [compatible](#protobuf-encoding-compatibility)
with Protobuf.
-->
你可以將這兩種技術結合使用，利用 Kubernetes 的 Protobuf 編碼與所有支持的 API 進行讀寫交互。
只有某些 API 資源類型與 Protobuf [兼容](#protobuf-encoding-compatibility)。

<a id="protobuf-encoding-idl" />

<!--
The wrapper format is:
-->
封套格式如下：

<!--
```
A four byte magic number prefix:
  Bytes 0-3: "k8s\x00" [0x6b, 0x38, 0x73, 0x00]

An encoded Protobuf message with the following IDL:
  message Unknown {
    // typeMeta should have the string values for "kind" and "apiVersion" as set on the JSON object
    optional TypeMeta typeMeta = 1;

    // raw will hold the complete serialized object in protobuf. See the protobuf definitions in the client libraries for a given kind.
    optional bytes raw = 2;

    // contentEncoding is encoding used for the raw data. Unspecified means no encoding.
    optional string contentEncoding = 3;

    // contentType is the serialization method used to serialize 'raw'. Unspecified means application/vnd.kubernetes.protobuf and is usually
    // omitted.
    optional string contentType = 4;
  }

  message TypeMeta {
    // apiVersion is the group/version for this type
    optional string apiVersion = 1;
    // kind is the name of the object schema. A protobuf definition should exist for this object.
    optional string kind = 2;
  }
```
-->
```
四個字節的特殊數字前綴：
  字節 0-3: "k8s\x00" [0x6b, 0x38, 0x73, 0x00]

使用下面 IDL 來編碼的 Protobuf 消息：
  message Unknown {
    // typeMeta 應該包含 "kind" 和 "apiVersion" 的字符串值，就像
    // 對應的 JSON 對象中所設置的那樣
    optional TypeMeta typeMeta = 1;

    // raw 中將保存用 protobuf 序列化的完整對象。
    // 參閱客戶端庫中爲指定 kind 所作的 protobuf 定義
    optional bytes raw = 2;

    // contentEncoding 用於 raw 數據的編碼格式。未設置此值意味着沒有特殊編碼。
    optional string contentEncoding = 3;

    // contentType 包含 raw 數據所採用的序列化方法。
    // 未設置此值意味着 application/vnd.kubernetes.protobuf，且通常被忽略
    optional string contentType = 4;
  }

  message TypeMeta {
    // apiVersion 是 type 對應的組名/版本
    optional string apiVersion = 1;
    // kind 是對象模式定義的名稱。此對象應該存在一個 protobuf 定義。
    optional string kind = 2;
  }
```

{{< note >}}
<!--
Clients that receive a response in `application/vnd.kubernetes.protobuf` that does
not match the expected prefix should reject the response, as future versions may need
to alter the serialization format in an incompatible way and will do so by changing
the prefix.
-->
收到 `application/vnd.kubernetes.protobuf` 格式響應的客戶端在響應與預期的前綴不匹配時應該拒絕響應，
因爲將來的版本可能需要以某種不兼容的方式更改序列化格式，並且這種更改是通過變更前綴完成的。
{{< /note >}}

<!--
#### Compatibility with Kubernetes Protobuf {#protobuf-encoding-compatibility}

Not all API resource types support Kubernetes' Protobuf encoding; specifically, Protobuf isn't
available for resources that are defined as
{{< glossary_tooltip term_id="CustomResourceDefinition" text="CustomResourceDefinitions" >}}
or are served via the
{{< glossary_tooltip text="aggregation layer" term_id="aggregation-layer" >}}.

As a client, if you might need to work with extension types you should specify multiple
content types in the request `Accept` header to support fallback to JSON.
For example:
-->
#### 與 Kubernetes Protobuf 的兼容性   {#protobuf-encoding-compatibility}

並非所有 API 資源類型都支持 Protobuf；具體來說，Protobuf
不適用於定義爲 {{< glossary_tooltip term_id="CustomResourceDefinition" text="CustomResourceDefinitions" >}}
或通過{{< glossary_tooltip text="聚合層" term_id="aggregation-layer" >}}提供服務的資源。

作爲客戶端，如果你可能需要使用擴展類型，則應在請求 `Accept` 請求頭中指定多種內容類型以支持回退到 JSON。例如：

```
Accept: application/vnd.kubernetes.protobuf, application/json
```

<!--
### CBOR resource encoding {#cbor-encoding}
-->
### CBOR 資源編碼   {#cbor-encoding}

{{< feature-state feature_gate_name="CBORServingAndStorage" >}}

<!--
With the `CBORServingAndStorage` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
enabled, request and response bodies for all built-in resource types and all resources defined by a
{{< glossary_tooltip term_id="CustomResourceDefinition" text="CustomResourceDefinition" >}} may be encoded to the
[CBOR](https://www.rfc-editor.org/rfc/rfc8949) binary data format. CBOR is also supported at the
{{< glossary_tooltip text="aggregation layer" term_id="aggregation-layer" >}} if it is enabled in
individual aggregated API servers.
-->
啓用 `CBORServingAndStorage` [特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)後，
所有內置資源類型及所有由 {{< glossary_tooltip term_id="CustomResourceDefinition" text="CustomResourceDefinition" >}}
所定義的資源的請求體和響應體都可以被編碼爲 [CBOR](https://www.rfc-editor.org/rfc/rfc8949) 二進制資料格式。
如果在各個聚合 API 伺服器中啓用了 CBOR，
則在{{< glossary_tooltip text="聚合層" term_id="aggregation-layer" >}}中也支持 CBOR。

<!--
Clients should indicate the IANA media type `application/cbor` in the `Content-Type` HTTP request
header when the request body contains a single CBOR
[encoded data item](https://www.rfc-editor.org/rfc/rfc8949.html#section-1.2-4.2), and in the `Accept` HTTP request
header when prepared to accept a CBOR encoded data item in the response. API servers will use
`application/cbor` in the `Content-Type` HTTP response header when the response body contains a
CBOR-encoded object.
-->
當請求體包含單個 CBOR [編碼資料項](https://www.rfc-editor.org/rfc/rfc8949.html#section-1.2-4.2)時，
客戶端應在 `Content-Type` HTTP 請求頭中指明 IANA 媒體類型 `application/cbor`，
當準備接受響應中以 CBOR 編碼的資料項時，客戶端應在 `Accept` HTTP 請求頭中指明 IANA 媒體類型 `application/cbor`。
API 伺服器將在響應體包含以 CBOR 編碼的對象時在 `Content-Type` HTTP 響應頭中使用 `application/cbor`。

<!--
If an API server encodes its response to a [watch request](#efficient-detection-of-changes) using
CBOR, the response body will be a [CBOR Sequence](https://www.rfc-editor.org/rfc/rfc8742) and the
`Content-Type` HTTP response header will use the IANA media type `application/cbor-seq`. Each entry
of the sequence (if any) is a single CBOR-encoded watch event.
-->
如果 API 伺服器使用 CBOR 對 [watch 請求](#efficient-detection-of-changes)的響應進行編碼，
則響應體將是一個 [CBOR 序列](https://www.rfc-editor.org/rfc/rfc8742)，
而 `Content-Type` HTTP 響應頭將使用 IANA 媒體類型 `application/cbor-seq`。
此序列的每個條目（如果有的話）是一個以 CBOR 編碼的 watch 事件。

<!--
In addition to the existing `application/apply-patch+yaml` media type for YAML-encoded
[server-side apply configurations](#patch-and-apply), API servers that enable CBOR will accept the
`application/apply-patch+cbor` media type for CBOR-encoded server-side apply configurations. There
is no supported CBOR equivalent for `application/json-patch+json` or `application/merge-patch+json`,
or `application/strategic-merge-patch+json`.
-->
除了以 YAML 編碼的[伺服器端應用設定](#patch-and-apply)所用的現有 `application/apply-patch+yaml` 媒體類型之外，
啓用 CBOR 的 API 伺服器將接受 `application/apply-patch+cbor` 媒體類型用於以 CBOR 編碼的伺服器端應用設定。
對於 `application/json-patch+json`、`application/merge-patch+json` 或
`application/strategic-merge-patch+json`，沒有支持的 CBOR 等效類型。

<!--
## Efficient detection of changes

The Kubernetes API allows clients to make an initial request for an object or a
collection, and then to track changes since that initial request: a **watch**. Clients
can send a **list** or a **get** and then make a follow-up **watch** request.

To make this change tracking possible, every Kubernetes object has a `resourceVersion`
field representing the version of that resource as stored in the underlying persistence
layer. When retrieving a collection of resources (either namespace or cluster scoped),
the response from the API server contains a `resourceVersion` value. The client can
use that `resourceVersion` to initiate a **watch** against the API server.
-->
## 高效檢測變更  {#efficient-detection-of-changes}

Kubernetes API 允許客戶端對對象或集合發出初始請求，然後跟蹤自該初始請求以來的更改：**watch**。
客戶端可以發送 **list** 或者 **get** 請求，然後發出後續 **watch** 請求。

爲了使這種更改跟蹤成爲可能，每個 Kubernetes 對象都有一個 `resourceVersion` 字段，
表示儲存在底層持久層中的該資源的版本。在檢索資源集合（名字空間或叢集範圍）時，
來自 API 伺服器的響應包含一個 `resourceVersion` 值。
客戶端可以使用該 `resourceVersion` 來啓動對 API 伺服器的 **watch**。

<!--
When you send a **watch** request, the API server responds with a stream of
changes. These changes itemize the outcome of operations (such as **create**, **delete**,
and **update**) that occurred after the `resourceVersion` you specified as a parameter
to the **watch** request. The overall **watch** mechanism allows a client to fetch
the current state and then subscribe to subsequent changes, without missing any events.

If a client **watch** is disconnected then that client can start a new **watch** from
the last returned `resourceVersion`; the client could also perform a fresh **get** /
**list** request and begin again. See [Resource Version Semantics](#resource-versions)
for more detail.

For example:
-->
當你發送 **watch** 請求時，API 伺服器會響應更改流。
這些更改逐項列出了在你指定爲 **watch** 請求參數的 `resourceVersion` 之後發生的操作
（例如 **create**、**delete** 和 **update**）的結果。
整個 **watch** 機制允許客戶端獲取當前狀態，然後訂閱後續更改，而不會丟失任何事件。

如果客戶端 **watch** 連接斷開，則該客戶端可以從最後返回的 `resourceVersion` 開始新的 **watch** 請求；
客戶端還可以執行新的 **get**/**list** 請求並重新開始。有關更多詳細資訊，請參閱[資源版本語義](#resource-versions)。

例如：

<!--
1. List all of the pods in a given namespace.
-->
1. 列舉給定名字空間中的所有 Pod：

   ```http
   GET /api/v1/namespaces/test/pods
   ---
   200 OK
   Content-Type: application/json

   {
     "kind": "PodList",
     "apiVersion": "v1",
     "metadata": {"resourceVersion":"10245"},
     "items": [...]
   }
   ```

<!--
2. Starting from resource version 10245, receive notifications of any API operations
   (such as **create**, **delete**, **patch** or **update**) that affect Pods in the
   _test_ namespace. Each change notification is a JSON document. The HTTP response body
   (served as `application/json`) consists a series of JSON documents.
-->
2. 從資源版本 10245 開始，接收影響 **test** 名字空間中 Pod 的所有 API 操作
   （例如 **create**、**delete**、**patch** 或 **update**）的通知。
   每個更改通知都是一個 JSON 文檔。
   HTTP 響應正文（用作 `application/json`）由一系列 JSON 文檔組成。

   ```http
   GET /api/v1/namespaces/test/pods?watch=1&resourceVersion=10245
   ---
   200 OK
   Transfer-Encoding: chunked
   Content-Type: application/json

   {
     "type": "ADDED",
     "object": {"kind": "Pod", "apiVersion": "v1", "metadata": {"resourceVersion": "10596", ...}, ...}
   }
   {
     "type": "MODIFIED",
     "object": {"kind": "Pod", "apiVersion": "v1", "metadata": {"resourceVersion": "11020", ...}, ...}
   }
   ...
   ```

<!--
A given Kubernetes server will only preserve a historical record of changes for a
limited time. Clusters using etcd 3 preserve changes in the last 5 minutes by default.
When the requested **watch** operations fail because the historical version of that
resource is not available, clients must handle the case by recognizing the status code
`410 Gone`, clearing their local cache, performing a new **get** or **list** operation,
and starting the **watch** from the `resourceVersion` that was returned.

For subscribing to collections, Kubernetes client libraries typically offer some form
of standard tool for this **list**-then-**watch** logic. (In the Go client library,
this is called a `Reflector` and is located in the `k8s.io/client-go/tools/cache` package.)
-->
給定的 Kubernetes 伺服器只會保留一定的時間內發生的歷史變更列表。
使用 etcd3 的叢集預設保存過去 5 分鐘內發生的變更。
當所請求的 **watch** 操作因爲資源的歷史版本不存在而失敗，
客戶端必須能夠處理因此而返回的狀態代碼 `410 Gone`，清空其本地的緩存，
重新執行 **get** 或者 **list** 操作，
並基於新返回的 `resourceVersion` 來開始新的 **watch** 操作。

對於訂閱集合，Kubernetes 客戶端庫通常會爲 **list** - 然後 - **watch** 的邏輯提供某種形式的標準工具。
（在 Go 客戶端庫中，這稱爲 `反射器（Reflector）`，位於 `k8s.io/client-go/tools/cache` 包中。）

<!--
### Watch bookmarks {#watch-bookmarks}

To mitigate the impact of short history window, the Kubernetes API provides a watch
event named `BOOKMARK`. It is a special kind of event to mark that all changes up
to a given `resourceVersion` the client is requesting have already been sent. The
document representing the `BOOKMARK` event is of the type requested by the request,
but only includes a `.metadata.resourceVersion` field. For example:
-->
### 監視書籤  {#Watch-bookmark}

爲了減輕短歷史窗口的影響，Kubernetes API 提供了一個名爲 `BOOKMARK` 的監視事件。
這是一種特殊的事件，用於標記客戶端請求的給定 `resourceVersion` 的所有更改都已發送。
代表 `BOOKMARK` 事件的文檔屬於請求所請求的類型，但僅包含一個 `.metadata.resourceVersion` 字段。例如：

```http
GET /api/v1/namespaces/test/pods?watch=1&resourceVersion=10245&allowWatchBookmarks=true
---
200 OK
Transfer-Encoding: chunked
Content-Type: application/json

{
  "type": "ADDED",
  "object": {"kind": "Pod", "apiVersion": "v1", "metadata": {"resourceVersion": "10596", ...}, ...}
}
...
{
  "type": "BOOKMARK",
  "object": {"kind": "Pod", "apiVersion": "v1", "metadata": {"resourceVersion": "12746"} }
}
```

<!--
As a client, you can request `BOOKMARK` events by setting the
`allowWatchBookmarks=true` query parameter to a **watch** request, but you shouldn't
assume bookmarks are returned at any specific interval, nor can clients assume that
the API server will send any `BOOKMARK` event even when requested.
-->
作爲客戶端，你可以在 **watch** 請求中設置 `allowWatchBookmarks=true` 查詢參數來請求 `BOOKMARK` 事件，
但你不應假設書籤會在任何特定時間間隔返回，即使要求時，客戶端也不能假設 API 伺服器會發送任何 `BOOKMARK` 事件。

<!--
## Streaming lists
-->
## 流式列表  {#streaming-lists}

{{< feature-state feature_gate_name="WatchList" >}}

<!--
On large clusters, retrieving the collection of some resource types may result in
a significant increase of resource usage (primarily RAM) on the control plane.
To alleviate the impact and simplify the user experience of the **list** + **watch**
pattern, Kubernetes v1.32 promotes to beta the feature that allows requesting the initial state
(previously requested via the **list** request) as part of the **watch** request.
-->
在大型叢集檢索某些資源類型的集合可能會導致控制平面的資源使用量（主要是 RAM）顯著增加。
爲了減輕其影響並簡化 **list** + **watch** 模式的使用者體驗，
Kubernetes v1.32 將在 **watch** 請求中請求初始狀態（之前在 **list** 請求中請求）的特性進階至 Beta。

<!--
On the client-side the initial state can be requested by specifying `sendInitialEvents=true` as query string parameter
in a **watch** request. If set, the API server starts the watch stream with synthetic init
events (of type `ADDED`) to build the whole state of all existing objects followed by a
[`BOOKMARK` event](/docs/reference/using-api/api-concepts/#watch-bookmarks)
(if requested via `allowWatchBookmarks=true` option). The bookmark event includes the resource version
to which is synced. After sending the bookmark event, the API server continues as for any other **watch**
request.
-->
在客戶端，可以通過在 **watch** 請求中指定 `sendInitialEvents=true` 作爲查詢字符串參數來請求初始狀態。
如果指定了這個參數，API 伺服器將使用合成的初始事件（類型爲 `ADDED`）來啓動監視流，
以構建所有現有對象的完整狀態；如果請求還帶有 `allowWatchBookmarks=true` 選項，
則繼續發送 [`BOOKMARK` 事件](/zh-cn/docs/reference/using-api/api-concepts/#watch-bookmarks)。
BOOKMARK 事件包括已被同步的資源版本。
發送 BOOKMARK 事件後，API 伺服器會像處理所有其他 **watch** 請求一樣繼續執行。

<!--
When you set `sendInitialEvents=true` in the query string, Kubernetes also requires that you set
`resourceVersionMatch` to `NotOlderThan` value.
If you provided `resourceVersion` in the query string without providing a value or don't provide
it at all, this is interpreted as a request for _consistent read_;
the bookmark event is sent when the state is synced at least to the moment of a consistent read
from when the request started to be processed. If you specify `resourceVersion` (in the query string),
the bookmark event is sent when the state is synced at least to the provided resource version.
-->
當你在查詢字符串中設置 `sendInitialEvents=true` 時，
Kubernetes 還要求你將 `resourceVersionMatch` 的值設置爲 `NotOlderThan`。
如果你在查詢字符串中提供 `resourceVersion` 而沒有提供值或者根本沒有提供這個參數，
這一請求將被視爲 **一致性讀（Consistent Read）** 請求；
當狀態至少被同步到開始處理一致性讀操作時，纔會發送 BOOKMARK 事件。
如果你（在查詢字符串中）指定了 `resourceVersion`，則只要需要等狀態同步到所給資源版本時，
BOOKMARK 事件纔會被髮送。

<!--
### Example {#example-streaming-lists}
-->
### 示例  {#example-streaming-lists}

<!--
An example: you want to watch a collection of Pods. For that collection, the current resource version
is 10245 and there are two pods: `foo` and `bar`. Then sending the following request (explicitly requesting
_consistent read_ by setting empty resource version using `resourceVersion=`) could result
in the following sequence of events:
-->
舉個例子：你想監視一組 Pod。對於該集合，當前資源版本爲 10245，並且有兩個 Pod：`foo` 和 `bar`。
接下來你發送了以下請求（通過使用 `resourceVersion=` 設置空的資源版本來明確請求**一致性讀**），
這樣做的結果是可能收到如下事件序列：

```http
GET /api/v1/namespaces/test/pods?watch=1&sendInitialEvents=true&allowWatchBookmarks=true&resourceVersion=&resourceVersionMatch=NotOlderThan
---
200 OK
Transfer-Encoding: chunked
Content-Type: application/json

{
  "type": "ADDED",
  "object": {"kind": "Pod", "apiVersion": "v1", "metadata": {"resourceVersion": "8467", "name": "foo"}, ...}
}
{
  "type": "ADDED",
  "object": {"kind": "Pod", "apiVersion": "v1", "metadata": {"resourceVersion": "5726", "name": "bar"}, ...}
}
{
  "type": "BOOKMARK",
  "object": {"kind": "Pod", "apiVersion": "v1", "metadata": {"resourceVersion": "10245"} }
}
...
<followed by regular watch stream starting from resourceVersion="10245">
```

<!--
## Response compression
-->
## 響應壓縮   {#response-compression}

{{< feature-state feature_gate_name="APIResponseCompression" >}}

<!--
`APIResponseCompression` is an option that allows the API server to compress the responses for **get**
and **list** requests, reducing the network bandwidth and improving the performance of large-scale clusters.
It is enabled by default since Kubernetes 1.16 and it can be disabled by including
`APIResponseCompression=false` in the `--feature-gates` flag on the API server.
-->
`APIResponseCompression` 是一個選項，允許 API 伺服器壓縮 **get** 和 **list** 請求的響應，
減少佔用的網路帶寬並提高大規模叢集的性能。此選項自 Kubernetes 1.16 以來預設啓用，
可以通過在 API 伺服器上的 `--feature-gates` 標誌中包含 `APIResponseCompression=false` 來禁用。

<!--
API response compression can significantly reduce the size of the response, especially for large resources or
[collections](/docs/reference/using-api/api-concepts/#collections).
For example, a **list** request for pods can return hundreds of kilobytes or even megabytes of data,
depending on the number of pods and their attributes. By compressing the response, the network bandwidth
can be saved and the latency can be reduced.
-->
特別是對於大型資源或[集合](/zh-cn/docs/reference/using-api/api-concepts/#collections)，
API 響應壓縮可以顯著減小其響應的大小。例如，針對 Pod 的 **list** 請求可能會返回數百 KB 甚至幾 MB 的資料，
具體大小取決於 Pod 數量及其屬性。通過壓縮響應，可以節省網路帶寬並降低延遲。

<!--
To verify if `APIResponseCompression` is working, you can send a **get** or **list** request to the
API server with an `Accept-Encoding` header, and check the response size and headers. For example:
-->
要驗證 `APIResponseCompression` 是否正常工作，你可以使用一個 `Accept-Encoding`
頭向 API 伺服器發送一個 **get** 或 **list** 請求，並檢查響應大小和頭資訊。例如：

```http
GET /api/v1/pods
Accept-Encoding: gzip
---
200 OK
Content-Type: application/json
content-encoding: gzip
...
```

<!--
The `content-encoding` header indicates that the response is compressed with `gzip`.
-->
`content-encoding` 頭表示響應使用 `gzip` 進行了壓縮。

<!--
## Retrieving large results sets in chunks
-->
## 分塊檢視大體量結果  {#retrieving-large-results-sets-in-chunks}

{{< feature-state feature_gate_name="APIListChunking" >}}

<!--
On large clusters, retrieving the collection of some resource types may result in
very large responses that can impact the server and client. For instance, a cluster
may have tens of thousands of Pods, each of which is equivalent to roughly 2 KiB of
encoded JSON. Retrieving all pods across all namespaces may result in a very large
response (10-20MB) and consume a large amount of server resources.
-->
在較大規模叢集中，檢索某些資源類型的集合可能會導致非常大的響應，從而影響伺服器和客戶端。
例如，一個叢集可能有數萬個 Pod，每個 Pod 大約相當於 2 KiB 的編碼 JSON。
跨所有名字空間檢索所有 Pod 可能會導致非常大的響應（10-20MB）並消耗大量伺服器資源。

<!--
The Kubernetes API server supports the ability to break a single large collection request
into many smaller chunks while preserving the consistency of the total request. Each
chunk can be returned sequentially which reduces both the total size of the request and
allows user-oriented clients to display results incrementally to improve responsiveness.
-->
Kubernetes API 伺服器支持將單個大型集合請求分解爲許多較小塊的能力，
同時保持總體請求的一致性。每個塊都可以按順序返回，這既減少了請求的總大小，
又允許面向使用者的客戶端增量顯示結果以提高響應能力。

<!--
You can request that the API server handles a **list** by serving single collection
using pages (which Kubernetes calls _chunks_). To retrieve a single collection in
chunks, two query parameters `limit` and `continue` are supported on requests against
collections, and a response field `continue` is returned from all **list** operations
in the collection's `metadata` field. A client should specify the maximum results they
wish to receive in each chunk with `limit` and the server will return up to `limit`
resources in the result and include a `continue` value if there are more resources
in the collection.
-->
你可以請求 API 伺服器通過使用頁（Kubernetes 將其稱爲“塊（Chunk）”）的方式來處理 **list**，
完成單個集合的響應。要以塊的形式檢索單個集合，針對集合的請求支持兩個查詢參數 `limit` 和 `continue`，
並且從集合元 `metadata` 字段中的所有 **list** 操作返回響應字段 `continue`。
客戶端應該指定他們希望在每個帶有 `limit` 的塊中接收的條目數上限，如果集合中有更多資源，
伺服器將在結果中返回 `limit` 資源幷包含一個 `continue` 值。

<!--
As an API client, you can then pass this `continue` value to the API server on the
next request, to instruct the server to return the next page (_chunk_) of results. By
continuing until the server returns an empty `continue` value, you can retrieve the
entire collection.
-->
作爲 API 客戶端，你可以在下一次請求時將 `continue` 值傳遞給 API 伺服器，
以指示伺服器返回下一頁（**塊**）結果。繼續下去直到伺服器返回一個空的 `continue` 值，
你可以檢索整個集合。

<!--
Like a **watch** operation, a `continue` token will expire after a short amount
of time (by default 5 minutes) and return a `410 Gone` if more results cannot be
returned. In this case, the client will need to start from the beginning or omit the
`limit` parameter.

For example, if there are 1,253 pods on the cluster and you want to receive chunks
of 500 pods at a time, request those chunks as follows:
-->
與 **watch** 操作類似，`continue` 令牌也會在很短的時間（預設爲 5 分鐘）內過期，
並在無法返回更多結果時返回 `410 Gone` 代碼。
這時，客戶端需要從頭開始執行上述檢視操作或者忽略 `limit` 參數。

例如，如果叢集上有 1253 個 Pod，客戶端希望每次收到包含至多 500 個 Pod
的資料塊，它應按下面的步驟來請求資料塊：

<!--
1. List all of the pods on a cluster, retrieving up to 500 pods each time.
-->
1. 列舉叢集中所有 Pod，每次接收至多 500 個 Pod：

   ```http
   GET /api/v1/pods?limit=500
   ---
   200 OK
   Content-Type: application/json

   {
     "kind": "PodList",
     "apiVersion": "v1",
     "metadata": {
       "resourceVersion":"10245",
       "continue": "ENCODED_CONTINUE_TOKEN",
       "remainingItemCount": 753,
       ...
     },
     "items": [...] // returns pods 1-500
   }
   ```

<!--
1. Continue the previous call, retrieving the next set of 500 pods.
-->
2. 繼續前面的調用，返回下一組 500 個 Pod：

   ```http
   GET /api/v1/pods?limit=500&continue=ENCODED_CONTINUE_TOKEN
   ---
   200 OK
   Content-Type: application/json

   {
     "kind": "PodList",
     "apiVersion": "v1",
     "metadata": {
       "resourceVersion":"10245",
       "continue": "ENCODED_CONTINUE_TOKEN_2",
       "remainingItemCount": 253,
       ...
     },
     "items": [...] // returns pods 501-1000
   }
   ```

<!--
1. Continue the previous call, retrieving the last 253 pods.
-->
3. 繼續前面的調用，返回最後 253 個 Pod：

   ```http
   GET /api/v1/pods?limit=500&continue=ENCODED_CONTINUE_TOKEN_2
   ---
   200 OK
   Content-Type: application/json

   {
     "kind": "PodList",
     "apiVersion": "v1",
     "metadata": {
       "resourceVersion":"10245",
       "continue": "", // continue token is empty because we have reached the end of the list
       ...
     },
     "items": [...] // returns pods 1001-1253
   }
   ```

<!--
Notice that the `resourceVersion` of the collection remains constant across each request,
indicating the server is showing you a consistent snapshot of the pods. Pods that
are created, updated, or deleted after version `10245` would not be shown unless
you make a separate **list** request without the `continue` token. This allows you
to break large requests into smaller chunks and then perform a **watch** operation
on the full set without missing any updates.
-->
請注意，集合的 `resourceVersion` 在每個請求中保持不變，
這表明伺服器正在向你顯示 Pod 的一致快照。
在版本 `10245` 之後創建、更新或刪除的 Pod 將不會顯示，
除非你在沒有繼續令牌的情況下發出單獨的 **list** 請求。
這使你可以將大請求分成更小的塊，然後對整個集合執行 **watch** 操作，而不會丟失任何更新。

<!--
`remainingItemCount` is the number of subsequent items in the collection that are not
included in this response. If the **list** request contained label or field
{{< glossary_tooltip text="selectors" term_id="selector">}} then the number of
remaining items is unknown and the API server does not include a `remainingItemCount`
field in its response.
If the **list** is complete (either because it is not chunking, or because this is the
last chunk), then there are no more remaining items and the API server does not include a
`remainingItemCount` field in its response. The intended use of the `remainingItemCount`
is estimating the size of a collection.
-->
`remainingItemCount` 是集合中未包含在此響應中的後續項目的數量。
如果 **list** 請求包含標籤或字段{{< glossary_tooltip text="選擇器" term_id="selector">}}，
則剩餘項目的數量是未知的，並且 API 伺服器在其響應中不包含 `remainingItemCount` 字段。
如果 **list** 是完整的（因爲它沒有分塊，或者因爲這是最後一個塊），沒有更多的剩餘項目，
API 伺服器在其響應中不包含 `remainingItemCount` 字段。
`remainingItemCount` 的用途是估計集合的大小。

<!--
## Collections

In Kubernetes terminology, the response you get from a **list** is
a _collection_. However, Kubernetes defines concrete kinds for
collections of different types of resource. Collections have a kind
named for the resource kind, with `List` appended.

When you query the API for a particular type, all items returned by that query are
of that type. For example, when you **list** Services, the collection response
has `kind` set to
[`ServiceList`](/docs/reference/kubernetes-api/service-resources/service-v1/#ServiceList);
each item in that collection represents a single Service. For example:
-->
## 集合 {#collections}

在 Kubernetes 術語中，你從 **list** 中獲得的響應是一個“集合（Collection）”。
然而，Kubernetes 爲不同類型資源的集合定義了具體類型。
集合的類別名是針對資源類別的，並附加了 `List`。

當你查詢特定類型的 API 時，該查詢返回的所有項目都屬於該類型。
例如，當你 **list** Service 對象時，集合響應的 `kind` 設置爲
[`ServiceList`](/zh-cn/docs/reference/kubernetes-api/service-resources/service-v1/#ServiceList)；
該集合中的每個項目都代表一個 Service。例如：

```http
GET /api/v1/services
```

```yaml
{
  "kind": "ServiceList",
  "apiVersion": "v1",
  "metadata": {
    "resourceVersion": "2947301"
  },
  "items": [
    {
      "metadata": {
        "name": "kubernetes",
        "namespace": "default",
...
      "metadata": {
        "name": "kube-dns",
        "namespace": "kube-system",
...
```

<!--
There are dozens of collection types (such as `PodList`, `ServiceList`,
and `NodeList`) defined in the Kubernetes API.
You can get more information about each collection type from the
[Kubernetes API](/docs/reference/kubernetes-api/) documentation.

Some tools, such as `kubectl`, represent the Kubernetes collection
mechanism slightly differently from the Kubernetes API itself.
Because the output of `kubectl` might include the response from
multiple **list** operations at the API level, `kubectl` represents
a list of items using `kind: List`. For example:
-->
Kubernetes API 中定義了數十種集合類型（如 `PodList`、`ServiceList` 和 `NodeList`）。
你可以從 [Kubernetes API](/zh-cn/docs/reference/kubernetes-api/) 文檔中獲取有關每種集合類型的更多資訊。

一些工具，例如 `kubectl`，對於 Kubernetes 集合的表現機制與 Kubernetes API 本身略有不同。
因爲 `kubectl` 的輸出可能包含來自 API 級別的多個 **list** 操作的響應，
所以 `kubectl` 使用 `kind: List` 表示項目列表。例如：

```shell
kubectl get services -A -o yaml
```

```yaml
apiVersion: v1
kind: List
metadata:
  resourceVersion: ""
  selfLink: ""
items:
- apiVersion: v1
  kind: Service
  metadata:
    creationTimestamp: "2021-06-03T14:54:12Z"
    labels:
      component: apiserver
      provider: kubernetes
    name: kubernetes
    namespace: default
...
- apiVersion: v1
  kind: Service
  metadata:
    annotations:
      prometheus.io/port: "9153"
      prometheus.io/scrape: "true"
    creationTimestamp: "2021-06-03T14:54:14Z"
    labels:
      k8s-app: kube-dns
      kubernetes.io/cluster-service: "true"
      kubernetes.io/name: CoreDNS
    name: kube-dns
    namespace: kube-system
```

{{< note >}}
<!--
Keep in mind that the Kubernetes API does not have a `kind` named `List`.

`kind: List` is a client-side, internal implementation detail for processing
collections that might be of different kinds of object. Avoid depending on
`kind: List` in automation or other code.
-->
請記住，Kubernetes API 沒有名爲 `List` 的 `kind`。

`kind: List` 是一個客戶端內部實現細節，用於處理可能屬於不同類別的對象的集合。
在自動化或其他代碼中避免依賴 `kind: List`。
{{< /note >}}

<!--
## Receiving resources as Tables

When you run `kubectl get`, the default output format is a simple tabular
representation of one or more instances of a particular resource type. In the past,
clients were required to reproduce the tabular and describe output implemented in
`kubectl` to perform simple lists of objects.
A few limitations of that approach include non-trivial logic when dealing with
certain objects. Additionally, types provided by API aggregation or third party
resources are not known at compile time. This means that generic implementations
had to be in place for types unrecognized by a client.
-->
## 以表格形式接收資源  {#receiving-resources-as-tables}

當你執行 `kubectl get` 時，預設的輸出格式是特定資源類型的一個或多個實例的簡單表格形式。
過去，客戶端需要重複 `kubectl` 中所實現的表格輸出和描述輸出邏輯，以執行簡單的對象列表操作。
該方法的一些限制包括處理某些對象時的不可忽視邏輯。
此外，API 聚合或第三方資源提供的類型在編譯時是未知的。
這意味着必須爲客戶端無法識別的類型提供通用實現。

<!--
In order to avoid potential limitations as described above, clients may request
the Table representation of objects, delegating specific details of printing to the
server. The Kubernetes API implements standard HTTP content type negotiation: passing
an `Accept` header containing a value of `application/json;as=Table;g=meta.k8s.io;v=v1`
with a `GET` call will request that the server return objects in the Table content
type.

For example, list all of the pods on a cluster in the Table format.
-->
爲了避免上述各種潛在的侷限性，客戶端可以請求伺服器端返回對象的表格（Table）
表現形式，從而將打印輸出的特定細節委託給伺服器。
Kubernetes API 實現標準的 HTTP 內容類型（Content Type）協商：爲 `GET`
調用傳入一個值爲 `application/json;as=Table;g=meta.k8s.io;v=v1` 的 `Accept`
頭部即可請求伺服器以 Table 的內容類型返回對象。

例如，以 Table 格式列舉叢集中所有 Pod：

```http
GET /api/v1/pods
Accept: application/json;as=Table;g=meta.k8s.io;v=v1
---
200 OK
Content-Type: application/json

{
    "kind": "Table",
    "apiVersion": "meta.k8s.io/v1",
    ...
    "columnDefinitions": [
        ...
    ]
}
```

<!--
For API resource types that do not have a custom Table definition known to the control
plane, the API server returns a default Table response that consists of the resource's
`name` and `creationTimestamp` fields.
-->
對於在控制平面上不存在定製的 Table 定義的 API 資源類型而言，伺服器會返回一個預設的
Table 響應，其中包含資源的 `name` 和 `creationTimestamp` 字段。

```http
GET /apis/crd.example.com/v1alpha1/namespaces/default/resources
---
200 OK
Content-Type: application/json
...

{
    "kind": "Table",
    "apiVersion": "meta.k8s.io/v1",
    ...
    "columnDefinitions": [
        {
            "name": "Name",
            "type": "string",
            ...
        },
        {
            "name": "Created At",
            "type": "date",
            ...
        }
    ]
}
```

<!--
Not all API resource types support a Table response; for example, a
{{< glossary_tooltip term_id="CustomResourceDefinition" text="CustomResourceDefinitions" >}}
might not define field-to-table mappings, and an APIService that
[extends the core Kubernetes API](/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/)
might not serve Table responses at all. If you are implementing a client that
uses the Table information and must work against all resource types, including
extensions, you should make requests that specify multiple content types in the
`Accept` header. For example:
-->
並非所有 API 資源類型都支持 Table 響應；
例如，{{< glossary_tooltip term_id="CustomResourceDefinition" text="CustomResourceDefinitions" >}} 可能沒有定義字段到表的映射，
[擴展核心 Kubernetes API](/zh-cn/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/)
的 APIService 可能根本不提供 Table 響應。
如果你正在實現使用 Table 資訊並且必須針對所有資源類型（包括擴展）工作的客戶端，
你應該在 `Accept` 請求頭中指定多種內容類型的請求。例如：

```
Accept: application/json;as=Table;g=meta.k8s.io;v=v1, application/json
```

<!--
## Resource deletion

When you **delete** a resource this takes place in two phases.

1. _finalization_
1. removal
-->
## 資源刪除  {#resource-deletion}

當你 **delete** 資源時，操作將分兩個階段進行。

1. **終結（finalization）**
2. 移除

```yaml
{
  "kind": "ConfigMap",
  "apiVersion": "v1",
  "metadata": {
    "finalizers": ["url.io/neat-finalization", "other-url.io/my-finalizer"],
    "deletionTimestamp": nil,
  }
}
```

<!--
When a client first sends a **delete** to request the removal of a resource,
the `.metadata.deletionTimestamp` is set to the current time.
Once the `.metadata.deletionTimestamp` is set, external controllers that act on finalizers
may start performing their cleanup work at any time, in any order.

Order is **not** enforced between finalizers because it would introduce significant
risk of stuck `.metadata.finalizers`.

The `.metadata.finalizers` field is shared: any actor with permission can reorder it.
If the finalizer list were processed in order, then this might lead to a situation
in which the component responsible for the first finalizer in the list is
waiting for some signal (field value, external system, or other) produced by a
component responsible for a finalizer later in the list, resulting in a deadlock.

Without enforced ordering, finalizers are free to order amongst themselves and are
not vulnerable to ordering changes in the list.

Once the last finalizer is removed, the resource is actually removed from etcd.
-->
當客戶端第一次發送 **delete** 請求刪除資源時，`.metadata.deletionTimestamp` 設置爲當前時間。
一旦設置了 `.metadata.deletionTimestamp`，
作用於終結器的外部控制器可以在任何時間以任何順序開始執行它們的清理工作。

終結器之間**不存在**強制的執行順序，因爲這會帶來卡住 `.metadata.finalizers` 的重大風險。

`.metadata.finalizers` 字段是共享的：任何有權限的參與者都可以重新排序。
如果終結器列表是按順序處理的，那麼這可能會導致這樣一種情況：
在列表中負責第一個終結器的組件正在等待列表中稍後負責終結器的組件產生的某些信號
（字段值、外部系統或其他），從而導致死鎖。

如果沒有強制排序，終結者可以在它們之間自由排序，並且不易受到列表中排序變化的影響。

當最後一個終結器也被移除時，資源才真正從 etcd 中移除。

<!--
### Force deletion
-->
### 強制刪除    {#force-deletion}

{{< feature-state feature_gate_name="AllowUnsafeMalformedObjectDeletion" >}}

{{< caution >}}
<!--
This may break the workload associated with the resource being force deleted, if it
relies on the normal deletion flow, so cluster breaking consequences may apply.
-->
如果強制刪除依賴於正常的刪除流程，這可能會破壞與正強制刪除的資源關聯的工作負載，因此可能會導致叢集出現嚴重後果。
{{< /caution >}}

<!--
By enabling the delete option `ignoreStoreReadErrorWithClusterBreakingPotential`, the
user can perform an unsafe force **delete** operation of an undecryptable/corrupt
resource. This option is behind an ALPHA feature gate, and it is disabled by
default. In order to use this option, the cluster operator must enable the feature by
setting the command line option `--feature-gates=AllowUnsafeMalformedObjectDeletion=true`.
-->
通過啓用刪除選項 `ignoreStoreReadErrorWithClusterBreakingPotential`，
使用者可以對無法解密或損壞的資源執行不安全的強制**刪除**操作。
使用此選項需要先啓用一個 Alpha 特性門控，預設是禁用的。
要使用此選項，叢集操作員必須通過設置命令列選項
`--feature-gates=AllowUnsafeMalformedObjectDeletion=true` 來啓用此特性。

{{< note >}}
<!--
The user performing the force **delete** operation must have the privileges to do both
the **delete** and **unsafe-delete-ignore-read-errors** verbs on the given resource.
-->
執行強制**刪除**操作的使用者必須擁有對給定資源執行 **delete** 和
**unsafe-delete-ignore-read-errors** 動作的權限。
{{< /note >}}

<!--
A resource is considered corrupt if it can not be successfully retrieved from the
storage due to:

- transformation error (for example: decryption failure), or
- the object failed to decode.

The API server first attempts a normal deletion, and if it fails with
a _corrupt resource_ error then it triggers the force delete. A force **delete** operation
is unsafe because it ignores finalizer constraints, and skips precondition checks.
-->
如果某資源由於

1. 轉換錯誤（例如解密失敗）或
1. 對象解碼失敗

導致無法從儲存中成功檢索，則該資源被視爲已損壞。
API 伺服器會先嚐試正常刪除，如果由於**資源損壞**的錯誤而刪除失敗，則觸發強制刪除。
強制 **delete** 操作是不安全的，因爲它會忽略終結器（Finalizer）約束，並跳過前置條件檢查。

<!--
The default value for this option is `false`, this maintains backward compatibility.
For a **delete** request with `ignoreStoreReadErrorWithClusterBreakingPotential`
set to `true`, the fields `dryRun`, `gracePeriodSeconds`, `orphanDependents`,
`preconditions`, and `propagationPolicy` must be left unset.
-->
此選項的預設值爲 `false`，這是爲了保持向後兼容性。對於將
`ignoreStoreReadErrorWithClusterBreakingPotential` 設置爲 `true` 的 **delete** 請求，
`dryRun`、`gracePeriodSeconds`、`orphanDependents`、`preconditions` 和 `propagationPolicy` 字段必須保持不設置。

{{< note >}}
<!--
If the user issues a **delete** request with `ignoreStoreReadErrorWithClusterBreakingPotential`
set to `true` on an otherwise readable resource, the API server aborts the request with an error.
-->
如果使用者對一個可以以其他方式讀取的資源發出將 `ignoreStoreReadErrorWithClusterBreakingPotential`
設置爲 `true` 的 **delete** 請求，API 伺服器將中止此請求並報錯。
{{< /note >}}

<!--
## Single resource API

The Kubernetes API verbs **get**, **create**, **update**, **patch**,
**delete** and **proxy** support single resources only.
These verbs with single resource support have no support for submitting multiple
resources together in an ordered or unordered list or transaction.

When clients (including kubectl) act on a set of resources, the client makes a series
of single-resource API requests, then aggregates the responses if needed.

By contrast, the Kubernetes API verbs **list** and **watch** allow getting multiple
resources, and **deletecollection** allows deleting multiple resources.
-->
## 單個資源 API  {#single-resource-api}

Kubernetes API 動詞 **get**、**create**、**update**、**patch**、**delete** 和 **proxy** 僅支持單一資源。
這些具有單一資源支持的動詞不支持在有序或無序列表或事務中一起提交多個資源。

當客戶端（包括 kubectl）對一組資源進行操作時，客戶端會發出一系列單資源 API 請求，
然後在需要時聚合響應。

相比之下，Kubernetes API 動詞 **list** 和 **watch** 允許獲取多個資源，
而 **deletecollection** 允許刪除多個資源。

<!--
## Field validation
-->
## 字段校驗    {#field-validation}

<!--
Kubernetes always validates the type of fields. For example, if a field in the
API is defined as a number, you cannot set the field to a text value. If a field
is defined as an array of strings, you can only provide an array. Some fields
allow you to omit them, other fields are required. Omitting a required field
from an API request is an error.
-->
Kubernetes 總是校驗字段的類型。例如，如果 API 中的某個字段被定義爲數值，
你就不能將該字段設置爲文本類型的值。如果某個字段被定義爲字符串數組，你只能提供數組。
有些字段可以忽略，有些字段必須填寫。忽略 API 請求中的必填字段會報錯。

<!--
If you make a request with an extra field, one that the cluster's control plane
does not recognize, then the behavior of the API server is more complicated.
-->
如果請求中帶有叢集控制面無法識別的額外字段，API 伺服器的行爲會更加複雜。

<!--
By default, the API server drops fields that it does not recognize
from an input that it receives (for example, the JSON body of a `PUT` request).
-->
預設情況下，如果接收到的輸入資訊中含有 API 伺服器無法識別的字段，API 伺服器會丟棄該字段
（例如：`PUT` 請求中的 JSON 主體）。

<!--
There are two situations where the API server drops fields that you supplied in
an HTTP request.
-->
API 伺服器會在兩種情況下丟棄 HTTP 請求中提供的字段。

<!--
These situations are:
-->
這些情況是：

<!--
1. The field is unrecognized because it is not in the resource's OpenAPI schema. (One
   exception to this is for {{< glossary_tooltip term_id="CustomResourceDefinition" text="CRDs" >}}
   that explicitly choose not to prune unknown fields via `x-kubernetes-preserve-unknown-fields`).
-->
1. 相關資源的 OpenAPI 模式定義中沒有該字段，因此無法識別該字段（有種例外情形是，
   {{< glossary_tooltip term_id="CustomResourceDefinition" text="CRD" >}}
   通過 `x-kubernetes-preserve-unknown-fields` 顯式選擇不刪除未知字段）。

<!--
1. The field is duplicated in the object.
-->
2. 字段在對象中重複出現。

<!--
### Validation for unrecognized or duplicate fields {#setting-the-field-validation-level}
-->
### 檢查無法識別或重複的字段  {#setting-the-field-validation-level}

{{< feature-state feature_gate_name="ServerSideFieldValidation" >}}

<!--
From 1.25 onward, unrecognized or duplicate fields in an object are detected via
validation on the server when you use HTTP verbs that can submit data (`POST`, `PUT`, and `PATCH`).
Possible levels of validation are `Ignore`, `Warn` (default), and `Strict`.
-->
從 1.25 開始，當使用可以提交資料的 HTTP 動詞（`POST`、`PUT` 和 `PATCH`）時，
將通過伺服器上的校驗檢測到對象中無法識別或重複的字段。
校驗的級別可以是 `Ignore`、`Warn`（預設值） 和 `Strict` 之一。

<!--
`Ignore`
: The API server succeeds in handling the request as it would without the erroneous fields
  being set, dropping all unknown and duplicate fields and giving no indication it
  has done so.
-->
`Ignore`
: 使 API 伺服器像沒有遇到錯誤字段一樣成功處理請求，丟棄所有的未知字段和重複字段，並且不發送丟棄字段的通知。

<!--
`Warn`
: (Default) The API server succeeds in handling the request, and reports a
  warning to the client. The warning is sent using the `Warning:` response header,
  adding one warning item for each unknown or duplicate field. For more
  information about warnings and the Kubernetes API, see the blog article
  [Warning: Helpful Warnings Ahead](/blog/2020/09/03/warnings/).
-->
`Warn`
:（預設值）使 API 伺服器成功處理請求，並向客戶端發送告警資訊。告警資訊通過 `Warning:` 響應頭髮送，
  併爲每個未知字段或重複字段添加一條告警資訊。有關告警和相關的 Kubernetes API 的資訊，
  可參閱博文[告警：增加實用告警功能](/zh-cn/blog/2020/09/03/warnings/)。

<!--
`Strict`
: The API server rejects the request with a 400 Bad Request error when it
  detects any unknown or duplicate fields. The response message from the API
  server specifies all the unknown or duplicate fields that the API server has
  detected.
-->
`Strict`
: API 伺服器檢測到任何未知字段或重複字段時，拒絕處理請求並返回 400 Bad Request 錯誤。
  來自 API 伺服器的響應消息列出了 API 檢測到的所有未知字段或重複字段。

<!--
The field validation level is set by the `fieldValidation` query parameter.
-->
字段校驗級別可通過查詢參數 `fieldValidation` 來設置。

{{< note >}}
<!--
If you submit a request that specifies an unrecognized field, and that is also invalid for
a different reason (for example, the request provides a string value where the API expects
an integer for a known field), then the API server responds with a 400 Bad Request error, but will
not provide any information on unknown or duplicate fields (only which fatal
error it encountered first).

You always receive an error response in this case, no matter what field validation level you requested.
-->
如果你提交的請求中設置了一個無法被識別的字段，並且該請求存在因其他原因引起的不合法
（例如，請求爲某已知字段提供了一個字符串值，而 API 期望該字段爲整數），
那麼 API 伺服器會以 400 Bad Request 錯誤作出響應，但不會提供有關未知或重複字段的任何資訊
（僅提供它首先遇到的致命錯誤）。

在這種情況下，不管你設置哪種字段校驗級別，你總會收到出錯響應。
{{< /note >}}

<!--
Tools that submit requests to the server (such as `kubectl`), might set their own
defaults that are different from the `Warn` validation level that the API server uses
by default.
-->
向伺服器提交請求的工具（例如 `kubectl`）可能會設置自己的預設值，與 API 伺服器預設使用的 `Warn`
校驗層級不同。

<!--
The `kubectl` tool uses the `--validate` flag to set the level of field
validation. It accepts the values `ignore`, `warn`, and `strict` while
also accepting the values `true` (equivalent to `strict`) and `false`
(equivalent to `ignore`). The default validation setting for kubectl is
`--validate=true`, which means strict server-side field validation.

When kubectl cannot connect to an API server with field validation (API servers
prior to Kubernetes 1.27), it will fall back to using client-side validation.
Client-side validation will be removed entirely in a future version of kubectl.
-->
`kubectl` 工具使用 `--validate` 標誌設置字段校驗層級。
該字段可取的值包括 `ignore`、`warn` 和 `strict`，同時還接受值 `true`（相當於 `strict`）和
`false`（相當於 `ignore`）。
kubectl 預設的校驗設置是 `--validate=true` ，這意味着執行嚴格的服務端字段校驗。

當 kubectl 無法連接到啓用字段校驗的 API 伺服器（Kubernetes 1.27 之前的 API 伺服器）時，
將回退到使用客戶端的字段校驗。
客戶端校驗將在 kubectl 未來版本中被完全刪除。

{{< note >}}
<!--
Prior to Kubernetes 1.25, `kubectl --validate` was used to toggle client-side validation on or off as
a boolean flag.
-->
在 Kubernetes 1.25 之前，`kubectl --validate` 是用來開啓或關閉客戶端校驗的布爾標誌的命令。
{{< /note >}}

<!--
## Dry-run
-->
## 試運行  {#dry-run}

{{< feature-state feature_gate_name="DryRun" >}}

<!--
When you use HTTP verbs that can modify resources (`POST`, `PUT`, `PATCH`, and
`DELETE`), you can submit your request in a _dry run_ mode. Dry run mode helps to
evaluate a request through the typical request stages (admission chain, validation,
merge conflicts) up until persisting objects to storage. The response body for the
request is as close as possible to a non-dry-run response. Kubernetes guarantees that
dry-run requests will not be persisted in storage or have any other side effects.
-->
當你使用可以修改資源的 HTTP 動詞（`POST`、`PUT`、`PATCH` 和 `DELETE`）時，
你可以在 **試運行（dry run）** 模式下提交你的請求。
試運行模式有助於通過典型的請求階段（准入鏈、驗證、合併衝突）評估請求，直到將對象持久化到儲存中。
請求的響應正文儘可能接近非試運行響應。Kubernetes 保證試運行請求不會被持久化儲存或產生任何其他副作用。

<!--
### Make a dry-run request

Dry-run is triggered by setting the `dryRun` query parameter. This parameter is a
string, working as an enum, and the only accepted values are:

[no value set]
: Allow side effects. You request this with a query string such as `?dryRun`
  or `?dryRun&pretty=true`. The response is the final object that would have been
  persisted, or an error if the request could not be fulfilled.

`All`
: Every stage runs as normal, except for the final storage stage where side effects
  are prevented.
-->
### 發起試運行請求  {#make-a-dry-run-request}

通過設置 `dryRun` 查詢參數觸發試運行。此參數是一個字符串，用作枚舉，唯一可接受的值是：

[未設置值]
: 允許副作用。你可以使用 `?dryRun` 或 `?dryRun&pretty=true` 之類的查詢字符串請求此操作。
  響應是最終會被持久化的對象，或者如果請求不能被滿足則會出現一個錯誤。

`All`
: 每個階段都正常運行，除了防止副作用的最終儲存階段。

<!--
When you set `?dryRun=All`, any relevant
{{< glossary_tooltip text="admission controllers" term_id="admission-controller" >}}
are run, validating admission controllers check the request post-mutation, merge is
performed on `PATCH`, fields are defaulted, and schema validation occurs. The changes
are not persisted to the underlying storage, but the final object which would have
been persisted is still returned to the user, along with the normal status code.
-->
當你設置 `?dryRun=All` 時，將運行任何相關的{{< glossary_tooltip text="准入控制器" term_id="admission-controller" >}}，
驗證准入控制器檢查經過變更的請求，針對 `PATCH` 請求執行合併、設置字段預設值等操作，並進行模式驗證。
更改不會持久化到底層儲存，但本應持久化的最終對象仍會與正常狀態代碼一起返回給使用者。

<!--
If the non-dry-run version of a request would trigger an admission controller that has
side effects, the request will be failed rather than risk an unwanted side effect. All
built in admission control plugins support dry-run. Additionally, admission webhooks can
declare in their
[configuration object](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#validatingwebhook-v1-admissionregistration-k8s-io)
that they do not have side effects, by setting their `sideEffects` field to `None`.
-->
如果請求的非試運行版本會觸發具有副作用的准入控制器，則該請求將失敗，而不是冒不希望的副作用的風險。
所有內置准入控制插件都支持試運行。
此外，准入 Webhook 還可以設置[設定對象](/zh-cn/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#validatingwebhook-v1-admissionregistration-k8s-io)
的 `sideEffects` 字段爲 `None`，藉此聲明它們沒有副作用。

{{< note >}}
<!--
If a webhook actually does have side effects, then the `sideEffects` field should be
set to "NoneOnDryRun". That change is appropriate provided that the webhook is also
be modified to understand the `DryRun` field in AdmissionReview, and to prevent side
effects on any request marked as dry runs.
-->
如果 Webhook 確實有副作用，則應該將 `sideEffects` 字段設置爲 “NoneOnDryRun”。
如果還修改了 Webhook 以理解 AdmissionReview 中的 DryRun 字段，
並防止對標記爲試運行的任何請求產生副作用，則該更改是適當的。
{{< /note >}}

<!--
Here is an example dry-run request that uses `?dryRun=All`:
-->
這是一個使用 `?dryRun=All` 的試運行請求的示例：

```http
POST /api/v1/namespaces/test/pods?dryRun=All
Content-Type: application/json
Accept: application/json
```

<!--
The response would look the same as for non-dry-run request, but the values of some
generated fields may differ.
-->
響應會與非試運行模式請求的響應看起來相同，只是某些生成字段的值可能會不同。

<!--
### Generated values

Some values of an object are typically generated before the object is persisted. It
is important not to rely upon the values of these fields set by a dry-run request,
since these values will likely be different in dry-run mode from when the real
request is made. Some of these fields are:

* `name`: if `generateName` is set, `name` will have a unique random name
* `creationTimestamp` / `deletionTimestamp`: records the time of creation/deletion
* `UID`: [uniquely identifies](/docs/concepts/overview/working-with-objects/names/#uids)
  the object and is randomly generated (non-deterministic)
* `resourceVersion`: tracks the persisted version of the object
* Any field set by a mutating admission controller
* For the `Service` resource: Ports or IP addresses that the kube-apiserver assigns to Service objects
-->
### 生成值  {#generated-values}

對象的某些值通常是在對象被寫入資料庫之前生成的。很重要的一點是不要依賴試運行請求爲這些字段所設置的值，
因爲試運行模式下所得到的這些值與真實請求所獲得的值很可能不同。這類字段有：

* `name`：如果設置了 `generateName` 字段，則 `name` 會獲得一個唯一的隨機名稱
* `creationTimestamp` / `deletionTimestamp`：記錄對象的創建/刪除時間
* `UID`：[唯一標識](/zh-cn/docs/concepts/overview/working-with-objects/names/#uids)對象，
  取值隨機生成（非確定性）
* `resourceVersion`：跟蹤對象的持久化（儲存）版本
* 變更性准入控制器所設置的字段
* 對於 `Service` 資源：`kube-apiserver` 爲 `Service` 對象分配的端口和 IP 地址

<!--
### Dry-run authorization

Authorization for dry-run and non-dry-run requests is identical. Thus, to make
a dry-run request, you must be authorized to make the non-dry-run request.

For example, to run a dry-run **patch** for a Deployment, you must be authorized
to perform that **patch**. Here is an example of a rule for Kubernetes
{{< glossary_tooltip text="RBAC" term_id="rbac">}} that allows patching
Deployments:
-->
### 試運行的授權    {#dry-run-authorization}

試運行和非試運行請求的鑑權是完全相同的。因此，要發起一個試運行請求，
你必須被授權執行非試運行請求。

例如，要在 Deployment 對象上試運行 **patch** 操作，你必須具有對 Deployment 執行 **patch** 操作的訪問權限，
如下面的 {{< glossary_tooltip text="RBAC" term_id="rbac">}} 規則所示：

```yaml
rules:
- apiGroups: ["apps"]
  resources: ["deployments"]
  verbs: ["patch"]
```

<!--
See [Authorization Overview](/docs/reference/access-authn-authz/authorization/).
-->
參閱[鑑權概述](/zh-cn/docs/reference/access-authn-authz/authorization/)以瞭解鑑權細節。

<!--
## Updates to existing resources {#patch-and-apply}

Kubernetes provides several ways to update existing objects.
You can read [choosing an update mechanism](#update-mechanism-choose) to
learn about which approach might be best for your use case.
-->
## 更新現有資源   {#patch-and-apply}

Kubernetes 提供了多種更新現有對象的方式。
你可以閱讀[選擇更新機制](#update-mechanism-choose)以瞭解哪種方法可能最適合你的用例。

<!--
You can overwrite (**update**) an existing resource - for example, a ConfigMap -
using an HTTP PUT. For a PUT request, it is the client's responsibility to specify
the `resourceVersion` (taking this from the object being updated). Kubernetes uses
that `resourceVersion` information so that the API server can detect lost updates
and reject requests made by a client that is out of date with the cluster.
In the event that the resource has changed (the `resourceVersion` the client
provided is stale), the API server returns a `409 Conflict` error response.
-->
你可以使用 HTTP PUT 覆蓋（**update**）ConfigMap 等現有資源。
對於 PUT 請求，客戶端需要指定 `resourceVersion`（從要更新的對象中獲取此項）。
Kubernetes 使用該 `resourceVersion` 資訊，這樣 API 伺服器可以檢測丟失的更新並拒絕對叢集來說過期的客戶端所發出的請求。
如果資源已發生變化（即客戶端提供的 `resourceVersion` 已過期），API 伺服器將返回 `409 Conflict` 錯誤響應。

<!--
Instead of sending a PUT request, the client can send an instruction to the API
server to **patch** an existing resource. A **patch** is typically appropriate
if the change that the client wants to make isn't conditional on the existing data.
Clients that need effective detection of lost updates should consider
making their request conditional on the existing `resourceVersion` (either HTTP PUT or HTTP PATCH),
and then handle any retries that are needed in case there is a conflict.

The Kubernetes API supports four different PATCH operations, determined by their
corresponding HTTP `Content-Type` header:
-->
客戶端除了發送 PUT 請求之外，還可以發送指令給 API 伺服器對現有資源執行 **patch** 操作。
**patch** 通常適用於客戶端希望進行的更改並不依賴於現有資料的場景。
需要有效檢測丟失更新的客戶端應該考慮根據現有 `resourceVersion` 來進行有條件的請求
（HTTP PUT 或 HTTP PATCH），並在存在衝突時作必要的重試。

Kubernetes API 支持四種不同的 PATCH 操作，具體取決於它們所對應的 HTTP `Content-Type` 標頭：

<!--
`application/apply-patch+yaml`
: Server Side Apply YAML (a Kubernetes-specific extension, based on YAML).
  All JSON documents are valid YAML, so you can also submit JSON using this
  media type. See [Server Side Apply serialization](/docs/reference/using-api/server-side-apply/#serialization)
  for more details.
  To Kubernetes, this is a **create** operation if the object does not exist,
  or a **patch** operation if the object already exists.
-->
`application/apply-patch+yaml`
: Server Side Apply YAML（基於 YAML 的 Kubernetes 擴展）。
  所有 JSON 文檔都是有效的 YAML，因此你也可以使用此媒體類型提交 JSON。
  更多細節參閱[伺服器端應用序列化](/zh-cn/docs/reference/using-api/server-side-apply/#serialization)。
  對於 Kubernetes，這一 PATCH 請求在對象不存在時成爲 **create** 操作；在對象已存在時成爲 **patch** 操作。

<!--
`application/json-patch+json`
: JSON Patch, as defined in [RFC6902](https://tools.ietf.org/html/rfc6902).
  A JSON patch is a sequence of operations that are executed on the resource;
  for example `{"op": "add", "path": "/a/b/c", "value": [ "foo", "bar" ]}`.
  To Kubernetes, this is a **patch** operation.
  
  A **patch** using `application/json-patch+json` can include conditions to
  validate consistency, allowing the operation to fail if those conditions
  are not met (for example, to avoid a lost update).
-->
`application/json-patch+json`
: JSON Patch，如 [RFC6902](https://tools.ietf.org/html/rfc6902) 中定義。
  JSON Patch 是對資源執行的一個操作序列；例如 `{"op": "add", "path": "/a/b/c", "value": [ "foo", "bar" ]}`。
  對於 Kubernetes，這一 PATCH 請求即是一個 **patch** 操作。
  
  使用 `application/json-patch+json` 的 **patch** 可以包含用於驗證一致性的條件，
  如果這些條件不滿足，則允許此操作失敗（例如避免丟失更新）。

<!--
`application/merge-patch+json`
: JSON Merge Patch, as defined in [RFC7386](https://tools.ietf.org/html/rfc7386).
  A JSON Merge Patch is essentially a partial representation of the resource.
  The submitted JSON is combined with the current resource to create a new one,
  then the new one is saved.
  To Kubernetes, this is a **patch** operation.
-->
`application/merge-patch+json`
: JSON Merge Patch，如 [RFC7386](https://tools.ietf.org/html/rfc7386) 中定義。
  JSON Merge Patch 實質上是資源的部分表示。提交的 JSON 與當前資源合併以創建一個新資源，然後將其保存。
  對於 Kubernetes，這個 PATCH 請求是一個 **patch** 操作。

<!--
`application/strategic-merge-patch+json`
: Strategic Merge Patch (a Kubernetes-specific extension based on JSON).
  Strategic Merge Patch is a custom implementation of JSON Merge Patch.
  You can only use Strategic Merge Patch with built-in APIs, or with aggregated
  API servers that have special support for it. You cannot use
  `application/strategic-merge-patch+json` with any API
  defined using a {{< glossary_tooltip term_id="CustomResourceDefinition" text="CustomResourceDefinition" >}}.
-->
`application/strategic-merge-patch+json`
: Strategic Merge Patch（基於 JSON 的 Kubernetes 擴展）。
  Strategic Merge Patch 是 JSON Merge Patch 的自定義實現。
  你只能在內置 API 或具有特殊支持的聚合 API 伺服器中使用 Strategic Merge Patch。
  你不能針對任何使用 {{< glossary_tooltip term_id="CustomResourceDefinition" text="CustomResourceDefinition" >}}
  定義的 API 來使用 `application/strategic-merge-patch+json`。

  {{< note >}}
  <!--
  The Kubernetes _server side apply_ mechanism has superseded Strategic Merge
  Patch.
  -->
  Kubernetes **伺服器端應用**機制已取代 Strategic Merge Patch。
  {{< /note >}}

<!--
Kubernetes' [Server Side Apply](/docs/reference/using-api/server-side-apply/)
feature allows the control plane to track managed fields for newly created objects.
Server Side Apply provides a clear pattern for managing field conflicts,
offers server-side **apply** and **update** operations, and replaces the
client-side functionality of `kubectl apply`.

For Server-Side Apply, Kubernetes treats the request as a **create** if the object
does not yet exist, and a **patch** otherwise. For other requests that use PATCH
at the HTTP level, the logical Kubernetes operation is always **patch**.

See [Server Side Apply](/docs/reference/using-api/server-side-apply/) for more details.
-->
Kubernetes 的[伺服器端應用](/zh-cn/docs/reference/using-api/server-side-apply/)功能允許控制平面跟蹤新創建對象的託管字段。
服務端應用爲管理字段衝突提供了清晰的模式，提供了伺服器端 **apply** 和 **update**  操作，
並替換了 `kubectl apply` 的客戶端功能。

對於伺服器端應用，Kubernetes 在對象尚不存在時將請求視爲 **create**，否則視爲 **patch**。
對於其他在 HTTP 層面使用 PATCH 的請求，邏輯上的 Kubernetes 操作始終是 **patch**。

更多細節參閱[伺服器端應用](/zh-cn/docs/reference/using-api/server-side-apply/)。

<!--
### Choosing an update mechanism {#update-mechanism-choose}

#### HTTP PUT to replace existing resource {#update-mechanism-update}

The **update** (HTTP `PUT`) operation is simple to implement and flexible,
but has drawbacks:
-->
### 選擇更新機制   {#update-mechanism-choose}

#### HTTP PUT 替換現有資源  {#update-mechanism-update}

**update**（HTTP `PUT`）操作實現簡單且靈活，但也存在一些缺點：

<!--
* You need to handle conflicts where the `resourceVersion` of the object changes
  between your client reading it and trying to write it back. Kubernetes always
  detects the conflict, but you as the client author need to implement retries.
* You might accidentally drop fields if you decode an object locally (for example,
  using client-go, you could receive fields that your client does not know how to
  handle - and then drop them as part of your update.
* If there's a lot of contention on the object (even on a field, or set of fields,
  that you're not trying to edit), you might have trouble sending the update.
  The problem is worse for larger objects and for objects with many fields.
-->
* 你需要處理對象的 `resourceVersion` 在客戶端讀取和寫回之間發生變化所造成的衝突。
  Kubernetes 總是會檢測到此衝突，但你作爲客戶端開發者需要實現重試機制。
* 如果你在本地解碼對象，可能會意外丟失字段。例如你在使用 client-go 時，
  可能會收到客戶端不知道如何處理的一些字段，而客戶端在構造更新時會將這些字段丟棄。
* 如果對象上存在大量爭用（即使是在你不打算編輯的某字段或字段集上），你可能會難以發送更新。
  對於體量較大或字段較多的對象，這個問題會更爲嚴重。

<!--
#### HTTP PATCH using JSON Patch {#update-mechanism-json-patch}

A **patch** update is helpful, because:
-->
#### 使用 JSON Patch 的 HTTP PATCH   {#update-mechanism-json-patch}

**patch** 更新很有幫助，因爲：

<!--
* As you're only sending differences, you have less data to send in the `PATCH`
  request.
* You can make changes that rely on existing values, such as copying the
  value of a particular field into an annotation.
-->
* 由於你只發送差異，所以你在 `PATCH` 請求中需要發送的資料較少。
* 你可以依賴於現有值進行更改，例如將特定字段的值複製到註解中。
<!--
* Unlike with an **update** (HTTP `PUT`), making your change can happen right away
  even if there are frequent changes to unrelated fields): you usually would
  not need to retry.
  * You might still need to specify the `resourceVersion` (to match an existing object)
    if you want to be extra careful to avoid lost updates
  * It's still good practice to write in some retry logic in case of errors.
-->
* 與 **update**（HTTP `PUT`）不同，即使存在對無關字段的頻繁更改，你的更改也可以立即生效：
  你通常無需重試。
  * 如果你要特別小心避免丟失更新，仍然可能需要指定 `resourceVersion`（以匹配現有對象）。
  * 編寫一些重試邏輯以處理錯誤仍然是一個良好的實踐。
<!--
* You can use test conditions to careful craft specific update conditions.
  For example, you can increment a counter without reading it if the existing
  value matches what you expect. You can do this with no lost update risk,
  even if the object has changed in other ways since you last wrote to it.
  (If the test condition fails, you can fall back to reading the current value
  and then write back the changed number).
-->
* 你可以通過測試條件來精確地構造特定的更新條件。
  例如，如果現有值與你期望的值匹配，你可以遞增計數器而無需讀取它。
  即使自上次寫入以來對象以其他方式發生了更改，你也可以做到這一點而不會遇到丟失更新的風險。
  （如果測試條件失敗，你可以回退爲讀取當前值，然後寫回更改的數字）。

<!--
However:

* You need more local (client) logic to build the patch; it helps a lot if you have
  a library implementation of JSON Patch, or even for making a JSON Patch specifically against Kubernetes.
* As the author of client software, you need to be careful when building the patch
  (the HTTP request body) not to drop fields (the order of operations matters).
-->
然而：

* 你需要更多本地（客戶端）邏輯來構建補丁；如果你擁有實現了 JSON Patch 的庫，
  或者針對 Kubernetes 生成特定的 JSON Patch 的庫，將非常有幫助。
* 作爲客戶端軟體的開發者，你在構建補丁（HTTP 請求體）時需要小心，避免丟棄字段（操作順序很重要）。

<!--
#### HTTP PATCH using Server-Side Apply {#update-mechanism-server-side-apply}

Server-Side Apply has some clear benefits:
-->
#### 使用伺服器端應用的 HTTP PATCH {#update-mechanism-server-side-apply}

伺服器端應用（Server-Side Apply）具有一些明顯的優勢：

<!--
* A single round trip: it rarely requires making a `GET` request first.
  * and you can still detect conflicts for unexpected changes
  * you have the option to force override a conflict, if appropriate
* Client implementations are easy to make.
* You get an atomic create-or-update operation without extra effort
  (similar to `UPSERT` in some SQL dialects).
-->
* 僅需一次輪詢：通常無需先執行 `GET` 請求。
  * 並且你仍然可以檢測到意外更改造成的衝突
  * 合適的時候，你可以選擇強制覆蓋衝突
* 客戶端實現簡單。
* 你可以輕鬆獲得原子級別的 create 或 update 操作，無需額外工作
  （類似於某些 SQL 語句中的 `UPSERT`）。

<!--
However:

* Server-Side Apply does not work at all for field changes that depend on a current value of the object.
* You can only apply updates to objects. Some resources in the Kubernetes HTTP API are
  not objects (they do not have a `.metadata` field), and Server-Side Apply
  is only relevant for Kubernetes objects.
-->
然而：

* 伺服器端應用不適合依賴對象當前值的字段更改。
* 你只能更新對象。Kubernetes HTTP API 中的某些資源不是對象（它們沒有 `.metadata` 字段），
  並且伺服器端應用只能用於 Kubernetes 對象。

<!--
## Resource versions

Resource versions are strings that identify the server's internal version of an
object. Resource versions can be used by clients to determine when objects have
changed, or to express data consistency requirements when getting, listing and
watching resources. Resource versions must be treated as opaque by clients and passed
unmodified back to the server.

You must not assume resource versions are numeric or collatable. API clients may
only compare two resource versions for equality (this means that you must not compare
resource versions for greater-than or less-than relationships).
-->
## 資源版本   {#resource-versions}

資源版本是標識伺服器內部對象版本的字符串。
客戶端可以使用資源版本來確定對象何時更改，
或者在獲取、列出和監視資源時表達資料一致性要求。
資源版本必須被客戶端視爲不透明的，並且未經修改地傳回伺服器。

你不能假設資源版本是數字的或可排序的。
API 客戶端只能比較兩個資源版本的相等性（這意味着你不能比較資源版本的大於或小於關係）。

<!--
### `resourceVersion` fields in metadata {#resourceversion-in-metadata}

Clients find resource versions in resources, including the resources from the response
stream for a **watch**, or when using **list** to enumerate resources.

[v1.meta/ObjectMeta](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#objectmeta-v1-meta) -
The `metadata.resourceVersion` of a resource instance identifies the resource version the instance was last modified at.

[v1.meta/ListMeta](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#listmeta-v1-meta) -
The `metadata.resourceVersion` of a resource collection (the response to a **list**) identifies the
resource version at which the collection was constructed.
-->
### metadata 中的 `resourceVersion`  {#resourceVersion-in-metadata}

客戶端在資源中查找資源版本，這些資源包括來自用於 **watch** 的響應流資源，或者使用 **list** 枚舉的資源。

[v1.meta/ObjectMeta](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#objectmeta-v1-meta) -
資源的 `metadata.resourceVersion` 值標明該實例上次被更改時的資源版本。

[v1.meta/ListMeta](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#listmeta-v1-meta) - 資源集合即
**list** 操作的響應）的 `metadata.resourceVersion` 所標明的是 list 響應被構造時的資源版本。

<!--
### `resourceVersion` parameters in query strings {#the-resourceversion-parameter}

The **get**, **list**, and **watch** operations support the `resourceVersion` parameter.
From version v1.19, Kubernetes API servers also support the `resourceVersionMatch`
parameter on _list_ requests.

The API server interprets the `resourceVersion` parameter differently depending
on the operation you request, and on the value of `resourceVersion`. If you set
`resourceVersionMatch` then this also affects the way matching happens.
-->
### 查詢字符串中的 `resourceVersion` 參數   {#the-resourceversion-parameter}

**get**、**list** 和 **watch** 操作支持 `resourceVersion` 參數。
從 v1.19 版本開始，Kubernetes API 伺服器支持 **list** 請求的 `resourceVersionMatch` 參數。

API 伺服器根據你請求的操作和 `resourceVersion` 的值對 `resourceVersion` 參數進行不同的解釋。
如果你設置 `resourceVersionMatch` 那麼這也會影響匹配發生的方式。

<!--
### Semantics for **get** and **list**

For **get** and **list**, the semantics of `resourceVersion` are:
-->
### **get** 和 **list** 語義   {#semantics-for-get-and-list}

對於 **get** 和 **list** 而言，`resourceVersion` 的語義爲：

**get：**

<!--
| resourceVersion unset | resourceVersion="0" | resourceVersion="{value other than 0}" |
|-----------------------|---------------------|----------------------------------------|
| Most Recent           | Any                 | Not older than                         |
-->
| resourceVersion 未設置 | resourceVersion="0" | resourceVersion="\<非零值\>" |
|-----------------------|---------------------|----------------------------------------|
| 最新版本               | 任何版本            | 不老於給定版本                         |

**list：**

<!--
From version v1.19, Kubernetes API servers support the `resourceVersionMatch` parameter
on _list_ requests. If you set both `resourceVersion` and `resourceVersionMatch`, the
`resourceVersionMatch` parameter determines how the API server interprets
`resourceVersion`.

You should always set the `resourceVersionMatch` parameter when setting
`resourceVersion` on a **list** request. However, be prepared to handle the case
where the API server that responds is unaware of `resourceVersionMatch`
and ignores it.
-->
從 v1.19 版本開始，Kubernetes API 伺服器支持 **list** 請求的 `resourceVersionMatch` 參數。
如果同時設置 `resourceVersion` 和 `resourceVersionMatch`，
則 `resourceVersionMatch` 參數確定 API 伺服器如何解釋 `resourceVersion`。

在 **list** 請求上設置 `resourceVersion` 時，你應該始終設置 `resourceVersionMatch` 參數。
但是，請準備好處理響應的 API 伺服器不知道 `resourceVersionMatch` 並忽略它的情況。

<!--
Unless you have strong consistency requirements, using `resourceVersionMatch=NotOlderThan` and
a known `resourceVersion` is preferable since it can achieve better performance and scalability
of your cluster than leaving `resourceVersion` and `resourceVersionMatch` unset, which requires
quorum read to be served.

Setting the `resourceVersionMatch` parameter without setting `resourceVersion` is not valid.

This table explains the behavior of **list** requests with various combinations of
`resourceVersion` and `resourceVersionMatch`:
-->
除非你對一致性有着非常強烈的需求，使用 `resourceVersionMatch=NotOlderThan`
同時爲 `resourceVersion` 設定一個已知值是優選的交互方式，因爲與不設置
`resourceVersion` 和 `resourceVersionMatch` 相比，這種設定可以取得更好的叢集性能和可擴縮性。
後者需要提供帶票選能力的讀操作。

設置 `resourceVersionMatch` 參數而不設置 `resourceVersion` 參數是不合法的。

下表解釋了具有各種 `resourceVersion` 和 `resourceVersionMatch` 組合的 **list** 請求的行爲：

<!--
| resourceVersionMatch param          | paging params                  | resourceVersion not set | resourceVersion="0" | resourceVersion="{value other than 0}" |
|-------------------------------------|--------------------------------|-------------------------|---------------------|----------------------------------------|
| _unset_                             | _limit unset_                  | Most Recent             | Any                 | Not older than                         |
| _unset_                             | limit=\<n\>, _continue unset_  | Most Recent             | Any                 | Exact                                  |
| _unset_                             | limit=\<n\>, continue=\<token\>| Continuation            | Continuation        | Invalid, HTTP `400 Bad Request`        |
| `resourceVersionMatch=Exact`        | _limit unset_                  | Invalid                 | Invalid             | Exact                                  |
| `resourceVersionMatch=Exact`        | limit=\<n\>, _continue unset_  | Invalid                 | Invalid             | Exact                                  |
| `resourceVersionMatch=NotOlderThan` | _limit unset_                  | Invalid                 | Any                 | Not older than                         |
| `resourceVersionMatch=NotOlderThan` | limit=\<n\>, _continue unset_  | Invalid                 | Any                 | Not older than                         |

{{</* /table */>}}
-->
{{< table caption="list 操作的 resourceVersionMatch 與分頁參數" >}}

| resourceVersionMatch 參數                    | 分頁參數                         | resourceVersion 未設置             | resourceVersion="0"                | resourceVersion="\<非零值\>" |
|---------------------------------------------|---------------------------------|-----------------------------------|------------------------------------|-----------------------------|
| **未設置**                                   | **limit 未設置**                 | 最新版本                           | 任意版本                             | 不老於指定版本                |
| **未設置** | limit=\<n\>, **continue 未設置** | 最新版本                         | 任意版本                           | 精確匹配                             |                             ｜
| **未設置** | limit=\<n\>, continue=\<token\> | 從 token 開始、精確匹配            | 非法請求，視爲從 token 開始、精確匹配 | 非法請求，返回 HTTP `400 Bad Request` |                             ｜
| `resourceVersionMatch=Exact` [1]            | **limit 未設置**                 | 非法請求                           | 非法請求                            | 精確匹配                       |
| `resourceVersionMatch=Exact` [1]            | limit=\<n\>, **continue 未設置** | 非法請求                           | 非法請求                            | 精確匹配                       |
| `resourceVersionMatch=NotOlderThan` [1]     | **limit 未設置**                 | 非法請求                           | 任意版本                            | 不老於指定版本                  |
| `resourceVersionMatch=NotOlderThan` [1]     | limit=\<n\>, **continue 未設置** | 非法請求                           | 任意版本                            | 不老於指定版本                  |

{{< /table >}}

{{< note >}}
<!--
If your cluster's API server does not honor the `resourceVersionMatch` parameter,
the behavior is the same as if you did not set it.
-->
如果你的叢集的 API 伺服器不支持 `resourceVersionMatch` 參數，
則行爲與你未設置它時相同。
{{< /note >}}

<!--
The meaning of the **get** and **list** semantics are:
-->
**get** 和 **list** 的語義是：

<!--
Any
: Return data at any resource version. The newest available resource version is preferred,
  but strong consistency is not required; data at any resource version may be served. It is possible
  for the request to return data at a much older resource version that the client has previously
  observed, particularly in high availability configurations, due to partitions or stale
  caches. Clients that cannot tolerate this should not use this semantic.
  Always served from _watch cache_, improving performance and reducing etcd load.
-->
任意版本
: 返回任何資源版本的資料。最新可用資源版本優先，但不需要強一致性；
  可以提供任何資源版本的資料。由於分區或過時的緩存，
  請求可能返回客戶端先前觀察到的更舊資源版本的資料，特別是在高可用性設定中。
  不能容忍這種情況的客戶不應該使用這種語義。
  始終通過**監視緩存**提供服務，提高性能並減少 etcd 負載。

<!--
Most recent
: Return data at the most recent resource version. The returned data must be
  consistent (in detail: served from etcd via a quorum read).
  For etcd v3.4.31+ and v3.5.13+, Kubernetes {{< skew currentVersion >}} serves “most recent” reads from the _watch cache_:
  an internal, in-memory store within the API server that caches and mirrors the state of data
  persisted into etcd. Kubernetes requests progress notification to maintain cache consistency against
  the etcd persistence layer. Kubernetes v1.28 through to v1.30 also supported this
  feature, although as Alpha it was not recommended for production nor enabled by default until the v1.31 release.
-->
最新版本
: 返回最新資源版本的資料。
  返回的資料必須一致（詳細說明：通過仲裁讀取從 etcd 提供）。
  對於 etcd v3.4.31+ 和 v3.5.13+ Kubernetes {{< skew currentVersion >}} 使用**監視緩存**來爲“最新”讀取提供服務：
  監視緩存是 API 伺服器內部的基於內存的儲存，用於緩存和映像檔持久化到 etcd 中的資料狀態。
  Kubernetes 請求進度通知以維護與 etcd 持久層的緩存一致性。Kubernetes
  版本 v1.28 至 v1.30 也支持此特性，儘管當時其處於 Alpha 狀態，不推薦用於生產，
  也不預設啓用，直到 v1.31 版本才啓用。

<!--
Not older than
: Return data at least as new as the provided `resourceVersion`. The newest
  available data is preferred, but any data not older than the provided `resourceVersion` may be
  served. For **list** requests to servers that honor the `resourceVersionMatch` parameter, this
  guarantees that the collection's `.metadata.resourceVersion` is not older than the requested
  `resourceVersion`, but does not make any guarantee about the `.metadata.resourceVersion` of any
  of the items in that collection.
  Always served from _watch cache_, improving performance and reducing etcd load.
-->
不老於指定版本
: 返回資料至少與提供的 `resourceVersion` 一樣新。
  最新的可用資料是首選，但可以提供不早於提供的 `resourceVersion` 的任何資料。
  對於對遵守 `resourceVersionMatch` 參數的伺服器的 **list** 請求，
  這保證了集合的 `.metadata.resourceVersion` 不早於請求的 `resourceVersion`，
  但不保證該集合中任何項目的 `.metadata.resourceVersion`。
  始終通過**監視緩存**提供服務，提高性能並減少 etcd 負載。

<!--
Exact
: Return data at the exact resource version provided. If the provided `resourceVersion` is
  unavailable, the server responds with HTTP `410 Gone`. For **list** requests to servers that honor the
  `resourceVersionMatch` parameter, this guarantees that the collection's `.metadata.resourceVersion`
  is the same as the `resourceVersion` you requested in the query string. That guarantee does
  not apply to the `.metadata.resourceVersion` of any items within that collection.

  By default served from _etcd_, but with the `ListFromCacheSnapshot` feature gate enabled,
  API server will attempt to serve the response from snapshot if available.
  This improves performance and reduces etcd load. Cache snapshots are kept by default for 75 seconds,
  so if the provided `resourceVersion` is unavailable, the server will fallback to etcd.
-->
精確匹配
: 以提供的確切資源版本返回資料。如果提供的 `resourceVersion` 不可用，
  則伺服器以 HTTP `410 Gone` 響應。對於對支持 `resourceVersionMatch` 參數的伺服器的 **list** 請求，
  這可以保證集合的 `.metadata.resourceVersion` 與你在查詢字符串中請求的 `resourceVersion` 相同。
  該保證不適用於該集合中任何項目的 `.metadata.resourceVersion`。

  預設情況下，由 **etcd** 提供服務，但是當啓用了 `ListFromCacheSnapshot` 特性門控時，
  如果可用，API 伺服器將嘗試從快照提供響應。
  這提升了性能並減少了 etcd 的負載。緩存快照預設保留 75 秒，
  因此如果提供的 `resourceVersion` 不可用，伺服器將回退到 etcd。

<!--
Continuation
: Return the next page of data for a paginated list request, ensuring consistency with the exact `resourceVersion` established by the initial request in the sequence.
  Response to **list** requests with limit include _continue token_, that encodes the  `resourceVersion` and last observed position from which to resume the list.
  If the `resourceVersion` in the provided _continue token_ is unavailable, the server responds with HTTP `410 Gone`.
  By default served from _etcd_, but with the `ListFromCacheSnapshot` feature gate enabled,
  API server will attempt to serve the response from snapshot if available.
  This improves performance and reduces etcd load. Cache snapshots are kept by default for 75 seconds,
  so if the `resourceVersion` in provided _continue token_ is unavailable, the server will fallback to etcd.
-->
續頁
: 爲分頁列表請求返回下一頁資料，確保與序列中初始請求建立的確切 `resourceVersion` 保持一致。
  對帶有限制的 **list** 請求的響應包括 **continue 令牌**，它編碼了 `resourceVersion`
  和最後觀察到的位置，給出繼續列表的起點。
  如果提供的 **continue 令牌**中的 `resourceVersion` 不可用，伺服器將返回 HTTP `410 Gone`。
  預設情況下，由 **etcd** 提供服務，但是當啓用了 `ListFromCacheSnapshot` 特性門控時，
  API 伺服器將嘗試從快照提供響應（如果緩存快可用）。
  這提升了性能並減少了 etcd 的負載。緩存快照預設保留 75 秒，
  因此如果提供的 **continue 令牌**中的 `resourceVersion` 不可用，伺服器將回退到 etcd。

{{< note >}}
<!--
When you **list** resources and receive a collection response, the response includes the
[list metadata](/docs/reference/generated/kubernetes-api/v{{<skew currentVersion >}}/#listmeta-v1-meta)
of the collection as well as
[object metadata](/docs/reference/generated/kubernetes-api/v{{<skew currentVersion >}}/#objectmeta-v1-meta)
for each item in that collection. For individual objects found within a collection response,
`.metadata.resourceVersion` tracks when that object was last updated, and not how up-to-date
the object is when served.
-->
當你 **list** 資源並收到集合響應時，
響應包括集合的[列表元資料](/docs/reference/generated/kubernetes-api/v{{<skew currentVersion >}}/#listmeta-v1-meta)。
以及該集合中每個項目的[對象元資料](/docs/reference/generated/kubernetes-api/v{{<skew currentVersion >}}/#objectmeta-v1-meta)。
對於在集合響應中找到的單個對象，`.metadata.resourceVersion` 跟蹤該對象的最後更新時間，
而不是對象在服務時的最新程度。
{{< /note >}}

<!--
When using `resourceVersionMatch=NotOlderThan` and limit is set, clients must
handle HTTP `410 Gone` responses. For example, the client might retry with a
newer `resourceVersion` or fall back to `resourceVersion=""`.

When using `resourceVersionMatch=Exact` and `limit` is unset, clients must
verify that the collection's `.metadata.resourceVersion` matches
the requested `resourceVersion`, and handle the case where it does not. For
example, the client might fall back to a request with `limit` set.
-->
當使用 `resourceVersionMatch=NotOlderThan` 並設置了限制時，
客戶端必須處理 HTTP `410 Gone` 響應。
例如，客戶端可能會使用更新的 `resourceVersion` 重試或回退到 `resourceVersion=""`。

當使用 `resourceVersionMatch=Exact` 並且未設置限制時，
客戶端必須驗證集合的 `.metadata.resourceVersion` 是否與請求的 `resourceVersion` 匹配，
並處理不匹配的情況。例如，客戶端可能會退回到設置了限制的請求。

<!--
### Semantics for **watch**

For watch, the semantics of resource version are:
-->
### **watch** 語義   {#semantics-for-watch}

對於 **watch** 操作而言，資源版本的語義如下：

**watch：**

<!--
{{< table caption="resourceVersion for watch" >}}

| resourceVersion unset               | resourceVersion="0"        | resourceVersion="{value other than 0}" |
|-------------------------------------|----------------------------|----------------------------------------|
| Get State and Start at Most Recent  | Get State and Start at Any | Start at Exact                         |

{{< /table >}}
-->
{{< table caption="watch 操作的 resourceVersion 設置" >}}

| resourceVersion 未設置    | resourceVersion="0"      | resourceVersion="\<非零值\>" |
|---------------------------|--------------------------|------------------------------|
| 讀取狀態並從最新版本開始  | 讀取狀態並從任意版本開始 | 從指定版本開始               |

{{< /table >}}

<!--
The meaning of those **watch** semantics are:

Get State and Start at Any
: Start a **watch** at any resource version; the most recent resource version
  available is preferred, but not required. Any starting resource version is
  allowed. It is possible for the **watch** to start at a much older resource
  version that the client has previously observed, particularly in high availability
  configurations, due to partitions or stale caches. Clients that cannot tolerate
  this apparent rewinding should not start a **watch** with this semantic. To
  establish initial state, the **watch** begins with synthetic "Added" events for
  all resource instances that exist at the starting resource version. All following
  watch events are for all changes that occurred after the resource version the
  **watch** started at.
-->
**watch** 操作語義的含義如下：

讀取狀態並從任意版本開始
: 在任何資源版本開始 **watch**；首選可用的最新資源版本，但不是必需的。允許任何起始資源版本。
  由於分區或過時的緩存，**watch** 可能從客戶端之前觀察到的更舊的資源版本開始，
  特別是在高可用性設定中。不能容忍這種明顯倒帶的客戶不應該用這種語義啓動 **watch**。
  爲了建立初始狀態，**watch** 從起始資源版本中存在的所有資源實例的合成 “添加” 事件開始。
  以下所有監視事件都針對在 **watch** 開始的資源版本之後發生的所有更改。

  {{< caution >}}
  <!--
  **watches** initialized this way may return arbitrarily stale
  data. Please review this semantic before using it, and favor the other semantics
  where possible.
  -->
  以這種方式初始化的 **watch** 可能會返回任意陳舊的資料。
  請在使用之前查看此語義，並儘可能支持其他語義。
  {{< /caution >}}

<!--
Get State and Start at Most Recent
: Start a **watch** at the most recent resource version, which must be consistent
  (in detail: served from etcd via a quorum read). To establish initial state,
  the **watch** begins with synthetic "Added" events of all resources instances
  that exist at the starting resource version. All following watch events are for
  all changes that occurred after the resource version the **watch** started at.
-->
讀取狀態並從最新版本開始
: 從最近的資源版本開始 **watch**，
  它必須是一致的（詳細說明：通過仲裁讀取從 etcd 提供服務）。
  爲了建立初始狀態，**watch** 從起始資源版本中存在的所有資源實例的合成 “添加” 事件開始。
  以下所有監視事件都針對在 **watch** 開始的資源版本之後發生的所有更改。

<!--
Start at Exact
: Start a **watch** at an exact resource version. The watch events are for all changes
  after the provided resource version. Unlike "Get State and Start at Most Recent"
  and "Get State and Start at Any", the **watch** is not started with synthetic
  "Added" events for the provided resource version. The client is assumed to already
  have the initial state at the starting resource version since the client provided
  the resource version.
-->
從指定版本開始
: 以確切的資源版本開始 **watch**。監視事件適用於提供的資源版本之後的所有更改。
  與 “Get State and Start at Most Recent” 和 “Get State and Start at Any” 不同，
  **watch** 不會以所提供資源版本的合成 “添加” 事件啓動。
  由於客戶端提供了資源版本，因此假定客戶端已經具有起始資源版本的初始狀態。

<!--
### "410 Gone" responses

Servers are not required to serve all older resource versions and may return a HTTP
`410 (Gone)` status code if a client requests a `resourceVersion` older than the
server has retained. Clients must be able to tolerate `410 (Gone)` responses. See
[Efficient detection of changes](#efficient-detection-of-changes) for details on
how to handle `410 (Gone)` responses when watching resources.

If you request a `resourceVersion` outside the applicable limit then, depending
on whether a request is served from cache or not, the API server may reply with a
`410 Gone` HTTP response.
-->
### "410 Gone" 響應     {#410-gone-responses}

伺服器不需要提供所有老的資源版本，在客戶端請求的是早於伺服器端所保留版本的
`resourceVersion` 時，可以返回 HTTP `410 (Gone)` 狀態碼。
客戶端必須能夠容忍 `410 (Gone)` 響應。
參閱[高效檢測變更](#efficient-detection-of-changes)以瞭解如何在監測資源時處理
`410 (Gone)` 響應。

如果所請求的 `resourceVersion` 超出了可應用的 `limit`，
那麼取決於請求是否是通過高速緩存來滿足的，API 伺服器可能會返回一個 `410 Gone` HTTP 響應。

<!--
### Unavailable resource versions

Servers are not required to serve unrecognized resource versions. If you request
**list** or **get** for a resource version that the API server does not recognize,
then the API server may either:

* wait briefly for the resource version to become available, then timeout with a
  `504 (Gateway Timeout)` if the provided resource versions does not become available
  in a reasonable amount of time;
* respond with a `Retry-After` response header indicating how many seconds a client
  should wait before retrying the request.
-->
### 不可用的資源版本  {#unavailable-resource-versions}

伺服器不需要提供無法識別的資源版本。
如果你請求了 **list** 或 **get** API 伺服器無法識別的資源版本，則 API 伺服器可能會：

* 短暫等待資源版本可用，如果提供的資源版本在合理的時間內仍不可用，
  則應超時並返回 `504 (Gateway Timeout)`；
* 使用 `Retry-After` 響應標頭進行響應，指示客戶端在重試請求之前應等待多少秒。

<!--
If you request a resource version that an API server does not recognize, the
kube-apiserver additionally identifies its error responses with a message
`Too large resource version`.

If you make a **watch** request for an unrecognized resource version, the API server
may wait indefinitely (until the request timeout) for the resource version to become
available.
-->
如果你請求 API 伺服器無法識別的資源版本，
kube-apiserver 還會使用 `Too large resource version` 消息額外標識其錯誤響應。

如果你對無法識別的資源版本發出 **watch** 請求，
API 伺服器可能會無限期地等待（直到請求超時）資源版本變爲可用。
