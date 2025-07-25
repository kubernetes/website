---
title: GracefulNodeShutdown
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.20"
    toVersion: "1.20"
  - stage: beta
    defaultValue: true
    fromVersion: "1.21"
---
پشتیبانی از خاموش کردن با ظرافت (graceful shutdown) را در kubelet فعال می‌کند.
در طول خاموش شدن سیستم، kubelet تلاش می‌کند تا رویداد خاموش شدن را تشخیص دهد
و پادهای در حال اجرا روی گره را به طور با ظرافت خاتمه دهد. برای جزئیات بیشتر به
[Graceful Node Shutdown](/docs/concepts/architecture/nodes/#graceful-node-shutdown) مراجعه کنید.