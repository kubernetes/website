---
title: 노드 셧다운
content_type: concept
weight: 10
---

<!-- overview -->

쿠버네티스 클러스터에서 {{< glossary_tooltip text="노드" term_id="node" >}} 는 계획된 그레이스풀(graceful) 방식으로 셧다운될 수도 있고, 정전이나 기타 외부 요인과 같은 이유로 예기치 않게 셧다운될 수도 있다.
노드가 셧다운되기 전에 드레인 되지 않으면 워크로드가 실패할 수 있다.
노드 셧다운은 그레이스풀(graceful) 또는 논 그레이스풀(non-graceful) 두 가지로 나뉜다.

<!-- body -->

## 그레이스풀(Graceful) 노드 셧다운(shutdown) {#graceful-node-shutdown}

{{< feature-state state="beta" for_k8s_version="v1.21" >}}

Kubelet은 노드 시스템 셧다운을 감지하고 노드에서 실행 중인 파드를 종료하려고 시도한다.

Kubelet은 노드가 종료되는 동안 파드가 
일반 [파드 종료 프로세스](/ko/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination)를 
따르도록 한다.

그레이스풀 노드 셧다운 기능은
[systemd inhibitor locks](https://www.freedesktop.org/wiki/Software/systemd/inhibit/)를
사용하여 주어진 기간 동안 노드 종료를 지연시키므로 systemd에 의존한다.

그레이스풀 노드 셧다운은 1.21에서 기본적으로 활성화된 `GracefulNodeShutdown`
[기능 게이트](/ko/docs/reference/command-line-tools-reference/feature-gates/)로 
제어된다.

기본적으로, 아래 설명된 두 구성 옵션,
`shutdownGracePeriod` 및 `shutdownGracePeriodCriticalPods` 는 모두 0으로 설정되어 있으므로,
그레이스풀 노드 셧다운 기능이 활성화되지 않는다.
기능을 활성화하려면, 두 개의 kubelet 구성 설정을 적절하게 구성하고 
0이 아닌 값으로 설정해야 한다.

일단 systemd가 노드 셧다운을 감지하거나 알림을 받으면, kubelet은 해당 노드에 대해 `NotReady` 상태를 설정하고, `reason`은 `"node is shutting down"`으로 기록된다. kube-scheduler는 이 상태를 인식하고 해당 노드에 새로운 파드를 스케줄링하지 않는다; 다른 서드파티 스케줄러들도 동일한 로직을 따르도록 기대된다. 즉, 새로운 파드는 해당 노드에 배치되지 않으며 따라서 실행되지 않는다.

**또한** kubelet은 노드 셧다운을 감지하면 `PodAdmission` 단계에서 파드를 거절하고, 따라서 `node.kubernetes.io/not-ready:NoSchedule`에 대한 {{< glossary_tooltip text="톨러레이션" term_id="toleration" >}}을 가진 파드조차도 그 노드에서는 실행되지 않는다.

Kubelet이 API를 통해 노드에 이런 상태를 설정할 때, 동시에 로컬에서 실행 중인 모든 파드들을 종료하기 시작한다.

그레이스풀 셧다운 중에 kubelet은 다음의 두 단계로 파드를 종료한다.

1. 노드에서 실행 중인 일반 파드를 종료시킨다.
2. 노드에서 실행 중인 
  [중요(critical) 파드](/ko/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/#파드를-중요-critical-로-표시하기)를 종료시킨다.

그레이스풀 노드 셧다운 기능은 
두 개의 [`KubeletConfiguration`](/docs/tasks/administer-cluster/kubelet-config-file/) 옵션으로 구성된다.

* `shutdownGracePeriod`:
  * 노드가 종료를 지연해야 하는 총 기간을 지정한다. 
    이것은 모든 일반 및 [중요 파드](/ko/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/#파드를-중요-critical-로-표시하기)의 
    파드 종료에 필요한 총 유예 기간에 해당한다.
* `shutdownGracePeriodCriticalPods`:
  * 노드 종료 중에 [중요 파드](/ko/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/#파드를-중요-critical-로-표시하기)를 
    종료하는 데 사용되는 기간을 지정한다. 
    이 값은 `shutdownGracePeriod` 보다 작아야 한다.

{{< note >}}

시스템(또는 관리자가 수동으로)에 의해 노드 셧다운이 취소되는 경우가 있다. 이런 상황에서는 노드가 다시 Ready 상태로 돌아간다.
그러나 이미 종료 절차가 시작된 파드들은 kubelet에 의해 복구되지 않으며, 다시 스케줄링되어야 한다.

{{< /note >}}

예를 들어, `shutdownGracePeriod=30s`,
`shutdownGracePeriodCriticalPods=10s` 인 경우, kubelet은 노드 종료를 30초까지
지연시킨다. 종료하는 동안 처음 20(30-10)초는 일반 파드의
유예 종료에 할당되고, 마지막 10초는
[중요 파드](/ko/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/#파드를-중요-critical-로-표시하기)의 종료에 할당된다.

{{< note >}}
그레이스풀 노드 셧다운 과정에서 축출된 파드는 셧다운(shutdown)된 것으로 표시된다.
`kubectl get pods` 명령을 실행하면 축출된 파드의 상태가 `Terminated`으로 표시된다.
그리고 `kubectl describe pod` 명령을 실행하면 노드 셧다운으로 인해 파드가 축출되었음을 알 수 있다.

```
Reason:         Terminated
Message:        Pod was terminated in response to imminent node shutdown.
```

{{< /note >}}

### 파드 우선순위 기반 그레이스풀 노드 셧다운 {#pod-priority-graceful-node-shutdown}

{{< feature-state feature_gate_name="GracefulNodeShutdownBasedOnPodPriority" >}}

그레이스풀 노드 셧다운 시 파드 셧다운 순서에 더 많은 유연성을 제공할 수 있도록, 
클러스터에 프라이어리티클래스(PriorityClass) 기능이 활성화되어 있으면 
그레이스풀 노드 셧다운 과정에서 파드의 프라이어리티클래스가 고려된다. 
이 기능으로 그레이스풀 노드 셧다운 시 파드가 종료되는 순서를 클러스터 관리자가 
[프라이어리티 클래스](/ko/docs/concepts/scheduling-eviction/pod-priority-preemption/#프라이어리티클래스) 
기반으로 명시적으로 정할 수 있다.

위에서 기술된 것처럼, [그레이스풀 노드 셧다운](#graceful-node-shutdown) 기능은 파드를 
중요하지 않은(non-critical) 파드와 
중요한(critical) 파드 2단계(phase)로 구분하여 종료시킨다. 
셧다운 시 파드가 종료되는 순서를 명시적으로 더 상세하게 정해야 한다면, 
파드 우선순위 기반 그레이스풀 노드 셧다운을 사용할 수 있다.

그레이스풀 노드 셧다운 과정에서 파드 우선순위가 고려되기 때문에, 
그레이스풀 노드 셧다운이 여러 단계로 일어날 수 있으며, 
각 단계에서 특정 프라이어리티 클래스의 파드를 종료시킨다. 
정확한 단계와 단계별 셧다운 시간은 kubelet에 설정할 수 있다.

다음과 같이 클러스터에 커스텀 파드 
[프라이어리티 클래스](/ko/docs/concepts/scheduling-eviction/pod-priority-preemption/#프라이어리티클래스)가 있다고 
가정하자.

|파드 프라이어리티 클래스 이름|파드 프라이어리티 클래스 값|
|-------------------------|------------------------|
|`custom-class-a`         | 100000                 |
|`custom-class-b`         | 10000                  |
|`custom-class-c`         | 1000                   |
|`regular/unset`          | 0                      |

[kubelet 환경 설정](/docs/reference/config-api/kubelet-config.v1beta1/#kubelet-config-k8s-io-v1beta1-KubeletConfiguration) 안의
`shutdownGracePeriodByPodPriority` 설정은 다음과 같을 수 있다.

|파드 프라이어리티 클래스 값|종료 대기 시간|
|------------------------|---------------|
| 100000                 |10 seconds     |
| 10000                  |180 seconds    |
| 1000                   |120 seconds    |
| 0                      |60 seconds     |

이를 나타내는 kubelet 환경 설정 YAML은 다음과 같다.

```yaml
shutdownGracePeriodByPodPriority:
  - priority: 100000
    shutdownGracePeriodSeconds: 10
  - priority: 10000
    shutdownGracePeriodSeconds: 180
  - priority: 1000
    shutdownGracePeriodSeconds: 120
  - priority: 0
    shutdownGracePeriodSeconds: 60
```
위의 표에 의하면 `priority` 값이 100000 이상인 파드는 종료까지 10초만 주어지며, 
10000 이상 ~ 100000 미만이면 180초, 
1000 이상 ~ 10000 미만이면 120초가 주어진다.
마지막으로, 다른 모든 파드는 종료까지 60초가 주어질 것이다.

모든 클래스에 대해 값을 명시할 필요는 없다. 
예를 들어, 대신 다음과 같은 구성을 사용할 수도 있다.

|파드 프라이어리티 클래스 값|종료 대기 시간|
|------------------------|---------------|
| 100000                 |300 seconds    |
| 1000                   |120 seconds    |
| 0                      |60 seconds     |


위의 경우, `custom-class-b`에 속하는 파드와 `custom-class-c`에 속하는 파드는 
동일한 종료 대기 시간을 갖게 될 것이다.

특정 범위에 해당되는 파드가 없으면, 
kubelet은 해당 범위에 해당되는 파드를 위해 기다려 주지 않는다. 
대신, kubelet은 즉시 다음 프라이어리티 클래스 값 범위로 넘어간다.

기능이 활성화되어 있지만 환경 설정이 되어 있지 않으면, 
순서 지정 동작이 수행되지 않을 것이다.

이 기능을 사용하려면 `GracefulNodeShutdownBasedOnPodPriority` 
[기능 게이트](/ko/docs/reference/command-line-tools-reference/feature-gates/)를 활성화해야 하고, 
[kubelet config](/docs/reference/config-api/kubelet-config.v1beta1/)의 
`ShutdownGracePeriodByPodPriority`를 
파드 프라이어리티 클래스 값과 각 값에 대한 종료 대기 시간을 명시하여 
지정해야 한다.

{{< note >}}
그레이스풀 노드 셧다운 과정에서 파드 프라이어리티를 고려하는 기능은 
쿠버네티스 v1.23에서 알파 기능으로 도입되었다. 
쿠버네티스 {{< skew currentVersion >}}에서 이 기능은 베타 상태이며 기본적으로 활성화되어 있다.
{{< /note >}}

`graceful_shutdown_start_time_seconds` 및 `graceful_shutdown_end_time_seconds` 메트릭은 
노드 셧다운을 모니터링하기 위해 kubelet 서브시스템에서 방출된다.

## 논 그레이스풀 노드 셧다운 {#non-graceful-node-shutdown}

{{< feature-state feature_gate_name="NodeOutOfServiceVolumeDetach" >}}

전달한 명령이 kubelet에서 사용하는 금지 잠금 메커니즘(inhibitor locks mechanism)을 트리거하지 않거나, 
또는 사용자 오류(예: ShutdownGracePeriod 및 ShutdownGracePeriodCriticalPods가 제대로 설정되지 않음)로 인해 
kubelet의 노드 셧다운 관리자(Node Shutdown Mananger)가 
노드 셧다운 액션을 감지하지 못할 수 있다. 
자세한 내용은 위의 [그레이스풀 노드 셧다운](#graceful-node-shutdown) 섹션을 참조한다.

노드가 셧다운되었지만 kubelet의 노드 셧다운 관리자가 이를 감지하지 못하면, 
{{< glossary_tooltip text="스테이트풀셋" term_id="statefulset" >}}에 속한 파드는 셧다운된 노드에 '종료 중(terminating)' 상태로 고착되어 
다른 동작 중인 노드로 이전될 수 없다. 
이는 셧다운된 노드의 kubelet이 파드를 지울 수 없어서 
결국 스테이트풀셋이 동일한 이름으로 새 파드를 만들 수 없기 때문이다. 
만약 파드가 사용하던 볼륨이 있다면, 
VolumeAttachment도 기존의 셧다운된 노드에서 삭제되지 않아 
결국 파드가 사용하던 볼륨이 다른 동작 중인 노드에 연결(attach)될 수 없다. 
결과적으로, 스테이트풀셋에서 실행되는 애플리케이션이 제대로 작동하지 않는다. 
기존의 셧다운된 노드가 정상으로 돌아오지 못하면, 
이러한 파드는 셧다운된 노드에 '종료 중(terminating)' 상태로 영원히 고착될 것이다.

위와 같은 상황을 완화하기 위해, 사용자가 `node.kubernetes.io/out-of-service` 테인트를 `NoExecute` 또는 `NoSchedule` 값으로 
추가하여 노드를 서비스 불가(out-of-service) 상태로 표시할 수 있다. 
`kube-controller-manager`에 `NodeOutOfServiceVolumeDetach`[기능 게이트](/ko/docs/reference/command-line-tools-reference/feature-gates/)
가 활성화되어 있고, 노드가 이 테인트에 의해 서비스 불가 상태로 표시되어 있는 경우, 
노드에 매치되는 톨러레이션이 없다면 노드 상의 파드는 강제로 삭제될 것이고, 
노드 상에서 종료되는 파드에 대한 볼륨 해제(detach) 작업은 즉시 수행될 것이다. 
이를 통해 서비스 불가 상태 노드의 파드가 빠르게 다른 노드에서 복구될 수 있다.

논 그레이스풀 셧다운 과정 동안, 파드는 다음의 두 단계로 종료된다.

1. 매치되는 `out-of-service` 톨러레이션이 없는 파드를 강제로 삭제한다.
2. 이러한 파드에 대한 볼륨 해제 작업을 즉시 수행한다.

{{< note >}}
- `node.kubernetes.io/out-of-service` 테인트를 추가하기 전에, 
  노드가 완전한 셧다운 또는 전원 꺼짐 상태에 있는지 
  (재시작 중인 것은 아닌지) 확인한다.
- 사용자가 서비스 불가 상태 테인트를 직접 추가한 것이기 때문에, 
  파드가 다른 노드로 옮겨졌고 셧다운 상태였던 노드가 복구된 것을 확인했다면 
  사용자가 서비스 불가 상태 테인트를 수동으로 제거해야 한다.
{{< /note >}}

### 타임아웃 시 강제 스토리지 분리 {#storage-force-detach-on-timeout}

파드 삭제가 6분 동안 성공하지 못한 상황에서는, 해당 시점에 노드가 정상적이지 않다면 쿠버네티스가 마운트 해제 중인 볼륨을 강제로 분리한다.
노드에서 여전히 실행 중인 워크로드가 강제로 분리된 볼륨을 사용하면 CSI 사양 위반이 발생할 수 있다. [CSI 사양](https://github.com/container-storage-interface/spec/blob/master/spec.md#controllerunpublishvolume)에는 `ControllerUnpublishVolume`이 "모든 `NodeUnstageVolume`과 `NodeUnpublishVolume`이 호출되고 성공한 이후에 **반드시** 호출되어야 한다"고 명시되어 있다. 이런 상황에서는 해당 노드의 볼륨에서 데이터 손상이 발생할 수 있다.

강제 스토리지 분리 동작은 선택 사항이다. 사용자는 대신 "비정상 노드 종료(Non-graceful node shutdown)" 기능을 사용할 수 있다.

타임아웃 시 강제 분리는 `kube-controller-manager`의 `disable-force-detach-on-timeout` 설정 필드를 통해 비활성화할 수 있다. 타임아웃 시 강제 분리를 비활성화하면, 6분 이상 비정상 상태인 노드에 호스팅된 볼륨은 관련 [VolumeAttachment](/docs/reference/kubernetes-api/config-and-storage-resources/volume-attachment-v1/)가 삭제되지 않는다.

이 설정을 적용한 후에는, 여전히 볼륨에 연결된 비정상 Pod를 위에서 언급한 [논 그레이스풀 셧다운](#non-graceful-node-shutdown) 절차를 통해 복구해야 한다.

{{< note >}}
- [논 그레이스풀 셧다운](#non-graceful-node-shutdown) 절차를 사용할 때는 주의해야 한다.
- 문서에 명시된 단계에서 벗어나면 데이터 손상이 발생할 수 있다.
{{< /note >}}

## 윈도우 그레이스풀 노드 셧다운 {#windows-graceful-node-shutdown}

{{< feature-state feature_gate_name="WindowsGracefulNodeShutdown" >}}

Windows 그레이스풀 노드 셧다운 기능은 kubelet이 Windows 서비스로 실행될 때 동작한다.
이 경우 [서비스 제어 핸들러](https://learn.microsoft.com/en-us/windows/win32/services/service-control-handler-function)
가 등록되어, 지정된 시간 동안 사전 종료(Preshutdown) 이벤트를 지연시킬 수 있다.

Windows 그레이스풀 노드 셧다운는 1.32에서 알파 기능으로 도입된 `WindowsGracefulNodeShutdown` [기능 게이트](/ko/docs/reference/command-line-tools-reference/feature-gates/)
로 제어된다.

Windows 그레이스풀 노드 셧다운는 취소할 수 없다.

만약 kubelet이 Windows 서비스로 실행되지 않는다면, [Preshutdown](https://learn.microsoft.com/en-us/windows/win32/api/winsvc/ns-winsvc-service_preshutdown_info)
 이벤트를 설정하고 모니터링할 수 없으며, 노드는 위에서 언급한 [논 그레이스풀 셧다운](#non-graceful-node-shutdown)
 절차를 거쳐야 한다.

Windows 그레이스풀 노드 셧다운 기능이 활성화되어 있지만 kubelet이 Windows 서비스로 실행되지 않는 경우, kubelet은 실패하지 않고 계속 실행된다. 그러나 Windows 서비스로 실행되어야 한다는 오류를 로그에 기록한다.

## {{% heading "whatsnext" %}}

* 블로그: [Non-Graceful Node Shutdown](/blog/2023/08/16/kubernetes-1-28-non-graceful-node-shutdown-ga/)를 읽어본다.
* 클러스터 구조: [노드](/docs/concepts/architecture/nodes/)를 읽어본다.
