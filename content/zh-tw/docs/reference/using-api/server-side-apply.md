---
title: 伺服器端應用（Server-Side Apply）
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
Kubernetes 支持多個應用程式協作管理一個[對象](/zh-cn/docs/concepts/overview/working-with-objects/)的字段。
伺服器端應用爲叢集的控制平面提供了一種可選機制，用於跟蹤對對象字段的更改。
在特定資源級別，伺服器端應用記錄並跟蹤有關控制該對象字段的資訊。

<!--
Server-Side Apply helps users and {{< glossary_tooltip text="controllers" term_id="controller" >}}
manage their resources through declarative configuration. Clients can create and modify
{{< glossary_tooltip text="objects" term_id="object" >}}
declaratively by submitting their _fully specified intent_.
-->
伺服器端應用協助使用者和{{< glossary_tooltip text="控制器" term_id="controller" >}}通過聲明式設定的方式管理他們的資源。
客戶提交他們**完整描述的意圖**，聲明式地創建和修改{{< glossary_tooltip text="對象" term_id="object" >}}。

<!--
A fully specified intent is a partial object that only includes the fields and
values for which the user has an opinion. That intent either creates a new
object (using default values for unspecified fields), or is
[combined](#merge-strategy), by the API server, with the existing object.

[Comparison with Client-Side Apply](#comparison-with-client-side-apply) explains
how Server-Side Apply differs from the original, client-side `kubectl apply`
implementation.
-->
一個完整描述的意圖並不是一個完整的對象，僅包括能體現使用者意圖的字段和值。
該意圖可以用來創建一個新對象（未指定的字段使用預設值），
也可以通過 API 伺服器來實現與現有對象的[合併](#merge-strategy)。

[與客戶端應用對比](#comparison-with-client-side-apply)小節解釋了伺服器端應用與最初的客戶端
`kubectl apply` 實現的區別。

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

Kubernetes API 伺服器跟蹤所有新建對象的**受控字段（Managed Fields）**。

當嘗試應用對象時，由另一個[管理器](#managers)擁有的字段且具有不同值，將導致[衝突](#conflicts)。
這樣做是爲了表明操作可能會撤消另一個合作者的更改。
可以強制寫入具有託管字段的對象，在這種情況下，任何衝突字段的值都將被覆蓋，並且所有權將被轉移。

<!--
Whenever a field's value does change, ownership moves from its current manager to the
manager making the change.

Apply checks if there are any other field managers that also own the
field.  If the field is not owned by any other field managers, that field is
set to its default value (if there is one), or otherwise is deleted from the
object.
The same rule applies to fields that are lists, associative lists, or maps.
-->
每當字段的值確實發生變化時，所有權就會從其當前管理器轉移到進行更改的管理器。

伺服器端應用會檢查是否存在其他字段管理器也擁有該字段。
如果該字段不屬於任何其他字段管理器，則該字段將被設置爲其預設值（如果有），或者以其他方式從對象中刪除。
同樣的規則也適用於作爲列表（list）、關聯列表或鍵值對（map）的字段。

<!--
For a user to manage a field, in the Server-Side Apply sense, means that the
user relies on and expects the value of the field not to change. The user who
last made an assertion about the value of a field will be recorded as the
current field manager. This can be done by changing the field manager
details explicitly using HTTP `POST` (**create**), `PUT` (**update**), or non-apply
`PATCH` (**patch**). You can also declare and record a field manager
by including a value for that field in a Server-Side Apply operation.
-->
使用者管理字段這件事，在伺服器端應用的場景中，意味着使用者依賴並期望字段的值不要改變。
最後一次對字段值做出斷言的使用者將被記錄到當前字段管理器。
這可以通過發送 `POST`（**create**）、`PUT`（**update**）、或非應用的 `PATCH`（**patch**）
顯式更改字段管理器詳細資訊來實現。
你還可以通過在伺服器端應用操作中包含字段的值來聲明和記錄字段管理器。

<!--
A Server-Side Apply **patch** request requires the client to provide its identity
as a [field manager](#managers). When using Server-Side Apply, trying to change a
field that is controlled by a different manager results in a rejected
request unless the client forces an override.
For details of overrides, see [Conflicts](#conflicts).
-->
伺服器端應用場景中的 **patch** 請求要求客戶端提供自身的標識作爲[字段管理器（Field Manager）](#managers)。
使用伺服器端應用時，如果嘗試變更由別的管理器來控制的字段，會導致請求被拒絕，除非客戶端強制要求進行覆蓋。
關於覆蓋操作的細節，可參閱[衝突](#conflicts)節。

<!--
When two or more appliers set a field to the same value, they share ownership of
that field. Any subsequent attempt to change the value of the shared field, by any of
the appliers, results in a conflict. Shared field owners may give up ownership
of a field by making a Server-Side Apply **patch** request that doesn't include
that field.

Field management details are stored in a `managedFields` field that is part of an
object's [`metadata`](/docs/reference/kubernetes-api/common-definitions/object-meta/).
-->
如果兩個或以上的應用者均把同一個字段設置爲相同值，他們將共享此字段的所有權。
後續任何改變共享字段值的嘗試，不管由那個應用者發起，都會導致衝突。
共享字段的所有者可以放棄字段的所有權，這隻需發出不包含該字段的伺服器端應用 **patch** 請求即可。

字段管理的資訊儲存在 `managedFields` 字段中，該字段是對象的
[`metadata`](/zh-cn/docs/reference/kubernetes-api/common-definitions/object-meta/)
中的一部分。

<!--
If you remove a field from a manifest and apply that manifest, Server-Side
Apply checks if there are any other field managers that also own the field.
If the field is not owned by any other field managers, it is either deleted
from the live object or reset to its default value, if it has one.
The same rule applies to associative list or map items.
-->
如果從清單中刪除某個字段並應用該清單，則伺服器端應用會檢查是否有其他字段管理器也擁有該字段。
如果該字段不屬於任何其他字段管理器，則伺服器會將其從活動對象中刪除，或者重置爲其預設值（如果有）。
同樣的規則也適用於關聯列表（list）或鍵值對（map）。

<!--
Compared to the (legacy)
[`kubectl.kubernetes.io/last-applied-configuration`](/docs/reference/labels-annotations-taints/#kubectl-kubernetes-io-last-applied-configuration)
annotation managed by `kubectl`, Server-Side Apply uses a more declarative
approach, that tracks a user's (or client's) field management, rather than
a user's last applied state. As a side effect of using Server-Side Apply,
information about which field manager manages each field in an object also
becomes available.
-->
與（舊版）由 `kubectl` 所管理的註解
[`kubectl.kubernetes.io/last-applied configuration`](/zh-cn/docs/reference/labels-annotations-taints/#kubectl-kubernetes-io-last-applied-configuration)
相比，伺服器端應用使用了一種更具聲明式的方法，
它跟蹤使用者（或客戶端）的字段管理，而不是使用者上次應用的狀態。
作爲伺服器端應用的副作用，哪個字段管理器管理的對象的哪個字段的相關資訊也會變得可用。

<!--
### Example {#ssa-example-configmap}

A simple example of an object created using Server-Side Apply could look like this:
-->
### 示例 {#ssa-example-configmap}

伺服器端應用創建對象的簡單示例如下：

{{< note >}}
<!--
`kubectl get` omits managed fields by default. 
Add `--show-managed-fields` to show `managedFields` when the output format is either `json` or `yaml`.
-->
`kubectl get` 預設省略 `managedFields`。
當輸出格式爲 `json` 或 `yaml` 時，你可以添加 `--show-managed-fields` 參數以顯示 `managedFields`。
{{< /note >}}

<!--
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
-->
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
    operation: Apply # 注意大寫：“Apply” (或者 “Update”)
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
示例的 ConfigMap 對象在 `.metadata.managedFields` 中包含字段管理記錄。
字段管理記錄包括關於管理實體本身的基本資訊，以及關於被管理的字段和相關操作（`Apply` 或 `Update`）的詳細資訊。
如果最後更改該字段的請求是伺服器端應用的 **patch** 操作，則 `operation` 的值爲 `Apply`；否則爲 `Update`。

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
還有另一種可能的結果。客戶端會提交無效的請求體。
如果完整描述的意圖沒有構造出有效的對象，則請求失敗。

但是，可以通過 **update** 或不使用伺服器端應用的 **patch** 操作去更新 `.metadata.managedFields`。
強烈不鼓勵這麼做，但當發生如下情況時，
比如 `managedFields` 進入不一致的狀態（顯然不應該發生這種情況），
這麼做也是一個合理的嘗試。

<!--
The format of `managedFields` is [described](/docs/reference/kubernetes-api/common-definitions/object-meta/#System)
in the Kubernetes API reference.
-->
`managedFields` 的格式在 Kubernetes API 參考中[描述](/zh-cn/docs/reference/kubernetes-api/common-definitions/object-meta/#System)。

{{< caution >}}
<!--
The `.metadata.managedFields` field is managed by the API server.
You should avoid updating it manually.
-->
`.metadata.managedFields` 字段由 API 伺服器管理。
你不應該手動更新它。
{{< /caution >}}

<!--
## Conflicts

A _conflict_ is a special status error that occurs when an `Apply` operation tries
to change a field that another manager also claims to manage. This prevents an
applier from unintentionally overwriting the value set by another user. When
this occurs, the applier has 3 options to resolve the conflicts:
-->
## 衝突 {#conflicts}

**衝突**是一種特定的錯誤狀態，
發生在執行 `Apply` 改變一個字段，而恰巧該字段被其他使用者聲明過主權時。
這可以防止一個應用者不小心覆蓋掉其他使用者設置的值。
衝突發生時，應用者有三種辦法來解決它：

<!--
* **Overwrite value, become sole manager:** If overwriting the value was
  intentional (or if the applier is an automated process like a controller) the
  applier should set the `force` query parameter to true (for `kubectl apply`,
  you use the `--force-conflicts` command line parameter), and make the request
  again. This forces the operation to succeed, changes the value of the field,
  and removes the field from all other managers' entries in `managedFields`.
-->
* **覆蓋前值，成爲唯一的管理器：** 如果打算覆蓋該值（或應用者是一個自動化部件，比如控制器），
  應用者應該設置查詢參數 `force` 爲 true（對 `kubectl apply` 來說，你可以使用命令列參數
  `--force-conflicts`），然後再發送一次請求。
  這將強制操作成功，改變字段的值，從所有其他管理器的 `managedFields` 條目中刪除指定字段。

<!--
* **Don't overwrite value, give up management claim:** If the applier doesn't
  care about the value of the field any more, the applier can remove it from their
  local model of the resource, and make a new request with that particular field
  omitted. This leaves the value unchanged, and causes the field to be removed
  from the applier's entry in `managedFields`.
-->
* **不覆蓋前值，放棄管理權：** 如果應用者不再關注該字段的值，
  應用者可以從資源的本地模型中刪掉它，並在省略該字段的情況下發送請求。
  這就保持了原值不變，並從 `managedFields` 的應用者條目中刪除該字段。

<!--
* **Don't overwrite value, become shared manager:** If the applier still cares
  about the value of a field, but doesn't want to overwrite it, they can
  change the value of that field in their local model of the resource so as to
  match the value of the object on the server, and then make a new request that
  takes into account that local update. Doing so leaves the value unchanged,
  and causes that field's management to be shared by the applier along with all
  other field managers that already claimed to manage it.
-->
* **不覆蓋前值，成爲共享的管理器：** 如果應用者仍然關注字段值，並不想覆蓋它，
  他們可以更改資源的本地模型中該字段的值，以便與伺服器上對象的值相匹配，
  然後基於本地更新發出新請求。這樣做會保持值不變，
  並使得該字段的管理由應用者與已經聲稱管理該字段的所有其他字段管理者共享。

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

管理器識別出正在修改對象的工作流程（在衝突時尤其有用）,
並且可以作爲修改請求的一部分，通過
[`fieldManager`](/zh-cn/docs/reference/kubernetes-api/common-parameters/common-parameters/#fieldManager)
查詢參數來指定。
當你 Apply 某個資源時，需要指定 `fieldManager` 參數。
對於其他更新，API 伺服器使用 “User-Agent:” HTTP 頭（如果存在）推斷字段管理器標識。

當你使用 `kubectl` 工具執行伺服器端應用操作時，`kubectl` 預設情況下會將管理器標識設置爲 `“kubectl”`。

<!--
## Serialization

At the protocol level, Kubernetes represents Server-Side Apply message bodies
as [YAML](https://yaml.org/), with the media type `application/apply-patch+yaml`.
-->
## 序列化 {#serialization}

在協議層面，Kubernetes 用 [YAML](https://yaml.org/) 來表示伺服器端應用的消息體，
媒體類型爲 `application/apply-patch+yaml`。

{{< note >}}
<!--
Whether you are submitting JSON data or YAML data, use
`application/apply-patch+yaml` as the `Content-Type` header value.

All JSON documents are valid YAML. However, Kubernetes has a bug where it uses a YAML
parser that does not fully implement the YAML specification. Some JSON escapes may
not be recognized.
-->
不管你提交的是 JSON 資料還是 YAML 資料，
都要使用 `application/apply-patch+yaml` 作爲 `Content-Type` 的值。

所有的 JSON 文檔都是合法的 YAML。不過，Kubernetes 存在一個缺陷，
即它使用的 YAML 解析器沒有完全實現 YAML 規範。
某些 JSON 轉義可能無法被識別。
{{< /note >}}

<!--
The serialization is the same as for Kubernetes objects, with the exception that
clients are not required to send a complete object.

Here's an example of a Server-Side Apply message body (fully specified intent):
-->
序列化與 Kubernetes 對象相同，只是客戶端不需要發送完整的對象。

以下是伺服器端應用消息正文的示例（完整描述的意圖）：

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
（這個請求將導致無更改的更新，前提是它作爲 **patch** 請求的主體發送到有效的 `v1/configmaps` 資源，
並且請求中設置了合適的 `Content-Type`）。

<!--
## Operations in scope for field management {#apply-and-update}

The Kubernetes API operations where field management is considered are:

1. Server-Side Apply (HTTP `PATCH`, with content type `application/apply-patch+yaml`)
2. Replacing an existing object (**update** to Kubernetes; `PUT` at the HTTP level)
-->
## 字段管理範圍內的操作 {#apply-and-update}

考慮字段管理的 Kubernetes API 操作包括：

1. 伺服器端應用（HTTP `PATCH`，內容類型爲 `application/apply-patch+yaml`）
2. 替換現有對象（對 Kubernetes 而言是 **update**；HTTP 層面表現爲 `PUT`）

<!--
Both operations update `.metadata.managedFields`, but behave a little differently.

Unless you specify a forced override, an apply operation that encounters field-level
conflicts always fails; by contrast, if you make a change using **update** that would
affect a managed field, a conflict never provokes failure of the operation.
-->
這兩種操作都會更新 `.metadata.managedFields`，但行爲略有不同。

除非你指定要強制重寫，否則應用操作在遇到字段級衝突時總是會失敗；
相比之下，如果你使用 **update** 進行的更改會影響託管字段，那麼衝突從來不會導致操作失敗。

<!--
All Server-Side Apply **patch** requests are required to identify themselves by providing a
`fieldManager` query parameter, while the query parameter is optional for **update**
operations. Finally, when using the `Apply` operation you cannot define `managedFields` in
the body of the request that you submit.

An example object with multiple managers could look like this:
-->
所有伺服器端應用的 **patch** 請求都必須提供 `fieldManager` 查詢參數來標識自己，
而此參數對於 **update** 操作是可選的。
最後，使用 `Apply` 操作時，不能在提交的請求主體中設置 `managedFields`。

一個包含多個管理器的對象，示例如下：

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
在這個例子中，
第二個操作被管理器 `kube-controller-manager` 以 **update** 的方式運行。
更新操作執行成功，並更改了 data 字段中的一個值，
並使得該字段的管理器被改爲 `kube-controller-manager`。

如果嘗試把更新操作改爲伺服器端應用，那麼這一嘗試會因爲所有權衝突的原因，導致操作失敗。

<!--
## Merge strategy

The merging strategy, implemented with Server-Side Apply, provides a generally
more stable object lifecycle. Server-Side Apply tries to merge fields based on
the actor who manages them instead of overruling based on values. This way
multiple actors can update the same object without causing unexpected interference.
-->
## 合併策略 {#merge-strategy}

由伺服器端應用實現的合併策略，提供了一個總體更穩定的對象生命週期。
伺服器端應用試圖依據負責管理它們的主體來合併字段，而不是根據值來否決。
這麼做是爲了多個主體可以更新同一個對象，且不會引起意外的相互干擾。

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
當使用者發送一個**完整描述的意圖**對象到伺服器端應用的服務端點時，
伺服器會將它和當前對象做一次合併，如果兩者中有重複定義的值，那就以請求體中的爲準。
如果請求體中條目的集合不是此使用者上一次操作條目的超集，
所有缺失的、沒有其他應用者管理的條目會被刪除。
關於合併時用來做決策的對象規格的更多資訊，參見
[sigs.k8s.io/structured-merge-diff](https://sigs.k8s.io/structured-merge-diff).

<!--
The Kubernetes API (and the Go code that implements that API for Kubernetes) allows
defining _merge strategy markers_. These markers describe the merge strategy supported
for fields within Kubernetes objects.
For a {{< glossary_tooltip term_id="CustomResourceDefinition" text="CustomResourceDefinition" >}},
you can set these markers when you define the custom resource.
-->
Kubernetes API（以及爲 Kubernetes 實現該 API 的 Go 代碼）都允許定義**合併策略標記（Merge Strategy Markers）**。
這些標記描述 Kubernetes 對象中各字段所支持的合併策略。
Kubernetes 1.16 和 1.17 中添加了一些標記，
對一個 {{< glossary_tooltip term_id="CustomResourceDefinition" text="CustomResourceDefinition" >}}
來說，你可以在定義自定義資源時設置這些標記。

<!--
| Golang marker | OpenAPI extension | Possible values | Description |
|---|---|---|---|
| `//+listType` | `x-kubernetes-list-type` | `atomic`/`set`/`map` | Applicable to lists. `set` applies to lists that include only scalar elements. These elements must be unique. `map` applies to lists of nested types only. The key values (see `listMapKey`) must be unique in the list. `atomic` can apply to any list. If configured as `atomic`, the entire list is replaced during merge. At any point in time, a single manager owns the list. If `set` or `map`, different managers can manage entries separately. |
| `//+listMapKey` | `x-kubernetes-list-map-keys` | List of field names, e.g. `["port", "protocol"]` | Only applicable when `+listType=map`. A list of field names whose values uniquely identify entries in the list. While there can be multiple keys, `listMapKey` is singular because keys need to be specified individually in the Go type. The key fields must be scalars. |
| `//+mapType` | `x-kubernetes-map-type` | `atomic`/`granular` | Applicable to maps. `atomic` means that the map can only be entirely replaced by a single manager. `granular` means that the map supports separate managers updating individual fields. |
| `//+structType` | `x-kubernetes-map-type` | `atomic`/`granular` | Applicable to structs; otherwise same usage and OpenAPI annotation as `//+mapType`.|
-->
| Golang 標記 | OpenAPI 擴展 | 可接受的值 | 描述 |
|---|---|---|---|
| `//+listType` | `x-kubernetes-list-type` | `atomic`/`set`/`map` | 適用於 list。`set` 適用於僅包含標量元素的列表。其中的元素不可重複。`map` 僅適用於嵌套了其他類型的列表。列表中的鍵（參見 `listMapKey`）不可以重複。`atomic` 適用於所有類型的列表。如果設定爲 `atomic`，則合併時整個列表會被替換掉。任何時候，只有一個管理器負責管理指定列表。如果設定爲 `set` 或 `map`，不同的管理器也可以分開管理不同條目。 |
| `//+listMapKey` | `x-kubernetes-list-map-keys` | 字段名稱的列表，例如，`["port", "protocol"]` | 僅當 `+listType=map` 時適用。取值爲字段名稱的列表，這些字段值的組合能夠唯一標識列表中的條目。儘管可以存在多個鍵，`listMapKey` 是單數的，這是因爲鍵名需要在 Go 類型中各自獨立指定。鍵字段必須是標量。 |
| `//+mapType` | `x-kubernetes-map-type` | `atomic`/`granular` | 適用於 map。 `atomic` 表示 map 只能被某個管理器整體替換。 `granular` 表示 map 支持多個管理器各自更新自己的字段。 |
| `//+structType` | `x-kubernetes-map-type` | `atomic`/`granular` | 適用於 structs；此外，起用法和 OpenAPI 註釋與 `//+mapType` 相同。|

<!--
If `listType` is missing, the API server interprets a
`patchStrategy=merge` marker as a `listType=map` and the
corresponding `patchMergeKey` marker as a `listMapKey`.

The `atomic` list type is recursive.

(In the [Go](https://go.dev/) code for Kubernetes, these markers are specified as
comments and code authors need not repeat them as field tags).
-->
若未指定 `listType`，API 伺服器將 `patchStrategy=merge` 標記解釋爲
`listType=map` 並且視對應的 `patchMergeKey` 標記爲 `listMapKey` 取值。

`atomic` 列表類型是遞歸的。

（在 Kubernetes 的 [Go](https://go.dev/) 代碼中，
這些標記以註釋的形式給出，代碼作者不需要用字段標記的形式重複指定它們）。

<!--
## Custom resources and Server-Side Apply

By default, Server-Side Apply treats custom resources as unstructured data. All
keys are treated the same as struct fields, and all lists are considered atomic.
-->
### 自定義資源和伺服器端應用  {#custom-resources-and-server-side-apply}

預設情況下，伺服器端應用將自定義資源視爲無結構的資料。
所有鍵被視爲 struct 資料類型的字段，所有列表都被視爲 atomic 形式。

<!--
If the CustomResourceDefinition defines a
[schema](/docs/reference/generated/kubernetes-api/{{< param "version" >}}#jsonschemaprops-v1-apiextensions-k8s-io)
that contains annotations as defined in the previous [Merge Strategy](#merge-strategy)
section, these annotations will be used when merging objects of this
type.
-->
如果 CustomResourceDefinition 定義了的
[schema](/zh-cn/docs/reference/generated/kubernetes-api/{{< param "version" >}}#jsonschemaprops-v1-apiextensions-k8s-io)
包含在上一小節[合併策略](#merge-strategy)中定義的註解，
那麼在合併此類型的對象時，就會使用這些註解。

<!--
### Compatibility across topology changes

On rare occurrences, the author for a CustomResourceDefinition (CRD) or built-in
may want to change the specific topology of a field in their resource,
without incrementing its API version. Changing the topology of types,
by upgrading the cluster or updating the CRD, has different consequences when
updating existing objects. There are two categories of changes: when a field goes from
`map`/`set`/`granular` to `atomic`, and the other way around.
-->
### 拓撲變化時的兼容性  {#compatibility-across-toplogy-changes}

在極少的情況下，CustomResourceDefinition（CRD）的作者或者內置類型可能希望更改其資源中的某個字段的
拓撲設定，同時又不提升版本號。
通過升級叢集或者更新 CRD 來更改類型的拓撲資訊，與更新現有對象的結果不同。
變更的類型有兩種：一種是將字段從 `map`/`set`/`granular` 更改爲 `atomic`，
另一種是做逆向改變。

<!--
When the `listType`, `mapType`, or `structType` changes from
`map`/`set`/`granular` to `atomic`, the whole list, map, or struct of
existing objects will end-up being owned by actors who owned an element
of these types. This means that any further change to these objects
would cause a conflict.
-->
當 `listType`、`mapType` 或 `structType` 從 `map`/`set`/`granular` 改爲
`atomic` 時，現有對象的整個列表、映射或結構的屬主都會變爲這些類型的
元素之一的屬主。這意味着，對這些對象的進一步變更會引發衝突。

<!--
When a `listType`, `mapType`, or `structType` changes from `atomic` to
`map`/`set`/`granular`, the API server is unable to infer the new
ownership of these fields. Because of that, no conflict will be produced
when objects have these fields updated. For that reason, it is not
recommended to change a type from `atomic` to `map`/`set`/`granular`.

Take for example, the custom resource:
-->
當某 `listType`、`mapType` 或 `structType` 從 `atomic` 改爲 `map`/`set`/`granular` 之一時，
API 伺服器無法推導這些字段的新的屬主。因此，當對象的這些字段
再次被更新時不會引發衝突。出於這一原因，不建議將某類型從 `atomic` 改爲
`map`/`set`/`granular`。

以下面的自定義資源爲例：

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
    fieldsType: FieldsV1
    fieldsV1:
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
在 `spec.data` 從 `atomic` 改爲 `granular` 之前，
`manager-one` 是 `spec.data` 字段及其所包含字段（`key1` 和 `key2`）的屬主。
當對應的 CRD 被更改，使得 `spec.data` 變爲 `granular` 拓撲時，
`manager-one` 繼續擁有頂層字段 `spec.data`（這意味着其他管理器想刪除名爲
`data` 的映射而不引起衝突是不可能的），但不再擁有 `key1` 和 `key2`。
因此，其他管理器可以在不引起衝突的情況下更改或刪除這些字段。

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
## 在控制器中使用伺服器端應用 {#using-server-side-apply-in-controller}

控制器的開發人員可以把伺服器端應用作爲簡化控制器的更新邏輯的方式。
讀-改-寫 和/或 patch 的主要區別如下所示：

* 應用的對象必須包含控制器關注的所有字段。
* 對於在控制器沒有執行過應用操作之前就已經存在的字段，不能刪除。
  （控制器在這種用例環境下，依然可以發送一個 **patch** 或 **update**）
* 對象不必事先讀取，`resourceVersion` 不必指定。

強烈推薦：設置控制器始終在其擁有和管理的對象上強制衝突，這是因爲衝突發生時，它們沒有其他解決方案或措施。

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
## 轉移所有權 {#transferring-ownership}

除了通過[衝突解決方案](#conflicts)提供的併發控制，
伺服器端應用提供了一些協作方式來將字段所有權從使用者轉移到控制器。

最好通過例子來說明這一點。
讓我們來看看，在使用 Horizo​​ntalPodAutoscaler 資源和與之配套的控制器，
且開啓了 Deployment 的自動水平擴展功能之後，
怎麼安全的將 `replicas` 字段的所有權從使用者轉移到控制器。

假設使用者定義了 Deployment，且 `replicas` 字段已經設置爲期望的值：

{{% code_sample file="application/ssa/nginx-deployment.yaml" %}}

<!--
And the user has created the Deployment using Server-Side Apply, like so:
-->
並且，使用者使用伺服器端應用，像這樣創建 Deployment：

```shell
kubectl apply -f https://k8s.io/examples/application/ssa/nginx-deployment.yaml --server-side
```

<!--
Then later, automatic scaling is enabled for the Deployment; for example:
-->
然後，爲 Deployment 啓用自動擴縮，例如：

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
現在，使用者希望從他們的設定中刪除 `replicas`，從而避免與 HorizontalPodAutoscaler（HPA）及其控制器發生衝突。
然而，這裏存在一個競態：在 HPA 需要調整 `.spec.replicas` 之前會有一個時間窗口，
如果在 HPA 寫入字段併成爲新的屬主之前，使用者刪除了 `.spec.replicas`，
那 API 伺服器就會把 `.spec.replicas` 的值設爲 1（Deployment 的預設副本數）。
這不是使用者希望發生的事情，即使是暫時的——它很可能會導致正在運行的工作負載降級。

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
這裏有兩個解決方案：

- （基本操作）把 `replicas` 留在設定檔案中；當 HPA 最終寫入那個字段，
  系統基於此事件告訴使用者：衝突發生了。在這個時間點，可以安全的刪除設定檔案。
- （高級操作）然而，如果使用者不想等待，比如他們想爲合作伙伴保持叢集清晰，
  那他們就可以執行以下步驟，安全的從設定檔案中刪除 `replicas`。

首先，使用者新定義一個只包含 `replicas` 字段的新清單：

<!--
```yaml
# Save this file as 'nginx-deployment-replicas-only.yaml'.
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
spec:
  replicas: 3
```
-->
```yaml
# 將此文件另存爲 'nginx-deployment-replicas-only.yaml'
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
此場景中針對 SSA 的 YAML 檔案僅包含你要更改的字段。
如果只想使用 SSA 來修改 `spec.replicas` 字段，你無需提供完全兼容的 Deployment 清單。
{{< /note >}}

<!--
The user applies that manifest using a private field manager name. In this example,
the user picked `handover-to-hpa`:
-->
使用者使用私有字段管理器名稱應用該清單。在本例中，使用者選擇了 `handover-to-hpa`：

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
如果應用操作和 HPA 控制器產生衝突，那什麼都不做。
衝突表明控制器在更早的流程中已經對字段聲明過所有權。

在此時間點，使用者可以從清單中刪除 `replicas` 。

{{% code_sample file="application/ssa/nginx-deployment-no-replicas.yaml" %}}

<!--
Note that whenever the HPA controller sets the `replicas` field to a new value,
the temporary field manager will no longer own any fields and will be
automatically deleted. No further clean up is required.
-->
注意，只要 HPA 控制器爲 `replicas` 設置了一個新值，
該臨時字段管理器將不再擁有任何字段，會被自動刪除。
這裏無需進一步清理。

<!--
### Transferring ownership between managers

Field managers can transfer ownership of a field between each other by setting the field
to the same value in both of their applied configurations, causing them to share
ownership of the field. Once the managers share ownership of the field, one of them
can remove the field from their applied configuration to give up ownership and
complete the transfer to the other field manager.
-->
### 在管理器之間轉移所有權 {#transferring-ownership-between-managers}

通過在設定檔案中把一個字段設置爲相同的值，多個字段管理器可以在彼此之間轉移字段的所有權，
從而實現字段所有權的共享。
當某管理器共享了字段的所有權，管理器中任何一個成員都可以從其應用的設定中刪除該字段，
從而放棄所有權，並完成了所有權向其他字段管理器的轉移。

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
## 與客戶端應用的對比 {#comparison-with-client-side-apply}

伺服器端應用意味着既可以替代原來 `kubectl apply` 子命令的客戶端實現，
也可供{{< glossary_tooltip term_id="controller" text="控制器" >}}作爲實施變更的簡單有效機制。

與 `kubectl` 管理的 `last-applied` 註解相比，
伺服器端應用使用一種更具聲明性的方法來跟蹤對象的字段管理，而不是記錄使用者最後一次應用的狀態。
這意味着，使用伺服器端應用的副作用，就是字段管理器所管理的對象的每個字段的相關資訊也會變得可用。

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
由伺服器端應用實現的衝突檢測和解決方案的一個結果就是，
應用者總是可以在本地狀態中得到最新的字段值。
如果得不到最新值，下次執行應用操作時就會發生衝突。
解決衝突三個選項的任意一個都會保證：此應用過的設定檔案是伺服器上對象字段的最新子集。

這和客戶端應用（Client-Side Apply）不同，如果有其他使用者覆蓋了此值，
過期的值被留在了應用者本地的設定檔案中。
除非使用者更新了特定字段，此字段纔會準確，
應用者沒有途徑去了解下一次應用操作是否會覆蓋其他使用者的修改。

另一個區別是使用客戶端應用的應用者不能改變他們正在使用的 API 版本，但伺服器端應用支持這個場景。

<!--
## Migration between client-side and server-side apply

### Upgrading from client-side apply to server-side apply

Client-side apply users who manage a resource with `kubectl apply` can start
using server-side apply with the following flag.
-->
## 客戶端應用和伺服器端應用的遷移 {#migration-between-client-side-and-server-side-apply}

### 從客戶端應用升級到伺服器端應用 {#upgrading-from-client-side-apply-to-server-side-apply}

客戶端應用方式時，使用者使用 `kubectl apply` 管理資源，
可以通過使用下面標記切換爲使用伺服器端應用。

```shell
kubectl apply --server-side [--dry-run=server]
```

<!--
By default, field management of the object transfers from client-side apply to
kubectl server-side apply, without encountering conflicts.
-->
預設情況下，對象的字段管理從客戶端應用方式遷移到 kubectl 觸發的伺服器端應用時，不會發生衝突。

{{< caution >}}
<!--
Keep the `last-applied-configuration` annotation up to date.
The annotation infers client-side applies managed fields.
Any fields not managed by client-side apply raise conflicts.

For example, if you used `kubectl scale` to update the replicas field after
client-side apply, then this field is not owned by client-side apply and
creates conflicts on `kubectl apply --server-side`.
-->
保持註解 `last-applied-configuration` 是最新的。
從註解能推斷出字段是由客戶端應用管理的。
任何沒有被客戶端應用管理的字段將引發衝突。

舉例說明，比如你在客戶端應用之後，
使用 `kubectl scale` 去更新 `replicas` 字段，
可是該字段並沒有被客戶端應用所擁有，
在執行 `kubectl apply --server-side` 時就會產生衝突。
{{< /caution >}}

<!--
This behavior applies to server-side apply with the `kubectl` field manager.
As an exception, you can opt-out of this behavior by specifying a different,
non-default field manager, as seen in the following example. The default field
manager for kubectl server-side apply is `kubectl`.
-->
此操作以 `kubectl` 作爲字段管理器來應用到伺服器端應用。
作爲例外，可以指定一個不同的、非預設字段管理器停止的這種行爲，如下面的例子所示。
對於 kubectl 觸發的伺服器端應用，預設的字段管理器是 `kubectl`。

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
### 從伺服器端應用降級到客戶端應用 {#downgrading-from-server-side-apply-to-client-side-apply}

如果你用 `kubectl apply --server-side` 管理一個資源，
可以直接用 `kubectl apply` 命令將其降級爲客戶端應用。

降級之所以可行，這是因爲 `kubectl server-side apply`
會保存最新的 `last-applied-configuration` 註解。

此操作以 `kubectl` 作爲字段管理器應用到伺服器端應用。
作爲例外，可以指定一個不同的、非預設字段管理器停止這種行爲，如下面的例子所示。
對於 kubectl 觸發的伺服器端應用，預設的字段管理器是 `kubectl`。

```shell
kubectl apply --server-side --field-manager=my-manager [--dry-run=server]
```

<!--
## API implementation

The `PATCH` verb (for a resource that supports Server-Side Apply) accepts the
unofficial `application/apply-patch+yaml` content type. Users of Server-Side
Apply can send partially specified objects as YAML as the body of a `PATCH` request
to the URI of a resource.  When applying a configuration, you should always include all the
fields that are important to the outcome (such as a desired state) that you want to define.

All JSON messages are valid YAML. Therefore, in addition to using YAML request bodies for Server-Side Apply requests, you can also use JSON request bodies, as they are also valid YAML.
In either case, use the media type `application/apply-patch+yaml` for the HTTP request.
-->
## API 實現 {#api-implementation}

`PATCH` 動詞（支持伺服器端應用的資源）接受非官方的 `application/apply-patch+yaml` 內容類型。
伺服器端應用的使用者可以將部分指定的對象以 YAML 格式作爲 `PATCH` 請求的主體發送到資源的 URI。
應用設定時，你應該始終包含對要定義的結果（如所需狀態）重要的所有字段。

所有 JSON 消息都是有效的 YAML。因此，除了可以爲 Server-Side Apply 請求使用
YAML 請求體外，你也可以使用 JSON 請求體，因爲它們同樣是有效的 YAML。
無論哪種情況，請爲 HTTP 請求使用媒體類型 `application/apply-patch+yaml`。

<!--
### Access control and permissions {#rbac-and-permissions}

Since Server-Side Apply is a type of `PATCH`, a principal (such as a Role for Kubernetes
{{< glossary_tooltip text="RBAC" term_id="rbac" >}}) requires the **patch** permission to
edit existing resources, and also needs the **create** verb permission in order to create
new resources with Server-Side Apply.
-->
### 訪問控制和權限 {#rbac-and-permissions}

由於服務端應用是一種 `PATCH` 類型的操作，
所以一個主體（例如 Kubernetes {{< glossary_tooltip text="RBAC" term_id="rbac" >}} 的 Role）需要
**patch** 權限才能編輯存量資源，還需要 **create** 權限才能使用伺服器端應用創建新資源。

<!--
## Clearing `managedFields`

It is possible to strip all `managedFields` from an object by overwriting them
using a **patch** (JSON Merge Patch, Strategic Merge Patch, JSON Patch), or
through an **update** (HTTP `PUT`); in other words, through every write operation
other than **apply**. This can be done by overwriting the `managedFields` field
with an empty entry. Two examples are:
-->
## 清除 `managedFields` {#clearing-managedfields}

通過使用 **patch**（JSON Merge Patch, Strategic Merge Patch, JSON Patch）覆蓋對象，
或者通過 **update**（HTTP `PUT`），可以從對象中剝離所有 `managedFields`；
換句話說，通過除了 **apply** 之外的所有寫操作均可實現這點。
清除 `managedFields` 字段的操作可以通過用空條目覆蓋 `managedFields` 字段的方式實現。以下是兩個示例：

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
這一操作將用只包含一個空條目的列表來覆蓋 `managedFields`，
從而實現從對象中整體去除 `managedFields`。
注意，只把 `managedFields` 設置爲空列表並不會重置該字段。
這一設計是有意爲之的，目的是避免 `managedFields` 被與該字段無關的客戶刪除。

在某些場景中，執行重置操作的同時還會給出對 `managedFields` 之外的別的字段的變更，
對於這類操作，`managedFields` 首先會被重置，其他變更被壓後處理。
其結果是，應用者取得了同一個請求中所有字段的所有權。

{{< note >}}
<!--
Server-Side Apply does not correctly track ownership on
sub-resources that don't receive the resource object type. If you are
using Server-Side Apply with such a sub-resource, the changed fields
may not be tracked.
-->
對於無法接收資源對象類型的子資源，伺服器端應用無法正確跟蹤其所有權。
如果你將針對此類子資源使用伺服器端應用，則可能無法跟蹤被變更的字段。
{{< /note >}}

## {{% heading "whatsnext" %}}

<!--
You can read about `managedFields` within the Kubernetes API reference for the
[`metadata`](/docs/reference/kubernetes-api/common-definitions/object-meta/)
top level field.
-->
你可以閱讀 Kubernetes API 參考中的
[`metadata`](/zh-cn/docs/reference/kubernetes-api/common-definitions/object-meta/)
頂級字段的 `managedFields`。
