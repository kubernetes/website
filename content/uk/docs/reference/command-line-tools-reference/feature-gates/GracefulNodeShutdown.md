---
title: GracefulNodeShutdown
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.20"
    toVersion: "1.20"
  - stage: beta
    defaultValue: true
    fromVersion: "1.21"
---
Вмикає підтримку відповідного завершення роботи у kubelet. Під час вимкнення системи kubelet намагатиметься виявити подію вимкнення і завершити роботу Podʼів, запущених на вузлі, відповідним чином. Докладніші відомості наведено у статті [Відповідне вимикання вузла](/docs/concepts/cluster-administration/node-shutdown/#graceful-node-shutdown).
