---
title: MutatingAdmissionPolicy
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.30"
---
پشتیبانی [MutatingAdmissionPolicy](/docs/reference/access-authn-authz/mutating-admission-policy/) را برای جهش‌های [CEL](https://kubernetes.io/docs/reference/using-api/cel/) که در کنترل پذیرش استفاده می‌شوند، فعال کنید.
برای Kubernetes نسخه‌های ۱.۳۰ و ۱.۳۱، این دروازه ویژگی وجود داشت اما هیچ تاثیری نداشت.