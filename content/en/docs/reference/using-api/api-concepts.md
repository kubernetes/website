---
title: Kubernetes API Concepts
reviewers:
- smarterclayton
- lavalamp
- liggitt
content_type: concept
weight: 20
---

<!-- overview -->
The Kubernetes API is a resource-based (RESTful) programmatic interface
provided via HTTP. It supports retrieving, creating, updating, and deleting
primary resources via the standard HTTP verbs (POST, PUT, PATCH, DELETE,
GET).

For some resources, the API includes additional subresources that allow
fine grained authorization (such as separate views for Pod details and
log retrievals), and can accept and serve those resources in different
representations for convenience or efficiency.

Kubernetes supports efficient change notifications on resources via
_watches_:
{{< glossary_definition prepend="in the Kubernetes API, watch is" term_id="watch" length="short" >}}
Kubernetes also provides consistent list operations so that API clients can
effectively cache, track, and synchronize the state of resources.

You can view the [API reference](/docs/reference/kubernetes-api/) online,
or read on to learn about the API in general.

<!-- body -->
## Kubernetes API terminology {#standard-api-terminology}

Kubernetes generally leverages common RESTful terminology to describe the
API concepts:

* A *resource type* is the name used in the URL (`pods`, `namespaces`, `services`)
* All resource types have a concrete representation (their object schema) which is called a *kind*
* A list of instances of a resource type is known as a *collection*
* A single instance of a resource type is called a *resource*, and also usually represents an *object*
* For some resource types, the API includes one or more *sub-resources*, which are represented as URI paths below the resource

Most Kubernetes API resource types are
{{< glossary_tooltip text="objects" term_id="object" >}} –
they represent a concrete instance of a concept on the cluster, like a
pod or namespace. A smaller number of API resource types are *virtual* in
that they often represent operations on objects, rather than objects, such
as a permission check
(use a POST with a JSON-encoded body of `SubjectAccessReview` to the
`subjectaccessreviews` resource), or the `eviction` sub-resource of a Pod
(used to trigger
[API-initiated eviction](/docs/concepts/scheduling-eviction/api-eviction/)).

### Object names

All objects you can create via the API have a unique object
{{< glossary_tooltip text="name" term_id="name" >}} to allow idempotent creation and
retrieval, except that virtual resource types may not have unique names if they are
not retrievable, or do not rely on idempotency.
Within a {{< glossary_tooltip text="namespace" term_id="namespace" >}}, only one object
of a given kind can have a given name at a time. However, if you delete the object,
you can make a new object with the same name. Some objects are not namespaced (for
example: Nodes), and so their names must be unique across the whole cluster.

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


## Resource URIs

All resource types are either scoped by the cluster (`/apis/GROUP/VERSION/*`) or to a
namespace (`/apis/GROUP/VERSION/namespaces/NAMESPACE/*`). A namespace-scoped resource
type will be deleted when its namespace is deleted and access to that resource type
is controlled by authorization checks on the namespace scope.

Note: core resources use `/api` instead of `/apis` and omit the GROUP path segment.

Examples:
* `/api/v1/namespaces`
* `/api/v1/pods`
* `/api/v1/namespaces/my-namespace/pods`
* `/apis/apps/v1/deployments`
* `/apis/apps/v1/namespaces/my-namespace/deployments`
* `/apis/apps/v1/namespaces/my-namespace/deployments/my-deployment`

You can also access collections of resources (for example: listing all Nodes).
The following paths are used to retrieve collections and resources:

* Cluster-scoped resources:

  * `GET /apis/GROUP/VERSION/RESOURCETYPE` - return the collection of resources of the resource type
  * `GET /apis/GROUP/VERSION/RESOURCETYPE/NAME` - return the resource with NAME under the resource type

* Namespace-scoped resources:

  * `GET /apis/GROUP/VERSION/RESOURCETYPE` - return the collection of all instances of the resource type across all namespaces
  * `GET /apis/GROUP/VERSION/namespaces/NAMESPACE/RESOURCETYPE` - return collection of all instances of the resource type in NAMESPACE
  * `GET /apis/GROUP/VERSION/namespaces/NAMESPACE/RESOURCETYPE/NAME` - return the instance of the resource type with NAME in NAMESPACE

Since a namespace is a cluster-scoped resource type, you can retrieve the list
(“collection”) of all namespaces with `GET /api/v1/namespaces` and details about
a particular namespace with `GET /api/v1/namespaces/NAME`.

* Cluster-scoped subresource: `GET /apis/GROUP/VERSION/RESOURCETYPE/NAME/SUBRESOURCE`
* Namespace-scoped subresource: `GET /apis/GROUP/VERSION/namespaces/NAMESPACE/RESOURCETYPE/NAME/SUBRESOURCE`

