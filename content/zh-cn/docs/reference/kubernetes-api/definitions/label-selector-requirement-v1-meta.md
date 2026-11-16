---
api_metadata:
  apiVersion: "meta/v1"
  import: "k8s.io/apimachinery/pkg/apis/meta/v1"
  kind: "LabelSelectorRequirement"
content_type: "api_reference"
description: "标签选择器需求是一种包含键、值以及用于关联键与值的运算符的选择器。"
title: "LabelSelectorRequirement"
weight: 180
---

<!--
api_metadata:
  apiVersion: "meta/v1"
  import: "k8s.io/apimachinery/pkg/apis/meta/v1"
  kind: "LabelSelectorRequirement"
content_type: "api_reference"
description: "A label selector requirement is a selector that contains values, a key, and an operator that relates the key and values."
title: "LabelSelectorRequirement"
weight: 180
auto_generated: true
-->

`apiVersion: meta/v1`

`import "k8s.io/apimachinery/pkg/apis/meta/v1"`


## LabelSelectorRequirement {#LabelSelectorRequirement}

<!--
A label selector requirement is a selector that contains values, a key, and an operator that relates the key and values.
-->
标签选择器需求是一种包含键、值以及用于关联键与值的运算符的选择器。

<hr>

<table>
  <thead><tr><th><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
  <tbody>
    <tr>
      <td><code>key</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>
      <!--
      key is the label key that the selector applies to.
      -->
      key 是选择器所作用的标签键（label key）。
      </td>
    </tr>
    <tr>
      <td><code>operator</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>
      <!--
      operator represents a key's relationship to a set of values. Valid operators are In, NotIn, Exists and DoesNotExist.
      -->
      运算符表示与一组值之间的关键关系。有效的运算符包括 In、Not、Exists 和 DoesNotExist。
      </td>
    </tr>
    <tr>
      <td><code>values</code><br/><em>string array</em></td>
      <td>
      <!--
      values is an array of string values. If the operator is In or NotIn, the values array must be non-empty. If the operator is Exists or DoesNotExist, the values array must be empty. This array is replaced during a strategic merge patch.
      -->
      values 是一个字符串值数组。如果运算符为 In 或 NotIn，则 values 数组不能为空；如果运算符为
      Exists 或 DoesNotExist，则 values 数组必须为空。在执行策略性合并补丁（strategic merge patch）操作时，该数组会被替换。
      </td>
    </tr>
  </tbody>
</table>
