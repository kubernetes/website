---
title: CRDValidationRatcheting
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.28"
    toVersion: "1.29"
  - stage: beta
    defaultValue: true
    fromVersion: "1.30"
    toVersion: "1.32"
  - stage: stable
    defaultValue: true
    fromVersion: "1.33"
---
به‌روزرسانی‌های منابع سفارشی را فعال کنید تا در صورت عدم تغییر بخش‌های مشکل‌ساز به‌روزرسانی منبع، موارد نقض طرح OpenAPI آنها را شامل شود. برای جزئیات بیشتر به [Validation Ratcheting](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#validation-ratcheting) مراجعه کنید.
