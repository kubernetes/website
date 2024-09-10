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
启用主机默认的用户名字空间。
这适用于使用其他主机名字空间、主机安装的容器，或具有特权或使用特定的非名字空间功能
（例如 `MKNODE`、`SYS_MODULE` 等）的容器。
如果在 Docker 守护程序中启用了用户名字空间重新映射，则启用此选项。
