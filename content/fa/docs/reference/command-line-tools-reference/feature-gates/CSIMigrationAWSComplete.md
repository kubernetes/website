---
# Removed from Kubernetes
title: CSIMigrationAWSComplete
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
Stops registering the EBS in-tree plugin in
kubelet and volume controllers and enables shims and translation logic to
route volume operations from the AWS-EBS in-tree plugin to EBS CSI plugin.
Requires CSIMigration and CSIMigrationAWS feature flags enabled and EBS CSI
plugin installed and configured on all nodes in the cluster. This flag has
been deprecated in favor of the `InTreePluginAWSUnregister` feature flag
which prevents the registration of in-tree EBS plugin.

ثبت افزونه درون‌شاخه‌ای EBS را در kubelet و کنترل‌کننده‌های حجم متوقف می‌کند و shimها و منطق ترجمه را برای مسیریابی عملیات حجم از افزونه درون‌شاخه‌ای AWS-EBS به افزونه EBS CSI فعال می‌کند.
نیازمند فعال بودن پرچم‌های ویژگی CSIMigration و CSIMigrationAWS و نصب و پیکربندی افزونه EBS CSI در تمام گره‌های خوشه است. این پرچم به نفع پرچم ویژگی `InTreePluginAWSUnregister` منسوخ شده است که از ثبت افزونه EBS درون‌خوشهای جلوگیری می‌کند.