---
title: لایه تجمیع
id: aggregation-layer
date: 2018-10-08
full_link: /docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/
short_description: >
  لایه تجمیع به شما امکان می‌دهد APIهای اضافی به سبک کوبرنتیز را در کلاستر خود نصب کنید.

aka: 
tags:
- architecture
- extension
- operation
---
  لایه تجمیع به شما امکان می‌دهد APIهای اضافی به سبک کوبرنتیز را در کلاستر خود نصب کنید.

<!--more-->

وقتی {{< glossary_tooltip text="سرور API کوبرنتیز" term_id="kube-apiserver" >}} را برای [پشتیبانی از APIهای اضافی](/docs/tasks/extend-kubernetes/configure-aggregation-layer/) پیکربندی کرده‌اید، می‌توانید اشیای `APIService` را برای «ادعا کردن» یک مسیر URL در API کوبرنتیز اضافه کنید.
