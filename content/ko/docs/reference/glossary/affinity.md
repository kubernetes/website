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

In Kubernetes, _affinity_ is a set of rules that give hints to the scheduler about where to place pods.
쿠버네티스에서 _affinity_ 는

<!--more-->

There are two kinds of affinity:

- [node affinity](/docs/concepts/scheduling-eviction/assign-pod-node/#node-affinity)
- [pod-to-pod affinity](/docs/concepts/scheduling-eviction/assign-pod-node/#inter-pod-affinity-and-anti-affinity)

The rules are defined using the Kubernetes {{< glossary_tooltip term_id="label" text="labels">}},
and {{< glossary_tooltip term_id="selector" text="selectors">}} specified in {{< glossary_tooltip term_id="pod" text="pods" >}},
and they can be either required or preferred, depending on how strictly you want the scheduler to enforce them.
