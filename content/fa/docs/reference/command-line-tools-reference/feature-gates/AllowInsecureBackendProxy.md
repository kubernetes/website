---
# از Kubernetes حذف شد
title: AllowInsecureBackendProxy
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: beta 
    defaultValue: true
    fromVersion: "1.17"
    toVersion: "1.20"
  - stage: stable
    defaultValue: true
    fromVersion: "1.21"
    toVersion: "1.25"

removed: true
---
Enable the users to skip TLS verification of
kubelets on Pod log requests.

به کاربران این امکان را بدهید که در درخواست‌های لاگ پاد، از تأیید TLS مربوط به kubelets صرف‌نظر کنند.