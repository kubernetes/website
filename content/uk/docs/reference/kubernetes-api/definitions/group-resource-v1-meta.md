---
api_metadata:
  apiVersion: "meta/v1"
  import: "k8s.io/apimachinery/pkg/apis/meta/v1"
  kind: "GroupResource"
content_type: "api_reference"
description: "GroupResource визначає Group та Resource, але не вимагає версію. Це корисно для ідентифікації концепцій під час етапів пошуку без частково дійсних типів"
title: "GroupResource"
weight: 140
auto_generated: false
---

`apiVersion: meta/v1`

`import "k8s.io/apimachinery/pkg/apis/meta/v1"`

## GroupResource {#GroupResource}

GroupResource визначає Group та Resource, але не вимагає версію. Це корисно для ідентифікації концепцій під час етапів пошуку без частково дійсних типів

----

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>group</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td></td>
    </tr>
    <tr>
      <td><code>resource</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td></td>
    </tr>
  </tbody>
</table>
