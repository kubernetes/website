---
title: پیش‌دستی (Preemption)
id: preemption
date: 2019-01-31
full_link: /docs/concepts/scheduling-eviction/pod-priority-preemption/#preemption
short_description: >
  منطق پیش‌دستی (Preemption) در کوبرنتیز با تخلیه پادهای کم‌اولویت موجود روی یک گره، به یک پاد در انتظار کمک می‌کند تا گره مناسبی پیدا کند.

aka:
tags:
- operation
---
 منطق پیش‌دستی (Preemption) در کوبرنتیز با تخلیه پادهای کم‌اولویت موجود روی آن {{< glossary_tooltip term_id="node" >}}، به یک {{< glossary_tooltip term_id="pod" >}} در حالت انتظار کمک می‌کند تا یک گره مناسب پیدا کند.

<!--more-->

اگر یک پاد نتواند اسکجول شود، اسکجولر تلاش می‌کند پادهای با اولویت پایین‌تر را
[پیش‌دستی (preempt)](/docs/concepts/scheduling-eviction/pod-priority-preemption/#preemption)
کند (از دسترس خارج کند) تا اسکجولینگ پاد در انتظار (pending) ممکن شود.
