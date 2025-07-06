---
title: تخلیه
id: drain
date: 2024-12-27
full_link:
short_description: >
  پادها را به طور ایمن از یک گره خارج می‌کند تا برای تعمیر و نگهداری یا حذف آماده شود.
tags:
- fundamental
- operation
---
فرایند تخلیهٔ ایمن {{< glossary_tooltip text="Pods" term_id="pod" >}} از یک {{< glossary_tooltip text="Node" term_id="node" >}} برای آماده‌سازی آن جهت نگه‌داری یا حذف از یک {{< glossary_tooltip text="cluster" term_id="cluster" >}}.

<!--more-->

دستور `kubectl drain` برای علامت‌گذاری یک {{< glossary_tooltip text="Node" term_id="node" >}} به‌عنوان خارج از سرویس استفاده می‌شود.  
وقتی اجرا شود، همهٔ {{< glossary_tooltip text="Pods" term_id="pod" >}} را از آن {{< glossary_tooltip text="Node" term_id="node" >}} بیرون می‌کند.  
اگر یک درخواست تخلیه موقتاً رد شود، `kubectl drain` دوباره تلاش می‌کند تا همهٔ {{< glossary_tooltip text="Pods" term_id="pod" >}} خاتمه یابند یا مهلت قابل پیکربندی تمام شود.
