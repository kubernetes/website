---
title: NodeDeclaredFeatures
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.35"
---

<!--
Enables Nodes to report supported features via their `.status`. This enables the 
scheduler and admission controller to prevent operations on nodes lacking features
required by the pod. See [Node Declared Features](/docs/concepts/scheduling-eviction/node-declared-features/).
-->
允许 Node 通过其 `.status` 报告所支持的特性。
这使得调度器和准入控制器能够阻止在缺少 Pod 所需特性的节点上执行操作。
参阅[节点声明的特性](/zh-cn/docs/concepts/scheduling-eviction/node-declared-features/)。
