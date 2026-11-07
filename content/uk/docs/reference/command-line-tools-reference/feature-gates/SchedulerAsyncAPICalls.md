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
Змінює kube-scheduler, щоб зробити весь цикл планування вільним від блокуючих запитів до API-сервера Kubernetes. Натомість взаємодіє з API Kubernetes за допомогою асинхронного коду.
