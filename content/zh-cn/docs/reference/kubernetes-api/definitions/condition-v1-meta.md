---
api_metadata:
  apiVersion: "meta/v1"
  import: "k8s.io/apimachinery/pkg/apis/meta/v1"
  kind: "Condition"
content_type: "api_reference"
description: "Condition 包含了该 API 资源当前状态某一方面的详细信息。"
title: "Condition"
weight: 70
---

<!--
api_metadata:
  apiVersion: "meta/v1"
  import: "k8s.io/apimachinery/pkg/apis/meta/v1"
  kind: "Condition"
content_type: "api_reference"
description: "Condition contains details for one aspect of the current state of this API Resource."
title: "Condition"
weight: 70
auto_generated: true
-->

`apiVersion: meta/v1`

`import "k8s.io/apimachinery/pkg/apis/meta/v1"`


## Condition {#Condition}

<!--
Condition contains details for one aspect of the current state of this API Resource.
-->
Condition 包含了该 API 资源当前状态某一方面的详细信息。

<hr>

<table>
  <thead><tr><th><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
  <tbody>
    <tr>
      <td><code>lastTransitionTime</code>&nbsp;<strong>*</strong><br/><em><a href="{{< ref "time-v1-meta#Time" >}}">Time</a></em></td>
      <td>
      <!--
      lastTransitionTime is the last time the condition transitioned from one status to another. This should be when the underlying condition changed.  If that is not known, then using the time when the API field changed is acceptable.
      -->
      lastTransitionTime 是该条件从一种状况转换为另一种状况的最后时间。
      理想情况下，这应对应于底层状况发生变更的时间；若无法确定该时间，则使用 API 字段发生变更的时间也是可以接受的。
      </td>
    </tr>
    <tr>
      <td><code>message</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>
      <!--
      message is a human readable message indicating details about the transition. This may be an empty string.
      -->
      message 是一个人类可读的消息，用于说明有关该转换的详细信息。该消息可以为空字符串。
      </td>
    </tr>
    <tr>
      <td><code>observedGeneration</code><br/><em>integer</em></td>
      <td>
      <!--
      observedGeneration represents the .metadata.generation that the condition was set based upon. For instance, if .metadata.generation is currently 12, but the .status.conditions[x].observedGeneration is 9, the condition is out of date with respect to the current state of the instance.
      -->
      observedGeneration 表示该状况是基于哪个 .metadata.generation 设置的。
      例如，如果当前的 .metadata.generation 为 12，而 .status.conditions[x].observedGeneration 为 9，
      则说明该状态相对于实例的当前状况而言已过期。
      </td>
    </tr>
    <tr>
      <td><code>reason</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>
      <!--
      reason contains a programmatic identifier indicating the reason for the condition's last transition. Producers of specific condition types may define expected values and meanings for this field, and whether the values are considered a guaranteed API. The value should be a CamelCase string. This field may not be empty.
      -->
      reason 字段包含一个程序化标识符，用于指示该条件上一次状态转换的原因。
      特定条件类型的生产者可以定义该字段的预期值及其含义，并说明这些值是否属于 API 保证的范畴。
      该字段的值应为驼峰命名法（CamelCase）字符串，且不能为空。
      </td>
    </tr>
    <tr>
      <td><code>status</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>
      <!--
      status of the condition, one of True, False, Unknown.
      -->
      条件的状态，取值为 True、False 或 Unknown 之一。
      </td>
    </tr>
    <tr>
      <td><code>type</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>
      <!--
      type of condition in CamelCase or in foo.example.com/CamelCase.
      -->
      采用驼峰命名法（CamelCase）或 foo.example.com/CamelCase 形式的条件类型。
      </td>
    </tr>
  </tbody>
</table>
