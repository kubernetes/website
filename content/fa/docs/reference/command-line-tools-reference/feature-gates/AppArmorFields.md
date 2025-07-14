---
title: AppArmorFields
content_type: feature_gate
_build:
  list: never

  render: false

stages:
  - stage: beta
    defaultValue: true
    fromVersion: "1.30"
    toVersion: "1.30"
  - stage: stable
    defaultValue: true
    fromVersion: "1.31"
    toVersion: "1.32"

removed: true
---
تنظیمات زمینه امنیتی مرتبط با AppArmor را فعال کنید.
برای اطلاعات بیشتر در مورد AppArmor و Kubernetes، بخش [AppArmor](/docs/concepts/security/linux-kernel-security-constraints/#apparmor) را در [security features in the Linux kernel](/docs/concepts/security/linux-kernel-security-constraints/#linux-security-features) مطالعه کنید.