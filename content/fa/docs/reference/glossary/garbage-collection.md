---
title: جمع‌آوری زباله
id: garbage-collection
date: 2021-07-07
full_link: /docs/concepts/architecture/garbage-collection/
short_description: >
  اصطلاحی کلی برای مکانیزم‌های مختلفی که کوبرنتیز برای پاک‌سازی منابع خوشه استفاده می‌کند.

aka: 
tags:
- fundamental
- operation
---

حذف زباله (Garbage collection) اصطلاحی کلی برای مکانیزم‌های مختلفی است که کوبرنتیز برای پاک‌سازی منابع خوشه به‌کار می‌برد. 

<!--more-->

کوبرنتیز از حذف زباله برای پاک‌سازی منابعی همچون
[کانتینرها و تصاویر بدون استفاده](/docs/concepts/architecture/garbage-collection/#containers-images)،
[پادهای ناموفق](/docs/concepts/workloads/pods/pod-lifecycle/#pod-garbage-collection)،
[اشیائی که متعلق به منبع هدف هستند](/docs/concepts/overview/working-with-objects/owners-dependents/)،
[Jobهای تکمیل‌شده](/docs/concepts/workloads/controllers/ttlafterfinished/)، و منابعی
که منقضی شده یا با شکست مواجه شده‌اند، استفاده می‌کند.

