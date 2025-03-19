---
# Removed from Kubernetes
title: CSIMigrationOpenStack
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.14"
    toVersion: "1.17"
  - stage: beta
    defaultValue: true
    fromVersion: "1.18"
    toVersion: "1.23"
  - stage: stable
    defaultValue: true
    fromVersion: "1.24"
    toVersion: "1.25"

removed: true
---
Вмикає shimʼи та логіку передачі для маршрутизації операцій тому з вбудованого втулка Cinder до втулка Cinder CSI. Підтримує відновлення до втулка Cinder для операцій монтування на вузлах, на яких функція вимкнена або на яких втулок Cinder CSI не встановлено та не налаштовано. Не підтримує відновлення для операцій надання, для них втулок CSI повинен бути встановлений та налаштований. Вимагає увімкнення прапорця функції CSIMigration.
