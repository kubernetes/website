---
title: kube-scheduler
id: kube-scheduler
full_link: /docs/reference/command-line-tools-reference/kube-scheduler/
short_description: >
  جزء کنترل پلین که پادهای تازه‌ساخته‌شده‌ی بدون اختصاص شده به گره‌ای (node) را رصد می‌کند و یک گره را برای اجرای آن‌ها انتخاب می‌کند.

aka: 
tags:
- architecture
---
 جزء کنترل پلین که {{< glossary_tooltip term_id="pod" text="پادها" >}}ی تازه‌ساخته‌شده‌ی بدون {{< glossary_tooltip term_id="node" text="گره">}} اختصاص شده را رصد می‌کند
و یک گره را برای اجرای آن‌ها انتخاب می‌کند.

<!--more-->

عواملی که در تصمیم‌های scheduling در نظر گرفته می‌شوند شامل این‌ها هستند:
نیازهای منابع به‌صورت فردی و جمعی، محدودیت‌های سخت‌افزاری/نرم‌افزاری/سیاستی،
مشخصات Affinity (وابستگی) و Anti-Affinity (ضدوابستگی)، محلی‌بودن داده،
تداخل بین ورک‌لودها، و ضرب‌الاجل‌ها.
