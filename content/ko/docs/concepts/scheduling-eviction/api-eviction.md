---
title: API를 이용한 축출(Eviction)
content_type: concept
weight: 70
---

{{< glossary_definition term_id="api-eviction" length="short" >}} </br>

`kubectl drain` 명령과 같은 kube-api 서버의 클라이언트를 사용하여, 
축출 API 를 직접 호출하여 제거요청을 할 수 있습니다.
그러면 API 서버가 파드를 종료하는 `Eviction` 객체가 생성됩니다.

API를 이용한 축출들은 구성된 [`PodDisruptionBudgets`](/docs/tasks/run-application/configure-pdb/)
및 [`terminationGracePeriodSeconds`](/docs/concepts/workloads/pods/pod-lifecycle#pod-termination) 를 준수합니다.

## {{% heading "whatsnext" %}}

* [노드-압박 축출](/docs/concepts/scheduling-eviction/node-pressure-eviction/) 에 대해 더 배우기
* [파드 우선순위와 선점](/docs/concepts/scheduling-eviction/pod-priority-preemption/) 에 대해 더 배우기
