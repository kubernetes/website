---
title: CBORServingAndStorage
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.32"
---
CBOR را به عنوان [supported encoding for requests and
responses](/docs/reference/using-api/api-concepts/#cbor-encoding) و به عنوان رمزگذاری ذخیره‌سازی ترجیحی برای منابع سفارشی فعال می‌کند.
