---
title: اخراج با ابتکار API
id: api-eviction
date: 2021-04-27
full_link: /docs/concepts/scheduling-eviction/api-eviction/
short_description: >
  حذف آغاز شده توسط API فرآیندی است که طی آن شما از API حذف برای ایجاد یک شیء حذف که باعث خاتمه غلاف دلپذیر می‌شود، استفاده می‌کنید.
aka:
tags:
- operation
---
تبعید آغازشده توسط API فرایندی است که در آن از [API تبعید](/docs/reference/generated/kubernetes-api/{{<param "version">}}/#create-eviction-pod-v1-core) برای ایجاد یک شیء `Eviction` استفاده می‌کنید که خاتمه‌ی نرم (graceful) پاد را راه‌اندازی می‌کند.

<!--more-->

شما می‌توانید درخواست تبعید را هم با فراخوانی مستقیم API تبعید از طریق یک کلاینت سرور API کوبرنتیز، مانند دستور `kubectl drain`، ارسال کنید.  
وقتی یک شیء `Eviction` ایجاد شود، سرور API پاد را خاتمه می‌دهد.

تبعید آغازشده توسط API از [`PodDisruptionBudgets`](/docs/tasks/run-application/configure-pdb/) و [`terminationGracePeriodSeconds`](/docs/concepts/workloads/pods/pod-lifecycle#pod-termination) پیکربندی‌شده‌ی شما پیروی می‌کند.

تبعید آغازشده توسط API با [تبعید بر اثر فشار گره](/docs/concepts/scheduling-eviction/node-pressure-eviction/) یکسان نیست.

* برای اطلاعات بیشتر به [تبعید آغازشده توسط API](/docs/concepts/scheduling-eviction/api-eviction/) مراجعه کنید.
