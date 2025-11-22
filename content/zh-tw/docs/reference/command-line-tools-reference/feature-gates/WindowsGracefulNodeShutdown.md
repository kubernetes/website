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
在 kubelet 中啓用對 Windows 節點體面關閉的支持。
在系統關閉期間，kubelet 將嘗試檢測關閉事件並體面終止節點上正運行的 Pod。
細節參見[體面節點關閉](/zh-cn/docs/concepts/architecture/nodes/#graceful-node-shutdown)。
