---
api_metadata:
  apiVersion: "meta/v1"
  import: "k8s.io/apimachinery/pkg/apis/meta/v1"
  kind: "ManagedFieldsEntry"
content_type: "api_reference"
description: "ManagedFieldsEntry is a workflow-id, a FieldSet and the group version of the resource that the fieldset applies to."
title: "ManagedFieldsEntry"
weight: 220
auto_generated: true
---

<!--
The file is auto-generated from the Go source code of the component using a generic
[generator](https://github.com/kubernetes-sigs/reference-docs/). To learn how
to generate the reference documentation, please read
[Contributing to the reference documentation](/docs/contribute/generate-ref-docs/).
To update the reference content, please follow the
[Contributing upstream](/docs/contribute/generate-ref-docs/contribute-upstream/)
guide. You can file document formatting bugs against the
[reference-docs](https://github.com/kubernetes-sigs/reference-docs/) project.
-->

`apiVersion: meta/v1`

`import "k8s.io/apimachinery/pkg/apis/meta/v1"`


## ManagedFieldsEntry {#ManagedFieldsEntry}

ManagedFieldsEntry is a workflow-id, a FieldSet and the group version of the resource that the fieldset applies to.

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>apiVersion</code><br/><em>string</em></td>
      <td>APIVersion defines the version of this resource that this field set applies to. The format is "group/version" just like the top-level APIVersion field. It is necessary to track the version of a field set because it cannot be automatically converted.</td>
    </tr>
    <tr>
      <td><code>fieldsType</code><br/><em>string</em></td>
      <td>FieldsType is the discriminator for the different fields format and version. There is currently only one possible value: "FieldsV1"</td>
    </tr>
    <tr>
      <td><code>fieldsV1</code><br/><em><a href="{{< ref "fields-v1-v1-meta#FieldsV1" >}}">FieldsV1</a></em></td>
      <td>FieldsV1 holds the first JSON version format as described in the "FieldsV1" type.</td>
    </tr>
    <tr>
      <td><code>manager</code><br/><em>string</em></td>
      <td>Manager is an identifier of the workflow managing these fields.</td>
    </tr>
    <tr>
      <td><code>operation</code><br/><em>string</em></td>
      <td>Operation is the type of operation which lead to this ManagedFieldsEntry being created. The only valid values for this field are 'Apply' and 'Update'.</td>
    </tr>
    <tr>
      <td><code>subresource</code><br/><em>string</em></td>
      <td>Subresource is the name of the subresource used to update that object, or empty string if the object was updated through the main resource. The value of this field is used to distinguish between managers, even if they share the same name. For example, a status update will be distinct from a regular update using the same manager name. Note that the APIVersion field is not related to the Subresource field and it always corresponds to the version of the main resource.</td>
    </tr>
    <tr>
      <td><code>time</code><br/><em><a href="{{< ref "time-v1-meta#Time" >}}">Time</a></em></td>
      <td>Time is the timestamp of when the ManagedFields entry was added. The timestamp will also be updated if a field is added, the manager changes any of the owned fields value or removes a field. The timestamp does not update when a field is removed from the entry because another manager took it over.</td>
    </tr>
  </tbody>
</table>









