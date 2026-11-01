---
api_metadata:
  apiVersion: "meta/v1"
  import: "k8s.io/apimachinery/pkg/apis/meta/v1"
  kind: "ServerAddressByClientCIDR"
content_type: "api_reference"
description: "ServerAddressByClientCIDR 帮助客户端根据其匹配的 clientCIDR，确定应使用的服务器地址。"
title: "ServerAddressByClientCIDR"
weight: 480
---
<!--
api_metadata:
  apiVersion: "meta/v1"
  import: "k8s.io/apimachinery/pkg/apis/meta/v1"
  kind: "ServerAddressByClientCIDR"
content_type: "api_reference"
description: "ServerAddressByClientCIDR helps the client to determine the server address that they should use, depending on the clientCIDR that they match."
title: "ServerAddressByClientCIDR"
weight: 480
auto_generated: true
-->

`apiVersion: meta/v1`

`import "k8s.io/apimachinery/pkg/apis/meta/v1"`

## ServerAddressByClientCIDR {#ServerAddressByClientCIDR}

<!--
ServerAddressByClientCIDR helps the client to determine the server address that they should use, depending on the clientCIDR that they match.
-->
ServerAddressByClientCIDR 帮助客户端根据其匹配的 clientCIDR，确定应使用的服务器地址。

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>clientCIDR</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>
      <!--
      The CIDR with which clients can match their IP to figure out the server address that they should use.
      -->
      客户端可以匹配其 IP 地址以确定服务器地址的 CIDR。
      </td>
    </tr>
    <tr>
      <td><code>serverAddress</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>
      <!--
      Address of this server, suitable for a client that matches the above CIDR. This can be a hostname, hostname:port, IP or IP:port.
      -->
      此服务器的地址，适用于符合上述 CIDR 范围的客户端。该地址可以是 hostname、hostname:port、IP 或 IP:port。
      </td>
    </tr>
  </tbody>
</table>
