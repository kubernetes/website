---
title: CSIStorageCapacity
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.19"
    toVersion: "1.20"
  - stage: beta 
    defaultValue: true
    fromVersion: "1.21"
    toVersion: "1.23"    
  - stage: stable
    defaultValue: true
    fromVersion: "1.24"
    toVersion: "1.27"

removed: true  
---
Дозволяє драйверам CSI публікувати інформацію про обсяг сховища, а планувальнику Kubernetes — використовувати цю інформацію під час планування Podʼів. Див. [Обсяг сховища](/docs/concepts/storage/storage-capacity/). Для отримання додаткових відомостей див. документацію про [типи томів `csi`](/docs/concepts/storage/volumes/#csi).
