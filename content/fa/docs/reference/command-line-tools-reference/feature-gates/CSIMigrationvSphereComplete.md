---
# Removed from Kubernetes
title: CSIMigrationvSphereComplete
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: beta 
    defaultValue: false
    fromVersion: "1.19"
    toVersion: "1.21"
  - stage: deprecated
    fromVersion: "1.22"
    toVersion: "1.22"

removed: true  
---
ثبت افزونه vSphere in-tree در kubelet و کنترل‌کننده‌های حجم را متوقف می‌کند و shimها و منطق ترجمه را برای مسیریابی عملیات حجم از افزونه vSphere in-tree به افزونه vSphere CSI فعال می‌کند. نیاز به فعال بودن پرچم‌های ویژگی CSIMigration و CSIMigrationvSphere و نصب و پیکربندی افزونه vSphere CSI در تمام گره‌های خوشه دارد. این پرچم به نفع پرچم ویژگی `InTreePluginvSphereUnregister` که از ثبت افزونه vSphere in-tree جلوگیری می‌کند، منسوخ شده است.
