---
title: KubeletSeparateDiskGC
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.29"
    toVersion: "1.30"
  - stage: beta
    defaultValue: true
    fromVersion: "1.31"
---
ویژگی سیستم فایل تصویر تقسیم‌شده، kubelet را قادر می‌سازد تا جمع‌آوری زباله تصاویر (read-only layers) و/یا کانتینرها (writeable layers) مستقر در سیستم فایل‌های جداگانه را انجام دهد.