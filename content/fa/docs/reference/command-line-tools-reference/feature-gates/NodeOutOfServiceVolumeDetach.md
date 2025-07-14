---
title: NodeOutOfServiceVolumeDetach
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.24"
    toVersion: "1.25"
  - stage: beta
    defaultValue: true
    fromVersion: "1.26"  
    toVersion: "1.27" 
  - stage: stable
    defaultValue: true
    fromVersion: "1.28"  
    toVersion: "1.31"

removed: true
---
قتی یک گره با استفاده از کد مخرب `node.kubernetes.io/out-of-service` خارج از سرویس علامت‌گذاری می‌شود، Podهای روی گره در صورت عدم تحمل این کد مخرب، به اجبار حذف می‌شوند و عملیات جداسازی حجم برای Podهایی که در حال خاتمه دادن به آن هستند، بلافاصله روی گره انجام می‌شود. Podهای حذف شده می‌توانند به سرعت در گره‌های مختلف بازیابی شوند.
