---
api_metadata:
  apiVersion: ""
  import: ""
  kind: "Common Parameters"
content_type: "api_reference"
description: ""
title: "常用引數"
weight: 10
auto_generated: true
---

<!--
The file is auto-generated from the Go source code of the component using a generic
[generator](https://github.com/kubernetes-sigs/reference-docs/). To learn how
to generate the reference documentation, please read
[Contributing to the reference documentation](/docs/contribute/generate-ref-docs/).
To update the reference content, please follow the 
[Contributing upstream](/docs/contribute/generate-ref-docs/contribute-upstream/)
guide. You can file document formatting bugs against the
[reference-docs](https://github.com/kubernetes-sigs/reference-docs/) project.
-->




## allowWatchBookmarks {#allowWatchBookmarks}
<!--
allowWatchBookmarks requests watch events with type "BOOKMARK". Servers that do not implement bookmarks may ignore this flag and bookmarks are sent at the server's discretion. Clients should not assume bookmarks are returned at any specific interval, nor may they assume the server will send any BOOKMARK event during a session. If this is not a watch, this field is ignored.

<hr>
-->
allowWatchBookmarks 欄位請求型別為 BOOKMARK 的監視事件。
沒有實現書籤的伺服器可能會忽略這個標誌，並根據伺服器的判斷髮送書籤。
客戶端不應該假設書籤會在任何特定的時間間隔返回，也不應該假設伺服器會在會話期間傳送任何書籤事件。
如果當前請求不是 watch 請求，則忽略該欄位。
<hr>

## continue {#continue}
<!--
The continue option should be set when retrieving more results from the server. Since this value is server defined, clients may only use the continue value from a previous query result with identical query parameters (except for the value of continue) and the server may reject a continue value it does not recognize. If the specified continue value is no longer valid whether due to expiration (generally five to fifteen minutes) or a configuration change on the server, the server will respond with a 410 ResourceExpired error together with a continue token. 
-->
當需要從伺服器檢索更多結果時，應該設定 continue 選項。由於這個值是伺服器定義的，
客戶端只能使用先前查詢結果中具有相同查詢引數的 continue 值(continue值除外)，
伺服器可能拒絕它識別不到的 continue 值。
如果指定的 continue 值不再有效，無論是由於過期(通常是 5 到 15 分鐘)
還是伺服器上的配置更改，伺服器將響應 "410 ResourceExpired" 錯誤和一個 continue 令牌。
<!--
If the client needs a consistent list, it must restart their list without the continue field. Otherwise, the client may send another list request with the token received with the 410 error, the server will respond with a list starting from the next key, but from the latest snapshot, which is inconsistent from the previous list results - objects that are created, modified, or deleted after the first list request will be included in the response, as long as their keys are after the "next key".
-->
如果客戶端需要一個一致的列表，它必須在沒有 continue 欄位的情況下重新發起 list 請求。
否則，客戶端可能會發送另一個帶有 410 錯誤令牌的 list 請求，伺服器將響應從下一個鍵開始的列表，
但列表資料來自最新的快照，這與之前
的列表結果不一致。第一個列表請求之後的物件建立，修改，或刪除的物件將被包含在響應中，
只要他們的鍵是在“下一個鍵”之後。
<!--
This field is not supported when watch is true. Clients may start a watch from the last resourceVersion value returned by the server and not miss any modifications.
-->
當 watch 欄位為 true 時，不支援此欄位。客戶端可以從伺服器返回的最後一個 resourceVersion 值開始監視，就不會錯過任何修改。
<hr>

## dryRun {#dryRun}
<!--
When present, indicates that modifications should not be persisted. An invalid or unrecognized dryRun directive will result in an error response and no further processing of the request. Valid values are: - All: all dry run stages will be processed
<hr>
-->
表示不應該持久化所請求的修改。無效或無法識別的 dryRun 指令將導致錯誤響應，
並且伺服器不再對請求進行進一步處理。有效值為:
- All: 將處理所有的演練階段
<hr>

## fieldManager {#fieldManager}
<!--
fieldManager is a name associated with the actor or entity that is making these changes. The value must be less than or 128 characters long, and only contain printable characters, as defined by https://golang.org/pkg/unicode/#IsPrint.
<hr>
-->
fieldManager 是與進行這些更改的參與者或實體相關聯的名稱。
長度小於或128個字元且僅包含可列印字元，如 https://golang.org/pkg/unicode/#IsPrint 所定義。
<hr>

## fieldSelector {#fieldSelector}
<!--
A selector to restrict the list of returned objects by their fields. Defaults to everything.
<hr>
-->
根據返回物件的欄位限制返回物件列表的選擇器。預設為返回所有欄位。
<hr>

## fieldValidation {#fieldValidation}

<!--
fieldValidation instructs the server on how to handle objects in the request (POST/PUT/PATCH) containing unknown or duplicate fields, provided that the `ServerSideFieldValidation` feature gate is also enabled.
-->
fieldValidation 指示伺服器如何處理請求（POST/PUT/PATCH）中包含未知或重複欄位的物件，
前提是 `ServerSideFieldValidation` 特性門控也已啟用。
<!--
Valid values are: - Ignore: This will ignore any unknown fields that are silently dropped from the object, and will ignore all but the last duplicate field that the decoder encounters. This is the default behavior prior to v1.23 and is the default behavior when the `ServerSideFieldValidation` feature gate is disabled.
-->
有效值為：
- Ignore：這將忽略從物件中默默刪除的所有未知欄位，並將忽略除解碼器遇到的最後一個重複欄位之外的所有欄位。
  這是在 v1.23 之前的預設行為，也是當 `ServerSideFieldValidation` 特性門控被禁用時的預設行為。
<!--
- Warn: This will send a warning via the standard warning response header for each unknown field that is dropped from the object, and for each duplicate field that is encountered. The request will still succeed if there are no other errors, and will only persist the last of any duplicate fields. This is the default when the `ServerSideFieldValidation` feature gate is enabled.
-->
- Warn：這將針對從物件中刪除的各個未知欄位以及所遇到的各個重複欄位，分別透過標準警告響應頭髮出警告。
  如果沒有其他錯誤，請求仍然會成功，並且只會保留所有重複欄位中的最後一個。
  這是啟用 `ServerSideFieldValidation` 特性門控時的預設值。
<!--
- Strict: This will fail the request with a BadRequest error if any unknown fields would be dropped from the object, or if any duplicate fields are present. The error returned from the server will contain all unknown and duplicate fields encountered.
-->
- Strict：如果從物件中刪除任何未知欄位，或者存在任何重複欄位，將使請求失敗並返回 BadRequest 錯誤。

<hr>

## force {#force}
<!--
Force is going to "force" Apply requests. It means user will re-acquire conflicting fields owned by other people. Force flag must be unset for non-apply patch requests.
<hr>
-->
Force 將“強制”應用請求。這意味著使用者將重新獲得他人擁有的衝突領域。
對於非應用補丁請求，Force 標誌必須不設定。
<hr>

## gracePeriodSeconds {#gracePeriodSeconds}
<!--
The duration in seconds before the object should be deleted. Value must be non-negative integer. The value zero indicates delete immediately. If this value is nil, the default grace period for the specified type will be used. Defaults to a per object value if not specified. zero means delete immediately.
<hr>
-->
刪除物件前的持續時間(秒數)。值必須為非負整數。取值為 0 表示立即刪除。
如果該值為 nil，將使用指定型別的預設寬限期。如果沒有指定，預設為每個物件的設定值。0 表示立即刪除。
<hr>

## labelSelector {#labelSelector}
<!--
A selector to restrict the list of returned objects by their labels. Defaults to everything.
<hr>
-->
透過標籤限制返回物件列表的選擇器。預設為返回所有物件。
<hr>

## limit {#limit}
<!--
limit is a maximum number of responses to return for a list call. If more items exist, the server will set the `continue` field on the list metadata to a value that can be used with the same initial query to retrieve the next set of results.
-->
limit 是一個列表呼叫返回的最大響應數。如果有更多的條目，伺服器會將列表元資料上的 
'continue' 欄位設定為一個值，該值可以用於相同的初始查詢來檢索下一組結果。
<!--
Setting a limit may return fewer than the requested amount of items (up to zero items) in the event all requested objects are filtered out and clients should only use the presence of the continue field to determine whether more results are available. Servers may choose not to support the limit argument and will return all of the available results. If limit is specified and the continue field is empty, clients may assume that no more results are available. This field is not supported if watch is true.
-->
設定 limit 可能會在所有請求的物件被過濾掉的情況下返回少於請求的條目數量(下限為零)，
並且客戶端應該只根據 continue 欄位是否存在來確定是否有更多的結果可用。
伺服器可能選擇不支援 limit 引數，並將返回所有可用的結果。
如果指定了 limit 並且 continue 欄位為空，客戶端可能會認為沒有更多的結果可用。
如果 watch 為 true，則不支援此欄位。
<!--
The server guarantees that the objects returned when using continue will be identical to issuing a single list call without a limit - that is, no objects created, modified, or deleted after the first request is issued will be included in any subsequent continued requests.
-->
伺服器保證在使用 continue 時返回的物件將與不帶 limit 的列表呼叫相同，——
也就是說，在發出第一個請求後所建立、修改或刪除的物件將不包含在任何後續的繼續請求中。 
<!--
This is sometimes referred to as a consistent snapshot, and ensures that a client that is using limit to receive smaller chunks of a very large result can ensure they see all possible objects. If objects are updated during a chunked list the version of the object that was present at the time the first list result was calculated is returned.
<hr>
-->
這有時被稱為一致性快照，確保使用 limit 的客戶端在分塊接收非常大的結果的客戶端能夠看到所有可能的物件。
如果物件在分塊列表期間被更新，則返回計算第一個列表結果時存在的物件版本。
<hr>

## namespace {#namespace}
<!--
object name and auth scope, such as for teams and projects
<hr>
-->

物件名稱和身份驗證範圍，例如用於團隊和專案。
<hr>

## pretty {#pretty}
<!--
If 'true', then the output is pretty printed.
<hr>
-->

如果設定為 'true' ，那麼輸出是規範的列印。

<hr>

## propagationPolicy {#propagationPolicy}
<!--
Whether and how garbage collection will be performed. Either this field or OrphanDependents may be set, but not both. The default policy is decided by the existing finalizer set in the metadata.finalizers and the resource-specific default policy. Acceptable values are: 'Orphan' - orphan the dependents; 'Background' - allow the garbage collector to delete the dependents in the background; 'Foreground' - a cascading policy that deletes all dependents in the foreground.
<hr>
-->
該欄位決定是否以及如何執行垃圾收集。可以設定此欄位或 OrphanDependents，但不能同時設定。
預設策略由 metadata.finalizers 和特定資源的預設策略設定決定。可接受的值是：
- 'Orphan'：孤立依賴項；
- 'Background'：允許垃圾回收器後臺刪除依賴；
- 'Foreground'：一個級聯策略，前臺刪除所有依賴項。
<hr>

## resourceVersion {#resourceVersion}
<!--
resourceVersion sets a constraint on what resource versions a request may be served from. See https://kubernetes.io/docs/reference/using-api/api-concepts/#resource-versions for details.

Defaults to unset
<hr>
-->
resourceVersion 對請求所針對的資源版本設定約束。
詳情請參見 https://kubernetes.io/docs/reference/using-api/api-concepts/#resource-versions。

預設不設定
<hr>

## resourceVersionMatch {#resourceVersionMatch}
<!--
resourceVersionMatch determines how resourceVersion is applied to list calls. It is highly recommended that resourceVersionMatch be set for list calls where resourceVersion is set See https://kubernetes.io/docs/reference/using-api/api-concepts/#resource-versions for details.

Defaults to unset
<hr>
-->
resourceVersionMatch 欄位決定如何將 resourceVersion 應用於列表呼叫。
強烈建議對設定了 resourceVersion 的列表呼叫設定 resourceVersion 匹配，
具體請參見 https://kubernetes.io/docs/reference/using-api/api-concepts/#resource-versions。

預設不設定

<hr>

## timeoutSeconds {#timeoutSeconds}
<!--
Timeout for the list/watch call. This limits the duration of the call, regardless of any activity or inactivity.
<hr>
-->
list/watch 呼叫的超時秒數。這選項限制呼叫的持續時間，無論是否有活動。
<hr>

## watch {#watch}
<!--
Watch for changes to the described resources and return them as a stream of add, update, and remove notifications. Specify resourceVersion.
<hr>
-->
監視對所述資源的更改，並將其這類變更以新增、更新和刪除通知流的形式返回。指定 resourceVersion。

<hr>




