---
title: کانتینر آغازگر
id: init-container
date: 2018-04-12
full_link: /docs/concepts/workloads/pods/init-containers/
short_description: >
  یک یا چند کانتینر آغازگر که باید پیش از اجرای هر کانتینر برنامه به‌طور کامل اجرا شوند.
aka: 
tags:
- fundamental
---
 یک یا چند کانتینر آغازگر {{< glossary_tooltip text="containers" term_id="container" >}} که باید پیش از اجرای هر کانتینر برنامه به‌طور کامل اجرا شوند.

<!--more--> 

کانتینرهای آغازگر (init) شبیه کانتینرهای معمولیِ برنامه هستند، با یک تفاوت: کانتینرهای آغازگر باید پیش از آنکه هر کانتینر برنامه‌ای بتواند شروع به کار کند، به‌طور کامل اجرا شوند. کانتینرهای آغازگر به‌صورت سری اجرا می‌شوند؛ هر کانتینر آغازگر باید پیش از شروع کانتینر آغازگر بعدی به پایان برسد.

برخلاف {{< glossary_tooltip text="sidecar containers" term_id="sidecar-container" >}}، کانتینرهای آغازگر پس از راه‌اندازی پاد همچنان در حال اجرا نمی‌مانند.

برای اطلاعات بیشتر، [کانتینرهای آغازگر](/docs/concepts/workloads/pods/init-containers/) را مطالعه کنید.
