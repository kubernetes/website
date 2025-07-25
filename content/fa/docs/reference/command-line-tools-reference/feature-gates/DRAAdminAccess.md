---
title: DRAAdminAccess
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.32"
---
This feature gate has no effect unless you also enable the `DynamicResourceAllocation` feature gate.
پشتیبانی از درخواست [دسترسی ادمین](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#admin-access)
در یک ResourceClaim یا یک ResourceClaimTemplate را فعال می‌کند. دسترسی ادمین، دسترسی به دستگاه‌های در حال استفاده را اعطا می‌کند و ممکن است هنگام در دسترس قرار دادن دستگاه در یک کانتینر، مجوزهای اضافی را فعال کند. با شروع Kubernetes v1.33، فقط کاربرانی که مجاز به ایجاد اشیاء ResourceClaim یا ResourceClaimTemplate در فضاهای نامی با برچسب `resource.k8s.io/admin-access: "true"` (حساس به حروف بزرگ و کوچک) هستند، می‌توانند از فیلد `adminAccess` استفاده کنند. این تضمین می‌کند که کاربران غیر ادمین نمی‌توانند از این ویژگی سوءاستفاده کنند.

این دروازه ویژگی هیچ تاثیری ندارد مگر اینکه دروازه ویژگی `DynamicResourceAllocation` را نیز فعال کنید.