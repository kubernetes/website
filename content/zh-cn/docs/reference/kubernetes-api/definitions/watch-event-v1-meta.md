---
api_metadata:
  apiVersion: "meta/v1"
  import: "k8s.io/apimachinery/pkg/apis/meta/v1"
  kind: "WatchEvent"
content_type: "api_reference"
description: "event 表示针对受监控资源发生的单个事件。"
title: "WatchEvent"
weight: 640
---

<!--
api_metadata:
  apiVersion: "meta/v1"
  import: "k8s.io/apimachinery/pkg/apis/meta/v1"
  kind: "WatchEvent"
content_type: "api_reference"
description: "Event represents a single event to a watched resource."
title: "WatchEvent"
weight: 640
auto_generated: true
-->

`apiVersion: meta/v1`

`import "k8s.io/apimachinery/pkg/apis/meta/v1"`

## WatchEvent {#WatchEvent}

<!--
Event represents a single event to a watched resource.
-->
event 表示针对受监控资源发生的单个事件。

<hr>

<table>
  <thead><tr><th><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
  <tbody>
    <tr>
      <td><code>object</code>&nbsp;<strong>*</strong><br/><em></em></td>
      <td>
      <!--
      Object is:  * If Type is Added or Modified: the new state of the object.  * If Type is Deleted: the state of the object immediately before deletion.  * If Type is Error: *Status is recommended; other types may make sense    depending on context.
      -->
      object 为：* 若类型为“新增”或“修改”：对象的新状态。
      * 若类型为“删除”：对象被删除前的状态。
      * 若类型为“错误”：建议使用 Status（状态）；视上下文而定，其他类型也可能适用。
      </td>
    </tr>
    <tr>
      <td><code>type</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td></td>
    </tr>
  </tbody>
</table>
