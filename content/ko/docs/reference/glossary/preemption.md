---
title: 선점(Preemption)
id: preemption
date: 2019-01-31
full_link: /ko/docs/concepts/scheduling-eviction/pod-priority-preemption/#선점
short_description: >
  쿠버네티스에서 선점(preemption)은 노드에서 낮은 우선 순위를 가지는 파드를 축출함으로써 보류 중인 파드가 적절한 노드를 찾을 수 있도록 한다.

aka:
tags:
- operation
---
 쿠버네티스에서 선점(preemption)은 노드에서 낮은 우선 순위를 가지는 {{< glossary_tooltip term_id="pod" >}}를 축출함으로써 보류 중인 파드가 적절한 {{< glossary_tooltip term_id="node" >}}를 찾을 수 있도록 한다.
 
<!--more-->

파드를 스케줄링 할 수 없는 경우, 스케줄러는 우선 순위가 낮은 파드를 [선점](/ko/docs/concepts/scheduling-eviction/pod-priority-preemption/#선점)하여 보류 중인 파드를 스케줄링할 수 있게 한다.
