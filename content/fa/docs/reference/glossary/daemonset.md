---
title: DaemonSet
id: daemonset
date: 2018-04-12
full_link: /docs/concepts/workloads/controllers/daemonset
short_description: >
  تضمین می‌کند که یک کپی از یک Pod در مجموعه‌ای از گره‌ها در یک خوشه در حال اجرا است.

aka: 
tags:
- fundamental
- core-object
- workload
---
 اطمینان می‌دهد که یک نسخه از {{< glossary_tooltip text="Pod" term_id="pod" >}} در میان مجموعه‌ای از گره‌ها در یک {{< glossary_tooltip text="cluster" term_id="cluster" >}} در حال اجرا باشد.

<!--more-->

برای استقرار دیمن‌های سیستمی مانند جمع‌آورنده‌های لاگ و عامل‌های نظارتی که معمولاً باید روی هر {{< glossary_tooltip term_id="node" >}} اجرا شوند، استفاده می‌گردد.
