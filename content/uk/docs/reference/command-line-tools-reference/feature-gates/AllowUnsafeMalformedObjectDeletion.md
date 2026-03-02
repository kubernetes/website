---
title: AllowUnsafeMalformedObjectDeletion
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.32"
---

Дозволяє оператору кластера визначати пошкоджені ресурси за допомогою операції **list**, а також вводить опцію `ignoreStoreReadErrorWithClusterBreakingPotential`, яку оператор може встановити для виконання небезпечної та примусової операції **delete** таких пошкоджених ресурсів за допомогою API Kubernetes.
