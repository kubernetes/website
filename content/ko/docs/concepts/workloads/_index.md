---
title: "워크로드"
weight: 55
description: >
  쿠버네티스에서 배포할 수 있는 가장 작은 컴퓨팅 오브젝트인 파드와, 파드를 실행하는 데 도움이 되는 상위 수준의 추상화를 이해한다.
no_list: true
card:
  title: 워크로드와 파드
  name: concepts
  weight: 60
---

{{< glossary_definition term_id="workload" length="short" >}}
워크로드가 단일 컴포넌트이거나 함께 작동하는 여러 컴포넌트이든 관계없이, 쿠버네티스에서는 워크로드를
[_파드_](/docs/concepts/workloads/pods) 집합에서 실행한다.
쿠버네티스에서 파드는 클러스터에서 실행되는 하나 이상의
{{< glossary_tooltip text="컨테이너" term_id="container" >}}로 구성된 집합을 나타낸다.

쿠버네티스 파드에는 [정의된 라이프사이클](/docs/concepts/workloads/pods/pod-lifecycle/)이 있다.
예를 들어, 클러스터에서 실행 중인 파드가 있는
{{< glossary_tooltip text="노드" term_id="node" >}}에 심각한 장애가 발생하면,
해당 노드의 모든 파드가 실패한다. 쿠버네티스는 이러한 수준의 실패를 최종적인 것으로 간주하므로,
노드가 나중에 정상 상태로 복구되더라도 새 파드를 생성해야 한다.

하지만 관리를 훨씬 쉽게 하기 위해 각 파드를 직접 관리할 필요는 없다.
대신 파드 집합을 관리해 주는 _워크로드 리소스_를 사용할 수 있다.
이러한 리소스는 사용자가 지정한 상태에 맞게 적절한 수와 유형의 파드가
실행되도록 보장하는 {{< glossary_tooltip term_id="controller" text="컨트롤러" >}}를
구성한다.

쿠버네티스는 여러 내장 워크로드 리소스를 제공한다.

* [디플로이먼트(Deployment)](/docs/concepts/workloads/controllers/deployment/)와 [레플리카셋(ReplicaSet)](/docs/concepts/workloads/controllers/replicaset/)은
  레거시 리소스인
  {{< glossary_tooltip text="레플리케이션컨트롤러(ReplicationController)" term_id="replication-controller" >}}를 대체한다.
  디플로이먼트는 클러스터의 스테이트리스 애플리케이션 워크로드를 관리하는 데 적합하며,
  디플로이먼트의 모든 파드는 서로 바꾸어 쓸 수 있고 필요하면 교체할 수 있다.
* [스테이트풀셋(StatefulSet)](/docs/concepts/workloads/controllers/statefulset/)은
  상태를 추적하는 서로 관련된 파드를 하나 이상 실행할 수 있게 한다. 예를 들어 워크로드가
  데이터를 영구적으로 기록한다면, 각 파드에
  [퍼시스턴트볼륨(PersistentVolume)](/docs/concepts/storage/persistent-volumes/)을 연결하는 스테이트풀셋을 실행할 수 있다.
  해당 스테이트풀셋의 파드에서 실행되는 코드는 같은 스테이트풀셋의 다른 파드로 데이터를 복제하여
  전반적인 복원력을 높일 수 있다.
