---
title: جمع‌آوری زباله
id: garbage-collection
date: 2021-07-07
full_link: /docs/concepts/architecture/garbage-collection/
short_description: >
  یک اصطلاح کلی برای سازوکارهای مختلفی که کوبرنتیز برای پاکسازی منابع cluster استفاده می‌کند.

aka: 
tags:
- fundamental
- operation
---

جمع‌آوری زباله(Garbage Collection) یک اصطلاح کلی برای سازوکارهای مختلفی است که کوبرنتیز برای پاکسازی منابع Cluster استفاده می‌کند. 

<!--more-->

کوبرنتیز از جمع‌آوری زباله برای پاکسازی منابعی مانند
[کانتینرها و تصاویر استفاده نشده](/docs/concepts/architecture/garbage-collection/#containers-images)،
[Podهای ناموفق](/docs/concepts/workloads/pods/pod-lifecycle/#pod-garbage-collection)،
[اشیاء متعلق به منبع مورد نظر](/docs/concepts/overview/working-with-objects/owners-depends/)،
[jobs تکمیل شده](/docs/concepts/workloads/controllers/ttlafterfinished/) و منابعی که منقضی شده‌اند یا از کار افتاده‌اند، استفاده می‌کند.

