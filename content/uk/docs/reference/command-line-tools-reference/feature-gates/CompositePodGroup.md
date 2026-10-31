---
title: CompositePodGroup
content_type: feature_gate
build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.37"
---

Вмикає ієрархічне групове планування (gang scheduling) для [CompositePodGroups](/docs/concepts/workloads/compositepodgroup-api/) та PodGroups.

Увімкнення функціональної можливості `CompositePodGroup` вимагає, щоб функціональні можливості `GenericWorkload` та `TopologyAwareWorkloadScheduling` також були увімкнені.
