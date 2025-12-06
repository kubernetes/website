---
# Removed from Kubernetes
title: BoundServiceAccountTokenVolume
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.13"
    toVersion: "1.20"
  - stage: beta
    defaultValue: true
    fromVersion: "1.21"
    toVersion: "1.21"
  - stage: stable
    defaultValue: true
    fromVersion: "1.22"
    toVersion: "1.23"

removed: true
---
Переносить томи ServiceAccount для використання спроєцьованого тому, що складається з ServiceAccountTokenVolumeProjection. Адміністратори кластера можуть використовувати метрику `serviceaccount_stale_tokens_total` для моніторингу робочих навантажень, які залежать від розширених токенів. Якщо таких навантажень немає, вимкніть розширені токени, запустивши `kube-apiserver` з прапорцем `--service-account-extend-token-expiration=false`.

Ознайомтеся зі статтею [Привʼязані токени службових облікових записів](https://github.com/kubernetes/enhancements/blob/master/keps/sig-auth/1205-bound-service-account-tokens/README.md) для більш детальної інформації.
