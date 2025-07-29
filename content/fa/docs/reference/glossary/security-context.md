---
title: Security Context
id: security-context
date: 2018-04-12
full_link: /docs/tasks/configure-pod-container/security-context/
short_description: >
  فیلد securityContext تنظیمات امتیاز و کنترل دسترسی برای یک پاد یا کانتینر را تعریف می‌کند.

aka: 
tags:
- security
---
 فیلد `securityContext` تنظیمات امتیاز و کنترل دسترسی را برای
یک {{< glossary_tooltip text="Pod" term_id="pod" >}} یا
{{< glossary_tooltip text="container" term_id="container" >}} تعریف می‌کند.

<!--more-->

در یک `securityContext` می‌توانید موارد زیر را تعریف کنید: کاربری که فرایندها با آن اجرا می‌شوند،
گروهی که فرایندها با آن اجرا می‌شوند و تنظیمات امتیاز.  
همچنین می‌توانید سیاست‌های امنیتی را پیکربندی کنید (برای نمونه: SELinux، AppArmor یا seccomp).

تنظیم `PodSpec.securityContext` برای همه کانتینرهای یک پاد اعمال می‌شود.
