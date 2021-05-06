---
title: 스케줄링 정책
content_type: concept
weight: 10
---

<!-- overview -->

스케줄링 정책을 사용하여 {{< glossary_tooltip text="kube-scheduler" term_id="kube-scheduler" >}}가 각각 노드를 필터링하고 스코어링(scoring)하기 위해 실행하는 *단정(predicates)* 및 *우선순위(priorities)* 를 지정할 수 있다.

`kube-scheduler --policy-config-file <filename>` 또는 `kube-scheduler --policy-configmap <ConfigMap>`을 실행하고 [정책 유형](/docs/reference/config-api/kube-scheduler-policy-config.v1/)을 사용하여 스케줄링 정책을 설정할 수 있다.

<!-- body -->

## 단정 {#predicates}

다음의 *단정* 은 필터링을 구현한다.

- `PodFitsHostPorts`: 파드가 요청하는 파드의 포트에 대해 노드에 사용할 수 있는
  포트(네트워크 프로토콜 종류)가 있는지 확인한다.

- `PodFitsHost`: 파드가 호스트 이름으로 특정 노드를 지정하는지 확인한다.

- `PodFitsResources`: 파드의 요구 사항을 충족할 만큼 노드에 사용할 수 있는
  리소스(예: CPU 및 메모리)가 있는지 확인한다.

- `MatchNodeSelector`: 파드의 노드 {{< glossary_tooltip text="셀렉터" term_id="selector" >}}가
  노드의 {{< glossary_tooltip text="레이블" term_id="label" >}}과 일치하는지 확인한다.

- `NoVolumeZoneConflict`: 해당 스토리지에 대한 장애 영역 제한이 주어지면
  파드가 요청하는 {{< glossary_tooltip text="볼륨" term_id="volume" >}}을 노드에서 사용할 수 있는지
  평가한다.

- `NoDiskConflict`: 요청하는 볼륨과 이미 마운트된 볼륨으로 인해
  파드가 노드에 적합한지 평가한다.

- `MaxCSIVolumeCount`: 연결해야 하는 {{< glossary_tooltip text="CSI" term_id="csi" >}} 볼륨의 수와
  구성된 제한을 초과하는지 여부를 결정한다.

- `CheckNodeMemoryPressure`: 노드가 메모리 압박을 보고하고 있고, 구성된
  예외가 없는 경우, 파드가 해당 노드에 스케줄되지 않는다.

- `CheckNodePIDPressure`: 노드가 프로세스 ID 부족을 보고하고 있고, 구성된
  예외가 없는 경우, 파드가 해당 노드에 스케줄되지 않는다.

- `CheckNodeDiskPressure`: 노드가 스토리지 압박(파일시스템이 가득차거나
  거의 꽉 참)을 보고하고 있고, 구성된 예외가 없는 경우, 파드가 해당 노드에 스케줄되지 않는다.

- `CheckNodeCondition`: 노드는 파일시스템이 완전히 가득찼거나,
  네트워킹을 사용할 수 없거나, kubelet이 파드를 실행할 준비가 되지 않았다고 보고할 수 있다.
  노드에 대해 이러한 조건이 설정되고, 구성된 예외가 없는 경우, 파드가
  해당 노드에 스케줄되지 않는다.

- `PodToleratesNodeTaints`: 파드의 {{< glossary_tooltip text="톨러레이션" term_id="toleration" >}}이
  노드의 {{< glossary_tooltip text="테인트" term_id="taint" >}}를 용인할 수 있는지 확인한다.

- `CheckVolumeBinding`: 파드가 요청한 볼륨에 적합할 수 있는지 평가한다.
  이는 바인딩된 {{< glossary_tooltip text="PVC" term_id="persistent-volume-claim" >}}와
  바인딩되지 않은 PVC 모두에 적용된다.

## 우선순위 {#priorities}

다음의 *우선순위* 는 스코어링을 구현한다.

