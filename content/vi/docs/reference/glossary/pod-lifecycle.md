---
title: Pod Lifecycle
id: pod-lifecycle
date: 2019-02-17
full-link: /docs/concepts/workloads/pods/pod-lifecycle/
related:
 - pod
 - container
tags:
 - fundamental
short_description: >
  Chuỗi các trạng thái mà một Pod trải qua trong suốt vòng đời của nó.
 
---
Chuỗi các trạng thái mà một Pod trải qua trong suốt vòng đời của nó.

<!--more--> 

[Pod Lifecycle](/docs/concepts/workloads/pods/pod-lifecycle/) được định nghĩa bởi các trạng thái hoặc giai đoạn của một Pod. Pod có thể ở một trong năm giai đoạn: Pending, Running, Succeeded, Failed, và Unknown. Mô tả tổng quan về trạng thái Pod được thể hiện trong trường `phase` của [PodStatus](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podstatus-v1-core).
