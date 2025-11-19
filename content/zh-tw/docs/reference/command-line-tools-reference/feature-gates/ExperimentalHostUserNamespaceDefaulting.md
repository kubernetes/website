---
title: ExperimentalHostUserNamespaceDefaulting
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: false
    fromVersion: "1.5"  
    toVersion: "1.27" 
  - stage: deprecated
    defaultValue: false
    fromVersion: "1.28"  
    toVersion: "1.29" 
removed: true
---

<!--
Enabling the defaulting user
namespace to host. This is for containers that are using other host namespaces,
host mounts, or containers that are privileged or using specific non-namespaced
capabilities (e.g. `MKNODE`, `SYS_MODULE` etc.). This should only be enabled
if user namespace remapping is enabled in the Docker daemon.
-->
啓用主機默認的使用者名字空間。
這適用於使用其他主機名字空間、主機安裝的容器，或具有特權或使用特定的非名字空間功能
（例如 `MKNODE`、`SYS_MODULE` 等）的容器。
如果在 Docker 守護程序中啓用了使用者名字空間重新映射，則啓用此選項。
