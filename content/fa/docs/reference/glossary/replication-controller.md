---
title: ReplicationController
id: replication-controller
date: 2018-04-12
full_link: 
short_description: >
  یک شیء API (منسوخ) که یک برنامهٔ تکرارشده را مدیریت می‌کند.

aka: 
tags:
- workload
- core-object
---
 یک منبع بارکاری که یک برنامهٔ تکرارشده را مدیریت می‌کند و تضمین می‌کند
تعداد مشخصی از نمونه‌های یک {{< glossary_tooltip text="Pod" term_id="pod" >}} در حال اجرا باشند.

<!--more-->

کنترل پلین تضمین می‌کند که تعداد تعریف‌شده‌ای از پادها در حال اجرا بمانند،
حتی اگر بعضی از پادها از کار بیفتند، شما پادها را به‌صورت دستی حذف کنید
یا بیش از حد پاد به‌اشتباه راه‌اندازی شود.

{{< note >}}
ReplicationController منسوخ شده است. به
{{< glossary_tooltip text="Deployment" term_id="deployment" >}} مراجعه کنید که مشابه است.
{{< /note >}}
