---
title: AllowUnsafeMalformedObjectDeletion
content_type: feature_gate
build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.32"
    toVersion: "1.36"
  - stage: beta
    defaultValue: true
    fromVersion: "1.37"
---

Дозволяє оператору кластера визначати пошкоджені ресурси за допомогою операції **list**, а також вводить опцію `ignoreStoreReadErrorWithClusterBreakingPotential`, яку оператор може встановити для виконання небезпечної та примусової операції **delete** таких пошкоджених ресурсів за допомогою API Kubernetes.
