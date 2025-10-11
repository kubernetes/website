---
title: پروکسی نسخه‌های ترکیبی (MVP)
id: mvp
date: 2023-07-24
full_link: /fa/docs/concepts/architecture/mixed-version-proxy/
short_description: >
  قابلیتی که به kube-apiserver اجازه می‌دهد درخواست یک منبع را به یک سرور API همتای دیگر پروکسی کند.
aka: ["MVP"]
tags:
- architecture
---
قابیتی که به kube-apiserver اجازه می‌دهد درخواست یک منبع را به یک سرور API همتای دیگر پروکسی کند.

<!--more-->

زمانی که یک کلاستر چند سرور API را با نسخه‌های متفاوت کوبرنتیز اجرا می‌کند، این قابلیت تضمین می‌کند که درخواست‌های مربوط به منابع توسط سرور API درست رسیدگی شوند.

MVP به‌طور پیش‌فرض غیرفعال است و می‌توان آن را با فعال‌کردن
[feature gate](/fa/docs/reference/command-line-tools-reference/feature-gates/) با نام `UnknownVersionInteroperabilityProxy`
هنگام راه‌اندازی {{< glossary_tooltip text="سرور API" term_id="kube-apiserver" >}} فعال کرد.
