---
# Removed from Kubernetes
title: CSIMigrationGCEComplete
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
Припиняє реєстрування вбудованих втулків GCE-PD в kubelet та контролерах томів та вмикає shimʼи та логіку перекладу для маршрутизації операцій з томами від вбудованого втулка GCE-PD до втулка GCE-PD CSI. Вимагає ввімкнених прапорців `CSIMigration` та `CSIMigrationGCE` та встановленого та налаштованого втулка GCE-PD CSI на всіх вузлах кластера. Цей прапорець було відзначено як застарілий на користь прапорця `InTreePluginGCEUnregister`, який перешкоджає реєстрації вбудованого втулка GCE-PD.
