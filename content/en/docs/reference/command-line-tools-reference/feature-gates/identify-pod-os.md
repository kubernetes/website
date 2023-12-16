---
# Removed from Kubernetes
title: IdentifyPodOS
content_type: feature_gate

_build:
  list: never
  render: false
---
Allows the Pod OS field to be specified. This helps in identifying
the OS of the pod authoritatively during the API server admission time.
In Kubernetes {{< skew currentVersion >}}, the allowed values for the `pod.spec.os.name`
are `windows` and `linux`.
