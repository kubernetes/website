---
title: کانتینر Init ‏(Init Container)
id: init-container
date: 2018-04-12
full_link: /fa/docs/concepts/workloads/pods/init-containers/
short_description: >
  یک یا چند کانتینر اولیه‌سازی که باید پیش از اجرای هر کانتینر برنامه تا پایان اجرا شوند.
aka:
tags:
- fundamental
---
 یک یا چند {{< glossary_tooltip text="کانتینر" term_id="container" >}} اولیه‌سازی که باید پیش از اجرای هر کانتینر برنامه تا پایان اجرا شوند.
<!--more-->

کانتینرهای اولیه‌سازی (init) مانند کانتینرهای معمول برنامه هستند، با یک تفاوت: کانتینرهای init باید پیش از آن‌که هر کانتینر برنامه‌ای بتواند شروع به کار کند، تا پایان اجرا شوند. کانتینرهای init به‌صورت متوالی اجرا می‌شوند؛ یعنی هر کانتینر init باید پیش از آغاز کانتینر init بعدی، اجرای خود را کامل کند.

برخلاف {{< glossary_tooltip text="کانتینرهای سایدکار" term_id="sidecar-container" >}}، کانتینرهای init پس از راه‌اندازی پاد در حال اجرا باقی نمی‌مانند.

برای اطلاعات بیشتر، بخش [کانتینرهای init](/fa/docs/concepts/workloads/pods/init-containers/) را بخوانید.
