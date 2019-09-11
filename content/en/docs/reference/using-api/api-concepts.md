---
title: Kubernetes API Concepts
reviewers:
- smarterclayton
- lavalamp
- liggitt
content_template: templates/concept
weight: 20
---

{{% capture overview %}}
This page describes common concepts in the Kubernetes API. 
{{% /capture %}}

{{% capture body %}}
The Kubernetes API is a resource-based (RESTful) programmatic interface provided via HTTP. It supports retrieving, creating,
updating, and deleting primary resources via the standard HTTP verbs (POST, PUT, PATCH, DELETE, GET), includes additional subresources for many objects that allow fine grained authorization (such as binding a pod to a node), and can accept and serve those resources in different representations for convenience or efficiency. It also supports efficient change notifications on resources via "watches" and consistent lists to allow other components to effectively cache and synchronize the state of resources.

## Standard API terminology

Most Kubernetes API resource types are "objects" - they represent a concrete instance of a concept on the cluster, like a pod or namespace. A smaller number of API resource types are "virtual" - they often represent operations rather than objects, such as a permission check (use a POST with a JSON-encoded body of `SubjectAccessReview` to the `subjectaccessreviews` resource). All objects will have a unique name to allow idempotent creation and retrieval, but virtual resource types may not have unique names if they are not retrievable or do not rely on idempotency.

Kubernetes generally leverages standard RESTful terminology to describe the API concepts:

* A **resource type** is the name used in the URL (`pods`, `namespaces`, `services`)
* All resource types have a concrete representation in JSON (their object schema) which is called a **kind**
* A list of instances of a resource type is known as a **collection**
* A single instance of the resource type is called a **resource**

All resource types are either scoped by the cluster (`/apis/GROUP/VERSION/*`) or to a namespace (`/apis/GROUP/VERSION/namespaces/NAMESPACE/*`). A namespace-scoped resource type will be deleted when its namespace is deleted and access to that resource type is controlled by authorization checks on the namespace scope. The following paths are used to retrieve collections and resources:

* Cluster-scoped resources: 
  * `GET /apis/GROUP/VERSION/RESOURCETYPE` - return the collection of resources of the resource type
  * `GET /apis/GROUP/VERSION/RESOURCETYPE/NAME` - return the resource with NAME under the resource type
* Namespace-scoped resources: 
  * `GET /apis/GROUP/VERSION/RESOURCETYPE` - return the collection of all instances of the resource type across all namespaces
  * `GET /apis/GROUP/VERSION/namespaces/NAMESPACE/RESOURCETYPE` - return collection of all instances of the resource type in NAMESPACE
  * `GET /apis/GROUP/VERSION/namespaces/NAMESPACE/RESOURCETYPE/NAME` - return the instance of the resource type with NAME in NAMESPACE

Since a namespace is a cluster-scoped resource type, you can retrieve the list of all namespaces with `GET /api/v1/namespaces` and details about a particular namespace with `GET /api/v1/namespaces/NAME`.

Almost all object resource types support the standard HTTP verbs - GET, POST, PUT, PATCH, and DELETE. Kubernetes uses the term **list** to describe returning a collection of resources to distinguish from retrieving a single resource which is usually called a **get**. 

Some resource types will have one or more sub-resources, represented as sub paths below the resource:

* Cluster-scoped subresource: `GET /apis/GROUP/VERSION/RESOURCETYPE/NAME/SUBRESOURCE`
* Namespace-scoped subresource: `GET /apis/GROUP/VERSION/namespaces/NAMESPACE/RESOURCETYPE/NAME/SUBRESOURCE`

The verbs supported for each subresource will differ depending on the object - see the API documentation more information. It is not possible to access sub-resources across multiple resources - generally a new virtual resource type would be used if that becomes necessary.


## Efficient detection of changes

To enable clients to build a model of the current state of a cluster, all Kubernetes object resource types are required to support consistent lists and an incremental change notification feed called a **watch**.  Every Kubernetes object has a `resourceVersion` field representing the version of that resource as stored in the underlying database. When retrieving a collection of resources (either namespace or cluster scoped), the response from the server will contain a `resourceVersion` value that can be used to initiate a watch against the server. The server will return all changes (creates, deletes, and updates) that occur after the supplied `resourceVersion`. This allows a client to fetch the current state and then watch for changes without missing any updates. If the client watch is disconnected they can restart a new watch from the last returned `resourceVersion`, or perform a new collection request and begin again.

