---
api_metadata:
  apiVersion: ""
  import: "k8s.io/apimachinery/pkg/apis/meta/v1"
  kind: "LabelSelector"
content_type: "api_reference"
description: "标签选择器是对一组资源的标签查询。"
title: "LabelSelector"
weight: 2
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



`import "k8s.io/apimachinery/pkg/apis/meta/v1"`

<!--
A label selector is a label query over a set of resources. The result of matchLabels and matchExpressions are ANDed. An empty label selector matches all objects. A null label selector matches no objects.
<hr>
-->

标签选择器是对一组资源的标签查询。 matchLabels 和 matchExpressions 的结果是 AND 运算。空标签选择器匹配所有对象。空标签选择器不匹配任何对象。
<hr>

<!--
- **matchExpressions** ([]LabelSelectorRequirement)

  matchExpressions is a list of label selector requirements. The requirements are ANDed.

  <a name="LabelSelectorRequirement"></a>
  *A label selector requirement is a selector that contains values, a key, and an operator that relates the key and values.*

  - **matchExpressions.key** (string), required

    *Patch strategy: merge on key `key`*
    
    key is the label key that the selector applies to.

  - **matchExpressions.operator** (string), required

    operator represents a key's relationship to a set of values. Valid operators are In, NotIn, Exists and DoesNotExist.

  - **matchExpressions.values** ([]string)

    values is an array of string values. If the operator is In or NotIn, the values array must be non-empty. If the operator is Exists or DoesNotExist, the values array must be empty. This array is replaced during a strategic merge patch.

- **matchLabels** (map[string]string)

  matchLabels is a map of {key,value} pairs. A single {key,value} in the matchLabels map is equivalent to an element of matchExpressions, whose key field is "key", the operator is "In", and the values array contains only "value". The requirements are ANDed.
-->


- **matchExpressions** ([]LabelSelectorRequirement)

  matchExpressions 是标签选择器要求的列表。要求是 ANDed。

  <a name="LabelSelectorRequirement"></a>
  *标签选择器要求是包含值、键和关联键和值的运算符的选择器。*

  - **matchExpressions.key**（string），必填

    *补丁策略：在键`key`上合并*

    key 是选择器应用到的标签键。

  - **matchExpressions.operator**（string），必需
    
    运算符表示键与一组值的关系。有效的运算符包括 In、NotIn、Exists 和 DoesNotExist。

  - **matchExpressions.values** ([]string)

    values 是一个字符串值数组。如果运算符为 In 或 NotIn，则 values 数组必须为非空。如果运算符是 Exists 或 DoesNotExist，则 values 数组必须为空。该数组在战略合并补丁期间被替换。

  - **matchLabels**（map[string]string）
    matchLabels 是 {key,value} 对的映射。 matchLabels 映射中的单个 {key,value} 相当于 matchExpressions 的一个元素，其键字段为“key”，运算符为“In”，values 数组仅包含“value”。要求是 ANDed。


