---
api_metadata:
  apiVersion: ""
  import: "k8s.io/apimachinery/pkg/apis/meta/v1"
  kind: "ListMeta"
content_type: "api_reference"
description: "ListMeta 描述了合成資源必須具有的元資料，包括列表和各種狀態物件。"
title: "ListMeta"
weight: 3
auto_generated: true
---

<!--
api_metadata:
  apiVersion: ""
  import: "k8s.io/apimachinery/pkg/apis/meta/v1"
  kind: "ListMeta"
content_type: "api_reference"
description: "ListMeta describes metadata that synthetic resources must have, including lists and various status objects."
title: "ListMeta"
weight: 3
auto_generated: true
-->


`import "k8s.io/apimachinery/pkg/apis/meta/v1"`

<!--
ListMeta describes metadata that synthetic resources must have, including lists and various status objects. A resource may have only one of {ObjectMeta, ListMeta}.
-->
`ListMeta` 描述了合成資源必須具有的元資料，包括列表和各種狀態物件。
一個資源僅能有 `{ObjectMeta, ListMeta}` 中的一個。

<hr>

<!--
- **continue** (string)

  continue may be set if the user set a limit on the number of items returned, and indicates that the server has more data available. The value is opaque and may be used to issue another request to the endpoint that served this list to retrieve the next set of available objects. Continuing a consistent list may not be possible if the server configuration has changed or more than a few minutes have passed. The resourceVersion field returned when using this continue value will be identical to the value in the first response, unless you have received this token from an error message.
-->

- **continue** (string)

  如果使用者對返回的條目數量設定了限制，則 `continue` 可能被設定，表示伺服器有更多可用的資料。
  該值是不透明的，可用於向提供此列表服務的端點發出另一個請求，以檢索下一組可用的物件。
  如果伺服器配置已更改或時間已過去幾分鐘，則可能無法繼續提供一致的列表。
  除非你在錯誤訊息中收到此令牌（token），否則使用此 `continue` 值時返回的 `resourceVersion` 
  欄位應該和第一個響應中的值是相同的。

<!--
- **remainingItemCount** (int64)

  remainingItemCount is the number of subsequent items in the list which are not included in this list response. If the list request contained label or field selectors, then the number of remaining items is unknown and the field will be left unset and omitted during serialization. If the list is complete (either because it is not chunking or because this is the last chunk), then there are no more remaining items and this field will be left unset and omitted during serialization. Servers older than v1.15 do not set this field. The intended use of the remainingItemCount is *estimating* the size of a collection. Clients should not rely on the remainingItemCount to be set or to be exact.
-->

- **remainingItemCount** (int64)

  `remainingItemCount` 是列表中未包含在此列表響應中的後續專案的數量。
  如果列表請求包含標籤或欄位選擇器，則剩餘專案的數量是未知的，並且在序列化期間該欄位將保持未設定和省略。
  如果列表是完整的（因為它沒有分塊或者這是最後一個塊），那麼就沒有剩餘的專案，並且在序列化過程中該欄位將保持未設定和省略。
  早於 v1.15 的伺服器不設定此欄位。`remainingItemCount` 的預期用途是*估計*集合的大小。
  客戶端不應依賴於設定準確的 `remainingItemCount`。

<!--
- **resourceVersion** (string)

  String that identifies the server's internal version of this object that can be used by clients to determine when objects have changed. Value must be treated as opaque by clients and passed unmodified back to the server. Populated by the system. Read-only. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#concurrency-control-and-consistency
-->

- **resourceVersion** (string)

  標識該物件的伺服器內部版本的字串，客戶端可以用該欄位來確定物件何時被更改。
  該值對客戶端是不透明的，並且應該原樣傳回給伺服器。該值由系統填充，只讀。
  更多資訊： https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#concurrency-control-and-consistency 。

<!--
  Deprecated: selfLink is a legacy read-only field that is no longer populated by the system.
-->

- **selfLink** (string)
  
  selfLink 表示此物件的 URL，由系統填充，只讀。
  
  已棄用：selfLink 是一個遺留的只讀欄位，不再由系統填充。





