---
title: Kubernetes API
content_type: concept
weight: 30
description: >
  Kubernetes API 使你可以查询和操纵 Kubernetes 中对象的状态。Kubernetes 控制平面的核心是 API 服务器和它暴露的 HTTP API。 用户、集群的不同部分以及外部组件都通过 API 服务器相互通信。
card:
  name: concepts
  weight: 30
---

<!-- overview -->

<!--
The core of Kubernetes' {{< glossary_tooltip text="control plane" term_id="control-plane" >}}
is the {{< glossary_tooltip text="API server" term_id="kube-apiserver" >}}. The API server
exposes an HTTP API that lets end users, different parts of your cluster, and external components
communicate with one another.

The Kubernetes API lets you query and manipulate the state of objects in the Kubernetes API
(for example: Pods, Namespaces, ConfigMaps, and Events).

API endpoints, resource types and samples are described in the [API Reference](/docs/reference/kubernetes-api/).
-->
Kubernetes {{< glossary_tooltip text="控制面" term_id="control-plane" >}}
的核心是 {{< glossary_tooltip text="API 服务器" term_id="kube-apiserver" >}}。
API 服务器负责提供 HTTP API，以供用户、集群中的不同部分和集群外部组件相互通信。

Kubernetes API 使你可以查询和操纵 Kubernetes API
中对象（例如：Pod、Namespace、ConfigMap 和 Event）的状态。

API 末端、资源类型以及示例都在[API 参考](/zh/docs/reference/kubernetes-api/)中描述。

<!-- body -->

<!--
## API changes

Any system that is successful needs to grow and change as new use cases emerge or existing ones change.
Therefore, Kubernetes has design features to allow the Kubernetes API to continuously change and grow.
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
[API 废弃策略](/docs/reference/using-api/deprecation-policy/)。

