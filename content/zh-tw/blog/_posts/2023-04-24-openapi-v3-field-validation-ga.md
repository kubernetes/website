---
layout: blog
title: "Kubernetes 1.27：伺服器端字段校驗和 OpenAPI V3 進階至 GA"
date: 2023-04-24
slug: openapi-v3-field-validation-ga
---
<!--
layout: blog
title: "Kubernetes 1.27: Server Side Field Validation and OpenAPI V3 move to GA"
date: 2023-04-24
slug: openapi-v3-field-validation-ga
-->

<!--
**Author**: Jeffrey Ying (Google), Antoine Pelisse (Google)
-->
**作者**：Jeffrey Ying (Google), Antoine Pelisse (Google)

**譯者**：Michael Yao (DaoCloud)

<!--
Before Kubernetes v1.8 (!), typos, mis-indentations or minor errors in
YAMLs could have catastrophic consequences (e.g. a typo like
forgetting the trailing s in `replica: 1000` could cause an outage,
because the value would be ignored and missing, forcing a reset of
replicas back to 1). This was solved back then by fetching the OpenAPI
v2 in kubectl and using it to verify that fields were correct and
present before applying. Unfortunately, at that time, Custom Resource
Definitions didn’t exist, and the code was written under that
assumption. When CRDs were later introduced, the lack of flexibility
in the validation code forced some hard decisions in the way CRDs
exposed their schema, leaving us in a cycle of bad validation causing
bad OpenAPI and vice-versa. With the new OpenAPI v3 and Server Field
Validation being GA in 1.27, we’ve now solved both of these problems.
-->
在 Kubernetes v1.8 之前，YAML 檔案中的拼寫錯誤、縮進錯誤或其他小錯誤可能會產生災難性後果
（例如像在 `replica: 1000` 中忘記了結尾的字母 “s”，可能會導致宕機。
因爲該值會被忽略並且丟失，並強制將副本重置回 1）。當時解決這個問題的辦法是：
在 kubectl 中獲取 OpenAPI v2 並在應用之前使用 OpenAPI v2 來校驗字段是否正確且存在。
不過當時沒有自定義資源定義 (CRD)，相關代碼是在當時那樣的假設下編寫的。
之後引入了 CRD，發現校驗代碼缺乏靈活性，迫使 CRD 在公開其模式定義時做出了一些艱難的決策，
使得我們進入了不良校驗造成不良 OpenAPI，不良 OpenAPI 無法校驗的循環。
隨着新的 OpenAPI v3 和伺服器端字段校驗在 1.27 中進階至 GA，我們現在已經解決了這兩個問題。

<!--
Server Side Field Validation offers resource validation on create,
update and patch requests to the apiserver and was added to Kubernetes
in v1.25, beta in v1.26 and is now GA in v1.27. It provides all the
functionality of kubectl validate on the server side.
-->
伺服器端字段校驗針對通過 create、update 和 patch 請求發送到 apiserver 上的資源進行校驗，
此特性是在 Kubernetes v1.25 中添加的，在 v1.26 時進階至 Beta，
如今在 v1.27 進階至 GA。它在伺服器端提供了 kubectl 校驗的所有功能。

