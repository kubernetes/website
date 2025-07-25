---
title: RetryGenerateName
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.30"
    toVersion: "1.30"
  - stage: beta
    defaultValue: true
    fromVersion: "1.31"
    toVersion: "1.31"
  - stage: stable
    defaultValue: true
    fromVersion: "1.32"
---
وقتی انتظار می‌رود {{< glossary_tooltip text="API server" term_id="kube-apiserver" >}}
یک [name](/docs/concepts/overview/working-with-objects/names/#names) تولید کند، تلاش مجدد برای ایجاد شیء را فعال می‌کند.

وقتی این ویژگی فعال باشد، در صورتی که صفحه کنترل، تداخل نام با یک شیء موجود را تشخیص دهد، درخواست‌هایی که از `generateName` استفاده می‌کنند، به طور خودکار تا سقف ۸ تلاش در کل، دوباره امتحان می‌شوند.