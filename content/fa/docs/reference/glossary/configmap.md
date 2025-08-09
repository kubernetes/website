---
title: ConfigMap
id: configmap
date: 2018-04-12
full_link: /docs/concepts/configuration/configmap/
short_description: >
  یک شیء API که برای ذخیره داده‌های غیرمحرمانه در جفت‌های کلید-مقدار استفاده می‌شود. می‌تواند به عنوان متغیرهای محیطی، آرگومان‌های خط فرمان یا فایل‌های پیکربندی در یک حجم استفاده شود.

aka: 
tags:
- core-object
---
یک شیء API است که برای ذخیره داده‌های غیرمحرمانه به‌صورت جفت‌های کلید–مقدار استفاده می‌شود.  
{{< glossary_tooltip text="پادها" term_id="pod" >}} می‌توانند ConfigMapها را به‌عنوان متغیرهای محیطی، آرگومان‌های خط فرمان یا به‌عنوان فایل‌های پیکربندی در یک {{< glossary_tooltip text="والوم" term_id="volume" >}} مصرف کنند.

<!--more-->

یک ConfigMap به شما اجازه می‌دهد پیکربندی وابسته به محیط را از {{< glossary_tooltip text="تصاویر کانتینر" term_id="image" >}} جدا کنید، تا برنامه‌های شما به‌راحتی قابل حمل باشند.
