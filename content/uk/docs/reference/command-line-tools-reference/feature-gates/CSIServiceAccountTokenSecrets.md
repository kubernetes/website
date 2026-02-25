---
title: CSIServiceAccountTokenSecrets
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: true
    fromVersion: "1.35"
---
Дозволяє драйверам CSI підключатися для отримання токенів службових облікових записів від kubelet через спеціальне поле секретів у NodePublishVolumeRequest замість поля volume_context.
