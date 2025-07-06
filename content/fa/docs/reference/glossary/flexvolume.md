---
title: FlexVolume
id: flexvolume
date: 2018-06-25
full_link: /docs/concepts/storage/volumes/#flexvolume
short_description: >
    FlexVolume یک رابط منسوخ برای ایجاد افزونه‌های حجم خارج از درخت است. {{< glossary_tooltip text="Container Storage Interface" term_id="csi" >}} یک رابط جدیدتر است که چندین مشکل FlexVolume را برطرف می‌کند.


aka: 
tags:
- storage 
---
 FlexVolume یک رابط منسوخ برای ایجاد افزونه‌های حجم خارج از درخت است. {{< glossary_tooltip text="Container Storage Interface" term_id="csi" >}} یک رابط جدیدتر است که چندین مشکل FlexVolume را برطرف می‌کند.

<!--more--> 

FlexVolumeها به کاربران اجازه می‌دهند درایورهای خود را بنویسند و پشتیبانی از حجم‌هایشان را در کوبرنتیز اضافه کنند. فایل‌های باینری درایور FlexVolume و وابستگی‌های آن باید روی ماشین‌های میزبان نصب شوند که به دسترسی ریشه نیاز دارد. گروه SIG Storage پیشنهاد می‌کند در صورت امکان یک درایور {{< glossary_tooltip text="CSI" term_id="csi" >}} پیاده‌سازی شود، زیرا محدودیت‌های FlexVolume را رفع می‌کند.

* [FlexVolume در مستندات کوبرنتیز](/docs/concepts/storage/volumes/#flexvolume)
* [اطلاعات بیشتر دربارهٔ FlexVolumeها](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-storage/flexvolume.md)
* [سؤالات متداول افزونهٔ حجم برای فروشندگان ذخیره‌سازی](https://github.com/kubernetes/community/blob/master/sig-storage/volume-plugin-faq.md)
