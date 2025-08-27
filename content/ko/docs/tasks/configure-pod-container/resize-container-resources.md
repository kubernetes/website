---
title: 컨테이너에 할당된 CPU 및 메모리 리소스 크기 조정
content_type: task
weight: 30
min-kubernetes-server-version: 1.33
---

<!-- overview -->

{{< feature-state feature_gate_name="InPlacePodVerticalScaling" >}}

이 페이지는 파드를 재생성하지 않고 컨테이너에 할당된 CPU 및 메모리 리소스 요청량과 제한량을 변경하는 방법을 설명한다.

전통적으로 파드의 리소스 요구사항을 변경하려면 기존 파드를 삭제하고 [워크로드 컨트롤러](/ko/docs/concepts/workloads/controllers/)에 의해 관리되는 대체 파드를 생성해야 했다.
제자리 파드 크기 조정(In-place Pod Resize)을 사용하면 실행 중인 파드 내에서 컨테이너의 CPU/메모리 할당량을 변경할 수 있으며, 애플리케이션 중단을 피할 수 있다.

**핵심 개념:**

* **원하는 리소스(Desired Resources):** 컨테이너의 `spec.containers[*].resources`는 해당 컨테이너가 *원하는* 리소스를 나타내며, CPU와 메모리에 대해 변경 가능하다.
* **실제 리소스(Actual Resources):** `status.containerStatuses[*].resources` 필드는 실행 중인 컨테이너에 *현재 구성된* 리소스를 반영한다. 아직 시작되지 않았거나 재시작된 컨테이너의 경우, 다음 시작 시 할당될 리소스를 반영한다.
* **크기 조정 트리거(Triggering a Resize):** 파드 명세에서 원하는 `requests`와 `limits`를 업데이트하여 크기 조정을 요청할 수 있다. 이는 일반적으로 파드의 `resize` 서브리소스를 대상으로 하는 `kubectl patch`, `kubectl apply`, 또는 `kubectl edit`을 사용하여 수행된다. 원하는 리소스와 할당된 리소스가 일치하지 않으면 kubelet이 컨테이너 크기를 조정하려고 시도한다.
* **할당된 리소스(고급)(Allocated Resources (Advanced)):** `status.containerStatuses[*].allocatedResources` 필드는 kubelet에서 확인된 리소스 값을 추적하며, 주로 내부 스케줄링 로직에 사용된다. 대부분의 모니터링 및 검증 목적에서는 `status.containerStatuses[*].resources`에 집중하면 된다.

