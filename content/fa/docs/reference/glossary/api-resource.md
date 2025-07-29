---
title: منبع API
id: api-resource
date: 2025-02-09
full_link: /docs/reference/using-api/api-concepts/#standard-api-terminology
short_description: >
  یک موجودیت کوبرنتیز، که نشان‌دهنده‌ی یک نقطه‌ی پایانی روی سرور کوبرنتیز API است.
aka:
 - Resource
tags:
- architecture
---
یک موجودیت در سیستم نوع کوبرنتیز، متناظر با یک نقطه‌انتهایی در {{< glossary_tooltip text="رابط برنامه‌نویسی کوبرنتیز" term_id="kubernetes-api" >}}.  
یک منبع معمولاً نمایانگر یک {{< glossary_tooltip text="شیء" term_id="object" >}} است.  
برخی از منابع نمایانگر عملیاتی روی اشیاء دیگر هستند، مانند بررسی مجوز.  
<!--more-->  
هر منبع یک نقطه‌انتهایی HTTP (URI) در سرور API کوبرنتیز را نمایش می‌دهد و طرح‌واره اشیاء یا عملیات روی آن منبع را تعریف می‌کند.  