For example:

1. List all of the pods in a given namespace.

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

2. Starting from resource version 10245, receive notifications of any creates, deletes, or updates as individual JSON objects.

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

A given Kubernetes server will only preserve a historical list of changes for a limited time. Clusters using etcd3 preserve changes in the last 5 minutes by default.  When the requested watch operations fail because the historical version of that resource is not available, clients must handle the case by recognizing the status code `410 Gone`, clearing their local cache, performing a list operation, and starting the watch from the `resourceVersion` returned by that new list operation. Most client libraries offer some form of standard tool for this logic. (In Go this is called a `Reflector` and is located in the `k8s.io/client-go/cache` package.)
To mitigate the impact of short history window, we introduced a concept of `bookmark` watch event. It is a special kind of event to pass an information that all changes up to a given `resourceVersion` client is requesting has already been send. Object returned in that event is of the type requested by the request, but only `resourceVersion` field is set, e.g.:

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

`Bookmark` events can be requested by `allowWatchBookmarks=true` option in watch requests, but clients shouldn't assume bookmarks are returned at any specific interval, nor may they assume the server will send any `bookmark` event. As of 1.15 release, it is an Alpha feature.

## Retrieving large results sets in chunks

On large clusters, retrieving the collection of some resource types may result in very large responses that can impact the server and client. For instance, a cluster may have tens of thousands of pods, each of which is 1-2kb of encoded JSON. Retrieving all pods across all namespaces may result in a very large response (10-20MB) and consume a large amount of server resources. Starting in Kubernetes 1.9 the server supports the ability to break a single large collection request into many smaller chunks while preserving the consistency of the total request. Each chunk can be returned sequentially which reduces both the total size of the request and allows user-oriented clients to display results incrementally to improve responsiveness.

To retrieve a single list in chunks, two new parameters `limit` and `continue` are supported on collection requests and a new field `continue` is returned from all list operations in the list `metadata` field. A client should specify the maximum results they wish to receive in each chunk with `limit` and the server will return up to `limit` resources in the result and include a `continue` value if there are more resources in the collection. The client can then pass this `continue` value to the server on the next request to instruct the server to return the next chunk of results. By continuing until the server returns an empty `continue` value the client can consume the full set of results. 

Like a watch operation, a `continue` token will expire after a short amount of time (by default 5 minutes) and return a `410 Gone` if more results cannot be returned. In this case, the client will need to start from the beginning or omit the `limit` parameter.

For example, if there are 1,253 pods on the cluster and the client wants to receive chunks of 500 pods at a time, they would request those chunks as follows:

1. List all of the pods on a cluster, retrieving up to 500 pods each time.

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

2. Continue the previous call, retrieving the next set of 500 pods.

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

3. Continue the previous call, retrieving the last 253 pods.

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

Note that the `resourceVersion` of the list remains constant across each request, indicating the server is showing us a consistent snapshot of the pods. Pods that are created, updated, or deleted after version `10245` would not be shown unless the user makes a list request without the `continue` token.  This allows clients to break large requests into smaller chunks and then perform a watch operation on the full set without missing any updates.


## Receiving resources as Tables

`kubectl get` is a simple tabular representation of one or more instances of a particular resource type. In the past, clients were required to reproduce the tabular and describe output implemented in `kubectl` to perform simple lists of objects.
A few limitations of that approach include non-trivial logic when dealing with certain objects. Additionally, types provided by API aggregation or third party resources are not known at compile time. This means that generic implementations had to be in place for types unrecognized by a client.

In order to avoid potential limitations as described above, clients may request the Table representation of objects, delegating specific details of printing to the server. The Kubernetes API implements standard HTTP content type negotiation: passing an `Accept` header containing a value of `application/json;as=Table;g=meta.k8s.io;v=v1beta1` with a `GET` call will request that the server return objects in the Table content type.

For example:

