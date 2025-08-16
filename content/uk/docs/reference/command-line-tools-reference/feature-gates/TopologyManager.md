---
title: TopologyManager
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.16"
    toVersion: "1.17"
  - stage: beta
    defaultValue: true
    fromVersion: "1.18"
    toVersion: "1.26"
  - stage: stable
    defaultValue: true
    fromVersion: "1.27"
    toVersion: "1.28"

removed: true
---
Вмикання механізму для координації тонких призначень апаратних ресурсів для різних компонентів у Kubernetes. Див. розділ [Керування політиками керування топологією на вузлі](/docs/tasks/administer-cluster/topology-manager/).
