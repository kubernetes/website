---
title: Endpoints
id: endpoints
date: 2020-04-23
full_link: 
short_description: >
  نقطه پایانی(Endpoints) یک سرویس، یکی از پادها (یا سرورهای خارجی) است که سرویس را پیاده‌سازی می‌کند.

aka:
tags:
- networking
---
 یک نقطه پایانی {{< glossary_tooltip text="Service" term_id="service" >}} یکی از {{< glossary_tooltip text="Podها" term_id="pod" >}} (یا سرورهای خارجی) است که سرویس را پیاده‌سازی می‌کند.

<!--more-->
برای سرویس‌هایی با {{< glossary_tooltip text="انتخابگر" term_id="selector" >}}، کنترل کننده {{<glossary_tooltip text="EndpointSlices" term_id="endpoint-slice" >}} به طور خودکار یک یا چند  
ایجاد می‌کند که آدرس‌های IP پادهای نقطه انتهایی انتخاب شده را ارائه می‌دهد.

همچنین می‌توان EndpointSliceها را به صورت دستی ایجاد کرد تا نقاط پایانی سرویس‌هایی را که هیچ انتخابگر (selector) مشخصی ندارند، نشان دهند.
