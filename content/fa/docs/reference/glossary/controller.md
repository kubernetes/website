---
title: کنترل کننده
id: controller
date: 2018-04-12
full_link: /docs/concepts/architecture/controller/
short_description: >
  یک حلقه کنترلی که وضعیت مشترک کلاستر را از طریق apiserver رصد می‌کند و با ایجاد تغییرات، سعی در انتقال وضعیت فعلی به سمت وضعیت مطلوب دارد.

aka: 
tags:
- architecture
- fundamental
---
در کوبرنتیز، کنترلرها حلقه‌های کنترلی هستند که وضعیت {{< glossary_tooltip term_id="cluster" text="خوشه" >}} شما را زیر نظر می‌گیرند و سپس در صورت نیاز تغییراتی را اعمال یا درخواست می‌کنند.  
هر کنترلر سعی می‌کند وضعیت فعلی خوشه را به وضعیت مطلوب نزدیک‌تر کند.

<!--more-->

کنترلرها وضعیت مشترک خوشه شما را از طریق {{< glossary_tooltip term_id="kube-apiserver" text="سرور API" >}} (جزئی از {{< glossary_tooltip term_id="control-plane" text="صف کنترل" >}}) مشاهده می‌کنند.

برخی از کنترلرها همچنین در داخل صف کنترل اجرا می‌شوند و حلقه‌های کنترلی را فراهم می‌کنند که برای عملیات کوبرنتیز اساسی‌اند. به‌عنوان مثال: کنترلر استقرار (deployment controller)، کنترلر daemonset، کنترلر namespace و کنترلر persistent volume (و دیگر موارد) همگی درون {{< glossary_tooltip term_id="kube-controller-manager" text="مدیر کنترل" >}} اجرا می‌شوند.
