---
api_metadata:
  apiVersion: "meta/v1"
  import: "k8s.io/apimachinery/pkg/apis/meta/v1"
  kind: "StatusDetails"
content_type: "api_reference"
description: "StatusDetails is a set of additional properties that MAY be set by the server to provide additional information about a response. The Reason field of a Status object defines what attributes will be set. Clients must ignore fields that do not match the defined type of each attribute, and should assume that any attribute may be empty, invalid, or under defined."
title: "StatusDetails"
weight: 530
auto_generated: true
---

<!--
The file is auto-generated from the Go source code of the component using a generic
[generator](https://github.com/kubernetes-sigs/reference-docs/). To learn how
to generate the reference documentation, please read
[Contributing to the reference documentation](/docs/contribute/generate-ref-docs/).
To update the reference content, please follow the
[Contributing upstream](/docs/contribute/generate-ref-docs/contribute-upstream/)
guide. You can file document formatting bugs against the
[reference-docs](https://github.com/kubernetes-sigs/reference-docs/) project.
-->

`apiVersion: meta/v1`

`import "k8s.io/apimachinery/pkg/apis/meta/v1"`


## StatusDetails {#StatusDetails}

StatusDetails is a set of additional properties that MAY be set by the server to provide additional information about a response. The Reason field of a Status object defines what attributes will be set. Clients must ignore fields that do not match the defined type of each attribute, and should assume that any attribute may be empty, invalid, or under defined.

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>causes</code><br/><em><a href="{{< ref "status-cause-v1-meta#StatusCause" >}}">StatusCause array</a></em></td>
      <td>The Causes array includes more details associated with the StatusReason failure. Not all StatusReasons may provide detailed causes.</td>
    </tr>
    <tr>
      <td><code>group</code><br/><em>string</em></td>
      <td>The group attribute of the resource associated with the status StatusReason.</td>
    </tr>
    <tr>
      <td><code>kind</code><br/><em>string</em></td>
      <td>The kind attribute of the resource associated with the status StatusReason. On some operations may differ from the requested resource Kind. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds</td>
    </tr>
    <tr>
      <td><code>name</code><br/><em>string</em></td>
      <td>The name attribute of the resource associated with the status StatusReason (when there is a single name which can be described).</td>
    </tr>
    <tr>
      <td><code>retryAfterSeconds</code><br/><em>integer</em></td>
      <td>If specified, the time in seconds before the operation should be retried. Some errors may indicate the client must take an alternate action - for those errors this field may indicate how long to wait before taking the alternate action.</td>
    </tr>
    <tr>
      <td><code>uid</code><br/><em>string</em></td>
      <td>UID of the resource. (when there is a single resource which can be described). More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names#uids</td>
    </tr>
  </tbody>
</table>









