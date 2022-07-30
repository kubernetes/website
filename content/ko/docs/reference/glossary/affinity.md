---
title: 유연 (Affinity)
id: affinity
date: 2019-01-11
full_link: /docs/ko/concepts/scheduling-eviction/assign-pod-node/#affinity-and-anti-affinity
short_description: >
  포드를 배치할 위치를 결정하기 위해 스케줄러에서 사용하는 규칙
aka:
tags:
  - fundamental
---

쿠버네티스에서 _affinity_ 는 포드를 배치할 위치에 대한 힌트를 스케줄러에 제공하는 일련의 규칙이다.

<!--more-->

유연(affinity)에는 두 가지 종류가 있다.

- [node affinity](/ko/docs/concepts/scheduling-eviction/assign-pod-node/#node-affinity)
- [pod-to-pod affinity](/ko/docs/concepts/scheduling-eviction/assign-pod-node/#inter-pod-affinity-and-anti-affinity)

규칙은 쿠버네티스 {{< glossary_tooltip term_id="label" text="레이블">}}과, {{< glossary_tooltip term_id="pod" text="파드" >}}에 정의된 {{< glossary_tooltip term_id="selector" text="셀렉터">}}에서 정의되며,
스케쥴러에서 얼마나 엄격하게 적용할지에 따라 필수 또는 선호사항으로 지정할 수 있다.
