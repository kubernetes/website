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

<!-- overview -->

<!--
The core of Kubernetes' {{< glossary_tooltip text="control plane" term_id="control-plane" >}}
is the {{< glossary_tooltip text="API server" term_id="kube-apiserver" >}}. The API server
exposes an HTTP API that lets end users, different parts of your cluster, and
external components communicate with one another.

The Kubernetes API lets you query and manipulate the state of API objects in Kubernetes
(for example: Pods, Namespaces, ConfigMaps, and Events).

Most operations can be performed through the
[kubectl](/docs/reference/kubectl/overview/) command-line interface or other
command-line tools, such as
[kubeadm](/docs/reference/setup-tools/kubeadm/), which in turn use the
API. However, you can also access the API directly using REST calls.
-->
Kubernetes {{< glossary_tooltip text="控制面" term_id="control-plane" >}}
的核心是 {{< glossary_tooltip text="API 服务器" term_id="kube-apiserver" >}}。
API 服务器负责提供 HTTP API，以供用户、集群中的不同部分和集群外部组件相互通信。

Kubernetes API 使你可以查询和操纵 Kubernetes API
中对象（例如：Pod、Namespace、ConfigMap 和 Event）的状态。

大部分操作都可以通过 [kubectl](/zh/docs/reference/kubectl/overview/) 命令行工具或
类似 [kubeadm](/zh/docs/reference/setup-tools/kubeadm/) 这类命令行工具来执行，
这些工具在背后也是调用 API。不过，你也可以使用 REST 调用来访问这些 API。

<!--
Consider using one of the [client libraries](/docs/reference/using-api/client-libraries/)
if you are writing an application using the Kubernetes API.
-->
如果你正在编写程序来访问 Kubernetes API，可以考虑使用
[客户端库](/zh/docs/reference/using-api/client-libraries/)之一。

<!-- body -->

<!--
## OpenAPI specification {#api-specification}

