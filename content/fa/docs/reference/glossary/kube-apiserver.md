---
title: سرور API
id: kube-apiserver
date: 2018-04-12
full_link: /fa/docs/concepts/architecture/#kube-apiserver
short_description: >
  جزء کنترل پلین که API کوبرنتیز را ارائه می‌کند.

aka:
- kube-apiserver
tags:
- architecture
- fundamental
---
 سرور API جزئی از {{< glossary_tooltip text="کنترل پلین" term_id="control-plane" >}} کوبرنتیز است که API کوبرنتیز را در اختیار قرار می‌دهد.
سرور API رابط جلویی کنترل پلین کوبرنتیز است.

<!--more-->

پیاده‌سازی اصلی سرور API کوبرنتیز، [kube-apiserver](/docs/reference/generated/kube-apiserver/) است.
`kube-apiserver` برای مقیاس‌پذیری افقی طراحی شده است؛ یعنی با استقرار نمونه‌های بیش‌تر مقیاس می‌گیرد.
می‌توانید چندین نمونه از `kube-apiserver` را اجرا کرده و ترافیک را میان آن‌ها متوازن کنید.
