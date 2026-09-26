---
title: کانتینر زودگذر
id: ephemeral-container
full_link: /docs/concepts/workloads/pods/ephemeral-containers/
short_description: >
  نوعی کانتینر که می‌توانید به طور موقت درون یک پاد اجرا کنید.

aka:
tags:
- fundamental
---
یک نوع {{< glossary_tooltip text="کانتینر" term_id="container" >}} که می‌توانید به طور موقت درون یک {{< glossary_tooltip text="پاد" term_id="pod" >}} اجرا کنید.

<!--more-->

اگر می‌خواهید یک پاد که با مشکل اجرا می‌شود را بررسی کنید، می‌توانید یک کانتینر موقت به آن پاد اضافه کنید و عیب‌یابی را انجام دهید. کانتینرهای موقت هیچ تضمینی برای منابع یا زمان‌بندی ندارند و شما نباید از آنها برای اجرای هیچ بخشی از بار کاری خود استفاده کنید.

کانتینرهای موقت توسط {{< glossary_tooltip text="پاد ایستا" term_id="static-pod" >}} پشتیبانی نمی‌شوند.
