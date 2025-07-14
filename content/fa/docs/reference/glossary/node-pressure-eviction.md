---
title: تخلیه در اثر فشار نود
id: node-pressure-eviction
date: 2021-05-13
full_link: /docs/concepts/scheduling-eviction/node-pressure-eviction/
short_description: >
  تخلیه در اثر فشار نود فرایندی است که kubelet به‌صورت پیشگیرانه پادها را برای بازیابی منابع روی نودها از کار می‌اندازد.
aka:
- kubelet eviction
tags:
- operation
---
 تخلیه در اثر فشار نود فرایندی است که {{<glossary_tooltip term_id="kubelet" text="kubelet">}} به‌طور پیشگیرانه پادها را خاتمه می‌دهد
 تا منابع را روی نودها بازیابی کند.

<!--more-->

kubelet منابعی مانند CPU، حافظه، فضای دیسک و inodes سامانه فایل را روی نودهای خوشه شما پایش می‌کند.  
وقتی یک یا چند مورد از این منابع به سطح مصرف مشخصی برسند، kubelet می‌تواند به‌طور پیشگیرانه یک یا چند پاد را
روی آن نود از کار بیندازد تا منابع را بازیابی کرده و از گرسنگی منابع جلوگیری کند. 

تخلیه در اثر فشار نود با [تخلیه آغازشده توسط API](/docs/concepts/scheduling-eviction/api-eviction/) تفاوت دارد.
