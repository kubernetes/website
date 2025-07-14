---
title: OpenAPIEnums
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.23"
    toVersion: "1.23"
  - stage: beta
    defaultValue: true
    fromVersion: "1.24"
---
پر کردن فیلدهای "enum" از طرحواره‌های OpenAPI را در مشخصات برگردانده شده از سرور API فعال می‌کند.