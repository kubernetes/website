---
title: CSIMigrationGCE
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.14"
    toVersion: "1.16"
  - stage: beta
    defaultValue: false
    fromVersion: "1.17"
    toVersion: "1.22"
  - stage: beta
    defaultValue: true
    fromVersion: "1.23"
    toVersion: "1.24"
  - stage: stable
    defaultValue: true
    fromVersion: "1.25"
    toVersion: "1.27"

removed: true
---
Вмикає shimʼи та логіку передачі для маршрутизації операцій тому з вбудованого втулка GCE-PD до втулка PD CSI. Підтримує відновлення до втулка PD для операцій монтування на вузлах, на яких функція вимкнена або на яких втулок PD CSI не встановлено та не налаштовано. Не підтримує відновлення для операцій надання, для них втулок CSI повинен бути встановлений та налаштований. Вимагає увімкнення прапорця функції CSIMigration.
