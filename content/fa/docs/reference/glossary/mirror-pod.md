---
title: پاد آینه‌ای
id: mirror-pod
date: 2019-08-06
short_description: >
  شیئی در سرور API که یک پاد ایستا روی kubelet را دنبال می‌کند.

aka: 
tags:
- fundamental
---
 شیء {{< glossary_tooltip text="pod" term_id="pod" >}} که یک {{< glossary_tooltip text="kubelet" term_id="kubelet" >}}
 برای نمایش یک {{< glossary_tooltip text="static pod" term_id="static-pod" >}} استفاده می‌کند.

<!--more--> 

هنگامی که kubelet در پیکربندی خود یک پاد ایستا پیدا می‌کند، به‌طور خودکار تلاش می‌کند
یک شیء پاد در سرور API کوبرنتیز برای آن ایجاد کند. این به این معناست که پاد
روی سرور API قابل مشاهده خواهد بود، اما نمی‌توان آن را از آنجا کنترل کرد.

(برای مثال، حذف یک پاد آینه‌ای باعث نمی‌شود که سرویس kubelet اجرای آن را متوقف کند).
