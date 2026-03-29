---
title: kube-proxy
id: kube-proxy
date: 2018-04-12
full_link: /docs/reference/command-line-tools-reference/kube-proxy/
short_description: >
  `kube-proxy` یک پروکسی شبکه است که روی هر گره (node) در کلاستر اجرا می‌شود.

aka:
tags:
- fundamental
- networking
---
kube-proxy یک پروکسی شبکه است که روی هر
{{< glossary_tooltip text="گره (node)" term_id="node" >}} در کلاستر شما اجرا می‌شود
و بخشی از مفهوم {{< glossary_tooltip text="سرویس (Service)" term_id="service">}} در کوبرنتیز را پیاده‌سازی می‌کند.

<!--more-->

[kube-proxy](/docs/reference/command-line-tools-reference/kube-proxy/)
قوانین شبکه را روی گره‌ها نگه‌داری می‌کند. این قوانین شبکه به نشست‌های
شبکه‌ی داخل یا خارج کلاستر اجازه می‌دهند با پادهای شما ارتباط شبکه‌ای برقرار کنند.

اگر لایه‌ی فیلترکردن بسته در سیستم‌عامل وجود داشته و در دسترس باشد، kube-proxy از آن استفاده می‌کند؛
در غیر این صورت، خود kube-proxy ترافیک را فوروارد می‌کند.
