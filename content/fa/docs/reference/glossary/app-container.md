---
title: کانتینر برنامه
id: app-container
date: 2019-02-12
full_link:
short_description: >
  کانتینری که برای اجرای بخشی از یک بار کاری استفاده می‌شود. با کانتینر init مقایسه کنید.

aka:
tags:
- workload
---
 کانتینرهای برنامه (یا کانتینرهای اپ) {{< glossary_tooltip text="کانتینرهایی" term_id="container" >}} در یک {{< glossary_tooltip text="پاد" term_id="pod" >}} هستند که پس از تکمیل هر {{< glossary_tooltip text="کانتینرهای init" term_id="init-container" >}} آغاز می‌شوند.

<!--more-->

یک کانتینر init به شما امکان می‌دهد جزئیات مقداردهی اولیه‌ای را که برای کل {{< glossary_tooltip text="workload" term_id="workload" >}} مهم هستند و نیازی به ادامه اجرا پس از شروع کانتینر برنامه ندارند، جدا کنید.
اگر یک پاد هیچ کانتینر init نداشته باشد، تمام کانتینرهای داخل آن پاد، کانتینرهای برنامه (app containers) محسوب می‌شوند.
