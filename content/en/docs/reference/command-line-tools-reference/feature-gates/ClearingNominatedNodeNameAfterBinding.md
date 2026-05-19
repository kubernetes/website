---
title: ClearingNominatedNodeNameAfterBinding
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    locked: false
    fromVersion: "1.34"
    toVersion: "1.34"
  - stage: beta
    defaultValue: true
    locked: false
    fromVersion: "1.35"
---

Enable clearing `.status.nominatedNodeName` whenever Pods are bound to nodes.
