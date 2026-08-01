---
api_metadata:
  apiVersion: "meta/v1"
  import: "k8s.io/apimachinery/pkg/apis/meta/v1"
  kind: "Preconditions"
content_type: "api_reference"
description: "在执行某项操作（更新、删除等）之前，必须满足 Preconditions。"
title: "Preconditions"
weight: 380
---

<!--
api_metadata:
  apiVersion: "meta/v1"
  import: "k8s.io/apimachinery/pkg/apis/meta/v1"
  kind: "Preconditions"
content_type: "api_reference"
description: "Preconditions must be fulfilled before an operation (update, delete, etc.) is carried out."
title: "Preconditions"
weight: 380
-->

`apiVersion: meta/v1`

`import "k8s.io/apimachinery/pkg/apis/meta/v1"`

## Preconditions {#Preconditions}

<!--
Preconditions must be fulfilled before an operation (update, delete, etc.) is carried out.
-->
在执行某项操作（更新、删除等）之前，必须满足 Preconditions。

<hr>

<table>
  <thead><tr><th><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
  <tbody>
    <tr>
      <td><code>resourceVersion</code><br/><em>string</em></td>
      <td>
      <!--
      Specifies the target ResourceVersion
      -->
      指定目标 resourceVersion
      </td>
    </tr>
    <tr>
      <td><code>uid</code><br/><em>string</em></td>
      <td>
      <!--
      Specifies the target UID.
      -->
      指定目标 UID。
      </td>
    </tr>
  </tbody>
</table>