- `SelectorSpreadPriority`: 동일한 {{< glossary_tooltip text="서비스" term_id="service" >}},
  {{< glossary_tooltip text="스테이트풀셋(StatefulSet)" term_id="statefulset" >}} 또는
  {{< glossary_tooltip text="레플리카셋(ReplicaSet)" term_id="replica-set" >}}에 속하는
  파드를 고려하여, 파드를 여러 호스트에 파드를 분산한다.

- `InterPodAffinityPriority`: 선호된
  [파드간 어피니티와 안티-어피니티](/ko/docs/concepts/scheduling-eviction/assign-pod-node/#파드간-어피니티와-안티-어피니티)를 구현한다.

- `LeastRequestedPriority`: 요청된 리소스가 적은 노드를 선호한다. 즉,
  노드에 배치되는 파드가 많고, 해당 파드가 사용하는 리소스가
  많을수록 이 정책이 부여하는 순위가 낮아진다.

- `MostRequestedPriority`: 요청된 리소스가 가장 많은 노드를 선호한다.
  이 정책은 전체 워크로드 세트를 실행하는 데 필요한 최소 노드 수에 스케줄된
  파드를 맞춘다.

- `RequestedToCapacityRatioPriority`: 기본 리소스 스코어링 기능을 사용하여 ResourceAllocationPriority에 기반한 requestedToCapacity를 생성한다.

- `BalancedResourceAllocation`: 균형 잡힌 리소스 사용의 노드를 선호한다.

- `NodePreferAvoidPodsPriority`: 노드 어노테이션 `scheduler.alpha.kubernetes.io/preferAvoidPods`에 따라
  노드의 우선순위를 지정한다. 이를 사용하여 두 개의 다른 파드가
  동일한 노드에서 실행되면 안된다는 힌트를 줄 수 있다.

- `NodeAffinityPriority`: PreferredDuringSchedulingIgnoredDuringExecution에 표시된 노드 어피니티 스케줄링
  설정에 따라 노드의 우선순위를 지정한다.
  이에 대한 자세한 내용은 [노드에 파드 할당하기](/ko/docs/concepts/scheduling-eviction/assign-pod-node/)에서 확인할 수 있다.

- `TaintTolerationPriority`: 노드에서 용인할 수 없는 테인트 수를 기반으로,
  모든 노드의 우선순위 목록을 준비한다. 이 정책은 해당 목록을
  고려하여 노드의 순위를 조정한다.

- `ImageLocalityPriority`: 해당 파드의
  {{< glossary_tooltip text="컨테이너 이미지" term_id="image" >}}가 이미 로컬로 캐시된
  노드를 선호한다.

- `ServiceSpreadingPriority`: 특정 서비스에 대해, 이 정책은 해당 서비스에 대한
  파드가 서로 다른 노드에서 실행되는 것을 목표로 한다. 해당 서비스에 대한
  파드가 이미 할당되지 않은 노드에 스케줄링하는 것을 선호한다. 전반적인 결과는
  서비스가 단일 노드 장애에 대해 더 탄력적이라는 것이다.

- `EqualPriority`: 모든 노드에 동일한 가중치를 부여한다.

- `EvenPodsSpreadPriority`: 선호된
  [파드 토폴로지 분배 제약 조건](/ko/docs/concepts/workloads/pods/pod-topology-spread-constraints/)을 구현한다.

## {{% heading "whatsnext" %}}

* [스케줄링](/ko/docs/concepts/scheduling-eviction/kube-scheduler/)에 대해 배우기
* [kube-scheduler 프로파일](/docs/reference/scheduling/profiles/)에 대해 배우기
* [kube-scheduler configuration 레퍼런스 (v1beta1)](/docs/reference/config-api/kube-scheduler-config.v1beta1) 읽어보기
* [kube-scheduler Policy 레퍼런스 (v1)](/docs/reference/config-api/kube-scheduler-policy-config.v1/) 읽어보기
