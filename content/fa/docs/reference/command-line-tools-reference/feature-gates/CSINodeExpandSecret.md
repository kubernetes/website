---
title: CSINodeExpandSecret
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.25"
    toVersion: "1.26"
  - stage: beta
    defaultValue: true
    fromVersion: "1.27"  
    toVersion: "1.28" 
  - stage: stable
    defaultValue: true
    fromVersion: "1.29"
    toVersion: "1.30"

removed: true
---
فعال کردن ارسال داده‌های احراز هویت مخفی به درایور CSI برای استفاده در طول عملیات CSI مربوط به `NodeExpandVolume`.
