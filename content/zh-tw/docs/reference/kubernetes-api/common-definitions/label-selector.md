---
api_metadata:
  apiVersion: ""
  import: "k8s.io/apimachinery/pkg/apis/meta/v1"
  kind: "LabelSelector"
content_type: "api_reference"
description: "標籤選擇器是對一組資源的標籤查詢。"
title: "LabelSelector"
weight: 2
auto_generated: true
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
-->

`import "k8s.io/apimachinery/pkg/apis/meta/v1"`

<!-- 
A label selector is a label query over a set of resources. The result of matchLabels and matchExpressions are ANDed. An empty label selector matches all objects. A null label selector matches no objects.
-->

標籤選擇器是對一組資源的標籤查詢。

`matchLabels` 和 `matchExpressions` 的結果按邏輯與的關係組合。
一個 `empty` 標籤選擇器匹配所有物件。一個 `null` 標籤選擇器不匹配任何物件。

<hr>

  <!--
   - **matchExpressions** ([]LabelSelectorRequirement)
   
   matchExpressions is a list of label selector requirements. The requirements are ANDed. 
   
   <a name="LabelSelectorRequirement"></a> 
  *A label selector requirement is a selector that contains values, a key, and an operator that relates the key and values.*
  -->

- **matchExpressions** ([]LabelSelectorRequirement)
  
   `matchExpressions` 是標籤選擇器要求的列表，這些要求的結果按邏輯與的關係來計算。
   
   <a name="LabelSelectorRequirement"></a> 
   *標籤選擇器要求是包含值、鍵和關聯鍵和值的運算子的選擇器。*
 
    <!-- 
       - **matchExpressions.key** (string), required
       *Patch strategy: merge on key `key`* 
       key is the label key that the selector applies to.
    -->

  - **matchExpressions.key** (string)， 必填

    *補丁策略：按照鍵 `key` 合併*    
    
    `key` 是選擇器應用的標籤鍵。
  
   <!-- 
       - **matchExpressions.operator** (string), required
       operator represents a key's relationship to a set of values. Valid operators are In, NotIn, Exists and DoesNotExist.        
   -->
   
  - **matchExpressions.operator** (string)，必填
 
    `operator` 表示鍵與一組值的關係。有效的運算子包括 `In`、`NotIn`、`Exists` 和 `DoesNotExist`。
    
  <!--
  - **matchExpressions.values** ([]string)

    values is an array of string values. If the operator is In or NotIn, the values array must be non-empty. If the operator is Exists or DoesNotExist, the values array must be empty. This array is replaced during a strategic merge patch.
  -->
   
  - **matchExpressions.values** ([]string)
  
    `values` 是一個字串值陣列。如果運算子為 `In` 或 `NotIn`，則 `values` 陣列必須為非空。
    
    如果運算子是 `Exists` 或 `DoesNotExist`，則 `values` 陣列必須為空。
    
    該陣列在策略性合併補丁（Strategic Merge Patch）期間被替換。
  
<!--
- **matchLabels** (map[string]string)

  matchLabels is a map of {key,value} pairs. A single {key,value} in the matchLabels map is equivalent to an element of matchExpressions, whose key field is "key", the operator is "In", and the values array contains only "value". The requirements are ANDed.
-->
  
 - **matchLabels** (map[string]string)
  
    `matchLabels` 是 {`key`,`value`} 鍵值對的對映。
    
    `matchLabels` 對映中的單個 {`key`,`value`} 鍵值對相當於 `matchExpressions` 的一個元素，其鍵欄位為 `key`，運算子為 `In`，`values` 陣列僅包含 `value`。
    
    所表達的需求最終要按邏輯與的關係組合。
   





