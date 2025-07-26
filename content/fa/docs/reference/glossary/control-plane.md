---
title: صفحه کنترل
id: control-plane
date: 2019-05-12
full_link:
short_description: >
  لایه هماهنگ‌سازی کانتینر که API و رابط‌ها را برای تعریف، استقرار و مدیریت چرخه عمر کانتینرها در معرض دید قرار می‌دهد..

aka:
tags:
- fundamental
---
 لایه هماهنگ‌سازی کانتینر که API و رابط‌ها را برای تعریف، استقرار و مدیریت چرخه عمر کانتینرها در معرض دید قرار می‌دهد.

 <!--more--> 
 
این لایه از اجزای مختلفی تشکیل شده است، مانند (اما محدود به):

* {{< glossary_tooltip text="etcd" term_id="etcd" >}}
* {{< glossary_tooltip text="سرور API" term_id="kube-apiserver" >}}
* {{< glossary_tooltip text="زمان‌بند" term_id="kube-scheduler" >}}
* {{< glossary_tooltip text="مدیر کنترل" term_id="kube-controller-manager" >}}
* {{< glossary_tooltip text="مدیر کنترل ابری" term_id="cloud-controller-manager" >}}

این اجزا می‌توانند به‌عنوان سرویس‌های سنتی سیستم‌عامل (دایمون) یا به‌صورت کانتینر اجرا شوند. میزبان‌هایی که این اجزا روی آن‌ها اجرا می‌شدند، Historically به‌عنوان {{< glossary_tooltip text="مسترها" term_id="master" >}} شناخته می‌شدند.  
