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
    toVersion: "1.35"
  - stage: deprecated
    defaultValue: true
    fromVersion: "1.36"
    toVersion: "1.36"
  - stage: deprecated
    defaultValue: true
    fromVersion: "1.37"
    locked: true
---

When the feature gate `DisableCPUQuotaWithExclusiveCPUs` is enabled, Kubernetes
does **not** enforce CPU quota for Pods that use the [Guaranteed](/docs/concepts/workloads/pods/pod-qos/#guaranteed)
{{< glossary_tooltip text="QoS class" term_id="qos-class" >}}. This feature gate is locked to `true`.
