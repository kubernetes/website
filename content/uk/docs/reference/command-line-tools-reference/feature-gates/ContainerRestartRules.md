---
title: ContainerRestartRules
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
Дозволяє налаштувати політику перезапуску контейнерів та правила перезапуску. Докладні відомості наведено у статті [Правила перезапуску контейнерів](/docs/concepts/workloads/pods/pod-lifecycle/#container-restart-rules).
