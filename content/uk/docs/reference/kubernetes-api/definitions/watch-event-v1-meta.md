---
api_metadata:
  apiVersion: "meta/v1"
  import: "k8s.io/apimachinery/pkg/apis/meta/v1"
  kind: "WatchEvent"
content_type: "api_reference"
description: "Event представляє окрему подію для спостережуваного ресурсу."
title: "WatchEvent"
weight: 640
auto_generated: false
---

`apiVersion: meta/v1`

`import "k8s.io/apimachinery/pkg/apis/meta/v1"`

## WatchEvent {#WatchEvent}

Event представляє окрему подію для спостережуваного ресурсу.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>object</code>&nbsp;<strong>*</strong><br/><em></em></td>
      <td>Object — це:
        <ul><li>Якщо Type додано або змінено: новий стан обʼєкта.</li><li>Якщо Type видалено: стан обʼєкта безпосередньо перед видаленням.</li><li>Якщо Type помилка: *Status рекомендовано; інші типи можуть мати сенс залежно від контексту.</li></ul></td>
    </tr>
    <tr>
      <td><code>type</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>Type — це тип події. Можливі значення: "ADDED", "MODIFIED", "DELETED", "ERROR".</td>
    </tr>
  </tbody>
</table>









