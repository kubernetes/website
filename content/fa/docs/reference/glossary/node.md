---
title: گره (Node)
id: node
date: 2018-04-12
full_link: /docs/concepts/architecture/nodes/
short_description: >
  گره یک ماشین worker در کوبرنتیز است.
aka:
tags:
- core-object
- fundamental
---
 گره یک ماشین worker در کوبرنتیز است.

<!--more-->

یک گره worker می‌تواند بسته‌ به کلاستر، یک ماشین مجازی (VM) یا ماشین فیزیکی باشد.
روی آن دیمون‌ها یا سرویس‌های محلی لازم برای اجرای {{< glossary_tooltip text="پادها" term_id="pod" >}} اجرا می‌شوند و این گره توسط کنترل پلین مدیریت می‌شود.
دیمون‌های روی گره شامل {{< glossary_tooltip text="kubelet" term_id="kubelet" >}},
{{< glossary_tooltip text="kube-proxy" term_id="kube-proxy" >}} و یک کانتینر ران‌تایم (container runtime) که
{{< glossary_tooltip text="CRI" term_id="cri" >}} را پیاده‌سازی می‌کند (مانند {{< glossary_tooltip term_id="docker" >}}) است.

در نسخه‌های اولیه‌ی کوبرنتیز، به گره‌ها «Minions» گفته می‌شد.
