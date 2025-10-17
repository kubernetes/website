---
title: EnvFiles
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.34"
---

Дозволяє визначати значення змінних середовища контейнера через файл. Дивіться [Визначення значень змінних середовища за допомогою контейнера ініціалізації](/docs/tasks/inject-data-application/define-environment-variable-via-file) для отримання додаткової інформації.
