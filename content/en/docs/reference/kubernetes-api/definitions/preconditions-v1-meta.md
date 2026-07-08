---
api_metadata:
  apiVersion: "meta/v1"
  import: "k8s.io/apimachinery/pkg/apis/meta/v1"
  kind: "Preconditions"
content_type: "api_reference"
description: "Preconditions must be fulfilled before an operation (update, delete, etc.) is carried out."
title: "Preconditions"
weight: 380
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


## Preconditions {#Preconditions}

Preconditions must be fulfilled before an operation (update, delete, etc.) is carried out.

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>resourceVersion</code><br/><em>string</em></td>
      <td>Specifies the target ResourceVersion</td>
    </tr>
    <tr>
      <td><code>uid</code><br/><em>string</em></td>
      <td>Specifies the target UID.</td>
    </tr>
  </tbody>
</table>









