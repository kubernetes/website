---
title: SeparateTaintEvictionController
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: true
    fromVersion: "1.29"
---
اجرای `TaintEvictionController` را فعال می‌کند، که [Taint-based Evictions](/docs/concepts/scheduling-eviction/taint-and-toleration/#taint-based-evictions) را در یک کنترل‌کننده جدا از `NodeLifecycleController` انجام می‌دهد. هنگامی که این ویژگی فعال می‌شود، کاربران می‌توانند به صورت اختیاری Taint-based Eviction را با تنظیم پرچم `--controllers=-taint-eviction-controller` در `kube-controller-manager` غیرفعال کنند.