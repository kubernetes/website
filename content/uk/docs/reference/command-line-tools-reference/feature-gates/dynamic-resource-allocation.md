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
---
Дозволяє підтримувати ресурси з власними параметрами та життєвим циклом які не залежать від Pod. Розподілом ресурсів займається планувальник Kubernetes використовуючи "структуровані параметри".

