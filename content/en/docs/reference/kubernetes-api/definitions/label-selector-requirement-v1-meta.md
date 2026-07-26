---
api_metadata:
  apiVersion: "meta/v1"
  import: "k8s.io/apimachinery/pkg/apis/meta/v1"
  kind: "LabelSelectorRequirement"
content_type: "api_reference"
description: "A label selector requirement is a selector that contains values, a key, and an operator that relates the key and values."
title: "LabelSelectorRequirement"
weight: 180
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


## LabelSelectorRequirement {#LabelSelectorRequirement}

A label selector requirement is a selector that contains values, a key, and an operator that relates the key and values.

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>key</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>key is the label key that the selector applies to.</td>
    </tr>
    <tr>
      <td><code>operator</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>operator represents a key's relationship to a set of values. Valid operators are In, NotIn, Exists and DoesNotExist.</td>
    </tr>
    <tr>
      <td><code>values</code><br/><em>string array</em></td>
      <td>values is an array of string values. If the operator is In or NotIn, the values array must be non-empty. If the operator is Exists or DoesNotExist, the values array must be empty. This array is replaced during a strategic merge patch.</td>
    </tr>
  </tbody>
</table>









