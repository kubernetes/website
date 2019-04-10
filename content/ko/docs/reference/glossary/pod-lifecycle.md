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
 파드가 라이프사이클 중 어느 단계(phase)에 있는지 표현하는 고수준의 요약이다.
 
---
 파드가 라이프사이클 중 어느 단계(phase)에 있는지 표현하는 고수준의 요약이다.

<!--more--> 
 
[파드 라이프사이클](/ko/docs/concepts/workloads/pods/pod-lifecycle/)은 파드가 라이프사이클 중 어느 단계에 있는지 표현하는 고수준의 요약이다. 파드의 `status` 필드는 [파드 스테이터스](/docs/reference/generated/kubernetes-api/v1.13/#podstatus-v1-core) 오브젝트이다. 그것은 `phase` 필드를 가지며, Running, Pending, Succeeded, Failed, Unknown, Completed, CrashLoopBackOff 중 하나의 단계(phase)를 보여준다.
