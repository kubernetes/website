---
title: Kubelet
id: kubelet
date: 2018-04-12
full_link: /fa/docs/reference/command-line-tools-reference/kubelet
short_description: >
  عاملی که روی هر گره(node) در کلاستر اجرا می‌شود. این عامل اطمینان می‌دهد کانتینرها در یک پاد در حال اجرا باشند.

aka:
tags:
- fundamental
---
 عاملی که روی هر {{< glossary_tooltip text="گره" term_id="node" >}} در کلاستر اجرا می‌شود. این عامل اطمینان می‌دهد {{< glossary_tooltip text="کانتینرها" term_id="container" >}} در یک {{< glossary_tooltip text="پاد" term_id="pod" >}} در حال اجرا باشند.

<!--more-->

[kubelet](/docs/reference/command-line-tools-reference/kubelet/)
مجموعه‌ای از PodSpecها را که از طریق سازوکارهای مختلف به آن ارائه می‌شوند دریافت می‌کند و تضمین می‌کند کانتینرهای توصیف‌شده در آن PodSpecها در حال اجرا و سالم باشند. kubelet کانتینرهایی را که توسط کوبرنتیز ایجاد نشده‌اند مدیریت نمی‌کند.
