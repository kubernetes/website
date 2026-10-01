---
api_metadata:
  apiVersion: "meta/v1"
  import: "k8s.io/apimachinery/pkg/apis/meta/v1"
  kind: "DeleteOptions"
content_type: "api_reference"
description: "删除 API 对象时，可以指定 DeleteOptions。"
title: "DeleteOptions"
weight: 80
auto_generated: true
---

<!--
api_metadata:
  apiVersion: "meta/v1"
  import: "k8s.io/apimachinery/pkg/apis/meta/v1"
  kind: "DeleteOptions"
content_type: "api_reference"
description: "DeleteOptions may be provided when deleting an API object."
title: "DeleteOptions"
weight: 80
auto_generated: true
-->

`apiVersion: meta/v1`

`import "k8s.io/apimachinery/pkg/apis/meta/v1"`


## DeleteOptions {#DeleteOptions}

<!--
DeleteOptions may be provided when deleting an API object.
-->
删除 API 对象时，可以指定 DeleteOptions。

<hr>

<table>
  <thead><tr><th><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
  <tbody>
    <tr>
      <td><code>apiVersion</code><br/><em>string</em></td>
      <td>
      <!--
      APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources
      -->
      apiVersion 定义了该对象表示形式的版本化模式（schema）。
      服务器应将已识别的模式转换为最新的内部值，并可拒绝无法识别的值。更多信息：
      https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources
      </td>
    </tr>
    <tr>
      <td><code>dryRun</code><br/><em>string array</em></td>
      <td>
      <!--
      When present, indicates that modifications should not be persisted. An invalid or unrecognized dryRun directive will result in an error response and no further processing of the request. Valid values are: - All: all dry run stages will be processed
      -->
      如果存在，则表示不应保存修改。无效或无法识别的 dryRun 指令将导致错误响应，并且不会进一步处理请求。
      有效值包括：- All：将处理所有 dryRun 阶段。
      </td>
    </tr>
    <tr>
      <td><code>gracePeriodSeconds</code><br/><em>integer</em></td>
      <td>
      <!--
      The duration in seconds before the object should be deleted. Value must be non-negative integer. The value zero indicates delete immediately. If this value is nil, the default grace period for the specified type will be used. Defaults to a per object value if not specified. zero means delete immediately.
      -->
      对象被删除前需等待的时长（以秒为单位）。该值必须是非负整数；值为 0 表示立即删除。
      若该值为 nil，则使用指定类型的默认宽限期。未指定时，默认采用针对该对象的特定值；值为 0 表示立即删除。
      </td>
    </tr>
    <tr>
      <td><code>ignoreStoreReadErrorWithClusterBreakingPotential</code><br/><em>boolean</em></td>
      <td>
      <!--
      if set to true, it will trigger an unsafe deletion of the resource in case the normal deletion flow fails with a corrupt object error. A resource is considered corrupt if it can not be retrieved from the underlying storage successfully because of a) its data can not be transformed e.g. decryption failure, or b) it fails to decode into an object. NOTE: unsafe deletion ignores finalizer constraints, skips precondition checks, and removes the object from the storage. WARNING: This may potentially break the cluster if the workload associated with the resource being unsafe-deleted relies on normal deletion flow. Use only if you REALLY know what you are doing. The default value is false, and the user must opt in to enable it
      -->
      如果设置为 true，当正常的删除流程因“对象损坏”错误而失败时，系统将触发该资源的“不安全删除”（unsafe deletion）。
      若资源因以下原因无法从底层存储成功获取，则被视为损坏：
      a) 数据无法转换（例如解密失败），或
      b) 无法解码为对象。注意：不安全删除会忽略终结器（finalizer）约束，跳过前置条件检查，并直接从存储中移除该对象。
      警告：如果被不安全删除的资源所关联的工作负载依赖于正常的删除流程，此操作可能会导致集群故障。
      请务必在充分了解操作后果的情况下使用。默认值为 false，用户必须明确启用该选项。
      </td>
    </tr>
    <tr>
      <td><code>kind</code><br/><em>string</em></td>
      <td>
      <!--
      Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds
      -->
      kind 是一个字符串值，用于标识该对象所代表的 REST 资源。服务器可以根据客户端提交请求的端点推断出该值。
      该字段不可更新。采用驼峰命名法（CamelCase）。更多信息请参阅：
      https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds
      </td>
    </tr>
    <tr>
      <td><code>orphanDependents</code><br/><em>boolean</em></td>
      <td>
      <!--
      Deprecated: please use the PropagationPolicy, this field will be deprecated in 1.7. Should the dependent objects be orphaned. If true/false, the "orphan" finalizer will be added to/removed from the object's finalizers list. Either this field or PropagationPolicy may be set, but not both.
      -->
      已弃用：请使用 PropagationPolicy，该字段将在 1.7 版本中弃用。用于指定是否将从属对象置为孤立状态。
      若设为 true 或 false，则会将 "orphan" 终结器（finalizer）添加至对象的终结器列表或从中移除。
      此字段与 PropagationPolicy 仅可设置其一，不可同时设置。
      </td>
    </tr>
    <tr>
      <td><code>preconditions</code><br/><em><a href="{{< ref "preconditions-v1-meta#Preconditions" >}}">Preconditions</a></em></td>
      <td>
      <!--
      Must be fulfilled before a deletion is carried out. If not possible, a 409 Conflict status will be returned.
      -->
      必须在执行删除操作前满足此条件。如果无法满足，将返回 409 Conflict 状态码。
      </td>
    </tr>
    <tr>
      <td><code>propagationPolicy</code><br/><em>string</em></td>
      <td>
      <!--
      Whether and how garbage collection will be performed. Either this field or OrphanDependents may be set, but not both. The default policy is decided by the existing finalizer set in the metadata.finalizers and the resource-specific default policy. Acceptable values are: 'Orphan' - orphan the dependents; 'Background' - allow the garbage collector to delete the dependents in the background; 'Foreground' - a cascading policy that deletes all dependents in the foreground.
      -->
      决定是否以及如何执行垃圾回收。此字段与 `OrphanDependents` 字段只能设置其中之一，
      不能同时设置。默认策略取决于 `metadata.finalizers` 中现有的终结器（finalizer）设置以及该资源特定的默认策略。
      可选值包括：'Orphan' —— 将从属资源设为孤儿（即保留从属资源）；'Background' —— 允许垃圾回收器在后台删除从属资源；
      'Foreground' —— 一种级联策略，在前台删除所有从属资源。
      </td>
    </tr>
  </tbody>
</table>
