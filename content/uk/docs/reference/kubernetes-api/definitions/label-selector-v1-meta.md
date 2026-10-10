---
api_metadata:
  apiVersion: "meta/v1"
  import: "k8s.io/apimachinery/pkg/apis/meta/v1"
  kind: "LabelSelector"
content_type: "api_reference"
description: "label selector є запитом міток до набору ресурсів. Результат matchLabels та matchExpressions обʼєднується за допомогою AND. Порожній селектор міток відповідає всім обʼєктам. Значення null селектора міток не відповідає жодному обʼєкту."
title: "LabelSelector"
weight: 160
auto_generated: false
---

`apiVersion: meta/v1`

`import "k8s.io/apimachinery/pkg/apis/meta/v1"`

## LabelSelector {#LabelSelector}

LabelSelector є запитом міток до набору ресурсів. Результат matchLabels та matchExpressions обʼєднується за допомогою AND. Порожній селектор міток відповідає всім обʼєктам. Значення null селектора міток не відповідає жодному обʼєкту.

<hr>

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>matchExpressions</code><br/><em><a href="{{< ref "label-selector-requirement-v1-meta#LabelSelectorRequirement" >}}">LabelSelectorRequirement array</a></em></td>
      <td>matchExpressions є списком вимог селектора міток. Всі вимоги обʼєднуються за допомогою AND.</td>
    </tr>
    <tr>
      <td><code>matchLabels</code><br/><em>object</em></td>
      <td>matchLabels є мапою пар {ключ,значення}. Одна пара {ключ,значення} у мапі matchLabels еквівалентна елементу matchExpressions, у якому поле key дорівнює "ключ", оператор дорівнює "In", а масив values містить лише "значення". Всі вимоги обʼєднуються за допомогою AND.</td>
    </tr>
  </tbody>
</table>
