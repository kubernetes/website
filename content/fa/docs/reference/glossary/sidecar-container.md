---
title: کانتینر سایدکار
id: sidecar-container
date: 2018-04-12
full_link: 
short_description: >
  یک کانتینر کمکی که در سراسر چرخهٔ عمر یک پاد در حال اجرا باقی می‌ماند.
full_link: /docs/concepts/workloads/pods/sidecar-containers/
tags:
- fundamental
---
 یک یا چند {{< glossary_tooltip text="containers" term_id="container" >}} که معمولاً پیش از شروع کانتینرهای برنامه اجرا می‌شوند.

<!--more--> 

کانتینرهای سایدکار مشابه کانتینرهای معمولیِ برنامه هستند، اما هدف متفاوتی دارند: سایدکار یک سرویس محلی در سطح پاد را برای کانتینر اصلی برنامه فراهم می‌کند.  
برخلاف {{< glossary_tooltip text="init containers" term_id="init-container" >}}، کانتینرهای سایدکار پس از راه‌اندازی پاد همچنان در حال اجرا می‌مانند.

برای اطلاعات بیشتر، [کانتینرهای سایدکار](/docs/concepts/workloads/pods/sidecar-containers/) را بخوانید.
