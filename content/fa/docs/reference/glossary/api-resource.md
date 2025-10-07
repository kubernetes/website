---
title: منبع API
id: api-resource
date: 2025-02-09
full_link: /docs/reference/using-api/api-concepts/#standard-api-terminology
short_description: >
  یک موجودیت کوبرنتیز، که نشان‌دهنده‌ی یک endpoint روی سرور API کوبرنتیز است.

aka:
 - Resource
tags:
- architecture
---
یک موجودیت در سیستم تایپ کوبرنتیز، مربوط به یک endpoint در {{< glossary_tooltip text="API کوبرنتیز" term_id="kubernetes-api" >}}.
یک منبع معمولاً نشان‌دهنده‌ی {{< glossary_tooltip text="شیء" term_id="object" >}} است.
برخی منابع، عملیاتی را روی اشیاء دیگر نشان می‌دهند، مانند بررسی مجوز.
<!--more-->
هر منبع، یک endpoint HTTP (URI) را در سرور API کوبرنتیز نشان می‌دهد که schema اشیاء یا عملیات روی آن منبع را تعریف می‌کند.
