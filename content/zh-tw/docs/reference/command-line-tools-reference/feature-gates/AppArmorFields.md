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
  
<!--
Enable AppArmor related security context settings.

For more information about AppArmor and Kubernetes, read the
[AppArmor](/docs/concepts/security/linux-kernel-security-constraints/#apparmor) section
within
[security features in the Linux kernel](/docs/concepts/security/linux-kernel-security-constraints/#linux-security-features).
-->
啓用與 AppArmor 相關的安全上下文設置。

有關 AppArmor 和 Kubernetes 的更多信息，請閱讀
[Linux 內核中的安全特性](/zh-cn/docs/concepts/security/linux-kernel-security-constraints/#linux-security-features)
部分中的 [AppArmor](/zh-cn/docs/concepts/security/linux-kernel-security-constraints/#apparmor)
小節。
