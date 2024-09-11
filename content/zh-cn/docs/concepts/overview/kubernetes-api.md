---
title: Kubernetes API
content_type: concept
weight: 40
description: >
  Kubernetes API 使你可以查询和操纵 Kubernetes 中对象的状态。
  Kubernetes 控制平面的核心是 API 服务器和它暴露的 HTTP API。
  用户、集群的不同部分以及外部组件都通过 API 服务器相互通信。
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
{{< glossary_tooltip text="API 服务器" term_id="kube-apiserver" >}}。
API 服务器负责提供 HTTP API，以供用户、集群中的不同部分和集群外部组件相互通信。

Kubernetes API 使你可以在 Kubernetes 中查询和操纵 API 对象
（例如 Pod、Namespace、ConfigMap 和 Event）的状态。

<!--
Most operations can be performed through the [kubectl](/docs/reference/kubectl/)
command-line interface or other command-line tools, such as
[kubeadm](/docs/reference/setup-tools/kubeadm/), which in turn use the API.
However, you can also access the API directly using REST calls. Kubernetes
provides a set of [client libraries](/docs/reference/using-api/client-libraries/)
for those looking to
write applications using the Kubernetes API.
-->
大部分操作都可以通过 [kubectl](/zh-cn/docs/reference/kubectl/) 命令行接口或类似
[kubeadm](/zh-cn/docs/reference/setup-tools/kubeadm/) 这类命令行工具来执行，
这些工具在背后也是调用 API。不过，你也可以使用 REST 调用来访问这些 API。
Kubernetes 为那些希望使用 Kubernetes API
编写应用的开发者提供一组[客户端库](/zh-cn/docs/reference/using-api/client-libraries/)。

<!--
Each Kubernetes cluster publishes the specification of the APIs that the cluster serves.
There are two mechanisms that Kubernetes uses to publish these API specifications; both are useful
to enable automatic interoperability. For example, the `kubectl` tool fetches and caches the API
specification for enabling command-line completion and other features.
The two supported mechanisms are as follows:
-->
每个 Kubernetes 集群都会发布集群所使用的 API 规范。
Kubernetes 使用两种机制来发布这些 API 规范；这两种机制都有助于实现自动互操作。
例如，`kubectl` 工具获取并缓存 API 规范，以实现命令行补全和其他特性。所支持的两种机制如下：

