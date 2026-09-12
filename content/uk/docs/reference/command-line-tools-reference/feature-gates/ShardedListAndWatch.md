---
title: ShardedListAndWatch
content_type: feature_gate
build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.36"
---
Вмикає підтримку параметра `shardSelector` у запитах **list** та **watch**, що дозволяє клієнтам отримувати відфільтровану підмножину обʼєктів на основі хеш-діапазонів полів метаданих (наприклад, UID). Дивіться [Фрагментований list та watch](/docs/reference/using-api/api-concepts/#sharded-list-and-watch) для отримання додаткової інформації.
