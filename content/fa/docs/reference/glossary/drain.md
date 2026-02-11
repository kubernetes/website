---
title: تخلیه
id: drain
date: 2024-12-27
full_link:
short_description: >
  پادها را به طور ایمن از یک گره(node) خارج می‌کند تا برای تعمیر و نگهداری یا حذف آماده شود.
tags:
- fundamental
- operation
---
فرآیند حذف ایمن {{< glossary_tooltip text="Podها" term_id="pod" >}} از یک {{< glossary_tooltip text="گره" term_id="node" >}} برای آماده‌سازی آن برای نگهداری یا حذف از {{< glossary_tooltip text="cluster" term_id="cluster" >}}.

<!--more-->

دستور `kubectl drain` برای علامت‌گذاری یک {{< glossary_tooltip text="گره‌ها" term_id="node" >}} به عنوان خارج از سرویس استفاده می‌شود. هنگام اجرا، تمام {{< glossary_tooltip text="Podها" term_id="pod" >}} را از {{< glossary_tooltip text="گره" term_id="node" >}} خارج می‌کند. اگر درخواست خروج موقتاً رد شود، `kubectl drain` تا زمانی که تمام {{< glossary_tooltip text="Podها" term_id="pod" >}} خاتمه یابند یا به یک مهلت زمانی قابل تنظیم برسند، دوباره تلاش می‌کند.
