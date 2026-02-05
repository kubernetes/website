---
title: Container Runtime
id: container-runtime
date: 2019-06-05
full_link: /docs/setup/production-environment/container-runtimes
short_description: >
 container runtime نرم افزاری است که مسئول اجرای کانتینرها است.

aka:
tags:
- fundamental
- workload
---
 یک جزء اساسی که کوبرنتیز را قادر می‌سازد تا کانتینرها را به طور مؤثر اجرا کند.
 این بخش مسئول مدیریت اجرا و چرخه حیات کانتینرها در محیط کوبرنتیز است.

<!--more-->

کوبرنتیز از container runtimeهایی نظیر
{{< glossary_tooltip term_id="containerd" >}}٬ {{< glossary_tooltip term_id="cri-o" >}}٬
و دیگر [Kubernetes CRI (Container Runtime
Interface)](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-node/container-runtime-interface.md)ها پشتیبانی می‌کند.
