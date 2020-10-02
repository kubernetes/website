---
title: Siklus Hidup Pod
id: pod-lifecycle
date: 2019-02-17
full-link: /id/docs/concepts/workloads/pods/pod-lifecycle/
related:
- pod
- container
aka:
- Pod Lifecycle
tags:
- fundamental
short_description: >
  Tahapan-tahapan yang dilalui oleh sebuah Pod selama masa pakainya.
 
---
Tahapan-tahapan yang dilalui oleh sebuah Pod selama masa pakainya.

<!--more--> 

[Siklus Hidup Pod](/id/docs/concepts/workloads/pods/pod-lifecycle/) didefinisikan dengan tahap atau fase dari Pod. Ada lima kemungkinan fase Pod: Pending, Running, Succeeded, Failed, dan Unknown. Deskripsi tingkat tinggi dari tahapan Pod diringkas dalam _field_ `phase` pada [PodStatus](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podstatus-v1-core).
