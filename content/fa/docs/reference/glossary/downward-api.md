---
title: API رو به پایین
id: downward-api
date: 2022-03-21
short_description: >
  مکانیزمی برای نمایش مقادیر فیلدهای Pod و container به کدی که در یک container اجرا می‌شود.
aka:
full_link: /docs/concepts/workloads/pods/downward-api/
tags:
- architecture
---
مکانیزم کوبرنتیز برای در معرض قرار دادن مقادیر فیلدهای Pod و کانتینر به کد در حال اجرا در یک کانتینر.
<!--more-->
گاهی مفید است که یک کانتینر بدون نیاز به اعمال تغییرات در کد کانتینر که آن را مستقیماً به کوبرنتیز متصل می‌کند، اطلاعاتی درباره خود داشته باشد.

Downward API کوبرنتیز به کانتینرها اجازه می‌دهد اطلاعاتی درباره خود یا زمینه‌شان در یک خوشه کوبرنتیز مصرف کنند. برنامه‌های درون کانتینر می‌توانند به آن اطلاعات دسترسی داشته باشند، بدون آنکه برنامه نیاز داشته باشد به‌عنوان یک کلاینت API کوبرنتیز عمل کند.

دو روش برای در معرض قرار دادن فیلدهای Pod و کانتینر به یک کانتینر در حال اجرا وجود دارد:

- استفاده از [متغیرهای محیطی](/docs/tasks/inject-data-application/environment-variable-expose-pod-information/)
- استفاده از یک حجم `downwardAPI`(/docs/tasks/inject-data-application/downward-api-volume-expose-pod-information/)

این دو روش در مجموع به‌عنوان _downward API_ شناخته می‌شوند.

