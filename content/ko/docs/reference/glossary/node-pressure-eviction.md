---
title: 노드-압박 축출
id: node-pressure-eviction
date: 2021-05-13
full_link: /ko/docs/concepts/scheduling-eviction/node-pressure-eviction/
short_description: >
  노드-압박 축출은 kubelet이 노드의 자원을 회수하기 위해 
  파드를 능동적으로 중단시키는 절차이다.
aka:
- kubelet eviction
tags:
- operation
---
노드-압박 축출은 {{<glossary_tooltip term_id="kubelet" text="kubelet">}}이 노드의 자원을 회수하기 위해 
파드를 능동적으로 중단시키는 절차이다.

<!--more-->

kubelet은 클러스터 노드의 CPU, 메모리, 디스크 공간, 파일시스템 
inode와 같은 자원을 모니터링한다. 이러한 자원 중 하나 이상이 
특정 소모 수준에 도달하면, kubelet은 하나 이상의 파드를 능동적으로 중단시켜 
자원을 회수하고 고갈 상황을 방지할 수 있다.

노드-압박 축출은 [API를 이용한 축출](/ko/docs/concepts/scheduling-eviction/api-eviction/)과는 차이가 있다.
