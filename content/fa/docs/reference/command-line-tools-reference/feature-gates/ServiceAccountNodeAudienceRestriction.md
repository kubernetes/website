---
title: ServiceAcccountNodeAudienceRestriction
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: false
    fromVersion: "1.32"
    toVersion: "1.32"
  - stage: beta
    defaultValue: true
    fromVersion: "1.33"  

---
این دروازه برای محدود کردن مخاطبانی که kubelet می‌تواند برای آنها درخواست توکن حساب سرویس کند، استفاده می‌شود.