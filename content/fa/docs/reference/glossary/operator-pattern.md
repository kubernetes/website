---
title: الگوی اپراتور
id: operator-pattern
date: 2019-05-21
full_link: /docs/concepts/extend-kubernetes/operator/
short_description: >
  یک کنترلر تخصصی برای مدیریت یک منبع سفارشی

aka:
tags:
- architecture
---
 [الگوی اپراتور](/docs/concepts/extend-kubernetes/operator/) یک طرح سیستم
است که یک {{< glossary_tooltip term_id="controller" >}} را به یک یا چند منبع سفارشی پیوند می‌دهد.

<!--more-->

می‌توانید با افزودن کنترلرهای اضافی به خوشهٔ خود، فراتر از کنترلرهای داخلیِ
کوبرنتیز، آن را گسترش دهید.

اگر یک برنامهٔ در حال اجرا به‌عنوان کنترلر عمل کند و دسترسی API برای انجام وظایف
روی یک منبع سفارشی تعریف‌شده در کنترل پلین داشته باشد، این نمونه‌ای از
الگوی اپراتور است.
