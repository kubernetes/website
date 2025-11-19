---
# Removed from Kubernetes
title: CRIContainerLogRotation
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.10"
    toVersion: "1.10"
  - stage: beta 
    defaultValue: true
    fromVersion: "1.11"
    toVersion: "1.20"    
  - stage: stable
    defaultValue: true
    fromVersion: "1.21"
    toVersion: "1.22"    

removed: true
---
<!--
Enable container log rotation for CRI container runtime.
The default max size of a log file is 10MB and the default max number of
log files allowed for a container is 5.
These values can be configured in the kubelet config.
See [logging at node level](/docs/concepts/cluster-administration/logging/#logging-at-the-node-level)
for more details.
-->
爲 CRI 容器運行時啓用容器日誌輪換。日誌文件的默認最大大小爲 10MB，
缺省情況下，一個容器允許的最大日誌文件數爲 5。這些值可以在 kubelet 配置中配置。
更多細節請參見[日誌架構](/zh-cn/docs/concepts/cluster-administration/logging/#logging-at-the-node-level)。
