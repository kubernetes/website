---
title: WindowsGracefulNodeShutdown
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.32"
    toVersion: "1.33"
  - stage: beta
    defaultValue: true
    fromVersion: "1.34"
---

Вмикає підтримку у kubelet підтримки належного завершення роботи вузла Windows. Під час вимкнення системи kubelet намагатиметься виявити подію вимкнення і належним чином завершити роботу podʼів, запущених на вузлі. Докладніші відомості наведено у статті [Graceful Node Shutdown](/docs/concepts/architecture/nodes/#graceful-node-shutdown).
