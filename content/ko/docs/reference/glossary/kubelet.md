---
title: Kubelet
id: kubelet
date: 2018-04-12
full_link: /docs/reference/generated/kubelet
short_description: >
  클러스터의 각 노드에서 실행되는 에이전트. 파드에서 컨테이너가 정상적으로 동작하도록 관리한다.

aka:
tags:
- fundamental
---
kubelet은 클러스터의 각 {{< glossary_tooltip text="노드" term_id="node" >}}에서 실행되는 에이전트이다.
kubelet은 {{< glossary_tooltip text="파드" term_id="pod" >}}에서 {{< glossary_tooltip text="컨테이너" term_id="container" >}}가 정상적으로 동작하도록 관리한다.

<!--more-->

kubelet은 다양한 메커니즘을 통해 제공된 파드 스펙(PodSpec)의 집합을 기반으로, 컨테이너가 해당 파드 스펙에 따라 건강하게 동작하도록 보장한다. 단, kubelet은 쿠버네티스를 통해 생성되지 않는 컨테이너는 관리하지 않는다.
