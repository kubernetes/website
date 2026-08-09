---
api_metadata:
  apiVersion: "authorization.k8s.io/v1"
  import: "k8s.io/api/authorization/v1"
  kind: "NonResourceAttributes"
content_type: "api_reference"
description: "NonResourceAttributes 包含了可供授权器（Authorizer）接口用于非资源请求的授权属性。"
title: "NonResourceAttributes"
weight: 290
---

<!--
api_metadata:
  apiVersion: "authorization.k8s.io/v1"
  import: "k8s.io/api/authorization/v1"
  kind: "NonResourceAttributes"
content_type: "api_reference"
description: "NonResourceAttributes includes the authorization attributes available for non-resource requests to the Authorizer interface"
title: "NonResourceAttributes"
weight: 290
auto_generated: true
-->

`apiVersion: authorization.k8s.io/v1`

`import "k8s.io/api/authorization/v1"`


## NonResourceAttributes {#NonResourceAttributes}

<!--
NonResourceAttributes includes the authorization attributes available for non-resource requests to the Authorizer interface
-->
NonResourceAttributes 包含了可供授权器（Authorizer）接口用于非资源请求的授权属性。

<hr>

<table>
  <thead><tr><th><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
  <tbody>
    <tr>
      <td><code>path</code><br/><em>string</em></td>
      <td>
      <!--
      path is the URL path of the request
      -->
      path 是请求的 URL 路径
      </td>
    </tr>
    <tr>
      <td><code>verb</code><br/><em>string</em></td>
      <td>
      <!--
      verb is the standard HTTP verb
      -->
      verb 是标准的 HTTP 动词
      </td>
    </tr>
  </tbody>
</table>
