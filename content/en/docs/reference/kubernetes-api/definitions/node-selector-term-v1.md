---
api_metadata:
  apiVersion: "v1"
  import: "k8s.io/api/core/v1"
  kind: "NodeSelectorTerm"
content_type: "api_reference"
description: "A null or empty node selector term matches no objects. The requirements of them are ANDed. The TopologySelectorTerm type implements a subset of the NodeSelectorTerm."
title: "NodeSelectorTerm"
weight: 280
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

`apiVersion: v1`

`import "k8s.io/api/core/v1"`


## NodeSelectorTerm {#NodeSelectorTerm}

A null or empty node selector term matches no objects. The requirements of them are ANDed. The TopologySelectorTerm type implements a subset of the NodeSelectorTerm.

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>matchExpressions</code><br/><em><a href="{{< ref "../resource/resource-slice-v1#NodeSelectorRequirement" >}}">NodeSelectorRequirement array</a></em></td>
      <td>A list of node selector requirements by node's labels.</td>
    </tr>
    <tr>
      <td><code>matchFields</code><br/><em><a href="{{< ref "../resource/resource-slice-v1#NodeSelectorRequirement" >}}">NodeSelectorRequirement array</a></em></td>
      <td>A list of node selector requirements by node's fields.</td>
    </tr>
  </tbody>
</table>









