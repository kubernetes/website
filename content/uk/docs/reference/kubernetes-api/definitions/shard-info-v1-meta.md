---
api_metadata:
  apiVersion: "meta/v1"
  import: "k8s.io/apimachinery/pkg/apis/meta/v1"
  kind: "ShardInfo"
content_type: "api_reference"
description: "ShardInfo описує селектор шарда, який був застосований для отримання списку. Його наявність у відповіді списку вказує на те, що список є відфільтрованою підмножиною."
title: "ShardInfo"
weight: 500
auto_generated: false
---

`apiVersion: meta/v1`

`import "k8s.io/apimachinery/pkg/apis/meta/v1"`

## ShardInfo {#ShardInfo}

ShardInfo описує селектор шарда, який був застосований для отримання списку. Його наявність у відповіді списку вказує на те, що список є відфільтрованою підмножиною.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>selector</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>selector є рядком селектора шарда з запиту, який повертається назад, щоб клієнти могли перевірити, який шард вони отримали, і обʼєднати відповіді з кількох шардів.</td>
    </tr>
  </tbody>
</table>
