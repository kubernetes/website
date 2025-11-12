---
title: NominatedNodeNameForExpectation
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.34"

---

<!--
When enabled, the kube-scheduler uses `.status.nominatedNodeName` to express where a
Pod is going to be bound.
External components can also write to `.status.nominatedNodeName` for a Pod to provide
a suggested placement.
-->
启用此特性门控后，kube-scheduler 使用 `.status.nominatedNodeName` 来表示 Pod 将要被绑定到哪个节点。
外部组件也可以写入 Pod 的 `.status.nominatedNodeName`，以建议调度到哪个节点。
