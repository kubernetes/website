---
title: API 概述
weight: 10
no_list: true
card:
   name: reference
   weight: 50
---

<!-- overview -->

<!--
This section provides reference information for the Kubernetes API.
-->
本文提供了 Kubernetes API 的参考信息。

<!--
The REST API is the fundamental fabric of Kubernetes. All operations and
communications between components, and external user commands are REST API
calls that the API Server handles. Consequently, everything in the Kubernetes
platform is treated as an API object and has a corresponding entry in the
[API](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/).
-->
REST API 是 Kubernetes 的基本结构。
所有操作和组件之间的通信及外部用户命令都是调用 API 服务器处理的 REST API。
因此，Kubernetes 平台视一切皆为 API 对象，
且它们在 [API](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/) 中有相应的定义。

<!--
The [Kubernetes API reference](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/)
lists the API for Kubernetes version {{< param "version" >}}.
-->
[Kubernetes API 参考](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/)列
出了 Kubernetes {{< param "version" >}} 版本的 API。

<!--
For general background information, read
[The Kubernetes API](/docs/concepts/overview/kubernetes-api/).
[Controlling Access to the Kubernetes API](/docs/concepts/security/controlling-access/)
describes how clients can authenticate to the Kubernetes API server, and how their
requests are authorized.
-->
如需了解一般背景信息，请查阅 [Kubernetes API](/zh/docs/concepts/overview/kubernetes-api/)。
[Kubernetes API 控制访问](/zh/docs/concepts/security/controlling-access/)描述了客户端如何
向 Kubernetes API 服务器进行身份认证以及他们的请求如何被鉴权。


<!--
## API versioning
-->
## API 版本控制

<!--
The JSON and Protobuf serialization schemas follow the same guidelines for
schema changes. The following descriptions cover both formats.
-->
JSON 和 Protobuf 序列化模式遵循相同的模式更改原则。
以下描述涵盖了这两种格式。