<!--
- [The Discovery API](#discovery-api) provides information about the Kubernetes APIs:
  API names, resources, versions, and supported operations. This is a Kubernetes
  specific term as it is a separate API from the Kubernetes OpenAPI.
  It is intended to be a brief summary of the available resources and it does not
  detail specific schema for the resources. For reference about resource schemas,
  please refer to the OpenAPI document.
-->
- [发现 API](#discovery-api) 提供有关 Kubernetes API 的信息：API 名称、资源、版本和支持的操作。
  此 API 是特定于 Kubernetes 的一个术语，因为它是一个独立于 Kubernetes OpenAPI 的 API。
  其目的是为可用的资源提供简要总结，不详细说明资源的具体模式。有关资源模式的参考，请参阅 OpenAPI 文档。

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
- [Kubernetes OpenAPI 文档](#openapi-interface-definition)为所有 Kubernetes API 端点提供（完整的）
  [OpenAPI v2.0 和 v3.0 模式](https://www.openapis.org/)。OpenAPI v3 是访问 OpenAPI 的首选方法，
  因为它提供了更全面和准确的 API 视图。其中包括所有可用的 API 路径，以及每个端点上每个操作所接收和生成的所有资源。
  它还包括集群支持的所有可扩展组件。这些数据是完整的规范，比 Discovery API 提供的规范要大得多。

<!--
## Discovery API

Kubernetes publishes a list of all group versions and resources supported via
the Discovery API. This includes the following for each resource:
-->
## Discovery API

Kubernetes 通过 Discovery API 发布集群所支持的所有组版本和资源列表。对于每个资源，包括以下内容：

<!--
- Name
- Cluster or namespaced scope
- Endpoint URL and supported verbs
- Alternative names
- Group, version, kind
-->
- 名称
- 集群作用域还是名字空间作用域
- 端点 URL 和所支持的动词
- 别名
- 组、版本、类别

<!--
The API is available both aggregated and unaggregated form. The aggregated
discovery serves two endpoints while the unaggregated discovery serves a
separate endpoint for each group version.
-->
API 以聚合和非聚合形式提供。聚合的发现提供两个端点，而非聚合的发现为每个组版本提供单独的端点。

<!--
### Aggregated discovery
-->
### 聚合的发现   {#aggregated-discovery}

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
Kubernetes 为**聚合的发现**提供了 Beta 支持，通过两个端点（`/api` 和 `/apis`）发布集群所支持的所有资源。
请求这个端点会大大减少从集群获取发现数据时发送的请求数量。你可以通过带有
`Accept` 头（`Accept: application/json;v=v2beta1;g=apidiscovery.k8s.io;as=APIGroupDiscoveryList`）
的请求发送到不同端点，来指明聚合发现的资源。

<!--
Without indicating the resource type using the `Accept` header, the default
response for the `/api` and `/apis` endpoint is an unaggregated discovery
document.
-->
如果没有使用 `Accept` 头指示资源类型，对于 `/api` 和 `/apis` 端点的默认响应将是一个非聚合的发现文档。

<!--
The [discovery document](https://github.com/kubernetes/kubernetes/blob/release-{{< skew currentVersion >}}/api/discovery/aggregated_v2beta1.json)
for the built-in resources can be found in the Kubernetes GitHub repository.
This Github document can be used as a reference of the base set of the available resources
if a Kubernetes cluster is not available to query.

The endpoint also supports ETag and protobuf encoding.
-->
内置资源的[发现文档](https://github.com/kubernetes/kubernetes/blob/release-{{< skew currentVersion >}}/api/discovery/aggregated_v2beta1.json)可以在
Kubernetes GitHub 代码仓库中找到。如果手头没有 Kubernetes 集群可供查询，
此 Github 文档可用作可用资源的基础集合的参考。端点还支持 ETag 和 protobuf 编码。

<!--
### Unaggregated discovery

Without discovery aggregation, discovery is published in levels, with the root
endpoints publishing discovery information for downstream documents.

A list of all group versions supported by a cluster is published at
the `/api` and `/apis` endpoints. Example:
-->
### 非聚合的发现   {#unaggregated-discovery}

在不使用聚合发现的情况下，发现 API 以不同级别发布，同时根端点为下游文档发布发现信息。

集群支持的所有组版本列表发布在 `/api` 和 `/apis` 端点。例如：

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
用户需要发出额外的请求才能在 `/apis/<group>/<version>`（例如 `/apis/rbac.authorization.k8s.io/v1alpha1`）
获取每个组版本的发现文档。这些发现文档会公布在特定组版本下所提供的资源列表。
kubectl 使用这些端点来获取某集群所支持的资源列表。

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
## OpenAPI 接口定义   {#openapi-interface-definition}

有关 OpenAPI 规范的细节，参阅 [OpenAPI 文档](https://www.openapis.org/)。

Kubernetes 同时提供 OpenAPI v2.0 和 OpenAPI v3.0。OpenAPI v3 是访问 OpenAPI 的首选方法，
因为它提供了对 Kubernetes 资源更全面（无损）的表示。由于 OpenAPI v2 的限制，
所公布的 OpenAPI 中会丢弃掉一些字段，包括但不限于 `default`、`nullable`、`oneOf`。

<!--
### OpenAPI V2

The Kubernetes API server serves an aggregated OpenAPI v2 spec via the
`/openapi/v2` endpoint. You can request the response format using
request headers as follows:
-->
### OpenAPI v2

Kubernetes API 服务器通过 `/openapi/v2` 端点提供聚合的 OpenAPI v2 规范。
你可以按照下表所给的请求头部，指定响应的格式：

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
  <caption style="display:none">OpenAPI v2 查询请求的合法头部值</caption>
  <thead>
     <tr>
        <th>头部</th>
        <th style="min-width: 50%;">可选值</th>
        <th>说明</th>
     </tr>
  </thead>
  <tbody>
     <tr>
        <td><code>Accept-Encoding</code></td>
        <td><code>gzip</code></td>
        <td><em>不指定此头部也是可以的</em></td>
     </tr>
     <tr>
        <td rowspan="3"><code>Accept</code></td>
        <td><code>application/com.github.proto-openapi.spec.v2@v1.0+protobuf</code></td>
        <td><em>主要用于集群内部</em></td>
     </tr>
     <tr>
        <td><code>application/json</code></td>
        <td><em>默认值</em></td>
     </tr>
     <tr>
        <td><code>*</code></td>
        <td><em>提供</em><code>application/json</code></td>
     </tr>
  </tbody>
</table>

### OpenAPI v3

{{< feature-state feature_gate_name="OpenAPIV3" >}}

<!--
Kubernetes supports publishing a description of its APIs as OpenAPI v3.
-->
Kubernetes 支持将其 API 的描述以 OpenAPI v3 形式发布。

<!--
A discovery endpoint `/openapi/v3` is provided to see a list of all
group/versions available. This endpoint only returns JSON. These
group/versions are provided in the following format:
-->
发现端点 `/openapi/v3` 被提供用来查看可用的所有组、版本列表。
此列表仅返回 JSON。这些组、版本以下面的格式提供：

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
为了改进客户端缓存，相对的 URL 会指向不可变的 OpenAPI 描述。
为了此目的，API 服务器也会设置正确的 HTTP 缓存标头
（`Expires` 为未来 1 年，和 `Cache-Control` 为 `immutable`）。
当一个过时的 URL 被使用时，API 服务器会返回一个指向最新 URL 的重定向。

<!-- 
The Kubernetes API server publishes an OpenAPI v3 spec per Kubernetes
group version at the `/openapi/v3/apis/<group>/<version>?hash=<hash>`
endpoint.

Refer to the table below for accepted request headers.
-->
Kubernetes API 服务器会在端点 `/openapi/v3/apis/<group>/<version>?hash=<hash>`
发布一个 Kubernetes 组版本的 OpenAPI v3 规范。

请参阅下表了解可接受的请求头部。

<table>
  <caption style="display:none"><!--Valid request header values for OpenAPI v3 queries-->OpenAPI v3 查询的合法请求头部值</caption>
  <thead>
     <tr>
        <th><!--Header-->头部</th>
        <th style="min-width: 50%;"><!--Possible values-->可选值</th>
        <th><!--Notes-->说明</th>
     </tr>
  </thead>
  <tbody>
     <tr>
        <td><code>Accept-Encoding</code></td>
        <td><code>gzip</code></td>
        <td><em><!--not supplying this header is also acceptable-->不提供此头部也是可接受的</em></td>
     </tr>
     <tr>
        <td rowspan="3"><code>Accept</code></td>
        <td><code>application/com.github.proto-openapi.spec.v3@v1.0+protobuf</code></td>
        <td><em><!--mainly for intra-cluster use-->主要用于集群内部使用</em></td>
     </tr>
     <tr>
        <td><code>application/json</code></td>
        <td><em><!--default-->默认</em></td>
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
包中提供了获取 OpenAPI v3 的 Golang 实现。

Kubernetes {{< skew currentVersion >}} 发布了 OpenAPI v2.0 和 v3.0；
近期没有支持 v3.1 的计划。

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

Kubernetes 为 API 实现了一种基于 Protobuf 的序列化格式，主要用于集群内部通信。
关于此格式的详细信息，可参考
[Kubernetes Protobuf 序列化](https://git.k8s.io/design-proposals-archive/api-machinery/protobuf.md)设计提案。
每种模式对应的接口描述语言（IDL）位于定义 API 对象的 Go 包中。

<!--
## Persistence

Kubernetes stores the serialized state of objects by writing them into
{{< glossary_tooltip term_id="etcd" >}}.
-->
## 持久化   {#persistence}

Kubernetes 通过将序列化状态的对象写入到 {{< glossary_tooltip term_id="etcd" >}} 中完成存储操作。

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
## API 组和版本控制   {#api-groups-and-versioning}

为了更容易消除字段或重组资源的呈现方式，Kubernetes 支持多个 API 版本，每个版本位于不同的 API 路径，
例如 `/api/v1` 或 `/apis/rbac.authorization.k8s.io/v1alpha1`。

版本控制是在 API 级别而不是在资源或字段级别完成的，以确保 API 呈现出清晰、一致的系统资源和行为视图，
并能够控制对生命结束和/或实验性 API 的访问。

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
为了更容易演进和扩展其 API，Kubernetes 实现了 [API 组](/zh-cn/docs/reference/using-api/#api-groups)，
这些 API 组可以被[启用或禁用](/zh-cn/docs/reference/using-api/#enabling-or-disabling)。

API 资源通过其 API 组、资源类型、名字空间（用于名字空间作用域的资源）和名称来区分。
API 服务器透明地处理 API 版本之间的转换：所有不同的版本实际上都是相同持久化数据的呈现。
API 服务器可以通过多个 API 版本提供相同的底层数据。

<!--
For example, suppose there are two API versions, `v1` and `v1beta1`, for the same
resource. If you originally created an object using the `v1beta1` version of its
API, you can later read, update, or delete that object using either the `v1beta1`
or the `v1` API version, until the `v1beta1` version is deprecated and removed.
At that point you can continue accessing and modifying the object using the `v1` API.
-->
例如，假设针对相同的资源有两个 API 版本：`v1` 和 `v1beta1`。
如果你最初使用其 API 的 `v1beta1` 版本创建了一个对象，
你稍后可以使用 `v1beta1` 或 `v1` API 版本来读取、更新或删除该对象，
直到 `v1beta1` 版本被废弃和移除为止。此后，你可以使用 `v1` API 继续访问和修改该对象。

<!--
### API changes

Any system that is successful needs to grow and change as new use cases emerge or existing ones change.
Therefore, Kubernetes has designed the Kubernetes API to continuously change and grow.
The Kubernetes project aims to _not_ break compatibility with existing clients, and to maintain that
compatibility for a length of time so that other projects have an opportunity to adapt.
-->
### API 变更     {#api-changes}

任何成功的系统都要随着新的使用案例的出现和现有案例的变化来成长和变化。
为此，Kubernetes 已设计了 Kubernetes API 来持续变更和成长。
Kubernetes 项目的目标是**不要**给现有客户端带来兼容性问题，并在一定的时期内维持这种兼容性，
以便其他项目有机会作出适应性变更。

<!--
In general, new API resources and new resource fields can be added often and frequently.
Elimination of resources or fields requires following the
[API deprecation policy](/docs/reference/using-api/deprecation-policy/).
-->
一般而言，新的 API 资源和新的资源字段可以被频繁地添加进来。
删除资源或者字段则要遵从
[API 废弃策略](/zh-cn/docs/reference/using-api/deprecation-policy/)。

<!--
Kubernetes makes a strong commitment to maintain compatibility for official Kubernetes APIs
once they reach general availability (GA), typically at API version `v1`. Additionally,
Kubernetes maintains compatibility with data persisted via _beta_ API versions of official Kubernetes APIs,
and ensures that data can be converted and accessed via GA API versions when the feature goes stable.
-->
Kubernetes 对维护达到正式发布（GA）阶段的官方 API 的兼容性有着很强的承诺，通常这一 API 版本为 `v1`。
此外，Kubernetes 保持与 Kubernetes 官方 API 的 **Beta** API 版本持久化数据的兼容性，
并确保在该功能特性已进入稳定期时数据可以通过 GA API 版本进行转换和访问。

<!--
If you adopt a beta API version, you will need to transition to a subsequent beta or stable API version
once the API graduates. The best time to do this is while the beta API is in its deprecation period,
since objects are simultaneously accessible via both API versions. Once the beta API completes its
deprecation period and is no longer served, the replacement API version must be used.
-->
如果你采用一个 Beta API 版本，一旦该 API 进阶，你将需要转换到后续的 Beta 或稳定的 API 版本。
执行此操作的最佳时间是 Beta API 处于弃用期，因为此时可以通过两个 API 版本同时访问那些对象。
一旦 Beta API 结束其弃用期并且不再提供服务，则必须使用替换的 API 版本。

{{< note >}}
<!--
Although Kubernetes also aims to maintain compatibility for _alpha_ APIs versions, in some
circumstances this is not possible. If you use any alpha API versions, check the release notes
for Kubernetes when upgrading your cluster, in case the API did change in incompatible
ways that require deleting all existing alpha objects prior to upgrade.
-->
尽管 Kubernetes 也努力为 **Alpha** API 版本维护兼容性，在有些场合兼容性是无法做到的。
如果你使用了任何 Alpha API 版本，需要在升级集群时查看 Kubernetes 发布说明，
如果 API 确实以不兼容的方式发生变更，则需要在升级之前删除所有现有的 Alpha 对象。
{{< /note >}}

<!--
Refer to [API versions reference](/docs/reference/using-api/#api-versioning)
for more details on the API version level definitions.
-->
关于 API 版本分级的定义细节，请参阅
[API 版本参考](/zh-cn/docs/reference/using-api/#api-versioning)页面。

<!--
## API Extension

The Kubernetes API can be extended in one of two ways:
-->
## API 扩展  {#api-extension}

有两种途径来扩展 Kubernetes API：

<!--
1. [Custom resources](/docs/concepts/extend-kubernetes/api-extension/custom-resources/)
   let you declaratively define how the API server should provide your chosen resource API.
1. You can also extend the Kubernetes API by implementing an
   [aggregation layer](/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/).
-->
1. 你可以使用[自定义资源](/zh-cn/docs/concepts/extend-kubernetes/api-extension/custom-resources/)来以声明式方式定义
   API 服务器如何提供你所选择的资源 API。
1. 你也可以选择实现自己的[聚合层](/zh-cn/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/)来扩展
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
- 了解如何通过添加你自己的
  [CustomResourceDefinition](/zh-cn/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/)
  来扩展 Kubernetes API。
- [控制 Kubernetes API 访问](/zh-cn/docs/concepts/security/controlling-access/)页面描述了集群如何针对
  API 访问管理身份认证和鉴权。
- 通过阅读 [API 参考](/zh-cn/docs/reference/kubernetes-api/)了解 API 端点、资源类型以及示例。
- 阅读 [API 变更（英文）](https://git.k8s.io/community/contributors/devel/sig-architecture/api_changes.md#readme)
  以了解什么是兼容性的变更以及如何变更 API。
