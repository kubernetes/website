---
api_metadata:
  apiVersion: ""
  import: ""
  kind: "Common Parameters"
content_type: "api_reference"
description: ""
title: "常用參數"
weight: 11
---
<!--
api_metadata:
  apiVersion: ""
  import: ""
  kind: "Common Parameters"
content_type: "api_reference"
description: ""
title: "Common Parameters"
weight: 11
auto_generated: true
-->

## allowWatchBookmarks {#allowWatchBookmarks}

<!--
allowWatchBookmarks requests watch events with type "BOOKMARK". Servers that do not implement bookmarks may ignore this flag and bookmarks are sent at the server's discretion. Clients should not assume bookmarks are returned at any specific interval, nor may they assume the server will send any BOOKMARK event during a session. If this is not a watch, this field is ignored.
-->
allowWatchBookmarks 字段請求類型爲 BOOKMARK 的監視事件。
沒有實現書籤的伺服器可能會忽略這個標誌，並根據伺服器的判斷髮送書籤。
客戶端不應該假設書籤會在任何特定的時間間隔返回，也不應該假設伺服器會在會話期間發送任何書籤事件。
如果當前請求不是 watch 請求，則忽略該字段。

<hr>

## continue {#continue}

<!--
The continue option should be set when retrieving more results from the server. Since this value is server defined, clients may only use the continue value from a previous query result with identical query parameters (except for the value of continue) and the server may reject a continue value it does not recognize. If the specified continue value is no longer valid whether due to expiration (generally five to fifteen minutes) or a configuration change on the server, the server will respond with a 410 ResourceExpired error together with a continue token. If the client needs a consistent list, it must restart their list without the continue field. Otherwise, the client may send another list request with the token received with the 410 error, the server will respond with a list starting from the next key, but from the latest snapshot, which is inconsistent from the previous list results - objects that are created, modified, or deleted after the first list request will be included in the response, as long as their keys are after the "next key".
-->
當需要從伺服器檢索更多結果時，應該設置 continue 選項。由於這個值是伺服器定義的，
客戶端只能使用先前查詢結果中具有相同查詢參數的 continue 值（continue 值除外），
伺服器可能拒絕它識別不到的 continue 值。
如果指定的 continue 值不再有效，無論是由於過期（通常是 5 到 15 分鐘）
還是伺服器上的設定更改，伺服器將響應 "410 ResourceExpired" 錯誤和一個 continue 令牌。
如果客戶端需要一個一致的列表，它必須在沒有 continue 字段的情況下重新發起 list 請求。
否則，客戶端可能會發送另一個帶有 410 錯誤令牌的 list 請求，伺服器將響應從下一個鍵開始的列表，
但列表資料來自最新的快照，這與之前的列表結果不一致。
第一個列表請求之後被創建、修改或刪除的對象將被包含在響應中，只要它們的鍵是在“下一個鍵”之後。

<!--
This field is not supported when watch is true. Clients may start a watch from the last resourceVersion value returned by the server and not miss any modifications.
-->
當 watch 字段爲 true 時，不支持此字段。客戶端可以從伺服器返回的最後一個
resourceVersion 值開始監視，就不會錯過任何修改。

<hr>

## dryRun {#dryRun}

<!--
When present, indicates that modifications should not be persisted. An invalid or unrecognized dryRun directive will result in an error response and no further processing of the request. Valid values are: - All: all dry run stages will be processed
-->
表示不應該持久化所請求的修改。無效或無法識別的 dryRun 指令將導致錯誤響應，
並且伺服器不再對請求進行進一步處理。有效值爲:

- All：將處理所有的演練階段

<hr>

## fieldManager {#fieldManager}

<!--
fieldManager is a name associated with the actor or entity that is making these changes. The value must be less than or 128 characters long, and only contain printable characters, as defined by https://golang.org/pkg/unicode/#IsPrint.
-->
fieldManager 是與進行這些更改的參與者或實體相關聯的名稱。
長度小於或128個字符且僅包含可打印字符，如 https://golang.org/pkg/unicode/#IsPrint 所定義。

