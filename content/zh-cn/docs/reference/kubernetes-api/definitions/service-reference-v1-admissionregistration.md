---
api_metadata:
  apiVersion: "admissionregistration.k8s.io/v1"
  import: "k8s.io/api/admissionregistration/v1"
  kind: "ServiceReference"
content_type: "api_reference"
description: "ServiceReference 持有对 Service.legacy.k8s.io 的引用。"
title: "ServiceReference"
weight: 490
---

<!--
api_metadata:
  apiVersion: "admissionregistration.k8s.io/v1"
  import: "k8s.io/api/admissionregistration/v1"
  kind: "ServiceReference"
content_type: "api_reference"
description: "ServiceReference holds a reference to Service.legacy.k8s.io"
title: "ServiceReference"
weight: 490
auto_generated: true
-->

`apiVersion: admissionregistration.k8s.io/v1`

`import "k8s.io/api/admissionregistration/v1"`

## ServiceReference {#ServiceReference}

<!--
ServiceReference holds a reference to Service.legacy.k8s.io
-->
ServiceReference 持有对 Service.legacy.k8s.io 的引用。

<hr>

<table>
  <thead><tr><th><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>
      <!--
      name is the name of the service. Required
      -->
      Service 的名称。必填。
      </td>
    </tr>
    <tr>
      <td><code>namespace</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>
      <!--
      namespace is the namespace of the service. Required
      -->
      Service 的命名空间。必填。
      </td>
    </tr>
    <tr>
      <td><code>path</code><br/><em>string</em></td>
      <td>
      <!--
      path is an optional URL path which will be sent in any request to this service.
      -->
      服务的可选 URL 路径。在任何请求中都会发送此路径。
      </td>
    </tr>
    <tr>
      <td><code>port</code><br/><em>integer</em></td>
      <td>
      <!--
      port is the port on the service that hosts the webhook. Default to 443 for backward compatibility. `port` should be a valid port number (1-65535, inclusive).
      -->
      服务上主机 Webhook 的端口。默认值为 443。`port` 必须是一个有效的端口号（1-65535，包括）。
      </td>
    </tr>
  </tbody>
</table>
