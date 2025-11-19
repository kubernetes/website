---
title: Kubernetes API
content_type: concept
weight: 40
description: >
  Kubernetes API 使你可以查詢和操縱 Kubernetes 中對象的狀態。
  Kubernetes 控制平面的核心是 API 服務器和它暴露的 HTTP API。
  用戶、集羣的不同部分以及外部組件都通過 API 服務器相互通信。
card:
  name: concepts
  weight: 30
---
<!--
reviewers:
- chenopis
title: The Kubernetes API
content_type: concept
weight: 40
description: >
  The Kubernetes API lets you query and manipulate the state of objects in Kubernetes.
  The core of Kubernetes' control plane is the API server and the HTTP API that it exposes. Users, the different parts of your cluster, and external components all communicate with one another through the API server.
card:
  name: concepts
  weight: 30
-->

<!-- overview -->

<!--
The core of Kubernetes' {{< glossary_tooltip text="control plane" term_id="control-plane" >}}
is the {{< glossary_tooltip text="API server" term_id="kube-apiserver" >}}. The API server
exposes an HTTP API that lets end users, different parts of your cluster, and
external components communicate with one another.

The Kubernetes API lets you query and manipulate the state of API objects in Kubernetes
(for example: Pods, Namespaces, ConfigMaps, and Events).
-->
Kubernetes {{< glossary_tooltip text="控制面" term_id="control-plane" >}}的核心是
{{< glossary_tooltip text="API 服務器" term_id="kube-apiserver" >}}。
API 服務器負責提供 HTTP API，以供用戶、集羣中的不同部分和集羣外部組件相互通信。

Kubernetes API 使你可以在 Kubernetes 中查詢和操縱 API 對象
（例如 Pod、Namespace、ConfigMap 和 Event）的狀態。

<!--
Most operations can be performed through the [kubectl](/docs/reference/kubectl/)
command-line interface or other command-line tools, such as
[kubeadm](/docs/reference/setup-tools/kubeadm/), which in turn use the API.
However, you can also access the API directly using REST calls. Kubernetes
provides a set of [client libraries](/docs/reference/using-api/client-libraries/)
for those looking to
write applications using the Kubernetes API.
-->
大部分操作都可以通過 [kubectl](/zh-cn/docs/reference/kubectl/) 命令行接口或類似
[kubeadm](/zh-cn/docs/reference/setup-tools/kubeadm/) 這類命令行工具來執行，
這些工具在背後也是調用 API。不過，你也可以使用 REST 調用來訪問這些 API。
Kubernetes 爲那些希望使用 Kubernetes API
編寫應用的開發者提供一組[客戶端庫](/zh-cn/docs/reference/using-api/client-libraries/)。

<!--
Each Kubernetes cluster publishes the specification of the APIs that the cluster serves.
There are two mechanisms that Kubernetes uses to publish these API specifications; both are useful
to enable automatic interoperability. For example, the `kubectl` tool fetches and caches the API
specification for enabling command-line completion and other features.
The two supported mechanisms are as follows:
-->
每個 Kubernetes 集羣都會發布集羣所使用的 API 規範。
Kubernetes 使用兩種機制來發布這些 API 規範；這兩種機制都有助於實現自動互操作。
例如，`kubectl` 工具獲取並緩存 API 規範，以實現命令行補全和其他特性。所支持的兩種機制如下：

