---
api_metadata:
  apiVersion: "v1"
  import: "k8s.io/api/core/v1"
  kind: "VolumeHealthCondition"
content_type: "api_reference"
description: "VolumeHealthCondition represents an adverse health condition reported for a volume."
title: "VolumeHealthCondition"
weight: 640
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

`apiVersion: v1`

`import "k8s.io/api/core/v1"`


## VolumeHealthCondition {#VolumeHealthCondition}

VolumeHealthCondition represents an adverse health condition reported for a volume.

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>message</code><br/><em>string</em></td>
      <td>message is a human-readable description. Maximum permitted length of a message is 1024 bytes.</td>
    </tr>
    <tr>
      <td><code>reason</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>reason is a brief CamelCase machine-parseable reason. Together with status it forms the unique identity of a condition entry. Maximum permitted length of a reason is 256 bytes.</td>
    </tr>
    <tr>
      <td><code>status</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>status is the machine-parseable health category. Possible values: - "Inaccessible": the volume cannot be accessed. - "DataLoss": data loss has been detected on the volume. - "Degraded": the volume is functioning with reduced capability.<br/><br/>Possible enum values:<br/> - `"DataLoss"` indicates data loss has been detected on the volume.<br/> - `"Degraded"` indicates the volume is functioning but with reduced capability.<br/> - `"Inaccessible"` indicates the volume cannot be accessed.</td>
    </tr>
  </tbody>
</table>











