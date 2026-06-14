---
api_metadata:
  apiVersion: "admissionregistration.k8s.io/v1"
  import: "k8s.io/api/admissionregistration/v1"
  kind: "WebhookClientConfig"
content_type: "api_reference"
description: "WebhookClientConfig містить інформацію для встановлення TLS-зʼєднання з вебхуком"
title: "WebhookClientConfig"
weight: 650
auto_generated: false
---

`apiVersion: admissionregistration.k8s.io/v1`

`import "k8s.io/api/admissionregistration/v1"`


## WebhookClientConfig {#WebhookClientConfig}

WebhookClientConfig містить інформацію для встановлення TLS-зʼєднання з вебхуком

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>caBundle</code><br/><em>string</em></td>
      <td>caBundle — це PEM-кодований CA-пакунок, який буде використаний для перевірки сертифіката сервера вебхука. Якщо не вказано, використовуються системні кореневі сертифікати на apiserver.</td>
    </tr>
    <tr>
      <td><code>service</code><br/><em><a href="{{< ref "../apiregistration/api-service-v1#ServiceReference" >}}">ServiceReference</a></em></td>
      <td>service — це посилання на сервіс для цього вебхука. Має бути вказано або <code>service</code>, або <code>url</code>. Якщо вебхук працює всередині кластера, слід використовувати <code>service</code>.</td>
    </tr>
    <tr>
      <td><code>url</code><br/><em>string</em></td>
      <td>url — це розташування вебхука у стандартній формі URL (<code>scheme://host:port/path</code>). Має бути вказано або <code>url</code>, або <code>service</code>. Поле <code>host</code> не повинно посилатися на сервіс, що працює в кластері; замість цього використовуйте поле <code>service</code>. Хост може бути визначений через зовнішній DNS в деяких apiserver (наприклад, <code>kube-apiserver</code> не може визначити внутрішній DNS кластера, оскільки це порушення шарів). Хост також може бути IP-адресою. Зверніть увагу, що використання <code>localhost</code> або <code>127.0.0.1</code> як хоста є ризикованим, якщо ви не подбаєте про запуск цього вебхука на всіх хостах, які запускають apiserver, який може потребувати викликів до цього вебхука. Такі установки, ймовірно, будуть непортативними, тобто їх важко буде розгорнути в новому кластері. Схема повинна бути "https"; URL повинен починатися з "https://". Шлях є необовʼязковим, і якщо він присутній, може бути будь-яким рядком, дозволеним у URL. Ви можете використовувати шлях для передачі довільного рядка вебхуку, наприклад, ідентифікатора кластера. Спроба використання користувача або базової автентифікації, наприклад "user:password@", не дозволяється. Фрагменти ("#...") та параметри запиту ("?...") також не дозволяються.</td>
    </tr>
  </tbody>
</table>
