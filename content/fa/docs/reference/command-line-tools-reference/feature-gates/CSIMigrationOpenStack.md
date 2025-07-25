---
# Removed from Kubernetes
title: CSIMigrationOpenStack
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.14"
    toVersion: "1.17"  
  - stage: beta 
    defaultValue: true
    fromVersion: "1.18"
    toVersion: "1.23"    
  - stage: stable
    defaultValue: true
    fromVersion: "1.24"
    toVersion: "1.25"    

removed: true
---
شیم‌ها و منطق ترجمه را برای مسیریابی عملیات حجم از افزونه درون‌درختی Cinder به افزونه Cinder CSI فعال می‌کند. از بازگشت به افزونه درون‌درختی Cinder برای عملیات mount به گره‌هایی که این ویژگی غیرفعال است یا افزونه Cinder CSI نصب و پیکربندی نشده است، پشتیبانی می‌کند. از بازگشت به عملیات آماده‌سازی پشتیبانی نمی‌کند، برای این موارد افزونه CSI باید نصب و پیکربندی شود. نیاز به فعال بودن پرچم ویژگی CSIMigration دارد.
