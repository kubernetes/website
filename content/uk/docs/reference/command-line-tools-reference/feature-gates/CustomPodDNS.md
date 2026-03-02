---
# Removed from Kubernetes
title: CustomPodDNS
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.9"
    toVersion: "1.9"
  - stage: beta
    defaultValue: true
    fromVersion: "1.10"
    toVersion: "1.13"
  - stage: stable
    defaultValue: true
    fromVersion: "1.14"
    toVersion: "1.16"

removed: true
---
Дозволяє змінювати налаштування DNS для Pod за допомогою властивості `dnsConfig`. Для отримання додаткової інформації див. [DNS-налаштування Pod](/docs/concepts/services-networking/dns-pod-service/#pod-dns-config).
