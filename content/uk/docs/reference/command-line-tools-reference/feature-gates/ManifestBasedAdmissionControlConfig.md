---
title: ManifestBasedAdmissionControlConfig
content_type: feature_gate
build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.36"
---
Вмикає завантаження вебхуків допуску та політик допуску на основі CEL з статичних файлів маніфестів на диску через поле `staticManifestsDir` у `AdmissionConfiguration`. Ці політики активні з моменту запуску API-сервера, зберігаються при недоступності etcd і можуть захищати ресурси допуску на основі API від модифікації.
