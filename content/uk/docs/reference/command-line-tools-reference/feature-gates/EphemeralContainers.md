---
# Removed from Kubernetes
title: EphemeralContainers
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.16"
    toVersion: "1.22"
  - stage: beta
    defaultValue: true
    fromVersion: "1.23"
    toVersion: "1.24"
  - stage: stable
    defaultValue: true
    fromVersion: "1.25"
    toVersion: "1.26"

removed: true
---
Вмикає можливість додавання {{< glossary_tooltip text="ефемерних контейнерів" term_id="ephemeral-container" >}} до запущених Podʼів.
