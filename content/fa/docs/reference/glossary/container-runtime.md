---
title: محیط اجرای کانتینر
id: container-runtime
full_link: /docs/setup/production-environment/container-runtimes
short_description: >
 محیط اجرای کانتینر، نرم‌افزاری است که مسئول اجرای کانتینرها است.

aka:
tags:
- fundamental
- workload
---
 یک جزء اساسی که کوبرنتیز را قادر می‌سازد تا کانتینرها را به طور مؤثر اجرا کند.
 این بخش مسئول مدیریت اجرا و چرخه حیات کانتینرها در محیط کوبرنتیز است.

<!--more-->

کوبرنتیز از محیط های اجرای کانتینر مانند {{< glossary_tooltip term_id="containerd" >}}، {{< glossary_tooltip term_id="cri-o" >}}، و هرگونه پیاده‌سازی دیگر از [Kubernetes CRI (رابط محیط اجرای کانتینر)](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-node/container-runtime-interface.md) پشتیبانی می‌کند.
