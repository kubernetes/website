---
title: Kubernetes API
content_type: concept
weight: 30
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
weight: 30
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

Most operations can be performed through the
[kubectl](/docs/reference/kubectl/) command-line interface or other
command-line tools, such as
[kubeadm](/docs/reference/setup-tools/kubeadm/), which in turn use the
API. However, you can also access the API directly using REST calls.
-->
Kubernetes {{< glossary_tooltip text="控制面" term_id="control-plane" >}}的核心是
{{< glossary_tooltip text="API 服务器" term_id="kube-apiserver" >}}。
API 服务器负责提供 HTTP API，以供用户、集群中的不同部分和集群外部组件相互通信。

Kubernetes API 使你可以查询和操纵 Kubernetes API
中对象（例如：Pod、Namespace、ConfigMap 和 Event）的状态。

大部分操作都可以通过 [kubectl](/zh-cn/docs/reference/kubectl/) 命令行接口或类似
[kubeadm](/zh-cn/docs/reference/setup-tools/kubeadm/) 这类命令行工具来执行，
这些工具在背后也是调用 API。不过，你也可以使用 REST 调用来访问这些 API。

<!--
Consider using one of the [client libraries](/docs/reference/using-api/client-libraries/)
if you are writing an application using the Kubernetes API.
-->
如果你正在编写程序来访问 Kubernetes API，
可以考虑使用[客户端库](/zh-cn/docs/reference/using-api/client-libraries/)之一。

<!-- body -->

<!--
## OpenAPI specification {#api-specification}

Complete API details are documented using [OpenAPI](https://www.openapis.org/).

### OpenAPI V2

The Kubernetes API server serves an aggregated OpenAPI v2 spec via the
`/openapi/v2` endpoint. You can request the response format using
request headers as follows:
-->
## OpenAPI 规范     {#api-specification}

完整的 API 细节是用 [OpenAPI](https://www.openapis.org/) 来表述的。

### OpenAPI V2

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

<!--
Kubernetes implements an alternative Protobuf based serialization format that
is primarily intended for intra-cluster communication. For more information
about this format, see the [Kubernetes Protobuf serialization](https://git.k8s.io/design-proposals-archive/api-machinery/protobuf.md) design proposal and the
Interface Definition Language (IDL) files for each schema located in the Go
packages that define the API objects.
-->
Kubernetes 为 API 实现了一种基于 Protobuf 的序列化格式，主要用于集群内部通信。
关于此格式的详细信息，可参考
[Kubernetes Protobuf 序列化](https://git.k8s.io/design-proposals-archive/api-machinery/protobuf.md)设计提案。
每种模式对应的接口描述语言（IDL）位于定义 API 对象的 Go 包中。

### OpenAPI V3

{{< feature-state state="beta"  for_k8s_version="v1.24" >}}

<!--
Kubernetes {{< param "version" >}} offers beta support for publishing its APIs as OpenAPI v3; this is a
beta feature that is enabled by default.
You can disable the beta feature by turning off the
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/) named `OpenAPIV3`
for the kube-apiserver component.
-->
Kubernetes {{< param "version" >}} 提供将其 API 以 OpenAPI v3 形式发布的 beta 支持；
这一功能特性处于 beta 状态，默认被开启。
你可以通过为 kube-apiserver 组件关闭 `OpenAPIV3`
[特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)来禁用此 beta 特性。

<!--
A discovery endpoint `/openapi/v3` is provided to see a list of all
group/versions available. This endpoint only returns JSON. These group/versions
are provided in the following format:
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
## Persistence

Kubernetes stores the serialized state of objects by writing them into
{{< glossary_tooltip term_id="etcd" >}}.
-->
## 持久化 {#persistence}

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
## API 组和版本控制 {#api-groups-and-versioning}

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

For example, suppose there are two API versions, `v1` and `v1beta1`, for the same
resource. If you originally created an object using the `v1beta1` version of its
API, you can later read, update, or delete that object
using either the `v1beta1` or the `v1` API version.
-->
为了更容易演进和扩展其 API，Kubernetes 实现了 [API 组](/zh-cn/docs/reference/using-api/#api-groups)，
这些 API 组可以被[启用或禁用](/zh-cn/docs/reference/using-api/#enabling-or-disabling)。

API 资源通过其 API 组、资源类型、名字空间（用于名字空间作用域的资源）和名称来区分。
API 服务器透明地处理 API 版本之间的转换：所有不同的版本实际上都是相同持久化数据的呈现。
API 服务器可以通过多个 API 版本提供相同的底层数据。

例如，假设针对相同的资源有两个 API 版本：`v1` 和 `v1beta1`。
如果你最初使用其 API 的 `v1beta1` 版本创建了一个对象，
你稍后可以使用 `v1beta1` 或 `v1` API 版本来读取、更新或删除该对象。

<!--
## API changes

Any system that is successful needs to grow and change as new use cases emerge or existing ones change.
Therefore, Kubernetes has designed the Kubernetes API to continuously change and grow.
The Kubernetes project aims to _not_ break compatibility with existing clients, and to maintain that
compatibility for a length of time so that other projects have an opportunity to adapt.
-->
## API 变更     {#api-changes}

任何成功的系统都要随着新的使用案例的出现和现有案例的变化来成长和变化。
为此，Kubernetes 已设计了 Kubernetes API 来持续变更和成长。
Kubernetes 项目的目标是 **不要** 给现有客户端带来兼容性问题，并在一定的时期内维持这种兼容性，
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
Kubernetes keeps compatibility even for _beta_ API versions wherever feasible:
if you adopt a beta API you can continue to interact with your cluster using that API,
even after the feature goes stable.
-->
Kubernetes 对维护达到正式发布（GA）阶段的官方 API 的兼容性有着很强的承诺，
通常这一 API 版本为 `v1`。此外，Kubernetes 在可能的时候还会保持 Beta API
版本的兼容性：如果你采用了 Beta API，你可以继续在集群上使用该 API，
即使该功能特性已进入稳定期也是如此。

{{< note >}}
<!--
Although Kubernetes also aims to maintain compatibility for _alpha_ APIs versions, in some
circumstances this is not possible. If you use any alpha API versions, check the release notes
for Kubernetes when upgrading your cluster, in case the API did change.
-->
尽管 Kubernetes 也努力为 **Alpha** API 版本维护兼容性，在有些场合兼容性是无法做到的。
如果你使用了任何 Alpha API 版本，需要在升级集群时查看 Kubernetes 发布说明，
以防 API 的确发生变更。
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

