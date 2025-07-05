---
title: NominatedNodeNameForExpectation
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: true
    fromVersion: "1.34"
    toVersion: "1.34"
---

It makes the scheduler use NominatedNodeName to express where the pod is going to be bound.
And also, it allows the external components to put NominatedNodeName as a suggestion of the node placement.
