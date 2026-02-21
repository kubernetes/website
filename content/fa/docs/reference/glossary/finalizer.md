---
title: Finalizer
id: finalizer
date: 2021-07-07
full_link: /docs/concepts/overview/working-with-objects/finalizers/
short_description: >
  یک کلید namespace که به کوبرنتیز می‌گوید تا زمان برآورده شدن شرایط خاص، قبل از حذف کامل یک شیء علامت‌گذاری شده برای حذف، منتظر بماند.
aka: 
tags:
- fundamental
- operation
---
نهایی‌کننده‌ها کلیدهای namespace هستند که به کوبرنتیز می‌گویند تا زمان برآورده شدن شرایط خاص، قبل از حذف کامل منابع مشخص‌شده برای حذف، منتظر بماند. نهایی‌کننده‌ها {{<glossary_tooltip text="کنترل کننده ها (controllers)" term_id="controller">}} را برای پاکسازی منابعی که شیء حذف‌شده متعلق به آن است، هشدار می‌دهند.

<!--more-->

وقتی به کوبرنتیز می‌گویید که شیء‌ای را که finalizers برای آن مشخص شده است، حذف کند، API کوبرنتیز با پر کردن `.metadata.deletionTimestamp` شیء را برای حذف علامت‌گذاری می‌کند و کد وضعیت `202` (HTTP "Accepted") را برمی‌گرداند. شیء هدف در حالت خاتمه باقی می‌ماند در حالی که control plane یا سایر اجزا، اقدامات تعریف شده توسط finalizers را انجام می‌دهند. پس از اتمام این اقدامات، کنترل‌کننده finalizers مربوطه را از شیء هدف حذف می‌کند. هنگامی که فیلد `metadata.finalizers` خالی باشد، کوبرنتیز حذف را کامل در نظر می‌گیرد و شیء را حذف می‌کند.

شما می‌توانید از finalizerها برای کنترل {{<glossary_tooltip text="garbage collection" term_id="garbage-collection">}} منابع استفاده کنید. برای مثال، می‌توانید یک finalizer تعریف کنید تا منابع یا زیرساخت‌های مرتبط را قبل از اینکه کنترل‌کننده منبع هدف را حذف کند، پاک کند.