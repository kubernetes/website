---
title: StorageNamespaceIndex
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: beta 
    defaultValue: true
    fromVersion: "1.30"
    toVersion: "1.32"
  - stage: deprecated
    defaultValue: true
    fromVersion: "1.33"


---
یک شاخص‌گذار فضای نام را برای منابع دارای محدوده فضای نام در حافظه پنهان سرور API فعال می‌کند تا عملیات فهرست‌بندی را تسریع بخشد.

