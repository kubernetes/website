---
title: کنترلر تکثیر (ReplicationController)
id: replication-controller
date: 2018-04-12
full_link: 
short_description: >
  یک آبجکت API (منسوخ‌شده) که یک برنامه تکثیر‌شده را مدیریت می‌کند.
aka: 
tags:
- workload
- core-object
---
 یک منبع ورکلود که یک برنامه تکثیر‌شده را مدیریت می‌کند و اطمینان می‌دهد
تعداد مشخصی از نمونه‌های {{< glossary_tooltip text="پاد" term_id="pod" >}} در حال اجرا هستند.

<!--more-->

کنترل پلین تضمین می‌کند که تعداد تعیین‌شده‌ای از پادها در حال اجرا باشند؛ حتی اگر بعضی پادها از کار بیفتند، اگر شما پادهایی را به‌صورت دستی حذف کنید، یا اگر به اشتباه تعداد زیادی پاد راه‌اندازی شده باشد.

{{< note >}}
ReplicationController منسوخ شده است. مورد مشابه را در
{{< glossary_tooltip text="دیپلویمنت" term_id="deployment" >}} ببینید.
{{< /note >}}
