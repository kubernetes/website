---
api_metadata:
  apiVersion: "authorization.k8s.io/v1"
  import: "k8s.io/api/authorization/v1"
  kind: "NonResourceAttributes"
content_type: "api_reference"
description: "NonResourceAttributes includes the authorization attributes available for non-resource requests to the Authorizer interface"
title: "NonResourceAttributes"
weight: 290
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


## NonResourceAttributes {#NonResourceAttributes}

NonResourceAttributes includes the authorization attributes available for non-resource requests to the Authorizer interface

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>path</code><br/><em>string</em></td>
      <td>path is the URL path of the request</td>
    </tr>
    <tr>
      <td><code>verb</code><br/><em>string</em></td>
      <td>verb is the standard HTTP verb</td>
    </tr>
  </tbody>
</table>









