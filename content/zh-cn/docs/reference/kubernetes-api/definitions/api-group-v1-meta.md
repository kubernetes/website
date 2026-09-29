---
api_metadata:
  apiVersion: "meta/v1"
  import: "k8s.io/apimachinery/pkg/apis/meta/v1"
  kind: "APIGroup"
content_type: "api_reference"
description: "APIGroup 包含组的名称、支持的版本以及首选版本。"
title: "APIGroup"
weight: 20
auto_generated: true
---
<!--
api_metadata:
  apiVersion: "meta/v1"
  import: "k8s.io/apimachinery/pkg/apis/meta/v1"
  kind: "APIGroup"
content_type: "api_reference"
description: "APIGroup contains the name, the supported versions, and the preferred version of a group."
title: "APIGroup"
weight: 20
auto_generated: true
-->

`apiVersion: meta/v1`

`import "k8s.io/apimachinery/pkg/apis/meta/v1"`

## APIGroup {#APIGroup}

<!--
APIGroup contains the name, the supported versions, and the preferred version of a group.
-->
APIGroup 包含组的名称、支持的版本以及首选版本。

<hr>

<table>
  <thead><tr><th><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
  <tbody>
    <tr>
      <td><code>apiVersion</code><br/><em>string</em></td>
      <td>
      <!--
      APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources
      -->
      apiVersion 定义了对象这种表示形式的带版本模式。服务器应将已识别的模式转换为最新的内部值，
      并可以拒绝未识别的值。更多信息：
      https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources
      </td>
    </tr>
    <tr>
      <td><code>kind</code><br/><em>string</em></td>
      <td>
      <!--
      Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds      
      -->
      APIVerver 定义了对象这种表示形式的带版本模式。服务器应将已识别的模式转换为最新的内部值，
      并可以拒绝未识别的值。更多信息：
      https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources
      </td>
    </tr>
    <tr>
      <td><code>name</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>
      <!--
      name is the name of the group.    
      -->
      name 是该组的名称。
      </td>
    </tr>
    <tr>
      <td><code>preferredVersion</code><br/><em><a href="{{< ref "group-version-for-discovery-v1-meta#GroupVersionForDiscovery" >}}">GroupVersionForDiscovery</a></em></td>
      <td>
      <!--
      preferredVersion is the version preferred by the API server, which probably is the storage version.
      -->
      preferredVersion 是 API 服务器首选的版本，通常也是存储版本。
      </td>
    </tr>
    <tr>
      <td><code>serverAddressByClientCIDRs</code><br/><em><a href="{{< ref "server-address-by-client-cidr-v1-meta#ServerAddressByClientCIDR" >}}">ServerAddressByClientCIDR array</a></em></td>
      <td>
      <!--
      a map of client CIDR to server address that is serving this group. This is to help clients reach servers in the most network-efficient way possible. Clients can use the appropriate server address as per the CIDR that they match. In case of multiple matches, clients should use the longest matching CIDR. The server returns only those CIDRs that it thinks that the client can match. For example: the master will return an internal IP CIDR only, if the client reaches the server using an internal IP. Server looks at X-Forwarded-For header or X-Real-Ip header or request.RemoteAddr (in that order) to get the client IP.
      -->
      一个由客户端 CIDR 映射到服务器地址的映射表，这些服务器正为该组提供服务。
      这是为了帮助客户端以网络效率最高的方式访问服务器。客户端可以根据其所匹配的 CIDR，
      使用相应的服务器地址。在存在多个匹配项的情况下，客户端应使用前缀最长的那条 CIDR。
      服务器仅返回它认为客户端能够匹配的 CIDR。例如：只有当客户端使用内部 IP 访问服务器时，
      主控节点才会返回内部 IP 段的 CIDR。服务器按顺序查看 `X-Forwarded-For` 头、`X-Real-Ip`
      头或 `request.RemoteAddr` 来获取客户端 IP。
      </td>
    </tr>
    <tr>
      <td><code>versions</code>&nbsp;<strong>*</strong><br/><em><a href="{{< ref "group-version-for-discovery-v1-meta#GroupVersionForDiscovery" >}}">GroupVersionForDiscovery array</a></em></td>
      <td>
      <!--
      versions are the versions supported in this group.
      -->
      versions 是该组支持的版本。
      </td>
    </tr>
  </tbody>
</table>


## APIGroupList {#APIGroupList}

<!--
APIGroupList is a list of APIGroup, to allow clients to discover the API at /apis.
-->
APIGroupList 是 APIGroup 的列表，用于允许客户端发现 `/apis` 路径下的 API。

<hr>

<table>
 <thead><tr><th><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
  <tbody>
    <tr>
      <td><code>apiVersion</code><br/><em>string</em></td>
      <td>
      <!--
      APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources
      -->
      apiVersion 定义了对象这种表示形式的带版本模式。服务器应将已识别的模式转换为最新的内部值，
      并可以拒绝未识别的值。更多信息：
      https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources
      </td>
    </tr>
    <tr>
      <td><code>groups</code>&nbsp;<strong>*</strong><br/><em><a href="{{< ref "api-group-v1-meta#APIGroup" >}}">APIGroup array</a></em></td>
      <td>
      <!--
      groups is a list of APIGroup.
      -->
      groups 是 APIGroup 的列表。
      </td>
    </tr>
    <tr>
      <td><code>kind</code><br/><em>string</em></td>
      <td>
      <!--
      Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds
      -->
      kind 是一个字符串值，表示对象代表的 REST 资源。
      服务器可能会根据客户端提交的请求端点来推断此值，不能被更新。驼峰命名法。更多信息：
      https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds
      </td>
    </tr>
  </tbody>
</table>