<!--
The API versioning and software versioning are indirectly related.
The [API and release versioning proposal](https://git.k8s.io/community/contributors/design-proposals/release/versioning.md)
describes the relationship between API versioning and software versioning.
-->
API 版本控制和软件版本控制是间接相关的。
[API 和发布版本控制提案](https://git.k8s.io/community/contributors/design-proposals/release/versioning.md)
描述了 API 版本控制和软件版本控制间的关系。

<!--
Different API versions indicate different levels of stability and support. You
can find more information about the criteria for each level in the
[API Changes documentation](https://git.k8s.io/community/contributors/devel/sig-architecture/api_changes.md#alpha-beta-and-stable-versions).
-->
不同的 API 版本代表着不同的稳定性和支持级别。
你可以在 [API 变更文档](https://git.k8s.io/community/contributors/devel/sig-architecture/api_changes.md#alpha-beta-and-stable-versions)
中查看到更多的不同级别的判定标准。

<!--
Here's a summary of each level:
-->
下面是每个级别的摘要：

<!--
- Alpha:
  - The version names contain `alpha` (for example, `v1alpha1`).
  - The software may contain bugs. Enabling a feature may expose bugs. A
    feature may be disabled by default.
  - The support for a feature may be dropped at any time without notice.
  - The API may change in incompatible ways in a later software release without notice.
  - The software is recommended for use only in short-lived testing clusters,
    due to increased risk of bugs and lack of long-term support.
-->
- Alpha:
  - 版本名称包含 `alpha`（例如，`v1alpha1`）。
  - 软件可能会有 Bug。启用某个特性可能会暴露出 Bug。
    某些特性可能默认禁用。
  - 对某个特性的支持可能会随时被删除，恕不另行通知。
  - API 可能在以后的软件版本中以不兼容的方式更改，恕不另行通知。
  - 由于缺陷风险增加和缺乏长期支持，建议该软件仅用于短期测试集群。

<!--
- Beta:
  - The version names contain `beta` (for example, `v2beta3`).
  - The software is well tested. Enabling a feature is considered safe.
    Features are enabled by default.
  - The support for a feature will not be dropped, though the details may change.
-->
- Beta:
  - 版本名称包含 `beta` （例如， `v2beta3`）。
  - 软件被很好的测试过。启用某个特性被认为是安全的。
    特性默认开启。
  - 尽管一些特性会发生细节上的变化，但它们将会被长期支持。

<!--
  - The schema and/or semantics of objects may change in incompatible ways in
    a subsequent beta or stable release. When this happens, migration
    instructions are provided. Schema changes may require deleting, editing, and
    re-creating API objects. The editing process may not be straightforward.
    The migration may require downtime for applications that rely on the feature.
  - The software is not recommended for production uses. Subsequent releases
    may introduce incompatible changes. If you have multiple clusters which
    can be upgraded independently, you may be able to relax this restriction.
-->
  - 在随后的 Beta 版或稳定版中，对象的模式和（或）语义可能以不兼容的方式改变。
    当这种情况发生时，将提供迁移说明。
     模式更改可能需要删除、编辑和重建 API 对象。
    编辑过程可能并不简单。
    对于依赖此功能的应用程序，可能需要停机迁移。
  - 该版本的软件不建议生产使用。
    后续发布版本可能会有不兼容的变动。
    如果你有多个集群可以独立升级，可以放宽这一限制。

<!--
  Please try beta features and provide feedback. After the features exit beta, it
  may not be practical to make more changes.
-->
  {{< note >}}
  请试用测试版特性时并提供反馈。特性完成 Beta 阶段测试后，
  就可能不会有太多的变更了。
  {{< /note >}}

<!--
- Stable:
  - The version name is `vX` where `X` is an integer.
  - The stable versions of features appear in released software for many subsequent versions.
-->
- Stable:
  - 版本名称如 `vX`，其中 `X` 为整数。
  - 特性的稳定版本会出现在后续很多版本的发布软件中。

<!--## API groups-->
## API 组

<!--
[API groups](https://git.k8s.io/community/contributors/design-proposals/api-machinery/api-group.md)
make it easier to extend the Kubernetes API.
The API group is specified in a REST path and in the `apiVersion` field of a
serialized object.
-->
[API 组](https://git.k8s.io/community/contributors/design-proposals/api-machinery/api-group.md)
能够简化对 Kubernetes API 的扩展。
API 组信息出现在REST 路径中，也出现在序列化对象的 `apiVersion` 字段中。

<!--
There are several API groups in Kubernetes:

*  The *core* (also called *legacy*) group is found at REST path `/api/v1`.
   The core group is not specified as part of the `apiVersion` field, for
   example, `apiVersion: v1`.
*  The named groups are at REST path `/apis/$GROUP_NAME/$VERSION` and use
   `apiVersion: $GROUP_NAME/$VERSION` (for example, `apiVersion: batch/v1`).
   You can find the full list of supported API groups in
   [Kubernetes API reference](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#-strong-api-groups-strong-).
-->
以下是 Kubernetes 中的几个组：
*  *核心*（也叫 *legacy*）组的 REST 路径为 `/api/v1`。
   核心组并不作为 `apiVersion` 字段的一部分，例如， `apiVersion: v1`。
*  指定的组位于 REST 路径 `/apis/$GROUP_NAME/$VERSION`，
   并且使用 `apiVersion: $GROUP_NAME/$VERSION` （例如， `apiVersion: batch/v1`）。
   你可以在 [Kubernetes API 参考文档](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#-strong-api-groups-strong-)
   中查看全部的 API 组。

<!--
## Enabling or disabling API groups   {#enabling-or-disabling}

Certain resources and API groups are enabled by default. You can enable or
disable them by setting `--runtime-config` on the API server.  The
`--runtime-config` flag accepts comma separated `<key>[=<value>]` pairs
describing the runtime configuration of the API server. If the `=<value>`
part is omitted, it is treated as if `=true` is specified. For example:

 - to disable `batch/v1`, set `--runtime-config=batch/v1=false`
 - to enable `batch/v2alpha1`, set `--runtime-config=batch/v2alpha1`
-->
## 启用或禁用 API 组   {#enabling-or-disabling}
资源和 API 组是在默认情况下被启用的。
你可以通过在 API 服务器上设置 `--runtime-config` 参数来启用或禁用它们。
`--runtime-config` 参数接受逗号分隔的 `<key>[=<value>]` 对，
来描述 API 服务器的运行时配置。如果省略了 `=<value>` 部分，那么视其指定为 `=true`。
例如：
 - 禁用 `batch/v1`， 对应参数设置 `--runtime-config=batch/v1=false`
 - 启用 `batch/v2alpha1`， 对应参数设置 `--runtime-config=batch/v2alpha1`

<!--
When you enable or disable groups or resources, you need to restart the API
server and controller manager to pick up the `--runtime-config` changes.
-->
{{< note >}}
启用或禁用组或资源时，
你需要重启 API 服务器和控制器管理器来使 `--runtime-config` 生效。
{{< /note >}}

<!--
## Persistence
-->
## 持久化

<!--
Kubernetes stores its serialized state in terms of the API resources by writing them into
-->
Kubernetes 通过 API 资源来将序列化的状态写到 {{< glossary_tooltip term_id="etcd" >}} 中存储。

## {{% heading "whatsnext" %}}

<!--
- Learn more about [API conventions](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#api-conventions)
- Read the design documentation for
  [aggregator](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/api-machinery/aggregated-api-servers.md)
-->
- 进一步了解 [API 惯例](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#api-conventions)
- 阅读 [聚合器](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/api-machinery/aggregated-api-servers.md)
