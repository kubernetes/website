---
title: WindowsGracefulNodeShutdown
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.32"
    toVersion: "1.33"
  - stage: beta
    defaultValue: true
    fromVersion: "1.34"
---

<!--
Enables support for windows node graceful shutdown in kubelet.
During a system shutdown, kubelet will attempt to detect the shutdown event
and gracefully terminate pods running on the node. See
[Graceful Node Shutdown](/docs/concepts/architecture/nodes/#graceful-node-shutdown)
for more details.
-->
在 kubelet 中启用对 Windows 节点体面关闭的支持。
在系统关闭期间，kubelet 将尝试检测关闭事件并体面终止节点上正运行的 Pod。
细节参见[体面节点关闭](/zh-cn/docs/concepts/architecture/nodes/#graceful-node-shutdown)。
