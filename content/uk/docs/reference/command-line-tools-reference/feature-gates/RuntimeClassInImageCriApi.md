---
title: RuntimeClassInImageCriApi
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.29"
---
Дозволяє витягувати зображення на основі [класу виконання](/docs/concepts/containers/runtime-class/) Podʼів, які посилаються на них.
