---
title: درخواست ولیوم پایدار (Persistent Volume Claim)
id: persistent-volume-claim
date: 2018-04-12
full_link: /docs/concepts/storage/persistent-volumes/#persistentvolumeclaims
short_description: >
  منابع ذخیره‌سازی تعریف‌شده در یک PersistentVolume را مطالبه می‌کند تا بتوان آن را به‌صورت یک ولیوم در یک کانتینر مانت کرد.

aka: 
tags:
- core-object
- storage
---
 مطالبه‌ی منابع ذخیره‌سازی تعریف‌شده در یک {{< glossary_tooltip text="ولیوم پایدار (PersistentVolume)" term_id="persistent-volume" >}} تا بتوان آن را به‌صورت یک ولیوم در یک {{< glossary_tooltip text="کانتینر" term_id="container" >}} مانت کرد.

<!--more--> 

 میزان فضای ذخیره‌سازی، شیوه‌ی دسترسی به آن (فقط‌خواندنی، خواندن‌و‌نوشتن و/یا انحصاری) و شیوه‌ی بازپس‌گیری آن (نگه‌داری، بازیافت یا حذف) را مشخص می‌کند. جزئیات خود فضای ذخیره‌سازی در آبجکت PersistentVolume توصیف شده است.
