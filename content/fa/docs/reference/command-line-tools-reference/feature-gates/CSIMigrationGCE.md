---
title: CSIMigrationGCE
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.14"
    toVersion: "1.16"
  - stage: beta
    defaultValue: false
    fromVersion: "1.17"  
    toVersion: "1.22" 
  - stage: beta
    defaultValue: true
    fromVersion: "1.23"  
    toVersion: "1.24" 
  - stage: stable
    defaultValue: true
    fromVersion: "1.25"
    toVersion: "1.27" 

removed: true
---
شیم‌ها و منطق ترجمه را برای مسیریابی عملیات حجم از افزونه درون‌شاخه‌ای GCE-PD به افزونه PD CSI فعال می‌کند. از بازگشت به افزونه درون‌شاخه‌ای GCE برای عملیات نصب به گره‌هایی که این ویژگی غیرفعال است یا افزونه PD CSI نصب و پیکربندی نشده است، پشتیبانی می‌کند. از بازگشت به عملیات تأمین پشتیبانی نمی‌کند، برای این موارد افزونه CSI باید نصب و پیکربندی شود. نیاز به فعال بودن پرچم ویژگی CSIMigration دارد.