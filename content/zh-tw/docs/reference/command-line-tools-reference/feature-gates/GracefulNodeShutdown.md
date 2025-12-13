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
在 kubelet 中啓用體面地關閉節點的支持。
在系統關閉時，kubelet 會嘗試監測該事件並體面地終止節點上運行的 Pod。
參閱[體面地關閉節點](/zh-cn/docs/concepts/architecture/nodes/#graceful-node-shutdown)以瞭解更多細節。
