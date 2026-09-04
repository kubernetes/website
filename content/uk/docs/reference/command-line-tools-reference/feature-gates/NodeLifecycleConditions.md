---
title: NodeLifecycleConditions
content_type: feature_gate
build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.37"
---
Вмикає загальновідомі умови вузла, які повідомляють про стан життєвого циклу drain, обслуговування та [належного завершення роботи вузла](/docs/concepts/cluster-administration/node-shutdown/). Див. [Умови життєвого циклу вузла](/docs/reference/node/node-lifecycle-conditions/).
