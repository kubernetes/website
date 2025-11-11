---
title: کلاس QoS
id: qos-class
date: 2019-04-15
full_link: /fa/docs/concepts/workloads/pods/pod-qos/
short_description: >
  کلاس QoS (Quality of Service Class) روشی در اختیار کوبرنتیز می‌گذارد تا پادهای موجود در کلاستر را به چند کلاس دسته‌بندی کند و براساس آن درباره‌ی اسکجولینگ و اخراج (eviction) تصمیم بگیرد.

aka: 
tags:
- fundamental
- architecture
related:
 - pod

---
کلاس QoS (Quality of Service Class - کلاس کیفیت سرویس) روشی در اختیار کوبرنتیز می‌گذارد تا پادهای موجود در کلاستر را به چند کلاس دسته‌بندی کند و براساس آن درباره‌ی اسکجولینگ و اخراج (eviction) تصمیم بگیرد.

<!--more-->

کلاس QoS یک پاد در زمان ایجاد آن و بر اساس تنظیمات درخواست‌ها (requests) و محدودیت‌ها (limits) برای منابع محاسباتی تعیین می‌شود. از کلاس‌های QoS برای تصمیم‌گیری درباره‌ی اسکجولینگ و اخراج پادها استفاده می‌شود.
کوبرنتیز می‌تواند یکی از کلاس‌های QoS زیر را به یک پاد اختصاص دهد: `Guaranteed`، `Burstable` یا `BestEffort`.
