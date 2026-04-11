---
title: الگوی اپراتور (Operator)
id: operator-pattern
date: 2019-05-21
full_link: /fa/docs/concepts/extend-kubernetes/operator/
short_description: >
  یک کنترلر تخصصی برای مدیریت یک منبع سفارشی (custom resource)
aka:
tags:
- architecture
---
[الگوی اپراتور](/fa/docs/concepts/extend-kubernetes/operator/) یک طراحی سامانه است
که یک {{< glossary_tooltip term_id="controller" >}} را به یک یا چند منبع سفارشی (custom resource) پیوند می‌دهد.

<!--more-->

می‌توانید کوبرنتیز را با افزودن کنترلرها به کلاستر خود گسترش دهید؛ فراتر از کنترلرهای
توکار (built-in) که به‌عنوان بخشی از خود کوبرنتیز ارائه می‌شوند.

اگر یک برنامه‌ی در حال اجرا نقش یک کنترلر را ایفا کند و دسترسی API داشته باشد تا وظایفی را
روی یک منبع سفارشی (custom resource) که در کنترل پلین تعریف شده است انجام دهد، این نمونه‌ای از الگوی
اپراتور است.
