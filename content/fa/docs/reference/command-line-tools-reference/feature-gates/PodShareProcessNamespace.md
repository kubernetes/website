---
# Removed from Kubernetes
title: PodShareProcessNamespace
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.10"
    toVersion: "1.11"
  - stage: beta 
    defaultValue: true
    fromVersion: "1.12"
    toVersion: "1.16"
  - stage: stable
    defaultValue: true
    fromVersion: "1.17"
    toVersion: "1.19"

removed: true
---
تنظیم `shareProcessNamespace` را در یک Pod برای اشتراک‌گذاری یک فضای نام فرآیند واحد بین کانتینرهای در حال اجرا در یک Pod فعال کنید. جزئیات بیشتر را می‌توانید در [Share Process Namespace between Containers in a Pod](/docs/tasks/configure-pod-container/share-process-namespace/).
 بیابید.