---
title: 服务器端应用（Server-Side Apply）
content_type: concept
weight: 25
---
<!--
title: Server-Side Apply
reviewers:
- smarterclayton
- apelisse
- lavalamp
- liggitt
content_type: concept
weight: 25
-->

<!-- overview -->

{{< feature-state feature_gate_name="ServerSideApply" >}}

<!-- 
Kubernetes supports multiple appliers collaborating to manage the fields
of a single [object](/docs/concepts/overview/working-with-objects/).

Server-Side Apply provides an optional mechanism for your cluster's control plane to track
changes to an object's fields. At the level of a specific resource, Server-Side
Apply records and tracks information about control over the fields of that object.
-->
Kubernetes 支持多个应用程序协作管理一个[对象](/zh-cn/docs/concepts/overview/working-with-objects/)的字段。
服务器端应用为集群的控制平面提供了一种可选机制，用于跟踪对对象字段的更改。
在特定资源级别，服务器端应用记录并跟踪有关控制该对象字段的信息。

<!--
Server-Side Apply helps users and {{< glossary_tooltip text="controllers" term_id="controller" >}}
manage their resources through declarative configuration. Clients can create and modify
{{< glossary_tooltip text="objects" term_id="object" >}}
declaratively by submitting their _fully specified intent_.
-->
服务器端应用协助用户和{{< glossary_tooltip text="控制器" term_id="controller" >}}通过声明式配置的方式管理他们的资源。
客户提交他们**完整描述的意图**，声明式地创建和修改{{< glossary_tooltip text="对象" term_id="object" >}}。