<hr>

## fieldSelector {#fieldSelector}

<!--
A selector to restrict the list of returned objects by their fields. Defaults to everything.
-->
限制所返回對象的字段的選擇器。預設爲返回所有字段。

<hr>

## fieldValidation {#fieldValidation}

<!--
fieldValidation instructs the server on how to handle objects in the request (POST/PUT/PATCH) containing unknown or duplicate fields. Valid values are: - Ignore: This will ignore any unknown fields that are silently dropped from the object, and will ignore all but the last duplicate field that the decoder encounters. This is the default behavior prior to v1.23. - Warn: This will send a warning via the standard warning response header for each unknown field that is dropped from the object, and for each duplicate field that is encountered. The request will still succeed if there are no other errors, and will only persist the last of any duplicate fields. This is the default in v1.23+ - Strict: This will fail the request with a BadRequest error if any unknown fields would be dropped from the object, or if any duplicate fields are present. The error returned from the server will contain all unknown and duplicate fields encountered.
-->
fieldValidation 指示伺服器如何處理請求（POST/PUT/PATCH）中包含未知或重複字段的對象。
有效值爲：

- Ignore：這將忽略從對象中默默刪除的所有未知字段，並將忽略除解碼器遇到的最後一個重複字段之外的所有字段。
  這是在 v1.23 之前的預設行爲。
- Warn：這將針對從對象中刪除的各個未知字段以及所遇到的各個重複字段，分別通過標準警告響應頭髮出警告。
  如果沒有其他錯誤，請求仍然會成功，並且只會保留所有重複字段中的最後一個。
  這是 v1.23+ 版本中的預設設置。
- Strict：如果從對象中刪除任何未知字段，或者存在任何重複字段，將使請求失敗並返回 BadRequest 錯誤。

從伺服器返回的錯誤將包含所有遇到的未知和重複的字段。

<hr>

## force {#force}

<!--
Force is going to "force" Apply requests. It means user will re-acquire conflicting fields owned by other people. Force flag must be unset for non-apply patch requests.
-->
Force 將“強制”應用請求。這意味着使用者將重新獲得他人擁有的衝突領域。
對於非應用補丁請求，Force 標誌必須不設置。

<hr>

## gracePeriodSeconds {#gracePeriodSeconds}

<!--
The duration in seconds before the object should be deleted. Value must be non-negative integer. The value zero indicates delete immediately. If this value is nil, the default grace period for the specified type will be used. Defaults to a per object value if not specified. zero means delete immediately.
-->
刪除對象前的持續時間（秒數）。值必須爲非負整數。取值爲 0 表示立即刪除。
如果該值爲 nil，將使用指定類型的預設寬限期。如果沒有指定，預設爲每個對象的設置值。
0 表示立即刪除。

<hr>

## ignoreStoreReadErrorWithClusterBreakingPotential {#ignoreStoreReadErrorWithClusterBreakingPotential}

<!--
if set to true, it will trigger an unsafe deletion of the resource in case the normal
deletion flow fails with a corrupt object error.
A resource is considered corrupt if it can not be retrieved from the underlying
storage successfully because of
a) its data can not be transformed e.g. decryption failure, or
b) it fails to decode into an object.
NOTE: unsafe deletion ignores finalizer constraints, skips precondition checks,
and removes the object from the storage.
WARNING: This may potentially break the cluster if the workload associated
with the resource being unsafe-deleted relies on normal deletion flow.
Use only if you REALLY know what you are doing. The default value is false,
and the user must opt in to enable it
-->
如果設置爲 true，在正常的刪除流程因對象損壞錯誤而失敗時，
將觸發資源的不安全刪除。當由於以下原因無法從底層儲存成功檢索資源時，
該資源被視爲損壞：

1. 其資料無法轉換，例如解密失敗；或
2. 它無法解碼爲一個對象。

注意：不安全刪除忽略終結器約束，跳過前提條件檢查，並從儲存中移除對象。

警告：如果與正在被不安全刪除的資源相關聯的工作負載依賴於正常刪除流程，
這可能會破壞叢集。僅在你真正知道自己在做什麼的情況下使用。

