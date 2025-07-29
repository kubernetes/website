---
title: CRI-O
id: cri-o
date: 2019-05-14
full_link: https://cri-o.io/#what-is-cri-o
short_description: >
  یک کانتینر سبک مخصوص Kubernetes

aka:
tags:
- tool
---
یک ابزار که به شما امکان می‌دهد از زمان‌اجراهای کانتینر OCI با CRI کوبرنتس استفاده کنید.

<!--more-->

CRI-O پیاده‌سازی {{< glossary_tooltip term_id="cri" >}}
است تا استفاده از زمان‌اجراهای {{< glossary_tooltip text="container" term_id="container" >}}
سازگار با مشخصات زمان‌اجرا Open Container Initiative (OCI)
[runtime spec](https://www.github.com/opencontainers/runtime-spec) را ممکن سازد.

استقرار CRI-O اجازه می‌دهد کوبرنتس از هر زمان‌اجرای سازگار با OCI به‌عنوان زمان‌اجرای کانتینر برای اجرای {{< glossary_tooltip text="Pods" term_id="pod" >}} استفاده کند و تصاویر کانتینر OCI را از رجیستری‌های راه دور دریافت نماید.
