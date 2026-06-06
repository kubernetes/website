---
title: کلاس QoS
id: qos-class
full_link: /fa/docs/concepts/workloads/pods/pod-qos/
short_description: >
  کلاس QoS (Quality of Service Class) روشی در اختیار کوبرنتیز می‌گذارد تا پادهای موجود در کلاستر را به چند کلاس دسته‌بندی کند و براساس آن درباره‌ی scheduling (زمان بندی) و اخراج (eviction) تصمیم بگیرد.

aka: 
tags:
- fundamental
- architecture
related:
 - pod

---
کلاس QoS (Quality of Service Class - کلاس کیفیت سرویس) روشی در اختیار کوبرنتیز می‌گذارد تا پادهای موجود در کلاستر را به چند کلاس دسته‌بندی کند و براساس آن درباره‌ی scheduling (زمان بندی) و اخراج (eviction) تصمیم بگیرد.

<!--more-->

کلاس QoS یک پاد در زمان ایجاد آن و بر اساس تنظیمات درخواست‌ها (requests) و محدودیت‌ها (limits) برای منابع محاسباتی تعیین می‌شود. از کلاس‌های QoS برای تصمیم‌گیری درباره‌ی scheduling (زمان بندی) و اخراج پادها استفاده می‌شود.
کوبرنتیز می‌تواند یکی از کلاس‌های QoS زیر را به یک پاد اختصاص دهد: `Guaranteed`، `Burstable` یا `BestEffort`.
