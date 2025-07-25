---
# Removed from Kubernetes
title: MountPropagation
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.8"
    toVersion: "1.9"
  - stage: beta 
    defaultValue: true
    fromVersion: "1.10"
    toVersion: "1.11"
  - stage: stable
    defaultValue: true
    fromVersion: "1.12"
    toVersion: "1.14"

removed: true
---
اشتراک‌گذاری ولوم نصب‌شده توسط یک کانتینر با کانتینرها یا پادهای دیگر را فعال کنید. برای جزئیات بیشتر، لطفاً به [mount propagation](/docs/concepts/storage/volumes/#mount-propagation) مراجعه کنید.
