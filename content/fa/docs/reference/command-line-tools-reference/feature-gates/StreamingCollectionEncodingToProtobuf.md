---
title: StreamingCollectionEncodingToProtobuf
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: true
    fromVersion: "1.33"

---
به رمزگذار Protobuf سرور API اجازه دهید تا مجموعه‌ها را به صورت آیتم به آیتم، به جای همه به طور همزمان، رمزگذاری کند.