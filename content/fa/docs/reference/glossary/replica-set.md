---
title: ReplicaSet
id: replica-set
date: 2018-04-12
full_link: /docs/concepts/workloads/controllers/replicaset/
short_description: >
  ReplicaSet اطمینان می‌دهد که در هر لحظه تعداد مشخصی از رپلیکای پادها در حال اجرا باشند.
aka: 
tags:
- fundamental
- core-object
- workload
---
 یک ReplicaSet (هدفش این است که) مجموعه‌ای از پادهای رپلیکا را در هر لحظه در حال اجرا نگه دارد.

<!--more-->

آبجکت‌های ورک‌لود مانند {{< glossary_tooltip term_id="deployment" >}} از ReplicaSet
استفاده می‌کنند تا بر اساس spec همان ReplicaSet، اطمینان دهند تعداد {{< glossary_tooltip term_id="pod" text="پادهای" >}} پیکربندی‌شده در کلاستر شما در حال اجرا هستند.
