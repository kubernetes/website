---
title: CSIMigrationPortworx
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.23"
    toVersion: "1.24"
  - stage: beta
    defaultValue: false
    fromVersion: "1.25"
    toVersion: "1.30"
  - stage: beta
    defaultValue: true
    fromVersion: "1.31"
    toVersion: "1.32"
  - stage: stable
    defaultValue: true
    fromVersion: "1.33"
---
شیم‌ها و منطق ترجمه را برای مسیریابی عملیات حجمی از افزونه درون‌درختی Portworx به افزونه Portworx CSI فعال می‌کند.
نیازمند نصب و پیکربندی درایور Portworx CSI در خوشه است.
