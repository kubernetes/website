---
# Removed from Kubernetes
title: ReadOnlyAPIDataVolumes
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: beta 
    defaultValue: true
    fromVersion: "1.8"
    toVersion: "1.9"
  - stage: stable
    fromVersion: "1.10"
    toVersion: "1.10"

removed: true  
---
[`configMap`](/docs/concepts/storage/volumes/#configmap)،
[`secret`](/docs/concepts/storage/volumes/#secret)،
[`downwardAPI`](/docs/concepts/storage/volumes/#downwardapi) و
[`projected`](/docs/concepts/storage/volumes/#projected) را طوری تنظیم کنید که فقط خواندنی نصب شود.

از Kubernetes نسخه ۱.۱۰، این نوع درایوها همیشه فقط خواندنی هستند و شما نمی‌توانید از این حالت خارج شوید.