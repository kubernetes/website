---
title: CSIMigrationAzureFile
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.15"
    toVersion: "1.20"
  - stage: beta
    defaultValue: false
    fromVersion: "1.21"  
    toVersion: "1.23" 
  - stage: beta
    defaultValue: true
    fromVersion: "1.24"  
    toVersion: "1.25" 
  - stage: stable
    defaultValue: true
    fromVersion: "1.26"  
    toVersion: "1.29" 
removed: true
---
shim ها  و منطق ترجمه را برای مسیریابی عملیات حجم از افزونه درون‌شاخه‌ای Azure-File به افزونه AzureFile CSI فعال می‌کند. از بازگشت به افزونه درون‌شاخه‌ای AzureFile برای عملیات mount به گره‌هایی که این ویژگی غیرفعال است یا افزونه AzureFile CSI نصب و پیکربندی نشده است، پشتیبانی می‌کند. از بازگشت به عملیات آماده‌سازی پشتیبانی نمی‌کند، برای این موارد افزونه CSI باید نصب و پیکربندی شود. نیاز به فعال بودن پرچم ویژگی CSIMigration دارد.