노드에 보류 중이거나 불완전한 크기 조정이 있는 파드가 있는 경우([파드 크기 조정 상태](#pod-resize-status) 참조), 
{{< glossary_tooltip text="스케줄러" term_id="kube-scheduler" >}}는 스케줄링 결정을 내릴 때 컨테이너의 원하는 요청량, 할당된 요청량, 상태의 실제 요청량 중 *최대값*을 사용한다.

## {{% heading "prerequisites" %}}

쿠버네티스 클러스터가 필요하고, kubectl 커맨드라인 도구가 클러스터와 통신할 수 있도록 구성되어 있어야 한다. 컨트롤 플레인 호스트 역할을 하지 않는 최소 두 개의 노드가 있는 클러스터에서 이 튜토리얼을 실행하는 것을 권장한다. 클러스터가 아직 없다면, minikube를 사용하여 생성하거나 다음 쿠버네티스 플레이그라운드 중 하나를 사용할 수 있다.

* Killercoda
* KodeKloud
* Play with Kubernetes

쿠버네티스 서버가 버전 1.33 이상이어야 한다. 버전을 확인하려면 `kubectl version`을 입력한다.

컨트롤 플레인과 클러스터의 모든 노드에서 `InPlacePodVerticalScaling` [기능 게이트](/ko/docs/reference/command-line-tools-reference/feature-gates/)가 활성화되어 있어야 한다.

`--subresource=resize` 플래그를 사용하려면 `kubectl` 클라이언트 버전이 최소 v1.32 이상이어야 한다.

## 파드 크기 조정 상태

kubelet은 크기 조정 요청의 상태를 나타내기 위해 파드의 상태 조건을 업데이트한다.

* `type: PodResizePending`: kubelet이 요청을 즉시 승인할 수 없다. `message` 필드에서 이유에 대한 설명을 제공한다.
    * `reason: Infeasible`: 요청된 크기 조정이 현재 노드에서 불가능하다(예: 노드가 가진 것보다 더 많은 리소스 요청).
    * `reason: Deferred`: 요청된 크기 조정이 현재는 불가능하지만, 나중에 가능할 수 있다(예: 다른 파드가 제거된 경우). kubelet이 크기 조정을 재시도한다.
* `type: PodResizeInProgress`: kubelet이 크기 조정을 승인하고 리소스를 할당했지만, 변경사항이 아직 적용 중이다. 이는 보통 짧은 시간이지만 리소스 유형과 런타임 동작에 따라 더 오래 걸릴 수 있다. 실행 중 오류는 `message` 필드에 (`reason: Error`와 함께) 보고된다.

## 컨테이너 크기 조정 정책

컨테이너 명세에서 `resizePolicy`를 설정하여 크기를 조정할 때 컨테이너를 재시작해야 하는지 여부를 제어할 수 있다. 이를 통해 리소스 유형(CPU 또는 메모리)에 따른 세밀한 제어가 가능하다.

```yaml
    resizePolicy:
    - resourceName: cpu
      restartPolicy: NotRequired
    - resourceName: memory
      restartPolicy: RestartContainer
```

* `NotRequired`: (기본값) 컨테이너를 재시작하지 않고 실행 중인 컨테이너에 리소스 변경을 적용한다.
* `RestartContainer`: 새로운 리소스 값을 적용하기 위해 컨테이너를 재시작한다. 많은 애플리케이션과 런타임이 메모리 할당을 동적으로 조정할 수 없기 때문에 메모리 변경 시 종종 필요하다.

리소스에 대해 `resizePolicy[*].restartPolicy`가 지정되지 않은 경우, 기본값은 `NotRequired`이다.

{{< note >}}
파드의 전체 `restartPolicy`가 `Never`인 경우, 모든 리소스에 대해 컨테이너 `resizePolicy`는 `NotRequired`여야 한다. 그런 파드에서는 재시작이 필요한 크기 조정 정책을 구성할 수 없다.
{{< /note >}}

**예시 시나리오:**

CPU에 대해 `restartPolicy: NotRequired`로, 메모리에 대해 `restartPolicy: RestartContainer`로 구성된 컨테이너를 고려해보자.
* CPU 리소스만 변경된 경우, 컨테이너는 제자리에서 크기가 조정된다.
* 메모리 리소스만 변경된 경우, 컨테이너가 재시작된다.
* CPU와 메모리 리소스가 *동시에* 변경된 경우, (메모리 정책으로 인해) 컨테이너가 재시작된다.

## 제한사항

쿠버네티스 {{< skew currentVersion >}}에서 파드 리소스의 제자리 크기 조정에는 다음 제한사항이 있다.

* **리소스 유형:** CPU와 메모리 리소스만 크기를 조정할 수 있다.
* **메모리 감소:** 메모리에 대한 `resizePolicy`가 `RestartContainer`가 아닌 경우 메모리 제한량을 *감소시킬 수 없다*. 메모리 요청량은 일반적으로 감소시킬 수 있다.
* **QoS 클래스:** 파드의 원래 [서비스 품질(QoS) 클래스](/docs/concepts/workloads/pods/pod-qos/)(Guaranteed, Burstable, 또는 BestEffort)는 생성 시 결정되며 크기 조정으로 **변경할 수 없다**. 크기 조정된 리소스 값은 여전히 원래 QoS 클래스의 규칙을 준수해야 한다.
    * *Guaranteed*: 크기 조정 후에도 CPU와 메모리 모두에 대해 요청량이 제한량과 계속 같아야 한다.
    * *Burstable*: CPU와 메모리 *모두*에 대해 요청량과 제한량이 동시에 같아질 수 없다(이는 Guaranteed로 변경될 것이므로).
    * *BestEffort*: 리소스 요구사항(`requests` 또는 `limits`)을 추가할 수 없다(이는 Burstable 또는 Guaranteed로 변경될 것이므로).
* **컨테이너 유형:** 재시작할 수 없는 {{< glossary_tooltip text="초기화 컨테이너" term_id="init-container" >}}와 {{< glossary_tooltip text="임시 컨테이너" term_id="ephemeral-container" >}}는 크기를 조정할 수 없다. [사이드카 컨테이너](/docs/concepts/workloads/pods/sidecar-containers/)는 크기를 조정할 수 있다.
* **리소스 제거:** 리소스 요청량과 제한량은 한 번 설정되면 완전히 제거할 수 없으며, 다른 값으로만 변경할 수 있다.
* **운영 체제:** Windows 파드는 제자리 크기 조정을 지원하지 않는다.
* **노드 정책:** [정적 CPU 또는 메모리 관리자 정책](/docs/tasks/administer-cluster/cpu-management-policies/)에 의해 관리되는 파드는 제자리에서 크기를 조정할 수 없다.
* **스왑:** [스왑 메모리](/ko/docs/concepts/architecture/nodes/#swap-memory)를 활용하는 파드는 메모리에 대한 `resizePolicy`가 `RestartContainer`가 아닌 경우 메모리 요청량을 크기 조정할 수 없다.

이러한 제한사항은 향후 쿠버네티스 버전에서 완화될 수 있다.

## 예시 1: 재시작 없는 CPU 크기 조정

먼저, 제자리 CPU 크기 조정과 재시작이 필요한 메모리 크기 조정을 위해 설계된 파드를 생성한다.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: resize-demo
spec:
  containers:
  - name: pause
    image: registry.k8s.io/pause:3.8
    resizePolicy:
    - resourceName: cpu
      restartPolicy: NotRequired
    - resourceName: memory
      restartPolicy: RestartContainer
    resources:
      limits:
        memory: "200Mi"
        cpu: "700m"
      requests:
        memory: "200Mi"
        cpu: "700m"
```

파드를 생성한다.

```shell
kubectl create -f pod-resize.yaml
```

이 파드는 Guaranteed QoS 클래스에서 시작된다. 초기 상태를 확인한다.

```shell
# 파드가 실행될 때까지 잠시 기다린다
kubectl get pod resize-demo --output=yaml
```

`spec.containers[0].resources`와 `status.containerStatuses[0].resources`를 관찰한다.
이들은 매니페스트와 일치해야 한다(700m CPU, 200Mi 메모리). `status.containerStatuses[0].restartCount`를 확인한다(0이어야 함).

이제 CPU 요청량과 제한량을 `800m`로 증가시킨다. `--subresource resize` 커맨드라인 인수와 함께 `kubectl patch`를 사용한다.

```shell
kubectl patch pod resize-demo --subresource resize --patch \
  '{"spec":{"containers":[{"name":"pause", "resources":{"requests":{"cpu":"800m"}, "limits":{"cpu":"800m"}}}]}}'

# 대안적 방법들:
# kubectl edit pod resize-demo --subresource resize
# kubectl apply -f <수정된-매니페스트> --subresource resize
```

{{< note >}}
`--subresource resize` 커맨드라인 인수는 `kubectl` 클라이언트 버전 v1.32.0 이상이 필요하다. 이전 버전은 `invalid subresource` 오류를 보고한다.
{{< /note >}}

패치 후 파드 상태를 다시 확인한다.

```shell
kubectl get pod resize-demo --output=yaml
```

다음을 확인할 수 있어야 한다.
* `spec.containers[0].resources`는 이제 `cpu: 800m`를 보여준다.
* `status.containerStatuses[0].resources`도 `cpu: 800m`를 보여주며, 노드에서 크기 조정이 성공했음을 나타낸다.
* `status.containerStatuses[0].restartCount`는 `0`으로 유지된다. CPU `resizePolicy`가 `NotRequired`였기 때문이다.

## 예시 2: 재시작이 있는 메모리 크기 조정

이제 *동일한* 파드의 메모리를 `300Mi`로 증가시켜 크기를 조정한다.
메모리 `resizePolicy`가 `RestartContainer`이므로 컨테이너가 재시작될 것으로 예상된다.

```shell
kubectl patch pod resize-demo --subresource resize --patch \
  '{"spec":{"containers":[{"name":"pause", "resources":{"requests":{"memory":"300Mi"}, "limits":{"memory":"300Mi"}}}]}}'
```

패치 직후 파드 상태를 확인한다.

```shell
kubectl get pod resize-demo --output=yaml
```

이제 다음을 관찰할 수 있어야 한다.
* `spec.containers[0].resources`는 `memory: 300Mi`를 보여준다.
* `status.containerStatuses[0].resources`도 `memory: 300Mi`를 보여준다.
* `status.containerStatuses[0].restartCount`가 `1`로 증가했다(또는 이전에 재시작이 발생했다면 더 많이),
  메모리 변경을 적용하기 위해 컨테이너가 재시작되었음을 나타낸다.

## 문제 해결: 실행 불가능한 크기 조정 요청

다음으로, 노드 용량을 초과할 가능성이 높은 1000개의 전체 코어("1000m" 밀리코어 대신 `"1000"`으로 작성)와 같은 비합리적인 양의 CPU를 요청해 본다.

```shell
# 과도하게 큰 CPU 요청으로 패치 시도
kubectl patch pod resize-demo --subresource resize --patch \
  '{"spec":{"containers":[{"name":"pause", "resources":{"requests":{"cpu":"1000"}, "limits":{"cpu":"1000"}}}]}}'
```

파드의 세부사항을 조회한다.

```shell
kubectl get pod resize-demo --output=yaml
```

문제를 나타내는 변경사항을 확인할 수 있다.

* `spec.containers[0].resources`는 *원하는* 상태(`cpu: "1000"`)를 반영한다.
* `type: PodResizePending`과 `reason: Infeasible`이 있는 조건이 파드에 추가되었다.
* 조건의 `message`는 이유를 설명한다(`Node didn't have enough capacity: cpu, requested: 800000, capacity: ...`).
* 중요한 것은, 실행 불가능한 크기 조정이 kubelet에 의해 적용되지 않았기 때문에 `status.containerStatuses[0].resources`는 *여전히 이전 값*(`cpu: 800m`, `memory: 300Mi`)을 보여준다는 것이다.
* 이 실패한 시도로 인해 `restartCount`는 변경되지 않는다.

이를 해결하려면 실행 가능한 리소스 값으로 파드를 다시 패치해야 한다.

## 정리

파드를 삭제한다.

```shell
kubectl delete pod resize-demo
```

## {{% heading "whatsnext" %}}

### 애플리케이션 개발자를 위한 추가 자료

* [컨테이너와 파드에 메모리 리소스 할당](/ko/docs/tasks/configure-pod-container/assign-memory-resource/)
* [컨테이너와 파드에 CPU 리소스 할당](/ko/docs/tasks/configure-pod-container/assign-cpu-resource/)
* [파드 수준 CPU 및 메모리 리소스 할당](/docs/tasks/configure-pod-container/assign-pod-level-resources/)

### 클러스터 관리자를 위한 추가 자료

* [네임스페이스에 기본 메모리 요청량과 제한량 구성](/ko/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)
* [네임스페이스에 기본 CPU 요청량과 제한량 구성](/ko/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/)
* [네임스페이스에 최소 및 최대 메모리 제약 조건 구성](/ko/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)
* [네임스페이스에 최소 및 최대 CPU 제약 조건 구성](/ko/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)
* [네임스페이스에 메모리 및 CPU 쿼터 구성](/ko/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/)
