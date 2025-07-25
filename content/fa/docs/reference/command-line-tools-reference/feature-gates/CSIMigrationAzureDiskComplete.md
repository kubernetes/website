---
# Removed from Kubernetes
title: CSIMigrationAzureDiskComplete
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
ثبت افزونه درون‌شاخه‌ای Azure-Disk را در kubelet و کنترلرهای حجم متوقف می‌کند و shimها و منطق ترجمه را قادر می‌سازد تا عملیات حجم را از افزونه درون‌شاخه‌ای Azure-Disk به افزونه AzureDisk CSI مسیریابی کنند. نیاز به فعال بودن پرچم‌های ویژگی CSIMigration و CSIMigrationAzureDisk و نصب و پیکربندی افزونه AzureDisk CSI در تمام گره‌های خوشه دارد. این پرچم به نفع پرچم ویژگی `InTreePluginAzureDiskUnregister` که از ثبت افزونه درون‌شاخه‌ای AzureDisk جلوگیری می‌کند، منسوخ شده است.