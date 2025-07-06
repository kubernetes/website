---
title: منبع (زیرساخت)
id: infrastructure-resource
date: 2025-02-09
short_description: >
  مقدار مشخصی از زیرساخت که برای مصرف در دسترس است (CPU، حافظه و غیره).

aka:
tags:
- architecture
---
 قابلیت‌هایی که به یک یا چند {{< glossary_tooltip text="nodes" term_id="node" >}} (CPU، حافظه، GPUها و غیره) اختصاص داده می‌شود و برای مصرف توسط {{< glossary_tooltip text="Pods" term_id="pod" >}} در حال اجرا روی آن نودها در دسترس قرار می‌گیرد.

کوبرنتیز همچنین از اصطلاح _منبع_ برای توصیف یک {{< glossary_tooltip text="API resource" term_id="api-resource" >}} استفاده می‌کند.

<!--more-->

رایانه‌ها امکانات سخت‌افزاری پایه‌ای را فراهم می‌کنند: توان پردازشی، حافظهٔ ذخیره‌سازی، شبکه و غیره.  
این منابع ظرفیت محدودی دارند که با واحد مناسب همان منبع اندازه‌گیری می‌شود (تعداد CPUها، بایت‌های حافظه و غیره).  
کوبرنتیز منابع رایج را برای تخصیص به بارهای کاری مجرد می‌کند و از سازوکارهای ابتدایی سیستم‌عامل (برای مثال، {{< glossary_tooltip text="cgroups" term_id="cgroup" >}} در لینوکس) برای مدیریت مصرف توسط {{< glossary_tooltip text="workloads" term_id="workload" >}} بهره می‌برد.

همچنین می‌توانید از [تخصیص پویای منابع](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/) برای مدیریت خودکار تخصیص‌های پیچیدهٔ منابع استفاده کنید.
