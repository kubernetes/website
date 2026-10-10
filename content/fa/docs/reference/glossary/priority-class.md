---
title: PriorityClass
id: priority-class
full_link: /fa/docs/concepts/scheduling-eviction/pod-priority-preemption/#priorityclass
short_description: >
  نگاشتی از نام یک کلاس به اولویت scheduling (زمان بندی) که یک پاد باید داشته باشد.
aka:
tags:
- core-object
---
PriorityClass کلاسی نام‌گذاری‌شده برای اولویت scheduling (زمان بندی) است که باید به پادهای آن کلاس تخصیص یابد.

<!--more-->

[PriorityClass](/fa/docs/concepts/scheduling-eviction/pod-priority-preemption/#how-to-use-priority-and-preemption)
یک آبجکت بدون namespace است که یک نام را به یک مقدار عدد صحیح اولویت نگاشت می‌کند و برای یک پاد به‌کار می‌رود.
نام در فیلد `metadata.name` مشخص می‌شود و مقدار اولویت در فیلد `value` قرار می‌گیرد.
بازه‌ی اولویت‌ها از `-2147483648` تا `1000000000` (شامل کران‌ها) است. مقدارهای بزرگ‌تر نشان‌دهنده‌ی اولویت بالاتر هستند.
