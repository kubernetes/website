---
title: Accelerators
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpgha 
    defaultValue: false
    fromVersion: "1.6"
    toVersion: "1.10"
  - stage: depricated
    fromVersion: "1.11"
    toVersion: "1.11"

removed: true
---
یک افزونه اولیه برای فعال کردن پشتیبانی از پردازنده گرافیکی انویدیا هنگام استفاده از موتور داکر ارائه شد؛ دیگر در دسترس نیست. برای یک جایگزین به [Device Plugins](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/) مراجعه کنید.
