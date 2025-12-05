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
允許在 Pod 被綁定到節點時清除 `.status.nominatedNodeName`。
