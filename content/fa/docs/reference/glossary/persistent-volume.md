---
title: ولیوم پایدار (Persistent Volume)
id: persistent-volume
date: 2018-04-12
full_link: /fa/docs/concepts/storage/persistent-volumes/
short_description: >
  یک آبجکت API که نمایانگر بخشی از فضای ذخیره‌سازی در کلاستر است. این منبع به‌صورت عمومی و پلاگین‌پذیر در دسترس است و فراتر از چرخه‌ی عمر هر {{< glossary_tooltip text="Pod" term_id="pod" >}} منفرد پایدار می‌ماند.

aka: 
tags:
- core-object
- storage
---
 یک آبجکت API که نمایانگر بخشی از فضای ذخیره‌سازی در کلاستر است. این منبع به‌صورت عمومی و پلاگین‌پذیر در دسترس است و فراتر از چرخه‌ی عمر هر {{< glossary_tooltip text="Pod" term_id="pod" >}} منفرد پایدار می‌ماند.

<!--more--> 

PersistentVolumeها (PV) یک API فراهم می‌کنند که جزئیات نحوه‌ی تامین ذخیره‌سازی را از نحوه‌ی مصرف آن انتزاع می‌کند.  
PVها در سناریوهایی که ذخیره‌سازی از پیش قابل ایجاد است (تهیه‌ی ایستا - static provisioning) به‌صورت مستقیم استفاده می‌شوند.  
برای سناریوهایی که به ذخیره‌سازی بر حسب تقاضا نیاز دارند (تهیه‌ی پویا - dynamic provisioning)، به‌جای آن از PersistentVolumeClaimها (PVC) استفاده می‌شود.
‍‍