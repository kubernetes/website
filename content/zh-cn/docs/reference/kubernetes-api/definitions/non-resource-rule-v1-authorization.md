---
api_metadata:
  apiVersion: "authorization.k8s.io/v1"
  import: "k8s.io/api/authorization/v1"
  kind: "NonResourceRule"
content_type: "api_reference"
description: "NonResourceRule 包含描述非资源规则的信息。"
title: "NonResourceRule"
weight: 300
---

<!--
api_metadata:
  apiVersion: "authorization.k8s.io/v1"
  import: "k8s.io/api/authorization/v1"
  kind: "NonResourceRule"
content_type: "api_reference"
description: "NonResourceRule holds information that describes a rule for the non-resource"
title: "NonResourceRule"
weight: 300
auto_generated: true
-->

`apiVersion: authorization.k8s.io/v1`

`import "k8s.io/api/authorization/v1"`


## NonResourceRule {#NonResourceRule}

<!--
NonResourceRule holds information that describes a rule for the non-resource
-->
NonResourceRule 包含描述非资源规则的信息。

<hr>

<table>
  <thead><tr><th><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
  <tbody>
    <tr>
      <td><code>nonResourceURLs</code><br/><em>string array</em></td>
      <td>
      <!--
      nonResourceURLs is a set of partial urls that a user should have access to.  *s are allowed, but only as the full, final step in the path.  "*" means all.
      -->
      nonResourceURLs 是一组用户应有权访问的部分 URL。允许使用 "*"，但仅限于作为路径的完整末尾部分；"*" 表示所有动词。
      </td>
    </tr>
    <tr>
      <td><code>verbs</code>&nbsp;<strong>*</strong><br/><em>string array</em></td>
      <td>
      <!--
      verbs is a list of kubernetes non-resource API verbs, like: get, post, put, delete, patch, head, options.  "*" means all.
      -->
      verbs 是 Kubernetes 非资源 API 动词的列表，例如：get、post、put、delete、patch、head、options。其中 "*" 表示所有动词。
      </td>
    </tr>
  </tbody>
</table>
