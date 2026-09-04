---
api_metadata:
  apiVersion: "meta/v1"
  import: "k8s.io/apimachinery/pkg/apis/meta/v1"
  kind: "GroupVersionForDiscovery"
content_type: "api_reference"
description: "GroupVersion містить рядки &#34;group/version&#34; та &#34;version&#34; версії. Зроблено у вигляді struct для збереження розширюваності."
title: "GroupVersionForDiscovery"
weight: 150
auto_generated: false
---

`apiVersion: meta/v1`

`import "k8s.io/apimachinery/pkg/apis/meta/v1"`

## GroupVersionForDiscovery {#GroupVersionForDiscovery}

GroupVersion містить рядки &#34;group/version&#34; та &#34;version&#34; версії. Зроблено у вигляді struct для збереження розширюваності.

<hr>

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>groupVersion</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>groupVersion вказує на API групу та версію у форматі "group/version"</td>
    </tr>
    <tr>
      <td><code>version</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>version вказує на версію у форматі "version". Це дозволяє клієнтам уникнути розділення GroupVersion.</td>
    </tr>
  </tbody>
</table>
