---
title: EmptyDirVolumeMode
content_type: feature_gate
build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.37"
---
Вмикає встановлення бітів прав доступу Unix для тек томів `emptyDir` за допомогою поля `mode` у джерелах томів `emptyDir`. Коли увімкнено, користувачі можуть вказати значення від `0000` до `01777` (вісімкове), щоб керувати правами доступу до теки під час створення. Якщо `mode` не вказано, зберігається типова поведінка `0777`.
