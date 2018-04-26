---
title: Kubernetes API 概述
cn-approvers:
- tianshapjq
approvers:
- bgrant0607
- erictune
- lavalamp
- jbeda
---
<!--
---
title: Kubernetes API Overview
approvers:
- bgrant0607
- erictune
- lavalamp
- jbeda
---
-->

{% capture overview %}
<!--
This page contains an overview of the Kubernetes API. 
-->
本页面包含对 Kubernetes API 的概述。
{% endcapture %}

{% capture body %}
<!--
The REST API is the fundamental fabric of Kubernetes. All operations and communications between components are REST API calls handled by the API Server, including external user commands. Consequently, everything in the Kubernetes
platform is treated as an API object and has a corresponding entry in the
[API](/docs/api-reference/{{page.version}}/).
-->
REST API 是 Kubernetes 的基础结构。所有的操作和组件间的通信，包括外部的用户命令，都是由 API Server 处理的 REST API 调用。因此，Kubernetes 中的所有事物都被视为一个 API 对象并且都有一个与之对应的 [API](/docs/api-reference/{{page.version}}/) 入口。

<!--
Most operations can be performed through the
[kubectl](/docs/user-guide/kubectl-overview/) command-line interface or other
command-line tools, such as [kubeadm](/docs/admin/kubeadm/), which in turn use
the API. However, the API can also be accessed directly using REST calls.
-->
大部分的操作都可以通过 [kubectl](/docs/user-guide/kubectl-overview/) 命令行界面或者其它命令行工具完成，例如 [kubeadm](/docs/admin/kubeadm/)，它也是使用的 API。尽管如此，API 也是能够通过 REST 调用直接访问的。

<!--
Consider using one of the [client libraries](/docs/reference/client-libraries/)
if you are writing an application using the Kubernetes API.
-->
如果您正在使用 Kubernetes API 来编写应用程序，您可以考虑选择一个 [客户端库](/docs/reference/client-libraries/)。

<!--
## API versioning
-->
## API 版本控制

<!--
To make it easier to eliminate fields or restructure resource representations, Kubernetes supports
multiple API versions, each at a different API path, such as `/api/v1` or
`/apis/extensions/v1beta1`.
-->
为了更容易地消除字段或者重新组织资源结构，Kubernetes 支持多个 API 版本，每个版本都在不同的 API 路径下，例如 `/api/v1` 或者 `/apis/extensions/v1beta1`。

<!--
The version is set at the API level rather than at the resource or field level to ensure that the API presents a clear, consistent view of system resources and behavior, and to enable controlling access to end-of-life and/or experimental APIs. The JSON and Protobuf serialization schemas follow the same guidelines for schema changes; all descriptions below cover both formats.
-->
版本号在 API 级别设置而不是在资源或者字段级别，以确保 API 对系统资源和行为提供一个清晰一致的视图，并能够控制实验性 API 的生命周期。JSON 和 Protobuf 的序列化模式遵循同样的更改准则；以下的所有描述均适用于这两种格式。

