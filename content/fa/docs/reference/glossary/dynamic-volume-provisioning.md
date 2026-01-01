---
title: تأمین پویای حجم
id: dynamicvolumeprovisioning
date: 2018-04-12
full_link: /docs/concepts/storage/dynamic-provisioning
short_description: >
  به کاربران اجازه می‌دهد تا درخواست ایجاد خودکار حجم های ذخیره‌سازی را بدهند.

aka: 
tags:
- storage
---
 به کاربران اجازه می‌دهد تا ایجاد خودکار فضای ذخیره‌سازی {{< glossary_tooltip text="Volumes" term_id="volume" >}} را درخواست کنند.

<!--more--> 

تأمین پویا، نیاز مدیران cluster به پیش‌تأمین فضای ذخیره‌سازی را از بین می‌برد. در عوض، به طور خودکار فضای ذخیره‌سازی را بر اساس درخواست کاربر تأمین می‌کند. تأمین پویای فضای ذخیره‌سازی بر اساس یک شیء API به نام {{< glossary_tooltip text="StorageClass" term_id="storage-class" >}} است که به {{< glossary_tooltip text="افزونه‌ی حجم" term_id="volume-plugin" >}} اشاره دارد که {{< glossary_tooltip text="Volume" term_id="volume" >}} و مجموعه‌ای از پارامترها را برای ارسال به افزونه‌ی فضای ذخیره‌سازی فراهم می‌کند.