<!--
[OpenAPI](https://swagger.io/specification/) is a standard, language
agnostic interface for discovering the set of operations and types
that a Kubernetes cluster supports. OpenAPI V3 is the latest standard
of the OpenAPI and is an improvement upon [OpenAPI
V2](https://kubernetes.io/blog/2016/12/kubernetes-supports-openapi/)
which has been supported since Kubernetes 1.5. OpenAPI V3 support was
added in Kubernetes in v1.23, moved to beta in v1.24 and is now GA in
v1.27.
-->
[OpenAPI](https://swagger.io/specification/) 是一個標準的、與編程語言無關的介面，
用於發現 Kubernetes 叢集支持的操作集和類型集。
OpenAPI v3 是 OpenAPI 的最新標準，它是自 Kubernetes 1.5 開始支持的
[OpenAPI v2](https://kubernetes.io/blog/2016/12/kubernetes-supports-openapi/)
的改進版本。對 OpenAPI v3 的支持是在 Kubernetes v1.23 中添加的，
v1.24 時進階至 Beta，如今在 v1.27 進階至 GA。

<!--
## OpenAPI V3

### What does OpenAPI V3 offer over V2

#### Built-in types
-->
## OpenAPI v3

### OpenAPI v3 相比 v2 提供了什麼？

#### 插件類型

<!--
Kubernetes offers certain annotations on fields that are not
representable in OpenAPI V2, or sometimes not represented in the
OpenAPI v2 that Kubernetes generate. Most notably, the "default" field
is published in OpenAPI V3 while omitted in OpenAPI V2. A single type
that can represent multiple types is also expressed correctly in
OpenAPI V3 with the oneOf field. This includes proper representations
for IntOrString and Quantity.
-->
Kubernetes 對 OpenAPI v2 中不能表示或有時在 Kubernetes 生成的 OpenAPI v2
中未表示的某些字段提供了註解。最明顯地，OpenAPI v3 發佈了 “default” 字段，
而在 OpenAPI v2 中被省略。表示多種類型的單個類型也能在 OpenAPI v3 中使用
oneOf 字段被正確表達。這包括針對 IntOrString 和 Quantity 的合理表示。

<!--
#### Custom Resource Definitions

In Kubernetes, Custom Resource Definitions use a structural OpenAPI V3
schema that cannot be represented as OpenAPI V2 without a loss of
certain fields. Some of these include nullable, default, anyOf, oneOf,
not, etc. OpenAPI V3 is a completely lossless representation of the
CustomResourceDefinition structural schema.
-->
#### CRD

在 Kubernetes 中，自定義資源定義 (CRD) 使用結構化的 OpenAPI v3 模式定義，
無法在不損失某些字段的情況下將其表示爲 OpenAPI v2。這些包括
nullable、default、anyOf、oneOf、not 等等。OpenAPI v3 是
CustomResourceDefinition 結構化模式定義的完全無損表示。

<!--
### How do I use it?

The OpenAPI V3 root discovery can be found at the `/openapi/v3`
endpoint of a Kubernetes API server. OpenAPI V3 documents are grouped
by group-version to reduce the size of the data transported, the
separate documents can be accessed at
`/openapi/v3/apis/<group>/<version>` and `/openapi/v3/api/v1`
representing the legacy group version. Please refer to the [Kubernetes
API Documentation](/docs/concepts/overview/kubernetes-api/) for more
information around this endpoint.
-->
### 如何使用？

Kubernetes API 伺服器的 `/openapi/v3` 端點包含了 OpenAPI v3 的根發現文檔。
爲了減少傳輸的資料量，OpenAPI v3 文檔以 group-version 的方式進行分組，
不同的文檔可以通過 `/openapi/v3/apis/<group>/<version>` 和 `/openapi/v3/api/v1`
（表示舊版 group）進行訪問。有關此端點的更多資訊請參閱
[Kubernetes API 文檔](/zh-cn/docs/concepts/overview/kubernetes-api/)。

<!--
Various consumers of the OpenAPI have already been updated to consume
v3, including the entirety of kubectl, and server side apply. An
OpenAPI V3 Golang client is available in
[client-go](https://github.com/kubernetes/client-go/blob/release-1.27/openapi3/root.go).
-->
衆多使用 OpenAPI 的客戶側組件已更新到了 v3，包括整個 kubectl 和伺服器端應用。
在 [client-go](https://github.com/kubernetes/client-go/blob/release-1.27/openapi3/root.go)
中也提供了 OpenAPI V3 Golang 客戶端。

<!--
## Server Side Field Validation

The query parameter `fieldValidation` may be used to indicate the
level of field validation the server should perform. If the parameter
is not passed, server side field validation is in `Warn` mode by
default.
-->
## 伺服器端字段校驗

查詢參數 `fieldValidation` 可用於指示伺服器應執行的字段校驗級別。
如果此參數未被傳遞，伺服器端字段校驗預設採用 `Warn` 模式。

<!--
- Strict: Strict field validation, errors on validation failure
- Warn: Field validation is performed, but errors are exposed as
  warnings rather than failing the request
- Ignore: No server side field validation is performed
-->
- Strict：嚴格的字段校驗，在驗證失敗時報錯
- Warn：執行字段校驗，但錯誤會以警告的形式給出，而不是使請求失敗
- Ignore：不執行伺服器端的字段校驗

<!--
kubectl will skip client side validation and will automatically use
server side field validation in `Strict` mode. Controllers by default
use server side field validation in `Warn` mode.

With client side validation, we had to be extra lenient because some
fields were missing from OpenAPI V2 and we didn’t want to reject
possibly valid objects. This is all fixed in server side validation.
Additional documentation may be found
[here](/docs/reference/using-api/api-concepts/#field-validation)
-->
kubectl 將跳過客戶端校驗，並將自動使用 `Strict` 模式下的伺服器端字段校驗。
控制器預設使用 `Warn` 模式進行伺服器端字段校驗。

使用客戶端校驗時，由於 OpenAPI v2 中缺少某些字段，所以我們必須更加寬容，
以免拒絕可能有效的對象。而在伺服器端校驗中，所有這些問題都被修復了。
可以在[此處](/zh-cn/docs/reference/using-api/api-concepts/#field-validation)找到更多文檔。

<!--
## What's next?

With Server Side Field Validation and OpenAPI V3 released as GA, we
introduce more accurate representations of Kubernetes resources. It is
recommended to use server side field validation over client side, but
with OpenAPI V3, clients are free to implement their own validation if
necessary (to “shift things left”) and we guarantee a full lossless
schema published by OpenAPI.
-->
## 未來展望

隨着伺服器端字段校驗和 OpenAPI v3 以 GA 發佈，我們引入了更準確的 Kubernetes 資源表示。
建議使用伺服器端字段校驗而非客戶端校驗，但是通過 OpenAPI v3，
客戶端可以在必要時自行實現其自身的校驗（“左移”），我們保證 OpenAPI 發佈的是完全無損的模式定義。

<!--
Some existing efforts will further improve the information available
through OpenAPI including [CEL validation and
admission](/docs/reference/using-api/cel/), along with OpenAPI
annotations on built-in types.

Many other tools can be built for authoring and transforming resources
using the type information found in the OpenAPI v3.
-->
現在的一些工作將進一步改善通過 OpenAPI 提供的資訊，例如
[CEL 校驗和准入](/zh-cn/docs/reference/using-api/cel/)以及對內置類型的 OpenAPI 註解。

使用在 OpenAPI v3 中的類型資訊還可以構建許多其他工具來編寫和轉換資源。

<!--
## How to get involved?

These two features are driven by the SIG API Machinery community,
available on the slack channel \#sig-api-machinery, through the
[mailing
list](https://groups.google.com/g/kubernetes-sig-api-machinery) and we
meet every other Wednesday at 11:00 AM PT on Zoom.
-->
## 如何參與？

這兩個特性由 SIG API Machinery 社區驅動，歡迎加入 Slack 頻道 \#sig-api-machinery，
請查閱[郵件列表](https://groups.google.com/g/kubernetes-sig-api-machinery)，
我們每週三 11:00 AM PT 在 Zoom 上召開例會。

<!--
We offer a huge thanks to all the contributors who helped design,
implement, and review these two features.
-->
我們對所有曾幫助設計、實現和審查這兩個特性的貢獻者們表示衷心的感謝。

- Alexander Zielenski
- Antoine Pelisse
- Daniel Smith
- David Eads
- Jeffrey Ying
- Jordan Liggitt
- Kevin Delgado
- Sean Sullivan
