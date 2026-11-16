---
api_metadata:
  apiVersion: "admissionregistration.k8s.io/v1"
  import: "k8s.io/api/admissionregistration/v1"
  kind: "ParamKind"
content_type: "api_reference"
description: "ParamKind 是由 Group、Kind 和 Version 组成的元组。"
title: "ParamKind"
weight: 340
---

<!--
---
api_metadata:
  apiVersion: "admissionregistration.k8s.io/v1"
  import: "k8s.io/api/admissionregistration/v1"
  kind: "ParamKind"
content_type: "api_reference"
description: "ParamKind is a tuple of Group Kind and Version."
title: "ParamKind"
weight: 340
auto_generated: true
---
-->

`apiVersion: admissionregistration.k8s.io/v1`

`import "k8s.io/api/admissionregistration/v1"`


## ParamKind {#ParamKind}

<!--
ParamKind is a tuple of Group Kind and Version.
-->
ParamKind 是由 Group、Kind 和 Version 组成的元组。

<hr>

<table>
  <thead><tr><th><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
  <tbody>
    <tr>
      <td><code>apiVersion</code><br/><em>string</em></td>
      <td>
      <!--
      apiVersion is the API group version the resources belong to. In format of "group/version". Required.
      -->
      apiVersion 是资源所属的 API 组版本，格式为
      "group/version"。必填项。
      </td>
    </tr>
    <tr>
      <td><code>kind</code><br/><em>string</em></td>
      <td>
      <!--
      kind is the API kind the resources belong to. Required.
      -->
      kind 是资源所属的 API 类型。必填。
      </td>
    </tr>
  </tbody>
</table>

