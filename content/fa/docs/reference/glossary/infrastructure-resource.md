---
title: منابع (زیرساخت)
id: infrastructure-resource
date: 2025-02-09
short_description: >
  مقدار مشخصی از زیرساخت موجود برای مصرف (پردازنده، حافظه و غیره).

aka:
tags:
- architecture
---
قابلیت‌هایی که برای یک یا چند {{< glossary_tooltip text="گره(node)" term_id="node" >}} (پردازنده، حافظه، پردازنده‌های گرافیکی و غیره) ارائه شده و برای مصرف توسط {{< glossary_tooltip text="Pods" term_id="pod" >}} که روی آن گره‌ها اجرا می‌شوند، در دسترس قرار می‌گیرد.

کوبرنتیز همچنین از اصطلاح _منبع_ برای توصیف {{< glossary_tooltip text="منابع API" term_id="api-resource" >}} استفاده می‌کند.

<!--more-->
کامپیوترها امکانات سخت‌افزاری اساسی را فراهم می‌کنند: قدرت پردازش، حافظه ذخیره‌سازی، شبکه و غیره.
این منابع ظرفیت محدودی دارند که با واحدی که برای آن منبع قابل استفاده است (تعداد پردازنده‌ها، بایت‌های حافظه و غیره) اندازه‌گیری می‌شود.
کوبرنتیز [منابع](/docs/concepts/configuration/manage-resources-containers/) رایج را برای تخصیص به Workload‌ها، خلاصه می‌کند و از اجزای اولیه سیستم عامل (به عنوان مثال، لینوکس {{< glossary_tooltip text="cgroups" term_id="cgroup" >}}) برای مدیریت مصرف توسط {{< glossary_tooltip text="workloads" term_id="workload" >}}) استفاده می‌کند.

همچنین می‌توانید از [تخصیص منابع پویا](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/) برای مدیریت خودکار تخصیص منابع پیچیده استفاده کنید.
