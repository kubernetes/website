---
# Removed from Kubernetes
title: NodeLease
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.12"
    toVersion: "1.13"
  - stage: beta 
    defaultValue: true
    fromVersion: "1.14"
    toVersion: "1.16"
  - stage: stable
    defaultValue: true
    fromVersion: "1.17"
    toVersion: "1.23"

removed: true
---
API جدید Lease را فعال کنید تا ضربان قلب گره را گزارش دهد، که می‌تواند به عنوان سیگنال سلامت گره مورد استفاده قرار گیرد.
