---
api_metadata:
  apiVersion: "v1"
  import: "k8s.io/api/core/v1"
  kind: "VolumeHealthCondition"
content_type: "api_reference"
description: "VolumeHealthCondition представляє несприятливий стан справності, повідомлений для тома."
title: "VolumeHealthCondition"
weight: 640
auto_generated: false
---

`apiVersion: v1`

`import "k8s.io/api/core/v1"`

## VolumeHealthCondition {#VolumeHealthCondition}

VolumeHealthCondition представляє несприятливий стан справності, повідомлений для тома.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>message</code><br/><em>string</em></td>
      <td>message є зрозумілим для людини описом. Максимальна дозволена довжина повідомлення — 1024 байти.</td>
    </tr>
    <tr>
      <td><code>reason</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>reason є короткою причиною у форматі CamelCase, зрозумілою для машин. Разом з status вона утворює унікальний ідентифікатор запису про стан. Максимальна дозволена довжина причини — 256 байтів.</td>
    </tr>
    <tr>
      <td><code>status</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>status є категорією справності, зрозумілою для машин. Можливі значення:<br/><br/>
      Можливі значення enum:<br/>
      - <code>"DataLoss"</code> вказує на виявлення втрати даних на томі.<br/>
      - <code>"Degraded"</code> вказує на те, що том працює, але зі зниженою продуктивністю.<br/>
      - <code>"Inaccessible"</code> вказує на те, що том недоступний.<br/><br/>
      Можливі значення перерахування:<br/>
      - <code>"DataLoss"</code> вказує на те, що виявлено втрату даних на томі.<br/>
      - <code>"Degraded"</code> вказує на те, що том працює, але зі зниженою продуктивністю.<br/>
      - <code>"Inaccessible"</code> вказує на те, що том недоступний.</td>
    </tr>
  </tbody>
</table>
