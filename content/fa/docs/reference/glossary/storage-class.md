---
title: Storage Class
id: storageclass
date: 2018-04-12
full_link: /docs/concepts/storage/storage-classes
short_description: >
  یک StorageClass روشی برای توصیف انواع مختلف ذخیره‌سازی موجود توسط مدیران فراهم می‌کند.

aka: 
tags:
- core-object
- storage
---
 یک StorageClass روشی برای توصیف انواع مختلف ذخیره‌سازی موجود توسط مدیران فراهم می‌کند.

<!--more--> 

StorageClassها می‌توانند به سطوح کیفیت سرویس، سیاست‌های پشتیبان‌گیری یا سیاست‌های دلخواه تعیین‌شده توسط مدیران خوشه نگاشت شوند.  
هر StorageClass شامل فیلدهای `provisioner`، `parameters` و `reclaimPolicy` است که هنگام نیاز به تأمین پویای یک {{< glossary_tooltip text="Persistent Volume" term_id="persistent-volume" >}} متعلق به آن کلاس به‌کار می‌روند.  
کاربران می‌توانند با استفاده از نام یک شیء StorageClass، کلاس موردنظر خود را درخواست کنند.
