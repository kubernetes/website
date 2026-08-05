---
api_metadata:
  apiVersion: ""
  import: "k8s.io/apimachinery/pkg/apis/meta/v1"
  kind: "DeleteOptions"
content_type: "api_reference"
description: "删除 API 对象时可以提供 DeleteOptions。"
title: "DeleteOptions"
weight: 1
---
<!--
api_metadata:
  apiVersion: ""
  import: "k8s.io/apimachinery/pkg/apis/meta/v1"
  kind: "DeleteOptions"
content_type: "api_reference"
description: "DeleteOptions may be provided when deleting an API object."
title: "DeleteOptions"
weight: 1
auto_generated: true
-->

`import "k8s.io/apimachinery/pkg/apis/meta/v1"`

<!--
DeleteOptions may be provided when deleting an API object.
-->
删除 API 对象时可以提供 DeleteOptions。

<hr>

<!--
- **apiVersion** (string)

  APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources
-->
- **apiVersion** (string)

  `APIVersion` 定义对象表示的版本化模式。
  服务器应将已识别的模式转换为最新的内部值，并可能拒绝无法识别的值。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources

<!--
- **dryRun** ([]string)

  *Atomic: will be replaced during a merge*

  When present, indicates that modifications should not be persisted. An invalid or unrecognized dryRun directive will result in an error response and no further processing of the request. Valid values are: - All: all dry run stages will be processed
-->
- **dryRun** ([]string)

  **原子性：将在合并期间被替换**

  该值如果存在，则表示不应保留修改。
  无效或无法识别的 `dryRun` 指令将导致错误响应并且不会进一步处理请求。有效值为：

  - `All`：处理所有试运行阶段（Dry Run Stages）

<!--
- **gracePeriodSeconds** (int64)

  The duration in seconds before the object should be deleted. Value must be non-negative integer. The value zero indicates delete immediately. If this value is nil, the default grace period for the specified type will be used. Defaults to a per object value if not specified. zero means delete immediately.
-->
- **gracePeriodSeconds** (int64)

  表示对象被删除之前的持续时间（以秒为单位）。
  值必须是非负整数。零值表示立即删除。如果此值为 `nil`，则将使用指定类型的默认宽限期。如果未指定，则为每个对象的默认值。

<!--
- **ignoreStoreReadErrorWithClusterBreakingPotential** (boolean)

  if set to true, it will trigger an unsafe deletion of the resource in case the normal deletion flow fails with a corrupt object error. A resource is considered corrupt if it can not be retrieved from the underlying storage successfully because of a) its data can not be transformed e.g. decryption failure, or b) it fails to decode into an object. NOTE: unsafe deletion ignores finalizer constraints, skips precondition checks, and removes the object from the storage. WARNING: This may potentially break the cluster if the workload associated with the resource being unsafe-deleted relies on normal deletion flow. Use only if you REALLY know what you are doing. The default value is false, and the user must opt in to enable it
-->
- **ignoreStoreReadErrorWithClusterBreakingPotential** (boolean)

  如果设置为 true，那么在正常删除流程因对象损坏错误而失败时，将触发资源的不安全删除。
  当由于以下原因无法成功从底层存储检索资源时，该资源被视为损坏：

  1. 其数据无法转换，例如解密失败；或 
  2. 它无法解码为一个对象。

  注意：不安全删除忽略终结器约束，跳过前提条件检查，并从存储中移除对象。

  警告：如果与正在被不安全删除的资源相关联的工作负载依赖于正常的删除流程，
  这可能会破坏集群。仅在你真的知道自己在做什么的情况下使用。
  默认值是 false，用户必须选择启用它。

<!--
- **kind** (string)

  Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds
-->
- **kind** (string)

  `kind` 是一个字符串值，表示此对象代表的 REST 资源。
  服务器可以从客户端提交请求的端点推断出此值。此值无法更新，是驼峰的格式。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds

<!--
- **orphanDependents** (boolean)

  Deprecated: please use the PropagationPolicy, this field will be deprecated in 1.7. Should the dependent objects be orphaned. If true/false, the "orphan" finalizer will be added to/removed from the object's finalizers list. Either this field or PropagationPolicy may be set, but not both.
-->
- **orphanDependents** (boolean)

  已弃用：该字段将在 1.7 中弃用，请使用 `propagationPolicy` 字段。
  该字段表示依赖对象是否应该是孤儿。如果为 true/false，对象的 finalizers 列表中会被添加上或者移除掉 “orphan” 终结器（Finalizer）。
  可以设置此字段或者设置 `propagationPolicy` 字段，但不能同时设置以上两个字段。

<!--
- **preconditions** (Preconditions)

  Must be fulfilled before a deletion is carried out. If not possible, a 409 Conflict status will be returned.

  <a name="Preconditions"></a>
  *Preconditions must be fulfilled before an operation (update, delete, etc.) is carried out.*

  - **preconditions.resourceVersion** (string)

    Specifies the target ResourceVersion

  - **preconditions.uid** (string)

    Specifies the target UID.
-->
- **preconditions** (Preconditions)

  先决条件必须在执行删除之前完成。如果无法满足这些条件，将返回 409（冲突）状态。

  <a name="Preconditions"></a>
  **执行操作（更新、删除等）之前必须满足先决条件。**

  - **preconditions.resourceVersion** (string)

    指定目标资源版本（resourceVersion）。

  - **preconditions.uid** (string)

    指定目标 UID。

<!--
- **propagationPolicy** (string)

  Whether and how garbage collection will be performed. Either this field or OrphanDependents may be set, but not both. The default policy is decided by the existing finalizer set in the metadata.finalizers and the resource-specific default policy. Acceptable values are: 'Orphan' - orphan the dependents; 'Background' - allow the garbage collector to delete the dependents in the background; 'Foreground' - a cascading policy that deletes all dependents in the foreground.
-->
- **propagationPolicy** (string)

  表示是否以及如何执行垃圾收集。可以设置此字段或 `orphanDependents` 字段，但不能同时设置二者。
  默认策略由 `metadata.finalizers` 中现有终结器（Finalizer）集合和特定资源的默认策略决定。
  可选值为：
  
  - `Orphan` 令依赖对象成为孤儿对象；
  - `Background` 允许垃圾收集器在后台删除依赖项；
  - `Foreground` 一个级联策略，前台删除所有依赖项。
