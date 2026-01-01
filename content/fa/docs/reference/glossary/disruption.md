---
title: اختلال
id: disruption
date: 2019-09-10
full_link: /docs/concepts/workloads/pods/disruptions/
short_description: >
  An event that leads to Pod(s) going out of service
aka:
tags:
- fundamental
---
 اختلالات رویدادهایی هستند که منجر به از کار افتادن یک یا چند {{< glossary_tooltip term_id="pod" text="Pods" >}} از سرویس می‌شوند. یک اختلال عواقبی برای منابع بار کاری، مانند {{< glossary_tooltip term_id="deployment" >}}، که به Podهای آسیب‌دیده متکی هستند، دارد.

<!--more-->

اگر شما، به عنوان اپراتور خوشه(cluster)، یک Pod متعلق به یک برنامه را از بین ببرید، کوبرنتیز آن را _اختلال داوطلبانه_ می‌نامد. اگر یک Pod به دلیل خرابی یک گره(node) یا قطعی برق که بر یک منطقه خرابی گسترده‌تر تأثیر می‌گذارد، آفلاین شود، کوبرنتیز آن را _اختلال غیرارادی_ می‌نامد.

برای اطلاعات بیشتر به [اختلالات](/docs/concepts/workloads/pods/disruptions/) مراجعه کنید.
