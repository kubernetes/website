---
title: چرخه عمر پاد
id: pod-lifecycle
date: 2019-02-17
full-link: /docs/concepts/workloads/pods/pod-lifecycle/
related:
 - pod
 - container
tags:
 - fundamental
short_description: >
  توالی وضعیت‌هایی که یک پاد در طول عمر خود طی می‌کند.
 
---
 توالی وضعیت‌هایی که یک پاد در طول عمر خود طی می‌کند.

<!--more--> 

[چرخه عمر پاد](/docs/concepts/workloads/pods/pod-lifecycle/) با فازهای یک پاد تعریف می‌شود. پنج فاز ممکن برای پاد وجود دارد: Pending، Running، Succeeded، Failed و Unknown. توضیح سطح بالای وضعیت پاد در فیلد `phase` از [PodStatus](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podstatus-v1-core) خلاصه می‌شود.
