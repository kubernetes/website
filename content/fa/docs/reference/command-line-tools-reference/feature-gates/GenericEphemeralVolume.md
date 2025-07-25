---
# Removed from Kubernetes
title: GenericEphemeralVolume
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.19"
    toVersion: "1.20"
  - stage: beta 
    defaultValue: true
    fromVersion: "1.21"
    toVersion: "1.22"    
  - stage: stable
    defaultValue: true
    fromVersion: "1.23"
    toVersion: "1.24"    

removed: true  
---
ولوم‌های موقت و درون‌خطی را فعال می‌کند که از تمام ویژگی‌های ولوم‌های معمولی پشتیبانی می‌کنند (می‌توانند توسط فروشندگان ذخیره‌سازی شخص ثالث ارائه شوند، ردیابی ظرفیت ذخیره‌سازی، بازیابی از اسنپ‌شات و غیره). به  [Ephemeral Volumes](/docs/concepts/storage/ephemeral-volumes/) مراجعه کنید.