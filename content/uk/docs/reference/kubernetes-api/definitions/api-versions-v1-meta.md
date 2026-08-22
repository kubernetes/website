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
      <td>зіставлення CIDR клієнта з адресою сервера, який обслуговує цю групу. Це допомагає клієнтам досягати серверів найбільш мережево-ефективним способом. Клієнти можуть використовувати відповідну адресу сервера відповідно до CIDR, якому вони відповідають. У разі кількох збігів клієнти повинні використовувати найдовший CIDR. Сервер повертає лише ті CIDR, які, на його думку, клієнт може зіставити. Наприклад: master поверне лише внутрішній IP CIDR, якщо клієнт досягає сервера через внутрішній IP. Сервер перевіряє заголовок X-Forwarded-For або X-Real-Ip, або request.RemoteAddr (у такому порядку), щоб отримати IP клієнта.</td>
    </tr>
    <tr>
      <td><code>versions</code>&nbsp;<strong>*</strong><br/><em>string array</em></td>
      <td>versions — це доступні версії API.</td>
    </tr>
  </tbody>
</table>









