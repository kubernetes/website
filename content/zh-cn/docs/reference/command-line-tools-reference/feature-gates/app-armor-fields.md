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
  
<!--
Enable AppArmor related security context settings.

For more information about AppArmor and Kubernetes, read the
[AppArmor](/docs/concepts/security/linux-kernel-security-constraints/#apparmor) section
within
[security features in the Linux kernel](/docs/concepts/security/linux-kernel-security-constraints/#linux-security-features).
-->
启用与 AppArmor 相关的安全上下文设置。

有关 AppArmor 和 Kubernetes 的更多信息，请阅读
[Linux 内核中的安全特性](/zh-cn/docs/concepts/security/linux-kernel-security-constraints/#linux-security-features)
部分中的 [AppArmor](/zh-cn/docs/concepts/security/linux-kernel-security-constraints/#apparmor)
小节。
