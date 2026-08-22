---
api_metadata:
  apiVersion: "v1"
  import: "k8s.io/api/core/v1"
  kind: "NodeSelector"
content_type: "api_reference"
description: "Селектор вузлів являє собою обʼєднання результатів одного або декількох запитів за мітками щодо набору вузлів; іншими словами, він являє собою обʼєднання за оператором OR селекторів, представлених термінами селектора вузлів."
title: "NodeSelector"
weight: 270
auto_generated: false
---

`apiVersion: v1`

`import "k8s.io/api/core/v1"`

## NodeSelector {#NodeSelector}

Селектор вузлів являє собою обʼєднання результатів одного або декількох запитів за мітками щодо набору вузлів; іншими словами, він являє собою обʼєднання за оператором OR селекторів, представлених термінами селектора вузлів.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>nodeSelectorTerms</code>&nbsp;<strong>*</strong><br/><em><a href="{{< ref "node-selector-term-v1#NodeSelectorTerm" >}}">NodeSelectorTerm array</a></em></td>
      <td>Обовʼязково. Список термінів селектора вузлів. Терміни обʼєднуються оператором OR.</td>
    </tr>
  </tbody>
</table>
