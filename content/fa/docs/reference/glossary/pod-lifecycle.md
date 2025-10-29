---
title: چرخه‌ی عمر پاد
id: pod-lifecycle
date: 2019-02-17
full-link: /docs/concepts/workloads/pods/pod-lifecycle/
related:
 - pod
 - container
tags:
 - fundamental
short_description: >
  توالی وضعیت‌هایی که یک پاد در طول عمر خود از آن‌ها عبور می‌کند.
 
---
توالی وضعیت‌هایی که یک پاد در طول عمر خود از آن‌ها عبور می‌کند.

<!--more--> 

[چرخه‌ی عمر پاد](/docs/concepts/workloads/pods/pod-lifecycle/) با وضعیت‌ها یا فازهای یک پاد تعریف می‌شود. پنج فاز ممکن برای پاد وجود دارد: Pending، Running، Succeeded، Failed و Unknown. توصیف سطح‌بالای وضعیت پاد در فیلد `phase` از [PodStatus](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podstatus-v1-core) خلاصه می‌شود.
