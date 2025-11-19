---
title: KubeletCrashLoopBackOffMax
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.32"
---

<!--
Enables support for configurable per-node backoff maximums for restarting
containers in the `CrashLoopBackOff` state.
For more details, check the `crashLoopBackOff.maxContainerRestartPeriod` field in the
[kubelet config file](/docs/reference/config-api/kubelet-config.v1beta1/).
-->
啓用對可逐節點配置的、在重啓 `CrashLoopBackOff` 狀態的容器時回退最大值的支持。
有關詳細信息，請參閱 [kubelet 配置文件](/zh-cn/docs/reference/config-api/kubelet-config.v1beta1/)中的
`crashLoopBackOff.maxContainerRestartPeriod` 字段。
