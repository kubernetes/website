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

CSI به ارائه‌دهندگان (سازندگان سرویس‌های ذخیره‌سازی) اجازه می‌دهد افزونه‌های ذخیره‌سازی سفارشی برای کوبرنتیز ایجاد کنند، بدون اینکه آنها را به مخزن کوبرنتیز اضافه کنند (افزونه‌های خارجی). برای استفاده از درایور CSI از یک ارائه‌دهنده ذخیره‌سازی، ابتدا باید آن را [در cluster خود مستقر کنید](https://kubernetes-csi.github.io/docs/deploying.html). سپس می‌توانید یک {{< glossary_tooltip text="Storage Class" term_id="storage-class" >}} ایجاد کنید که از آن درایور CSI استفاده کند.

* [CSI در مستندات کوبرنتیز](/docs/concepts/storage/volumes/#csi)
* [فهرست درایورهای موجود CSI](https://kubernetes-csi.github.io/docs/drivers.html)
