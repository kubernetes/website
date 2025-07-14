---
title: VolumeCapacityPriority
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.21"
    toVersion: "1.32"

removed: true
---
پشتیبانی از اولویت‌بندی گره‌ها در توپولوژی‌های مختلف بر اساس ظرفیت PV موجود را فعال کنید. این ویژگی در نسخه ۱.۳۳ به `StorageCapacityScoring` تغییر نام داده است.