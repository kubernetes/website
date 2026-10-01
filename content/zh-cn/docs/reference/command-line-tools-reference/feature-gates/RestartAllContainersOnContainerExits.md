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
    toVersion: "1.35"
  - stage: beta
    defaultValue: true
    fromVersion: "1.36"
---

<!--
Enables the ability to specify
`RestartAllContainers` as an action in container `restartPolicyRules`. When a container's exit matches a rule with this action, the entire Pod is terminated and restarted in-place.

RestartAllContainersOnContainerExits` depends on both the `ContainerRestartRules` and `NodeDeclaredFeatures` feature gates. If the dependent feature gates are not enabled, kubelet startup can fail.

See [Restart All Containers](/docs/concepts/workloads/pods/pod-lifecycle/#restart-all-containers) for more details.
-->
启用在容器的 `restartPolicyRules` 中将 `RestartAllContainers` 指定为动作的能力。
当容器的退出符合包含此动作的某个规则时，整个 Pod 被终止并进行就地重启。

`RestartAllContainersOnContainerExits` 依赖于 `ContainerRestartRules` 和 `NodeDeclaredFeatures`
这两个特性门控。如果未启用这些依赖的特性门控，kubelet 可能会启动失败。

详情参见[重启所有容器](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#restart-all-containers)。
