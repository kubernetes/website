---
title: DisableCloudProviders
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.22"
    toVersion: "1.28"
  - stage: beta
    defaultValue: true
    fromVersion: "1.29"
    toVersion: "1.30"
  - stage: stable
    defaultValue: true
    fromVersion: "1.31"
    toVersion: "1.32"

removed: true
---
Увімкнення цієї функції деактивувало функціонал у `kube-apiserver`, `kube-controller-manager` і `kubelet`, які повʼязані з параметром `--cloud-provider` аргументу командного рядка.

У Kubernetes v1.31 і новіших версіях єдиними допустимими значеннями для `--cloud-provider` є порожній рядок (без інтеграції з хмарним провайдером) або "external" (інтеграція через окремий cloud-controller-manager).