The verbs supported for each subresource will differ depending on the object -
see the [API reference](/docs/reference/kubernetes-api/) for more information. It
is not possible to access sub-resources across multiple resources - generally a new
virtual resource type would be used if that becomes necessary.


## Efficient detection of changes

The Kubernetes API allows clients to make an initial request for an object or a
collection, and then to track changes since that initial request: a **watch**. Clients
can send a **list** or a **get** and then make a follow-up **watch** request.

To make this change tracking possible, every Kubernetes object has a `resourceVersion`
field representing the version of that resource as stored in the underlying persistence
layer. When retrieving a collection of resources (either namespace or cluster scoped),
the response from the API server contains a `resourceVersion` value. The client can
use that `resourceVersion` to initiate a **watch** against the API server.

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

1. List all of the pods in a given namespace.

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

2. Starting from resource version 10245, receive notifications of any API operations
   (such as **create**, **delete**, **patch** or **update**) that affect Pods in the
   _test_ namespace. Each change notification is a JSON document. The HTTP response body
   (served as `application/json`) consists a series of JSON documents.

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

A given Kubernetes server will only preserve a historical record of changes for a
limited time. Clusters using etcd 3 preserve changes in the last 5 minutes by default.
When the requested **watch** operations fail because the historical version of that
resource is not available, clients must handle the case by recognizing the status code
`410 Gone`, clearing their local cache, performing a new **get** or **list** operation,
and starting the **watch** from the `resourceVersion` that was returned.

For subscribing to collections, Kubernetes client libraries typically offer some form
of standard tool for this **list**-then-**watch** logic. (In the Go client library,
this is called a `Reflector` and is located in the `k8s.io/client-go/tools/cache` package.)

### Watch bookmarks {#watch-bookmarks}

To mitigate the impact of short history window, the Kubernetes API provides a watch
event named `BOOKMARK`. It is a special kind of event to mark that all changes up
to a given `resourceVersion` the client is requesting have already been sent. The
document representing the `BOOKMARK` event is of the type requested by the request,
but only includes a `.metadata.resourceVersion` field. For example:

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

As a client, you can request `BOOKMARK` events by setting the
`allowWatchBookmarks=true` query parameter to a **watch** request, but you shouldn't
assume bookmarks are returned at any specific interval, nor can clients assume that
the API server will send any `BOOKMARK` event even when requested.

## Streaming lists

{{< feature-state feature_gate_name="WatchList" >}}

On large clusters, retrieving the collection of some resource types may result in
a significant increase of resource usage (primarily RAM) on the control plane.
In order to alleviate its impact and simplify the user experience of the **list** + **watch**
pattern, Kubernetes v1.27 introduces as an alpha feature the support
for requesting the initial state (previously requested via the **list** request) as part of
the **watch** request.

