---
title: InPlacePodVerticalScalingMemoryBackedVolumes
content_type: feature_gate
build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.37"
---
Вмикає вертикальне масштабування на місці для обмежень розміру томів `emptyDir` на основі памʼяті.
