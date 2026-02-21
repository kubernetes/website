---
title: سیاست امنیتی پاد (Pod Security Policy)
id: pod-security-policy
date: 2018-04-12
full_link: /fa/docs/concepts/security/pod-security-policy/
short_description: >
  مجوزدهی دقیق برای ایجاد و به‌روزرسانی پاد را فعال می‌کند.

aka:
tags:
- core-object
- fundamental
---
 مجوزدهی دقیق برای ایجاد و به‌روزرسانی {{< glossary_tooltip text="پاد" term_id="pod" >}} را فعال می‌کند.

<!--more-->

یک منبع در سطح کلاستر که جنبه‌های حساس امنیتی مشخصات پاد را کنترل می‌کند. آبجکت‌های `PodSecurityPolicy` مجموعه‌ای از شرایطی را تعریف می‌کنند که یک پاد باید با آن‌ها اجرا شود تا در سیستم پذیرفته شود؛ همچنین مقادیر پیش‌فرض برای فیلدهای مرتبط را تعیین می‌کنند. کنترلر «سیاست امنیتی پاد» به‌صورت یک پذیرش Admission Controller اختیاری پیاده‌سازی می‌شود.

`PodSecurityPolicy` از کوبرنتیز v1.21 منسوخ شد و در v1.25 حذف گردید.
به‌جای آن از [پذیرش امنیتی پاد](/fa/docs/concepts/security/pod-security-admission/) یا یک افزونه‌ی پذیرش شخص ثالث استفاده کنید.
