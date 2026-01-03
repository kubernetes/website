---
title: APIResponseCompression
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: "alpha"
    defaultValue: false
    fromVersion: "1.7"
    toVersion: "1.15"
  - stage: beta
    defaultValue: true
    fromVersion: "1.16"
---
Стиснення відповідей API для запитів `LIST` або `GET`.
