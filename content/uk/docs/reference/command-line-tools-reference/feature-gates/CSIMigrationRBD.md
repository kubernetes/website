---
title: CSIMigrationRBD
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.23"
    toVersion: "1.27"
  - stage: deprecated
    defaultValue: false
    fromVersion: "1.28"
    toVersion: "1.30"

removed: true
---
Вмикає shimʼи та логіку передачі для маршрутизації операцій тому з вбудованого втулка RBD до втулка Ceph RBD CSI. Вимагає увімкнення функціональної можливості CSIMigration та встановлення та налаштування втулка Ceph CSI в кластері.

Цю функціональну можливість було відзначено як застарілу на користь  функціональної можливості `InTreePluginRBDUnregister`, який запобігає реєстрації вбудованого втулка RBD.
