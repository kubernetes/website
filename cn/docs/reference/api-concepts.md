---
title: Kubernetes API 概念
approvers:
- bgrant0607
- smarterclayton
- lavalamp
- liggitt
cn-approvers:
- chentao1596
---
<!--
---
title: Kubernetes API Concepts
approvers:
- bgrant0607
- smarterclayton
- lavalamp
- liggitt
---
-->

{% capture overview %}
<!--
This page describes common concepts in the Kubernetes API. 
-->
本页介绍了 Kubernetes API 中的常用概念。
{% endcapture %}

{% capture body %}
<!--
The Kubernetes API is a resource-based (RESTful) programmatic interface provided via HTTP. It supports retrieving, creating,
updating, and deleting primary resources via the standard HTTP verbs (POST, PUT, PATCH, DELETE, GET), includes additional subresources for many objects that allow fine grained authorization (such as binding a pod to a node), and can accept and serve those resources in different representations for convenience or efficiency. It also supports efficient change notifications on resources via "watches" and consistent lists to allow other components to effectively cache and synchronize the state of resources.
-->
Kubernetes API 是通过 HTTP 提供的基于资源（REST）的编程接口。它支持通过标准 HTTP 动词（POST，PUT，PATCH，DELETE，GET）检索、创建、更新和删除主资源，包括允许细粒度授权的许多对象的附加子资源（例如将 pod 绑定到节点）并且可以以不同的表示方式接受和服务这些资源，以方便或有效地使用。它还支持通过 "watches"  和一致列表对资源进行有效的更改通知，以允许其他组件有效缓存和同步资源状态。

<!--
## Standard API terminology
-->
## 标准 API 术语

<!--
Most Kubernetes API resource types are "objects" - they represent a concrete instance of a concept on the cluster, like a pod or namespace. A smaller number of API resource types are "virtual" - they often represent operations rather than objects, such as a permission check (use a POST with a JSON-encoded body of `SubjectAccessReview` to the `subjectaccessreviews` resource). All objects will have a unique name to allow idempotent creation and retrieval, but virtual resource types may not have unique names if they are not retrievable or do not rely on idempotency.
-->
大多数 Kubernetes API 资源类型都是 “对象” - 它们表示集群中概念的具体实例，如 pod 或命名空间。较少数量的 API 资源类型是 “虚拟” - 它们通常表示操作而不是对象，例如权限检查（使用带有 JSON 编码的 `SubjectAccessReview` 主体 POST 到 `subjectaccessreviews` 资源）。所有对象都有唯一的名称以允许幂等创建和检索，但如果虚拟资源类型不可检索或不依赖幂等性，则它们可能没有唯一名称。

<!--
Kubernetes generally leverages standard RESTful terminology to describe the API concepts:
-->
Kubernetes 通常利用标准的 RESTful 术语来描述 API 概念：

<!--
* A **resource type** is the name used in the URL (`pods`, `namespaces`, `services`)
* All resource types have a concrete representation in JSON (their object schema) which is called a **kind**
* A list of instances of a resource type is known as a **collection**
* A single instance of the resource type is called a **resource**
-->
* 一个 **资源类型** 是在 URL 中使用的名称（`pods`、`namespaces`、`services`）
* 所有资源类型在 JSON（它们的对象模式）中都有一个具体的表示形式，称为一种 **kind**
* 资源类型的实例列表被称为 **collection**
* 资源类型的单个实例称为 **resource**

<!--
All resource types are either scoped by the cluster (`/apis/GROUP/VERSION/*`) or to a namespace (`/apis/GROUP/VERSION/namespaces/NAMESPACE/*`). A namespace-scoped resource type will be deleted when its namespace is deleted and access to that resource type is controlled by authorization checks on the namespace scope. The following paths are used to retrieve collections and resources:
-->
所有资源类型以集群（`/apis/GROUP/VERSION/*`） 或命名空间（`/apis/GROUP/VERSION/namespaces/NAMESPACE/*`）为作用域。命名空间范围的资源类型在其命名空间被删除时将被删除，并且通过命名空间范围上的授权检查来控制对该资源类型的访问。以下路径用于检索集合和资源：

<!--
* Cluster-scoped resources: 
  * `GET /apis/GROUP/VERSION/RESOURCETYPE` - return the collection of resources of the resource type
  * `GET /apis/GROUP/VERSION/RESOURCETYPE/NAME` - return the resource with NAME under the resource type
-->
* 集群范围的资源：
  * `GET /apis/GROUP/VERSION/RESOURCETYPE` - 返回资源类型的资源集合
  * `GET /apis/GROUP/VERSION/RESOURCETYPE/NAME` - 在资源类型下使用 NAME 返回资源