Complete API details are documented using [OpenAPI](https://www.openapis.org/).

The Kubernetes API server serves an OpenAPI spec via the `/openapi/v2` endpoint.
You can request the response format using request headers as follows:
-->
## OpenAPI 规范     {#api-specification}

完整的 API 细节是用 [OpenAPI](https://www.openapis.org/) 来表述的。

Kubernetes API 服务器通过 `/openapi/v2` 末端提供 OpenAPI 规范。
你可以按照下表所给的请求头部，指定响应的格式：

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
  <caption>OpenAPI v2 查询请求的合法头部值</caption>
</table>

<!--
Kubernetes implements an alternative Protobuf based serialization format that
is primarily intended for intra-cluster communication. For more information
about this format, see the [Kubernetes Protobuf serialization](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/api-machinery/protobuf.md) design proposal and the
Interface Definition Language (IDL) files for each schema located in the Go
packages that define the API objects.
-->
Kubernetes 为 API 实现了一种基于 Protobuf 的序列化格式，主要用于集群内部通信。
关于此格式的详细信息，可参考
[Kubernetes Protobuf 序列化](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/api-machinery/protobuf.md)
设计提案。每种模式对应的接口描述语言（IDL）位于定义 API 对象的 Go 包中。

<!--
## API changes

Any system that is successful needs to grow and change as new use cases emerge or existing ones change.
Therefore, Kubernetes has designed its features to allow the Kubernetes API to continuously change and grow.
The Kubernetes project aims to _not_ break compatibility with existing clients, and to maintain that
compatibility for a length of time so that other projects have an opportunity to adapt.

In general, new API resources and new resource fields can be added often and frequently.
Elimination of resources or fields requires following the
[API deprecation policy](/docs/reference/using-api/deprecation-policy/).

What constitutes a compatible change, and how to change the API, are detailed in
[API changes](https://git.k8s.io/community/contributors/devel/sig-architecture/api_changes.md#readme).
-->
## API 变更     {#api-changes}

任何成功的系统都要随着新的使用案例的出现和现有案例的变化来成长和变化。
为此，Kubernetes 的功能特性设计考虑了让 Kubernetes API 能够持续变更和成长的因素。
Kubernetes 项目的目标是 _不要_ 引发现有客户端的兼容性问题，并在一定的时期内
维持这种兼容性，以便其他项目有机会作出适应性变更。

一般而言，新的 API 资源和新的资源字段可以被频繁地添加进来。
删除资源或者字段则要遵从
[API 废弃策略](/zh/docs/reference/using-api/deprecation-policy/)。

关于什么是兼容性的变更、如何变更 API 等详细信息，可参考
[API 变更](https://git.k8s.io/community/contributors/devel/sig-architecture/api_changes.md#readme)。

<!--
## API groups and versioning

To make it easier to eliminate fields or restructure resource representations,
Kubernetes supports multiple API versions, each at a different API path, such
as `/api/v1` or `/apis/rbac.authorization.k8s.io/v1alpha1`.
-->
## API 组和版本   {#api-groups-and-versioning}

为了简化删除字段或者重构资源表示等工作，Kubernetes 支持多个 API 版本，
每一个版本都在不同 API 路径下，例如 `/api/v1` 或
`/apis/rbac.authorization.k8s.io/v1alpha1`。

<!--
Versioning is done at the API level rather than at the resource or field level
to ensure that the API presents a clear, consistent view of system resources
and behavior, and to enable controlling access to end-of-life and/or
experimental APIs.
-->
版本化是在 API 级别而不是在资源或字段级别进行的，目的是为了确保 API
为系统资源和行为提供清晰、一致的视图，并能够控制对已废止的和/或实验性 API 的访问。

<!--
To make it easier to evolve and to extend its API, Kubernetes implements
[API groups](/docs/reference/using-api/#api-groups) that can be
[enabled or disabled](/docs/reference/using-api/#enabling-or-disabling).
-->
为了便于演化和扩展其 API，Kubernetes 实现了
可被[启用或禁用](/zh/docs/reference/using-api/#enabling-or-disabling)的
[API 组](/zh/docs/reference/using-api/#api-groups)。

<!--
API resources are distinguished by their API group, resource type, namespace
(for namespaced resources), and name. The API server may serve the same
underlying data through multiple API version and handle the conversion between
API versions transparently. All these different versions are actually
representations of the same resource. For example, suppose there are two
versions `v1` and `v1beta1` for the same resource. An object created by the
`v1beta1` version can then be read, updated, and deleted by either the
`v1beta1` or the `v1` versions.
-->
API 资源之间靠 API 组、资源类型、名字空间（对于名字空间作用域的资源而言）和
名字来相互区分。API 服务器可能通过多个 API 版本来向外提供相同的下层数据，
并透明地完成不同 API 版本之间的转换。所有这些不同的版本实际上都是同一资源
的（不同）表现形式。例如，假定同一资源有 `v1` 和 `v1beta1` 版本，
使用 `v1beta1` 创建的对象则可以使用 `v1beta1` 或者 `v1` 版本来读取、更改
或者删除。

<!--
Refer to [API versions reference](/docs/reference/using-api/#api-versioning)
for more details on the API version level definitions.
-->
关于 API 版本级别的详细定义，请参阅
[API 版本参考](/zh/docs/reference/using-api/#api-versioning)。

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
1. 你可以使用[自定义资源](/zh/docs/concepts/extend-kubernetes/api-extension/custom-resources/)
   来以声明式方式定义 API 服务器如何提供你所选择的资源 API。 
1. 你也可以选择实现自己的
   [聚合层](/zh/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/)
   来扩展 Kubernetes API。

## {{% heading "whatsnext" %}}

<!--
- Learn how to extend the Kubernetes API by adding your own
  [CustomResourceDefinition](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/).
- [Controlling Access To The Kubernetes API](/docs/concepts/security/controlling-access/) describes
  how the cluster manages authentication and authorization for API access.
- Learn about API endpoints, resource types and samples by reading
  [API Reference](/docs/reference/kubernetes-api/).
-->
- 了解如何通过添加你自己的
  [CustomResourceDefinition](/zh/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/)
  来扩展 Kubernetes API。
- [控制 Kubernetes API 访问](/zh/docs/concepts/security/controlling-access/)
  页面描述了集群如何针对 API 访问管理身份认证和鉴权。
- 通过阅读 [API 参考](/zh/docs/reference/kubernetes-api/)
  了解 API 端点、资源类型以及示例。

