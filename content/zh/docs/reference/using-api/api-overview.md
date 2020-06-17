---
title: Kubernetes API 总览
content_type: concept
weight: 10
card:
  name: reference
  weight: 50
  title: API 总览
---

<!--
---
title: Kubernetes API Overview
reviewers:
- erictune
- lavalamp
- jbeda
content_type: concept
weight: 10
card:
  name: reference
  weight: 50
  title: Overview of API
---
-->

<!-- overview -->

<!--
This page provides an overview of the Kubernetes API.
-->
此页提供 Kubernetes API 的总览



<!-- body -->

<!--
The REST API is the fundamental fabric of Kubernetes. All operations and communications between components, and external user commands are REST API calls that the API Server handles. Consequently, everything in the Kubernetes
platform is treated as an API object and has a corresponding entry in the
[API](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/).

Most operations can be performed through the
[kubectl](/docs/reference/kubectl/overview/) command-line interface or other
command-line tools, such as [kubeadm](/docs/reference/setup-tools/kubeadm/kubeadm/), which in turn use
the API. However, you can also access the API directly using REST calls.

Consider using one of the [client libraries](/docs/reference/using-api/client-libraries/)
if you are writing an application using the Kubernetes API.
-->

REST API 是 Kubernetes 的基础架构。组件之间的所有操作和通信，以及外部用户命令都是 API Server 处理的 REST API 调用。因此，Kubernetes 平台中的所有资源被视为 API 对象，并且在
[API](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/) 中都有对应的定义项。

大多数操作可以通过 [kubectl](/docs/reference/kubectl/overview/) 命令行界面或其他命令行工具执行，例如 [kubeadm](/docs/reference/setup-tools/kubeadm/kubeadm/)，它们本身也使用 API。但是，您也可以使用 REST 调用直接访问 API。

如果您正在使用 Kubernetes API 编写应用程序，请考虑使用 [客户端库](/docs/reference/using-api/client-libraries/)。

<!--
## API versioning

To eliminate fields or restructure resource representations, Kubernetes supports
multiple API versions, each at a different API path. For example: `/api/v1` or
`/apis/extensions/v1beta1`.

The version is set at the API level rather than at the resource or field level to:

- Ensure that the API presents a clear and consistent view of system resources and behavior.
- Enable control access to end-of-life and/or experimental APIs.

The JSON and Protobuf serialization schemas follow the same guidelines for schema changes. The following descriptions cover both formats.
-->
## API 版本控制

为了消除字段或重组资源表示形式，Kubernetes 支持多个 API 版本，每个版本在不同的 API 路径下。例如：`/api/v1` 或者 `/apis/extensions/v1beta1`。

版本是在 API 级别而非资源或字段级别配置的：

- 确保 API 呈现出清晰一致的系统资源和行为视图。
- 允许控制对已寿终正寝的 API 和/或实验性 API 的访问。

JSON 和 Protobuf 序列化模式在出现模式变更时均遵循这些准则。以下说明同时适用于这两种格式。

