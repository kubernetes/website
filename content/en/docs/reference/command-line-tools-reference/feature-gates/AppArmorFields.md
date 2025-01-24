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
---
Enable AppArmor related security context settings.

For more information about AppArmor and Kubernetes, read the
[AppArmor](/docs/concepts/security/linux-kernel-security-constraints/#apparmor) section
within
[security features in the Linux kernel](/docs/concepts/security/linux-kernel-security-constraints/#linux-security-features).
