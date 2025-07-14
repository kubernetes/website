---
# Removed from Kubernetes
title: CSIMigrationAWS
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
    toVersion: "1.26"    

removed: true
---
shims و منطق ترجمه را برای مسیریابی عملیات حجم از افزونه درون‌کلاسترای AWS-EBS به افزونه EBS CSI فعال می‌کند. از بازگشت به افزونه درون‌شاخه‌ای EBS برای عملیات نصب در گره‌هایی که این ویژگی غیرفعال است یا افزونه EBS CSI نصب و پیکربندی نشده است، پشتیبانی می‌کند. از بازگشت به عملیات تأمین پشتیبانی نمی‌کند، برای این موارد افزونه CSI باید نصب و پیکربندی شود.