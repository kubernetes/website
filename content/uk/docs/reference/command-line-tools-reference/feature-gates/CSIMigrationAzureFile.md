---
title: CSIMigrationAzureFile
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.15"
    toVersion: "1.20"
  - stage: beta
    defaultValue: false
    fromVersion: "1.21"
    toVersion: "1.23"
  - stage: beta
    defaultValue: true
    fromVersion: "1.24"
    toVersion: "1.25"
  - stage: stable
    defaultValue: true
    fromVersion: "1.26"
    toVersion: "1.29"
removed: true
---
Вмикає shimʼи та логіку передачі для маршрутизації операцій тому з вбудованого втулка Azure-File до втулка AzureFile CSI. Підтримує відновлення до втулка AzureFile для операцій монтування на вузлах, на яких функція вимкнена або на яких втулок AzureFile CSI не встановлено та не налаштовано. Не підтримує відновлення для операцій надання, для них втулок CSI повинен бути встановлений та налаштований. Вимагає увімкнення прапорця функції CSIMigration.
