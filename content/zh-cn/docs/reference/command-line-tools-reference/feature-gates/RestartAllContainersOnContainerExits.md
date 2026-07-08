---
title: RestartAllContainersOnContainerExits
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.35"
---

<!--
Enables the ability to specify
`RestartAllContainers` as an action in container `restartPolicyRules`. When a container's exit matches a rule with this action, the entire Pod is terminated and restarted in-place.
See [Restart All Containers](/docs/concepts/workloads/pods/pod-lifecycle/#restart-all-containers) for more details.
-->
启用在容器的 `restartPolicyRules` 中将 `RestartAllContainers` 指定为动作的能力。
当容器的退出符合包含此动作的某个规则时，整个 Pod 被终止并进行就地重启。
详情参见[重启所有容器](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#restart-all-containers)。
