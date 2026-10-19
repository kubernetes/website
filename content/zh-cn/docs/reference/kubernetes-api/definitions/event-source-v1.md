---
api_metadata:
  apiVersion: "v1"
  import: "k8s.io/api/core/v1"
  kind: "EventSource"
content_type: "api_reference"
description: "EventSource 包含有关事件的信息。"
title: "EventSource"
weight: 90
---
<!--
api_metadata:
  apiVersion: "v1"
  import: "k8s.io/api/core/v1"
  kind: "EventSource"
content_type: "api_reference"
description: "EventSource contains information for an event."
title: "EventSource"
weight: 90
auto_generated: true
-->

`apiVersion: v1`

`import "k8s.io/api/core/v1"`


## EventSource {#EventSource}

<!--
EventSource contains information for an event.
-->
EventSource 包含有关事件的信息。

<hr>

<table>
  <thead><tr><th><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
  <tbody>
    <tr>
      <td><code>component</code><br/><em>string</em></td>
      <td>
      <!--
      Component from which the event is generated.
      -->
      生成该事件的组件。
      </td>
    </tr>
    <tr>
      <td><code>host</code><br/><em>string</em></td>
      <td>
      <!--
      Node name on which the event is generated.
      -->
      生成该事件的节点名称。
      </td>
    </tr>
  </tbody>
</table>
