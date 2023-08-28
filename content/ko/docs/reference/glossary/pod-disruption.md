---
id: pod-disruption
title: 파드 중단(Disruption)
full_link: /ko/docs/concepts/workloads/pods/disruptions/
date: 2021-05-12
short_description: >
  노드에 있는 파드가 자발적 또는 비자발적으로 종료되는 절차

aka:
related:
 - pod
 - container
tags:
 - operation
---

[파드 중단](/ko/docs/concepts/workloads/pods/disruptions/)은 
노드에 있는 파드가 자발적 또는 비자발적으로 종료되는 절차이다.

<!--more--> 

자발적 중단은 애플리케이션 소유자 또는 클러스터 관리자가 의도적으로 시작한다. 
비자발적 중단은 의도하지 않은 것이며, 
노드의 리소스 부족과 같은 피할 수 없는 문제 또는 우발적인 삭제로 인해 트리거가 될 수 있다.
