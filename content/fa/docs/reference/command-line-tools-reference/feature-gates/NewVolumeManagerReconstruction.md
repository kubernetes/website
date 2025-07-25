---
title: NewVolumeManagerReconstruction
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.25"
    toVersion: "1.26"
  - stage: beta
    defaultValue: true
    fromVersion: "1.27"
    toVersion: "1.29"
  - stage: stable
    defaultValue: true
    fromVersion: "1.30"
    toVersion: "1.31"

removed: true
---
This refactoring was behind the `SELinuxMountReadWriteOncePod`  feature gate in Kubernetes
releases 1.25 and 1.26.
امکان کشف بهتر حجم‌های نصب‌شده در هنگام راه‌اندازی kubelet را فراهم می‌کند. از آنجایی که کد مرتبط به‌طور قابل‌توجهی اصلاح شده بود، نسخه‌های 1.25 تا 1.29 Kubernetes به شما این امکان را می‌دادند که در صورت گیر کردن kubelet در هنگام راه‌اندازی یا عدم حذف حجم‌ها از Podهای خاتمه‌یافته، از این امر انصراف دهید.
این اصلاح، پشت دروازه ویژگی `SELinuxMountReadWriteOncePod` در نسخه‌های 1.25 و 1.26 Kubernetes بود.