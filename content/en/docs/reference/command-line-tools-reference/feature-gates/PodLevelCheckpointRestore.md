---
title: PodLevelCheckpointRestore
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.37"
---
Enables Pod-level checkpoint and restore through the `PodCheckpoint` API and
the `restoreFrom` field in a Pod specification.
See [Checkpoint and restore Pods](/docs/tasks/administer-cluster/checkpoint-restore-pods/)
for more information.