<!--
- [The Discovery API](#discovery-api) provides information about the Kubernetes APIs:
  API names, resources, versions, and supported operations. This is a Kubernetes
  specific term as it is a separate API from the Kubernetes OpenAPI.
  It is intended to be a brief summary of the available resources and it does not
  detail specific schema for the resources. For reference about resource schemas,
  please refer to the OpenAPI document.
-->
- [發現 API](#discovery-api) 提供有關 Kubernetes API 的信息：API 名稱、資源、版本和支持的操作。
  此 API 是特定於 Kubernetes 的一個術語，因爲它是一個獨立於 Kubernetes OpenAPI 的 API。
  其目的是爲可用的資源提供簡要總結，不詳細說明資源的具體模式。有關資源模式的參考，請參閱 OpenAPI 文檔。

<!--
- The [Kubernetes OpenAPI Document](#openapi-interface-definition) provides (full)
  [OpenAPI v2.0 and 3.0 schemas](https://www.openapis.org/) for all Kubernetes API
endpoints.
  The OpenAPI v3 is the preferred method for accessing OpenAPI as it
provides
  a more comprehensive and accurate view of the API. It includes all the available
  API paths, as well as all resources consumed and produced for every operations
  on every endpoints. It also includes any extensibility components that a cluster supports.
  The data is a complete specification and is significantly larger than that from the
  Discovery API.
-->
- [Kubernetes OpenAPI 文檔](#openapi-interface-definition)爲所有 Kubernetes API 端點提供（完整的）
  [OpenAPI v2.0 和 v3.0 模式](https://www.openapis.org/)。OpenAPI v3 是訪問 OpenAPI 的首選方法，
  因爲它提供了更全面和準確的 API 視圖。其中包括所有可用的 API 路徑，以及每個端點上每個操作所接收和生成的所有資源。
  它還包括集羣支持的所有可擴展組件。這些數據是完整的規範，比 Discovery API 提供的規範要大得多。

<!--
## Discovery API

Kubernetes publishes a list of all group versions and resources supported via
the Discovery API. This includes the following for each resource:
-->
## Discovery API

Kubernetes 通過 Discovery API 發佈集羣所支持的所有組版本和資源列表。對於每個資源，包括以下內容：

<!--
- Name
- Cluster or namespaced scope
- Endpoint URL and supported verbs
- Alternative names
- Group, version, kind
-->
- 名稱
- 集羣作用域還是名字空間作用域
- 端點 URL 和所支持的動詞
- 別名
- 組、版本、類別

<!--
The API is available in both aggregated and unaggregated form. The aggregated
discovery serves two endpoints while the unaggregated discovery serves a
separate endpoint for each group version.
-->
API 以聚合和非聚合形式提供。聚合的發現提供兩個端點，而非聚合的發現爲每個組版本提供單獨的端點。

<!--
### Aggregated discovery
-->
### 聚合的發現   {#aggregated-discovery}

{{< feature-state feature_gate_name="AggregatedDiscoveryEndpoint" >}}

<!--
Kubernetes offers beta support for _aggregated discovery_, publishing
all resources supported by a cluster through two endpoints (`/api` and
`/apis`). Requesting this
endpoint drastically reduces the number of requests sent to fetch the
discovery data from the cluster. You can access the data by
requesting the respective endpoints with an `Accept` header indicating
the aggregated discovery resource:
`Accept: application/json;v=v2beta1;g=apidiscovery.k8s.io;as=APIGroupDiscoveryList`.
-->
Kubernetes 爲**聚合的發現**提供了 Beta 支持，通過兩個端點（`/api` 和 `/apis`）發佈集羣所支持的所有資源。
請求這個端點會大大減少從集羣獲取發現數據時發送的請求數量。你可以通過帶有
`Accept` 頭（`Accept: application/json;v=v2beta1;g=apidiscovery.k8s.io;as=APIGroupDiscoveryList`）
的請求發送到不同端點，來指明聚合發現的資源。

<!--
Without indicating the resource type using the `Accept` header, the default
response for the `/api` and `/apis` endpoint is an unaggregated discovery
document.
-->
如果沒有使用 `Accept` 頭指示資源類型，對於 `/api` 和 `/apis` 端點的默認響應將是一個非聚合的發現文檔。

<!--
The [discovery document](https://github.com/kubernetes/kubernetes/blob/release-{{< skew currentVersion >}}/api/discovery/aggregated_v2.json)
for the built-in resources can be found in the Kubernetes GitHub repository.
This Github document can be used as a reference of the base set of the available resources
if a Kubernetes cluster is not available to query.

The endpoint also supports ETag and protobuf encoding.
-->
內置資源的[發現文檔](https://github.com/kubernetes/kubernetes/blob/release-{{< skew currentVersion >}}/api/discovery/aggregated_v2.json)可以在
Kubernetes GitHub 代碼倉庫中找到。如果手頭沒有 Kubernetes 集羣可供查詢，
此 Github 文檔可用作可用資源的基礎集合的參考。端點還支持 ETag 和 protobuf 編碼。

<!--
### Unaggregated discovery

Without discovery aggregation, discovery is published in levels, with the root
endpoints publishing discovery information for downstream documents.

A list of all group versions supported by a cluster is published at
the `/api` and `/apis` endpoints. Example:
-->
### 非聚合的發現   {#unaggregated-discovery}

在不使用聚合發現的情況下，發現 API 以不同級別發佈，同時根端點爲下游文檔發佈發現信息。

集羣支持的所有組版本列表發佈在 `/api` 和 `/apis` 端點。例如：

```
{
  "kind": "APIGroupList",
  "apiVersion": "v1",
  "groups": [
    {
      "name": "apiregistration.k8s.io",
      "versions": [
        {
          "groupVersion": "apiregistration.k8s.io/v1",
          "version": "v1"
        }
      ],
      "preferredVersion": {
        "groupVersion": "apiregistration.k8s.io/v1",
        "version": "v1"
      }
    },
    {
      "name": "apps",
      "versions": [
        {
          "groupVersion": "apps/v1",
          "version": "v1"
        }
      ],
      "preferredVersion": {
        "groupVersion": "apps/v1",
        "version": "v1"
      }
    },
    ...
}
```

<!--
Additional requests are needed to obtain the discovery document for each group version at
`/apis/<group>/<version>` (for example:
`/apis/rbac.authorization.k8s.io/v1alpha1`), which advertises the list of
resources served under a particular group version. These endpoints are used by
kubectl to fetch the list of resources supported by a cluster.
-->
用戶需要發出額外的請求才能在 `/apis/<group>/<version>`（例如 `/apis/rbac.authorization.k8s.io/v1alpha1`）
獲取每個組版本的發現文檔。這些發現文檔會公佈在特定組版本下所提供的資源列表。
kubectl 使用這些端點來獲取某集羣所支持的資源列表。

<!-- body -->

<a id="#api-specification" />

<!--
## OpenAPI interface definition

For details about the OpenAPI specifications, see the [OpenAPI documentation](https://www.openapis.org/).

Kubernetes serves both OpenAPI v2.0 and OpenAPI v3.0. OpenAPI v3 is the
preferred method of accessing the OpenAPI because it offers a more comprehensive
(lossless) representation of Kubernetes resources. Due to limitations of OpenAPI
version 2, certain fields are dropped from the published OpenAPI including but not
limited to `default`, `nullable`, `oneOf`.
-->
## OpenAPI 接口定義   {#openapi-interface-definition}

有關 OpenAPI 規範的細節，參閱 [OpenAPI 文檔](https://www.openapis.org/)。

Kubernetes 同時提供 OpenAPI v2.0 和 OpenAPI v3.0。OpenAPI v3 是訪問 OpenAPI 的首選方法，
因爲它提供了對 Kubernetes 資源更全面（無損）的表示。由於 OpenAPI v2 的限制，
所公佈的 OpenAPI 中會丟棄掉一些字段，包括但不限於 `default`、`nullable`、`oneOf`。

<!--
### OpenAPI V2

The Kubernetes API server serves an aggregated OpenAPI v2 spec via the
`/openapi/v2` endpoint. You can request the response format using
request headers as follows:
-->
### OpenAPI v2

Kubernetes API 服務器通過 `/openapi/v2` 端點提供聚合的 OpenAPI v2 規範。
你可以按照下表所給的請求頭部，指定響應的格式：

<!--
<table>
  <caption style="display:none">Valid request header values for OpenAPI v2 queries</caption>
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
</table>
-->
<table>
  <caption style="display:none">OpenAPI v2 查詢請求的合法頭部值</caption>
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
        <td><em>主要用於集羣內部</em></td>
     </tr>
     <tr>
        <td><code>application/json</code></td>
        <td><em>默認值</em></td>
     </tr>
     <tr>
        <td><code>*</code></td>
        <td><em>提供</em><code>application/json</code></td>
     </tr>
  </tbody>
</table>

{{< warning >}}
<!--
The validation rules published as part of OpenAPI schemas may not be complete, and usually aren't.
Additional validation occurs within the API server. If you want precise and complete verification,
a `kubectl apply --dry-run=server` runs all the applicable validation (and also activates admission-time
checks).
-->

作爲 OpenAPI 模式的一部分發布的校驗規則可能不完整，而且通常也確實不完整。
在 API 服務器內部會進行額外的校驗。如果你希望進行精確且完整的驗證，
可以使用 `kubectl apply --dry-run=server`，這條命令將運行所有適用的校驗（同時也會觸發准入時檢查）。
{{< /warning >}}

### OpenAPI v3

{{< feature-state feature_gate_name="OpenAPIV3" >}}

<!--
Kubernetes supports publishing a description of its APIs as OpenAPI v3.
-->
Kubernetes 支持將其 API 的描述以 OpenAPI v3 形式發佈。

<!--
A discovery endpoint `/openapi/v3` is provided to see a list of all
group/versions available. This endpoint only returns JSON. These
group/versions are provided in the following format:
-->
發現端點 `/openapi/v3` 被提供用來查看可用的所有組、版本列表。
此列表僅返回 JSON。這些組、版本以下面的格式提供：

```yaml
{
    "paths": {
        ...,
        "api/v1": {
            "serverRelativeURL": "/openapi/v3/api/v1?hash=CC0E9BFD992D8C59AEC98A1E2336F899E8318D3CF4C68944C3DEC640AF5AB52D864AC50DAA8D145B3494F75FA3CFF939FCBDDA431DAD3CA79738B297795818CF"
        },
        "apis/admissionregistration.k8s.io/v1": {
            "serverRelativeURL": "/openapi/v3/apis/admissionregistration.k8s.io/v1?hash=E19CC93A116982CE5422FC42B590A8AFAD92CDE9AE4D59B5CAAD568F083AD07946E6CB5817531680BCE6E215C16973CD39003B0425F3477CFD854E89A9DB6597"
        },
        ....
    }
}
```
<!-- for editors: intentionally use yaml instead of json here, to prevent syntax highlight error. -->

<!-- 
The relative URLs are pointing to immutable OpenAPI descriptions, in
order to improve client-side caching. The proper HTTP caching headers
are also set by the API server for that purpose (`Expires` to 1 year in
the future, and `Cache-Control` to `immutable`). When an obsolete URL is
used, the API server returns a redirect to the newest URL.
-->
爲了改進客戶端緩存，相對的 URL 會指向不可變的 OpenAPI 描述。
爲了此目的，API 服務器也會設置正確的 HTTP 緩存標頭
（`Expires` 爲未來 1 年，和 `Cache-Control` 爲 `immutable`）。
當一個過時的 URL 被使用時，API 服務器會返回一個指向最新 URL 的重定向。

<!-- 
The Kubernetes API server publishes an OpenAPI v3 spec per Kubernetes
group version at the `/openapi/v3/apis/<group>/<version>?hash=<hash>`
endpoint.

Refer to the table below for accepted request headers.
-->
Kubernetes API 服務器會在端點 `/openapi/v3/apis/<group>/<version>?hash=<hash>`
發佈一個 Kubernetes 組版本的 OpenAPI v3 規範。

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
        <td><em><!--mainly for intra-cluster use-->主要用於集羣內部使用</em></td>
     </tr>
     <tr>
        <td><code>application/json</code></td>
        <td><em><!--default-->默認</em></td>
     </tr>
     <tr>
        <td><code>*</code></td>
        <td><em><!--serves-->以</em> <code>application/json</code> 形式返回</td>
     </tr>
  </tbody>
</table>

<!--
A Golang implementation to fetch the OpenAPI V3 is provided in the package
[`k8s.io/client-go/openapi3`](https://pkg.go.dev/k8s.io/client-go/openapi3).

Kubernetes {{< skew currentVersion >}} publishes
OpenAPI v2.0 and v3.0; there are no plans to support 3.1 in the near future.
-->
[`k8s.io/client-go/openapi3`](https://pkg.go.dev/k8s.io/client-go/openapi3)
包中提供了獲取 OpenAPI v3 的 Golang 實現。

Kubernetes {{< skew currentVersion >}} 發佈了 OpenAPI v2.0 和 v3.0；
近期沒有支持 v3.1 的計劃。

<!--
### Protobuf serialization

Kubernetes implements an alternative Protobuf based serialization format that
is primarily intended for intra-cluster communication. For more information
about this format, see the [Kubernetes Protobuf serialization](https://git.k8s.io/design-proposals-archive/api-machinery/protobuf.md)
design proposal and the
Interface Definition Language (IDL) files for each schema located in the Go
packages that define the API objects.
-->
### Protobuf 序列化   {#protobuf-serialization}

Kubernetes 爲 API 實現了一種基於 Protobuf 的序列化格式，主要用於集羣內部通信。
關於此格式的詳細信息，可參考
[Kubernetes Protobuf 序列化](https://git.k8s.io/design-proposals-archive/api-machinery/protobuf.md)設計提案。
每種模式對應的接口描述語言（IDL）位於定義 API 對象的 Go 包中。

<!--
## Persistence

Kubernetes stores the serialized state of objects by writing them into
{{< glossary_tooltip term_id="etcd" >}}.
-->
## 持久化   {#persistence}

Kubernetes 通過將序列化狀態的對象寫入到 {{< glossary_tooltip term_id="etcd" >}} 中完成存儲操作。

<!--
## API groups and versioning

To make it easier to eliminate fields or restructure resource representations,
Kubernetes supports multiple API versions, each at a different API path, such
as `/api/v1` or `/apis/rbac.authorization.k8s.io/v1alpha1`.

Versioning is done at the API level rather than at the resource or field level
to ensure that the API presents a clear, consistent view of system resources
and behavior, and to enable controlling access to end-of-life and/or
experimental APIs.
-->
## API 組和版本控制   {#api-groups-and-versioning}

爲了更容易消除字段或重組資源的呈現方式，Kubernetes 支持多個 API 版本，每個版本位於不同的 API 路徑，
例如 `/api/v1` 或 `/apis/rbac.authorization.k8s.io/v1alpha1`。

版本控制是在 API 級別而不是在資源或字段級別完成的，以確保 API 呈現出清晰、一致的系統資源和行爲視圖，
並能夠控制對生命結束和/或實驗性 API 的訪問。

<!--
To make it easier to evolve and to extend its API, Kubernetes implements
[API groups](/docs/reference/using-api/#api-groups) that can be
[enabled or disabled](/docs/reference/using-api/#enabling-or-disabling).

API resources are distinguished by their API group, resource type, namespace
(for namespaced resources), and name. The API server handles the conversion between
API versions transparently: all the different versions are actually representations
of the same persisted data. The API server may serve the same underlying data
through multiple API versions.
-->
爲了更容易演進和擴展其 API，Kubernetes 實現了 [API 組](/zh-cn/docs/reference/using-api/#api-groups)，
這些 API 組可以被[啓用或禁用](/zh-cn/docs/reference/using-api/#enabling-or-disabling)。

API 資源通過其 API 組、資源類型、名字空間（用於名字空間作用域的資源）和名稱來區分。
API 服務器透明地處理 API 版本之間的轉換：所有不同的版本實際上都是相同持久化數據的呈現。
API 服務器可以通過多個 API 版本提供相同的底層數據。

<!--
For example, suppose there are two API versions, `v1` and `v1beta1`, for the same
resource. If you originally created an object using the `v1beta1` version of its
API, you can later read, update, or delete that object using either the `v1beta1`
or the `v1` API version, until the `v1beta1` version is deprecated and removed.
At that point you can continue accessing and modifying the object using the `v1` API.
-->
例如，假設針對相同的資源有兩個 API 版本：`v1` 和 `v1beta1`。
如果你最初使用其 API 的 `v1beta1` 版本創建了一個對象，
你稍後可以使用 `v1beta1` 或 `v1` API 版本來讀取、更新或刪除該對象，
直到 `v1beta1` 版本被廢棄和移除爲止。此後，你可以使用 `v1` API 繼續訪問和修改該對象。

<!--
### API changes

Any system that is successful needs to grow and change as new use cases emerge or existing ones change.
Therefore, Kubernetes has designed the Kubernetes API to continuously change and grow.
The Kubernetes project aims to _not_ break compatibility with existing clients, and to maintain that
compatibility for a length of time so that other projects have an opportunity to adapt.
-->
### API 變更     {#api-changes}

任何成功的系統都要隨着新的使用案例的出現和現有案例的變化來成長和變化。
爲此，Kubernetes 已設計了 Kubernetes API 來持續變更和成長。
Kubernetes 項目的目標是**不要**給現有客戶端帶來兼容性問題，並在一定的時期內維持這種兼容性，
以便其他項目有機會作出適應性變更。

<!--
In general, new API resources and new resource fields can be added often and frequently.
Elimination of resources or fields requires following the
[API deprecation policy](/docs/reference/using-api/deprecation-policy/).
-->
一般而言，新的 API 資源和新的資源字段可以被頻繁地添加進來。
刪除資源或者字段則要遵從
[API 廢棄策略](/zh-cn/docs/reference/using-api/deprecation-policy/)。

<!--
Kubernetes makes a strong commitment to maintain compatibility for official Kubernetes APIs
once they reach general availability (GA), typically at API version `v1`. Additionally,
Kubernetes maintains compatibility with data persisted via _beta_ API versions of official Kubernetes APIs,
and ensures that data can be converted and accessed via GA API versions when the feature goes stable.
-->
Kubernetes 對維護達到正式發佈（GA）階段的官方 API 的兼容性有着很強的承諾，通常這一 API 版本爲 `v1`。
此外，Kubernetes 保持與 Kubernetes 官方 API 的 **Beta** API 版本持久化數據的兼容性，
並確保在該功能特性已進入穩定期時數據可以通過 GA API 版本進行轉換和訪問。

<!--
If you adopt a beta API version, you will need to transition to a subsequent beta or stable API version
once the API graduates. The best time to do this is while the beta API is in its deprecation period,
since objects are simultaneously accessible via both API versions. Once the beta API completes its
deprecation period and is no longer served, the replacement API version must be used.
-->
如果你採用一個 Beta API 版本，一旦該 API 進階，你將需要轉換到後續的 Beta 或穩定的 API 版本。
執行此操作的最佳時間是 Beta API 處於棄用期，因爲此時可以通過兩個 API 版本同時訪問那些對象。
一旦 Beta API 結束其棄用期並且不再提供服務，則必須使用替換的 API 版本。

{{< note >}}
<!--
Although Kubernetes also aims to maintain compatibility for _alpha_ APIs versions, in some
circumstances this is not possible. If you use any alpha API versions, check the release notes
for Kubernetes when upgrading your cluster, in case the API did change in incompatible
ways that require deleting all existing alpha objects prior to upgrade.
-->
儘管 Kubernetes 也努力爲 **Alpha** API 版本維護兼容性，在有些場合兼容性是無法做到的。
如果你使用了任何 Alpha API 版本，需要在升級集羣時查看 Kubernetes 發佈說明，
如果 API 確實以不兼容的方式發生變更，則需要在升級之前刪除所有現有的 Alpha 對象。
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
## API 擴展  {#api-extension}

有兩種途徑來擴展 Kubernetes API：

<!--
1. [Custom resources](/docs/concepts/extend-kubernetes/api-extension/custom-resources/)
   let you declaratively define how the API server should provide your chosen resource API.
1. You can also extend the Kubernetes API by implementing an
   [aggregation layer](/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/).
-->
1. 你可以使用[自定義資源](/zh-cn/docs/concepts/extend-kubernetes/api-extension/custom-resources/)來以聲明式方式定義
   API 服務器如何提供你所選擇的資源 API。
1. 你也可以選擇實現自己的[聚合層](/zh-cn/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/)來擴展
   Kubernetes API。

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
- 瞭解如何通過添加你自己的
  [CustomResourceDefinition](/zh-cn/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/)
  來擴展 Kubernetes API。
- [控制 Kubernetes API 訪問](/zh-cn/docs/concepts/security/controlling-access/)頁面描述了集羣如何針對
  API 訪問管理身份認證和鑑權。
- 通過閱讀 [API 參考](/zh-cn/docs/reference/kubernetes-api/)瞭解 API 端點、資源類型以及示例。
- 閱讀 [API 變更（英文）](https://git.k8s.io/community/contributors/devel/sig-architecture/api_changes.md#readme)
  以瞭解什麼是兼容性的變更以及如何變更 API。
