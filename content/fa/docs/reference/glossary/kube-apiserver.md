---
title: سرور API
id: kube-apiserver
date: 2018-04-12
full_link: /docs/concepts/architecture/#kube-apiserver
short_description: >
  مؤلفه کنترل پلین که API کوبرنتیز را ارائه می‌کند.

aka:
- kube-apiserver
tags:
- architecture
- fundamental
---
 سرور API مؤلفه‌ای از {{< glossary_tooltip text="control plane" term_id="control-plane" >}} کوبرنتیز است که API کوبرنتیز را در معرض قرار می‌دهد. سرور API رابط جلوییِ کنترل پلین کوبرنتیز است.

<!--more-->

پیاده‌سازی اصلیِ سرور API کوبرنتیز، [kube-apiserver](/docs/reference/generated/kube-apiserver/) است.  
kube-apiserver برای مقیاس‌پذیری افقی طراحی شده است&mdash;یعنی با استقرار نمونه‌های بیشتر مقیاس می‌شود.  
می‌توانید چندین نمونه kube-apiserver را اجرا کرده و ترافیک را میان آن‌ها متعادل کنید.
