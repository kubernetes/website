---
title: PodHostIPs
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
    fromVersion: "1.30"
    toVersion: "1.31"
removed: true

---
فیلد `status.hostIPs` را برای پادها و {{< glossary_tooltip term_id="downward-api" text="downward API" >}} فعال کنید.
این فیلد به شما امکان می‌دهد آدرس‌های IP میزبان را در معرض بارهای کاری قرار دهید.
