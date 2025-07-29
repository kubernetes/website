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
 کانتینرهای برنامه (یا اپلیکیشن) {{< glossary_tooltip text="کانتینرها" term_id="container" >}} در یک {{< glossary_tooltip text="پاد" term_id="pod" >}} هستند که پس از اتمام هر {{< glossary_tooltip text="کانتینر‌های init" term_id="init-container" >}} اجرا می‌شوند.

<!--more-->

کانتینر init به شما اجازه می‌دهد جزئیات راه‌اندازی را که برای کل {{< glossary_tooltip text="بارکاری" term_id="workload" >}} مهم است و پس از شروع کانتینر برنامه نیازی به ادامه اجرا ندارند، جدا نگه دارید.  
اگر برای یک پاد هیچ کانتینر init پیکربندی نشده باشد، تمام کانتینرهای آن پاد، کانتینر برنامه محسوب می‌شوند.
