---
api_metadata:
  apiVersion: "meta/v1"
  import: "k8s.io/apimachinery/pkg/apis/meta/v1"
  kind: "APIVersions"
content_type: "api_reference"
description: "APIVersions перелічує доступні версії, щоб дозволити клієнтам виявляти API за адресою /api, яка є кореневим шляхом для застарілого API v1."
title: "APIVersions"
weight: 40
auto_generated: false
---

`apiVersion: meta/v1`

`import "k8s.io/apimachinery/pkg/apis/meta/v1"`

## APIVersions {#APIVersions}

APIVersions перелічує доступні версії, щоб дозволити клієнтам виявляти API за адресою /api, яка є кореневим шляхом для застарілого API v1.

<hr>

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>apiVersion</code><br/><em>string</em></td>
      <td>APIVersion визначає версію схеми цього представлення обʼєкта. Сервери повинні конвертувати розпізнані схеми до останнього внутрішнього значення і можуть відхиляти нерозпізнані значення. Детальніше: <a href="https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources">https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources</a></td>
    </tr>
    <tr>
      <td><code>kind</code><br/><em>string</em></td>
      <td>Kind визначає тип REST-ресурсу, який представляє цей обʼєкт. Сервери можуть визначати це з точки доступу, до якої клієнт надсилає запити. Не може бути оновлено. У CamelCase. Детальніше: <a href="https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds">https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds</a></td>
    </tr>
    <tr>
      <td><code>serverAddressByClientCIDRs</code>&nbsp;<strong>*</strong><br/><em><a href="{{< ref "server-address-by-client-cidr-v1-meta#ServerAddressByClientCIDR" >}}">ServerAddressByClientCIDR array</a></em></td>
      <td>a map of client CIDR to server address that is serving this group. This is to help clients reach servers in the most network-efficient way possible. Clients can use the appropriate server address as per the CIDR that they match. In case of multiple matches, clients should use the longest matching CIDR. The server returns only those CIDRs that it thinks that the client can match. For example: the master will return an internal IP CIDR only, if the client reaches the server using an internal IP. Server looks at X-Forwarded-For header or X-Real-Ip header or request.RemoteAddr (in that order) to get the client IP.</td>
    </tr>
    <tr>
      <td><code>versions</code>&nbsp;<strong>*</strong><br/><em>string array</em></td>
      <td>versions are the api versions that are available.</td>
    </tr>
  </tbody>
</table>









