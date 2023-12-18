---
title: ExperimentalHostUserNamespaceDefaulting
content_type: feature_gate
_build:
  list: never
  render: false
---
Enabling the defaulting user
namespace to host. This is for containers that are using other host namespaces,
host mounts, or containers that are privileged or using specific non-namespaced
capabilities (e.g. `MKNODE`, `SYS_MODULE` etc.). This should only be enabled
if user namespace remapping is enabled in the Docker daemon.
