---
title: InPlacePodLevelResourcesVerticalScaling
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.35"
---
Дозволяє вертикальне масштабування ресурсів для Podʼів на місці (наприклад, зміна запитів/обмежень на рівні Podʼів щодо CPU або памʼяті для запущених Podʼів без необхідності їх перезапуску). Детальніше див. документацію про [вертикальне масштабування ресурсів на рівні Podʼів на місці](/docs/tasks/configure-pod-container/resize-pod-resources/).
