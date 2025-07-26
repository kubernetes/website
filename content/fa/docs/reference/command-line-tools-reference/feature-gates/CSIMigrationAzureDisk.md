---
# Removed from Kubernetes
title: CSIMigrationAzureDisk
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.15"
    toVersion: "1.18"
  - stage: beta
    defaultValue: false
    fromVersion: "1.19"  
    toVersion: "1.22" 
  - stage: beta
    defaultValue: true
    fromVersion: "1.23"  
    toVersion: "1.23" 
  - stage: stable
    defaultValue: true
    fromVersion: "1.24"
    toVersion: "1.26"     

removed: true
---
شیم‌ها و منطق ترجمه را برای مسیریابی عملیات حجم از افزونه درون‌خوشه ای Azure-Disk به افزونه AzureDisk CSI فعال می‌کند.
از بازگشت به افزونه درون‌شاخه‌ای AzureDisk برای عملیات mount به گره‌هایی که این ویژگی غیرفعال است یا افزونه AzureDisk CSI نصب و پیکربندی نشده است، پشتیبانی می‌کند. از بازگشت به عملیات آماده‌سازی پشتیبانی نمی‌کند، برای این موارد افزونه CSI باید نصب و پیکربندی شود.
نیاز به فعال بودن پرچم ویژگی CSIMigration دارد.
