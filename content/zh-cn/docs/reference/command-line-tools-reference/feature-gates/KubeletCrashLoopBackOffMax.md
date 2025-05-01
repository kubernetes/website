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
启用对可逐节点配置的、在重启 `CrashLoopBackOff` 状态的容器时回退最大值的支持。
有关详细信息，请参阅 [kubelet 配置文件](/zh-cn/docs/reference/config-api/kubelet-config.v1beta1/)中的
`crashLoopBackOff.maxContainerRestartPeriod` 字段。
