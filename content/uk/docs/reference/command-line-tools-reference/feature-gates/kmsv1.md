---
title: KMSv1
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: deprecated
    defaultValue: true
    fromVersion: "1.28"
    toVersion: "1.28"
  - stage: deprecated
    defaultValue: false
    fromVersion: "1.29"

---
Вмикає API KMS v1 для шифрування у стані спокою. Докладні відомості наведено у статті [Використання постачальника KMS для шифрування даних](/docs/tasks/administer-cluster/kms-provider).
