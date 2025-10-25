---
title: WindowsGracefulNodeShutdown
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.32"

---
پشتیبانی از خاموش کردن ظریف گره ویندوز را در kubelet فعال می‌کند.
در طول خاموش شدن سیستم، kubelet تلاش می‌کند تا رویداد خاموش شدن را تشخیص دهد
و به طور ظریف پادهای در حال اجرا روی گره را خاتمه دهد. برای جزئیات بیشتر به
[Graceful Node Shutdown](/docs/concepts/architecture/nodes/#graceful-node-shutdown) مراجعه کنید.