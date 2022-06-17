---
title: Kubernetes API
content_type: concept
weight: 30
description: >
  Kubernetes API 使你可以查詢和操縱 Kubernetes 中物件的狀態。
  Kubernetes 控制平面的核心是 API 伺服器和它暴露的 HTTP API。
  使用者、叢集的不同部分以及外部元件都透過 API 伺服器相互通訊。
card:
  name: concepts
  weight: 30
---

<!-- overview -->

<!--
The core of Kubernetes' {{< glossary_tooltip text="control plane" term_id="control-plane" >}}
is the {{< glossary_tooltip text="API server" term_id="kube-apiserver" >}}. The API server
exposes an HTTP API that lets end users, different parts of your cluster, and
external components communicate with one another.

The Kubernetes API lets you query and manipulate the state of API objects in Kubernetes
(for example: Pods, Namespaces, ConfigMaps, and Events).

Most operations can be performed through the
[kubectl](/docs/reference/kubectl/) command-line interface or other
command-line tools, such as
[kubeadm](/docs/reference/setup-tools/kubeadm/), which in turn use the
API. However, you can also access the API directly using REST calls.
-->
Kubernetes {{< glossary_tooltip text="控制面" term_id="control-plane" >}}
的核心是 {{< glossary_tooltip text="API 伺服器" term_id="kube-apiserver" >}}。
API 伺服器負責提供 HTTP API，以供使用者、叢集中的不同部分和叢集外部元件相互通訊。

Kubernetes API 使你可以查詢和操縱 Kubernetes API
中物件（例如：Pod、Namespace、ConfigMap 和 Event）的狀態。

大部分操作都可以透過 [kubectl](/zh-cn/docs/reference/kubectl/) 命令列介面或
類似 [kubeadm](/zh-cn/docs/reference/setup-tools/kubeadm/) 這類命令列工具來執行，
這些工具在背後也是呼叫 API。不過，你也可以使用 REST 呼叫來訪問這些 API。

<!--
Consider using one of the [client libraries](/docs/reference/using-api/client-libraries/)
if you are writing an application using the Kubernetes API.
-->
如果你正在編寫程式來訪問 Kubernetes API，可以考慮使用
[客戶端庫](/zh-cn/docs/reference/using-api/client-libraries/)之一。

<!-- body -->

<!--
## OpenAPI specification {#api-specification}

