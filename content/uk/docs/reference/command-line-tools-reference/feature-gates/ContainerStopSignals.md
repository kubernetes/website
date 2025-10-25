---
title: ContainerStopSignals
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.33"
---
Дозволяє використовувати сигнал StopSignal життєвого циклу для контейнерів для налаштування власних сигналів за допомогою яких може бути зупинено роботу контейнера.
