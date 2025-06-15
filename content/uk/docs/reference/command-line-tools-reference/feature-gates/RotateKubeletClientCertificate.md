---
# Removed from Kubernetes
title: RotateKubeletClientCertificate
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: true
    fromVersion: "1.8"
    toVersion: "1.18"
  - stage: stable
    defaultValue: true
    fromVersion: "1.19"
    toVersion: "1.21"

removed: true
---
Вмикає ротацію клієнтського TLS-сертифікату в kubelet. Дивіться [kubelet configuration](/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/#kubelet-configuration) для більш детальної інформації.
