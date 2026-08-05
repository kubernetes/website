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
Enables the ability to specify
`RestartAllContainers` as an action in container `restartPolicyRules`. When a container's exit matches a rule with this action, the entire Pod is terminated and restarted in-place.
See [Restart All Containers](/docs/concepts/workloads/pods/pod-lifecycle/#restart-all-containers) for more details.