<!--
* Namespace-scoped resources: 
  * `GET /apis/GROUP/VERSION/RESOURCETYPE` - return the collection of all instances of the resource type across all namespaces
  * `GET /apis/GROUP/VERSION/namespaces/NAMESPACE/RESOURCETYPE` - return collection of all instances of the resource type in NAMESPACE
  * `GET /apis/GROUP/VERSION/namespaces/NAMESPACE/RESOURCETYPE/NAME` - return the instance of the resource type with NAME in NAMESPACE
-->
* 命名空间范围的资源：
  * `GET /apis/GROUP/VERSION/RESOURCETYPE` - 在所有命名空间中返回资源类型的所有实例的集合
  * `GET /apis/GROUP/VERSION/namespaces/NAMESPACE/RESOURCETYPE` - 返回 NAMESPACE 中资源类型的所有实例的集合
  * `GET /apis/GROUP/VERSION/namespaces/NAMESPACE/RESOURCETYPE/NAME` - 在 NAMESPACE 中用 NAME 返回资源类型的实例

<!--
Since a namespace is a cluster-scoped resource type, you can retrieve the list of all namespaces with `GET /api/v1/namespaces` and details about a particular namespace with `GET /api/v1/namespaces/NAME`.
-->
由于命名空间是一个集群范围的资源类型，因此您可以检索所有命名空间的列表 `GET /api/v1/namespaces` 以及关于特定命名空间的详细信息 `GET /api/v1/namespaces/NAME`。

<!--
Almost all object resource types support the standard HTTP verbs - GET, POST, PUT, PATCH, and DELETE. Kubernetes uses the term **list** to describe returning a collection of resources to distinguish from retrieving a single resource which is usually called a **get**. 
-->
几乎所有的对象资源类型都支持标准的 HTTP动 词 - GET、POST、PUT、PATCH 和 DELETE。Kubernetes 使用术语 **list** 来描述返回一组资源，以区别于检索通常称为 **get** 的单个资源。

<!--
Some resource types will have one or more sub-resources, represented as sub paths below the resource:
-->
一些资源类型将具有一个或多个子资源，在资源下方表示为子路径：

<!--
* Cluster-scoped subresource: `GET /apis/GROUP/VERSION/RESOURCETYPE/NAME/SUBRESOURCE`
* Namespace-scoped subresource: `GET /apis/GROUP/VERSION/namespaces/NAMESPACE/RESOURCETYPE/NAME/SUBRESOURCE`
-->
* 集群范围的子资源：`GET /apis/GROUP/VERSION/RESOURCETYPE/NAME/SUBRESOURCE`
* 命名空间范围的子资源：`GET /apis/GROUP/VERSION/namespaces/NAMESPACE/RESOURCETYPE/NAME/SUBRESOURCE`

<!--
The verbs supported for each subresource will differ depending on the object - see the API documentation more information. It is not possible to access sub-resources across multiple resources - generally a new virtual resource type would be used if that becomes necessary.
-->
支持每个子资源的动词将根据对象而有所不同 - 请参阅 API 文档的更多信息。无法跨多个资源访问子资源 - 如果需要，通常会使用新的虚拟资源类型。

<!--
## Efficient detection of changes
-->
## 有效检测变化

<!--
To enable clients to build a model of the current state of a cluster, all Kubernetes object resource types are required to support consistent lists and an incremental change notification feed called a **watch**.  Every Kubernetes object has a `resourceVersion` field representing the version of that resource as stored in the underlying database. When retrieving a collection of resources (either namespace or cluster scoped), the response from the server will contain a `resourceVersion` value that can be used to initiate a watch against the server. The server will return all changes (creates, deletes, and updates) that occur after the supplied `resourceVersion`. This allows a client to fetch the current state and then watch for changes without missing any updates. If the client watch is disconnected they can restart a new watch from the last returned `resourceVersion`, or perform a new collection request and begin again.
-->
要使客户端能够构建集群当前状态的模型，需要所有 Kubernetes 对象资源类型支持一致的列表和增量更改通知反馈（称为 **watch**）。每个 Kubernetes 对象都有一个 `resourceVersion` 字段，表示该资源存储在底层数据库中的版本。当检索资源集合（命名空间或集群作用域）时，服务器的响应将包含 `resourceVersion` 该值可用于启动针对服务器的监视。服务器将返回所提供的 `resourceVersion` 之后的所有更改（创建、删除和更新）。这允许客户端获取当前状态，然后观察更改而不丢失任何更新。如果客户端 watch 断开连接，它们可以从上次返回的 `resourceVersion` 处重新启动一个新 watch，或者执行一个新的收集请求，然后重新开始。

<!--
For example:
-->
例如：

<!--
1. List all of the pods in a given namespace.
-->
1. 列出给定命名空间中的所有 pod。

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

