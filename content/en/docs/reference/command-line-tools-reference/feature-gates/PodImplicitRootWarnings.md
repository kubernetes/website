---
title: PodImplicitRootWarnings
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.38"
---

Enables kubelet to report `InsecureImplicitUserID`/`InsecureImplicitGroupID` pod conditions.
These conditions are true if the feature is enabled and when some container is observed running as UID/GID 0 without the pod or
container spec explicitly requesting it via `runAsUser`/`runAsGroup`.

<!--more-->

You can read more about [Pod conditions](/docs/concepts/workloads/pods/pod-condition/) elsewhere in the documentation.
