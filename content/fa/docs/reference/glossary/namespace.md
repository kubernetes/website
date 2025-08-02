---
title: فضای نام
id: namespace
date: 2018-04-12
full_link: /docs/concepts/overview/working-with-objects/namespaces
short_description: >
  انتزاعی که کوبرنتیز برای جداسازی گروهی از منابع درون یک خوشه به‌کار می‌بَرد.

aka: 
tags:
- fundamental
---
 انتزاعی که کوبرنتیز برای جداسازی گروه‌هایی از منابع درون یک {{< glossary_tooltip text="cluster" term_id="cluster" >}} به‌کار می‌بَرد.

<!--more--> 

فضاهای نام برای سازمان‌دهی اشیاء در یک خوشه استفاده می‌شوند و روشی برای تقسیم منابع خوشه فراهم می‌کنند.  
نام منابع باید درون یک فضای نام یکتا باشد، اما لزومی ندارد میان فضاهای نام مختلف یکتا باشد.  
محدوده‌بندی مبتنی بر فضای نام تنها برای اشیای دارای فضای نام _(مانند Deployment، Service و …)_ کاربرد دارد و بر اشیای سراسری خوشه _(مانند StorageClass، Node، PersistentVolume و …)_ قابل اعمال نیست.
