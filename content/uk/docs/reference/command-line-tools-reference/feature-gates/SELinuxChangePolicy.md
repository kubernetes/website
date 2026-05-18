---
title: SELinuxChangePolicy
content_type: feature_gate
build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.32"
    toVersion: "1.32"
  - stage: beta
    defaultValue: true
    fromVersion: "1.33"
    toVersion: "1.35"
  - stage: stable
    defaultValue: true
    fromVersion: "1.36"
---
Вмикає поле `spec.securityContext.seLinuxChangePolicy`.
За допомогою цього поля можна відмовитися від застосування мітки SELinux до томів podʼів за допомогою параметрів монтування. Це потрібно, якщо один том, який підтримує монтування за допомогою параметрів монтування SELinux, використовується спільно з іншими томами, які мають різні мітки SELinux, наприклад, привілейованим і непривілейованим томами.

Увімкнення `SELinuxChangePolicy` вимагає увімкнення `SELinuxMountReadWriteOncePod`.
