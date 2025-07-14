---
title: APIServingWithRoute
content_type: feature_gate
_build:
  list: never
  render: false
stages:
  - stage: aplgha 
    defaultValue: false
    fromVersion: "1.30"
---
این دروازه ویژگی، بهبود عملکرد سرور API را امکان‌پذیر می‌کند:
سرور API می‌تواند از گوروتین‌های جداگانه (رشته‌های سبک مدیریت‌شده توسط زمان اجرای Go) برای ارائه درخواست‌های [**watch**](/docs/reference/using-api/api-concepts/#efficient-detection-of-changes) استفاده کند.