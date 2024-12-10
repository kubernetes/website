---
title: RestartContainerDuringTermination
content_type: feature_gate
_build:
list: never
render: false

stages:
- stage: alpha
  defaultValue: false
  fromVersion: "1.31"
---
Allow restarting containers during termination.
In alpha, this feature is limited to restartable init containers.
See [Sidecar containers and restartPolicy](/docs/concepts/workloads/pods/sidecar-containers/)
for more details.