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
fine grained authorization (such as a separating viewing details for a Pod from
retrieving its logs), and can accept and serve those resources in different
representations for convenience or efficiency.
-->
Kubernetes API 是透過 HTTP 提供的基於資源 (RESTful) 的程式設計介面。
它支援透過標準 HTTP 動詞（POST、PUT、PATCH、DELETE、GET）檢索、建立、更新和刪除主要資源。

對於某些資源，API 包括額外的子資源，允許細粒度授權（例如將 Pod 的檢視詳細資訊與檢索其日誌分開），
為了方便或者提高效率，可以以不同的表示形式接受和服務這些資源。

<!--
Kubernetes supports efficient change notifications on resources via *watches*.
Kubernetes also provides consistent list operations so that API clients can
effectively cache, track, and synchronize the state of resources.

You can view the [API reference](/docs/reference/kubernetes-api/) online,
or read on to learn about the API in general.
-->
Kubernetes 支援透過 **watchs** 實現高效的資源變更通知。
Kubernetes 還提供了一致的列表操作，以便 API 客戶端可以有效地快取、跟蹤和同步資源的狀態。

你可以線上檢視 [API 參考](/zh-cn/docs/reference/kubernetes-api/)，
或繼續閱讀以瞭解 API 的一般資訊。

<!--
## Kubernetes API terminology {#standard-api-terminology}

Kubernetes generally leverages common RESTful terminology to describe the
API concepts:

* A *resource type* is the name used in the URL (`pods`, `namespaces`, `services`)
* All resource types have a concrete representation (their object schema) which is called a *kind*
* A list of instances of a resource is known as a *collection*
* A single instance of a resource type is called a *resource*, and also usually represents an *object*
* For some resource types, the API includes one or more *sub-resources*, which are represented as URI paths below the resource
-->
## Kubernetes API 術語  {#standard-api-terminology}

