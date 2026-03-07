---
title: DynamicResourceAllocation
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.30"
    toVersion: "1.31"
  - stage: beta
    defaultValue: false
    fromVersion: "1.32"
    toVersion: "1.33"
  - stage: stable
    defaultValue: true
    locked: false
    fromVersion: "1.34"
    toVersion: "1.34"
  - stage: stable
    defaultValue: true
    locked: true
    fromVersion: "1.35"

---
Дозволяє підтримувати ресурси з власними параметрами та життєвим циклом які не залежать від Pod. Розподілом ресурсів займається планувальник Kubernetes використовуючи "структуровані параметри".
