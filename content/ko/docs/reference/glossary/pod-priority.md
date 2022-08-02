---
title: 파드 프라이어리티(Pod Priority)
id: pod-priority
date: 2019-01-31
full_link: /ko/docs/concepts/scheduling-eviction/pod-priority-preemption/#파드-우선순위
short_description: >
  파드 프라이어리티는 다른 파드에 대한 상대적인 중요도를 나타낸다.

aka:
tags:
- operation
---
 파드 프라이어리티는 다른 {{< glossary_tooltip text="파드" term_id="pod" >}}에 대한 상대적인 중요도를 나타낸다.

<!--more-->

[파드 프라이어리티](/ko/docs/concepts/scheduling-eviction/pod-priority-preemption/#파드-우선순위)는 특정 파드에 다른 파드와 비교하여 높거나 낮은 스케줄링 우선 순위를 설정할 수 있도록 해 주며, 이는 프로덕션 클러스터 워크로드에 있어서 중요한 기능이다.
