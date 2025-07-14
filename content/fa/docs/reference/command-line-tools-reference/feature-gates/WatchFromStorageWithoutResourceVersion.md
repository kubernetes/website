---
title: WatchFromStorageWithoutResourceVersion
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: false
    fromVersion: "1.30"
    toVersion: "1.32"
  - stage: deprecated
    defaultValue: false
    fromVersion: "1.33"


---
امکان ارائه watchهای بدون `resourceVersion` از حافظه را فراهم می‌کند.
