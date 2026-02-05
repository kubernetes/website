---
title: کنترل کننده
id: controller
date: 2018-04-12
full_link: /docs/concepts/architecture/controller/
short_description: >
  یک حلقه کنترلی که وضعیت مشترک خوشه(cluster) را از طریق apiserver رصد می‌کند و با ایجاد تغییرات، سعی در انتقال وضعیت فعلی به سمت وضعیت مطلوب دارد.

aka: 
tags:
- architecture
- fundamental
---
در کوبرنتیز، کنترل‌کننده‌ها حلقه‌های کنترلی هستند که وضعیت {{< glossary_tooltip term_id="cluster" text="cluster">}} شما را زیر نظر دارند، سپس در صورت لزوم تغییراتی را اعمال یا درخواست می‌کنند. هر کنترل‌کننده سعی می‌کند وضعیت فعلی خوشه را به وضعیت مطلوب نزدیک‌تر کند.

<!--more-->

کنترل‌کننده‌ها وضعیت مشترک کلاستر شما را از طریق {{< glossary_tooltip text="apiserver" term_id="kube-apiserver" >}} (بخشی از
{{< glossary_tooltip term_id="control-plane" >}}) زیر نظر دارند.

برخی از کنترل‌کننده‌ها نیز درون control plane اجرا می‌شوند و حلقه‌های کنترلی را فراهم می‌کنند که هسته عملیات کوبرنتیز هستند. به عنوان مثال: کنترل‌کننده استقرار، کنترل‌کننده daemonset، کنترل‌کننده namespace و کنترل‌کننده حجم پایدار (و موارد دیگر) همگی درون {{< glossary_tooltip term_id="kube-controller-manager" >}} اجرا می‌شوند.
