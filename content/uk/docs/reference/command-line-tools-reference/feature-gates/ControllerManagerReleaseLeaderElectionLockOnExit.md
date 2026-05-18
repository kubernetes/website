---
title: ControllerManagerReleaseLeaderElectionLockOnExit
content_type: feature_gate
build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.36"
---
Дозволяє `kube-controller-manager` активно звільняти блокування вибору лідера під час зміни лідера, замість того, щоб чекати закінчення терміну дії блокування. Це дозволяє швидше обрати нового лідера.
