---
api_metadata:
  apiVersion: ""
  import: "k8s.io/api/core/v1"
  kind: "NodeSelectorRequirement"
content_type: "api_reference"
description: "节点选择器是要求包含键、值和关联键和值的运算符的选择器"
title: "NodeSelectorRequirement"
weight: 5
auto_generated: true
---
<!--
api_metadata:
  apiVersion: ""
  import: "k8s.io/api/core/v1"
  kind: "NodeSelectorRequirement"
content_type: "api_reference"
description: "A node selector requirement is a selector that contains values, a key, and an operator that relates the key and values."
title: "NodeSelectorRequirement"
weight: 5
auto_generated: true
-->

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



`import "k8s.io/api/core/v1"`


<!--
A node selector requirement is a selector that contains values, a key, and an operator that relates the key and values.
-->
   节点选择器是要求包含键、值和关联键和值的运算符的选择器。

<hr>

<!--
- **key** (string), required

  The label key that the selector applies to.
-->
- **key** (string), 必选

   选择器适用的标签键。

<!--
- **operator** (string), required

  Represents a key's relationship to a set of values. Valid operators are In, NotIn, Exists, DoesNotExist. Gt, and Lt.
-->
- **operator** (string), 必选

  表示键与一组值的关系的运算符。有效的运算符包括：In、NotIn、Exists、DoesNotExist、Gt 和 Lt。

<!--
- **values** ([]string)

  An array of string values. If the operator is In or NotIn, the values array must be non-empty. If the operator is Exists or DoesNotExist, the values array must be empty. If the operator is Gt or Lt, the values array must have a single element, which will be interpreted as an integer. This array is replaced during a strategic merge patch.
-->
- **values** ([]string)

   字符串数组。如果运算符为 In 或 NotIn，则数组必须为非空。
   如果运算符为 Exists 或 DoesNotExist，则数组必须为空。
   如果运算符为 Gt 或 Lt，则数组必须有一个元素，该元素将被译为整数。
   该数组在合并计划补丁时将被替换。


