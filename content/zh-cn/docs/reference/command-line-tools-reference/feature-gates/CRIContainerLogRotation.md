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
为 CRI 容器运行时启用容器日志轮换。日志文件的默认最大大小为 10MB，
缺省情况下，一个容器允许的最大日志文件数为 5。这些值可以在 kubelet 配置中配置。
更多细节请参见[日志架构](/zh-cn/docs/concepts/cluster-administration/logging/#logging-at-the-node-level)。
