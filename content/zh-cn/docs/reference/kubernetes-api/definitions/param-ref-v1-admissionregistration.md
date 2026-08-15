---
api_metadata:
  apiVersion: "admissionregistration.k8s.io/v1"
  import: "k8s.io/api/admissionregistration/v1"
  kind: "ParamRef"
content_type: "api_reference"
description: "ParamRef 描述了如何定位那些将用作输入参数的参数，这些参数用于策略绑定所应用的规则表达式。"
title: "ParamRef"
weight: 350
auto_generated: true
---

<!--
api_metadata:
  apiVersion: "admissionregistration.k8s.io/v1"
  import: "k8s.io/api/admissionregistration/v1"
  kind: "ParamRef"
content_type: "api_reference"
description: "ParamRef describes how to locate the params to be used as input to expressions of rules applied by a policy binding."
title: "ParamRef"
weight: 350
auto_generated: true
-->

`apiVersion: admissionregistration.k8s.io/v1`

`import "k8s.io/api/admissionregistration/v1"`


## ParamRef {#ParamRef}

<!--
ParamRef describes how to locate the params to be used as input to expressions of rules applied by a policy binding.
-->
ParamRef 描述了如何定位那些将用作输入参数的参数，这些参数用于策略绑定所应用的规则表达式。

<hr>

<table>
  <thead><tr><th><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code><br/><em>string</em></td>
      <td>
      <!--
      name is the name of the resource being referenced.  One of `name` or `selector` must be set, but `name` and `selector` are mutually exclusive properties. If one is set, the other must be unset.  A single parameter used for all admission requests can be configured by setting the `name` field, leaving `selector` blank, and setting namespace if `paramKind` is namespace-scoped.
      -->
      `name` 是所引用资源的名称。必须设置 `name` 或 `selector` 中的一项，
      但两者互斥；若设置了其中一项，则另一项必须留空。
      若要配置适用于所有准入请求的单一参数，
      可设置 `name` 字段并将 `selector` 留空；
      若 `paramKind` 属于命名空间作用域（namespace-scoped），则还需指定命名空间。
      </td>
    </tr>
    <tr>
      <td><code>namespace</code><br/><em>string</em></td>
      <td>
      <!--
      namespace is the namespace of the referenced resource. Allows limiting the search for params to a specific namespace. Applies to both `name` and `selector` fields.  A per-namespace parameter may be used by specifying a namespace-scoped `paramKind` in the policy and leaving this field empty.  - If `paramKind` is cluster-scoped, this field MUST be unset. Setting this field results in a configuration error.  - If `paramKind` is namespace-scoped, the namespace of the object being evaluated for admission will be used when this field is left unset. Take care that if this is left empty the binding must not match any cluster-scoped resources, which will result in an error.
      -->
      `namespace` 字段指定了所引用资源所在的命名空间，
      用于将参数（params）的查找范围限定在特定命名空间内。
      该字段适用于 `name` 和 `selector` 字段。
      若要在策略中使用特定命名空间的参数，可将 `paramKind`
      指定为命名空间作用域（namespace-scoped）的资源，并将此字段留空。
      - 如果 `paramKind` 为集群作用域（cluster-scoped），则不得设置此字段；
        设置该字段将导致配置错误。
      - 如果 `paramKind` 为命名空间作用域，且此字段留空，
        系统将使用待准入评估对象所属的命名空间。
      请注意，若此字段留空，绑定（binding）不得匹配任何集群作用域的资源，否则将导致错误。
      </td>
    </tr>
    <tr>
      <td><code>parameterNotFoundAction</code><br/><em>string</em></td>
      <td>
      <!--
      parameterNotFoundAction controls the behavior of the binding when the resource exists, and name or selector is valid, but there are no parameters matched by the binding. If the value is set to `Allow`, then no matched parameters will be treated as successful validation by the binding. If set to `Deny`, then no matched parameters will be subject to the `failurePolicy` of the policy.  Allowed values are `Allow` or `Deny`  Required
      -->
      `parameterNotFoundAction` 用于控制当资源存在且名称或选择器有效，
      但绑定未匹配到任何参数时的行为。如果该值设置为 `Allow`，
      则未匹配到参数的情况将被视为绑定验证成功；
      如果设置为 `Deny`，则未匹配到参数的情况将触发该策略的 `failurePolicy`。
      可选值为 `Allow` 或 `Deny`（必填）。
      </td>
    </tr>
    <tr>
      <td><code>selector</code><br/><em><a href="{{< ref "label-selector-v1-meta#LabelSelector" >}}">LabelSelector</a></em></td>
      <td>
      <!--
      selector can be used to match multiple param objects based on their labels. Supply selector: {} to match all resources of the ParamKind.  If multiple params are found, they are all evaluated with the policy expressions and the results are ANDed together.  One of `name` or `selector` must be set, but `name` and `selector` are mutually exclusive properties. If one is set, the other must be unset.
      -->
      可以使用 `selector` 根据标签匹配多个 `param` 对象。若指定 `selector: {}`，
      则会匹配 `ParamKind` 对应的所有资源。如果匹配到多个 `param` 对象，
      系统将针对每个对象评估策略表达式，并将评估结果进行“与”（AND）运算。
      `name` 和 `selector` 必须设置其中之一，但两者互斥；
      若设置了其中一个，则另一个必须留空。
      </td>
    </tr>
  </tbody>
</table>
