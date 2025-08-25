---
# Removed from Kubernetes
title: ResourceLimitsPriorityFunction
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.9"
    toVersion: "1.18"
  - stage: deprecated
    fromVersion: "1.19"
    toVersion: "1.19"

removed: true
---
یک تابع اولویت زمان‌بندی را فعال کنید که کمترین امتیاز ممکن یعنی ۱ را به گره‌ای اختصاص دهد که حداقل یکی از محدودیت‌های پردازنده و حافظه‌ی پاد ورودی را برآورده کند. هدف، شکستن پیوندهای بین گره‌هایی با امتیازات یکسان است.
