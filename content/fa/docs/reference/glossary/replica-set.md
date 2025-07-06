---
title: ReplicaSet
id: replica-set
date: 2018-04-12
full_link: /docs/concepts/workloads/controllers/replicaset/
short_description: >
  ReplicaSet تضمین می‌کند که تعداد مشخصی از رپلیکای پاد به‌طور همزمان در حال اجرا باشند.

aka: 
tags:
- fundamental
- core-object
- workload
---
 یک ReplicaSet (هدفش این است که) مجموعه‌ای از پادهای رپلیکا را در هر لحظه در حال اجرا نگه دارد.

<!--more-->

اشیای بارکاری مانند {{< glossary_tooltip term_id="deployment" >}} از ReplicaSet استفاده می‌کنند
تا بر اساس مشخصات آن ReplicaSet اطمینان یابند تعداد پیکربندی‌شده‌ای از
{{< glossary_tooltip term_id="pod" text="Pods" >}} در خوشهٔ شما در حال اجرا باشند.
