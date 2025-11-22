---
# Removed from Kubernetes
title: PreferNominatedNode
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.21"
    toVersion: "1.21"
  - stage: beta
    defaultValue: true
    fromVersion: "1.22"
    toVersion: "1.23"
  - stage: stable
    defaultValue: true
    fromVersion: "1.24"
    toVersion: "1.25"

removed: true
---
Цей прапорець вказує планувальнику, чи будуть номіновані вузли перевірятися першими перед тим, як обходити всі інші вузли кластера.