<!--
2. Starting from resource version 10245, receive notifications of any creates, deletes, or updates as individual JSON objects.
-->
2. 从资源版本 10245 开始，将任何创建、删除或更新的通知作为单独的 JSON 对象接收。

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

<!--
A given Kubernetes server will only preserve a historical list of changes for a limited time. Older clusters using etcd2 preserve a maximum of 1000 changes. Newer clusters using etcd3 preserve changes in the last 5 minutes by default.  When the requested watch operations fail because the historical version of that resource is not available, clients must handle the case by recognizing the status code `410 Gone`, clearing their local cache, performing a list operation, and starting the watch from the `resourceVersion` returned by that new list operation. Most client libraries offer some form of standard tool for this logic. (In Go this is called a `Reflector` and is located in the `k8s.io/client-go/cache` package.)
-->
给定的 Kubernetes 服务器只会在有限的时间内保留历史变更列表。使用 etcd2 的旧集群最多可保留1000次更改。默认情况下，使用 etcd3 的较新集群会在最近 5 分钟内保留更改。当由于该资源的历史版本不可用而导致请求的监视操作失败时，客户端必须通过识别状态码 `410 Gone` 、清除他们的本地缓存、执行列表操作以及从该新列表操作返回的 `resourceVersion` 开始监视来处理该事件。大多数客户端库为此逻辑提供某种形式的标准工具。（在 Go 中，这称为一个 `Reflector`，位于 `k8s.io/client-go/cache` 包中。）

<!--
## Retrieving large results sets in chunks
-->
## 以块为单位检索较大的结果集

<!--
On large clusters, retrieving the collection of some resource types may result in very large responses that can impact the server and client. For instance, a cluster may have tens of thousands of pods, each of which is 1-2kb of encoded JSON. Retrieving all pods across all namespaces may result in a very large response (10-20MB) and consume a large amount of server resources. Starting in Kubernetes 1.9 the server supports the ability to break a single large collection request into many smaller chunks while preserving the consistency of the total request. Each chunk can be returned sequentially which reduces both the total size of the request and allows user-oriented clients to display results incrementally to improve responsiveness.
-->
在大型集群上，检索某些资源类型的集合可能会导致非常大的响应，从而影响服务器和客户端。例如，一个集群可能有成千上万个 pod，每个 pod 使用 JSON 编码都有 1-2kb。跨所有命名空间检索所有 pod 可能会导致非常大的响应（10-20MB）并消耗大量服务器资源。从 Kubernetes 1.9 开始，服务器支持将单个大型收集请求分成许多小块的能力，同时保持总请求的一致性。每个块可以按顺序返回，这样可以减少请求的总大小，并允许面向用户的客户端逐步显示结果以提高响应能力。

<!--
To retrieve a single list in chunks, two new parameters `limit` and `continue` are supported on collection requests and a new field `continue` is returned from all list operations in the list `metadata` field. A client should specify the maximum results they wish to receive in each chunk with `limit` and the server will return up to `limit` resources in the result and include a `continue` value if there are more resources in the collection. The client can then pass this `continue` value to the server on the next request to instruct the server to return the next chunk of results. By continuing until the server returns an empty `continue` value the client can consume the full set of results. 
-->
要以区块方式检索单个列表，在收集请求上支持两个新参数 `limit` 和 `continue` ，并且从列表的 `metadata` 字段中的所有列表操作返回一个新的字段 `continue`。客户端应该使用 `limit` 指定他们希望在每个块中接收的最大结果，并且如果集合中有更多的资源，服务器将返回结果中的 `limit` 资源，并包含一个 `continue` 值。然后，客户端可以在下一个请求中将这个 `continue` 值传递给服务器，指示服务器返回下一个结果块。通过不断继续，直到服务器返回一个空的 `continue` 值，客户端才能使用完整的结果集。

<!--
Like a watch operation, a `continue` token will expire after a short amount of time (by default 5 minutes) and return a `410 Gone` if more results cannot be returned. In this case, the client will need to start from the beginning or omit the `limit` parameter.
-->
就像 watch 操作一样，如果不能返回更多的结果，`continue` 令牌将在短时间内过期（默认为5分钟），并返回 `410 Gone`。在这种情况下，客户端需要从最开始的地方就开始，或者省略 `limit` 参数。

<!--
For example, if there are 1,253 pods on the cluster and the client wants to receive chunks of 500 pods at a time, they would request those chunks as follows:
-->
例如，如果集群上有 1,253 个 pod，并且客户端一次想要接收 500 个 pod 的块，他们将按如下方式请求这些块：

<!--
1. List all of the pods on a cluster, retrieving up to 500 pods each time.
-->
1. 列出集群中的所有 pod，每次检索最多 500 个pod。

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

<!--
2. Continue the previous call, retrieving the next set of 500 pods.
-->
2. 继续前面的请求，检索下一组 500 个pod。

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

