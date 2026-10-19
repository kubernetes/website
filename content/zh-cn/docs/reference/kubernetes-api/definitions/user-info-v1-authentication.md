---
api_metadata:
  apiVersion: "authentication.k8s.io/v1"
  import: "k8s.io/api/authentication/v1"
  kind: "UserInfo"
content_type: "api_reference"
description: "UserInfo 包含实现 `user.Info` 接口所需的用户信息。"
title: "UserInfo"
weight: 620
---
<!--
api_metadata:
  apiVersion: "authentication.k8s.io/v1"
  import: "k8s.io/api/authentication/v1"
  kind: "UserInfo"
content_type: "api_reference"
description: "UserInfo holds the information about the user needed to implement the user.Info interface."
title: "UserInfo"
weight: 620
-->

`apiVersion: authentication.k8s.io/v1`

`import "k8s.io/api/authentication/v1"`

## UserInfo {#UserInfo}

<!--
UserInfo holds the information about the user needed to implement the user.Info interface.
-->
UserInfo 包含实现 `user.Info` 接口所需的用户信息。

<hr>

<table>
  <thead><tr><th><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
  <tbody>
    <tr>
      <td><code>extra</code><br/><em>object</em></td>
      <td>
      <!--
      extra is any additional information provided by the authenticator.
      -->
      extra 是由认证器提供的任何附加信息。
      </td>
    </tr>
    <tr>
      <td><code>groups</code><br/><em>string array</em></td>
      <td>
      <!--
      groups is the names of groups this user is a part of.
      -->
      groups 是该用户所属群组的名称。
      </td>
    </tr>
    <tr>
      <td><code>uid</code><br/><em>string</em></td>
      <td>
      <!--
      uid is a unique value that identifies this user across time. If this user is deleted and another user by the same name is added, they will have different UIDs.    
      -->
      uid 是一个用于在不同时间段内唯一标识该用户的数值。
      如果该用户被删除，随后又添加了同名用户，这两个用户将拥有不同的 UID。
      </td>
    </tr>
    <tr>
      <td><code>username</code><br/><em>string</em></td>
      <td>
      <!--
      username is the name that uniquely identifies this user among all active users.
      -->
      username 是在所有活跃用户中唯一标识该用户的名称。
      </td>
    </tr>
  </tbody>
</table>
