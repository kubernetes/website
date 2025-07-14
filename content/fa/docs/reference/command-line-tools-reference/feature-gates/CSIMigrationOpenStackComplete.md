---
# Removed from Kubernetes
title: CSIMigrationOpenStackComplete
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
ثبت افزونه درون‌درختی Cinder را در kubelet و کنترلرهای حجم متوقف می‌کند و shimها و منطق ترجمه را برای مسیریابی عملیات حجمی از افزونه درون‌درختی Cinder به افزونه Cinder CSI فعال می‌کند.
نیازمند فعال بودن پرچم‌های ویژگی CSIMigration و CSIMigrationOpenStack و نصب و پیکربندی افزونه Cinder CSI روی تمام گره‌های خوشه است. این پرچم به نفع پرچم ویژگی `InTreePluginOpenStackUnregister` منسوخ شده است که از ثبت افزونه درون‌درختی openstack cinder جلوگیری می‌کند.
