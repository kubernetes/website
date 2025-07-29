---
title: محدوده محدودیت
id: limitrange
date: 2019-04-15
full_link:  /docs/concepts/policy/limit-range/
short_description: >
  محدودیت‌هایی را برای مصرف منابع هر کانتینر یا پاد در یک نام‌فضا فراهم می‌کند.

aka: 
tags:
- core-object
- fundamental
- architecture
related:
 - pod
 - container

---
 محدودیت‌هایی را فراهم می‌کند تا مصرف منابع هر {{< glossary_tooltip text="Containers" term_id="container" >}} یا {{< glossary_tooltip text="Pods" term_id="pod" >}} در یک نام‌فضا را محدود کند.

<!--more--> 
LimitRange تعداد اشیائی را که می‌توان بر اساس نوعشان ایجاد کرد، و همچنین میزان منابع محاسباتی‌ای را که ممکن است توسط هر {{< glossary_tooltip text="Containers" term_id="container" >}} یا {{< glossary_tooltip text="Pods" term_id="pod" >}} در یک نام‌فضا درخواست یا مصرف شود، محدود می‌کند.
