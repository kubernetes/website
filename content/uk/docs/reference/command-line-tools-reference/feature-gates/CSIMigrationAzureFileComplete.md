---
# Removed from Kubernetes
title: CSIMigrationAzureFileComplete
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
Припиняє реєстрування вбудованих втулків Azure-File в kubelet та контролерах томів та вмикає shimʼи та логіку перекладу для маршрутизації операцій з томами від вбудованого втулка Azure-File до втулка AzureFile CSI. Вимагає ввімкнених прапорців `CSIMigration` та `CSIMigrationAzureFile` та встановленого та налаштованого втулка AzureFile CSI на всіх вузлах кластера. Цей прапорець було відзначено як застарілий на користь прапорця `InTreePluginAzureFileUnregister`, який перешкоджає реєстрації вбудованого втулка AzureFile.
