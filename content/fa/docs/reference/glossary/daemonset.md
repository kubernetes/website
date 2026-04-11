---
title: DaemonSet
id: daemonset
date: 2018-04-12
full_link: /docs/concepts/workloads/controllers/daemonset
short_description: >
  تضمین می‌کند که یک رونوشت از یک Pod در مجموعه‌ای از گره‌ها(Node) در یک cluster در حال اجرا است.

aka: 
tags:
- fundamental
- core-object
- workload
---
 تضمین می‌کند که یک رونوشت از {{< glossary_tooltip text="Pod" term_id="pod" >}} در مجموعه‌ای از گره‌ها در {{< glossary_tooltip text="cluster" term_id="cluster" >}} در حال اجرا است.

<!--more--> 

برای استقرار سرویس‌های سیستمی مانند جمع‌آوری‌کننده‌های لاگ و عوامل نظارتی که معمولاً باید روی هر {{< glossary_tooltip term_id="node" >}} اجرا شوند، استفاده می‌شود.

