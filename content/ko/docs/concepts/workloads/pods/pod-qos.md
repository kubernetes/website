---
title: 파드 서비스 품질(QoS) 클래스
content_type: concept
weight: 85
---

<!-- overview -->

이 페이지에서는 쿠버네티스의 _서비스 품질(QoS) 클래스_ 를 소개하고, 쿠버네티스가 
해당 파드의 컨테이너에 대해 지정한 리소스 제약의 결과로 각 파드에 QoS 클래스를 
할당하는 방법을 설명한다.
쿠버네티스는 노드에 사용 가능한 리소스가 충분하지 않을 때 어떤 파드를 축출시킬지 
결정하기 위해 이 분류에 의존한다.

<!-- body -->

## 서비스 품질 클래스

쿠버네티스는 실행하는 파드를 분류하고 각 파드를 특정
_서비스 품질(QoS) 클래스_에 할당한다. 쿠버네티스는 이 분류를 사용하여 서로 다른
파드가 처리되는 방식에 영향을 미친다. 쿠버네티스는 해당 파드에 있는
{{< glossary_tooltip text="컨테이너" term_id="container" >}}의 
[리소스 요청](/ko/docs/concepts/configuration/manage-resources-containers/)과
해당 요청이 리소스 한도(limit)와 어떻게 관련되는지에 따라 이 분류를 수행한다. 
이를 {{< glossary_tooltip text="서비스 품질" term_id="qos-class">}}(QoS)
클래스라고 한다. 쿠버네티스는 구성 요소인 컨테이너의 리소스 요청과
한도를 기반으로 모든 파드에 QoS 클래스를 할당한다. QoS 클래스는 쿠버네티스가
[노드 압박](/ko/docs/concepts/scheduling-eviction/node-pressure-eviction/)을
받는 노드에서 어떤 파드를 축출할지 결정하는 데 사용된다. 가능한
QoS 클래스는 `Guaranteed`, `Burstable`, 그리고 `BestEffort`이다. 
노드에 리소스가 부족하면 쿠버네티스는 먼저 해당 노드에서 실행 중인 `BestEffort`
파드를 축출하고, 그 다음에는 `Burstable`, 마지막으로 `Guaranteed` 파드를 축출한다. 
이러한 축출이 리소스 압박으로 인한 경우, 리소스 요청을 초과하는 파드만 축출 후보가 된다. 

### Guaranteed

