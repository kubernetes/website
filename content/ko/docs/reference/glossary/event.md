---
title: 이벤트(Event)
id: event
date: 2022-01-16
full_link: /docs/reference/kubernetes-api/cluster-resources/event-v1/
short_description: >
   클러스터 어딘가에서 발생한 이벤트에 대한 보고서이다. 일반적으로 시스템의 상태 변화를 나타낸다.
aka: 
tags:
- core-object
- fundamental
---
각 이벤트는 {{< glossary_tooltip text="클러스터" term_id="cluster" >}} 어딘가에서 발생한 이벤트에 대한 보고서이다. 
일반적으로 시스템의 상태 변화를 나타낸다.  

<!--more--> 
이벤트의 보존(retention) 시간은 제한되어 있으며, 트리거(trigger)와 메시지(message)는 시간에 따라 변화할 수 있다. 
이벤트 소비자는 일관성 있는 기본 트리거를 반영한다거나 이벤트가 지속적으로 존재한다는 
특정 이유로 이벤트의 타이밍에 의존해서는 안 된다. 


이벤트는 유익(imformative)해야 하고, 최선을 다한(best-effort), 보완적(supplemental) 데이터로 취급되어야 한다.

쿠버네티스에서, [감사(auditing)](/ko/docs/tasks/debug/debug-cluster/audit/)는 다른 종류의 이벤트 레코드를 생성한다. (API 그룹 `audit.k8s.io`).
