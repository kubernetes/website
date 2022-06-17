---
title: 伺服器端應用（Server-Side Apply）
content_type: concept
weight: 25
min-kubernetes-server-version: 1.16
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
min-kubernetes-server-version: 1.16
-->

<!-- overview -->

{{< feature-state for_k8s_version="v1.22" state="stable" >}}

<!--
## Introduction

Server Side Apply helps users and controllers manage their resources through
declarative configurations. Clients can create and/or modify their
[objects](/docs/concepts/overview/working-with-objects/kubernetes-objects/)
declaratively by sending their fully specified intent.
-->
## 簡介 {#introduction}

伺服器端應用協助使用者、控制器透過宣告式配置的方式管理他們的資源。
客戶端可以傳送完整描述的目標（A fully specified intent），
宣告式地建立和/或修改
[物件](/zh-cn/docs/concepts/overview/working-with-objects/kubernetes-objects/)。

<!--
A fully specified intent is a partial object that only includes the fields and
values for which the user has an opinion. That intent either creates a new
object or is [combined](#merge-strategy), by the server, with the existing object.

The system supports multiple appliers collaborating on a single object.
-->
一個完整描述的目標並不是一個完整的物件，僅包括能體現使用者意圖的欄位和值。
該目標（intent）可以用來建立一個新物件，
也可以透過伺服器來實現與現有物件的[合併](#merge-strategy)。

系統支援多個應用者（appliers）在同一個物件上開展協作。

<!--
Changes to an object's fields are tracked through a "[field management](#field-management)"
mechanism. When a field's value changes, ownership moves from its current
manager to the manager making the change. When trying to apply an object,
fields that have a different value and are owned by another manager will
result in a [conflict](#conflicts). This is done in order to signal that the
operation might undo another collaborator's changes. Conflicts can be forced,
in which case the value will be overridden, and the ownership will be
transferred.
-->
“[欄位管理（field management）](#field-management)”機制追蹤物件欄位的變化。
當一個欄位值改變時，其所有權從當前管理器（manager）轉移到施加變更的管理器。
當嘗試將新配置應用到一個物件時，如果欄位有不同的值，且由其他管理器管理，
將會引發[衝突](#conflicts)。
衝突引發警告訊號：此操作可能抹掉其他協作者的修改。
衝突可以被刻意忽略，這種情況下，值將會被改寫，所有權也會發生轉移。

<!--
If you remove a field from a configuration and apply the configuration, server
side apply checks if there are any other field managers that also own the
field.  If the field is not owned by any other field managers, it is either
deleted from the live object or reset to its default value, if it has one. The
same rule applies to associative list or map items.
-->
當你從配置檔案中刪除一個欄位，然後應用這個配置檔案，
這將觸發服務端應用檢查此欄位是否還被其他欄位管理器擁有。
如果沒有，那就從活動物件中刪除該欄位；如果有，那就重置為預設值。
該規則同樣適用於 list 或 map 專案。

<!--
Server side apply is meant both as a replacement for the original `kubectl
apply` and as a simpler mechanism for controllers to enact their changes.

If you have Server Side Apply enabled, the control plane tracks managed fields
for all newly created objects.
-->
伺服器端應用既是原有 `kubectl apply` 的替代品，
也是控制器釋出自身變化的一個簡化機制。

如果你啟用了伺服器端應用，控制平面就會跟蹤被所有新建立物件管理的欄位。

<!--
## Field Management

Compared to the `last-applied` annotation managed by `kubectl`, Server Side
Apply uses a more declarative approach, which tracks a user's field management,
rather than a user's last applied state. This means that as a side effect of
using Server Side Apply, information about which field manager manages each
field in an object also becomes available.
-->
## 欄位管理 {#field-management}

相對於透過 `kubectl` 管理的註解 `last-applied`，
伺服器端應用使用了一種更具宣告式特點的方法：
它持續的跟蹤使用者的欄位管理，而不僅僅是最後一次的執行狀態。
這就意味著，作為伺服器端應用的一個副作用，
關於用哪一個欄位管理器負責管理物件中的哪個欄位的這類資訊，都要對外界開放了。

<!--
For a user to manage a field, in the Server Side Apply sense, means that the
user relies on and expects the value of the field not to change. The user who
last made an assertion about the value of a field will be recorded as the
current field manager. This can be done either by changing the value with
`POST`, `PUT`, or non-apply `PATCH`, or by including the field in a config sent
to the Server Side Apply endpoint. When using Server-Side Apply, trying to
change a field which is managed by someone else will result in a rejected
request (if not forced, see [Conflicts](#conflicts)).
-->
使用者管理欄位這件事，在伺服器端應用的場景中，意味著使用者依賴並期望欄位的值不要改變。
最後一次對欄位值做出斷言的使用者將被記錄到當前欄位管理器。
這可以透過傳送 `POST`、 `PUT`、
或非應用（non-apply）方式的 `PATCH` 等命令來修改欄位值的方式實現，
或透過把欄位放在配置檔案中，然後傳送到伺服器端應用的服務端點的方式實現。
當使用伺服器端應用，嘗試著去改變一個被其他人管理的欄位，
會導致請求被拒絕（在沒有設定強制執行時，參見[衝突](#conflicts)）。

<!--
When two or more appliers set a field to the same value, they share ownership of
that field. Any subsequent attempt to change the value of the shared field, by any of
the appliers, results in a conflict. Shared field owners may give up ownership
of a field by removing it from their configuration.

Field management is stored in a`managedFields` field that is part of an object's
[`metadata`](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#objectmeta-v1-meta).

A simple example of an object created by Server Side Apply could look like this:
-->
如果兩個或以上的應用者均把同一個欄位設定為相同值，他們將共享此欄位的所有權。
後續任何改變共享欄位值的嘗試，不管由那個應用者發起，都會導致衝突。
共享欄位的所有者可以放棄欄位的所有權，這隻需從配置檔案中刪除該欄位即可。

欄位管理的資訊儲存在 `managedFields` 欄位中，該欄位是物件的
[`metadata`](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#objectmeta-v1-meta)
中的一部分。

伺服器端應用建立物件的簡單示例如下：

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
The above object contains a single manager in `metadata.managedFields`. The
manager consists of basic information about the managing entity itself, like
operation type, API version, and the fields managed by it.

This field is managed by the  API server and should not be changed by
the user.
-->
上述物件在 `metadata.managedFields` 中包含了唯一的管理器。
管理器由管理實體自身的基本資訊組成，比如操作型別、API 版本、以及它管理的欄位。

{{< note >}}
該欄位由 API 伺服器管理，使用者不應該改動它。
{{< /note >}}

<!--
Nevertheless it is possible to change `metadata.managedFields` through an
`Update` operation. Doing so is highly discouraged, but might be a reasonable
option to try if, for example, the `managedFields` get into an inconsistent
state (which clearly should not happen).

The format of the `managedFields` is described in the
[API](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#fieldsv1-v1-meta).
-->
不過，執行 `Update` 操作修改 `metadata.managedFields` 也是可實現的。
強烈不鼓勵這麼做，但當發生如下情況時，
比如 `managedFields` 進入不一致的狀態（顯然不應該發生這種情況），
這麼做也是一個合理的嘗試。

`managedFields` 的格式在
[API](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#fieldsv1-v1-meta)
文件中描述。

<!--
## Conflicts

A conflict is a special status error that occurs when an `Apply` operation tries
to change a field, which another user also claims to manage. This prevents an
applier from unintentionally overwriting the value set by another user. When
this occurs, the applier has 3 options to resolve the conflicts:
-->
## 衝突 {#conflicts}

衝突是一種特定的錯誤狀態，
發生在執行 `Apply` 改變一個欄位，而恰巧該欄位被其他使用者宣告過主權時。
這可以防止一個應用者不小心覆蓋掉其他使用者設定的值。
衝突發生時，應用者有三種辦法來解決它：

<!--
* **Overwrite value, become sole manager:** If overwriting the value was
  intentional (or if the applier is an automated process like a controller) the
  applier should set the `force` query parameter to true (in kubectl, it can be done by
  using the `--force-conflicts` flag with the apply command) and make the request
  again. This forces the operation to succeed, changes the value of the field,
  and removes the field from all other managers' entries in managedFields.

* **Don't overwrite value, give up management claim:** If the applier doesn't
  care about the value of the field anymore, they can remove it from their
  config and make the request again. This leaves the value unchanged, and causes
  the field to be removed from the applier's entry in managedFields.

* **Don't overwrite value, become shared manager:** If the applier still cares
  about the value of the field, but doesn't want to overwrite it, they can
  change the value of the field in their config to match the value of the object
  on the server, and make the request again. This leaves the value unchanged,
  and causes the field's management to be shared by the applier and all other
  field managers that already claimed to manage it.
-->
* **覆蓋前值，成為唯一的管理器：** 如果打算覆蓋該值（或應用者是一個自動化部件，比如控制器），
  應用者應該設定查詢引數 `force` 為 true（在 kubectl 中，可以透過在
  apply 命令中使用 `--force-conflicts` 標誌來完成），然後再發送一次請求。
  這將強制操作成功，改變欄位的值，從所有其他管理器的 managedFields 條目中刪除指定欄位。

* **不覆蓋前值，放棄管理權：** 如果應用者不再關注該欄位的值，
  可以從配置檔案中刪掉它，再重新發送請求。
  這就保持了原值不變，並從 managedFields 的應用者條目中刪除該欄位。

* **不覆蓋前值，成為共享的管理器：** 如果應用者仍然關注欄位值，並不想覆蓋它，
  他們可以在配置檔案中把欄位的值改為和伺服器物件一樣，再重新發送請求。
  這樣在不改變欄位值的前提下，
  就實現了欄位管理被應用者和所有聲明瞭管理權的其他的欄位管理器共享。

<!--
## Managers

Managers identify distinct workflows that are modifying the object (especially
useful on conflicts!), and can be specified through the `fieldManager` query
parameter as part of a modifying request. It is required for the apply endpoint,
though kubectl will default it to `kubectl`. For other updates, its default is
computed from the user-agent.
-->
## 管理器 {#managers}

管理器識別出正在修改物件的工作流程（在衝突時尤其有用）,
管理器可以透過修改請求的引數 `fieldManager` 指定。
雖然 kubectl 預設發往 `kubectl` 服務端點，但它則請求到應用的服務端點（apply endpoint）。
對於其他的更新，它預設的是從使用者代理計算得來。

<!--
## Apply and Update

The two operation types considered by this feature are `Apply` (`PATCH` with
content type `application/apply-patch+yaml`) and `Update` (all other operations
which modify the object). Both operations update the `managedFields`, but behave
a little differently.

Whether you are submitting JSON data or YAML data, use
`application/apply-patch+yaml` as the `Content-Type` header value.

All JSON documents are valid YAML.
-->
## 應用和更新 {#apply-and-update}

此特性涉及兩類操作，分別是 `Apply`
（內容型別為 `application/apply-patch+yaml` 的 `PATCH` 請求）
和 `Update` （所有修改物件的其他操作）。
這兩類操作都會更新欄位 `managedFields`，但行為表現有一點不同。

{{< note >}}
不管你提交的是 JSON 資料還是 YAML 資料，
都要使用 `application/apply-patch+yaml` 作為 `Content-Type` 的值。

所有的 JSON 文件 都是合法的 YAML。
{{< /note >}}

<!--
For instance, only the apply operation fails on conflicts while update does
not. Also, apply operations are required to identify themselves by providing a
`fieldManager` query parameter, while the query parameter is optional for update
operations. Finally, when using the apply operation you cannot have
`managedFields` in the object that is being applied.

An example object with multiple managers could look like this:
-->
例如，在衝突發生的時候，只有 `apply` 操作失敗，而 `update` 則不會。
此外，`apply` 操作必須透過提供一個 `fieldManager` 查詢引數來標識自身，
而此查詢引數對於 `update` 操作則是可選的。
最後，當使用 `apply` 命令時，你不能在應用中的物件中持有 `managedFields`。

一個包含多個管理器的物件，示例如下：

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

<!--
In this example, a second operation was run as an `Update` by the manager called
`kube-controller-manager`. The update changed a value in the data field which
caused the field's management to change to the `kube-controller-manager`.

If this update would have been an `Apply` operation, the operation
would have failed due to conflicting ownership.
-->
在這個例子中，
第二個操作被管理器 `kube-controller-manager` 以 `Update` 的方式執行。
此 `update` 更改 data 欄位的值，
並使得欄位管理器被改為 `kube-controller-manager`。

如果把 `update` 操作改為 `Apply`，那就會因為所有權衝突的原因，導致操作失敗。

<!--
## Merge strategy

The merging strategy, implemented with Server Side Apply, provides a generally
more stable object lifecycle. Server Side Apply tries to merge fields based on
the actor who manages them instead of overruling based on values. This way
multiple actors can update the same object without causing unexpected interference.
-->
## 合併策略 {#merge-strategy}

由伺服器端應用實現的合併策略，提供了一個總體更穩定的物件生命週期。
伺服器端應用試圖依據負責管理它們的主體來合併欄位，而不是根據值來否決。
這麼做是為了多個主體可以更新同一個物件，且不會引起意外的相互干擾。

<!--
When a user sends a "fully-specified intent" object to the Server Side Apply
endpoint, the server merges it with the live object favoring the value in the
applied config if it is specified in both places. If the set of items present in
the applied config is not a superset of the items applied by the same user last
time, each missing item not managed by any other appliers is removed. For
more information about how an object's schema is used to make decisions when
merging, see
[sigs.k8s.io/structured-merge-diff](https://sigs.k8s.io/structured-merge-diff).
-->
當用戶傳送一個“完整描述的目標”物件到伺服器端應用的服務端點，
伺服器會將它和活動物件做一次合併，如果兩者中有重複定義的值，那就以配置檔案的為準。
如果配置檔案中的專案集合不是此使用者上一次操作專案的超集，
所有缺少的、沒有其他應用者管理的專案會被刪除。
關於合併時用來做決策的物件規格的更多資訊，參見
[sigs.k8s.io/structured-merge-diff](https://sigs.k8s.io/structured-merge-diff).

<!--
A number of markers were added in Kubernetes 1.16 and 1.17, to allow API
developers to describe the merge strategy supported by lists, maps, and
structs. These markers can be applied to objects of the respective type,
in Go files or in the OpenAPI schema definition of the
[CRD](/docs/reference/generated/kubernetes-api/{{< param "version" >}}#jsonschemaprops-v1-apiextensions-k8s-io):
-->
Kubernetes 1.16 和 1.17 中添加了一些標記，
允許 API 開發人員描述由 list、map、和 structs 支援的合併策略。
這些標記可應用到相應型別的物件，在 Go 檔案或在
[CRD](/docs/reference/generated/kubernetes-api/{{< param "version" >}}#jsonschemaprops-v1-apiextensions-k8s-io)
的 OpenAPI 的模式中定義：

<!--
| Golang marker | OpenAPI extension | Accepted values | Description | Introduced in |
|---|---|---|---|---|
| `//+listType` | `x-kubernetes-list-type` | `atomic`/`set`/`map` | Applicable to lists. `set` applies to lists that include only scalar elements. These elements must be unique. `map` applies to lists of nested types only. The key values (see `listMapKey`) must be unique in the list. `atomic` can apply to any list. If configured as `atomic`, the entire list is replaced during merge. At any point in time, a single manager owns the list. If `set` or `map`, different managers can manage entries separately. | 1.16          |
| `//+listMapKey` | `x-kubernetes-list-map-keys` | List of field names, e.g. `["port", "protocol"]` | Only applicable when `+listType=map`. A list of field names whose values uniquely identify entries in the list. While there can be multiple keys, `listMapKey` is singular because keys need to be specified individually in the Go type. The key fields must be scalars. | 1.16 |
| `//+mapType` | `x-kubernetes-map-type` | `atomic`/`granular` | Applicable to maps. `atomic` means that the map can only be entirely replaced by a single manager. `granular` means that the map supports separate managers updating individual fields. | 1.17 |
| `//+structType` | `x-kubernetes-map-type` | `atomic`/`granular` | Applicable to structs; otherwise same usage and OpenAPI annotation as `//+mapType`.| 1.17 |
-->
| Golang 標記 | OpenAPI extension | 可接受的值 | 描述 | 引入版本 |
|---|---|---|---|---|
| `//+listType` | `x-kubernetes-list-type` | `atomic`/`set`/`map` | 適用於 list。`set` 適用於僅包含標量元素的列表。這些元素必須是不重複的。`map` 僅適用於包含巢狀型別的列表。列表中的鍵（參見 `listMapKey`）不可以重複。`atomic` 適用於任何型別的列表。如果配置為 `atomic`，則合併時整個列表會被替換掉。任何時候，只有一個管理器負責管理指定列表。如果配置為 `set` 或 `map`，不同的管理器也可以分開管理條目。 | 1.16          |
| `//+listMapKey` | `x-kubernetes-list-map-keys` | 欄位名稱的列表，例如，`["port", "protocol"]` | 僅當 `+listType=map` 時適用。取值為欄位名稱的列表，這些欄位值的組合能夠唯一標識列表中的條目。儘管可以存在多個鍵，`listMapKey` 是單數的，這是因為鍵名需要在 Go 型別中各自獨立指定。鍵欄位必須是標量。 | 1.16 |
| `//+mapType` | `x-kubernetes-map-type` | `atomic`/`granular` | 適用於 map。 `atomic` 指 map 只能被單個的管理器整個的替換。 `granular` 指 map 支援多個管理器各自更新自己的欄位。 | 1.17 |
| `//+structType` | `x-kubernetes-map-type` | `atomic`/`granular` | 適用於 structs；否則就像 `//+mapType` 有相同的用法和 openapi 註釋.| 1.17 |

<!--
If `listType` is missing, the API server interprets a
`patchMergeStrategy=merge` marker as a `listType=map` and the
corresponding `patchMergeKey` marker as a `listMapKey`.

The `atomic` list type is recursive.

These markers are specified as comments and don't have to be repeated as
field tags.
-->
若未指定 `listType`，API 伺服器將 `patchMergeStrategy=merge` 標記解釋為
`listType=map` 並且視對應的 `patchMergeKey` 標記為 `listMapKey` 取值。

`atomic` 列表型別是遞迴的。

這些標記都是用原始碼註釋的方式給出的，不必作為欄位標籤（tag）再重複。

<!--
### Compatibility across topology changes
-->
### 拓撲變化時的相容性  {#compatibility-across-toplogy-changes}

<!--
On rare occurences, a CRD or built-in type author may want to change the
specific topology of a field in their resource without incrementing its
version. Changing the topology of types, by upgrading the cluster or
updating the CRD, has different consequences when updating existing
objects. There are two categories of changes: when a field goes from
`map`/`set`/`granular` to `atomic` and the other way around.
-->
在極少的情況下，CRD 或者內建型別的作者可能希望更改其資源中的某個欄位的
拓撲配置，同時又不提升版本號。
透過升級叢集或者更新 CRD 來更改型別的拓撲資訊與更新現有物件的結果不同。
變更的型別有兩種：一種是將欄位從 `map`/`set`/`granular` 更改為 `atomic`，
另一種是做逆向改變。

<!--
When the `listType`, `mapType`, or `structType` changes from
`map`/`set`/`granular` to `atomic`, the whole list, map or struct of
existing objects will end-up being owned by actors who owned an element
of these types. This means that any further change to these objects
would cause a conflict.
-->
當 `listType`、`mapType` 或 `structType` 從 `map`/`set`/`granular` 改為
`atomic` 時，現有物件的整個列表、對映或結構的屬主都會變為這些型別的
元素之一的屬主。這意味著，對這些物件的進一步變更會引發衝突。

<!--
When a list, map, or struct changes from `atomic` to
`map`/`set`/`granular`, the API server won't be able to infer the new
ownership of these fields. Because of that, no conflict will be produced
when objects have these fields updated. For that reason, it is not
recommended to change a type from `atomic` to `map`/`set`/`granular`.

Take for example, the custom resource:
-->
當一個列表、對映或結構從 `atomic` 改為 `map`/`set`/`granular` 之一
時，API 伺服器無法推導這些欄位的新的屬主。因此，當物件的這些欄位
再次被更新時不會引發衝突。出於這一原因，不建議將某型別從 `atomic` 改為
`map`/`set`/`granular`。

以下面的自定義資源為例：

```yaml
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
在 `spec.data` 從 `atomic` 改為 `granular` 之前，`manager-one` 是
`spec.data` 欄位及其所包含欄位（`key1` 和 `key2`）的屬主。
當對應的 CRD 被更改，使得 `spec.data` 變為 `granular` 拓撲時，
`manager-one` 繼續擁有頂層欄位 `spec.data`（這意味著其他管理者想
刪除名為 `data` 的對映而不引起衝突是不可能的），但不再擁有
`key1` 和 `key2`。因此，其他管理者可以在不引起衝突的情況下更改
或刪除這些欄位。

<!--
### Custom Resources

By default, Server Side Apply treats custom resources as unstructured data. All
keys are treated the same as struct fields, and all lists are considered atomic.

If the Custom Resource Definition defines a
[schema](/docs/reference/generated/kubernetes-api/{{< param "version" >}}#jsonschemaprops-v1-apiextensions-k8s-io)
that contains annotations as defined in the previous "Merge Strategy"
section, these annotations will be used when merging objects of this
type.
-->
### 自定義資源 {#custom-resources}

預設情況下，伺服器端應用把自定義資源看做非結構化資料。
所有的鍵值（keys）就像 struct 的欄位一樣被處理，
所有的 list 被認為是原子性的。

如果自定義資源定義（Custom Resource Definition，CRD）定義了一個
[模式](/docs/reference/generated/kubernetes-api/{{< param "version" >}}#jsonschemaprops-v1-apiextensions-k8s-io)，
它包含類似以前“合併策略”章節中定義過的註解，
這些註解將在合併此型別的物件時使用。

<!--
## Using Server-Side Apply in a controller

As a developer of a controller, you can use server-side apply as a way to
simplify the update logic of your controller. The main differences with a
read-modify-write and/or patch are the following:

* the applied object must contain all the fields that the controller cares about.
* there are no way to remove fields that haven't been applied by the controller
  before (controller can still send a PATCH/UPDATE for these use-cases).
* the object doesn't have to be read beforehand, `resourceVersion` doesn't have
  to be specified.

It is strongly recommended for controllers to always "force" conflicts, since they
might not be able to resolve or act on these conflicts.
-->
## 在控制器中使用伺服器端應用 {#using-server-side-apply-in-controller}

控制器的開發人員可以把伺服器端應用作為簡化控制器的更新邏輯的方式。
讀-改-寫 和/或 patch 的主要區別如下所示：

* 應用的物件必須包含控制器關注的所有欄位。
* 對於在控制器沒有執行過應用操作之前就已經存在的欄位，不能刪除。
  （控制器在這種用例環境下，依然可以傳送一個 PATCH/UPDATE）
* 物件不必事先讀取，`resourceVersion` 不必指定。

強烈推薦：設定控制器在衝突時強制執行，這是因為衝突發生時，它們沒有其他解決方案或措施。

<!--
## Transferring Ownership

In addition to the concurrency controls provided by [conflict resolution](#conflicts),
Server Side Apply provides ways to perform coordinated
field ownership transfers from users to controllers.

This is best explained by example. Let's look at how to safely transfer
ownership of the `replicas` field from a user to a controller while enabling
automatic horizontal scaling for a Deployment, using the HorizontalPodAutoscaler
resource and its accompanying controller.

Say a user has defined deployment with `replicas` set to the desired value:
-->
## 轉移所有權 {#transferring-ownership}

除了透過[衝突解決方案](#conflicts)提供的併發控制，
伺服器端應用提供了一些協作方式來將欄位所有權從使用者轉移到控制器。

最好透過例子來說明這一點。
讓我們來看看，在使用 Horizo  ntalPodAutoscaler 資源和與之配套的控制器，
且開啟了 Deployment 的自動水平擴充套件功能之後，
怎麼安全的將 `replicas` 欄位的所有權從使用者轉移到控制器。

假設使用者定義了 Deployment，且 `replicas` 欄位已經設定為期望的值：

{{< codenew file="application/ssa/nginx-deployment.yaml" >}}

<!--
And the user has created the deployment using server side apply like so:
-->
並且，使用者使用伺服器端應用，像這樣建立 Deployment：

```shell
kubectl apply -f https://k8s.io/examples/application/ssa/nginx-deployment.yaml --server-side
```

<!--
Then later, HPA is enabled for the deployment, e.g.:
-->
然後，為 Deployment 啟用 HPA，例如：

```shell
kubectl autoscale deployment nginx-deployment --cpu-percent=50 --min=1 --max=10
```

<!--
Now, the user would like to remove `replicas` from their configuration, so they
don't accidentally fight with the HPA controller. However, there is a race: it
might take some time before HPA feels the need to adjust `replicas`, and if
the user removes `replicas` before the HPA writes to the field and becomes
its owner, then apiserver will set `replicas` to 1, its default value. This
is not what the user wants to happen, even temporarily.
-->
現在，使用者希望從他們的配置中刪除 `replicas`，所以他們總是和 HPA 控制器衝突。
然而，這裡存在一個竟態：
在 HPA 需要調整 `replicas` 之前會有一個時間視窗，
如果在 HPA 寫入欄位成為所有者之前，使用者刪除了`replicas`，
那 API 伺服器就會把 `replicas` 的值設為 1， 也就是預設值。
這不是使用者希望發生的事情，即使是暫時的。

<!--
There are two solutions:

- (basic) Leave `replicas` in the configuration; when HPA eventually writes to that
  field, the system gives the user a conflict over it. At that point, it is safe
  to remove from the configuration.

- (more advanced) If, however, the user doesn't want to wait, for example
  because they want to keep the cluster legible to coworkers, then they can take
  the following steps to make it safe to remove `replicas` from their
  configuration:

First, the user defines a new configuration containing only the `replicas` field:
-->
這裡有兩個解決方案：

- （基本操作）把 `replicas` 留在配置檔案中；當 HPA 最終寫入那個欄位，
  系統基於此事件告訴使用者：衝突發生了。在這個時間點，可以安全的刪除配置檔案。
- （高階操作）然而，如果使用者不想等待，比如他們想為合作伙伴保持叢集清晰，
  那他們就可以執行以下步驟，安全的從配置檔案中刪除 `replicas`。

首先，使用者新定義一個只包含 `replicas` 欄位的配置檔案：

{{< codenew file="application/ssa/nginx-deployment-replicas-only.yaml" >}}

<!--
The user applies that configuration using the field manager name `handover-to-hpa`:
-->
使用者使用名為 `handover-to-hpa` 的欄位管理器，應用此配置檔案。

```shell
kubectl apply -f https://k8s.io/examples/application/ssa/nginx-deployment-replicas-only.yaml \
  --server-side --field-manager=handover-to-hpa \
  --validate=false
```

<!--
If the apply results in a conflict with the HPA controller, then do nothing. The
conflict indicates the controller has claimed the field earlier in the
process than it sometimes does.

At this point the user may remove the `replicas` field from their configuration.
-->
如果應用操作和 HPA 控制器產生衝突，那什麼都不做。
衝突表明控制器在更早的流程中已經對欄位宣告過所有權。

在此時間點，使用者可以從配置檔案中刪除 `replicas` 。

{{< codenew file="application/ssa/nginx-deployment-no-replicas.yaml" >}}

<!--
Note that whenever the HPA controller sets the `replicas` field to a new value,
the temporary field manager will no longer own any fields and will be
automatically deleted. No clean up is required.
-->
注意，只要 HPA 控制器為 `replicas` 設定了一個新值，
該臨時欄位管理器將不再擁有任何欄位，會被自動刪除。
這裡不需要執行清理工作。

<!--
### Transferring Ownership Between Users

Users can transfer ownership of a field between each other by setting the field
to the same value in both of their applied configs, causing them to share
ownership of the field. Once the users share ownership of the field, one of them
can remove the field from their applied configuration to give up ownership and
complete the transfer to the other user.
-->
### 在使用者之間轉移所有權 {#transferring-ownership-between-users}

透過在配置檔案中把一個欄位設定為相同的值，使用者可以在他們之間轉移欄位的所有權，
從而共享了欄位的所有權。
當用戶共享了欄位的所有權，任何一個使用者可以從他的配置檔案中刪除該欄位，
並應用該變更，從而放棄所有權，並實現了所有權向其他使用者的轉移。

<!--
## Comparison with Client Side Apply

A consequence of the conflict detection and resolution implemented by Server
Side Apply is that an applier always has up to date field values in their local
state. If they don't, they get a conflict the next time they apply. Any of the
three options to resolve conflicts results in the applied configuration being an
up to date subset of the object on the server's fields.

This is different from Client Side Apply, where outdated values which have been
overwritten by other users are left in an applier's local config. These values
only become accurate when the user updates that specific field, if ever, and an
applier has no way of knowing whether their next apply will overwrite other
users' changes.

Another difference is that an applier using Client Side Apply is unable to
change the API version they are using, but Server Side Apply supports this use
case.
-->
## 與客戶端應用的對比 {#comparison-with-client-side-apply}

由伺服器端應用實現的衝突檢測和解決方案的一個結果就是，
應用者總是可以在本地狀態中得到最新的欄位值。
如果得不到最新值，下次執行應用操作時就會發生衝突。
解決衝突三個選項的任意一個都會保證：此應用過的配置檔案是伺服器上物件欄位的最新子集。

這和客戶端應用（Client Side Apply） 不同，如果有其他使用者覆蓋了此值，
過期的值被留在了應用者本地的配置檔案中。
除非使用者更新了特定欄位，此欄位才會準確，
應用者沒有途徑去了解下一次應用操作是否會覆蓋其他使用者的修改。

另一個區別是使用客戶端應用的應用者不能改變他們正在使用的 API 版本，但伺服器端應用支援這個場景。

<!--
## Upgrading from client-side apply to server-side apply

Client-side apply users who manage a resource with `kubectl apply` can start
using server-side apply with the following flag.
-->
## 從客戶端應用升級到伺服器端應用 {#upgrading-from-client-side-apply-to-server-side-apply}

客戶端應用方式時，使用者使用 `kubectl apply` 管理資源，
可以透過使用下面標記切換為使用伺服器端應用。

```shell
kubectl apply --server-side [--dry-run=server]
```
<!--
By default, field management of the object transfers from client-side apply to
kubectl server-side apply without encountering conflicts.

Keep the `last-applied-configuration` annotation up to date.
The annotation infers client-side apply's managed fields.
Any fields not managed by client-side apply raise conflicts.

For example, if you used `kubectl scale` to update the replicas field after
client-side apply, then this field is not owned by client-side apply and
creates conflicts on `kubectl apply --server-side`.

This behavior applies to server-side apply with the `kubectl` field manager.
As an exception, you can opt-out of this behavior by specifying a different,
non-default field manager, as seen in the following example. The default field
manager for kubectl server-side apply is `kubectl`.
-->
預設情況下，物件的欄位管理從客戶端應用方式遷移到 kubectl 觸發的伺服器端應用時，不會發生衝突。

{{< caution >}}
保持註解 `last-applied-configuration` 是最新的。
從註解能推斷出欄位是由客戶端應用管理的。
任何沒有被客戶端應用管理的欄位將引發衝突。

舉例說明，比如你在客戶端應用之後，
使用 `kubectl scale` 去更新 `replicas` 欄位，
可是該欄位並沒有被客戶端應用所擁有，
在執行 `kubectl apply --server-side` 時就會產生衝突。
{{< /caution >}}

此操作以 `kubectl` 作為欄位管理器來應用到伺服器端應用。
作為例外，可以指定一個不同的、非預設欄位管理器停止的這種行為，如下面的例子所示。
對於 kubectl 觸發的伺服器端應用，預設的欄位管理器是 `kubectl`。

```shell
kubectl apply --server-side --field-manager=my-manager [--dry-run=server]
```

<!--
## Downgrading from server-side apply to client-side apply

If you manage a resource with `kubectl apply --server-side`,
you can downgrade to client-side apply directly with `kubectl apply`.

Downgrading works because kubectl server-side apply keeps the
`last-applied-configuration` annotation up-to-date if you use
`kubectl apply`.

This behavior applies to server-side apply with the `kubectl` field manager.
As an exception, you can opt-out of this behavior by specifying a different,
non-default field manager, as seen in the following example. The default field
manager for kubectl server-side apply is `kubectl`.
-->
## 從伺服器端應用降級到客戶端應用 {#downgrading-from-server-side-apply-to-client-side-apply}

如果你用 `kubectl apply --server-side` 管理一個資源，
可以直接用 `kubectl apply` 命令將其降級為客戶端應用。

降級之所以可行，這是因為 `kubectl server-side apply`
會儲存最新的 `last-applied-configuration` 註解。

此操作以 `kubectl` 作為欄位管理器應用到伺服器端應用。
作為例外，可以指定一個不同的、非預設欄位管理器停止這種行為，如下面的例子所示。
對於 kubectl 觸發的伺服器端應用，預設的欄位管理器是 `kubectl`。

```shell
kubectl apply --server-side --field-manager=my-manager [--dry-run=server]
```

<!--
## API Endpoint

With the Server Side Apply feature enabled, the `PATCH` endpoint accepts the
additional `application/apply-patch+yaml` content type. Users of Server Side
Apply can send partially specified objects as YAML to this endpoint.  When
applying a configuration, one should always include all the fields that they
have an opinion about.
-->
## API 端點 {#api-endpoint}

啟用了伺服器端應用特性之後，
`PATCH` 服務端點接受額外的內容型別 `application/apply-patch+yaml`。
伺服器端應用的使用者就可以把 YAMl 格式的
部分定義物件（partially specified objects）傳送到此端點。
當一個配置檔案被應用時，它應該包含所有體現你意圖的欄位。

<!--
## Clearing ManagedFields

It is possible to strip all managedFields from an object by overwriting them
using `MergePatch`, `StrategicMergePatch`, `JSONPatch` or `Update`, so every
non-apply operation. This can be done by overwriting the managedFields field
with an empty entry. Two examples are:
-->
## 清除 ManagedFields {#clearing-managedfields}

可以從物件中剝離所有 managedField，
實現方法是透過使用 `MergePatch`、 `StrategicMergePatch`、
`JSONPatch`、 `Update`、以及所有的非應用方式的操作來覆蓋它。
這可以透過用空條目覆蓋 managedFields 欄位的方式實現。以下是兩個示例：

```console
PATCH /api/v1/namespaces/default/configmaps/example-cm
Content-Type: application/merge-patch+json
Accept: application/json
Data: {"metadata":{"managedFields": [{}]}}
```

```console
PATCH /api/v1/namespaces/default/configmaps/example-cm
Content-Type: application/json-patch+json
Accept: application/json
Data: [{"op": "replace", "path": "/metadata/managedFields", "value": [{}]}]
```

<!--
This will overwrite the managedFields with a list containing a single empty
entry that then results in the managedFields being stripped entirely from the
object. Note that setting the managedFields to an empty list will not
reset the field. This is on purpose, so managedFields never get stripped by
clients not aware of the field.

In cases where the reset operation is combined with changes to other fields
than the managedFields, this will result in the managedFields being reset
first and the other changes being processed afterwards. As a result the
applier takes ownership of any fields updated in the same request.
-->
這一操作將用只包含一個空條目的列表覆寫 managedFields，
來實現從物件中整個的去除 managedFields。
注意，只把 managedFields 設定為空列表並不會重置欄位。
這麼做是有目的的，所以 managedFields 將永遠不會被與該欄位無關的客戶刪除。

在重置操作結合 managedFields 以外其他欄位更改的場景中，
將導致 managedFields 首先被重置，其他改變被押後處理。
其結果是，應用者取得了同一個請求中所有欄位的所有權。

<!--
Server Side Apply does not correctly track ownership on
sub-resources that don't receive the resource object type. If you are
using Server Side Apply with such a sub-resource, the changed fields
won't be tracked.
-->
{{< caution >}}
對於不接受資源物件型別的子資源（sub-resources），
伺服器端應用不能正確地跟蹤其所有權。
如果你對這樣的子資源使用伺服器端應用，變更的欄位將不會被跟蹤。
{{< /caution >}}