`Guaranteed` 파드는 리소스 한도가 가장 엄격하여 축출될 가능성이
가장 낮다. 이들은 한도(limit)를 초과하거나
노드에서 선점할 수 있는 우선순위가 낮은 파드가 없을 때까지 죽지 않도록 보장된다.
이들은 지정된 한도를 초과하여 리소스를 획득할 수 없다. 
또한 이 파드는 [`스태틱(static)`](/docs/tasks/administer-cluster/cpu-management-policies/#static-policy) 
CPU 관리 정책을 사용하여 독점적인 CPU를 사용할 수 있다. 

#### 기준

파드에 QoS 클래스 `Guaranteed`가 주어지는 경우는 다음과 같다.

* 파드의 모든 컨테이너에는 메모리 한도와 메모리 요청이 있어야 한다.
* 파드의 모든 컨테이너에 대해 메모리 한도는 메모리 요청과 같아야 한다.
* 파드의 모든 컨테이너에는 CPU 한도와 CPU 요청이 있어야 한다.
* 파드의 모든 컨테이너에 대해, CPU 한도는 CPU 요청과 같아야 한다.

### Burstable

`Burstable` 파드는 요청에 따라 일부 하한 리소스가 보장되지만
특정 한도가 필요하지 않다. 한도를 지정하지 않으면 기본적으로
노드의 용량과 동일한 한도가 적용되므로, 리소스를 사용할 수 있는 경우
파드가 리소스를 유연하게 늘릴 수 있다. 노드 리소스 압박으로 인해 파드가
축출되는 경우, 이 파드는 모든 `BestEffort` 파드가 축출된 후에만 축출된다.
`Burstable` 파드는 리소스 한도나 요청이 없는 컨테이너를 포함할 수 있기 때문에,
`Burstable` 파드는 노드 리소스를 원하는 만큼 사용할 수 있다. 

#### 기준

다음과 같은 경우 파드에 QoS 클래스 `Burstable`이 주어진다.

* 파드가 QoS 클래스 `Guaranteed` 기준을 충족하지 않는다.
* 파드에 있는 하나 이상의 컨테이너에 메모리 또는 CPU 요청 또는 한도가 있다.

### BestEffort

`BestEffort` QoS 클래스의 파드는 다른 QoS 클래스의 파드에 특별히 할당되지 않은 노드 리소스를 
사용할 수 있다. 예를 들어, kubelet에 16개의 CPU 코어를 사용할 수 있는 노드가 있고 `Guaranteed` 
파드에 4개의 CPU 코어를 할당했다면, `BestEffort` QoS 클래스의 파드는 나머지 12개의 CPU 코어를 
얼마든지 사용할 수 있다. 

노드가 리소스 압박을 받는 경우, kubelet은 `BestEffort` 파드를 축출하는 것을 선호한다. 

#### 기준

`Guaranteed` 또는 `Burstable` 기준을 충족하지 않는 파드는 `BestEffort`의 
QoS 클래스를 갖는다. 즉, 파드는 파드 내 컨테이너 중 메모리 한도나 메모리 
요청이 없고 파드 내 컨테이너 중 CPU 한도나 CPU 요청이 없는 경우에만 
`BestEffort`이다.
파드의 컨테이너는 (CPU나 메모리가 아닌) 다른 리소스를 요청할 수 있지만
여전히 `BestEffort`로 분류될 수 있다. 

## cgroup v2를 이용한 메모리 QoS

{{< feature-state feature_gate_name="MemoryQoS" >}}

메모리 QoS는 쿠버네티스에서 메모리 리소스를 보장하기 위해 cgroup v2의 메모리 
컨트롤러를 사용한다. 파드 내 컨테이너의 메모리 요청과 한도는 메모리 컨트롤러가 
제공하는 특정 인터페이스인 `memory.min`과 `memory.high` 설정에 사용된다. `memory.min`이 메모리 요청으로
설정되면, 메모리 리소스가 예약되고 커널에 의해 회수되지 않는다. 이것이 메모리 QoS가 쿠버네티스 파드의
메모리 가용성을 보장하는 방식이다. 그리고 컨테이너에 메모리 한도가 설정되어 있는 경우, 이는 시스템이
컨테이너 메모리 사용을 제한해야 함을 의미한다. 메모리 QoS는 `memory.high`를 사용하여 메모리 
한도에 근접하는 워크로드를 쓰로틀(throttle)하여 시스템이 순간적인 메모리 할당으로 
인해 압도되지 않도록 한다. 

메모리 QoS는 QoS 클래스에 따라 적용할 설정을 결정한다. 
그러나 둘은 서비스 품질에 대한 제어를 제공하는 서로 다른 메커니즘이다.

## QoS 클래스와 독립적인 일부 동작 {#class-independent-behavior}

특정 동작은 쿠버네티스가 할당하는 QoS 클래스와 무관하다. 예를 들면 다음과 같다.

* 리소스 한도를 초과하는 모든 컨테이너는 해당 파드의 다른 컨테이너에 영향을 주지 않고 kubelet에 
  의해 종료되었다가 다시 시작된다.

* 컨테이너가 리소스 요청을 초과하고 컨테이너가 실행되는 노드가 리소스 압박에 직면하면, 
  컨테이너가 있는 파드는 [축출](/ko/docs/concepts/scheduling-eviction/node-pressure-eviction/) 후보가 된다. 
  만약 이런 상황이 발생하면, 파드의 모든 컨테이너가 종료된다. 쿠버네티스는 일반적으로 다른 노드에 대체 
  파드를 생성할 수 있다. 

* 파드의 리소스 요청은 그 구성 요소인 컨테이너의
  리소스 요청의 합과 같고, 파드의 리소스 한도는 그구성 요소인
  컨테이너의 리소스 한도의 합과 같다.

* kube-scheduler는 [선점](/ko/docs/concepts/scheduling-eviction/pod-priority-preemption/#preemption)
  할 파드를 선택할 때 QoS 클래스를 고려하지 않는다.
  클러스터에 정의한 모든 파드를 실행하기에 충분한 리소스가 없을 때
  선점이 발생할 수 있다. 

## {{% heading "whatsnext" %}}

* [파드 및 컨테이너 리소스 관리](/ko/docs/concepts/configuration/manage-resources-containers/)에 대해 알아보기
* [노드-압박 축출](/ko/docs/concepts/scheduling-eviction/node-pressure-eviction/)에 대해 알아보기
* [파드 우선순위와 선점](/ko/docs/concepts/scheduling-eviction/pod-priority-preemption/)에 대해 알아보기
* [파드 중단(disruption)](/ko/docs/concepts/workloads/pods/disruptions/)에 대해 알아보기
* [컨테이너 및 파드 메모리 리소스 할당](/ko/docs/tasks/configure-pod-container/assign-memory-resource/) 방법 배우기
* [컨테이너 및 파드 CPU 리소스 할당](/ko/docs/tasks/configure-pod-container/assign-cpu-resource/) 방법 배우기
* [파드에 대한 서비스 품질(QoS) 구성](/ko/docs/tasks/configure-pod-container/quality-service-pod/) 방법 배우기
