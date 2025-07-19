---
title: زمان اجرای کانتینر
id: container-runtime
date: 2019-06-05
full_link: /docs/setup/production-environment/container-runtimes
short_description: >
 زمان اجرای کانتینر، نرم‌افزاری است که مسئول اجرای کانتینرها است.

aka:
tags:
- fundamental
- workload
---
 یک جزء بنیادی که به کوبرنتیز امکان اجرای مؤثر کانتینرها را می‌دهد.  
 این جزء مسئول مدیریت اجرای کانتینرها و چرخه عمر آن‌ها در محیط کوبرنتیز است.

<!--more-->

کوبرنتیز از محیط‌های اجرای کانتینر مانند  
{{< glossary_tooltip term_id="containerd" >}}، {{< glossary_tooltip term_id="cri-o" >}}  
و هر پیاده‌سازی دیگری از [CRI کوبرنتیز (رابط اجرای کانتینر)](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-node/container-runtime-interface.md) پشتیبانی می‌کند.  
