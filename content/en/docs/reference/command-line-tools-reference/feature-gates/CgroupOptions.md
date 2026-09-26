---
title: CgroupOptions
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.38"
---

Enables the `cgroupOptions` field in a container's `securityContext`. The field
controls whether the container runtime mounts the cgroup filesystem read-only
or writable for that container. See
[Configure cgroup options for a Container](/docs/tasks/configure-pod-container/security-context/#cgroupoptions).
