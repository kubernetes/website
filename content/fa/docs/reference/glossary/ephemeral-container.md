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
یک نوع {{< glossary_tooltip term_id="container" >}} که می‌توانید آن را به‌طور موقت داخل یک {{< glossary_tooltip term_id="pod" >}} اجرا کنید.

<!--more-->

اگر می‌خواهید پادی را که با مشکل اجرا می‌شود بررسی کنید، می‌توانید یک کانتینر موقتی به آن پاد اضافه کرده و عملیات عیب‌یابی را انجام دهید. کانتینرهای موقتی هیچ تضمین منابع یا زمان‌بندی ندارند و نباید از آن‌ها برای اجرای هیچ بخشی از بار کاری اصلی استفاده کنید.

کانتینرهای موقتی توسط {{< glossary_tooltip text="static pods" term_id="static-pod" >}} پشتیبانی نمی‌شوند.
