---
title: کانتینر زودگذر
id: ephemeral-container
date: 2019-08-26
full_link: /docs/concepts/workloads/pods/ephemeral-containers/
short_description: >
  نوعی کانتینر که می‌توانید به طور موقت درون یک Pod اجرا کنید.

aka:
tags:
- fundamental
---
یک نوع {{< glossary_tooltip text="کانتینر" term_id="container" >}} که می‌توانید به طور موقت درون یک {{< glossary_tooltip text="Pod" term_id="pod" >}} اجرا کنید.

<!--more-->

اگر می‌خواهید یک Pod که با مشکل اجرا می‌شود را بررسی کنید، می‌توانید یک کانتینر موقت به آن Pod اضافه کنید و عیب‌یابی را انجام دهید. کانتینرهای موقت هیچ تضمینی برای منابع یا زمان‌بندی ندارند و شما نباید از آنها برای اجرای هیچ بخشی از بار کاری خود استفاده کنید.

کانتینرهای موقت توسط {{< glossary_tooltip text="Pod استاتیک" term_id="static-pod" >}} پشتیبانی نمی‌شوند.
