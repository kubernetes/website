---
title: "워크로드"
weight: 50
description: >
  쿠버네티스에서 배포할 수 있는 가장 작은 컴퓨트 오브젝트인 파드와, 이를 실행하는 데 도움이 되는 하이-레벨(higher-level) 추상화
no_list: true
---

{{< glossary_definition term_id="workload" length="short" >}}
워크로드가 단일 컴포넌트이거나 함께 작동하는 여러 컴포넌트이든 관계없이, 쿠버네티스에서는 워크로드를 일련의
[파드](/ko/docs/concepts/workloads/pods) 집합 내에서 실행한다.
쿠버네티스에서 파드는 클러스터에서 실행 중인 {{< glossary_tooltip text="컨테이너" term_id="container" >}}
집합을 나타낸다.

파드에는 정의된 라이프사이클이 있다. 예를 들어, 일단 파드가 클러스터에서 실행되고
해당 파드가 실행 중인 {{< glossary_tooltip text="노드" term_id="node" >}}에서
심각한 오류가 발생하게 되면 해당 노드의 모든 파드가 실패한다. 쿠버네티스는 이 수준의 실패를
최종적으로 처리한다. 나중에 노드가 복구되더라도 새 파드를 만들어야 한다.

그러나, 작업이 훨씬 쉽도록, 각 파드를 직접 관리할 필요는 없도록 만들었다.
대신, 사용자를 대신하여 파드 집합을 관리하는 _워크로드 리소스_ 를 사용할 수 있다.
이러한 리소스는 지정한 상태와 일치하도록 올바른 수의 올바른 파드 유형이
실행되고 있는지 확인하는 {{< glossary_tooltip term_id="controller" text="컨트롤러" >}}를
구성한다.

이러한 워크로드 리소스에는 다음이 포함된다.

* [디플로이먼트(Deployment)](/ko/docs/concepts/workloads/controllers/deployment/) 및 [레플리카셋(ReplicaSet)](/ko/docs/concepts/workloads/controllers/replicaset/)
  (레거시 리소스 {{< glossary_tooltip text="레플리케이션컨트롤러(ReplicationController)" term_id="replication-controller" >}}를 대체);
* [스테이트풀셋(StatefulSet)](/ko/docs/concepts/workloads/controllers/statefulset/);
* 스토리지 드라이버 또는 네트워크 플러그인과 같은 노드-로컬 기능을 제공하는
  파드를 실행하기 위한 [데몬셋(DaemonSet)](/ko/docs/concepts/workloads/controllers/daemonset/)
* 완료될 때까지 실행되는 작업에 대한
  [잡(Job)](/ko/docs/concepts/workloads/controllers/job/) 및
  [크론잡(CronJob)](/ko/docs/concepts/workloads/controllers/cronjob/)

관련성을 찾을 수 있는 두 가지 지원 개념도 있다.
* [가비지(Garbage) 수집](/ko/docs/concepts/workloads/controllers/garbage-collection/)은 _소유하는 리소스_ 가
  제거된 후 클러스터에서 오브젝트를 정리한다.
* [_time-to-live after finished_ 컨트롤러](/ko/docs/concepts/workloads/controllers/ttlafterfinished/)가
  완료된 이후 정의된 시간이 경과되면 잡을 제거한다.

## {{% heading "whatsnext" %}}

각 리소스에 대해 읽을 수 있을 뿐만 아니라, 리소스와 관련된 특정 작업에 대해서도 알아볼 수 있다.

* [디플로이먼트를 사용하여 스테이트리스(stateless) 애플리케이션 실행](/docs/tasks/run-application/run-stateless-application-deployment/)
* 스테이트풀(stateful) 애플리케이션을 [단일 인스턴스](/ko/docs/tasks/run-application/run-single-instance-stateful-application/)
  또는 [복제된 세트](/docs/tasks/run-application/run-replicated-stateful-application/)로 실행
* [크론잡을 사용하여 자동화된 작업 실행](/ko/docs/tasks/job/automated-tasks-with-cron-jobs/)

일단 애플리케이션이 실행되면, 인터넷에서 [서비스](/ko/docs/concepts/services-networking/service/)로
사용하거나, 웹 애플리케이션의 경우에만
[인그레스(Ingress)](/ko/docs/concepts/services-networking/ingress)를 이용하여 사용할 수 있다.

[구성](/ko/docs/concepts/configuration/) 페이지를 방문하여 구성에서 코드를 분리하는 쿠버네티스의
메커니즘에 대해 알아볼 수도 있다.
