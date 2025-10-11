---
title: kube-controller-manager
id: kube-controller-manager
date: 2018-04-12
full_link: /docs/reference/command-line-tools-reference/kube-controller-manager/
short_description: >
  جزء کنترل پلین که فرایندهای کنترلر را اجرا می‌کند.

aka: 
tags:
- architecture
- fundamental
---
 جزء کنترل پلین که فرایندهای {{< glossary_tooltip text="کنترلر" term_id="controller" >}} را اجرا می‌کند.

<!--more-->

از نظر منطقی، هر {{< glossary_tooltip text="کنترلر" term_id="controller" >}} یک فرایند جداگانه است، اما برای کاهش پیچیدگی، همه آن‌ها در یک باینری واحد کامپایل شده و در قالب یک فرایند واحد اجرا می‌شوند.
