---
api_metadata:
  apiVersion: "meta/v1"
  import: "k8s.io/apimachinery/pkg/apis/meta/v1"
  kind: "APIVersions"
content_type: "api_reference"
description: "apiVersions 列出了可用的版本，以便客户端能够发现位于
  `/api`（即旧版 v1 API 的根路径）处的 API。"
title: "APIVersions"
weight: 40
---

<!--
api_metadata:
  apiVersion: "meta/v1"
  import: "k8s.io/apimachinery/pkg/apis/meta/v1"
  kind: "APIVersions"
content_type: "api_reference"
description: "APIVersions lists the versions that are available, to allow clients to discover the API at /api, which is the root path of the legacy v1 API."
title: "APIVersions"
weight: 40
auto_generated: true
-->

`apiVersion: meta/v1`

`import "k8s.io/apimachinery/pkg/apis/meta/v1"`


## APIVersions {#APIVersions}

<!--
APIVersions lists the versions that are available, to allow clients to discover the API at /api, which is the root path of the legacy v1 API.
-->
apiVersions 列出了可用的版本，以便客户端能够发现位于
`/api`（即旧版 v1 API 的根路径）处的 API。

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
      apiVersions 定义了该对象表示形式的版本化模式（schema）。
      服务器应将已识别的模式转换为最新的内部值，并可拒绝无法识别的值。
      更多信息：
      https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources
      </td>
    </tr>
    <tr>
      <td><code>kind</code><br/><em>string</em></td>
      <td>
      <!--
      Kind is a string value representing the REST resource this object represents.
      Servers may infer this from the endpoint the client submits requests to.
      Cannot be updated. In CamelCase. More info:
      https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds
      -->
      kind 是一个字符串值，用于标识该对象所代表的 REST 资源。
      服务器可以根据客户端提交请求的端点推断出该值。
      该字段不可更新。采用驼峰命名法（CamelCase）。
      更多信息请参阅：
      https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds
      </td>
    </tr>
    <tr>
      <td><code>serverAddressByClientCIDRs</code>&nbsp;<strong>*</strong><br/><em><a href="{{< ref "server-address-by-client-cidr-v1-meta#ServerAddressByClientCIDR" >}}">ServerAddressByClientCIDR array</a></em></td>
      <td>
      <!--
      a map of client CIDR to server address that is serving this group.
      This is to help clients reach servers in the most network-efficient way possible.
      Clients can use the appropriate server address as per the CIDR that they match.
      In case of multiple matches, clients should use the longest matching CIDR.
      The server returns only those CIDRs that it thinks that the client can match.
      For example: the master will return an internal IP CIDR only, if the client reaches the server using an internal IP.
      Server looks at X-Forwarded-For header or X-Real-Ip header or request.RemoteAddr (in that order) to get the client IP.
      -->
      这是一个将客户端 CIDR 映射到负责该组服务的服务器地址的映射表，
      旨在帮助客户端以网络效率最高的方式连接到服务器。客户端可根据自身匹配的
      CIDR 选择相应的服务器地址；若存在多个匹配项，客户端应使用最长匹配的 CIDR。
      服务器仅返回其判定为客户端能够匹配的 CIDR。例如：如果客户端通过内部 IP 访问服务器，
      主节点（master）将仅返回内部 IP CIDR。服务器按以下顺序检查请求头或属性以获取客户端
      IP：`X-Forwarded-For` 头部、`X-Real-Ip` 头部或 `request.RemoteAddr`。
      </td>
    </tr>
    <tr>
      <td><code>versions</code>&nbsp;<strong>*</strong><br/><em>string array</em></td>
      <td>
      <!--
      versions are the api versions that are available.
      -->
      versions 是可用的 API 版本。
      </td>
    </tr>
  </tbody>
</table>
