---
api_metadata:
  apiVersion: "v1"
  import: "k8s.io/api/core/v1"
  kind: "Toleration"
content_type: "api_reference"
description: "The pod this Toleration is attached to tolerates any taint that matches the triple &lt;key,value,effect&gt; using the matching operator &lt;operator&gt;."
title: "Toleration"
weight: 590
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


## Toleration {#Toleration}

The pod this Toleration is attached to tolerates any taint that matches the triple &lt;key,value,effect&gt; using the matching operator &lt;operator&gt;.

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>effect</code><br/><em>string</em></td>
      <td>Effect indicates the taint effect to match. Empty means match all taint effects. When specified, allowed values are NoSchedule, PreferNoSchedule and NoExecute.<br/><br/>Possible enum values:<br/> - `"NoExecute"` Evict any already-running pods that do not tolerate the taint. Currently enforced by NodeController.<br/> - `"NoSchedule"` Do not allow new pods to schedule onto the node unless they tolerate the taint, but allow all pods submitted to Kubelet without going through the scheduler to start, and allow all already-running pods to continue running. Enforced by the scheduler.<br/> - `"PreferNoSchedule"` Like TaintEffectNoSchedule, but the scheduler tries not to schedule new pods onto the node, rather than prohibiting new pods from scheduling onto the node entirely. Enforced by the scheduler.</td>
    </tr>
    <tr>
      <td><code>key</code><br/><em>string</em></td>
      <td>Key is the taint key that the toleration applies to. Empty means match all taint keys. If the key is empty, operator must be Exists; this combination means to match all values and all keys.</td>
    </tr>
    <tr>
      <td><code>operator</code><br/><em>string</em></td>
      <td>Operator represents a key's relationship to the value. Valid operators are Exists, Equal, Lt, and Gt. Defaults to Equal. Exists is equivalent to wildcard for value, so that a pod can tolerate all taints of a particular category. Lt and Gt perform numeric comparisons (requires feature gate TaintTolerationComparisonOperators).<br/><br/>Possible enum values:<br/> - `"Equal"`<br/> - `"Exists"`<br/> - `"Gt"`<br/> - `"Lt"`</td>
    </tr>
    <tr>
      <td><code>tolerationSeconds</code><br/><em>integer</em></td>
      <td>TolerationSeconds represents the period of time the toleration (which must be of effect NoExecute, otherwise this field is ignored) tolerates the taint. By default, it is not set, which means tolerate the taint forever (do not evict). Zero and negative values will be treated as 0 (evict immediately) by the system.</td>
    </tr>
    <tr>
      <td><code>value</code><br/><em>string</em></td>
      <td>Value is the taint value the toleration matches to. If the operator is Exists, the value should be empty, otherwise just a regular string.</td>
    </tr>
  </tbody>
</table>









