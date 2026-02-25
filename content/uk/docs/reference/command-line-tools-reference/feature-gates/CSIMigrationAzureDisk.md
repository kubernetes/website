---
# Removed from Kubernetes
title: CSIMigrationAzureDisk
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.15"
    toVersion: "1.18"
  - stage: beta
    defaultValue: false
    fromVersion: "1.19"
    toVersion: "1.22"
  - stage: beta
    defaultValue: true
    fromVersion: "1.23"
    toVersion: "1.23"
  - stage: stable
    defaultValue: true
    fromVersion: "1.24"
    toVersion: "1.26"

removed: true
---
Вмикає shimʼи та логіку передачі для маршрутизації операцій тому з вбудованого втулка Azure-Disk до втулка AzureDisk CSI. Підтримує відновлення до втулка AzureDisk для операцій монтування на вузлах, на яких функція вимкнена або на яких втулок AzureDisk CSI не встановлено та не налаштовано. Не підтримує відновлення для операцій надання, для них втулок CSI повинен бути встановлений та налаштований. Вимагає увімкнення прапорця функції CSIMigration.
