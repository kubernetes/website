---
title: AppArmor
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: true
    fromVersion: "1.4"
    toVersion: "1.30"
  - stage: stable
    defaultValue: true
    fromVersion: "1.31"
    toVersion: "1.32"

removed: true
---
Вмикає використання примусового контролю доступу AppArmor для Podʼів, що працюють на вузлах Linux. Докладнішу інформацію наведено у [Посібнику з AppArmor](/docs/tutorials/security/apparmor/).
