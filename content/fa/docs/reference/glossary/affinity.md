---
title: وابستگی (Affinity)
id: affinity
date: 2019-01-11
full_link: /docs/concepts/scheduling-eviction/assign-pod-node/#affinity-and-anti-affinity
short_description: >
     قوانینی که توسط scheduler برای تعیین محل قرارگیری پادها استفاده می‌شود
aka:
tags:
- fundamental
---

در کوبرنتیز، _affinity_ مجموعه‌ای از قوانین است که به scheduler در مورد محل قرارگیری پادها راهنمایی می‌کند.

<!--more-->
دو نوع affinity وجود دارد:
* [affinity گره (node)](/docs/concepts/scheduling-eviction/assign-pod-node/#node-affinity)
* [pod-to-pod affinity](/docs/concepts/scheduling-eviction/assign-pod-node/#inter-pod-affinity-and-anti-affinity)

این قوانین با استفاده از {{< glossary_tooltip term_id="label" text="برچسب">}} و {{< glossary_tooltip term_id="selector" text="انتخابگرها">}} کوبرنتیز که در {{< glossary_tooltip term_id="pod" text="پادها" >}} مشخص شده‌اند، تعریف می‌شوند و بسته به اینکه می‌خواهید scheduler چقدر آنها را سختگیرانه اجرا کند، می‌توانند الزامی یا ترجیحی باشند.
