---
title: DisableCPUQuotaWithExclusiveCPUs
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: true
    fromVersion: "1.33"
---

<!--
When the feature gate `DisableCPUQuotaWithExclusiveCPUs` is enabled (the default), then Kubernetes
does **not** enforce CPU quota for Pods that use the [Guaranteed](/docs/concepts/workloads/pods/pod-qos/#guaranteed)
{{< glossary_tooltip text="QoS class" term_id="qos-class" >}}.

You can disable the `DisableCPUQuotaWithExclusiveCPUs` feature gate to restore the legacy behavior.
-->
当特性门控 `DisableCPUQuotaWithExclusiveCPUs` 被启用（默认）时，
Kubernetes **不会** 对使用 [Guaranteed](/zh-cn/docs/concepts/workloads/pods/pod-qos/#guaranteed)
{{< glossary_tooltip text="QoS 类" term_id="qos-class" >}}的 Pod 强制执行 CPU 配额。

你可以通过禁用 `DisableCPUQuotaWithExclusiveCPUs` 特性门控来恢复以前的行为。
