---
title: DefaultHostNetworkHostPortsInPodTemplates
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: deprecated
    defaultValue: false
    fromVersion: "1.28"  
---
This feature gate controls the point at which a default value for
`.spec.containers[*].ports[*].hostPort`
is assigned, for Pods using `hostNetwork: true`. The default since Kubernetes v1.28 is to only set a default
value in Pods.

Enabling this means a default will be assigned even to the `.spec` of an embedded
[PodTemplate](/docs/concepts/workloads/pods/#pod-templates) (for example, in a Deployment),
which is the way that older releases of Kubernetes worked.
You should migrate your code so that it does not rely on the legacy behavior.
