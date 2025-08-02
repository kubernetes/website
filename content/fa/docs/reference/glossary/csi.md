---
title: رابط ذخیره‌سازی کانتینر (CSI)
id: csi
date: 2018-06-25
full_link: /docs/concepts/storage/volumes/#csi
short_description: >
    رابط ذخیره‌سازی کانتینر (CSI) یک رابط استاندارد برای نمایش سیستم‌های ذخیره‌سازی به کانتینرها تعریف می‌کند.


aka: 
tags:
- storage 
---
 رابط ذخیره‌سازی کانتینر (CSI) یک رابط استاندارد برای نمایش سیستم‌های ذخیره‌سازی به کانتینرها تعریف می‌کند.

<!--more--> 

CSI به فروشندگان اجازه می‌دهد افزونه‌های ذخیره‌سازی سفارشی برای کوبرنتیز ایجاد کنند بدون افزودن آنها به مخزن کوبرنتیز (افزونه‌های خارج از درخت). برای استفاده از درایور CSI از یک ارائه‌دهنده ذخیره‌سازی، ابتدا باید [آن را در خوشه خود مستقر کنید](https://kubernetes-csi.github.io/docs/deploying.html). سپس خواهید توانست یک {{< glossary_tooltip text="Storage Class" term_id="storage-class" >}} ایجاد کنید که از آن درایور CSI استفاده می‌کند.

* [CSI در مستندات کوبرنتیز](/docs/concepts/storage/volumes/#csi)
* [فهرست درایورهای CSI موجود](https://kubernetes-csi.github.io/docs/drivers.html)
