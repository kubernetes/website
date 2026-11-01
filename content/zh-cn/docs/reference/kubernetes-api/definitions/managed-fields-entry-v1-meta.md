---
api_metadata:
  apiVersion: "meta/v1"
  import: "k8s.io/apimachinery/pkg/apis/meta/v1"
  kind: "ManagedFieldsEntry"
content_type: "api_reference"
description: "ManagedFieldsEntry 包含工作流 ID、字段集（FieldSet）以及该字段集所适用的资源的组版本（group version）。"
title: "ManagedFieldsEntry"
weight: 220
---

<!--
api_metadata:
  apiVersion: "meta/v1"
  import: "k8s.io/apimachinery/pkg/apis/meta/v1"
  kind: "ManagedFieldsEntry"
content_type: "api_reference"
description: "ManagedFieldsEntry is a workflow-id, a FieldSet and the group version of the resource that the fieldset applies to."
title: "ManagedFieldsEntry"
weight: 220
auto_generated: true
-->

`apiVersion: meta/v1`

`import "k8s.io/apimachinery/pkg/apis/meta/v1"`


## ManagedFieldsEntry {#ManagedFieldsEntry}

<!--
ManagedFieldsEntry is a workflow-id, a FieldSet and the group version of the resource that the fieldset applies to.
-->
ManagedFieldsEntry 包含工作流 ID、字段集（FieldSet）以及该字段集所适用的资源的组版本（group version）。

<hr>

<table>
  <thead><tr><th><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
  <tbody>
    <tr>
      <td><code>apiVersion</code><br/><em>string</em></td>
      <td>
      <!--
      APIVersion defines the version of this resource that this field set applies to. The format is "group/version" just like the top-level APIVersion field. It is necessary to track the version of a field set because it cannot be automatically converted.
      -->
      apiVersion 定义了该字段集所适用的资源版本。其格式为 "group/version"，与顶层的 apiVersion 字段相同。
      必须追踪字段集的版本，因为该字段集无法自动转换。
      </td>
    </tr>
    <tr>
      <td><code>fieldsType</code><br/><em>string</em></td>
      <td>
      <!--
      FieldsType is the discriminator for the different fields format and version. There is currently only one possible value: "FieldsV1"
      -->
      fieldsType 是用于区分不同字段格式与版本的标识符。目前仅有一种可能的取值："FieldsV1"。
      </td>
    </tr>
    <tr>
      <td><code>fieldsV1</code><br/><em><a href="{{< ref "fields-v1-v1-meta#FieldsV1" >}}">FieldsV1</a></em></td>
      <td>
      <!--
      FieldsV1 holds the first JSON version format as described in the "FieldsV1" type.
      -->
      fieldsV1 包含 "FieldsV1" 类型中所述的首个 JSON 版本格式。
      </td>
    </tr>
    <tr>
      <td><code>manager</code><br/><em>string</em></td>
      <td>
      <!--
      Manager is an identifier of the workflow managing these fields.
      -->
      manager 是管理这些字段的工作流的标识符。
      </td>
    </tr>
    <tr>
      <td><code>operation</code><br/><em>string</em></td>
      <td>
      <!--
      Operation is the type of operation which lead to this ManagedFieldsEntry being created. The only valid values for this field are 'Apply' and 'Update'.
      -->
      operation 是导致创建此 ManagedFieldsEntry 的操作类型。该字段仅有的有效值为 "Apply" 和 "Update"。
      </td>
    </tr>
    <tr>
      <td><code>subresource</code><br/><em>string</em></td>
      <td>
      <!--
      Subresource is the name of the subresource used to update that object, or empty string if the object was updated through the main resource. The value of this field is used to distinguish between managers, even if they share the same name. For example, a status update will be distinct from a regular update using the same manager name. Note that the APIVersion field is not related to the Subresource field and it always corresponds to the version of the main resource.
      -->
      subresource 是用于更新该对象的子资源名称；如果对象是通过主资源更新的，则该字段为空字符串。
      该字段的值用于区分不同的管理器（manager），即使它们使用相同的名称。例如，使用相同管理器名称时，状态更新将与常规更新区分开来。
      请注意，apiVersion 字段与 subresource 字段无关，它始终对应于主资源的版本。
      </td>
    </tr>
    <tr>
      <td><code>time</code><br/><em><a href="{{< ref "time-v1-meta#Time" >}}">Time</a></em></td>
      <td>
      <!--
      Time is the timestamp of when the ManagedFields entry was added. The timestamp will also be updated if a field is added, the manager changes any of the owned fields value or removes a field. The timestamp does not update when a field is removed from the entry because another manager took it over.
      -->
      time 字段记录了 ManagedFields 条目添加时的时间戳。如果新增了字段，或者管理器修改了其所管辖字段的值或移除了某个字段，
      该时间戳也会随之更新；但如果某个字段因被另一位管理器接管而从条目中移除，该时间戳则不会更新。
      </td>
    </tr>
  </tbody>
</table>

