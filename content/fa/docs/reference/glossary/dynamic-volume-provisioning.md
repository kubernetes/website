---
title: تأمین پویای volume
id: dynamicvolumeprovisioning
date: 2018-04-12
full_link: /docs/concepts/storage/dynamic-provisioning
short_description: >
  به کاربران اجازه می‌دهد تا درخواست ایجاد خودکار Volumeهای ذخیره‌سازی را بدهند.

aka: 
tags:
- storage
---
  به کاربران اجازه می‌دهد تا درخواست ایجاد خودکار  {{< glossary_tooltip text="Volumes" term_id="volume" >}}های ذخیره‌سازی را بدهند.

<!--more--> 

تأمین پویای حجم، نیاز مدیران خوشه را به پیش‌تخصیص ذخیره‌سازی از میان برمی‌دارد. در عوض، ذخیره‌سازی به‌طور خودکار بر اساس درخواست کاربر فراهم می‌شود. تأمین پویای حجم بر پایه یک شیء API به نام {{< glossary_tooltip text="StorageClass" term_id="storage-class" >}} است که به یک {{< glossary_tooltip text="Volume Plugin" term_id="volume-plugin" >}} اشاره می‌کند؛ این افزونه یک {{< glossary_tooltip text="Volume" term_id="volume" >}} را فراهم کرده و مجموعه‌ای از پارامترها را برای ارسال به Volume Plugin تعیین می‌کند.

