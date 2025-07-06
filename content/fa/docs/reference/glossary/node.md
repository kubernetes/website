---
title: گره
id: node
date: 2018-04-12
full_link: /docs/concepts/architecture/nodes/
short_description: >
  یک گره، ماشین کارگر در کوبرنتیز است.

aka:
tags:
- core-object
- fundamental
---
 یک گره، ماشین کارگر در کوبرنتیز است.

<!--more-->

یک گرهٔ کارگر می‌تواند بسته به خوشه، یک ماشین مجازی یا ماشین فیزیکی باشد.  
این ماشین شامل سرویس‌ها و دیمون‌های محلی لازم برای اجرای {{< glossary_tooltip text="Pods" term_id="pod" >}} است و توسط کنترل پلین مدیریت می‌شود.  
دیمون‌های روی یک گره شامل {{< glossary_tooltip text="kubelet" term_id="kubelet" >}}، {{< glossary_tooltip text="kube-proxy" term_id="kube-proxy" >}} و یک زمان‌اجرای کانتینر که {{< glossary_tooltip text="CRI" term_id="cri" >}} را پیاده‌سازی می‌کند (مانند {{< glossary_tooltip term_id="docker" >}}) هستند.

در نسخه‌های اولیهٔ کوبرنتیز، گره‌ها «Minion» نامیده می‌شدند.
