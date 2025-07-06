---
title: سیاست امنیتی پاد
id: pod-security-policy
date: 2018-04-12
full_link: /docs/concepts/security/pod-security-policy/
short_description: >
  امکان مجوزدهی دقیق برای ایجاد و به‌روزرسانی پاد را فراهم می‌کند.

aka: 
tags:
- core-object
- fundamental
---
 امکان مجوزدهی دقیق برای ایجاد و به‌روزرسانی {{< glossary_tooltip term_id="pod" >}} را فراهم می‌کند.

<!--more--> 

یک منبع در سطح خوشه که جنبه‌های حساس به امنیتِ مشخصات پاد را کنترل می‌کند. اشیای `PodSecurityPolicy` مجموعه‌ای از شرایط را تعریف می‌کنند که یک پاد باید با آن‌ها اجرا شود تا در سیستم پذیرفته شود، و همچنین مقادیر پیش‌فرض را برای فیلدهای مرتبط تعیین می‌کنند. کنترل «سیاست امنیتی پاد» به‌عنوان یک کنترلر پذیرش اختیاری پیاده‌سازی شده است.

`PodSecurityPolicy` از نسخهٔ v1.21 کوبرنتیز منسوخ و در v1.25 حذف شد.  
به‌عنوان جایگزین، از [Pod Security Admission](/docs/concepts/security/pod-security-admission/) یا یک افزونهٔ پذیرش شخص ثالث استفاده کنید.
