---
title: Workload
id: workload
date: 2019-02-13
full_link: /docs/concepts/workloads/
short_description: >
  Workload به یک برنامه در حال اجرا روی کوبرنتیز اشاره دارد.

aka: 
tags:
- fundamental
---
  Workload به یک برنامه در حال اجرا روی کوبرنتیز اشاره دارد.

<!--more--> 

اشیاء اصلی مختلفی که انواع یا بخش‌های متفاوتی از یک Workload را نمایندگی می‌کنند شامل DaemonSet، Deployment، Job، ReplicaSet و StatefulSet هستند.

برای مثال، یک Workload که شامل یک سرور وب و یک پایگاه داده است ممکن است پایگاه داده را در یک {{< glossary_tooltip term_id="StatefulSet" >}} و سرور وب را در یک {{< glossary_tooltip term_id="Deployment" >}} اجرا کند.
