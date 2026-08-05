---
title: "워크로드"
weight: 55
description: >
  쿠버네티스에서 배포할 수 있는 가장 작은 컴퓨트 오브젝트인 파드와, 이를 실행하는 데 도움이 되는 하이-레벨(higher-level) 추상화
no_list: true
card:
  title: 워크로드와 파드
  name: concepts
  weight: 60
---

{{< glossary_definition term_id="workload" length="short" >}}
워크로드가 단일 컴포넌트이거나 함께 작동하는 여러 컴포넌트이든 관계없이, 쿠버네티스에서는 워크로드를 일련의
[_파드_](/ko/docs/concepts/workloads/pods) 집합 내에서 실행한다.
쿠버네티스에서 파드는 클러스터에서 실행 중인 {{< glossary_tooltip text="컨테이너" term_id="container" >}}
집합을 나타낸다.

쿠버네티스 파드에는 [정의된 라이프사이클](/ko/docs/concepts/workloads/pods/pod-lifecycle/)이 있다.
예를 들어, 일단 파드가 클러스터에서 실행되고 나서
해당 파드가 동작 중인 {{< glossary_tooltip text="노드" term_id="node" >}}에
심각한 오류가 발생하면 해당 노드의 모든 파드가 실패한다. 쿠버네티스는 이 수준의 실패를
최종(final)으로 취급한다. 사용자는 향후 노드가 복구되는 것과 상관 없이 파드를 새로 생성해야 한다.

그러나, 작업이 훨씬 쉽도록, 각 파드를 직접 관리할 필요는 없도록 만들었다.
대신, 사용자를 대신하여 파드 집합을 관리하는 _워크로드 리소스_ 를 사용할 수 있다.
이러한 리소스는 지정한 상태와 일치하도록 올바른 수의 올바른 파드 유형이
실행되고 있는지 확인하는 {{< glossary_tooltip term_id="controller" text="컨트롤러" >}}를
구성한다.

쿠버네티스는 다음과 같이 여러 가지 빌트인(built-in) 워크로드 리소스를 제공한다.

* [디플로이먼트(Deployment)](/ko/docs/concepts/workloads/controllers/deployment/) 및 [레플리카셋(ReplicaSet)](/ko/docs/concepts/workloads/controllers/replicaset/)
  (레거시 리소스
  {{< glossary_tooltip text="레플리케이션컨트롤러(ReplicationController)" term_id="replication-controller" >}}를 대체).
  디플로이먼트는 디플로이먼트의 모든 파드가 필요 시 교체 또는 상호 교체 가능한 경우,
  클러스터의 스테이트리스 애플리케이션 워크로드를 관리하기에 적합하다.
* [스테이트풀셋(StatefulSet)](/ko/docs/concepts/workloads/controllers/statefulset/)은
  어떻게든 스테이트(state)를 추적하는 하나 이상의 파드를 동작하게 해준다. 예를 들면, 워크로드가
  데이터를 지속적으로 기록하는 경우, 사용자는 파드와
  [퍼시스턴트 볼륨(PersistentVolume)](/ko/docs/concepts/storage/persistent-volumes/)을 연계하는 스테이트풀셋을 실행할 수 있다.
  전체적인 회복력 향상을 위해서, 스테이트풀셋의 파드에서 동작 중인 코드는 동일한 스테이트풀셋의
  다른 파드로 데이터를 복제할 수 있다.
* [데몬셋(DaemonSet)](/ko/docs/concepts/workloads/controllers/daemonset/)은 노드에 국한된 
  기능을 제공하는 파드를 정의한다.
  데몬셋의 명세에 맞는 노드를 클러스터에 추가할 때마다,
  컨트롤 플레인은 해당 신규 노드에 데몬셋을 위한 파드를 스케줄링한다.
  데몬셋의 각 파드는 기존 Unix / POSIX 서버의 시스템 데몬과 유사한 작업을 
  수행한다. 데몬셋은 클러스터 운영에 필수적인 구성 요소일 수도 있고(예: 
  [클러스터 네트워킹(cluster networking)](/ko/docs/concepts/cluster-administration/networking/#how-to-implement-the-kubernetes-network-model)을 실행하는 플러그인), 
  노드 관리를 도와줄 수도 있으며, 
  실행 중인 컨테이너 플랫폼을 향상시키는 선택적 동작을 제공할 수도 있다.
* [잡(Job)](/ko/docs/concepts/workloads/controllers/job/) 및 
  [크론잡(CronJob)](/ko/docs/concepts/workloads/controllers/cron-jobs/)은
  실행 완료 후 종료되는 태스크를 정의하는 서로 다른 방법을 제공한다. 
  [잡](/ko/docs/concepts/workloads/controllers/job/)을 사용해 
  단 한 번 실행되어 완료되는 태스크를 정의할 수 있다. 
  [크론잡](/ko/docs/concepts/workloads/controllers/cron-jobs/)을 
  사용하면 동일한 잡을 일정에 따라 여러 번 실행할 수 있다.

더 넓은 쿠버네티스 에코시스템 내에서는 추가적인 동작을 제공하는 제 3자의 워크로드
리소스도 찾을 수 있다.
[커스텀 리소스 데피니션](/ko/docs/concepts/extend-kubernetes/api-extension/custom-resources/)을 사용하면,
쿠버네티스 코어에서 제공하지 않는 특별한 동작을 원하는 경우 제 3자의 워크로드 리소스를
추가할 수 있다. 예를 들어, 사용자 애플리케이션을 위한 파드의 그룹을 실행하되
_모든_ 파드가 가용한 경우가 아닌 경우 멈추고 싶다면(아마도 높은 처리량의 분산 처리를 하는 상황 같은),
사용자는 해당 기능을 제공하는 확장을 구현하거나 설치할 수 있다.

## {{% heading "whatsnext" %}}

워크로드 관리를 위한 각 API 종류(kind)에 대해 읽을 수 있을 뿐만 아니라, 특정 
작업을 수행하는 방법도 확인할 수 있다.

* [디플로이먼트로 스테이트리스 애플리케이션 실행](/ko/docs/tasks/run-application/run-stateless-application-deployment/)
* 스테이트풀(stateful) 애플리케이션을 [단일 인스턴스](/ko/docs/tasks/run-application/run-single-instance-stateful-application/)
  또는 [복제된 세트](/ko/docs/tasks/run-application/run-replicated-stateful-application/)로 실행
* [크론잡을 사용하여 자동화된 작업 실행](/ko/docs/tasks/job/automated-tasks-with-cron-jobs/)

코드를 구성(configuration)에서 분리하는 쿠버네티스의 메커니즘을 배우기 위해서는,
[구성](/ko/docs/concepts/configuration/)을 참고하길 바란다.

다음은 쿠버네티스가 애플리케이션의 파드를 어떻게 관리하는지를 알 수 있게 해주는
두 가지 개념이다.
* [가비지(Garbage) 수집](/ko/docs/concepts/architecture/garbage-collection/)은 _소유하는 리소스_ 가
  제거된 후 클러스터에서 오브젝트를 정리한다.
* [_time-to-live after finished_ 컨트롤러](/ko/docs/concepts/workloads/controllers/ttlafterfinished/)는
  잡이 완료된 이후에 정의된 시간이 경과되면 잡을 제거한다.

일단 애플리케이션이 실행되면, 인터넷에서 [서비스](/ko/docs/concepts/services-networking/service/)로
사용하거나, 웹 애플리케이션의 경우에만
[인그레스(Ingress)](/ko/docs/concepts/services-networking/ingress)를 이용하여 사용할 수 있다.
