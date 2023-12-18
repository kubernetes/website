---
title: SeccompDefault
content_type: feature_gate
_build:
  list: never
  render: false
---
Enables the use of `RuntimeDefault` as the default seccomp profile
for all workloads.
The seccomp profile is specified in the `securityContext` of a Pod and/or a Container.
