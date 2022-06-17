---
api_metadata:
  apiVersion: ""
  import: "k8s.io/api/core/v1"
  kind: "NodeSelectorRequirement"
content_type: "api_reference"
description: "節點選擇器是要求包含鍵、值和關聯鍵和值的運算子的選擇器"
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
   節點選擇器是要求包含鍵、值和關聯鍵和值的運算子的選擇器。

<hr>

<!--
- **key** (string), required

  The label key that the selector applies to.
-->
- **key** (string), 必選

   選擇器適用的標籤鍵。

<!--
- **operator** (string), required

  Represents a key's relationship to a set of values. Valid operators are In, NotIn, Exists, DoesNotExist. Gt, and Lt.
-->
- **operator** (string), 必選

  表示鍵與一組值的關係的運算子。有效的運算子包括：In、NotIn、Exists、DoesNotExist、Gt 和 Lt。

<!--
- **values** ([]string)

  An array of string values. If the operator is In or NotIn, the values array must be non-empty. If the operator is Exists or DoesNotExist, the values array must be empty. If the operator is Gt or Lt, the values array must have a single element, which will be interpreted as an integer. This array is replaced during a strategic merge patch.
-->
- **values** ([]string)

   字串陣列。如果運算子為 In 或 NotIn，則陣列必須為非空。
   如果運算子為 Exists 或 DoesNotExist，則陣列必須為空。
   如果運算子為 Gt 或 Lt，則陣列必須有一個元素，該元素將被譯為整數。
   該陣列在合併計劃補丁時將被替換。


