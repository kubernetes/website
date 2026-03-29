---
title: Downward API
id: downward-api
date: 2022-03-21
short_description: >
  سازوکاری برای نمایش مقادیر فیلدهای Pod و container به کدی که در یک container اجرا می‌شود.
aka:
full_link: /docs/concepts/workloads/pods/downward-api/
tags:
- architecture
---
سازوکار کوبرنتیز برای نمایش مقادیر فیلدهای Pod و Container به کدی که در یک Container اجرا می‌شود.
<!--more-->
گاهی اوقات مفید است که یک کانتینر اطلاعاتی در مورد خودش داشته باشد، بدون اینکه نیازی به ایجاد تغییراتی در کد کانتینر باشد که مستقیماً آن را به کوبرنتیز متصل می‌کند.

Downward API کوبرنتیز به کانتینرها اجازه می‌دهد تا اطلاعات مربوط به خود یا زمینه خود را در یک خوشه(cluster) کوبرنتیز مصرف کنند. برنامه‌های موجود در کانتینرها می‌توانند به آن اطلاعات دسترسی داشته باشند، بدون اینکه برنامه نیاز داشته باشد به عنوان کلاینت API کوبرنتیز عمل کند.

دو راه برای نمایش فیلدهای Pod و container به یک container در حال اجرا وجود دارد:

- با استفاده از [متغیرهای محیطی](/docs/tasks/inject-data-application/environment-variable-expose-pod-information/)
- با استفاده از [یک حجم `downwardAPI`](/docs/tasks/inject-data-application/downward-api-volume-expose-pod-information/)

این دو روش برای نمایش فیلدهای Pod و container با هم، _downward API_ نامیده می‌شوند.