Complete API details are documented using [OpenAPI](https://www.openapis.org/).

### OpenAPI V2

The Kubernetes API server serves an aggregated OpenAPI v2 spec via the
`/openapi/v2` endpoint. You can request the response format using
request headers as follows:
-->
## OpenAPI 規範     {#api-specification}

完整的 API 細節是用 [OpenAPI](https://www.openapis.org/) 來表述的。

### OpenAPI V2

Kubernetes API 伺服器透過 `/openapi/v2` 端點提供聚合的 OpenAPI v2 規範。
你可以按照下表所給的請求頭部，指定響應的格式：

<!--
<table>
  <thead>
     <tr>
        <th>Header</th>
        <th style="min-width: 50%;">Possible values</th>
        <th>Notes</th>
     </tr>
  </thead>
  <tbody>
     <tr>
        <td><code>Accept-Encoding</code></td>
        <td><code>gzip</code></td>
        <td><em>not supplying this header is also acceptable</em></td>
     </tr>
     <tr>
        <td rowspan="3"><code>Accept</code></td>
        <td><code>application/com.github.proto-openapi.spec.v2@v1.0+protobuf</code></td>
        <td><em>mainly for intra-cluster use</em></td>
     </tr>
     <tr>
        <td><code>application/json</code></td>
        <td><em>default</em></td>
     </tr>
     <tr>
        <td><code>*</code></td>
        <td><em>serves </em><code>application/json</code></td>
     </tr>
  </tbody>
  <caption>Valid request header values for OpenAPI v2 queries</caption>
</table>
-->
<table>
  <thead>
     <tr>
        <th>頭部</th>
        <th style="min-width: 50%;">可選值</th>
        <th>說明</th>
     </tr>
  </thead>
  <tbody>
     <tr>
        <td><code>Accept-Encoding</code></td>
        <td><code>gzip</code></td>
        <td><em>不指定此頭部也是可以的</em></td>
     </tr>
     <tr>
        <td rowspan="3"><code>Accept</code></td>
        <td><code>application/com.github.proto-openapi.spec.v2@v1.0+protobuf</code></td>
        <td><em>主要用於叢集內部</em></td>
     </tr>
     <tr>
        <td><code>application/json</code></td>
        <td><em>預設值</em></td>
     </tr>
     <tr>
        <td><code>*</code></td>
        <td><em>提供</em><code>application/json</code></td>
     </tr>
  </tbody>
  <caption>OpenAPI v2 查詢請求的合法頭部值</caption>
</table>

<!--
Kubernetes implements an alternative Protobuf based serialization format that
is primarily intended for intra-cluster communication. For more information
about this format, see the [Kubernetes Protobuf serialization](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/api-machinery/protobuf.md) design proposal and the
Interface Definition Language (IDL) files for each schema located in the Go
packages that define the API objects.
-->
Kubernetes 為 API 實現了一種基於 Protobuf 的序列化格式，主要用於叢集內部通訊。
關於此格式的詳細資訊，可參考
[Kubernetes Protobuf 序列化](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/api-machinery/protobuf.md)
設計提案。每種模式對應的介面描述語言（IDL）位於定義 API 物件的 Go 包中。

### OpenAPI V3

{{< feature-state state="beta"  for_k8s_version="v1.24" >}}

<!--
Kubernetes {{< param "version" >}} offers beta support for publishing its APIs as OpenAPI v3; this is a
beta feature that is enabled by default.
You can disable the beta feature by turning off the
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/) named `OpenAPIV3`
for the kube-apiserver component.
-->
Kubernetes {{< param "version" >}} 提供將其 API 以 OpenAPI v3 形式釋出的 beta 支援；
這一功能特性處於 beta 狀態，預設被開啟。
你可以透過為 kube-apiserver 元件關閉 `OpenAPIV3`
[特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)來禁用此 beta 特性。

<!--
A discovery endpoint `/openapi/v3` is provided to see a list of all
group/versions available. This endpoint only returns JSON. These group/versions
are provided in the following format:
-->
發現端點 `/openapi/v3` 被提供用來檢視可用的所有組、版本列表。
此列表僅返回 JSON。這些組、版本以下面的格式提供：
```json
{
    "paths": {
        ...
        "api/v1": {
            "serverRelativeURL": "/openapi/v3/api/v1?hash=CC0E9BFD992D8C59AEC98A1E2336F899E8318D3CF4C68944C3DEC640AF5AB52D864AC50DAA8D145B3494F75FA3CFF939FCBDDA431DAD3CA79738B297795818CF"
        },
        "apis/admissionregistration.k8s.io/v1": {
            "serverRelativeURL": "/openapi/v3/apis/admissionregistration.k8s.io/v1?hash=E19CC93A116982CE5422FC42B590A8AFAD92CDE9AE4D59B5CAAD568F083AD07946E6CB5817531680BCE6E215C16973CD39003B0425F3477CFD854E89A9DB6597"
        },
        ...
}
```

<!-- 
The relative URLs are pointing to immutable OpenAPI descriptions, in
order to improve client-side caching. The proper HTTP caching headers
are also set by the API server for that purpose (`Expires` to 1 year in
the future, and `Cache-Control` to `immutable`). When an obsolete URL is
used, the API server returns a redirect to the newest URL. 
-->
為了改進客戶端快取，相對的 URL 會指向不可變的 OpenAPI 描述。
為了此目的，API 伺服器也會設定正確的 HTTP 快取標頭
（`Expires` 為未來 1 年，和 `Cache-Control` 為 `immutable`）。
當一個過時的 URL 被使用時，API 伺服器會返回一個指向最新 URL 的重定向。

<!-- 
The Kubernetes API server publishes an OpenAPI v3 spec per Kubernetes
group version at the `/openapi/v3/apis/<group>/<version>?hash=<hash>`
endpoint.

Refer to the table below for accepted request headers. 
-->
Kubernetes API 伺服器會在端點 `/openapi/v3/apis/<group>/<version>?hash=<hash>`
釋出一個 Kubernetes 組版本的 OpenAPI v3 規範。

請參閱下表瞭解可接受的請求頭部。

<table>
  <caption style="display:none"><!--Valid request header values for OpenAPI v3 queries-->OpenAPI v3 查詢的合法請求頭部值</caption>
  <thead>
     <tr>
        <th><!--Header-->頭部</th>
        <th style="min-width: 50%;"><!--Possible values-->可選值</th>
        <th><!--Notes-->說明</th>
     </tr>
  </thead>
  <tbody>
     <tr>
        <td><code>Accept-Encoding</code></td>
        <td><code>gzip</code></td>
        <td><em><!--not supplying this header is also acceptable-->不提供此頭部也是可接受的</em></td>
     </tr>
     <tr>
        <td rowspan="3"><code>Accept</code></td>
        <td><code>application/com.github.proto-openapi.spec.v3@v1.0+protobuf</code></td>
        <td><em><!--mainly for intra-cluster use-->主要用於叢集內部使用</em></td>
     </tr>
     <tr>
        <td><code>application/json</code></td>
        <td><em><!--default-->預設</em></td>
     </tr>
     <tr>
        <td><code>*</code></td>
        <td><em><!--serves-->以</em> <code>application/json</code> 形式返回</td>
     </tr>
  </tbody>
</table>

<!--
## API changes

Any system that is successful needs to grow and change as new use cases emerge or existing ones change.
Therefore, Kubernetes has designed its features to allow the Kubernetes API to continuously change and grow.
The Kubernetes project aims to _not_ break compatibility with existing clients, and to maintain that
compatibility for a length of time so that other projects have an opportunity to adapt.
-->
## API 變更     {#api-changes}

任何成功的系統都要隨著新的使用案例的出現和現有案例的變化來成長和變化。
為此，Kubernetes 的功能特性設計考慮了讓 Kubernetes API 能夠持續變更和成長的因素。
Kubernetes 專案的目標是 _不要_ 引發現有客戶端的相容性問題，並在一定的時期內
維持這種相容性，以便其他專案有機會作出適應性變更。

<!--
In general, new API resources and new resource fields can be added often and frequently.
Elimination of resources or fields requires following the
[API deprecation policy](/docs/reference/using-api/deprecation-policy/).
-->
一般而言，新的 API 資源和新的資源欄位可以被頻繁地新增進來。
刪除資源或者欄位則要遵從
[API 廢棄策略](/zh-cn/docs/reference/using-api/deprecation-policy/)。

<!--
Kubernetes makes a strong commitment to maintain compatibility for official Kubernetes APIs
once they reach general availability (GA), typically at API version `v1`. Additionally,
Kubernetes keeps compatibility even for _beta_ API versions wherever feasible:
if you adopt a beta API you can continue to interact with your cluster using that API,
even after the feature goes stable.
-->
Kubernetes 對維護達到正式釋出（GA）階段的官方 API 的相容性有著很強的承諾，
通常這一 API 版本為 `v1`。此外，Kubernetes 在可能的時候還會保持 Beta API
版本的相容性：如果你採用了 Beta API，你可以繼續在叢集上使用該 API，
即使該功能特性已進入穩定期也是如此。

{{< note >}}
<!--
Although Kubernetes also aims to maintain compatibility for _alpha_ APIs versions, in some
circumstances this is not possible. If you use any alpha API versions, check the release notes
for Kubernetes when upgrading your cluster, in case the API did change.
-->
儘管 Kubernetes 也努力為 Alpha API 版本維護相容性，在有些場合相容性是無法做到的。
如果你使用了任何 Alpha API 版本，需要在升級叢集時檢視 Kubernetes 釋出說明，
以防 API 的確發生變更。
{{< /note >}}

<!--
Refer to [API versions reference](/docs/reference/using-api/#api-versioning)
for more details on the API version level definitions.
-->
關於 API 版本分級的定義細節，請參閱
[API 版本參考](/zh-cn/docs/reference/using-api/#api-versioning)頁面。

<!--
## API Extension

The Kubernetes API can be extended in one of two ways:
-->
## API 擴充套件  {#api-extension}

有兩種途徑來擴充套件 Kubernetes API：

<!--
1. [Custom resources](/docs/concepts/extend-kubernetes/api-extension/custom-resources/)
   let you declaratively define how the API server should provide your chosen resource API.
1. You can also extend the Kubernetes API by implementing an
   [aggregation layer](/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/).
-->
1. 你可以使用[自定義資源](/zh-cn/docs/concepts/extend-kubernetes/api-extension/custom-resources/)
   來以宣告式方式定義 API 伺服器如何提供你所選擇的資源 API。 
1. 你也可以選擇實現自己的
   [聚合層](/zh-cn/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/)
   來擴充套件 Kubernetes API。

## {{% heading "whatsnext" %}}

<!--
- Learn how to extend the Kubernetes API by adding your own
  [CustomResourceDefinition](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/).
- [Controlling Access To The Kubernetes API](/docs/concepts/security/controlling-access/) describes
  how the cluster manages authentication and authorization for API access.
- Learn about API endpoints, resource types and samples by reading
  [API Reference](/docs/reference/kubernetes-api/).
- Learn about what constitutes a compatible change, and how to change the API, from
  [API changes](https://git.k8s.io/community/contributors/devel/sig-architecture/api_changes.md#readme).
-->
- 瞭解如何透過新增你自己的
  [CustomResourceDefinition](/zh-cn/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/)
  來擴充套件 Kubernetes API。
- [控制 Kubernetes API 訪問](/zh-cn/docs/concepts/security/controlling-access/)頁面描述了叢集如何針對
  API 訪問管理身份認證和鑑權。
- 透過閱讀 [API 參考](/zh-cn/docs/reference/kubernetes-api/)瞭解 API 端點、資源型別以及示例。
- 閱讀 [API 變更（英文）](https://git.k8s.io/community/contributors/devel/sig-architecture/api_changes.md#readme)
  以瞭解什麼是相容性的變更以及如何變更 API。

