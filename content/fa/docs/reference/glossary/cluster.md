---
title: خوشه(cluster)
id: cluster
date: 2019-06-15
full_link: 
short_description: >
   مجموعه‌ای از ماشین‌های worker، به نام گره‌ها، که برنامه‌های کانتینر شده را اجرا می‌کنند. هر خوشه حداقل یک گره worker دارد.

aka: 
tags:
- fundamental
- operation
---
مجموعه‌ای از ماشین‌های worker، به نام {{< glossary_tooltip text="nodes" term_id="node" >}}، که برنامه‌های کانتینری شده را اجرا می‌کنند. هر خوشه حداقل یک گره worker دارد.

<!--more-->
گره(های) worker میزبان {{< glossary_tooltip text="Pods" term_id="pod" >}} هستند که اجزای بار کاری برنامه هستند. {{< glossary_tooltip text="control plane" term_id="control-plane" >}} گره‌های worker و پادها را در خوشه مدیریت می‌کند. در محیط‌های عملیاتی، control plane معمولاً روی چندین کامپیوتر اجرا می‌شود و یک خوشه معمولاً چندین گره را اجرا می‌کند و تحمل خطا و دسترسی بالا را فراهم می‌کند.
