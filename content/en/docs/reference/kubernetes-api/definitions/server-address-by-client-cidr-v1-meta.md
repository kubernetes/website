---
api_metadata:
  apiVersion: "meta/v1"
  import: "k8s.io/apimachinery/pkg/apis/meta/v1"
  kind: "ServerAddressByClientCIDR"
content_type: "api_reference"
description: "ServerAddressByClientCIDR helps the client to determine the server address that they should use, depending on the clientCIDR that they match."
title: "ServerAddressByClientCIDR"
weight: 480
auto_generated: true
---

<!--
The file is auto-generated from the Go source code of the component using a generic
[generator](https://github.com/kubernetes-sigs/reference-docs/). To learn how
to generate the reference documentation, please read
[Contributing to the reference documentation](/docs/contribute/generate-ref-docs/).
To update the reference content, please follow the
[Contributing upstream](/docs/contribute/generate-ref-docs/contribute-upstream/)
guide. You can file document formatting bugs against the
[reference-docs](https://github.com/kubernetes-sigs/reference-docs/) project.
-->

`apiVersion: meta/v1`

`import "k8s.io/apimachinery/pkg/apis/meta/v1"`


## ServerAddressByClientCIDR {#ServerAddressByClientCIDR}

ServerAddressByClientCIDR helps the client to determine the server address that they should use, depending on the clientCIDR that they match.

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>clientCIDR</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>The CIDR with which clients can match their IP to figure out the server address that they should use.</td>
    </tr>
    <tr>
      <td><code>serverAddress</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>Address of this server, suitable for a client that matches the above CIDR. This can be a hostname, hostname:port, IP or IP:port.</td>
    </tr>
  </tbody>
</table>









