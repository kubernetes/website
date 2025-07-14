---
title: StorageVersionHash
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.14"
    toVersion: "1.14"
  - stage: beta
    defaultValue: true
    fromVersion: "1.15"
---
به سرورهای API اجازه دهید تا هش نسخه ذخیره‌سازی را در فرآیند کشف افشا کنند.
