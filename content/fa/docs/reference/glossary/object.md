---
title: آبجکت (Object)
id: object
date: 2020-10-12
full_link: /fa/docs/concepts/overview/working-with-objects/#kubernetes-objects
short_description: >
   یک موجودیت در سامانه‌ی کوبرنتیز که نمایانگر بخشی از وضعیت کلاستر شماست.
aka:
tags:
- architecture
- fundamental
---
یک موجودیت در سامانه‌ی کوبرنتیز. آبجکت یک
{{< glossary_tooltip text="منبع API" term_id="api-resource" >}}
است که Kubernetes API از آن برای نمایش وضعیت کلاستر شما استفاده می‌کند.

<!--more-->

یک آبجکت کوبرنتیز معمولا «سندی از هدف» (Record of Intent) است — به‌محض این‌که آبجکت را ایجاد کنید،
{{< glossary_tooltip text="کنترل پلین" term_id="control-plane" >}}
کوبرنتیز به‌طور پیوسته کار می‌کند تا اطمینان یابد موردی که این آبجکت نمایندگی می‌کند واقعا وجود دارد.
با ایجاد یک آبجکت، عملا به سامانه‌ی کوبرنتیز می‌گویید می‌خواهید آن بخش از بارکاری (workload) کلاستر شما چگونه باشد؛
این همان «وضعیت مطلوب» (desired state) کلاستر شماست.
