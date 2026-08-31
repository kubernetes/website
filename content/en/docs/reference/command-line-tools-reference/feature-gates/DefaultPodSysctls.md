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

Enables the `defaultPodSysctls` field in [KubeletConfiguration](/docs/reference/config-api/kubelet-config.v1beta1/), allowing Node administrators to specify a default set of namespaced kernel parameters (sysctls) that the `kubelet` applies to all Pods on the Node. See [Setting Sysctls for All Pods](/docs/tasks/administer-cluster/sysctl-cluster/#setting-sysctls-for-all-pods) for more details.
