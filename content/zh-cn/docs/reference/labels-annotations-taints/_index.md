---
title: 众所周知的标签、注解和污点
content_type: concept
weight: 40
no_list: true
card:
  name: reference
  weight: 30
  anchors:
  - anchor: "#labels-annotations-and-taints-used-on-api-objects"
    title: 标签、注解和污点
---
<!--
title: Well-Known Labels, Annotations and Taints
content_type: concept
weight: 40
no_list: true
card:
  name: reference
  weight: 30
  anchors:
  - anchor: "#labels-annotations-and-taints-used-on-api-objects"
    title: Labels, annotations and taints
-->

<!-- overview -->
<!--
Kubernetes reserves all labels and annotations in the `kubernetes.io` and `k8s.io` namespaces.

This document serves both as a reference to the values and as a coordination point for assigning values.
-->
Kubernetes 将所有标签和注解保留在 `kubernetes.io` 和 `k8s.io` 名字空间中。

本文档既可作为值的参考，也可作为分配值的协调点。

<!-- body -->

<!--
## Labels, annotations and taints used on API objects
-->
## API 对象上使用的标签、注解和污点   {#labels-annotations-and-taints-used-on-api-objects}

### apf.kubernetes.io/autoupdate-spec

<!--
Type: Annotation

Example: `apf.kubernetes.io/autoupdate-spec: "true"`

