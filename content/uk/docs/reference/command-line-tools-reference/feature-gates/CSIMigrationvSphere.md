---
title: CSIMigrationvSphere
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.18"
    toVersion: "1.18"
  - stage: beta
    defaultValue: false
    fromVersion: "1.19"
    toVersion: "1.24"
  - stage: beta
    defaultValue: true
    fromVersion: "1.25"
    toVersion: "1.25"
  - stage: stable
    defaultValue: true
    fromVersion: "1.26"
    toVersion: "1.28"

removed: true
---
Вмикає shimʼи та логіку передачі для маршрутизації операцій тому з вбудованого втулка vSphere до втулка vSphere CSI. Підтримує відновлення до втулка vSphere для операцій монтування на вузлах, на яких функція вимкнена або на яких втулок vSphere CSI не встановлено та не налаштовано. Не підтримує відновлення для операцій надання, для них втулок CSI повинен бути встановлений та налаштований. Вимагає увімкнення прапорця функції CSIMigration.
