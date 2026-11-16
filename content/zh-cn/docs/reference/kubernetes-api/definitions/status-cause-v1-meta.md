---
api_metadata:
  apiVersion: "meta/v1"
  import: "k8s.io/apimachinery/pkg/apis/meta/v1"
  kind: "StatusCause"
content_type: "api_reference"
description: "StatusCause 提供了关于 `api.Status` 失败的更多信息，包括遇到多个错误的情况。"
title: "StatusCause"
weight: 520
---

<!--
api_metadata:
  apiVersion: "meta/v1"
  import: "k8s.io/apimachinery/pkg/apis/meta/v1"
  kind: "StatusCause"
content_type: "api_reference"
description: "StatusCause provides more information about an api.Status failure, including cases when multiple errors are encountered."
title: "StatusCause"
weight: 520
auto_generated: true
-->

`apiVersion: meta/v1`

`import "k8s.io/apimachinery/pkg/apis/meta/v1"`


## StatusCause {#StatusCause}

<!--
StatusCause provides more information about an api.Status failure, including cases when multiple errors are encountered.
-->
StatusCause 提供了关于 `api.Status` 失败的更多信息，包括遇到多个错误的情况。

<hr>

<table>
  <thead><tr><th><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
  <tbody>
    <tr>
      <td><code>field</code><br/><em>string</em></td>
      <td>
      <!--
      The field of the resource that has caused this error, as named by its JSON serialization. May include dot and postfix notation for nested attributes. Arrays are zero-indexed.  Fields may appear more than once in an array of causes due to fields having multiple errors. Optional.  Examples:   "name" - the field "name" on the current resource   "items[0].name" - the field "name" on the first array entry in "items"
      -->
      导致此错误的资源字段名称（基于其 JSON 序列化形式）。
      对于嵌套属性，可使用点号（dot notation）和后缀表示法（postfix notation）。
      数组索引从 0 开始。若某字段存在多个错误，则该字段可能在错误原因列表中多次出现。
      可选字段。示例：
      "name" 表示当前资源上的 "name" 字段；
      "items[0].name" 表示 "items" 数组中第一个元素里的 "name" 字段。
      </td>
    </tr>
    <tr>
      <td><code>message</code><br/><em>string</em></td>
      <td>
      <!--
      A human-readable description of the cause of the error.  This field may be presented as-is to a reader.
      -->
      关于错误原因的人类可读描述。
      该字段可按原样呈现给读者。
      </td>
    </tr>
    <tr>
      <td><code>reason</code><br/><em>string</em></td>
      <td>
      <!--
      A machine-readable description of the cause of the error. If this value is empty there is no information available.
      -->
      错误原因的机器可读描述。如果该值为空，则无可用信息。
      </td>
    </tr>
  </tbody>
</table>
