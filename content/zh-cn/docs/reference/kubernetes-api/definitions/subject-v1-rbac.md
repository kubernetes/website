---
api_metadata:
  apiVersion: "rbac.authorization.k8s.io/v1"
  import: "k8s.io/api/rbac/v1"
  kind: "Subject"
content_type: "api_reference"
description: "Subject 包含对角色绑定所适用的对象或用户身份的引用。
  它可以是直接的 API 对象引用，也可以是针对非对象（如用户和组名称）的值。"
title: "Subject"
weight: 540
---

<!--
---
api_metadata:
  apiVersion: "rbac.authorization.k8s.io/v1"
  import: "k8s.io/api/rbac/v1"
  kind: "Subject"
content_type: "api_reference"
description: "Subject contains a reference to the object or user identities
  a role binding applies to. This can either hold a direct API object reference,
  or a value for non-objects such as user and group names."
title: "Subject"
weight: 540
---
-->

`apiVersion: rbac.authorization.k8s.io/v1`

`import "k8s.io/api/rbac/v1"`


## Subject {#Subject}

<!--
Subject contains a reference to the object
or user identities a role binding applies to. 
This can either hold a direct API object reference,
or a value for non-objects such as user and group names.
-->
Subject 包含对角色绑定所适用的对象或用户身份的引用。
它可以是直接的 API 对象引用，也可以是针对非对象（如用户和组名称）的值。

<hr>

<table>
  <thead><tr><th><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
  <tbody>
    <tr>
      <td><code>apiGroup</code><br/><em>string</em></td>
      <td>
      <!--
      APIGroup holds the API group of the referenced subject.
      Defaults to "" for ServiceAccount subjects.
      Defaults to "rbac.authorization.k8s.io" for User and Group subjects.
      -->
      apiGroup 包含所引用主体的 API 组。
      对于 ServiceAccount 主体，默认为 ""；
      对于 User 和 Group 主体，默认为
      "rbac.authorization.k8s.io"。
      </td>
    </tr>
    <tr>
      <td><code>kind</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>
      <!--
      Kind of object being referenced.
      Values defined by this API group are "User", "Group", and "ServiceAccount".
      If the Authorizer does not recognized the kind value,
      the Authorizer should report an error.
      -->
      所引用对象的类型。该 API 组定义的取值为 "User"、"Group"
      和 "ServiceAccount"。如果授权器（Authorizer）无法识别该类型值，
      则应报错。
      </td>
    </tr>
    <tr>
      <td><code>name</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>
      <!--
      Name of the object being referenced.
      -->
      所引用对象的名称。
      </td>
    </tr>
    <tr>
      <td><code>namespace</code><br/><em>string</em></td>
      <td>
      <!--
      Namespace of the referenced object. 
      If the object kind is non-namespace, such as "User" or "Group", 
      and this value is not empty the Authorizer should report an error.
      -->
      被引用对象的命名空间。如果对象类型属于非命名空间类型（例如
      "User" 或 "Group"）且该值非空，则授权器应报错。
      </td>
    </tr>
  </tbody>
</table>

