---
title: InformerResourceVersion
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.30"
    toVersion: "1.34"
  - stage: stable
    defaultValue: true
    fromVersion: "1.35"
---
Дозвольте клієнтам використовувати виклик `LastSyncResourceVersion()` на інформерах, що дозволить їм виконувати дії на основі поточної версії ресурсу. Коли ця опція вимкнена, `LastSyncResourceVersion()` виконується успішно, але повертає порожній рядок. Використовується kube-controller-manager для StorageVersionMigration.
