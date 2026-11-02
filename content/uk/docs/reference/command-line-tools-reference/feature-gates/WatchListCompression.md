---
title: WatchListCompression
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: true
    fromVersion: "1.37"
---
Дозволяє стиснення відповідей [_списків спостереження_](/docs/reference/using-api/api-concepts/#streaming-lists) від API-сервера. Цей feature gate не має ефекту, якщо `WatchList` вимкнено.
