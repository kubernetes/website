---
# Removed from Kubernetes
title: BalanceAttachedNodeVolumes
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.11"
    toVersion: "1.21"
  - stage: deprecated
    defaultValue: false
    fromVersion: "1.22"
    toVersion: "1.22"

removed: true
---
Включити підрахунок volume на вузлі, який слід враховувати для збалансованого розподілу ресурсів при плануванні. Вузлу, який має ближче завантаження процесора, завантаження памʼяті та кількість томів, віддається перевага при прийнятті рішень планувальником.