关于什么是兼容性的变更，如何变更 API 等详细信息，可参考
[API 变更](https://git.k8s.io/community/contributors/devel/sig-architecture/api_changes.md#readme)。

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
Kubernetes implements an alternative Protobuf based serialization format for the API that is primarily intended for intra-cluster communication, documented in the [design proposal](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/api-machinery/protobuf.md) and the IDL files for each schema are located in the Go packages that define the API objects.
-->
Kubernetes 为 API 实现了一种基于 Protobuf 的序列化格式，主要用于集群内部的通信。
相关文档位于[设计提案](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/api-machinery/protobuf.md)。
每种 Schema 对应的 IDL 位于定义 API 对象的 Go 包中。

<!--
## API versioning

To make it easier to eliminate fields or restructure resource representations, Kubernetes supports
multiple API versions, each at a different API path, such as `/api/v1` or
`/apis/rbac.authorization.k8s.io/v1alpha1`.
-->
## API 版本   {#api-versioning}

为了简化删除字段或者重构资源表示等工作，Kubernetes 支持多个 API 版本，
每一个版本都在不同 API 路径下，例如 `/api/v1` 或
`/apis/rbac.authorization.k8s.io/v1alpha1`。

<!--
Versioning is done at the API level rather than at the resource or field level to ensure that the
API presents a clear, consistent view of system resources and behavior, and to enable controlling
access to end-of-life and/or experimental APIs.

The JSON and Protobuf serialization schemas follow the same guidelines for schema changes - all descriptions below cover both formats.
-->
版本化是在 API 级别而不是在资源或字段级别进行的，目的是为了确保 API
为系统资源和行为提供清晰、一致的视图，并能够控制对已废止的和/或实验性 API 的访问。

JSON 和 Protobuf 序列化模式遵循 schema 更改的相同准则 - 下面的所有描述都同时适用于这两种格式。

<!--
Note that API versioning and Software versioning are only indirectly related.  The
[Kubernetes Release Versioning](https://git.k8s.io/community/contributors/design-proposals/release/versioning.md)
proposal describes the relationship between API versioning and software versioning.

Different API versions imply different levels of stability and support.  The criteria for each level are described
in more detail in the
[API Changes](https://git.k8s.io/community/contributors/devel/sig-architecture/api_changes.md#alpha-beta-and-stable-versions)
documentation.  They are summarized here:
-->
请注意，API 版本控制和软件版本控制只有间接相关性。
[Kubernetes 发行版本提案](https://git.k8s.io/community/contributors/design-proposals/release/versioning.md)
中描述了 API 版本与软件版本之间的关系。

不同的 API 版本名称意味着不同级别的软件稳定性和支持程度。
每个级别的判定标准在
[API 变更文档](https://git.k8s.io/community/contributors/devel/sig-architecture/api_changes.md#alpha-beta-and-stable-versions)
中有更详细的描述。
这些标准主要概括如下：

<!--
- Alpha level:
  - The version names contain `alpha` (e.g. `v1alpha1`).
  - May be buggy.  Enabling the feature may expose bugs.  Disabled by default.
  - Support for feature may be dropped at any time without notice.
  - The API may change in incompatible ways in a later software release without notice.
  - Recommended for use only in short-lived testing clusters, due to increased risk of bugs and lack of long-term support.
-->
- Alpha 级别：
  - 版本名称包含 `alpha`（例如：`v1alpha1`）
  - API 可能是有缺陷的。启用该功能可能会带来问题，默认情况是禁用的
  - 对相关功能的支持可能在没有通知的情况下随时终止
  - API 可能在将来的软件发布中出现不兼容性的变更，此类变更不会另行通知
  - 由于缺陷风险较高且缺乏长期支持，推荐仅在短暂的集群测试中使用

<!--
- Beta level:
  - The version names contain `beta` (e.g. `v2beta3`).
  - Code is well tested.  Enabling the feature is considered safe.  Enabled by default.
  - Support for the overall feature will not be dropped, though details may change.
  - The schema and/or semantics of objects may change in incompatible ways in a subsequent beta or stable release.  When this happens,
    we will provide instructions for migrating to the next version.  This may require deleting, editing, and re-creating
    API objects.  The editing process may require some thought.   This may require downtime for applications that rely on the feature.
  - Recommended for only non-business-critical uses because of potential for incompatible changes in subsequent releases.  If you have
    multiple clusters which can be upgraded independently, you may be able to relax this restriction.
  - **Please do try our beta features and give feedback on them!  Once they exit beta, it may not be practical for us to make more changes.**
-->
- Beta 级别：
  - 版本名称包含 `beta`（例如：`v2beta3`）
  - 代码已经充分测试过。启用该功能被认为是安全的，功能默认已启用。
  - 所支持的功能作为一个整体不会被删除，尽管细节可能会发生变更。
  - 对象的模式和/或语义可能会在后续的 beta 发行版或稳定版中以不兼容的方式进行更改。
    发生这种情况时，我们将提供如何迁移到新版本的说明。
    迁移操作可能需要删除、编辑和重新创建 API 对象。
    执行编辑操作时可能需要动些脑筋。
    迁移过程中可能需要停用依赖该功能的应用程序。
  - 建议仅用于非业务关键性用途，因为后续版本中可能存在不兼容的更改。
    如果你有多个可以独立升级的集群，则可以放宽此限制。
  - **请尝试我们的 beta 版本功能并且给出反馈！一旦它们结束 beta 阶段，进一步变更可能就不太现实了。**
<!--
- Stable level:
  - The version name is `vX` where `X` is an integer.
  - Stable versions of features will appear in released software for many subsequent versions.
-->
- 稳定级别：
  - 版本名称是 `vX`，其中 `X` 是整数。
  - 功能的稳定版本将出现在许多后续版本的发行软件中。

<!--
## API groups

To make it easier to extend the Kubernetes API, Kubernetes implemented [*API groups*](https://git.k8s.io/community/contributors/design-proposals/api-machinery/api-group.md).
The API group is specified in a REST path and in the `apiVersion` field of a serialized object.
-->
## API 组  {#api-groups}

为了更容易地扩展 Kubernetes API，Kubernetes 实现了
[*`API组`*](https://git.k8s.io/community/contributors/design-proposals/api-machinery/api-group.md)。
API 组在 REST 路径和序列化对象的 `apiVersion` 字段中指定。

<!--
There are several API groups in a cluster:

1. The *core* group, also referred to as the *legacy* group, is at the REST path `/api/v1` and uses `apiVersion: v1`.

1. *Named* groups are at REST path `/apis/$GROUP_NAME/$VERSION`, and use `apiVersion: $GROUP_NAME/$VERSION`
   (e.g. `apiVersion: batch/v1`). The Kubernetes [API reference](/docs/reference/kubernetes-api/) has a
   full list of available API groups.
-->
集群中存在若干 API 组：

1. *核心（Core）*组，通常被称为 *遗留（Legacy）* 组，位于 REST 路径 `/api/v1`，
   使用 `apiVersion: v1`。

1. *命名（Named）* 组 REST 路径 `/apis/$GROUP_NAME/$VERSION`，使用
   `apiVersion: $GROUP_NAME/$VERSION`（例如 `apiVersion: batch/v1`）。
   [Kubernetes API 参考](/zh/docs/reference/kubernetes-api/)中枚举了可用的 API 组的完整列表。

<!--
There are two paths to extending the API with [custom resources](/docs/concepts/extend-kubernetes/api-extension/custom-resources/):

1. [CustomResourceDefinition](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/)
   lets you declaratively define how the API server should provide your chosen resource API.
1. You can also [implement your own extension API server](/docs/tasks/extend-kubernetes/setup-extension-api-server/)
   and use the [aggregator](/docs/tasks/extend-kubernetes/configure-aggregation-layer/)
   to make it seamless for clients.
-->
有两种途径来扩展 Kubernetes API 以支持
[自定义资源](/docs/concepts/extend-kubernetes/api-extension/custom-resources/)：

1. 使用 [CustomResourceDefinition](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/)，
   你可以用声明式方式来定义 API 如何提供你所选择的资源 API。 

1. 你也可以选择[实现自己的扩展 API 服务器](/zh/docs/tasks/extend-kubernetes/setup-extension-api-server/)
   并使用[聚合器](/zh/docs/tasks/extend-kubernetes/configure-aggregation-layer/)
   为客户提供无缝的服务。

<!--
## Enabling or disabling API groups

Certain resources and API groups are enabled by default.  They can be enabled or disabled by setting `-runtime-config`
on apiserver. `-runtime-config` accepts comma separated values. For example: to disable batch/v1, set
`-runtime-config=batch/v1=false`, to enable batch/v2alpha1, set `-runtime-config=batch/v2alpha1`.
The flag accepts comma separated set of key=value pairs describing runtime configuration of the apiserver.

Enabling or disabling groups or resources requires restarting apiserver and controller-manager
to pick up the `-runtime-config` changes.
-->
## 启用或禁用 API 组  {#enabling-or-disabling-api-groups}

某些资源和 API 组默认情况下处于启用状态。可以通过为 `kube-apiserver` 
设置 `--runtime-config` 命令行选项来启用或禁用它们。
`--runtime-config` 接受逗号分隔的值。
例如：要禁用 `batch/v1`，设置 `--runtime-config=batch/v1=false`；
要启用 `batch/v2alpha1`，设置`--runtime-config=batch/v2alpha1`。
该标志接受逗号分隔的一组"key=value"键值对，用以描述 API 服务器的运行时配置。

{{< note >}}
启用或禁用组或资源需要重新启动 `kube-apiserver` 和 `kube-controller-manager`
来使得 `--runtime-config` 更改生效。
{{< /note >}}

<!--
## Persistence

Kubernetes stores its serialized state in terms of the API resources by writing them into
{{< glossary_tooltip term_id="etcd" >}}.
-->
## 持久性    {#persistence}

Kubernetes 也将其 API 资源的序列化状态保存起来，写入到 {{< glossary_tooltip term_id="etcd" >}}。

## {{% heading "whatsnext" %}}

<!--
[Controlling API Access](/docs/reference/access-authn-authz/controlling-access/) describes
how the cluster manages authentication and authorization for API access.

Overall API conventions are described in the
[API conventions](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#api-conventions)
document.

API endpoints, resource types and samples are described in the [API Reference](/docs/reference/kubernetes-api/).
-->
* [控制 API 访问](/zh/docs/reference/access-authn-authz/controlling-access/)
  描述了集群如何为 API 访问管理身份认证和权限判定；
* 总体的 API 约定描述位于 [API 约定](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md)中；
* API 末端、资源类型和示例等均在 [API 参考文档](/zh/docs/reference/kubernetes-api/)中描述


