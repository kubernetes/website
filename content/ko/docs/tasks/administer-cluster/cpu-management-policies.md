---
title: 노드에서 CPU 관리 정책 제어하기
reviewers:
-
-
-

content_type: task
min-kubernetes-server-version: v1.26
weight: 140
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.26" state="stable" >}}

쿠버네티스는 파드가 노드에서 실행되는 방식의 여러 측면을
사용자로부터 추상화한다. 이는 의도된 설계이다. 하지만 일부 워크로드는
만족스럽게 동작하려면 지연 시간이나 성능 측면에서 더 강력한 보장을
필요로 한다. kubelet은 명시적인 배치 지시 사항으로부터 자유로운 추상화를
유지하면서도 더 복잡한 워크로드 배치 정책을 활성화할 수 있는 방법을
제공한다.

리소스 관리에 대한 자세한 내용은
[파드 및 컨테이너 리소스 관리](/docs/concepts/configuration/manage-resources-containers)
문서를 참고한다.

kubelet이 리소스 관리를 구현하는 방식에 대한 자세한 내용은
[노드 리소스 매니저](/docs/concepts/policy/node-resource-managers) 문서를 참고한다.

## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

이전 버전의 쿠버네티스를 사용하고 있다면, 실제로 사용 중인 버전에 해당하는 문서를 참고한다.


<!-- steps -->

## CPU 관리 정책 구성

