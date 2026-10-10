---
api_metadata:
  apiVersion: "scheduling.k8s.io/v1alpha2"
  import: "k8s.io/api/scheduling/v1alpha2"
  kind: "TypedLocalObjectReference"
content_type: "api_reference"
description: "TypedLocalObjectReference allows to reference typed object inside the same namespace."
title: "TypedLocalObjectReference"
weight: 610
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

`apiVersion: scheduling.k8s.io/v1alpha2`

`import "k8s.io/api/scheduling/v1alpha2"`


## TypedLocalObjectReference {#TypedLocalObjectReference}

TypedLocalObjectReference allows to reference typed object inside the same namespace.

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>apiGroup</code><br/><em>string</em></td>
      <td>APIGroup is the group for the resource being referenced. If APIGroup is empty, the specified Kind must be in the core API group. For any other third-party types, setting APIGroup is required. It must be a DNS subdomain.</td>
    </tr>
    <tr>
      <td><code>kind</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>Kind is the type of resource being referenced. It must be a path segment name.</td>
    </tr>
    <tr>
      <td><code>name</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>Name is the name of resource being referenced. It must be a path segment name.</td>
    </tr>
  </tbody>
</table>









