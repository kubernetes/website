---
title: هوک‌های چرخه عمر کانتینر
id: container-lifecycle-hooks
date: 2018-10-08
full_link: /docs/concepts/containers/container-lifecycle-hooks/
short_description: >
  هوک های چرخه عمر، رویدادها را در چرخه عمر مدیریت کانتینر نمایش می‌دهند و به کاربر اجازه می‌دهند هنگام وقوع رویدادها، کدی را اجرا کند.

aka:
tags:
- extension
---
  هوک های چرخه عمر، رویدادها را در چرخه عمر مدیریت {{< glossary_tooltip text="Container" term_id="container" >}} نمایش می‌دهند و به کاربر اجازه می‌دهند هنگام وقوع رویدادها، کدی را اجرا کند.

<!--more-->

دو هوک در معرض کانتینرها قرار دارند: PostStart که بلافاصله پس از ایجاد کانتینر اجرا می‌شود و PreStop که مسدودکننده است و بلافاصله قبل از خاتمه کانتینر فراخوانی می‌شود.
