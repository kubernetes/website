---
api_metadata:
  apiVersion: "v1"
  import: "k8s.io/api/core/v1"
  kind: "Toleration"
content_type: "api_reference"
description: "该容忍度所关联的 Pod，能够容忍任何与三元组 `<key, value, effect>`
  相匹配的污点，匹配依据由 `<operator>` 指定。"
title: "Toleration"
weight: 590
---
<!--
api_metadata:
  apiVersion: "v1"
  import: "k8s.io/api/core/v1"
  kind: "Toleration"
content_type: "api_reference"
description: "The pod this Toleration is attached to tolerates any taint that matches the triple &lt;key,value,effect&gt; using the matching operator &lt;operator&gt;."
title: "Toleration"
weight: 590
-->

`apiVersion: v1`

`import "k8s.io/api/core/v1"`

## Toleration {#Toleration}

<!--
The pod this Toleration is attached to tolerates any taint that matches the triple &lt;key,value,effect&gt; using the matching operator &lt;operator&gt;.
-->
该容忍度所关联的 Pod，能够容忍任何与三元组 `<key, value, effect>`
相匹配的污点，匹配依据由 `<operator>` 指定。

<hr>

<table>
  <thead><tr><th><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
  <tbody>
    <tr>
      <td><code>effect</code><br/><em>string</em></td>
      <td>
      <!--
      Effect indicates the taint effect to match. Empty means match all taint effects. When specified, allowed values are NoSchedule, PreferNoSchedule and NoExecute.<br/><br/>Possible enum values:<br/> - `"NoExecute"` Evict any already-running pods that do not tolerate the taint. Currently enforced by NodeController.<br/> - `"NoSchedule"` Do not allow new pods to schedule onto the node unless they tolerate the taint, but allow all pods submitted to Kubelet without going through the scheduler to start, and allow all already-running pods to continue running. Enforced by the scheduler.<br/> - `"PreferNoSchedule"` Like TaintEffectNoSchedule, but the scheduler tries not to schedule new pods onto the node, rather than prohibiting new pods from scheduling onto the node entirely. Enforced by the scheduler.
      -->
      <code>effect</code> 指定要匹配的污点效应（taint effect）。留空表示匹配所有污点效应。
      若指定该字段，允许的值包括 <code>"NoSchedule"</code>、<code>"PreferNoSchedule"</code>。
      <br/>
      <br/>
      可能的枚举值：<br/> 

      - <code>"NoExecute"</code> 驱逐所有无法容忍该污点且正在运行的 Pod。
        该策略目前由 NodeController 强制执行。<br/>
      - <code>"NoSchedule"</code> 除非 Pod 能够容忍该污点，否则不允许将新的 Pod 调度到该节点上；
        但允许所有绕过调度器直接提交给 kubelet 的 Pod 启动，
        也允许所有已在运行的 Pod 继续运行。该策略由调度器强制执行。<br/>
      - <code>"PreferNoSchedule"</code> 类似于 <code>"NoSchedule"</code>，
        但调度器会尽量避免将新的 Pod 调度到该节点上，而不是完全禁止调度。
        该策略由调度器强制执行。
      </td>
    </tr>
    <tr>
      <td><code>key</code><br/><em>string</em></td>
      <td>
      <!--
      Key is the taint key that the toleration applies to. Empty means match all taint keys. If the key is empty, operator must be Exists; this combination means to match all values and all keys.
      -->
      <code>key</code> 是该容忍度所适用的污点键（taint key）。若为空，则表示匹配所有污点键。
      如果 <code>key</code> 为空，<code>operator</code> 必须为 <code>"Exists"</code>；
      这种组合意味着匹配所有键和所有值。
      </td>
    </tr>
    <tr>
      <td><code>operator</code><br/><em>string</em></td>
      <td>
      <!--
      Operator represents a key's relationship to the value. Valid operators are Exists, Equal, Lt, and Gt. Defaults to Equal. Exists is equivalent to wildcard for value, so that a pod can tolerate all taints of a particular category. Lt and Gt perform numeric comparisons (requires feature gate TaintTolerationComparisonOperators).<br/><br/>Possible enum values:<br/> - `"Equal"`<br/> - `"Exists"`<br/> - `"Gt"`<br/> - `"Lt"`
      -->
      <code>operator</code> 表示键（key）与值（value）之间的关系。
      有效的运算符包括 <code>Exists</code>、<code>Equal</code>、<code>Lt</code>、<code>Gt</code>，
      默认值为 <code>Equal</code>。<code>"Exists"</code> 相当于值的通配符，使得
      Pod 能够容忍特定类别下的所有污点。<code>Lt</code> 和 <code>Gt</code>
      执行数值比较（需要启用 TaintTolerationComparisonOperators 特性门控）。<br/>
      <br/>
      可能的枚举值：<br/>

        - `"Equal"`<br/>
        - `"Exists"`<br/>
        - `"Gt"`<br/>
        - `"Lt"`
      </td>
    </tr>
    <tr>
      <td><code>tolerationSeconds</code><br/><em>integer</em></td>
      <td>
      <!--
      TolerationSeconds represents the period of time the toleration (which must be of effect NoExecute, otherwise this field is ignored) tolerates the taint. By default, it is not set, which means tolerate the taint forever (do not evict). Zero and negative values will be treated as 0 (evict immediately) by the system.
      -->
      <code>tolerationSeconds</code> 表示容忍（其 <code>effect</code>
      必须为 <code>"NoExecute"</code>，否则该字段将被忽略）针对污点生效的时长。
      默认情况下该字段未设置，意味着永久容忍该污点（不进行驱逐）。
      系统会将 0 或负值视为 0（即立即驱逐）。
      </td>
    </tr>
    <tr>
      <td><code>value</code><br/><em>string</em></td>
      <td>
      <!--
      Value is the taint value the toleration matches to. If the operator is Exists, the value should be empty, otherwise just a regular string.
      -->
      <code>value</code> 是容忍度所匹配的污点值（taint value）。如果运算符（operator）为
      <code>Exists</code>，则该值应为空；否则，它应为一个普通字符串。
      </td>
    </tr>
  </tbody>
</table>
