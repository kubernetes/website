---
title: 가비지(Garbage) 수집
id: garbage-collection
date: 2022-01-14
full_link: /ko/docs/concepts/architecture/garbage-collection/
short_description: >
  쿠버네티스가 클러스터 자원을 정리하기 위해 사용하는
  다양한 방법을 종합한 용어이다.

aka:
tags:
- fundamental
- operation
---

쿠버네티스가 클러스터 자원을 정리하기 위해 사용하는
다양한 방법을 종합한 용어이다.

<!--more-->

쿠버네티스는 가비지 수집을 이용하여
[사용되지 않는 컨테이너와 이미지](/ko/docs/concepts/architecture/garbage-collection/#containers-images),
[실패한 파드](/ko/docs/concepts/workloads/pods/pod-lifecycle/#pod-garbage-collection),
[타겟 리소스가 소유한 오브젝트](/docs/concepts/overview/working-with-objects/owners-dependents/),
[종료된 잡](/ko/docs/concepts/workloads/controllers/ttlafterfinished/), 그리고
만료되거나 실패한 리소스 같은 리소스를 정리한다.

