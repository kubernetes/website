---
approvers:
- chenopis
cn-approvers:
- brucehex
cn-reviewers:
- zjj2wry
- xiaosuiba
title: Kubernetes API
---
<!--
---
approvers:
- chenopis
title: The Kubernetes API
---
-->

<!--
Overall API conventions are described in the [API conventions doc](https://git.k8s.io/community/contributors/devel/api-conventions.md).
-->
总体 API 规范在 [API 规范文档](https://git.k8s.io/community/contributors/devel/api-conventions.md)中描述。

<!--
API endpoints, resource types and samples are described in [API Reference](/docs/reference).
-->

API 端点，资源类型和样例在[API 参考](/docs/reference)中描述。

<!--
Remote access to the API is discussed in the [access doc](/docs/admin/accessing-the-api).
-->

对 API 的远程调用的讨论可参考[访问文档](/docs/admin/accessing-the-api)。

<!--
The Kubernetes API also serves as the foundation for the declarative configuration schema for the system. The [Kubectl](/docs/user-guide/kubectl) command-line tool can be used to create, update, delete, and get API objects.
-->
Kubernetes API 也是系统的声明式配置模式的基础。可以使用[Kubectl](/docs/user-guide/kubectl)命令行工具来创建、更新、删除和获取 API 对象。

<!--
Kubernetes also stores its serialized state (currently in [etcd](https://coreos.com/docs/distributed-configuration/getting-started-with-etcd/)) in terms of the API resources.
-->

Kubernetes 还存储了和 API 资源相关的序列化状态(目前存储在 [etcd](https://coreos.com/docs/distributed-configuration/getting-started-with-etcd/))。

<!--
Kubernetes itself is decomposed into multiple components, which interact through its API.
-->
Kubernetes 本身被分解成多个组件，通过其 API 进行交互。
<!--
## API changes
-->
## API 变更

<!--
In our experience, any system that is successful needs to grow and change as new use cases emerge or existing ones change. Therefore, we expect the Kubernetes API to continuously change and grow. However, we intend to not break compatibility with existing clients, for an extended period of time. In general, new API resources and new resource fields can be expected to be added frequently. Elimination of resources or fields will require following a deprecation process. The precise deprecation policy for eliminating features is TBD, but once we reach our 1.0 milestone, there will be a specific policy.
-->
根据我们的经验，任何成功的系统需要随着新用例的出现或现有的变化而发展和变化。因此，我们预计 Kubernetes API 将不断变化和发展。但是，我们打算在很长一段时间内不会破坏与现有客户的兼容性。一般来说，新的 API 资源和新的资源领域通常可以被频繁添加。消除资源或领域将需要遵循弃用过程，消除功能的精确弃用政策是 TBD, 但一旦达到我们的 1.0 里程碑，就会有一个具体的政策。
<!--
What constitutes a compatible change and how to change the API are detailed by the [API change document](https://git.k8s.io/community/contributors/devel/api_changes.md).
-->
根据什么构成兼容的更改和如何更改 API 由[API 更改文档](https://git.k8s.io/community/contributors/devel/api_changes.md)进行详细说明。
<!--
## OpenAPI and Swagger definitions
-->
## OpenAPI 和 Swagger 定义

<!--
Complete API details are documented using [Swagger v1.2](http://swagger.io/) and [OpenAPI](https://www.openapis.org/). The Kubernetes apiserver (aka "master") exposes an API that can be used to retrieve the Swagger v1.2 Kubernetes API spec located at `/swaggerapi`. You can also enable a UI to browse the API documentation at `/swagger-ui` by passing the `--enable-swagger-ui=true` flag to apiserver.
-->
使用 [Swagger v1.2](http://swagger.io/) 和 [OpenAPI](https://www.openapis.org/) 记录完整的 API 详细信息。Kubernetes apiserver(又名 "Master")公开了一个 API，可用于检索位于 `/swaggerapi` 的 Swagger v1.2 Kubernetes API 规范。您还可以通过传递 `--enable-swagger-ui=true` 标志给 apiserver 以启用 UI 浏览 `/swagger-ui` 上的 API 文档。

<!--
Starting with Kubernetes 1.4, OpenAPI spec is also available at [`/swagger.json`](https://git.k8s.io/kubernetes/api/openapi-spec/swagger.json). While we are transitioning from Swagger v1.2 to OpenAPI (aka Swagger v2.0), some of the tools such as kubectl and swagger-ui are still using v1.2 spec. OpenAPI spec is in Beta as of Kubernetes 1.5.
-->

从 Kubernetes 1.4 开始， OpenAPI 规范也可以在[`/swagger.json`](https://git.k8s.io/kubernetes/api/openapi-spec/swagger.json)中找到。当我们从 Swagger v1.2 转换到 OpenAPI（又名 Swagger v2.0）时，一些诸如 kubectl 和 swagger-ui 的工具仍在使用 v1.2 规范。OpenAPI 规范从 Kubernetes 1.5 的 Beta 版开始启用。

<!--
Kubernetes implements an alternative Protobuf based serialization format for the API that is primarily intended for intra-cluster communication, documented in the [design proposal](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/protobuf.md) and the IDL files for each schema are located in the Go packages that define the API objects.
-->
Kubernetes 为主要用于集群内通信的 API 实现了另一种基于 Protobuf 的序列化格式，在[设计方案(design proposal)](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/protobuf.md)中记录，每个模式的 IDL 文件位于定义 API 对象的 Go 包中。
<!--
## API versioning
-->
## API 版本

<!--
To make it easier to eliminate fields or restructure resource representations, Kubernetes supports
multiple API versions, each at a different API path, such as `/api/v1` or
`/apis/extensions/v1beta1`.
-->
为了更容易地消除字段或重组资源表示，Kubernetes 支持多个 API 版本，每个都有不同的 API 路径，例如 `/api/v1` 或 `/apis/extensions/v1beta1`。


<!--
We chose to version at the API level rather than at the resource or field level to ensure that the API presents a clear, consistent view of system resources and behavior, and to enable controlling access to end-of-lifed and/or experimental APIs. The JSON and Protobuf serialization schemas follow the same guidelines for schema changes - all descriptions below cover both formats.
-->
我们在选择在 API 级别而不是在资源或字段级别进行版本定位，以确保 API 提供清晰、一致的系统资源和行为视图，并且能够控制对即将停用的和实验性 API 的访问。JSON 和 Protobuf 序列化模式遵循相同的模式更改准则 - 以下所有描述都涵盖了这两种格式。

<!--
Note that API versioning and Software versioning are only indirectly related.  The [API and release
versioning proposal](https://git.k8s.io/community/contributors/design-proposals/versioning.md) describes the relationship between API versioning and
software versioning.
-->
请注意，API 版本控制和软件版本控制仅间接相关。[API 和 发布版本提案(release versioning proposal)](https://git.k8s.io/community/contributors/design-proposals/versioning.md)
描述了 API 版本控制和软件版本控制。
<!--
Different API versions imply different levels of stability and support.  The criteria for each level are described
in more detail in the [API Changes documentation](https://git.k8s.io/community/contributors/devel/api_changes.md#alpha-beta-and-stable-versions).  They are summarized here:
-->
不同的 API 版本意味着不同程度的稳定性和支持。描述每个级别的标准在[API 变更文档](https://git.k8s.io/community/contributors/devel/api_changes.md#alpha-beta-and-stable-versions)中有更详细的说明。总结如下：

<!--
- Alpha level:
  - The version names contain `alpha` (e.g. `v1alpha1`).
  - May be buggy.  Enabling the feature may expose bugs.  Disabled by default.
  - Support for feature may be dropped at any time without notice.
  - The API may change in incompatible ways in a later software release without notice.
  - Recommended for use only in short-lived testing clusters, due to increased risk of bugs and lack of long-term support.
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
- Stable level:
  - The version name is `vX` where `X` is an integer.
  - Stable versions of features will appear in released software for many subsequent versions.
-->
- Alpha 级别:
  - 版本名称包含 `alpha` (例如 `v1alpha1`).
  - 实验性支持(May be buggy)  启用该功能可能会出现错误，默认禁用。
  - 功能的支持可能随时丢弃，恕不另行通知。
  - API 可能在以后的软件版本中以不兼容的方式更改，恕不另行通知。
  - 建议仅在短期测试集群中使用，因为漏洞的风险增加和缺乏长期的支持。
- 测试等级:
  - 版本名称包含 `beta` (例如 `v2beta3`).
  - 代码测试良好，启用该功能被认为是安全的，默认启用。
  - 整体功能的支持不会被删除，尽管细节可能会改变。
  - 对象的模式或语义可能会在后续 beta 版本或稳定版本中以不兼容的方式发生变化。发生这种情况时，我们将提供迁移到下一个版本的说明。这可能需要删除、编辑或重新创建 API 对象。编辑过程可能需要一些思考，这可能需要依赖该功能的应用程序一些停机时间。
  - 建议仅用于非关键业务用途，因为后续版本中可能会出现不兼容的更改。如果您有可以独立升级的多个集群，您可以放宽此限制。
  - **请尝试我们的测试版功能并给予反馈！一旦退出 beta 版本，我们可能不会做更多的更改。**
- 稳定等级:
  - 版本名称为 `vX` 其中 `X` 为整数。
  - 功能的稳定版本将出在许多后续版本的发行软件中。
<!--
## API groups
-->
## API 组
<!--
To make it easier to extend the Kubernetes API, we implemented [*API groups*](https://git.k8s.io/community/contributors/design-proposals/api-group.md).
The API group is specified in a REST path and in the `apiVersion` field of a serialized object.
-->
为了更容易地扩展 Kubernetes API，我们实现了 [*API 组*](https://git.k8s.io/community/contributors/design-proposals/api-group.md)。API 组在 REST 路径和序列化对象的 `apiVersion` 字段中指定。

<!--
Currently there are several API groups in use:

1. The "core" (oftentimes called "legacy", due to not having explicit group name) group, which is at
   REST path `/api/v1` and is not specified as part of the `apiVersion` field, e.g. `apiVersion: v1`.
1. The named groups are at REST path `/apis/$GROUP_NAME/$VERSION`, and use `apiVersion: $GROUP_NAME/$VERSION`
   (e.g. `apiVersion: batch/v1`).  Full list of supported API groups can be seen in [Kubernetes API reference](/docs/reference/).
-->
目前有几个 API 组正在使用中：

1. "核心" (通常称为"遗产", 由于没有明确的组名称) 组， 位于 REST 的路径 `/api/v1` 并没有被指定为 `apiVersion` 字段中的一部分。例如 `apiVersion: v1`。
1. 命名组在 REST 路径 `/apis/$GROUP_NAME/$VERSION`,并使用`apiVersion:$GROUP_NAME/$VERSION`(例如 `apiVersion: batch/v1`)。支持的 API 组的完整列表可以在 [Kubernetes API 参考](/docs/reference/)中看到。

<!--
There are two supported paths to extending the API with [custom resources](/docs/concepts/api-extension/custom-resources/):

1. [CustomResourceDefinition](/docs/tasks/access-kubernetes-api/extend-api-custom-resource-definitions/)
   is for users with very basic CRUD needs.
1. Coming soon: users needing the full set of Kubernetes API semantics can implement their own apiserver
   and use the [aggregator](https://git.k8s.io/community/contributors/design-proposals/aggregated-api-servers.md)
   to make it seamless for clients.
-->
使用[自定义资源](/docs/concepts/api-extension/custom-resources/)扩展 API 有两个支持的路径：

1. [CustomResourceDefinition](/docs/tasks/access-kubernetes-api/extend-api-custom-resource-definitions/) 适用于具有非常基本 CRUD 需求的用户。
1. 即将推出: 需要完整 Kubernetes API 语义的用户可以实现自己的 apiserver 并使用 [aggregator](https://git.k8s.io/community/contributors/design-proposals/aggregated-api-servers.md)以使客户端进行无缝连接。
<!--
## Enabling API groups
-->
<!--
Certain resources and API groups are enabled by default.  They can be enabled or disabled by setting `--runtime-config`
on apiserver. `--runtime-config` accepts comma separated values. For ex: to disable batch/v1, set
`--runtime-config=batch/v1=false`, to enable batch/v2alpha1, set `--runtime-config=batch/v2alpha1`.
The flag accepts comma separated set of key=value pairs describing runtime configuration of the apiserver.
-->

## 启用 API 组

某些资源或 API 组已默认启用。可以在 apiserver 上通过设置  `--runtime-config` 来启用或禁用它们。 `--runtime-config` 接受逗号分隔的值。例如: 要禁用 batch/v1, 请设置 `--runtime-config=batch/v1=false`, 要启用 `batch/v2alpha1`, 请设置 `--runtime-config=batch/v2alpha1`。
该标志接受一组描述 `apiserver` 运行时配置的键值对（`key=value`），以逗号分隔。

<!--
IMPORTANT: Enabling or disabling groups or resources requires restarting apiserver and controller-manager
to pick up the `--runtime-config` changes.
-->
重要信息: 启用或禁用组或资源需要重新启动 apiserver 和 controller-manager 以获取 `--runtime-config` 的变更。
<!--
## Enabling resources in the groups
-->
## 启用组中的资源
<!--
DaemonSets, Deployments, HorizontalPodAutoscalers, Ingress, Jobs and ReplicaSets are enabled by default.
Other extensions resources can be enabled by setting `--runtime-config` on
apiserver. `--runtime-config` accepts comma separated values. For ex: to disable deployments and ingress, set
`--runtime-config=extensions/v1beta1/deployments=false,extensions/v1beta1/ingress=false`
-->

默认情况下，DaemonSets、Deployments、Horizo​​ntalPodAutoscalers、Ingress、Job 和 ReplicaSets 都被启用。
可以通过在 API 服务器上设置 `--runtime-config` 来启用其他扩展资源。 `--runtime-config`接受逗号分隔的值。 例如: 禁用部署和入口，设置`--runtime-config=extensions/v1beta1/deployments=false,extensions/v1beta1/ingress=false`。
