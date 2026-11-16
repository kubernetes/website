---
api_metadata:
  apiVersion: "meta/v1"
  import: "k8s.io/apimachinery/pkg/apis/meta/v1"
  kind: "GroupResource"
content_type: "api_reference"
description: "GroupResource 指定了 API 组和资源，但不强制指定版本。这在查找阶段很有用，因为部分类型可能无效。"
title: "GroupResource"
weight: 140
---

<!--
api_metadata:
  apiVersion: "meta/v1"
  import: "k8s.io/apimachinery/pkg/apis/meta/v1"
  kind: "GroupResource"
content_type: "api_reference"
description: "GroupResource specifies a Group and a Resource, but does not force a version.  This is useful for identifying concepts during lookup stages without having partially valid types"
title: "GroupResource"
weight: 140
auto_generated: true
-->

`apiVersion: meta/v1`

`import "k8s.io/apimachinery/pkg/apis/meta/v1"`


## GroupResource {#GroupResource}

<!--
GroupResource specifies a Group and a Resource, but does not force a version.  This is useful for identifying concepts during lookup stages without having partially valid types
-->
GroupResource 指定了 API 组和资源，但不强制指定版本。这在查找阶段很有用，因为部分类型可能无效。

<hr>

<table>
  <thead><tr><th><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
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