<!--
3. Continue the previous call, retrieving the last 253 pods.
-->
3，继续前面的请求，检索最后 253 ​​个 pod。

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

<!--
Note that the `resourceVersion` of the list remains constant across each request, indicating the server is showing us a consistent snapshot of the pods. Pods that are created, updated, or deleted after version `10245` would not be shown unless the user makes a list request without the `continue` token.  This allows clients to break large requests into smaller chunks and then perform a watch operation on the full set without missing any updates.
-->
请注意，列表的 `resourceVersion` 在每个请求中都保持不变，这表明服务器正在向我们显示 pod 的一致的快照。在版本 `10245` 之后创建、更新或删除的 pod 将不会显示，除非用户在没有 `continue` 令牌的情况下提出 list 请求。这允许客户端将大请求分解成较小的块，然后在完整的集合上执行 watch 操作，而不会丢失任何更新。


<!--
## Alternate representations of resources
-->
## 资源的替代表示

<!--
By default Kubernetes returns objects serialized to JSON with content type `application/json`. This is the default serialization format for the API. However, clients may request the more efficient Protobuf representation of these objects for better performance at scale. The Kubernetes API implements standard HTTP content type negotiation: passing an `Accept` header with a `GET` call will request that the server return objects in the provided content type, while sending an object in Protobuf to the server for a `PUT` or `POST` call takes the `Content-Type` header. The server will return a `Content-Type` header if the requested format is supported, or the `406 Not acceptable` error if an invalid content type is provided.
-->
默认情况下，Kubernetes 返回序列化为 JSON 的对象，内容类型为 `application/json`。这是 API 的默认序列化格式。但是，客户端可能会请求这些对象更高效的 Protobuf 描述，以便在规模上更好地实现性能。Kubernetes API 实现了标准的 HTTP 内容类型：传递带有 `GET` 调用的 `Accept` 报头将请求服务器返回所提供的内容类型中的对象，同时将 Protobuf 中的对象带着 `Content-Type` 头发送到服务器进行 `PUT` 或者 `POST` 调用。如果支持所请求的格式，服务器将返回一个 `Content-Type` 头，如果提供了无效的内容类型，则返回 `406 Not acceptable` 的错误。

<!--
See the API documentation for a list of supported content types for each API.
-->
请参阅 API 文档以获取每种 API 支持的内容类型列表。

<!--
For example:
-->
例如：

<!--
1. List all of the pods on a cluster in Protobuf format.
-->
1. 以 Protobuf 格式列出集群中的所有 Pod。

        GET /api/v1/pods
        Accept: application/vnd.kubernetes.protobuf
        ---
        200 OK
        Content-Type: application/vnd.kubernetes.protobuf
        ... binary encoded PodList object

<!--
2. Create a pod by sending Protobuf encoded data to the server, but request a response in JSON.
-->
2. 通过将 Protobuf 编码数据发送到服务器来创建一个 pod，但是请求使用 JSON 响应。

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

<!--
Not all API resource types will support Protobuf, specifically those defined via Custom Resource Definitions or those that are API extensions. Clients that must work against all resource types should specify multiple content types in their `Accept` header to support fallback to JSON:
-->
并非所有 API 资源类型都支持 Protobuf，特别是那些通过自定义资源定义或 API 扩展定义的 API。必须针对所有资源类型工作的客户端应在其 `Accept` 报头中指定多个内容类型以支持 JSON 回退：

```
Accept: application/vnd.kubernetes.protobuf, application/json
```

<!--
### Protobuf encoding
-->
### Protobuf 编码

<!--
Kubernetes uses an envelope wrapper to encode Protobuf responses. That wrapper starts with a 4 byte magic number to help identify content in disk or in etcd as Protobuf (as opposed to JSON), and then is followed by a Protobuf encoded wrapper message, which describes the encoding and type of the underlying object and then contains the object.
-->
Kubernetes 使用信封包装器来编码 Protobuf 响应。该包装器以 4 字节的魔术数字开始，以帮助识别磁盘或 etcd 中的内容为 Protobuf（与 JSON 相反），然后是 Protobuf 编码的包装消息，该消息描述底层对象的编码和类型，然后包含该对象。
<!--
The wrapper format is:
-->
包装格式是：

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

<!--
Clients that receive a response in `application/vnd.kubernetes.protobuf` that does not match the expected prefix should reject the response, as future versions may need to alter the serialization format in an incompatible way and will do so by changing the prefix.
-->
接收到 `application/vnd.kubernetes.protobuf` 与该预期前缀不匹配的客户端应拒绝该响应，因为将来的版本可能需要以不兼容的方式更改序列化格式，并且将通过更改前缀来实现。

{% endcapture %}

{% include templates/concept.md %}
