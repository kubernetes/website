---
title: کلاس اولویت
id: priority-class
date: 2024-03-19
full_link: /docs/concepts/scheduling-eviction/pod-priority-preemption/#priorityclass
short_description: >
  نگاشتی از یک نام کلاس به اولویت زمان‌بندی که یک پاد باید داشته باشد.
aka:
tags:
- core-object
---
 یک PriorityClass کلاسی نام‌گذاری‌شده برای اولویت زمان‌بندی است که باید به پادهای آن کلاس اختصاص یابد.

<!--more-->

یک [PriorityClass](/docs/concepts/scheduling-eviction/pod-priority-preemption/#how-to-use-priority-and-preemption)
شیئی غیرِ نام‌فضا‌دار است که یک نام را به یک مقدار عددی اولویت برای یک {{< glossary_tooltip term_id="pod" text="Pod" >}} نگاشت می‌کند.  
نام در فیلد `metadata.name` و مقدار اولویت در فیلد `value` مشخص می‌شود.  
مقادیر اولویت در بازه -2147483648 تا 1000000000 (شامل هر دو حد) قرار دارند؛  
اعداد بزرگ‌تر نشان‌دهنده اولویت بالاتر هستند.