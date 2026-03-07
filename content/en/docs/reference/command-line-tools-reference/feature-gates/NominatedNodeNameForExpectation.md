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
    toVersion: "1.34"
  - stage: beta
    defaultValue: true
    fromVersion: "1.35"

---
When enabled, kube-scheduler uses `.status.nominatedNodeName` to express where a
Pod is going to be bound. The `.status.nominatedNodeName` field is set when kube-scheduler
triggers preemption of pods, or anticipates that WaitOnPermit or PreBinding phase will take
relatively long.
Other components may read and use `.status.nominatedNodeName`, but should not set it.

When disabled, kube-scheduler will only set `.status.nominatedNodeName` before triggering preemption.
