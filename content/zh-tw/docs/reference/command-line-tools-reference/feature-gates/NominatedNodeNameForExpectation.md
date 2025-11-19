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
啓用此特性門控後，kube-scheduler 使用 `.status.nominatedNodeName` 來表示 Pod 將要被綁定到哪個節點。
外部組件也可以寫入 Pod 的 `.status.nominatedNodeName`，以建議調度到哪個節點。
