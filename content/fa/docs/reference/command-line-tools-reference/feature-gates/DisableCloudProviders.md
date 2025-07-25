---
title: DisableCloudProviders
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.22"
    toVersion: "1.28"
  - stage: beta
    defaultValue: true
    fromVersion: "1.29"
    toVersion: "1.30"
  - stage: stable
    defaultValue: true
    fromVersion: "1.31"
    toVersion: "1.32"

removed: true
---
فعال کردن این ویژگی، عملکرد `kube-apiserver`، `kube-controller-manager` و `kubelet` که مربوط به آرگومان خط فرمان `--cloud-provider` بودند را غیرفعال کرد.

در Kubernetes نسخه ۱.۳۱ و بالاتر، تنها مقادیر معتبر برای `--cloud-provider` رشته خالی (بدون ادغام با ارائه دهنده ابری) یا "خارجی" (ادغام از طریق یک cloud-controller-manager جداگانه) هستند.