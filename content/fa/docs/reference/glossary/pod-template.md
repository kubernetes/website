---
title: PodTemplate
id: pod-template
date: 2024-10-13
short_description: >
  یک قالب برای ایجاد پادها.
aka:
  - قالب پاد
tags:
- core-object
---

یک آبجکت API که قالبی برای ایجاد {{< glossary_tooltip text="پادها" term_id="pod" >}} تعریف می‌کند.
API مربوط به PodTemplate همچنین در تعریف‌های API برای مدیریت ورک‌لود (Workload)، مانند
{{< glossary_tooltip text="Deployment" term_id="deployment" >}} یا
{{< glossary_tooltip text="StatefulSet" term_id="StatefulSet" >}}، جاسازی می‌شود.

<!--more-->

قالب‌های پاد به شما امکان می‌دهند متادیتا (فراداده) مشترک (برای نمونه، برچسب‌ها یا قالبی برای نام یک
پاد جدید) را تعریف کنید و نیز وضعیت مطلوب (desired state) پاد را مشخص کنید.
کنترلرهای [مدیریت Workload](/fa/docs/concepts/workloads/controllers/) از قالب‌های پاد
(جاسازی‌شده درون یک آبجکت دیگر، مانند Deployment یا StatefulSet)
برای تعریف و مدیریت یک یا چند {{< glossary_tooltip text="پاد" term_id="pod" >}} استفاده می‌کنند.
وقتی چندین پاد بر اساس یک قالب یکسان وجود داشته باشد، به آن‌ها
{{< glossary_tooltip term_id="replica" text="رپلیکا (replicas)" >}} گفته می‌شود.
اگرچه می‌توانید به‌صورت مستقیم یک آبجکت PodTemplate بسازید، به‌ندرت به این کار نیاز خواهید داشت.
