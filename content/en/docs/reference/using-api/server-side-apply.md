---
title: Server-Side Apply
reviewers:
- smarterclayton
- apelisse
- lavalamp
- liggitt
content_type: concept
weight: 25
---

<!-- overview -->

{{< feature-state feature_gate_name="ServerSideApply" >}}

Kubernetes supports multiple appliers collaborating to manage the fields
of a single [object](/docs/concepts/overview/working-with-objects/).

Server-Side Apply provides an optional mechanism for your cluster's control plane to track
changes to an object's fields. At the level of a specific resource, Server-Side
Apply records and tracks information about control over the fields of that object.

Server-Side Apply helps users and {{< glossary_tooltip text="controllers" term_id="controller" >}}
manage their resources through declarative configuration. Clients can create and modify
{{< glossary_tooltip text="objects" term_id="object" >}}
declaratively by submitting their _fully specified intent_.

A fully specified intent is a partial object that only includes the fields and
values for which the user has an opinion. That intent either creates a new
object (using default values for unspecified fields), or is
[combined](#merge-strategy), by the API server, with the existing object.

[Comparison with Client-Side Apply](#comparison-with-client-side-apply) explains
how Server-Side Apply differs from the original, client-side `kubectl apply`
implementation.

<!-- body -->

## Field management

The Kubernetes API server tracks _managed fields_ for all newly created objects.

When trying to apply an object, fields that have a different value and are owned by
another [manager](#managers) will result in a [conflict](#conflicts). This is done
in order to signal that the operation might undo another collaborator's changes.
Writes to objects with managed fields can be forced, in which case the value of any
conflicted field will be overridden, and the ownership will be transferred.

Whenever a field's value does change, ownership moves from its current manager to the
manager making the change.

Apply checks if there are any other field managers that also own the
field.  If the field is not owned by any other field managers, that field is
set to its default value (if there is one), or otherwise is deleted from the
object.
The same rule applies to fields that are lists, associative lists, or maps.

For a user to manage a field, in the Server-Side Apply sense, means that the
user relies on and expects the value of the field not to change. The user who
last made an assertion about the value of a field will be recorded as the
current field manager. This can be done by changing the field manager
details explicitly using HTTP `POST` (**create**), `PUT` (**update**), or non-apply
`PATCH` (**patch**). You can also declare and record a field manager
by including a value for that field in a Server-Side Apply operation.

A Server-Side Apply **patch** request requires the client to provide its identity
as a [field manager](#managers). When using Server-Side Apply, trying to change a
field that is controlled by a different manager results in a rejected
request unless the client forces an override.
For details of overrides, see [Conflicts](#conflicts).

When two or more appliers set a field to the same value, they share ownership of
that field. Any subsequent attempt to change the value of the shared field, by any of
the appliers, results in a conflict. Shared field owners may give up ownership
of a field by making a Server-Side Apply **patch** request that doesn't include
that field.

Field management details are stored in a `managedFields` field that is part of an
object's [`metadata`](/docs/reference/kubernetes-api/common-definitions/object-meta/).

If you remove a field from a manifest and apply that manifest, Server-Side
Apply checks if there are any other field managers that also own the field.
If the field is not owned by any other field managers, it is either deleted
from the live object or reset to its default value, if it has one.
The same rule applies to associative list or map items.

Compared to the (legacy)
[`kubectl.kubernetes.io/last-applied-configuration`](/docs/reference/labels-annotations-taints/#kubectl-kubernetes-io-last-applied-configuration)
annotation managed by `kubectl`, Server-Side Apply uses a more declarative
approach, that tracks a user's (or client's) field management, rather than
a user's last applied state. As a side effect of using Server-Side Apply,
information about which field manager manages each field in an object also
becomes available.

### Example {#ssa-example-configmap}

A simple example of an object created using Server-Side Apply could look like this:

```yaml
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: test-cm
  namespace: default
  labels:
    test-label: test
  managedFields:
  - manager: kubectl
    operation: Apply # note capitalization: "Apply" (or "Update")
    apiVersion: v1
    time: "2010-10-10T0:00:00Z"
    fieldsType: FieldsV1
    fieldsV1:
      f:metadata:
        f:labels:
          f:test-label: {}
      f:data:
        f:key: {}
data:
  key: some value
```

That example ConfigMap object contains a single field management record in
`.metadata.managedFields`. The field management record consists of basic information
about the managing entity itself, plus details about the fields being managed and
the relevant operation (`Apply` or `Update`). If the request that last changed that
field was a Server-Side Apply **patch** then the value of `operation` is `Apply`;
otherwise, it is `Update`.

There is another possible outcome. A client could submit an invalid request
body. If the fully specified intent does not produce a valid object, the
request fails.

It is however possible to change `.metadata.managedFields` through an
**update**, or through a **patch** operation that does not use Server-Side Apply.
Doing so is highly discouraged, but might be a reasonable option to try if,
for example, the `.metadata.managedFields` get into an inconsistent state
(which should not happen in normal operations).

The format of `managedFields` is [described](/docs/reference/kubernetes-api/common-definitions/object-meta/#System)
in the Kubernetes API reference.

{{< caution >}}
The `.metadata.managedFields` field is managed by the API server.
You should avoid updating it manually.
{{< /caution >}}

### Conflicts

A _conflict_ is a special status error that occurs when an `Apply` operation tries
to change a field that another manager also claims to manage. This prevents an
applier from unintentionally overwriting the value set by another user. When
this occurs, the applier has 3 options to resolve the conflicts:

* **Overwrite value, become sole manager:** If overwriting the value was
  intentional (or if the applier is an automated process like a controller) the
  applier should set the `force` query parameter to true (for `kubectl apply`,
  you use the `--force-conflicts` command line parameter), and make the request
  again. This forces the operation to succeed, changes the value of the field,
  and removes the field from all other managers' entries in `managedFields`.

* **Don't overwrite value, give up management claim:** If the applier doesn't
  care about the value of the field any more, the applier can remove it from their
  local model of the resource, and make a new request with that particular field
  omitted. This leaves the value unchanged, and causes the field to be removed
  from the applier's entry in `managedFields`.

* **Don't overwrite value, become shared manager:** If the applier still cares
  about the value of a field, but doesn't want to overwrite it, they can
  change the value of that field in their local model of the resource so as to
  match the value of the object on the server, and then make a new request that
  takes into account that local update. Doing so leaves the value unchanged,
  and causes that field's management to be shared by the applier along with all
  other field managers that already claimed to manage it.

### Field managers {#managers}

Managers identify distinct workflows that are modifying the object (especially
useful on conflicts!), and can be specified through the
[`fieldManager`](/docs/reference/kubernetes-api/common-parameters/common-parameters/#fieldManager)
query parameter as part of a modifying request. When you Apply to a resource,
the `fieldManager` parameter is required.
For other updates, the API server infers a field manager identity from the
 "User-Agent:" HTTP header (if present).

When you use the `kubectl` tool to perform a Server-Side Apply operation, `kubectl`
sets the manager identity to `"kubectl"` by default.

## Serialization

At the protocol level, Kubernetes represents Server-Side Apply message bodies
as [YAML](https://yaml.org/), with the media type `application/apply-patch+yaml`.

{{< note >}}
Whether you are submitting JSON data or YAML data, use
`application/apply-patch+yaml` as the `Content-Type` header value.

All JSON documents are valid YAML. However, Kubernetes has a bug where it uses a YAML
parser that does not fully implement the YAML specification. Some JSON escapes may
not be recognized.
{{< /note >}}

The serialization is the same as for Kubernetes objects, with the exception that
clients are not required to send a complete object.

Here's an example of a Server-Side Apply message body (fully specified intent):
```yaml
{
  "apiVersion": "v1",
  "kind": "ConfigMap"
}
```

(this would make a no-change update, provided that it was sent as the body
of a **patch** request to a valid `v1/configmaps` resource, and with the
appropriate request `Content-Type`).


## Operations in scope for field management {#apply-and-update}

The Kubernetes API operations where field management is considered are:

1. Server-Side Apply (HTTP `PATCH`, with content type `application/apply-patch+yaml`)
2. Replacing an existing object (**update** to Kubernetes; `PUT` at the HTTP level)

Both operations update `.metadata.managedFields`, but behave a little differently.

Unless you specify a forced override, an apply operation that encounters field-level
conflicts always fails; by contrast, if you make a change using **update** that would
affect a managed field, a conflict never provokes failure of the operation.

All Server-Side Apply **patch** requests are required to identify themselves by providing a
`fieldManager` query parameter, while the query parameter is optional for **update**
operations. Finally, when using the `Apply` operation you cannot define `managedFields` in
the body of the request that you submit.

An example object with multiple managers could look like this:

```yaml
---
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

In this example, a second operation was run as an **update** by the manager called
`kube-controller-manager`. The update request succeeded and changed a value in the data
field, which caused that field's management to change to the `kube-controller-manager`.

If this update has instead been attempted using Server-Side Apply, the request
would have failed due to conflicting ownership.

## Merge strategy

The merging strategy, implemented with Server-Side Apply, provides a generally
more stable object lifecycle. Server-Side Apply tries to merge fields based on
the actor who manages them instead of overruling based on values. This way
multiple actors can update the same object without causing unexpected interference.

When a user sends a _fully-specified intent_ object to the Server-Side Apply
endpoint, the server merges it with the live object favoring the value from the
request body if it is specified in both places. If the set of items present in
the applied config is not a superset of the items applied by the same user last
time, each missing item not managed by any other appliers is removed. For
more information about how an object's schema is used to make decisions when
merging, see
[sigs.k8s.io/structured-merge-diff](https://sigs.k8s.io/structured-merge-diff).

The Kubernetes API (and the Go code that implements that API for Kubernetes) allows
defining _merge strategy markers_. These markers describe the merge strategy supported
for fields within Kubernetes objects.
For a {{< glossary_tooltip term_id="CustomResourceDefinition" text="CustomResourceDefinition" >}},
you can set these markers when you define the custom resource.

| Golang marker | OpenAPI extension | Possible values | Description |
|---|---|---|---|---|
| `//+listType` | `x-kubernetes-list-type` | `atomic`/`set`/`map` | Applicable to lists. `set` applies to lists that include only scalar elements. These elements must be unique. `map` applies to lists of nested types only. The key values (see `listMapKey`) must be unique in the list. `atomic` can apply to any list. If configured as `atomic`, the entire list is replaced during merge. At any point in time, a single manager owns the list. If `set` or `map`, different managers can manage entries separately. |
| `//+listMapKey` | `x-kubernetes-list-map-keys` | List of field names, e.g. `["port", "protocol"]` | Only applicable when `+listType=map`. A list of field names whose values uniquely identify entries in the list. While there can be multiple keys, `listMapKey` is singular because keys need to be specified individually in the Go type. The key fields must be scalars. |
| `//+mapType` | `x-kubernetes-map-type` | `atomic`/`granular` | Applicable to maps. `atomic` means that the map can only be entirely replaced by a single manager. `granular` means that the map supports separate managers updating individual fields. |
| `//+structType` | `x-kubernetes-map-type` | `atomic`/`granular` | Applicable to structs; otherwise same usage and OpenAPI annotation as `//+mapType`.|

If `listType` is missing, the API server interprets a
`patchStrategy=merge` marker as a `listType=map` and the
corresponding `patchMergeKey` marker as a `listMapKey`.

The `atomic` list type is recursive.

(In the [Go](https://go.dev/) code for Kubernetes, these markers are specified as
comments and code authors need not repeat them as field tags).

## Custom resources and Server-Side Apply

By default, Server-Side Apply treats custom resources as unstructured data. All
keys are treated the same as struct fields, and all lists are considered atomic.

If the CustomResourceDefinition defines a
[schema](/docs/reference/generated/kubernetes-api/{{< param "version" >}}#jsonschemaprops-v1-apiextensions-k8s-io)
that contains annotations as defined in the previous [Merge Strategy](#merge-strategy)
section, these annotations will be used when merging objects of this
type.


### Compatibility across topology changes

On rare occurrences, the author for a CustomResourceDefinition (CRD) or built-in
may want to change the specific topology of a field in their resource,
without incrementing its API version. Changing the topology of types,
by upgrading the cluster or updating the CRD, has different consequences when
updating existing objects. There are two categories of changes: when a field goes from
`map`/`set`/`granular` to `atomic`, and the other way around.

When the `listType`, `mapType`, or `structType` changes from
`map`/`set`/`granular` to `atomic`, the whole list, map, or struct of
existing objects will end-up being owned by actors who owned an element
of these types. This means that any further change to these objects
would cause a conflict.

When a `listType`, `mapType`, or `structType` changes from `atomic` to
`map`/`set`/`granular`, the API server is unable to infer the new
ownership of these fields. Because of that, no conflict will be produced
when objects have these fields updated. For that reason, it is not
recommended to change a type from `atomic` to `map`/`set`/`granular`.

Take for example, the custom resource:

```yaml
---
apiVersion: example.com/v1
kind: Foo
metadata:
  name: foo-sample
  managedFields:
  - manager: "manager-one"
    operation: Apply
    apiVersion: example.com/v1
    fields:
      f:spec:
        f:data: {}
spec:
  data:
    key1: val1
    key2: val2
```

Before `spec.data` gets changed from `atomic` to `granular`,
`manager-one` owns the field `spec.data`, and all the fields within it
(`key1` and `key2`). When the CRD gets changed to make `spec.data`
`granular`, `manager-one` continues to own the top-level field
`spec.data` (meaning no other managers can delete the map called `data`
without a conflict), but it no longer owns `key1` and `key2`, so another
manager can then modify or delete those fields without conflict.

## Using Server-Side Apply in a controller

As a developer of a controller, you can use Server-Side Apply as a way to
simplify the update logic of your controller. The main differences with a
read-modify-write and/or patch are the following:

* the applied object must contain all the fields that the controller cares about.
* there is no way to remove fields that haven't been applied by the controller
  before (controller can still send a **patch** or **update** for these use-cases).
* the object doesn't have to be read beforehand; `resourceVersion` doesn't have
  to be specified.

It is strongly recommended for controllers to always force conflicts on objects that
they own and manage, since they might not be able to resolve or act on these conflicts.

## Transferring ownership

In addition to the concurrency controls provided by [conflict resolution](#conflicts),
Server-Side Apply provides ways to perform coordinated
field ownership transfers from users to controllers.

This is best explained by example. Let's look at how to safely transfer
ownership of the `replicas` field from a user to a controller while enabling
automatic horizontal scaling for a Deployment, using the HorizontalPodAutoscaler
resource and its accompanying controller.

Say a user has defined Deployment with `replicas` set to the desired value:

{{% code_sample file="application/ssa/nginx-deployment.yaml" %}}

And the user has created the Deployment using Server-Side Apply, like so:

```shell
kubectl apply -f https://k8s.io/examples/application/ssa/nginx-deployment.yaml --server-side
```

Then later, automatic scaling is enabled for the Deployment; for example:

```shell
kubectl autoscale deployment nginx-deployment --cpu-percent=50 --min=1 --max=10
```

Now, the user would like to remove `replicas` from their configuration, so they
don't accidentally fight with the HorizontalPodAutoscaler (HPA) and its controller.
However, there is a race: it might take some time before the HPA feels the need
to adjust `.spec.replicas`; if the user removes `.spec.replicas` before the HPA writes
to the field and becomes its owner, then the API server would set `.spec.replicas` to
1 (the default replica count for Deployment).
This is not what the user wants to happen, even temporarily - it might well degrade
a running workload.

There are two solutions:

- (basic) Leave `replicas` in the configuration; when the HPA eventually writes to that
  field, the system gives the user a conflict over it. At that point, it is safe
  to remove from the configuration.

- (more advanced) If, however, the user doesn't want to wait, for example
  because they want to keep the cluster legible to their colleagues, then they
  can take the following steps to make it safe to remove `replicas` from their
  configuration:

First, the user defines a new manifest containing only the `replicas` field:

```yaml
# Save this file as 'nginx-deployment-replicas-only.yaml'.
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
spec:
  replicas: 3
```

{{< note >}}
The YAML file for SSA in this case only contains the fields you want to change.
You are not supposed to provide a fully compliant Deployment manifest if you only
want to modify the `spec.replicas` field using SSA.
{{< /note >}}

The user applies that manifest using a private field manager name. In this example,
the user picked `handover-to-hpa`:

```shell
kubectl apply -f nginx-deployment-replicas-only.yaml \
  --server-side --field-manager=handover-to-hpa \
  --validate=false
```

If the apply results in a conflict with the HPA controller, then do nothing. The
conflict indicates the controller has claimed the field earlier in the
process than it sometimes does.

At this point the user may remove the `replicas` field from their manifest:

{{% code_sample file="application/ssa/nginx-deployment-no-replicas.yaml" %}}

Note that whenever the HPA controller sets the `replicas` field to a new value,
the temporary field manager will no longer own any fields and will be
automatically deleted. No further clean up is required.

### Transferring ownership between managers

Field managers can transfer ownership of a field between each other by setting the field
to the same value in both of their applied configurations, causing them to share
ownership of the field. Once the managers share ownership of the field, one of them
can remove the field from their applied configuration to give up ownership and
complete the transfer to the other field manager.

## Comparison with Client-Side Apply

Server-Side Apply is meant both as a replacement for the original client-side
implementation of the `kubectl apply` subcommand, and as simple and effective
mechanism for {{< glossary_tooltip term_id="controller" text="controllers" >}}
to enact their changes.

Compared to the `last-applied` annotation managed by `kubectl`, Server-Side
Apply uses a more declarative approach, which tracks an object's field management,
rather than a user's last applied state. This means that as a side effect of
using Server-Side Apply, information about which field manager manages each
field in an object also becomes available.

A consequence of the conflict detection and resolution implemented by Server-Side
Apply is that an applier always has up to date field values in their local
state. If they don't, they get a conflict the next time they apply. Any of the
three options to resolve conflicts results in the applied configuration being an
up to date subset of the object on the server's fields.

This is different from Client-Side Apply, where outdated values which have been
overwritten by other users are left in an applier's local config. These values
only become accurate when the user updates that specific field, if ever, and an
applier has no way of knowing whether their next apply will overwrite other
users' changes.

Another difference is that an applier using Client-Side Apply is unable to
change the API version they are using, but Server-Side Apply supports this use
case.

## Migration between client-side and server-side apply

### Upgrading from client-side apply to server-side apply

Client-side apply users who manage a resource with `kubectl apply` can start
using server-side apply with the following flag.

```shell
kubectl apply --server-side [--dry-run=server]
```

By default, field management of the object transfers from client-side apply to
kubectl server-side apply, without encountering conflicts.

{{< caution >}}
Keep the `last-applied-configuration` annotation up to date.
The annotation infers client-side applies managed fields.
Any fields not managed by client-side apply raise conflicts.

For example, if you used `kubectl scale` to update the replicas field after
client-side apply, then this field is not owned by client-side apply and
creates conflicts on `kubectl apply --server-side`.
{{< /caution >}}

This behavior applies to server-side apply with the `kubectl` field manager.
As an exception, you can opt-out of this behavior by specifying a different,
non-default field manager, as seen in the following example. The default field
manager for kubectl server-side apply is `kubectl`.

```shell
kubectl apply --server-side --field-manager=my-manager [--dry-run=server]
```

### Downgrading from server-side apply to client-side apply

If you manage a resource with `kubectl apply --server-side`,
you can downgrade to client-side apply directly with `kubectl apply`.

Downgrading works because kubectl Server-Side Apply keeps the
`last-applied-configuration` annotation up-to-date if you use
`kubectl apply`.

This behavior applies to Server-Side Apply with the `kubectl` field manager.
As an exception, you can opt-out of this behavior by specifying a different,
non-default field manager, as seen in the following example. The default field
manager for kubectl server-side apply is `kubectl`.

```shell
kubectl apply --server-side --field-manager=my-manager [--dry-run=server]
```

## API implementation

The `PATCH` verb for a resource that supports Server-Side Apply can accepts the
unofficial `application/apply-patch+yaml` content type. Users of Server-Side
Apply can send partially specified objects as YAML as the body of a `PATCH` request
to the URI of a resource.  When applying a configuration, you should always include all the
fields that are important to the outcome (such as a desired state) that you want to define.

All JSON messages are valid YAML. Some clients specify Server-Side Apply requests using YAML
request bodies that are also valid JSON.

### Access control and permissions {#rbac-and-permissions}

Since Server-Side Apply is a type of `PATCH`, a principal (such as a Role for Kubernetes
{{< glossary_tooltip text="RBAC" term_id="rbac" >}}) requires the **patch** permission to
edit existing resources, and also needs the **create** verb permission in order to create
new resources with Server-Side Apply.

## Clearing `managedFields`

It is possible to strip all `managedFields` from an object by overwriting them
using a **patch** (JSON Merge Patch, Strategic Merge Patch, JSON Patch), or
through an **update** (HTTP `PUT`); in other words, through every write operation
other than **apply**. This can be done by overwriting the `managedFields` field
with an empty entry. Two examples are:

```console
PATCH /api/v1/namespaces/default/configmaps/example-cm
Accept: application/json
Content-Type: application/merge-patch+json

{
  "metadata": {
    "managedFields": [
      {}
    ]
  }
}
```

```console
PATCH /api/v1/namespaces/default/configmaps/example-cm
Accept: application/json
Content-Type: application/json-patch+json
If-Match: 1234567890123456789

[{"op": "replace", "path": "/metadata/managedFields", "value": [{}]}]
```

This will overwrite the `managedFields` with a list containing a single empty
entry that then results in the `managedFields` being stripped entirely from the
object. Note that setting the `managedFields` to an empty list will not
reset the field. This is on purpose, so `managedFields` never get stripped by
clients not aware of the field.

In cases where the reset operation is combined with changes to other fields
than the `managedFields`, this will result in the `managedFields` being reset
first and the other changes being processed afterwards. As a result the
applier takes ownership of any fields updated in the same request.

{{< note >}}
Server-Side Apply does not correctly track ownership on
sub-resources that don't receive the resource object type. If you are
using Server-Side Apply with such a sub-resource, the changed fields
may not be tracked.
{{< /note >}}

## {{% heading "whatsnext" %}}

You can read about `managedFields` within the Kubernetes API reference for the
[`metadata`](/docs/reference/kubernetes-api/common-definitions/object-meta/)
top level field.
