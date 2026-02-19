---
title: DeviceClass
id: deviceclass
date: 2025-05-26
full_link: /docs/concepts/scheduling-eviction/dynamic-resource-allocation/#deviceclass
short_description: >
  دسته‌ای از دستگاه‌ها در cluster. کاربران می‌توانند دستگاه‌های خاصی را در یک DeviceClass ثبت کنند.
tags:
- extension
---
 دسته‌ای از {{< glossary_tooltip text="دستگاه‌ها" term_id="device" >}} در cluster که می‌تواند با تخصیص منابع پویا (DRA) مورد استفاده قرار گیرد.

<!--more-->

مدیران یا صاحبان دستگاه از DeviceClass برای تعریف مجموعه‌ای از دستگاه‌هایی که می‌توانند ادعا شوند و در بارهای کاری استفاده شوند، استفاده می‌کنند. دستگاه‌ها با ایجاد {{< glossary_tooltip text="ResourceClaims" term_id="resourceclaim" >}} که پارامترهای خاص دستگاه را در یک DeviceClass فیلتر می‌کنند، ادعا می‌شوند.

برای اطلاعات بیشتر، به [تخصیص پویای منابع](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#deviceclass) مراجعه کنید.