Used on: [`FlowSchema` and `PriorityLevelConfiguration` Objects](/docs/concepts/cluster-administration/flow-control/#defaults)

If this annotation is set to true on a FlowSchema or PriorityLevelConfiguration, the `spec` for that object
is managed by the kube-apiserver. If the API server does not recognize an APF object, and you annotate it
for automatic update, the API server deletes the entire object. Otherwise, the API server does not manage the
object spec.
For more details, read  [Maintenance of the Mandatory and Suggested Configuration Objects](/docs/concepts/cluster-administration/flow-control/#maintenance-of-the-mandatory-and-suggested-configuration-objects).
-->
类别：注解

例子：`apf.kubernetes.io/autoupdate-spec: "true"`

用于：[`FlowSchema` 和 `PriorityLevelConfiguration` 对象](/zh-cn/docs/concepts/cluster-administration/flow-control/#defaults)

如果在 FlowSchema 或 PriorityLevelConfiguration 上将此注解设置为 true，
那么该对象的 `spec` 将由 kube-apiserver 进行管理。如果 API 服务器不识别 APF 对象，
并且你对其添加了自动更新的注解，则 API 服务器将删除整个对象。否则，API 服务器不管理对象规约。
更多细节参阅[维护强制性和建议的配置对象](/zh-cn/docs/concepts/cluster-administration/flow-control/#maintenance-of-the-mandatory-and-suggested-configuration-objects)

<!--
### app.kubernetes.io/component

Type: Label

Example: `app.kubernetes.io/component: "database"`

Used on: All Objects (typically used on [workload resources](/docs/reference/kubernetes-api/workload-resources/)).

The component within the application architecture.

One of the [recommended labels](/docs/concepts/overview/working-with-objects/common-labels/#labels).
-->
### app.kubernetes.io/component {#app-kubernetes-io-component}

类别：标签

例子：`app.kubernetes.io/component: "database"`

用于：所有对象（通常用于[工作负载资源](/zh-cn/docs/reference/kubernetes-api/workload-resources/)）。

应用架构中的组件。

[推荐标签](/zh-cn/docs/concepts/overview/working-with-objects/common-labels/#labels)之一。

<!--
### app.kubernetes.io/created-by (deprecated)

Type: Label

Example: `app.kubernetes.io/created-by: "controller-manager"`

Used on: All Objects (typically used on[workload resources](/docs/reference/kubernetes-api/workload-resources/)).

The controller/user who created this resource.
-->
### app.kubernetes.io/created-by（已弃用）  {#app-kubernetes-io-created-by}

类别：标签

示例：`app.kubernetes.io/created-by: "controller-manager"`

用于：所有对象（通常用于[工作负载资源](/zh-cn/docs/reference/kubernetes-api/workload-resources/)）。

创建此资源的控制器/用户。

{{< note >}}
<!--
Starting from v1.9, this label is deprecated.
-->
从 v1.9 开始，这个标签被弃用。
{{< /note >}}

<!--
### app.kubernetes.io/instance

Type: Label

Example: `app.kubernetes.io/instance: "mysql-abcxyz"`

Used on: All Objects (typically used on
[workload resources](/docs/reference/kubernetes-api/workload-resources/)).

A unique name identifying the instance of an application.
To assign a non-unique name, use [app.kubernetes.io/name](#app-kubernetes-io-name).

One of the [recommended labels](/docs/concepts/overview/working-with-objects/common-labels/#labels).
-->
### app.kubernetes.io/instance {#app-kubernetes-io-instance}

类别：标签

示例：`app.kubernetes.io/instance: "mysql-abcxyz"`

用于：所有对象（通常用于[工作负载资源](/zh-cn/docs/reference/kubernetes-api/workload-resources/)）。

标识应用实例的唯一名称。要分配一个不唯一的名称，可使用 [app.kubernetes.io/name](#app-kubernetes-io-name)。

[推荐标签](/zh-cn/docs/concepts/overview/working-with-objects/common-labels/#labels)之一。

<!--
### app.kubernetes.io/managed-by

Type: Label

Example: `app.kubernetes.io/managed-by: "helm"`

Used on: All Objects (typically used on
[workload resources](/docs/reference/kubernetes-api/workload-resources/)).

The tool being used to manage the operation of an application.

One of the [recommended labels](/docs/concepts/overview/working-with-objects/common-labels/#labels).
-->
### app.kubernetes.io/managed-by {#app-kubernetes-io-manged-by}

类别：标签

示例：`app.kubernetes.io/managed-by: "helm"`

用于：所有对象（通常用于[工作负载资源](/zh-cn/docs/reference/kubernetes-api/workload-resources/)）。

用于管理应用操作的工具。

[推荐标签](/zh-cn/docs/concepts/overview/working-with-objects/common-labels/#labels)之一。

<!--
### app.kubernetes.io/name

Type: Label

Example: `app.kubernetes.io/name: "mysql"`

Used on: All Objects (typically used on
[workload resources](/docs/reference/kubernetes-api/workload-resources/)).

The name of the application.

One of the [recommended labels](/docs/concepts/overview/working-with-objects/common-labels/#labels).
-->
### app.kubernetes.io/name {#app-kubernetes-io-name}

类别：标签

示例：`app.kubernetes.io/name: "mysql"`

用于：所有对象（通常用于[工作负载资源](/zh-cn/docs/reference/kubernetes-api/workload-resources/)）。

应用的名称。

[推荐标签](/zh-cn/docs/concepts/overview/working-with-objects/common-labels/#labels)之一。

<!--
### app.kubernetes.io/part-of

Type: Label

Example: `app.kubernetes.io/part-of: "wordpress"`

Used on: All Objects (typically used on
[workload resources](/docs/reference/kubernetes-api/workload-resources/)).

The name of a higher-level application this object is part of.

One of the [recommended labels](/docs/concepts/overview/working-with-objects/common-labels/#labels).
-->
### app.kubernetes.io/part-of {#app-kubernetes-io-part-of}

类别：标签

示例：`app.kubernetes.io/part-of: "wordpress"`

用于：所有对象（通常用于[工作负载资源](/zh-cn/docs/reference/kubernetes-api/workload-resources/)）。

此应用所属的更高级别应用的名称。

[推荐标签](/zh-cn/docs/concepts/overview/working-with-objects/common-labels/#labels)之一。

<!--
### app.kubernetes.io/version

Type: Label

Example: `app.kubernetes.io/version: "5.7.21"`

Used on: All Objects (typically used on
[workload resources](/docs/reference/kubernetes-api/workload-resources/)).

The current version of the application.

Common forms of values include:

- [semantic version](https://semver.org/spec/v1.0.0.html)
- the Git [revision hash](https://git-scm.com/book/en/v2/Git-Tools-Revision-Selection#_single_revisions)
  for the source code.

One of the [recommended labels](/docs/concepts/overview/working-with-objects/common-labels/#labels).
-->
### app.kubernetes.io/version {#app-kubernetes-io-version}

类别：标签

示例：`app.kubernetes.io/version: "5.7.21"`

用于：所有对象（通常用于[工作负载资源](/zh-cn/docs/reference/kubernetes-api/workload-resources/)）。

值的常见形式包括：

- [语义版本](https://semver.org/spec/v1.0.0.html)
- 针对源代码的 Git [修订哈希](https://git-scm.com/book/en/v2/Git-Tools-Revision-Selection#_single_revisions)。

[推荐标签](/zh-cn/docs/concepts/overview/working-with-objects/common-labels/#labels)之一。

<!--
### applyset.kubernetes.io/contains-group-kinds (alpha) {#applyset-kubernetes-io-contains-group-kinds}

Type: Annotation

Example: `applyset.kubernetes.io/contains-group-kinds: "certificates.cert-manager.io,configmaps,deployments.apps,secrets,services"`

Used on: Objects being used as ApplySet parents.
-->
### applyset.kubernetes.io/additional-namespaces (alpha) {#applyset-kubernetes-io-additional-namespaces}

类别：注解

示例：`applyset.kubernetes.io/additional-namespaces: "namespace1,namespace2"`

用于：作为 ApplySet 父对象使用的对象。

<!--
Use of this annotation is Alpha.
For Kubernetes version {{< skew currentVersion >}}, you can use this annotation on Secrets, ConfigMaps,
or custom resources if the CustomResourceDefinition
defining them has the `applyset.kubernetes.io/is-parent-type` label.

Part of the specification used to implement
[ApplySet-based pruning in kubectl](/docs/tasks/manage-kubernetes-objects/declarative-config/#alternative-kubectl-apply-f-directory-prune).
This annotation is applied to the parent object used to track an ApplySet to optimize listing of
ApplySet member objects. It is optional in the ApplySet specification, as tools can perform discovery
or use a different optimization. However, as of Kubernetes version {{< skew currentVersion >}},
it is required by kubectl. When present, the value of this annotation must be a comma separated list
of the group-kinds, in the fully-qualified name format, i.e. `<resource>.<group>`.
-->
此注解处于 alpha 阶段。
对于 Kubernetes {{< skew currentVersion >}} 版本，如果定义它们的
{{< glossary_tooltip term_id="CustomResourceDefinition" text="CustomResourceDefinition" >}}
打了 `applyset.kubernetes.io/is-parent-type` 标签，
那么你可以在 Secret、ConfigMap 或自定义资源上使用此注解。

规范的部分功能用来实现
[在 kubectl 中基于 ApplySet 的删除](/zh-cn/docs/tasks/manage-kubernetes-objects/declarative-config/#alternative-kubectl-apply-f-directory-prune)。
此注解应用于父对象，这些父对象用于跟踪 ApplySet 以优化 ApplySet 成员对象列表。
它在 AppySet 规范中是可选的，因为工具可以执行发现或使用不同的优化。
然而，对于 Kubernetes {{< skew currentVersion >}} 版本，它是 kubectl 必需的。
当存在时，注解的值必须是一个以逗号分隔的 group-kinds 列表，采用完全限定的名称格式，例如 `<resource>.<group>`。

<!--
### applyset.kubernetes.io/contains-group-resources (alpha) {#applyset-kubernetes-io-contains-group-resources}

Type: Annotation

Example: `applyset.kubernetes.io/contains-group-resources: "certificates.cert-manager.io,configmaps,deployments.apps,secrets,services"`

Used on: Objects being used as ApplySet parents.

Use of this annotation is Alpha.
For Kubernetes version {{< skew currentVersion >}}, you can use this annotation on Secrets, ConfigMaps,
or custom resources if the CustomResourceDefinition
defining them has the `applyset.kubernetes.io/is-parent-type` label.

Part of the specification used to implement
[ApplySet-based pruning in kubectl](/docs/tasks/manage-kubernetes-objects/declarative-config/#alternative-kubectl-apply-f-directory-prune).
This annotation is applied to the parent object used to track an ApplySet to optimize listing of
ApplySet member objects. It is optional in the ApplySet specification, as tools can perform discovery
or use a different optimization. However, as of Kubernetes version {{< skew currentVersion >}},
it is required by kubectl. When present, the value of this annotation must be a comma separated list
of the group-kinds, in the fully-qualified name format, i.e. `<resource>.<group>`.
-->
### applyset.kubernetes.io/contains-group-resources (alpha) {#applyset-kubernetes-io-contains-group-resources}

类别：注解

示例：`applyset.kubernetes.io/contains-group-resources: "certificates.cert-manager.io,configmaps,deployments.apps,secrets,services"`

用于：作为 ApplySet 父对象使用的对象。

此注解处于 alpha 阶段。
对于 Kubernetes {{< skew currentVersion >}} 版本， 如果定义它们的
{{< glossary_tooltip term_id="CustomResourceDefinition" text="CustomResourceDefinition" >}}
打了 `applyset.kubernetes.io/is-parent-type` 标签，
那么你可以在 Secret、ConfigMaps 或自定义资源上使用此注解。

规范的部分功能用来实现
[在 kubectl 中基于 ApplySet 的删除](/zh-cn/docs/tasks/manage-kubernetes-objects/declarative-config/#alternative-kubectl-apply-f-directory-prune)。
此注解应用于父对象，这些父对象用于跟踪 ApplySet 以优化 ApplySet 成员对象列表。
它在 AppySet 规范中是可选的，因为工具可以执行发现或使用不同的优化。
然而，对于 Kubernetes {{< skew currentVersion >}} 版本，它是 kubectl 必需的。
当存在时，注解的值必须是一个以逗号分隔的 group-kinds 列表，采用完全限定的名称格式，例如 `<resource>.<group>`。

<!--
### applyset.kubernetes.io/contains-group-resources (deprecated) {#applyset-kubernetes-io-contains-group-resources}

Type: Annotation

Example: `applyset.kubernetes.io/contains-group-resources: "certificates.cert-manager.io,configmaps,deployments.apps,secrets,services"`

Used on: Objects being used as ApplySet parents.
-->
### applyset.kubernetes.io/contains-group-resources (已弃用) {#applyset-kubernetes-io-contains-group-resources}

类别：注解

例子：`applyset.kubernetes.io/contains-group-resources: "certificates.cert-manager.io,configmaps,deployments.apps,secrets,services"`

用于：作为 ApplySet 父对象的对象。

<!--
For Kubernetes version {{< skew currentVersion >}}, you can use this annotation on Secrets, ConfigMaps,
or custom resources if the CustomResourceDefinition
defining them has the `applyset.kubernetes.io/is-parent-type` label.

Part of the specification used to implement
[ApplySet-based pruning in kubectl](/docs/tasks/manage-kubernetes-objects/declarative-config/#alternative-kubectl-apply-f-directory-prune).
This annotation is applied to the parent object used to track an ApplySet to optimize listing of
ApplySet member objects. It is optional in the ApplySet specification, as tools can perform discovery
or use a different optimization. However, in Kubernetes version {{< skew currentVersion >}},
it is required by kubectl. When present, the value of this annotation must be a comma separated list
of the group-kinds, in the fully-qualified name format, i.e. `<resource>.<group>`.
-->
对于 Kubernetes {{< skew currentVersion >}} 版本，如果定义它们的
CustomResourceDefinition 打了 `applyset.kubernetes.io/is-parent-type` 标签，
那么你可以在 Secret、ConfigMap 或自定义资源上使用此注解。

规范的部分功能用来实现
[在 kubectl 中基于 ApplySet 的删除](/zh-cn/docs/tasks/manage-kubernetes-objects/declarative-config/#alternative-kubectl-apply-f-directory-prune)。
此注解应用于父对象，这些父对象用于跟踪 ApplySet 以优化 ApplySet 成员对象列表。
它在 AppySet 规范中是可选的，因为工具可以执行发现或使用不同的优化。
然而，对于 Kubernetes {{< skew currentVersion >}} 版本，它是 kubectl 必需的。
当存在时，注解的值必须是一个以逗号分隔的 group-kinds 列表，采用完全限定的名称格式，例如 `<resource>.<group>`。

{{< note >}}
<!--
This annotation is currently deprecated and replaced by [`applyset.kubernetes.io/contains-group-kinds`](#applyset-kubernetes-io-contains-group-kinds),
support for this will be removed in applyset beta or GA.
-->
此注解目前已弃用，替换为 [`applyset.kubernetes.io/contains-group-kinds`](#applyset-kubernetes-io-contains-group-kinds)，
对此注解的支持将在 ApplySet 进阶至 Beta 或 GA 后移除。
{{< /note >}}

<!--
### applyset.kubernetes.io/id (alpha) {#applyset-kubernetes-io-id}

Type: Label

Example: `applyset.kubernetes.io/id: "applyset-0eFHV8ySqp7XoShsGvyWFQD3s96yqwHmzc4e0HR1dsY-v1"`

Used on: Objects being used as ApplySet parents.

Use of this label is Alpha.
For Kubernetes version {{< skew currentVersion >}}, you can use this label on Secrets, ConfigMaps,
or custom resources if the CustomResourceDefinition
defining them has the `applyset.kubernetes.io/is-parent-type` label.

Part of the specification used to implement
[ApplySet-based pruning in kubectl](/docs/tasks/manage-kubernetes-objects/declarative-config/#alternative-kubectl-apply-f-directory-prune).
This label is what makes an object an ApplySet parent object.
Its value is the unique ID of the ApplySet, which is derived from the identity of the parent
object itself. This ID **must** be the base64 encoding (using the URL safe encoding of RFC4648) of
the hash of the group-kind-name-namespace of the object it is on, in the form:
`<base64(sha256(<name>.<namespace>.<kind>.<group>))>`.
There is no relation between the value of this label and object UID.
-->
### applyset.kubernetes.io/id (alpha) {#applyset-kubernetes-io-id}

类别：标签

示例：`applyset.kubernetes.io/id: "applyset-0eFHV8ySqp7XoShsGvyWFQD3s96yqwHmzc4e0HR1dsY-v1"`

用于：作为 ApplySet 父对象使用的对象。

此注解处于 alpha 阶段。
对于 Kubernetes {{< skew currentVersion >}} 版本， 如果定义它们的
{{< glossary_tooltip term_id="CustomResourceDefinition" text="CustomResourceDefinition" >}}
打了 `applyset.kubernetes.io/is-parent-type` 标签，那么你可以在 Secret、ConfigMaps 或自定义资源上使用此注解。

规范的部分功能用来实现
[在 kubectl 中基于 ApplySet 的删除](/zh-cn/docs/tasks/manage-kubernetes-objects/declarative-config/#alternative-kubectl-apply-f-directory-prune)。
此标签使对象成为 AppySet 父对象。
它的值是 ApplySet 的唯一 ID，该 ID 派生自父对象本身的标识。
该 ID **必须** 是所在对象的 group-kind-name-namespace 的 hash 的 base64 编码（使用 RFC4648 的 URL 安全编码），
格式为： `<base64(sha256(<name>.<namespace>.<kind>.<group>))>`。
此标签的值与对象 UID 之间没有关系。

<!--
### applyset.kubernetes.io/is-parent-type (alpha) {#applyset-kubernetes-io-is-parent-type}

Type: Label

Example: `applyset.kubernetes.io/is-parent-type: "true"`

Used on: Custom Resource Definition (CRD)

Use of this label is Alpha.
Part of the specification used to implement
[ApplySet-based pruning in kubectl](/docs/tasks/manage-kubernetes-objects/declarative-config/#alternative-kubectl-apply-f-directory-prune).
You can set this label on a CustomResourceDefinition (CRD) to identify the custom resource type it
defines (not the CRD itself) as an allowed parent for an ApplySet.
The only permitted value for this label is `"true"`; if you want to mark a CRD as
not being a valid parent for ApplySets, omit this label.
-->
### applyset.kubernetes.io/is-parent-type (alpha) {#applyset-kubernetes-io-is-parent-type}

类别：标签

示例：`applyset.kubernetes.io/is-parent-type: "true"`

用于：自定义资源 （CRD）

此注解处于 alpha 阶段。
规范的部分功能用来实现
[在 kubectl 中基于 ApplySet 的删除](/zh-cn/docs/tasks/manage-kubernetes-objects/declarative-config/#alternative-kubectl-apply-f-directory-prune)。
你可以在 {{< glossary_tooltip term_id="CustomResourceDefinition" text="CustomResourceDefinition" >}} (CRD) 上设置这个标签，
以将它定义的自定义资源类型(而不是 CRD 本身)标识为 ApplySet 的允许父类。
这个标签唯一允许的值是 `"true"`；如果你想将一个 CRD 标记为不是 ApplySet 的有效父级，请省略这个标签。

<!--
### applyset.kubernetes.io/part-of (alpha) {#applyset-kubernetes-io-part-of}

Type: Label

Example: `applyset.kubernetes.io/part-of: "applyset-0eFHV8ySqp7XoShsGvyWFQD3s96yqwHmzc4e0HR1dsY-v1"`

Used on: All objects.

Use of this label is Alpha.
Part of the specification used to implement
[ApplySet-based pruning in kubectl](/docs/tasks/manage-kubernetes-objects/declarative-config/#alternative-kubectl-apply-f-directory-prune).
This label is what makes an object a member of an ApplySet.
The value of the label **must** match the value of the `applyset.kubernetes.io/id`
label on the parent object.
-->
### applyset.kubernetes.io/part-of (alpha) {#applyset-kubernetes-io-part-of}

类别：标签

示例：`applyset.kubernetes.io/part-of: "applyset-0eFHV8ySqp7XoShsGvyWFQD3s96yqwHmzc4e0HR1dsY-v1"`

用于：所有对象。

此注解处于 alpha 阶段。
规范的部分功能用来实现
[在 kubectl 中基于 ApplySet 的删除](/zh-cn/docs/tasks/manage-kubernetes-objects/declarative-config/#alternative-kubectl-apply-f-directory-prune)。
此标签使对象成为 ApplySet 的成员。
标签的值 **必须** 与父对象上的 `applyset.kubernetes.io/id` 标签的值相匹配。

<!--
### applyset.kubernetes.io/tooling (alpha) {#applyset-kubernetes-io-tooling}

Type: Annotation

Example: `applyset.kubernetes.io/tooling: "kubectl/v{{< skew currentVersion >}}"`

Used on: Objects being used as ApplySet parents.

Use of this annotation is Alpha.
For Kubernetes version {{< skew currentVersion >}}, you can use this annotation on Secrets,
ConfigMaps, or custom resources if the CustomResourceDefinitiondefining them has the
`applyset.kubernetes.io/is-parent-type` label.

Part of the specification used to implement
[ApplySet-based pruning in kubectl](/docs/tasks/manage-kubernetes-objects/declarative-config/#alternative-kubectl-apply-f-directory-prune).
This annotation is applied to the parent object used to track an ApplySet to indicate which
tooling manages that ApplySet. Tooling should refuse to mutate ApplySets belonging to other tools.
The value must be in the format `<toolname>/<semver>`.
-->
### applyset.kubernetes.io/tooling (alpha) {#applyset-kubernetes-io-tooling}

类别：注解

示例：`applyset.kubernetes.io/tooling: "kubectl/v{{< skew currentVersion >}}"`

用于：作为 ApplySet 父对象使用的对象。

此注解处于 alpha 阶段。
对于 Kubernetes {{< skew currentVersion >}} 版本， 如果定义它们的
{{< glossary_tooltip term_id="CustomResourceDefinition" text="CustomResourceDefinition" >}}
打了 `applyset.kubernetes.io/is-parent-type` 标签，那么你可以在 Secret、ConfigMaps 或自定义资源上使用此注解。

规范的部分功能用来实现
[在 kubectl 中基于 ApplySet 的删除](/zh-cn/docs/tasks/manage-kubernetes-objects/declarative-config/#alternative-kubectl-apply-f-directory-prune)。
此注解应用于父对象，这些父对象用于跟踪 ApplySet 以指示哪个工具管理 AppySet。
工具应该拒绝改变属于其他工具 ApplySets。
该值必须采用 `<toolname>/<semver>` 格式。

### apps.kubernetes.io/pod-index (beta) {#apps-kubernetes.io-pod-index}

<!--
Type: Label

Example: `apps.kubernetes.io/pod-index: "0"`

Used on: Pod

When a StatefulSet controller creates a Pod for the StatefulSet, it sets this label on that Pod. 
The value of the label is the ordinal index of the pod being created.

See [Pod Index Label](/docs/concepts/workloads/controllers/statefulset/#pod-index-label)
in the StatefulSet topic for more details.
Note the [PodIndexLabel](/docs/reference/command-line-tools-reference/feature-gates/)
feature gate must be enabled for this label to be added to pods.
-->
类别：标签

例子：`apps.kubernetes.io/pod-index: "0"`

用于：Pod

当 StatefulSet 控制器为 StatefulSet 创建 Pod 时，该控制器会在 Pod 上设置这个标签。
标签的值是正在创建的 Pod 的序号索引。

更多细节参阅 StatefulSet 主题中的
[Pod 索引标签](/zh-cn/docs/concepts/workloads/controllers/statefulset/#pod-index-label)。
请注意，[PodIndexLabel](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)
特性门控必须被启用，才能将此标签添加到 Pod 上。

<!--
### cluster-autoscaler.kubernetes.io/safe-to-evict

Type: Annotation

Example: `cluster-autoscaler.kubernetes.io/safe-to-evict: "true"`

Used on: Pod

When this annotation is set to `"true"`, the cluster autoscaler is allowed to evict a Pod
even if other rules would normally prevent that.
The cluster autoscaler never evicts Pods that have this annotation explicitly set to
`"false"`; you could set that on an important Pod that you want to keep running.
If this annotation is not set then the cluster autoscaler follows its Pod-level behavior.
-->
### cluster-autoscaler.kubernetes.io/safe-to-evict  {#cluster-autoscaler-safe-to-evict}

类别：注解

例子：`cluster-autoscaler.kubernetes.io/safe-to-evict: "true"`

用于：Pod

当这个注解设置为 `"true"` 时，即使其他规则通常会阻止驱逐操作，也会允许该集群自动扩缩器驱逐一个 Pod。
集群自动扩缩器从不驱逐将此注解显式设置为 `"false"` 的 Pod；你可以针对要保持运行的重要 Pod 设置此注解。
如果未设置此注解，则集群自动扩缩器将遵循其 Pod 级别的行为。

<!--
### config.kubernetes.io/local-config

Type: Annotation

Example: `config.kubernetes.io/local-config: "true"`

Used on: All objects

This annotation is used in manifests to mark an object as local configuration that
should not be submitted to the Kubernetes API.

A value of `"true"` for this annotation declares that the object is only consumed by
client-side tooling and should not be submitted to the API server.

A value of `"false"` can be used to declare that the object should be submitted to
the API server even when it would otherwise be assumed to be local.

This annotation is part of the Kubernetes Resource Model (KRM) Functions Specification,
which is used by Kustomize and similar third-party tools.
For example, Kustomize removes objects with this annotation from its final build output.
-->
### config.kubernetes.io/local-config {#config-kubernetes-io-local-config}

类别：注解

例子：`config.kubernetes.io/local-config: "true"`

用于：所有对象

该注解用于清单中的对象，表示某对象是本地配置，不应提交到 Kubernetes API。

对于这个注解，当值为 `"true"` 时，表示该对象仅被客户端工具使用，不应提交到 API 服务器。

当值为 `"false"` 时，可以用来声明该对象应提交到 API 服务器，即使它是本地对象。

该注解是 Kubernetes 资源模型 (KRM) 函数规范的一部分，被 Kustomize 和其他类似的第三方工具使用。
例如，Kustomize 会从其最终构建输出中删除带有此注解的对象。

<!--
### container.apparmor.security.beta.kubernetes.io/* (deprecated) {#container-apparmor-security-beta-kubernetes-io}
-->
### container.apparmor.security.beta.kubernetes.io/*（已弃用） {#container-apparmor-security-beta-kubernetes-io}

<!--
Type: Annotation

Example: `container.apparmor.security.beta.kubernetes.io/my-container: my-custom-profile`

Used on: Pods

This annotation allows you to specify the AppArmor security profile for a container within a
Kubernetes pod. As of Kubernetes v1.30, this should be set with the `appArmorProfile` field instead.
To learn more, see the [AppArmor](/docs/tutorials/security/apparmor/) tutorial.
The tutorial illustrates using AppArmor to restrict a container's abilities and access.

The profile specified dictates the set of rules and restrictions that the containerized process must
adhere to. This helps enforce security policies and isolation for your containers.
-->
类别：注解

例子：`container.apparmor.security.beta.kubernetes.io/my-container: my-custom-profile`

用于：Pod

此注解允许你为 Kubernetes Pod 中的容器指定 AppArmor 安全配置文件。
从 Kubernetes v1.30 开始，此注解应该通过 `appArmorProfile` 字段进行设置。
更多细节参阅 [AppArmor](/zh-cn/docs/tutorials/security/apparmor/) 教程。
该教程演示了如何使用 AppArmor 限制容器的权能和访问权限。

所指定的配置文件定义了容器进程必须遵守的规则集和限制集。这有助于针对容器实施安全策略和隔离措施。

<!--
### internal.config.kubernetes.io/* (reserved prefix) {#internal.config.kubernetes.io-reserved-wildcard}

Type: Annotation

Used on: All objects

This prefix is reserved for internal use by tools that act as orchestrators in accordance
with the Kubernetes Resource Model (KRM) Functions Specification.
Annotations with this prefix are internal to the orchestration process and are not persisted to
the manifests on the filesystem. In other words, the orchestrator tool should set these
annotations when reading files from the local filesystem and remove them when writing the output
of functions back to the filesystem.

A KRM function **must not** modify annotations with this prefix, unless otherwise specified for a
given annotation. This enables orchestrator tools to add additional internal annotations, without
requiring changes to existing functions.
-->
### internal.config.kubernetes.io/* (保留的前缀) {#internal.config.kubernetes.io-reserved-wildcard}

类别：注解

用于：所有对象

该前缀被保留，供遵从 Kubernetes 资源模型 (KRM) 函数规范的编排工具内部使用。
带有该前缀的注解仅在编排过程中使用，不会持久化到文件系统。
换句话说，编排工具应从本地文件系统读取文件时设置这些注解，并在将函数输出写回文件系统时删除它们。

除非特定注解另有说明，KRM 函数**不得**修改带有此前缀的注解。
这使得编排工具可以添加额外的内部注解，而不需要更改现有函数。

<!--
### internal.config.kubernetes.io/path

Type: Annotation

Example: `internal.config.kubernetes.io/path: "relative/file/path.yaml"`

Used on: All objects

This annotation records the slash-delimited, OS-agnostic, relative path to the manifest file the
object was loaded from. The path is relative to a fixed location on the filesystem, determined by
the orchestrator tool.

This annotation is part of the Kubernetes Resource Model (KRM) Functions Specification, which is
used by Kustomize and similar third-party tools.

A KRM Function **should not** modify this annotation on input objects unless it is modifying the
referenced files. A KRM Function **may** include this annotation on objects it generates.
-->
### internal.config.kubernetes.io/path {#internal-config-kubernetes-io-path}

类别：注解

例子：`internal.config.kubernetes.io/path: "relative/file/path.yaml"`

用于：所有对象

此注解记录了加载对象清单文件的（斜线分隔、与操作系统无关）相对路径。
该路径相对于文件系统上由编排工具确定的固定位置。

该注解是 Kubernetes 资源模型 (KRM) 函数规范的一部分，被 Kustomize 和其他类似的第三方工具使用。

KRM 函数**不应**在输入对象上修改此注解，除非它正在修改引用的文件。
KRM 函数**可以**在它所生成的对象上包含这个注解。

<!--
### internal.config.kubernetes.io/index

Type: Annotation

Example: `internal.config.kubernetes.io/index: "2"`

Used on: All objects

This annotation records the zero-indexed position of the YAML document that contains the object
within the manifest file the object was loaded from. Note that YAML documents are separated by
three dashes (`---`) and can each contain one object. When this annotation is not specified, a
value of 0 is implied.

This annotation is part of the Kubernetes Resource Model (KRM) Functions Specification,
which is used by Kustomize and similar third-party tools.

A KRM Function **should not** modify this annotation on input objects unless it is modifying the
referenced files. A KRM Function **may** include this annotation on objects it generates.
-->
### internal.config.kubernetes.io/index {#internal-config-kubernetes-io-index}

类别：注解

例子：`internal.config.kubernetes.io/index: "2"`

用于：所有对象

该注解记录了包含对象的 YAML 文档在加载对象的清单文件中的零索引位置。
请注意，YAML 文档由三个破折号 (---) 分隔，每个文档可以包含一个对象。
如果未指定此注解，则该值为 0。

该注解是 Kubernetes 资源模型 (KRM) 函数规范的一部分，被 Kustomize 和其他类似的第三方工具使用。

KRM 函数**不应**在输入对象上修改此注解，除非它正在修改引用的文件。
KRM 函数**可以**在它所生成的对象上包含这个注解。

<!-- 
### kubernetes.io/arch

Type: Label

Example: `kubernetes.io/arch: "amd64"`

Used on: Node

The Kubelet populates this with `runtime.GOARCH` as defined by Go.
This can be handy if you are mixing ARM and x86 nodes.
-->
### kubernetes.io/arch {#kubernetes-io-arch}

类别：标签

例子：`kubernetes.io/arch: "amd64"`

用于：Node

Kubelet 使用 Go 定义的 `runtime.GOARCH` 填充它。如果你混合使用 ARM 和 X86 节点，这会很方便。

<!--
### kubernetes.io/os

Type: Label

Example: `kubernetes.io/os: "linux"`

Used on: Node, Pod

For nodes, the kubelet populates this with `runtime.GOOS` as defined by Go. This can be handy if you are
mixing operating systems in your cluster (for example: mixing Linux and Windows nodes).

You can also set this label on a Pod. Kubernetes allows you to set any value for this label;
if you use this label, you should nevertheless set it to the Go `runtime.GOOS` string for the operating
system that this Pod actually works with.

When the `kubernetes.io/os` label value for a Pod does not match the label value on a Node,
the kubelet on the node will not admit the Pod. However, this is not taken into account by
the kube-scheduler. Alternatively, the kubelet refuses to run a Pod where you have specified a Pod OS, if
this isn't the same as the operating system for the node where that kubelet is running. Just
look for [Pods OS](/docs/concepts/workloads/pods/#pod-os) for more details.
-->
### kubernetes.io/os {#kubernetes-io-os}

类别：标签

例子：`kubernetes.io/os: "linux"`

用于：Node，Pod

对于节点，kubelet 会根据 Go 定义的 `runtime.GOOS` 填充这个值。
你可以很方便地在集群中混合使用操作系统（例如：混合使用 Linux 和 Windows 节点）。

你还可以在 Pod 上设置这个标签。
Kubernetes 允许你为此标签设置任何值；如果你使用此标签，
你应该将其设置为与该 Pod 实际使用的操作系统相对应的 Go `runtime.GOOS` 字符串。

当 Pod 的 kubernetes.io/os 标签值与节点上的标签值不匹配时，节点上的 kubelet 不会运行该 Pod。
但是，kube-scheduler 并未考虑这一点。
另外，如果你为 Pod 指定的操作系统与运行该 kubelet 的节点操作系统不相同，那么 kubelet 会拒绝运行该 Pod。
请查看 [Pod 操作系统](/zh-cn/docs/concepts/workloads/pods/#pod-os) 了解更多详情。

<!--
### kubernetes.io/metadata.name

Type: Label

Example: `kubernetes.io/metadata.name: "mynamespace"`

Used on: Namespaces

The Kubernetes API server (part of the {{< glossary_tooltip text="control plane" term_id="control-plane" >}})
sets this label on all namespaces. The label value is set
to the name of the namespace. You can't change this label's value.

This is useful if you want to target a specific namespace with a label
{{< glossary_tooltip text="selector" term_id="selector" >}}.
-->
### kubernetes.io/metadata.name {#kubernetes-io-metadata-name}

类别：标签

例子：`kubernetes.io/metadata.name: "mynamespace"`

用于：Namespace

Kubernetes API 服务器（{{<glossary_tooltip text="控制平面" term_id="control-plane" >}} 的一部分）在所有
Namespace 上设置此标签。标签值被设置 Namespace 的名称。你无法更改此标签的值。

如果你想使用标签{{<glossary_tooltip text="选择算符" term_id="selector" >}}定位特定 Namespace，这很有用。

<!--
### kubernetes.io/limit-ranger

Type: Annotation

Example: `kubernetes.io/limit-ranger: "LimitRanger plugin set: cpu, memory request for container nginx; cpu, memory limit for container nginx"`

Used on: Pod
-->
### kubernetes.io/limit-ranger   {#kubernetes-io-limit-ranger}

类别：注解

例子：`kubernetes.io/limit-ranger: "LimitRanger plugin set: cpu, memory request for container nginx; cpu, memory limit for container nginx"`

用于：Pod

<!--
Kubernetes by default doesn't provide any resource limit, that means unless you explicitly define
limits, your container can consume unlimited CPU and memory.
You can define a default request or default limit for pods. You do this by creating a LimitRange
in the relevant namespace. Pods deployed after you define a LimitRange will have these limits
applied to them.
The annotation `kubernetes.io/limit-ranger` records that resource defaults were specified for the Pod,
and they were applied successfully.
For more details, read about [LimitRanges](/docs/concepts/policy/limit-range).
-->
Kubernetes 默认不提供任何资源限制，这意味着除非你明确定义限制，否则你的容器将可以无限消耗 CPU 和内存。
你可以为 Pod 定义默认请求或默认限制。为此，你可以在相关命名空间中创建一个 LimitRange。
在你定义 LimitRange 后部署的 Pod 将受到这些限制。
注解 `kubernetes.io/limit-ranger` 记录了为 Pod 指定的资源默认值，以及成功应用这些默认值。
有关更多详细信息，请阅读 [LimitRanges](/zh-cn/docs/concepts/policy/limit-range)。

### kubernetes.io/config.hash

<!--
Type: Annotation

Example: `kubernetes.io/config.hash: "df7cc47f8477b6b1226d7d23a904867b"`

Used on: Pod

When the kubelet creates a static Pod based on a given manifest, it attaches this annotation
to the static Pod. The value of the annotation is the UID of the Pod.
Note that the kubelet also sets the `.spec.nodeName` to the current node name as if the Pod
was scheduled to the node.
-->
类别：注解

例子：`kubernetes.io/config.hash: "df7cc47f8477b6b1226d7d23a904867b"`

用于：Pod

当 kubelet 基于给定的清单创建静态 Pod 时，kubelet 会将此注解挂接到静态 Pod 上。
注解的取值是 Pod 的 UID。请注意，kubelet 还会将 `.spec.nodeName` 设置为当前节点名称，
就像 Pod 被调度到此节点一样。

### kubernetes.io/config.mirror

<!--
Type: Annotation

Example: `kubernetes.io/config.mirror: "df7cc47f8477b6b1226d7d23a904867b"`

Used on: Pod
-->
类别：注解

例子：`kubernetes.io/config.mirror: "df7cc47f8477b6b1226d7d23a904867b"`

用于：Pod

<!--
For a static Pod created by the kubelet on a node, a {{< glossary_tooltip text="mirror Pod" term_id="mirror-pod" >}}
is created on the API server. The kubelet adds an annotation to indicate that this Pod is
actually a mirror Pod. The annotation value is copied from the [`kubernetes.io/config.hash`](#kubernetes-io-config-hash)
annotation, which is the UID of the Pod.

When updating a Pod with this annotation set, the annotation cannot be changed or removed.
If a Pod doesn't have this annotation, it cannot be added during a Pod update.
-->
对于 kubelet 在节点上创建的静态 Pod，
系统会在 API 服务器上创建{{< glossary_tooltip text="镜像 Pod" term_id="mirror-pod" >}}。
kubelet 添加一个注解以指示此 Pod 实际上是镜像 Pod。
注解的值是从 [`kubernetes.io/config.hash`](#kubernetes-io-config-hash) 注解复制过来的，即 Pod 的 UID。

在更新设置了此注解的 Pod 时，注解不能被更改或移除。
如果 Pod 没有此注解，此注解在 Pod 更新期间不能被添加。

### kubernetes.io/config.source

<!--
Type: Annotation

Example: `kubernetes.io/config.source: "file"`

Used on: Pod
-->
类别：注解

例子：`kubernetes.io/config.source: "file"`

用于：Pod

<!--
This annotation is added by the kubelet to indicate where the Pod comes from.
For static Pods, the annotation value could be one of `file` or `http` depending
on where the Pod manifest is located. For a Pod created on the API server and then
scheduled to the current node, the annotation value is `api`.
-->
此注解由 kubelet 添加，以指示 Pod 的来源。
对于静态 Pod，注解的值可以是 `file` 或 `http` 之一，具体取决于 Pod 清单所在的位置。
对于在 API 服务器上创建并调度到当前节点的 Pod，注解的值是 `api`。

### kubernetes.io/config.seen

<!--
Type: Annotation

Example: `kubernetes.io/config.seen: "2023-10-27T04:04:56.011314488Z"`

Used on: Pod

When the kubelet sees a Pod for the first time, it may add this annotation to
the Pod with a value of current timestamp in the RFC3339 format.
-->
类别：注解

例子：`kubernetes.io/config.seen: "2023-10-27T04:04:56.011314488Z"`

用于：Pod

当 kubelet 第一次看到 Pod 时，kubelet 可以将此注解添加到 Pod 上，
注解的值是格式为 RFC3339 的当前时间戳。

<!--
### addonmanager.kubernetes.io/mode

Type: Label

Example: `addonmanager.kubernetes.io/mode: "Reconcile"`

Used on: All objects

To specify how an add-on should be managed, you can use the `addonmanager.kubernetes.io/mode` label.
This label can have one of three values: `Reconcile`, `EnsureExists`, or `Ignore`.

- `Reconcile`: Addon resources will be periodically reconciled with the expected state.
  If there are any differences, the add-on manager will recreate, reconfigure or delete
  the resources as needed. This is the default mode if no label is specified.
- `EnsureExists`: Addon resources will be checked for existence only but will not be modified
  after creation. The add-on manager will create or re-create the resources when there is
  no instance of the resource with that name.
- `Ignore`: Addon resources will be ignored. This mode is useful for add-ons that are not
  compatible with the add-on manager or that are managed by another controller.

For more details, see [Addon-manager](https://github.com/kubernetes/kubernetes/blob/master/cluster/addons/addon-manager/README.md).
-->
### addonmanager.kubernetes.io/mode

类别：标签

示例：`addonmanager.kubernetes.io/mode: "Reconcile"`

用于：所有对象。

要指定如何管理外接插件，你可以使用 `addonmanager.kubernetes.io/mode` 标签。
这个标签可以有三个标签之一：`Reconcile`，`EnsureExists`，或者 `Ignore`。

- `Reconcile`：插件资源将定期与预期状态协调。如果有任何差异，插件管理器将根据需要重新创建、重新配置或删除资源。
  如果没有指定标签，此值是默认值。
- `EnsureExists`：插件资源将仅检查是否存在，但在创建后不会修改。当没有具有该名称的资源实例时，
  外接程序管理器将创建或重新创建资源。
- `Ignore`：插件资源将被忽略。此模式对于与外接插件管理器不兼容或由其他控制器管理的插件程序非常有用。

有关详细信息，请参见
[Addon-manager](https://github.com/kubernetes/kubernetes/blob/master/cluster/addons/addon-manager/README.md)。

<!--
### beta.kubernetes.io/arch (deprecated)

Type: Label

This label has been deprecated. Please use [`kubernetes.io/arch`](#kubernetes-io-arch) instead.

### beta.kubernetes.io/os (deprecated)

Type: Label

This label has been deprecated. Please use [`kubernetes.io/os`](#kubernetes-io-os) instead.
-->
### beta.kubernetes.io/arch (已弃用) {#beta-kubernetes-io-arch}

类别：标签

此标签已被弃用。请改用 [`kubernetes.io/arch`](#kubernetes-io-arch)。

### beta.kubernetes.io/os (已弃用) {#beta-kubernetes-io-os}

类别：标签

此标签已被弃用。请改用 [`kubernetes.io/os`](#kubernetes-io-os)。

<!--
### kube-aggregator.kubernetes.io/automanaged {#kube-aggregator-kubernetesio-automanaged}

Type: Label

Example: `kube-aggregator.kubernetes.io/automanaged: "onstart"`

Used on: APIService

The `kube-apiserver` sets this label on any APIService object that the API server
has created automatically. The label marks how the control plane should manage that
APIService. You should not add, modify, or remove this label by yourself.
-->
### kube-aggregator.kubernetes.io/automanaged {#kube-aggregator-kubernetesio-automanaged}

类别：标签

例子：`kube-aggregator.kubernetes.io/automanaged: "onstart"`

用于：APIService

`kube-apiserver` 会在由 API 服务器自动创建的所有 APIService 对象上设置这个标签。
该标签标记了控制平面应如何管理该 APIService。你不应自行添加、修改或删除此标签。

{{< note >}}
<!--
Automanaged APIService objects are deleted by kube-apiserver when it has no built-in
or custom resource API corresponding to the API group/version of the APIService.
-->
当自动托管的 APIService 对象没有内置或自定义资源 API 对应于该 APIService 的 API 组/版本时，
它将被 kube-apiserver 删除。
{{< /note >}}

<!--
There are two possible values:

- `onstart`: The APIService should be reconciled when an API server starts up, but not otherwise.
- `true`: The API server should reconcile this APIService continuously.
-->
有两个可能的值：

- `onstart`：API 服务器应在启动时协调 APIService，但在其他时间不会进行协调。
- `true`：API 服务器应持续协调此 APIService。

<!--
### service.alpha.kubernetes.io/tolerate-unready-endpoints (deprecated)

Type: Annotation

Used on: StatefulSet

This annotation on a Service denotes if the Endpoints controller should go ahead and create
Endpoints for unready Pods. Endpoints of these Services retain their DNS records and continue
receiving traffic for the Service from the moment the kubelet starts all containers in the pod
and marks it _Running_, til the kubelet stops all containers and deletes the pod from
the API server.
-->
### service.alpha.kubernetes.io/tolerate-unready-endpoints（已弃用）   {#service-alpha-kubernetes-io-tolerate-unready-endpoints-deprecated}

类别：注解

用于：StatefulSet

Service 上的这个注解表示 Endpoints 控制器是否应该继续为未准备好的 Pod 创建 Endpoints。
这些 Service 的 Endpoints 保留其 DNS 记录，并从 kubelet 启动 Pod 中的所有容器并将其标记为
**Running** 的那一刻起继续接收 Service 的流量，直到 kubelet 停止所有容器并从 API 服务器删除 Pod 为止。

<!--
### kubernetes.io/hostname {#kubernetesiohostname}

Type: Label

Example: `kubernetes.io/hostname: "ip-172-20-114-199.ec2.internal"`

Used on: Node

The Kubelet populates this label with the hostname of the node. Note that the hostname
can be changed from the "actual" hostname by passing the `--hostname-override` flag to
the `kubelet`.

This label is also used as part of the topology hierarchy.
See [topology.kubernetes.io/zone](#topologykubernetesiozone) for more information.
-->
### kubernetes.io/hostname {#kubernetesiohostname}

类别：标签

例子：`kubernetes.io/hostname: "ip-172-20-114-199.ec2.internal"`

用于：Node

Kubelet 使用主机名填充此标签。请注意，可以通过将 `--hostname-override` 标志传递给 `kubelet` 来替代“实际”主机名。

此标签也用作拓扑层次结构的一部分。有关详细信息，请参阅 [topology.kubernetes.io/zone](#topologykubernetesiozone)。

<!--
### kubernetes.io/change-cause {#change-cause}

Type: Annotation

Example: `kubernetes.io/change-cause: "kubectl edit --record deployment foo"`

Used on: All Objects

This annotation is a best guess at why something was changed.

It is populated when adding `--record` to a `kubectl` command that may change an object.
-->
### kubernetes.io/change-cause {#change-cause}

类别：注解

例子：`kubernetes.io/change-cause: "kubectl edit --record deployment foo"`

用于：所有对象

此注解是对某些事物发生变更的原因的最佳猜测。

将 `--record` 添加到可能会更改对象的 `kubectl` 命令时会填充它。

<!--
### kubernetes.io/description {#description}

Type: Annotation

Example: `kubernetes.io/description: "Description of K8s object."`

Used on: All Objects

This annotation is used for describing specific behaviour of given object.
-->
### kubernetes.io/description {#description}

类别：注解

例子：`kubernetes.io/description: "Description of K8s object."`

用于：所有对象

此注解用于描述给定对象的特定行为。

<!--
### kubernetes.io/enforce-mountable-secrets {#enforce-mountable-secrets}

Type: Annotation

Example: `kubernetes.io/enforce-mountable-secrets: "true"`

Used on: ServiceAccount

The value for this annotation must be **true** to take effect.
When you set this annotation  to "true", Kubernetes enforces the following rules for
Pods running as this ServiceAccount:
-->
### kubernetes.io/enforce-mountable-secrets {#enforce-mountable-secrets}

类别：注解

例子：`kubernetes.io/enforce-mountable-secrets: "true"`

用于：ServiceAccount

此注解的值必须为 **true** 才能生效。
当你将此注解设置为 "true" 时，Kubernetes 会对以此 ServiceAccount 运行的 Pod 强制执行以下规则：

<!--
1. Secrets mounted as volumes must be listed in the ServiceAccount's `secrets` field.
1. Secrets referenced in `envFrom` for containers (including sidecar containers and init containers)
   must also be listed in the ServiceAccount's secrets field.
   If any container in a Pod references a Secret not listed in the ServiceAccount's `secrets` field
   (and even if the reference is marked as `optional`), then the Pod will fail to start,
   and an error indicating the non-compliant secret reference will be generated.
1. Secrets referenced in a Pod's `imagePullSecrets` must be present in the
   ServiceAccount's `imagePullSecrets` field, the Pod will fail to start,
   and an error indicating the non-compliant image pull secret reference will be generated.
-->
1. 作为卷挂载的 Secret 必须列在 ServiceAccount 的 `secrets` 字段中。
2. 针对容器（包括边车容器和 Init 容器）在 `envFrom` 中引用的 Secret 也必须列在 ServiceAccount 的 `secrets` 字段中。
   如果 Pod 中的任一容器引用了未在 ServiceAccount 的 `secrets` 字段中列出的 Secret（即使该引用被标记为 `optional`），
   则 Pod 将启动失败，并报错表示不合规的 Secret 引用。
3. 在 Pod 的 `imagePullSecrets` 中引用的 Secret 必须出现在 ServiceAccount 的 `imagePullSecrets` 字段中，
   否则 Pod 将启动失败，并报错表示不合规的镜像拉取 Secret 引用。

<!--
When you create or update a Pod, these rules are checked. If a Pod doesn't follow them, it won't start and you'll see an error message.
If a Pod is already running and you change the `kubernetes.io/enforce-mountable-secrets` annotation
to true, or you edit the associated ServiceAccount to remove the reference to a Secret
that the Pod is already using, the Pod continues to run.
-->
当你创建或更新 Pod 时，系统会检查这些规则。
如果 Pod 未遵循这些规则，Pod 将启动失败，并且你将看到一条错误消息。
如果 Pod 已经在运行，并且你将 `kubernetes.io/enforce-mountable-secrets` 注解更改为 true，
或者你编辑关联的 ServiceAccount 以移除 Pod 已经在使用的对 Secret 的引用，那么 Pod 将继续运行。

<!--
### node.kubernetes.io/exclude-from-external-load-balancers

Type: Label

Example: `node.kubernetes.io/exclude-from-external-load-balancers`

Used on: Node

You can add labels to particular worker nodes to exclude them from the list of backend servers used by external load balancers.
The following command can be used to exclude a worker node from the list of backend servers in a
backend set:
-->
### node.kubernetes.io/exclude-from-external-load-balancers   {#exclude-from-external-load-balancer}

类别：标签

例子：`node.kubernetes.io/exclude-from-external-load-balancers`

用于：Node

你可以向特定的 Worker 节点添加标签，以将这些节点从外部负载均衡器使用的后端服务器列表中去除。
以下命令可用于从后端集的后端服务器列表中排除一个 Worker 节点：

```shell
kubectl label nodes <node-name> node.kubernetes.io/exclude-from-external-load-balancers=true
```

<!--
### controller.kubernetes.io/pod-deletion-cost {#pod-deletion-cost}

Type: Annotation

Example: `controller.kubernetes.io/pod-deletion-cost: "10"`

Used on: Pod

This annotation is used to set [Pod Deletion Cost](/docs/concepts/workloads/controllers/replicaset/#pod-deletion-cost)
which allows users to influence ReplicaSet downscaling order.
The annotation value parses into an `int32` type.
-->
### controller.kubernetes.io/pod-deletion-cost {#pod-deletion-cost}

类别：注解

例子：`controller.kubernetes.io/pod-deletion-cost: "10"`

用于：Pod

该注解用于设置
[Pod 删除成本](/zh-cn/docs/concepts/workloads/controllers/replicaset/#pod-deletion-cost)允许用户影响
ReplicaSet 缩减顺序。注解解析为 `int32` 类型。

<!--
### cluster-autoscaler.kubernetes.io/enable-ds-eviction

Type: Annotation

Example: `cluster-autoscaler.kubernetes.io/enable-ds-eviction: "true"`

Used on: Pod

This annotation controls whether a DaemonSet pod should be evicted by a ClusterAutoscaler.
This annotation needs to be specified on DaemonSet pods in a DaemonSet manifest.
When this annotation is set to `"true"`, the ClusterAutoscaler is allowed to evict
a DaemonSet Pod, even if other rules would normally prevent that.
To disallow the ClusterAutoscaler from evicting DaemonSet pods,
you can set this annotation to `"false"` for important DaemonSet pods.
If this annotation is not set, then the ClusterAutoscaler follows its overall behavior
(i.e evict the DaemonSets based on its configuration).
-->
### cluster-autoscaler.kubernetes.io/enable-ds-eviction {#enable-ds-eviction}

类别：注解

例子：`cluster-autoscaler.kubernetes.io/enable-ds-eviction: "true"`

用于：Pod

该注解控制 DaemonSet Pod 是否应由 ClusterAutoscaler 驱逐。
该注解需要在 DaemonSet 清单中的 DaemonSet Pod 上指定。
当该注解设为 `"true"` 时，即使其他规则通常会阻止驱逐，也将允许 ClusterAutoscaler 驱逐 DaemonSet Pod。
要取消允许 ClusterAutoscaler 驱逐 DaemonSet Pod，你可以为重要的 DaemonSet Pod 将该注解设为 `"false"`。
如果未设置该注解，则 Cluster Autoscaler 将遵循其整体行为（即根据其配置驱逐 DaemonSet）。

{{< note >}}
<!--
This annotation only impacts DaemonSet pods.
-->
该注解仅影响 DaemonSet Pod。
{{< /note >}}

<!-- 
### kubernetes.io/ingress-bandwidth

Type: Annotation

Example: `kubernetes.io/ingress-bandwidth: 10M`

Used on: Pod

You can apply quality-of-service traffic shaping to a pod and effectively limit its available
bandwidth. Ingress traffic to a Pod is handled by shaping queued packets to effectively
handle data. To limit the bandwidth on a Pod, write an object definition JSON file and specify
the data traffic speed using `kubernetes.io/ingress-bandwidth` annotation. The unit used for
specifying ingress rate is bits per second, as a
[Quantity](/docs/reference/kubernetes-api/common-definitions/quantity/).
For example, `10M` means 10 megabits per second.
-->
### kubernetes.io/ingress-bandwidth {#ingerss-bandwidth}

类别：注解

示例：`kubernetes.io/ingress-bandwidth: 10M`

用于：Pod

你可以对 Pod 应用服务质量流量控制并有效限制其可用带宽。
入站流量（到 Pod）通过控制排队的数据包来处理，以有效地处理数据。
要限制 Pod 的带宽，请编写对象定义 JSON 文件并使用 `kubernetes.io/ingress-bandwidth`
注解指定数据流量速度。用于指定入站的速率单位是每秒，
作为[量纲（Quantity）](/zh-cn/docs/reference/kubernetes-api/common-definitions/quantity/)。
例如，`10M` 表示每秒 10 兆比特。

{{< note >}}
<!--
Ingress traffic shaping annotation is an experimental feature.
If you want to enable traffic shaping support, you must add the `bandwidth` plugin to your CNI
configuration file (default `/etc/cni/net.d`) and ensure that the binary is included in your CNI
bin dir (default `/opt/cni/bin`).
-->
入站流量控制注解是一项实验性功能。
如果要启用流量控制支持，必须将 `bandwidth` 插件添加到 CNI 配置文件（默认为 `/etc/cni/net.d`）
并确保二进制文件包含在你的 CNI bin 目录中（默认为 `/opt/cni/bin`）。
{{< /note >}}

<!-- 
### kubernetes.io/egress-bandwidth

Type: Annotation

Example: `kubernetes.io/egress-bandwidth: 10M`

Used on: Pod

Egress traffic from a Pod is handled by policing, which simply drops packets in excess of the
configured rate. The limits you place on a Pod do not affect the bandwidth of other Pods.
To limit the bandwidth on a Pod, write an object definition JSON file and specify the data traffic
speed using `kubernetes.io/egress-bandwidth` annotation. The unit used for specifying egress rate
is bits per second, as a [Quantity](/docs/reference/kubernetes-api/common-definitions/quantity/).
For example, `10M` means 10 megabits per second.
-->
### kubernetes.io/egress-bandwidth {#egress-bandwidth}

类别：注解

示例：`kubernetes.io/egress-bandwidth: 10M`

用于：Pod

出站流量（来自 pod）由策略控制，策略只是丢弃超过配置速率的数据包。
你为一个 Pod 所设置的限制不会影响其他 Pod 的带宽。
要限制 Pod 的带宽，请编写对象定义 JSON 文件并使用 `kubernetes.io/egress-bandwidth` 注解指定数据流量速度。
用于指定出站的速率单位是每秒比特数，
以[量纲（Quantity）](/zh-cn/docs/reference/kubernetes-api/common-definitions/quantity/)的形式给出。
例如，`10M` 表示每秒 10 兆比特。

{{< note >}}
<!--
Egress traffic shaping annotation is an experimental feature.
If you want to enable traffic shaping support, you must add the `bandwidth` plugin to your CNI
configuration file (default `/etc/cni/net.d`) and ensure that the binary is included in your CNI
bin dir (default `/opt/cni/bin`).
-->
出站流量控制注解是一项实验性功能。
如果要启用流量控制支持，必须将 `bandwidth` 插件添加到 CNI 配置文件（默认为 `/etc/cni/net.d`）
并确保二进制文件包含在你的 CNI bin 目录中（默认为 `/opt/cni/bin`）。
{{< /note >}}

<!--
### beta.kubernetes.io/instance-type (deprecated)

Type: Label
-->
### beta.kubernetes.io/instance-type (已弃用) {#beta-kubernetes-io-instance-type}

类别：标签

{{< note >}}
<!--
Starting in v1.17, this label is deprecated in favor of
[node.kubernetes.io/instance-type](#nodekubernetesioinstance-type).
-->
从 v1.17 开始，此标签已弃用，取而代之的是 [node.kubernetes.io/instance-type](#nodekubernetesioinstance-type)。
{{< /note >}}

<!--
### node.kubernetes.io/instance-type {#nodekubernetesioinstance-type}

Type: Label

Example: `node.kubernetes.io/instance-type: "m3.medium"`

Used on: Node

The Kubelet populates this with the instance type as defined by the cloud provider.
This will be set only if you are using a cloud provider. This setting is handy
if you want to target certain workloads to certain instance types, but typically you want
to rely on the Kubernetes scheduler to perform resource-based scheduling.
You should aim to schedule based on properties rather than on instance types
(for example: require a GPU, instead of requiring a `g2.2xlarge`).
-->
### node.kubernetes.io/instance-type {#nodekubernetesioinstance-type}

类别：标签

例子：`node.kubernetes.io/instance-type: "m3.medium"`

用于：Node

Kubelet 使用云驱动定义的实例类型填充它。
仅当你使用云驱动时才会设置此项。如果你希望将某些工作负载定位到某些实例类型，
则此设置非常方便，但通常你希望依靠 Kubernetes 调度程序来执行基于资源的调度。
你应该基于属性而不是实例类型来调度（例如：需要 GPU，而不是需要 `g2.2xlarge`）。

<!--
### failure-domain.beta.kubernetes.io/region (deprecated) {#failure-domainbetakubernetesioregion}

Type: Label
-->
### failure-domain.beta.kubernetes.io/region (已弃用) {#failure-domainbetakubernetesioregion}

类别：标签

{{< note >}}
<!--
Starting in v1.17, this label is deprecated in favor of
[topology.kubernetes.io/region](#topologykubernetesioregion).
-->
从 v1.17 开始，此标签已弃用，取而代之的是 [topology.kubernetes.io/region](#topologykubernetesioregion)。
{{</note>}}

<!--
### failure-domain.beta.kubernetes.io/zone (deprecated) {#failure-domainbetakubernetesiozone}

Type: Label
-->
### failure-domain.beta.kubernetes.io/zone (已弃用) {#failure-domainbetakubernetesiozone}

类别：标签

{{< note >}}
<!--
Starting in v1.17, this label is deprecated in favor of
[topology.kubernetes.io/zone](#topologykubernetesiozone).
-->
从 v1.17 开始，此标签已弃用，取而代之的是 [topology.kubernetes.io/zone](#topologykubernetesiozone)。
{{</note>}}

### pv.kubernetes.io/bind-completed {#pv-kubernetesiobind-completed}

<!--
Type: Annotation

Example: `pv.kubernetes.io/bind-completed: "yes"`

Used on: PersistentVolumeClaim

When this annotation is set on a PersistentVolumeClaim (PVC), that indicates that the lifecycle
of the PVC has passed through initial binding setup. When present, that information changes
how the control plane interprets the state of PVC objects.
The value of this annotation does not matter to Kubernetes.
-->
类别：注解

例子：`pv.kubernetes.io/bind-completed: "yes"`

用于：PersistentVolumeClaim

当在 PersistentVolumeClaim (PVC) 上设置此注解时，表示 PVC 的生命周期已通过初始绑定设置。
当存在此注解时，该信息会改变控制平面解释 PVC 对象状态的方式。此注解的值对 Kubernetes 无关紧要。

### pv.kubernetes.io/bound-by-controller {#pv-kubernetesioboundby-controller}

<!--
Type: Annotation

Example: `pv.kubernetes.io/bound-by-controller: "yes"`

Used on: PersistentVolume, PersistentVolumeClaim

If this annotation is set on a PersistentVolume or PersistentVolumeClaim, it indicates that a
storage binding (PersistentVolume → PersistentVolumeClaim, or PersistentVolumeClaim → PersistentVolume)
was installed by the {{< glossary_tooltip text="controller" term_id="controller" >}}.
If the annotation isn't set, and there is a storage binding in place, the absence of that
annotation means that the binding was done manually.
The value of this annotation does not matter.
-->
类别：注解

例子：`pv.kubernetes.io/bound-by-controller: "yes"`

用于：PersistentVolume、PersistentVolumeClaim

如果此注解设置在 PersistentVolume 或 PersistentVolumeClaim 上，则表示存储绑定
（PersistentVolume → PersistentVolumeClaim，或 PersistentVolumeClaim → PersistentVolume）
已由{{< glossary_tooltip text="控制器" term_id="controller" >}}配置完毕。
如果未设置此注解，且存在存储绑定，则缺少该注解意味着绑定是手动完成的。此注解的值无关紧要。

### pv.kubernetes.io/provisioned-by {#pv-kubernetesiodynamically-provisioned}

<!--
Type: Annotation

Example: `pv.kubernetes.io/provisioned-by: "kubernetes.io/rbd"`

Used on: PersistentVolume

This annotation is added to a PersistentVolume(PV) that has been dynamically provisioned by Kubernetes.
Its value is the name of volume plugin that created the volume. It serves both users (to show where a PV
comes from) and Kubernetes (to recognize dynamically provisioned PVs in its decisions).
-->
类别：注解

例子：`pv.kubernetes.io/provisioned-by: "kubernetes.io/rbd"`

用于：PersistentVolume

此注解被添加到已由 Kubernetes 动态制备的 PersistentVolume (PV)。
它的值是创建卷的卷插件的名称。它同时服务于用户（显示 PV 的来源）和 Kubernetes（识别其决策中动态制备的 PV）。

### pv.kubernetes.io/migrated-to {#pv-kubernetesio-migratedto}

<!--
Type: Annotation

Example: `pv.kubernetes.io/migrated-to: pd.csi.storage.gke.io`

Used on: PersistentVolume, PersistentVolumeClaim

It is added to a PersistentVolume(PV) and PersistentVolumeClaim(PVC) that is supposed to be
dynamically provisioned/deleted by its corresponding CSI driver through the `CSIMigration` feature gate.
When this annotation is set, the Kubernetes components will "stand-down" and the
`external-provisioner` will act on the objects.
-->
类别：注解

例子：`pv.kubernetes.io/migrated-to: pd.csi.storage.gke.io`

用于：PersistentVolume、PersistentVolumeClaim

它被添加到 PersistentVolume (PV) 和 PersistentVolumeClaim (PVC)，应该由其相应的 CSI
驱动程序通过 `CSIMigration` 特性门控动态制备/删除。设置此注解后，Kubernetes 组件将“停止”，
而 `external-provisioner` 将作用于对象。

<!--
### statefulset.kubernetes.io/pod-name {#statefulsetkubernetesiopod-name}

Type: Label

Example: `statefulset.kubernetes.io/pod-name: "mystatefulset-7"`

Used on: Pod

When a StatefulSet controller creates a Pod for the StatefulSet, the control plane
sets this label on that Pod. The value of the label is the name of the Pod being created.

See [Pod Name Label](/docs/concepts/workloads/controllers/statefulset/#pod-name-label)
in the StatefulSet topic for more details.
-->
### statefulset.kubernetes.io/pod-name {#statefulsetkubernetesiopod-name}

类别：标签

例子：`statefulset.kubernetes.io/pod-name: "mystatefulset-7"`

当 StatefulSet 控制器为 StatefulSet 创建 Pod 时，控制平面会在该 Pod 上设置此标签。标签的值是正在创建的 Pod 的名称。

有关详细信息，请参阅 StatefulSet 主题中的
[Pod 名称标签](/zh-cn/docs/concepts/workloads/controllers/statefulset/#pod-name-label)。

<!--
### scheduler.alpha.kubernetes.io/node-selector {#schedulerkubernetesnode-selector}

Type: Annotation

Example: `scheduler.alpha.kubernetes.io/node-selector: "name-of-node-selector"`

Used on: Namespace

The [PodNodeSelector](/docs/reference/access-authn-authz/admission-controllers/#podnodeselector)
uses this annotation key to assign node selectors to pods in namespaces.
-->
### scheduler.alpha.kubernetes.io/node-selector {#schedulerkubernetesnode-selector}

类别：注解

例子：`scheduler.alpha.kubernetes.io/node-selector: "name-of-node-selector"`

用于：Namespace

[PodNodeSelector](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#podnodeselector)
使用此注解键为名字空间中的 Pod 设置节点选择算符。

<!--
### topology.kubernetes.io/region {#topologykubernetesioregion}

Type: Label

Example: `topology.kubernetes.io/region: "us-east-1"`

Used on: Node, PersistentVolume

See [topology.kubernetes.io/zone](#topologykubernetesiozone).
-->
### topology.kubernetes.io/region {#topologykubernetesioregion}

类别：标签

例子：`topology.kubernetes.io/region: "us-east-1"`

用于：Node、PersistentVolume

请参阅 [topology.kubernetes.io/zone](#topologykubernetesiozone)。

<!--
### topology.kubernetes.io/zone {#topologykubernetesiozone}

Type: Label

Example: `topology.kubernetes.io/zone: "us-east-1c"`

Used on: Node, PersistentVolume

**On Node**: The `kubelet` or the external `cloud-controller-manager` populates this
with the information from the cloud provider. This will be set only if you are using
a cloud provider. However, you can consider setting this on nodes if it makes sense
in your topology.

**On PersistentVolume**: topology-aware volume provisioners will automatically set
node affinity constraints on a `PersistentVolume`.
-->
### topology.kubernetes.io/zone {#topologykubernetesiozone}

类别：标签

例子：`topology.kubernetes.io/zone: "us-east-1c"`

用于：Node、PersistentVolume

**在 Node 上**：`kubelet` 或外部 `cloud-controller-manager` 使用 `cloudprovider` 提供的信息填充它。
仅当你使用 `cloudprovider` 时才会设置此项。
但是，如果它在你的拓扑中有意义，你应该考虑在 Node 上设置它。

**在 PersistentVolume 上**：拓扑感知卷配置器将自动在 `PersistentVolume` 上设置 Node 亲和性约束。

<!--
A zone represents a logical failure domain. It is common for Kubernetes clusters to
span multiple zones for increased availability. While the exact definition of a zone
is left to infrastructure implementations, common properties of a zone include
very low network latency within a zone, no-cost network traffic within a zone, and
failure independence from other zones.
For example, nodes within a zone might share a network switch, but nodes in different
zones should not.

A region represents a larger domain, made up of one or more zones.
It is uncommon for Kubernetes clusters to span multiple regions,
While the exact definition of a zone or region is left to infrastructure implementations,
common properties of a region include higher network latency between them than within them,
non-zero cost for network traffic between them, and failure independence from other zones or regions.
For example, nodes within a region might share power infrastructure (e.g. a UPS or generator),
but nodes in different regions typically would not.
-->
一个 Zone 代表一个逻辑故障域。Kubernetes 集群通常跨越多个 Zone 以提高可用性。
虽然 Zone 的确切定义留给基础设施实现，但 Zone 的常见属性包括 Zone 内非常低的网络延迟、Zone
内的免费网络流量以及与其他 Zone 的故障独立性。例如，一个 Zone 内的 Node 可能共享一个网络交换机，
但不同 Zone 中的 Node 无法共享交换机。

一个 Region 代表一个更大的域，由一个或多个 Zone 组成。Kubernetes 集群跨多个 Region 并不常见，
虽然 Zone 或 Region 的确切定义留给基础设施实现，
但 Region 的共同属性包括它们之间的网络延迟比它们内部更高，它们之间的网络流量成本非零，
以及与其他 Zone 或 Region 的故障独立性。例如，一个 Region 内的 Node 可能共享电力基础设施
（例如 UPS 或发电机），但不同 Region 的 Node 通常不会共享电力基础设施。

<!--
Kubernetes makes a few assumptions about the structure of zones and regions:

1. regions and zones are hierarchical: zones are strict subsets of regions and
   no zone can be in 2 regions
2. zone names are unique across regions; for example region "africa-east-1" might be comprised
   of zones "africa-east-1a" and "africa-east-1b"
-->
Kubernetes 对 Zone 和 Region 的结构做了一些假设：

1. Zone 和 Region 是分层的：Zone 是 Region 的严格子集，没有 Zone 可以在两个 Region 中；

2. Zone 名称跨 Region 是唯一的；例如，Region “africa-east-1” 可能由 Zone “africa-east-1a”
   和 “africa-east-1b” 组成。

<!--
It should be safe to assume that topology labels do not change.
Even though labels are strictly mutable, consumers of them can assume that a given node
is not going to be moved between zones without being destroyed and recreated.
-->
你可以大胆假设拓扑标签不会改变。尽管严格地讲标签是可变的，
但节点的用户可以假设给定节点只能通过销毁和重新创建才能完成 Zone 间移动。

<!--
Kubernetes can use this information in various ways.
For example, the scheduler automatically tries to spread the Pods in a ReplicaSet across nodes
in a single-zone cluster (to reduce the impact of node failures, see
[kubernetes.io/hostname](#kubernetesiohostname)).
With multiple-zone clusters, this spreading behavior also applies to zones (to reduce the impact of zone failures).
This is achieved via _SelectorSpreadPriority_.
-->
Kubernetes 可以通过多种方式使用这些信息。例如，调度程序会自动尝试将 ReplicaSet 中的 Pod
分布在单 Zone 集群中的多个节点上（以便减少节点故障的影响，请参阅 [kubernetes.io/hostname](#kubernetesiohostname)）。
对于多 Zone 集群，这种分布行为也适用于 Zone（以减少 Zone 故障的影响）。
Zone 级别的 Pod 分布是通过 **SelectorSpreadPriority** 实现的。

<!--
_SelectorSpreadPriority_ is a best effort placement. If the zones in your cluster are
heterogeneous (for example: different numbers of nodes, different types of nodes, or different pod
resource requirements), this placement might prevent equal spreading of your Pods across zones.
If desired, you can use homogeneous zones (same number and types of nodes) to reduce the probability
of unequal spreading.
-->
**SelectorSpreadPriority** 是一个尽力而为的放置机制。如果集群中的 Zone 是异构的
（例如：节点数量不同、节点类型不同或 Pod 资源需求有别等），这种放置机制可能会让你的
Pod 无法实现跨 Zone 均匀分布。
如果需要，你可以使用同质 Zone（节点数量和类型均相同）来减少不均匀分布的可能性。

<!--
The scheduler (through the _VolumeZonePredicate_ predicate) also will ensure that Pods,
that claim a given volume, are only placed into the same zone as that volume.
Volumes cannot be attached across zones.
-->
调度程序还将（通过 **VolumeZonePredicate** 条件）确保申领给定卷的 Pod 仅被放置在与该卷相同的 Zone 中。
卷不能跨 Zone 挂接。

<!--
If `PersistentVolumeLabel` does not support automatic labeling of your PersistentVolumes,
you should consider adding the labels manually (or adding support for `PersistentVolumeLabel`).
With `PersistentVolumeLabel`, the scheduler prevents Pods from mounting volumes in a different zone.
If your infrastructure doesn't have this constraint, you don't need to add the zone labels to the volumes at all.
-->
你应该考虑手动添加标签（或添加对 `PersistentVolumeLabel` 的支持）。
基于 `PersistentVolumeLabel`，调度程序可以防止 Pod 挂载来自其他 Zone 的卷。
如果你的基础架构没有此限制，则不需要将 Zone 标签添加到卷上。

<!--
### volume.beta.kubernetes.io/storage-provisioner (deprecated)

Type: Annotation

Example: `volume.beta.kubernetes.io/storage-provisioner: "k8s.io/minikube-hostpath"`

Used on: PersistentVolumeClaim

This annotation has been deprecated since v1.23.
See [volume.kubernetes.io/storage-provisioner](#volume-kubernetes-io-storage-provisioner).
-->
### volume.beta.kubernetes.io/storage-provisioner (已弃用) {#volume-beta-kubernetes-io-storage-provisioner}

类别：注解

例子：`volume.beta.kubernetes.io/storage-provisioner: "k8s.io/minikube-hostpath"`

用于：PersistentVolumeClaim

此注解自 v1.23 已被弃用。
参见 [volume.kubernetes.io/storage-provisioner](#volume-kubernetes-io-storage-provisioner)。

<!--
### volume.beta.kubernetes.io/storage-class (deprecated)

Type: Annotation

Example: `volume.beta.kubernetes.io/storage-class: "example-class"`

Used on: PersistentVolume, PersistentVolumeClaim
-->
### volume.beta.kubernetes.io/storage-class（已弃用）   {#volume-beta-storage-class}

类别：注解

例子：`volume.beta.kubernetes.io/storage-class: "example-class"`

用于：PersistentVolume、PersistentVolumeClaim

<!--
This annotation can be used for PersistentVolume(PV) or PersistentVolumeClaim(PVC)
to specify the name of [StorageClass](/docs/concepts/storage/storage-classes/).
When both the `storageClassName` attribute and the `volume.beta.kubernetes.io/storage-class`
annotation are specified, the annotation `volume.beta.kubernetes.io/storage-class`
takes precedence over the `storageClassName` attribute.

This annotation has been deprecated. Instead, set the
[`storageClassName` field](/docs/concepts/storage/persistent-volumes/#class)
for the PersistentVolumeClaim or PersistentVolume.
-->
此注解可以为 PersistentVolume（PV）或 PersistentVolumeClaim（PVC）指定
[StorageClass](/zh-cn/docs/concepts/storage/storage-classes/)。
当 `storageClassName` 属性和 `volume.beta.kubernetes.io/storage-class` 注解均被指定时，
注解 `volume.beta.kubernetes.io/storage-class` 将优先于 `storageClassName` 属性。

此注解已被弃用。作为替代方案，你应该为 PersistentVolumeClaim 或 PersistentVolume 设置
[`storageClassName` 字段](/zh-cn/docs/concepts/storage/persistent-volumes/#class)。

<!--
### volume.beta.kubernetes.io/mount-options (deprecated) {#mount-options}

Type: Annotation

Example : `volume.beta.kubernetes.io/mount-options: "ro,soft"`

Used on: PersistentVolume

A Kubernetes administrator can specify additional
[mount options](/docs/concepts/storage/persistent-volumes/#mount-options)
for when a PersistentVolume is mounted on a node.
-->
### volume.beta.kubernetes.io/mount-options（已弃用） {#mount-options}

类别：注解

例子：`volume.beta.kubernetes.io/mount-options: "ro,soft"`

用于：PersistentVolume

针对 PersistentVolume 挂载到一个节点上的情形，
Kubernetes 管理员可以指定更多的[挂载选项](/zh-cn/docs/concepts/storage/persistent-volumes/#mount-options)。

<!--
### volume.kubernetes.io/storage-provisioner  {#volume-kubernetes-io-storage-provisioner}

Type: Annotation

Used on: PersistentVolumeClaim

This annotation is added to a PVC that is supposed to be dynamically provisioned.
Its value is the name of a volume plugin that is supposed to provision a volume
for this PVC.
-->
### volume.kubernetes.io/storage-provisioner {#volume-kubernetes-io-storage-provisioner}

类别：注解

用于：PersistentVolumeClaim

此注解将被添加到根据需要动态制备的 PVC 上。
其取值是假设为 PVC 制备卷时卷插件的名称。

<!--
### volume.kubernetes.io/selected-node

Type: Annotation

Used on: PersistentVolumeClaim

This annotation is added to a PVC that is triggered by a scheduler to be
dynamically provisioned. Its value is the name of the selected node.
-->
### volume.kubernetes.io/selected-node   {#selected-node}

类别：注解

用于：PersistentVolumeClaim

此注解被添加到调度程序所触发的 PVC 上，对应的 PVC 需要被动态制备。注解值是选定节点的名称。

<!--
### volumes.kubernetes.io/controller-managed-attach-detach

Type: Annotation

Used on: Node

If a node has the annotation `volumes.kubernetes.io/controller-managed-attach-detach`,
its storage attach and detach operations are being managed by the _volume attach/detach_
{{< glossary_tooltip text="controller" term_id="controller" >}}.

The value of the annotation isn't important.
-->
### volumes.kubernetes.io/controller-managed-attach-detach   {#controller-managed-attach-detach}

类别：注解

用于：Node

如果节点已在其自身上设置了注解 `volumes.kubernetes.io/controller-managed-attach-detach`，
那么它的存储挂接和解除挂接的操作是交由
**卷挂接/解除挂接**{{< glossary_tooltip text="控制器" term_id="controller" >}}来管理的。

注解的值并不重要。

<!--
### node.kubernetes.io/windows-build {#nodekubernetesiowindows-build}

Type: Label

Example: `node.kubernetes.io/windows-build: "10.0.17763"`

Used on: Node

When the kubelet is running on Microsoft Windows, it automatically labels its Node
to record the version of Windows Server in use.

The label's value is in the format "MajorVersion.MinorVersion.BuildNumber".
-->
### node.kubernetes.io/windows-build {#nodekubernetesiowindows-build}

类别：标签

例子：`node.kubernetes.io/windows-build: "10.0.17763"`

用于：Node

当 kubelet 在 Microsoft Windows 上运行时，它会自动标记其所在节点以记录所使用的 Windows Server 的版本。

标签的值采用 “MajorVersion.MinorVersion.BuildNumber” 格式。

<!--
### storage.alpha.kubernetes.io/migrated-plugins {#storagealphakubernetesiomigrated-plugins}

Type: Annotation

Example:`storage.alpha.kubernetes.io/migrated-plugins: "kubernetes.io/cinder"`

Used on: CSINode (an extension API)

This annotation is automatically added for the CSINode object that maps to a node that
installs CSIDriver. This annotation shows the in-tree plugin name of the migrated plugin. Its
value depends on your cluster's in-tree cloud provider storage type.

For example, if the in-tree cloud provider storage type is `CSIMigrationvSphere`, the CSINodes instance for the node should be updated with:
`storage.alpha.kubernetes.io/migrated-plugins: "kubernetes.io/vsphere-volume"`
-->
### storage.alpha.kubernetes.io/migrated-plugins {#storagealphakubernetesiomigrated-plugins}

类型：注解

例子：`storage.alpha.kubernetes.io/migrated-plugins: "kubernetes.io/cinder"`

用于：CSINode（一个扩展 API）

系统会自动为映射到安装 CSIDriver 的节点的 CSINode 对象添加此注解。
此注解显示已迁移插件的树内插件名称，其值取决于集群的树内云驱动存储类型。

例如，如果树内云驱动存储类型为 `CSIMigrationvSphere`，则此节点的 CSINode 实例应更新为：
`storage.alpha.kubernetes.io/migerated-plugins: "kubernetes.io/vsphere-volume"`

<!--
### service.kubernetes.io/headless {#servicekubernetesioheadless}

Type: Label

Example: `service.kubernetes.io/headless: ""`

Used on: Endpoints

The control plane adds this label to an Endpoints object when the owning Service is headless.
To learn more, read [Headless Services](/docs/concepts/services-networking/service/#headless-services).
-->
### service.kubernetes.io/headless {#servicekubernetesioheadless}

类别：标签

例子：`service.kubernetes.io/headless: ""`

用于：Endpoints

当拥有的 Service 是无头类型时，控制平面将此标签添加到 Endpoints 对象。
更多细节参阅[无头服务](/zh-cn/docs/concepts/services-networking/service/#headless-services)。

<!--
### service.kubernetes.io/topology-aware-hints (deprecated) {#servicekubernetesiotopology-aware-hints}

Example: `service.kubernetes.io/topology-aware-hints: "Auto"`

Used on: Service
-->
### service.kubernetes.io/topology-aware-hints（已弃用） {#servicekubernetesiotopology-aware-hints}

例子：`service.kubernetes.io/topology-aware-hints: "Auto"`

用于：Service

<!--
This annotation was used for enabling _topology aware hints_ on Services. Topology aware
hints have since been renamed: the concept is now called
[topology aware routing](/docs/concepts/services-networking/topology-aware-routing/).
Setting the annotation to `Auto`, on a Service, configured the Kubernetes control plane to
add topology hints on EndpointSlices associated with that Service. You can also explicitly
set the annotation to `Disabled`.

If you are running a version of Kubernetes older than {{< skew currentVersion >}},
check the documentation for that Kubernetes version to see how topology aware routing
works in that release.

There are no other valid values for this annotation. If you don't want topology aware hints
for a Service, don't add this annotation.
-->
此注解曾用于在 Service 中启用**拓扑感知提示（topology aware hints）**。
然而，拓扑感知提示已经做了更名操作，
此概念现在名为[拓扑感知路由（topology aware routing）](/zh-cn/docs/concepts/services-networking/topology-aware-routing/)。
在 Service 上将该注解设置为 `Auto` 会配置 Kubernetes 控制平面，
以将拓扑提示添加到该 Service 关联的 EndpointSlice 上。你也可以显式地将该注解设置为 `Disabled`。

如果你使用的是早于 {{< skew currentVersion >}} 的 Kubernetes 版本，
请查阅该版本对应的文档，了解其拓扑感知路由的工作方式。

此注解没有其他有效值。如果你不希望为 Service 启用拓扑感知提示，不要添加此注解。

### service.kubernetes.io/topology-mode

<!--
Type: Annotation

Example: `service.kubernetes.io/topology-mode: Auto`

Used on: Service

This annotation provides a way to define how Services handle network topology;
for example, you can configure a Service so that Kubernetes prefers keeping traffic between
a client and server within a single topology zone.
In some cases this can help reduce costs or improve network performance.

See [Topology Aware Routing](/docs/concepts/services-networking/topology-aware-routing/)
for more details.
-->
类别：注解

例子：`service.kubernetes.io/topology-mode: Auto`

用于：Service

此注解提供了一种定义 Service 如何处理网络拓扑的方式；
例如，你可以配置 Service，以便 Kubernetes 更倾向于将客户端和服务器之间的流量保持在同一拓扑区域内。
在某些情况下，这有助于降低成本或提高网络性能。

更多细节参阅[拓扑感知路由](/zh-cn/docs/concepts/services-networking/topology-aware-routing/)。

<!--
### kubernetes.io/service-name {#kubernetesioservice-name}

Type: Label

Example: `kubernetes.io/service-name: "my-website"`

Used on: EndpointSlice

Kubernetes associates [EndpointSlices](/docs/concepts/services-networking/endpoint-slices/) with
[Services](/docs/concepts/services-networking/service/) using this label.

This label records the {{< glossary_tooltip term_id="name" text="name">}} of the
Service that the EndpointSlice is backing. All EndpointSlices should have this label set to
the name of their associated Service.
-->
### kubernetes.io/service-name {#kubernetesioservice-name}

类别：标签

例子：`kubernetes.io/service-name: "my-website"`

用于：EndpointSlice

Kubernetes 使用这个标签将
[EndpointSlices](/zh-cn/docs/concepts/services-networking/endpoint-slices/)
与[服务](/zh-cn/docs/concepts/services-networking/service/)关联。

这个标签记录了 EndpointSlice 后备服务的{{< glossary_tooltip term_id="name" text="名称">}}。
所有 EndpointSlice 都应将此标签设置为其关联服务的名称。

<!--
### kubernetes.io/service-account.name

Type: Annotation

Example: `kubernetes.io/service-account.name: "sa-name"`

Used on: Secret

This annotation records the {{< glossary_tooltip term_id="name" text="name">}} of the
ServiceAccount that the token (stored in the Secret of type `kubernetes.io/service-account-token`)
represents.
-->
### kubernetes.io/service-account.name {#service-account-name}

类别：注解

示例：`kubernetes.io/service-account.name: "sa-name"`

用于：Secret

这个注解记录了令牌（存储在 `kubernetes.io/service-account-token` 类型的 Secret 中）所代表的
ServiceAccount 的{{<glossary_tooltip term_id="name" text="名称">}}。

<!-- 
### kubernetes.io/service-account.uid

Type: Annotation

Example: `kubernetes.io/service-account.uid: da68f9c6-9d26-11e7-b84e-002dc52800da`

Used on: Secret

This annotation records the {{< glossary_tooltip term_id="uid" text="unique ID" >}} of the
ServiceAccount that the token (stored in the Secret of type `kubernetes.io/service-account-token`)
represents.
-->
### kubernetes.io/service-account.uid {#service-account-uid}

类别：注解

示例：`kubernetes.io/service-account.uid: da68f9c6-9d26-11e7-b84e-002dc52800da`

用于：Secret

该注解记录了令牌（存储在 `kubernetes.io/service-account-token` 类型的 Secret 中）所代表的
ServiceAccount 的{{<glossary_tooltip term_id="uid" text="唯一 ID" >}}。

<!--
### kubernetes.io/legacy-token-last-used

Type: Label

Example: `kubernetes.io/legacy-token-last-used: 2022-10-24`

Used on: Secret

The control plane only adds this label to Secrets that have the type
`kubernetes.io/service-account-token`.
The value of this label records the date (ISO 8601 format, UTC time zone) when the control plane
last saw a request where the client authenticated using the service account token.

If a legacy token was last used before the cluster gained the feature (added in Kubernetes v1.26),
then the label isn't set.
-->
### kubernetes.io/legacy-token-last-used

类别：标签

例子：`kubernetes.io/legacy-token-last-used: 2022-10-24`

用于：Secret

控制面仅为 `kubernetes.io/service-account-token` 类型的 Secret 添加此标签。
该标签的值记录着控制面最近一次接到客户端使用服务账号令牌进行身份验证请求的日期（ISO 8601
格式，UTC 时区）

如果上一次使用老的令牌的时间在集群获得此特性（添加于 Kubernetes v1.26）之前，则不会设置此标签。

### kubernetes.io/legacy-token-invalid-since

<!--
Type: Label

Example: `kubernetes.io/legacy-token-invalid-since: 2023-10-27`

Used on: Secret
-->
类别：标签

例子：`kubernetes.io/legacy-token-invalid-since: 2023-10-27`

用于：Secret

<!--
The control plane automatically adds this label to auto-generated Secrets that
have the type `kubernetes.io/service-account-token`. This label marks the
Secret-based token as invalid for authentication. The value of this label
records the date (ISO 8601 format, UTC time zone) when the control plane detects
that the auto-generated Secret has not been used for a specified duration
(defaults to one year).
-->
控制平面会自动将此标签添加到类别为 `kubernetes.io/service-account-token` 的自动生成的 Secret 中。
此标签将基于 Secret 的令牌标记为无效的认证令牌。此标签的值记录了控制平面检测到自动生成的
Secret 在指定时间段内（默认是一年）未被使用的日期（ISO 8601 格式，UTC 时区）。

<!--
### endpointslice.kubernetes.io/managed-by {#endpointslicekubernetesiomanaged-by}

Type: Label

Example: `endpointslice.kubernetes.io/managed-by: endpointslice-controller.k8s.io`

Used on: EndpointSlices

The label is used to indicate the controller or entity that manages the EndpointSlice. This label
aims to enable different EndpointSlice objects to be managed by different controllers or entities
within the same cluster.
-->
### endpointslice.kubernetes.io/managed-by {#endpointslicekubernetesiomanaged-by}

类别：标签

例子：`endpointslice.kubernetes.io/managed-by: "endpointslice-controller.k8s.io"`

用于：EndpointSlice

用于标示管理 EndpointSlice 的控制器或实体。该标签旨在使不同的 EndpointSlice
对象能够由同一集群内的不同控制器或实体管理。

<!--
### endpointslice.kubernetes.io/skip-mirror {#endpointslicekubernetesioskip-mirror}

Type: Label

Example: `endpointslice.kubernetes.io/skip-mirror: "true"`

Used on: Endpoints

The label can be set to `"true"` on an Endpoints resource to indicate that the
EndpointSliceMirroring controller should not mirror this resource with EndpointSlices.
-->
### endpointslice.kubernetes.io/skip-mirror {#endpointslicekubernetesioskip-mirror}

类别：标签

例子：`endpointslice.kubernetes.io/skip-mirror: "true"`

用于：Endpoints

可以在 Endpoints 资源上将此标签设置为 `"true"`，以指示 EndpointSliceMirroring
控制器不应使用 EndpointSlice 镜像此 Endpoints 资源。

<!--
### service.kubernetes.io/service-proxy-name {#servicekubernetesioservice-proxy-name}

Type: Label

Example: `service.kubernetes.io/service-proxy-name: "foo-bar"`

Used on: Service

The kube-proxy has this label for custom proxy, which delegates service control to custom proxy.
-->
### service.kubernetes.io/service-proxy-name {#servicekubernetesioservice-proxy-name}

类别：标签

例子：`service.kubernetes.io/service-proxy-name: "foo-bar"`

用于：Service

kube-proxy 自定义代理会使用这个标签，它将服务控制委托给自定义代理。

<!--
### experimental.windows.kubernetes.io/isolation-type (deprecated) {#experimental-windows-kubernetes-io-isolation-type}

Type: Annotation

Example: `experimental.windows.kubernetes.io/isolation-type: "hyperv"`

Used on: Pod

The annotation is used to run Windows containers with Hyper-V isolation.
-->
### experimental.windows.kubernetes.io/isolation-type (已弃用) {#experimental-windows-kubernetes-io-isolation-type}

类别：注解

例子：`experimental.windows.kubernetes.io/isolation-type: "hyperv"`

用于：Pod

此注解用于运行具有 Hyper-V 隔离的 Windows 容器。

{{< note >}}
<!--
Starting from v1.20, this annotation is deprecated.
Experimental Hyper-V support was removed in 1.21.
-->
从 v1.20 开始，此注解已弃用。1.21 中移除了实验性 Hyper-V 支持。
{{</note>}}

<!--
### ingressclass.kubernetes.io/is-default-class

Type: Annotation

Example: `ingressclass.kubernetes.io/is-default-class: "true"`

Used on: IngressClass

When a IngressClass resource has this annotation set to `"true"`, new Ingress resource
without a class specified will be assigned this default class.
-->
### ingressclass.kubernetes.io/is-default-class {#ingressclass-kubernetes-io-is-default-class}

类别：注解

例子：`ingressclass.kubernetes.io/is-default-class: "true"`

用于：IngressClass

当单个 IngressClass 资源将此注解设置为 `"true"`时，新的未指定 Ingress 类的 Ingress
资源将被设置为此默认类。

<!--
### nginx.ingress.kubernetes.io/configuration-snippet

Type: Annotation

Example: `nginx.ingress.kubernetes.io/configuration-snippet: "  more_set_headers \"Request-Id: $req_id\";\nmore_set_headers \"Example: 42\";\n"`

Used on: Ingress

You can use this annotation to set extra configuration on an Ingress that 
uses the [NGINX Ingress Controller] (https://github.com/kubernetes/ingress-nginx/)
The `configuration-snippet` annotation is ignored
by default since version 1.9.0 of the ingress controller.
The NGINX ingress controller setting `allow-snippet-annotations.` 
has to be explicitly enabled to
use this annotation.
Enabling the annotation can be dangerous in a multi-tenant cluster, as it can lead people with otherwise
limited permissions being able to retrieve all Secrets in the cluster.
-->
### nginx.ingress.kubernetes.io/configuration-snippet {#nginx-ingress-kubernetes-io-configuration-snippet}

类别：注解

例子：`nginx.ingress.kubernetes.io/configuration-snippet: "  more_set_headers \"Request-Id: $req_id\";\nmore_set_headers \"Example: 42\";\n"`

用于：Ingress

你可以使用此注解在使用 [NGINX Ingress Controller](https://github.com/kubernetes/ingress-nginx/) 的 Ingress 上设置额外配置。
自 Ingress 控制器 1.9.0 版本以来，`configuration-snippet` 注解默认会被忽略。
要使用此注解，必须显式启用 NGINX Ingress 控制器的 `allow-snippet-annotations` 设置。
在多租户集群中启用该注解可能是危险的，因为这可能导致权限受限的用户能够获取集群中的所有 Secret。

<!--
### kubernetes.io/ingress.class (deprecated)

Type: Annotation

Used on: Ingress
-->
### kubernetes.io/ingress.class (已弃用) {#kubernetes-io-ingress-class}

类别：注解

用于：Ingress

{{< note >}}
<!--
Starting in v1.18, this annotation is deprecated in favor of `spec.ingressClassName`.
-->
从 v1.18 开始，此注解被弃用，改为鼓励使用 `spec.ingressClassName`。
{{</note>}}

<!--
### storageclass.kubernetes.io/is-default-class

Type: Annotation

Example: `storageclass.kubernetes.io/is-default-class: "true"`

Used on: StorageClass

When a single StorageClass resource has this annotation set to `"true"`, new PersistentVolumeClaim
resource without a class specified will be assigned this default class.
-->
### storageclass.kubernetes.io/is-default-class {#storageclass-kubernetes-io-is-default-class}

类别：注解

例子：`storageclass.kubernetes.io/is-default-class: "true"`

用于：StorageClass

当单个 StorageClass 资源将此注解设置为 `"true"` 时，新的未指定存储类的 PersistentVolumeClaim
资源将被设置为此默认类。

<!--
### alpha.kubernetes.io/provided-node-ip (alpha) {#alpha-kubernetes-io-provided-node-ip}

Type: Annotation

Example: `alpha.kubernetes.io/provided-node-ip: "10.0.0.1"`

Used on: Node

The kubelet can set this annotation on a Node to denote its configured IPv4 and/or IPv6 address.

When kubelet is started with the `--cloud-provider` flag set to any value (includes both external
and legacy in-tree cloud providers), it sets this annotation on the Node to denote an IP address
set from the command line flag (`--node-ip`). This IP is verified with the cloud provider as valid
by the cloud-controller-manager.
-->
### alpha.kubernetes.io/provided-node-ip (alpha) {#alpha-kubernetes-io-provided-node-ip}

类别：注解

例子：`alpha.kubernetes.io/provided-node-ip: "10.0.0.1"`

用于：Node

kubelet 可以在 Node 上设置此注解来表示其配置的 IPv4 与/或 IPv6 地址。

如果 kubelet 被启动时 `--cloud-provider` 标志设置为任一云驱动（包括外部云驱动和传统树内云驱动）
kubelet 会在 Node 上设置此注解以表示从命令行标志（`--node-ip`）设置的 IP 地址。
云控制器管理器通过云驱动验证此 IP 是否有效。

<!--
### batch.kubernetes.io/job-completion-index

Type: Annotation, Label

Example: `batch.kubernetes.io/job-completion-index: "3"`

Used on: Pod

The Job controller in the kube-controller-manager sets this as a label and annotation for Pods
created with Indexed [completion mode](/docs/concepts/workloads/controllers/job/#completion-mode).
-->
### batch.kubernetes.io/job-completion-index {#batch-kubernetes-io-job-completion-index}

类别：注解、标签

例子：`batch.kubernetes.io/job-completion-index: "3"`

用于：Pod

kube-controller-manager 中的 Job 控制器为使用 Indexed
[完成模式](/zh-cn/docs/concepts/workloads/controllers/job/#completion-mode)创建的 Pod
设置此标签和注解。

<!--
Note the [PodIndexLabel](/docs/reference/command-line-tools-reference/feature-gates/)
feature gate must be enabled for this to be added as a pod **label**,
otherwise it will just be an annotation.
-->
请注意，[PodIndexLabel](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)
特性门控必须被启用，才能将其添加为 Pod 的**标签**，否则它只会用作注解。

### batch.kubernetes.io/cronjob-scheduled-timestamp

<!--
Type: Annotation

Example: `batch.kubernetes.io/cronjob-scheduled-timestamp: "2016-05-19T03:00:00-07:00"`

Used on: Jobs and Pods controlled by CronJobs

This annotation is used to record the original (expected) creation timestamp for a Job,
when that Job is part of a CronJob.
The control plane sets the value to that timestamp in RFC3339 format. If the Job belongs to a CronJob
with a timezone specified, then the timestamp is in that timezone. Otherwise, the timestamp is in controller-manager's local time.
-->
类别：注解

例子：`batch.kubernetes.io/cronjob-scheduled-timestamp: "2016-05-19T03:00:00-07:00"`

用于：CronJob 所控制的 Job 和 Pod

此注解在 Job 是 CronJob 的一部分时用于记录 Job 的原始（预期）创建时间戳。
控制平面会将该值设置为 RFC3339 格式的时间戳。如果 Job 属于设置了时区的 CronJob，
则时间戳以该时区为基准。否则，时间戳以 controller-manager 的本地时间为准。

<!--
### kubectl.kubernetes.io/default-container

Type: Annotation

Example: `kubectl.kubernetes.io/default-container: "front-end-app"`

The value of the annotation is the container name that is default for this Pod.
For example, `kubectl logs` or `kubectl exec` without `-c` or `--container` flag
will use this default container.
-->
### kubectl.kubernetes.io/default-container {#kubectl-kubernetes-io-default-container}

类别：注解

例子：`kubectl.kubernetes.io/default-container: "front-end-app"`

此注解的值是此 Pod 的默认容器名称。例如，未指定 `-c` 或 `--container` 标志时执行
`kubectl logs` 或 `kubectl exec` 命令将使用此默认容器。

<!--
### kubectl.kubernetes.io/default-logs-container (deprecated)

Type: Annotation

Example: `kubectl.kubernetes.io/default-logs-container: "front-end-app"`

The value of the annotation is the container name that is the default logging container for this
Pod. For example, `kubectl logs` without `-c` or `--container` flag will use this default
container.
-->
### kubectl.kubernetes.io/default-logs-container（已弃用）   {#default-logs-container}

类别：注解

例子：`kubectl.kubernetes.io/default-logs-container: "front-end-app"`

此注解的值是针对此 Pod 的默认日志记录容器的名称。例如，不带 `-c` 或 `--container`
标志的 `kubectl logs` 将使用此默认容器。

{{< note >}}
<!--
This annotation is deprecated. You should use the
[`kubectl.kubernetes.io/default-container`](#kubectl-kubernetes-io-default-container)
annotation instead. Kubernetes versions 1.25 and newer ignore this annotation.
-->
此注解已被弃用。取而代之的是使用
[`kubectl.kubernetes.io/default-container`](#kubectl-kubernetes-io-default-container) 注解。
Kubernetes v1.25 及更高版本将忽略此注解。
{{< /note >}}

### kubectl.kubernetes.io/last-applied-configuration

<!--
Type: Annotation

Example: _see following snippet_
-->
类别：注解

例子：**参见以下代码片段**

```yaml
    kubectl.kubernetes.io/last-applied-configuration: >
      {"apiVersion":"apps/v1","kind":"Deployment","metadata":{"annotations":{},"name":"example","namespace":"default"},"spec":{"selector":{"matchLabels":{"app.kubernetes.io/name":foo}},"template":{"metadata":{"labels":{"app.kubernetes.io/name":"foo"}},"spec":{"containers":[{"image":"container-registry.example/foo-bar:1.42","name":"foo-bar","ports":[{"containerPort":42}]}]}}}}
```

<!--
Used on: all objects

The kubectl command line tool uses this annotation as a legacy mechanism
to track changes. That mechanism has been superseded by
[Server-side apply](/docs/reference/using-api/server-side-apply/).
-->
用于：所有对象

kubectl 命令行工具使用此注解作为一种旧的机制来跟踪变更。
该机制已被[服务器端应用](/zh-cn/docs/reference/using-api/server-side-apply/)取代。

### kubectl.kubernetes.io/restartedAt {#kubectl-k8s-io-restart-at}

<!--
Type: Annotation

Example: `kubectl.kubernetes.io/restartedAt: "2024-06-21T17:27:41Z"`

Used on: Deployment, ReplicaSet, StatefulSet, DaemonSet, Pod
-->
类别：注解

例子：`kubectl.kubernetes.io/restartedAt: "2024-06-21T17:27:41Z"`

用于：Deployment、ReplicaSet、StatefulSet、DaemonSet、Pod

<!--
This annotation contains the latest restart time of a resource (Deployment, ReplicaSet, StatefulSet or DaemonSet),
where kubectl triggered a rollout in order to force creation of new Pods.
The command `kubectl rollout restart <RESOURCE>` triggers a restart by patching the template
metadata of all the pods of resource with this annotation. In above example the latest restart time is shown as 21st June 2024 at 17:27:41 UTC.
-->
此注解包含资源（Deployment、ReplicaSet、StatefulSet 或 DaemonSet）的最新重启时间，
kubectl 通过触发一次 rollout 来强制创建新的 Pod。
`kubectl rollout restart <RESOURCE>` 命令触发资源重启时给资源的所有 Pod 的模板元数据打上此注解补丁。
在上述例子中，最新的重启时间显示为 2024 年 6 月 21 日 17:27:41 UTC。

<!--
You should not assume that this annotation represents the date / time of the most recent update;
a separate change could have been made since the last manually triggered rollout.

If you manually set this annotation on a Pod, nothing happens. The restarting side effect comes from
how workload management and Pod templating works.
-->
你不应假设此注解代表最近一次更新的日期/时间；在上次手动触发的 rollout 之后，可能还进行了其他独立更改。

如果你手动在 Pod 上设置此注解，什么都不会发生。这个重启的副作用是工作负载管理和 Pod 模板化的工作方式所造成的。

<!--
### endpoints.kubernetes.io/over-capacity

Type: Annotation

Example: `endpoints.kubernetes.io/over-capacity:truncated`

Used on: Endpoints

The {{< glossary_tooltip text="control plane" term_id="control-plane" >}} adds this annotation to
an [Endpoints](/docs/concepts/services-networking/service/#endpoints) object if the associated
{{< glossary_tooltip term_id="service" >}} has more than 1000 backing endpoints.
The annotation indicates that the Endpoints object is over capacity and the number of endpoints
has been truncated to 1000.

If the number of backend endpoints falls below 1000, the control plane removes this annotation.
-->
### endpoints.kubernetes.io/over-capacity {#endpoints-kubernetes-io-over-capacity}

类别：注解

例子：`endpoints.kubernetes.io/over-capacity:truncated`

用于：Endpoints

如果关联的 {{< glossary_tooltip term_id="service" >}} 有超过 1000 个后备端点，
则{{< glossary_tooltip text="控制平面" term_id="control-plane" >}}将此注解添加到
[Endpoints](/zh-cn/docs/concepts/services-networking/service/#endpoints) 对象。
此注解表示 Endpoints 对象已超出容量，并且已将 Endpoints 数截断为 1000。

如果后端端点的数量低于 1000，则控制平面将移除此注解。

### endpoints.kubernetes.io/last-change-trigger-time

<!--
Type: Annotation

Example: `endpoints.kubernetes.io/last-change-trigger-time: "2023-07-20T04:45:21Z"`

Used on: Endpoints

This annotation set to an [Endpoints](/docs/concepts/services-networking/service/#endpoints) object that
represents the timestamp (The timestamp is stored in RFC 3339 date-time string format. For example, '2018-10-22T19:32:52.1Z'). This is timestamp
of the last change in some Pod or Service object, that triggered the change to the Endpoints object.
-->
类别：注解

例子：`endpoints.kubernetes.io/last-change-trigger-time: "2023-07-20T04:45:21Z"`

用于：Endpoints

此注解设置在 [Endpoints](/zh-cn/docs/concepts/services-networking/service/#endpoints) 对象上，
表示时间戳（此时间戳以 RFC 3339 日期时间字符串格式存储。例如，“2018-10-22T19:32:52.1Z”）。
这是某个 Pod 或 Service 对象发生变更并触发 Endpoints 对象变更的时间戳。

<!--
### control-plane.alpha.kubernetes.io/leader (deprecated) {#control-plane-alpha-kubernetes-io-leader}

Type: Annotation

Example: `control-plane.alpha.kubernetes.io/leader={"holderIdentity":"controller-0","leaseDurationSeconds":15,"acquireTime":"2023-01-19T13:12:57Z","renewTime":"2023-01-19T13:13:54Z","leaderTransitions":1}`

Used on: Endpoints
-->
### control-plane.alpha.kubernetes.io/leader（已弃用） {#control-plane-alpha-kubernetes-io-leader}

类别：注解

例子：`control-plane.alpha.kubernetes.io/leader={"holderIdentity":"controller-0","leaseDurationSeconds":15,"acquireTime":"2023-01-19T13:12:57Z","renewTime":"2023-01-19T13:13:54Z","leaderTransitions":1}`

用于：Endpoints

<!--
The {{< glossary_tooltip text="control plane" term_id="control-plane" >}} previously set annotation on
an [Endpoints](/docs/concepts/services-networking/service/#endpoints) object. This annotation provided
the following detail:

- Who is the current leader.
- The time when the current leadership was acquired.
- The duration of the lease (of the leadership) in seconds.
- The time the current lease (the current leadership) should be renewed.
- The number of leadership transitions that happened in the past.

Kubernetes now uses [Leases](/docs/concepts/architecture/leases/) to
manage leader assignment for the Kubernetes control plane.
-->
{{< glossary_tooltip text="控制平面" term_id="control-plane" >}}先前在
[Endpoints](/zh-cn/docs/concepts/services-networking/service/#endpoints)
对象上设置此注解。此注解提供以下细节：

- 当前的领导者是谁。
- 获取当前领导权的时间。
- 租约（领导权）的持续时间，以秒为单位。
- 当前租约（当前领导权）应被续约的时间。
- 过去发生的领导权转换次数。

Kubernetes 现在使用[租约](/zh-cn/docs/concepts/architecture/leases/)来管理 Kubernetes 控制平面的领导者分配。

<!--
### batch.kubernetes.io/job-tracking (deprecated) {#batch-kubernetes-io-job-tracking}

Type: Annotation

Example: `batch.kubernetes.io/job-tracking: ""`

Used on: Jobs

The presence of this annotation on a Job used to indicate that the control plane is
[tracking the Job status using finalizers](/docs/concepts/workloads/controllers/job/#job-tracking-with-finalizers).
-->
### batch.kubernetes.io/job-tracking (已弃用) {#batch-kubernetes-io-job-tracking}

类别：注解

例子：`batch.kubernetes.io/job-tracking: ""`

用于：Job

Job 上存在此注解表明控制平面正在[使用 Finalizer 追踪 Job](/zh-cn/docs/concepts/workloads/controllers/job/#job-tracking-with-finalizers)。

<!--
Adding or removing this annotation no longer has an effect (Kubernetes v1.27 and later)
All Jobs are tracked with finalizers.
-->
添加或删除此注解不再有效（Kubernetes v1.27 及更高版本），
所有 Job 均通过 Finalizer 进行追踪。

<!--
### job-name (deprecated) {#job-name}

Type: Label

Example: `job-name: "pi"`

Used on: Jobs and Pods controlled by Jobs
-->
### job-name (deprecated) {#job-name}

类别：标签

示例：`job-name: "pi"`

用于：由 Jobs 控制的 Jobs 和 Pods

{{< note >}}
<!--
Starting from Kubernetes 1.27, this label is deprecated.
Kubernetes 1.27 and newer ignore this label and use the prefixed `job-name` label.
-->
由 Kubernetes 1.27 开始，此标签被弃用。
Kubernetes 1.27 及更高版本忽略这个标签，改为具有 `job-name` 前缀的标签。
{{< /note >}}

<!--
### controller-uid (deprecated) {#controller-uid}

Type: Label

Example: `controller-uid: "$UID"`

Used on: Jobs and Pods controlled by Jobs
-->
### controller-uid (deprecated) {#controller-uid}

类别：标签

示例：`controller-uid: "$UID"`

用于：由 Jobs 控制的 Job 和 Pod

{{< note >}}
<!--
Starting from Kubernetes 1.27, this label is deprecated.
Kubernetes 1.27 and newer ignore this label and use the prefixed `controller-uid` label.
-->
由 Kubernetes 1.27 开始，此标签被弃用。
Kubernetes 1.27 及更高版本忽略这个标签，改为具有 `controller-uid` 前缀的标签。
{{< /note >}}

<!--
### batch.kubernetes.io/job-name {#batchkubernetesio-job-name}

Type: Label

Example: `batch.kubernetes.io/job-name: "pi"`

Used on: Jobs and Pods controlled by Jobs

This label is used as a user-friendly way to get Pods corresponding to a Job.
The `job-name` comes from the `name` of the Job and allows for an easy way to
get Pods corresponding to the Job.
-->
### batch.kubernetes.io/job-name {#batchkubernetesio-job-name}

类别：标签

示例：`batch.kubernetes.io/job-name: "pi"`

用于：由 Job 控制的 Job 和 Pod

这个标签被用作一种用户友好的方式来获得与某个 Job 相对应的 Pod。
`job-name` 来自 Job 的 `name` 并且允许以一种简单的方式获得与 Job 对应的 Pod。

<!--
### batch.kubernetes.io/controller-uid {#batchkubernetesio-controller-uid}

Type: Label

Example: `batch.kubernetes.io/controller-uid: "$UID"`

Used on: Jobs and Pods controlled by Jobs

This label is used as a programmatic way to get all Pods corresponding to a Job.  
The `controller-uid` is a unique identifier that gets set in the `selector` field so the Job
controller can get all the corresponding Pods.
-->
### batch.kubernetes.io/controller-uid {#batchkubernetesio-controller-uid}

类别：标签

示例：`batch.kubernetes.io/controller-uid: "$UID"`

用于：由 Job 控制的 Job 和 Pod

这个标签被用作一种编程方式来获得对应于某个 Job 的所有 Pod。
`controller-uid` 是在 `selector` 字段中设置的唯一标识符，
因此 Job 控制器可以获取所有对应的 Pod。

<!--
### scheduler.alpha.kubernetes.io/defaultTolerations {#scheduleralphakubernetesio-defaulttolerations}

Type: Annotation

Example: `scheduler.alpha.kubernetes.io/defaultTolerations: '[{"operator": "Equal", "value": "value1", "effect": "NoSchedule", "key": "dedicated-node"}]'`

Used on: Namespace

This annotation requires the [PodTolerationRestriction](/docs/reference/access-authn-authz/admission-controllers/#podtolerationrestriction)
admission controller to be enabled. This annotation key allows assigning tolerations to a
namespace and any new pods created in this namespace would get these tolerations added.
-->
### scheduler.alpha.kubernetes.io/defaultTolerations {#scheduleralphakubernetesio-defaulttolerations}

类别：注解

例子：`scheduler.alpha.kubernetes.io/defaultTolerations: '[{"operator": "Equal", "value": "value1", "effect": "NoSchedule", "key": "dedicated-node"}]'`

用于：Namespace

此注解需要启用
[PodTolerationRestriction](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#podtolerationrestriction)
准入控制器。此注解键允许为某个命名空间分配容忍度，在这个命名空间中创建的所有新 Pod 都会被添加这些容忍度。

<!--
### scheduler.alpha.kubernetes.io/tolerationsWhitelist {#schedulerkubernetestolerations-whitelist}

Type: Annotation

Example: `scheduler.alpha.kubernetes.io/tolerationsWhitelist: '[{"operator": "Exists", "effect": "NoSchedule", "key": "dedicated-node"}]'`

Used on: Namespace

This annotation is only useful when the (Alpha)
[PodTolerationRestriction](/docs/reference/access-authn-authz/admission-controllers/#podtolerationrestriction)
admission controller is enabled. The annotation value is a JSON document that defines a list of
allowed tolerations for the namespace it annotates. When you create a Pod or modify its
tolerations, the API server checks the tolerations to see if they are mentioned in the allow list.
The pod is admitted only if the check succeeds.
-->
### scheduler.alpha.kubernetes.io/tolerationsWhitelist {#schedulerkubernetestolerations-whitelist}

类别：注解

示例：`scheduler.alpha.kubernetes.io/tolerationsWhitelist: '[{"operator": "Exists", "effect": "NoSchedule", "key": "dedicated-node"}]'`

用于：命名空间

此注解只有在启用（Alpha）
[PodTolerationRestriction](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#podtolerationrestriction)
控制器时才生效。注解值是一个 JSON 文档，它为它所注解的命名空间定义了一个允许容忍的列表。
当你创建一个 Pod 或修改其容忍度时，API 服务器将检查容忍度，以查看它们是否在允许列表中。
只有在检查成功的情况下，Pod 才被允操作。

<!--
### scheduler.alpha.kubernetes.io/preferAvoidPods (deprecated) {#scheduleralphakubernetesio-preferavoidpods}

Type: Annotation

Used on: Node

This annotation requires the [NodePreferAvoidPods scheduling plugin](/docs/reference/scheduling/config/#scheduling-plugins)
to be enabled. The plugin is deprecated since Kubernetes 1.22.
Use [Taints and Tolerations](/docs/concepts/scheduling-eviction/taint-and-toleration/) instead.
-->
### scheduler.alpha.kubernetes.io/preferAvoidPods（已弃用） {#scheduleralphakubernetesio-preferavoidpods}

类别：注解

用于：Node

此注解需要启用 [NodePreferAvoidPods 调度插件](/zh-cn/docs/reference/scheduling/config/#scheduling-plugins)。
该插件自 Kubernetes 1.22 起已被弃用。
请改用[污点和容忍度](/zh-cn/docs/concepts/scheduling-eviction/taint-and-toleration/)。

<!--
### node.kubernetes.io/not-ready

Type: Taint

Example: `node.kubernetes.io/not-ready: "NoExecute"`

Used on: Node

The Node controller detects whether a Node is ready by monitoring its health
and adds or removes this taint accordingly.
-->
### node.kubernetes.io/not-ready {#node-kubernetes-io-not-ready}

类别：污点

例子：`node.kubernetes.io/not-ready: "NoExecute"`

用于：Node

Node 控制器通过监控 Node 的健康状况来检测 Node 是否准备就绪，并相应地添加或删除此污点。

<!--
### node.kubernetes.io/unreachable

Type: Taint

Example: `node.kubernetes.io/unreachable: "NoExecute"`

Used on: Node

The Node controller adds the taint to a Node corresponding to the
[NodeCondition](/docs/concepts/architecture/nodes/#condition) `Ready` being `Unknown`.
-->
### node.kubernetes.io/unreachable {#node-kubernetes-io-unreachable}

类别：污点

例子：`node.kubernetes.io/unreachable: "NoExecute"`

用于：Node

Node 控制器将此污点添加到对应[节点状况](/zh-cn/docs/concepts/architecture/nodes/#condition)
`Ready` 为 `Unknown` 的 Node 上。

<!--
### node.kubernetes.io/unschedulable

Type: Taint

Example: `node.kubernetes.io/unschedulable: "NoSchedule"`

Used on: Node

The taint will be added to a node when initializing the node to avoid race condition.
-->
### node.kubernetes.io/unschedulable {#node-kubernetes-io-unschedulable}

类别：污点

例子：`node.kubernetes.io/unschedulable: "NoSchedule"`

用于：Node

在初始化 Node 期间，为避免竞争条件，此污点将被添加到 Node 上。

<!--
### node.kubernetes.io/memory-pressure

Type: Taint

Example: `node.kubernetes.io/memory-pressure: "NoSchedule"`

Used on: Node

The kubelet detects memory pressure based on `memory.available` and `allocatableMemory.available`
observed on a Node. The observed values are then compared to the corresponding thresholds that can
be set on the kubelet to determine if the Node condition and taint should be added/removed.
-->
### node.kubernetes.io/memory-pressure {#node-kubernetes-io-memory-pressure}

类别：污点

例子：`node.kubernetes.io/memory-pressure: "NoSchedule"`

用于：Node

kubelet 根据在 Node 上观察到的 `memory.available` 和 `allocatableMemory.available` 检测内存压力。
然后将观察到的值与可以在 kubelet 上设置的相应阈值进行比较，以确定是否应添加/删除 Node 状况和污点。

<!--
### node.kubernetes.io/disk-pressure

Type: Taint

Example: `node.kubernetes.io/disk-pressure :"NoSchedule"`

Used on: Node

The kubelet detects disk pressure based on `imagefs.available`, `imagefs.inodesFree`,
`nodefs.available` and `nodefs.inodesFree`(Linux only) observed on a Node.
The observed values are then compared to the corresponding thresholds that can be set on the
kubelet to determine if the Node condition and taint should be added/removed.
-->
### node.kubernetes.io/disk-pressure {#node-kubernetes-io-disk-pressure}

类别：污点

例子：`node.kubernetes.io/disk-pressure :"NoSchedule"`

用于：Node

kubelet 根据在 Node 上观察到的 `imagefs.available`、`imagefs.inodesFree`、`nodefs.available`
和 `nodefs.inodesFree`（仅限 Linux ）检测磁盘压力。
然后将观察到的值与可以在 kubelet 上设置的相应阈值进行比较，以确定是否应添加/删除 Node 状况和污点。

<!--
### node.kubernetes.io/network-unavailable

Type: Taint

Example: `node.kubernetes.io/network-unavailable: "NoSchedule"`

Used on: Node

This is initially set by the kubelet when the cloud provider used indicates a requirement for
additional network configuration. Only when the route on the cloud is configured properly will the
taint be removed by the cloud provider.
-->
### node.kubernetes.io/network-unavailable {#node-kubernetes-io-network-unavailable}

类别：污点

例子：`node.kubernetes.io/network-unavailable: "NoSchedule"`

用于：Node

当使用的云驱动指示需要额外的网络配置时，此注解最初由 kubelet 设置。
只有云上的路由被正确地配置了，此污点才会被云驱动移除。

<!--
### node.kubernetes.io/pid-pressure

Type: Taint

Example: `node.kubernetes.io/pid-pressure: "NoSchedule"`

Used on: Node

The kubelet checks D-value of the size of `/proc/sys/kernel/pid_max` and the PIDs consumed by
Kubernetes on a node to get the number of available PIDs that referred to as the `pid.available`
metric. The metric is then compared to the corresponding threshold that can be set on the kubelet
to determine if the node condition and taint should be added/removed.
-->
### node.kubernetes.io/pid-pressure {#node-kubernetes-io-pid-pressure}

类别：污点

例子：`node.kubernetes.io/pid-pressure: "NoSchedule"`

用于：Node

kubelet 检查 `/proc/sys/kernel/pid_max` 大小的 D 值和 Kubernetes 在 Node 上消耗的 PID，
以获取可用 PID 数量，并将其作为 `pid.available` 指标值。
然后该指标与在 kubelet 上设置的相应阈值进行比较，以确定是否应该添加/删除 Node 状况和污点。

### node.kubernetes.io/out-of-service {#out-of-service}

<!--
Type: Taint

Example: `node.kubernetes.io/out-of-service:NoExecute`

Used on: Node

A user can manually add the taint to a Node marking it out-of-service.
If the `NodeOutOfServiceVolumeDetach`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
is enabled on `kube-controller-manager`, and a Node is marked out-of-service with this taint,
the Pods on the node will be forcefully deleted if there are no matching tolerations on it and
volume detach operations for the Pods terminating on the node will happen immediately.
This allows the Pods on the out-of-service node to recover quickly on a different node.
-->
类别：污点

例子：`node.kubernetes.io/out-of-service:NoExecute`

用于：Node

用户可以手动将污点添加到节点，将其标记为停止服务。
如果 `kube-controller-manager` 上启用了 `NodeOutOfServiceVolumeDetach`
[特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)，
并且一个节点被这个污点标记为停止服务，如果节点上的 Pod 没有对应的容忍度，
这类 Pod 将被强制删除，并且，针对在节点上被终止 Pod 的卷分离操作将被立即执行。

{{< caution >}}
<!--
Refer to [Non-graceful node shutdown](/docs/concepts/architecture/nodes/#non-graceful-node-shutdown)
for further details about when and how to use this taint.
-->
有关何时以及如何使用此污点的更多详细信息，请参阅[非正常节点关闭](/zh-cn/docs/concepts/architecture/nodes/#non-graceful-node-shutdown)。
{{< /caution >}}

<!--
### node.cloudprovider.kubernetes.io/uninitialized

Type: Taint

Example: `node.cloudprovider.kubernetes.io/uninitialized: "NoSchedule"`

Used on: Node

Sets this taint on a Node to mark it as unusable, when kubelet is started with the "external"
cloud provider, until a controller from the cloud-controller-manager initializes this Node, and
then removes the taint.
-->
### node.cloudprovider.kubernetes.io/uninitialized {#node-cloudprovider-kubernetes-io-shutdown}

类别：污点

例子：`node.cloudprovider.kubernetes.io/uninitialized: "NoSchedule"`

用于：Node

在使用“外部”云驱动启动 kubelet 时，在 Node 上设置此污点以将其标记为不可用，直到来自
cloud-controller-manager 的控制器初始化此 Node，然后移除污点。

<!--
### node.cloudprovider.kubernetes.io/shutdown

Type: Taint

Example: `node.cloudprovider.kubernetes.io/shutdown: "NoSchedule"`

Used on: Node

If a Node is in a cloud provider specified shutdown state, the Node gets tainted accordingly
with `node.cloudprovider.kubernetes.io/shutdown` and the taint effect of `NoSchedule`.
-->
### node.cloudprovider.kubernetes.io/shutdown {#node-cloudprovider-kubernetes-io-shutdown}

类别：污点

例子：`node.cloudprovider.kubernetes.io/shutdown: "NoSchedule"`

用于：Node

如果 Node 处于云驱动所指定的关闭状态，则 Node 会相应地被设置污点，对应的污点和效果为
`node.cloudprovider.kubernetes.io/shutdown` 和 `NoSchedule`。

<!--
### feature.node.kubernetes.io/*

Type: Label

Example: `feature.node.kubernetes.io/network-sriov.capable: "true"`

Used on: Node

These labels are used by the Node Feature Discovery (NFD) component to advertise
features on a node. All built-in labels use the `feature.node.kubernetes.io` label
namespace and have the format `feature.node.kubernetes.io/<feature-name>: "true"`.
NFD has many extension points for creating vendor and application-specific labels.
For details, see the [customization guide](https://kubernetes-sigs.github.io/node-feature-discovery/v0.12/usage/customization-guide).
-->
### feature.node.kubernetes.io/*

类别：标签

示例：`feature.node.kubernetes.io/network-sriov.capable: "true"`

用于：节点

这些特性作为标签在运行 NFD 的节点上的 KubernetesNode 对象中公布。
所有内置的标签都使用 feature.node.kubernetes.io 标签命名空间，并且格式为
`feature.node.kubernetes.io/<feature-name>: <true>`。
NFD 有许多用于创建特定于供应商和应用程序的标签的扩展点。
有关详细信息，请参阅[定制资源](https://kubernetes-sigs.github.io/node-feature-discovery/v0.12/usage/customization-guide).

<!--
### nfd.node.kubernetes.io/master.version

Type: Annotation

Example: `nfd.node.kubernetes.io/master.version: "v0.6.0"`

Used on: Node

For node(s) where the Node Feature Discovery (NFD)
[master](https://kubernetes-sigs.github.io/node-feature-discovery/stable/usage/nfd-master.html)
is scheduled, this annotation records the version of the NFD master.
It is used for informative use only.
-->
### nfd.node.kubernetes.io/master.version

类别：注解

示例：`nfd.node.kubernetes.io/master.version: "v0.6.0"`

用于：节点

对于调度 NFD-[master](https://kubernetes-sigs.github.io/node-feature-discovery/stable/usage/nfd-master.html)的节点，
此注解记录 NFD-master 的版本。它仅用于提供信息。

<!--
### nfd.node.kubernetes.io/worker.version

Type: Annotation

Example: `nfd.node.kubernetes.io/worker.version: "v0.4.0"`

Used on: Nodes

This annotation records the version for a Node Feature Discovery's
[worker](https://kubernetes-sigs.github.io/node-feature-discovery/stable/usage/nfd-worker.html)
if there is one running on a node. It's used for informative use only.
-->
### nfd.node.kubernetes.io/worker.version

类别：注解

示例：`nfd.node.kubernetes.io/worker.version: "v0.4.0"`

用于：节点

这个注解记录 NFD-[worker](https://kubernetes-sigs.github.io/node-feature-discovery/stable/usage/nfd-worker.html)
的版本(如果在节点上运行了一个 NFD-worker 的话)。
它只用于提供信息。

<!--
### nfd.node.kubernetes.io/feature-labels

Type: Annotation

Example: `nfd.node.kubernetes.io/feature-labels: "cpu-cpuid.ADX,cpu-cpuid.AESNI,cpu-hardware_multithreading,kernel-version.full"`

Used on: Nodes

This annotation records a comma-separated list of node feature labels managed by
[Node Feature Discovery](https://kubernetes-sigs.github.io/node-feature-discovery/) (NFD).
NFD uses this for an internal mechanism. You should not edit this annotation yourself.
-->
### nfd.node.kubernetes.io/feature-labels

类别：注解

示例：`nfd.node.kubernetes.io/feature-labels: "cpu-cpuid.ADX,cpu-cpuid.AESNI,cpu-hardware_multithreading,kernel-version.full"`

用于：节点

此注解记录由 [Node Feature Discovery](https://kubernetes-sigs.github.io/node-feature-discovery/) (NFD)
管理的以逗号分隔的节点特性标签列表。NFD 将其用于内部机制。你不应该自己编辑这个注解。

<!--
### nfd.node.kubernetes.io/extended-resources

Type: Annotation

Example: `nfd.node.kubernetes.io/extended-resources: "accelerator.acme.example/q500,example.com/coprocessor-fx5"`

Used on: Nodes

This annotation records a comma-separated list of
[extended resources](/docs/concepts/configuration/manage-resources-containers/#extended-resources)
managed by [Node Feature Discovery](https://kubernetes-sigs.github.io/node-feature-discovery/) (NFD).
NFD uses this for an internal mechanism. You should not edit this annotation yourself.
-->
### nfd.node.kubernetes.io/extended-resources

类别：注解

示例：`nfd.node.kubernetes.io/extended-resources: "accelerator.acme.example/q500,example.com/coprocessor-fx5"`

用于：节点

此注解记录由 [Node Feature Discovery](https://kubernetes-sigs.github.io/node-feature-discovery/) (NFD)
管理的以逗号分隔的[扩展资源](/zh-cn/docs/concepts/configuration/manage-resources-containers/#extended-resources)列表。
NFD 将其用于内部机制。你不应该自己编辑这个注解。

### nfd.node.kubernetes.io/node-name

<!--
Type: Label

Example: `nfd.node.kubernetes.io/node-name: node-1`

Used on: Nodes

It specifies which node the NodeFeature object is targeting.
Creators of NodeFeature objects must set this label and 
consumers of the objects are supposed to use the label for 
filtering features designated for a certain node.
-->
类别：标签

例子：`nfd.node.kubernetes.io/node-name: node-1`

用于：Node

此标签指定哪个节点是 NodeFeature 对象的目标节点。
NodeFeature 对象的创建者必须设置此标签，而此对象的使用者应该使用此标签过滤为某个节点指定的特性。

{{< note >}}
<!--
These Node Feature Discovery (NFD) labels or annotations only apply to 
the nodes where NFD is running. To learn more about NFD and 
its components go to its official [documentation](https://kubernetes-sigs.github.io/node-feature-discovery/stable/get-started/).
-->
这些节点特性发现（Node Feature Discovery, NFD）的标签或注解仅适用于运行 NFD 的节点。
要了解关于 NFD 及其组件的信息，请访问官方
[文档](https://kubernetes-sigs.github.io/node-feature-discovery/stable/get-started/)。
{{< /note >}}

### service.beta.kubernetes.io/aws-load-balancer-access-log-emit-interval (beta) {#service-beta-kubernetes-io-aws-load-balancer-access-log-emit-interval}

<!--
Example: `service.beta.kubernetes.io/aws-load-balancer-access-log-emit-interval: "5"`

Used on: Service

The cloud controller manager integration with AWS elastic load balancing configures
the load balancer for a Service based on this annotation. The value determines
how often the load balancer writes log entries. For example, if you set the value
to 5, the log writes occur 5 seconds apart.
-->
示例：`service.beta.kubernetes.io/aws-load-balancer-access-log-emit-interval: "5"`

用于：Service

与 AWS 弹性负载均衡集成的云控制器管理器会根据此注解为 Service 配置负载均衡器。
此注解值决定负载均衡器写入日志条目的频率。例如，如果你将该值设置为 5，则日志的写入间隔为 5 秒。

### service.beta.kubernetes.io/aws-load-balancer-access-log-enabled (beta) {#service-beta-kubernetes-io-aws-load-balancer-access-log-enabled}

<!--
Example: `service.beta.kubernetes.io/aws-load-balancer-access-log-enabled: "false"`

Used on: Service

The cloud controller manager integration with AWS elastic load balancing configures
the load balancer for a Service based on this annotation. Access logging is enabled
if you set the annotation to "true".
-->
示例：`service.beta.kubernetes.io/aws-load-balancer-access-log-enabled: "false"`

用于：Service

与 AWS 弹性负载均衡集成的云控制器管理器会根据此注解为 Service 配置负载均衡器。
如果你将此注解设置为 "true"，则访问日志将被启用。

### service.beta.kubernetes.io/aws-load-balancer-access-log-s3-bucket-name (beta) {#service-beta-kubernetes-io-aws-load-balancer-access-log-s3-bucket-name}

<!--
Example: `service.beta.kubernetes.io/aws-load-balancer-access-log-enabled: example`

Used on: Service

The cloud controller manager integration with AWS elastic load balancing configures
the load balancer for a Service based on this annotation. The load balancer
writes logs to an S3 bucket with the name you specify.
-->
示例：`service.beta.kubernetes.io/aws-load-balancer-access-log-enabled: example`

用于：Service

与 AWS 弹性负载均衡集成的云控制器管理器会根据此注解为 Service 配置负载均衡器。
负载均衡器将日志写入到一个你指定名称的 S3 桶。

### service.beta.kubernetes.io/aws-load-balancer-access-log-s3-bucket-prefix (beta) {#service-beta-kubernetes-io-aws-load-balancer-access-log-s3-bucket-prefix}

<!--
Example: `service.beta.kubernetes.io/aws-load-balancer-access-log-enabled: "/example"`

Used on: Service

The cloud controller manager integration with AWS elastic load balancing configures
the load balancer for a Service based on this annotation. The load balancer
writes log objects with the prefix that you specify.
-->
示例：`service.beta.kubernetes.io/aws-load-balancer-access-log-enabled: "/example"`

用于：Service

与 AWS 弹性负载均衡集成的云控制器管理器会根据此注解为 Service 配置负载均衡器。
负载均衡器用你指定的前缀写入日志对象。

### service.beta.kubernetes.io/aws-load-balancer-additional-resource-tags (beta) {#service-beta-kubernetes-io-aws-load-balancer-additional-resource-tags}

<!--
Example: `service.beta.kubernetes.io/aws-load-balancer-additional-resource-tags: "Environment=demo,Project=example"`

Used on: Service

The cloud controller manager integration with AWS elastic load balancing configures
tags (an AWS concept) for a load balancer based on the comma-separated key/value
pairs in the value of this annotation.
-->
示例：`service.beta.kubernetes.io/aws-load-balancer-additional-resource-tags: "Environment=demo,Project=example"`

用于：Service

与 AWS 弹性负载均衡集成的云控制器管理器会根据此注解取值中逗号分隔的键/值对为负载均衡器配置标记（这是 AWS 的一个概念）。

### service.beta.kubernetes.io/aws-load-balancer-alpn-policy (beta) {#service-beta-kubernetes-io-aws-load-balancer-alpn-policy}

<!--
Example: `service.beta.kubernetes.io/aws-load-balancer-alpn-policy: HTTP2Optional`

Used on: Service

The [AWS load balancer controller](https://kubernetes-sigs.github.io/aws-load-balancer-controller/)
uses this annotation.
See [annotations](https://kubernetes-sigs.github.io/aws-load-balancer-controller/latest/guide/service/annotations/)
in the AWS load balancer controller documentation.
-->
示例：`service.beta.kubernetes.io/aws-load-balancer-alpn-policy: HTTP2Optional`

用于：Service

[AWS 负载均衡器控制器](https://kubernetes-sigs.github.io/aws-load-balancer-controller/)使用此注解。
参见 AWS 负载均衡器控制器文档中的[注解](https://kubernetes-sigs.github.io/aws-load-balancer-controller/latest/guide/service/annotations/)。

### service.beta.kubernetes.io/aws-load-balancer-attributes (beta) {#service-beta-kubernetes-io-aws-load-balancer-attributes}

<!--
Example: `service.beta.kubernetes.io/aws-load-balancer-attributes: "deletion_protection.enabled=true"`

Used on: Service

The [AWS load balancer controller](https://kubernetes-sigs.github.io/aws-load-balancer-controller/)
uses this annotation.
See [annotations](https://kubernetes-sigs.github.io/aws-load-balancer-controller/latest/guide/service/annotations/)
in the AWS load balancer controller documentation.
-->
示例：`service.beta.kubernetes.io/aws-load-balancer-attributes: "deletion_protection.enabled=true"`

用于：Service

[AWS 负载均衡器控制器](https://kubernetes-sigs.github.io/aws-load-balancer-controller/)使用此注解。
参见 AWS 负载均衡器控制器文档中的[注解](https://kubernetes-sigs.github.io/aws-load-balancer-controller/latest/guide/service/annotations/)。

### service.beta.kubernetes.io/aws-load-balancer-backend-protocol (beta) {#service-beta-kubernetes-io-aws-load-balancer-backend-protocol}

<!--
Example: `service.beta.kubernetes.io/aws-load-balancer-backend-protocol: tcp`

Used on: Service

The cloud controller manager integration with AWS elastic load balancing configures
the load balancer listener based on the value of this annotation.
-->
示例：`service.beta.kubernetes.io/aws-load-balancer-backend-protocol: tcp`

用于：Service

与 AWS 弹性负载均衡集成的云控制器管理器会根据此注解取值配置负载均衡器的监听器。

### service.beta.kubernetes.io/aws-load-balancer-connection-draining-enabled (beta) {#service-beta-kubernetes-io-aws-load-balancer-connection-draining-enabled}

<!--
Example: `service.beta.kubernetes.io/aws-load-balancer-connection-draining-enabled: "false"`

Used on: Service

The cloud controller manager integration with AWS elastic load balancing configures
the load balancer based on this annotation. The load balancer's connection draining
setting depends on the value you set.
-->
示例：`service.beta.kubernetes.io/aws-load-balancer-connection-draining-enabled: "false"`

用于：Service

与 AWS 弹性负载均衡集成的云控制器管理器会根据此注解取值配置负载均衡器。
负载均衡器的连接排空设置取决于你所设置的值。

### service.beta.kubernetes.io/aws-load-balancer-connection-draining-timeout (beta) {#service-beta-kubernetes-io-aws-load-balancer-connection-draining-timeout}

<!--
Example: `service.beta.kubernetes.io/aws-load-balancer-connection-draining-timeout: "60"`

Used on: Service

If you configure [connection draining](#service-beta-kubernetes-io-aws-load-balancer-connection-draining-enabled)
for a Service of `type: LoadBalancer`, and you use the AWS cloud, the integration configures
the draining period based on this annotation. The value you set determines the draining
timeout in seconds.
-->
示例：`service.beta.kubernetes.io/aws-load-balancer-connection-draining-timeout: "60"`

用于：Service

如果你为 `type: LoadBalancer` 的服务配置[连接排空](#service-beta-kubernetes-io-aws-load-balancer-connection-draining-enabled)，
且你使用 AWS 云服务，则集成机制将根据此注解来配置排空期。
你所设置的值决定了排空超时秒数。

### service.beta.kubernetes.io/aws-load-balancer-ip-address-type (beta) {#service-beta-kubernetes-io-aws-load-balancer-ip-address-type}

<!--
Example: `service.beta.kubernetes.io/aws-load-balancer-ip-address-type: ipv4`

Used on: Service

The [AWS load balancer controller](https://kubernetes-sigs.github.io/aws-load-balancer-controller/)
uses this annotation.
See [annotations](https://kubernetes-sigs.github.io/aws-load-balancer-controller/latest/guide/service/annotations/)
in the AWS load balancer controller documentation.
-->
示例：`service.beta.kubernetes.io/aws-load-balancer-ip-address-type: ipv4`

用于：Service

[AWS 负载均衡器控制器](https://kubernetes-sigs.github.io/aws-load-balancer-controller/)使用此注解。
参见 AWS 负载均衡器控制器文档中的[注解](https://kubernetes-sigs.github.io/aws-load-balancer-controller/latest/guide/service/annotations/)。

### service.beta.kubernetes.io/aws-load-balancer-connection-idle-timeout (beta) {#service-beta-kubernetes-io-aws-load-balancer-connection-idle-timeout}

<!--
Example: `service.beta.kubernetes.io/aws-load-balancer-connection-idle-timeout: "60"`

Used on: Service

The cloud controller manager integration with AWS elastic load balancing configures
a load balancer based on this annotation. The load balancer has a configured idle
timeout period (in seconds) that applies to its connections. If no data has been
sent or received by the time that the idle timeout period elapses, the load balancer
closes the connection.
-->
示例：`service.beta.kubernetes.io/aws-load-balancer-connection-idle-timeout: "60"`

用于：Service

与 AWS 弹性负载均衡集成的云控制器管理器会根据此注解配置负载均衡器。
负载均衡器配置了一个空闲超时时间（以秒为单位）应用到其连接。
如果在空闲超时时间到期之前没有发送或接收任何数据，负载均衡器将关闭连接。

### service.beta.kubernetes.io/aws-load-balancer-cross-zone-load-balancing-enabled (beta) {#service-beta-kubernetes-io-aws-load-balancer-cross-zone-load-balancing-enabled}

<!--
Example: `service.beta.kubernetes.io/aws-load-balancer-cross-zone-load-balancing-enabled: "true"`

Used on: Service

The cloud controller manager integration with AWS elastic load balancing configures
a load balancer based on this annotation. If you set this annotation to "true",
each load balancer node distributes requests evenly across the registered targets
in all enabled [availability zones](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html#concepts-availability-zones).
If you disable cross-zone load balancing, each load balancer node distributes requests
evenly across the registered targets in its availability zone only.
-->
示例：`service.beta.kubernetes.io/aws-load-balancer-cross-zone-load-balancing-enabled: "true"`

用于：Service

与 AWS 弹性负载均衡集成的云控制器管理器会根据此注解配置负载均衡器。
如果你将此注解设置为 "true"，每个负载均衡器节点将在所有启用的
[可用区](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html#concepts-availability-zones)中的注册目标上均匀地分发请求。
如果你禁用跨区负载均衡，则每个负载均衡器节点仅在其可用区中跨注册目标均匀地分发请求。

### service.beta.kubernetes.io/aws-load-balancer-eip-allocations (beta) {#service-beta-kubernetes-io-aws-load-balancer-eip-allocations}

<!--
Example: `service.beta.kubernetes.io/aws-load-balancer-eip-allocations: "eipalloc-01bcdef23bcdef456,eipalloc-def1234abc4567890"`

Used on: Service

The cloud controller manager integration with AWS elastic load balancing configures
a load balancer based on this annotation. The value is a comma-separated list
of elastic IP address allocation IDs.

This annotation is only relevant for Services of `type: LoadBalancer`, where
the load balancer is an AWS Network Load Balancer.
-->
示例：`service.beta.kubernetes.io/aws-load-balancer-eip-allocations: "eipalloc-01bcdef23bcdef456,eipalloc-def1234abc4567890"`

用于：Service

与 AWS 弹性负载均衡集成的云控制器管理器会根据此注解配置负载均衡器。
取值是逗号分隔的弹性 IP 地址分配 ID 列表。

此注解仅与 `type: LoadBalancer` 的 Service 相关，其中负载均衡器是 AWS Network Load Balancer。

### service.beta.kubernetes.io/aws-load-balancer-extra-security-groups (beta) {#service-beta-kubernetes-io-aws-load-balancer-extra-security-groups}

<!--
Example: `service.beta.kubernetes.io/aws-load-balancer-extra-security-groups: "sg-12abcd3456,sg-34dcba6543"`

Used on: Service

The cloud controller manager integration with AWS elastic load balancing configures
a load balancer based on this annotation. The annotation value is a comma-separated
list of extra AWS VPC security groups to configure for the load balancer.
-->
示例：`service.beta.kubernetes.io/aws-load-balancer-extra-security-groups: "sg-12abcd3456,sg-34dcba6543"`

用于：Service

与 AWS 弹性负载均衡集成的云控制器管理器会根据此注解配置负载均衡器。
此注解值是一个逗号分隔的附加 AWS VPC 安全组列表，用于配置负载均衡器。

### service.beta.kubernetes.io/aws-load-balancer-healthcheck-healthy-threshold (beta) {#service-beta-kubernetes-io-aws-load-balancer-healthcheck-healthy-threshold}

<!--
Example: `service.beta.kubernetes.io/aws-load-balancer-healthcheck-healthy-threshold: "3"`

Used on: Service

The cloud controller manager integration with AWS elastic load balancing configures
a load balancer based on this annotation. The annotation value specifies the number of
successive successful health checks required for a backend to be considered healthy
for traffic.
-->
示例：`service.beta.kubernetes.io/aws-load-balancer-healthcheck-healthy-threshold: "3"`

用于：Service

与 AWS 弹性负载均衡集成的云控制器管理器会根据此注解配置负载均衡器。
此注解值指定后端需要连续成功多少次健康检查才能被视为流量健康。

### service.beta.kubernetes.io/aws-load-balancer-healthcheck-interval (beta) {#service-beta-kubernetes-io-aws-load-balancer-healthcheck-interval}

<!--
Example: `service.beta.kubernetes.io/aws-load-balancer-healthcheck-interval: "30"`

Used on: Service

The cloud controller manager integration with AWS elastic load balancing configures
a load balancer based on this annotation. The annotation value specifies the interval,
in seconds, between health check probes made by the load balancer.
-->
示例：`service.beta.kubernetes.io/aws-load-balancer-healthcheck-interval: "30"`

用于：Service

与 AWS 弹性负载均衡集成的云控制器管理器会根据此注解配置负载均衡器。
此注解值指定负载均衡器进行健康检查探测之间的间隔秒数。

### service.beta.kubernetes.io/aws-load-balancer-healthcheck-path (beta) {#service-beta-kubernetes-io-aws-load-balancer-healthcheck-papth}

<!--
Example: `service.beta.kubernetes.io/aws-load-balancer-healthcheck-path: /healthcheck`

Used on: Service

The cloud controller manager integration with AWS elastic load balancing configures
a load balancer based on this annotation. The annotation value determines the
path part of the URL that is used for HTTP health checks.
-->
示例：`service.beta.kubernetes.io/aws-load-balancer-healthcheck-path: /healthcheck`

用于：Service

与 AWS 弹性负载均衡集成的云控制器管理器会根据此注解配置负载均衡器。
此注解值决定了 HTTP 健康检查所用的 URL 的路径部分。

### service.beta.kubernetes.io/aws-load-balancer-healthcheck-port (beta) {#service-beta-kubernetes-io-aws-load-balancer-healthcheck-port}

<!--
Example: `service.beta.kubernetes.io/aws-load-balancer-healthcheck-port: "24"`

Used on: Service

The cloud controller manager integration with AWS elastic load balancing configures
a load balancer based on this annotation. The annotation value determines which
port the load balancer connects to when performing health checks.
-->
示例：`service.beta.kubernetes.io/aws-load-balancer-healthcheck-port: "24"`

用于：Service

与 AWS 弹性负载均衡集成的云控制器管理器会根据此注解配置负载均衡器。
此注解值决定了负载均衡器执行健康检查时连接到哪个端口。

### service.beta.kubernetes.io/aws-load-balancer-healthcheck-protocol (beta) {#service-beta-kubernetes-io-aws-load-balancer-healthcheck-protocol}

<!--
Example: `service.beta.kubernetes.io/aws-load-balancer-healthcheck-protocol: TCP`

Used on: Service

The cloud controller manager integration with AWS elastic load balancing configures
a load balancer based on this annotation. The annotation value determines how the
load balancer checks the health of backend targets.
-->
示例：`service.beta.kubernetes.io/aws-load-balancer-healthcheck-protocol: TCP`

用于：Service

与 AWS 弹性负载均衡集成的云控制器管理器会根据此注解配置负载均衡器。
此注解值决定了负载均衡器如何检查后端目标的健康。

### service.beta.kubernetes.io/aws-load-balancer-healthcheck-timeout (beta) {#service-beta-kubernetes-io-aws-load-balancer-healthcheck-timeout}

<!--
Example: `service.beta.kubernetes.io/aws-load-balancer-healthcheck-timeout: "3"`

Used on: Service

The cloud controller manager integration with AWS elastic load balancing configures
a load balancer based on this annotation. The annotation value specifies the number
of seconds before a probe that hasn't yet succeeded is automatically treated as
having failed.
-->
示例：`service.beta.kubernetes.io/aws-load-balancer-healthcheck-timeout: "3"`

用于：Service

与 AWS 弹性负载均衡集成的云控制器管理器会根据此注解配置负载均衡器。
此注解值指定探测还未成功之前将自动视为已失败的秒数。

### service.beta.kubernetes.io/aws-load-balancer-healthcheck-unhealthy-threshold (beta) {#service-beta-kubernetes-io-aws-load-balancer-healthcheck-unhealthy-threshold}

<!--
Example: `service.beta.kubernetes.io/aws-load-balancer-healthcheck-unhealthy-threshold: "3"`

Used on: Service

The cloud controller manager integration with AWS elastic load balancing configures
a load balancer based on this annotation. The annotation value specifies the number of
successive unsuccessful health checks required for a backend to be considered unhealthy
for traffic.
-->
示例：`service.beta.kubernetes.io/aws-load-balancer-healthcheck-unhealthy-threshold: "3"`

用于：Service

与 AWS 弹性负载均衡集成的云控制器管理器会根据此注解配置负载均衡器。
此注解值指定后端需要连续多少次失败的健康检查才被视为流量不健康。

### service.beta.kubernetes.io/aws-load-balancer-internal (beta) {#service-beta-kubernetes-io-aws-load-balancer-internal}

<!--
Example: `service.beta.kubernetes.io/aws-load-balancer-internal: "true"`

Used on: Service

The cloud controller manager integration with AWS elastic load balancing configures
a load balancer based on this annotation. When you set this annotation to "true",
the integration configures an internal load balancer.

If you use the [AWS load balancer controller](https://kubernetes-sigs.github.io/aws-load-balancer-controller/),
see [`service.beta.kubernetes.io/aws-load-balancer-scheme`](#service-beta-kubernetes-io-aws-load-balancer-scheme).
-->
示例：`service.beta.kubernetes.io/aws-load-balancer-internal: "true"`

用于：Service

与 AWS 弹性负载均衡集成的云控制器管理器会根据此注解配置负载均衡器。
当你将此注解设置为 "true" 时，此集成机制将配置一个内部负载均衡器。

如果你使用 [AWS 负载均衡器控制器](https://kubernetes-sigs.github.io/aws-load-balancer-controller/)，
参见 [`service.beta.kubernetes.io/aws-load-balancer-scheme`](#service-beta-kubernetes-io-aws-load-balancer-scheme)。

### service.beta.kubernetes.io/aws-load-balancer-manage-backend-security-group-rules (beta) {#service-beta-kubernetes-io-aws-load-balancer-manage-backend-security-group-rules}

<!--
Example: `service.beta.kubernetes.io/aws-load-balancer-manage-backend-security-group-rules: "true"`

Used on: Service

The [AWS load balancer controller](https://kubernetes-sigs.github.io/aws-load-balancer-controller/)
uses this annotation.
See [annotations](https://kubernetes-sigs.github.io/aws-load-balancer-controller/latest/guide/service/annotations/)
in the AWS load balancer controller documentation.
-->
示例：`service.beta.kubernetes.io/aws-load-balancer-manage-backend-security-group-rules: "true"`

用于：Service

[AWS 负载均衡器控制器](https://kubernetes-sigs.github.io/aws-load-balancer-controller/)使用此注解。
参见 AWS 负载均衡器控制器文档中的[注解](https://kubernetes-sigs.github.io/aws-load-balancer-controller/latest/guide/service/annotations/)。

### service.beta.kubernetes.io/aws-load-balancer-name (beta) {#service-beta-kubernetes-io-aws-load-balancer-name}

<!--
Example: `service.beta.kubernetes.io/aws-load-balancer-name: my-elb`

Used on: Service

If you set this annotation on a Service, and you also annotate that Service with
`service.beta.kubernetes.io/aws-load-balancer-type: "external"`, and you use the
[AWS load balancer controller](https://kubernetes-sigs.github.io/aws-load-balancer-controller/)
in your cluster, then the AWS load balancer controller sets the name of that load
balancer to the value you set for _this_ annotation.

See [annotations](https://kubernetes-sigs.github.io/aws-load-balancer-controller/latest/guide/service/annotations/)
in the AWS load balancer controller documentation.
-->
示例：`service.beta.kubernetes.io/aws-load-balancer-name: my-elb`

用于：Service

如果你对 Service 上设置了这个注解，并且还使用 `service.beta.kubernetes.io/aws-load-balancer-type: "external"`
为该 Service 添加了注解，并在集群中使用了
[AWS 负载均衡器控制器](https://kubernetes-sigs.github.io/aws-load-balancer-controller/)，那么
AWS 负载均衡器控制器将该负载均衡器的名称设置为针对这个注解设置的值。

参见 AWS 负载均衡器控制器文档中的[注解](https://kubernetes-sigs.github.io/aws-load-balancer-controller/latest/guide/service/annotations/)。

### service.beta.kubernetes.io/aws-load-balancer-nlb-target-type (beta) {#service-beta-kubernetes-io-aws-load-balancer-nlb-target-type}

<!--
Example: `service.beta.kubernetes.io/aws-load-balancer-nlb-target-type: "true"`

Used on: Service

The [AWS load balancer controller](https://kubernetes-sigs.github.io/aws-load-balancer-controller/)
uses this annotation.
See [annotations](https://kubernetes-sigs.github.io/aws-load-balancer-controller/latest/guide/service/annotations/)
in the AWS load balancer controller documentation.
-->
示例：`service.beta.kubernetes.io/aws-load-balancer-nlb-target-type: "true"`

用于：Service

[AWS 负载均衡器控制器](https://kubernetes-sigs.github.io/aws-load-balancer-controller/)使用此注解。
参见 AWS 负载均衡器控制器文档中的[注解](https://kubernetes-sigs.github.io/aws-load-balancer-controller/latest/guide/service/annotations/)。

### service.beta.kubernetes.io/aws-load-balancer-private-ipv4-addresses (beta) {#service-beta-kubernetes-io-aws-load-balancer-private-ipv4-addresses}

<!--
Example: `service.beta.kubernetes.io/aws-load-balancer-private-ipv4-addresses: "198.51.100.0,198.51.100.64"`

Used on: Service

The [AWS load balancer controller](https://kubernetes-sigs.github.io/aws-load-balancer-controller/)
uses this annotation.
See [annotations](https://kubernetes-sigs.github.io/aws-load-balancer-controller/latest/guide/service/annotations/)
in the AWS load balancer controller documentation.
-->
示例：`service.beta.kubernetes.io/aws-load-balancer-private-ipv4-addresses: "198.51.100.0,198.51.100.64"`

用于：Service

[AWS 负载均衡器控制器](https://kubernetes-sigs.github.io/aws-load-balancer-controller/)使用此注解。
参见 AWS 负载均衡器控制器文档中的[注解](https://kubernetes-sigs.github.io/aws-load-balancer-controller/latest/guide/service/annotations/)。

### service.beta.kubernetes.io/aws-load-balancer-proxy-protocol (beta) {#service-beta-kubernetes-io-aws-load-balancer-proxy-protocol}

<!--
Example: `service.beta.kubernetes.io/aws-load-balancer-proxy-protocol: "*"`

Used on: Service

The official Kubernetes integration with AWS elastic load balancing configures
a load balancer based on this annotation. The only permitted value is `"*"`,
which indicates that the load balancer should wrap TCP connections to the backend
Pod with the PROXY protocol.
-->
示例：`service.beta.kubernetes.io/aws-load-balancer-proxy-protocol: "*"`

用于：Service

官方的 Kubernetes 与 AWS 弹性负载均衡集成会根据此注解配置负载均衡器。
唯一允许的值是 `"*"`，表示负载均衡器应该使用 PROXY 协议将 TCP 连接封装到后端 Pod 中。

### service.beta.kubernetes.io/aws-load-balancer-scheme (beta) {#service-beta-kubernetes-io-aws-load-balancer-scheme}

<!--
Example: `service.beta.kubernetes.io/aws-load-balancer-scheme: internal`

Used on: Service

The [AWS load balancer controller](https://kubernetes-sigs.github.io/aws-load-balancer-controller/)
uses this annotation.
See [annotations](https://kubernetes-sigs.github.io/aws-load-balancer-controller/latest/guide/service/annotations/)
in the AWS load balancer controller documentation.
-->
示例：`service.beta.kubernetes.io/aws-load-balancer-scheme: internal`

用于：Service

[AWS 负载均衡器控制器](https://kubernetes-sigs.github.io/aws-load-balancer-controller/)使用此注解。
参见 AWS 负载均衡器控制器文档中的[注解](https://kubernetes-sigs.github.io/aws-load-balancer-controller/latest/guide/service/annotations/)。

<!--
### service.beta.kubernetes.io/aws-load-balancer-security-groups (deprecated) {#service-beta-kubernetes-io-aws-load-balancer-security-groups}

Example: `service.beta.kubernetes.io/aws-load-balancer-security-groups: "sg-53fae93f,sg-8725gr62r"`

Used on: Service
-->
### service.beta.kubernetes.io/aws-load-balancer-security-groups（已弃用） {#service-beta-kubernetes-io-aws-load-balancer-security-groups}

例子：`service.beta.kubernetes.io/aws-load-balancer-security-groups: "sg-53fae93f,sg-8725gr62r"`

用于：Service

<!--
The AWS load balancer controller uses this annotation to specify a comma separated list
of security groups you want to attach to an AWS load balancer. Both name and ID of security
are supported where name matches a `Name` tag, not the `groupName` attribute.

When this annotation is added to a Service, the load-balancer controller attaches the security groups
referenced by the annotation to the load balancer. If you omit this annotation, the AWS load balancer
controller automatically creates a new security group and attaches it to the load balancer.
-->
AWS 负载均衡器控制器使用此注解来指定要附加到 AWS 负载均衡器的安全组的逗号分隔列表。
安全名称和 ID 均被支持，其中名称匹配 `Name` 标记，而不是 `groupName` 属性。

当将此注解添加到 Service 时，负载均衡器控制器会将注解引用的安全组附加到负载均衡器上。
如果你省略了此注解，AWS 负载均衡器控制器会自动创建一个新的安全组并将其附加到负载均衡器上。

{{< note >}}
<!--
Kubernetes v1.27 and later do not directly set or read this annotation. However, the AWS
load balancer controller (part of the Kubernetes project) does still use the
`service.beta.kubernetes.io/aws-load-balancer-security-groups` annotation.
-->
Kubernetes v1.27 及更高版本不直接设置或读取此注解。然而，AWS 负载均衡器控制器
（作为 Kubernetes 项目的一部分）仍在使用
`service.beta.kubernetes.io/aws-load-balancer-security-groups` 注解。
{{< /note >}}

### service.beta.kubernetes.io/load-balancer-source-ranges (deprecated) {#service-beta-kubernetes-io-load-balancer-source-ranges}

<!--
Example: `service.beta.kubernetes.io/load-balancer-source-ranges: "192.0.2.0/25"`

Used on: Service

The [AWS load balancer controller](https://kubernetes-sigs.github.io/aws-load-balancer-controller/)
uses this annotation. You should set `.spec.loadBalancerSourceRanges` for the Service instead.
-->
示例：`service.beta.kubernetes.io/load-balancer-source-ranges: "192.0.2.0/25"`

用于：Service

[AWS 负载均衡器控制器](https://kubernetes-sigs.github.io/aws-load-balancer-controller/)使用此注解。
你应该为 Service 设置 `.spec.loadBalancerSourceRanges` 作为替代方案。

### service.beta.kubernetes.io/aws-load-balancer-ssl-cert (beta) {#service-beta-kubernetes-io-aws-load-balancer-ssl-cert}

<!--
Example: `service.beta.kubernetes.io/aws-load-balancer-ssl-cert: "arn:aws:acm:us-east-1:123456789012:certificate/12345678-1234-1234-1234-123456789012"`

Used on: Service

The official integration with AWS elastic load balancing configures TLS for a Service of
`type: LoadBalancer` based on this annotation. The value of the annotation is the
AWS Resource Name (ARN) of the X.509 certificate that the load balancer listener should
use.

(The TLS protocol is based on an older technology that abbreviates to SSL.)
-->
示例：`service.beta.kubernetes.io/aws-load-balancer-ssl-cert: "arn:aws:acm:us-east-1:123456789012:certificate/12345678-1234-1234-1234-123456789012"`

用于：Service

官方与 AWS 弹性负载均衡的集成会根据此注解为 `type: LoadBalancer` 的服务配置 TLS。
该注解的值是负载均衡器的监听器应该使用的 X.509 证书的 AWS 资源名称（ARN）。

（TLS 协议基于一种更老的、简称为 SSL 的技术）。

### service.beta.kubernetes.io/aws-load-balancer-ssl-negotiation-policy (beta) {#service-beta-kubernetes-io-aws-load-balancer-ssl-negotiation-policy}

<!--
Example: `service.beta.kubernetes.io/aws-load-balancer-ssl-negotiation-policy: ELBSecurityPolicy-TLS-1-2-2017-01`

The official integration with AWS elastic load balancing configures TLS for a Service of
`type: LoadBalancer` based on this annotation. The value of the annotation is the name
of an AWS policy for negotiating TLS with a client peer.
-->
示例：`service.beta.kubernetes.io/aws-load-balancer-ssl-negotiation-policy: ELBSecurityPolicy-TLS-1-2-2017-01`

官方与 AWS 弹性负载均衡的集成会根据此注解为 `type: LoadBalancer` 的服务配置 TLS。
该注解的值是与客户端对等方进行 TLS 协商的 AWS 策略的名称。

### service.beta.kubernetes.io/aws-load-balancer-ssl-ports (beta) {#service-beta-kubernetes-io-aws-load-balancer-ssl-ports}

<!--
Example: `service.beta.kubernetes.io/aws-load-balancer-ssl-ports: "*"`

The official integration with AWS elastic load balancing configures TLS for a Service of
`type: LoadBalancer` based on this annotation. The value of the annotation is either `"*"`,
which means that all the load balancer's ports should use TLS, or it is a comma separated
list of port numbers.
-->
示例：`service.beta.kubernetes.io/aws-load-balancer-ssl-ports: "*"`

官方与 AWS 弹性负载均衡的集成会根据此注解为 `type: LoadBalancer` 的服务配置 TLS。
此注解的值可以是 `"*"`（这意味着所有负载均衡器的端口应使用 TLS）或逗号分隔的端口号列表。

### service.beta.kubernetes.io/aws-load-balancer-subnets (beta) {#service-beta-kubernetes-io-aws-load-balancer-subnets}

<!--
Example: `service.beta.kubernetes.io/aws-load-balancer-subnets: "private-a,private-b"`

Kubernetes' official integration with AWS uses this annotation to configure a
load balancer and determine in which AWS availability zones to deploy the managed
load balancing service. The value is either a comma separated list of subnet names, or a
comma separated list of subnet IDs.
-->
示例：`service.beta.kubernetes.io/aws-load-balancer-subnets: "private-a,private-b"`

Kubernetes 官方与 AWS 的集成使用此注解来配置负载均衡器，并决定在哪些 AWS 可用区部署托管的负载均衡服务。
该值可以是逗号分隔的子网名称列表或逗号分隔的子网 ID 列表。

### service.beta.kubernetes.io/aws-load-balancer-target-group-attributes (beta) {#service-beta-kubernetes-io-aws-load-balancer-target-group-attributes}

<!--
Example: `service.beta.kubernetes.io/aws-load-balancer-target-group-attributes: "stickiness.enabled=true,stickiness.type=source_ip"`

Used on: Service

The [AWS load balancer controller](https://kubernetes-sigs.github.io/aws-load-balancer-controller/)
uses this annotation.
See [annotations](https://kubernetes-sigs.github.io/aws-load-balancer-controller/latest/guide/service/annotations/)
in the AWS load balancer controller documentation.
-->
示例：`service.beta.kubernetes.io/aws-load-balancer-target-group-attributes: "stickiness.enabled=true,stickiness.type=source_ip"`

用于：Service

[AWS 负载均衡器控制器](https://kubernetes-sigs.github.io/aws-load-balancer-controller/)使用此注解。
参见 AWS 负载均衡器控制器文档中的[注解](https://kubernetes-sigs.github.io/aws-load-balancer-controller/latest/guide/service/annotations/)。

### service.beta.kubernetes.io/aws-load-balancer-target-node-labels (beta) {#service-beta-kubernetes-io-aws-target-node-labels}

<!--
Example: `service.beta.kubernetes.io/aws-load-balancer-target-node-labels: "kubernetes.io/os=Linux,topology.kubernetes.io/region=us-east-2"`

Kubernetes' official integration with AWS uses this annotation to determine which
nodes in your cluster should be considered as valid targets for the load balancer.
-->
示例：`service.beta.kubernetes.io/aws-load-balancer-target-node-labels: "kubernetes.io/os=Linux,topology.kubernetes.io/region=us-east-2"`

Kubernetes 官方与 AWS 的集成使用此注解来确定集群中的哪些节点应被视为负载均衡器的有效目标。

### service.beta.kubernetes.io/aws-load-balancer-type (beta) {#service-beta-kubernetes-io-aws-load-balancer-type}

<!--
Example: `service.beta.kubernetes.io/aws-load-balancer-type: external`

Kubernetes' official integrations with AWS use this annotation to determine
whether the AWS cloud provider integration should manage a Service of
`type: LoadBalancer`.

There are two permitted values:
-->
示例：`service.beta.kubernetes.io/aws-load-balancer-type: external`

Kubernetes 官方与 AWS 的集成使用此注解来决定 AWS 云提供商是否应管理 `type: LoadBalancer` 的服务。

有两个允许的值：

<!--
`nlb`
: the cloud controller manager configures a Network Load Balancer

`external`
: the cloud controller manager does not configure any load balancer
-->
`nlb`
: 云控制器管理器配置 Network Load Balancer

`external`
: 云控制器管理器不配置任何负载均衡器

<!--
If you deploy a Service of `type: LoadBalancer` on AWS, and you don't set any
`service.beta.kubernetes.io/aws-load-balancer-type` annotation,
the AWS integration deploys a classic Elastic Load Balancer. This behavior,
with no annotation present, is the default unless you specify otherwise.

When you set this annotation to `external` on a Service of `type: LoadBalancer`,
and your cluster has a working deployment of the AWS Load Balancer controller,
then the AWS Load Balancer controller attempts to deploy a load balancer based
on the Service specification.
-->
如果你在 AWS 上部署 `type: LoadBalancer` 的服务，并且没有设置任何
`service.beta.kubernetes.io/aws-load-balancer-type` 注解，AWS 集成将部署经典的弹性负载均衡器。
这种行为是不带注解的默认行为，除非你另有指定。

当你针对 `type: LoadBalancer` 的服务将此注解设置为 `external`，
并且你的集群中已经成功部署了 AWS 负载均衡器控制器时，
AWS 负载均衡器控制器将尝试根据服务规约部署一个负载均衡器。

{{< caution >}}
<!--
Do not modify or add the `service.beta.kubernetes.io/aws-load-balancer-type` annotation
on an existing Service object. See the AWS documentation on this topic for more
details.
-->
不要在现有 Service 对象上修改或添加 `service.beta.kubernetes.io/aws-load-balancer-type` 注解。
参阅 AWS 关于此主题的文档以了解更多细节。
{{< /caution >}}

<!--
### service.beta.kubernetes.io/azure-load-balancer-disable-tcp-reset (deprecated) {#service-beta-kubernetes-azure-load-balancer-disble-tcp-reset}

Example: `service.beta.kubernetes.io/azure-load-balancer-disable-tcp-reset: "false"`

Used on: Service
-->
### service.beta.kubernetes.io/azure-load-balancer-disable-tcp-reset（已弃用） {#service-beta-kubernetes-azure-load-balancer-disble-tcp-reset}

例子：`service.beta.kubernetes.io/azure-load-balancer-disable-tcp-reset: "false"`

用于：Service

<!--
This annotation only works for Azure standard load balancer backed service.
This annotation is used on the Service to specify whether the load balancer
should disable or enable TCP reset on idle timeout. If enabled, it helps
applications to behave more predictably, to detect the termination of a connection,
remove expired connections and initiate new connections. 
You can set the value to be either true or false.
-->
此注解仅适用于由 Azure 标准负载均衡器支持的服务。
此注解用于指定负载均衡器是否应在空闲超时时禁用或启用 TCP 重置。
如果启用，它有助于提升应用行为的可预测度、检测连接的终止以及移除过期的连接并发起新的连接等。
你可以将值设置为 true 或 false。

<!--
See [Load Balancer TCP Reset](https://learn.microsoft.com/en-gb/azure/load-balancer/load-balancer-tcp-reset) for more information.
-->
更多细节参阅[负载均衡器 TCP 重置](https://learn.microsoft.com/zh-cn/azure/load-balancer/load-balancer-tcp-reset)。

{{< note >}} 
<!--
This annotation is deprecated.
-->
此注解已弃用。
{{< /note >}}

<!--
### pod-security.kubernetes.io/enforce

Type: Label

Example: `pod-security.kubernetes.io/enforce: "baseline"`

Used on: Namespace

Value **must** be one of `privileged`, `baseline`, or `restricted` which correspond to
[Pod Security Standard](/docs/concepts/security/pod-security-standards) levels.
Specifically, the `enforce` label _prohibits_ the creation of any Pod in the labeled
Namespace which does not meet the requirements outlined in the indicated level.

See [Enforcing Pod Security at the Namespace Level](/docs/concepts/security/pod-security-admission)
for more information.
-->
### pod-security.kubernetes.io/enforce {#pod-security-kubernetes-io-enforce}

类别：标签

例子：`pod-security.kubernetes.io/enforce: "baseline"`

用于：Namespace

值**必须**是 `privileged`、`baseline` 或 `restricted` 之一，它们对应于
[Pod 安全标准](/zh-cn/docs/concepts/security/pod-security-standards) 级别。
特别地，`enforce` 标签 **禁止** 在带标签的 Namespace 中创建任何不符合指示级别要求的 Pod。

请请参阅[在名字空间级别实施 Pod 安全性](/zh-cn/docs/concepts/security/pod-security-admission)了解更多信息。

<!--
### pod-security.kubernetes.io/enforce-version

Type: Label

Example: `pod-security.kubernetes.io/enforce-version: "{{< skew currentVersion >}}"`

Used on: Namespace

Value **must** be `latest` or a valid Kubernetes version in the format `v<major>.<minor>`.
This determines the version of the
[Pod Security Standard](/docs/concepts/security/pod-security-standards)
policies to apply when validating a Pod.

See [Enforcing Pod Security at the Namespace Level](/docs/concepts/security/pod-security-admission)
for more information.
-->
### pod-security.kubernetes.io/enforce-version {#pod-security-kubernetes-io-enforce-version}

类别：标签

例子：`pod-security.kubernetes.io/enforce-version: "{{< skew currentVersion >}}"`

用于：Namespace

值**必须**是 `latest` 或格式为 `v<MAJOR>.<MINOR>` 的有效 Kubernetes 版本。
此注解决定了在验证提交的 Pod 时要应用的
[Pod 安全标准](/zh-cn/docs/concepts/security/pod-security-standards)策略的版本。

请参阅[在名字空间级别实施 Pod 安全性](/zh-cn/docs/concepts/security/pod-security-admission)了解更多信息。

<!--
### pod-security.kubernetes.io/audit

Type: Label

Example: `pod-security.kubernetes.io/audit: "baseline"`

Used on: Namespace

Value **must** be one of `privileged`, `baseline`, or `restricted` which correspond to
[Pod Security Standard](/docs/concepts/security/pod-security-standards) levels.
Specifically, the `audit` label does not prevent the creation of a Pod in the labeled
Namespace which does not meet the requirements outlined in the indicated level,
but adds an this annotation to the Pod.

See [Enforcing Pod Security at the Namespace Level](/docs/concepts/security/pod-security-admission)
for more information.
-->
### pod-security.kubernetes.io/audit {#pod-security-kubernetes-io-audit}

类别：标签

例子：`pod-security.kubernetes.io/audit: "baseline"`

用于：Namespace

值**必须**是与 [Pod 安全标准](/zh-cn/docs/concepts/security/pod-security-standards) 级别相对应的
`privileged`、`baseline` 或 `restricted` 之一。
具体来说，`audit` 标签不会阻止在带标签的 Namespace 中创建不符合指示级别要求的 Pod，
但会向该 Pod 添加审计注解。

请参阅[在名字空间级别实施 Pod 安全性](/zh-cn/docs/concepts/security/pod-security-admission)了解更多信息。

<!--
### pod-security.kubernetes.io/audit-version

Type: Label

Example: `pod-security.kubernetes.io/audit-version: "{{< skew currentVersion >}}"`

Used on: Namespace

Value **must** be `latest` or a valid Kubernetes version in the format `v<major>.<minor>`.
This determines the version of the
[Pod Security Standard](/docs/concepts/security/pod-security-standards)
policies to apply when validating a Pod.

See [Enforcing Pod Security at the Namespace Level](/docs/concepts/security/pod-security-admission)
for more information.
-->
### pod-security.kubernetes.io/audit-version {#pod-security-kubernetes-io-audit-version}

类别：标签

例子：`pod-security.kubernetes.io/audit-version: "{{< skew currentVersion >}}"`

用于：Namespace

值**必须**是 `latest` 或格式为 `v<MAJOR>.<MINOR>` 的有效 Kubernetes 版本。
此注解决定了在验证提交的 Pod 时要应用的
[Pod 安全标准](/zh-cn/docs/concepts/security/pod-security-standards)策略的版本。

请参阅[在名字空间级别实施 Pod 安全性](/zh-cn/docs/concepts/security/pod-security-admission)了解更多信息。

<!--
### pod-security.kubernetes.io/warn

Type: Label

Example: `pod-security.kubernetes.io/warn: "baseline"`

Used on: Namespace

Value **must** be one of `privileged`, `baseline`, or `restricted` which correspond to
[Pod Security Standard](/docs/concepts/security/pod-security-standards) levels.
Specifically, the `warn` label does not prevent the creation of a Pod in the labeled
Namespace which does not meet the requirements outlined in the indicated level,
but returns a warning to the user after doing so.
Note that warnings are also displayed when creating or updating objects that contain
Pod templates, such as Deployments, Jobs, StatefulSets, etc.

See [Enforcing Pod Security at the Namespace Level](/docs/concepts/security/pod-security-admission)
for more information.
-->
### pod-security.kubernetes.io/warn {#pod-security-kubernetes-io-warn}

类别：标签

例子：`pod-security.kubernetes.io/warn: "baseline"`

用于：Namespace

值**必须**是与 [Pod 安全标准](/zh-cn/docs/concepts/security/pod-security-standards)级别相对应的
`privileged`、`baseline` 或 `restricted` 之一。特别地，
`warn` 标签不会阻止在带标签的 Namespace 中创建不符合指示级别概述要求的 Pod，但会在这样做后向用户返回警告。
请注意，在创建或更新包含 Pod 模板的对象时也会显示警告，例如 Deployment、Jobs、StatefulSets 等。

请参阅[在名字空间级别实施 Pod 安全性](/zh-cn/docs/concepts/security/pod-security-admission)了解更多信息。

<!--
### pod-security.kubernetes.io/warn-version

Type: Label

Example: `pod-security.kubernetes.io/warn-version: "{{< skew currentVersion >}}"`

Used on: Namespace

Value **must** be `latest` or a valid Kubernetes version in the format `v<major>.<minor>`.
This determines the version of the [Pod Security Standard](/docs/concepts/security/pod-security-standards)
policies to apply when validating a submitted Pod.
Note that warnings are also displayed when creating or updating objects that contain
Pod templates, such as Deployments, Jobs, StatefulSets, etc.

See [Enforcing Pod Security at the Namespace Level](/docs/concepts/security/pod-security-admission)
for more information.
-->
### pod-security.kubernetes.io/warn-version {#pod-security-kubernetes-io-warn-version}

类别：标签

例子：`pod-security.kubernetes.io/warn-version: "{{< skew currentVersion >}}"`

用于：Namespace

值**必须**是 `latest` 或格式为 `v<MAJOR>.<MINOR>` 的有效 Kubernetes 版本。
此注解决定了在验证提交的 Pod 时要应用的
[Pod 安全标准](/zh-cn/docs/concepts/security/pod-security-standards)策略的版本。
请注意，在创建或更新包含 Pod 模板的对象时也会显示警告，
例如 Deployment、Job、StatefulSet 等。

请参阅[在名字空间级别实施 Pod 安全性](/zh-cn/docs/concepts/security/pod-security-admission)了解更多信息。

### rbac.authorization.kubernetes.io/autoupdate

<!--
Type: Annotation

Example: `rbac.authorization.kubernetes.io/autoupdate: "false"`

Used on: ClusterRole, ClusterRoleBinding, Role, RoleBinding
-->
类别：注解

例子：`rbac.authorization.kubernetes.io/autoupdate: "false"`

用于：ClusterRole、ClusterRoleBinding、Role、RoleBinding

<!--
When this annotation is set to `"true"` on default RBAC objects created by the API server,
they are automatically updated at server start to add missing permissions and subjects
(extra permissions and subjects are left in place).
To prevent autoupdating a particular role or rolebinding, set this annotation to `"false"`.
If you create your own RBAC objects and set this annotation to `"false"`, `kubectl auth reconcile`
(which allows reconciling arbitrary RBAC objects in a {{< glossary_tooltip text="manifest" term_id="manifest" >}})
respects this annotation and does not automatically add missing permissions and subjects.
-->
当在 kube-apiserver 创建的默认 RBAC 对象上将此注解设置为 `"true"` 时，
这些对象会在服务器启动时自动更新以添加缺少的权限和主体（额外的权限和主体留在原处）。
要防止自动更新特定的 Role 或 RoleBinding，请将此注解设置为 `"false"`。
如果你创建自己的 RBAC 对象并将此注解设置为 `"false"`，则 `kubectl auth reconcile`
（允许协调在{{< glossary_tooltip text="清单" term_id="manifest" >}}中给出的任意 RBAC 对象）
尊重此注解并且不会自动添加缺少的权限和主体。

<!--
### kubernetes.io/psp (deprecated) {#kubernetes-io-psp}

Type: Annotation

Example: `kubernetes.io/psp: restricted`

Used on: Pod

This annotation was only relevant if you were using
[PodSecurityPolicy](/docs/concepts/security/pod-security-policy/) objects.
Kubernetes v{{< skew currentVersion >}} does not support the PodSecurityPolicy API.

When the PodSecurityPolicy admission controller admitted a Pod, the admission controller
modified the Pod to have this annotation.
The value of the annotation was the name of the PodSecurityPolicy that was used for validation.
-->
### kubernetes.io/psp（已弃用） {#kubernetes-io-psp}

类别：注解

例如：`kubernetes.io/psp: restricted`

用于：Pod

这个注解只在你使用 [PodSecurityPolicies](/zh-cn/docs/concepts/security/pod-security-policy/) 时才有意义。
Kubernetes v{{< skew currentVersion >}} 不支持 PodSecurityPolicy API。

当 PodSecurityPolicy 准入控制器接受一个 Pod 时，会修改该 Pod，并给这个 Pod 添加此注解。
注解的值是用来对 Pod 进行验证检查的 PodSecurityPolicy 的名称。

<!--
### seccomp.security.alpha.kubernetes.io/pod (non-functional) {#seccomp-security-alpha-kubernetes-io-pod}

Type: Annotation

Used on: Pod

Kubernetes before v1.25 allowed you to configure seccomp behavior using this annotation.
See [Restrict a Container's Syscalls with seccomp](/docs/tutorials/security/seccomp/) to
learn the supported way to specify seccomp restrictions for a Pod.
-->
### seccomp.security.alpha.kubernetes.io/pod (非功能性) {#seccomp-security-alpha-kubernetes-io-pod}

类别：注解

用于：Pod

v1.25 之前的 Kubernetes 允许你使用此注解配置 seccomp 行为。
请参考 [使用 seccomp 限制容器的系统调用](/zh-cn/docs/tutorials/security/seccomp/)，
了解为 Pod 指定 seccomp 限制的受支持方法。

<!--
### container.seccomp.security.alpha.kubernetes.io/[NAME] (non-functional) {#container-seccomp-security-alpha-kubernetes-io}

Type: Annotation

Used on: Pod

Kubernetes before v1.25 allowed you to configure seccomp behavior using this annotation.
See [Restrict a Container's Syscalls with seccomp](/docs/tutorials/security/seccomp/) to
learn the supported way to specify seccomp restrictions for a Pod.
-->
### container.seccomp.security.alpha.kubernetes.io/[NAME] (非功能性) {#container-seccomp-security-alpha-kubernetes-io}

类别：注解

用于：Pod

v1.25 之前的 Kubernetes 允许你使用此注解配置 seccomp 行为。
请参考 [使用 seccomp 限制容器的系统调用](/zh-cn/docs/tutorials/security/seccomp/)
了解为 Pod 指定 seccomp 限制的受支持方法。

### snapshot.storage.kubernetes.io/allow-volume-mode-change {#allow-volume-mode-change}

<!--
Type: Annotation

Example: `snapshot.storage.kubernetes.io/allow-volume-mode-change: "true"`

Used on: VolumeSnapshotContent
-->
类别：注解

例子：`snapshot.storage.kubernetes.io/allow-volume-mode-change: "true"`

用于：VolumeSnapshotContent

<!--
Value can either be `true` or `false`. This determines whether a user can modify
the mode of the source volume when a PersistentVolumeClaim is being created from
a VolumeSnapshot.

Refer to [Converting the volume mode of a Snapshot](/docs/concepts/storage/volume-snapshots/#convert-volume-mode)
and the [Kubernetes CSI Developer Documentation](https://kubernetes-csi.github.io/docs/)
for more information.
-->
值可以是 `true` 或者 `false`。取值决定了当从 VolumeSnapshot 创建 PersistentVolumeClaim 时，
用户是否可以修改源卷的模式。

更多信息请参阅[转换快照的卷模式](/zh-cn/docs/concepts/storage/volume-snapshots/#convert-volume-mode)和
[Kubernetes CSI 开发者文档](https://kubernetes-csi.github.io/docs/)。

<!--
### scheduler.alpha.kubernetes.io/critical-pod (deprecated)

Type: Annotation

Example: `scheduler.alpha.kubernetes.io/critical-pod: ""`

Used on: Pod

This annotation lets Kubernetes control plane know about a Pod being a critical Pod
so that the descheduler will not remove this Pod.
-->
### scheduler.alpha.kubernetes.io/critical-pod（已弃用）{#scheduler-alpha-kubernetes-io-critical-pod}

类别：注解

例子：`scheduler.alpha.kubernetes.io/critical-pod: ""`

用于：Pod

此注解让 Kubernetes 控制平面知晓某个 Pod 是一个关键的 Pod，这样 descheduler
将不会移除该 Pod。

{{< note >}}
<!--
Starting in v1.16, this annotation was removed in favor of
[Pod Priority](/docs/concepts/scheduling-eviction/pod-priority-preemption/).
-->
从 v1.16 开始，此注解被移除，取而代之的是
[Pod 优先级](/zh-cn/docs/concepts/scheduling-eviction/pod-priority-preemption/)。
{{< /note >}}

<!--
## Annotations used for audit
-->
## 用于审计的注解    {#annonations-used-for-audit}

<!-- sorted by annotation -->
<!--
- [`authorization.k8s.io/decision`](/docs/reference/labels-annotations-taints/audit-annotations/#authorization-k8s-io-decision)
- [`authorization.k8s.io/reason`](/docs/reference/labels-annotations-taints/audit-annotations/#authorization-k8s-io-reason)
- [`insecure-sha1.invalid-cert.kubernetes.io/$hostname`](/docs/reference/labels-annotations-taints/audit-annotations/#insecure-sha1-invalid-cert-kubernetes-io-hostname)
- [`missing-san.invalid-cert.kubernetes.io/$hostname`](/docs/reference/labels-annotations-taints/audit-annotations/#missing-san-invalid-cert-kubernetes-io-hostname)
- [`pod-security.kubernetes.io/audit-violations`](/docs/reference/labels-annotations-taints/audit-annotations/#pod-security-kubernetes-io-audit-violations)
- [`pod-security.kubernetes.io/enforce-policy`](/docs/reference/labels-annotations-taints/audit-annotations/#pod-security-kubernetes-io-enforce-policy)
- [`pod-security.kubernetes.io/exempt`](/docs/reference/labels-annotations-taints/audit-annotations/#pod-security-kubernetes-io-exempt)
- [`validation.policy.admission.k8s.io/validation_failure`](/docs/reference/labels-annotations-taints/audit-annotations/#validation-policy-admission-k8s-io-validation-failure)

See more details on [Audit Annotations](/docs/reference/labels-annotations-taints/audit-annotations/).
-->
- [`authorization.k8s.io/decision`](/zh-cn/docs/reference/labels-annotations-taints/audit-annotations/#authorization-k8s-io-decision)
- [`authorization.k8s.io/reason`](/zh-cn/docs/reference/labels-annotations-taints/audit-annotations/#authorization-k8s-io-reason)
- [`insecure-sha1.invalid-cert.kubernetes.io/$hostname`](/zh-cn/docs/reference/labels-annotations-taints/audit-annotations/#insecure-sha1-invalid-cert-kubernetes-io-hostname)
- [`missing-san.invalid-cert.kubernetes.io/$hostname`](/zh-cn/docs/reference/labels-annotations-taints/audit-annotations/#missing-san-invalid-cert-kubernetes-io-hostname)
- [`pod-security.kubernetes.io/audit-violations`](/zh-cn/docs/reference/labels-annotations-taints/audit-annotations/#pod-security-kubernetes-io-audit-violations)
- [`pod-security.kubernetes.io/enforce-policy`](/zh-cn/docs/reference/labels-annotations-taints/audit-annotations/#pod-security-kubernetes-io-enforce-policy)
- [`pod-security.kubernetes.io/exempt`](/zh-cn/docs/reference/labels-annotations-taints/audit-annotations/#pod-security-kubernetes-io-exempt)
- [`validation.policy.admission.k8s.io/validation_failure`](/zh-cn/docs/reference/labels-annotations-taints/audit-annotations/#validation-policy-admission-k8s-io-validation-failure)

在[审计注解](/zh-cn/docs/reference/labels-annotations-taints/audit-annotations/)页面上查看更多详细信息。

## kubeadm  {#kubeadm}

### kubeadm.alpha.kubernetes.io/cri-socket  {#cri-socket}

<!--
Type: Annotation

Example: `kubeadm.alpha.kubernetes.io/cri-socket: unix:///run/containerd/container.sock`

Used on: Node
-->
类别：注解

例子：`kubeadm.alpha.kubernetes.io/cri-socket: unix:///run/containerd/container.sock`

用于：Node

<!--
Annotation that kubeadm uses to preserve the CRI socket information given to kubeadm at
`init`/`join` time for later use. kubeadm annotates the Node object with this information.
The annotation remains "alpha", since ideally this should be a field in KubeletConfiguration
instead.
-->
kubeadm 用来保存 `init`/`join` 时提供给 kubeadm 以后使用的 CRI 套接字信息的注解。
kubeadm 使用此信息为 Node 对象设置注解。
此注解仍然是 “alpha” 阶段，因为理论上这应该是 KubeletConfiguration 中的一个字段。

### kubeadm.kubernetes.io/etcd.advertise-client-urls  {#etcd-advertise-client-urls}

<!--
Type: Annotation

Example: `kubeadm.kubernetes.io/etcd.advertise-client-urls: https://172.17.0.18:2379`

Used on: Pod
-->
类别：注解

例子：`kubeadm.kubernetes.io/etcd.advertise-client-urls: https://172.17.0.18:2379`

用于：Pod

<!--
Annotation that kubeadm places on locally managed etcd Pods to keep track of
a list of URLs where etcd clients should connect to.
This is used mainly for etcd cluster health check purposes.
-->
kubeadm 为本地管理的 etcd Pod 设置的注解，用来跟踪 etcd 客户端应连接到的 URL 列表。
这主要用于 etcd 集群健康检查目的。

### kubeadm.kubernetes.io/kube-apiserver.advertise-address.endpoint {#kube-apiserver-advertise-address-endpoint}

<!--
Type: Annotation

Example: `kubeadm.kubernetes.io/kube-apiserver.advertise-address.endpoint: https://172.17.0.18:6443`

Used on: Pod
-->
类别：注解

例子：`kubeadm.kubernetes.io/kube-apiserver.advertise-address.endpoint: https://172.17.0.18:6443`

用于：Pod

<!--
Annotation that kubeadm places on locally managed `kube-apiserver` Pods to keep track
of the exposed advertise address/port endpoint for that API server instance.
-->
kubeadm 为本地管理的 `kube-apiserver` Pod 设置的注解，用以跟踪该 API 服务器实例的公开宣告地址/端口端点。

### kubeadm.kubernetes.io/component-config.hash {#component-config-hash}

<!--
Type: Annotation

Used on: ConfigMap

Example: `kubeadm.kubernetes.io/component-config.hash: 2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae`
-->
类别：注解

用于：ConfigMap

例子：`kubeadm.kubernetes.io/component-config.hash: 2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae`

<!--
Annotation that kubeadm places on ConfigMaps that it manages for configuring components.
It contains a hash (SHA-256) used to determine if the user has applied settings different
from the kubeadm defaults for a particular component.
-->
kubeadm 为它所管理的 ConfigMaps 设置的注解，用于配置组件。它包含一个哈希（SHA-256）值，
用于确定用户是否应用了不同于特定组件的 kubeadm 默认设置的设置。

<!--
### node-role.kubernetes.io/control-plane

Type: Label

Used on: Node

A marker label to indicate that the node is used to run control plane components.
The kubeadm tool applies this label to the control plane nodes that it manages.
Other cluster management tools typically also set this taint.

You can label control plane nodes with this label to make it easier to schedule Pods
only onto these nodes, or to avoid running Pods on the control plane.
If this label is set, the [EndpointSlice controller](/docs/concepts/services-networking/topology-aware-routing/#implementation-control-plane)
ignores that node while calculating Topology Aware Hints.
-->
### node-role.kubernetes.io/control-plane

类别：标签

用于：节点

用来指示该节点用于运行控制平面组件的标记标签。Kubeadm 工具将此标签应用于其管理的控制平面节点。
其他集群管理工具通常也会设置此污点。

你可以使用此标签来标记控制平面节点，以便更容易地将 Pod 仅安排到这些节点上，或者避免在控制平面上运行 Pod。
如果设置了此标签，[EndpointSlice 控制器](/zh-cn/docs/concepts/services-networking/topology-aware-routing/#implementation-control-plane)
在计算拓扑感知提示时将忽略该节点。

<!--
### node-role.kubernetes.io/control-plane {#node-role-kubernetes-io-control-plane-taint}

Type: Taint

Example: `node-role.kubernetes.io/control-plane:NoSchedule`

Used on: Node

Taint that kubeadm applies on control plane nodes to restrict placing Pods and
allow only specific pods to schedule on them.

If this Taint is applied, control plane nodes allow only critical workloads to
be scheduled onto them. You can manually remove this taint with the following
command on a specific node.
-->
### node-role.kubernetes.io/control-plane {#node-role-kubernetes-io-control-plane-taint}

类别：污点

示例：`node-role.kubernetes.io/control-plane:NoSchedule`

用于：节点

Kubeadm 应用在控制平面节点上的污点, 用来限制启动 Pod，并且只允许特定 Pod 可调度到这些节点上。

如果应用此污点，则控制平面节点只允许对其进行关键工作负载调度。可以在特定节点上使用以下命令手动删除此污染。

```shell
kubectl taint nodes <node-name> node-role.kubernetes.io/control-plane:NoSchedule-
```

<!--
### node-role.kubernetes.io/master (deprecated) {#node-role-kubernetes-io-master-taint}

Type: Taint

Used on: Node

Example: `node-role.kubernetes.io/master:NoSchedule`

Taint that kubeadm previously applied on control plane nodes to allow only critical
workloads to schedule on them. Replaced by the
[`node-role.kubernetes.io/control-plane`](#node-role-kubernetes-io-control-plane-taint)
taint. kubeadm no longer sets or uses this deprecated taint.
-->
### node-role.kubernetes.io/master（已弃用） {#node-role-kubernetes-io-master-taint}

类别：污点

用于：Node

例子：`node-role.kubernetes.io/master:NoSchedule`

kubeadm 先前应用在控制平面节点上的污点，仅允许在其上调度关键工作负载。
替换为 [`node-role.kubernetes.io/control-plane`](#node-role-kubernetes-io-control-plane-taint)；
kubeadm 不再设置或使用这个废弃的污点。
