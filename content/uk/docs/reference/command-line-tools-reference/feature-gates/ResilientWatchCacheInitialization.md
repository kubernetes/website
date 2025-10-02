---
title: ResilientWatchCacheInitialization
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: true
    fromVersion: "1.31"
    toVersion: "1.33"
  - stage: stable
    locked: true
    defaultValue: true
    fromVersion: "1.34"

---
Дозволяє відмовостійку ініціалізацію кешу watch, щоб уникнути перевантаження панелі управління.
