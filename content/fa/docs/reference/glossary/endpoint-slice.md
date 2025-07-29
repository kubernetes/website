---
title: EndpointSlice
id: endpoint-slice
date: 2018-04-12
full_link: /docs/concepts/services-networking/endpoint-slices/
short_description: >
  EndpointSliceها آدرس‌های IP مربوط به Podها را با انتخابگرهای سرویس منطبق، ردیابی می‌کنند.

aka:
tags:
- networking
---
EndpointSliceها آدرس‌های IP پادهایی را که دارای {{< glossary_tooltip text="selectors" term_id="selector" >}} منطبق هستند، پیگیری می‌کنند.

<!--more-->

می‌توان EndpointSliceها را برای {{< glossary_tooltip text="Services" term_id="service" >}}ی که بدون تعیین انتخابگر هستند، به‌صورت دستی پیکربندی کرد.
