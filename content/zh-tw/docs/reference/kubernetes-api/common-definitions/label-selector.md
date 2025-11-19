---
api_metadata:
  apiVersion: ""
  import: "k8s.io/apimachinery/pkg/apis/meta/v1"
  kind: "LabelSelector"
content_type: "api_reference"
description: "標籤選擇算符是對一組資源的標籤查詢。"
title: "LabelSelector"
weight: 2
---
<!--
api_metadata:
  apiVersion: ""
  import: "k8s.io/apimachinery/pkg/apis/meta/v1"
  kind: "LabelSelector"
content_type: "api_reference"
description: "A label selector is a label query over a set of resources."
title: "LabelSelector"
weight: 2
auto_generated: true
-->

`import "k8s.io/apimachinery/pkg/apis/meta/v1"`

<!-- 
A label selector is a label query over a set of resources. The result of matchLabels and matchExpressions are ANDed. An empty label selector matches all objects. A null label selector matches no objects.
-->
標籤選擇算符是對一組資源的標籤查詢。
`matchLabels` 和 `matchExpressions` 的結果按邏輯與的關係組合。
一個 `empty` 標籤選擇算符匹配所有對象。一個 `null` 標籤選擇算符不匹配任何對象。

<hr>

<!--
- **matchExpressions** ([]LabelSelectorRequirement)

  *Atomic: will be replaced during a merge*

  matchExpressions is a list of label selector requirements. The requirements are ANDed.

  <a name="LabelSelectorRequirement"></a>
  *A label selector requirement is a selector that contains values, a key, and an operator that relates the key and values.*
-->
- **matchExpressions** ([]LabelSelectorRequirement)
  
  **原子性：將在合併期間被替換**

  `matchExpressions` 是標籤選擇算符要求的列表，這些要求的結果按邏輯與的關係來計算。
   
  <a name="LabelSelectorRequirement"></a> 
  **標籤選擇算符要求是包含值、鍵和關聯鍵和值的運算符的選擇算符。**
 
  <!-- 
  - **matchExpressions.key** (string), required

    key is the label key that the selector applies to.
  -->

  - **matchExpressions.key** (string)，必需
    
    `key` 是選擇算符應用的標籤鍵。
  
  <!-- 
  - **matchExpressions.operator** (string), required

    operator represents a key's relationship to a set of values. Valid operators are In, NotIn, Exists and DoesNotExist.        
  -->
   
  - **matchExpressions.operator** (string)，必需
 
    `operator` 表示鍵與一組值的關係。有效的運算符包括 `In`、`NotIn`、`Exists` 和 `DoesNotExist`。
    
  <!--
  - **matchExpressions.values** ([]string)

    *Atomic: will be replaced during a merge*

    values is an array of string values. If the operator is In or NotIn, the values array must be non-empty. If the operator is Exists or DoesNotExist, the values array must be empty. This array is replaced during a strategic merge patch.
  -->
   
  - **matchExpressions.values** ([]string)
  
    **原子性：將在合併期間被替換**

    `values` 是一個字符串值數組。如果運算符爲 `In` 或 `NotIn`，則 `values` 數組必須爲非空。
    如果運算符是 `Exists` 或 `DoesNotExist`，則 `values` 數組必須爲空。
    該數組在策略性合併補丁（Strategic Merge Patch）期間被替換。
  
<!--
- **matchLabels** (map[string]string)

  matchLabels is a map of {key,value} pairs. A single {key,value} in the matchLabels map is equivalent to an element of matchExpressions, whose key field is "key", the operator is "In", and the values array contains only "value". The requirements are ANDed.
-->
- **matchLabels** (map[string]string)
  
  `matchLabels` 是 {`key`,`value`} 鍵值對的映射。

  `matchLabels` 映射中的單個 {`key`,`value`} 鍵值對相當於 `matchExpressions` 的一個元素，
  其鍵字段爲 `key`，運算符爲 `In`，`values` 數組僅包含 `value`。

  所表達的需求最終要按邏輯與的關係組合。
