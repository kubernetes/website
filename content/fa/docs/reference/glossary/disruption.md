---
title: اختلال
id: disruption
date: 2019-09-10
full_link: /docs/concepts/workloads/pods/disruptions/
short_description: >
  رویدادی که منجر به از سرویس خارج شدن پاد(ها) می‌شود
aka:
tags:
- fundamental
---
 اختلال‌ها رویدادهایی هستند که منجر به خارج شدن یک یا چند {{< glossary_tooltip term_id="pod" text="Pods" >}} از سرویس می‌شوند. یک اختلال برای منابع بارکاری مانند {{< glossary_tooltip term_id="deployment" >}} که به Podهای آسیب‌دیده وابسته‌اند، پیامدهایی به همراه دارد.

<!--more-->

اگر شما به‌عنوان اپراتور خوشه، یک Pod را که به یک برنامه تعلق دارد حذف کنید، کوبرنتیز آن را «اختلال داوطلبانه» می‌نامد. اگر یک Pod به دلیل خرابی یک Node یا قطعی در یک ناحیه‌ی وسیع‌تر از دسترس خارج شود، کوبرنتیز آن را «اختلال غیرداوطلبانه» می‌نامد.

برای اطلاعات بیشتر به [Disruptions](/docs/concepts/workloads/pods/disruptions/) مراجعه کنید.
