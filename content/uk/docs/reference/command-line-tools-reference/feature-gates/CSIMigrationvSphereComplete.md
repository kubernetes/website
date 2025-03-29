---
# Removed from Kubernetes
title: CSIMigrationvSphereComplete
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: false
    fromVersion: "1.19"
    toVersion: "1.21"
  - stage: deprecated
    fromVersion: "1.22"
    toVersion: "1.22"

removed: true
---
Припиняє реєстрацію вбудованого втулка vSphere в kubelet та контролерах томів та вмикає shimʼи та логіку перекладу для маршрутизації операцій з томами від вбудованого втулка vSphere до втулка vSphere CSI. Вимагає ввімкнених прапорців `CSIMigration` та `CSIMigrationvSphere` та встановленого та налаштованого втулка vSphere CSI на всіх вузлах кластера. Цей прапорець було відзначено як застарілий на користь прапорця `InTreePluginvSphereUnregister`, який перешкоджає реєстрації вбудованого втулка vSphere.
