---
# Removed from Kubernetes
title: CSIMigrationOpenStackComplete
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.17"
    toVersion: "1.20"
  - stage: deprecated
    fromVersion: "1.21"
    toVersion: "1.21"

removed: true
---
Припиняє реєстрування вбудованих втулків Cinder в kubelet та контролерах томів та вмикає shimʼи та логіку перекладу для маршрутизації операцій з томами від вбудованого втулка Cinder до втулка Cinder CSI. Вимагає ввімкнених прапорців `CSIMigration` та `CSIMigrationOpenStack` та встановленого та налаштованого втулка Cinder CSI на всіх вузлах кластера. Цей прапорець було відзначено як застарілий на користь прапорця `InTreePluginOpenStackUnregister`, який перешкоджає реєстрації вбудованого втулка Cinder OpenStack.
