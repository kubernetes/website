---
api_metadata:
  apiVersion: "admissionregistration.k8s.io/v1"
  import: "k8s.io/api/admissionregistration/v1"
  kind: "MatchCondition"
content_type: "api_reference"
description: "matchExpressions 是一组标签选择器要求。这些要求之间是“与”（AND）的关系。"
title: "MatchCondition"
weight: 230
---

<!--
api_metadata:
  apiVersion: "admissionregistration.k8s.io/v1"
  import: "k8s.io/api/admissionregistration/v1"
  kind: "MatchCondition"
content_type: "api_reference"
description: "matchExpressions is a list of label selector requirements. The requirements are ANDed."
title: "MatchCondition"
weight: 230
-->

`apiVersion: admissionregistration.k8s.io/v1`

`import "k8s.io/api/admissionregistration/v1"`


## MatchCondition {#MatchCondition}

<!--
MatchCondition represents a condition which must by fulfilled for a request to be sent to a webhook.
-->
matchExpressions 是一组标签选择器要求。这些要求之间是“与”（AND）的关系。

<hr>

<table>
  <thead><tr><th><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
  <tbody>
    <tr>
      <td><code>expression</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>
      <!--
      expression represents the expression which will be evaluated by CEL.
      Must evaluate to bool.
      CEL expressions have access to the contents of the AdmissionRequest and Authorizer,
      organized into CEL variables:  
      'object' - The object from the incoming request. The value is null for DELETE requests. 
      'oldObject' - The existing object. The value is null for CREATE requests. 
      'request' - Attributes of the admission request(/pkg/apis/admission/types.go#AdmissionRequest).
      'authorizer' - A CEL Authorizer. May be used to perform authorization checks for the principal
      (user or service account) of the request.   
      See https://pkg.go.dev/k8s.io/apiserver/pkg/cel/library#Authz
      'authorizer.requestResource' - A CEL ResourceCheck constructed from the 'authorizer'
      and configured with the   request resource.
      Documentation on CEL: https://kubernetes.io/docs/reference/using-api/cel/  Required.
      -->
      `expression` 表示将由 CEL 求值的表达式，
      其求值结果必须为布尔值（bool）。CEL 表达式可以访问
      `AdmissionRequest` 和 `Authorizer` 的内容，
      这些内容被组织为以下 CEL 变量：
      `object` - 传入请求中的对象（对于 DELETE 请求，该值为 null）；
      `oldObject` - 现有对象（对于 CREATE 请求，该值为 null）；
      `request` - 准入请求的属性（对应
      `/pkg/apis/admission/types.go#AdmissionRequest`）；
      `authorizer` - CEL 授权器（Authorizer），
      可用于对请求的主体（用户或服务账号）执行授权检查（详见 
      https://pkg.go.dev/k8s.io/apiserver/pkg/cel/library#Authz）；
      `authorizer.requestResource` - 基于 `authorizer`
      构建并配置了请求资源的 CEL 资源检查对象（ResourceCheck）。
      CEL 相关文档：
      https://kubernetes.io/zh-cn/docs/reference/using-api/cel/。
      此字段为必填项。
      </td>
    </tr>
    <tr>
      <td><code>name</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>
      <!--
      name is an identifier for this match condition,
      used for strategic merging of MatchConditions,
      as well as providing an identifier for logging purposes.
      A good name should be descriptive of the associated expression.
      Name must be a qualified name consisting of alphanumeric characters, '-', '_' or '.', 
      and must start and end with an alphanumeric character
      (e.g. 'MyName',  or 'my.name',  or '123-abc', regex used for validation is
      '([A-Za-z0-9][-A-Za-z0-9_.]*)?[A-Za-z0-9]') with an optional DNS subdomain prefix
      and '/' (e.g. 'example.com/MyName')  Required.
      -->
      name 是该匹配条件的标识符，用于 MatchConditions 的策略性合并以及日志记录。
      名称应能体现关联表达式的含义。此名称必须是合法的标识符，
      由字母数字字符、'-'、'_' 或 '.' 组成，且首尾字符必须为字母数字字符（例如
      'MyName'、'my.name' 或 '123-abc'；用于验证的正则表达式为
      '([A-Za-z0-9][-A-Za-z0-9_.]*)?[A-Za-z0-9]'），并可包含可选的 DNS
      子域名作为前缀及 '/' 分隔符（例如 'example.com/MyName'）。
      此字段为必填项。
      </td>
    </tr>
  </tbody>
</table>

