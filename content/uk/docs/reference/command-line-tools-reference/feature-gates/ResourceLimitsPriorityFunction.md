---
# Removed from Kubernetes
title: ResourceLimitsPriorityFunction
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.9"
    toVersion: "1.18"
  - stage: deprecated
    fromVersion: "1.19"
    toVersion: "1.19"

removed: true
---
Вмикає функцію пріоритету планувальника, яка присвоює найнижчу можливу оцінку 1 вузлу, який задовольняє хоча б одному з лімітів процесора та памʼяті вхідного Podʼа. Це має на меті розірвати звʼязки між вузлами з однаковими оцінками.
