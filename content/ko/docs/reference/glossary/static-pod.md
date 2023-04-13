---
title: 스태틱 파드(Static Pod)
id: static-pod
date: 2019-02-12
full_link: /ko/docs/tasks/configure-pod-container/static-pod/
short_description: >
  특정 노드의 Kubelet 데몬이 직접 관리하는 파드

aka: 
tags:
- fundamental
---

특정 노드의 Kubelet 데몬이
 직접 관리하는 {{< glossary_tooltip text="파드" term_id="pod" >}}로,
 <!--more-->
 
API 서버가 관찰하지 않는다.

스태틱 파드는 {{< glossary_tooltip text="임시 컨테이너" term_id="ephemeral-container" >}}를 지원하지 않는다.