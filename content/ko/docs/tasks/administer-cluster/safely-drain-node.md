---
# reviewers:
# - davidopp
# - mml
# - foxish
# - kow3ns
title: 안전하게 노드 드레인(drain)하기
content_type: task
weight: 310
---

<!-- overview -->
이 페이지는 사용자가 정의한 PodDisruptionBudget을 선택적으로 준수하면서
{{< glossary_tooltip text="노드" term_id="node" >}}를 안전하게 드레인하는 방법을 보여준다.

## {{% heading "prerequisites" %}}

이 작업은 다음 사전 요구 사항을 충족한다고 가정한다.
  1. 노드를 드레인하는 동안 애플리케이션에 고가용성이 필요하지
     않거나, 혹은
  2. [PodDisruptionBudget](/ko/docs/concepts/workloads/pods/disruptions/) 개념에 대해 읽었으며,
     이를 필요로 하는 애플리케이션을 위해
     [PodDisruptionBudgets를 설정](/docs/tasks/run-application/configure-pdb/)했다.

<!-- steps -->

## (선택 사항) 중단(disruption) 버짓 구성하기 {#configure-poddisruptionbudget}

유지보수 중에 워크로드를 계속 사용할 수 있도록,
[PodDisruptionBudget](/ko/docs/concepts/workloads/pods/disruptions/)를 구성할 수 있다.

만약 드레인하려는 노드에서 애플리케이션이 실행중이거나 실행될 수 있는
가용성이 중요하다면, 먼저 [PodDisruptionBudgets를 설정](/docs/tasks/run-application/configure-pdb/)한
뒤에 이 가이드를 따른다.