1. List all of the pods on a cluster in the Table format.

        GET /api/v1/pods
        Accept: application/json;as=Table;g=meta.k8s.io;v=v1beta1
        ---
        200 OK
        Content-Type: application/json
        {
            "kind": "Table",
            "apiVersion": "meta.k8s.io/v1beta1",
            ...
            "columnDefinitions": [
                ...
            ]
        }

For API resource types that do not have a custom Table definition on the server, a default Table response is returned by the server, consisting of the resource's `name` and `creationTimestamp` fields.

        GET /apis/crd.example.com/v1alpha1/namespaces/default/resources
        ---
        200 OK
        Content-Type: application/json
        ...
        {
            "kind": "Table",
            "apiVersion": "meta.k8s.io/v1beta1",
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

Table responses are available beginning in version 1.10 of the kube-apiserver. As such, not all API resource types will support a Table response, specifically when using a client against older clusters. Clients that must work against all resource types, or can potentially deal with older clusters, should specify multiple content types in their `Accept` header to support fallback to non-Tabular JSON:

```
Accept: application/json;as=Table;g=meta.k8s.io;v=v1beta1, application/json
```


## Alternate representations of resources

By default Kubernetes returns objects serialized to JSON with content type `application/json`. This is the default serialization format for the API. However, clients may request the more efficient Protobuf representation of these objects for better performance at scale. The Kubernetes API implements standard HTTP content type negotiation: passing an `Accept` header with a `GET` call will request that the server return objects in the provided content type, while sending an object in Protobuf to the server for a `PUT` or `POST` call takes the `Content-Type` header. The server will return a `Content-Type` header if the requested format is supported, or the `406 Not acceptable` error if an invalid content type is provided.

See the API documentation for a list of supported content types for each API.

For example:

1. List all of the pods on a cluster in Protobuf format.

        GET /api/v1/pods
        Accept: application/vnd.kubernetes.protobuf
        ---
        200 OK
        Content-Type: application/vnd.kubernetes.protobuf
        ... binary encoded PodList object

2. Create a pod by sending Protobuf encoded data to the server, but request a response in JSON.

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

Not all API resource types will support Protobuf, specifically those defined via Custom Resource Definitions or those that are API extensions. Clients that must work against all resource types should specify multiple content types in their `Accept` header to support fallback to JSON:

```
Accept: application/vnd.kubernetes.protobuf, application/json
```


### Protobuf encoding

Kubernetes uses an envelope wrapper to encode Protobuf responses. That wrapper starts with a 4 byte magic number to help identify content in disk or in etcd as Protobuf (as opposed to JSON), and then is followed by a Protobuf encoded wrapper message, which describes the encoding and type of the underlying object and then contains the object.

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

Clients that receive a response in `application/vnd.kubernetes.protobuf` that does not match the expected prefix should reject the response, as future versions may need to alter the serialization format in an incompatible way and will do so by changing the prefix.


## Dry run

{{< feature-state for_k8s_version="v1.13" state="beta" >}} In version 1.13, the dry run beta feature is enabled by default. The modifying verbs (`POST`, `PUT`, `PATCH`, and `DELETE`) can accept requests in a dry run mode. Dry run mode helps to evaluate a request through the typical request stages (admission chain, validation, merge conflicts) up until persisting objects to storage. The response body for the request is as close as possible to a non dry run response. The system guarantees that dry run requests will not be persisted in storage or have any other side effects.


### Make a dry run request

Dry run is triggered by setting the `dryRun` query parameter. This parameter is a string, working as an enum, and in 1.13 the only accepted values are:

* `All`: Every stage runs as normal, except for the final storage stage. Admission controllers are run to check that the request is valid, mutating controllers mutate the request, merge is performed on `PATCH`, fields are defaulted, and schema validation occurs. The changes are not persisted to the underlying storage, but the final object which would have been persisted is still returned to the user, along with the normal status code. If the request would trigger an admission controller which would have side effects, the request will be failed rather than risk an unwanted side effect. All built in admission control plugins support dry run. Additionally, admission webhooks can declare in their [configuration object](/docs/reference/generated/kubernetes-api/v1.13/#webhook-v1beta1-admissionregistration-k8s-io) that they do not have side effects by setting the sideEffects field to "None". If a webhook actually does have side effects, then the sideEffects field should be set to "NoneOnDryRun", and the webhook should also be modified to understand the `DryRun` field in AdmissionReview, and prevent side effects on dry run requests.
* Leave the value empty, which is also the default: Keep the default modifying behavior.

For example:

        POST /api/v1/namespaces/test/pods?dryRun=All
        Content-Type: application/json
        Accept: application/json

The response would look the same as for non dry run request, but the values of some generated fields may differ.


### Generated values

Some values of an object are typically generated before the object is persisted. It is important not to rely upon the values of these fields set by a dry run request, since these values will likely be different in dry run mode from when the real request is made. Some of these fields are:

* `name`: if `generateName` is set, `name` will have a unique random name
* `creationTimestamp`/`deletionTimestamp`: records the time of creation/deletion
* `UID`: uniquely identifies the object and is randomly generated (non-deterministic)
* `resourceVersion`: tracks the persisted version of the object
* Any field set by a mutating admission controller
* For the `Service` resource: Ports or IPs that kube-apiserver assigns to v1.Service objects

## Server Side Apply

{{< feature-state for_k8s_version="v1.14" state="alpha" >}} Server Side Apply allows clients other than kubectl to perform the Apply operation, and will eventually fully replace the complicated Client Side Apply logic that only exists in kubectl. If the Server Side Apply feature is enabled, the `PATCH` endpoint accepts the additional `application/apply-patch+yaml` content type. Users of Server Side Apply can send partially specified objects to this endpoint. An applied config should always include every field that the applier has an opinion about.

### Enable the Server Side Apply alpha feature

Server Side Apply is an alpha feature, so it is disabled by default. To turn this [feature gate](/docs/reference/command-line-tools-reference/feature-gates) on,
you need to include the `--feature-gates ServerSideApply=true` flag when starting `kube-apiserver`.
If you have multiple `kube-apiserver` replicas, all should have the same flag setting.

### Field Management

Compared to the `last-applied` annotation managed by `kubectl`, Server Side Apply uses a more declarative approach, which tracks a user's field management, rather than a user's last applied state. This means that as a side effect of using Server Side Apply, information about which field manager manages each field in an object also becomes available.

For a user to manage a field, in the Server Side Apply sense, means that the user relies on and expects the value of the field not to change. The user who last made an assertion about the value of a field will be recorded as the current field manager. This can be done either by changing the value with `POST`, `PUT`, or non-apply `PATCH`, or by including the field in a config sent to the Server Side Apply endpoint. Any applier that tries to change the field which is managed by someone else will get its request rejected (if not forced, see the Conflicts section below).

Field management is stored in a newly introduced `managedFields` field that is part of an object's [`metadata`](/docs/reference/generated/kubernetes-api/v1.14/#objectmeta-v1-meta).

A simple example of an object created by Server Side Apply could look like this:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: test-cm
  namespace: default
  labels:
    test-label: test
  managedFields:
  - manager: kubectl
    operation: Apply
    apiVersion: v1
    fields:
      f:metadata:
        f:labels:
          f:test-label: {}
      f:data:
        f:key: {}
data:
  key: some value
```

The above object contains a single manager in `metadata.managedFields`. The manager consists of basic information about the managing entity itself, like operation type, api version, and the fields managed by it.

{{< note >}} This field is managed by the apiserver and should not be changed by the user. {{< /note >}}

Nevertheless it is possible to change `metadata.managedFields` through an `Update` operation. Doing so is highly discouraged, but might be a reasonable option to try if, for example, the `managedFields` get into an inconsistent state (which clearly should not happen).

### Operations

The two operation types considered by this feature are `Apply` (`PATCH` with content type `application/apply-patch+yaml`) and `Update` (all other operations which modify the object). Both operations update the `managedFields`, but behave a little differently.

For instance, only the apply operation fails on conflicts while update does not. Also, apply operations are required to identify themselves by providing a `fieldManager` query parameter, while the query parameter is optional for update operations.

An example object with multiple managers could look like this:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: test-cm
  namespace: default
  labels:
    test-label: test
  managedFields:
  - manager: kubectl
    operation: Apply
    apiVersion: v1
    fields:
      f:metadata:
        f:labels:
          f:test-label: {}
  - manager: kube-controller-manager
    operation: Update
    apiVersion: v1
    time: '2019-03-30T16:00:00.000Z'
    fields:
      f:data:
        f:key: {}
data:
  key: new value
```

In this example, a second operation was run as an `Update` by the manager called `kube-controller-manager`. The update changed a value in the data field which caused the field's management to change to the `kube-controller-manager`.
{{< note >}}If this update would have been an `Apply` operation, the operation would have failed due to conflicting ownership.{{< /note >}}

### Merge Strategy

The merging strategy, implemented with Server Side Apply, provides a generally more stable object lifecycle.
Server Side Apply tries to merge fields based on the fact who manages them instead of overruling just based on values.
This way it is intended to make it easier and more stable for multiple actors updating the same object by causing less unexpected interference.

When a user sends a partially specified object to the Server Side Apply endpoint, the server merges it with the live object favoring the value in the applied config if it is specified in both places. If the set of items present in the applied config is not a superset of the items applied by the same user last time, each missing item not managed by any other field manager is removed. For more information about how an object's schema is used to make decisions when merging, see [sigs.k8s.io/structured-merge-diff](https://sigs.k8s.io/structured-merge-diff).

### Conflicts

A conflict is a special status error that occurs when an `Apply` operation tries to change a field, which another user also claims to manage. This prevents an applier from unintentionally overwriting the value set by another user. When this occurs, the applier has 3 options to resolve the conflicts:

* **Overwrite value, become sole manager:** If overwriting the value was intentional (or if the applier is an automated process like a controller) the applier should set the `force` query parameter to true and make the request again. This forces the operation to succeed, changes the value of the field, and removes the field from all other managers' entries in managedFields.
* **Don't overwrite value, give up management claim:** If the applier doesn't care about the value of the field anymore, they can remove it from their config and make the request again. This leaves the value unchanged, and causes the field to be removed from the applier's entry in managedFields.
* **Don't overwrite value, become shared manager:** If the applier still cares about the value of the field, but doesn't want to overwrite it, they can change the value of the field in their config to match the value of the object on the server, and make the request again. This leaves the value unchanged, and causes the field's management to be shared by the applier and all other field managers that already claimed to manage it.

### Comparison with Client Side Apply

A consequence of the conflict detection and resolution implemented by Server Side Apply is that an applier always has up to date field values in their local state. If they don't, they get a conflict the next time they apply. Any of the three options to resolve conflicts results in the applied config being an up to date subset of the object on the server's fields.

This is different from Client Side Apply, where outdated values which have been overwritten by other users are left in an applier's local config. These values only become accurate when the user updates that specific field, if ever, and an applier has no way of knowing whether their next apply will overwrite other users' changes.

Another difference is that an applier using Client Side Apply is unable to change the API version they are using, but Server Side Apply supports this use case.

### Custom Resources

Server Side Apply currently treats all custom resources as unstructured data. All keys are treated the same as struct fields, and all lists are considered atomic. In the future, it will use the validation field in Custom Resource Definitions to allow Custom Resource authors to define how to how to merge their own objects.

### Clearing ManagedFields

It is possible to strip all managedFields from an object by overwriting them using `MergePatch`, `StrategicMergePatch`, `JSONPatch` or `Update`, so every non-apply operation.
This can be done by overwriting the managedFields field with an empty entry. Two examples are:

```json
PATCH /api/v1/namespaces/default/configmaps/example-cm
Content-Type: application/merge-patch+json
Accept: application/json
Data: {"metadata":{"managedFields": [{}]}}
```

```json
PATCH /api/v1/namespaces/default/configmaps/example-cm
Content-Type: application/json-patch+json
Accept: application/json
Data: [{"op": "replace", "path": "/metadata/managedFields", "value": [{}]}]
```

This will overwrite the managedFields with a list containing a single empty entry that then results in the managedFields being stripped entirely from the object. Note that just setting the managedFields to an empty list will not reset the field. This is on purpose, so managedFields never get stripped by clients not aware of the field.

In cases where the reset operation is combined with changes to other fields than the managedFields, this will result in the managedFields being reset first and the other changes being processed afterwards. As a result the applier takes ownership of any fields updated in the same request.