* [데몬셋(DaemonSet)](/docs/concepts/workloads/controllers/daemonset/)은 노드 로컬
  기능을 제공하는 파드를 정의한다.
  데몬셋의 명세에 맞는 노드를 클러스터에 추가할 때마다,
  컨트롤 플레인은 해당 신규 노드에 데몬셋을 위한 파드를 스케줄링한다.
  데몬셋의 각 파드는 전통적인 Unix / POSIX 서버의 시스템 데몬과 유사한 작업을
  수행한다. 데몬셋은 [클러스터 네트워킹(cluster networking)](/docs/concepts/cluster-administration/networking/#쿠버네티스-네트워크-모델의-구현-방법)을 실행하는
  플러그인처럼 클러스터 운영에 필수적일 수도 있고,
  노드 관리를 도울 수도 있으며,
  실행 중인 컨테이너 플랫폼을 개선하는 선택적 기능을 제공할 수도 있다.
* [잡(Job)](/docs/concepts/workloads/controllers/job/)과
  [크론잡(CronJob)](/docs/concepts/workloads/controllers/cron-jobs/)은
  실행 완료 후 종료되는 태스크를 정의하는 서로 다른 방법을 제공한다.
  [잡](/docs/concepts/workloads/controllers/job/)을 사용해
  단 한 번 실행되어 완료되는 태스크를 정의할 수 있다.
  [크론잡](/docs/concepts/workloads/controllers/cron-jobs/)을
  사용하면 동일한 잡을 일정에 따라 여러 번 실행할 수 있다.

더 넓은 쿠버네티스 에코시스템에서는 추가 동작을 제공하는 써드파티 워크로드 리소스를
찾을 수 있다.
[커스텀리소스데피니션(CustomResourceDefinition)](/docs/concepts/extend-kubernetes/api-extension/custom-resources/)을 사용하면,
쿠버네티스 핵심 기능에 포함되지 않은 특정 동작이 필요한 경우 써드파티 워크로드 리소스를
추가할 수 있다. 예를 들어 애플리케이션을 위한 파드 그룹을 실행하되
_모든_ 파드를 사용할 수 있어야만 작업을 수행하도록 하려는 경우(예: 처리량이 높은 분산 태스크),
해당 기능을 제공하는 익스텐션(extension)을 구현하거나 설치할 수 있다.

## 워크로드 배치

{{< feature-state feature_gate_name="GenericWorkload" >}}

디플로이먼트나 잡과 같은 표준 워크로드 리소스가 파드의 라이프사이클을 관리하지만,
파드 그룹을 하나의 단위로 취급해야 하는 복잡한 스케줄링 요구사항이 있을 수 있다.

[워크로드 API](/docs/concepts/workloads/workload-api/)를 사용하면 파드를 그룹으로 묶는 `PodGroupTemplates`를 정의하고,
[갱 스케줄링(gang scheduling)](/docs/concepts/scheduling-eviction/gang-scheduling/)과 같은 고급 스케줄링 정책을 적용할 수 있다.
컨트롤러는 런타임에 이러한 템플릿으로 [파드그룹(PodGroup)](/docs/concepts/workloads/podgroup-api/) 오브젝트를 생성하고,
`Pods`는 해당 `PodGroup`을
`spec.schedulingGroup` 필드를 통해 참조한다. 이는 "전부 아니면 전무(all-or-nothing)" 배치가 필요한 배치 처리 및 머신러닝 워크로드에
특히 유용하다.

## {{% heading "whatsnext" %}}

워크로드 관리에 사용하는 각 API 종류(kind)에 관한 설명뿐 아니라,
특정 작업을 수행하는 방법도 확인할 수 있다.

* [디플로이먼트로 스테이트리스 애플리케이션 실행](/docs/tasks/run-application/run-stateless-application-deployment/)
* 스테이트풀(stateful) 애플리케이션을 [단일 인스턴스](/docs/tasks/run-application/run-single-instance-stateful-application/)
  또는 [복제된 세트](/docs/tasks/run-application/run-replicated-stateful-application/)로 실행
* [크론잡을 사용하여 자동화된 작업 실행](/docs/tasks/job/automated-tasks-with-cron-jobs/)

쿠버네티스에서 코드와 구성을 분리하는 메커니즘을 알아보려면,
[구성](/docs/concepts/configuration/)을 참고한다.

쿠버네티스가 애플리케이션 파드를 관리하는 방식을 이해하는 데 도움이 되는
개념은 다음 두 가지다.
* [가비지(Garbage) 수집](/docs/concepts/architecture/garbage-collection/)은 오브젝트를 _소유하는 리소스_가
  삭제된 후 클러스터에서 해당 오브젝트를 정리한다.
* [_완료-이후-TTL(TTL-after-finished)_ 컨트롤러](/docs/concepts/workloads/controllers/ttlafterfinished/)는
  잡이 완료된 뒤 지정된 시간이 지나면 잡을 삭제한다.

애플리케이션이 실행되면 [서비스](/docs/concepts/services-networking/service/)를 통해 인터넷에 공개하거나,
웹 애플리케이션에 한해
[인그레스(Ingress)](/docs/concepts/services-networking/ingress)를 사용하여 공개할 수 있다.

