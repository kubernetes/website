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
fine grained authorization (such as separate views for Pod details and
log retrievals), and can accept and serve those resources in different
representations for convenience or efficiency.
-->
Kubernetes API 是通过 HTTP 提供的基于资源 (RESTful) 的编程接口。
它支持通过标准 HTTP 动词（POST、PUT、PATCH、DELETE、GET）检索、创建、更新和删除主要资源。

对于某些资源，API 包括额外的子资源，允许细粒度授权（例如：将 Pod 的详细信息与检索日志分开），
为了方便或者提高效率，可以以不同的表示形式接受和服务这些资源。

<!--
Kubernetes supports efficient change notifications on resources via *watches*.
Kubernetes also provides consistent list operations so that API clients can
effectively cache, track, and synchronize the state of resources.

You can view the [API reference](/docs/reference/kubernetes-api/) online,
or read on to learn about the API in general.
-->
Kubernetes 支持通过 **watch** 实现高效的资源变更通知。
Kubernetes 还提供了一致的列表操作，以便 API 客户端可以有效地缓存、跟踪和同步资源的状态。

你可以在线查看 [API 参考](/zh-cn/docs/reference/kubernetes-api/)，
或继续阅读以了解 API 的一般信息。

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
## Kubernetes API 术语  {#standard-api-terminology}

