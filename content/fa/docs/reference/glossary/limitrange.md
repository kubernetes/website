---
title: LimitRange
id: limitrange
date: 2019-04-15
full_link:  /docs/concepts/policy/limit-range/
short_description: >
  محدودیت هایی را برای محدود کردن مصرف منابع به‌ازای کانتینرها یا پادها در یک namespace فراهم می‌کند.

aka: 
tags:
- core-object
- fundamental
- architecture
related:
 - pod
 - container

---
 قیودی را برای محدود کردن مصرف منابع به‌ازای {{< glossary_tooltip text="کانتینرها" term_id="container" >}} یا {{< glossary_tooltip text="پادها" term_id="pod" >}} در یک نیم‌اسپیس (namespace) فراهم می‌کند.

<!--more--> 
LimitRange تعداد آبجکت‌هایی را که بر حسب نوع می‌توان ایجاد کرد محدود می‌کند، و همچنین میزان منابع محاسباتی‌ای را که هر {{< glossary_tooltip text="کانتینر" term_id="container" >}} یا {{< glossary_tooltip text="پاد" term_id="pod" >}} می‌تواند در یک نیم‌اسپیس (namespace) درخواست/مصرف کند تعیین می‌کند.
