---
# Removed from Kubernetes
title: SupportNodePidsLimit
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.14"
    toVersion: "1.14"
  - stage: beta 
    defaultValue: true
    fromVersion: "1.15"
    toVersion: "1.19"    
  - stage: stable
    defaultValue: true
    fromVersion: "1.20"
    toVersion: "1.23"    

removed: true
---
<!--
Enable the support to limiting PIDs on the Node.  The parameter
`pid=<number>` in the `--system-reserved` and `--kube-reserved` options can be specified to
ensure that the specified number of process IDs will be reserved for the system as a whole and for
 Kubernetes system daemons respectively.
-->
允许限制 Node 上的 PID 用量。
`--system-reserved` 和 `--kube-reserved` 中的参数 `pid=<数值>`
可以分别用来设定为整个系统所预留的进程 ID 个数，
和为 Kubernetes 系统守护进程预留的进程 ID 个数。
