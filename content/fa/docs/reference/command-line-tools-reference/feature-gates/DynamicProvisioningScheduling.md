---
# Removed from Kubernetes
title: DynamicProvisioningScheduling
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.11"
    toVersion: "1.11"
  - stage: deprecated
    fromVersion: "1.12"

removed: true  
---
دهید تا از توپولوژی حجم آگاه باشد و تأمین PV را مدیریت کند. این ویژگی در نسخه ۱.۱۲ با ویژگی `VolumeScheduling` جایگزین شد.