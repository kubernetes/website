---
title: پراکسی کوبرنتیز
id: kube-proxy
date: 2018-04-12
full_link: /docs/reference/command-line-tools-reference/kube-proxy/
short_description: >
  `kube-proxy` یک پراکسی شبکه است که روی هر نود در خوشه اجرا می‌شود.

aka:
tags:
- fundamental
- networking
---
 `kube-proxy` یک پراکسی شبکه است که روی هر
{{< glossary_tooltip text="node" term_id="node" >}} در خوشهٔ شما اجرا می‌شود و بخشی از مفهوم
{{< glossary_tooltip term_id="service">}} کوبرنتیز را پیاده‌سازی می‌کند.

<!--more-->

[kube-proxy](/docs/reference/command-line-tools-reference/kube-proxy/)
قوانین شبکه را روی نودها نگهداری می‌کند. این قوانین شبکه امکان برقراری
ارتباط با پادهای شما را از نشست‌های شبکه داخل یا خارج از خوشه فراهم می‌سازد.

kube-proxy در صورت وجود و در دسترس بودن، از لایهٔ فیلتر بستهٔ سیستم‌عامل استفاده می‌کند؛
در غیر این صورت، kube-proxy خود ترافیک را هدایت می‌کند.
