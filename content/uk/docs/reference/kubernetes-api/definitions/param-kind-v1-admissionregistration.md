---
api_metadata:
  apiVersion: "admissionregistration.k8s.io/v1"
  import: "k8s.io/api/admissionregistration/v1"
  kind: "ParamKind"
content_type: "api_reference"
description: "ParamKind є кортежем Group Kind та Version."
title: "ParamKind"
weight: 340
auto_generated: false
---

`apiVersion: admissionregistration.k8s.io/v1`

`import "k8s.io/api/admissionregistration/v1"`

## ParamKind {#ParamKind}

ParamKind є кортежем Group Kind та Version.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>apiVersion</code><br/><em>string</em></td>
      <td>apiVersion є версією групи API, до якої належать ресурси. У форматі "group/version". Обовʼязково.</td>
    </tr>
    <tr>
      <td><code>kind</code><br/><em>string</em></td>
      <td>kind є видом API, до якого належать ресурси. Обовʼязково.</td>
    </tr>
  </tbody>
</table>
