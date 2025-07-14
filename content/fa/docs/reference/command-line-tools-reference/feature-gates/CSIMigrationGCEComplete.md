---
# Removed from Kubernetes
title: CSIMigrationGCEComplete
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.17"
    toVersion: "1.20"
  - stage: deprecated
    fromVersion: "1.21"
    toVersion: "1.21"

removed: true
---
ثبت افزونه درون‌شاخه‌ای GCE-PD را در kubelet و کنترل‌کننده‌های حجم متوقف می‌کند و shimها و منطق ترجمه را برای مسیریابی عملیات حجم از افزونه درون‌شاخه‌ای GCE-PD به افزونه PD CSI فعال می‌کند.
نیازمند فعال بودن پرچم‌های ویژگی CSIMigration و CSIMigrationGCE و نصب و پیکربندی افزونه PD CSI در تمام گره‌های خوشه است. این پرچم به نفع پرچم ویژگی `InTreePluginGCEUnregister` که از ثبت افزونه درون‌شاخه‌ای GCE PD جلوگیری می‌کند، منسوخ شده است.