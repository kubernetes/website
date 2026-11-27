---
api_metadata:
  apiVersion: "meta/v1"
  import: "k8s.io/apimachinery/pkg/apis/meta/v1"
  kind: "ShardInfo"
content_type: "api_reference"
description: "ShardInfo 描述了用于生成列表响应的分片选择器。如果列表响应中包含该信息，则表明该列表是一个经过筛选的子集。"
title: "ShardInfo"
weight: 500
---
<!--
api_metadata:
  apiVersion: "meta/v1"
  import: "k8s.io/apimachinery/pkg/apis/meta/v1"
  kind: "ShardInfo"
content_type: "api_reference"
description: "ShardInfo describes the shard selector that was applied to produce a list response. Its presence on a list response indicates the list is a filtered subset."
title: "ShardInfo"
weight: 500
-->

`apiVersion: meta/v1`

`import "k8s.io/apimachinery/pkg/apis/meta/v1"`

## ShardInfo {#ShardInfo}

<!--
ShardInfo describes the shard selector that was applied to produce a list response. Its presence on a list response indicates the list is a filtered subset.
-->
ShardInfo 描述了用于生成列表响应的分片选择器。如果列表响应中包含该信息，则表明该列表是一个经过筛选的子集。

<hr>

<table>
  <thead><tr><th><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
  <tbody>
    <tr>
      <td><code>selector</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>
      <!--
      selector is the shard selector string from the request, echoed back so clients can verify which shard they received and merge responses from multiple shards.
      -->
      selector 是来自请求的分片选择器字符串，系统将其原样返回，
      以便客户端确认接收到了哪个分片，并合并来自多个分片的响应。
      </td>
    </tr>
  </tbody>
</table>
