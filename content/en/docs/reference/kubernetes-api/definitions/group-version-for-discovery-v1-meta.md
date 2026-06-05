---
api_metadata:
  apiVersion: "meta/v1"
  import: "k8s.io/apimachinery/pkg/apis/meta/v1"
  kind: "GroupVersionForDiscovery"
content_type: "api_reference"
description: "GroupVersion contains the &#34;group/version&#34; and &#34;version&#34; string of a version. It is made a struct to keep extensibility."
title: "GroupVersionForDiscovery"
weight: 150
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


## GroupVersionForDiscovery {#GroupVersionForDiscovery}

GroupVersion contains the &#34;group/version&#34; and &#34;version&#34; string of a version. It is made a struct to keep extensibility.

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>groupVersion</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>groupVersion specifies the API group and version in the form "group/version"</td>
    </tr>
    <tr>
      <td><code>version</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>version specifies the version in the form of "version". This is to save the clients the trouble of splitting the GroupVersion.</td>
    </tr>
  </tbody>
</table>









