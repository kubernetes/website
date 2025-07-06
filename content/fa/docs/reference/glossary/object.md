---
title: شیء
id: object
date: 2020-10-12
full_link: /docs/concepts/overview/working-with-objects/#kubernetes-objects
short_description: >
   یک موجودیت در سیستم کوبرنتیز که بخشی از وضعیت خوشهٔ شما را نمایندگی می‌کند.
aka:
tags:
- architecture
- fundamental
---
یک موجودیت در سیستم کوبرنتیز است. یک شیء یک
{{< glossary_tooltip text="API resource" term_id="api-resource" >}} است که API کوبرنتیز
برای نمایش وضعیت خوشهٔ شما از آن استفاده می‌کند.
<!--more-->
یک شیء در کوبرنتیز معمولاً «رکوردی از قصد» است—پس از اینکه شیء را ایجاد می‌کنید،
{{< glossary_tooltip text="control plane" term_id="control-plane" >}} کوبرنتیز به‌طور مداوم تلاش می‌کند
اطمینان یابد موردی که این شیء نمایندگی می‌کند واقعاً وجود داشته باشد.
با ایجاد یک شیء، در واقع به سیستم کوبرنتیز می‌گویید که می‌خواهید آن بخش از بار کاری
خوشه‌ٔ شما چه شکلی داشته باشد؛ این همان وضعیت مطلوب خوشهٔ شما است.
