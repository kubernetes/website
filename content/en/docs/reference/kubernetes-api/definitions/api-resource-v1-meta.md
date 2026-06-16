---
api_metadata:
  apiVersion: "meta/v1"
  import: "k8s.io/apimachinery/pkg/apis/meta/v1"
  kind: "APIResource"
content_type: "api_reference"
description: "APIResource specifies the name of a resource and whether it is namespaced."
title: "APIResource"
weight: 30
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


## APIResource {#APIResource}

APIResource specifies the name of a resource and whether it is namespaced.

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>categories</code><br/><em>string array</em></td>
      <td>categories is a list of the grouped resources this resource belongs to (e.g. 'all')</td>
    </tr>
    <tr>
      <td><code>group</code><br/><em>string</em></td>
      <td>group is the preferred group of the resource.  Empty implies the group of the containing resource list. For subresources, this may have a different value, for example: Scale".</td>
    </tr>
    <tr>
      <td><code>kind</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>kind is the kind for the resource (e.g. 'Foo' is the kind for a resource 'foo')</td>
    </tr>
    <tr>
      <td><code>name</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>name is the plural name of the resource.</td>
    </tr>
    <tr>
      <td><code>namespaced</code>&nbsp;<strong>*</strong><br/><em>boolean</em></td>
      <td>namespaced indicates if a resource is namespaced or not.</td>
    </tr>
    <tr>
      <td><code>shortNames</code><br/><em>string array</em></td>
      <td>shortNames is a list of suggested short names of the resource.</td>
    </tr>
    <tr>
      <td><code>singularName</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>singularName is the singular name of the resource.  This allows clients to handle plural and singular opaquely. The singularName is more correct for reporting status on a single item and both singular and plural are allowed from the kubectl CLI interface.</td>
    </tr>
    <tr>
      <td><code>storageVersionHash</code><br/><em>string</em></td>
      <td>The hash value of the storage version, the version this resource is converted to when written to the data store. Value must be treated as opaque by clients. Only equality comparison on the value is valid. This is an alpha feature and may change or be removed in the future. The field is populated by the apiserver only if the StorageVersionHash feature gate is enabled. This field will remain optional even if it graduates.</td>
    </tr>
    <tr>
      <td><code>verbs</code>&nbsp;<strong>*</strong><br/><em>string array</em></td>
      <td>verbs is a list of supported kube verbs (this includes get, list, watch, create, update, patch, delete, deletecollection, and proxy)</td>
    </tr>
    <tr>
      <td><code>version</code><br/><em>string</em></td>
      <td>version is the preferred version of the resource.  Empty implies the version of the containing resource list For subresources, this may have a different value, for example: v1 (while inside a v1beta1 version of the core resource's group)".</td>
    </tr>
  </tbody>
</table>


## APIResourceList {#APIResourceList}

APIResourceList is a list of APIResource, it is used to expose the name of the resources supported in a specific group and version, and if the resource is namespaced.

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>apiVersion</code><br/><em>string</em></td>
      <td>APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources</td>
    </tr>
    <tr>
      <td><code>groupVersion</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>groupVersion is the group and version this APIResourceList is for.</td>
    </tr>
    <tr>
      <td><code>kind</code><br/><em>string</em></td>
      <td>Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds</td>
    </tr>
    <tr>
      <td><code>resources</code>&nbsp;<strong>*</strong><br/><em><a href="{{< ref "api-resource-v1-meta#APIResource" >}}">APIResource array</a></em></td>
      <td>resources contains the name of the resources and if they are namespaced.</td>
    </tr>
  </tbody>
</table>









