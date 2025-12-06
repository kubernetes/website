---
# Removed from Kubernetes
title: NodeLease
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.12"
    toVersion: "1.13"
  - stage: beta
    defaultValue: true
    fromVersion: "1.14"
    toVersion: "1.16"
  - stage: stable
    defaultValue: true
    fromVersion: "1.17"
    toVersion: "1.23"

removed: true
---
Увімкніть новий Lease API для звітування про пульс вузла, який може бути використаний як сигнал про стан вузла.
