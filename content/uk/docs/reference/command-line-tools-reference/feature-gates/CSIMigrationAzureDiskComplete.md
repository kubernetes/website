---
# Removed from Kubernetes
title: CSIMigrationAzureDiskComplete
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
Припиняє реєстрування вбудованих втулків Azure-Disk в kubelet та контролерах томів та вмикає shimʼи та логіку перекладу для маршрутизації операцій з томами від вбудованого втулка Azure-Disk до втулка AzureDisk CSI. Вимагає ввімкнених прапорців `CSIMigration` та `CSIMigrationAzureDisk` та встановленого та налаштованого втулка AzureDisk CSI на всіх вузлах кластера. Цей прапорець було відзначено як застарілий на користь прапорця `InTreePluginAzureDiskUnregister`, який перешкоджає реєстрації вбудованого втулка AzureDisk.
