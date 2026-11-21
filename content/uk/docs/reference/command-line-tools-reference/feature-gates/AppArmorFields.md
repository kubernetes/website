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
Вмикає параметри контексту безпеки, повʼязані з AppArmor.

Для отримання додаткової інформації про AppArmor і Kubernetes, дивіться [AppArmor](/docs/concepts/security/linux-kernel-security-constraints/#apparmor) у розділі [функції безпеки у ядрі Linux](/docs/concepts/security/linux-kernel-security-constraints/#linux-security-features).
