---
api_metadata:
  apiVersion: "admissionregistration.k8s.io/v1"
  import: "k8s.io/api/admissionregistration/v1"
  kind: "ParamKind"
content_type: "api_reference"
description: "ParamKind is a tuple of Group Kind and Version."
title: "ParamKind"
weight: 340
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

`apiVersion: admissionregistration.k8s.io/v1`

`import "k8s.io/api/admissionregistration/v1"`


## ParamKind {#ParamKind}

ParamKind is a tuple of Group Kind and Version.

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>apiVersion</code><br/><em>string</em></td>
      <td>apiVersion is the API group version the resources belong to. In format of "group/version". Required.</td>
    </tr>
    <tr>
      <td><code>kind</code><br/><em>string</em></td>
      <td>kind is the API kind the resources belong to. Required.</td>
    </tr>
  </tbody>
</table>









