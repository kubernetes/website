---
id: pod-disruption
title: اختلال پاد (Pod Disruption)
full_link: /fa/docs/concepts/workloads/pods/disruptions/
date: 2021-05-12
short_description: >
  فرایندی که طی آن پادها روی گره‌ها به‌صورت داوطلبانه یا غیرداوطلبانه خاتمه می‌یابند.

aka:
related:
 - pod
 - container
tags:
 - operation
---

[اختلال پاد (Pod Disruption)](/fa/docs/concepts/workloads/pods/disruptions/) فرایندی است که طی آن
پادها روی گره‌ها به‌صورت داوطلبانه یا غیرداوطلبانه خاتمه می‌یابند.

<!--more--> 

اختلال‌های داوطلبانه به‌صورت عمدی توسط مالکان برنامه یا مدیران کلاستر آغاز می‌شوند.
اختلال‌های غیرداوطلبانه ناخواسته‌اند و می‌توانند به‌دلیل مسائل اجتناب‌ناپذیر مانند
اتمام منابع روی گره‌ها یا حذف‌های سهوی رخ دهند.
