---
api_metadata:
  apiVersion: "authorization.k8s.io/v1"
  import: "k8s.io/api/authorization/v1"
  kind: "ResourceAttributes"
content_type: "api_reference"
description: "ResourceAttributes includes the authorization attributes available for resource requests to the Authorizer interface"
title: "ResourceAttributes"
weight: 400
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

`apiVersion: authorization.k8s.io/v1`

`import "k8s.io/api/authorization/v1"`


## ResourceAttributes {#ResourceAttributes}

ResourceAttributes includes the authorization attributes available for resource requests to the Authorizer interface

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>fieldSelector</code><br/><em><a href="{{< ref "field-selector-attributes-v1-authorization#FieldSelectorAttributes" >}}">FieldSelectorAttributes</a></em></td>
      <td>fieldSelector describes the limitation on access based on field.  It can only limit access, not broaden it.</td>
    </tr>
    <tr>
      <td><code>group</code><br/><em>string</em></td>
      <td>group is the API Group of the Resource.  "*" means all.</td>
    </tr>
    <tr>
      <td><code>labelSelector</code><br/><em><a href="{{< ref "label-selector-attributes-v1-authorization#LabelSelectorAttributes" >}}">LabelSelectorAttributes</a></em></td>
      <td>labelSelector describes the limitation on access based on labels.  It can only limit access, not broaden it.</td>
    </tr>
    <tr>
      <td><code>name</code><br/><em>string</em></td>
      <td>name is the name of the resource being requested for a "get" or deleted for a "delete". "" (empty) means all.</td>
    </tr>
    <tr>
      <td><code>namespace</code><br/><em>string</em></td>
      <td>namespace is the namespace of the action being requested.  Currently, there is no distinction between no namespace and all namespaces "" (empty) is defaulted for LocalSubjectAccessReviews "" (empty) is empty for cluster-scoped resources "" (empty) means "all" for namespace scoped resources from a SubjectAccessReview or SelfSubjectAccessReview</td>
    </tr>
    <tr>
      <td><code>resource</code><br/><em>string</em></td>
      <td>resource is one of the existing resource types.  "*" means all.</td>
    </tr>
    <tr>
      <td><code>subresource</code><br/><em>string</em></td>
      <td>subresource is one of the existing resource types.  "" means none.</td>
    </tr>
    <tr>
      <td><code>verb</code><br/><em>string</em></td>
      <td>verb is a kubernetes resource API verb, like: get, list, watch, create, update, delete, proxy.  "*" means all.</td>
    </tr>
    <tr>
      <td><code>version</code><br/><em>string</em></td>
      <td>version is the API Version of the Resource.  "*" means all.</td>
    </tr>
  </tbody>
</table>









