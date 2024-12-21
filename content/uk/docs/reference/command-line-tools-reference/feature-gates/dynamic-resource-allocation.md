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

# TODO: as soon as this is locked to "true" (= GA), comments about other DRA
# feature gate(s) like "unless you also enable the `DynamicResourceAllocation` feature gate"
# can be removed (for example, in dra-admin-access.md).

---
Дозволяє підтримувати ресурси з власними параметрами та життєвим циклом які не залежать від Pod. Розподілом ресурсів займається планувальник Kubernetes використовуючи "структуровані параметри".
