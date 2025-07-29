---
title: درخواست حجم پایدار
id: persistent-volume-claim
date: 2018-04-12
full_link: /docs/concepts/storage/persistent-volumes/#persistentvolumeclaims
short_description: >
  منابع ذخیره‌سازی تعریف‌شده در یک PersistentVolume را مطالبه می‌کند تا بتوان آن را به‌عنوان یک وُلِیوم در یک کانتینر مونت کرد.

aka: 
tags:
- core-object
- storage
---
 منابع ذخیره‌سازی تعریف‌شده در یک {{< glossary_tooltip text="PersistentVolume" term_id="persistent-volume" >}} را مطالبه می‌کند تا بتوان آن را به‌عنوان یک وُلِیوم در یک {{< glossary_tooltip text="container" term_id="container" >}} مونت کرد.

<!--more--> 

مقدار فضای ذخیره‌سازی، نحوه دسترسی به آن (فقط‌خواندنی، خواندن‌نوشتن و/یا انحصاری) و چگونگی بازیابی آن (نگه‌داشتن، بازیافت یا حذف) را مشخص می‌کند. جزئیات خود فضای ذخیره‌سازی در شیء PersistentVolume توصیف شده است.
