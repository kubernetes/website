---
title: کلاستر (Cluster)
id: cluster
date: 2019-06-15
full_link: 
short_description: >
   مجموعه‌ای از ماشین‌های worker، به نام گره‌ها، که برنامه‌های کانتینری‌شده را اجرا می‌کنند. هر کلاستر حداقل یک گره worker دارد.

aka: 
tags:
- fundamental
- operation
---
مجموعه‌ای از ماشین‌های worker، به نام {{< glossary_tooltip text="گره‌ها" term_id="node" >}}، که برنامه‌های کانتینری‌شده را اجرا می‌کنند. هر کلاستر حداقل یک گره worker دارد.

<!--more-->
گره(های) worker میزبان {{< glossary_tooltip text="پادها" term_id="pod" >}}یی هستند که اجزای بار کاری اپلیکیشن هستند. {{< glossary_tooltip text="control plane" term_id="control-plane" >}} گره‌های worker و پادها را در کلاستر مدیریت می‌کند. در محیط‌های عملیاتی، control plane معمولا روی چندین کامپیوتر اجرا می‌شود و یک کلاستر معمولا چندین گره را اجرا می‌کند و تحمل‌پذیری خطا و دسترسی بالا را فراهم می‌کند.
