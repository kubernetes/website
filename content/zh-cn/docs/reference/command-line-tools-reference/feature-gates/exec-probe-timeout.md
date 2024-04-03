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
确保 kubelet 会遵从 exec 探针的超时值设置。
此特性门控的主要目的是方便你处理现有的、依赖于已被修复的缺陷的工作负载；
该缺陷导致 Kubernetes 会忽略 exec 探针的超时值设置。
参阅[就绪态探针](/zh-cn/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/#configure-probes).
