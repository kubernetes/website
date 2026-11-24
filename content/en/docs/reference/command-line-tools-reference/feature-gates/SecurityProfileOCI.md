---
title: SecurityProfileOCI
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.38"
---
Allows setting `type: OCI` in the `seccompProfile` of a Pod or container, which
pulls a seccomp profile from an OCI registry. The container runtime merges the
pulled profile with its configured baseline, so the profile can only restrict
the workload further.
<!--more-->
See [seccomp profiles from OCI registries](/docs/concepts/security/linux-kernel-security-constraints/#seccomp-oci)
for more details.
