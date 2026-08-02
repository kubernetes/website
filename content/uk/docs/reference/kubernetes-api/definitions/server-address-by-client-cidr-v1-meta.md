---
api_metadata:
  apiVersion: "meta/v1"
  import: "k8s.io/apimachinery/pkg/apis/meta/v1"
  kind: "ServerAddressByClientCIDR"
content_type: "api_reference"
description: "ServerAddressByClientCIDR допомагає клієнту визначити адресу сервера, яку вони повинні використовувати, залежно від clientCIDR, з яким вони збігаються."
title: "ServerAddressByClientCIDR"
weight: 480
auto_generated: false
---

`apiVersion: meta/v1`

`import "k8s.io/apimachinery/pkg/apis/meta/v1"`

## ServerAddressByClientCIDR {#ServerAddressByClientCIDR}

ServerAddressByClientCIDR допомагає клієнту визначити адресу сервера, яку вони повинні використовувати, залежно від clientCIDR, з яким вони збігаються.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>clientCIDR</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>CIDR, з яким клієнти можуть порівняти свою IP-адресу, щоб визначити адресу сервера, яку вони повинні використовувати.</td>
    </tr>
    <tr>
      <td><code>serverAddress</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>Адреса цього сервера, підходяща для клієнта, який відповідає вищезгаданому CIDR. Це може бути імʼя хоста, імʼя хоста:порт, IP або IP:порт.</td>
    </tr>
  </tbody>
</table>
