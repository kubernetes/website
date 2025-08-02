---
title: Kubelet
id: kubelet
date: 2018-04-12
full_link: /docs/reference/generated/kubelet
short_description: >
  یک عامل (agent) که روی هر نود در خوشه اجرا می‌شود و اطمینان می‌دهد کانتینرها در یک پاد در حال اجرا باشند.

aka:
tags:
- fundamental
---
 یک عامل که روی هر {{< glossary_tooltip text="node" term_id="node" >}} در خوشه اجرا می‌شود و اطمینان می‌دهد {{< glossary_tooltip text="containers" term_id="container" >}} در یک {{< glossary_tooltip text="Pod" term_id="pod" >}} در حال اجرا باشند.

<!--more-->

[kubelet](/docs/reference/command-line-tools-reference/kubelet/) مجموعه‌ای از PodSpecهایی را که از طریق سازوکارهای مختلف فراهم می‌شوند دریافت می‌کند و اطمینان می‌دهد کانتینرهای توصیف‌شده در آن PodSpecها در حال اجرا و سالم باشند. kubelet کانتینرهایی را که توسط کوبرنتیز ایجاد نشده‌اند مدیریت نمی‌کند.
