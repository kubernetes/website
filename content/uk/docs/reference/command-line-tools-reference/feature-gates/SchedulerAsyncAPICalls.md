---
title: SchedulerAsyncAPICalls
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: true
    fromVersion: "1.34"
---

Змінює kube-scheduler, щоб зробити весь цикл планування вільним від блокуючих запитів до сервера API Kubernetes. Замість цього взаємодійте з API Kubernetes за допомогою асинхронного коду.
