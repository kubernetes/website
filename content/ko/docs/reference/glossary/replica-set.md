---
title: 레플리카 셋(ReplicaSet)
id: replica-set
date: 2018-04-12
full_link: /docs/concepts/workloads/controllers/replicaset/
short_description: >
  레플리카 셋은 차세대 레플리케이션 컨트롤러이다.

aka: 
tags:
- fundamental
- core-object
- workload
---
 레플리카 셋은 차세대 레플리케이션 컨트롤러이다.

<!--more--> 

레플리케이션 컨트롤러와 같은 레플리카 셋은, 지정된 수의 파드 레플리카가 동시에 동작하게 관리한다. 레플리카 셋은 레이블 사용자 가이드에 기술된 대로 셋(set) 기반의 셀렉터 요구 사항을 지원한다. 반면, 레플리케이션 컨트롤러는 동일성 기반의 셀렉터 요구 사항만 제공한다.

