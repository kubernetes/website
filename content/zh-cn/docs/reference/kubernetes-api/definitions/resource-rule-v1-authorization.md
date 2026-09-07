---
api_metadata:
  apiVersion: "authorization.k8s.io/v1"
  import: "k8s.io/api/authorization/v1"
  kind: "ResourceRule"
content_type: "api_reference"
description: "ResourceRule 是主体被允许对资源执行的操作列表。
  该列表的顺序无关紧要，可能包含重复项，也可能不完整。"
title: "ResourceRule"
weight: 410
---

<!--
---
api_metadata:
  apiVersion: "authorization.k8s.io/v1"
  import: "k8s.io/api/authorization/v1"
  kind: "ResourceRule"
content_type: "api_reference"
description: "ResourceRule is the list of actions the subject is allowed to perform on resources. 
  The list ordering isn&#39;t significant, may contain duplicates, and possibly be incomplete."
title: "ResourceRule"
weight: 410
auto_generated: true
---
-->

`apiVersion: authorization.k8s.io/v1`

`import "k8s.io/api/authorization/v1"`


## ResourceRule {#ResourceRule}

<!--
ResourceRule is the list of actions the subject is allowed to perform on resources. 
The list ordering isn&#39;t significant, may contain duplicates, and possibly be incomplete.
-->
ResourceRule 是主体被允许对资源执行的操作列表。
该列表的顺序无关紧要，可能包含重复项，也可能不完整。

<hr>

<table>
  <thead><tr><th><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
  <tbody>
    <tr>
      <td><code>apiGroups</code><br/><em>string array</em></td>
      <td>
      <!--
      apiGroups is the name of the APIGroup that contains the resources.  
      If multiple API groups are specified, any action requested against 
      one of the enumerated resources in any API group will be allowed.  
      "*" means all.
      -->
      apiGroups 是包含相关资源的 API 组名称。
      如果指定了多个 API 组，则针对其中任一 API 组内所列资源发起的任何操作请求都将被允许。
      其中，"*" 表示所有。
      </td>
    </tr>
    <tr>
      <td><code>resourceNames</code><br/><em>string array</em></td>
      <td>
      <!--
      resourceNames is an optional white list of names that the rule applies to.  
      An empty set means that everything is allowed.  "*" means all.
      -->
      resourceNames 是一个可选的名称白名单，用于指定该规则适用的对象。
      若该集合为空，则表示允许所有对象；"*" 表示所有对象。
      </td>
    </tr>
    <tr>
      <td><code>resources</code><br/><em>string array</em></td>
      <td>
      <!--
      resources is a list of resources this rule applies to.  
      "*" means all in the specified apiGroups.  
      "*/foo" represents the subresource 'foo' for all resources 
      in the specified apiGroups.
      -->
      resources 是此规则适用的资源列表。
      "*"  表示指定 apiGroups 中的所有资源。"*/foo" 表示指定 apiGroups
      中所有资源的子资源 "foo"。
      </td>
    </tr>
    <tr>
      <td><code>verbs</code>&nbsp;<strong>*</strong><br/><em>string array</em></td>
      <td>
      <!--
      verbs is a list of kubernetes resource API verbs, 
      like: get, list, watch, create, update, delete, proxy.  
      "*" means all.
      -->
      verbs 是 Kubernetes 资源 API 动词的列表，例如：
      get、list、watch、create、update、delete、proxy。
      其中 "*" 表示所有动词。
      </td>
    </tr>
  </tbody>
</table>

