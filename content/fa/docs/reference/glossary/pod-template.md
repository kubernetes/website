---
title: قالب پاد
id: pod-template
date: 2024-10-13
short_description: >
  قالبی برای ایجاد پادها.

aka: 
  - pod template
tags:
- core-object

---
یک شیء API که قالبی برای ایجاد {{< glossary_tooltip text="Pods" term_id="pod" >}} تعریف می‌کند.
رابط PodTemplate همچنین در تعاریف API برای مدیریت بار کاری، مانند
{{< glossary_tooltip text="Deployment" term_id="deployment" >}} یا
{{< glossary_tooltip text="StatefulSets" term_id="StatefulSet" >}}, تعبیه شده است.

<!--more--> 

قالب‌های پاد به شما اجازه می‌دهند فرادادهٔ مشترک (مانند برچسب‌ها یا قالبی برای نام پاد جدید)
و نیز وضعیت مطلوب یک پاد را مشخص کنید.
کنترلرهای [مدیریت بار کاری](/docs/concepts/workloads/controllers/) از قالب‌های پاد
(که در شیء دیگری مانند Deployment یا StatefulSet جای گرفته‌اند)
برای تعریف و مدیریت یک یا چند {{< glossary_tooltip text="Pods" term_id="pod" >}} استفاده می‌کنند.
وقتی چندین پاد بر اساس یک قالب واحد ایجاد شوند، به آن‌ها
{{< glossary_tooltip term_id="replica" text="رپلیکا" >}} گفته می‌شود.
اگرچه می‌توانید یک شیء PodTemplate را مستقیماً ایجاد کنید، معمولاً نیازی به این کار ندارید.
