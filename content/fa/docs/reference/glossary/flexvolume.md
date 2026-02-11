---
title: FlexVolume
id: flexvolume
date: 2018-06-25
full_link: /docs/concepts/storage/volumes/#flexvolume
short_description: >
    FlexVolume یک رابط منسوخ‌شده برای ایجاد افزونه‌های حجم خارج از هسته (out-of-tree) است.
    {{< glossary_tooltip text="رابط ذخیره‌سازی کانتینر" term_id="csi" >}} یک رابط جدیدتر است که چندین مشکل FlexVolume را برطرف می‌کند.


aka: 
tags:
- storage 
---
FlexVolume یک رابط منسوخ‌شده برای ایجاد افزونه‌های حجم خارج از هسته (out-of-tree) است.
{{< glossary_tooltip text="رابط ذخیره‌سازی کانتینر" term_id="csi" >}} یک رابط جدیدتر است که چندین مشکل FlexVolume را برطرف می‌کند.

<!--more--> 

FlexVolumes کاربران را قادر می‌سازد تا درایورهای خود را بنویسند و پشتیبانی از Volumeهای خود را در کوبرنتیز اضافه کنند. فایل‌های باینری و وابستگی‌های درایور FlexVolume باید روی دستگاه‌های میزبان نصب شوند. این امر نیاز به دسترسی روت دارد. Storage SIG پیشنهاد می‌کند در صورت امکان، یک درایور {{< glossary_tooltip text="CSI" text="رابط ذخیره‌سازی کانتینر" term_id="csi" >}} پیاده‌سازی شود، زیرا محدودیت‌های FlexVolumes را برطرف می‌کند.

* [FlexVolume در مستندات کوبرنتیز](/docs/concepts/storage/volumes/#flexvolume)
* [اطلاعات بیشتر در مورد FlexVolumes](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-storage/flexvolume.md)
* [سؤالات متداول افزونه حجم(Volume) برای ارائه‌دهندگان فضای ذخیره‌سازی](https://github.com/kubernetes/community/blob/master/sig-storage/volume-plugin-faq.md)
