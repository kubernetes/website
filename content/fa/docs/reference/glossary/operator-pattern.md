---
title: الگوی اپراتور (Operator)
id: operator-pattern
full_link: /fa/docs/concepts/extend-kubernetes/operator/
short_description: >
  یک کنترل کننده تخصصی برای مدیریت یک منبع سفارشی (custom resource)
aka:
tags:
- architecture
---
[الگوی اپراتور](/fa/docs/concepts/extend-kubernetes/operator/) یک طراحی سامانه است
که یک {{< glossary_tooltip term_id="controller" >}} را به یک یا چند منبع سفارشی (custom resource) پیوند می‌دهد.

<!--more-->

می‌توانید کوبرنتیز را با افزودن کنترل کننده ها به کلاستر خود گسترش دهید؛ فراتر از کنترل کننده های
توکار (built-in) که به‌عنوان بخشی از خود کوبرنتیز ارائه می‌شوند.

اگر یک برنامه‌ی در حال اجرا نقش یک کنترل کننده را ایفا کند و دسترسی API داشته باشد تا وظایفی را
روی یک منبع سفارشی (custom resource) که در control plane تعریف شده است انجام دهد، این نمونه‌ای از الگوی
اپراتور است.
