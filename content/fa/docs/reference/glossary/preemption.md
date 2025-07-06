---
title: پیش‌دستی
id: preemption
date: 2019-01-31
full_link: /docs/concepts/scheduling-eviction/pod-priority-preemption/#preemption
short_description: >
  منطق پیش‌دستی در کوبرنتیز به یک پاد معلق کمک می‌کند با تخلیهٔ پادهای کم‌اولویت روی همان گره، گرهٔ مناسب خود را بیابد.

aka:
tags:
- operation
---
 منطق پیش‌دستی در کوبرنتیز به یک {{< glossary_tooltip term_id="pod" >}} معلق کمک می‌کند با تخلیهٔ پادهای کم‌اولویت موجود روی آن {{< glossary_tooltip term_id="node" >}}، گرهٔ مناسب خود را بیابد.

<!--more-->

اگر یک پاد نتواند زمان‌بندی شود، زمان‌بند تلاش می‌کند [پیش‌دستی](/docs/concepts/scheduling-eviction/pod-priority-preemption/#preemption) کرده و پادهای کم‌اولویت را تخلیه کند تا زمان‌بندی پاد معلق ممکن شود.
