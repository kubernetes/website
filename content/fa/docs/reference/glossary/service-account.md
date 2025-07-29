---
title: ServiceAccount
id: service-account
date: 2018-04-12
full_link: /docs/tasks/configure-pod-container/configure-service-account/
short_description: >
  هویت لازم برای فرآیندهایی که در یک پاد اجرا می‌شوند را فراهم می‌کند.

aka: 
tags:
- fundamental
- core-object
---
 هویتی برای فرآیندهایی فراهم می‌کند که در یک {{< glossary_tooltip text="Pod" term_id="pod" >}} اجرا می‌شوند.

<!--more--> 

وقتی فرآیندهای درون پاد به خوشه دسترسی پیدا می‌کنند، سرور API آن‌ها را به‌عنوان یک حساب سرویس مشخص (برای مثال `default`) احراز هویت می‌کند. هنگام ایجاد یک پاد، اگر حساب سرویس مشخص نکنید، به‌طور خودکار حساب سرویس پیش‌فرض در همان {{< glossary_tooltip text="Namespace" term_id="namespace" >}} به آن اختصاص داده می‌شود.
