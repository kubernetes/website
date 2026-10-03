---
title: VolumeLimitScaling
content_type: feature_gate
build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.35"
    toVersion: "1.36"
  - stage: beta
    defaultValue: true
    fromVersion: "1.37"
---
Вмикає масштабування обмеження томів для драйверів CSI. Це дозволяє планувальнику краще координувати роботу з кластерним автомасштабувальником для обмежень сховища. Дивіться [Обмеження сховища](/docs/concepts/storage/storage-limits/) для отримання додаткової інформації.
