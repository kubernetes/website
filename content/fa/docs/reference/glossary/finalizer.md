---
title: نهایی کننده
id: finalizer
date: 2021-07-07
full_link: /docs/concepts/overview/working-with-objects/finalizers/
short_description: >
  یک کلید فضای نامی که به کوبرنتیز می‌گوید تا زمان برآورده شدن شرایط خاص، قبل از حذف کامل یک شیء علامت‌گذاری شده برای حذف، منتظر بماند.
aka: 
tags:
- fundamental
- operation
---
Finalizerها کلیدهای namespaced هستند که به کوبرنتیز می‌گویند تا زمانی که شرایط خاصی برآورده نشده، منابع علامت‌گذاری‌شده برای حذف را به‌طور کامل حذف نکند. Finalizerها به {{<glossary_tooltip text="controllers" term_id="controller">}} هشدار می‌دهند تا منابعی را که شیء حذف‌شده مالک آن‌ها بوده پاک‌سازی کنند.

<!--more-->

وقتی به کوبرنتیز دستور می‌دهید شیئی را که دارای finalizer است حذف کند، API کوبرنتیز با مقداردهی به `.metadata.deletionTimestamp` آن شیء را برای حذف علامت‌گذاری کرده و کد وضعیت `202` (HTTP «Accepted») را برمی‌گرداند. شئ هدف در وضعیت terminating باقی می‌ماند تا صفحه کنترل یا دیگر مؤلفه‌ها اقدامات تعریف‌شده توسط finalizerها را انجام دهند. پس از تکمیل این اقدامات، کنترلر finalizerهای مربوطه را از شئ هدف حذف می‌کند. زمانی که فیلد `metadata.finalizers` خالی شود، کوبرنتیز حذف را کامل تلقی کرده و شیء را حذف می‌کند.

می‌توانید از finalizerها برای کنترل {{<glossary_tooltip text="garbage collection" term_id="garbage-collection">}} منابع استفاده کنید. برای مثال، می‌توانید یک finalizer تعریف کنید تا پیش از آنکه کنترلر منبع هدف را حذف کند، منابع یا زیرساخت‌های مرتبط را پاک‌سازی نماید.
