---
title: DevicePluginCDIDevices
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.28"
    toVersion: "1.28"
  - stage: beta 
    defaultValue: true
    fromVersion: "1.29"
    toVersion: "1.30"
  - stage: stable
    defaultValue: true
    fromVersion: "1.31"
    
---
پشتیبانی از شناسه‌های دستگاه CDI را در API [Device Plugin](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/) فعال کنید.