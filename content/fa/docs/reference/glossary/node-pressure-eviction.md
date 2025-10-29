---
title: اویکشن(eviction) به‌دلیل فشار گره
id: node-pressure-eviction
date: 2021-05-13
full_link: /fa/docs/concepts/scheduling-eviction/node-pressure-eviction/
short_description: >
  «اویکشن به‌دلیل فشار گره» فرایندی است که در آن kubelet به‌صورت پیش‌دستانه
  پادها را برای بازپس‌گیری منابع روی گره‌ها متوقف می‌کند.
aka:
- kubelet eviction
tags:
- operation
---
«اویکشن به‌دلیل فشار گره» فرایندی است که در آن {{<glossary_tooltip term_id="kubelet" text="kubelet">}} به‌صورت پیش‌دستانه
پادها را برای بازپس‌گیری منابع روی گره‌ها خاتمه می‌دهد.

<!--more-->

kubelet منابعی مانند CPU، حافظه، فضای دیسک و inodeهای فایل سیستم را روی گره‌های کلاستر شما پایش می‌کند.
وقتی یک یا چند مورد از این منابع به سطوح مصرف مشخصی برسند، kubelet می‌تواند به‌صورت پیش‌دستانه
یک یا چند پاد را روی آن گره متوقف کند تا منابع را بازپس‌گیری کرده و از گرسنگی منابع (کمبود منابع) جلوگیری کند.

«اویکشن به‌دلیل فشار گره» با [اویکشن آغازشده از طریق API](/fa/docs/concepts/scheduling-eviction/api-eviction/) یکسان نیست.
