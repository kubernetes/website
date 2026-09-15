---
api_metadata:
  apiVersion: "meta/v1"
  import: "k8s.io/apimachinery/pkg/apis/meta/v1"
  kind: "LabelSelectorRequirement"
content_type: "api_reference"
description: "label selector requirement є селектором, який містить значення, ключ та оператор, що повʼязує ключ і значення."
title: "LabelSelectorRequirement"
weight: 180
auto_generated: false
---

`apiVersion: meta/v1`

`import "k8s.io/apimachinery/pkg/apis/meta/v1"`

## LabelSelectorRequirement {#LabelSelectorRequirement}

LabelSelectorRequirement є селектором, який містить значення, ключ та оператор, що повʼязує ключ і значення.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>key</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>key є ключем мітки, до якої застосовується селектор.</td>
    </tr>
    <tr>
      <td><code>operator</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>operator представляє відношення ключа до набору значень. Дійсні оператори: In, NotIn, Exists та DoesNotExist.</td>
    </tr>
    <tr>
      <td><code>values</code><br/><em>string array</em></td>
      <td>values є масивом рядкових значень. Якщо оператор In або NotIn, масив values повинен бути непорожнім. Якщо оператор Exists або DoesNotExist, масив values повинен бути порожнім. Цей масив замінюється під час стратегічного обʼєднання патчів.</td>
    </tr>
  </tbody>
</table>
