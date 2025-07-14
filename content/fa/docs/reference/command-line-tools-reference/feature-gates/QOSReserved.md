---
title: QOSReserved
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.11"
---
امکان رزرو منابع در سطح QoS را فراهم می‌کند و از هجوم پادها (Pods) در سطوح پایین‌تر QoS به منابع درخواست‌شده در سطوح بالاتر QoS جلوگیری می‌کند (فعلاً فقط حافظه).
