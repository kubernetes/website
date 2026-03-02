---
# Removed from Kubernetes
title: KubeletConfigFile
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.8"
    toVersion: "1.9"
  - stage: deprecated
    fromVersion: "1.10"
    toVersion: "1.10"

removed: true
---
Дозволяє завантажувати конфігурацію kubelet з файлу, вказаного за допомогою конфігураційного файлу. Докладнішу інформацію див. у статті [налаштування параметрів kubelet за допомогою конфігураційного файлу](/docs/tasks/administer-cluster/kubelet-config-file/).