Provided that the `WatchList` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
is enabled, this can be achieved by specifying `sendInitialEvents=true` as query string parameter
in a **watch** request. If set, the API server starts the watch stream with synthetic init
events (of type `ADDED`) to build the whole state of all existing objects followed by a
[`BOOKMARK` event](/docs/reference/using-api/api-concepts/#watch-bookmarks)
(if requested via `allowWatchBookmarks=true` option). The bookmark event includes the resource version
to which is synced. After sending the bookmark event, the API server continues as for any other **watch**
request.

When you set `sendInitialEvents=true` in the query string, Kubernetes also requires that you set
`resourceVersionMatch` to `NotOlderThan` value.
If you provided `resourceVersion` in the query string without providing a value or don't provide
it at all, this is interpreted as a request for _consistent read_;
the bookmark event is sent when the state is synced at least to the moment of a consistent read
from when the request started to be processed. If you specify `resourceVersion` (in the query string),
the bookmark event is sent when the state is synced at least to the provided resource version.

### Example {#example-streaming-lists}

An example: you want to watch a collection of Pods. For that collection, the current resource version
is 10245 and there are two pods: `foo` and `bar`. Then sending the following request (explicitly requesting
_consistent read_ by setting empty resource version using `resourceVersion=`) could result
in the following sequence of events:

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

## Response compression

{{< feature-state feature_gate_name="APIResponseCompression" >}}

`APIResponseCompression` is an option that allows the API server to compress the responses for **get**
and **list** requests, reducing the network bandwidth and improving the performance of large-scale clusters.
It is enabled by default since Kubernetes 1.16 and it can be disabled by including
`APIResponseCompression=false` in the `--feature-gates` flag on the API server.

API response compression can significantly reduce the size of the response, especially for large resources or
[collections](/docs/reference/using-api/api-concepts/#collections).
For example, a **list** request for pods can return hundreds of kilobytes or even megabytes of data,
depending on the number of pods and their attributes. By compressing the response, the network bandwidth
can be saved and the latency can be reduced.

To verify if `APIResponseCompression` is working, you can send a **get** or **list** request to the
API server with an `Accept-Encoding` header, and check the response size and headers. For example:

```
GET /api/v1/pods
Accept-Encoding: gzip
---
200 OK
Content-Type: application/json
content-encoding: gzip
...
```

The `content-encoding` header indicates that the response is compressed with `gzip`.

## Retrieving large results sets in chunks

{{< feature-state feature_gate_name="APIListChunking" >}}

On large clusters, retrieving the collection of some resource types may result in
very large responses that can impact the server and client. For instance, a cluster
may have tens of thousands of Pods, each of which is equivalent to roughly 2 KiB of
encoded JSON. Retrieving all pods across all namespaces may result in a very large
response (10-20MB) and consume a large amount of server resources.

The Kubernetes API server supports the ability to break a single large collection request
into many smaller chunks while preserving the consistency of the total request. Each
chunk can be returned sequentially which reduces both the total size of the request and
allows user-oriented clients to display results incrementally to improve responsiveness.

You can request that the API server handles a **list** by serving single collection
using pages (which Kubernetes calls _chunks_). To retrieve a single collection in
chunks, two query parameters `limit` and `continue` are supported on requests against
collections, and a response field `continue` is returned from all **list** operations
in the collection's `metadata` field. A client should specify the maximum results they
wish to receive in each chunk with `limit` and the server will return up to `limit`
resources in the result and include a `continue` value if there are more resources
in the collection.

As an API client, you can then pass this `continue` value to the API server on the
next request, to instruct the server to return the next page (_chunk_) of results. By
continuing until the server returns an empty `continue` value, you can retrieve the
entire collection.

Like a **watch** operation, a `continue` token will expire after a short amount
of time (by default 5 minutes) and return a `410 Gone` if more results cannot be
returned. In this case, the client will need to start from the beginning or omit the
`limit` parameter.

For example, if there are 1,253 pods on the cluster and you want to receive chunks
of 500 pods at a time, request those chunks as follows:

1. List all of the pods on a cluster, retrieving up to 500 pods each time.

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

2. Continue the previous call, retrieving the next set of 500 pods.

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

3. Continue the previous call, retrieving the last 253 pods.

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

Notice that the `resourceVersion` of the collection remains constant across each request,
indicating the server is showing you a consistent snapshot of the pods. Pods that
are created, updated, or deleted after version `10245` would not be shown unless
you make a separate **list** request without the `continue` token.  This allows you
to break large requests into smaller chunks and then perform a **watch** operation
on the full set without missing any updates.

`remainingItemCount` is the number of subsequent items in the collection that are not
included in this response. If the **list** request contained label or field
{{< glossary_tooltip text="selectors" term_id="selector">}} then the number of
remaining items is unknown and the API server does not include a `remainingItemCount`
field in its response.
If the **list** is complete (either because it is not chunking, or because this is the
last chunk), then there are no more remaining items and the API server does not include a
`remainingItemCount` field in its response. The intended use of the `remainingItemCount`
is estimating the size of a collection.

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

There are dozens of collection types (such as `PodList`, `ServiceList`,
and `NodeList`) defined in the Kubernetes API.
You can get more information about each collection type from the
[Kubernetes API](/docs/reference/kubernetes-api/) documentation.

Some tools, such as `kubectl`, represent the Kubernetes collection
mechanism slightly differently from the Kubernetes API itself.
Because the output of `kubectl` might include the response from
multiple **list** operations at the API level, `kubectl` represents
a list of items using `kind: List`. For example:

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
Keep in mind that the Kubernetes API does not have a `kind` named `List`.

`kind: List` is a client-side, internal implementation detail for processing
collections that might be of different kinds of object. Avoid depending on
`kind: List` in automation or other code.
{{< /note >}}

## Receiving resources as Tables

When you run `kubectl get`, the default output format is a simple tabular
representation of one or more instances of a particular resource type. In the past,
clients were required to reproduce the tabular and describe output implemented in
`kubectl` to perform simple lists of objects.
A few limitations of that approach include non-trivial logic when dealing with
certain objects. Additionally, types provided by API aggregation or third party
resources are not known at compile time. This means that generic implementations
had to be in place for types unrecognized by a client.

In order to avoid potential limitations as described above, clients may request
the Table representation of objects, delegating specific details of printing to the
server. The Kubernetes API implements standard HTTP content type negotiation: passing
an `Accept` header containing a value of `application/json;as=Table;g=meta.k8s.io;v=v1`
with a `GET` call will request that the server return objects in the Table content
type.

For example, list all of the pods on a cluster in the Table format.

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

For API resource types that do not have a custom Table definition known to the control
plane, the API server returns a default Table response that consists of the resource's
`name` and `creationTimestamp` fields.

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

Not all API resource types support a Table response; for example, a
{{< glossary_tooltip term_id="CustomResourceDefinition" text="CustomResourceDefinitions" >}}
might not define field-to-table mappings, and an APIService that
[extends the core Kubernetes API](/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/)
might not serve Table responses at all. If you are implementing a client that
uses the Table information and must work against all resource types, including
extensions, you should make requests that specify multiple content types in the
`Accept` header. For example:

```
Accept: application/json;as=Table;g=meta.k8s.io;v=v1, application/json
```

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

The server will return a response with a `Content-Type` header if the requested
format is supported, or the `406 Not acceptable` error if none of the media types you
requested are supported. All built-in resource types support the `application/json`
media type.

See the Kubernetes [API reference](/docs/reference/kubernetes-api/) for a list of
supported content types for each API.

For example:

1. List all of the pods on a cluster in Protobuf format.

   ```
   GET /api/v1/pods
   Accept: application/vnd.kubernetes.protobuf
   ---
   200 OK
   Content-Type: application/vnd.kubernetes.protobuf

   ... binary encoded PodList object
   ```

1. Create a pod by sending Protobuf encoded data to the server, but request a response
   in JSON.

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

Not all API resource types support Protobuf; specifically, Protobuf isn't available for
resources that are defined as
{{< glossary_tooltip term_id="CustomResourceDefinition" text="CustomResourceDefinitions" >}}
or are served via the
{{< glossary_tooltip text="aggregation layer" term_id="aggregation-layer" >}}.
As a client, if you might need to work with extension types you should specify multiple
content types in the request `Accept` header to support fallback to JSON.
For example:

```
Accept: application/vnd.kubernetes.protobuf, application/json
```

### Kubernetes Protobuf encoding {#protobuf-encoding}

Kubernetes uses an envelope wrapper to encode Protobuf responses. That wrapper starts
with a 4 byte magic number to help identify content in disk or in etcd as Protobuf
(as opposed to JSON), and then is followed by a Protobuf encoded wrapper message, which
describes the encoding and type of the underlying object and then contains the object.

The wrapper format is:

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

{{< note >}}
Clients that receive a response in `application/vnd.kubernetes.protobuf` that does
not match the expected prefix should reject the response, as future versions may need
to alter the serialization format in an incompatible way and will do so by changing
the prefix.
{{< /note >}}

## Resource deletion

When you **delete** a resource this takes place in two phases.

1. _finalization_
2. removal

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


## Single resource API

The Kubernetes API verbs **get**, **create**, **update**, **patch**,
**delete** and **proxy** support single resources only.
These verbs with single resource support have no support for submitting multiple
resources together in an ordered or unordered list or transaction.

When clients (including kubectl) act on a set of resources, the client makes a series
of single-resource API requests, then aggregates the responses if needed.

By contrast, the Kubernetes API verbs **list** and **watch** allow getting multiple
resources, and **deletecollection** allows deleting multiple resources.

## Field validation

Kubernetes always validates the type of fields. For example, if a field in the
API is defined as a number, you cannot set the field to a text value. If a field
is defined as an array of strings, you can only provide an array. Some fields
allow you to omit them, other fields are required. Omitting a required field
from an API request is an error.

If you make a request with an extra field, one that the cluster's control plane
does not recognize, then the behavior of the API server is more complicated.

By default, the API server drops fields that it does not recognize
from an input that it receives (for example, the JSON body of a `PUT` request).

There are two situations where the API server drops fields that you supplied in
an HTTP request.

These situations are:

1. The field is unrecognized because it is not in the resource's OpenAPI schema. (One
   exception to this is for {{< glossary_tooltip
   term_id="CustomResourceDefinition" text="CRDs" >}} that explicitly choose not to prune unknown
   fields via `x-kubernetes-preserve-unknown-fields`).
2. The field is duplicated in the object.

### Validation for unrecognized or duplicate fields {#setting-the-field-validation-level}

{{< feature-state feature_gate_name="ServerSideFieldValidation" >}}

From 1.25 onward, unrecognized or duplicate fields in an object are detected via
validation on the server when you use HTTP verbs that can submit data (`POST`, `PUT`, and `PATCH`). Possible levels of
validation are `Ignore`, `Warn` (default), and `Strict`.

`Ignore`
: The API server succeeds in handling the request as it would without the erroneous fields
being set, dropping all unknown and duplicate fields and giving no indication it
has done so.

`Warn`
: (Default) The API server succeeds in handling the request, and reports a
warning to the client. The warning is sent using the `Warning:` response header,
adding one warning item for each unknown or duplicate field. For more
information about warnings and the Kubernetes API, see the blog article
[Warning: Helpful Warnings Ahead](/blog/2020/09/03/warnings/).

`Strict`
: The API server rejects the request with a 400 Bad Request error when it
detects any unknown or duplicate fields. The response message from the API
server specifies all the unknown or duplicate fields that the API server has
detected.

The field validation level is set by the `fieldValidation` query parameter.

{{< note >}}
If you submit a request that specifies an unrecognized field, and that is also invalid for
a different reason (for example, the request provides a string value where the API expects
an integer for a known field), then the API server responds with a 400 Bad Request error, but will
not provide any information on unknown or duplicate fields (only which fatal
error it encountered first).

You always receive an error response in this case, no matter what field validation level you requested.
{{< /note >}}

Tools that submit requests to the server (such as `kubectl`), might set their own
defaults that are different from the `Warn` validation level that the API server uses
by default.

The `kubectl` tool uses the `--validate` flag to set the level of field
validation. It accepts the values `ignore`, `warn`, and `strict` while
also accepting the values `true` (equivalent to `strict`) and `false`
(equivalent to `ignore`). The default validation setting for kubectl is
`--validate=true`, which means strict server-side field validation.

When kubectl cannot connect to an API server with field validation (API servers
prior to Kubernetes 1.27), it will fall back to using client-side validation.
Client-side validation will be removed entirely in a future version of kubectl.

{{< note >}}

Prior to Kubernetes 1.25  `kubectl --validate` was used to toggle client-side validation on or off as
a boolean flag.

{{< /note >}}

## Dry-run

{{< feature-state feature_gate_name="DryRun" >}}

When you use HTTP verbs that can modify resources (`POST`, `PUT`, `PATCH`, and
`DELETE`), you can submit your request in a _dry run_ mode. Dry run mode helps to
evaluate a request through the typical request stages (admission chain, validation,
merge conflicts) up until persisting objects to storage. The response body for the
request is as close as possible to a non-dry-run response. Kubernetes guarantees that
dry-run requests will not be persisted in storage or have any other side effects.

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


When you set `?dryRun=All`, any relevant
{{< glossary_tooltip text="admission controllers" term_id="admission-controller" >}}
are run, validating admission controllers check the request post-mutation, merge is
performed on `PATCH`, fields are defaulted, and schema validation occurs. The changes
are not persisted to the underlying storage, but the final object which would have
been persisted is still returned to the user, along with the normal status code.

If the non-dry-run version of a request would trigger an admission controller that has
side effects, the request will be failed rather than risk an unwanted side effect. All
built in admission control plugins support dry-run. Additionally, admission webhooks can
declare in their
[configuration object](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#validatingwebhook-v1-admissionregistration-k8s-io)
that they do not have side effects, by setting their `sideEffects` field to `None`.

{{< note >}}
If a webhook actually does have side effects, then the `sideEffects` field should be
set to "NoneOnDryRun". That change is appropriate provided that the webhook is also
be modified to understand the `DryRun` field in AdmissionReview, and to prevent side
effects on any request marked as dry runs.
{{< /note >}}

Here is an example dry-run request that uses `?dryRun=All`:

```
POST /api/v1/namespaces/test/pods?dryRun=All
Content-Type: application/json
Accept: application/json
```

The response would look the same as for non-dry-run request, but the values of some
generated fields may differ.


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

### Dry-run authorization

Authorization for dry-run and non-dry-run requests is identical. Thus, to make
a dry-run request, you must be authorized to make the non-dry-run request.

For example, to run a dry-run **patch** for a Deployment, you must be authorized
to perform that **patch**. Here is an example of a rule for Kubernetes
{{< glossary_tooltip text="RBAC" term_id="rbac">}} that allows patching
Deployments:

```yaml
rules:
- apiGroups: ["apps"]
  resources: ["deployments"]
  verbs: ["patch"]
```

See [Authorization Overview](/docs/reference/access-authn-authz/authorization/).

## Updates to existing resources {#patch-and-apply}

Kubernetes provides several ways to update existing objects.
You can read [choosing an update mechanism](#update-mechanism-choose) to
learn about which approach might be best for your use case.

You can overwrite (**update**) an existing resource - for example, a ConfigMap -
using an HTTP PUT. For a PUT request, it is the client's responsibility to specify
the `resourceVersion` (taking this from the object being updated). Kubernetes uses
that `resourceVersion` information so that the API server can detect lost updates
and reject requests made by a client that is out of date with the cluster.
In the event that the resource has changed (the `resourceVersion` the client
provided is stale), the API server returns a `409 Conflict` error response.

Instead of sending a PUT request, the client can send an instruction to the API
server to **patch** an existing resource. A **patch** is typically appropriate
if the change that the client wants to make isn't conditional on the existing data. Clients that need effective detection of lost updates should consider
making their request conditional on the existing `resourceVersion` (either HTTP PUT or HTTP PATCH),
and then handle any retries that are needed in case there is a conflict.

The Kubernetes API supports four different PATCH operations, determined by their
corresponding HTTP `Content-Type` header:

`application/apply-patch+yaml`
: Server Side Apply YAML (a Kubernetes-specific extension, based on YAML).
  All JSON documents are valid YAML, so you can also submit JSON using this
  media type. See [Server Side Apply serialization](/docs/reference/using-api/server-side-apply/#serialization)
  for more details.  
  To Kubernetes, this is a **create** operation if the object does not exist,
  or a **patch** operation if the object already exists.

`application/json-patch+json`
: JSON Patch, as defined in [RFC6902](https://tools.ietf.org/html/rfc6902).
  A JSON patch is a sequence of operations that are executed on the resource;
  for example `{"op": "add", "path": "/a/b/c", "value": [ "foo", "bar" ]}`.  
  To Kubernetes, this is a **patch** operation.
  
  A **patch** using `application/json-patch+json` can include conditions to
  validate consistency, allowing the operation to fail if those conditions
  are not met (for example, to avoid a lost update).

`application/merge-patch+json`
: JSON Merge Patch, as defined in [RFC7386](https://tools.ietf.org/html/rfc7386).
  A JSON Merge Patch is essentially a partial representation of the resource.
  The submitted JSON is combined with the current resource to create a new one,
  then the new one is saved.  
  To Kubernetes, this is a **patch** operation.

`application/strategic-merge-patch+json`
: Strategic Merge Patch (a Kubernetes-specific extension based on JSON).
  Strategic Merge Patch is a custom implementation of JSON Merge Patch.
  You can only use Strategic Merge Patch with built-in APIs, or with aggregated
  API servers that have special support for it. You cannot use
  `application/strategic-merge-patch+json` with any API
  defined using a {{< glossary_tooltip term_id="CustomResourceDefinition" text="CustomResourceDefinition" >}}.
  
  {{< note >}}
  The Kubernetes _server side apply_ mechanism has superseded Strategic Merge
  Patch.
  {{< /note >}}


Kubernetes' [Server Side Apply](/docs/reference/using-api/server-side-apply/)
feature allows the control plane to track managed fields for newly created objects.
Server Side Apply provides a clear pattern for managing field conflicts,
offers server-side **apply** and **update** operations, and replaces the
client-side functionality of `kubectl apply`.

For Server-Side Apply, Kubernetes treats the request as a **create** if the object
does not yet exist, and a **patch** otherwise. For other requests that use PATCH
at the HTTP level, the logical Kubernetes operation is always **patch**.

See [Server Side Apply](/docs/reference/using-api/server-side-apply/) for more details.

### Choosing an update mechanism {#update-mechanism-choose}

#### HTTP PUT to replace existing resource {#update-mechanism-update}

The **update** (HTTP `PUT`) operation is simple to implement and flexible,
but has drawbacks:

* You need to handle conflicts where the `resourceVersion` of the object changes
  between your client reading it and trying to write it back. Kubernetes always
  detects the conflict, but you as the client author need to implement retries.
* You might accidentally drop fields if you decode an object locally (for example,
  using client-go, you could receive fields that your client does not know how to
  handle - and then drop them as part of your update.
* If there's a lot of contention on the object (even on a field, or set of fields,
  that you're not trying to edit), you might have trouble sending the update.
  The problem is worse for larger objects and for objects with many fields.

#### HTTP PATCH using JSON Patch {#update-mechanism-json-patch}

A **patch** update is helpful, because:

* As you're only sending differences, you have less data to send in the `PATCH`
  request.
* You can make changes that rely on existing values, such as copying the
  value of a particular field into an annotation.
* Unlike with an **update** (HTTP `PUT`), making your change can happen right away
  even if there are frequent changes to unrelated fields): you usually would
  not need to retry.
  * You might still need to specify the `resourceVersion` (to match an existing object)
    if you want to be extra careful to avoid lost updates
  * It's still good practice to write in some retry logic in case of errors.
* You can use test conditions to careful craft specific update conditions.
  For example, you can increment a counter without reading it if the existing
  value matches what you expect. You can do this with no lost update risk,
  even if the object has changed in other ways since you last wrote to it.
  (If the test condition fails, you can fall back to reading the current value
  and then write back the changed number).

However:

* you need more local (client) logic to build the patch; it helps a lot if you have
  a library implementation of JSON Patch, or even for making a JSON Patch specifically against Kubernetes
* as the author of client software, you need to be careful when building the patch
  (the HTTP request body) not to drop fields (the order of operations matters)

#### HTTP PATCH using Server-Side Apply {#update-mechanism-server-side-apply}

Server-Side Apply has some clear benefits:

* A single round trip: it rarely requires making a `GET` request first.
  * and you can still detect conflicts for unexpected changes
  * you have the option to force override a conflict, if appropriate
* Client implementations are easy to make
* You get an atomic create-or-update operation without extra effort
  (similar to `UPSERT` in some SQL dialects)

However:

* Server-Side Apply does not work at all for field changes that depend on a current value of the object
* You can only apply updates to objects. Some resources in the Kubernetes HTTP API are
  not objects (they do not have a `.metadata` field), and Server-Side Apply
  is only relevant for Kubernetes objects.

## Resource versions

Resource versions are strings that identify the server's internal version of an
object. Resource versions can be used by clients to determine when objects have
changed, or to express data consistency requirements when getting, listing and
watching resources. Resource versions must be treated as opaque by clients and passed
unmodified back to the server.

You must not assume resource versions are numeric or collatable. API clients may
only compare two resource versions for equality (this means that you must not compare
resource versions for greater-than or less-than relationships).

### `resourceVersion` fields in metadata {#resourceversion-in-metadata}

Clients find resource versions in resources, including the resources from the response
stream for a **watch**, or when using **list** to enumerate resources.

[v1.meta/ObjectMeta](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#objectmeta-v1-meta) - The `metadata.resourceVersion` of a resource instance identifies the resource version the instance was last modified at.

[v1.meta/ListMeta](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#listmeta-v1-meta) - The `metadata.resourceVersion` of a resource collection (the response to a **list**) identifies the resource version at which the collection was constructed.

### `resourceVersion` parameters in query strings {#the-resourceversion-parameter}

The **get**, **list**, and **watch** operations support the `resourceVersion` parameter.
From version v1.19, Kubernetes API servers also support the `resourceVersionMatch`
parameter on _list_ requests.

The API server interprets the `resourceVersion` parameter differently depending
on the operation you request, and on the value of `resourceVersion`. If you set
`resourceVersionMatch` then this also affects the way matching happens.

### Semantics for **get** and **list**

For **get** and **list**, the semantics of `resourceVersion` are:

**get:**

| resourceVersion unset | resourceVersion="0" | resourceVersion="{value other than 0}" |
|-----------------------|---------------------|----------------------------------------|
| Most Recent           | Any                 | Not older than                         |

**list:**

From version v1.19, Kubernetes API servers support the `resourceVersionMatch` parameter
on _list_ requests. If you set both `resourceVersion` and `resourceVersionMatch`, the
`resourceVersionMatch` parameter determines how the API server interprets
`resourceVersion`.

You should always set the `resourceVersionMatch` parameter when setting
`resourceVersion` on a **list** request. However, be prepared to handle the case
where the API server that responds is unaware of `resourceVersionMatch`
and ignores it.

Unless you have strong consistency requirements, using `resourceVersionMatch=NotOlderThan` and
a known `resourceVersion` is preferable since it can achieve better performance and scalability
of your cluster than leaving `resourceVersion` and `resourceVersionMatch` unset, which requires
quorum read to be served.

Setting the `resourceVersionMatch` parameter without setting `resourceVersion` is not valid.


This table explains the behavior of **list** requests with various combinations of
`resourceVersion` and `resourceVersionMatch`:

{{< table caption="resourceVersionMatch and paging parameters for list" >}}

| resourceVersionMatch param            | paging params                 | resourceVersion not set | resourceVersion="0"                       | resourceVersion="{value other than 0}" |
|---------------------------------------|-------------------------------|-----------------------|-------------------------------------------|----------------------------------------|
| _unset_            | _limit unset_                   | Most Recent           | Any                                       | Not older than                         |
| _unset_            | limit=\<n\>, _continue unset_     | Most Recent           | Any                                       | Exact                                  |
| _unset_            | limit=\<n\>, continue=\<token\> | Continue Token, Exact | Invalid, treated as Continue Token, Exact | Invalid, HTTP `400 Bad Request`        |
| `resourceVersionMatch=Exact`        | _limit unset_                 | Invalid               | Invalid                                   | Exact                                  |
| `resourceVersionMatch=Exact`        | limit=\<n\>, _continue unset_ | Invalid               | Invalid                                   | Exact                                  |
| `resourceVersionMatch=NotOlderThan` | _limit unset_                 | Invalid               | Any                                       | Not older than                         |
| `resourceVersionMatch=NotOlderThan` | limit=\<n\>, _continue unset_ | Invalid               | Any                                       | Not older than                         |

{{< /table >}}

{{< note >}}
If your cluster's API server does not honor the `resourceVersionMatch` parameter,
the behavior is the same as if you did not set it.
{{< /note >}}

The meaning of the **get** and **list** semantics are:

Any
: Return data at any resource version. The newest available resource version is preferred,
  but strong consistency is not required; data at any resource version may be served. It is possible
  for the request to return data at a much older resource version that the client has previously
  observed, particularly in high availability configurations, due to partitions or stale
  caches. Clients that cannot tolerate this should not use this semantic.

Most recent
: Return data at the most recent resource version. The returned data must be
  consistent (in detail: served from etcd via a quorum read).
  For etcd v3.4.31+ and v3.5.13+ Kubernetes {{< skew currentVersion >}} serves “most recent” reads from the _watch cache_:
  an internal, in-memory store within the API server that caches and mirrors the state of data
  persisted into etcd. Kubernetes requests progress notification to maintain cache consistency against
  the etcd persistence layer. Kubernetes versions v1.28 through to v1.30 also supported this
  feature, although as Alpha it was not recommended for production nor enabled by default until the v1.31 release.

Not older than
: Return data at least as new as the provided `resourceVersion`. The newest
  available data is preferred, but any data not older than the provided `resourceVersion` may be
  served.  For **list** requests to servers that honor the `resourceVersionMatch` parameter, this
  guarantees that the collection's `.metadata.resourceVersion` is not older than the requested
  `resourceVersion`, but does not make any guarantee about the `.metadata.resourceVersion` of any
  of the items in that collection.

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

{{< note >}}
When you **list** resources and receive a collection response, the response includes the
[list metadata](/docs/reference/generated/kubernetes-api/v{{<skew currentVersion >}}/#listmeta-v1-meta)
of the collection as well as
[object metadata](/docs/reference/generated/kubernetes-api/v{{<skew currentVersion >}}/#objectmeta-v1-meta)
for each item in that collection. For individual objects found within a collection response,
`.metadata.resourceVersion` tracks when that object was last updated, and not how up-to-date
the object is when served.
{{< /note >}}

When using `resourceVersionMatch=NotOlderThan` and limit is set, clients must
handle HTTP 410 "Gone" responses. For example, the client might retry with a
newer `resourceVersion` or fall back to `resourceVersion=""`.

When using `resourceVersionMatch=Exact` and `limit` is unset, clients must
verify that the collection's `.metadata.resourceVersion` matches
the requested `resourceVersion`, and handle the case where it does not. For
example, the client might fall back to a request with `limit` set.

### Semantics for **watch**

For **watch**, the semantics of resource version are:

**watch:**

{{< table caption="resourceVersion for watch" >}}

| resourceVersion unset               | resourceVersion="0"        | resourceVersion="{value other than 0}" |
|-------------------------------------|----------------------------|----------------------------------------|
| Get State and Start at Most Recent  | Get State and Start at Any | Start at Exact                         |

{{< /table >}}

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

Get State and Start at Most Recent
: Start a **watch** at the most recent resource version, which must be consistent
  (in detail: served from etcd via a quorum read). To establish initial state,
  the **watch** begins with synthetic "Added" events of all resources instances
  that exist at the starting resource version. All following watch events are for
  all changes that occurred after the resource version the **watch** started at.

Start at Exact
: Start a **watch** at an exact resource version. The watch events are for all changes
  after the provided resource version. Unlike "Get State and Start at Most Recent"
  and "Get State and Start at Any", the **watch** is not started with synthetic
  "Added" events for the provided resource version. The client is assumed to already
  have the initial state at the starting resource version since the client provided
  the resource version.

### "410 Gone" responses

Servers are not required to serve all older resource versions and may return a HTTP
`410 (Gone)` status code if a client requests a `resourceVersion` older than the
server has retained. Clients must be able to tolerate `410 (Gone)` responses. See
[Efficient detection of changes](#efficient-detection-of-changes) for details on
how to handle `410 (Gone)` responses when watching resources.

If you request a `resourceVersion` outside the applicable limit then, depending
on whether a request is served from cache or not, the API server may reply with a
`410 Gone` HTTP response.

### Unavailable resource versions

Servers are not required to serve unrecognized resource versions. If you request
**list** or **get** for a resource version that the API server does not recognize,
then the API server may either:

* wait briefly for the resource version to become available, then timeout with a
  `504 (Gateway Timeout)` if the provided resource versions does not become available
  in a reasonable amount of time;
* respond with a `Retry-After` response header indicating how many seconds a client
  should wait before retrying the request.

If you request a resource version that an API server does not recognize, the
kube-apiserver additionally identifies its error responses with a "Too large resource
version" message.

If you make a **watch** request for an unrecognized resource version, the API server
may wait indefinitely (until the request timeout) for the resource version to become
available.
