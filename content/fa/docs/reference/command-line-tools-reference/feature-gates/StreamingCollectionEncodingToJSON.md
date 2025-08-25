---
title: StreamingCollectionEncodingToJSON
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: true
    fromVersion: "1.33"

---
به رمزگذار JSON سرور API اجازه دهید مجموعه‌ها را به صورت آیتم به آیتم، به جای همه به طور همزمان، رمزگذاری کند.