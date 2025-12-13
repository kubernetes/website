---
title: "워크로드 관리"
weight: 20
simple_list: true
---

쿠버네티스는
{{< glossary_tooltip text="workloads" term_id="workload" >}}
및 해당 워크로드의 구성 요소를 선언적으로 관리하기 위한 여러 내장 API를 제공한다.

궁극적으로 애플리케이션은
{{< glossary_tooltip term_id="Pod" text="파드" >}} 내부의 컨테이너로 실행된다. 하지만, 개별
파드를 관리하는 것은 상당한 노력이 필요하다. 예를 들어, 파드에 장애가 발생하면
새 파드를 실행하여 대체해야 할 것이다. 쿠버네티스가 이를 대신해 줄 수 있다.

쿠버네티스 API를 사용하여 파드보다 더 높은 추상화 수준을 나타내는
{{< glossary_tooltip text="오브젝트" term_id="object" >}} 워크로드를 생성하면
쿠버네티스
{{< glossary_tooltip text="컨트롤플레인" term_id="control-plane" >}}이 사용자가 정의한 워크로드 오브젝트 사양에 따라 자동으로
파드 오브젝트를 관리한다.

워크로드 관리를 위한 기본 제공 API는 다음과 같다.

[디플로이먼트(Deployment)](/docs/concepts/workloads/controllers/deployment/) (및 간접적으로 [레플리카셋(ReplicaSet)](/docs/concepts/workloads/controllers/replicaset/))는 
클러스터에서 애플리케이션을 실행하는 가장 일반적인 방법이다.
디플로이먼트는 클러스터에서 상태 비저장 애플리케이션 워크로드를 관리하는 데 적합하며,
디플로이먼트의 모든 파드는 상호 교환 가능하며 필요한 경우 교체할 수 있다.
(디플로이먼트는 기존
{{< glossary_tooltip text="레플리케이션컨트롤러(ReplicationController)" term_id="replication-controller" >}} API를 대체한다.)

[스테이풀셋(StatefulSet)](/docs/concepts/workloads/controllers/statefulset/)을 사용하면
동일한 애플리케이션 코드를 실행하는 하나 이상의 파드를 관리할 수 있으며, 
각 파드는 고유한 ID를 가져야 한다. 파드는 상호 교환 가능해야 하는 
디플로이먼트와는 다르다.
스테이풀셋의 가장 일반적인 용도는 파드와 
영구 저장소를 연결하는 것이다. 예를 들어, 각 파드를 
[퍼시스턴트볼륨(PersistentVolume)](/docs/concepts/storage/persistent-volumes/)과 연결하는 스테이풀셋을 실행할 수 있다. 스테이풀셋에 있는 파드 중 하나에 
장애가 발생하면, 쿠버네티스는 동일한 퍼시스턴트볼륨에 연결된 
대체 파드를 만든다.

[데몬셋(DaemonSet)](/docs/concepts/workloads/controllers/daemonset/)은 특정 {{< glossary_tooltip text="노드" term_id="node" >}}에 
로컬인 기능을 제공하는 파드를 정의한다.
예를 들어, 해당 노드의 컨테이너가 저장소 시스템에 액세스할 수 있도록 하는 드라이버가 있다. 데몬셋은 
드라이버 또는 기타 노드 수준 서비스가 필요한 노드에서 실행되어야 할 때 사용한다.
데몬셋의 각 파드는 기존 Unix/POSIX 서버의 시스템 데몬과 유사한 역할을 수행한다.

데몬셋은 클러스터 운영에 필수적인 요소일 수 있다.
예를 들어, 해당 노드가 클러스터 네트워킹에 액세스할 수 있도록 하는 플러그인과 같은 역할을 할 수 있다.
[클러스터 네트워킹](/docs/concepts/cluster-administration/networking/#how-to-implement-the-kubernetes-network-model)
노드 관리에 도움이 될 수도 있고,
실행 중인 컨테이너 플랫폼을 향상시키는 덜 필수적인 기능을 제공할 수도 있다.
데몬셋 (및 해당 파드)은 클러스터의 모든 노드에서 실행하거나, 일부 노드에서만 실행할 수 있다 (예를 들어,
GPU가 설치된 노드에만 GPU 가속기 드라이버를 설치).

[잡(Job)](/docs/concepts/workloads/controllers/job/) 및/또는
[크론잡(CronJob)](/docs/concepts/workloads/controllers/cron-jobs/)을 사용하여
완료될 때까지 실행되었다가 중지되는 작업을 정의할 수 있다. 잡은 일회성 작업을 나타내는 반면, 
각 크론잡은 일정에 따라 반복된다.

이 섹션의 다른 주제:
<!-- 머리말의 simple_list: true에 의존 -->