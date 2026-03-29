---
title: ConfigMap
id: configmap
date: 2018-04-12
full_link: /docs/concepts/configuration/configmap/
short_description: >
  یک شیء API که برای ذخیره داده‌های غیرمحرمانه در جفت‌های کلید-مقدار استفاده می‌شود. می‌تواند به عنوان متغیرهای محیطی، آرگومان‌های خط فرمان یا فایل‌های پیکربندی در یک Volume استفاده شود.

aka: 
tags:
- core-object
---
 یک ابجکت API که برای ذخیره داده‌های غیرمحرمانه در جفت‌های کلید-مقدار استفاده می‌شود. {{< glossary_tooltip text="پادها" term_id="pod" >}} می‌توانند ConfigMaps را به عنوان متغیرهای محیطی، آرگومان‌های خط فرمان یا به عنوان فایل‌های پیکربندی در یک {{< glossary_tooltip text="volume" term_id="volume" >}} مصرف کنند.

<!--more--> 

یک ConfigMap به شما امکان می‌دهد پیکربندی مختص محیط را از {{< glossary_tooltip text="ایمیج‌های کانتینر" term_id="image" >}} خود جدا کنید، به طوری که برنامه‌های شما به راحتی قابل حمل باشند.