<!--
A fully specified intent is a partial object that only includes the fields and
values for which the user has an opinion. That intent either creates a new
object (using default values for unspecified fields), or is
[combined](#merge-strategy), by the API server, with the existing object.

[Comparison with Client-Side Apply](#comparison-with-client-side-apply) explains
how Server-Side Apply differs from the original, client-side `kubectl apply`
implementation.
-->
一个完整描述的意图并不是一个完整的对象，仅包括能体现用户意图的字段和值。
该意图可以用来创建一个新对象（未指定的字段使用默认值），
也可以通过 API 服务器来实现与现有对象的[合并](#merge-strategy)。

[与客户端应用对比](#comparison-with-client-side-apply)小节解释了服务器端应用与最初的客户端
`kubectl apply` 实现的区别。

<!-- body -->

<!--
## Field Management

The Kubernetes API server tracks _managed fields_ for all newly created objects.

When trying to apply an object, fields that have a different value and are owned by
another [manager](#managers) will result in a [conflict](#conflicts). This is done
in order to signal that the operation might undo another collaborator's changes.
Writes to objects with managed fields can be forced, in which case the value of any
conflicted field will be overridden, and the ownership will be transferred.
-->
## 字段管理 {#field-management}

Kubernetes API 服务器跟踪所有新建对象的**受控字段（Managed Fields）**。

当尝试应用对象时，由另一个[管理器](#managers)拥有的字段且具有不同值，将导致[冲突](#conflicts)。
这样做是为了表明操作可能会撤消另一个合作者的更改。
可以强制写入具有托管字段的对象，在这种情况下，任何冲突字段的值都将被覆盖，并且所有权将被转移。

<!-- 
Whenever a field's value does change, ownership moves from its current manager to the
manager making the change.

Apply checks if there are any other field managers that also own the
field.  If the field is not owned by any other field managers, that field is
set to its default value (if there is one), or otherwise is deleted from the
object.
The same rule applies to fields that are lists, associative lists, or maps.
-->
每当字段的值确实发生变化时，所有权就会从其当前管理器转移到进行更改的管理器。

服务器端应用会检查是否存在其他字段管理器也拥有该字段。
如果该字段不属于任何其他字段管理器，则该字段将被设置为其默认值（如果有），或者以其他方式从对象中删除。
同样的规则也适用于作为列表（list）、关联列表或键值对（map）的字段。

<!--
For a user to manage a field, in the Server-Side Apply sense, means that the
user relies on and expects the value of the field not to change. The user who
last made an assertion about the value of a field will be recorded as the
current field manager. This can be done by changing the field manager
details explicitly using HTTP `POST` (**create**), `PUT` (**update**), or non-apply
`PATCH` (**patch**). You can also declare and record a field manager
by including a value for that field in a Server-Side Apply operation.
-->
用户管理字段这件事，在服务器端应用的场景中，意味着用户依赖并期望字段的值不要改变。
最后一次对字段值做出断言的用户将被记录到当前字段管理器。
这可以通过发送 `POST`（**create**）、`PUT`（**update**）、或非应用的 `PATCH`（**patch**）
显式更改字段管理器详细信息来实现。
还可以通过在服务器端应用操作中包含字段的值来声明和记录字段管理器。

<!--
When two or more appliers set a field to the same value, they share ownership of
that field. Any subsequent attempt to change the value of the shared field, by any of
the appliers, results in a conflict. Shared field owners may give up ownership
of a field by making a Server-Side Apply **patch** request that doesn't include
that field.

Field management details are stored in a `managedFields` field that is part of an
object's [`metadata`](/docs/reference/kubernetes-api/common-definitions/object-meta/).
-->
如果两个或以上的应用者均把同一个字段设置为相同值，他们将共享此字段的所有权。
后续任何改变共享字段值的尝试，不管由那个应用者发起，都会导致冲突。
共享字段的所有者可以放弃字段的所有权，这只需发出不包含该字段的服务器端应用 **patch** 请求即可。

字段管理的信息存储在 `managedFields` 字段中，该字段是对象的
[`metadata`](/zh-cn/docs/reference/kubernetes-api/common-definitions/object-meta/)
中的一部分。

<!-- 
If you remove a field from a manifest and apply that manifest, Server-Side
Apply checks if there are any other field managers that also own the field.
If the field is not owned by any other field managers, it is either deleted
from the live object or reset to its default value, if it has one.
The same rule applies to associative list or map items.
-->
如果从清单中删除某个字段并应用该清单，则服务器端应用会检查是否有其他字段管理器也拥有该字段。
如果该字段不属于任何其他字段管理器，则服务器会将其从活动对象中删除，或者重置为其默认值（如果有）。
同样的规则也适用于关联列表（list）或键值对（map）。

<!-- 
Compared to the (legacy)
[`kubectl.kubernetes.io/last-applied-configuration`](/docs/reference/labels-annotations-taints/#kubectl-kubernetes-io-last-applied-configuration)
annotation managed by `kubectl`, Server-Side Apply uses a more declarative
approach, that tracks a user's (or client's) field management, rather than
a user's last applied state. As a side effect of using Server-Side Apply,
information about which field manager manages each field in an object also
becomes available.
-->
与（旧版）由 `kubectl` 所管理的注解
[`kubectl.kubernetes.io/last-applied configuration`](/zh-cn/docs/reference/labels-annotations-taints/#kubectl-kubernetes-io-last-applied-configuration)
相比，服务器端应用使用了一种更具声明式的方法，
它跟踪用户（或客户端）的字段管理，而不是用户上次应用的状态。
作为服务器端应用的副作用，哪个字段管理器管理的对象的哪个字段的相关信息也会变得可用。

<!-- 
### Example {#ssa-example-configmap}

A simple example of an object created using Server-Side Apply could look like this:
-->
### 示例 {#ssa-example-configmap}

服务器端应用创建对象的简单示例如下：

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
    operation: Apply # 注意大写: “Apply” (或者 “Update”)
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

<!-- 
That example ConfigMap object contains a single field management record in
`.metadata.managedFields`. The field management record consists of basic information
about the managing entity itself, plus details about the fields being managed and
the relevant operation (`Apply` or `Update`). If the request that last changed that
field was a Server-Side Apply **patch** then the value of `operation` is `Apply`;
otherwise, it is `Update`.
-->
示例的 ConfigMap 对象在 `.metadata.managedFields` 中包含字段管理记录。
字段管理记录包括关于管理实体本身的基本信息，以及关于被管理的字段和相关操作（`Apply` 或 `Update`）的详细信息。
如果最后更改该字段的请求是服务器端应用的**patch**操作，则 `operation` 的值为 `Apply`；否则为 `Update`。

<!-- 
There is another possible outcome. A client could submit an invalid request
body. If the fully specified intent does not produce a valid object, the
request fails.

It is however possible to change `.metadata.managedFields` through an
**update**, or through a **patch** operation that does not use Server-Side Apply.
Doing so is highly discouraged, but might be a reasonable option to try if,
for example, the `.metadata.managedFields` get into an inconsistent state
(which should not happen in normal operations).
-->
还有另一种可能的结果。客户端会提交无效的请求体。
如果完整描述的意图没有构造出有效的对象，则请求失败。

但是，可以通过 **update** 或不使用服务器端应用的 **patch** 操作去更新 `.metadata.managedFields`。
强烈不鼓励这么做，但当发生如下情况时，
比如 `managedFields` 进入不一致的状态（显然不应该发生这种情况），
这么做也是一个合理的尝试。

<!-- 
The format of `managedFields` is [described](/docs/reference/kubernetes-api/common-definitions/object-meta/#System)
in the Kubernetes API reference.

{{< caution >}}
The `.metadata.managedFields` field is managed by the API server.
You should avoid updating it manually.
{{< /caution >}}
-->
`managedFields` 的格式在 Kubernetes API 参考中[描述](/zh-cn/docs/reference/kubernetes-api/common-definitions/object-meta/#System)。

{{< caution >}}
`.metadata.managedFields` 字段由 API 服务器管理。
你不应该手动更新它。
{{< /caution >}}

<!--
## Conflicts

A _conflict_ is a special status error that occurs when an `Apply` operation tries
to change a field that another manager also claims to manage. This prevents an
applier from unintentionally overwriting the value set by another user. When
this occurs, the applier has 3 options to resolve the conflicts:
-->
## 冲突 {#conflicts}

**冲突**是一种特定的错误状态，
发生在执行 `Apply` 改变一个字段，而恰巧该字段被其他用户声明过主权时。
这可以防止一个应用者不小心覆盖掉其他用户设置的值。
冲突发生时，应用者有三种办法来解决它：

<!--
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
-->
* **覆盖前值，成为唯一的管理器：** 如果打算覆盖该值（或应用者是一个自动化部件，比如控制器），
  应用者应该设置查询参数 `force` 为 true（对 `kubectl apply` 来说，你可以使用命令行参数
  `--force-conflicts`），然后再发送一次请求。
  这将强制操作成功，改变字段的值，从所有其他管理器的 `managedFields` 条目中删除指定字段。

* **不覆盖前值，放弃管理权：** 如果应用者不再关注该字段的值，
  应用者可以从资源的本地模型中删掉它，并在省略该字段的情况下发送请求。
  这就保持了原值不变，并从 `managedFields` 的应用者条目中删除该字段。

* **不覆盖前值，成为共享的管理器：** 如果应用者仍然关注字段值，并不想覆盖它，
  他们可以更改资源的本地模型中该字段的值，以便与服务器上对象的值相匹配，
  然后基于本地更新发出新请求。这样做会保持值不变，
  并使得该字段的管理由应用者与已经声称管理该字段的所有其他字段管理者共享。

<!--
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
-->
## 字段管理器 {#managers}

管理器识别出正在修改对象的工作流程（在冲突时尤其有用）,
并且可以作为修改请求的一部分，通过
[`fieldManager`](/zh-cn/docs/reference/kubernetes-api/common-parameters/common-parameters/#fieldManager)
查询参数来指定。
当你 Apply 某个资源时，需要指定 `fieldManager` 参数。
对于其他更新，API 服务器使用 “User-Agent:” HTTP 头（如果存在）推断字段管理器标识。

当你使用 `kubectl` 工具执行服务器端应用操作时，`kubectl` 默认情况下会将管理器标识设置为 `“kubectl”`。


<!-- 
## Serialization

At the protocol level, Kubernetes represents Server-Side Apply message bodies
as [YAML](https://yaml.org/), with the media type `application/apply-patch+yaml`.
-->
## 序列化 {#serialization}

在协议层面，Kubernetes 用 [YAML](https://yaml.org/) 来表示 Server-Side Apply 的消息体，
媒体类型为 `application/apply-patch+yaml`。

{{< note >}}
<!-- 
Whether you are submitting JSON data or YAML data, use
`application/apply-patch+yaml` as the `Content-Type` header value.

All JSON documents are valid YAML. However, Kubernetes has a bug where it uses a YAML
parser that does not fully implement the YAML specification. Some JSON escapes may
not be recognized.
-->
不管你提交的是 JSON 数据还是 YAML 数据，
都要使用 `application/apply-patch+yaml` 作为 `Content-Type` 的值。

所有的 JSON 文档都是合法的 YAML。不过，Kubernetes 存在一个缺陷，
即它使用的 YAML 解析器没有完全实现 YAML 规范。
某些 JSON 转义可能无法被识别。
{{< /note >}}

<!--
The serialization is the same as for Kubernetes objects, with the exception that
clients are not required to send a complete object.

Here's an example of a Server-Side Apply message body (fully specified intent):
-->
序列化与 Kubernetes 对象相同，只是客户端不需要发送完整的对象。

以下是服务器端应用消息正文的示例（完整描述的意图）：

```yaml
{
  "apiVersion": "v1",
  "kind": "ConfigMap"
}
```

<!-- 
(this would make a no-change update, provided that it was sent as the body
of a **patch** request to a valid `v1/configmaps` resource, and with the
appropriate request `Content-Type`).
-->
（这个请求将导致无更改的更新，前提是它作为 **patch** 请求的主体发送到有效的 `v1/configmaps` 资源，
并且请求中设置了合适的 `Content-Type`）。

<!-- 
## Operations in scope for field management {#apply-and-update}

The Kubernetes API operations where field management is considered are:

1. Server-Side Apply (HTTP `PATCH`, with content type `application/apply-patch+yaml`)
2. Replacing an existing object (**update** to Kubernetes; `PUT` at the HTTP level)
-->
## 字段管理范围内的操作 {#apply-and-update}

考虑字段管理的 Kubernetes API 操作包括：

1. 服务器端应用（HTTP `PATCH`，内容类型为 `application/apply-patch+yaml`）
2. 替换现有对象（对 Kubernetes 而言是 **update**；HTTP 层面表现为 `PUT`）

<!-- 
Both operations update `.metadata.managedFields`, but behave a little differently.

Unless you specify a forced override, an apply operation that encounters field-level
conflicts always fails; by contrast, if you make a change using **update** that would
affect a managed field, a conflict never provokes failure of the operation.
-->
这两种操作都会更新 `.metadata.managedFields`，但行为略有不同。

除非你指定要强制重写，否则应用操作在遇到字段级冲突时总是会失败；
相比之下，如果你使用 **update** 进行的更改会影响托管字段，那么冲突从来不会导致操作失败。

<!--
All Server-Side Apply **patch** requests are required to identify themselves by providing a
`fieldManager` query parameter, while the query parameter is optional for **update**
operations. Finally, when using the `Apply` operation you cannot define `managedFields` in
the body of the request that you submit.

An example object with multiple managers could look like this:
-->
所有服务器端应用的 **patch** 请求都必须提供 `fieldManager` 查询参数来标识自己，
而此参数对于 **update** 操作是可选的。
最后，使用 `Apply` 操作时，不能在提交的请求主体中设置 `managedFields`。

一个包含多个管理器的对象，示例如下：

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

<!--
In this example, a second operation was run as an **update** by the manager called
`kube-controller-manager`. The update request succeeded and changed a value in the data
field, which caused that field's management to change to the `kube-controller-manager`.

If this update has instead been attempted using Server-Side Apply, the request
would have failed due to conflicting ownership.
-->
在这个例子中，
第二个操作被管理器 `kube-controller-manager` 以 **update** 的方式运行。
更新操作执行成功，并更改了 data 字段中的一个值，
并使得该字段的管理器被改为 `kube-controller-manager`。

如果尝试把更新操作改为服务器端应用，那么这一尝试会因为所有权冲突的原因，导致操作失败。

<!--
## Merge strategy

The merging strategy, implemented with Server-Side Apply, provides a generally
more stable object lifecycle. Server-Side Apply tries to merge fields based on
the actor who manages them instead of overruling based on values. This way
multiple actors can update the same object without causing unexpected interference.
-->
## 合并策略 {#merge-strategy}

由服务器端应用实现的合并策略，提供了一个总体更稳定的对象生命周期。
服务器端应用试图依据负责管理它们的主体来合并字段，而不是根据值来否决。
这么做是为了多个主体可以更新同一个对象，且不会引起意外的相互干扰。

<!--
When a user sends a _fully-specified intent_ object to the Server-Side Apply
endpoint, the server merges it with the live object favoring the value from the
request body if it is specified in both places. If the set of items present in
the applied config is not a superset of the items applied by the same user last
time, each missing item not managed by any other appliers is removed. For
more information about how an object's schema is used to make decisions when
merging, see
[sigs.k8s.io/structured-merge-diff](https://sigs.k8s.io/structured-merge-diff).
-->
当用户发送一个**完整描述的意图**对象到服务器端应用的服务端点时，
服务器会将它和当前对象做一次合并，如果两者中有重复定义的值，那就以请求体中的为准。
如果请求体中条目的集合不是此用户上一次操作条目的超集，
所有缺失的、没有其他应用者管理的条目会被删除。
关于合并时用来做决策的对象规格的更多信息，参见
[sigs.k8s.io/structured-merge-diff](https://sigs.k8s.io/structured-merge-diff).

<!--
The Kubernetes API (and the Go code that implements that API for Kubernetes) allows
defining _merge strategy markers_. These markers describe the merge strategy supported
for fields within Kubernetes objects.
For a {{< glossary_tooltip term_id="CustomResourceDefinition" text="CustomResourceDefinition" >}},
you can set these markers when you define the custom resource.
-->
Kubernetes API（以及为 Kubernetes 实现该 API 的 Go 代码）都允许定义**合并策略标记（Merge Strategy Markers）**。
这些标记描述 Kubernetes 对象中各字段所支持的合并策略。
Kubernetes 1.16 和 1.17 中添加了一些标记，
对一个 {{< glossary_tooltip term_id="CustomResourceDefinition" text="CustomResourceDefinition" >}}
来说，你可以在定义自定义资源时设置这些标记。

<!--
| Golang marker | OpenAPI extension | Possible values | Description |
|---|---|---|---|
| `//+listType` | `x-kubernetes-list-type` | `atomic`/`set`/`map` | Applicable to lists. `set` applies to lists that include only scalar elements. These elements must be unique. `map` applies to lists of nested types only. The key values (see `listMapKey`) must be unique in the list. `atomic` can apply to any list. If configured as `atomic`, the entire list is replaced during merge. At any point in time, a single manager owns the list. If `set` or `map`, different managers can manage entries separately. |
| `//+listMapKey` | `x-kubernetes-list-map-keys` | List of field names, e.g. `["port", "protocol"]` | Only applicable when `+listType=map`. A list of field names whose values uniquely identify entries in the list. While there can be multiple keys, `listMapKey` is singular because keys need to be specified individually in the Go type. The key fields must be scalars. |
| `//+mapType` | `x-kubernetes-map-type` | `atomic`/`granular` | Applicable to maps. `atomic` means that the map can only be entirely replaced by a single manager. `granular` means that the map supports separate managers updating individual fields. |
| `//+structType` | `x-kubernetes-map-type` | `atomic`/`granular` | Applicable to structs; otherwise same usage and OpenAPI annotation as `//+mapType`.|
-->
| Golang 标记 | OpenAPI 扩展 | 可接受的值 | 描述 |
|---|---|---|---|
| `//+listType` | `x-kubernetes-list-type` | `atomic`/`set`/`map` | 适用于 list。`set` 适用于仅包含标量元素的列表。其中的元素不可重复。`map` 仅适用于嵌套了其他类型的列表。列表中的键（参见 `listMapKey`）不可以重复。`atomic` 适用于所有类型的列表。如果配置为 `atomic`，则合并时整个列表会被替换掉。任何时候，只有一个管理器负责管理指定列表。如果配置为 `set` 或 `map`，不同的管理器也可以分开管理不同条目。 |
| `//+listMapKey` | `x-kubernetes-list-map-keys` | 字段名称的列表，例如，`["port", "protocol"]` | 仅当 `+listType=map` 时适用。取值为字段名称的列表，这些字段值的组合能够唯一标识列表中的条目。尽管可以存在多个键，`listMapKey` 是单数的，这是因为键名需要在 Go 类型中各自独立指定。键字段必须是标量。 |
| `//+mapType` | `x-kubernetes-map-type` | `atomic`/`granular` | 适用于 map。 `atomic` 表示 map 只能被某个管理器整体替换。 `granular` 表示 map 支持多个管理器各自更新自己的字段。 |
| `//+structType` | `x-kubernetes-map-type` | `atomic`/`granular` | 适用于 structs；此外，起用法和 OpenAPI 注释与 `//+mapType` 相同。|

<!--
If `listType` is missing, the API server interprets a
`patchStrategy=merge` marker as a `listType=map` and the
corresponding `patchMergeKey` marker as a `listMapKey`.

The `atomic` list type is recursive.

(In the [Go](https://go.dev/) code for Kubernetes, these markers are specified as
comments and code authors need not repeat them as field tags).
-->
若未指定 `listType`，API 服务器将 `patchStrategy=merge` 标记解释为
`listType=map` 并且视对应的 `patchMergeKey` 标记为 `listMapKey` 取值。

`atomic` 列表类型是递归的。

（在 Kubernetes 的 [Go](https://go.dev/) 代码中，
这些标记以注释的形式给出，代码作者不需要用字段标记的形式重复指定它们）。

<!--
## Custom resources and Server-Side Apply

By default, Server-Side Apply treats custom resources as unstructured data. All
keys are treated the same as struct fields, and all lists are considered atomic.
-->
### 自定义资源和服务器端应用  {#custom-resources-and-server-side-apply}

默认情况下，服务器端应用将自定义资源视为无结构的数据。
所有键被视为 struct 数据类型的字段，所有列表都被视为 atomic 形式。

<!-- 
If the CustomResourceDefinition defines a
[schema](/docs/reference/generated/kubernetes-api/{{< param "version" >}}#jsonschemaprops-v1-apiextensions-k8s-io)
that contains annotations as defined in the previous [Merge Strategy](#merge-strategy)
section, these annotations will be used when merging objects of this
type.
-->
如果 CustomResourceDefinition 定义了的
[schema](/zh-cn/docs/reference/generated/kubernetes-api/{{< param "version" >}}#jsonschemaprops-v1-apiextensions-k8s-io)
包含在上一小节[合并策略](#merge-strategy)中定义的注解，
那么在合并此类型的对象时，就会使用这些注解。

<!--
### Compatibility across topology changes

On rare occurrences, the author for a CustomResourceDefinition (CRD) or built-in
may want to change the specific topology of a field in their resource,
without incrementing its API version. Changing the topology of types,
by upgrading the cluster or updating the CRD, has different consequences when
updating existing objects. There are two categories of changes: when a field goes from
`map`/`set`/`granular` to `atomic`, and the other way around.
-->
### 拓扑变化时的兼容性  {#compatibility-across-toplogy-changes}

在极少的情况下，CustomResourceDefinition（CRD）的作者或者内置类型可能希望更改其资源中的某个字段的
拓扑配置，同时又不提升版本号。
通过升级集群或者更新 CRD 来更改类型的拓扑信息，与更新现有对象的结果不同。
变更的类型有两种：一种是将字段从 `map`/`set`/`granular` 更改为 `atomic`，
另一种是做逆向改变。

<!--
When the `listType`, `mapType`, or `structType` changes from
`map`/`set`/`granular` to `atomic`, the whole list, map, or struct of
existing objects will end-up being owned by actors who owned an element
of these types. This means that any further change to these objects
would cause a conflict.
-->
当 `listType`、`mapType` 或 `structType` 从 `map`/`set`/`granular` 改为
`atomic` 时，现有对象的整个列表、映射或结构的属主都会变为这些类型的
元素之一的属主。这意味着，对这些对象的进一步变更会引发冲突。

<!--
When a `listType`, `mapType`, or `structType` changes from `atomic` to
`map`/`set`/`granular`, the API server is unable to infer the new
ownership of these fields. Because of that, no conflict will be produced
when objects have these fields updated. For that reason, it is not
recommended to change a type from `atomic` to `map`/`set`/`granular`.

Take for example, the custom resource:
-->
当某 `listType`、`mapType` 或 `structType` 从 `atomic` 改为 `map`/`set`/`granular` 之一时，
API 服务器无法推导这些字段的新的属主。因此，当对象的这些字段
再次被更新时不会引发冲突。出于这一原因，不建议将某类型从 `atomic` 改为
`map`/`set`/`granular`。

以下面的自定义资源为例：

```yaml
---
apiVersion: example.com/v1
kind: Foo
metadata:
  name: foo-sample
  managedFields:
  - manager: manager-one
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

<!--
Before `spec.data` gets changed from `atomic` to `granular`,
`manager-one` owns the field `spec.data`, and all the fields within it
(`key1` and `key2`). When the CRD gets changed to make `spec.data`
`granular`, `manager-one` continues to own the top-level field
`spec.data` (meaning no other managers can delete the map called `data`
without a conflict), but it no longer owns `key1` and `key2`, so another
manager can then modify or delete those fields without conflict.
-->
在 `spec.data` 从 `atomic` 改为 `granular` 之前，
`manager-one` 是 `spec.data` 字段及其所包含字段（`key1` 和 `key2`）的属主。
当对应的 CRD 被更改，使得 `spec.data` 变为 `granular` 拓扑时，
`manager-one` 继续拥有顶层字段 `spec.data`（这意味着其他管理器想删除名为
`data` 的映射而不引起冲突是不可能的），但不再拥有 `key1` 和 `key2`。
因此，其他管理器可以在不引起冲突的情况下更改或删除这些字段。

<!--
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
-->
## 在控制器中使用服务器端应用 {#using-server-side-apply-in-controller}

控制器的开发人员可以把服务器端应用作为简化控制器的更新逻辑的方式。
读-改-写 和/或 patch 的主要区别如下所示：

* 应用的对象必须包含控制器关注的所有字段。
* 对于在控制器没有执行过应用操作之前就已经存在的字段，不能删除。
  （控制器在这种用例环境下，依然可以发送一个 **patch** 或 **update**）
* 对象不必事先读取，`resourceVersion` 不必指定。

强烈推荐：设置控制器始终在其拥有和管理的对象上强制冲突，这是因为冲突发生时，它们没有其他解决方案或措施。

<!--
## Transferring Ownership

In addition to the concurrency controls provided by [conflict resolution](#conflicts),
Server-Side Apply provides ways to perform coordinated
field ownership transfers from users to controllers.

This is best explained by example. Let's look at how to safely transfer
ownership of the `replicas` field from a user to a controller while enabling
automatic horizontal scaling for a Deployment, using the HorizontalPodAutoscaler
resource and its accompanying controller.

Say a user has defined Deployment with `replicas` set to the desired value:
-->
## 转移所有权 {#transferring-ownership}

除了通过[冲突解决方案](#conflicts)提供的并发控制，
服务器端应用提供了一些协作方式来将字段所有权从用户转移到控制器。

最好通过例子来说明这一点。
让我们来看看，在使用 Horizo​​ntalPodAutoscaler 资源和与之配套的控制器，
且开启了 Deployment 的自动水平扩展功能之后，
怎么安全的将 `replicas` 字段的所有权从用户转移到控制器。

假设用户定义了 Deployment，且 `replicas` 字段已经设置为期望的值：

{{% code_sample file="application/ssa/nginx-deployment.yaml" %}}

<!--
And the user has created the Deployment using Server-Side Apply, like so:
-->
并且，用户使用服务器端应用，像这样创建 Deployment：

```shell
kubectl apply -f https://k8s.io/examples/application/ssa/nginx-deployment.yaml --server-side
```

<!--
Then later, automatic scaling is enabled for the Deployment; for example:
-->
然后，为 Deployment 启用自动扩缩，例如：

```shell
kubectl autoscale deployment nginx-deployment --cpu-percent=50 --min=1 --max=10
```

<!--
Now, the user would like to remove `replicas` from their configuration, so they
don't accidentally fight with the HorizontalPodAutoscaler (HPA) and its controller.
However, there is a race: it might take some time before the HPA feels the need
to adjust `.spec.replicas`; if the user removes `.spec.replicas` before the HPA writes
to the field and becomes its owner, then the API server would set `.spec.replicas` to
1 (the default replica count for Deployment).
This is not what the user wants to happen, even temporarily - it might well degrade
a running workload.
-->
现在，用户希望从他们的配置中删除 `replicas`，从而避免与 HorizontalPodAutoscaler（HPA）及其控制器发生冲突。
然而，这里存在一个竞态：
在 HPA 需要调整 `.spec.replicas` 之前会有一个时间窗口，
如果在 HPA 写入字段并成为新的属主之前，用户删除了 `.spec.replicas`，
那 API 服务器就会把 `.spec.replicas` 的值设为 1（Deployment 的默认副本数）。
这不是用户希望发生的事情，即使是暂时的——它很可能会导致正在运行的工作负载降级。

<!--
There are two solutions:

- (basic) Leave `replicas` in the configuration; when the HPA eventually writes to that
  field, the system gives the user a conflict over it. At that point, it is safe
  to remove from the configuration.

- (more advanced) If, however, the user doesn't want to wait, for example
  because they want to keep the cluster legible to their colleagues, then they
  can take the following steps to make it safe to remove `replicas` from their
  configuration:

First, the user defines a new manifest containing only the `replicas` field:
-->
这里有两个解决方案：

- （基本操作）把 `replicas` 留在配置文件中；当 HPA 最终写入那个字段，
  系统基于此事件告诉用户：冲突发生了。在这个时间点，可以安全的删除配置文件。
- （高级操作）然而，如果用户不想等待，比如他们想为合作伙伴保持集群清晰，
  那他们就可以执行以下步骤，安全的从配置文件中删除 `replicas`。

首先，用户新定义一个只包含 `replicas` 字段的新清单：

```yaml
# 将此文件另存为 'nginx-deployment-replicas-only.yaml'
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
spec:
  replicas: 3
```

{{< note >}}
<!--
The YAML file for SSA in this case only contains the fields you want to change.
You are not supposed to provide a fully compliant Deployment manifest if you only
want to modify the `spec.replicas` field using SSA.
-->
此场景中针对 SSA 的 YAML 文件仅包含你要更改的字段。
如果只想使用 SSA 来修改 `spec.replicas` 字段，你无需提供完全兼容的 Deployment 清单。
{{< /note >}}

<!--
The user applies that manifest using a private field manager name. In this example,
the user picked `handover-to-hpa`:
-->
用户使用私有字段管理器名称应用该清单。在本例中，用户选择了 `handover-to-hpa`：

```shell
kubectl apply -f nginx-deployment-replicas-only.yaml \
  --server-side --field-manager=handover-to-hpa \
  --validate=false
```

<!--
If the apply results in a conflict with the HPA controller, then do nothing. The
conflict indicates the controller has claimed the field earlier in the
process than it sometimes does.

At this point the user may remove the `replicas` field from their manifest:
-->
如果应用操作和 HPA 控制器产生冲突，那什么都不做。
冲突表明控制器在更早的流程中已经对字段声明过所有权。

在此时间点，用户可以从清单中删除 `replicas` 。

{{% code_sample file="application/ssa/nginx-deployment-no-replicas.yaml" %}}

<!--
Note that whenever the HPA controller sets the `replicas` field to a new value,
the temporary field manager will no longer own any fields and will be
automatically deleted. No further clean up is required.
-->
注意，只要 HPA 控制器为 `replicas` 设置了一个新值，
该临时字段管理器将不再拥有任何字段，会被自动删除。
这里无需进一步清理。

<!--
### Transferring ownership between managers

Field managers can transfer ownership of a field between each other by setting the field
to the same value in both of their applied configurations, causing them to share
ownership of the field. Once the managers share ownership of the field, one of them
can remove the field from their applied configuration to give up ownership and
complete the transfer to the other field manager.
-->
### 在管理器之间转移所有权 {#transferring-ownership-between-managers}

通过在配置文件中把一个字段设置为相同的值，多个字段管理器可以在彼此之间转移字段的所有权，
从而实现字段所有权的共享。
当某管理器共享了字段的所有权，管理器中任何一个成员都可以从其应用的配置中删除该字段，
从而放弃所有权，并完成了所有权向其他字段管理器的转移。

<!--
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
-->
## 与客户端应用的对比 {#comparison-with-client-side-apply}

服务器端应用意味着既可以替代原来 `kubectl apply` 子命令的客户端实现，
也可供{{< glossary_tooltip term_id="controller" text="控制器" >}}作为实施变更的简单有效机制。

与 `kubectl` 管理的 `last-applied` 注解相比，
服务器端应用使用一种更具声明性的方法来跟踪对象的字段管理，而不是记录用户最后一次应用的状态。
这意味着，使用服务器端应用的副作用，就是字段管理器所管理的对象的每个字段的相关信息也会变得可用。

<!-- 
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
-->
由服务器端应用实现的冲突检测和解决方案的一个结果就是，
应用者总是可以在本地状态中得到最新的字段值。
如果得不到最新值，下次执行应用操作时就会发生冲突。
解决冲突三个选项的任意一个都会保证：此应用过的配置文件是服务器上对象字段的最新子集。

这和客户端应用（Client-Side Apply）不同，如果有其他用户覆盖了此值，
过期的值被留在了应用者本地的配置文件中。
除非用户更新了特定字段，此字段才会准确，
应用者没有途径去了解下一次应用操作是否会覆盖其他用户的修改。

另一个区别是使用客户端应用的应用者不能改变他们正在使用的 API 版本，但服务器端应用支持这个场景。

<!--
## Migration between client-side and server-side apply

### Upgrading from client-side apply to server-side apply

Client-side apply users who manage a resource with `kubectl apply` can start
using server-side apply with the following flag.
-->
## 客户端应用和服务器端应用的迁移 {#migration-between-client-side-and-server-side-apply}

### 从客户端应用升级到服务器端应用 {#upgrading-from-client-side-apply-to-server-side-apply}

客户端应用方式时，用户使用 `kubectl apply` 管理资源，
可以通过使用下面标记切换为使用服务器端应用。

```shell
kubectl apply --server-side [--dry-run=server]
```
<!--
By default, field management of the object transfers from client-side apply to
kubectl server-side apply, without encountering conflicts.
-->
默认情况下，对象的字段管理从客户端应用方式迁移到 kubectl 触发的服务器端应用时，不会发生冲突。

{{< caution >}}
<!--
Keep the `last-applied-configuration` annotation up to date.
The annotation infers client-side applies managed fields.
Any fields not managed by client-side apply raise conflicts.

For example, if you used `kubectl scale` to update the replicas field after
client-side apply, then this field is not owned by client-side apply and
creates conflicts on `kubectl apply --server-side`.
-->
保持注解 `last-applied-configuration` 是最新的。
从注解能推断出字段是由客户端应用管理的。
任何没有被客户端应用管理的字段将引发冲突。

举例说明，比如你在客户端应用之后，
使用 `kubectl scale` 去更新 `replicas` 字段，
可是该字段并没有被客户端应用所拥有，
在执行 `kubectl apply --server-side` 时就会产生冲突。
{{< /caution >}}

<!--
This behavior applies to server-side apply with the `kubectl` field manager.
As an exception, you can opt-out of this behavior by specifying a different,
non-default field manager, as seen in the following example. The default field
manager for kubectl server-side apply is `kubectl`.
-->
此操作以 `kubectl` 作为字段管理器来应用到服务器端应用。
作为例外，可以指定一个不同的、非默认字段管理器停止的这种行为，如下面的例子所示。
对于 kubectl 触发的服务器端应用，默认的字段管理器是 `kubectl`。

```shell
kubectl apply --server-side --field-manager=my-manager [--dry-run=server]
```

<!--
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
-->
### 从服务器端应用降级到客户端应用 {#downgrading-from-server-side-apply-to-client-side-apply}

如果你用 `kubectl apply --server-side` 管理一个资源，
可以直接用 `kubectl apply` 命令将其降级为客户端应用。

降级之所以可行，这是因为 `kubectl server-side apply`
会保存最新的 `last-applied-configuration` 注解。

此操作以 `kubectl` 作为字段管理器应用到服务器端应用。
作为例外，可以指定一个不同的、非默认字段管理器停止这种行为，如下面的例子所示。
对于 kubectl 触发的服务器端应用，默认的字段管理器是 `kubectl`。

```shell
kubectl apply --server-side --field-manager=my-manager [--dry-run=server]
```

<!--
## API implementation

The `PATCH` verb for a resource that supports Server-Side Apply can accepts the
unofficial `application/apply-patch+yaml` content type. Users of Server-Side
Apply can send partially specified objects as YAML as the body of a `PATCH` request
to the URI of a resource.  When applying a configuration, you should always include all the
fields that are important to the outcome (such as a desired state) that you want to define.

All JSON messages are valid YAML. Some clients specify Server-Side Apply requests using YAML
request bodies that are also valid JSON.
-->
## API 实现 {#api-implementation}

支持服务器端应用的资源的 `PATCH` 动词可以接受非官方的 `application/apply-patch+yaml` 内容类型。
服务器端应用的用户可以将部分指定的对象以 YAML 格式作为 `PATCH` 请求的主体发送到资源的 URI。
应用配置时，你应该始终包含对要定义的结果（如所需状态）重要的所有字段。

所有 JSON 消息都是有效的 YAML。一些客户端使用 YAML 请求体指定服务器端应用请求，
而这些 YAML 同样是合法的 JSON。

<!-- 
### Access control and permissions {#rbac-and-permissions}

Since Server-Side Apply is a type of `PATCH`, a principal (such as a Role for Kubernetes
{{< glossary_tooltip text="RBAC" term_id="rbac" >}}) requires the **patch** permission to
edit existing resources, and also needs the **create** verb permission in order to create
new resources with Server-Side Apply.
-->
### 访问控制和权限 {#rbac-and-permissions}

由于服务端应用是一种 `PATCH` 类型的操作，
所以一个主体（例如 Kubernetes {{< glossary_tooltip text="RBAC" term_id="rbac" >}} 的 Role）需要
**patch** 权限才能编辑存量资源，还需要 **create** 权限才能使用服务器端应用创建新资源。

<!--
## Clearing `managedFields`

It is possible to strip all `managedFields` from an object by overwriting them
using a **patch** (JSON Merge Patch, Strategic Merge Patch, JSON Patch), or
through an **update** (HTTP `PUT`); in other words, through every write operation
other than **apply**. This can be done by overwriting the `managedFields` field
with an empty entry. Two examples are:
-->
## 清除 `managedFields` {#clearing-managedfields}

通过使用 **patch**（JSON Merge Patch, Strategic Merge Patch, JSON Patch）覆盖对象，
或者通过 **update**（HTTP `PUT`），可以从对象中剥离所有 `managedFields`；
换句话说，通过除了 **apply** 之外的所有写操作均可实现这点。
清除 `managedFields` 字段的操作可以通过用空条目覆盖 `managedFields` 字段的方式实现。以下是两个示例：

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

<!--
This will overwrite the `managedFields` with a list containing a single empty
entry that then results in the `managedFields` being stripped entirely from the
object. Note that setting the `managedFields` to an empty list will not
reset the field. This is on purpose, so `managedFields` never get stripped by
clients not aware of the field.

In cases where the reset operation is combined with changes to other fields
than the `managedFields`, this will result in the `managedFields` being reset
first and the other changes being processed afterwards. As a result the
applier takes ownership of any fields updated in the same request.
-->
这一操作将用只包含一个空条目的列表来覆盖 `managedFields`，
从而实现从对象中整体去除 `managedFields`。
注意，只把 `managedFields` 设置为空列表并不会重置该字段。
这一设计是有意为之的，目的是避免 `managedFields` 被与该字段无关的客户删除。

在某些场景中，执行重置操作的同时还会给出对 `managedFields` 之外的别的字段的变更，
对于这类操作，`managedFields` 首先会被重置，其他变更被压后处理。
其结果是，应用者取得了同一个请求中所有字段的所有权。

{{< note >}}
<!-- 
Server-Side Apply does not correctly track ownership on
sub-resources that don't receive the resource object type. If you are
using Server-Side Apply with such a sub-resource, the changed fields
may not be tracked.
-->
对于无法接收资源对象类型的子资源，服务器端应用无法正确跟踪其所有权。
如果你将针对此类子资源使用服务器端应用，则可能无法跟踪被变更的字段。
{{< /note >}}

## {{% heading "whatsnext" %}}

<!-- 
You can read about `managedFields` within the Kubernetes API reference for the
[`metadata`](/docs/reference/kubernetes-api/common-definitions/object-meta/)
top level field.
-->
你可以阅读 Kubernetes API 参考中的
[`metadata`](/zh-cn/docs/reference/kubernetes-api/common-definitions/object-meta/)
顶级字段的 `managedFields`。
