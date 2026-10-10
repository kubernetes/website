---
title: Deployment
id: deployment
full_link: /docs/concepts/workloads/controllers/deployment/
short_description: >
  یک برنامه‌ی تکثیر شده را در کلاستر شما مدیریت می‌کند.

aka: 
tags:
- fundamental
- core-object
- workload
---
 یک شیء API که یک برنامه تکثیر شده را مدیریت می‌کند، معمولاً با اجرای پادها بدون حالت محلی.

<!--more--> 

هر رونوشت توسط یک {{< glossary_tooltip term_id="pod" >}} نمایش داده می‌شود و پادها بین {{< glossary_tooltip text="گره‌ها" term_id="node" >}} یک کلاستر توزیع می‌شوند.
برای بارهای کاری(Workloads) که به نگهداری وضعیت محلی نیاز دارند، استفاده از {{< glossary_tooltip term_id="StatefulSet" >}} را در نظر بگیرید.
