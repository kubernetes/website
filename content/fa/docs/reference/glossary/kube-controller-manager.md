---
title: مدیر کنترل‌کنندهٔ کوبرنتیز
id: kube-controller-manager
date: 2018-04-12
full_link: /docs/reference/command-line-tools-reference/kube-controller-manager/
short_description: >
  یک مؤلفهٔ کنترل پلین که فرایندهای کنترلر را اجرا می‌کند.

aka: 
tags:
- architecture
- fundamental
---
 یک مؤلفهٔ کنترل پلین که فرایندهای {{< glossary_tooltip text="controller" term_id="controller" >}} را اجرا می‌کند.

<!--more-->

از نظر منطقی، هر {{< glossary_tooltip text="controller" term_id="controller" >}} یک فرایند جداگانه است، اما برای کاهش پیچیدگی، همهٔ آن‌ها در یک باینری واحد کامپایل شده و در یک فرایند واحد اجرا می‌شوند.