預設值是 false，使用者必須主動選擇啓用。

<hr>

## labelSelector {#labelSelector}

<!--
A selector to restrict the list of returned objects by their labels. Defaults to everything.
-->
通過標籤限制返回對象列表的選擇器。預設爲返回所有對象。

<hr>

## limit {#limit}

<!--
limit is a maximum number of responses to return for a list call. If more items exist, the server will set the `continue` field on the list metadata to a value that can be used with the same initial query to retrieve the next set of results. Setting a limit may return fewer than the requested amount of items (up to zero items) in the event all requested objects are filtered out and clients should only use the presence of the continue field to determine whether more results are available. Servers may choose not to support the limit argument and will return all of the available results. If limit is specified and the continue field is empty, clients may assume that no more results are available. This field is not supported if watch is true.
-->
limit 是一個列表調用返回的最大響應數。如果有更多的條目，伺服器會將列表元資料上的
'continue' 字段設置爲一個值，該值可以用於相同的初始查詢來檢索下一組結果。
設置 limit 可能會在所有請求的對象被過濾掉的情況下返回少於請求的條目數量（下限爲零），
並且客戶端應該只根據 continue 字段是否存在來確定是否有更多的結果可用。
伺服器可能選擇不支持 limit 參數，並將返回所有可用的結果。
如果指定了 limit 並且 continue 字段爲空，客戶端可能會認爲沒有更多的結果可用。
如果 watch 爲 true，則不支持此字段。

<!--
The server guarantees that the objects returned when using continue will be identical to issuing a single list call without a limit - that is, no objects created, modified, or deleted after the first request is issued will be included in any subsequent continued requests. This is sometimes referred to as a consistent snapshot, and ensures that a client that is using limit to receive smaller chunks of a very large result can ensure they see all possible objects. If objects are updated during a chunked list the version of the object that was present at the time the first list result was calculated is returned.
-->
伺服器保證在使用 continue 時返回的對象將與不帶 limit 的列表調用相同，
也就是說，在發出第一個請求後所創建、修改或刪除的對象將不包含在任何後續的繼續請求中。
這有時被稱爲一致性快照，確保使用 limit 的客戶端在分塊接收非常大的結果的客戶端能夠看到所有可能的對象。
如果對象在分塊列表期間被更新，則返回計算第一個列表結果時存在的對象版本。

<hr>

## namespace {#namespace}

<!--
object name and auth scope, such as for teams and projects
-->
對象名稱和身份驗證範圍，例如用於團隊和項目。

<hr>

## pretty {#pretty}

<!--
If 'true', then the output is pretty printed. Defaults to 'false' unless the user-agent indicates a browser or command-line HTTP tool (curl and wget).
-->
如果設置爲 'true'，那麼輸出是規範的打印。
預設情況下爲 'false'，除非使用者代理聲明是瀏覽器或命令列 HTTP 工具
（如 curl 和 wget）。

<hr>

## propagationPolicy {#propagationPolicy}

<!--
Whether and how garbage collection will be performed. Either this field or OrphanDependents may be set, but not both. The default policy is decided by the existing finalizer set in the metadata.finalizers and the resource-specific default policy. Acceptable values are: 'Orphan' - orphan the dependents; 'Background' - allow the garbage collector to delete the dependents in the background; 'Foreground' - a cascading policy that deletes all dependents in the foreground.
-->
該字段決定是否以及如何執行垃圾收集。可以設置此字段或 OrphanDependents，但不能同時設置。
預設策略由 metadata.finalizers 和特定資源的預設策略設置決定。可接受的值是：

- 'Orphan'：孤立依賴項；
- 'Background'：允許垃圾回收器後臺刪除依賴；
- 'Foreground'：一個級聯策略，前臺刪除所有依賴項。

<hr>

## resourceVersion {#resourceVersion}

<!--
resourceVersion sets a constraint on what resource versions a request may be served from. See https://kubernetes.io/docs/reference/using-api/api-concepts/#resource-versions for details.

