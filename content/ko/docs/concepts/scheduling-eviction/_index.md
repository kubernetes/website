---
title: "스케줄링, 선점(Preemption), 축출(Eviction)"
weight: 95
content_type: concept
no_list: true
---

쿠버네티스에서, 스케줄링은 {{<glossary_tooltip text="kubelet" term_id="kubelet">}}이 파드를 실행할 수 있도록 
{{<glossary_tooltip text="파드" term_id="pod">}}를 
{{<glossary_tooltip text="노드" term_id="node">}}에 할당하는 것을 말한다.
선점은 {{<glossary_tooltip text="우선순위" term_id="pod-priority">}}가 높은 파드가 노드에 스케줄될 수 있도록 
우선순위가 낮은 파드를 종료시키는 과정을 말한다. 축출은 
노드에서 하나 이상의 파드를 종료시키는 프로세스이다.

## 스케줄링

* [쿠버네티스 스케줄러](/docs/concepts/scheduling-eviction/kube-scheduler/)
* [노드에 파드 할당하기](/docs/concepts/scheduling-eviction/assign-pod-node/)
* [파드 오버헤드](/docs/concepts/scheduling-eviction/pod-overhead/)
* [파드 토폴로지 분배 제약 조건](/docs/concepts/scheduling-eviction/topology-spread-constraints/)
* [테인트(Taints)와 톨러레이션(Tolerations)](/docs/concepts/scheduling-eviction/taint-and-toleration/)
* [스케줄링 프레임워크](/docs/concepts/scheduling-eviction/scheduling-framework/)
* [동적 리소스 할당](/docs/concepts/scheduling-eviction/dynamic-resource-allocation)
* [스케줄러 성능 튜닝](/docs/concepts/scheduling-eviction/scheduler-perf-tuning/)
* [확장된 리소스를 위한 리소스 빈 패킹(bin packing)](/docs/concepts/scheduling-eviction/resource-bin-packing/)
* [파드 스케줄링 준비성(readiness)](/docs/concepts/scheduling-eviction/pod-scheduling-readiness/)
* [파드그룹(PodGroup) 스케줄링](/docs/concepts/scheduling-eviction/podgroup-scheduling/)
* [Gang 스케줄링](/docs/concepts/scheduling-eviction/gang-scheduling/)
* [토폴로지 인식 스케줄링](/docs/concepts/scheduling-eviction/topology-aware-scheduling/)
* [워크로드 인식 선점](/docs/concepts/scheduling-eviction/workload-aware-preemption/)
* [디스케줄러](https://github.com/kubernetes-sigs/descheduler#descheduler-for-kubernetes)
* [노드 선언형 기능](/docs/concepts/scheduling-eviction/node-declared-features/)

## 파드 중단(disruption)

{{<glossary_definition term_id="pod-disruption" length="all">}}

* [파드 우선순위(priority)와 선점(preemption)](/docs/concepts/scheduling-eviction/pod-priority-preemption/)
* [노드-압박 축출](/docs/concepts/scheduling-eviction/node-pressure-eviction/)
* [API를 이용한 축출](/docs/concepts/scheduling-eviction/api-eviction/)
