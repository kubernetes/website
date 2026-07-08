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
Enables the ability to specify
`RestartAllContainers` as an action in container `restartPolicyRules`. When a container's exit matches a rule with this action, the entire Pod is terminated and restarted in-place.

`RestartAllContainersOnContainerExits` depends on both the `ContainerRestartRules` and `NodeDeclaredFeatures` feature gates. If the dependent feature gates are not enabled, kubelet startup can fail.

See [Restart All Containers](/docs/concepts/workloads/pods/pod-lifecycle/#restart-all-containers) for more details.
