---
id: pod-disruption-budget
title: بودجه‌ی اختلال پاد (Pod Disruption Budget)
full-link: /fa/docs/concepts/workloads/pods/disruptions/
date: 2019-02-12
short_description: >
  یک آبجکت که در برابر اختلالات داوطلبانه، حد بالایی برای تعداد پادهای ازکارافتاده‌ی
  یک برنامه‌ی تکثیرشده تعیین می‌کند.
aka:
 - PDB
related:
 - pod
 - container
tags:
 - operation
---

[بودجه‌ی اختلال پاد (Pod Disruption Budget)](/fa/docs/concepts/workloads/pods/disruptions/)
به مالک یک برنامه اجازه می‌دهد برای یک برنامه‌ی تکثیرشده آبجکتی ایجاد کند که تضمین کند
تعداد یا درصد معینی از {{< glossary_tooltip text="پادها" term_id="pod" >}} با لیبل مشخص،
در هیچ زمانی به‌صورت داوطلبانه اخراج (evicted) نشوند.

<!--more-->

اختلالات غیرداوطلبانه توسط PDB قابل پیشگیری نیستند؛ بااین‌حال، در محاسبه‌ی بودجه منظور می‌شوند.
