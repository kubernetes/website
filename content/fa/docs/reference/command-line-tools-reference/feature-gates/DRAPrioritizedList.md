---
title: DRAPrioritizedList
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.33"
---
پشتیبانی از ویژگی [Prioritized List](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#prioritized-list) را فعال می‌کند. این ویژگی امکان تعیین یک لیست اولویت‌بندی‌شده از زیردرخواست‌ها را برای درخواست‌ها در یک ResourceClaim فراهم می‌کند.

این ویژگی تا زمانی که ویژگی `DynamicResourceAllocation` را نیز فعال نکنید، هیچ تاثیری ندارد.