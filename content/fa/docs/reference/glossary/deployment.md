---
title: Deployment
id: deployment
date: 2018-04-12
full_link: /docs/concepts/workloads/controllers/deployment/
short_description: >
  یک برنامه‌ی تکثیر شده را در cluster شما مدیریت می‌کند.

aka: 
tags:
- fundamental
- core-object
- workload
---
 یک شیء API که یک برنامه تکثیر شده را مدیریت می‌کند، معمولاً با اجرای Podها بدون حالت محلی.

<!--more--> 

هر رونوشت توسط یک {{< glossary_tooltip term_id="pod" >}} نمایش داده می‌شود و Podها بین {{< glossary_tooltip text="گره‌ها" term_id="node" >}} یک cluster توزیع می‌شوند.
برای بارهای کاری(Workloads) که به نگهداری وضعیت محلی نیاز دارند، استفاده از {{< glossary_tooltip term_id="StatefulSet" >}} را در نظر بگیرید.
