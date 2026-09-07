---
api_metadata:
  apiVersion: "rbac.authorization.k8s.io/v1"
  import: "k8s.io/api/rbac/v1"
  kind: "PolicyRule"
content_type: "api_reference"
description: "PolicyRule 包含描述策略规则的信息，但不包含关于该规则适用于哪些对象或适用于哪个命名空间的信息。"
title: "PolicyRule"
weight: 370
---

<!--
api_metadata:
  apiVersion: "rbac.authorization.k8s.io/v1"
  import: "k8s.io/api/rbac/v1"
  kind: "PolicyRule"
content_type: "api_reference"
description: "PolicyRule holds information that describes a policy rule, but does not contain information about who the rule applies to or which namespace the rule applies to."
title: "PolicyRule"
weight: 370
auto_generated: true
-->

`apiVersion: rbac.authorization.k8s.io/v1`

`import "k8s.io/api/rbac/v1"`


## PolicyRule {#PolicyRule}

<!--
PolicyRule holds information that describes a policy rule, but does not contain information about who the rule applies to or which namespace the rule applies to.
-->
PolicyRule 包含描述策略规则的信息，但不包含关于该规则适用于哪些对象或适用于哪个命名空间的信息。

<hr>

<table>
  <thead><tr><th><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
  <tbody>
    <tr>
      <td><code>apiGroups</code><br/><em>string array</em></td>
      <td>
      <!--
      APIGroups is the name of the APIGroup that contains the resources.  If multiple API groups are specified, any action requested against one of the enumerated resources in any API group will be allowed. "" represents the core API group and "*" represents all API groups.
      -->
      apiGroups 是包含相关资源的 API 组的名称。如果指定了多个 API 组，
      则针对其中任一 API 组内所列资源发起的任何操作请求都将被允许。
      "" 表示核心 API 组，"*" 表示所有 API 组。
      </td>
    </tr>
    <tr>
      <td><code>nonResourceURLs</code><br/><em>string array</em></td>
      <td>
      <!--
      NonResourceURLs is a set of partial urls that a user should have access to. 
      *s are allowed, but only as the full, final step in the path Since non-resource URLs are not namespaced,
      this field is only applicable for ClusterRoles referenced from a ClusterRoleBinding.
      Rules can either apply to API resources (such as "pods" or "secrets") or non-resource URL paths (such as "/api"),  but not both.
      -->
      nonResourceURLs 是一组用户应有权访问的部分 URL。
      允许使用通配符 "*"，但仅限于路径的最后一段。由于非资源 URL 不区分命名空间，
      该字段仅适用于由 ClusterRoleBinding 引用的 ClusterRole。
      规则既可以针对 API 资源（如 "pods" 或 "secrets"），也可以针对非资源 URL 路径（如 "/api"），
      但不能同时针对两者。
      </td>
    </tr>
    <tr>
      <td><code>resourceNames</code><br/><em>string array</em></td>
      <td>
      <!--
      ResourceNames is an optional white list of names that the rule applies to.
      An empty set means that everything is allowed.
      -->
      resourceNames 是一个可选的名称白名单，用于指定该规则适用的对象；
      若该集合为空，则表示允许所有对象。
      </td>
    </tr>
    <tr>
      <td><code>resources</code><br/><em>string array</em></td>
      <td>
      <!--
      Resources is a list of resources this rule applies to. '\*' represents all resources.
      -->
      resources 是该规则适用的资源列表。"*" 代表所有资源。
      </td>
    </tr>
    <tr>
      <td><code>verbs</code>&nbsp;<strong>*</strong><br/><em>string array</em></td>
      <td>
      <!--
      Verbs is a list of Verbs that apply to ALL the ResourceKinds contained in this rule.
      '\*' represents all verbs.
      -->
      verbs 是一个动词列表，适用于该规则中包含的所有 ResourceKind。
      其中，"*" 代表所有动词。
      </td>
    </tr>
  </tbody>
</table>

