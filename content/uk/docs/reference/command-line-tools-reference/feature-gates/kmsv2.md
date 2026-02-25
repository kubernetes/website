---
title: KMSv2
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.25"
    toVersion: "1.26"
  - stage: beta
    defaultValue: true
    fromVersion: "1.27"
    toVersion: "1.28"
  - stage: stable
    defaultValue: true
    fromVersion: "1.29"
    toVersion: "1.31"

removed: true
---

Вмикає API KMS v2 для шифрування у стані спокою. Докладні відомості наведено у статті [Використання постачальника KMS для шифрування даних](/docs/tasks/administer-cluster/kms-provider).
