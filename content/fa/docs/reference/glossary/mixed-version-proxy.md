---
title: پراکسی نسخهٔ مختلط (MVP)
id: mvp
date: 2023-07-24
full_link: /docs/concepts/architecture/mixed-version-proxy/
short_description: >
  ویژگی‌ای که به kube-apiserver امکان می‌دهد یک درخواست منبع را به سرور API همتای دیگری پروکسی کند.
aka: ["MVP"]
tags:
- architecture
---
 ویژگی‌ای برای اینکه kube-apiserver درخواست یک منبع را به سرور API همتای دیگری پروکسی کند.

<!--more-->

وقتی یک خوشه چندین سرور API با نسخه‌های متفاوت کوبرنتیز داشته باشد،  
این ویژگی امکان می‌دهد درخواست‌های منبع توسط سرور API مناسب سرویس‌دهی شوند.

MVP به‌صورت پیش‌فرض غیرفعال است و می‌توان آن را با فعال کردن
[دروازهٔ ویژگی](/docs/reference/command-line-tools-reference/feature-gates/) به نام `UnknownVersionInteroperabilityProxy`
هنگام راه‌اندازی {{< glossary_tooltip text="API Server" term_id="kube-apiserver" >}} فعال کرد.
