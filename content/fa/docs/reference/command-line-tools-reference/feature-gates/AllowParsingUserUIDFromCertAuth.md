---
title: AllowParsingUserUIDFromCertAuth
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.33"

---

وقتی این ویژگی فعال باشد، ویژگی نام موضوع `1.3.6.1.4.1.57683.2` در گواهی X.509 به عنوان شناسه کاربری کاربر در طول احراز هویت گواهی تجزیه می‌شود.
