---
title: 레플리케이션 컨트롤러(Replication Controller)
id: replication-controller
date: 2018-04-12
full_link: 
short_description: >
  특정 수의 파드 인스턴스가 항상 동작하도록 보장하는 쿠버네티스 서비스.

aka: 
tags:
- workload
- core-object
---
 특정 수의 파드 인스턴스가 항상 동작하도록 보장하는 쿠버네티스 서비스.

<!--more--> 

레플리케이션 컨트롤러는 파드에 설정된 값에 따라서, 동작하는 파드의 인스턴스를 자동으로 추가하거나 제거할 것이다. 파드가 삭제되거나 실수로 너무 많은 수의 파드가 시작된 경우, 파드가 지정된 수의 인스턴스로 돌아갈 수 있게 허용한다. 

