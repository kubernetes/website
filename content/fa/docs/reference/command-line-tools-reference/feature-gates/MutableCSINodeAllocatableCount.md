---
title: MutableCSINodeAllocatableCount
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.33"
---
وقتی این قابلیت فعال می‌شود، فیلد `CSINode.Spec.Drivers[*].Allocatable.Count` تغییرپذیر می‌شود و فیلد جدیدی به نام `NodeAllocatableUpdatePeriodSeconds` در شیء `CSIDriver` در دسترس قرار می‌گیرد. این امر امکان به‌روزرسانی‌های دوره‌ای ظرفیت حجم قابل تخصیص گزارش‌شده‌ی یک گره را فراهم می‌کند و از گیر افتادن پادهای دارای وضعیت به دلیل اطلاعات قدیمی که `kube-scheduler` به آن متکی است، جلوگیری می‌کند.