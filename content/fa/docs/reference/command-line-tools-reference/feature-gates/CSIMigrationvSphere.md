---
title: CSIMigrationvSphere
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.18"
    toVersion: "1.18"
  - stage: beta
    defaultValue: false
    fromVersion: "1.19"  
    toVersion: "1.24" 
  - stage: beta
    defaultValue: true
    fromVersion: "1.25"  
    toVersion: "1.25" 
  - stage: stable
    defaultValue: true
    fromVersion: "1.26"  
    toVersion: "1.28"     

removed: true
---
شیم‌ها و منطق ترجمه را برای مسیریابی عملیات حجم از افزونه vSphere in-tree به افزونه vSphere CSI فعال می‌کند. از بازگشت به افزونه vSphere in-tree برای عملیات mount به گره‌هایی که این ویژگی غیرفعال است یا افزونه vSphere CSI نصب و پیکربندی نشده است، پشتیبانی می‌کند. از بازگشت به عملیات provision پشتیبانی نمی‌کند، برای این موارد افزونه CSI باید نصب و پیکربندی شود. نیاز به فعال بودن پرچم ویژگی CSIMigration دارد.