Kubernetes 通常使用常見的 RESTful 術語來描述 API 概念：
* **資源型別（Resource Type）** 是 URL 中使用的名稱（`pods`、`namespaces`、`services`）
* 所有資源型別都有一個具體的表示（它們的物件模式），稱為 **類別（Kind）**
* 資源例項的列表稱為 **集合（Collection）**
* 資源型別的單個例項稱為 **資源（Resource）**，通常也表示一個 **物件（Object）**
* 對於某些資源型別，API 包含一個或多個 **子資源（sub-resources）**，這些子資源表示為資源下的 URI 路徑

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
大多數 Kubernetes API 資源型別都是
[物件](/zh-cn/docs/concepts/overview/working-with-objects/kubernetes-objects/#kubernetes-objects)：
它們代表叢集上某個概念的具體例項，例如 Pod 或名稱空間。
少數 API 資源型別是 “虛擬的”，它們通常代表的是操作而非物件本身，
例如許可權檢查（使用帶有 JSON 編碼的 `SubjectAccessReview` 主體的 POST 到 `subjectaccessreviews` 資源），
或 Pod 的子資源 `eviction`（用於觸發 [API-發起的驅逐](/zh-cn/docs/concepts/scheduling-eviction/api-eviction/)）。

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

### 物件名字 {#object-names}

你可以透過 API 建立的所有物件都有一個唯一的{{< glossary_tooltip text="名字" term_id="name" >}}，
以允許冪等建立和檢索，
但如果虛擬資源型別不可檢索或不依賴冪等性，則它們可能沒有唯一名稱。
在{{< glossary_tooltip text="名稱空間" term_id="namespace" >}}內，
同一時刻只能有一個給定類別的物件具有給定名稱。
但是，如果你刪除該物件，你可以建立一個具有相同名稱的新物件。
有些物件沒有名稱空間（例如：節點），因此它們的名稱在整個叢集中必須是唯一的。

<!--
### API verbs

Almost all object resource types support the standard HTTP verbs - GET, POST, PUT, PATCH,
and DELETE. Kubernetes also uses its own verbs, which are often written lowercase to distinguish
them from HTTP verbs.

Kubernetes uses the term **list** to describe returning a [collection](#collections) of
resources to distinguish from retrieving a single resource which is usually called
a **get**. If you sent an HTTP GET request with the `?watch` query parameter,
Kubernetes calls this a **watch** and not a **get** (see
[Efficient detection of changes](#efficient-detection-of-changes) for more details).

For PUT requests, Kubernetes internally classifies these as either **create** or **update**
based on the state of the existing object. An **update** is different from a **patch**; the
HTTP verb for a **patch** is PATCH.
-->
### API 動詞 {#api-verbs}

幾乎所有物件資源型別都支援標準 HTTP 動詞 - GET、POST、PUT、PATCH 和 DELETE。 
Kubernetes 也使用自己的動詞，這些動詞通常寫成小寫，以區別於 HTTP 動詞。

Kubernetes 使用術語 **list** 來描述返回資源[集合](#collections)，
以區別於通常稱為 **get** 的單個資源檢索。
如果你傳送帶有 `?watch` 查詢引數的 HTTP GET 請求，
Kubernetes 將其稱為 **watch** 而不是 **get**（有關詳細資訊，請參閱[快速檢測更改](#efficient-detection-of-changes)）。

對於 PUT 請求，Kubernetes 在內部根據現有物件的狀態將它們分類為 **create** 或 **update**。
**update** 不同於 **patch**；**patch** 的 HTTP 動詞是 PATCH。

<!--
## Resource URIs

All resource types are either scoped by the cluster (`/apis/GROUP/VERSION/*`) or to a
namespace (`/apis/GROUP/VERSION/namespaces/NAMESPACE/*`). A namespace-scoped resource
type will be deleted when its namespace is deleted and access to that resource type
is controlled by authorization checks on the namespace scope.

You can also access collections of resources (for example: listing all Nodes).
The following paths are used to retrieve collections and resources:

* Cluster-scoped resources:

  * `GET /apis/GROUP/VERSION/RESOURCETYPE` - return the collection of resources of the resource type
  * `GET /apis/GROUP/VERSION/RESOURCETYPE/NAME` - return the resource with NAME under the resource type

* Namespace-scoped resources:

  * `GET /apis/GROUP/VERSION/RESOURCETYPE` - return the collection of all instances of the resource type across all namespaces
  * `GET /apis/GROUP/VERSION/namespaces/NAMESPACE/RESOURCETYPE` - return collection of all instances of the resource type in NAMESPACE
  * `GET /apis/GROUP/VERSION/namespaces/NAMESPACE/RESOURCETYPE/NAME` - return the instance of the resource type with NAME in NAMESPACE
-->
## 資源 URI {#resource-uris}
所有資源型別要麼是叢集作用域的（`/apis/GROUP/VERSION/*`），要麼是名字空間
作用域的（`/apis/GROUP/VERSION/namespaces/NAMESPACE/*`）。
名字空間作用域的資源型別會在其名字空間被刪除時也被刪除，並且對該資源型別的
訪問是由定義在名字空間域中的授權檢查來控制的。

你還可以訪問資源集合（例如：列出所有 Node）。以下路徑用於檢索集合和資源：


* 叢集作用域的資源：
  * `GET /apis/GROUP/VERSION/RESOURCETYPE` - 返回指定資源型別的資源的集合
  * `GET /apis/GROUP/VERSION/RESOURCETYPE/NAME` - 返回指定資源型別下名稱為 NAME 的資源
* 名字空間作用域的資源：
  * `GET /apis/GROUP/VERSION/RESOURCETYPE` - 返回所有名字空間中指定資源型別的全部例項的集合
  * `GET /apis/GROUP/VERSION/namespaces/NAMESPACE/RESOURCETYPE` - 返回名字空間 NAMESPACE 內給定資源型別的全部例項的集合
  * `GET /apis/GROUP/VERSION/namespaces/NAMESPACE/RESOURCETYPE/NAME` - 返回名字空間 NAMESPACE 中給定資源型別的名稱為 NAME 的例項

<!--
Since a namespace is a cluster-scoped resource type, you can retrieve the list
(“collection”) of all namespaces with `GET /api/v1/namespaces` and details about
a particular namespace with `GET /api/v1/namespaces/NAME`.
-->
由於名字空間本身是一個叢集作用域的資源型別，你可以透過 `GET /api/v1/namespaces/`
檢視所有名字空間的列表（“集合”），使用 `GET /api/v1/namespaces/NAME` 檢視特定名字空間的
詳細資訊。

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

取決於物件是什麼，每個子資源所支援的動詞有所不同 - 參見 [API 文件](/zh-cn/docs/reference/kubernetes-api/)以瞭解更多資訊。
跨多個資源來訪問其子資源是不可能的 - 如果需要這一能力，則通常意味著需要一種
新的虛擬資源型別了。

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

Kubernetes API 允許客戶端對物件或集合發出初始請求，然後跟蹤自該初始請求以來的更改：**watch**。
客戶端可以傳送 **list** 或者 **get** 請求，然後發出後續 **watch** 請求。

為了使這種更改跟蹤成為可能，每個 Kubernetes 物件都有一個 `resourceVersion` 欄位，
表示儲存在底層持久層中的該資源的版本。在檢索資源集合（名稱空間或叢集範圍）時，
來自 API 伺服器的響應包含一個 `resourceVersion` 值。
客戶端可以使用該 `resourceVersion` 來啟動對 API 伺服器的 **watch**。

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
當你傳送 **watch** 請求時，API 伺服器會響應更改流。
這些更改逐項列出了在你指定為 **watch** 請求引數的 `resourceVersion` 之後發生的操作（例如 **create**、**delete** 和 **update**）的結果。
整個 **watch** 機制允許客戶端獲取當前狀態，然後訂閱後續更改，而不會丟失任何事件。

如果客戶端 **watch** 連線斷開，則該客戶端可以從最後返回的 `resourceVersion` 開始新的 **watch** 請求；
客戶端還可以執行新的 **get**/**list** 請求並重新開始。有關更多詳細資訊，請參閱[資源版本語義](#resource-versions)。

例如：

<!--
1. List all of the pods in a given namespace.
-->
1. 列舉給定名字空間中的所有 Pods：

   ```console
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
   (such as **create**, **delete**, **apply** or **update**) that affect Pods in the
   _test_ namespace. Each change notification is a JSON document. The HTTP response body
   (served as `application/json`) consists a series of JSON documents.
-->
2. 從資源版本 10245 開始，接收影響 _test_ 名稱空間中 Pod 的所有 API 操作
   （例如 **create**、**delete**、**apply** 或 **update**）的通知。
   每個更改通知都是一個 JSON 文件。
   HTTP 響應正文（用作 `application/json`）由一系列 JSON 文件組成。

   ```
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
使用 etcd3 的叢集預設儲存過去 5 分鐘內發生的變更。
當所請求的 **watch** 操作因為資源的歷史版本不存在而失敗，
客戶端必須能夠處理因此而返回的狀態程式碼 `410 Gone`，清空其本地的快取，
重新執行 **get** 或者 **list** 操作，
並基於新返回的 `resourceVersion` 來開始新的 **watch** 操作。

對於訂閱集合，Kubernetes 客戶端庫通常會為 **list** -然後- **watch** 的邏輯提供某種形式的標準工具。
（在 Go 客戶端庫中，這稱為`反射器（Reflector）`，位於 `k8s.io/client-go/tools/cache` 包中。）

<!--
### Watch bookmarks

To mitigate the impact of short history window, the Kubernetes API provides a watch
event named `BOOKMARK`. It is a special kind of event to mark that all changes up
to a given `resourceVersion` the client is requesting have already been sent. The
document representing the `BOOKMARK` event is of the type requested by the request,
but only includes a `.metadata.resourceVersion` field. For example:
-->
### 監視書籤  {#Watch-bookmark}

為了減輕短歷史視窗的影響，Kubernetes API 提供了一個名為 `BOOKMARK` 的監視事件。
這是一種特殊的事件，用於標記客戶端請求的給定 `resourceVersion` 的所有更改都已傳送。
代表 `BOOKMARK` 事件的文件屬於請求所請求的型別，但僅包含一個 `.metadata.resourceVersion` 欄位。例如：

```console
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
作為客戶端，你可以在 **watch** 請求中設定 `allowWatchBookmarks=true` 查詢引數來請求 `BOOKMARK` 事件，
但你不應假設書籤會在任何特定時間間隔返回，即使要求時，客戶端也不能假設 API 伺服器會發送任何 `BOOKMARK` 事件。

<!--
## Retrieving large results sets in chunks
-->
## 分塊檢視大體量結果  {#retrieving-large-results-sets-in-chunks}

{{< feature-state for_k8s_version="v1.9" state="beta" >}}

<!--
On large clusters, retrieving the collection of some resource types may result in
very large responses that can impact the server and client. For instance, a cluster
may have tens of thousands of Pods, each of which is equivalent to roughly 2 KiB of
encoded JSON. Retrieving all pods across all namespaces may result in a very large
response (10-20MB) and consume a large amount of server resources.
-->
在較大規模叢集中，檢索某些資源型別的集合可能會導致非常大的響應，從而影響伺服器和客戶端。
例如，一個叢集可能有數萬個 Pod，每個 Pod 大約相當於 2 KiB 的編碼 JSON。
跨所有名稱空間檢索所有 Pod 可能會導致非常大的響應 (10-20MB) 並消耗大量伺服器資源。

<!--
Provided that you don't explicitly disable the `APIListChunking`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/), the
Kubernetes API server supports the ability to break a single large collection request
into many smaller chunks while preserving the consistency of the total request. Each
chunk can be returned sequentially which reduces both the total size of the request and
allows user-oriented clients to display results incrementally to improve responsiveness.
-->
如果你沒有明確禁用 `APIListChunking` [特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)，
Kubernetes API 伺服器支援將單個大型集合請求分解為許多較小塊的能力，同時保持總請求的一致性。

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
你可以請求 API 伺服器透過使用頁（Kubernetes 將其稱為“塊（Chunk）”）的方式來處理 **list**，
完成單個集合的響應。
要以塊的形式檢索單個集合，針對集合的請求支援兩個查詢引數 `limit` 和 `continue`，
並且從集合元 `metadata` 欄位中的所有 **list** 操作返回響應欄位 `continue`。
客戶端應該指定他們希望在每個帶有 `limit` 的塊中接收的條目數上限，如果集合中有更多資源，
伺服器將在結果中返回 `limit` 資源幷包含一個 `continue` 值。

<!--
As an API client, you can then pass this `continue` value to the API server on the
next request, to instruct the server to return the next page (_chunk_) of results. By
continuing until the server returns an empty `continue` value, you can retrieve the
entire collection.
-->
作為 API 客戶端，你可以在下一次請求時將 `continue` 值傳遞給 API 伺服器，
以指示伺服器返回下一頁（_塊_）結果。繼續下去直到伺服器返回一個空的 `continue` 值，
你可以檢索整個集合。

<!--
Like a **watch** operation, a `continue` token will expire after a short amount
of time (by default 5 minutes) and return a `410 Gone` if more results cannot be
returned. In this case, the client will need to start from the beginning or omit the
`limit` parameter.

For example, if there are 1,253 pods on the cluster and you wants to receive chunks
of 500 pods at a time, request those chunks as follows:
-->
與 **watch** 操作類似，`continue` 令牌也會在很短的時間（預設為 5 分鐘）內過期，
並在無法返回更多結果時返回 `410 Gone` 程式碼。
這時，客戶端需要從頭開始執行上述檢視操作或者忽略 `limit` 引數。

例如，如果叢集上有 1253 個 Pod，客戶端希望每次收到包含至多 500 個 Pod 的
資料塊，它應按下面的步驟來請求資料塊：

<!--
1. List all of the pods on a cluster, retrieving up to 500 pods each time.
-->
1. 列舉叢集中所有 Pod，每次接收至多 500 個 Pods：

   ```console
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
       ...
     },
     "items": [...] // returns pods 1-500
   }
   ```
<!--
2. Continue the previous call, retrieving the next set of 500 pods.
-->
2. 繼續前面的呼叫，返回下一組 500 個 Pods：

   ```console
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
       ...
     },
     "items": [...] // returns pods 501-1000
   }
   ```

<!--
3. Continue the previous call, retrieving the last 253 pods.
-->
3. 繼續前面的呼叫，返回最後 253 個 Pods：

  ```console
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
you make a separate **list** request without the `continue` token.  This allows you
to break large requests into smaller chunks and then perform a **watch** operation
on the full set without missing any updates.
-->
請注意，集合的 `resourceVersion` 在每個請求中保持不變，
這表明伺服器正在向你顯示 Pod 的一致快照。
在版本 `10245` 之後建立、更新或刪除的 Pod 將不會顯示，
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
`remainingItemCount` 是集合中未包含在此響應中的後續專案的數量。
如果 **list** 請求包含標籤或欄位{{< glossary_tooltip text="選擇器" term_id="selector">}} ，
則剩餘專案的數量是未知的，並且 API 伺服器在其響應中不包含 `remainingItemCount` 欄位。
如果 **list** 是完整的（因為它沒有分塊，或者因為這是最後一個塊），沒有更多的剩餘專案，
API 伺服器在其響應中不包含 `remainingItemCount` 欄位。
`remainingItemCount` 的用途是估計集合的大小。

<!--
## Collections

In Kubernetes terminology, the response you get from a **list** is
a _collection_. However, Kubernetes defines concrete kinds for
collections of different types of resource. Collections have a kind
named for the resource kind, with `List` appended.

When you query the API for a particular type, all items returned by that query are
of that type.
For example, when you **list** Services, the collection response
has `kind` set to
[`ServiceList`](/docs/reference/kubernetes-api/service-resources/service-v1/#ServiceList); each item in that collection represents a single Service. For example:
-->
## 集合 {#collections}

在 Kubernetes 術語中，你從 **list** 中獲得的響應是一個“集合（Collections）”。
然而，Kubernetes 為不同型別資源的集合定義了具體型別。
集合的類別名是針對資源類別的，並附加了 `List`。

當你查詢特定型別的 API 時，該查詢返回的所有專案都屬於該型別。
例如，當你 **list** Service 物件時，集合響應的 `kind` 設定為
[`ServiceList`](/zh-cn/docs/reference/kubernetes-api/service-resources/service-v1/#ServiceList)；
該集合中的每個專案都代表一個 Service。例如：

```
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
Kubernetes API 中定義了數十種集合型別（如 `PodList`、`ServiceList` 和 `NodeList`）。
你可以從 [Kubernetes API](/zh-cn/docs/reference/kubernetes-api/) 文件中獲取有關每種集合型別的更多資訊。

一些工具，例如 `kubectl`，對於 Kubernetes 集合的表現機制與 Kubernetes API 本身略有不同。
因為 `kubectl` 的輸出可能包含來自 API 級別的多個 **list** 操作的響應，
所以 `kubectl` 使用 `kind: List` 表示專案列表。例如：

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

<!--
Keep in mind that the Kubernetes API does not have a `kind` named `List`.

`kind: List` is a client-side, internal implementation detail for processing
collections that might be of different kinds of object. Avoid depending on
`kind: List` in automation or other code.
-->
{{< note >}}
請記住，Kubernetes API 沒有名為 `List` 的 `kind`。

`kind: List` 是一個客戶端內部實現細節，用於處理可能屬於不同類別的物件的集合。
在自動化或其他程式碼中避免依賴 `kind: List`。
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

當你執行`kubectl get` 時，預設的輸出格式是特定資源型別的一個或多個例項的簡單表格形式。
過去，客戶端需要重複 `kubectl` 中所實現的表格輸出和描述輸出邏輯，以執行
簡單的物件列表操作。
該方法的一些限制包括處理某些物件時的不可忽視邏輯。
此外，API 聚合或第三方資源提供的型別在編譯時是未知的。
這意味著必須為客戶端無法識別的型別提供通用實現。

<!--
In order to avoid potential limitations as described above, clients may request
the Table representation of objects, delegating specific details of printing to the
server. The Kubernetes API implements standard HTTP content type negotiation: passing
an `Accept` header containing a value of `application/json;as=Table;g=meta.k8s.io;v=v1`
with a `GET` call will request that the server return objects in the Table content
type.

For example, list all of the pods on a cluster in the Table format.
-->
為了避免上述各種潛在的侷限性，客戶端可以請求伺服器端返回物件的表格（Table）
表現形式，從而將列印輸出的特定細節委託給伺服器。
Kubernetes API 實現標準的 HTTP 內容型別（Content Type）協商：為 `GET` 呼叫
傳入一個值為 `application/json;as=Table;g=meta.k8s.io;v=v1` 的 `Accept`
頭部即可請求伺服器以 Table 的內容型別返回物件。

例如，以 Table 格式列舉叢集中所有 Pods：

```console
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
對於在控制平面上不存在定製的 Table 定義的 API 資源型別而言，伺服器會返回
一個預設的 Table 響應，其中包含資源的 `name` 和 `creationTimestamp` 欄位。

```console
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
並非所有 API 資源型別都支援 Table 響應；
例如，{{< glossary_tooltip term_id="CustomResourceDefinition" text="CustomResourceDefinitions" >}} 可能沒有定義欄位到表的對映，
[擴充套件核心 Kubernetes API](/zh-cn/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/)
的 APIService 可能根本不提供 Table 響應。
如果你正在實現使用 Table 資訊並且必須針對所有資源型別（包括擴充套件）工作的客戶端，
你應該在 `Accept` 請求頭中指定多種內容型別的請求。例如：

```
Accept: application/json;as=Table;g=meta.k8s.io;v=v1, application/json
```

<!--
## Alternate representations of resources

By default, Kubernetes returns objects serialized to JSON with content type
`application/json`. This is the default serialization format for the API. However,
clients may request the more efficient
[Protobuf representation](#protobuf-encoding) of these objects for better performance at scale.
The Kubernetes API implements standard HTTP content type negotiation: passing an
`Accept` header with a `GET` call will request that the server tries to return
a response in your preferred media type, while sending an object in Protobuf to
the server for a `PUT` or `POST` call means that you must set the `Content-Type`
header appropriately.
-->
## 資源的其他表示形式  {#alternate-representations-of-resources}

預設情況下，Kubernetes 返回序列化為 JSON 的物件，內容型別為 `application/json`。
這是 API 的預設序列化格式。
但是，客戶端可能會使用更有效的 [Protobuf 表示](#protobuf-encoding) 請求這些物件，
以獲得更好的大規模效能。 Kubernetes API 實現標準的 HTTP 內容型別協商：
帶有 `Accept` 請求頭部的 `GET` 呼叫會請求伺服器嘗試以你的首選媒體型別返回響應，
而將 Protobuf 中的物件傳送到伺服器以進行 `PUT` 或 `POST` 呼叫意味著你必須適當地設定
`Content-Type` 請求頭。

<!--
The server will return a response with a `Content-Type` header if the requested
format is supported, or the `406 Not acceptable` error if none of the media types you
requested are supported. All built-in resource types support the `application/json`
media type.

See the Kubernetes [API reference](/docs/reference/kubernetes-api/) for a list of
supported content types for each API.

For example:
-->
如果支援請求的格式，伺服器將返回帶有 `Content-Type` 標頭的響應，
如果不支援你請求的媒體型別，則返回 `406 Not Acceptable` 錯誤。
所有內建資源型別都支援 `application/json` 媒體型別。

有關每個 API 支援的內容型別列表，請參閱 Kubernetes [API 參考](/zh-cn/docs/reference/kubernetes-api/)。

例如：

<!--
1. List all of the pods on a cluster in Protobuf format.
-->
1. 以 Protobuf 格式列舉叢集上的所有 Pods：

   ```console
   GET /api/v1/pods
   Accept: application/vnd.kubernetes.protobuf
   ---
   200 OK
   Content-Type: application/vnd.kubernetes.protobuf

   ... binary encoded PodList object
   ```

<!--
2. Create a pod by sending Protobuf encoded data to the server, but request a response in JSON.
-->
2. 透過向伺服器傳送 Protobuf 編碼的資料建立 Pod，但請求以 JSON 形式接收響應：

   ```console
   POST /api/v1/namespaces/test/pods
   Content-Type: application/vnd.kubernetes.protobuf
   Accept: application/json
   ... binary encoded Pod object
   ---
   200 OK
   Content-Type: application/json

   {
     "kind": "Pod",
     "apiVersion": "v1",
     ...
   }
   ```

<!--
Not all API resource types support Protobuf; specifically, Protobuf isn't available for
resources that are defined as
{{< glossary_tooltip term_id="CustomResourceDefinition" text="CustomResourceDefinitions" >}}
or are served via the
{{< glossary_tooltip text="aggregation layer" term_id="aggregation-layer" >}}.
As a client, if you might need to work with extension types you should specify multiple
content types in the request `Accept` header to support fallback to JSON.
For example:
-->
並非所有 API 資源型別都支援 Protobuf；具體來說，
Protobuf 不適用於定義為 {{< glossary_tooltip term_id="CustomResourceDefinition" text="CustomResourceDefinitions" >}} 
或透過{{< glossary_tooltip text="聚合層" term_id="aggregation-layer" >}}提供服務的資源。
作為客戶端，如果你可能需要使用擴充套件型別，則應在請求 `Accept` 請求頭中指定多種內容型別以支援回退到 JSON。
例如：

```console
Accept: application/vnd.kubernetes.protobuf, application/json
```

<!--
### Kubernetes Protobuf encoding {#protobuf-encoding}

Kubernetes uses an envelope wrapper to encode Protobuf responses. That wrapper starts
with a 4 byte magic number to help identify content in disk or in etcd as Protobuf
(as opposed to JSON), and then is followed by a Protobuf encoded wrapper message, which
describes the encoding and type of the underlying object and then contains the object.

The wrapper format is:
-->
### Kubernetes Protobuf encoding {#protobuf-encoding}

Kubernetes 使用封套形式來對 Protobuf 響應進行編碼。
封套外層由 4 個位元組的特殊數字開頭，便於從磁碟檔案或 etcd 中辯識 Protobuf
格式的（而不是 JSON）資料。
接下來存放的是 Protobuf 編碼的封套訊息，其中描述下層物件的編碼和型別，最後
才是物件本身。

封套格式如下：

<!--
```console
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
```console
四個位元組的特殊數字字首：
  位元組 0-3: "k8s\x00" [0x6b, 0x38, 0x73, 0x00]

使用下面 IDL 來編碼的 Protobuf 訊息：
  message Unknown {
    // typeMeta 應該包含 "kind" 和 "apiVersion" 的字串值，就像
    // 對應的 JSON 物件中所設定的那樣
    optional TypeMeta typeMeta = 1;

    // raw 中將儲存用 protobuf 序列化的完整物件。
    // 參閱客戶端庫中為指定 kind 所作的 protobuf 定義
    optional bytes raw = 2;

    // contentEncoding 用於 raw 資料的編碼格式。未設定此值意味著沒有特殊編碼。
    optional string contentEncoding = 3;

    // contentType 包含 raw 資料所採用的序列化方法。
    // 未設定此值意味著  application/vnd.kubernetes.protobuf，且通常被忽略
    optional string contentType = 4;
  }

  message TypeMeta {
    // apiVersion 是 type 對應的組名/版本
    optional string apiVersion = 1;
    // kind 是物件模式定義的名稱。此物件應該存在一個 protobuf 定義。
    optional string kind = 2;
  }
```

<!--
Clients that receive a response in `application/vnd.kubernetes.protobuf` that does
not match the expected prefix should reject the response, as future versions may need
to alter the serialization format in an incompatible way and will do so by changing
the prefix.
-->
{{< note >}}
收到 `application/vnd.kubernetes.protobuf` 格式響應的客戶端在響應與預期的字首
不匹配時應該拒絕響應，因為將來的版本可能需要以某種不相容的方式更改序列化格式，
並且這種更改是透過變更字首完成的。
{{< /note >}}

<!--
## Resource deletion

When you **delete** a resource this takes place in two phases.

1. _finalization_
2. removal
-->
## 資源刪除  {#resource-deletion}

當你 **delete** 資源時，操作將分兩個階段進行。

1. 終結（finalization）
2. 移除


```yaml
{
  "kind": "ConfigMap",
  "apiVersion": "v1",
  "metadata": {
    "finalizers": {"url.io/neat-finalization", "other-url.io/my-finalizer"},
    "deletionTimestamp": nil,
  }
}
```

<!--
When a client first sends a **delete** to request removal of a resource, the `.metadata.deletionTimestamp` is set to the current time.
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
當客戶端第一次傳送 **delete** 請求刪除資源時，`.metadata.deletionTimestamp` 設定為當前時間。
一旦設定了 `.metadata.deletionTimestamp`，
作用於終結器的外部控制器可以在任何時間以任何順序開始執行它們的清理工作。

終結器之間 **不存在** 強制的執行順序，因為這會帶來卡住 `.metadata.finalizers` 的重大風險。

`.metadata.finalizers` 欄位是共享的：任何有許可權的參與者都可以重新排序。
如果終結器列表是按順序處理的，那麼這可能會導致這樣一種情況：
在列表中負責第一個終結器的元件正在等待列表中稍後負責終結器的元件產生的某些訊號
（欄位值、外部系統或其他），從而導致死鎖。

如果沒有強制排序，終結者可以在它們之間自由排序，並且不易受到列表中排序變化的影響。

當最後一個終結器也被移除時，資源才真正從 etcd 中移除。

<!--
## Single resource API

The Kubernetes API verbs **get**, **create**, **apply**, **update**, **patch**,
**delete** and **proxy** support single resources only.
These verbs with single resource support have no support for submitting multiple
resources together in an ordered or unordered list or transaction.

When clients (including kubectl) act on a set of resources, the client makes a series
of single-resource API requests, then aggregates the responses if needed.

By contrast, the Kubernetes API verbs **list** and **watch** allow getting multiple
resources, and **deletecollection** allows deleting multiple resources.
-->
## 單個資源 API  {#single-resource-api}

Kubernetes API 動詞 **get**、**create**、**apply**、**update**、**patch**、**delete** 和 **proxy** 僅支援單一資源。
這些具有單一資源支援的動詞不支援在有序或無序列表或事務中一起提交多個資源。

當客戶端（包括 kubectl）對一組資源進行操作時，客戶端會發出一系列單資源 API 請求，
然後在需要時聚合響應。

相比之下，Kubernetes API 動詞 **list** 和 **watch** 允許獲取多個資源，
而 **deletecollection** 允許刪除多個資源。

<!--
## Dry-run
-->
## 試執行  {#dry-run}

{{< feature-state for_k8s_version="v1.18" state="stable" >}}

<!--
When you use HTTP verbs that can modify resources (`POST`, `PUT`, `PATCH`, and
`DELETE`), you can submit your request in a _dry run_ mode. Dry run mode helps to
evaluate a request through the typical request stages (admission chain, validation,
merge conflicts) up until persisting objects to storage. The response body for the
request is as close as possible to a non-dry-run response. Kubernetes guarantees that
dry-run requests will not be persisted in storage or have any other side effects.
-->
當你使用可以修改資源的 HTTP 動詞（`POST`、`PUT`、`PATCH` 和 `DELETE`）時，
你可以在 _試執行（dry run）_ 模式下提交你的請求。
試執行模式有助於透過典型的請求階段（准入鏈、驗證、合併衝突）評估請求，直到將物件持久化到儲存中。
請求的響應正文儘可能接近非試執行響應。Kubernetes 保證試執行請求不會被持久化儲存或產生任何其他副作用。

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
### 發起試執行請求  {#make-a-dry-run-request}

透過設定 `dryRun` 查詢引數觸發試執行。此引數是一個字串，用作列舉，唯一可接受的值是：

[未設定值]
: 允許副作用。你可以使用 `?dryRun` 或 `?dryRun&pretty=true` 之類的查詢字串請求此操作。
  響應是最終會被持久化的物件，或者如果請求不能被滿足則會出現一個錯誤。

`All`
: 每個階段都正常執行，除了防止副作用的最終儲存階段。

<!--
When you set `?dryRun=All`, any relevant
{{< glossary_tooltip text="admission controllers" term_id="admission-controller" >}}
are run, validating admission controllers check the request post-mutation, merge is
performed on `PATCH`, fields are defaulted, and schema validation occurs. The changes
are not persisted to the underlying storage, but the final object which would have
been persisted is still returned to the user, along with the normal status code.
-->
當你設定 `?dryRun=All` 時，將執行任何相關的{{< glossary_tooltip text="准入控制器" term_id="admission-controller" >}}，
驗證准入控制器檢查經過變更的請求，針對 `PATCH` 請求執行合併、設定欄位預設值等操作，並進行模式驗證。
更改不會持久化到底層儲存，但本應持久化的最終物件仍會與正常狀態程式碼一起返回給使用者。

<!--
If the non-dry-run version of a request would trigger an admission controller that has
side effects, the request will be failed rather than risk an unwanted side effect. All
built in admission control plugins support dry-run. Additionally, admission webhooks can
declare in their
[configuration object](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#webhook-v1beta1-admissionregistration-k8s-io)
that they do not have side effects, by setting their `sideEffects` field to `None`.
-->
如果請求的非試執行版本會觸發具有副作用的准入控制器，則該請求將失敗，而不是冒不希望的副作用的風險。
所有內建准入控制外掛都支援試執行。
此外，准入 Webhook 還可以設定[配置物件](/zh-cn/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#webhook-v1beta1-admissionregistration-k8s-io)
的 `sideEffects` 欄位為 `None`，藉此宣告它們沒有副作用。

<!--
If a webhook actually does have side effects, then the `sideEffects` field should be
set to "NoneOnDryRun". That change is appropriate provided that the webhook is also
be modified to understand the `DryRun` field in AdmissionReview, and to prevent side
effects on any request marked as dry runs.
-->
{{< note >}}
如果 webhook 確實有副作用，則應該將 `sideEffects` 欄位設定為 “NoneOnDryRun”。
如果還修改了 webhook 以理解 AdmissionReview 中的 DryRun 欄位，
並防止對標記為試執行的任何請求產生副作用，則該更改是適當的。
{{< /note >}}

<!--
Here is an example dry-run request that uses `?dryRun=All`:
-->
這是一個使用 `?dryRun=All` 的試執行請求的示例：

```console
POST /api/v1/namespaces/test/pods?dryRun=All
Content-Type: application/json
Accept: application/json
```

<!--
The response would look the same as for non-dry-run request, but the values of some
generated fields may differ.
-->
響應會與非試執行模式請求的響應看起來相同，只是某些生成欄位的值可能會不同。

<!--
### Generated values

Some values of an object are typically generated before the object is persisted. It is important not to rely upon the values of these fields set by a dry-run request, since these values will likely be different in dry-run mode from when the real request is made. Some of these fields are:

* `name`: if `generateName` is set, `name` will have a unique random name
* `creationTimestamp` / `deletionTimestamp`: records the time of creation/deletion
* `UID`: [uniquely identifies](/docs/concepts/overview/working-with-objects/names/#uids) the object and is randomly generated (non-deterministic)
* `resourceVersion`: tracks the persisted version of the object
* Any field set by a mutating admission controller
* For the `Service` resource: Ports or IP addresses that the kube-apiserver assigns to Service objects
-->
### 生成值  {#generated-values}

物件的某些值通常是在物件被寫入資料庫之前生成的。很重要的一點是不要依賴試執行
請求為這些欄位所設定的值，因為試執行模式下所得到的這些值與真實請求所獲得的
值很可能不同。這類欄位有：

* `name`：如果設定了 `generateName` 欄位，則 `name` 會獲得一個唯一的隨機名稱
* `creationTimestamp` / `deletionTimestamp`：記錄物件的建立/刪除時間
* `UID`：[唯一標識](/zh-cn/docs/concepts/overview/working-with-objects/names/#uids)物件，
  取值隨機生成（非確定性）
* `resourceVersion`： 跟蹤物件的持久化（儲存）版本
* 變更性准入控制器所設定的欄位
* 對於 `Service` 資源：`kube-apiserver` 為 `Service` 物件分配的埠和 IP 地址

<!--
### Dry-run authorization

Authorization for dry-run and non-dry-run requests is identical. Thus, to make
a dry-run request, you must be authorized to make the non-dry-run request.

For example, to run a dry-run **patch** for a Deployment, you must be authorized
to perform that **patch**. Here is an example of a rule for Kubernetes
{{< glossary_tooltip text="RBAC" term_id="rbac">}} that allows patching
Deployments:
-->
### 試執行的授權    {#dry-run-authorization}

試執行和非試執行請求的鑑權是完全相同的。因此，要發起一個試執行請求，
你必須被授權執行非試執行請求。

例如，要在 Deployment 物件上試執行 **patch** 操作，你必須具有對 Deployment 執行 **patch** 操作的訪問許可權，
如下面的 {{< glossary_tooltip text="RBAC" term_id="rbac">}} 規則所示：

```yaml
rules:
- apiGroups: ["extensions", "apps"]
  resources: ["deployments"]
  verbs: ["patch"]
```

<!--
See [Authorization Overview](/docs/reference/access-authn-authz/authorization/).
-->
參閱[鑑權概述](/zh-cn/docs/reference/access-authn-authz/authorization/)以瞭解鑑權細節。

<!--
## Server Side Apply
-->
## 伺服器端應用  {#server-side-apply}

<!--
Kubernetes' [Server Side Apply](/docs/reference/using-api/server-side-apply/)
feature allows the control plane to track managed fields for newly created objects.
Server Side Apply provides a clear pattern for managing field conflicts,
offers server-side `Apply` and `Update` operations, and replaces the
client-side functionality of `kubectl apply`.

The API verb for Server-Side Apply is **apply**.
See [Server Side Apply](/docs/reference/using-api/server-side-apply/) for more details.
-->
Kubernetes 的[伺服器端應用](/zh-cn/docs/reference/using-api/server-side-apply/)功能允許控制平面跟蹤新建立物件的託管欄位。
服務端應用為管理欄位衝突提供了清晰的模式，提供了伺服器端 `Apply` 和 `Update` 操作，
並替換了 `kubectl apply` 的客戶端功能。

服務端應用的 API 動詞是 **apply**。有關詳細資訊，
請參閱[伺服器端應用](/zh-cn/docs/reference/using-api/server-side-apply/)。

<!--
## Resource Versions

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

資源版本是標識伺服器內部物件版本的字串。
客戶端可以使用資源版本來確定物件何時更改，
或者在獲取、列出和監視資源時表達資料一致性要求。
資源版本必須被客戶端視為不透明的，並且未經修改地傳回伺服器。

你不能假設資源版本是數字的或可排序的。
API 客戶端只能比較兩個資源版本的相等性（這意味著你不能比較資源版本的大於或小於關係）。

<!--
### `resourceVersion` fields in metadata {#resourceversion-in-metadata}

Clients find resource versions in resources, including the resources from the response
stream for a **watch**, or when using **list** to enumerate resources.

[v1.meta/ObjectMeta](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#objectmeta-v1-meta) - The `metadata.resourceVersion` of a resource instance identifies the resource version the instance was last modified at.

[v1.meta/ListMeta](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#listmeta-v1-meta) - The `metadata.resourceVersion` of a resource collection (the response to a **list**) identifies the resource version at which the collection was constructed.
-->
### metadata 中的 `resourceVersion`  {#resourceVersion-in-metadata}

客戶端在資源中查詢資源版本，這些資源包括來自用於 **watch** 的響應流資源，或者使用 **list** 列舉的資源。

[v1.meta/ObjectMeta](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#objectmeta-v1-meta) - 資源
的 `metadata.resourceVersion` 值標明該例項上次被更改時的資源版本。

[v1.meta/ListMeta](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#listmeta-v1-meta) - 資源集合
即 **list** 操作的響應）的 `metadata.resourceVersion` 所標明的是 list
響應被構造時的資源版本。

<!--
### `resourceVersion` parameters in query strings {#the-resourceversion-parameter}

The **get**, **list**, and **watch** operations support the `resourceVersion` parameter.
From version v1.19, Kubernetes API servers also support the `resourceVersionMatch`
parameter on _list_ requests.

The API server interprets the `resourceVersion` parameter differently depending
on the operation you request, and on the value of `resourceVersion`. If you set
`resourceVersionMatch` then this also affects the way matching happens.
-->
### 查詢字串中的 `resourceVersion` 引數   {#the-resourceversion-parameter}

**get**、**list** 和 **watch** 操作支援 `resourceVersion` 引數。
從 v1.19 版本開始，Kubernetes API 伺服器支援 **list** 請求的 `resourceVersionMatch` 引數。

API 伺服器根據你請求的操作和 `resourceVersion` 的值對 `resourceVersion` 引數進行不同的解釋。
如果你設定 `resourceVersionMatch` 那麼這也會影響匹配發生的方式。


<!--
### Semantics for **get** and **list**

For **get** and **list**, the semantics of `resourceVersion` are:

-->
### **get** 和 **list** 語義

對於 **get** 和 **list** 而言，`resourceVersion`的語義為：

**get:**

<!--
| resourceVersion unset | resourceVersion="0" | resourceVersion="{value other than 0}" |
|-----------------------|---------------------|----------------------------------------|
| Most Recent           | Any                 | Not older than                         |
-->
| resourceVersion 未設定 | resourceVersion="0" | resourceVersion="\<非零值\>" |
|-----------------------|---------------------|----------------------------------------|
| 最新版本               | 任何版本            | 不老於給定版本                         |


**list:**

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
從 v1.19 版本開始，Kubernetes API 伺服器支援 **list** 請求的 `resourceVersionMatch` 引數。
如果同時設定 `resourceVersion` 和 `resourceVersionMatch`，
則 `resourceVersionMatch` 引數確定 API 伺服器如何解釋 `resourceVersion`。

在 **list** 請求上設定 `resourceVersion` 時，你應該始終設定 `resourceVersionMatch` 引數。
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
除非你對一致性有著非常強烈的需求，使用 `resourceVersionMatch=NotOlderThan`
同時為 `resourceVersion` 設定一個已知值是優選的互動方式，因為與不設定
`resourceVersion` 和 `resourceVersionMatch` 相比，這種配置可以取得更好的
叢集效能和可擴縮性。後者需要提供帶票選能力的讀操作。

設定 `resourceVersionMatch` 引數而不設定 `resourceVersion` 引數是不合法的。

下表解釋了具有各種 `resourceVersion` 和 `resourceVersionMatch` 組合的 **list** 請求的行為：
<!--
| resourceVersionMatch param            | paging params                 | resourceVersion not set | resourceVersion="0"                       | resourceVersion="{value other than 0}" |
|---------------------------------------|-------------------------------|-----------------------|-------------------------------------------|----------------------------------------|
| _unset_            | _limit unset_                   | Most Recent           | Any                                       | Not older than                         |
| _unset_            | limit=\<n\>, _continue unset_     | Most Recent           | Any                                       | Exact                                  |
| _unset_            | limit=\<n\>, continue=\<token\> | Continue Token, Exact | Invalid, treated as Continue Token, Exact | Invalid, HTTP `400 Bad Request`        |
| `resourceVersionMatch=Exact`        | _limit unset_                 | Invalid               | Invalid                                   | Exact                                  |
| `resourceVersionMatch=Exact`        | limit=\<n\>, _continue unset_ | Invalid               | Invalid                                   | Exact                                  |
| `resourceVersionMatch=NotOlderThan` | _limit unset_                 | Invalid               | Any                                       | Not older than                         |
| `resourceVersionMatch=NotOlderThan` | limit=\<n\>, _continue unset_ | Invalid               | Any                                       | Not older than                         |

{{</* /table */>}}
-->

{{< table caption="list 操作的 resourceVersionMatch 與分頁引數" >}}

| resourceVersionMatch 引數               | 分頁引數                        | resourceVersion 未設定  | resourceVersion="0"                     | resourceVersion="\<非零值\>"     |
|-----------------------------------------|---------------------------------|-------------------------|-----------------------------------------|----------------------------------|
| _未設定_             | _limit 未設定_                      | 最新版本                | 任意版本                                | 不老於指定版本                   |
| _未設定_             | limit=\<n\>, _continue 未設定_        | 最新版本                | 任意版本                                | 精確匹配                         |
| _未設定_            | limit=\<n\>, continue=\<token\>     | 從 token 開始、精確匹配 | 非法請求，視為從 token 開始、精確匹配  | 非法請求，返回 HTTP `400 Bad Request` |
| `resourceVersionMatch=Exact` [1]         | _limit 未設定_                      | 非法請求                | 非法請求                                | 精確匹配                         |
| `resourceVersionMatch=Exact` [1]         | limit=\<n\>, _continue 未設定_        | 非法請求                | 非法請求                                | 精確匹配                         |
| `resourceVersionMatch=NotOlderThan` [1]  | _limit 未設定_             | 非法請求                | 任意版本                                | 不老於指定版本                   |
| `resourceVersionMatch=NotOlderThan` [1]  | limit=\<n\>, _continue 未設定_ | 非法請求                | 任意版本                                | 不老於指定版本                   |

{{< /table >}}

<!--
If your cluster's API server does not honor the `resourceVersionMatch` parameter,
the behavior is the same as if you did not set it.
-->
{{< note >}}
如果你的叢集的 API 伺服器不支援 `resourceVersionMatch` 引數，
則行為與你未設定它時相同。
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

Most recent
: Return data at the most recent resource version. The returned data must be
  consistent (in detail: served from etcd via a quorum read).
-->
任意版本
: 返回任何資源版本的資料。最新可用資源版本優先，但不需要強一致性；
  可以提供任何資源版本的資料。由於分割槽或過時的快取，
  請求可能返回客戶端先前觀察到的更舊資源版本的資料，特別是在高可用性配置中。
  不能容忍這種情況的客戶不應該使用這種語義。

最新版本
: 返回最新資源版本的資料。
  返回的資料必須一致（詳細說明：透過仲裁讀取從 etcd 提供）。


<!--
Not older than
: Return data at least as new as the provided `resourceVersion`. The newest
  available data is preferred, but any data not older than the provided `resourceVersion` may be
  served.  For **list** requests to servers that honor the `resourceVersionMatch` parameter, this
  guarantees that the collection's `.metadata.resourceVersion` is not older than the requested
  `resourceVersion`, but does not make any guarantee about the `.metadata.resourceVersion` of any
  of the items in that collection.
-->

不老於指定版本
: 返回資料至少與提供的 `resourceVersion` 一樣新。
  最新的可用資料是首選，但可以提供不早於提供的 `resourceVersion` 的任何資料。
  對於對遵守 `resourceVersionMatch` 引數的伺服器的 **list** 請求，
  這保證了集合的 `.metadata.resourceVersion` 不早於請求的 `resourceVersion`，
  但不保證該集合中任何專案的 `.metadata.resourceVersion`。

<!--
Exact
: Return data at the exact resource version provided. If the provided `resourceVersion` is
  unavailable, the server responds with HTTP 410 "Gone".  For **list** requests to servers that honor the
  `resourceVersionMatch` parameter, this guarantees that the collection's `.metadata.resourceVersion`
  is the same as the `resourceVersion` you requested in the query string. That guarantee does
  not apply to the `.metadata.resourceVersion` of any items within that collection.

Continue Token, Exact
: Return data at the resource version of the initial paginated **list** call. The returned _continue
  tokens_ are responsible for keeping track of the initially provided resource version for all paginated
  **list** calls after the initial paginated **list**.
-->

精確匹配
: 以提供的確切資源版本返回資料。如果提供的 `resourceVersion` 不可用，
  則伺服器以 HTTP 410 “Gone”響應。對於對支援 `resourceVersionMatch` 引數的伺服器的 **list** 請求，
  這可以保證集合的 `.metadata.resourceVersion` 與你在查詢字串中請求的 `resourceVersion` 相同。
  該保證不適用於該集合中任何專案的 `.metadata.resourceVersion`。

從 token 開始、精確匹配
: 返回初始分頁 **list** 呼叫的資源版本的資料。
  返回的 _Continue 令牌_ 負責跟蹤最初提供的資源版本，最初提供的資源版本用於在初始分頁 **list** 之後的所有分頁 **list** 中。

<!--
When you **list** resources and receive a collection response, the response includes the
[metadata](/docs/reference/generated/kubernetes-api/v1.21/#listmeta-v1-meta) of the collection as
well as [object metadata](/docs/reference/generated/kubernetes-api/v1.21/#listmeta-v1-meta)
for each item in that collection. For individual objects found within a collection response,
`.metadata.resourceVersion` tracks when that object was last updated, and not how up-to-date
the object is when served.
-->

{{< note >}}
當你 **list** 資源並收到集合響應時，
響應包括集合的[元資料](/zh-cn/docs/reference/generated/kubernetes-api/v1.21/#listmeta-v1-meta)
以及該集合中每個專案的[物件元資料](/zh-cn/docs/reference/generated/kubernetes-api/v1.21/#listmeta-v1-meta)。
對於在集合響應中找到的單個物件，`.metadata.resourceVersion` 跟蹤該物件的最後更新時間，
而不是物件在服務時的最新程度。
{{< /note >}}

<!--
When using `resourceVersionMatch=NotOlderThan` and limit is set, clients must
handle HTTP 410 "Gone" responses. For example, the client might retry with a
newer `resourceVersion` or fall back to `resourceVersion=""`.

When using `resourceVersionMatch=Exact` and `limit` is unset, clients must
verify that the collection's `.metadata.resourceVersion` matches
the requested `resourceVersion`, and handle the case where it does not. For
example, the client might fall back to a request with `limit` set.
-->

當使用 `resourceVersionMatch=NotOlderThan` 並設定了限制時，
客戶端必須處理 HTTP 410 “Gone” 響應。
例如，客戶端可能會使用更新的 `resourceVersion` 重試或回退到 `resourceVersion=""`。

當使用 `resourceVersionMatch=Exact` 並且未設定限制時，
客戶端必須驗證集合的 `.metadata.resourceVersion` 是否與請求的 `resourceVersion` 匹配，
並處理不匹配的情況。例如，客戶端可能會退回到設定了限制的請求。


<!--
### Semantics for **watch**

For watch, the semantics of resource version are:
-->
### **watch** 語義

對於 watch 操作而言，資源版本的語義如下：

**watch：**

<!--
{{< table caption="resourceVersion for watch" >}}

| resourceVersion unset               | resourceVersion="0"        | resourceVersion="{value other than 0}" |
|-------------------------------------|----------------------------|----------------------------------------|
| Get State and Start at Most Recent  | Get State and Start at Any | Start at Exact                         |

{{< /table >}}
-->

{{< table caption="watch 操作的 resourceVersion 設定" >}}

| resourceVersion 未設定    | resourceVersion="0"      | resourceVersion="\<非零值\>" |
|---------------------------|--------------------------|------------------------------|
| 讀取狀態並從最新版本開始  | 讀取狀態並從任意版本開始 | 從指定版本開始               |

{{< /table >}}

<!--
The meaning of the **watch** semantics are:

Get State and Start at Any
: {{< caution >}} Watches initialized this way may return arbitrarily stale
  data. Please review this semantic before using it, and favor the other semantics
  where possible.
  {{< /caution >}}
  Start a **watch** at any resource version; the most recent resource version
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
: {{< caution >}}
  以這種方式初始化的監視可能會返回任意陳舊的資料。
  請在使用之前檢視此語義，並儘可能支援其他語義。
  {{< /caution >}}
  在任何資源版本開始 **watch**；首選可用的最新資源版本，但不是必需的。允許任何起始資源版本。
  由於分割槽或過時的快取，**watch** 可能從客戶端之前觀察到的更舊的資源版本開始，
  特別是在高可用性配置中。不能容忍這種明顯倒帶的客戶不應該用這種語義啟動 **watch**。
  為了建立初始狀態，**watch** 從起始資源版本中存在的所有資源例項的合成 “新增” 事件開始。
  以下所有監視事件都針對在 **watch** 開始的資源版本之後發生的所有更改。

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
  它必須是一致的（詳細說明：透過仲裁讀取從 etcd 提供服務）。
  為了建立初始狀態，**watch** 從起始資源版本中存在的所有資源例項的合成 “新增” 事件開始。
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
: 以確切的資源版本開始 **watcH**。監視事件適用於提供的資源版本之後的所有更改。
  與 “Get State and Start at Most Recent” 和 “Get State and Start at Any” 不同，
  **watch** 不會以所提供資源版本的合成 “新增” 事件啟動。
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
參閱[高效檢測變更](#efficient-detection-of-changes)以瞭解如何在監測資源時
處理 `410 (Gone)` 響應。

如果所請求的 `resourceVersion` 超出了可應用的 `limit`，那麼取決於請求是否
是透過快取記憶體來滿足的，API 伺服器可能會返回一個 `410 Gone` HTTP 響應。

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
kube-apiserver additionally identifies its error responses with a "Too large resource
version" message.

If you make a **watch** request for an unrecognized resource version, the API server
may wait indefinitely (until the request timeout) for the resource version to become
available.
-->
如果你請求 API 伺服器無法識別的資源版本，
kube-apiserver 還會使用 “Too large resource version” 訊息額外標識其錯誤響應。

如果你對無法識別的資源版本發出 **watch** 請求，
API 伺服器可能會無限期地等待（直到請求超時）資源版本變為可用。
