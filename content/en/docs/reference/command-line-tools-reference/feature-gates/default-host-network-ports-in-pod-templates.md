---
title: DefaultHostNetworkHostPortsInPodTemplates
content_type: feature_gate
_build:
  list: never
  render: false
---
Changes when the default value of
`PodSpec.containers[*].ports[*].hostPort`
is assigned. The default is to only set a default value in Pods.

Enabling this means a default will be assigned even to embedded
PodSpecs (e.g. in a Deployment), which is the historical default.
