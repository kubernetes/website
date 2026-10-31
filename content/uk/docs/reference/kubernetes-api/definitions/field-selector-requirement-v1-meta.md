---
api_metadata:
  apiVersion: "meta/v1"
  import: "k8s.io/apimachinery/pkg/apis/meta/v1"
  kind: "FieldSelectorRequirement"
content_type: "api_reference"
description: "FieldSelectorRequirement є селектором, який містить значення, ключ та оператор, що повʼязує ключ і значення."
title: "FieldSelectorRequirement"
weight: 120
auto_generated: false
---

`apiVersion: meta/v1`

`import "k8s.io/apimachinery/pkg/apis/meta/v1"`


## FieldSelectorRequirement {#FieldSelectorRequirement}

FieldSelectorRequirement є селектором, який містить значення, ключ та оператор, що повʼязує ключ і значення.

<hr>

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>key</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>key є ключем селектора полів, до якого застосовується вимога.</td>
    </tr>
    <tr>
      <td><code>operator</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>operator представляє відношення ключа до набору значень. Дійсні оператори: In, NotIn, Exists, DoesNotExist. Список операторів може розширюватися в майбутньому.</td>
    </tr>
    <tr>
      <td><code>values</code><br/><em>string array</em></td>
      <td>values є масивом рядкових значень. Якщо оператор In або NotIn, масив values повинен бути непорожнім. Якщо оператор Exists або DoesNotExist, масив values повинен бути порожнім.</td>
    </tr>
  </tbody>
</table>
