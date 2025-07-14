---
title: CSIMigrationRBD
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.23"
    toVersion: "1.27"
  - stage: deprecated
    defaultValue: false
    fromVersion: "1.28"
    toVersion: "1.30"

removed: true
---
فعال کردن شیم‌ها و منطق ترجمه برای مسیریابی عملیات حجم از افزونه درون درختی RBD به افزونه Ceph RBD CSI. نیاز به فعال بودن پرچم‌های ویژگی CSIMigration و csiMigrationRBD و نصب و پیکربندی افزونه Ceph CSI در خوشه دارد.
این دروازه ویژگی به نفع دروازه ویژگی `InTreePluginRBDUnregister` منسوخ شده است، که از ثبت افزونه درون درختی RBD جلوگیری می‌کند.