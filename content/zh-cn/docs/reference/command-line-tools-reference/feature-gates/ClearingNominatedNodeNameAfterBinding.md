---
title: ClearingNominatedNodeNameAfterBinding
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.34"
    toVersion: "1.34"
---

<!--
Enable clearing `.status.nominatedNodeName` whenever Pods are bound to nodes.
-->
允许在 Pod 被绑定到节点时清除 `.status.nominatedNodeName`。
