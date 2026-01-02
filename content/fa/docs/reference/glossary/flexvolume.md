---
title: FlexVolume
id: flexvolume
date: 2018-06-25
full_link: /docs/concepts/storage/volumes/#flexvolume
short_description: >
    FlexVolume یک رابط منسوخ‌شده برای ایجاد افزونه‌های حجم خارج از درخت است. {{< glossary_tooltip text="Container Storage Interface" term_id="csi" >}} رابط جدیدتری است که به چندین مشکل FlexVolume می‌پردازد.


aka: 
tags:
- storage 
---
 FlexVolume یک رابط منسوخ‌شده برای ایجاد افزونه‌های حجم خارج از درخت است. {{< glossary_tooltip text="Container Storage Interface" term_id="csi" >}} رابط جدیدتری است که به چندین مشکل FlexVolume می‌پردازد.

<!--more--> 

FlexVolumes کاربران را قادر می‌سازد تا درایورهای خود را بنویسند و پشتیبانی از Volumeهای خود را در کوبرنتیز اضافه کنند. فایل‌های باینری و وابستگی‌های درایور FlexVolume باید روی دستگاه‌های میزبان نصب شوند. این امر نیاز به دسترسی روت دارد. Storage SIG پیشنهاد می‌کند در صورت امکان، یک درایور {{< glossary_tooltip text="CSI" term_id="csi" >}} پیاده‌سازی شود، زیرا محدودیت‌های FlexVolumes را برطرف می‌کند.

* [FlexVolume در مستندات کوبرنتیز](/docs/concepts/storage/volumes/#flexvolume)
* [اطلاعات بیشتر در مورد FlexVolumes](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-storage/flexvolume.md)
* [سوالات متداول در مورد افزونه Volume برای فروشندگان فضای ذخیره‌سازی](https://github.com/kubernetes/community/blob/master/sig-storage/volume-plugin-faq.md)
