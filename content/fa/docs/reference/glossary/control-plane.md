---
title: Control Plane
id: control-plane
date: 2019-05-12
full_link:
short_description: >
  لایه هماهنگ‌سازی کانتینر که API و رابط‌ها را برای تعریف، استقرار و مدیریت چرخه عمر کانتینرها در معرض دید قرار می‌دهد.

aka:
tags:
- fundamental
---
 لایه هماهنگ‌سازی کانتینر که API و رابط‌ها را برای تعریف، استقرار و مدیریت چرخه عمر کانتینرها در معرض دید قرار می‌دهد.

 <!--more--> 
 
 این لایه از اجزای مختلفی تشکیل شده است، مانند (اما محدود به این موارد نیست):

 * {{< glossary_tooltip text="etcd" term_id="etcd" >}}
 * {{< glossary_tooltip text="API Server" term_id="kube-apiserver" >}}
 * {{< glossary_tooltip text="Scheduler" term_id="kube-scheduler" >}}
 * {{< glossary_tooltip text="Controller Manager" term_id="kube-controller-manager" >}}
 * {{< glossary_tooltip text="Cloud Controller Manager" term_id="cloud-controller-manager" >}}

 این اجزا می‌توانند به عنوان سرویس‌های سنتی سیستم عامل (daemons) یا به عنوان کانتینرها اجرا شوند. میزبان‌هایی که این اجزا را اجرا می‌کنند، از لحاظ تاریخی {{< glossary_tooltip text="masters" term_id="master" >}} نامیده می‌شدند.