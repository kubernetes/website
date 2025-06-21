---
title: SeccompDefault
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.22"
    toVersion: "1.24"
  - stage: beta
    defaultValue: true
    fromVersion: "1.25"
    toVersion: "1.26"
  - stage: stable
    defaultValue: true
    fromVersion: "1.27"
    toVersion: "1.28"

removed: true
---
Дозволяє використовувати `RuntimeDefault` як стандартний профіль seccomp для всіх робочих навантажень. Профіль seccomp вказується в `ecurityContext` Pod та/або Container.
