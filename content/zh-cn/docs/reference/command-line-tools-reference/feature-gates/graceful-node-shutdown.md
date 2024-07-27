---
title: GracefulNodeShutdown
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.20"
    toVersion: "1.20"
  - stage: beta
    defaultValue: true
    fromVersion: "1.21"
---
<!--
Enables support for graceful shutdown in kubelet.
During a system shutdown, kubelet will attempt to detect the shutdown event
and gracefully terminate pods running on the node. See
[Graceful Node Shutdown](/docs/concepts/architecture/nodes/#graceful-node-shutdown)
for more details.
-->
在 kubelet 中启用体面地关闭节点的支持。
在系统关闭时，kubelet 会尝试监测该事件并体面地终止节点上运行的 Pod。
参阅[体面地关闭节点](/zh-cn/docs/concepts/architecture/nodes/#graceful-node-shutdown)以了解更多细节。
