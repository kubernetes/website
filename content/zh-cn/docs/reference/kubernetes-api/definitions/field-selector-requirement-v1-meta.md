---
api_metadata:
  apiVersion: "meta/v1"
  import: "k8s.io/apimachinery/pkg/apis/meta/v1"
  kind: "FieldSelectorRequirement"
content_type: "api_reference"
description: "FieldSelectorRequirement 是一种选择器，包含键（key）、值（values）以及用于关联键与值的运算符（operator）。"
title: "FieldSelectorRequirement"
weight: 120
---

<!--
api_metadata:
  apiVersion: "meta/v1"
  import: "k8s.io/apimachinery/pkg/apis/meta/v1"
  kind: "FieldSelectorRequirement"
content_type: "api_reference"
description: "FieldSelectorRequirement is a selector that contains values, a key, and an operator that relates the key and values."
title: "FieldSelectorRequirement"
weight: 120
auto_generated: true
-->

`apiVersion: meta/v1`

`import "k8s.io/apimachinery/pkg/apis/meta/v1"`


## FieldSelectorRequirement {#FieldSelectorRequirement}

<!--
FieldSelectorRequirement is a selector that contains values, a key, and an operator that relates the key and values.
-->
FieldSelectorRequirement 是一种选择器，包含键（key）、值（values）
以及用于关联键与值的运算符（operator）。

<hr>

<table>
  <thead><tr><th><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
  <tbody>
    <tr>
      <td><code>key</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>
      <!--
      key is the field selector key that the requirement applies to.
      -->
      key 是选择器应用的字段选择器键。
      </td>
    </tr>
    <tr>
      <td><code>operator</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>
      <!--
      operator represents a key's relationship to a set of values. Valid operators are In, NotIn, Exists, DoesNotExist. The list of operators may grow in the future.
      -->
      operator 表示键与值之间的关系。有效运算符包括
      In、NotIn、Exists、DoesNotExist。
      运算符列表可能会在未来扩展。
      </td>
    </tr>
    <tr>
      <td><code>values</code><br/><em>string array</em></td>
      <td>
      <!--
      values is an array of string values. If the operator is In or NotIn, the values array must be non-empty. If the operator is Exists or DoesNotExist, the values array must be empty.
      -->
      values 是一个字符串值数组。如果运算符是 In 或 NotIn，则 values
      数组必须非空；如果运算符是 Exists 或 DoesNotExist，则 values 数组必须为空。
      </td>
    </tr>
  </tbody>
</table>
