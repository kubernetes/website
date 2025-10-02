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

When enabled, the kube-scheduler uses `.status.nominatedNodeName` to express where a
Pod is going to be bound.
External components can also write to `.status.nominatedNodeName` for a Pod to provide
a suggested placement.
