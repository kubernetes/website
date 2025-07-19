---
id: pod-disruption-budget
title: بودجه اختلال پاد
full-link: /docs/concepts/workloads/pods/disruptions/
date: 2019-02-12
short_description: >
  شیئی که تعداد پادهای یک برنامه تکرارشده را که هم‌زمان به‌دلیل اختلالات داوطلبانه از دسترس خارج می‌شوند، محدود می‌کند.

aka:
 - PDB
related:
 - pod
 - container
tags:
 - operation
---

 یک [بودجه اختلال پاد](/docs/concepts/workloads/pods/disruptions/) به مالک برنامه اجازه می‌دهد
 شیئی برای یک برنامه تکرارشده بسازد که تضمین کند تعداد یا درصد مشخصی از
 {{< glossary_tooltip text="Pods" term_id="pod" >}} با برچسب تعیین‌شده در هیچ لحظه‌ای
 به‌صورت داوطلبانه حذف یا جابه‌جا نشوند.

<!--more--> 

اختلالات غیرداوطلبانه را نمی‌توان با PDB جلوگیری کرد؛ با این حال، این اختلالات در بودجه حساب می‌شوند.
