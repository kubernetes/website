---
title: پاد ایستا
id: static-pod
date: 2019-02-12
full_link: /docs/tasks/configure-pod-container/static-pod/
short_description: >
  یک پاد که مستقیماً توسط دیمون kubelet روی یک گره مشخص مدیریت می‌شود.

aka: 
tags:
- fundamental
---

یک {{< glossary_tooltip text="pod" term_id="pod" >}} که مستقیماً توسط دیمون {{< glossary_tooltip text="kubelet" term_id="kubelet" >}}
روی یک گره مشخص مدیریت می‌شود.

<!--more-->

بدون اینکه سرور API آن را مشاهده کند.

پادهای ایستا از {{< glossary_tooltip text="ephemeral containers" term_id="ephemeral-container" >}} پشتیبانی نمی‌کنند.