<!--
Note that API versioning and software versioning are only indirectly related.  The [API and release
versioning proposal](https://git.k8s.io/community/contributors/design-proposals/versioning.md) describes the relationship between API versioning and software versioning.
-->
这里需要注意到 API 版本控制和软件版本控制只是间接相关的。[API 和发布版本建议](https://git.k8s.io/community/contributors/design-proposals/versioning.md) 描述了 API 版本控制和软件版本控制的关系。

<!--
Different API versions imply different levels of stability and support.  The criteria for each level are described
in more detail in the [API Changes documentation](https://git.k8s.io/community/contributors/devel/api_changes.md#alpha-beta-and-stable-versions).  
-->
不同的 API 版本表明不同的稳定性和支持级别。对于每个级别标准的更详细描述可见 [API 更改文档](https://git.k8s.io/community/contributors/devel/api_changes.md#alpha-beta-and-stable-versions)。

<!--
The criteria are summarized here:
-->
以下是对标准的总结：

<!--
- Alpha level:
  - The version names contain `alpha` (for example, `v1alpha1`).
  - The software may contain bugs. Enabling a feature may expose bugs.  A feature may be disabled by default.
  - The support for a feature may be dropped at any time without notice.
  - The API may change in incompatible ways in a later software release without notice.
  - The software is recommended for use only in short-lived testing clusters, due to increased risk of bugs and lack of long-term support.
- Beta level:
  - The version names contain `beta` (for example, `v2beta3`).
  - The software is well tested.  Enabling a feature is considered safe.  Features are enabled by default.
  - The support for a feature will not be dropped, though the details may change.
  - The schema and/or semantics of objects may change in incompatible ways in a subsequent beta or stable release.  When this happens, migration instructions will be provided.  This may require deleting, editing, and re-creating
    API objects. The editing process may require some thought. This may require downtime for applications that rely on the feature.
  - The software is recommended for only non-business-critical uses because of potential for incompatible changes in subsequent releases.  If you have multiple clusters which can be upgraded independently, you may be able to relax this restriction.
  - **Please try our beta features and give feedback on them!  Once they exit beta, it may not be practical for us to make more changes.**
- Stable level:
  - The version name is `vX` where `X` is an integer.
  - The stable versions of features will appear in released software for many subsequent versions.
-->
- Alpha 级别：
  - 版本名称中包含 `alpha` （例如，`v1alpha1`）。
  - 该软件可能包含错误。启动一个特性可能暴露错误。特性可能默认是关闭状态。
  - 在不事先通知的情况下，对一个特性的支持可能随时放弃。
  - 在不事先通知的情况下，该 API 可能在随后的软件发布中不再兼容。
  - 由于错误导致的风险和缺乏长期的支持，该软件建议只在短期的集群测试中使用。
- Beta 级别：
  - 版本名称包含 `beta` （例如，`v2beta3`）。
  - 该软件已经经过很好的测试。启用一个特性被认为是安全的。特性默认是启用状态。
  - 针对特性的支持不会被停止，但是具体的细节可能会改变。
  - 在后续的测试或者稳定版中，对象的模式和（或者）语义可能会变得不兼容。如果出现这种情况，那么会提供一个迁移的教程。或者可能需要删除、编辑或者重新创建 API 对象。编辑 API 对象可能需要谨慎思考。这可能需要停用依赖该特性的应用程序。
  - 该软件建议仅使用于非关键业务，因为后续版本中可能存在不兼容的更改。如果您有多个可以独立升级的集群，则可以放松此限制。
  - **请尝试我们的 beta 特性并给予我们反馈！一旦它们退出了 beta 版本，那么我们可能就无法做更多修改了。**
- 稳定级别：
  - 版本名称类似于 `vX`，其中的 `X` 是一个整数。
  - 特性的稳定版本将会出现在软件的许多后续发布版本中。

<!--
## API groups
-->
## API 组

<!--
[*API groups*](https://git.k8s.io/community/contributors/design-proposals/api-group.md) make it easier to extend the Kubernetes API. The API group is specified in a REST path and in the `apiVersion` field of a serialized object.
-->
[*API 组*](https://git.k8s.io/community/contributors/design-proposals/api-group.md) 使得 Kubernetes API 更容易扩展。API 的组别在 REST 路径或者序列化对象的 `apiVersion` 字段中指定。

<!--
Currently, there are several API groups in use:
-->
目前，有几个 API 组正在使用：

<!--
*  The *core* (also called *legacy*) group, which is at REST path `/api/v1` and is not specified as part of the `apiVersion` field, for example, `apiVersion: v1`.
*  The named groups are at REST path `/apis/$GROUP_NAME/$VERSION`, and use `apiVersion: $GROUP_NAME/$VERSION`
   (for example, `apiVersion: batch/v1`).  Full list of supported API groups can be seen in [Kubernetes API reference](/docs/reference/).
-->
*  *core* （也叫 *legacy*）组，该组的 REST 路径位于 `/api/v1`，但是并没有被指定为 `apiVersion` 字段的一部分，例如，`apiVersion: v1`。
*  已命名的组的 REST 路径位于 `/apis/$GROUP_NAME/$VERSION`，并且使用 `apiVersion: $GROUP_NAME/$VERSION`（例如，`apiVersion: batch/v1`）。已支持的 API 组详细列表请参阅 [Kubernetes API reference](/docs/reference/)。

<!--
There are two supported paths to extending the API with [custom resources](/docs/concepts/api-extension/custom-resources/):
-->
目前支持两种方法来扩展 [自定义资源](/docs/concepts/api-extension/custom-resources/) API：

<!--
1. [CustomResourceDefinition](/docs/tasks/access-kubernetes-api/extend-api-custom-resource-definitions/)
   is for users with very basic CRUD needs.
1. Coming soon: users needing the full set of Kubernetes API semantics can implement their own apiserver
   and use the [aggregator](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/aggregated-api-servers.md)
   to make it seamless for clients.
-->
1. [CustomResourceDefinition](/docs/tasks/access-kubernetes-api/extend-api-custom-resource-definitions/) 提供给需要最基本 CRUD 的用户。
1. 即将支持：需要 Kubernetes API 语义全集的用户可以通过使用 [aggregator](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/aggregated-api-servers.md) 来实现自己的 apiserver，这能够与您的客户端无缝对接。
 

<!--
## Enabling API groups
-->
## 启用 API 组

<!--
Certain resources and API groups are enabled by default.  You can enable or disable them by setting `--runtime-config`
on apiserver. `--runtime-config` accepts comma separated values. For example, to disable batch/v1, set
`--runtime-config=batch/v1=false`, to enable batch/v2alpha1, set `--runtime-config=batch/v2alpha1`.
The flag accepts comma separated set of key=value pairs describing runtime configuration of the apiserver.
-->
一些资源和 API 组默认是被启用的。您可以通过设置 apiserver 的 `--runtime-config` 参数来启用或者禁用它们。`--runtime-config` 参数值以逗号分隔。例如，如果想要禁用 batch/v1 那么设置 `--runtime-config=batch/v1=false`，如果想要启用 batch/v2alpha1 那么设置 `--runtime-config=batch/v2alpha1`。该参数接受以逗号分隔的 key=value 的键值对，键值对描述了 apiserver 运行时的配置。

<!--
IMPORTANT: Enabling or disabling groups or resources requires restarting apiserver and controller-manager
to pick up the `--runtime-config` changes.
-->
重要：启用或禁用组（或者资源）需要重启 apiserver 和 controller-manager，以便能够识别 `--runtime-config` 的变化。

<!--
## Enabling resources in the groups
-->
## 启用组内的资源

<!--
DaemonSets, Deployments, HorizontalPodAutoscalers, Ingress, Jobs and ReplicaSets are enabled by default.
You can enable other extensions resources by setting `--runtime-config` on
apiserver. `--runtime-config` accepts comma separated values. For example, to disable deployments and jobs, set
`--runtime-config=extensions/v1beta1/deployments=false,extensions/v1beta1/jobs=false`
-->
DaemonSets、Deployments、HorizontalPodAutoscalers、Ingress、Jobs 和 ReplicaSets 默认都是启用的。
您可以通过设置 apiserver 的 `--runtime-config` 参数来启用其它的可扩展资源。`--runtime-config` 接受以逗号分隔的键值对。例如，如果想要禁用 deployments 和 jobs，那么设置 `--runtime-config=extensions/v1beta1/deployments=false,extensions/v1beta1/jobs=false`。
{% endcapture %}

{% include templates/concept.md %}
