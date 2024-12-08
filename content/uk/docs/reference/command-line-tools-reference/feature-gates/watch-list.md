---
title: WatchList
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.27"
---

Вмикання підтримки [потокового передавання початкового стану обʼєктів у запитах на спостереження](/uk/docs/reference/using-api/api-concepts/#streaming-lists).