kubelet은 기본적으로 파드의 CPU 제한을 강제하기 위해 [CFS 쿼터](https://en.wikipedia.org/wiki/Completely_Fair_Scheduler)를
사용한다. 노드에서 CPU 바운드(CPU-bound) 파드가 많이 실행되면,
파드가 쓰로틀(throttle)되었는지와 스케줄링 시점에 어떤 CPU 코어를
사용할 수 있는지에 따라 워크로드가 다른 CPU 코어로 옮겨갈 수
있다. 대부분의 워크로드는 이러한 이동에 민감하지 않으므로
별도 개입 없이도 잘 동작한다.

하지만 CPU 캐시 어피니티와 스케줄링 지연 시간이 워크로드 성능에
큰 영향을 미치는 워크로드의 경우, kubelet은 노드에서 일부 배치 선호도를
결정할 수 있는 대체 CPU 관리 정책을 허용한다.

## 윈도우 지원

{{< feature-state feature_gate_name="WindowsCPUAndMemoryAffinity" >}}

`WindowsCPUAndMemoryAffinity` 기능 게이트(feature gate)를 사용하면 윈도우에서도 CPU 매니저 지원을
활성화할 수 있으며, 이 경우 컨테이너 런타임의 지원이 필요하다.
기능 게이트가 활성화되면, 아래 단계에 따라 [CPU 매니저 정책](#구성)을 구성한다.

## 구성

CPU 매니저 정책은 `--cpu-manager-policy` kubelet
플래그 또는 [KubeletConfiguration](/docs/reference/config-api/kubelet-config.v1beta1/)의 `cpuManagerPolicy` 필드로 설정한다.
지원되는 정책은 두 가지이다.

* [`none`](#none-policy)은 기본 정책이다.
* [`static`](#static-policy)은 특정 리소스 특성을 가진 파드가 노드에서 더 높은 CPU 어피니티와
  독점성(exclusivity)을 부여받을 수 있도록 허용한다.

CPU 매니저는 메모리 상의 CPU 할당을 cgroupfs와 조정하기 위해
CRI를 통해 주기적으로 리소스 업데이트를 기록한다. 조정
주기는 새로운 Kubelet 구성 값인
`--cpu-manager-reconcile-period`로 설정한다. 지정하지 않으면
`--node-status-update-frequency`와 동일한 기간이 기본값으로 사용한다.

static 정책의 동작은 `--cpu-manager-policy-options` 플래그를 사용하여 세밀하게 조정할 수 있다.
이 플래그는 쉼표로 구분된 `key=value` 정책 옵션 목록을 받는다.
`CPUManagerPolicyOptions`
[기능 게이트](/docs/reference/command-line-tools-reference/feature-gates/)를 비활성화하면
CPU 매니저 정책을 세밀하게 조정할 수 없다. 이 경우 CPU 매니저는
오직 기본 설정만으로 동작한다.

정책 옵션은 최상위 `CPUManagerPolicyOptions` 기능 게이트 외에도 알파 품질(기본적으로
숨김)과 베타 품질(기본적으로 표시) 두 그룹으로 나뉜다.
이 그룹들은 각각 `CPUManagerPolicyAlphaOptions`와
`CPUManagerPolicyBetaOptions` 기능 게이트로 보호된다. 쿠버네티스의 표준 방식과 달리,
이 기능 게이트들은 각각 옵션에 기능 게이트를 추가하는 것이 너무 번거롭기 때문에
옵션 그룹 단위로 보호한다.

## CPU 매니저 정책 변경

CPU 매니저 정책은 kubelet이 새 파드를 생성할 때만 적용될 수 있으므로, 단순히 설정을 "none"에서
"static"으로 변경한다고 해서 정책이 기존 파드에 적용되지 않는다. 따라서 노드에서 CPU 매니저
정책을 올바르게 변경하려면 다음 단계를 수행해야 한다.

1. 노드를 [드레인(drain)](/docs/tasks/administer-cluster/safely-drain-node)한다.
2. kubelet을 중지한다.
3. 기존 CPU 매니저 상태 파일을 삭제한다. 이 파일의 기본 경로는
`/var/lib/kubelet/cpu_manager_state`이다. 이렇게 하면 CPU 매니저가 유지하던 상태가
지워져서, 새 정책으로 설정된 cpu-set이 기존 상태와 충돌하지 않는다.
4. kubelet 구성을 편집하여 CPU 매니저 정책을 원하는 값으로 변경한다.
5. kubelet을 시작한다.

CPU 매니저 정책을 변경해야 하는 모든 노드에 대해 이 과정을 반복한다. 이 과정을 건너뛰면
다음과 같은 오류로 kubelet이 크래시루프(crashloop)에 빠지게 된다.

```
could not restore state from checkpoint: configured policy "static" differs from state checkpoint policy "none", please drain this node and delete the CPU manager checkpoint file "/var/lib/kubelet/cpu_manager_state" before restarting Kubelet
```

{{< note >}}
노드에서 온라인 CPU 집합이 변경되면, kubelet 루트 디렉터리에 있는 상태 파일 `cpu_manager_state`를
삭제하여 노드를 드레인하고 CPU 매니저를 수동으로 재설정해야 한다.
{{< /note >}}

### `none` 정책 구성

이 정책에는 추가 구성 항목이 없다.

### `static` 정책 구성

이 정책은 처음에 노드의 모든 CPU를
포함하는 공유 풀(shared pool)을 관리한다. 독점적으로 할당 가능한 CPU의 양은 노드의
전체 CPU 수에서 kubelet의 `--kube-reserved` 또는
`--system-reserved` 옵션으로 예약된 CPU를 뺀 값과 같다. 1.17부터는
kubelet의 `--reserved-cpus` 옵션으로 CPU 예약 목록을 명시적으로 지정할 수
있다. `--reserved-cpus`로 지정한 명시적 CPU 목록은 `--kube-reserved` 및
`--system-reserved`로 지정한 CPU 예약보다 우선 적용된다. 이 옵션들로
예약된 CPU는 정수 단위로, 물리 코어 ID의 오름차순에 따라 초기 공유 풀에서
가져온다. 이 공유 풀은 `BestEffort`와 `Burstable` 파드의 모든 컨테이너가
실행되는 CPU 집합이다. 소수 단위의 CPU `requests`를 갖는 `Guaranteed`
파드의 컨테이너도 공유 풀의 CPU에서 실행된다.
`Guaranteed` 파드에 속하면서 정수 단위의 CPU `requests`를 갖는 컨테이너만
독점 CPU를 할당받는다.

{{< note >}}
kubelet은 static 정책이 활성화된 경우
`--kube-reserved`, `--system-reserved`, `--reserved-cpus` 중 하나 이상의 옵션을 사용하여
0보다 큰 CPU 예약을 설정할 것을 요구한다. CPU 예약이 0이면 공유
풀이 비어버릴 수 있기 때문이다.
{{< /note >}}

### static 정책 옵션 {#cpu-policy-static--options}

다음 기능 게이트를 사용하여 옵션 그룹을 성숙도 수준에 따라
켜고 끌 수 있다.
* `CPUManagerPolicyBetaOptions`는 기본적으로 활성화되어 있다. 베타 수준 옵션을 숨기려면 비활성화한다.
* `CPUManagerPolicyAlphaOptions`는 기본적으로 비활성화되어 있다. 알파 수준 옵션을 표시하려면 활성화하한다.
각 옵션은 `CPUManagerPolicyOptions` kubelet 옵션으로도 활성화해야 한다.

static `CPUManager` 정책에는 다음과 같은 정책 옵션이 있다.
* `full-pcpus-only`(GA, 기본적으로 표시) (1.33 이상)
* `distribute-cpus-across-numa`(베타, 기본적으로 표시) (1.33 이상)
* `align-by-socket`(알파, 기본적으로 숨김) (1.25 이상)
* `distribute-cpus-across-cores`(알파, 기본적으로 숨김) (1.31 이상)
* `strict-cpu-reservation`(GA, 기본적으로 표시) (1.35 이상)
* `prefer-align-cpus-by-uncorecache`(GA, 기본적으로 표시) (1.36 이상)

`full-pcpus-only` 옵션은 CPUManager 정책 옵션에
`full-pcpus-only=true`를 추가하여 활성화할 수 있다.
마찬가지로 `distribute-cpus-across-numa` 옵션은 CPUManager 정책 옵션에
`distribute-cpus-across-numa=true`를 추가하여 활성화할 수 있다.
둘 다 설정하면, 개별 코어 단위가 아니라 full-pcpu 단위로 CPU가
NUMA 노드에 분산된다는 의미에서
"합산(additive)" 방식으로 적용된다.
`align-by-socket` 정책 옵션은 `CPUManager` 정책 옵션에
`align-by-socket=true`를 추가하여 활성화할 수 있다. 이 옵션도 `full-pcpus-only`
및 `distribute-cpus-across-numa` 정책 옵션에 합산 적용된다.

`distribute-cpus-across-cores` 옵션은 `CPUManager` 정책 옵션에
`distribute-cpus-across-cores=true`를 추가하여 활성화할 수 있다.
현재는 `full-pcpus-only` 또는 `distribute-cpus-across-numa` 정책 옵션과
함께 사용할 수 없다.

`strict-cpu-reservation` 옵션은 CPUManager 정책 옵션에 `strict-cpu-reservation=true`를 추가한 뒤,
`/var/lib/kubelet/cpu_manager_state` 파일을 삭제하고 kubelet을 재시작하면 활성화할 수 있다.

`prefer-align-cpus-by-uncorecache` 옵션은 `CPUManager` 정책 옵션에
`prefer-align-cpus-by-uncorecache`를 추가하여 활성화할 수 있다. 호환되지 않는
옵션을 함께 사용하면, kubelet이 시작에 실패하며 로그에 오류의 설명이
표시된다.

구성할 수 있는 개별 옵션 동작에 대한 자세한 내용은
[노드 리소스 매니저](/docs/concepts/policy/node-resource-managers) 문서를 참고한다.

## {{% heading "whatsnext" %}}

* [파드 수준 리소스 매니저](/docs/concepts/workloads/resource-managers/#pod-level-resource-managers)에 대해 알아본다.
