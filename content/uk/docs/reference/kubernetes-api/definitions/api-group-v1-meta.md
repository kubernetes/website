---
api_metadata:
  apiVersion: "meta/v1"
  import: "k8s.io/apimachinery/pkg/apis/meta/v1"
  kind: "APIGroup"
content_type: "api_reference"
description: "APIGroup містить назву, підтримувані версії та бажану версію групи."
title: "APIGroup"
weight: 20
auto_generated: false
---

`apiVersion: meta/v1`

`import "k8s.io/apimachinery/pkg/apis/meta/v1"`

## APIGroup {#APIGroup}

APIGroup містить назву, підтримувані версії та бажану версію групи.

---

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
      <td><code>name</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>name визначає назву групи.</td>
    </tr>
    <tr>
      <td><code>preferredVersion</code><br/><em><a href="{{< ref "group-version-for-discovery-v1-meta#GroupVersionForDiscovery" >}}">GroupVersionForDiscovery</a></em></td>
      <td>preferredVersion визначає версію, якій віддає перевагу API-сервер, ймовірно, це версія зберігання.</td>
    </tr>
    <tr>
      <td><code>serverAddressByClientCIDRs</code><br/><em><a href="{{< ref "server-address-by-client-cidr-v1-meta#ServerAddressByClientCIDR" >}}">ServerAddressByClientCIDR array</a></em></td>
      <td>мапа відповідності між CIDR-діапазонами клієнтів та адресами серверів, що обслуговують цю групу. Це допомагає клієнтам підключатися до серверів найбільш ефективним з точки зору мережевого трафіку способом. Клієнти можуть використовувати відповідну адресу сервера відповідно до CIDR-діапазону, якому вони відповідають. У разі наявності декількох збігів клієнти повинні використовувати найдовший CIDR-діапазон, що відповідає їхнім параметрам. Сервер повертає лише ті CIDR-діапазони, які, на його думку, можуть відповідати параметрам клієнта. Наприклад: головний сервер поверне лише внутрішній IP-CIDR, якщо клієнт підключається до сервера, використовуючи внутрішню IP-адресу. Сервер перевіряє заголовок X-Forwarded-For або заголовок X-Real-Ip або request.RemoteAddr (у цьому порядку), щоб отримати IP-адресу клієнта.</td>
    </tr>
    <tr>
      <td><code>versions</code>&nbsp;<strong>*</strong><br/><em><a href="{{< ref "group-version-for-discovery-v1-meta#GroupVersionForDiscovery" >}}">GroupVersionForDiscovery array</a></em></td>
      <td>versions визначає версії, які підтримуються в цій групі.</td>
    </tr>
  </tbody>
</table>

## APIGroupList {#APIGroupList}

APIGroupList є списком APIGroup, що дозволяє клієнтам відкривати API за адресою /apis.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>apiVersion</code><br/><em>string</em></td>
      <td>APIVersion визначає версію схеми цього представлення обʼєкта. Сервери повинні конвертувати розпізнані схеми до останнього внутрішнього значення і можуть відхиляти нерозпізнані значення. Детальніше: <a href="https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources">https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources</a></td>
    </tr>
    <tr>
      <td><code>groups</code>&nbsp;<strong>*</strong><br/><em><a href="{{< ref "api-group-v1-meta#APIGroup" >}}">APIGroup array</a></em></td>
      <td>groups є списком APIGroup.</td>
    </tr>
    <tr>
      <td><code>kind</code><br/><em>string</em></td>
      <td>Kind визначає тип REST-ресурсу, який представляє цей обʼєкт. Сервери можуть визначати це з точки доступу, до якої клієнт надсилає запити. Не може бути оновлено. У CamelCase. Детальніше: <a href="https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds">https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds</a></td>
    </tr>
  </tbody>
</table>