Defaults to unset
-->
resourceVersion 對請求所針對的資源版本設置約束。
詳情請參見 https://kubernetes.io/zh-cn/docs/reference/using-api/api-concepts/#resource-versions

預設不設置。

<hr>

## resourceVersionMatch {#resourceVersionMatch}

<!--
resourceVersionMatch determines how resourceVersion is applied to list calls. It is highly recommended that resourceVersionMatch be set for list calls where resourceVersion is set See https://kubernetes.io/docs/reference/using-api/api-concepts/#resource-versions for details.

Defaults to unset
-->
resourceVersionMatch 字段決定如何將 resourceVersion 應用於列表調用。
強烈建議對設置了 resourceVersion 的列表調用設置 resourceVersion 匹配，
具體請參見 https://kubernetes.io/zh-cn/docs/reference/using-api/api-concepts/#resource-versions

預設不設置。

<hr>

## sendInitialEvents {#sendInitialEvents}

<!--
`sendInitialEvents=true` may be set together with `watch=true`. In that case, the watch stream will begin with synthetic events to produce the current state of objects in the collection. Once all such events have been sent, a synthetic "Bookmark" event  will be sent. The bookmark will report the ResourceVersion (RV) corresponding to the set of objects, and be marked with `"k8s.io/initial-events-end": "true"` annotation. Afterwards, the watch stream will proceed as usual, sending watch events corresponding to changes (subsequent to the RV) to objects watched.
-->
`sendInitialEvents=true` 可以和 `watch=true` 一起設置。
在這種情況下，監視通知流將從合成事件開始，以生成集合中對象的當前狀態。
一旦發送了所有此類事件，將發送合成的 "Bookmark" 事件。"bookmark" 將報告對象集合對應的
ResourceVersion（RV），並標有 `"k8s.io/initial-events-end": "true"` 註解。
之後，監視通知流將照常進行，發送與所監視的對象的變更（在 RV 之後）對應的監視事件。

<!--
When `sendInitialEvents` option is set, we require `resourceVersionMatch` option to also be set. The semantic of the watch request is as following: - `resourceVersionMatch` = NotOlderThan
  is interpreted as "data at least as new as the provided `resourceVersion`"
  and the bookmark event is send when the state is synced
  to a `resourceVersion` at least as fresh as the one provided by the ListOptions.
  If `resourceVersion` is unset, this is interpreted as "consistent read" and the
  bookmark event is send when the state is synced at least to the moment
  when request started being processed.
- `resourceVersionMatch` set to any other value or unset
  Invalid error is returned.
-->
當設置了 sendInitialEvents 選項時，我們還需要設置 resourceVersionMatch
選項。watch 請求的語義如下：

- `resourceVersionMatch` = NotOlderThan
  被解釋爲"資料至少與提供的 `resourceVersion` 一樣新"，
  最遲當狀態同步到與 ListOptions 提供的版本一樣新的 `resourceVersion` 時，
  發送 bookmark 事件。如果 `resourceVersion` 未設置，這將被解釋爲"一致讀取"，
  最遲當狀態同步到開始處理請求的那一刻時，發送 bookmark 事件。
- `resourceVersionMatch` 設置爲任何其他值或返回 unsetInvalid 錯誤。

<!--
Defaults to true if `resourceVersion=""` or `resourceVersion="0"` (for backward compatibility reasons) and to false otherwise.
-->
如果 `resourceVersion=""` 或 `resourceVersion="0"`（出於向後兼容性原因），
預設爲 true，否則預設爲 false。

<hr>

## timeoutSeconds {#timeoutSeconds}

<!--
Timeout for the list/watch call. This limits the duration of the call, regardless of any activity or inactivity.
-->
list/watch 調用的超時秒數。這選項限制調用的持續時間，無論是否有活動。

<hr>

## watch {#watch}

<!--
Watch for changes to the described resources and return them as a stream of add, update, and remove notifications. Specify resourceVersion.
-->
監視對所述資源的更改，並將其這類變更以添加、更新和刪除通知流的形式返回。指定 resourceVersion。

<hr>
