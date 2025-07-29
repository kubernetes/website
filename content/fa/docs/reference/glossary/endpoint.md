---
title: نقاط پایانی
id: endpoints
date: 2020-04-23
full_link: 
short_description: >
  نقطه پایانی یک سرویس، یکی از پادها (یا سرورهای خارجی) است که سرویس را پیاده‌سازی می‌کند.

aka:
tags:
- networking
---
نقطه پایانی یک {{< glossary_tooltip text="Service" term_id="service" >}} یکی از {{< glossary_tooltip text="Pods" term_id="pod" >}} (یا سرورهای خارجی) است که آن سرویس را پیاده‌سازی می‌کند.

<!--more-->

برای سرویس‌هایی با {{< glossary_tooltip text="selectors" term_id="selector" >}}،
کنترلر EndpointSlice به‌طور خودکار یک یا چند {{<
glossary_tooltip text="EndpointSlices" term_id="endpoint-slice" >}} ایجاد می‌کند
که آدرس‌های IP پادهای انتهاییِ انتخاب‌شده را ارائه می‌دهند.

همچنین می‌توان EndpointSliceها را به‌صورت دستی ایجاد کرد تا نقاط پایانیِ
سرویس‌هایی را که selector مشخص نکرده‌اند، نشان دهند.
