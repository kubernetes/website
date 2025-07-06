---
title: مسئول پذیرش
id: admission-controller
date: 2019-06-28
full_link: /docs/reference/access-authn-authz/admission-controllers/
short_description: >
  قطعه کدی که درخواست‌های ارسالی به سرور Kubernetes API را قبل از ماندگاری شیء، رهگیری می‌کند.

aka:
tags:
- extension
- security
---
قطعه کدی که درخواست‌های ارسالی به سرور Kubernetes API را قبل از ماندگاری شیء، رهگیری می‌کند.

<!--more-->

کنترل‌کننده‌های پذیرش برای سرور API کوبرنتیز قابل پیکربندی هستند و می‌توانند "اعتبارسنجی"، "تغییر" یا هر دو باشند. هر کنترل‌کننده پذیرش می‌تواند درخواست را رد کند. کنترل‌کننده‌های تغییر ممکن است اشیاء پذیرفته‌شده را تغییر دهند؛ کنترل‌کننده‌های اعتبارسنجی ممکن است این کار را نکنند.

* [کنترل‌کننده‌های پذیرش در مستندات کوبرنتیز](/docs/reference/access-authn-authz/admission-controllers/)