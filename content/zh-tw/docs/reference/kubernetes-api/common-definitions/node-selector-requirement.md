---
api_metadata:
  apiVersion: ""
  import: "k8s.io/api/core/v1"
  kind: "NodeSelectorRequirement"
content_type: "api_reference"
description: 節點選擇算符需求是一個選擇算符，其中包含值集、主鍵以及一個將鍵和值集關聯起來的操作符。
title: "NodeSelectorRequirement"
weight: 5
---

<!---
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

`import "k8s.io/api/core/v1"`

<!--
A node selector requirement is a selector that contains values, a key, and an operator that relates the key and values.
-->
節點選擇算符需求是一個選擇算符，其中包含值集、主鍵以及一個將鍵和值集關聯起來的操作符。

<hr>

<!--
- **key** (string), required

  The label key that the selector applies to.

- **operator** (string), required

  Represents a key's relationship to a set of values. Valid operators are In, NotIn, Exists, DoesNotExist. Gt, and Lt.
-->
- **key** (string)，必需

  選擇算符所適用的標籤主鍵。

- **operator** (string)，必需

  代表主鍵與值集之間的關係。合法的 operator 值包括 `In`、`NotIn`、`Exists`、`DoesNotExist`、`Gt` 和 `Lt`。

  <!--
  Possible enum values:
  -->
  
  可能的枚舉值：

   - `"DoesNotExist"`
   - `"Exists"`
   - `"Gt"`
   - `"In"`
   - `"Lt"`
   - `"NotIn"`
   
<!--
- **values** ([]string)

  *Atomic: will be replaced during a merge*

  An array of string values. If the operator is In or NotIn, the values array must be non-empty. If the operator is Exists or DoesNotExist, the values array must be empty. If the operator is Gt or Lt, the values array must have a single element, which will be interpreted as an integer. This array is replaced during a strategic merge patch.
-->
- **values** ([]string)

  **原子性：將在合併期間被替換**

  一個由字符串值組成的數組。如果 operator 是 `In` 或 `NotIn`，則 values 數組不能爲空。
  如果 operator 爲 `Exists` 或 `DoesNotExist`，則 values 數組只能爲空。
  如果 operator 爲 `Gt` 或 `Lt`，則 values 數組只能包含一個元素，並且該元素會被解釋爲整數。
  在執行策略性合併補丁操作時，此數組會被整體替換。
