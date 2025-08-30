---
# Removed from Kubernetes
title: CSRDuration
content_type: feature_gate

_build:
  list: never
  render: false

stages:
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
Дозволяє клієнтам запитувати час дії для сертифікатів, виданих через Kubernetes CSR API.
