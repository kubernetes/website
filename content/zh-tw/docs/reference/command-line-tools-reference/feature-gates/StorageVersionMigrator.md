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
---

<!--
Enables storage version migration. See [Migrate Kubernetes Objects Using Storage Version Migration](/docs/tasks/manage-kubernetes-objects/storage-version-migration) for more details.
-->
啓用儲存版本遷移機制。
有關細節參閱[使用儲存版本遷移功能來遷移 Kubernetes 對象](/zh-cn/docs/tasks/manage-kubernetes-objects/storage-version-migration)。
