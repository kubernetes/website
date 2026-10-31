---
title: "파드 컨디션"
content_type: concept
weight: 35
---

쿠버네티스에서는 많은 오브젝트가 _컨디션(condition)_ 을 가진다.
컨디션은 오브젝트가 나타내는 대상의 실제 상태 중 어떤 측면을 표시하는 지표이다.
파드도 컨디션을 가지며, 쿠버네티스 파드 컨디션은 컨트롤러가
(그리고 문제를 해결하는 사람이) 파드가 정상인지 파악하는 데 중요한 요소이다.

파드의 [단계](/docs/concepts/workloads/pods/pod-lifecycle/#파드의-단계)는 파드가 라이프사이클 중
어디에 있는지 개략적으로 보여주지만, 하나의 값만으로는 전체 상황을 담을 수 없다.
예를 들어, 파드가 `Running` 단계에 있더라도 아직 트래픽을 처리할 준비가 되지 않았을 수 있다.
파드 컨디션은 파드 상태의 여러 측면을 각각 독립적으로 추적하여 단계를 보완한다.
추적 대상에는 파드가 스케줄되었는지, 컨테이너가 준비되었는지,
리사이즈가 진행 중인지, 또는 {{< glossary_tooltip text="테인트" term_id="taint" >}}로 인해
파드가 곧 중단될 예정인지 등이 있다.

## 파드 컨디션의 구조

파드의 상태(status)에는 파드가 특정 체크포인트를 통과했는지 여부를 나타내는
[PodConditions](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podcondition-v1-core)
배열이 포함된다.

PodCondition 배열의 각 요소는 다음 필드를 가진다.

{{< table caption="PodCondition의 필드" >}}
| 필드 이름              | 설명                                                                                                  |
|:---------------------|:-----------------------------------------------------------------------------------------------------|
| `type`               | 이 파드 컨디션의 이름이다.                                                                                  |
| `status`             | 해당 컨디션이 적용되는지 여부를 나타내며, 가능한 값은 `"True"`, `"False"`, `"Unknown"`이다. |
| `lastProbeTime`      | 파드 컨디션이 마지막으로 프로브된 시간의 타임스탬프이다.                                                         |
| `lastTransitionTime` | 파드가 한 상태에서 다른 상태로 마지막으로 전환된 시간의 타임스탬프이다.                                              |
| `reason`             | 컨디션의 마지막 전환 이유를 나타내는, 기계가 판독 가능한 UpperCamelCase 텍스트이다.                                  |
| `message`            | 마지막 상태 전환에 대한 세부 정보를 나타내는, 사람이 읽을 수 있는 메시지이다.                                         |
| `observedGeneration` | 컨디션이 기록된 시점의 파드 `.metadata.generation` 값이다. [파드 세대](/docs/concepts/workloads/pods/#파드-세대-pod-generation)를 참고한다. |
{{< /table >}}

## 내장 파드 컨디션 {#built-in-pod-conditions}

쿠버네티스는 다음 파드 컨디션을 관리한다.

[라이프사이클 컨디션](#lifecycle-pod-conditions): 파드의 라이프사이클이 진행되면서 대략 다음 순서로 설정된다.
`PodScheduled`, `PodReadyToStartContainers`, `Initialized`, `ContainersReady`, `Ready`.

[기타 컨디션](#other-pod-conditions): 특정 작업이나 이벤트가 발생하면 설정된다.
`DisruptionTarget`, `PodResizePending`, `PodResizeInProgress`.

위의 내장 컨디션 외에도, [파드 준비성 게이트(readiness gate)](#enhanced-pod-readiness)를 사용하여
사용자 지정 컨디션을 정의할 수 있다.

## 라이프사이클 파드 컨디션 {#lifecycle-pod-conditions}

파드의 라이프사이클이 진행되면서, kubelet은 대략 다음 순서로 컨디션을 설정한다.

1. `PodScheduled`: 파드가 노드에 스케줄되었다.
1. `PodReadyToStartContainers`: 파드 샌드박스가 성공적으로 생성되고 네트워킹이 구성되었다. 샌드박스와 네트워크는 {{< glossary_tooltip text="컨테이너 런타임" term_id="container-runtime" >}}과 {{< glossary_tooltip text="CNI" term_id="cni" >}} 플러그인이 구성한다.
1. `Initialized`: 모든 [초기화 컨테이너](/docs/concepts/workloads/pods/init-containers/)가 성공적으로 완료되었다. 초기화 컨테이너가 없는 파드의 경우, 샌드박스 생성 전에 `True`로 설정된다.
1. `ContainersReady`: 파드의 모든 컨테이너가 준비되었다. 컨테이너의 준비 여부는 [준비성 프로브(readiness probe)](/docs/concepts/workloads/pods/probes/#readiness-probe)가 구성된 경우 이를 통해 결정된다.
1. `Ready`: 파드가 요청을 처리할 수 있으며, 일치하는 모든 [서비스](/docs/concepts/services-networking/service/)의 로드 밸런싱 풀에 추가되어야 한다. `Ready`가 아닌 파드는 서비스 엔드포인트에서 제거된다.

{{< note >}}
`Ready` 컨디션은 `ContainersReady`만으로 결정되지 않는다. 파드에 `readinessGates`가 지정되어 있다면, 해당 사용자 지정 컨디션도 모두 `True`여야 `Ready`가 된다. 자세한 내용은 [파드 준비성](#enhanced-pod-readiness)을 참고한다.
{{< /note >}}

kubectl을 사용하여 파드의 컨디션을 확인할 수 있다.

```shell
kubectl get pod <pod-name> -o yaml
```

다음은 실행 중인 파드의 `status.conditions` 예시이다.

```yaml
status:
  conditions:
    - type: PodScheduled
      status: "True"
      lastProbeTime: null
      lastTransitionTime: "2026-03-29T08:52:21Z"
      observedGeneration: 1
    - type: PodReadyToStartContainers
      status: "True"
      lastProbeTime: null
      lastTransitionTime: "2026-04-11T06:02:16Z"
      observedGeneration: 1
    - type: Initialized
      status: "True"
      lastProbeTime: null
      lastTransitionTime: "2026-03-29T08:52:21Z"
      observedGeneration: 1
    - type: ContainersReady
      status: "True"
      lastProbeTime: null
      lastTransitionTime: "2026-04-11T06:02:45Z"
      observedGeneration: 1
    - type: Ready
      status: "True"
      lastProbeTime: null
      lastTransitionTime: "2026-04-11T06:02:45Z"
      observedGeneration: 1
```

### PodReadyToStartContainers {#pod-ready-to-start-containers}

{{< feature-state feature_gate_name="PodReadyToStartContainersCondition" >}}

{{< note >}}
이 컨디션은 초기 개발 단계에서 `PodHasNetwork`라는 이름이었다.
{{< /note >}}

파드가 노드에 스케줄되면, kubelet이 파드를 승인(admit)해야 하고
필요한 스토리지 볼륨이 모두 마운트되어야 한다. 이 단계들이 완료되면,
kubelet은 컨테이너 런타임과 함께
({{< glossary_tooltip text="컨테이너 런타임 인터페이스(CRI)" term_id="cri" >}}를 사용하여)
런타임 샌드박스를 설정하고 파드의 네트워킹을 구성한다.
`PodReadyToStartContainers` 컨디션은 파드의 `status.conditions` 필드에 추가된다.

kubelet은 파드에 네트워킹이 구성된 런타임 샌드박스가 없음을 감지하면 이 컨디션을 `False`로 설정한다. 이는 다음과 같은 상황에서 발생한다.

- 파드 라이프사이클 초기에, kubelet이 아직 컨테이너 런타임을 사용하여 파드의 샌드박스 설정을 시작하지 않은 경우.
- 파드 라이프사이클 후기에, 다음 중 하나의 이유로 파드 샌드박스가 파괴된 경우.
  - 파드가 축출되지 않은 상태에서 노드가 재부팅된 경우
  - 격리를 위해 가상 머신을 사용하는 컨테이너 런타임에서, 파드 샌드박스 가상 머신이 재부팅된 경우. 이 경우 새로운 샌드박스와 새로운 컨테이너 네트워크 구성을 생성해야 한다.

런타임 플러그인이 파드의 샌드박스 생성과 네트워크 구성을 성공적으로 완료하면, kubelet은 `PodReadyToStartContainers` 컨디션을 `True`로 설정한다. `PodReadyToStartContainers` 컨디션이 `True`로 설정된 후에 kubelet은 컨테이너 이미지를 풀링하고 컨테이너를 생성할 수 있다.

초기화 컨테이너가 있는 파드의 경우, kubelet은 초기화 컨테이너가 성공적으로 완료된 후(초기화 컨테이너는 런타임 플러그인이 샌드박스 생성과 네트워크 구성을 마친 뒤에 실행된다) `Initialized` 컨디션을 `True`로 설정한다. 초기화 컨테이너가 없는 파드의 경우, kubelet은 샌드박스 생성과 네트워크 구성이 시작되기 전에 `Initialized` 컨디션을 `True`로 설정한다.

## 기타 파드 컨디션 {#other-pod-conditions}

다음 컨디션은 일반적인 파드 라이프사이클 진행의 일부가 아니다.
특정 작업이나 이벤트가 발생하면 설정된다.

### DisruptionTarget {#disruption-target}

`DisruptionTarget`이라는 별도의 파드 컨디션은
{{<glossary_tooltip term_id="disruption" text="중단(disruption)">}}으로 인해 파드가 곧 삭제될 예정임을 나타내기 위해 추가된다.
추가로 컨디션의 `reason` 필드는
파드 종료에 대한 다음 원인 중 하나를 나타낸다.

`PreemptionByScheduler`
: 더 높은 우선순위를 가진 새 파드를 수용하기 위해 스케줄러가 파드를 {{<glossary_tooltip term_id="preemption" text="선점(preempt)">}}할 예정이다. 자세한 내용은 [파드 우선순위 선점](/docs/concepts/scheduling-eviction/pod-priority-preemption/)을 참고한다.

`DeletionByTaintManager`
: 파드가 허용하지 않는 `NoExecute` 테인트로 인해, 테인트 매니저(`kube-controller-manager` 내 노드 라이프사이클 컨트롤러의 일부)가 파드를 삭제할 예정이다. {{<glossary_tooltip term_id="taint" text="테인트">}} 기반 축출을 참고한다.

`EvictionByEvictionAPI`
: 파드가 {{<glossary_tooltip term_id="api-eviction" text="쿠버네티스 API를 이용한 축출">}} 대상으로 표시되었다.

`DeletionByPodGC`
: 더 이상 존재하지 않는 노드에 바인딩된 파드가 [파드 가비지 콜렉션](/docs/concepts/workloads/pods/pod-lifecycle/#pod-garbage-collection)에 의해 삭제될 예정이다.

`TerminationByKubelet`
: {{<glossary_tooltip term_id="node-pressure-eviction" text="노드-압박 축출">}},
  [그레이스풀 노드 셧다운](/docs/concepts/architecture/nodes/#graceful-node-shutdown),
  또는 [시스템 크리티컬 파드](/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/)를 위한 선점으로 인해 kubelet이 파드를 종료했다.

그 외의 모든 중단 시나리오, 예를 들어
[파드 컨테이너 제한](/docs/concepts/configuration/manage-resources-containers/)을 초과하여 축출되는 경우에는
중단의 원인이 파드 자체에 있을 가능성이 높아 재시도해도 다시 발생할 수 있으므로,
파드에 `DisruptionTarget` 컨디션이 추가되지 않는다.

{{< note >}}
파드 중단 작업은 도중에 멈출 수 있다. 컨트롤 플레인은 동일한 파드의 중단을
다시 시도할 수 있지만, 이는 보장되지 않는다. 그 결과,
`DisruptionTarget` 컨디션이 파드에 추가되었지만 해당 파드가 실제로는
삭제되지 않을 수 있다. 이런 경우, 일정 시간이 지나면
파드 중단 컨디션이 해제된다.
{{< /note >}}

파드 가비지 콜렉터(PodGC)는 파드를 정리하면서, 아직 종료되지 않은 단계에 있는 파드를 실패(failed)로도 표시한다
([파드 가비지 콜렉션](/docs/concepts/workloads/pods/pod-lifecycle/#pod-garbage-collection)도 참고한다).

잡(Job)이나 크론잡(CronJob)을 사용할 때, 이러한 파드 중단 컨디션을 잡의
[파드 실패 정책](/docs/concepts/workloads/controllers/job#파드-실패-정책)의 일부로 사용할 수 있다.

자세한 내용은 [중단](/docs/concepts/workloads/pods/disruptions/)을 참고한다.

### PodResizePending과 PodResizeInProgress {#pod-resize-conditions}

kubelet은 리사이즈 요청의 상태를 나타내기 위해 파드의 상태 컨디션을 업데이트한다.

- `type: PodResizePending`: kubelet이 요청을 즉시 승인할 수 없다. `message` 필드에서 그 이유를 설명한다.
  - `reason: Infeasible`: 요청된 리사이즈가 현재 노드에서 불가능하다(예: 노드가 가진 것보다 더 많은 리소스를 요청한 경우).
  - `reason: Deferred`: 요청된 리사이즈가 현재는 불가능하지만, 나중에 가능해질 수 있다(예: 다른 파드가 제거된 경우). kubelet이 리사이즈를 재시도한다.
- `type: PodResizeInProgress`: kubelet이 리사이즈를 승인하고 리소스를 할당했지만, 변경 사항이 아직 적용 중이다. 이 과정은 보통 금방 끝나지만 리소스 유형과 런타임 동작에 따라 더 오래 걸릴 수 있다. 적용 중 발생한 오류는 `message` 필드에 (`reason: Error`와 함께) 보고된다.

요청된 리사이즈가 _Deferred_ 상태이면, kubelet은 주기적으로 리사이즈를 재시도한다. 예를 들어 다른 파드가 제거되거나 스케일 다운될 때 재시도한다.

파드 리사이즈에 대한 자세한 내용은 [컨테이너에 할당된 CPU 및 메모리 리소스 리사이즈](/docs/tasks/configure-pod-container/resize-container-resources/)를 참고한다.

## 향상된 파드 준비성 {#enhanced-pod-readiness}

애플리케이션은 파드의 `.status`에 추가 피드백이나 신호를 주입할 수 있다.
이를 _향상된 파드 준비성(enhanced Pod readiness)_ 이라고 한다.
이를 사용하려면, 파드의 `spec`에 `readinessGates`를 설정하여 kubelet이 파드 준비성을
평가할 때 사용할 추가 컨디션 목록을 지정한다.
그런 다음 이러한 사용자 지정 컨디션을 관리하는 컨트롤러를 구현하거나 설치하면,
kubelet은 이를 파드의 준비 여부를 결정하는 추가 입력으로 사용한다.

준비성 게이트는 파드의 `status.condition` 필드의 현재 상태에 따라 결정된다.
쿠버네티스가 파드의 `status.conditions` 필드에서 해당 컨디션을 찾지 못하면, 그 컨디션의 상태는 기본값인 "`False`"가 된다.

```yaml
kind: Pod
...
spec:
  readinessGates:
    - conditionType: "www.example.com/feature-1"
status:
  conditions:
    - type: Ready                              # 내장 PodCondition
      status: "False"
      lastProbeTime: null
      lastTransitionTime: 2018-01-01T00:00:00Z
    - type: "www.example.com/feature-1"        # 추가 PodCondition
      status: "False"
      lastProbeTime: null
      lastTransitionTime: 2018-01-01T00:00:00Z
  containerStatuses:
    - containerID: docker://abcd...
      ready: true
...
```

추가하는 파드 컨디션의 이름은 쿠버네티스 [레이블 키 포맷](/docs/concepts/overview/working-with-objects/labels/#구문과-캐릭터-셋)을 충족해야 한다.

### 파드 준비성 상태 {#pod-readiness-status}

파드에 이러한 `status.conditions`를 설정하려면, 애플리케이션과
{{< glossary_tooltip term_id="operator-pattern" text="오퍼레이터">}}는
파드의 status 서브리소스에 대해 `PATCH` 액션을 사용해야 한다. `--subresource=status`와 함께 `kubectl patch`를
사용하거나, [쿠버네티스 클라이언트 라이브러리](/docs/reference/using-api/client-libraries/)를 사용하여
파드 준비성을 위한 사용자 지정 파드 컨디션을 설정하는 코드를 작성할 수 있다.

사용자 지정 컨디션을 사용하는 파드의 경우, 다음 두 조건이 모두 충족될 때**만** 해당 파드가 준비된 것으로 평가된다.

- 파드의 모든 컨테이너가 준비되었다.
- `readinessGates`에 지정된 모든 컨디션이 `True`이다.

파드의 컨테이너는 Ready이지만 사용자 지정 컨디션 중 하나 이상이 없거나 `False`이면,
kubelet은 파드의 `Ready` 컨디션을 `reason: ReadinessGatesNotReady`와 함께 `status: "False"`로 설정한다.

## {{% heading "whatsnext" %}}

- [파드 라이프사이클](/docs/concepts/workloads/pods/pod-lifecycle/)에 대해 알아본다.
- [중단](/docs/concepts/workloads/pods/disruptions/)에 대해 알아본다.
- [컨테이너 프로브](/docs/concepts/workloads/pods/probes/)와 프로브가 파드 준비성에 미치는 영향에 대해 알아본다.
- [파드 리소스를 인플레이스(in-place)로 리사이즈하는 방법](/docs/tasks/configure-pod-container/resize-container-resources/)을 알아본다.