<!--
The API versioning and software versioning are indirectly related.  The [API and release
versioning proposal](https://git.k8s.io/community/contributors/design-proposals/release/versioning.md) describes the relationship between API versioning and software versioning.
-->

{{< note >}}
API 版本和软件版本是间接相关的。[API 和发布版本建议](https://git.k8s.io/community/contributors/design-proposals/release/versioning.md) 描述了 API 版本和软件版本之间的关系。
{{< /note >}}

<!--
Different API versions indicate different levels of stability and support. You can find more information about the criteria for each level in the [API Changes documentation](https://git.k8s.io/community/contributors/devel/sig-architecture/api_changes.md#alpha-beta-and-stable-versions).

Here's a summary of each level:

- Alpha:
  - The version names contain `alpha` (for example, `v1alpha1`).
  - The software may contain bugs. Enabling a feature may expose bugs. A feature may be disabled by default.
  - The support for a feature may be dropped at any time without notice.
  - The API may change in incompatible ways in a later software release without notice.
  - The software is recommended for use only in short-lived testing clusters, due to increased risk of bugs and lack of  long-term support.

- Beta:
  - The version names contain `beta` (for example, `v2beta3`).
  - The software is well tested. Enabling a feature is considered safe. Features are enabled by default.
  - The support for a feature will not be dropped, though the details may change.
  - The schema and/or semantics of objects may change in incompatible ways in a subsequent beta or stable release. When this happens, migration instructions are provided.  This may require deleting, editing, and re-creating
    API objects. The editing process may require some thought. This may require downtime for applications that rely on the feature.
  - The software is recommended for only non-business-critical uses because of potential for incompatible changes in subsequent releases. If you have multiple clusters which can be upgraded independently, you may be able to relax this restriction.
-->
不同的 API 版本表示不同级别的稳定性和支持级别。您可以在 [API 变更文档](https://git.k8s.io/community/contributors/devel/sig-architecture/api_changes.md#alpha-beta-and-stable) 中找到有关每个级别的条件的更多信息。

以下是每个级别的摘要：

- Alpha：
  - 版本名称包含 `alpha`（例如，`v1alpha1`）。
  - 该软件可能包含错误。启用功能可能会暴露错误。默认情况下，功能可能被禁用。
  - 对功能的支持随时可能被删除，但不另行通知。
  - 在以后的软件版本中，API 可能会以不兼容的方式更改，亦不另行通知。
  - 由于存在更高的错误风险和缺乏长期支持，建议仅在短期测试集群中使用该软件。

- Beta：
  - 版本名称包含`beta`（例如，`v2beta3`）。
  - 该软件已经过充分测试。启用功能被认为是安全的。默认情况下启用功能。
  - 尽管细节可能会发生变更，对应功能不会被废弃。
  - 在随后的 Beta 或稳定版本中，对象的模式和/或语义可能会以不兼容的方式更改。发生这种情况时，将提供迁移说明。迁移时可能需要删除、编辑和重新创建 API 对象。编辑过程可能需要一些思考。对于依赖该功能的应用程序，可能需要停机。
  - 该软件仅建议用于非关键业务用途，因为在后续版本中可能会发生不兼容的更改。如果您有多个可以独立升级的群集，则可以放宽此限制。

 {{< note >}}

<!--
Try the beta features and provide feedback. After the features exit beta, it may not be practical to make more changes.
-->

请试用 Beta 版功能并提供反馈。功能结束 Beta 版之后，再进行变更可能是不切实际的。

 {{< /note >}}

<!--
- Stable:
  - The version name is `vX` where `X` is an integer.
  - The stable versions of features appear in released software for many subsequent versions.
-->

- 稳定版：
  - 版本名称为 `vX`，其中`X`为整数。
  - 功能特性的稳定版本会持续出现在许多后续版本的发行软件中。

<!--
## API groups

[*API groups*](https://git.k8s.io/community/contributors/design-proposals/api-machinery/api-group.md) make it easier to extend the Kubernetes API. The API group is specified in a REST path and in the `apiVersion` field of a serialized object.

Currently, there are several API groups in use:

*  The *core* (also called *legacy*) group, which is at REST path `/api/v1` and is not specified as part of the `apiVersion` field, for example, `apiVersion: v1`.
*  The named groups are at REST path `/apis/$GROUP_NAME/$VERSION`, and use `apiVersion: $GROUP_NAME/$VERSION`
   (for example, `apiVersion: batch/v1`). You can find the full list of supported API groups in [Kubernetes API reference](/docs/reference/).

The two paths that support extending the API with [custom resources](/docs/concepts/api-extension/custom-resources/) are:

 - [CustomResourceDefinition](/docs/tasks/access-kubernetes-api/extend-api-custom-resource-definitions/)
   for basic CRUD needs.
 - [aggregator](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/api-machinery/aggregated-api-servers.md) for a full set of Kubernetes API semantics to implement their own apiserver.
-->

## API 组

[ *API 组*](https://git.k8s.io/community/contributors/design-proposals/api-machinery/api-group.md) 使扩展 Kubernetes API 更容易。API 组在 REST 路径和序列化对象的 apiVersion 字段中指定。

当前，有几个正在使用的 API 组：

* *core*（也称为 *legacy*）组，它位于 REST 路径`/api/v1`上，未指定为 apiVersion 字段的一部分，例如`apiVersion: v1`。
* 特定名称的组位于 REST 路径`/apis/$GROUP_NAME/$VERSION`下，并使用`apiVersion:$GROUP_NAME/$VERSION`（例如，`apiVersion:batch/v1`）。您可以在 [Kubernetes API 参考](/docs/reference/) 中找到受支持的 API Group 的完整列表。

有两种途径来使用 [自定义资源](/docs/concepts/api-extension/custom-resources/) 扩展 API，分别是：

 - [CustomResourceDefinition](/docs/tasks/access-kubernetes-api/extend-api-custom-resource-definitions/) 提供基本的 CRUD 需求。
 - [聚合器（Aggregator）](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/api-machinery/aggregated-api-servers.md)具有完整的 Kubernetes API 语义，用以实现用户自己的 apiserver。

<!--
## Enabling or disabling API groups

Certain resources and API groups are enabled by default. You can enable or disable them by setting `--runtime-config`
on the apiserver. `--runtime-config` accepts comma separated values. For example:
 - to disable batch/v1, set `--runtime-config=batch/v1=false`
 - to enable batch/v2alpha1, set `--runtime-config=batch/v2alpha1`
The flag accepts comma separated set of key=value pairs describing runtime configuration of the apiserver.
-->
## 启用 API 组

默认情况下，某些资源和 API 组处于启用状态。您可以通过设置`--runtime-config`来启用或禁用它们。
`--runtime-config` 接受逗号分隔的值。例如：
 - 要禁用 `batch/v1`，请配置`--runtime-config=batch/v1=false`
 - 要启用 `batch/2alpha1`，请配置`--runtime-config=batch/v2alpha1`
该标志接受描述 apiserver 的运行时配置的以逗号分隔的`key=value` 对集合。

{{< note >}}

<!--
When you enable or disable groups or resources, you need to restart the apiserver and controller-manager
to pick up the `--runtime-config` changes.
-->
启用或禁用组或资源时，需要重新启动 apiserver 和控制器管理器以刷新 `--runtime-config` 的更改。

{{< /note >}}

<!--
## Enabling specific resources in the extensions/v1beta1 group

DaemonSets, Deployments, StatefulSet, NetworkPolicies, PodSecurityPolicies and ReplicaSets in the `extensions/v1beta1` API group are disabled by default.
For example: to enable deployments and daemonsets, set
`--runtime-config=extensions/v1beta1/deployments=true,extensions/v1beta1/daemonsets=true`.
-->

## 启用 extensions/v1beta1 组中具体资源

在 `extensions/v1beta1` API 组中，DaemonSets，Deployments，StatefulSet, NetworkPolicies, PodSecurityPolicies 和 ReplicaSets 是默认禁用的。
例如：要启用 deployments 和 daemonsets，请设置 `--runtime-config=extensions/v1beta1/deployments=true,extensions/v1beta1/daemonsets=true`。

{{< note >}}

<!--
Individual resource enablement/disablement is only supported in the `extensions/v1beta1` API group for legacy reasons.
-->
出于遗留原因，仅在 `extensions / v1beta1` API 组中支持各个资源的启用/禁用。

{{< /note >}}


