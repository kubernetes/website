---
title: StorageVersionMigrator
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.30"
    toVersion: "1.32"
---
Вмикає міграцію версій сховища. Докладні відомості наведено у статті [Міграція обʼєктів Kubernetes за допомогою міграції версій сховища](/uk/docs/tasks/manage-kubernetes-objects/storage-version-migration).
