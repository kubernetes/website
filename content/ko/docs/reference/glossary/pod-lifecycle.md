---
title: 파드 라이프사이클(Pod Lifecycle)
id: pod-lifecycle
date: 2019-02-17
full-link: /ko/docs/concepts/workloads/pods/pod-lifecycle/
related:
 - pod
 - container
tags:
 - fundamental
short-description: >
  파드가 수명(lifetime) 동안 통과하는 상태의 순서이다.
 
---
 파드가 수명(lifetime) 동안 통과하는 상태의 순서이다.

<!--more--> 
 
[파드 라이프사이클](/ko/docs/concepts/workloads/pods/pod-lifecycle/)은 파드의 라이프사이클에 대한 고수준의 요약이다. 다섯 가지 파드 단계가 있다: Pending, Running, Succeeded, Failed, 그리고 Unknown. [파드 스테이터스](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podstatus-v1-core)의 `phase` 필드에 파드 상태에 대한 자세한 설명이 요약되어 있다.
