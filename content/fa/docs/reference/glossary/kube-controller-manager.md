---
title: kube-controller-manager
id: kube-controller-manager
full_link: /docs/reference/command-line-tools-reference/kube-controller-manager/
short_description: >
  جزء control plane که فرایندهای کنترل کننده را اجرا می‌کند.

aka: 
tags:
- architecture
- fundamental
---
 جزء control plane که فرایندهای {{< glossary_tooltip text="کنترل کننده" term_id="controller" >}} را اجرا می‌کند.

<!--more-->

از نظر منطقی، هر {{< glossary_tooltip text="کنترل کننده" term_id="controller" >}} یک فرایند جداگانه است، اما برای کاهش پیچیدگی، همه آن‌ها در یک باینری واحد کامپایل شده و در قالب یک فرایند واحد اجرا می‌شوند.
