---
title: ExecProbeTimeout
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: stable
    defaultValue: true
    fromVersion: "1.20"  
---

<!--
Ensure kubelet respects exec probe timeouts.
This feature gate exists in case any of your existing workloads depend on a
now-corrected fault where Kubernetes ignored exec probe timeouts. See
[readiness probes](/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/#configure-probes).
-->
確保 kubelet 會遵從 exec 探針的超時值設置。
此特性門控的主要目的是方便你處理現有的、依賴於已被修復的缺陷的工作負載；
該缺陷導致 Kubernetes 會忽略 exec 探針的超時值設置。
參閱[就緒態探針](/zh-cn/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/#configure-probes).
