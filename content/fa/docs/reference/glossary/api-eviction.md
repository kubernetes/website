---
title: اخراج آغاز شده با API.
id: api-eviction
date: 2021-04-27
full_link: /docs/concepts/scheduling-eviction/api-eviction/
short_description: >
  اخراج آغازشده از طریق API فرایندی است که در آن با استفاده از Eviction API یک شیء (Object) از نوع Eviction ایجاد می‌کنید که باعث خاتمهٔ تدریجی (graceful) پاد می‌شود.
aka:
tags:
- operation
---
حذف آغاز شده توسط API فرآیندی است که طی آن شما از [Eviction API](/docs/reference/generated/kubernetes-api/{{<param "version">}}/#create-eviction-pod-v1-core) برای ایجاد یک شیء `Eviction` که باعث خاتمه پاد به تدریج می‌شود، استفاده می‌کنید.

<!--more-->

شما می‌توانید با فراخوانی مستقیم Evicion API با استفاده از یک کلاینت از kube-apiserver، مانند دستور `kubectl drain`، درخواست تخلیه را بدهید. 
وقتی یک شیء `Eviction` ایجاد می‌شود، سرور API، Pod را خاتمه می‌دهد.

حذف‌های آغاز شده توسط API به [`PodDisruptionBudgets`](/docs/tasks/run-application/configure-pdb/) و [`terminationGracePeriodSeconds`](/docs/concepts/workloads/pods/pod-lifecycle#pod-termination) پیکربندی شده شما احترام می‌گذارند.

حذف آغاز شده توسط API با [حذف فشار گره](/docs/concepts/scheduling-eviction/node-pressure-eviction/) یکسان نیست.

* برای اطلاعات بیشتر به [حذف آغاز شده توسط API](/docs/concepts/scheduling-eviction/api-eviction/) مراجعه کنید.
