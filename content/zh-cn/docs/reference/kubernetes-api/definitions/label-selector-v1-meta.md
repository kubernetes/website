---
api_metadata:
  apiVersion: "meta/v1"
  import: "k8s.io/apimachinery/pkg/apis/meta/v1"
  kind: "LabelSelector"
content_type: "api_reference"
description: "标签选择器是对一组资源进行的标签查询。`matchLabels` 和 `matchExpressions` 的结果会进行“与”（AND）运算。空的标签选择器匹配所有对象；为 `null` 的标签选择器不匹配任何对象。"
title: "LabelSelector"
weight: 160
---

<!--
api_metadata:
  apiVersion: "meta/v1"
  import: "k8s.io/apimachinery/pkg/apis/meta/v1"
  kind: "LabelSelector"
content_type: "api_reference"
description: "A label selector is a label query over a set of resources. The result of matchLabels and matchExpressions are ANDed. An empty label selector matches all objects. A null label selector matches no objects."
title: "LabelSelector"
weight: 160
auto_generated: true
-->

`apiVersion: meta/v1`

`import "k8s.io/apimachinery/pkg/apis/meta/v1"`


## LabelSelector {#LabelSelector}

<!--
A label selector is a label query over a set of resources. The result of matchLabels and matchExpressions are ANDed. An empty label selector matches all objects. A null label selector matches no objects.
-->
标签选择器是对一组资源进行的标签查询。`matchLabels` 和 `matchExpressions` 的结果会进行“与”（AND）运算。
空的标签选择器匹配所有对象；为 `null` 的标签选择器不匹配任何对象。

<hr>

<table>
  <thead><tr><th><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
  <tbody>
    <tr>
      <td><code>matchExpressions</code><br/><em><a href="{{< ref "label-selector-requirement-v1-meta#LabelSelectorRequirement" >}}">LabelSelectorRequirement array</a></em></td>
      <td>
      <!--
      matchExpressions is a list of label selector requirements. The requirements are ANDed.
      -->
      matchExpressions 是一组标签选择器要求。这些要求之间是“与”（AND）的关系。
      </td>
    </tr>
    <tr>
      <td><code>matchLabels</code><br/><em>object</em></td>
      <td>
      <!--
      matchLabels is a map of {key,value} pairs. A single {key,value} in the matchLabels map is equivalent to an element of matchExpressions, whose key field is "key", the operator is "In", and the values array contains only "value". The requirements are ANDed.
      -->
      matchLabels 是一个 {key, value} 键值对映射。matchLabels 映射中的单个 {key, value}
      等同于 matchExpressions 中的一个元素，该元素的 key 字段为 "key"，operator 为 "In"，且
      values 数组仅包含 "value"。各项要求之间为“与”（AND）的关系。
      </td>
    </tr>
  </tbody>
</table>
