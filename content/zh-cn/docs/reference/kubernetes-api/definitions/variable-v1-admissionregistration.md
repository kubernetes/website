---
api_metadata:
  apiVersion: "admissionregistration.k8s.io/v1"
  import: "k8s.io/api/admissionregistration/v1"
  kind: "Variable"
content_type: "api_reference"
description: "Variable 是指用于组合的变量定义；Variable 被定义为一种具名表达式。"
title: "Variable"
weight: 630
---

<!--
api_metadata:
  apiVersion: "admissionregistration.k8s.io/v1"
  import: "k8s.io/api/admissionregistration/v1"
  kind: "Variable"
content_type: "api_reference"
description: "Variable is the definition of a variable that is used for composition. A variable is defined as a named expression."
title: "Variable"
weight: 630
auto_generated: true
-->

`apiVersion: admissionregistration.k8s.io/v1`

`import "k8s.io/api/admissionregistration/v1"`

## Variable {#Variable}

<!--
Variable is the definition of a variable that is used for composition. A variable is defined as a named expression.
-->
Variable 是指用于组合的变量定义；Variable 被定义为一种具名表达式。

<hr>

<table>
  <thead><tr><th><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
  <tbody>
    <tr>
      <td><code>expression</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>
      <!--
      expression is the expression that will be evaluated as the value of the variable. The CEL expression has access to the same identifiers as the CEL expressions in Validation.
      -->
      expression 是将被求值并作为变量值的表达式。
      该 CEL 表达式可以访问与“验证”（Validation）中的 CEL 表达式相同的标识符。
      </td>
    </tr>
    <tr>
      <td><code>name</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>
      <!--
      name is the name of the variable. The name must be a valid CEL identifier and unique among all variables. The variable can be accessed in other expressions through `variables` For example, if name is "foo", the variable will be available as `variables.foo`
      -->
      name 是变量的名称。该名称必须是合法的 CEL 标识符，且在所有变量中必须唯一。
      该变量可在其他表达式中通过 `variables` 进行访问；
      例如，如果名称为 "foo"，则该变量可通过 `variables.foo` 访问。
      </td>
    </tr>
  </tbody>
</table>
