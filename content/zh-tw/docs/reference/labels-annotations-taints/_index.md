---
title: 衆所周知的標籤、註解和污點
content_type: concept
weight: 40
no_list: true
card:
  name: reference
  weight: 30
  anchors:
  - anchor: "#labels-annotations-and-taints-used-on-api-objects"
    title: 標籤、註解和污點
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
Kubernetes reserves all labels, annotations and taints in the `kubernetes.io` and `k8s.io` namespaces.

This document serves both as a reference to the values and as a coordination point for assigning values.
-->
Kubernetes 保留 `kubernetes.io` 和 `k8s.io` 名字空間中的所有標籤、註解和污點。

本文檔既可作爲值的參考，也可作爲分配值的協調點。

<!-- body -->

<!--
## Labels, annotations and taints used on API objects
-->
## API 對象上使用的標籤、註解和污點   {#labels-annotations-and-taints-used-on-api-objects}

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
類別：註解

例子：`apf.kubernetes.io/autoupdate-spec: "true"`

用於：[`FlowSchema` 和 `PriorityLevelConfiguration` 對象](/zh-cn/docs/concepts/cluster-administration/flow-control/#defaults)

如果在 FlowSchema 或 PriorityLevelConfiguration 上將此註解設置爲 true，
那麼該對象的 `spec` 將由 kube-apiserver 進行管理。如果 API 伺服器不識別 APF 對象，
並且你對其添加了自動更新的註解，則 API 伺服器將刪除整個對象。否則，API 伺服器不管理對象規約。
更多細節參閱[維護強制性和建議的設定對象](/zh-cn/docs/concepts/cluster-administration/flow-control/#maintenance-of-the-mandatory-and-suggested-configuration-objects)

<!--
### app.kubernetes.io/component

Type: Label

Example: `app.kubernetes.io/component: "database"`

Used on: All Objects (typically used on [workload resources](/docs/reference/kubernetes-api/workload-resources/)).

The component within the application architecture.

One of the [recommended labels](/docs/concepts/overview/working-with-objects/common-labels/#labels).
-->
### app.kubernetes.io/component {#app-kubernetes-io-component}

類別：標籤

例子：`app.kubernetes.io/component: "database"`

用於：所有對象（通常用於[工作負載資源](/zh-cn/docs/reference/kubernetes-api/workload-resources/)）。

應用架構中的組件。

[推薦標籤](/zh-cn/docs/concepts/overview/working-with-objects/common-labels/#labels)之一。

<!--
### app.kubernetes.io/created-by (deprecated)

Type: Label

Example: `app.kubernetes.io/created-by: "controller-manager"`

Used on: All Objects (typically used on[workload resources](/docs/reference/kubernetes-api/workload-resources/)).

The controller/user who created this resource.
-->
### app.kubernetes.io/created-by（已棄用）  {#app-kubernetes-io-created-by}

類別：標籤

示例：`app.kubernetes.io/created-by: "controller-manager"`

用於：所有對象（通常用於[工作負載資源](/zh-cn/docs/reference/kubernetes-api/workload-resources/)）。

創建此資源的控制器/使用者。

{{< note >}}
<!--
Starting from v1.9, this label is deprecated.
-->
從 v1.9 開始，這個標籤被棄用。
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

類別：標籤

示例：`app.kubernetes.io/instance: "mysql-abcxyz"`

用於：所有對象（通常用於[工作負載資源](/zh-cn/docs/reference/kubernetes-api/workload-resources/)）。

標識應用實例的唯一名稱。要分配一個不唯一的名稱，可使用 [app.kubernetes.io/name](#app-kubernetes-io-name)。

[推薦標籤](/zh-cn/docs/concepts/overview/working-with-objects/common-labels/#labels)之一。

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

類別：標籤

示例：`app.kubernetes.io/managed-by: "helm"`

用於：所有對象（通常用於[工作負載資源](/zh-cn/docs/reference/kubernetes-api/workload-resources/)）。

用於管理應用操作的工具。

[推薦標籤](/zh-cn/docs/concepts/overview/working-with-objects/common-labels/#labels)之一。

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

類別：標籤

示例：`app.kubernetes.io/name: "mysql"`

用於：所有對象（通常用於[工作負載資源](/zh-cn/docs/reference/kubernetes-api/workload-resources/)）。

應用的名稱。

[推薦標籤](/zh-cn/docs/concepts/overview/working-with-objects/common-labels/#labels)之一。

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

類別：標籤

示例：`app.kubernetes.io/part-of: "wordpress"`

用於：所有對象（通常用於[工作負載資源](/zh-cn/docs/reference/kubernetes-api/workload-resources/)）。

此應用所屬的更高級別應用的名稱。

[推薦標籤](/zh-cn/docs/concepts/overview/working-with-objects/common-labels/#labels)之一。

<!--
### app.kubernetes.io/version

Type: Label

Example: `app.kubernetes.io/version: "5.7.21"`

Used on: All Objects (typically used on
[workload resources](/docs/reference/kubernetes-api/workload-resources/)).

The current version of the application.
-->
### app.kubernetes.io/version {#app-kubernetes-io-version}

類別：標籤

示例：`app.kubernetes.io/version: "5.7.21"`

用於：所有對象（通常用於[工作負載資源](/zh-cn/docs/reference/kubernetes-api/workload-resources/)）。

<!--
Common forms of values include:

- [semantic version](https://semver.org/spec/v1.0.0.html)
- the Git [revision hash](https://git-scm.com/book/en/v2/Git-Tools-Revision-Selection#_single_revisions)
  for the source code.

One of the [recommended labels](/docs/concepts/overview/working-with-objects/common-labels/#labels).
-->
值的常見形式包括：

- [語義版本](https://semver.org/spec/v1.0.0.html)
- 針對源代碼的 Git [修訂哈希](https://git-scm.com/book/en/v2/Git-Tools-Revision-Selection#_single_revisions)。

[推薦標籤](/zh-cn/docs/concepts/overview/working-with-objects/common-labels/#labels)之一。

<!--
### applyset.kubernetes.io/contains-group-kinds (alpha) {#applyset-kubernetes-io-contains-group-kinds}

Type: Annotation

Example: `applyset.kubernetes.io/contains-group-kinds: "certificates.cert-manager.io,configmaps,deployments.apps,secrets,services"`

Used on: Objects being used as ApplySet parents.
-->
### applyset.kubernetes.io/additional-namespaces (alpha) {#applyset-kubernetes-io-additional-namespaces}

類別：註解

示例：`applyset.kubernetes.io/additional-namespaces: "namespace1,namespace2"`

用於：作爲 ApplySet 父對象使用的對象。

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
此註解處於 Alpha 階段。
對於 Kubernetes {{< skew currentVersion >}} 版本，如果定義它們的
{{< glossary_tooltip term_id="CustomResourceDefinition" text="CustomResourceDefinition" >}}
打了 `applyset.kubernetes.io/is-parent-type` 標籤，
那麼你可以在 Secret、ConfigMap 或自定義資源上使用此註解。

規範的部分功能用來實現[在 kubectl 中基於 ApplySet 的刪除](/zh-cn/docs/tasks/manage-kubernetes-objects/declarative-config/#alternative-kubectl-apply-f-directory-prune)。
此註解應用於父對象，這些父對象用於跟蹤 ApplySet 以優化 ApplySet 成員對象列表。
它在 ApplySet 規範中是可選的，因爲工具可以執行發現或使用不同的優化。
然而，對於 Kubernetes {{< skew currentVersion >}} 版本，它是 kubectl 必需的。
當存在時，註解的值必須是一個以逗號分隔的 group-kinds 列表，採用完全限定的名稱格式，例如 `<resource>.<group>`。

<!--
### applyset.kubernetes.io/contains-group-resources (alpha) {#applyset-kubernetes-io-contains-group-resources}

Type: Annotation

Example: `applyset.kubernetes.io/contains-group-resources: "certificates.cert-manager.io,configmaps,deployments.apps,secrets,services"`

Used on: Objects being used as ApplySet parents.

Use of this annotation is Alpha.
For Kubernetes version {{< skew currentVersion >}}, you can use this annotation on Secrets, ConfigMaps,
or custom resources if the CustomResourceDefinition
defining them has the `applyset.kubernetes.io/is-parent-type` label.
-->
### applyset.kubernetes.io/contains-group-resources (alpha) {#applyset-kubernetes-io-contains-group-resources}

類別：註解

示例：`applyset.kubernetes.io/contains-group-resources: "certificates.cert-manager.io,configmaps,deployments.apps,secrets,services"`

用於：作爲 ApplySet 父對象使用的對象。

此註解處於 Alpha 階段。
對於 Kubernetes {{< skew currentVersion >}} 版本，如果定義它們的
{{< glossary_tooltip term_id="CustomResourceDefinition" text="CustomResourceDefinition" >}}
打了 `applyset.kubernetes.io/is-parent-type` 標籤，
那麼你可以在 Secret、ConfigMap 或自定義資源上使用此註解。

<!--
Part of the specification used to implement
[ApplySet-based pruning in kubectl](/docs/tasks/manage-kubernetes-objects/declarative-config/#alternative-kubectl-apply-f-directory-prune).
This annotation is applied to the parent object used to track an ApplySet to optimize listing of
ApplySet member objects. It is optional in the ApplySet specification, as tools can perform discovery
or use a different optimization. However, as of Kubernetes version {{< skew currentVersion >}},
it is required by kubectl. When present, the value of this annotation must be a comma separated list
of the group-kinds, in the fully-qualified name format, i.e. `<resource>.<group>`.
-->
規範的部分功能用來實現[在 kubectl 中基於 ApplySet 的刪除](/zh-cn/docs/tasks/manage-kubernetes-objects/declarative-config/#alternative-kubectl-apply-f-directory-prune)。
此註解應用於父對象，這些父對象用於跟蹤 ApplySet 以優化 ApplySet 成員對象列表。
它在 ApplySet 規範中是可選的，因爲工具可以執行發現或使用不同的優化。
然而，對於 Kubernetes {{< skew currentVersion >}} 版本，它是 kubectl 必需的。
當存在時，註解的值必須是一個以逗號分隔的 group-kinds 列表，採用完全限定的名稱格式，例如 `<resource>.<group>`。

<!--
### applyset.kubernetes.io/contains-group-resources (deprecated) {#applyset-kubernetes-io-contains-group-resources}

Type: Annotation

Example: `applyset.kubernetes.io/contains-group-resources: "certificates.cert-manager.io,configmaps,deployments.apps,secrets,services"`

Used on: Objects being used as ApplySet parents.
-->
### applyset.kubernetes.io/contains-group-resources（已棄用） {#applyset-kubernetes-io-contains-group-resources}

類別：註解

例子：`applyset.kubernetes.io/contains-group-resources: "certificates.cert-manager.io,configmaps,deployments.apps,secrets,services"`

用於：作爲 ApplySet 父對象的對象。

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
對於 Kubernetes {{< skew currentVersion >}} 版本，如果定義它們的
CustomResourceDefinition 打了 `applyset.kubernetes.io/is-parent-type` 標籤，
那麼你可以在 Secret、ConfigMap 或自定義資源上使用此註解。

規範的部分功能用來實現[在 kubectl 中基於 ApplySet 的刪除](/zh-cn/docs/tasks/manage-kubernetes-objects/declarative-config/#alternative-kubectl-apply-f-directory-prune)。
此註解應用於父對象，這些父對象用於跟蹤 ApplySet 以優化 ApplySet 成員對象列表。
它在 ApplySet 規範中是可選的，因爲工具可以執行發現或使用不同的優化。
然而，對於 Kubernetes {{< skew currentVersion >}} 版本，它是 kubectl 必需的。
當存在時，註解的值必須是一個以逗號分隔的 group-kinds 列表，採用完全限定的名稱格式，例如 `<resource>.<group>`。

{{< note >}}
<!--
This annotation is currently deprecated and replaced by [`applyset.kubernetes.io/contains-group-kinds`](#applyset-kubernetes-io-contains-group-kinds),
support for this will be removed in applyset beta or GA.
-->
此註解目前已棄用，替換爲 [`applyset.kubernetes.io/contains-group-kinds`](#applyset-kubernetes-io-contains-group-kinds)，
對此註解的支持將在 ApplySet 進階至 Beta 或 GA 後移除。
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
-->
### applyset.kubernetes.io/id (alpha) {#applyset-kubernetes-io-id}

類別：標籤

示例：`applyset.kubernetes.io/id: "applyset-0eFHV8ySqp7XoShsGvyWFQD3s96yqwHmzc4e0HR1dsY-v1"`

用於：作爲 ApplySet 父對象使用的對象。

此註解處於 Alpha 階段。
對於 Kubernetes {{< skew currentVersion >}} 版本，如果定義它們的
{{< glossary_tooltip term_id="CustomResourceDefinition" text="CustomResourceDefinition" >}}
打了 `applyset.kubernetes.io/is-parent-type` 標籤，那麼你可以在 Secret、ConfigMap 或自定義資源上使用此註解。

<!--
Part of the specification used to implement
[ApplySet-based pruning in kubectl](/docs/tasks/manage-kubernetes-objects/declarative-config/#alternative-kubectl-apply-f-directory-prune).
This label is what makes an object an ApplySet parent object.
Its value is the unique ID of the ApplySet, which is derived from the identity of the parent
object itself. This ID **must** be the base64 encoding (using the URL safe encoding of RFC4648) of
the hash of the group-kind-name-namespace of the object it is on, in the form:
`<base64(sha256(<name>.<namespace>.<kind>.<group>))>`.
There is no relation between the value of this label and object UID.
-->
規範的部分功能用來實現[在 kubectl 中基於 ApplySet 的刪除](/zh-cn/docs/tasks/manage-kubernetes-objects/declarative-config/#alternative-kubectl-apply-f-directory-prune)。
此標籤使對象成爲 ApplySet 父對象。
它的值是 ApplySet 的唯一 ID，該 ID 派生自父對象本身的標識。
該 ID **必須**是所在對象的 group-kind-name-namespace 的 hash 的 base64 編碼（使用 RFC4648 的 URL 安全編碼），
格式爲：`<base64(sha256(<name>.<namespace>.<kind>.<group>))>`。
此標籤的值與對象 UID 之間沒有關係。

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

類別：標籤

示例：`applyset.kubernetes.io/is-parent-type: "true"`

用於：自定義資源（CRD）

此註解處於 Alpha 階段。
規範的部分功能用來實現[在 kubectl 中基於 ApplySet 的刪除](/zh-cn/docs/tasks/manage-kubernetes-objects/declarative-config/#alternative-kubectl-apply-f-directory-prune)。
你可以在 {{< glossary_tooltip term_id="CustomResourceDefinition" text="CustomResourceDefinition" >}} (CRD)
上設置這個標籤，以將它定義的自定義資源類型（而不是 CRD 本身）標識爲 ApplySet 的允許父類。
這個標籤唯一允許的值是 `"true"`；如果你想將一個 CRD 標記爲不是 ApplySet 的有效父級，請省略這個標籤。

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

類別：標籤

示例：`applyset.kubernetes.io/part-of: "applyset-0eFHV8ySqp7XoShsGvyWFQD3s96yqwHmzc4e0HR1dsY-v1"`

用於：所有對象。

此註解處於 Alpha 階段。
規範的部分功能用來實現[在 kubectl 中基於 ApplySet 的刪除](/zh-cn/docs/tasks/manage-kubernetes-objects/declarative-config/#alternative-kubectl-apply-f-directory-prune)。
此標籤使對象成爲 ApplySet 的成員。
標籤的值**必須**與父對象上的 `applyset.kubernetes.io/id` 標籤的值相匹配。

<!--
### applyset.kubernetes.io/tooling (alpha) {#applyset-kubernetes-io-tooling}

Type: Annotation

Example: `applyset.kubernetes.io/tooling: "kubectl/v{{< skew currentVersion >}}"`

Used on: Objects being used as ApplySet parents.

Use of this annotation is Alpha.
For Kubernetes version {{< skew currentVersion >}}, you can use this annotation on Secrets,
ConfigMaps, or custom resources if the CustomResourceDefinitiondefining them has the
`applyset.kubernetes.io/is-parent-type` label.
-->
### applyset.kubernetes.io/tooling (alpha) {#applyset-kubernetes-io-tooling}

類別：註解

示例：`applyset.kubernetes.io/tooling: "kubectl/v{{< skew currentVersion >}}"`

用於：作爲 ApplySet 父對象使用的對象。

此註解處於 Alpha 階段。
對於 Kubernetes {{< skew currentVersion >}} 版本，如果定義它們的
{{< glossary_tooltip term_id="CustomResourceDefinition" text="CustomResourceDefinition" >}}
打了 `applyset.kubernetes.io/is-parent-type` 標籤，那麼你可以在 Secret、ConfigMap 或自定義資源上使用此註解。

<!--
Part of the specification used to implement
[ApplySet-based pruning in kubectl](/docs/tasks/manage-kubernetes-objects/declarative-config/#alternative-kubectl-apply-f-directory-prune).
This annotation is applied to the parent object used to track an ApplySet to indicate which
tooling manages that ApplySet. Tooling should refuse to mutate ApplySets belonging to other tools.
The value must be in the format `<toolname>/<semver>`.
-->
規範的部分功能用來實現[在 kubectl 中基於 ApplySet 的刪除](/zh-cn/docs/tasks/manage-kubernetes-objects/declarative-config/#alternative-kubectl-apply-f-directory-prune)。
此註解應用於父對象，這些父對象用於跟蹤 ApplySet 以指示哪個工具管理 ApplySet。
工具應該拒絕改變屬於其他工具的 ApplySet。
該值必須採用 `<toolname>/<semver>` 格式。

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
類別：標籤

例子：`apps.kubernetes.io/pod-index: "0"`

用於：Pod

當 StatefulSet 控制器爲 StatefulSet 創建 Pod 時，該控制器會在 Pod 上設置這個標籤。
標籤的值是正在創建的 Pod 的序號索引。

更多細節參閱 StatefulSet 主題中的
[Pod 索引標籤](/zh-cn/docs/concepts/workloads/controllers/statefulset/#pod-index-label)。
請注意，[PodIndexLabel](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)
特性門控必須被啓用，才能將此標籤添加到 Pod 上。

<!--
### resource.kubernetes.io/pod-claim-name

Type: Annotation

Example: `resource.kubernetes.io/pod-claim-name: "my-pod-claim"`

Used on: ResourceClaim

This annotation is assigned to generated ResourceClaims. 
Its value corresponds to the name of the resource claim in the `.spec` of any Pod(s) for which the ResourceClaim was created.
This annotation is an internal implementation detail of [dynamic resource allocation](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/).
You should not need to read or modify the value of this annotation.
-->
### resource.kubernetes.io/pod-claim-name {#resource-kubernetes-io-pod-claim-name}

類別：註解

示例：`resource.kubernetes.io/pod-claim-name: "my-pod-claim"`

用於：ResourceClaim

該註解被賦予自動生成的 ResourceClaim。
註解的值對應於觸發 ResourceClaim 創建的 Pod 在 `.spec` 中的資源聲明名稱。
此註解是[動態資源分配](/zh-cn/docs/concepts/scheduling-eviction/dynamic-resource-allocation/)的內部實現細節。
你不需要讀取或修改此註解的值。

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

類別：註解

例子：`cluster-autoscaler.kubernetes.io/safe-to-evict: "true"`

用於：Pod

當這個註解設置爲 `"true"` 時，即使其他規則通常會阻止驅逐操作，也會允許該叢集自動擴縮器驅逐一個 Pod。
叢集自動擴縮器從不驅逐將此註解顯式設置爲 `"false"` 的 Pod；你可以針對要保持運行的重要 Pod 設置此註解。
如果未設置此註解，則叢集自動擴縮器將遵循其 Pod 級別的行爲。

<!--
### config.kubernetes.io/local-config

Type: Annotation

Example: `config.kubernetes.io/local-config: "true"`

Used on: All objects

This annotation is used in manifests to mark an object as local configuration that
should not be submitted to the Kubernetes API.
-->
### config.kubernetes.io/local-config {#config-kubernetes-io-local-config}

類別：註解

例子：`config.kubernetes.io/local-config: "true"`

用於：所有對象

該註解用於清單中的對象，表示某對象是本地設定，不應提交到 Kubernetes API。

<!--
A value of `"true"` for this annotation declares that the object is only consumed by
client-side tooling and should not be submitted to the API server.

A value of `"false"` can be used to declare that the object should be submitted to
the API server even when it would otherwise be assumed to be local.

This annotation is part of the Kubernetes Resource Model (KRM) Functions Specification,
which is used by Kustomize and similar third-party tools.
For example, Kustomize removes objects with this annotation from its final build output.
-->
對於這個註解，當值爲 `"true"` 時，表示該對象僅被客戶端工具使用，不應提交到 API 伺服器。

當值爲 `"false"` 時，可以用來聲明該對象應提交到 API 伺服器，即使它是本地對象。

該註解是 Kubernetes 資源模型（KRM）函數規範的一部分，被 Kustomize 和其他類似的第三方工具使用。
例如，Kustomize 會從其最終構建輸出中移除帶有此註解的對象。

<!--
### container.apparmor.security.beta.kubernetes.io/* (deprecated) {#container-apparmor-security-beta-kubernetes-io}
-->
### container.apparmor.security.beta.kubernetes.io/*（已棄用） {#container-apparmor-security-beta-kubernetes-io}

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
類別：註解

例子：`container.apparmor.security.beta.kubernetes.io/my-container: my-custom-profile`

用於：Pod

此註解允許你爲 Kubernetes Pod 中的容器指定 AppArmor 安全設定文件。
從 Kubernetes v1.30 開始，此註解應該通過 `appArmorProfile` 字段進行設置。
更多細節參閱 [AppArmor](/zh-cn/docs/tutorials/security/apparmor/) 教程。
該教程演示瞭如何使用 AppArmor 限制容器的權能和訪問權限。

所指定的設定文件定義了容器進程必須遵守的規則集和限制集。這有助於針對容器實施安全策略和隔離措施。

<!--
### internal.config.kubernetes.io/* (reserved prefix) {#internal.config.kubernetes.io-reserved-wildcard}

Type: Annotation

Used on: All objects
-->
### internal.config.kubernetes.io/*（保留的前綴） {#internal.config.kubernetes.io-reserved-wildcard}

類別：註解

用於：所有對象

<!--
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
該前綴被保留，供遵從 Kubernetes 資源模型（KRM）函數規範的編排工具內部使用。
帶有該前綴的註解僅在編排過程中使用，不會持久化到文件系統。
換句話說，編排工具應從本地文件系統讀取文件時設置這些註解，並在將函數輸出寫回文件系統時移除這些註解。

除非特定註解另有說明，KRM 函數**不得**修改帶有此前綴的註解。
這使得編排工具可以添加額外的內部註解，而不需要更改現有函數。

<!--
### internal.config.kubernetes.io/path

Type: Annotation

Example: `internal.config.kubernetes.io/path: "relative/file/path.yaml"`

Used on: All objects

This annotation records the slash-delimited, OS-agnostic, relative path to the manifest file the
object was loaded from. The path is relative to a fixed location on the filesystem, determined by
the orchestrator tool.
-->
### internal.config.kubernetes.io/path {#internal-config-kubernetes-io-path}

類別：註解

例子：`internal.config.kubernetes.io/path: "relative/file/path.yaml"`

用於：所有對象

此註解記錄了加載對象清單文件的（斜線分隔、與操作系統無關）相對路徑。
該路徑相對於文件系統上由編排工具確定的固定位置。

<!--
This annotation is part of the Kubernetes Resource Model (KRM) Functions Specification, which is
used by Kustomize and similar third-party tools.

A KRM Function **should not** modify this annotation on input objects unless it is modifying the
referenced files. A KRM Function **may** include this annotation on objects it generates.
-->
該註解是 Kubernetes 資源模型（KRM）函數規範的一部分，被 Kustomize 和其他類似的第三方工具使用。

KRM 函數**不應**在輸入對象上修改此註解，除非它正在修改引用的文件。
KRM 函數**可以**在它所生成的對象上包含這個註解。

<!--
### kube-scheduler-simulator.sigs.k8s.io/bind-result

Type: Annotation

Example: `kube-scheduler-simulator.sigs.k8s.io/bind-result: '{"DefaultBinder":"success"}'`

Used on: Pod

This annotation records the result of bind scheduler plugins, used by https://sigs.k8s.io/kube-scheduler-simulator.
-->
### `kube-scheduler-simulator.sigs.k8s.io/bind-result`

類別：註解

例子：`kube-scheduler-simulator.sigs.k8s.io/bind-result: '{"DefaultBinder":"success"}'`

用於：Pod

此註解記錄了 bind 調度插件的結果，用於
[kube-scheduler-simulator](https://sigs.k8s.io/kube-scheduler-simulator)。

<!--
### kube-scheduler-simulator.sigs.k8s.io/filter-result

Type: Annotation

Example: 
-->
### kube-scheduler-simulator.sigs.k8s.io/filter-result

類別：註解

例子：

```yaml
kube-scheduler-simulator.sigs.k8s.io/filter-result: >-
      {"node-282x7":{"AzureDiskLimits":"passed","EBSLimits":"passed","GCEPDLimits":"passed","InterPodAffinity":"passed","NodeAffinity":"passed","NodeName":"passed","NodePorts":"passed","NodeResourcesFit":"passed","NodeUnschedulable":"passed","NodeVolumeLimits":"passed","PodTopologySpread":"passed","TaintToleration":"passed","VolumeBinding":"passed","VolumeRestrictions":"passed","VolumeZone":"passed"},"node-gp9t4":{"AzureDiskLimits":"passed","EBSLimits":"passed","GCEPDLimits":"passed","InterPodAffinity":"passed","NodeAffinity":"passed","NodeName":"passed","NodePorts":"passed","NodeResourcesFit":"passed","NodeUnschedulable":"passed","NodeVolumeLimits":"passed","PodTopologySpread":"passed","TaintToleration":"passed","VolumeBinding":"passed","VolumeRestrictions":"passed","VolumeZone":"passed"}}
```

<!--
Used on: Pod

This annotation records the result of filter scheduler plugins, used by https://sigs.k8s.io/kube-scheduler-simulator.
-->
用於：Pod

此註解記錄了 filter 調度插件的結果，用於
[kube-scheduler-simulator](https://sigs.k8s.io/kube-scheduler-simulator)。

<!--
### kube-scheduler-simulator.sigs.k8s.io/finalscore-result

Type: Annotation

Example: 
-->
### kube-scheduler-simulator.sigs.k8s.io/finalscore-result

類別：註解

例子：

```yaml
kube-scheduler-simulator.sigs.k8s.io/finalscore-result: >-
      {"node-282x7":{"ImageLocality":"0","InterPodAffinity":"0","NodeAffinity":"0","NodeNumber":"0","NodeResourcesBalancedAllocation":"76","NodeResourcesFit":"73","PodTopologySpread":"200","TaintToleration":"300","VolumeBinding":"0"},"node-gp9t4":{"ImageLocality":"0","InterPodAffinity":"0","NodeAffinity":"0","NodeNumber":"0","NodeResourcesBalancedAllocation":"76","NodeResourcesFit":"73","PodTopologySpread":"200","TaintToleration":"300","VolumeBinding":"0"}}
```

<!--
Used on: Pod

This annotation records the final scores that the scheduler calculates from the scores from score scheduler plugins,
used by https://sigs.k8s.io/kube-scheduler-simulator.
-->
用於：Pod

此註解記錄了調度器從 score 調度插件計算出的最終分數，用於
[kube-scheduler-simulator](https://sigs.k8s.io/kube-scheduler-simulator)。

```yaml
kube-scheduler-simulator.sigs.k8s.io/finalscore-result: >-
      {"node-282x7":{"ImageLocality":"0","InterPodAffinity":"0","NodeAffinity":"0","NodeNumber":"0","NodeResourcesBalancedAllocation":"76","NodeResourcesFit":"73","PodTopologySpread":"200","TaintToleration":"300","VolumeBinding":"0"},"node-gp9t4":{"ImageLocality":"0","InterPodAffinity":"0","NodeAffinity":"0","NodeNumber":"0","NodeResourcesBalancedAllocation":"76","NodeResourcesFit":"73","PodTopologySpread":"200","TaintToleration":"300","VolumeBinding":"0"}}
```

<!--
### kube-scheduler-simulator.sigs.k8s.io/permit-result

Type: Annotation

Example: `kube-scheduler-simulator.sigs.k8s.io/permit-result: '{"CustomPermitPlugin":"success"}'`

Used on: Pod

This annotation records the result of permit scheduler plugins, used by https://sigs.k8s.io/kube-scheduler-simulator.
-->
### kube-scheduler-simulator.sigs.k8s.io/permit-result

類別：註解

例子：`kube-scheduler-simulator.sigs.k8s.io/permit-result: '{"CustomPermitPlugin":"success"}'`

用於：Pod

此註解記錄了 permit 調度插件的結果，用於
[kube-scheduler-simulator](https://sigs.k8s.io/kube-scheduler-simulator)。

<!--
### kube-scheduler-simulator.sigs.k8s.io/permit-result-timeout

Type: Annotation

Example: `kube-scheduler-simulator.sigs.k8s.io/permit-result-timeout: '{"CustomPermitPlugin":"10s"}'`

Used on: Pod

This annotation records the timeouts returned from permit scheduler plugins, used by https://sigs.k8s.io/kube-scheduler-simulator.
-->
### kube-scheduler-simulator.sigs.k8s.io/permit-result-timeout

類別：註解

例子：`kube-scheduler-simulator.sigs.k8s.io/permit-result-timeout: '{"CustomPermitPlugin":"10s"}'`

用於：Pod

此註解記錄了 permit 調度插件返回的超時時間，用於
[kube-scheduler-simulator](https://sigs.k8s.io/kube-scheduler-simulator)。

<!--
### kube-scheduler-simulator.sigs.k8s.io/postfilter-result

Type: Annotation

Example: `kube-scheduler-simulator.sigs.k8s.io/postfilter-result: '{"DefaultPreemption":"success"}'`

Used on: Pod

This annotation records the result of postfilter scheduler plugins, used by https://sigs.k8s.io/kube-scheduler-simulator.
-->
### kube-scheduler-simulator.sigs.k8s.io/postfilter-result

類別：註解

例子：`kube-scheduler-simulator.sigs.k8s.io/postfilter-result: '{"DefaultPreemption":"success"}'`

用於：Pod

此註解記錄了 postfilter 調度插件的結果，用於
[kube-scheduler-simulator](https://sigs.k8s.io/kube-scheduler-simulator)。

<!--
### kube-scheduler-simulator.sigs.k8s.io/prebind-result

Type: Annotation

Example: `kube-scheduler-simulator.sigs.k8s.io/prebind-result: '{"VolumeBinding":"success"}'`

Used on: Pod

This annotation records the result of prebind scheduler plugins, used by https://sigs.k8s.io/kube-scheduler-simulator.
-->
### kube-scheduler-simulator.sigs.k8s.io/prebind-result

類別：註解

例子：`kube-scheduler-simulator.sigs.k8s.io/prebind-result: '{"VolumeBinding":"success"}'`

用於：Pod

此註解記錄了 prebind 調度插件的結果，用於
[kube-scheduler-simulator](https://sigs.k8s.io/kube-scheduler-simulator)。

<!--
### kube-scheduler-simulator.sigs.k8s.io/prefilter-result

Type: Annotation

Example: `kube-scheduler-simulator.sigs.k8s.io/prebind-result: '{"NodeAffinity":"[\"node-\a"]"}'`

Used on: Pod

This annotation records the PreFilter result of prefilter scheduler plugins, used by https://sigs.k8s.io/kube-scheduler-simulator.
-->
### kube-scheduler-simulator.sigs.k8s.io/prefilter-result

類別：註解

例子：`kube-scheduler-simulator.sigs.k8s.io/prebind-result: '{"NodeAffinity":"[\"node-\a"]"}'`

用於：Pod

此註解記錄了 prefilter 調度插件的預過濾結果，用於
[kube-scheduler-simulator](https://sigs.k8s.io/kube-scheduler-simulator)。

<!--
### kube-scheduler-simulator.sigs.k8s.io/prefilter-result-status

Type: Annotation

Example: 
-->
### kube-scheduler-simulator.sigs.k8s.io/prefilter-result-status

類別：註解

例子：

```yaml
kube-scheduler-simulator.sigs.k8s.io/prefilter-result-status: >-
      {"InterPodAffinity":"success","NodeAffinity":"success","NodePorts":"success","NodeResourcesFit":"success","PodTopologySpread":"success","VolumeBinding":"success","VolumeRestrictions":"success"}
```

<!--
Used on: Pod

This annotation records the result of prefilter scheduler plugins, used by https://sigs.k8s.io/kube-scheduler-simulator.
-->
用於：Pod

此註解記錄了 prefilter 調度插件的結果，用於
[kube-scheduler-simulator](https://sigs.k8s.io/kube-scheduler-simulator)。

<!--
### kube-scheduler-simulator.sigs.k8s.io/prescore-result

Type: Annotation

Example: 
-->
### kube-scheduler-simulator.sigs.k8s.io/prescore-result

類別：註解

例子：

```yaml
    kube-scheduler-simulator.sigs.k8s.io/prescore-result: >-
      {"InterPodAffinity":"success","NodeAffinity":"success","NodeNumber":"success","PodTopologySpread":"success","TaintToleration":"success"}
```

<!--
Used on: Pod

This annotation records the result of prefilter scheduler plugins, used by https://sigs.k8s.io/kube-scheduler-simulator.
-->
用於：Pod

此註解記錄了 prefilter 調度插件的結果，用於
[kube-scheduler-simulator](https://sigs.k8s.io/kube-scheduler-simulator)。

<!--
### kube-scheduler-simulator.sigs.k8s.io/reserve-result

Type: Annotation

Example: `kube-scheduler-simulator.sigs.k8s.io/reserve-result: '{"VolumeBinding":"success"}'`

Used on: Pod

This annotation records the result of reserve scheduler plugins, used by https://sigs.k8s.io/kube-scheduler-simulator.
-->
### kube-scheduler-simulator.sigs.k8s.io/reserve-result

類別：註解

例子：`kube-scheduler-simulator.sigs.k8s.io/reserve-result: '{"VolumeBinding":"success"}'`

用於：Pod

此註解記錄了 reserve 調度插件的結果，用於
[kube-scheduler-simulator](https://sigs.k8s.io/kube-scheduler-simulator)。

<!--
### kube-scheduler-simulator.sigs.k8s.io/result-history

Type: Annotation

Example: `kube-scheduler-simulator.sigs.k8s.io/result-history: '[]'`

Used on: Pod

This annotation records all the past scheduling results from scheduler plugins, used by https://sigs.k8s.io/kube-scheduler-simulator.
-->
### kube-scheduler-simulator.sigs.k8s.io/result-history

類別：註解

例子：`kube-scheduler-simulator.sigs.k8s.io/result-history: '[]'`

用於：Pod

此註解記錄了所有過去的調度插件的調度結果，用於
[kube-scheduler-simulator](https://sigs.k8s.io/kube-scheduler-simulator)。

<!--
### kube-scheduler-simulator.sigs.k8s.io/score-result

Type: Annotation
-->
### kube-scheduler-simulator.sigs.k8s.io/score-result

類別：註解

例子：

```yaml
    kube-scheduler-simulator.sigs.k8s.io/score-result: >-
      {"node-282x7":{"ImageLocality":"0","InterPodAffinity":"0","NodeAffinity":"0","NodeNumber":"0","NodeResourcesBalancedAllocation":"76","NodeResourcesFit":"73","PodTopologySpread":"0","TaintToleration":"0","VolumeBinding":"0"},"node-gp9t4":{"ImageLocality":"0","InterPodAffinity":"0","NodeAffinity":"0","NodeNumber":"0","NodeResourcesBalancedAllocation":"76","NodeResourcesFit":"73","PodTopologySpread":"0","TaintToleration":"0","VolumeBinding":"0"}}
```

<!--
Used on: Pod

This annotation records the result of score scheduler plugins, used by https://sigs.k8s.io/kube-scheduler-simulator.
-->
用於：Pod

此註解記錄了 score 調度插件的結果，用於
[kube-scheduler-simulator](https://sigs.k8s.io/kube-scheduler-simulator)。

<!--
### kube-scheduler-simulator.sigs.k8s.io/selected-node

Type: Annotation

Example: `kube-scheduler-simulator.sigs.k8s.io/selected-node: node-282x7`

Used on: Pod

This annotation records the node that is selected by the scheduling cycle, used by https://sigs.k8s.io/kube-scheduler-simulator.
-->
### kube-scheduler-simulator.sigs.k8s.io/selected-node

類別：註解

例子：`kube-scheduler-simulator.sigs.k8s.io/selected-node: node-282x7`

用於：Pod

此註解記錄了調度週期選擇的節點，用於
[kube-scheduler-simulator](https://sigs.k8s.io/kube-scheduler-simulator)。

<!--
### internal.config.kubernetes.io/index

Type: Annotation

Example: `internal.config.kubernetes.io/index: "2"`

Used on: All objects

This annotation records the zero-indexed position of the YAML document that contains the object
within the manifest file the object was loaded from. Note that YAML documents are separated by
three dashes (`---`) and can each contain one object. When this annotation is not specified, a
value of 0 is implied.
-->
### internal.config.kubernetes.io/index {#internal-config-kubernetes-io-index}

類別：註解

例子：`internal.config.kubernetes.io/index: "2"`

用於：所有對象

該註解記錄了包含對象的 YAML 文檔在加載對象的清單文件中的零索引位置。
請注意，YAML 文檔由三個破折號（`---`）分隔，每個文檔可以包含一個對象。
如果未指定此註解，則該值爲 0。

<!--
This annotation is part of the Kubernetes Resource Model (KRM) Functions Specification,
which is used by Kustomize and similar third-party tools.

A KRM Function **should not** modify this annotation on input objects unless it is modifying the
referenced files. A KRM Function **may** include this annotation on objects it generates.
-->
該註解是 Kubernetes 資源模型（KRM）函數規範的一部分，被 Kustomize 和其他類似的第三方工具使用。

KRM 函數**不應**在輸入對象上修改此註解，除非它正在修改引用的文件。
KRM 函數**可以**在它所生成的對象上包含這個註解。

<!-- 
### kubernetes.io/arch

Type: Label

Example: `kubernetes.io/arch: "amd64"`

Used on: Node

The Kubelet populates this with `runtime.GOARCH` as defined by Go.
This can be handy if you are mixing ARM and x86 nodes.
-->
### kubernetes.io/arch {#kubernetes-io-arch}

類別：標籤

例子：`kubernetes.io/arch: "amd64"`

用於：Node

kubelet 使用 Go 定義的 `runtime.GOARCH` 填充它。如果你混合使用 ARM 和 X86 節點，這會很方便。

<!--
### kubernetes.io/os

Type: Label

Example: `kubernetes.io/os: "linux"`

Used on: Node, Pod

For nodes, the kubelet populates this with `runtime.GOOS` as defined by Go. This can be handy if you are
mixing operating systems in your cluster (for example: mixing Linux and Windows nodes).
-->
### kubernetes.io/os {#kubernetes-io-os}

類別：標籤

例子：`kubernetes.io/os: "linux"`

用於：Node，Pod

對於節點，kubelet 會根據 Go 定義的 `runtime.GOOS` 填充這個值。
你可以很方便地在叢集中混合使用操作系統（例如：混合使用 Linux 和 Windows 節點）。

<!--
You can also set this label on a Pod. Kubernetes allows you to set any value for this label;
if you use this label, you should nevertheless set it to the Go `runtime.GOOS` string for the operating
system that this Pod actually works with.

When the `kubernetes.io/os` label value for a Pod does not match the label value on a Node,
the kubelet on the node will not admit the Pod. However, this is not taken into account by
the kube-scheduler. Alternatively, the kubelet refuses to run a Pod where you have specified a Pod OS, if
this isn't the same as the operating system for the node where that kubelet is running. Just
look for [Pods OS](/docs/concepts/workloads/pods/#pod-os) for more details.
-->
你還可以在 Pod 上設置這個標籤。
Kubernetes 允許你爲此標籤設置任何值；如果你使用此標籤，
你應該將其設置爲與該 Pod 實際使用的操作系統相對應的 Go `runtime.GOOS` 字符串。

當 Pod 的 kubernetes.io/os 標籤值與節點上的標籤值不匹配時，節點上的 kubelet 不會運行該 Pod。
但是，kube-scheduler 並未考慮這一點。
另外，如果你爲 Pod 指定的操作系統與運行該 kubelet 的節點操作系統不相同，那麼 kubelet 會拒絕運行該 Pod。
請查看 [Pod 操作系統](/zh-cn/docs/concepts/workloads/pods/#pod-os)瞭解更多詳情。

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

類別：標籤

例子：`kubernetes.io/metadata.name: "mynamespace"`

用於：Namespace

Kubernetes API 伺服器（{{<glossary_tooltip text="控制平面" term_id="control-plane" >}} 的一部分）在所有
Namespace 上設置此標籤。標籤值被設置 Namespace 的名稱。你無法更改此標籤的值。

如果你想使用標籤{{<glossary_tooltip text="選擇算符" term_id="selector" >}}定位特定 Namespace，這很有用。

<!--
### kubernetes.io/limit-ranger

Type: Annotation

Example: `kubernetes.io/limit-ranger: "LimitRanger plugin set: cpu, memory request for container nginx; cpu, memory limit for container nginx"`

Used on: Pod
-->
### kubernetes.io/limit-ranger   {#kubernetes-io-limit-ranger}

類別：註解

例子：`kubernetes.io/limit-ranger: "LimitRanger plugin set: cpu, memory request for container nginx; cpu, memory limit for container nginx"`

用於：Pod

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
Kubernetes 默認不提供任何資源限制，這意味着除非你明確定義限制，否則你的容器將可以無限消耗 CPU 和內存。
你可以爲 Pod 定義默認請求或默認限制。爲此，你可以在相關命名空間中創建一個 LimitRange。
在你定義 LimitRange 後部署的 Pod 將受到這些限制。
註解 `kubernetes.io/limit-ranger` 記錄了爲 Pod 指定的資源默認值，以及成功應用這些默認值。
有關更多詳細信息，請閱讀 [LimitRange](/zh-cn/docs/concepts/policy/limit-range)。

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
類別：註解

例子：`kubernetes.io/config.hash: "df7cc47f8477b6b1226d7d23a904867b"`

用於：Pod

當 kubelet 基於給定的清單創建靜態 Pod 時，kubelet 會將此註解掛接到靜態 Pod 上。
註解的取值是 Pod 的 UID。請注意，kubelet 還會將 `.spec.nodeName` 設置爲當前節點名稱，
就像 Pod 被調度到此節點一樣。

### kubernetes.io/config.mirror

<!--
Type: Annotation

Example: `kubernetes.io/config.mirror: "df7cc47f8477b6b1226d7d23a904867b"`

Used on: Pod
-->
類別：註解

例子：`kubernetes.io/config.mirror: "df7cc47f8477b6b1226d7d23a904867b"`

用於：Pod

<!--
For a static Pod created by the kubelet on a node, a {{< glossary_tooltip text="mirror Pod" term_id="mirror-pod" >}}
is created on the API server. The kubelet adds an annotation to indicate that this Pod is
actually a mirror Pod. The annotation value is copied from the [`kubernetes.io/config.hash`](#kubernetes-io-config-hash)
annotation, which is the UID of the Pod.

When updating a Pod with this annotation set, the annotation cannot be changed or removed.
If a Pod doesn't have this annotation, it cannot be added during a Pod update.
-->
對於 kubelet 在節點上創建的靜態 Pod，
系統會在 API 伺服器上創建{{< glossary_tooltip text="映像檔 Pod" term_id="mirror-pod" >}}。
kubelet 添加一個註解以指示此 Pod 實際上是映像檔 Pod。
註解的值是從 [`kubernetes.io/config.hash`](#kubernetes-io-config-hash) 註解複製過來的，即 Pod 的 UID。

在更新設置了此註解的 Pod 時，註解不能被更改或移除。
如果 Pod 沒有此註解，此註解在 Pod 更新期間不能被添加。

### kubernetes.io/config.source

<!--
Type: Annotation

Example: `kubernetes.io/config.source: "file"`

Used on: Pod
-->
類別：註解

例子：`kubernetes.io/config.source: "file"`

用於：Pod

<!--
This annotation is added by the kubelet to indicate where the Pod comes from.
For static Pods, the annotation value could be one of `file` or `http` depending
on where the Pod manifest is located. For a Pod created on the API server and then
scheduled to the current node, the annotation value is `api`.
-->
此註解由 kubelet 添加，以指示 Pod 的來源。
對於靜態 Pod，註解的值可以是 `file` 或 `http` 之一，具體取決於 Pod 清單所在的位置。
對於在 API 伺服器上創建並調度到當前節點的 Pod，註解的值是 `api`。

### kubernetes.io/config.seen

<!--
Type: Annotation

Example: `kubernetes.io/config.seen: "2023-10-27T04:04:56.011314488Z"`

Used on: Pod

When the kubelet sees a Pod for the first time, it may add this annotation to
the Pod with a value of current timestamp in the RFC3339 format.
-->
類別：註解

例子：`kubernetes.io/config.seen: "2023-10-27T04:04:56.011314488Z"`

用於：Pod

當 kubelet 第一次看到 Pod 時，kubelet 可以將此註解添加到 Pod 上，
註解的值是格式爲 RFC3339 的當前時間戳。

<!--
### addonmanager.kubernetes.io/mode

Type: Label

Example: `addonmanager.kubernetes.io/mode: "Reconcile"`

Used on: All objects

To specify how an add-on should be managed, you can use the `addonmanager.kubernetes.io/mode` label.
This label can have one of three values: `Reconcile`, `EnsureExists`, or `Ignore`.
-->
### addonmanager.kubernetes.io/mode

類別：標籤

示例：`addonmanager.kubernetes.io/mode: "Reconcile"`

用於：所有對象

要指定如何管理外接插件，你可以使用 `addonmanager.kubernetes.io/mode` 標籤。
這個標籤可以有三個標籤之一：`Reconcile`、`EnsureExists` 或者 `Ignore`。

<!--
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
- `Reconcile`：插件資源將定期與預期狀態協調。如果有任何差異，插件管理器將根據需要重新創建、重新設定或刪除資源。
  如果沒有指定標籤，此值是默認值。
- `EnsureExists`：插件資源將僅檢查是否存在，但在創建後不會修改。當沒有具有該名稱的資源實例時，
  外接程序管理器將創建或重新創建資源。
- `Ignore`：插件資源將被忽略。此模式對於與外接插件管理器不兼容或由其他控制器管理的插件程序非常有用。

有關詳細信息，請參見
[Addon-manager](https://github.com/kubernetes/kubernetes/blob/master/cluster/addons/addon-manager/README.md)。

<!--
### beta.kubernetes.io/arch (deprecated)

Type: Label

This label has been deprecated. Please use [`kubernetes.io/arch`](#kubernetes-io-arch) instead.

### beta.kubernetes.io/os (deprecated)

Type: Label

This label has been deprecated. Please use [`kubernetes.io/os`](#kubernetes-io-os) instead.
-->
### beta.kubernetes.io/arch（已棄用） {#beta-kubernetes-io-arch}

類別：標籤

此標籤已被棄用。請改用 [`kubernetes.io/arch`](#kubernetes-io-arch)。

### beta.kubernetes.io/os（已棄用） {#beta-kubernetes-io-os}

類別：標籤

此標籤已被棄用。請改用 [`kubernetes.io/os`](#kubernetes-io-os)。

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

類別：標籤

例子：`kube-aggregator.kubernetes.io/automanaged: "onstart"`

用於：APIService

`kube-apiserver` 會在由 API 伺服器自動創建的所有 APIService 對象上設置這個標籤。
該標籤標記了控制平面應如何管理該 APIService。你不應自行添加、修改或移除此標籤。

{{< note >}}
<!--
Automanaged APIService objects are deleted by kube-apiserver when it has no built-in
or custom resource API corresponding to the API group/version of the APIService.
-->
當自動託管的 APIService 對象沒有內置或自定義資源 API 對應於該 APIService 的 API 組/版本時，
它將被 kube-apiserver 刪除。
{{< /note >}}

<!--
There are two possible values:

- `onstart`: The APIService should be reconciled when an API server starts up, but not otherwise.
- `true`: The API server should reconcile this APIService continuously.
-->
有兩個可能的值：

- `onstart`：API 伺服器應在啓動時協調 APIService，但在其他時間不會進行協調。
- `true`：API 伺服器應持續協調此 APIService。

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
### service.alpha.kubernetes.io/tolerate-unready-endpoints（已棄用）   {#service-alpha-kubernetes-io-tolerate-unready-endpoints-deprecated}

類別：註解

用於：StatefulSet

Service 上的這個註解表示 Endpoints 控制器是否應該繼續爲未準備好的 Pod 創建 Endpoints。
這些 Service 的 Endpoints 保留其 DNS 記錄，並從 kubelet 啓動 Pod 中的所有容器並將其標記爲
**Running** 的那一刻起繼續接收 Service 的流量，直到 kubelet 停止所有容器並從 API 伺服器刪除 Pod 爲止。

<!--
### autoscaling.alpha.kubernetes.io/behavior (deprecated) {#autoscaling-alpha-kubernetes-io-behavior}

Type: Annotation

Used on: HorizontalPodAutoscaler

This annotation was used to configure the scaling behavior for a HorizontalPodAutoscaler (HPA) in earlier Kubernetes versions.
It allowed you to specify how the HPA should scale pods up or down, including setting stabilization windows and scaling policies.
Setting this annotation has no effect in any supported release of Kubernetes.
-->
### autoscaling.alpha.kubernetes.io/behavior（已棄用）  {#autoscaling-alpha-kubernetes-io-behavior}

類別：註解

用於：HorizontalPodAutoscaler

此註解曾在早期的 Kubernetes 版本中用於設定 HorizontalPodAutoscaler（HPA）的擴縮容行爲。
它允許你指定 HPA 應如何擴容或縮容 Pod，包括設置穩定窗口和擴縮容策略。
在所有受支持的 Kubernetes 版本中，設置此註解沒有任何效果。

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

類別：標籤

示例：`kubernetes.io/hostname: "ip-172-20-114-199.ec2.internal"`

用於：Node

kubelet 使用主機名填充此標籤。請注意，可以通過將 `--hostname-override` 標誌傳遞給 `kubelet` 來替代“實際”主機名。

此標籤也用作拓撲層次結構的一部分。有關詳細信息，請參閱 [topology.kubernetes.io/zone](#topologykubernetesiozone)。

<!--
### kubernetes.io/change-cause {#change-cause}

Type: Annotation

Example: `kubernetes.io/change-cause: "kubectl edit --record deployment foo"`

Used on: All Objects

This annotation is a best guess at why something was changed.

It is populated when adding `--record` to a `kubectl` command that may change an object.
-->
### kubernetes.io/change-cause {#change-cause}

類別：註解

示例：`kubernetes.io/change-cause: "kubectl edit --record deployment foo"`

用於：所有對象

此註解是對某些事物發生變更的原因的最佳猜測。

將 `--record` 添加到可能會更改對象的 `kubectl` 命令時會填充它。

<!--
### kubernetes.io/description {#description}

Type: Annotation

Example: `kubernetes.io/description: "Description of K8s object."`

Used on: All Objects

This annotation is used for describing specific behaviour of given object.
-->
### kubernetes.io/description {#description}

類別：註解

示例：`kubernetes.io/description: "Description of K8s object."`

用於：所有對象

此註解用於描述給定對象的特定行爲。

<!--
### kubernetes.io/enforce-mountable-secrets (deprecated) {#enforce-mountable-secrets}

Type: Annotation

Example: `kubernetes.io/enforce-mountable-secrets: "true"`

Used on: ServiceAccount
-->
### kubernetes.io/enforce-mountable-secrets（已棄用）    {#enforce-mountable-secrets}

類別：註解

示例：`kubernetes.io/enforce-mountable-secrets: "true"`

用於：ServiceAccount

{{< note >}}
<!--
`kubernetes.io/enforce-mountable-secrets` is deprecated since Kubernetes v1.32. Use separate namespaces to isolate access to mounted secrets.
-->
`kubernetes.io/enforce-mountable-secrets` 自 Kubernetes v1.32 起已棄用。
使用單獨的命名空間來隔離對掛載 Secret 的訪問。
{{< /note >}}

<!--
The value for this annotation must be **true** to take effect.
When you set this annotation  to "true", Kubernetes enforces the following rules for
Pods running as this ServiceAccount:
-->
此註解的值必須爲 **true** 才能生效。
當你將此註解設置爲 "true" 時，Kubernetes 會對以此 ServiceAccount 運行的 Pod 強制執行以下規則：

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
1. 作爲卷掛載的 Secret 必須列在 ServiceAccount 的 `secrets` 字段中。
2. 針對容器（包括邊車容器和 Init 容器）在 `envFrom` 中引用的 Secret 也必須列在 ServiceAccount 的 `secrets` 字段中。
   如果 Pod 中的任一容器引用了未在 ServiceAccount 的 `secrets` 字段中列出的 Secret（即使該引用被標記爲 `optional`），
   則 Pod 將啓動失敗，並報錯表示不合規的 Secret 引用。
3. 在 Pod 的 `imagePullSecrets` 中引用的 Secret 必須出現在 ServiceAccount 的 `imagePullSecrets` 字段中，
   否則 Pod 將啓動失敗，並報錯表示不合規的映像檔拉取 Secret 引用。

<!--
When you create or update a Pod, these rules are checked. If a Pod doesn't follow them, it won't start and you'll see an error message.
If a Pod is already running and you change the `kubernetes.io/enforce-mountable-secrets` annotation
to true, or you edit the associated ServiceAccount to remove the reference to a Secret
that the Pod is already using, the Pod continues to run.
-->
當你創建或更新 Pod 時，系統會檢查這些規則。
如果 Pod 未遵循這些規則，Pod 將啓動失敗，並且你將看到一條錯誤消息。
如果 Pod 已經在運行，並且你將 `kubernetes.io/enforce-mountable-secrets` 註解更改爲 true，
或者你編輯關聯的 ServiceAccount 以移除 Pod 已經在使用的對 Secret 的引用，那麼 Pod 將繼續運行。

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

類別：標籤

示例：`node.kubernetes.io/exclude-from-external-load-balancers`

用於：Node

你可以向特定的 Worker 節點添加標籤，以將這些節點從外部負載均衡器使用的後端伺服器列表中去除。
以下命令可用於從後端集的後端伺服器列表中排除一個 Worker 節點：

<!--
```shell
kubectl label nodes <node-name> node.kubernetes.io/exclude-from-external-load-balancers=true
```
-->
```shell
kubectl label nodes <節點名稱> node.kubernetes.io/exclude-from-external-load-balancers=true
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

類別：註解

示例：`controller.kubernetes.io/pod-deletion-cost: "10"`

用於：Pod

該註解用於設置
[Pod 刪除成本](/zh-cn/docs/concepts/workloads/controllers/replicaset/#pod-deletion-cost)允許使用者影響
ReplicaSet 縮減順序。註解解析爲 `int32` 類型。

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

類別：註解

示例：`cluster-autoscaler.kubernetes.io/enable-ds-eviction: "true"`

用於：Pod

該註解控制 DaemonSet Pod 是否應由 ClusterAutoscaler 驅逐。
該註解需要在 DaemonSet 清單中的 DaemonSet Pod 上指定。
當該註解設爲 `"true"` 時，即使其他規則通常會阻止驅逐，也將允許 ClusterAutoscaler 驅逐 DaemonSet Pod。
要取消允許 ClusterAutoscaler 驅逐 DaemonSet Pod，你可以爲重要的 DaemonSet Pod 將該註解設爲 `"false"`。
如果未設置該註解，則 Cluster Autoscaler 將遵循其整體行爲（即根據其設定驅逐 DaemonSet）。

{{< note >}}
<!--
This annotation only impacts DaemonSet pods.
-->
該註解僅影響 DaemonSet Pod。
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

類別：註解

示例：`kubernetes.io/ingress-bandwidth: 10M`

用於：Pod

你可以對 Pod 應用服務質量流量控制並有效限制其可用帶寬。
入站流量（到 Pod）通過控制排隊的數據包來處理，以有效地處理數據。
要限制 Pod 的帶寬，請編寫對象定義 JSON 文件並使用 `kubernetes.io/ingress-bandwidth`
註解指定數據流量速度。用於指定入站的速率單位是每秒，
作爲[量綱（Quantity）](/zh-cn/docs/reference/kubernetes-api/common-definitions/quantity/)。
例如，`10M` 表示每秒 10 兆比特。

{{< note >}}
<!--
Ingress traffic shaping annotation is an experimental feature.
If you want to enable traffic shaping support, you must add the `bandwidth` plugin to your CNI
configuration file (default `/etc/cni/net.d`) and ensure that the binary is included in your CNI
bin dir (default `/opt/cni/bin`).
-->
入站流量控制註解是一項實驗性功能。
如果要啓用流量控制支持，必須將 `bandwidth` 插件添加到 CNI 設定文件（默認爲 `/etc/cni/net.d`）
並確保二進制文件包含在你的 CNI bin 目錄中（默認爲 `/opt/cni/bin`）。
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

類別：註解

示例：`kubernetes.io/egress-bandwidth: 10M`

用於：Pod

出站流量（來自 pod）由策略控制，策略只是丟棄超過設定速率的數據包。
你爲一個 Pod 所設置的限制不會影響其他 Pod 的帶寬。
要限制 Pod 的帶寬，請編寫對象定義 JSON 文件並使用 `kubernetes.io/egress-bandwidth` 註解指定數據流量速度。
用於指定出站的速率單位是每秒比特數，
以[量綱（Quantity）](/zh-cn/docs/reference/kubernetes-api/common-definitions/quantity/)的形式給出。
例如，`10M` 表示每秒 10 兆比特。

{{< note >}}
<!--
Egress traffic shaping annotation is an experimental feature.
If you want to enable traffic shaping support, you must add the `bandwidth` plugin to your CNI
configuration file (default `/etc/cni/net.d`) and ensure that the binary is included in your CNI
bin dir (default `/opt/cni/bin`).
-->
出站流量控制註解是一項實驗性功能。
如果要啓用流量控制支持，必須將 `bandwidth` 插件添加到 CNI 設定文件（默認爲 `/etc/cni/net.d`）
並確保二進制文件包含在你的 CNI bin 目錄中（默認爲 `/opt/cni/bin`）。
{{< /note >}}

<!--
### beta.kubernetes.io/instance-type (deprecated)

Type: Label
-->
### beta.kubernetes.io/instance-type（已棄用） {#beta-kubernetes-io-instance-type}

類別：標籤

{{< note >}}
<!--
Starting in v1.17, this label is deprecated in favor of
[node.kubernetes.io/instance-type](#nodekubernetesioinstance-type).
-->
從 v1.17 開始，此標籤已棄用，取而代之的是 [node.kubernetes.io/instance-type](#nodekubernetesioinstance-type)。
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

類別：標籤

示例：`node.kubernetes.io/instance-type: "m3.medium"`

用於：Node

kubelet 使用雲驅動定義的實例類型填充它。
僅當你使用雲驅動時纔會設置此項。如果你希望將某些工作負載定位到某些實例類型，
則此設置非常方便，但通常你希望依靠 Kubernetes 調度程序來執行基於資源的調度。
你應該基於屬性而不是實例類型來調度（例如：需要 GPU，而不是需要 `g2.2xlarge`）。

<!--
### failure-domain.beta.kubernetes.io/region (deprecated) {#failure-domainbetakubernetesioregion}

Type: Label
-->
### failure-domain.beta.kubernetes.io/region（已棄用） {#failure-domainbetakubernetesioregion}

類別：標籤

{{< note >}}
<!--
Starting in v1.17, this label is deprecated in favor of
[topology.kubernetes.io/region](#topologykubernetesioregion).
-->
從 v1.17 開始，此標籤已棄用，取而代之的是 [topology.kubernetes.io/region](#topologykubernetesioregion)。
{{</note>}}

<!--
### failure-domain.beta.kubernetes.io/zone (deprecated) {#failure-domainbetakubernetesiozone}

Type: Label
-->
### failure-domain.beta.kubernetes.io/zone（已棄用） {#failure-domainbetakubernetesiozone}

類別：標籤

{{< note >}}
<!--
Starting in v1.17, this label is deprecated in favor of
[topology.kubernetes.io/zone](#topologykubernetesiozone).
-->
從 v1.17 開始，此標籤已棄用，取而代之的是 [topology.kubernetes.io/zone](#topologykubernetesiozone)。
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
類別：註解

示例：`pv.kubernetes.io/bind-completed: "yes"`

用於：PersistentVolumeClaim

當在 PersistentVolumeClaim (PVC) 上設置此註解時，表示 PVC 的生命週期已通過初始綁定設置。
當存在此註解時，該信息會改變控制平面解釋 PVC 對象狀態的方式。此註解的值對 Kubernetes 無關緊要。

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
類別：註解

示例：`pv.kubernetes.io/bound-by-controller: "yes"`

用於：PersistentVolume、PersistentVolumeClaim

如果此註解設置在 PersistentVolume 或 PersistentVolumeClaim 上，則表示存儲綁定
（PersistentVolume → PersistentVolumeClaim，或 PersistentVolumeClaim → PersistentVolume）
已由{{< glossary_tooltip text="控制器" term_id="controller" >}}設定完畢。
如果未設置此註解，且存在存儲綁定，則缺少該註解意味着綁定是手動完成的。此註解的值無關緊要。

### pv.kubernetes.io/provisioned-by {#pv-kubernetesiodynamically-provisioned}

<!--
Type: Annotation

Example: `pv.kubernetes.io/provisioned-by: "kubernetes.io/rbd"`

Used on: PersistentVolume

This annotation is added to a PersistentVolume(PV) that has been dynamically provisioned by Kubernetes.
Its value is the name of volume plugin that created the volume. It serves both users (to show where a PV
comes from) and Kubernetes (to recognize dynamically provisioned PVs in its decisions).
-->
類別：註解

示例：`pv.kubernetes.io/provisioned-by: "kubernetes.io/rbd"`

用於：PersistentVolume

此註解被添加到已由 Kubernetes 動態製備的 PersistentVolume (PV)。
它的值是創建卷的卷插件的名稱。它同時服務於使用者（顯示 PV 的來源）和 Kubernetes（識別其決策中動態製備的 PV）。

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
類別：註解

示例：`pv.kubernetes.io/migrated-to: pd.csi.storage.gke.io`

用於：PersistentVolume、PersistentVolumeClaim

它被添加到 PersistentVolume (PV) 和 PersistentVolumeClaim (PVC)，應該由其相應的 CSI
驅動程序通過 `CSIMigration` 特性門控動態製備/刪除。設置此註解後，Kubernetes 組件將“停止”，
而 `external-provisioner` 將作用於對象。

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

類別：標籤

例子：`statefulset.kubernetes.io/pod-name: "mystatefulset-7"`

當 StatefulSet 控制器爲 StatefulSet 創建 Pod 時，控制平面會在該 Pod 上設置此標籤。標籤的值是正在創建的 Pod 的名稱。

有關詳細信息，請參閱 StatefulSet 主題中的
[Pod 名稱標籤](/zh-cn/docs/concepts/workloads/controllers/statefulset/#pod-name-label)。

<!--
### scheduler.alpha.kubernetes.io/node-selector {#schedulerkubernetesnode-selector}

Type: Annotation

Example: `scheduler.alpha.kubernetes.io/node-selector: "name-of-node-selector"`

Used on: Namespace

The [PodNodeSelector](/docs/reference/access-authn-authz/admission-controllers/#podnodeselector)
uses this annotation key to assign node selectors to pods in namespaces.
-->
### scheduler.alpha.kubernetes.io/node-selector {#schedulerkubernetesnode-selector}

類別：註解

示例：`scheduler.alpha.kubernetes.io/node-selector: "name-of-node-selector"`

用於：Namespace

[PodNodeSelector](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#podnodeselector)
使用此註解鍵爲名字空間中的 Pod 設置節點選擇算符。

<!--
### topology.kubernetes.io/region {#topologykubernetesioregion}

Type: Label

Example: `topology.kubernetes.io/region: "us-east-1"`

Used on: Node, PersistentVolume

See [topology.kubernetes.io/zone](#topologykubernetesiozone).
-->
### topology.kubernetes.io/region {#topologykubernetesioregion}

類別：標籤

示例：`topology.kubernetes.io/region: "us-east-1"`

用於：Node、PersistentVolume

請參閱 [topology.kubernetes.io/zone](#topologykubernetesiozone)。

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

類別：標籤

示例：`topology.kubernetes.io/zone: "us-east-1c"`

用於：Node、PersistentVolume

**在 Node 上**：`kubelet` 或外部 `cloud-controller-manager` 使用 `cloudprovider` 提供的信息填充它。
僅當你使用 `cloudprovider` 時纔會設置此項。
但是，如果它在你的拓撲中有意義，你應該考慮在 Node 上設置它。

**在 PersistentVolume 上**：拓撲感知卷設定器將自動在 `PersistentVolume` 上設置 Node 親和性約束。

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
一個 Zone 代表一個邏輯故障域。Kubernetes 叢集通常跨越多個 Zone 以提高可用性。
雖然 Zone 的確切定義留給基礎設施實現，但 Zone 的常見屬性包括 Zone 內非常低的網路延遲、Zone
內的免費網路流量以及與其他 Zone 的故障獨立性。例如，一個 Zone 內的 Node 可能共享一個網路交換機，
但不同 Zone 中的 Node 無法共享交換機。

一個 Region 代表一個更大的域，由一個或多個 Zone 組成。Kubernetes 叢集跨多個 Region 並不常見，
雖然 Zone 或 Region 的確切定義留給基礎設施實現，
但 Region 的共同屬性包括它們之間的網路延遲比它們內部更高，它們之間的網路流量成本非零，
以及與其他 Zone 或 Region 的故障獨立性。例如，一個 Region 內的 Node 可能共享電力基礎設施
（例如 UPS 或發電機），但不同 Region 的 Node 通常不會共享電力基礎設施。

<!--
Kubernetes makes a few assumptions about the structure of zones and regions:

1. regions and zones are hierarchical: zones are strict subsets of regions and
   no zone can be in 2 regions
2. zone names are unique across regions; for example region "africa-east-1" might be comprised
   of zones "africa-east-1a" and "africa-east-1b"
-->
Kubernetes 對 Zone 和 Region 的結構做了一些假設：

1. Zone 和 Region 是分層的：Zone 是 Region 的嚴格子集，沒有 Zone 可以在兩個 Region 中；

2. Zone 名稱跨 Region 是唯一的；例如，Region “africa-east-1” 可能由 Zone “africa-east-1a”
   和 “africa-east-1b” 組成。

<!--
It should be safe to assume that topology labels do not change.
Even though labels are strictly mutable, consumers of them can assume that a given node
is not going to be moved between zones without being destroyed and recreated.
-->
你可以大膽假設拓撲標籤不會改變。儘管嚴格地講標籤是可變的，
但節點的使用者可以假設給定節點只能通過銷燬和重新創建才能完成 Zone 間移動。

<!--
Kubernetes can use this information in various ways.
For example, the scheduler automatically tries to spread the Pods in a ReplicaSet across nodes
in a single-zone cluster (to reduce the impact of node failures, see
[kubernetes.io/hostname](#kubernetesiohostname)).
With multiple-zone clusters, this spreading behavior also applies to zones (to reduce the impact of zone failures).
This is achieved via _SelectorSpreadPriority_.
-->
Kubernetes 可以通過多種方式使用這些信息。例如，調度程序會自動嘗試將 ReplicaSet 中的 Pod
分佈在單 Zone 叢集中的多個節點上（以便減少節點故障的影響，請參閱 [kubernetes.io/hostname](#kubernetesiohostname)）。
對於多 Zone 叢集，這種分佈行爲也適用於 Zone（以減少 Zone 故障的影響）。
Zone 級別的 Pod 分佈是通過 **SelectorSpreadPriority** 實現的。

<!--
_SelectorSpreadPriority_ is a best effort placement. If the zones in your cluster are
heterogeneous (for example: different numbers of nodes, different types of nodes, or different pod
resource requirements), this placement might prevent equal spreading of your Pods across zones.
If desired, you can use homogeneous zones (same number and types of nodes) to reduce the probability
of unequal spreading.
-->
**SelectorSpreadPriority** 是一個盡力而爲的放置機制。如果叢集中的 Zone 是異構的
（例如：節點數量不同、節點類型不同或 Pod 資源需求有別等），這種放置機制可能會讓你的
Pod 無法實現跨 Zone 均勻分佈。
如果需要，你可以使用同質 Zone（節點數量和類型均相同）來減少不均勻分佈的可能性。

<!--
The scheduler (through the _VolumeZonePredicate_ predicate) also will ensure that Pods,
that claim a given volume, are only placed into the same zone as that volume.
Volumes cannot be attached across zones.
-->
調度程序還將（通過 **VolumeZonePredicate** 條件）確保申領給定卷的 Pod 僅被放置在與該卷相同的 Zone 中。
卷不能跨 Zone 掛接。

<!--
If `PersistentVolumeLabel` does not support automatic labeling of your PersistentVolumes,
you should consider adding the labels manually (or adding support for `PersistentVolumeLabel`).
With `PersistentVolumeLabel`, the scheduler prevents Pods from mounting volumes in a different zone.
If your infrastructure doesn't have this constraint, you don't need to add the zone labels to the volumes at all.
-->
你應該考慮手動添加標籤（或添加對 `PersistentVolumeLabel` 的支持）。
基於 `PersistentVolumeLabel`，調度程序可以防止 Pod 掛載來自其他 Zone 的卷。
如果你的基礎架構沒有此限制，則不需要將 Zone 標籤添加到捲上。

<!--
### volume.beta.kubernetes.io/storage-provisioner (deprecated)

Type: Annotation

Example: `volume.beta.kubernetes.io/storage-provisioner: "k8s.io/minikube-hostpath"`

Used on: PersistentVolumeClaim

This annotation has been deprecated since v1.23.
See [volume.kubernetes.io/storage-provisioner](#volume-kubernetes-io-storage-provisioner).
-->
### volume.beta.kubernetes.io/storage-provisioner（已棄用） {#volume-beta-kubernetes-io-storage-provisioner}

類別：註解

示例：`volume.beta.kubernetes.io/storage-provisioner: "k8s.io/minikube-hostpath"`

用於：PersistentVolumeClaim

此註解自 v1.23 已被棄用。
參見 [volume.kubernetes.io/storage-provisioner](#volume-kubernetes-io-storage-provisioner)。

<!--
### volume.beta.kubernetes.io/storage-class (deprecated)

Type: Annotation

Example: `volume.beta.kubernetes.io/storage-class: "example-class"`

Used on: PersistentVolume, PersistentVolumeClaim
-->
### volume.beta.kubernetes.io/storage-class（已棄用）   {#volume-beta-storage-class}

類別：註解

示例：`volume.beta.kubernetes.io/storage-class: "example-class"`

用於：PersistentVolume、PersistentVolumeClaim

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
此註解可以爲 PersistentVolume（PV）或 PersistentVolumeClaim（PVC）指定
[StorageClass](/zh-cn/docs/concepts/storage/storage-classes/)。
當 `storageClassName` 屬性和 `volume.beta.kubernetes.io/storage-class` 註解均被指定時，
註解 `volume.beta.kubernetes.io/storage-class` 將優先於 `storageClassName` 屬性。

此註解已被棄用。作爲替代方案，你應該爲 PersistentVolumeClaim 或 PersistentVolume 設置
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
### volume.beta.kubernetes.io/mount-options（已棄用） {#mount-options}

類別：註解

示例：`volume.beta.kubernetes.io/mount-options: "ro,soft"`

用於：PersistentVolume

針對 PersistentVolume 掛載到一個節點上的情形，
Kubernetes 管理員可以指定更多的[掛載選項](/zh-cn/docs/concepts/storage/persistent-volumes/#mount-options)。

<!--
### volume.kubernetes.io/storage-provisioner  {#volume-kubernetes-io-storage-provisioner}

Type: Annotation

Used on: PersistentVolumeClaim

This annotation is added to a PVC that is supposed to be dynamically provisioned.
Its value is the name of a volume plugin that is supposed to provision a volume
for this PVC.
-->
### volume.kubernetes.io/storage-provisioner {#volume-kubernetes-io-storage-provisioner}

類別：註解

用於：PersistentVolumeClaim

此註解將被添加到根據需要動態製備的 PVC 上。
其取值是假設爲 PVC 製備卷時卷插件的名稱。

<!--
### volume.kubernetes.io/selected-node

Type: Annotation

Used on: PersistentVolumeClaim

This annotation is added to a PVC that is triggered by a scheduler to be
dynamically provisioned. Its value is the name of the selected node.
-->
### volume.kubernetes.io/selected-node   {#selected-node}

類別：註解

用於：PersistentVolumeClaim

此註解被添加到調度程序所觸發的 PVC 上，對應的 PVC 需要被動態製備。註解值是選定節點的名稱。

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

類別：註解

用於：Node

如果節點已在其自身上設置了註解 `volumes.kubernetes.io/controller-managed-attach-detach`，
那麼它的存儲掛接和解除掛接的操作是交由
**卷掛接/解除掛接**{{< glossary_tooltip text="控制器" term_id="controller" >}}來管理的。

註解的值並不重要。

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

類別：標籤

示例：`node.kubernetes.io/windows-build: "10.0.17763"`

用於：Node

當 kubelet 在 Microsoft Windows 上運行時，它會自動標記其所在節點以記錄所使用的 Windows Server 的版本。

標籤的值採用 “MajorVersion.MinorVersion.BuildNumber” 格式。

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

類別：註解

示例：`storage.alpha.kubernetes.io/migrated-plugins: "kubernetes.io/cinder"`

用於：CSINode（一個擴展 API）

系統會自動爲映射到安裝 CSIDriver 的節點的 CSINode 對象添加此註解。
此註解顯示已遷移插件的樹內插件名稱，其值取決於叢集的樹內雲驅動存儲類型。

例如，如果樹內雲驅動存儲類型爲 `CSIMigrationvSphere`，則此節點的 CSINode 實例應更新爲：
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

類別：標籤

示例：`service.kubernetes.io/headless: ""`

用於：Endpoints

當擁有的 Service 是無頭類型時，控制平面將此標籤添加到 Endpoints 對象。
更多細節參閱[無頭服務](/zh-cn/docs/concepts/services-networking/service/#headless-services)。

<!--
### service.kubernetes.io/topology-aware-hints (deprecated) {#servicekubernetesiotopology-aware-hints}

Example: `service.kubernetes.io/topology-aware-hints: "Auto"`

Used on: Service
-->
### service.kubernetes.io/topology-aware-hints（已棄用） {#servicekubernetesiotopology-aware-hints}

示例：`service.kubernetes.io/topology-aware-hints: "Auto"`

用於：Service

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
此註解曾用於在 Service 中啓用**拓撲感知提示（topology aware hints）**。
然而，拓撲感知提示已經做了更名操作，
此概念現在名爲[拓撲感知路由（topology aware routing）](/zh-cn/docs/concepts/services-networking/topology-aware-routing/)。
在 Service 上將該註解設置爲 `Auto` 會設定 Kubernetes 控制平面，
以將拓撲提示添加到該 Service 關聯的 EndpointSlice 上。你也可以顯式地將該註解設置爲 `Disabled`。

如果你使用的是早於 {{< skew currentVersion >}} 的 Kubernetes 版本，
請查閱該版本對應的文檔，瞭解其拓撲感知路由的工作方式。

此註解沒有其他有效值。如果你不希望爲 Service 啓用拓撲感知提示，不要添加此註解。

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
類別：註解

示例：`service.kubernetes.io/topology-mode: Auto`

用於：Service

此註解提供了一種定義 Service 如何處理網路拓撲的方式；
例如，你可以設定 Service，以便 Kubernetes 更傾向於將客戶端和伺服器之間的流量保持在同一拓撲區域內。
在某些情況下，這有助於降低成本或提高網路性能。

更多細節參閱[拓撲感知路由](/zh-cn/docs/concepts/services-networking/topology-aware-routing/)。

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

類別：標籤

示例：`kubernetes.io/service-name: "my-website"`

用於：EndpointSlice

Kubernetes 使用這個標籤將
[EndpointSlices](/zh-cn/docs/concepts/services-networking/endpoint-slices/)
與[服務](/zh-cn/docs/concepts/services-networking/service/)關聯。

這個標籤記錄了 EndpointSlice 後備服務的{{< glossary_tooltip term_id="name" text="名稱">}}。
所有 EndpointSlice 都應將此標籤設置爲其關聯服務的名稱。

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

類別：註解

示例：`kubernetes.io/service-account.name: "sa-name"`

用於：Secret

這個註解記錄了令牌（存儲在 `kubernetes.io/service-account-token` 類型的 Secret 中）所代表的
ServiceAccount 的{{<glossary_tooltip term_id="name" text="名稱">}}。

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

類別：註解

示例：`kubernetes.io/service-account.uid: da68f9c6-9d26-11e7-b84e-002dc52800da`

用於：Secret

該註解記錄了令牌（存儲在 `kubernetes.io/service-account-token` 類型的 Secret 中）所代表的
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

類別：標籤

示例：`kubernetes.io/legacy-token-last-used: 2022-10-24`

用於：Secret

控制面僅爲 `kubernetes.io/service-account-token` 類型的 Secret 添加此標籤。
該標籤的值記錄着控制面最近一次接到客戶端使用服務賬號令牌進行身份驗證請求的日期（ISO 8601
格式，UTC 時區）

如果上一次使用老的令牌的時間在叢集獲得此特性（添加於 Kubernetes v1.26）之前，則不會設置此標籤。

### kubernetes.io/legacy-token-invalid-since

<!--
Type: Label

Example: `kubernetes.io/legacy-token-invalid-since: 2023-10-27`

Used on: Secret
-->
類別：標籤

示例：`kubernetes.io/legacy-token-invalid-since: 2023-10-27`

用於：Secret

<!--
The control plane automatically adds this label to auto-generated Secrets that
have the type `kubernetes.io/service-account-token`. This label marks the
Secret-based token as invalid for authentication. The value of this label
records the date (ISO 8601 format, UTC time zone) when the control plane detects
that the auto-generated Secret has not been used for a specified duration
(defaults to one year).
-->
控制平面會自動將此標籤添加到類別爲 `kubernetes.io/service-account-token` 的自動生成的 Secret 中。
此標籤將基於 Secret 的令牌標記爲無效的認證令牌。此標籤的值記錄了控制平面檢測到自動生成的
Secret 在指定時間段內（默認是一年）未被使用的日期（ISO 8601 格式，UTC 時區）。

<!--
### endpoints.kubernetes.io/managed-by (deprecated) {#endpoints-kubernetes-io-managed-by}

Type: Label

Example: `endpoints.kubernetes.io/managed-by: endpoint-controller`
-->
### endpoints.kubernetes.io/managed-by（已棄用） {#endpoints-kubernetes-io-managed-by}

類別：標籤

示例：`endpoints.kubernetes.io/managed-by: endpoint-controller`

<!--
Used on: Endpoints

This label is used internally to mark Endpoints objects that were created by
Kubernetes (as opposed to Endpoints created by users or external controllers).
-->
用於：Endpoints

此標籤用於在內部標記由 Kubernetes 創建的 Endpoints
對象（與使用者或外部控制器所創建的 Endpoints 相對）。

{{< note >}}
<!--
The [Endpoints](/docs/reference/kubernetes-api/service-resources/endpoints-v1/)
API is deprecated in favor of
[EndpointSlice](/docs/reference/kubernetes-api/service-resources/endpoint-slice-v1/).
-->
[Endpoints](/zh-cn/docs/reference/kubernetes-api/service-resources/endpoints-v1/) API
已被棄用，推薦使用
[EndpointSlice](/zh-cn/docs/reference/kubernetes-api/service-resources/endpoint-slice-v1/) 作爲替代方案。
{{< /note >}}

<!--
### endpointslice.kubernetes.io/managed-by {#endpointslicekubernetesiomanaged-by}

Type: Label

Example: `endpointslice.kubernetes.io/managed-by: endpointslice-controller.k8s.io`

Used on: EndpointSlices

The label is used to indicate the controller or entity that manages the EndpointSlice. This label
aims to enable different EndpointSlice objects to be managed by different controllers or entities
within the same cluster. The value `endpointslice-controller.k8s.io` indicates an
EndpointSlice object that was created automatically by Kubernetes for a Service with a
{{< glossary_tooltip text="selectors" term_id="selector" >}}.
-->
### endpointslice.kubernetes.io/managed-by {#endpointslicekubernetesiomanaged-by}

類別：標籤

示例：`endpointslice.kubernetes.io/managed-by: "endpointslice-controller.k8s.io"`

用於：EndpointSlice

用於標示管理 EndpointSlice 的控制器或實體。該標籤旨在使不同的 EndpointSlice
對象能夠由同一叢集內的不同控制器或實體管理。取值 `endpointslice-controller.k8s.io`
表示某個 EndpointSlice 對象是由 Kubernetes
自動爲具有{{< glossary_tooltip text="選擇算符" term_id="selector" >}}的 Service 所創建的。

<!--
### endpointslice.kubernetes.io/skip-mirror {#endpointslicekubernetesioskip-mirror}

Type: Label

Example: `endpointslice.kubernetes.io/skip-mirror: "true"`

Used on: Endpoints

The label can be set to `"true"` on an Endpoints resource to indicate that the
EndpointSliceMirroring controller should not mirror this resource with EndpointSlices.
-->
### endpointslice.kubernetes.io/skip-mirror {#endpointslicekubernetesioskip-mirror}

類別：標籤

示例：`endpointslice.kubernetes.io/skip-mirror: "true"`

用於：Endpoints

可以在 Endpoints 資源上將此標籤設置爲 `"true"`，以指示 EndpointSliceMirroring
控制器不應使用 EndpointSlice 映像檔此 Endpoints 資源。

<!--
### service.kubernetes.io/service-proxy-name {#servicekubernetesioservice-proxy-name}

Type: Label

Example: `service.kubernetes.io/service-proxy-name: "foo-bar"`

Used on: Service
-->
### service.kubernetes.io/service-proxy-name {#servicekubernetesioservice-proxy-name}

類別：標籤

示例：`service.kubernetes.io/service-proxy-name: "foo-bar"`

用於：Service

<!--
Setting a value for this label tells kube-proxy to ignore this service for proxying purposes.
This allows for use of alternative proxy implementations for this service (e.g. running
a DaemonSet that manages nftables its own way). Multiple alternative proxy implementations
could be active simultaneously using this field, e.g. by having a value unique to each
alternative proxy implementation to be responsible for their respective services.
-->
爲這個標籤設置一個值會告訴 kube-proxy 在執行代理操作時忽略此 Service。
這一標籤使得使用者能夠爲此 Service 使用替代的代理實現（例如，運行管理 nftables 的 DaemonSet）。
通過此字段，可以同時激活多個替代代理實現，例如，爲每個替代代理實現設置唯一值，
以負責各自的 Service。

<!--
### experimental.windows.kubernetes.io/isolation-type (deprecated) {#experimental-windows-kubernetes-io-isolation-type}

Type: Annotation

Example: `experimental.windows.kubernetes.io/isolation-type: "hyperv"`

Used on: Pod

The annotation is used to run Windows containers with Hyper-V isolation.
-->
### experimental.windows.kubernetes.io/isolation-type（已棄用） {#experimental-windows-kubernetes-io-isolation-type}

類別：註解

示例：`experimental.windows.kubernetes.io/isolation-type: "hyperv"`

用於：Pod

此註解用於運行具有 Hyper-V 隔離的 Windows 容器。

{{< note >}}
<!--
Starting from v1.20, this annotation is deprecated.
Experimental Hyper-V support was removed in 1.21.
-->
從 v1.20 開始，此註解已棄用。v1.21 中移除了實驗性 Hyper-V 支持。
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

類別：註解

示例：`ingressclass.kubernetes.io/is-default-class: "true"`

用於：IngressClass

當單個 IngressClass 資源將此註解設置爲 `"true"`時，新的未指定 Ingress 類的 Ingress
資源將被設置爲此默認類。

<!--
### nginx.ingress.kubernetes.io/configuration-snippet

Type: Annotation

Example: `nginx.ingress.kubernetes.io/configuration-snippet: "  more_set_headers \"Request-Id: $req_id\";\nmore_set_headers \"Example: 42\";\n"`

Used on: Ingress

You can use this annotation to set extra configuration on an Ingress that
uses the [NGINX Ingress Controller](https://github.com/kubernetes/ingress-nginx/).
The `configuration-snippet` annotation is ignored
by default since version 1.9.0 of the ingress controller.
The NGINX ingress controller setting `allow-snippet-annotations.`
has to be explicitly enabled to use this annotation.
Enabling the annotation can be dangerous in a multi-tenant cluster, as it can lead people with otherwise
limited permissions being able to retrieve all Secrets in the cluster.
-->
### nginx.ingress.kubernetes.io/configuration-snippet {#nginx-ingress-kubernetes-io-configuration-snippet}

類別：註解

示例：`nginx.ingress.kubernetes.io/configuration-snippet: "  more_set_headers \"Request-Id: $req_id\";\nmore_set_headers \"Example: 42\";\n"`

用於：Ingress

你可以使用此註解在使用 [NGINX Ingress Controller](https://github.com/kubernetes/ingress-nginx/)
的 Ingress 上設置額外設定。自 Ingress 控制器 1.9.0 版本以來，`configuration-snippet` 註解默認會被忽略。
要使用此註解，必須顯式啓用 NGINX Ingress 控制器的 `allow-snippet-annotations` 設置。
在多租戶叢集中啓用該註解可能是危險的，因爲這可能導致權限受限的使用者能夠獲取叢集中的所有 Secret。

<!--
### kubernetes.io/ingress.class (deprecated)

Type: Annotation

Used on: Ingress
-->
### kubernetes.io/ingress.class（已棄用） {#kubernetes-io-ingress-class}

類別：註解

用於：Ingress

{{< note >}}
<!--
Starting in v1.18, this annotation is deprecated in favor of `spec.ingressClassName`.
-->
從 v1.18 開始，此註解被棄用，改爲鼓勵使用 `spec.ingressClassName`。
{{</note>}}

<!--
### kubernetes.io/cluster-service (deprecated) {#kubernetes-io-cluster-service}

Type: Label

Example: `kubernetes.io/cluster-service: "true"`

Used on: Service
-->
### kubernetes.io/cluster-service（已棄用）   {#kubernetes-io-cluster-service}

類別：Label

示例：`kubernetes.io/cluster-service: "true"`

用於：Service

<!--
This label indicates that the Service provides a service to the cluster, if the value is set to true.
When you run `kubectl cluster-info`, the tool queries for Services with this label set to true.

However, setting this label on any Service is deprecated.
-->
此標籤表示當值設置爲 `true` 時，Service 向叢集提供服務。
當你運行 `kubectl cluster-info` 時，該工具會查詢具有此標籤且值爲 `true` 的 Service。

然而，在此任何 Service 上設置此標籤已棄用。

<!--
### storageclass.kubernetes.io/is-default-class

Type: Annotation

Example: `storageclass.kubernetes.io/is-default-class: "true"`

Used on: StorageClass

When a single StorageClass resource has this annotation set to `"true"`, new PersistentVolumeClaim
resource without a class specified will be assigned this default class.
-->
### storageclass.kubernetes.io/is-default-class {#storageclass-kubernetes-io-is-default-class}

類別：註解

示例：`storageclass.kubernetes.io/is-default-class: "true"`

用於：StorageClass

當單個 StorageClass 資源將此註解設置爲 `"true"` 時，新的未指定存儲類的 PersistentVolumeClaim
資源將被設置爲此默認類。

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

類別：註解

示例：`alpha.kubernetes.io/provided-node-ip: "10.0.0.1"`

用於：Node

kubelet 可以在 Node 上設置此註解來表示其設定的 IPv4 與/或 IPv6 地址。

如果 kubelet 被啓動時 `--cloud-provider` 標誌設置爲任一雲驅動（包括外部雲驅動和傳統樹內雲驅動）
kubelet 會在 Node 上設置此註解以表示從命令列標誌（`--node-ip`）設置的 IP 地址。
雲控制器管理器通過雲驅動驗證此 IP 是否有效。

<!--
### batch.kubernetes.io/job-completion-index

Type: Annotation, Label

Example: `batch.kubernetes.io/job-completion-index: "3"`

Used on: Pod

The Job controller in the kube-controller-manager sets this as a label and annotation for Pods
created with Indexed [completion mode](/docs/concepts/workloads/controllers/job/#completion-mode).
-->
### batch.kubernetes.io/job-completion-index {#batch-kubernetes-io-job-completion-index}

類別：註解、標籤

示例：`batch.kubernetes.io/job-completion-index: "3"`

用於：Pod

kube-controller-manager 中的 Job 控制器爲使用 Indexed
[完成模式](/zh-cn/docs/concepts/workloads/controllers/job/#completion-mode)創建的 Pod
設置此標籤和註解。

<!--
Note the [PodIndexLabel](/docs/reference/command-line-tools-reference/feature-gates/)
feature gate must be enabled for this to be added as a pod **label**,
otherwise it will just be an annotation.
-->
請注意，[PodIndexLabel](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)
特性門控必須被啓用，才能將其添加爲 Pod 的**標籤**，否則它只會用作註解。

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
類別：註解

例子：`batch.kubernetes.io/cronjob-scheduled-timestamp: "2016-05-19T03:00:00-07:00"`

用於：CronJob 所控制的 Job 和 Pod

此註解在 Job 是 CronJob 的一部分時用於記錄 Job 的原始（預期）創建時間戳。
控制平面會將該值設置爲 RFC3339 格式的時間戳。如果 Job 屬於設置了時區的 CronJob，
則時間戳以該時區爲基準。否則，時間戳以 controller-manager 的本地時間爲準。

<!--
### kubectl.kubernetes.io/default-container

Type: Annotation

Example: `kubectl.kubernetes.io/default-container: "front-end-app"`

The value of the annotation is the container name that is default for this Pod.
For example, `kubectl logs` or `kubectl exec` without `-c` or `--container` flag
will use this default container.
-->
### kubectl.kubernetes.io/default-container {#kubectl-kubernetes-io-default-container}

類別：註解

例子：`kubectl.kubernetes.io/default-container: "front-end-app"`

此註解的值是此 Pod 的默認容器名稱。例如，未指定 `-c` 或 `--container` 標誌時執行
`kubectl logs` 或 `kubectl exec` 命令將使用此默認容器。

<!--
### kubectl.kubernetes.io/default-logs-container (deprecated)

Type: Annotation

Example: `kubectl.kubernetes.io/default-logs-container: "front-end-app"`

The value of the annotation is the container name that is the default logging container for this
Pod. For example, `kubectl logs` without `-c` or `--container` flag will use this default
container.
-->
### kubectl.kubernetes.io/default-logs-container（已棄用）   {#default-logs-container}

類別：註解

例子：`kubectl.kubernetes.io/default-logs-container: "front-end-app"`

此註解的值是針對此 Pod 的默認日誌記錄容器的名稱。例如，不帶 `-c` 或 `--container`
標誌的 `kubectl logs` 將使用此默認容器。

{{< note >}}
<!--
This annotation is deprecated. You should use the
[`kubectl.kubernetes.io/default-container`](#kubectl-kubernetes-io-default-container)
annotation instead. Kubernetes versions 1.25 and newer ignore this annotation.
-->
此註解已被棄用。取而代之的是使用
[`kubectl.kubernetes.io/default-container`](#kubectl-kubernetes-io-default-container) 註解。
Kubernetes v1.25 及更高版本將忽略此註解。
{{< /note >}}

### kubectl.kubernetes.io/last-applied-configuration

<!--
Type: Annotation

Example: _see following snippet_
-->
類別：註解

例子：**參見以下代碼片段**

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
用於：所有對象

kubectl 命令列工具使用此註解作爲一種舊的機制來跟蹤變更。
該機制已被[伺服器端應用](/zh-cn/docs/reference/using-api/server-side-apply/)取代。

### kubectl.kubernetes.io/restartedAt {#kubectl-k8s-io-restart-at}

<!--
Type: Annotation

Example: `kubectl.kubernetes.io/restartedAt: "2024-06-21T17:27:41Z"`

Used on: Deployment, ReplicaSet, StatefulSet, DaemonSet, Pod
-->
類別：註解

例子：`kubectl.kubernetes.io/restartedAt: "2024-06-21T17:27:41Z"`

用於：Deployment、ReplicaSet、StatefulSet、DaemonSet、Pod

<!--
This annotation contains the latest restart time of a resource (Deployment, ReplicaSet, StatefulSet or DaemonSet),
where kubectl triggered a rollout in order to force creation of new Pods.
The command `kubectl rollout restart <RESOURCE>` triggers a restart by patching the template
metadata of all the pods of resource with this annotation. In above example the latest restart time is shown as 21st June 2024 at 17:27:41 UTC.
-->
此註解包含資源（Deployment、ReplicaSet、StatefulSet 或 DaemonSet）的最新重啓時間，
kubectl 通過觸發一次 rollout 來強制創建新的 Pod。
`kubectl rollout restart <RESOURCE>` 命令觸發資源重啓時給資源的所有 Pod 的模板元數據打上此註解補丁。
在上述例子中，最新的重啓時間顯示爲 2024 年 6 月 21 日 17:27:41 UTC。

<!--
You should not assume that this annotation represents the date / time of the most recent update;
a separate change could have been made since the last manually triggered rollout.

If you manually set this annotation on a Pod, nothing happens. The restarting side effect comes from
how workload management and Pod templating works.
-->
你不應假設此註解代表最近一次更新的日期/時間；在上次手動觸發的 rollout 之後，可能還進行了其他獨立更改。

如果你手動在 Pod 上設置此註解，什麼都不會發生。這個重啓的副作用是工作負載管理和 Pod 模板化的工作方式所造成的。

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

類別：註解

例子：`endpoints.kubernetes.io/over-capacity:truncated`

用於：Endpoints

如果關聯的 {{< glossary_tooltip term_id="service" >}} 有超過 1000 個後備端點，
則{{< glossary_tooltip text="控制平面" term_id="control-plane" >}}將此註解添加到
[Endpoints](/zh-cn/docs/concepts/services-networking/service/#endpoints) 對象。
此註解表示 Endpoints 對象已超出容量，並且已將 Endpoints 數截斷爲 1000。

如果後端端點的數量低於 1000，則控制平面將移除此註解。

### endpoints.kubernetes.io/last-change-trigger-time

<!--
Type: Annotation

Example: `endpoints.kubernetes.io/last-change-trigger-time: "2023-07-20T04:45:21Z"`

Used on: Endpoints

This annotation set to an [Endpoints](/docs/concepts/services-networking/service/#endpoints) object that
represents the timestamp (The timestamp is stored in RFC 3339 date-time string format. For example, '2018-10-22T19:32:52.1Z'). This is timestamp
of the last change in some Pod or Service object, that triggered the change to the Endpoints object.
-->
類別：註解

例子：`endpoints.kubernetes.io/last-change-trigger-time: "2023-07-20T04:45:21Z"`

用於：Endpoints

此註解設置在 [Endpoints](/zh-cn/docs/concepts/services-networking/service/#endpoints) 對象上，
表示時間戳（此時間戳以 RFC 3339 日期時間字符串格式存儲。例如，“2018-10-22T19:32:52.1Z”）。
這是某個 Pod 或 Service 對象發生變更並觸發 Endpoints 對象變更的時間戳。

<!--
### control-plane.alpha.kubernetes.io/leader (deprecated) {#control-plane-alpha-kubernetes-io-leader}

Type: Annotation

Example: `control-plane.alpha.kubernetes.io/leader={"holderIdentity":"controller-0","leaseDurationSeconds":15,"acquireTime":"2023-01-19T13:12:57Z","renewTime":"2023-01-19T13:13:54Z","leaderTransitions":1}`

Used on: Endpoints
-->
### control-plane.alpha.kubernetes.io/leader（已棄用） {#control-plane-alpha-kubernetes-io-leader}

類別：註解

例子：`control-plane.alpha.kubernetes.io/leader={"holderIdentity":"controller-0","leaseDurationSeconds":15,"acquireTime":"2023-01-19T13:12:57Z","renewTime":"2023-01-19T13:13:54Z","leaderTransitions":1}`

用於：Endpoints

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
對象上設置此註解。此註解提供以下細節：

- 當前的領導者是誰。
- 獲取當前領導權的時間。
- 租約（領導權）的持續時間，以秒爲單位。
- 當前租約（當前領導權）應被續約的時間。
- 過去發生的領導權轉換次數。

Kubernetes 現在使用[租約](/zh-cn/docs/concepts/architecture/leases/)來管理 Kubernetes 控制平面的領導者分配。

<!--
### batch.kubernetes.io/job-tracking (deprecated) {#batch-kubernetes-io-job-tracking}

Type: Annotation

Example: `batch.kubernetes.io/job-tracking: ""`

Used on: Jobs

The presence of this annotation on a Job used to indicate that the control plane is
[tracking the Job status using finalizers](/docs/concepts/workloads/controllers/job/#job-tracking-with-finalizers).
-->
### batch.kubernetes.io/job-tracking（已棄用） {#batch-kubernetes-io-job-tracking}

類別：註解

例子：`batch.kubernetes.io/job-tracking: ""`

用於：Job

Job 上存在此註解表明控制平面正在[使用 Finalizer 追蹤 Job](/zh-cn/docs/concepts/workloads/controllers/job/#job-tracking-with-finalizers)。

<!--
Adding or removing this annotation no longer has an effect (Kubernetes v1.27 and later)
All Jobs are tracked with finalizers.
-->
添加或刪除此註解不再有效（Kubernetes v1.27 及更高版本），
所有 Job 均通過 Finalizer 進行追蹤。

<!--
### job-name (deprecated) {#job-name}

Type: Label

Example: `job-name: "pi"`

Used on: Jobs and Pods controlled by Jobs
-->
### job-name (deprecated) {#job-name}

類別：標籤

示例：`job-name: "pi"`

用於：由 Job 控制的 Job 和 Pod

{{< note >}}
<!--
Starting from Kubernetes 1.27, this label is deprecated.
Kubernetes 1.27 and newer ignore this label and use the prefixed `job-name` label.
-->
由 Kubernetes 1.27 開始，此標籤被棄用。
Kubernetes 1.27 及更高版本忽略這個標籤，改爲具有 `job-name` 前綴的標籤。
{{< /note >}}

<!--
### controller-uid (deprecated) {#controller-uid}

Type: Label

Example: `controller-uid: "$UID"`

Used on: Jobs and Pods controlled by Jobs
-->
### controller-uid (deprecated) {#controller-uid}

類別：標籤

示例：`controller-uid: "$UID"`

用於：由 Job 控制的 Job 和 Pod

{{< note >}}
<!--
Starting from Kubernetes 1.27, this label is deprecated.
Kubernetes 1.27 and newer ignore this label and use the prefixed `controller-uid` label.
-->
由 Kubernetes 1.27 開始，此標籤被棄用。
Kubernetes 1.27 及更高版本忽略這個標籤，改爲具有 `controller-uid` 前綴的標籤。
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

類別：標籤

示例：`batch.kubernetes.io/job-name: "pi"`

用於：由 Job 控制的 Job 和 Pod

這個標籤被用作一種使用者友好的方式來獲得與某個 Job 相對應的 Pod。
`job-name` 來自 Job 的 `name` 並且允許以一種簡單的方式獲得與 Job 對應的 Pod。

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

類別：標籤

示例：`batch.kubernetes.io/controller-uid: "$UID"`

用於：由 Job 控制的 Job 和 Pod

這個標籤被用作一種編程方式來獲得對應於某個 Job 的所有 Pod。
`controller-uid` 是在 `selector` 字段中設置的唯一標識符，
因此 Job 控制器可以獲取所有對應的 Pod。

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

類別：註解

例子：`scheduler.alpha.kubernetes.io/defaultTolerations: '[{"operator": "Equal", "value": "value1", "effect": "NoSchedule", "key": "dedicated-node"}]'`

用於：Namespace

此註解需要啓用
[PodTolerationRestriction](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#podtolerationrestriction)
准入控制器。此註解鍵允許爲某個命名空間分配容忍度，在這個命名空間中創建的所有新 Pod 都會被添加這些容忍度。

<!--
### scheduler.alpha.kubernetes.io/tolerationsWhitelist {#schedulerkubernetestolerations-whitelist}

Type: Annotation

Example: `scheduler.alpha.kubernetes.io/tolerationsWhitelist: '[{"operator": "Exists", "effect": "NoSchedule", "key": "dedicated-node"}]'`

Used on: Namespace
-->
### scheduler.alpha.kubernetes.io/tolerationsWhitelist {#schedulerkubernetestolerations-whitelist}

類別：註解

示例：`scheduler.alpha.kubernetes.io/tolerationsWhitelist: '[{"operator": "Exists", "effect": "NoSchedule", "key": "dedicated-node"}]'`

用於：命名空間

<!--
This annotation is only useful when the (Alpha)
[PodTolerationRestriction](/docs/reference/access-authn-authz/admission-controllers/#podtolerationrestriction)
admission controller is enabled. The annotation value is a JSON document that defines a list of
allowed tolerations for the namespace it annotates. When you create a Pod or modify its
tolerations, the API server checks the tolerations to see if they are mentioned in the allow list.
The pod is admitted only if the check succeeds.
-->
此註解只有在啓用（Alpha）
[PodTolerationRestriction](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#podtolerationrestriction)
控制器時才生效。註解值是一個 JSON 文檔，它爲它所註解的命名空間定義了一個允許容忍的列表。
當你創建一個 Pod 或修改其容忍度時，API 伺服器將檢查容忍度，以查看它們是否在允許列表中。
只有在檢查成功的情況下，Pod 才被允操作。

<!--
### scheduler.alpha.kubernetes.io/preferAvoidPods (deprecated) {#scheduleralphakubernetesio-preferavoidpods}

Type: Annotation

Used on: Node

This annotation requires the [NodePreferAvoidPods scheduling plugin](/docs/reference/scheduling/config/#scheduling-plugins)
to be enabled. The plugin is deprecated since Kubernetes 1.22.
Use [Taints and Tolerations](/docs/concepts/scheduling-eviction/taint-and-toleration/) instead.
-->
### scheduler.alpha.kubernetes.io/preferAvoidPods（已棄用） {#scheduleralphakubernetesio-preferavoidpods}

類別：註解

用於：Node

此註解需要啓用 [NodePreferAvoidPods 調度插件](/zh-cn/docs/reference/scheduling/config/#scheduling-plugins)。
該插件自 Kubernetes 1.22 起已被棄用。
請改用[污點和容忍度](/zh-cn/docs/concepts/scheduling-eviction/taint-and-toleration/)。

<!--
### node.kubernetes.io/not-ready

Type: Taint

Example: `node.kubernetes.io/not-ready: "NoExecute"`

Used on: Node

The Node controller detects whether a Node is ready by monitoring its health
and adds or removes this taint accordingly.
-->
### node.kubernetes.io/not-ready {#node-kubernetes-io-not-ready}

類別：污點

例子：`node.kubernetes.io/not-ready: "NoExecute"`

用於：Node

Node 控制器通過監控 Node 的健康狀況來檢測 Node 是否準備就緒，並相應地添加或移除此污點。

<!--
### node.kubernetes.io/unreachable

Type: Taint

Example: `node.kubernetes.io/unreachable: "NoExecute"`

Used on: Node

The Node controller adds the taint to a Node corresponding to the
[NodeCondition](/docs/concepts/architecture/nodes/#condition) `Ready` being `Unknown`.
-->
### node.kubernetes.io/unreachable {#node-kubernetes-io-unreachable}

類別：污點

例子：`node.kubernetes.io/unreachable: "NoExecute"`

用於：Node

Node 控制器將此污點添加到對應[節點狀況](/zh-cn/docs/concepts/architecture/nodes/#condition)
`Ready` 爲 `Unknown` 的 Node 上。

<!--
### node.kubernetes.io/unschedulable

Type: Taint

Example: `node.kubernetes.io/unschedulable: "NoSchedule"`

Used on: Node

The taint will be added to a node when initializing the node to avoid race condition.
-->
### node.kubernetes.io/unschedulable {#node-kubernetes-io-unschedulable}

類別：污點

例子：`node.kubernetes.io/unschedulable: "NoSchedule"`

用於：Node

在初始化 Node 期間，爲避免競爭條件，此污點將被添加到 Node 上。

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

類別：污點

例子：`node.kubernetes.io/memory-pressure: "NoSchedule"`

用於：Node

kubelet 根據在 Node 上觀察到的 `memory.available` 和 `allocatableMemory.available` 檢測內存壓力。
然後將觀察到的值與可以在 kubelet 上設置的相應閾值進行比較，以確定是否應添加/移除 Node 狀況和污點。

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

類別：污點

例子：`node.kubernetes.io/disk-pressure :"NoSchedule"`

用於：Node

kubelet 根據在 Node 上觀察到的 `imagefs.available`、`imagefs.inodesFree`、`nodefs.available`
和 `nodefs.inodesFree`（僅限 Linux ）檢測磁盤壓力。
然後將觀察到的值與可以在 kubelet 上設置的相應閾值進行比較，以確定是否應添加/移除 Node 狀況和污點。

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

類別：污點

例子：`node.kubernetes.io/network-unavailable: "NoSchedule"`

用於：Node

當使用的雲驅動指示需要額外的網路設定時，此註解最初由 kubelet 設置。
只有雲上的路由被正確地設定了，此污點纔會被雲驅動移除。

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

類別：污點

例子：`node.kubernetes.io/pid-pressure: "NoSchedule"`

用於：Node

kubelet 檢查 `/proc/sys/kernel/pid_max` 大小的 D 值和 Kubernetes 在 Node 上消耗的 PID，
以獲取可用 PID 數量，並將其作爲 `pid.available` 指標值。
然後該指標與在 kubelet 上設置的相應閾值進行比較，以確定是否應該添加/移除 Node 狀況和污點。

### node.kubernetes.io/out-of-service {#out-of-service}

<!--
Type: Taint

Example: `node.kubernetes.io/out-of-service:NoExecute`

Used on: Node

A user can manually add the taint to a Node marking it out-of-service.
If a Node is marked out-of-service with this taint, the Pods on the node 
will be forcefully deleted if there are no matching tolerations on it and
volume detach operations for the Pods terminating on the node will happen immediately.
This allows the Pods on the out-of-service node to recover quickly on a different node.
-->
類別：污點

例子：`node.kubernetes.io/out-of-service:NoExecute`

用於：Node

使用者可以手動將污點添加到節點，標記其爲停止服務。
如果一個節點被這個污點標記爲停止服務，則該節點上的 Pod 將會在沒有匹配的容忍時被強制刪除，
並且針對在此節點上終止的 Pod 的卷分離操作將立即發生。
這允許停止服務的節點上的 Pod 快速在不同節點上恢復。

{{< caution >}}
<!--
Refer to [Non-graceful node shutdown](/docs/concepts/cluster-administration/node-shutdown/#non-graceful-node-shutdown)
for further details about when and how to use this taint.
-->
有關何時以及如何使用此污點的更多詳細信息，
請參閱[非正常節點關閉](/zh-cn/docs/concepts/cluster-administration/node-shutdown/#non-graceful-node-shutdown)。
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

類別：污點

例子：`node.cloudprovider.kubernetes.io/uninitialized: "NoSchedule"`

用於：Node

在使用“外部”雲驅動啓動 kubelet 時，在 Node 上設置此污點以將其標記爲不可用，直到來自
cloud-controller-manager 的控制器初始化此 Node，然後移除污點。

<!--
### node.cloudprovider.kubernetes.io/shutdown

Type: Taint

Example: `node.cloudprovider.kubernetes.io/shutdown: "NoSchedule"`

Used on: Node

If a Node is in a cloud provider specified shutdown state, the Node gets tainted accordingly
with `node.cloudprovider.kubernetes.io/shutdown` and the taint effect of `NoSchedule`.
-->
### node.cloudprovider.kubernetes.io/shutdown {#node-cloudprovider-kubernetes-io-shutdown}

類別：污點

例子：`node.cloudprovider.kubernetes.io/shutdown: "NoSchedule"`

用於：Node

如果 Node 處於雲驅動所指定的關閉狀態，則 Node 會相應地被設置污點，對應的污點和效果爲
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

類別：標籤

示例：`feature.node.kubernetes.io/network-sriov.capable: "true"`

用於：節點

這些特性作爲標籤在運行 NFD 的節點上的 KubernetesNode 對象中公佈。
所有內置的標籤都使用 feature.node.kubernetes.io 標籤命名空間，並且格式爲
`feature.node.kubernetes.io/<feature-name>: <true>`。
NFD 有許多用於創建特定於供應商和應用程序的標籤的擴展點。
有關詳細信息，請參閱[定製資源](https://kubernetes-sigs.github.io/node-feature-discovery/v0.12/usage/customization-guide)。

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

類別：註解

示例：`nfd.node.kubernetes.io/master.version: "v0.6.0"`

用於：節點

對於調度 NFD-[master](https://kubernetes-sigs.github.io/node-feature-discovery/stable/usage/nfd-master.html)
的節點，此註解記錄 NFD-master 的版本。它僅用於提供信息。

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

類別：註解

示例：`nfd.node.kubernetes.io/worker.version: "v0.4.0"`

用於：節點

這個註解記錄 NFD-[worker](https://kubernetes-sigs.github.io/node-feature-discovery/stable/usage/nfd-worker.html)
的版本（如果在節點上運行了一個 NFD-worker 的話）。
此註解只用於提供信息。

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

類別：註解

示例：`nfd.node.kubernetes.io/feature-labels: "cpu-cpuid.ADX,cpu-cpuid.AESNI,cpu-hardware_multithreading,kernel-version.full"`

用於：節點

此註解記錄由 [Node Feature Discovery](https://kubernetes-sigs.github.io/node-feature-discovery/)（NFD）
管理的以逗號分隔的節點特性標籤列表。NFD 將其用於內部機制。你不應該自己編輯這個註解。

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

類別：註解

示例：`nfd.node.kubernetes.io/extended-resources: "accelerator.acme.example/q500,example.com/coprocessor-fx5"`

用於：節點

此註解記錄由 [Node Feature Discovery](https://kubernetes-sigs.github.io/node-feature-discovery/)（NFD）
管理的以逗號分隔的[擴展資源](/zh-cn/docs/concepts/configuration/manage-resources-containers/#extended-resources)列表。
NFD 將其用於內部機制。你不應該自己編輯這個註解。

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
類別：標籤

例子：`nfd.node.kubernetes.io/node-name: node-1`

用於：Node

此標籤指定哪個節點是 NodeFeature 對象的目標節點。
NodeFeature 對象的創建者必須設置此標籤，而此對象的使用者應該使用此標籤過濾爲某個節點指定的特性。

{{< note >}}
<!--
These Node Feature Discovery (NFD) labels or annotations only apply to 
the nodes where NFD is running. To learn more about NFD and 
its components go to its official [documentation](https://kubernetes-sigs.github.io/node-feature-discovery/stable/get-started/).
-->
這些節點特性發現（Node Feature Discovery，NFD）的標籤或註解僅適用於運行 NFD 的節點。
要了解關於 NFD 及其組件的信息，
請訪問官方[文檔](https://kubernetes-sigs.github.io/node-feature-discovery/stable/get-started/)。
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

用於：Service

與 AWS 彈性負載均衡集成的雲控制器管理器會根據此註解爲 Service 設定負載均衡器。
此註解值決定負載均衡器寫入日誌條目的頻率。例如，如果你將該值設置爲 5，則日誌的寫入間隔爲 5 秒。

### service.beta.kubernetes.io/aws-load-balancer-access-log-enabled (beta) {#service-beta-kubernetes-io-aws-load-balancer-access-log-enabled}

<!--
Example: `service.beta.kubernetes.io/aws-load-balancer-access-log-enabled: "false"`

Used on: Service

The cloud controller manager integration with AWS elastic load balancing configures
the load balancer for a Service based on this annotation. Access logging is enabled
if you set the annotation to "true".
-->
示例：`service.beta.kubernetes.io/aws-load-balancer-access-log-enabled: "false"`

用於：Service

與 AWS 彈性負載均衡集成的雲控制器管理器會根據此註解爲 Service 設定負載均衡器。
如果你將此註解設置爲 "true"，則訪問日誌將被啓用。

### service.beta.kubernetes.io/aws-load-balancer-access-log-s3-bucket-name (beta) {#service-beta-kubernetes-io-aws-load-balancer-access-log-s3-bucket-name}

<!--
Example: `service.beta.kubernetes.io/aws-load-balancer-access-log-enabled: example`

Used on: Service

The cloud controller manager integration with AWS elastic load balancing configures
the load balancer for a Service based on this annotation. The load balancer
writes logs to an S3 bucket with the name you specify.
-->
示例：`service.beta.kubernetes.io/aws-load-balancer-access-log-enabled: example`

用於：Service

與 AWS 彈性負載均衡集成的雲控制器管理器會根據此註解爲 Service 設定負載均衡器。
負載均衡器將日誌寫入到一個你指定名稱的 S3 桶。

### service.beta.kubernetes.io/aws-load-balancer-access-log-s3-bucket-prefix (beta) {#service-beta-kubernetes-io-aws-load-balancer-access-log-s3-bucket-prefix}

<!--
Example: `service.beta.kubernetes.io/aws-load-balancer-access-log-enabled: "/example"`

Used on: Service

The cloud controller manager integration with AWS elastic load balancing configures
the load balancer for a Service based on this annotation. The load balancer
writes log objects with the prefix that you specify.
-->
示例：`service.beta.kubernetes.io/aws-load-balancer-access-log-enabled: "/example"`

用於：Service

與 AWS 彈性負載均衡集成的雲控制器管理器會根據此註解爲 Service 設定負載均衡器。
負載均衡器用你指定的前綴寫入日誌對象。

### service.beta.kubernetes.io/aws-load-balancer-additional-resource-tags (beta) {#service-beta-kubernetes-io-aws-load-balancer-additional-resource-tags}

<!--
Example: `service.beta.kubernetes.io/aws-load-balancer-additional-resource-tags: "Environment=demo,Project=example"`

Used on: Service

The cloud controller manager integration with AWS elastic load balancing configures
tags (an AWS concept) for a load balancer based on the comma-separated key/value
pairs in the value of this annotation.
-->
示例：`service.beta.kubernetes.io/aws-load-balancer-additional-resource-tags: "Environment=demo,Project=example"`

用於：Service

與 AWS 彈性負載均衡集成的雲控制器管理器會根據此註解取值中逗號分隔的鍵/值對爲負載均衡器設定標記（這是 AWS 的一個概念）。

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

用於：Service

[AWS 負載均衡器控制器](https://kubernetes-sigs.github.io/aws-load-balancer-controller/)使用此註解。
參見 AWS 負載均衡器控制器文檔中的[註解](https://kubernetes-sigs.github.io/aws-load-balancer-controller/latest/guide/service/annotations/)。

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

用於：Service

[AWS 負載均衡器控制器](https://kubernetes-sigs.github.io/aws-load-balancer-controller/)使用此註解。
參見 AWS 負載均衡器控制器文檔中的[註解](https://kubernetes-sigs.github.io/aws-load-balancer-controller/latest/guide/service/annotations/)。

### service.beta.kubernetes.io/aws-load-balancer-backend-protocol (beta) {#service-beta-kubernetes-io-aws-load-balancer-backend-protocol}

<!--
Example: `service.beta.kubernetes.io/aws-load-balancer-backend-protocol: tcp`

Used on: Service

The cloud controller manager integration with AWS elastic load balancing configures
the load balancer listener based on the value of this annotation.
-->
示例：`service.beta.kubernetes.io/aws-load-balancer-backend-protocol: tcp`

用於：Service

與 AWS 彈性負載均衡集成的雲控制器管理器會根據此註解取值設定負載均衡器的監聽器。

### service.beta.kubernetes.io/aws-load-balancer-connection-draining-enabled (beta) {#service-beta-kubernetes-io-aws-load-balancer-connection-draining-enabled}

<!--
Example: `service.beta.kubernetes.io/aws-load-balancer-connection-draining-enabled: "false"`

Used on: Service

The cloud controller manager integration with AWS elastic load balancing configures
the load balancer based on this annotation. The load balancer's connection draining
setting depends on the value you set.
-->
示例：`service.beta.kubernetes.io/aws-load-balancer-connection-draining-enabled: "false"`

用於：Service

與 AWS 彈性負載均衡集成的雲控制器管理器會根據此註解取值設定負載均衡器。
負載均衡器的連接排空設置取決於你所設置的值。

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

用於：Service

如果你爲 `type: LoadBalancer` 的 Service 設定[連接排空](#service-beta-kubernetes-io-aws-load-balancer-connection-draining-enabled)，
且你使用 AWS 雲服務，則集成機制將根據此註解來設定排空期。
你所設置的值決定了排空超時秒數。

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

用於：Service

[AWS 負載均衡器控制器](https://kubernetes-sigs.github.io/aws-load-balancer-controller/)使用此註解。
參見 AWS 負載均衡器控制器文檔中的[註解](https://kubernetes-sigs.github.io/aws-load-balancer-controller/latest/guide/service/annotations/)。

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

用於：Service

與 AWS 彈性負載均衡集成的雲控制器管理器會根據此註解設定負載均衡器。
負載均衡器設定了一個空閒超時時間（以秒爲單位）應用到其連接。
如果在空閒超時時間到期之前沒有發送或接收任何數據，負載均衡器將關閉連接。

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

用於：Service

與 AWS 彈性負載均衡集成的雲控制器管理器會根據此註解設定負載均衡器。如果你將此註解設置爲 "true"，
每個負載均衡器節點將在所有啓用的[可用區](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html#concepts-availability-zones)中的註冊目標上均勻地分發請求。
如果你禁用跨區負載均衡，則每個負載均衡器節點僅在其可用區中跨註冊目標均勻地分發請求。

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

用於：Service

與 AWS 彈性負載均衡集成的雲控制器管理器會根據此註解設定負載均衡器。
取值是逗號分隔的彈性 IP 地址分配 ID 列表。

此註解僅與 `type: LoadBalancer` 的 Service 相關，其中負載均衡器是 AWS Network Load Balancer。

### service.beta.kubernetes.io/aws-load-balancer-extra-security-groups (beta) {#service-beta-kubernetes-io-aws-load-balancer-extra-security-groups}

<!--
Example: `service.beta.kubernetes.io/aws-load-balancer-extra-security-groups: "sg-12abcd3456,sg-34dcba6543"`

Used on: Service

The cloud controller manager integration with AWS elastic load balancing configures
a load balancer based on this annotation. The annotation value is a comma-separated
list of extra AWS VPC security groups to configure for the load balancer.
-->
示例：`service.beta.kubernetes.io/aws-load-balancer-extra-security-groups: "sg-12abcd3456,sg-34dcba6543"`

用於：Service

與 AWS 彈性負載均衡集成的雲控制器管理器會根據此註解設定負載均衡器。
此註解值是一個逗號分隔的附加 AWS VPC 安全組列表，用於設定負載均衡器。

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

用於：Service

與 AWS 彈性負載均衡集成的雲控制器管理器會根據此註解設定負載均衡器。
此註解值指定後端需要連續成功多少次健康檢查才能被視爲流量健康。

### service.beta.kubernetes.io/aws-load-balancer-healthcheck-interval (beta) {#service-beta-kubernetes-io-aws-load-balancer-healthcheck-interval}

<!--
Example: `service.beta.kubernetes.io/aws-load-balancer-healthcheck-interval: "30"`

Used on: Service

The cloud controller manager integration with AWS elastic load balancing configures
a load balancer based on this annotation. The annotation value specifies the interval,
in seconds, between health check probes made by the load balancer.
-->
示例：`service.beta.kubernetes.io/aws-load-balancer-healthcheck-interval: "30"`

用於：Service

與 AWS 彈性負載均衡集成的雲控制器管理器會根據此註解設定負載均衡器。
此註解值指定負載均衡器進行健康檢查探測之間的間隔秒數。

### service.beta.kubernetes.io/aws-load-balancer-healthcheck-path (beta) {#service-beta-kubernetes-io-aws-load-balancer-healthcheck-papth}

<!--
Example: `service.beta.kubernetes.io/aws-load-balancer-healthcheck-path: /healthcheck`

Used on: Service

The cloud controller manager integration with AWS elastic load balancing configures
a load balancer based on this annotation. The annotation value determines the
path part of the URL that is used for HTTP health checks.
-->
示例：`service.beta.kubernetes.io/aws-load-balancer-healthcheck-path: /healthcheck`

用於：Service

與 AWS 彈性負載均衡集成的雲控制器管理器會根據此註解設定負載均衡器。
此註解值決定了 HTTP 健康檢查所用的 URL 的路徑部分。

### service.beta.kubernetes.io/aws-load-balancer-healthcheck-port (beta) {#service-beta-kubernetes-io-aws-load-balancer-healthcheck-port}

<!--
Example: `service.beta.kubernetes.io/aws-load-balancer-healthcheck-port: "24"`

Used on: Service

The cloud controller manager integration with AWS elastic load balancing configures
a load balancer based on this annotation. The annotation value determines which
port the load balancer connects to when performing health checks.
-->
示例：`service.beta.kubernetes.io/aws-load-balancer-healthcheck-port: "24"`

用於：Service

與 AWS 彈性負載均衡集成的雲控制器管理器會根據此註解設定負載均衡器。
此註解值決定了負載均衡器執行健康檢查時連接到哪個端口。

### service.beta.kubernetes.io/aws-load-balancer-healthcheck-protocol (beta) {#service-beta-kubernetes-io-aws-load-balancer-healthcheck-protocol}

<!--
Example: `service.beta.kubernetes.io/aws-load-balancer-healthcheck-protocol: TCP`

Used on: Service

The cloud controller manager integration with AWS elastic load balancing configures
a load balancer based on this annotation. The annotation value determines how the
load balancer checks the health of backend targets.
-->
示例：`service.beta.kubernetes.io/aws-load-balancer-healthcheck-protocol: TCP`

用於：Service

與 AWS 彈性負載均衡集成的雲控制器管理器會根據此註解設定負載均衡器。
此註解值決定了負載均衡器如何檢查後端目標的健康。

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

用於：Service

與 AWS 彈性負載均衡集成的雲控制器管理器會根據此註解設定負載均衡器。
此註解值指定探測還未成功之前將自動視爲已失敗的秒數。

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

用於：Service

與 AWS 彈性負載均衡集成的雲控制器管理器會根據此註解設定負載均衡器。
此註解值指定後端需要連續多少次失敗的健康檢查才被視爲流量不健康。

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

用於：Service

與 AWS 彈性負載均衡集成的雲控制器管理器會根據此註解設定負載均衡器。
當你將此註解設置爲 "true" 時，此集成機制將設定一個內部負載均衡器。

如果你使用 [AWS 負載均衡器控制器](https://kubernetes-sigs.github.io/aws-load-balancer-controller/)，
參見 [`service.beta.kubernetes.io/aws-load-balancer-scheme`](#service-beta-kubernetes-io-aws-load-balancer-scheme)。

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

用於：Service

[AWS 負載均衡器控制器](https://kubernetes-sigs.github.io/aws-load-balancer-controller/)使用此註解。
參見 AWS 負載均衡器控制器文檔中的[註解](https://kubernetes-sigs.github.io/aws-load-balancer-controller/latest/guide/service/annotations/)。

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

用於：Service

如果你對 Service 上設置了這個註解，並且還使用 `service.beta.kubernetes.io/aws-load-balancer-type: "external"`
爲該 Service 添加了註解，並在叢集中使用了
[AWS 負載均衡器控制器](https://kubernetes-sigs.github.io/aws-load-balancer-controller/)，那麼
AWS 負載均衡器控制器將該負載均衡器的名稱設置爲針對這個註解設置的值。

參見 AWS 負載均衡器控制器文檔中的[註解](https://kubernetes-sigs.github.io/aws-load-balancer-controller/latest/guide/service/annotations/)。

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

用於：Service

[AWS 負載均衡器控制器](https://kubernetes-sigs.github.io/aws-load-balancer-controller/)使用此註解。
參見 AWS 負載均衡器控制器文檔中的[註解](https://kubernetes-sigs.github.io/aws-load-balancer-controller/latest/guide/service/annotations/)。

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

用於：Service

[AWS 負載均衡器控制器](https://kubernetes-sigs.github.io/aws-load-balancer-controller/)使用此註解。
參見 AWS 負載均衡器控制器文檔中的[註解](https://kubernetes-sigs.github.io/aws-load-balancer-controller/latest/guide/service/annotations/)。

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

用於：Service

官方的 Kubernetes 與 AWS 彈性負載均衡集成會根據此註解設定負載均衡器。
唯一允許的值是 `"*"`，表示負載均衡器應該使用 PROXY 協議將 TCP 連接封裝到後端 Pod 中。

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

用於：Service

[AWS 負載均衡器控制器](https://kubernetes-sigs.github.io/aws-load-balancer-controller/)使用此註解。
參見 AWS 負載均衡器控制器文檔中的[註解](https://kubernetes-sigs.github.io/aws-load-balancer-controller/latest/guide/service/annotations/)。

<!--
### service.beta.kubernetes.io/aws-load-balancer-security-groups (deprecated) {#service-beta-kubernetes-io-aws-load-balancer-security-groups}

Example: `service.beta.kubernetes.io/aws-load-balancer-security-groups: "sg-53fae93f,sg-8725gr62r"`

Used on: Service
-->
### service.beta.kubernetes.io/aws-load-balancer-security-groups（已棄用） {#service-beta-kubernetes-io-aws-load-balancer-security-groups}

例子：`service.beta.kubernetes.io/aws-load-balancer-security-groups: "sg-53fae93f,sg-8725gr62r"`

用於：Service

<!--
The AWS load balancer controller uses this annotation to specify a comma separated list
of security groups you want to attach to an AWS load balancer. Both name and ID of security
are supported where name matches a `Name` tag, not the `groupName` attribute.

When this annotation is added to a Service, the load-balancer controller attaches the security groups
referenced by the annotation to the load balancer. If you omit this annotation, the AWS load balancer
controller automatically creates a new security group and attaches it to the load balancer.
-->
AWS 負載均衡器控制器使用此註解來指定要附加到 AWS 負載均衡器的安全組的逗號分隔列表。
安全名稱和 ID 均被支持，其中名稱匹配 `Name` 標記，而不是 `groupName` 屬性。

當將此註解添加到 Service 時，負載均衡器控制器會將註解引用的安全組附加到負載均衡器上。
如果你省略了此註解，AWS 負載均衡器控制器會自動創建一個新的安全組並將其附加到負載均衡器上。

{{< note >}}
<!--
Kubernetes v1.27 and later do not directly set or read this annotation. However, the AWS
load balancer controller (part of the Kubernetes project) does still use the
`service.beta.kubernetes.io/aws-load-balancer-security-groups` annotation.
-->
Kubernetes v1.27 及更高版本不直接設置或讀取此註解。然而，AWS 負載均衡器控制器
（作爲 Kubernetes 項目的一部分）仍在使用
`service.beta.kubernetes.io/aws-load-balancer-security-groups` 註解。
{{< /note >}}

### service.beta.kubernetes.io/load-balancer-source-ranges (deprecated) {#service-beta-kubernetes-io-load-balancer-source-ranges}

<!--
Example: `service.beta.kubernetes.io/load-balancer-source-ranges: "192.0.2.0/25"`

Used on: Service

The [AWS load balancer controller](https://kubernetes-sigs.github.io/aws-load-balancer-controller/)
uses this annotation. You should set `.spec.loadBalancerSourceRanges` for the Service instead.
-->
示例：`service.beta.kubernetes.io/load-balancer-source-ranges: "192.0.2.0/25"`

用於：Service

[AWS 負載均衡器控制器](https://kubernetes-sigs.github.io/aws-load-balancer-controller/)使用此註解。
你應該爲 Service 設置 `.spec.loadBalancerSourceRanges` 作爲替代方案。

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

用於：Service

官方與 AWS 彈性負載均衡的集成會根據此註解爲 `type: LoadBalancer` 的服務設定 TLS。
該註解的值是負載均衡器的監聽器應該使用的 X.509 證書的 AWS 資源名稱（ARN）。

（TLS 協議基於一種更老的、簡稱爲 SSL 的技術）。

### service.beta.kubernetes.io/aws-load-balancer-ssl-negotiation-policy (beta) {#service-beta-kubernetes-io-aws-load-balancer-ssl-negotiation-policy}

<!--
Example: `service.beta.kubernetes.io/aws-load-balancer-ssl-negotiation-policy: ELBSecurityPolicy-TLS-1-2-2017-01`

The official integration with AWS elastic load balancing configures TLS for a Service of
`type: LoadBalancer` based on this annotation. The value of the annotation is the name
of an AWS policy for negotiating TLS with a client peer.
-->
示例：`service.beta.kubernetes.io/aws-load-balancer-ssl-negotiation-policy: ELBSecurityPolicy-TLS-1-2-2017-01`

官方與 AWS 彈性負載均衡的集成會根據此註解爲 `type: LoadBalancer` 的服務設定 TLS。
該註解的值是與客戶端對等方進行 TLS 協商的 AWS 策略的名稱。

### service.beta.kubernetes.io/aws-load-balancer-ssl-ports (beta) {#service-beta-kubernetes-io-aws-load-balancer-ssl-ports}

<!--
Example: `service.beta.kubernetes.io/aws-load-balancer-ssl-ports: "*"`

The official integration with AWS elastic load balancing configures TLS for a Service of
`type: LoadBalancer` based on this annotation. The value of the annotation is either `"*"`,
which means that all the load balancer's ports should use TLS, or it is a comma separated
list of port numbers.
-->
示例：`service.beta.kubernetes.io/aws-load-balancer-ssl-ports: "*"`

官方與 AWS 彈性負載均衡的集成會根據此註解爲 `type: LoadBalancer` 的服務設定 TLS。
此註解的值可以是 `"*"`（這意味着所有負載均衡器的端口應使用 TLS）或逗號分隔的端口號列表。

### service.beta.kubernetes.io/aws-load-balancer-subnets (beta) {#service-beta-kubernetes-io-aws-load-balancer-subnets}

<!--
Example: `service.beta.kubernetes.io/aws-load-balancer-subnets: "private-a,private-b"`

Kubernetes' official integration with AWS uses this annotation to configure a
load balancer and determine in which AWS availability zones to deploy the managed
load balancing service. The value is either a comma separated list of subnet names, or a
comma separated list of subnet IDs.
-->
示例：`service.beta.kubernetes.io/aws-load-balancer-subnets: "private-a,private-b"`

Kubernetes 官方與 AWS 的集成使用此註解來設定負載均衡器，並決定在哪些 AWS 可用區部署託管的負載均衡服務。
該值可以是逗號分隔的子網名稱列表或逗號分隔的子網 ID 列表。

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

用於：Service

[AWS 負載均衡器控制器](https://kubernetes-sigs.github.io/aws-load-balancer-controller/)使用此註解。
參見 AWS 負載均衡器控制器文檔中的[註解](https://kubernetes-sigs.github.io/aws-load-balancer-controller/latest/guide/service/annotations/)。

### service.beta.kubernetes.io/aws-load-balancer-target-node-labels (beta) {#service-beta-kubernetes-io-aws-target-node-labels}

<!--
Example: `service.beta.kubernetes.io/aws-load-balancer-target-node-labels: "kubernetes.io/os=Linux,topology.kubernetes.io/region=us-east-2"`

Kubernetes' official integration with AWS uses this annotation to determine which
nodes in your cluster should be considered as valid targets for the load balancer.
-->
示例：`service.beta.kubernetes.io/aws-load-balancer-target-node-labels: "kubernetes.io/os=Linux,topology.kubernetes.io/region=us-east-2"`

Kubernetes 官方與 AWS 的集成使用此註解來確定叢集中的哪些節點應被視爲負載均衡器的有效目標。

### service.beta.kubernetes.io/aws-load-balancer-type (beta) {#service-beta-kubernetes-io-aws-load-balancer-type}

<!--
Example: `service.beta.kubernetes.io/aws-load-balancer-type: external`

Kubernetes' official integrations with AWS use this annotation to determine
whether the AWS cloud provider integration should manage a Service of
`type: LoadBalancer`.

There are two permitted values:
-->
示例：`service.beta.kubernetes.io/aws-load-balancer-type: external`

Kubernetes 官方與 AWS 的集成使用此註解來決定 AWS 雲提供商是否應管理 `type: LoadBalancer` 的 Service。

有兩個允許的值：

<!--
`nlb`
: the cloud controller manager configures a Network Load Balancer

`external`
: the cloud controller manager does not configure any load balancer
-->
`nlb`
: 雲控制器管理器設定 Network Load Balancer

`external`
: 雲控制器管理器不設定任何負載均衡器

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
如果你在 AWS 上部署 `type: LoadBalancer` 的 Service，並且沒有設置任何
`service.beta.kubernetes.io/aws-load-balancer-type` 註解，AWS 集成將部署經典的彈性負載均衡器。
這種行爲是不帶註解的默認行爲，除非你另有指定。

當你針對 `type: LoadBalancer` 的服務將此註解設置爲 `external`，
並且你的叢集中已經成功部署了 AWS 負載均衡器控制器時，
AWS 負載均衡器控制器將嘗試根據服務規約部署一個負載均衡器。

{{< caution >}}
<!--
Do not modify or add the `service.beta.kubernetes.io/aws-load-balancer-type` annotation
on an existing Service object. See the AWS documentation on this topic for more
details.
-->
不要在現有 Service 對象上修改或添加 `service.beta.kubernetes.io/aws-load-balancer-type` 註解。
參閱 AWS 關於此主題的文檔以瞭解更多細節。
{{< /caution >}}

<!--
### service.beta.kubernetes.io/azure-load-balancer-disable-tcp-reset (deprecated) {#service-beta-kubernetes-azure-load-balancer-disble-tcp-reset}

Example: `service.beta.kubernetes.io/azure-load-balancer-disable-tcp-reset: "false"`

Used on: Service
-->
### service.beta.kubernetes.io/azure-load-balancer-disable-tcp-reset（已棄用） {#service-beta-kubernetes-azure-load-balancer-disble-tcp-reset}

例子：`service.beta.kubernetes.io/azure-load-balancer-disable-tcp-reset: "false"`

用於：Service

<!--
This annotation only works for Azure standard load balancer backed service.
This annotation is used on the Service to specify whether the load balancer
should disable or enable TCP reset on idle timeout. If enabled, it helps
applications to behave more predictably, to detect the termination of a connection,
remove expired connections and initiate new connections. 
You can set the value to be either true or false.
-->
此註解僅適用於由 Azure 標準負載均衡器支持的服務。
此註解用於指定負載均衡器是否應在空閒超時時禁用或啓用 TCP 重置。
如果啓用，它有助於提升應用行爲的可預測度、檢測連接的終止以及移除過期的連接併發起新的連接等。
你可以將值設置爲 true 或 false。

<!--
See [Load Balancer TCP Reset](https://learn.microsoft.com/en-gb/azure/load-balancer/load-balancer-tcp-reset) for more information.
-->
更多細節參閱[負載均衡器 TCP 重置](https://learn.microsoft.com/zh-cn/azure/load-balancer/load-balancer-tcp-reset)。

{{< note >}} 
<!--
This annotation is deprecated.
-->
此註解已棄用。
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

類別：標籤

例子：`pod-security.kubernetes.io/enforce: "baseline"`

用於：Namespace

值**必須**是 `privileged`、`baseline` 或 `restricted` 之一，它們對應於
[Pod 安全標準](/zh-cn/docs/concepts/security/pod-security-standards) 級別。
特別地，`enforce` 標籤**禁止**在帶標籤的 Namespace 中創建任何不符合指示級別要求的 Pod。

請請參閱[在名字空間級別實施 Pod 安全性](/zh-cn/docs/concepts/security/pod-security-admission)瞭解更多信息。

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

類別：標籤

例子：`pod-security.kubernetes.io/enforce-version: "{{< skew currentVersion >}}"`

用於：Namespace

值**必須**是 `latest` 或格式爲 `v<MAJOR>.<MINOR>` 的有效 Kubernetes 版本。
此註解決定了在驗證提交的 Pod 時要應用的
[Pod 安全標準](/zh-cn/docs/concepts/security/pod-security-standards)策略的版本。

請參閱[在名字空間級別實施 Pod 安全性](/zh-cn/docs/concepts/security/pod-security-admission)瞭解更多信息。

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

類別：標籤

例子：`pod-security.kubernetes.io/audit: "baseline"`

用於：Namespace

值**必須**是與 [Pod 安全標準](/zh-cn/docs/concepts/security/pod-security-standards) 級別相對應的
`privileged`、`baseline` 或 `restricted` 之一。
具體來說，`audit` 標籤不會阻止在帶標籤的 Namespace 中創建不符合指示級別要求的 Pod，
但會向該 Pod 添加審計註解。

請參閱[在名字空間級別實施 Pod 安全性](/zh-cn/docs/concepts/security/pod-security-admission)瞭解更多信息。

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

類別：標籤

例子：`pod-security.kubernetes.io/audit-version: "{{< skew currentVersion >}}"`

用於：Namespace

值**必須**是 `latest` 或格式爲 `v<MAJOR>.<MINOR>` 的有效 Kubernetes 版本。
此註解決定了在驗證提交的 Pod 時要應用的
[Pod 安全標準](/zh-cn/docs/concepts/security/pod-security-standards)策略的版本。

請參閱[在名字空間級別實施 Pod 安全性](/zh-cn/docs/concepts/security/pod-security-admission)瞭解更多信息。

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

類別：標籤

例子：`pod-security.kubernetes.io/warn: "baseline"`

用於：Namespace

值**必須**是與 [Pod 安全標準](/zh-cn/docs/concepts/security/pod-security-standards)級別相對應的
`privileged`、`baseline` 或 `restricted` 之一。特別地，
`warn` 標籤不會阻止在帶標籤的 Namespace 中創建不符合指示級別概述要求的 Pod，但會在這樣做後向使用者返回警告。
請注意，在創建或更新包含 Pod 模板的對象時也會顯示警告，例如 Deployment、Job、StatefulSet 等。

請參閱[在名字空間級別實施 Pod 安全性](/zh-cn/docs/concepts/security/pod-security-admission)瞭解更多信息。

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

類別：標籤

例子：`pod-security.kubernetes.io/warn-version: "{{< skew currentVersion >}}"`

用於：Namespace

值**必須**是 `latest` 或格式爲 `v<MAJOR>.<MINOR>` 的有效 Kubernetes 版本。
此註解決定了在驗證提交的 Pod 時要應用的
[Pod 安全標準](/zh-cn/docs/concepts/security/pod-security-standards)策略的版本。
請注意，在創建或更新包含 Pod 模板的對象時也會顯示警告，
例如 Deployment、Job、StatefulSet 等。

請參閱[在名字空間級別實施 Pod 安全性](/zh-cn/docs/concepts/security/pod-security-admission)瞭解更多信息。

### rbac.authorization.kubernetes.io/autoupdate

<!--
Type: Annotation

Example: `rbac.authorization.kubernetes.io/autoupdate: "false"`

Used on: ClusterRole, ClusterRoleBinding, Role, RoleBinding
-->
類別：註解

例子：`rbac.authorization.kubernetes.io/autoupdate: "false"`

用於：ClusterRole、ClusterRoleBinding、Role、RoleBinding

<!--
When this annotation is set to `"true"` on default RBAC objects created by the API server,
they are automatically updated at server start to add missing permissions and subjects
(extra permissions and subjects are left in place).
To prevent autoupdating a particular role or rolebinding, set this annotation to `"false"`.
If you create your own RBAC objects and set this annotation to `"false"`, `kubectl auth reconcile`
(which allows reconciling arbitrary RBAC objects in a {{< glossary_tooltip text="manifest" term_id="manifest" >}})
respects this annotation and does not automatically add missing permissions and subjects.
-->
當在 kube-apiserver 創建的默認 RBAC 對象上將此註解設置爲 `"true"` 時，
這些對象會在伺服器啓動時自動更新以添加缺少的權限和主體（額外的權限和主體留在原處）。
要防止自動更新特定的 Role 或 RoleBinding，請將此註解設置爲 `"false"`。
如果你創建自己的 RBAC 對象並將此註解設置爲 `"false"`，則 `kubectl auth reconcile`
（允許協調在{{< glossary_tooltip text="清單" term_id="manifest" >}}中給出的任意 RBAC 對象）
尊重此註解並且不會自動添加缺少的權限和主體。

<!--
### kubernetes.io/psp (deprecated) {#kubernetes-io-psp}

Type: Annotation

Example: `kubernetes.io/psp: restricted`

Used on: Pod

This annotation was only relevant if you were using
[PodSecurityPolicy](/docs/concepts/security/pod-security-policy/) objects.
Kubernetes v{{< skew currentVersion >}} does not support the PodSecurityPolicy API.
-->
### kubernetes.io/psp（已棄用） {#kubernetes-io-psp}

類別：註解

例如：`kubernetes.io/psp: restricted`

用於：Pod

這個註解只在你使用 [PodSecurityPolicies](/zh-cn/docs/concepts/security/pod-security-policy/) 時纔有意義。
Kubernetes v{{< skew currentVersion >}} 不支持 PodSecurityPolicy API。

<!--
When the PodSecurityPolicy admission controller admitted a Pod, the admission controller
modified the Pod to have this annotation.
The value of the annotation was the name of the PodSecurityPolicy that was used for validation.
-->
當 PodSecurityPolicy 准入控制器接受一個 Pod 時，會修改該 Pod，並給這個 Pod 添加此註解。
註解的值是用來對 Pod 進行驗證檢查的 PodSecurityPolicy 的名稱。

<!--
### seccomp.security.alpha.kubernetes.io/pod (non-functional) {#seccomp-security-alpha-kubernetes-io-pod}

Type: Annotation

Used on: Pod

Kubernetes before v1.25 allowed you to configure seccomp behavior using this annotation.
See [Restrict a Container's Syscalls with seccomp](/docs/tutorials/security/seccomp/) to
learn the supported way to specify seccomp restrictions for a Pod.
-->
### seccomp.security.alpha.kubernetes.io/pod (非功能性) {#seccomp-security-alpha-kubernetes-io-pod}

類別：註解

用於：Pod

v1.25 之前的 Kubernetes 允許你使用此註解設定 seccomp 行爲。
請參考[使用 seccomp 限制容器的系統調用](/zh-cn/docs/tutorials/security/seccomp/)，
瞭解爲 Pod 指定 seccomp 限制的受支持方法。

<!--
### container.seccomp.security.alpha.kubernetes.io/[NAME] (non-functional) {#container-seccomp-security-alpha-kubernetes-io}

Type: Annotation

Used on: Pod

Kubernetes before v1.25 allowed you to configure seccomp behavior using this annotation.
See [Restrict a Container's Syscalls with seccomp](/docs/tutorials/security/seccomp/) to
learn the supported way to specify seccomp restrictions for a Pod.
-->
### container.seccomp.security.alpha.kubernetes.io/[NAME] (非功能性) {#container-seccomp-security-alpha-kubernetes-io}

類別：註解

用於：Pod

v1.25 之前的 Kubernetes 允許你使用此註解設定 seccomp 行爲。
請參考[使用 seccomp 限制容器的系統調用](/zh-cn/docs/tutorials/security/seccomp/)
瞭解爲 Pod 指定 seccomp 限制的受支持方法。

### snapshot.storage.kubernetes.io/allow-volume-mode-change {#allow-volume-mode-change}

<!--
Type: Annotation

Example: `snapshot.storage.kubernetes.io/allow-volume-mode-change: "true"`

Used on: VolumeSnapshotContent
-->
類別：註解

例子：`snapshot.storage.kubernetes.io/allow-volume-mode-change: "true"`

用於：VolumeSnapshotContent

<!--
Value can either be `true` or `false`. This determines whether a user can modify
the mode of the source volume when a PersistentVolumeClaim is being created from
a VolumeSnapshot.

Refer to [Converting the volume mode of a Snapshot](/docs/concepts/storage/volume-snapshots/#convert-volume-mode)
and the [Kubernetes CSI Developer Documentation](https://kubernetes-csi.github.io/docs/)
for more information.
-->
值可以是 `true` 或者 `false`。取值決定了當從 VolumeSnapshot 創建 PersistentVolumeClaim 時，
使用者是否可以修改源卷的模式。

更多信息請參閱[轉換快照的卷模式](/zh-cn/docs/concepts/storage/volume-snapshots/#convert-volume-mode)和
[Kubernetes CSI 開發者文檔](https://kubernetes-csi.github.io/docs/)。

<!--
### scheduler.alpha.kubernetes.io/critical-pod (deprecated)

Type: Annotation

Example: `scheduler.alpha.kubernetes.io/critical-pod: ""`

Used on: Pod

This annotation lets Kubernetes control plane know about a Pod being a critical Pod
so that the descheduler will not remove this Pod.
-->
### scheduler.alpha.kubernetes.io/critical-pod（已棄用）{#scheduler-alpha-kubernetes-io-critical-pod}

類別：註解

例子：`scheduler.alpha.kubernetes.io/critical-pod: ""`

用於：Pod

此註解讓 Kubernetes 控制平面知曉某個 Pod 是一個關鍵的 Pod，這樣 descheduler
將不會移除該 Pod。

{{< note >}}
<!--
Starting in v1.16, this annotation was removed in favor of
[Pod Priority](/docs/concepts/scheduling-eviction/pod-priority-preemption/).
-->
從 v1.16 開始，此註解被移除，取而代之的是
[Pod 優先級](/zh-cn/docs/concepts/scheduling-eviction/pod-priority-preemption/)。
{{< /note >}}

### jobset.sigs.k8s.io/jobset-name

<!--
Type: Label, Annotation

Example:  `jobset.sigs.k8s.io/jobset-name: "my-jobset"`

Used on: Jobs, Pods

This label/annotation is used to store the name of the JobSet that a Job or Pod belongs to.
[JobSet](https://jobset.sigs.k8s.io) is an extension API that you can deploy into your Kubernetes cluster.
-->
類別：標籤、註解

例子：`jobset.sigs.k8s.io/jobset-name: "my-jobset"`

用於：Job、Pod

此標籤/註解用於存儲 Job 或 Pod 所屬的 JobSet 的名稱。
[JobSet](https://jobset.sigs.k8s.io) 是一個你可以部署到 Kubernetes 叢集中的擴展 API。

### jobset.sigs.k8s.io/replicatedjob-replicas

<!--
Type: Label, Annotation

Example: `jobset.sigs.k8s.io/replicatedjob-replicas: "5"`

Used on: Jobs, Pods

This label/annotation specifies the number of replicas for a ReplicatedJob.
-->
類別：標籤、註解

例子：`jobset.sigs.k8s.io/replicatedjob-replicas: "5"`

用於：Job、Pod

此標籤/註解指定 ReplicatedJob 副本的數量。

### jobset.sigs.k8s.io/replicatedjob-name

<!--
Type: Label, Annotation

Example: `jobset.sigs.k8s.io/replicatedjob-name: "my-replicatedjob"`

Used on: Jobs, Pods

This label or annotation stores the name of the replicated job that this Job or Pod is part of.
-->
類別：標籤、註解

例子：`jobset.sigs.k8s.io/replicatedjob-name: "my-replicatedjob"`

用於：Job、Pod

此標籤或註解保存 Job 或 Pod 所屬的 ReplicatedJob 的名稱。

### jobset.sigs.k8s.io/job-index

<!--
Type: Label, Annotation

Example: `jobset.sigs.k8s.io/job-index: "0"`

Used on: Jobs, Pods

This label/annotation is set by the JobSet controller on child Jobs and Pods. It contains the index of the Job replica within its parent ReplicatedJob.
-->
類別：標籤、註解

例子：`jobset.sigs.k8s.io/job-index: "0"`

用於：Job、Pod

此標籤/註解由 JobSet 控制器設置在其子 Job 和 Pod 上。
它包含 Job 副本在其父 ReplicatedJob 中的索引。

### jobset.sigs.k8s.io/job-key

<!--
Type: Label, Annotation

Example: `jobset.sigs.k8s.io/job-key: "0f1e93893c4cb372080804ddb9153093cb0d20cefdd37f653e739c232d363feb"`

Used on: Jobs, Pods

The JobSet controller sets this label (and also an annotation with the same key)  on child Jobs and
Pods of a JobSet. The value is the SHA256 hash of the namespaced Job name.
-->
類別：標籤、註解

例子：`jobset.sigs.k8s.io/job-key: "0f1e93893c4cb372080804ddb9153093cb0d20cefdd37f653e739c232d363feb"`

用於：Job、Pod

JobSet 控制器在 JobSet 的子 Job 和 Pod 上設置此標籤（以及鍵名相同的註解）。
取值爲命名空間內 Job 名稱的 SHA256 哈希。

### alpha.jobset.sigs.k8s.io/exclusive-topology

<!--
Type: Annotation

Example: `alpha.jobset.sigs.k8s.io/exclusive-topology: "zone"`

Used on: JobSets, Jobs

You can set this label/annotation on a [JobSet](https://jobset.sigs.k8s.io) to ensure exclusive Job
placement per topology group. You can also define this label or annotation on a replicated job
template. Read the documentation for JobSet to learn more.
-->
類別：註解

例子：`alpha.jobset.sigs.k8s.io/exclusive-topology: "zone"`

用於：JobSet、Job

你可以在 [JobSet](https://jobset.sigs.k8s.io) 上設置此標籤/註解，
以確保在拓撲組層面實現互斥性的 Job 調度。
你也可以在 ReplicatedJob 模板中定義此標籤或註解。有關細節查閱 JobSet 文檔。

### alpha.jobset.sigs.k8s.io/node-selector

<!--
Type: Annotation

Example: `alpha.jobset.sigs.k8s.io/node-selector: "true"`

Used on: Jobs, Pods

This label/annotation can be applied to a JobSet. When it's set, the JobSet controller modifies the Jobs and their corresponding Pods by adding node selectors and tolerations. This ensures exclusive job placement per topology domain, restricting the scheduling of these Pods to specific nodes based on the strategy.
-->
類別：註解

例子：`alpha.jobset.sigs.k8s.io/node-selector: "true"`

用於：Job、Pod

此註解可以被應用到 JobSet 上。當此註解被設置時，
JobSet 控制器通過添加節點選擇算符和容忍度來修改 Job 及其對應的 Pod。
這一設置可以確保在拓撲域層面實現作業的排斥性調度，
基於策略設置，禁止這些 Pod 被調度到特定節點上。

### alpha.jobset.sigs.k8s.io/namespaced-job

<!--
Type: Label

Example: `alpha.jobset.sigs.k8s.io/namespaced-job: "default_myjobset-replicatedjob-0"`

Used on: Nodes

This label is either set manually or automatically (for example, a cluster autoscaler) on the nodes. When `alpha.jobset.sigs.k8s.io/node-selector` is set to  `"true"`, the  JobSet controller adds a nodeSelector to this node label (along with the toleration to the taint `alpha.jobset.sigs.k8s.io/no-schedule` discussed next).
-->
類別：標籤

例子：`alpha.jobset.sigs.k8s.io/namespaced-job: "default_myjobset-replicatedjob-0"`

用於：Node

此標籤可以被自動或手動設置到節點上（例如，叢集自動擴縮器）。
當 `alpha.jobset.sigs.k8s.io/node-selector` 被設置爲 `"true"` 時，
JobSet 控制器會向此節點標籤添加 nodeSelector
（以及下一節討論的針對 `alpha.jobset.sigs.k8s.io/no-schedule` 污點的容忍度）。

### alpha.jobset.sigs.k8s.io/no-schedule

<!--
Type: Taint

Example: `alpha.jobset.sigs.k8s.io/no-schedule: "NoSchedule"`

Used on: Nodes

This taint is either set manually or automatically (for example, a cluster autoscaler) on the nodes. When `alpha.jobset.sigs.k8s.io/node-selector` is set to  `"true"`, the  JobSet controller adds a toleration to this node taint (along with the node selector to the label `alpha.jobset.sigs.k8s.io/namespaced-job` discussed previously).
-->
類別：污點

例子：`alpha.jobset.sigs.k8s.io/no-schedule: "NoSchedule"`

用於：Node

此污點可以被自動或手動設置在節點上（例如，叢集自動擴縮器）。
當 `alpha.jobset.sigs.k8s.io/node-selector` 設置爲 `"true"` 時，
JobSet 控制器會向此節點污點添加容忍度
（以及上一節討論的針對 `alpha.jobset.sigs.k8s.io/namespaced-job` 標籤的節點選擇算符）。

### jobset.sigs.k8s.io/coordinator

<!--
Type: Annotation, Label

Example: `jobset.sigs.k8s.io/coordinator: "myjobset-workers-0-0.headless-svc"`

Used on: Jobs, Pods

This annotation/label is used on Jobs and Pods to store a stable network endpoint where the coordinator
pod can be reached if the [JobSet](https://jobset.sigs.k8s.io) spec defines the `.spec.coordinator` field.
-->
類別：註解、標籤

例子：`jobset.sigs.k8s.io/coordinator: "myjobset-workers-0-0.headless-svc"`

用於：Job、Pod

此註解/標籤在 Job 和 Pod 上用於存儲一個穩定的網路端點，
以便在 [JobSet](https://jobset.sigs.k8s.io) 規約定義了 .spec.coordinator 字段時，
可以訪問 `coordinator` Pod。

<!--
## Annotations used for audit
-->
## 用於審計的註解    {#annonations-used-for-audit}

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

在[審計註解](/zh-cn/docs/reference/labels-annotations-taints/audit-annotations/)頁面上查看更多詳細信息。

## kubeadm

<!--
### kubeadm.alpha.kubernetes.io/cri-socket (deprecated) {#kubeadm-alpha-kubernetes-io-cri-socket}
-->
## kubeadm.alpha.kubernetes.io/cri-socket (已棄用) {#kubeadm-alpha-kubernetes-io-cri-socket}

<!--
Type: Annotation

Example: `kubeadm.alpha.kubernetes.io/cri-socket: unix:///run/containerd/container.sock`

Used on: Node
-->
類別：註解

例子：`kubeadm.alpha.kubernetes.io/cri-socket: unix:///run/containerd/container.sock`

用於：Node

{{< note >}}
<!--
Starting from v1.34, this annotation is deprecated, kubeadm will no longer actively set and use it.
-->
從 v1.34 開始，此註解已棄用，kubeadm 不再主動設置和使用它。
{{< /note >}}

### kubeadm.kubernetes.io/etcd.advertise-client-urls  {#etcd-advertise-client-urls}

<!--
Type: Annotation

Example: `kubeadm.kubernetes.io/etcd.advertise-client-urls: https://172.17.0.18:2379`

Used on: Pod
-->
類別：註解

例子：`kubeadm.kubernetes.io/etcd.advertise-client-urls: https://172.17.0.18:2379`

用於：Pod

<!--
Annotation that kubeadm places on locally managed etcd Pods to keep track of
a list of URLs where etcd clients should connect to.
This is used mainly for etcd cluster health check purposes.
-->
kubeadm 爲本地管理的 etcd Pod 設置的註解，用來跟蹤 etcd 客戶端應連接到的 URL 列表。
這主要用於 etcd 叢集健康檢查目的。

### kubeadm.kubernetes.io/kube-apiserver.advertise-address.endpoint {#kube-apiserver-advertise-address-endpoint}

<!--
Type: Annotation

Example: `kubeadm.kubernetes.io/kube-apiserver.advertise-address.endpoint: https://172.17.0.18:6443`

Used on: Pod
-->
類別：註解

例子：`kubeadm.kubernetes.io/kube-apiserver.advertise-address.endpoint: https://172.17.0.18:6443`

用於：Pod

<!--
Annotation that kubeadm places on locally managed `kube-apiserver` Pods to keep track
of the exposed advertise address/port endpoint for that API server instance.
-->
kubeadm 爲本地管理的 `kube-apiserver` Pod 設置的註解，用以跟蹤該 API 伺服器實例的公開宣告地址/端口端點。

### kubeadm.kubernetes.io/component-config.hash {#component-config-hash}

<!--
Type: Annotation

Used on: ConfigMap

Example: `kubeadm.kubernetes.io/component-config.hash: 2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae`
-->
類別：註解

用於：ConfigMap

例子：`kubeadm.kubernetes.io/component-config.hash: 2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae`

<!--
Annotation that kubeadm places on ConfigMaps that it manages for configuring components.
It contains a hash (SHA-256) used to determine if the user has applied settings different
from the kubeadm defaults for a particular component.
-->
kubeadm 爲它所管理的 ConfigMaps 設置的註解，用於設定組件。它包含一個哈希（SHA-256）值，
用於確定使用者是否應用了不同於特定組件的 kubeadm 默認設置的設置。

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

類別：標籤

用於：節點

用來指示該節點用於運行控制平面組件的標記標籤。Kubeadm 工具將此標籤應用於其管理的控制平面節點。
其他叢集管理工具通常也會設置此污點。

你可以使用此標籤來標記控制平面節點，以便更容易地將 Pod 僅安排到這些節點上，
或者避免在控制平面上運行 Pod。如果設置了此標籤，
[EndpointSlice 控制器](/zh-cn/docs/concepts/services-networking/topology-aware-routing/#implementation-control-plane)在計算拓撲感知提示時將忽略該節點。

<!--
### node-role.kubernetes.io/*

Type: Label

Example: `node-role.kubernetes.io/gpu: gpu`

Used on: Node
-->
### node-role.kubernetes.io/*

類別：標籤

示例：`node-role.kubernetes.io/control-plane:NoSchedule`

用於：Node

<!--
This optional label is applied to a node when you want to mark a node role. 
The node role (text following `/` in the label key) can be set, as long as the overall key follows the
[syntax](/docs/concepts/overview/working-with-objects/labels/#syntax-and-character-set) rules for
object labels.
-->
當你希望標記節點角色時，可以爲 Node 添加此可選標籤。
只要標籤的整體鍵名符合對象標籤的[語法和字符集規則](/zh-cn/docs/concepts/overview/working-with-objects/labels/#syntax-and-character-set)，
就可以用此標籤設置節點的角色（標籤鍵 `/` 後面的文本爲節點角色名）。

<!--
Kubernetes defines one specific node role, **control-plane**. A label you can use to mark that node
role is [`node-role.kubernetes.io/control-plane`](#node-role-kubernetes-io-control-plane).
-->
Kubernetes 定義了一個特定的節點角色：**control-plane（控制平面）**。你可以使用標籤
[`node-role.kubernetes.io/control-plane`](#node-role-kubernetes-io-control-plane)
來標記節點的這一角色。

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

類別：污點

示例：`node-role.kubernetes.io/control-plane:NoSchedule`

用於：節點

Kubeadm 應用在控制平面節點上的污點, 用來限制啓動 Pod，並且只允許特定 Pod 可調度到這些節點上。

如果應用此污點，則控制平面節點只允許對其進行關鍵工作負載調度。可以在特定節點上使用以下命令手動移除此污點。

<!--
```shell
kubectl taint nodes <node-name> node-role.kubernetes.io/control-plane:NoSchedule-
```
-->
```shell
kubectl taint nodes <節點名稱> node-role.kubernetes.io/control-plane:NoSchedule-
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
### node-role.kubernetes.io/master（已棄用） {#node-role-kubernetes-io-master-taint}

類別：污點

用於：Node

例子：`node-role.kubernetes.io/master:NoSchedule`

kubeadm 先前應用在控制平面節點上的污點，僅允許在其上調度關鍵工作負載。
替換爲 [`node-role.kubernetes.io/control-plane`](#node-role-kubernetes-io-control-plane-taint)；
kubeadm 不再設置或使用這個已棄用的污點。

<!--
### resource.kubernetes.io/admin-access {resource-kubernetes-io-admin-access}

Type: Label

Example: `resource.kubernetes.io/admin-access: "true"`

Used on: Namespace
-->
### resource.kubernetes.io/admin-access {resource-kubernetes-io-admin-access}

類別：標籤

示例：`resource.kubernetes.io/admin-access: "true"`

用於：Namespace

<!--
Used to grant administrative access to certain resource.k8s.io API types within
a namespace. When this label is set on a namespace with the value `"true"`
(case-sensitive), it allows the use of `adminAccess: true` in any namespaced
`resource.k8s.io` API types. Currently, this permission applies to
`ResourceClaim` and `ResourceClaimTemplate` objects.

See [Dynamic Resource Allocation Admin access](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#enabling-admin-access)
for more information.
-->
用於授予某個命名空間內對特定 `resource.k8s.io` API 類型的管理訪問權限。
當此標籤在命名空間上設置爲取值 `"true"`（區分大小寫）時，允許在任何命名空間作用域下的
`resource.k8s.io` API 類別中使用 `adminAccess: true`。
目前，此權限適用於 `ResourceClaim` 和 `ResourceClaimTemplate` 對象。

更多信息請參閱[動態資源分配的管理員訪問權限](/zh-cn/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#enabling-admin-access)。
