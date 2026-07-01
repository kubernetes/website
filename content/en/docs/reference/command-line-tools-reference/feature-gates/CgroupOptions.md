---
title: CgroupOptions
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.37"
---

Enables configuring cgroup options (such as setting `mountMode: Writable` for
unprivileged containers on cgroup v2 systems) via the `cgroupOptions` field of a
container's `securityContext`. See
[Configure cgroupOptions for a Container](/docs/tasks/configure-pod-container/security-context/#configure-cgroupoptions-for-a-container)
for details.
