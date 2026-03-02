---
# Removed from Kubernetes
title: CSIMigrationAWSComplete
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
Припиняє реєстрування вбудованих втулків EBS в kubelet та контролерах томів та вмикає shimʼи та логіку перекладу для маршрутизації операцій з томами від вбудованого втулка EBS AWS до втулка EBS CSI. Вимагає ввімкнених прапорців `CSIMigration` та `CSIMigrationAWS` та встановленого та налаштованого втулка EBS CSI на всіх вузлах кластера. Цей прапорець було відзначено як застарілий на користь прапорця `InTreePluginAWSUnregister`, який перешкоджає реєстрації вбудованого втулка EBS.
