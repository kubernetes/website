---
title: Namespace
id: namespace
full_link: /docs/concepts/overview/working-with-objects/namespaces
short_description: >
  یک انتزاع که کوبرنتیز برای پشتیبانی از جداسازی گروه‌هایی از منابع در یک کلاستر واحد از آن استفاده می‌کند.

aka: 
tags:
- fundamental
---
 یک انتزاع که کوبرنتیز برای پشتیبانی از جداسازی گروه‌هایی از منابع در یک {{< glossary_tooltip text="کلاستر" term_id="cluster" >}} واحد از آن استفاده می‌کند.

<!--more--> 

namespace ها برای سازمان‌دهی آبجکت‌ها در یک کلاستر استفاده می‌شوند و روشی برای تقسیم منابع کلاستر فراهم می‌کنند. نام منابع باید در هر namespace یکتا باشد، اما لازم نیست در میان همه‌ی namespaceها یکتا باشد. محدوده‌دهی مبتنی بر namespace فقط برای آبجکت‌های namespaceدار _(مثلا Deploymentها، Serviceها و …)_ کاربرد دارد و برای آبجکت‌های سراسری کلاستر _(مثلا StorageClass، Nodeها، PersistentVolumeها و …)_ کاربرد ندارد.
