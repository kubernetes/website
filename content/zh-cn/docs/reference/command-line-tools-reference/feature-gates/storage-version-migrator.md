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

<!--
Enables storage version migration. See [Migrate Kubernetes Objects Using Storage Version Migration](/docs/tasks/manage-kubernetes-objects/storage-version-migration) for more details.
-->
启用存储版本迁移机制。
有关细节参阅[使用存储版本迁移功能来迁移 Kubernetes 对象](/zh-cn/docs/tasks/manage-kubernetes-objects/storage-version-migration)。
