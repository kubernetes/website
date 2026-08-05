---
title: 어피니티 (Affinity)
id: affinity
date: 2019-01-11
full_link: /ko/docs/concepts/scheduling-eviction/assign-pod-node/#affinity-and-anti-affinity
short_description: >
  파드를 배치할 위치를 결정하기 위해 스케줄러에서 사용하는 규칙
aka:
tags:
  - fundamental
---

쿠버네티스에서 _어피니티_ 는 파드를 배치할 위치에 대한 힌트를 스케줄러에 제공하는 일련의 규칙이다.

<!--more-->

어피니티에는 다음의 두 가지 종류가 있다.

- [노드 어피니티](/ko/docs/concepts/scheduling-eviction/assign-pod-node/#node-affinity)
- [파드 간 어피니티](/ko/docs/concepts/scheduling-eviction/assign-pod-node/#inter-pod-affinity-and-anti-affinity)

어피니티 규칙은 쿠버네티스 {{< glossary_tooltip term_id="label" text="레이블">}} 및 {{< glossary_tooltip term_id="pod" text="파드" >}}에 명시된 {{< glossary_tooltip term_id="selector" text="셀렉터">}}를 이용하여 정의되며,
스케줄러에서 얼마나 엄격하게 적용할지에 따라 필수 또는 선호사항으로 지정할 수 있다.