Kubernetes 通常使用常见的 RESTful 术语来描述 API 概念：
* **资源类型（Resource Type）** 是 URL 中使用的名称（`pods`、`namespaces`、`services`）
* 所有资源类型都有一个具体的表示（它们的对象模式），称为 **类别（Kind）**
* 资源类型的实例的列表称为 **集合（Collection）**
* 资源类型的单个实例称为 **资源（Resource）**，通常也表示一个 **对象（Object）**
* 对于某些资源类型，API 包含一个或多个 **子资源（sub-resources）**，这些子资源表示为资源下的 URI 路径

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
大多数 Kubernetes API
资源类型都是[对象](/zh-cn/docs/concepts/overview/working-with-objects/kubernetes-objects/#kubernetes-objects)：
它们代表集群上某个概念的具体实例，例如 Pod 或名字空间。
少数 API 资源类型是 “虚拟的”，它们通常代表的是操作而非对象本身，
例如权限检查（使用带有 JSON 编码的 `SubjectAccessReview` 主体的 POST 到 `subjectaccessreviews` 资源），
或 Pod 的子资源 `eviction`（用于触发 [API-发起的驱逐](/zh-cn/docs/concepts/scheduling-eviction/api-eviction/)）。

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

### 对象名字 {#object-names}

你可以通过 API 创建的所有对象都有一个唯一的{{< glossary_tooltip text="名字" term_id="name" >}}，
以允许幂等创建和检索，
但如果虚拟资源类型不可检索或不依赖幂等性，则它们可能没有唯一名称。
在{{< glossary_tooltip text="名字空间" term_id="namespace" >}}内，
同一时刻只能有一个给定类别的对象具有给定名称。
但是，如果你删除该对象，你可以创建一个具有相同名称的新对象。
有些对象没有名字空间（例如：节点），因此它们的名称在整个集群中必须是唯一的。

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
### API 动词 {#api-verbs}

几乎所有对象资源类型都支持标准 HTTP 动词 - GET、POST、PUT、PATCH 和 DELETE。
Kubernetes 也使用自己的动词，这些动词通常写成小写，以区别于 HTTP 动词。

Kubernetes 使用术语 **list** 来描述返回资源[集合](#collections)，
以区别于通常称为 **get** 的单个资源检索。
如果你发送带有 `?watch` 查询参数的 HTTP GET 请求，
Kubernetes 将其称为 **watch** 而不是 **get**（有关详细信息，请参阅[快速检测更改](#efficient-detection-of-changes)）。

对于 PUT 请求，Kubernetes 在内部根据现有对象的状态将它们分类为 **create** 或 **update**。
**update** 不同于 **patch**；**patch** 的 HTTP 动词是 PATCH。

<!--
## Resource URIs

All resource types are either scoped by the cluster (`/apis/GROUP/VERSION/*`) or to a
namespace (`/apis/GROUP/VERSION/namespaces/NAMESPACE/*`). A namespace-scoped resource
type will be deleted when its namespace is deleted and access to that resource type
is controlled by authorization checks on the namespace scope.

Note: core resources use `/api` instead of `/apis` and omit the GROUP path segment.

Examples:
-->
## 资源 URI {#resource-uris}

所有资源类型要么是集群作用域的（`/apis/GROUP/VERSION/*`），
要么是名字空间作用域的（`/apis/GROUP/VERSION/namespaces/NAMESPACE/*`）。
名字空间作用域的资源类型会在其名字空间被删除时也被删除，
并且对该资源类型的访问是由定义在名字空间域中的授权检查来控制的。

注意： 核心资源使用 `/api` 而不是 `/apis`，并且不包含 GROUP 路径段。

例如:
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

* Namespace-scoped resources:

  * `GET /apis/GROUP/VERSION/RESOURCETYPE` - return the collection of all instances of the resource type across all namespaces
  * `GET /apis/GROUP/VERSION/namespaces/NAMESPACE/RESOURCETYPE` - return collection of all instances of the resource type in NAMESPACE
  * `GET /apis/GROUP/VERSION/namespaces/NAMESPACE/RESOURCETYPE/NAME` - return the instance of the resource type with NAME in NAMESPACE
-->
你还可以访问资源集合（例如：列出所有 Node）。以下路径用于检索集合和资源：

* 集群作用域的资源：
  * `GET /apis/GROUP/VERSION/RESOURCETYPE` - 返回指定资源类型的资源的集合
  * `GET /apis/GROUP/VERSION/RESOURCETYPE/NAME` - 返回指定资源类型下名称为 NAME 的资源
* 名字空间作用域的资源：
  * `GET /apis/GROUP/VERSION/RESOURCETYPE` - 返回所有名字空间中指定资源类型的全部实例的集合
  * `GET /apis/GROUP/VERSION/namespaces/NAMESPACE/RESOURCETYPE` - 返回名字空间 NAMESPACE 内给定资源类型的全部实例的集合
  * `GET /apis/GROUP/VERSION/namespaces/NAMESPACE/RESOURCETYPE/NAME` - 返回名字空间 NAMESPACE 中给定资源类型的名称为 NAME 的实例

<!--
Since a namespace is a cluster-scoped resource type, you can retrieve the list
(“collection”) of all namespaces with `GET /api/v1/namespaces` and details about
a particular namespace with `GET /api/v1/namespaces/NAME`.
-->
由于名字空间本身是一个集群作用域的资源类型，你可以通过 `GET /api/v1/namespaces/`
检视所有名字空间的列表（“集合”），使用 `GET /api/v1/namespaces/NAME` 查看特定名字空间的详细信息。

<!--
* Cluster-scoped subresource: `GET /apis/GROUP/VERSION/RESOURCETYPE/NAME/SUBRESOURCE`
* Namespace-scoped subresource: `GET /apis/GROUP/VERSION/namespaces/NAMESPACE/RESOURCETYPE/NAME/SUBRESOURCE`

The verbs supported for each subresource will differ depending on the object -
see the [API reference](/docs/reference/kubernetes-api/) for more information. It
is not possible to access sub-resources across multiple resources - generally a new
virtual resource type would be used if that becomes necessary.
-->
* 集群作用域的子资源：`GET /apis/GROUP/VERSION/RESOURCETYPE/NAME/SUBRESOURCE`
* 名字空间作用域的子资源：`GET /apis/GROUP/VERSION/namespaces/NAMESPACE/RESOURCETYPE/NAME/SUBRESOURCE`

取决于对象是什么，每个子资源所支持的动词有所不同 - 参见 [API 文档](/zh-cn/docs/reference/kubernetes-api/)以了解更多信息。
跨多个资源来访问其子资源是不可能的 - 如果需要这一能力，则通常意味着需要一种新的虚拟资源类型了。

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
## 高效检测变更  {#efficient-detection-of-changes}

Kubernetes API 允许客户端对对象或集合发出初始请求，然后跟踪自该初始请求以来的更改：**watch**。
客户端可以发送 **list** 或者 **get** 请求，然后发出后续 **watch** 请求。

为了使这种更改跟踪成为可能，每个 Kubernetes 对象都有一个 `resourceVersion` 字段，
表示存储在底层持久层中的该资源的版本。在检索资源集合（名字空间或集群范围）时，
来自 API 服务器的响应包含一个 `resourceVersion` 值。
客户端可以使用该 `resourceVersion` 来启动对 API 服务器的 **watch**。

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
当你发送 **watch** 请求时，API 服务器会响应更改流。
这些更改逐项列出了在你指定为 **watch** 请求参数的 `resourceVersion` 之后发生的操作
（例如 **create**、**delete** 和 **update**）的结果。
整个 **watch** 机制允许客户端获取当前状态，然后订阅后续更改，而不会丢失任何事件。

如果客户端 **watch** 连接断开，则该客户端可以从最后返回的 `resourceVersion` 开始新的 **watch** 请求；
客户端还可以执行新的 **get**/**list** 请求并重新开始。有关更多详细信息，请参阅[资源版本语义](#resource-versions)。

例如：

<!--
1. List all of the pods in a given namespace.
-->
1. 列举给定名字空间中的所有 Pod：

   ```
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
2. 从资源版本 10245 开始，接收影响 **test** 名字空间中 Pod 的所有 API 操作
   （例如 **create**、**delete**、**patch** 或 **update**）的通知。
   每个更改通知都是一个 JSON 文档。
   HTTP 响应正文（用作 `application/json`）由一系列 JSON 文档组成。

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
给定的 Kubernetes 服务器只会保留一定的时间内发生的历史变更列表。
使用 etcd3 的集群默认保存过去 5 分钟内发生的变更。
当所请求的 **watch** 操作因为资源的历史版本不存在而失败，
客户端必须能够处理因此而返回的状态代码 `410 Gone`，清空其本地的缓存，
重新执行 **get** 或者 **list** 操作，
并基于新返回的 `resourceVersion` 来开始新的 **watch** 操作。

对于订阅集合，Kubernetes 客户端库通常会为 **list** -然后- **watch** 的逻辑提供某种形式的标准工具。
（在 Go 客户端库中，这称为 `反射器（Reflector）`，位于 `k8s.io/client-go/tools/cache` 包中。）

<!--
### Watch bookmarks

To mitigate the impact of short history window, the Kubernetes API provides a watch
event named `BOOKMARK`. It is a special kind of event to mark that all changes up
to a given `resourceVersion` the client is requesting have already been sent. The
document representing the `BOOKMARK` event is of the type requested by the request,
but only includes a `.metadata.resourceVersion` field. For example:
-->
### 监视书签  {#Watch-bookmark}

为了减轻短历史窗口的影响，Kubernetes API 提供了一个名为 `BOOKMARK` 的监视事件。
这是一种特殊的事件，用于标记客户端请求的给定 `resourceVersion` 的所有更改都已发送。
代表 `BOOKMARK` 事件的文档属于请求所请求的类型，但仅包含一个 `.metadata.resourceVersion` 字段。例如：

```
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
作为客户端，你可以在 **watch** 请求中设置 `allowWatchBookmarks=true` 查询参数来请求 `BOOKMARK` 事件，
但你不应假设书签会在任何特定时间间隔返回，即使要求时，客户端也不能假设 API 服务器会发送任何 `BOOKMARK` 事件。

<!--
## Streaming lists
-->
## 流式列表  {#streaming-lists}

{{< feature-state feature_gate_name="WatchList" >}}

<!--
On large clusters, retrieving the collection of some resource types may result in
a significant increase of resource usage (primarily RAM) on the control plane.
In order to alleviate its impact and simplify the user experience of the **list** + **watch**
pattern, Kubernetes v1.27 introduces as an alpha feature the support
for requesting the initial state (previously requested via the **list** request) as part of
the **watch** request.
-->
在大型集群检索某些资源类型的集合可能会导致控制平面的资源使用量（主要是 RAM）显著增加。
为了减轻其影响并简化 **list** + **watch** 模式的用户体验，
Kubernetes 1.27 版本引入了一个 alpha 功能，支持在 **watch** 请求中请求初始状态
（之前在 **list** 请求中请求）。

<!--
Provided that the `WatchList` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
is enabled, this can be achieved by specifying `sendInitialEvents=true` as query string parameter
in a **watch** request. If set, the API server starts the watch stream with synthetic init
events (of type `ADDED`) to build the whole state of all existing objects followed by a
[`BOOKMARK` event](/docs/reference/using-api/api-concepts/#watch-bookmarks)
(if requested via `allowWatchBookmarks=true` option). The bookmark event includes the resource version
to which is synced. After sending the bookmark event, the API server continues as for any other **watch**
request.
-->
如果启用了 `WatchList` [特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)，
可以通过在 **watch** 请求中指定 `sendInitialEvents=true` 作为查询字符串参数来实现这一功能。
如果指定了这个参数，API 服务器将使用合成的初始事件（类型为 `ADDED`）来启动监视流，
以构建所有现有对象的完整状态；如果请求还带有 `allowWatchBookmarks=true` 选项，
则继续发送 [`BOOKMARK` 事件](/zh-cn/docs/reference/using-api/api-concepts/#watch-bookmarks)。
BOOKMARK 事件包括已被同步的资源版本。
发送 BOOKMARK 事件后，API 服务器会像处理所有其他 **watch** 请求一样继续执行。

<!--
When you set `sendInitialEvents=true` in the query string, Kubernetes also requires that you set
`resourceVersionMatch` to `NotOlderThan` value.
If you provided `resourceVersion` in the query string without providing a value or don't provide
it at all, this is interpreted as a request for _consistent read_;
the bookmark event is sent when the state is synced at least to the moment of a consistent read
from when the request started to be processed. If you specify `resourceVersion` (in the query string),
the bookmark event is sent when the state is synced at least to the provided resource version.
-->
当你在查询字符串中设置 `sendInitialEvents=true` 时，
Kubernetes 还要求你将 `resourceVersionMatch` 的值设置为 `NotOlderThan`。
如果你在查询字符串中提供 `resourceVersion` 而没有提供值或者根本没有提供这个参数，
这一请求将被视为 **一致性读（Consistent Read）** 请求；
当状态至少被同步到开始处理一致性读操作时，才会发送 BOOKMARK 事件。
如果你（在查询字符串中）指定了 `resourceVersion`，则只要需要等状态同步到所给资源版本时，
BOOKMARK 事件才会被发送。

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
举个例子：你想监视一组 Pod。对于该集合，当前资源版本为 10245，并且有两个 Pod：`foo` 和 `bar`。
接下来你发送了以下请求（通过使用 `resourceVersion=` 设置空的资源版本来明确请求**一致性读**），
这样做的结果是可能收到如下事件序列：

```
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
## 响应压缩   {#response-compression}

{{< feature-state feature_gate_name="APIResponseCompression" >}}

<!--
`APIResponseCompression` is an option that allows the API server to compress the responses for **get**
and **list** requests, reducing the network bandwidth and improving the performance of large-scale clusters.
It is enabled by default since Kubernetes 1.16 and it can be disabled by including
`APIResponseCompression=false` in the `--feature-gates` flag on the API server.
-->
`APIResponseCompression` 是一个选项，允许 API 服务器压缩 **get** 和 **list** 请求的响应，
减少占用的网络带宽并提高大规模集群的性能。此选项自 Kubernetes 1.16 以来默认启用，
可以通过在 API 服务器上的 `--feature-gates` 标志中包含 `APIResponseCompression=false` 来禁用。

<!--
API response compression can significantly reduce the size of the response, especially for large resources or
[collections](/docs/reference/using-api/api-concepts/#collections).
For example, a **list** request for pods can return hundreds of kilobytes or even megabytes of data,
depending on the number of pods and their attributes. By compressing the response, the network bandwidth
can be saved and the latency can be reduced.
-->
特别是对于大型资源或[集合](/zh-cn/docs/reference/using-api/api-concepts/#collections)，
API 响应压缩可以显著减小其响应的大小。例如，针对 Pod 的 **list** 请求可能会返回数百 KB 甚至几 MB 的数据，
具体大小取决于 Pod 数量及其属性。通过压缩响应，可以节省网络带宽并降低延迟。

<!--
To verify if `APIResponseCompression` is working, you can send a **get** or **list** request to the
API server with an `Accept-Encoding` header, and check the response size and headers. For example:
-->
要验证 `APIResponseCompression` 是否正常工作，你可以使用一个 `Accept-Encoding`
头向 API 服务器发送一个 **get** 或 **list** 请求，并检查响应大小和头信息。例如：

```
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
`content-encoding` 头表示响应使用 `gzip` 进行了压缩。

<!--
## Retrieving large results sets in chunks
-->
## 分块检视大体量结果  {#retrieving-large-results-sets-in-chunks}

{{< feature-state feature_gate_name="APIListChunking" >}}

<!--
On large clusters, retrieving the collection of some resource types may result in
very large responses that can impact the server and client. For instance, a cluster
may have tens of thousands of Pods, each of which is equivalent to roughly 2 KiB of
encoded JSON. Retrieving all pods across all namespaces may result in a very large
response (10-20MB) and consume a large amount of server resources.
-->
在较大规模集群中，检索某些资源类型的集合可能会导致非常大的响应，从而影响服务器和客户端。
例如，一个集群可能有数万个 Pod，每个 Pod 大约相当于 2 KiB 的编码 JSON。
跨所有名字空间检索所有 Pod 可能会导致非常大的响应 (10-20MB) 并消耗大量服务器资源。

<!--
The Kubernetes API server supports the ability to break a single large collection request
into many smaller chunks while preserving the consistency of the total request. Each
chunk can be returned sequentially which reduces both the total size of the request and
allows user-oriented clients to display results incrementally to improve responsiveness.
-->
Kubernetes API 服务器支持将单个大型集合请求分解为许多较小块的能力，
同时保持总体请求的一致性。每个块都可以按顺序返回，这既减少了请求的总大小，
又允许面向用户的客户端增量显示结果以提高响应能力。

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
你可以请求 API 服务器通过使用页（Kubernetes 将其称为“块（Chunk）”）的方式来处理 **list**，
完成单个集合的响应。
要以块的形式检索单个集合，针对集合的请求支持两个查询参数 `limit` 和 `continue`，
并且从集合元 `metadata` 字段中的所有 **list** 操作返回响应字段 `continue`。
客户端应该指定他们希望在每个带有 `limit` 的块中接收的条目数上限，如果集合中有更多资源，
服务器将在结果中返回 `limit` 资源并包含一个 `continue` 值。

<!--
As an API client, you can then pass this `continue` value to the API server on the
next request, to instruct the server to return the next page (_chunk_) of results. By
continuing until the server returns an empty `continue` value, you can retrieve the
entire collection.
-->
作为 API 客户端，你可以在下一次请求时将 `continue` 值传递给 API 服务器，
以指示服务器返回下一页（**块**）结果。继续下去直到服务器返回一个空的 `continue` 值，
你可以检索整个集合。

<!--
Like a **watch** operation, a `continue` token will expire after a short amount
of time (by default 5 minutes) and return a `410 Gone` if more results cannot be
returned. In this case, the client will need to start from the beginning or omit the
`limit` parameter.

For example, if there are 1,253 pods on the cluster and you want to receive chunks
of 500 pods at a time, request those chunks as follows:
-->
与 **watch** 操作类似，`continue` 令牌也会在很短的时间（默认为 5 分钟）内过期，
并在无法返回更多结果时返回 `410 Gone` 代码。
这时，客户端需要从头开始执行上述检视操作或者忽略 `limit` 参数。

例如，如果集群上有 1253 个 Pod，客户端希望每次收到包含至多 500 个 Pod
的数据块，它应按下面的步骤来请求数据块：

<!--
1. List all of the pods on a cluster, retrieving up to 500 pods each time.
-->
1. 列举集群中所有 Pod，每次接收至多 500 个 Pod：

   ```
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
2. Continue the previous call, retrieving the next set of 500 pods.
-->
2. 继续前面的调用，返回下一组 500 个 Pod：

   ```
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
3. Continue the previous call, retrieving the last 253 pods.
-->
3. 继续前面的调用，返回最后 253 个 Pod：

   ```
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
请注意，集合的 `resourceVersion` 在每个请求中保持不变，
这表明服务器正在向你显示 Pod 的一致快照。
在版本 `10245` 之后创建、更新或删除的 Pod 将不会显示，
除非你在没有继续令牌的情况下发出单独的 **list** 请求。
这使你可以将大请求分成更小的块，然后对整个集合执行 **watch** 操作，而不会丢失任何更新。

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
`remainingItemCount` 是集合中未包含在此响应中的后续项目的数量。
如果 **list** 请求包含标签或字段{{< glossary_tooltip text="选择器" term_id="selector">}}，
则剩余项目的数量是未知的，并且 API 服务器在其响应中不包含 `remainingItemCount` 字段。
如果 **list** 是完整的（因为它没有分块，或者因为这是最后一个块），没有更多的剩余项目，
API 服务器在其响应中不包含 `remainingItemCount` 字段。
`remainingItemCount` 的用途是估计集合的大小。

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

在 Kubernetes 术语中，你从 **list** 中获得的响应是一个“集合（Collections）”。
然而，Kubernetes 为不同类型资源的集合定义了具体类型。
集合的类别名是针对资源类别的，并附加了 `List`。

当你查询特定类型的 API 时，该查询返回的所有项目都属于该类型。
例如，当你 **list** Service 对象时，集合响应的 `kind` 设置为
[`ServiceList`](/zh-cn/docs/reference/kubernetes-api/service-resources/service-v1/#ServiceList)；
该集合中的每个项目都代表一个 Service。例如：

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
Kubernetes API 中定义了数十种集合类型（如 `PodList`、`ServiceList` 和 `NodeList`）。
你可以从 [Kubernetes API](/zh-cn/docs/reference/kubernetes-api/) 文档中获取有关每种集合类型的更多信息。

一些工具，例如 `kubectl`，对于 Kubernetes 集合的表现机制与 Kubernetes API 本身略有不同。
因为 `kubectl` 的输出可能包含来自 API 级别的多个 **list** 操作的响应，
所以 `kubectl` 使用 `kind: List` 表示项目列表。例如：

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
请记住，Kubernetes API 没有名为 `List` 的 `kind`。

`kind: List` 是一个客户端内部实现细节，用于处理可能属于不同类别的对象的集合。
在自动化或其他代码中避免依赖 `kind: List`。
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
## 以表格形式接收资源  {#receiving-resources-as-tables}

当你执行 `kubectl get` 时，默认的输出格式是特定资源类型的一个或多个实例的简单表格形式。
过去，客户端需要重复 `kubectl` 中所实现的表格输出和描述输出逻辑，以执行简单的对象列表操作。
该方法的一些限制包括处理某些对象时的不可忽视逻辑。
此外，API 聚合或第三方资源提供的类型在编译时是未知的。
这意味着必须为客户端无法识别的类型提供通用实现。

<!--
In order to avoid potential limitations as described above, clients may request
the Table representation of objects, delegating specific details of printing to the
server. The Kubernetes API implements standard HTTP content type negotiation: passing
an `Accept` header containing a value of `application/json;as=Table;g=meta.k8s.io;v=v1`
with a `GET` call will request that the server return objects in the Table content
type.

For example, list all of the pods on a cluster in the Table format.
-->
为了避免上述各种潜在的局限性，客户端可以请求服务器端返回对象的表格（Table）
表现形式，从而将打印输出的特定细节委托给服务器。
Kubernetes API 实现标准的 HTTP 内容类型（Content Type）协商：为 `GET`
调用传入一个值为 `application/json;as=Table;g=meta.k8s.io;v=v1` 的 `Accept`
头部即可请求服务器以 Table 的内容类型返回对象。

例如，以 Table 格式列举集群中所有 Pod：

```
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
对于在控制平面上不存在定制的 Table 定义的 API 资源类型而言，服务器会返回一个默认的
Table 响应，其中包含资源的 `name` 和 `creationTimestamp` 字段。

```
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
并非所有 API 资源类型都支持 Table 响应；
例如，{{< glossary_tooltip term_id="CustomResourceDefinition" text="CustomResourceDefinitions" >}} 可能没有定义字段到表的映射，
[扩展核心 Kubernetes API](/zh-cn/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/)
的 APIService 可能根本不提供 Table 响应。
如果你正在实现使用 Table 信息并且必须针对所有资源类型（包括扩展）工作的客户端，
你应该在 `Accept` 请求头中指定多种内容类型的请求。例如：

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
## 资源的其他表示形式  {#alternate-representations-of-resources}

默认情况下，Kubernetes 返回序列化为 JSON 的对象，内容类型为 `application/json`。
这是 API 的默认序列化格式。
但是，客户端可能会使用更有效的 [Protobuf 表示](#protobuf-encoding) 请求这些对象，
以获得更好的大规模性能。Kubernetes API 实现标准的 HTTP 内容类型协商：
带有 `Accept` 请求头部的 `GET` 调用会请求服务器尝试以你的首选媒体类型返回响应，
而将 Protobuf 中的对象发送到服务器以进行 `PUT` 或 `POST` 调用意味着你必须适当地设置
`Content-Type` 请求头。

<!--
The server will return a response with a `Content-Type` header if the requested
format is supported, or the `406 Not acceptable` error if none of the media types you
requested are supported. All built-in resource types support the `application/json`
media type.

See the Kubernetes [API reference](/docs/reference/kubernetes-api/) for a list of
supported content types for each API.

For example:
-->
如果支持请求的格式，服务器将返回带有 `Content-Type` 标头的响应，
如果不支持你请求的媒体类型，则返回 `406 Not Acceptable` 错误。
所有内置资源类型都支持 `application/json` 媒体类型。

有关每个 API 支持的内容类型列表，请参阅 Kubernetes [API 参考](/zh-cn/docs/reference/kubernetes-api/)。

例如：

<!--
1. List all of the pods on a cluster in Protobuf format.
-->
1. 以 Protobuf 格式列举集群上的所有 Pod：

   ```
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
2. 通过向服务器发送 Protobuf 编码的数据创建 Pod，但请求以 JSON 形式接收响应：

   ```
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
并非所有 API 资源类型都支持 Protobuf；具体来说，
Protobuf 不适用于定义为 {{< glossary_tooltip term_id="CustomResourceDefinition" text="CustomResourceDefinitions" >}}
或通过{{< glossary_tooltip text="聚合层" term_id="aggregation-layer" >}}提供服务的资源。
作为客户端，如果你可能需要使用扩展类型，则应在请求 `Accept` 请求头中指定多种内容类型以支持回退到 JSON。
例如：

```
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
### Kubernetes Protobuf 编码 {#protobuf-encoding}

Kubernetes 使用封套形式来对 Protobuf 响应进行编码。
封套外层由 4 个字节的特殊数字开头，便于从磁盘文件或 etcd 中辩识 Protobuf
格式的（而不是 JSON）数据。
接下来存放的是 Protobuf 编码的封套消息，其中描述下层对象的编码和类型，最后
才是对象本身。

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
四个字节的特殊数字前缀：
  字节 0-3: "k8s\x00" [0x6b, 0x38, 0x73, 0x00]

使用下面 IDL 来编码的 Protobuf 消息：
  message Unknown {
    // typeMeta 应该包含 "kind" 和 "apiVersion" 的字符串值，就像
    // 对应的 JSON 对象中所设置的那样
    optional TypeMeta typeMeta = 1;

    // raw 中将保存用 protobuf 序列化的完整对象。
    // 参阅客户端库中为指定 kind 所作的 protobuf 定义
    optional bytes raw = 2;

    // contentEncoding 用于 raw 数据的编码格式。未设置此值意味着没有特殊编码。
    optional string contentEncoding = 3;

    // contentType 包含 raw 数据所采用的序列化方法。
    // 未设置此值意味着 application/vnd.kubernetes.protobuf，且通常被忽略
    optional string contentType = 4;
  }

  message TypeMeta {
    // apiVersion 是 type 对应的组名/版本
    optional string apiVersion = 1;
    // kind 是对象模式定义的名称。此对象应该存在一个 protobuf 定义。
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
收到 `application/vnd.kubernetes.protobuf` 格式响应的客户端在响应与预期的前缀不匹配时应该拒绝响应，
因为将来的版本可能需要以某种不兼容的方式更改序列化格式，
并且这种更改是通过变更前缀完成的。
{{< /note >}}

<!--
## Resource deletion

When you **delete** a resource this takes place in two phases.

1. _finalization_
2. removal
-->
## 资源删除  {#resource-deletion}

当你 **delete** 资源时，操作将分两个阶段进行。

1. 终结（finalization）
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
When a client first sends a **delete** to request the removal of a resource, the `.metadata.deletionTimestamp` is set to the current time.
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
当客户端第一次发送 **delete** 请求删除资源时，`.metadata.deletionTimestamp` 设置为当前时间。
一旦设置了 `.metadata.deletionTimestamp`，
作用于终结器的外部控制器可以在任何时间以任何顺序开始执行它们的清理工作。

终结器之间**不存在**强制的执行顺序，因为这会带来卡住 `.metadata.finalizers` 的重大风险。

`.metadata.finalizers` 字段是共享的：任何有权限的参与者都可以重新排序。
如果终结器列表是按顺序处理的，那么这可能会导致这样一种情况：
在列表中负责第一个终结器的组件正在等待列表中稍后负责终结器的组件产生的某些信号
（字段值、外部系统或其他），从而导致死锁。

如果没有强制排序，终结者可以在它们之间自由排序，并且不易受到列表中排序变化的影响。

当最后一个终结器也被移除时，资源才真正从 etcd 中移除。

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
## 单个资源 API  {#single-resource-api}

Kubernetes API 动词 **get**、**create**、**update**、**patch**、**delete** 和 **proxy** 仅支持单一资源。
这些具有单一资源支持的动词不支持在有序或无序列表或事务中一起提交多个资源。

当客户端（包括 kubectl）对一组资源进行操作时，客户端会发出一系列单资源 API 请求，
然后在需要时聚合响应。

相比之下，Kubernetes API 动词 **list** 和 **watch** 允许获取多个资源，
而 **deletecollection** 允许删除多个资源。

<!--
## Field validation
-->
## 字段校验    {#field-validation}

<!--
Kubernetes always validates the type of fields. For example, if a field in the
API is defined as a number, you cannot set the field to a text value. If a field
is defined as an array of strings, you can only provide an array. Some fields
allow you to omit them, other fields are required. Omitting a required field
from an API request is an error.
-->
Kubernetes 总是校验字段的类型。例如，如果 API 中的某个字段被定义为数值，
你就不能将该字段设置为文本类型的值。如果某个字段被定义为字符串数组，你只能提供数组。
有些字段可以忽略，有些字段必须填写。忽略 API 请求中的必填字段会报错。

<!--
If you make a request with an extra field, one that the cluster's control plane
does not recognize, then the behavior of the API server is more complicated.
-->
如果请求中带有集群控制面无法识别的额外字段，API 服务器的行为会更加复杂。

<!--
By default, the API server drops fields that it does not recognize
from an input that it receives (for example, the JSON body of a `PUT` request).
-->
默认情况下，如果接收到的输入信息中含有 API 服务器无法识别的字段，API 服务器会丢弃该字段
（例如：`PUT` 请求中的 JSON 主体）。

<!--
There are two situations where the API server drops fields that you supplied in
an HTTP request.
-->
API 服务器会在两种情况下丢弃 HTTP 请求中提供的字段。

<!--
These situations are:
-->
这些情况是：

<!--
1. The field is unrecognized because it is not in the resource's OpenAPI schema. (One
   exception to this is for {{< glossary_tooltip
   term_id="CustomResourceDefinition" text="CRDs" >}} that explicitly choose not to prune unknown
   fields via `x-kubernetes-preserve-unknown-fields`).
-->
1. 相关资源的 OpenAPI 模式定义中没有该字段，因此无法识别该字段（有种例外情形是，
   {{< glossary_tooltip term_id="CustomResourceDefinition" text="CRD" >}}
   通过 `x-kubernetes-preserve-unknown-fields` 显式选择不删除未知字段）。

<!--
1. The field is duplicated in the object.
-->
2. 字段在对象中重复出现。

<!--
### Validation for unrecognized or duplicate fields {#setting-the-field-validation-level}
-->
### 检查无法识别或重复的字段  {#setting-the-field-validation-level}

{{< feature-state feature_gate_name="ServerSideFieldValidation" >}}

<!--
From 1.25 onward, unrecognized or duplicate fields in an object are detected via
validation on the server when you use HTTP verbs that can submit data (`POST`, `PUT`, and `PATCH`). Possible levels of
validation are `Ignore`, `Warn` (default), and `Strict`.
-->
从 1.25 开始，当使用可以提交数据的 HTTP 动词（`POST`、`PUT` 和 `PATCH`）时，
将通过服务器上的校验检测到对象中无法识别或重复的字段。
校验的级别可以是 `Ignore`、`Warn`（默认值） 和 `Strict` 之一。
<!--
: The API server succeeds in handling the request as it would without the erroneous fields
being set, dropping all unknown and duplicate fields and giving no indication it
has done so.
-->
`Ignore`
: 使 API 服务器像没有遇到错误字段一样成功处理请求，丢弃所有的未知字段和重复字段，并且不发送丢弃字段的通知。

<!--
: (Default) The API server succeeds in handling the request, and reports a
warning to the client. The warning is sent using the `Warning:` response header,
adding one warning item for each unknown or duplicate field. For more
information about warnings and the Kubernetes API, see the blog article
[Warning: Helpful Warnings Ahead](/blog/2020/09/03/warnings/).
-->
`Warn`
:（默认值）使 API 服务器成功处理请求，并向客户端发送告警信息。告警信息通过 `Warning:` 响应头发送，
并为每个未知字段或重复字段添加一条告警信息。有关告警和相关的 Kubernetes API 的信息，
可参阅博文[告警：增加实用告警功能](/blog/2020/09/03/warnings/)。

<!--
: The API server rejects the request with a 400 Bad Request error when it
detects any unknown or duplicate fields. The response message from the API
server specifies all the unknown or duplicate fields that the API server has
detected.
-->
`Strict`
: API 服务器检测到任何未知字段或重复字段时，拒绝处理请求并返回 400 Bad Request 错误。
来自 API 服务器的响应消息列出了 API 检测到的所有未知字段或重复字段。

<!--
The field validation level is set by the `fieldValidation` query parameter.
-->
字段校验级别可通过查询参数 `fieldValidation` 来设置。

{{< note >}}
<!--
If you submit a request that specifies an unrecognized field, and that is also invalid for
a different reason (for example, the request provides a string value where the API expects
an integer for a known field), then the API server responds with a 400 Bad Request error, but will
not provide any information on unknown or duplicate fields (only which fatal
error it encountered first).

You always receive an error response in this case, no matter what field validation level you requested.
-->
如果你提交的请求中设置了一个无法被识别的字段，并且该请求存在因其他原因引起的不合法
（例如，请求为某已知字段提供了一个字符串值，而 API 期望该字段为整数），
那么 API 服务器会以 400 Bad Request 错误作出响应，但不会提供有关未知或重复字段的任何信息
（仅提供它首先遇到的致命错误）。

在这种情况下，不管你设置哪种字段校验级别，你总会收到出错响应。
{{< /note >}}

<!--
Tools that submit requests to the server (such as `kubectl`), might set their own
defaults that are different from the `Warn` validation level that the API server uses
by default.
-->
向服务器提交请求的工具（例如 `kubectl`）可能会设置自己的默认值，与 API 服务器默认使用的 `Warn`
校验层级不同。

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
`kubectl` 工具使用 `--validate` 标志设置字段校验层级。
该字段可取的值包括 `ignore`、`warn` 和 `strict`，同时还接受值 `true`（相当于 `strict`）和
`false`（相当于 `ignore`）。
kubectl 默认的校验设置是 `--validate=true` ，这意味着执行严格的服务端字段校验。

当 kubectl 无法连接到启用字段校验的 API 服务器（Kubernetes 1.27 之前的 API 服务器）时，
将回退到使用客户端的字段校验。
客户端校验将在 kubectl 未来版本中被完全删除。
{{< note >}}
<!--
Prior to Kubernetes 1.25  `kubectl --validate` was used to toggle client-side validation on or off as
a boolean flag.
-->
在 Kubernetes 1.25 之前，`kubectl --validate` 是用来开启或关闭客户端校验的布尔标志的命令。
{{< /note >}}

<!--
## Dry-run
-->
## 试运行  {#dry-run}

{{< feature-state feature_gate_name="DryRun" >}}

<!--
When you use HTTP verbs that can modify resources (`POST`, `PUT`, `PATCH`, and
`DELETE`), you can submit your request in a _dry run_ mode. Dry run mode helps to
evaluate a request through the typical request stages (admission chain, validation,
merge conflicts) up until persisting objects to storage. The response body for the
request is as close as possible to a non-dry-run response. Kubernetes guarantees that
dry-run requests will not be persisted in storage or have any other side effects.
-->
当你使用可以修改资源的 HTTP 动词（`POST`、`PUT`、`PATCH` 和 `DELETE`）时，
你可以在 **试运行（dry run）** 模式下提交你的请求。
试运行模式有助于通过典型的请求阶段（准入链、验证、合并冲突）评估请求，直到将对象持久化到存储中。
请求的响应正文尽可能接近非试运行响应。Kubernetes 保证试运行请求不会被持久化存储或产生任何其他副作用。

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
### 发起试运行请求  {#make-a-dry-run-request}

通过设置 `dryRun` 查询参数触发试运行。此参数是一个字符串，用作枚举，唯一可接受的值是：

[未设置值]
: 允许副作用。你可以使用 `?dryRun` 或 `?dryRun&pretty=true` 之类的查询字符串请求此操作。
  响应是最终会被持久化的对象，或者如果请求不能被满足则会出现一个错误。

`All`
: 每个阶段都正常运行，除了防止副作用的最终存储阶段。

<!--
When you set `?dryRun=All`, any relevant
{{< glossary_tooltip text="admission controllers" term_id="admission-controller" >}}
are run, validating admission controllers check the request post-mutation, merge is
performed on `PATCH`, fields are defaulted, and schema validation occurs. The changes
are not persisted to the underlying storage, but the final object which would have
been persisted is still returned to the user, along with the normal status code.
-->
当你设置 `?dryRun=All` 时，将运行任何相关的{{< glossary_tooltip text="准入控制器" term_id="admission-controller" >}}，
验证准入控制器检查经过变更的请求，针对 `PATCH` 请求执行合并、设置字段默认值等操作，并进行模式验证。
更改不会持久化到底层存储，但本应持久化的最终对象仍会与正常状态代码一起返回给用户。

<!--
If the non-dry-run version of a request would trigger an admission controller that has
side effects, the request will be failed rather than risk an unwanted side effect. All
built in admission control plugins support dry-run. Additionally, admission webhooks can
declare in their
[configuration object](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#validatingwebhook-v1-admissionregistration-k8s-io)
that they do not have side effects, by setting their `sideEffects` field to `None`.
-->
如果请求的非试运行版本会触发具有副作用的准入控制器，则该请求将失败，而不是冒不希望的副作用的风险。
所有内置准入控制插件都支持试运行。
此外，准入 Webhook 还可以设置[配置对象](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#validatingwebhook-v1-admissionregistration-k8s-io)
的 `sideEffects` 字段为 `None`，借此声明它们没有副作用。

<!--
If a webhook actually does have side effects, then the `sideEffects` field should be
set to "NoneOnDryRun". That change is appropriate provided that the webhook is also
be modified to understand the `DryRun` field in AdmissionReview, and to prevent side
effects on any request marked as dry runs.
-->
{{< note >}}
如果 webhook 确实有副作用，则应该将 `sideEffects` 字段设置为 “NoneOnDryRun”。
如果还修改了 webhook 以理解 AdmissionReview 中的 DryRun 字段，
并防止对标记为试运行的任何请求产生副作用，则该更改是适当的。
{{< /note >}}

<!--
Here is an example dry-run request that uses `?dryRun=All`:
-->
这是一个使用 `?dryRun=All` 的试运行请求的示例：

```
POST /api/v1/namespaces/test/pods?dryRun=All
Content-Type: application/json
Accept: application/json
```

<!--
The response would look the same as for non-dry-run request, but the values of some
generated fields may differ.
-->
响应会与非试运行模式请求的响应看起来相同，只是某些生成字段的值可能会不同。

<!--
### Generated values

Some values of an object are typically generated before the object is persisted. It
is important not to rely upon the values of these fields set by a dry-run request,
since these values will likely be different in dry-run mode from when the real
request is made. Some of these fields are:

* `name`: if `generateName` is set, `name` will have a unique random name
* `creationTimestamp` / `deletionTimestamp`: records the time of creation/deletion
* `UID`: [uniquely identifies](/docs/concepts/overview/working-with-objects/names/#uids) the object and is randomly generated (non-deterministic)
* `resourceVersion`: tracks the persisted version of the object
* Any field set by a mutating admission controller
* For the `Service` resource: Ports or IP addresses that the kube-apiserver assigns to Service objects
-->
### 生成值  {#generated-values}

对象的某些值通常是在对象被写入数据库之前生成的。很重要的一点是不要依赖试运行请求为这些字段所设置的值，
因为试运行模式下所得到的这些值与真实请求所获得的值很可能不同。这类字段有：

* `name`：如果设置了 `generateName` 字段，则 `name` 会获得一个唯一的随机名称
* `creationTimestamp` / `deletionTimestamp`：记录对象的创建/删除时间
* `UID`：[唯一标识](/zh-cn/docs/concepts/overview/working-with-objects/names/#uids)对象，
  取值随机生成（非确定性）
* `resourceVersion`：跟踪对象的持久化（存储）版本
* 变更性准入控制器所设置的字段
* 对于 `Service` 资源：`kube-apiserver` 为 `Service` 对象分配的端口和 IP 地址

<!--
### Dry-run authorization

Authorization for dry-run and non-dry-run requests is identical. Thus, to make
a dry-run request, you must be authorized to make the non-dry-run request.

For example, to run a dry-run **patch** for a Deployment, you must be authorized
to perform that **patch**. Here is an example of a rule for Kubernetes
{{< glossary_tooltip text="RBAC" term_id="rbac">}} that allows patching
Deployments:
-->
### 试运行的授权    {#dry-run-authorization}

试运行和非试运行请求的鉴权是完全相同的。因此，要发起一个试运行请求，
你必须被授权执行非试运行请求。

例如，要在 Deployment 对象上试运行 **patch** 操作，你必须具有对 Deployment 执行 **patch** 操作的访问权限，
如下面的 {{< glossary_tooltip text="RBAC" term_id="rbac">}} 规则所示：

```yaml
rules:
- apiGroups: ["apps"]
  resources: ["deployments"]
  verbs: ["patch"]
```

<!--
See [Authorization Overview](/docs/reference/access-authn-authz/authorization/).
-->
参阅[鉴权概述](/zh-cn/docs/reference/access-authn-authz/authorization/)以了解鉴权细节。

<!--
## Updates to existing resources {#patch-and-apply}

Kubernetes provides several ways to update existing objects.
You can read [choosing an update mechanism](#update-mechanism-choose) to
learn about which approach might be best for your use case.
-->
## 更新现有资源   {#patch-and-apply}

Kubernetes 提供了多种更新现有对象的方式。
你可以阅读[选择更新机制](#update-mechanism-choose)以了解哪种方法可能最适合你的用例。

<!--
You can overwrite (**update**) an existing resource - for example, a ConfigMap -
using an HTTP PUT. For a PUT request, it is the client's responsibility to specify
the `resourceVersion` (taking this from the object being updated). Kubernetes uses
that `resourceVersion` information so that the API server can detect lost updates
and reject requests made by a client that is out of date with the cluster.
In the event that the resource has changed (the `resourceVersion` the client
provided is stale), the API server returns a `409 Conflict` error response.
-->
你可以使用 HTTP PUT 覆盖（**update**）ConfigMap 等现有资源。
对于 PUT 请求，客户端需要指定 `resourceVersion`（从要更新的对象中获取此项）。
Kubernetes 使用该 `resourceVersion` 信息，这样 API 服务器可以检测丢失的更新并拒绝对集群来说过期的客户端所发出的请求。
如果资源已发生变化（即客户端提供的 `resourceVersion` 已过期），API 服务器将返回 `409 Conflict` 错误响应。

<!--
Instead of sending a PUT request, the client can send an instruction to the API
server to **patch** an existing resource. A **patch** is typically appropriate
if the change that the client wants to make isn't conditional on the existing data. Clients that need effective detection of lost updates should consider
making their request conditional on the existing `resourceVersion` (either HTTP PUT or HTTP PATCH),
and then handle any retries that are needed in case there is a conflict.

The Kubernetes API supports four different PATCH operations, determined by their
corresponding HTTP `Content-Type` header:
-->
客户端除了发送 PUT 请求之外，还可以发送指令给 API 服务器对现有资源执行 **patch** 操作。
**patch** 通常适用于客户端希望进行的更改并不依赖于现有数据的场景。
需要有效检测丢失更新的客户端应该考虑根据现有 `resourceVersion` 来进行有条件的请求
（HTTP PUT 或 HTTP PATCH），并在存在冲突时作必要的重试。

Kubernetes API 支持四种不同的 PATCH 操作，具体取决于它们所对应的 HTTP `Content-Type` 标头：

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
: Server Side Apply YAML（基于 YAML 的 Kubernetes 扩展）。
  所有 JSON 文档都是有效的 YAML，因此你也可以使用此媒体类型提交 JSON。
  更多细节参阅[服务器端应用序列化](/zh-cn/docs/reference/using-api/server-side-apply/#serialization)。
  对于 Kubernetes，这一 PATCH 请求在对象不存在时成为 **create** 操作；在对象已存在时成为 **patch** 操作。

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
: JSON Patch，如 [RFC6902](https://tools.ietf.org/html/rfc6902) 中定义。
  JSON Patch 是对资源执行的一个操作序列；例如 `{"op": "add", "path": "/a/b/c", "value": [ "foo", "bar" ]}`。
  对于 Kubernetes，这一 PATCH 请求即是一个 **patch** 操作。
  
  使用 `application/json-patch+json` 的 **patch** 可以包含用于验证一致性的条件，
  如果这些条件不满足，则允许此操作失败（例如避免丢失更新）。

<!--
`application/merge-patch+json`
: JSON Merge Patch, as defined in [RFC7386](https://tools.ietf.org/html/rfc7386).
  A JSON Merge Patch is essentially a partial representation of the resource.
  The submitted JSON is combined with the current resource to create a new one,
  then the new one is saved.  
  To Kubernetes, this is a **patch** operation.
-->
`application/merge-patch+json`
: JSON Merge Patch，如 [RFC7386](https://tools.ietf.org/html/rfc7386) 中定义。
  JSON Merge Patch 实质上是资源的部分表示。提交的 JSON 与当前资源合并以创建一个新资源，然后将其保存。
  对于 Kubernetes，这个 PATCH 请求是一个 **patch** 操作。

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
: Strategic Merge Patch（基于 JSON 的 Kubernetes 扩展）。
  Strategic Merge Patch 是 JSON Merge Patch 的自定义实现。
  你只能在内置 API 或具有特殊支持的聚合 API 服务器中使用 Strategic Merge Patch。
  你不能针对任何使用 {{< glossary_tooltip term_id="CustomResourceDefinition" text="CustomResourceDefinition" >}}
  定义的 API 来使用 `application/strategic-merge-patch+json`。

  {{< note >}}
  <!--
  The Kubernetes _server side apply_ mechanism has superseded Strategic Merge
  Patch.
  -->
  Kubernetes **服务器端应用**机制已取代 Strategic Merge Patch。
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
Kubernetes 的[服务器端应用](/zh-cn/docs/reference/using-api/server-side-apply/)功能允许控制平面跟踪新创建对象的托管字段。
服务端应用为管理字段冲突提供了清晰的模式，提供了服务器端 **apply** 和 **update**  操作，
并替换了 `kubectl apply` 的客户端功能。

对于服务器端应用，Kubernetes 在对象尚不存在时将请求视为 **create**，否则视为 **patch**。
对于其他在 HTTP 层面使用 PATCH 的请求，逻辑上的 Kubernetes 操作始终是 **patch**。

更多细节参阅[服务器端应用](/zh-cn/docs/reference/using-api/server-side-apply/)。

<!--
### Choosing an update mechanism {#update-mechanism-choose}

#### HTTP PUT to replace existing resource {#update-mechanism-update}

The **update** (HTTP `PUT`) operation is simple to implement and flexible,
but has drawbacks:
-->
### 选择更新机制   {#update-mechanism-choose}

#### HTTP PUT 替换现有资源  {#update-mechanism-update}

**update**（HTTP `PUT`）操作实现简单且灵活，但也存在一些缺点：

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
* 你需要处理对象的 `resourceVersion` 在客户端读取和写回之间发生变化所造成的冲突。
  Kubernetes 总是会检测到此冲突，但你作为客户端开发者需要实现重试机制。
* 如果你在本地解码对象，可能会意外丢失字段。例如你在使用 client-go 时，
  可能会收到客户端不知道如何处理的一些字段，而客户端在构造更新时会将这些字段丢弃。
* 如果对象上存在大量争用（即使是在你不打算编辑的某字段或字段集上），你可能会难以发送更新。
  对于体量较大或字段较多的对象，这个问题会更为严重。

<!--
#### HTTP PATCH using JSON Patch {#update-mechanism-json-patch}

A **patch** update is helpful, because:
-->
#### 使用 JSON Patch 的 HTTP PATCH   {#update-mechanism-json-patch}

**patch** 更新很有帮助，因为：

<!--
* As you're only sending differences, you have less data to send in the `PATCH`
  request.
* You can make changes that rely on existing values, such as copying the
  value of a particular field into an annotation.
-->
* 由于你只发送差异，所以你在 `PATCH` 请求中需要发送的数据较少。
* 你可以依赖于现有值进行更改，例如将特定字段的值复制到注解中。
<!--
* Unlike with an **update** (HTTP `PUT`), making your change can happen right away
  even if there are frequent changes to unrelated fields): you usually would
  not need to retry.
  * You might still need to specify the `resourceVersion` (to match an existing object)
    if you want to be extra careful to avoid lost updates
  * It's still good practice to write in some retry logic in case of errors.
-->
* 与 **update**（HTTP `PUT`）不同，即使存在对无关字段的频繁更改，你的更改也可以立即生效：
  你通常无需重试。
  * 如果你要特别小心避免丢失更新，仍然可能需要指定 `resourceVersion`（以匹配现有对象）。
  * 编写一些重试逻辑以处理错误仍然是一个良好的实践。
<!--
* You can use test conditions to careful craft specific update conditions.
  For example, you can increment a counter without reading it if the existing
  value matches what you expect. You can do this with no lost update risk,
  even if the object has changed in other ways since you last wrote to it.
  (If the test condition fails, you can fall back to reading the current value
  and then write back the changed number).
-->
* 你可以通过测试条件来精确地构造特定的更新条件。
  例如，如果现有值与你期望的值匹配，你可以递增计数器而无需读取它。
  即使自上次写入以来对象以其他方式发生了更改，你也可以做到这一点而不会遇到丢失更新的风险。
  （如果测试条件失败，你可以回退为读取当前值，然后写回更改的数字）。

<!--
However:

* you need more local (client) logic to build the patch; it helps a lot if you have
  a library implementation of JSON Patch, or even for making a JSON Patch specifically against Kubernetes
* as the author of client software, you need to be careful when building the patch
  (the HTTP request body) not to drop fields (the order of operations matters)
-->
然而：

* 你需要更多本地（客户端）逻辑来构建补丁；如果你拥有实现了 JSON Patch 的库，
  或者针对 Kubernetes 生成特定的 JSON Patch 的库，将非常有帮助。
* 作为客户端软件的开发者，你在构建补丁（HTTP 请求体）时需要小心，避免丢弃字段（操作顺序很重要）。

<!--
#### HTTP PATCH using Server-Side Apply {#update-mechanism-server-side-apply}

Server-Side Apply has some clear benefits:
-->
#### 使用服务器端应用的 HTTP PATCH {#update-mechanism-server-side-apply}

服务器端应用（Server-Side Apply）具有一些明显的优势：

<!--
* A single round trip: it rarely requires making a `GET` request first.
  * and you can still detect conflicts for unexpected changes
  * you have the option to force override a conflict, if appropriate
* Client implementations are easy to make
* You get an atomic create-or-update operation without extra effort
  (similar to `UPSERT` in some SQL dialects)
-->
* 仅需一次轮询：通常无需先执行 `GET` 请求。
  * 并且你仍然可以检测到意外更改造成的冲突
  * 合适的时候，你可以选择强制覆盖冲突
* 客户端实现简单
* 你可以轻松获得原子级别的 create 或 update 操作，无需额外工作
  （类似于某些 SQL 语句中的 `UPSERT`）

<!--
However:

* Server-Side Apply does not work at all for field changes that depend on a current value of the object
* You can only apply updates to objects. Some resources in the Kubernetes HTTP API are
  not objects (they do not have a `.metadata` field), and Server-Side Apply
  is only relevant for Kubernetes objects.
-->
然而：

* 服务器端应用不适合依赖对象当前值的字段更改
* 你只能更新对象。Kubernetes HTTP API 中的某些资源不是对象（它们没有 `.metadata` 字段），
  并且服务器端应用只能用于 Kubernetes 对象。

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
## 资源版本   {#resource-versions}

资源版本是标识服务器内部对象版本的字符串。
客户端可以使用资源版本来确定对象何时更改，
或者在获取、列出和监视资源时表达数据一致性要求。
资源版本必须被客户端视为不透明的，并且未经修改地传回服务器。

你不能假设资源版本是数字的或可排序的。
API 客户端只能比较两个资源版本的相等性（这意味着你不能比较资源版本的大于或小于关系）。

<!--
### `resourceVersion` fields in metadata {#resourceversion-in-metadata}

Clients find resource versions in resources, including the resources from the response
stream for a **watch**, or when using **list** to enumerate resources.

[v1.meta/ObjectMeta](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#objectmeta-v1-meta) - The `metadata.resourceVersion` of a resource instance identifies the resource version the instance was last modified at.

[v1.meta/ListMeta](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#listmeta-v1-meta) - The `metadata.resourceVersion` of a resource collection (the response to a **list**) identifies the resource version at which the collection was constructed.
-->
### metadata 中的 `resourceVersion`  {#resourceVersion-in-metadata}

客户端在资源中查找资源版本，这些资源包括来自用于 **watch** 的响应流资源，或者使用 **list** 枚举的资源。

[v1.meta/ObjectMeta](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#objectmeta-v1-meta) -
资源的 `metadata.resourceVersion` 值标明该实例上次被更改时的资源版本。

[v1.meta/ListMeta](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#listmeta-v1-meta) - 资源集合即
**list** 操作的响应）的 `metadata.resourceVersion` 所标明的是 list 响应被构造时的资源版本。

<!--
### `resourceVersion` parameters in query strings {#the-resourceversion-parameter}

The **get**, **list**, and **watch** operations support the `resourceVersion` parameter.
From version v1.19, Kubernetes API servers also support the `resourceVersionMatch`
parameter on _list_ requests.

The API server interprets the `resourceVersion` parameter differently depending
on the operation you request, and on the value of `resourceVersion`. If you set
`resourceVersionMatch` then this also affects the way matching happens.
-->
### 查询字符串中的 `resourceVersion` 参数   {#the-resourceversion-parameter}

**get**、**list** 和 **watch** 操作支持 `resourceVersion` 参数。
从 v1.19 版本开始，Kubernetes API 服务器支持 **list** 请求的 `resourceVersionMatch` 参数。

API 服务器根据你请求的操作和 `resourceVersion` 的值对 `resourceVersion` 参数进行不同的解释。
如果你设置 `resourceVersionMatch` 那么这也会影响匹配发生的方式。


<!--
### Semantics for **get** and **list**

For **get** and **list**, the semantics of `resourceVersion` are:

-->
### **get** 和 **list** 语义   {#semantics-for-get-and-list}

对于 **get** 和 **list** 而言，`resourceVersion` 的语义为：

**get:**

<!--
| resourceVersion unset | resourceVersion="0" | resourceVersion="{value other than 0}" |
|-----------------------|---------------------|----------------------------------------|
| Most Recent           | Any                 | Not older than                         |
-->
| resourceVersion 未设置 | resourceVersion="0" | resourceVersion="\<非零值\>" |
|-----------------------|---------------------|----------------------------------------|
| 最新版本               | 任何版本            | 不老于给定版本                         |

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
从 v1.19 版本开始，Kubernetes API 服务器支持 **list** 请求的 `resourceVersionMatch` 参数。
如果同时设置 `resourceVersion` 和 `resourceVersionMatch`，
则 `resourceVersionMatch` 参数确定 API 服务器如何解释 `resourceVersion`。

在 **list** 请求上设置 `resourceVersion` 时，你应该始终设置 `resourceVersionMatch` 参数。
但是，请准备好处理响应的 API 服务器不知道 `resourceVersionMatch` 并忽略它的情况。

<!--
Unless you have strong consistency requirements, using `resourceVersionMatch=NotOlderThan` and
a known `resourceVersion` is preferable since it can achieve better performance and scalability
of your cluster than leaving `resourceVersion` and `resourceVersionMatch` unset, which requires
quorum read to be served.

Setting the `resourceVersionMatch` parameter without setting `resourceVersion` is not valid.

This table explains the behavior of **list** requests with various combinations of
`resourceVersion` and `resourceVersionMatch`:
-->
除非你对一致性有着非常强烈的需求，使用 `resourceVersionMatch=NotOlderThan`
同时为 `resourceVersion` 设定一个已知值是优选的交互方式，因为与不设置
`resourceVersion` 和 `resourceVersionMatch` 相比，这种配置可以取得更好的集群性能和可扩缩性。
后者需要提供带票选能力的读操作。

设置 `resourceVersionMatch` 参数而不设置 `resourceVersion` 参数是不合法的。

下表解释了具有各种 `resourceVersion` 和 `resourceVersionMatch` 组合的 **list** 请求的行为：
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

{{< table caption="list 操作的 resourceVersionMatch 与分页参数" >}}

| resourceVersionMatch 参数               | 分页参数                        | resourceVersion 未设置  | resourceVersion="0"                     | resourceVersion="\<非零值\>"     |
|-----------------------------------------|---------------------------------|-------------------------|-----------------------------------------|----------------------------------|
| **未设置**            | **limit 未设置**                      | 最新版本                | 任意版本                                | 不老于指定版本                   |
| **未设置**            | limit=\<n\>, **continue 未设置**        | 最新版本                | 任意版本                                | 精确匹配                         |
| **未设置**           | limit=\<n\>, continue=\<token\>     | 从 token 开始、精确匹配 | 非法请求，视为从 token 开始、精确匹配  | 非法请求，返回 HTTP `400 Bad Request` |
| `resourceVersionMatch=Exact` [1]         | **limit 未设置**                      | 非法请求                | 非法请求                                | 精确匹配                         |
| `resourceVersionMatch=Exact` [1]         | limit=\<n\>, **continue 未设置**        | 非法请求                | 非法请求                                | 精确匹配                         |
| `resourceVersionMatch=NotOlderThan` [1]  | **limit 未设置**             | 非法请求                | 任意版本                                | 不老于指定版本                   |
| `resourceVersionMatch=NotOlderThan` [1]  | limit=\<n\>, **continue 未设置** | 非法请求                | 任意版本                                | 不老于指定版本                   |

{{< /table >}}

<!--
If your cluster's API server does not honor the `resourceVersionMatch` parameter,
the behavior is the same as if you did not set it.
-->
{{< note >}}
如果你的集群的 API 服务器不支持 `resourceVersionMatch` 参数，
则行为与你未设置它时相同。
{{< /note >}}

<!--
The meaning of the **get** and **list** semantics are:
-->
**get** 和 **list** 的语义是：

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
: 返回任何资源版本的数据。最新可用资源版本优先，但不需要强一致性；
  可以提供任何资源版本的数据。由于分区或过时的缓存，
  请求可能返回客户端先前观察到的更旧资源版本的数据，特别是在高可用性配置中。
  不能容忍这种情况的客户不应该使用这种语义。

最新版本
: 返回最新资源版本的数据。
  返回的数据必须一致（详细说明：通过仲裁读取从 etcd 提供）。


<!--
Not older than
: Return data at least as new as the provided `resourceVersion`. The newest
  available data is preferred, but any data not older than the provided `resourceVersion` may be
  served.  For **list** requests to servers that honor the `resourceVersionMatch` parameter, this
  guarantees that the collection's `.metadata.resourceVersion` is not older than the requested
  `resourceVersion`, but does not make any guarantee about the `.metadata.resourceVersion` of any
  of the items in that collection.
-->

不老于指定版本
: 返回数据至少与提供的 `resourceVersion` 一样新。
  最新的可用数据是首选，但可以提供不早于提供的 `resourceVersion` 的任何数据。
  对于对遵守 `resourceVersionMatch` 参数的服务器的 **list** 请求，
  这保证了集合的 `.metadata.resourceVersion` 不早于请求的 `resourceVersion`，
  但不保证该集合中任何项目的 `.metadata.resourceVersion`。

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

精确匹配
: 以提供的确切资源版本返回数据。如果提供的 `resourceVersion` 不可用，
  则服务器以 HTTP 410 “Gone”响应。对于对支持 `resourceVersionMatch` 参数的服务器的 **list** 请求，
  这可以保证集合的 `.metadata.resourceVersion` 与你在查询字符串中请求的 `resourceVersion` 相同。
  该保证不适用于该集合中任何项目的 `.metadata.resourceVersion`。

从 token 开始、精确匹配
: 返回初始分页 **list** 调用的资源版本的数据。
  返回的 **Continue 令牌**负责跟踪最初提供的资源版本，最初提供的资源版本用于在初始分页 **list** 之后的所有分页 **list** 中。


{{< note >}}
<!--
When you **list** resources and receive a collection response, the response includes the
[list metadata](/docs/reference/generated/kubernetes-api/v{{<skew currentVersion >}}/#listmeta-v1-meta) of the collection as
well as [object metadata](/docs/reference/generated/kubernetes-api/v{{<skew currentVersion >}}/#objectmeta-v1-meta)
for each item in that collection. For individual objects found within a collection response,
`.metadata.resourceVersion` tracks when that object was last updated, and not how up-to-date
the object is when served.
-->
当你 **list** 资源并收到集合响应时，
响应包括集合的[列表元数据](/docs/reference/generated/kubernetes-api/v{{<skew currentVersion >}}/#listmeta-v1-meta)。
以及该集合中每个项目的[对象元数据](/docs/reference/generated/kubernetes-api/v{{<skew currentVersion >}}/#objectmeta-v1-meta)。
对于在集合响应中找到的单个对象，`.metadata.resourceVersion` 跟踪该对象的最后更新时间，
而不是对象在服务时的最新程度。
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

当使用 `resourceVersionMatch=NotOlderThan` 并设置了限制时，
客户端必须处理 HTTP 410 “Gone” 响应。
例如，客户端可能会使用更新的 `resourceVersion` 重试或回退到 `resourceVersion=""`。

当使用 `resourceVersionMatch=Exact` 并且未设置限制时，
客户端必须验证集合的 `.metadata.resourceVersion` 是否与请求的 `resourceVersion` 匹配，
并处理不匹配的情况。例如，客户端可能会退回到设置了限制的请求。

<!--
### Semantics for **watch**

For watch, the semantics of resource version are:
-->
### **watch** 语义   {#semantics-for-watch}

对于 **watch** 操作而言，资源版本的语义如下：

**watch：**

<!--
{{< table caption="resourceVersion for watch" >}}

| resourceVersion unset               | resourceVersion="0"        | resourceVersion="{value other than 0}" |
|-------------------------------------|----------------------------|----------------------------------------|
| Get State and Start at Most Recent  | Get State and Start at Any | Start at Exact                         |

{{< /table >}}
-->

{{< table caption="watch 操作的 resourceVersion 设置" >}}

| resourceVersion 未设置    | resourceVersion="0"      | resourceVersion="\<非零值\>" |
|---------------------------|--------------------------|------------------------------|
| 读取状态并从最新版本开始  | 读取状态并从任意版本开始 | 从指定版本开始               |

{{< /table >}}

<!--
The meaning of those **watch** semantics are:

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
**watch** 操作语义的含义如下：

读取状态并从任意版本开始
: {{< caution >}}
  以这种方式初始化的监视可能会返回任意陈旧的数据。
  请在使用之前查看此语义，并尽可能支持其他语义。
  {{< /caution >}}
  在任何资源版本开始 **watch**；首选可用的最新资源版本，但不是必需的。允许任何起始资源版本。
  由于分区或过时的缓存，**watch** 可能从客户端之前观察到的更旧的资源版本开始，
  特别是在高可用性配置中。不能容忍这种明显倒带的客户不应该用这种语义启动 **watch**。
  为了建立初始状态，**watch** 从起始资源版本中存在的所有资源实例的合成 “添加” 事件开始。
  以下所有监视事件都针对在 **watch** 开始的资源版本之后发生的所有更改。

<!--
Get State and Start at Most Recent
: Start a **watch** at the most recent resource version, which must be consistent
  (in detail: served from etcd via a quorum read). To establish initial state,
  the **watch** begins with synthetic "Added" events of all resources instances
  that exist at the starting resource version. All following watch events are for
  all changes that occurred after the resource version the **watch** started at.
-->
读取状态并从最新版本开始
: 从最近的资源版本开始 **watch**，
  它必须是一致的（详细说明：通过仲裁读取从 etcd 提供服务）。
  为了建立初始状态，**watch** 从起始资源版本中存在的所有资源实例的合成 “添加” 事件开始。
  以下所有监视事件都针对在 **watch** 开始的资源版本之后发生的所有更改。

<!--
Start at Exact
: Start a **watch** at an exact resource version. The watch events are for all changes
  after the provided resource version. Unlike "Get State and Start at Most Recent"
  and "Get State and Start at Any", the **watch** is not started with synthetic
  "Added" events for the provided resource version. The client is assumed to already
  have the initial state at the starting resource version since the client provided
  the resource version.
-->
从指定版本开始
: 以确切的资源版本开始 **watch**。监视事件适用于提供的资源版本之后的所有更改。
  与 “Get State and Start at Most Recent” 和 “Get State and Start at Any” 不同，
  **watch** 不会以所提供资源版本的合成 “添加” 事件启动。
  由于客户端提供了资源版本，因此假定客户端已经具有起始资源版本的初始状态。

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
### "410 Gone" 响应     {#410-gone-responses}

服务器不需要提供所有老的资源版本，在客户端请求的是早于服务器端所保留版本的
`resourceVersion` 时，可以返回 HTTP `410 (Gone)` 状态码。
客户端必须能够容忍 `410 (Gone)` 响应。
参阅[高效检测变更](#efficient-detection-of-changes)以了解如何在监测资源时处理
`410 (Gone)` 响应。

如果所请求的 `resourceVersion` 超出了可应用的 `limit`，
那么取决于请求是否是通过高速缓存来满足的，API 服务器可能会返回一个 `410 Gone` HTTP 响应。

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
### 不可用的资源版本  {#unavailable-resource-versions}

服务器不需要提供无法识别的资源版本。
如果你请求了 **list** 或 **get** API 服务器无法识别的资源版本，则 API 服务器可能会：

* 短暂等待资源版本可用，如果提供的资源版本在合理的时间内仍不可用，
  则应超时并返回 `504 (Gateway Timeout)`；
* 使用 `Retry-After` 响应标头进行响应，指示客户端在重试请求之前应等待多少秒。

<!--
If you request a resource version that an API server does not recognize, the
kube-apiserver additionally identifies its error responses with a "Too large resource
version" message.

If you make a **watch** request for an unrecognized resource version, the API server
may wait indefinitely (until the request timeout) for the resource version to become
available.
-->
如果你请求 API 服务器无法识别的资源版本，
kube-apiserver 还会使用 “Too large resource version” 消息额外标识其错误响应。

如果你对无法识别的资源版本发出 **watch** 请求，
API 服务器可能会无限期地等待（直到请求超时）资源版本变为可用。
