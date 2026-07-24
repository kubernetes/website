---
api_metadata:
  apiVersion: "v1"
  import: "k8s.io/api/core/v1"
  kind: "NodeSelectorTerm"
content_type: "api_reference"
description: "Селектор вузлів з нульовим або порожнім значенням не відповідає жодному обʼєкту. Вимоги до них обʼєднуються логічним оператором AND. Тип TopologySelectorTerm реалізує підмножину NodeSelectorTerm."
title: "NodeSelectorTerm"
weight: 280
auto_generated: false
---

`apiVersion: v1`

`import "k8s.io/api/core/v1"`

## NodeSelectorTerm {#NodeSelectorTerm}

Селектор вузлів з нульовим або порожнім значенням не відповідає жодному обʼєкту. Вимоги до них обʼєднуються логічним оператором AND. Тип TopologySelectorTerm реалізує підмножину NodeSelectorTerm.

<hr>

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>matchExpressions</code><br/><em><a href="{{< ref "../resource/resource-slice-v1#NodeSelectorRequirement" >}}">NodeSelectorRequirement array</a></em></td>
      <td>Список вимог селектора вузлів за мітками вузлів.</td>
    </tr>
    <tr>
      <td><code>matchFields</code><br/><em><a href="{{< ref "../resource/resource-slice-v1#NodeSelectorRequirement" >}}">NodeSelectorRequirement array</a></em></td>
      <td>Список вимог селектора вузлів за полями вузлів.</td>
    </tr>
  </tbody>
</table>