노드 드레인 중에 오동작하는 애플리케이션을 축출하려면 PodDisruptionBudgets에
`AlwaysAllow` [비정상 파드 축출 정책](/docs/tasks/run-application/configure-pdb/#unhealthy-pod-eviction-policy)을 설정하는 것을 권장한다.
기본적으로 드레인을 진행하기 전에 애플리케이션 파드가 [healthy](/docs/tasks/run-application/configure-pdb/#healthiness-of-a-pod)가
될 때까지 기다린다.

## `kubectl drain`을 사용하여 서비스에서 노드 제거하기

노드에서 유지보수(예: 커널 업그레이드, 하드웨어 유지보수 등)을 수행하기 전에
`kubectl drain`을 사용하여 노드에서 모든 파드를 안전하게 축출할 수 있다.
안전한 축출은 파드의 컨테이너가
[정상적으로 종료(gracefully terminate)](/ko/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination)될 수 있도록 하며,
사용자가 지정한 PodDisruptionBudgets을 준수한다.

{{< note >}}
기본적으로 `kubectl drain`은 노드의 종료할 수 없는
특정 시스템 파드는 무시한다. 자세한 내용은
[kubectl drain](/docs/reference/generated/kubectl/kubectl-commands/#drain)
문서를 참고한다.
{{< /note >}}

`kubectl drain`이 성공적으로 실행된 경우, 모든 파드
(이전 단락에서 설명한 무시된 파드를 제외)가 (사용자가 원하는 유예 종료 기간을
준수하고 사용자가 정의한 PodDisruptionBudget을 준수하여) 안전하게 축출되었음을
나타낸다. 그런 다음 물리적 머신의 전원을 끄거나
클라우드 플랫폼에서 실행 중인 경우 가상 머신을 삭제하여
노드를 끄는 것이 안전하다.

{{< note >}}
새로운 파드가 `node.kubernetes.io/unschedulable` 테인트(taint)를 허용하는 경우,
해당 파드는 드레인한 노드로 스케줄링 될 수 있다. 이를 방지하려면 DaemonSets 이외의
다른 테인트를 허용하지 않도록 한다.

사용자 또는 다른 API 사용자가 (스케줄러를 우회하여) 파드의 [`nodeName`](/ko/docs/concepts/scheduling-eviction/assign-pod-node/#nodename)
필드를 직접 설정하면, 해당 노드를 드레인하고 스케줄할 수 없도록 표시했더라도, 파드는
지정된 노드에 바인딩되어 해당 노드에서 실행된다.
{{< /note >}}

먼저 축출하려는 노드의 이름을 식별한다. 다음 명령어로 클러스터의 모든 노드를 출력할 수 있다.

```shell
kubectl get nodes
```

그런 다음, 쿠버네티스에게 노드를 드레인하라고 지시한다.

```shell
kubectl drain <node name>
```

DaemonSet에서 관리하는 파드가 있는 경우, 노드를 성공적으로
드레인하려면 `kubectl`과 함께 `--ignore-daemonsets`를 지정해야 한다. `kubectl drain`
서브커맨드 자체는 실제로 해당 DaemonSet 파드의 노드를 드레인하지 않는다.
DaemonSet 컨트롤러(컨트롤 플레인의 일부)는 누락된 파드를 즉시 새로운 동등한
파드로 대체한다. 또한, 데몬셋 컨트롤러는 스케줄링할 수 없는 테인트를 무시하는
파드를 생성하여, 새로운 파드가 드레인 중인 노드에서 실행될 수 있도록 한다.

위의 명령이 (오류 없이) 실행되면, 노드의 전원을 끌 수 있다
(혹은, 클라우드 플랫폼의 경우, 노드인 가상 머신을 삭제할 수 있다).
만약 유지보수 작업 중에 노드를 클러스터에 남겨두려면 다음을 실행한다.

```shell
kubectl uncordon <node name>
```
이렇게 함으로써 노드에 새로운 파드 스케줄링을 재개할 수 있음을 쿠버네티스에게 알려줄 수 있다.

## 여러 노드를 병렬로 드레인하기

`kubectl drain` 명령은 한 번에 하나의 노드에 대해서만 실행해야 한다.
그러나 서로 다른 터미널이나 백그라운드에서 여러 노드에
대한 `kubectl drain` 명령을 병렬로 실행할 수 있다.
동시에 실행되는 여러 드레인 명령은 여전히
사용자가 명시한 PodDisruptionBudget을 준수한다.

예를 들어, 3개의 레플리카가 있는 스테이트풀셋(StatefulSet)이 있고
PodDisruptionBudget이 `minAvailable: 2`으로 설정되어 있는 경우,
`kubectl drain`은 세 개의 레플리카 파드가 모두 [healthy](/docs/tasks/run-application/configure-pdb/#healthiness-of-a-pod)인
경우에만 스테이트풀셋에서 파드를 제거하며,
만약 여러 개의 드레인 명령을 동시에 실행하면
쿠버네티스는 PodDisruptionBudget을 준수하여 주어진 시간에
1개(`replicas - minAvailable` 로 계산된 것)만 사용할 수 없는
파드로 확인한다. [healthy](/docs/tasks/run-application/configure-pdb/#healthiness-of-a-pod)
레플리카의 수가 지정된 버짓 아래로 떨어지게 하는 드레인은 모두 차단된다.

## 축출 API {#eviction-api}

[kubectl drain](/docs/reference/generated/kubectl/kubectl-commands/#drain)을 사용하지 않으려는 경우
(예를 들어 외부 명령 호출을 피하거나 파드 축출 프로세스를 더 세밀하게
제어하려는 경우), 축출 API를 사용하여 프로그래밍 방식으로 축출을
유발할 수도 있다.

더 자세한 정보는, [API를 이용한 축출(API-initiated Eviction)](/ko/docs/concepts/scheduling-eviction/api-eviction/)을 확인한다.

## {{% heading "whatsnext" %}}

* 애플리케이션을 보호하려면 다음 단계인 [파드 중단 버짓 구성](/docs/tasks/run-application/configure-pdb/)을 따른다.

