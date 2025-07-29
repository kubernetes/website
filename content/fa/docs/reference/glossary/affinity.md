---
title: وابستگی
id: affinity
date: 2019-01-11
full_link: /docs/concepts/scheduling-eviction/assign-pod-node/#affinity-and-anti-affinity
short_description: >
     قوانینی که توسط زمانبند برای تعیین محل قرارگیری پادها استفاده می‌شود
aka:
tags:
- fundamental
---

در Kubernetes، _affinity_ مجموعه‌ای از قوانین است که به برنامه‌ریز در مورد محل قرارگیری پادها راهنمایی می‌کند.

<!--more-->
دو نوع affinity وجود دارد:
* [node affinity](/docs/concepts/scheduling-eviction/assign-pod-node/#node-affinity)
* [pod-to-pod affinity](/docs/concepts/scheduling-eviction/assign-pod-node/#inter-pod-affinity-and-anti-affinity)

قوانین با استفاده از Kubernetes {{< glossary_tooltip term_id="label" text="برچسب‌ها">}}  
و {{< glossary_tooltip term_id="selector" text="انتخابگرها">}} که در {{< glossary_tooltip term_id="pod" text="پادها">}} مشخص شده‌اند تعریف می‌شوند،  
و بسته به اینکه چقدر می‌خواهید Scheduler آنها را سخت‌گیرانه اعمال کند، می‌توانند اجباری (required) یا ترجیحی (preferred) باشند.
