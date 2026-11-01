---
title: DefaultPodSysctls
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.37"
---

<!--
Enables the `defaultPodSysctls` field in [KubeletConfiguration](/docs/reference/config-api/kubelet-config.v1beta1/), allowing Node administrators to specify a default set of namespaced kernel parameters (sysctls) that the `kubelet` applies to all Pods on the Node. See [Setting Sysctls for All Pods](/docs/tasks/administer-cluster/sysctl-cluster/#setting-sysctls-for-all-pods) for more details.
-->
在 [KubeletConfiguration](/zh-cn/docs/reference/config-api/kubelet-config.v1beta1/) 中启用 `defaultPodSysctls` 字段，
允许节点管理员指定一组默认的带命名空间的内核参数（sysctl），由 `kubelet` 应用到节点上的所有 Pod。
更多细节，请参阅[为所有 Pod 设置 sysctl](/zh-cn/docs/tasks/administer-cluster/sysctl-cluster/#setting-sysctls-for-all-pods)。
