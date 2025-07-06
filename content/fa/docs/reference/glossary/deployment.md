---
title: Deployment
id: deployment
date: 2018-04-12
full_link: /docs/concepts/workloads/controllers/deployment/
short_description: >
  یک برنامه‌ی تکثیر شده را در کلاستر شما مدیریت می‌کند.

aka: 
tags:
- fundamental
- core-object
- workload
---
یک شی API که یک برنامه تکثیری را مدیریت می‌کند، معمولاً با اجرای Podها بدون وضعیت محلی.

<!--more-->

هر نسخه تکثیری توسط یک {{< glossary_tooltip term_id="pod" >}} نمایندگی می‌شود و Podها در میان {{< glossary_tooltip text="nodes" term_id="node" >}} یک خوشه پخش می‌شوند.  
برای بارکاری‌هایی که نیاز به وضعیت محلی دارند، استفاده از {{< glossary_tooltip term_id="StatefulSet" >}} را مدنظر قرار دهید.
