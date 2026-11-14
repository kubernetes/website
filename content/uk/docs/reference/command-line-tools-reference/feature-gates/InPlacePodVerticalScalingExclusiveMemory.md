---
title: InPlacePodVerticalScalingExclusiveMemory
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.34"
---
Дозволяє змінювати розмір ресурсів для контейнерів у Guaranteed Podʼах, коли політика диспетчера памʼяті встановлена на `"Static"`. Застосовується тільки до вузлів із увімкненими функціями `InPlacePodVerticalScaling` та диспетчером памʼяті.
