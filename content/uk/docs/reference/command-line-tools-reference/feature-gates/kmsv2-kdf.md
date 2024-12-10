---
title: KMSv2KDF
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: false
    fromVersion: "1.28"  
    toVersion: "1.28"
  - stage: stable
    defaultValue: true
    fromVersion: "1.29"  
---
Дозволяє KMS v2 генерувати одноразові ключі шифрування даних. Докладні відомості наведено у статті [Використання постачальника KMS для шифрування даних](/uk/docs/tasks/administer-cluster/kms-provider). Якщо у вашому кластері не увімкнено елемент `KMSv2`, значення елемента `KMSv2KDF` не матиме жодного впливу.
