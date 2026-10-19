---
title: 파드 및 컨테이너 리소스 관리
content_type: concept
weight: 40
feature:
  title: 자동 빈 패킹(bin packing)
  description: >
    리소스 요구 사항과 기타 제약 조건에 따라 컨테이너를 자동으로 배치하지만, 가용성은 그대로 유지한다. 
    활용도를 높이고 더 많은 리소스를 절약하기 위해 중요한(critical) 워크로드와 최선의(best-effort) 워크로드를 혼합한다.
---

<!-- overview -->

{{< glossary_tooltip text="파드" term_id="pod" >}}를 지정할 때,
{{< glossary_tooltip text="컨테이너" term_id="container" >}}에 필요한 각 리소스의 양을 선택적으로 지정할 수 있다.
지정할 가장 일반적인 리소스는 CPU와 메모리(RAM) 그리고 다른 것들이 있다.

파드에서 컨테이너에 대한 리소스 _요청(request)_ 을 지정하면, 
{{< glossary_tooltip text="kube-scheduler" term_id="kube-scheduler" >}}는 이 정보를
사용하여 파드가 배치될 노드를 결정한다. 컨테이너에 대한 리소스 _제한(limit)_ 을
지정하면, kubelet은 실행 중인 컨테이너가 설정한 제한보다 많은 리소스를
사용할 수 없도록 해당 제한을 적용한다. 또한 kubelet은
컨테이너가 사용할 수 있도록 해당 시스템 리소스의 최소 _요청_ 량을
예약한다.

<!-- body -->

## 요청 및 제한

파드가 실행 중인 노드에 사용 가능한 리소스가 충분하면, 컨테이너가 해당
리소스에 지정한 `request` 보다 더 많은 리소스를 사용할 수 있도록 허용된다.
그러나, 컨테이너는 리소스 `limit` 보다 더 많은 리소스를 사용할 수는 없다.

예를 들어, 컨테이너에 대해 256MiB의 `memory` 요청을 설정하고, 해당 컨테이너가
8GiB의 메모리를 가진 노드로 스케줄된 파드에 있고 다른 파드는 없는 경우, 컨테이너는 더 많은 RAM을
사용할 수 있다.

해당 컨테이너에 대해 4GiB의 `memory` 제한을 설정하면, kubelet(그리고
{{< glossary_tooltip text="컨테이너 런타임" term_id="container-runtime" >}})이 제한을 적용한다.
런타임은 컨테이너가 구성된 리소스 제한을 초과하여 사용하지 못하게 한다. 예를 들어,
컨테이너의 프로세스가 허용된 양보다 많은 메모리를 사용하려고 하면,
시스템 커널은 메모리 부족(out of memory, OOM) 오류와 함께 할당을 시도한 프로세스를
종료한다.

제한은 반응적(시스템이 위반을 감지한 후에 개입)으로
또는 강제적(시스템이 컨테이너가 제한을 초과하지 않도록 방지)으로 구현할 수 있다. 런타임마다
다른 방식으로 동일한 제약을 구현할 수 있다.

{{< note >}}
리소스에 대해 제한은 지정하지만 요청은 지정하지 않고, 
해당 리소스에 대한 요청 기본값을 지정하는 승인-시점 메커니즘(admission-time mechanism)이 없는 경우, 
쿠버네티스는 당신이 지정한 제한을 복사하여 해당 리소스의 요청 값으로 사용한다.
{{< /note >}}

## 리소스 타입

*CPU* 와 *메모리* 는 각각 *리소스 타입* 이다. 리소스 타입에는 기본 단위가 있다.
CPU는 컴퓨팅 처리를 나타내며 [쿠버네티스 CPU](#cpu의-의미) 단위로 지정된다.
메모리는 바이트 단위로 지정된다.
리눅스 워크로드에 대해서는, _huge page_ 리소스를 지정할 수 있다.
Huge page는 노드 커널이 기본 페이지 크기보다 훨씬 큰 메모리
블록을 할당하는 리눅스 관련 기능이다.

예를 들어, 기본 페이지 크기가 4KiB인 시스템에서, `hugepages-2Mi: 80Mi` 제한을
지정할 수 있다. 컨테이너가 40개 이상의 2MiB huge page(총 80MiB)를
할당하려고 하면 해당 할당이 실패한다.

{{< note >}}
`hugepages-*` 리소스를 오버커밋할 수 없다.
이것은 `memory` 및 `cpu` 리소스와는 다르다.
{{< /note >}}

CPU와 메모리를 통칭하여 *컴퓨트 리소스* 또는 *리소스* 라고 한다. 컴퓨트
리소스는 요청, 할당 및 소비될 수 있는 측정 가능한
수량이다. 이것은
[API 리소스](/ko/docs/concepts/overview/kubernetes-api/)와는 다르다. 파드 및
[서비스](/ko/docs/concepts/services-networking/service/)와 같은 API 리소스는
쿠버네티스 API 서버를 통해 읽고 수정할 수 있는 오브젝트이다.

## 파드와 컨테이너의 리소스 요청 및 제한

각 컨테이너에 대해, 다음과 같은 
리소스 제한(limit) 및 요청(request)을 지정할 수 있다.

* `spec.containers[].resources.limits.cpu`
* `spec.containers[].resources.limits.memory`
* `spec.containers[].resources.limits.hugepages-<size>`
* `spec.containers[].resources.requests.cpu`
* `spec.containers[].resources.requests.memory`
* `spec.containers[].resources.requests.hugepages-<size>`

요청 및 제한은 개별 컨테이너에 대해서만 지정할 수 있지만, 
한 파드의 총 리소스 요청 및 제한에 대해 생각해 보는 것도 
유용할 수 있다.
특정 리소스 종류에 대해, *파드 리소스 요청/제한* 은 파드의 각 컨테이너에 대한
해당 타입의 리소스 요청/제한의 합이다.

## 쿠버네티스의 리소스 단위

### CPU 리소스 단위 {#meaning-of-cpu}

CPU 리소스에 대한 제한 및 요청은 *cpu* 단위로 측정된다.
쿠버네티스에서, 1 CPU 단위는 노드가 물리 호스트인지 
아니면 물리 호스트 내에서 실행되는 가상 머신인지에 따라 
**1 물리 CPU 코어** 또는 **1 가상 코어** 에 해당한다.

요청량을 소수점 형태로 명시할 수도 있다. 컨테이너의 
`spec.containers[].resources.requests.cpu`를 `0.5`로 설정한다는 것은, 
`1.0` CPU를 요청했을 때와 비교하여 절반의 CPU 타임을 요청한다는 의미이다. 
CPU 자원의 단위와 관련하여, `0.1` 이라는 [수량](/docs/reference/kubernetes-api/common-definitions/quantity/) 표현은
"백 밀리cpu"로 읽을 수 있는 `100m` 표현과 동일하다. 어떤 사람들은
"백 밀리코어"라고 말하는데, 같은 것을 의미하는 것으로 이해된다.

CPU 리소스는 항상 리소스의 절대량으로 표시되며, 상대량으로 표시되지 않는다. 
예를 들어, 컨테이너가 싱글 코어, 듀얼 코어, 또는 48 코어 머신 중 어디에서 실행되는지와 상관없이 
`500m` CPU는 거의 같은 양의 컴퓨팅 파워를 가리킨다.

{{< note >}}
쿠버네티스에서 CPU 리소스를 `1m`보다 더 정밀한 단위로 표기할 수 없다. 
이 때문에, CPU 단위를 `1.0` 또는 `1000m`보다 작은 밀리CPU 형태로 표기하는 것이 유용하다. 
예를 들어, `0.005` 보다는 `5m`으로 표기하는 것이 좋다.
{{< /note >}}

### 메모리 리소스 단위 {#meaning-of-memory}

`memory` 에 대한 제한 및 요청은 바이트 단위로 측정된다.
E, P, T, G, M, k 와 같은 
[수량](/docs/reference/kubernetes-api/common-definitions/quantity/) 접미사 중 하나를 사용하여 메모리를
일반 정수 또는 고정 소수점 숫자로 표현할 수 있다. Ei, Pi, Ti, Gi, Mi, Ki와
같은 2의 거듭제곱을 사용할 수도 있다. 예를 들어, 다음은 대략 동일한 값을 나타낸다.

```shell
128974848, 129e6, 129M, 128974848000m, 123Mi
```

접미사의 대소문자에 유의한다. 
`400m`의 메모리를 요청하면, 이는 0.4 바이트를 요청한 것이다. 
이 사람은 아마도 400 메비바이트(mebibytes) (`400Mi`) 또는 400 메가바이트 (`400M`) 를 요청하고 싶었을 것이다.

## 컨테이너 리소스 예제 {#example-1}

다음 파드는 두 컨테이너로 구성된다. 
각 컨테이너는 0.25 CPU와 64 MiB(2<sup>26</sup> 바이트) 메모리 요청을 갖도록 정의되어 있다. 
또한 각 컨테이너는 0.5 CPU와 128 MiB 메모리 제한을 갖는다. 
이 경우 파드는 0.5 CPU와 128 MiB 메모리 요청을 가지며, 
1 CPU와 256 MiB 메모리 제한을 갖는다.

```yaml
---
apiVersion: v1
kind: Pod
metadata:
  name: frontend
spec:
  containers:
  - name: app
    image: images.my-company.example/app:v4
    resources:
      requests:
        memory: "64Mi"
        cpu: "250m"
      limits:
        memory: "128Mi"
        cpu: "500m"
  - name: log-aggregator
    image: images.my-company.example/log-aggregator:v6
    resources:
      requests:
        memory: "64Mi"
        cpu: "250m"
      limits:
        memory: "128Mi"
        cpu: "500m"
```

## 리소스 요청이 포함된 파드를 스케줄링하는 방법

파드를 생성할 때, 쿠버네티스 스케줄러는 파드를 실행할 노드를
선택한다. 각 노드는 파드에 제공할 수 있는 CPU와 메모리 양과 같은 각 리소스 타입에 대해
최대 용량을 갖는다. 스케줄러는 각 리소스 타입마다
스케줄된 컨테이너의 리소스 요청 합계가
노드 용량보다 작도록 한다. 
참고로 노드의 실제 메모리나
CPU 리소스 사용량은 매우 적지만, 용량 확인에 실패한 경우
스케줄러는 여전히 노드에 파드를 배치하지 않는다. 이는 리소스 사용량이
나중에 증가할 때, 예를 들어, 일일 요청 비율이
최대일 때 노드의 리소스 부족을 방지한다.

## 쿠버네티스가 리소스 요청 및 제한을 적용하는 방법 {#how-pods-with-resource-limits-are-run}

kubelet이 파드의 컨테이너를 시작할 때, 
kubelet은 해당 컨테이너의 메모리/CPU 요청 및 제한을 컨테이너 런타임에 전달한다.

리눅스에서, 일반적으로 컨테이너 런타임은 
적용될 커널 {{< glossary_tooltip text="cgroup" term_id="cgroup" >}}을 설정하고, 
명시한 제한을 적용한다.

- CPU 제한은 해당 컨테이너가 사용할 수 있는 CPU 시간에 대한 강한 상한(hard ceiling)을 정의한다.
  각 스케줄링 간격(시간 조각)마다, 리눅스 커널은 이 제한이 초과되었는지를 확인하고, 
  만약 초과되었다면 cgroup의 실행 재개를 허가하지 않고 기다린다.
- CPU 요청은 일반적으로 가중치 설정(weighting)을 정의한다. 
  현재 부하율이 높은 시스템에서 여러 개의 컨테이너(cgroup)가 실행되어야 하는 경우, 
  큰 CPU 요청값을 갖는 워크로드가 작은 CPU 요청값을 갖는 워크로드보다 더 많은 CPU 시간을 할당받는다.
- 메모리 요청은 주로 (쿠버네티스) 파드 스케줄링 과정에서 사용된다. 
  cgroup v2를 사용하는 노드에서, 컨테이너 런타임은 메모리 요청을 힌트로 사용하여 
  `memory.min` 및 `memory.low`을 설정할 수 있다.
- 메모리 제한은 해당 cgroup에 대한 메모리 사용량 상한을 정의한다. 
  컨테이너가 제한보다 더 많은 메모리를 할당받으려고 시도하면, 
  리눅스 커널의 메모리 부족(out-of-memory) 서브시스템이 활성화되고 
  (일반적으로) 개입하여 메모리를 할당받으려고 했던 컨테이너의 프로세스 중 하나를 종료한다. 
  해당 프로세스의 PID가 1이고, 컨테이너가 재시작 가능(restartable)으로 표시되어 있으면, 쿠버네티스가 해당 컨테이너를 재시작한다.
- 파드 또는 컨테이너의 메모리 제한은 메모리 기반 볼륨(예: `emptyDir`)의 페이지에도 적용될 수 있다. 
  kubelet은 `tmpfs` emptyDir 볼륨을 로컬 임시(ephemeral) 스토리지가 아닌 
  컨테이너 메모리 사용으로 간주하여 추적한다.

한 컨테이너가 메모리 요청을 초과하고 
해당 노드의 메모리가 부족하지면, 
해당 컨테이너가 속한 파드가 {{< glossary_tooltip text="축출" term_id="eviction" >}}될 수 있다.

컨테이너가 비교적 긴 시간 동안 CPU 제한을 초과하는 것이 허용될 수도, 허용되지 않을 수도 있다.
그러나, 컨테이너 런타임은 과도한 CPU 사용률을 이유로 파드 또는 컨테이너를 종료시키지는 않는다.

리소스 제한으로 인해 컨테이너를 스케줄할 수 없는지 또는 종료 중인지 확인하려면,
[문제 해결](#문제-해결) 섹션을 참조한다.

### 컴퓨트 및 메모리 리소스 사용량 모니터링

kubelet은 파드의 리소스 사용량을 파드 
[`status`](/ko/docs/concepts/overview/working-with-objects/kubernetes-objects/#오브젝트-명세-spec-와-상태-status)에 포함하여 보고한다.

클러스터에서 선택적인 [모니터링 도구](/ko/docs/tasks/debug/debug-cluster/resource-usage-monitoring/)를
사용할 수 있다면, [메트릭 API](/ko/docs/tasks/debug/debug-cluster/resource-metrics-pipeline/#metrics-api)에서
직접 또는 모니터링 도구에서 파드 리소스
사용량을 검색할 수 있다.

## 로컬 임시(ephemeral) 스토리지

<!-- feature gate LocalStorageCapacityIsolation -->
{{< feature-state for_k8s_version="v1.25" state="stable" >}}

노드에는 로컬에 연결된 쓰기 가능 장치 또는, 때로는 RAM에 의해
지원되는 로컬 임시 스토리지가 있다.
"임시"는 내구성에 대한 장기간의 보증이 없음을 의미한다.

파드는 스크래치 공간, 캐싱 및 로그에 대해 임시 로컬 스토리지를 사용한다.
kubelet은 로컬 임시 스토리지를 사용하여 컨테이너에
[`emptyDir`](/ko/docs/concepts/storage/volumes/#emptydir)
{{< glossary_tooltip term_id="volume" text="볼륨" >}}을 마운트하기 위해 파드에 스크래치 공간을 제공할 수 있다.

kubelet은 이러한 종류의 스토리지를 사용하여
[노드-레벨 컨테이너 로그](/ko/docs/concepts/cluster-administration/logging/#노드-레벨에서의-로깅),
컨테이너 이미지 및 실행 중인 컨테이너의 쓰기 가능 계층을 보유한다.

{{< caution >}}
노드가 실패하면, 임시 스토리지의 데이터가 손실될 수 있다.
애플리케이션은 로컬 임시 스토리지에서 성능에 대한 SLA(예: 디스크 IOPS)를
기대할 수 없다.
{{< /caution >}}

베타 기능에서, 쿠버네티스는 파드가 사용할 수 있는 임시 로컬 스토리지의 양을
추적, 예약 및 제한할 수 있도록 해준다.

### 로컬 임시 스토리지 구성

쿠버네티스는 노드에서 로컬 임시 스토리지를 구성하는 두 가지 방법을 지원한다.
{{< tabs name="local_storage_configurations" >}}
{{% tab name="단일 파일시스템" %}}
이 구성에서, 모든 종류의 임시 로컬 데이터(`emptyDir` 볼륨,
쓰기 가능 계층, 컨테이너 이미지, 로그)를 하나의 파일시스템에 배치한다.
kubelet을 구성하는 가장 효과적인 방법은 이 파일시스템을 쿠버네티스(kubelet) 데이터 전용으로
하는 것이다.

kubelet은 또한
[노드-레벨 컨테이너 로그](/ko/docs/concepts/cluster-administration/logging/#노드-레벨에서의-로깅)를
작성하고 임시 로컬 스토리지와 유사하게 처리한다.

kubelet은 구성된 로그 디렉터리 내의 파일에 로그를 기록한다(기본적으로
`/var/log`). 그리고 로컬에 저장된 다른 데이터에 대한 기본 디렉터리가 있다(기본적으로
`/var/lib/kubelet`).

일반적으로, `/var/lib/kubelet` 와 `/var/log` 모두 시스템 루트 파일시스템에 위치하고,
그리고 kubelet은 이런 레이아웃을 염두에 두고 설계되었다.

노드는 쿠버네티스에서 사용하지 않는 다른 많은 파일시스템을
가질 수 있다.
{{% /tab %}}
{{% tab name="두 개의 파일시스템" %}}
사용하고 있는 노드에 실행 중인 파드에서 발생하는 임시 데이터를
위한 파일시스템을 가진다(로그와 `emptyDir` 볼륨). 이 파일시스템을
다른 데이터(예를 들어, 쿠버네티스와 관련없는 시스템 로그)를 위해 사용할 수 있다. 이 파일시스템은
루트 파일시스템일 수도 있다.

kubelet은 또한
[노드-레벨 컨테이너 로그](/ko/docs/concepts/cluster-administration/logging/#노드-레벨에서의-로깅)를
첫 번째 파일시스템에 기록하고, 임시 로컬 스토리지와 유사하게 처리한다.

또한 다른 논리 스토리지 장치가 지원하는 별도의 파일시스템을 사용한다.
이 구성에서, 컨테이너 이미지 계층과 쓰기 가능한 계층을 배치하도록
kubelet에 지시하는 디렉터리는 이 두 번째 파일시스템에 있다.

첫 번째 파일시스템에는 이미지 계층이나 쓰기 가능한 계층이 없다.

노드는 쿠버네티스에서 사용하지 않는 다른 많은 파일시스템을
가질 수 있다.
{{% /tab %}}
{{< /tabs >}}

kubelet은 사용 중인 로컬 스토리지 양을 측정할 수 있다.
임시 볼륨(ephemeral storage)을 설정하기 위해 지원되는 구성 중 하나를 사용하여
노드를 설정한 경우 제공된다.

다른 구성을 사용하는 경우, kubelet은 임시 로컬 스토리지에 대한 리소스
제한을 적용하지 않는다.

{{< note >}}
kubelet은 로컬 임시 스토리지가 아닌 컨테이너 메모리 사용으로
`tmpfs` emptyDir 볼륨을 추적한다.
{{< /note >}}

{{< note >}}
kubelet은 임시 스토리지을 위해 오직 루트 파일시스템만을 추적한다. `/var/lib/kubelet` 혹은 `/var/lib/containers`에 대해 별도의 디스크를 마운트하는 OS 레이아웃은 임시 스토리지를 정확하게 보고하지 않을 것이다.
{{< /note >}}

### 로컬 임시 스토리지에 대한 요청 및 제한 설정

`ephemeral-storage`를 명시하여 로컬 임시 저장소를 관리할 수 있다. 
파드의 각 컨테이너는 다음 중 하나 또는 모두를 명시할 수 있다.

* `spec.containers[].resources.limits.ephemeral-storage`
* `spec.containers[].resources.requests.ephemeral-storage`

`ephemeral-storage` 에 대한 제한 및 요청은 바이트 단위로 측정된다. 
E, P, T, G, M, k와 같은 접미사 중 하나를 사용하여 스토리지를 일반 정수 또는 고정 소수점 숫자로 표현할 수 있다.
Ei, Pi, Ti, Gi, Mi, Ki와 같은 2의 거듭제곱을 사용할 수도 있다.
예를 들어, 다음은 거의 동일한 값을 나타낸다.

- `128974848`
- `129e6`
- `129M`
- `123Mi`

접미사의 대소문자에 유의한다.
`400m`의 메모리를 요청하면, 이는 0.4 바이트를 요청한 것이다.
이 사람은 아마도 400 메비바이트(mebibytes) (`400Mi`) 또는 400 메가바이트 (`400M`) 를 요청하고 싶었을 것이다.

다음 예에서, 파드에 두 개의 컨테이너가 있다. 
각 컨테이너에는 2GiB의 로컬 임시 스토리지 요청이 있다. 
각 컨테이너에는 4GiB의 로컬 임시 스토리지 제한이 있다. 
따라서, 파드는 4GiB의 로컬 임시 스토리지 요청과 8GiB 로컬 임시 스토리지 제한을 가진다.
이 제한 중 500Mi까지는 `emptyDir` 볼륨에 의해 소진될 수 있다.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: frontend
spec:
  containers:
  - name: app
    image: images.my-company.example/app:v4
    resources:
      requests:
        ephemeral-storage: "2Gi"
      limits:
        ephemeral-storage: "4Gi"
    volumeMounts:
    - name: ephemeral
      mountPath: "/tmp"
  - name: log-aggregator
    image: images.my-company.example/log-aggregator:v6
    resources:
      requests:
        ephemeral-storage: "2Gi"
      limits:
        ephemeral-storage: "4Gi"
    volumeMounts:
    - name: ephemeral
      mountPath: "/tmp"
  volumes:
    - name: ephemeral
      emptyDir:
        sizeLimit: 500Mi
```

### `ephemeral-storage` 요청이 있는 파드의 스케줄링 방법

파드를 생성할 때, 쿠버네티스 스케줄러는 파드를 실행할 노드를 선택한다. 
각 노드에는 파드에 제공할 수 있는 최대 임시 스토리지 공간이 있다. 
자세한 정보는, 
[노드 할당 가능](/docs/tasks/administer-cluster/reserve-compute-resources/#node-allocatable)을 참조한다.

스케줄러는 스케줄된 컨테이너의 리소스 요청 합계가 노드 용량보다 작도록 한다.

### 임시 스토리지 소비 관리 {#resource-emphemeralstorage-consumption}

kubelet이 로컬 임시 스토리지를 리소스로 관리하는 경우,
kubelet은 다음에서 스토리지 사용을 측정한다.

- _tmpfs_ `emptyDir` 볼륨을 제외한 `emptyDir` 볼륨
- 노드-레벨 로그가 있는 디렉터리
- 쓰기 가능한 컨테이너 계층

허용하는 것보다 더 많은 임시 스토리지를 파드가 사용하는 경우, kubelet은
파드 축출을 트리거하는 축출 신호를 설정한다.

컨테이너-레벨 격리의 경우, 컨테이너의 쓰기 가능한 계층과 로그
사용량이 스토리지 제한을 초과하면, kubelet은 파드를 축출하도록 표시한다.

파드-레벨 격리에 대해 kubelet은 해당 파드의 컨테이너에 대한 제한을 합하여
전체 파드 스토리지 제한을 해결한다. 이 경우, 모든
컨테이너와 파드의 `emptyDir` 볼륨의 로컬 임시 스토리지 사용량 합계가
전체 파드 스토리지 제한을 초과하면, kubelet은 파드를 축출 대상으로
표시한다.

{{< caution >}}
kubelet이 로컬 임시 스토리지를 측정하지 않는 경우,
로컬 스토리지 제한을 초과하는 파드는 로컬 스토리지 리소스 제한을
위반해도 축출되지 않는다.

그러나, 쓰기 가능한 컨테이너 계층, 노드-레벨 로그
또는 `emptyDir` 볼륨의 파일 시스템 공간이 부족하면, 로컬
스토리지가 부족하다고 노드 자체에 {{< glossary_tooltip text="테인트" term_id="taint" >}}되고
이로인해 특별히 이 테인트를 허용하지 않는 모든 파드를 축출하도록 트리거한다.

임시 로컬 스토리지에 대해 지원되는 [구성](#로컬-임시-스토리지-구성)을
참조한다.
{{< /caution >}}

kubelet은 파드 스토리지 사용을 측정하는 다양한 방법을 지원한다.

{{< tabs name="resource-emphemeralstorage-measurement" >}}
{{% tab name="주기적 스캐닝" %}}
kubelet은 각 `emptyDir` 볼륨, 컨테이너 로그 디렉터리 및 쓰기 가능한 컨테이너 계층을
스캔하는 정기적인 스케줄 검사를 수행한다.

스캔은 사용된 공간의 양을 측정한다.

{{< note >}}
이 모드에서, kubelet은 삭제된 파일의 열린 파일 디스크립터를
추적하지 않는다.

여러분(또는 컨테이너)이 `emptyDir` 볼륨 안에 파일을 생성하면,
그 파일이 열리고, 파일이 열려있는 동안 파일을
삭제하면, 삭제된 파일의 inode는 해당 파일을 닫을 때까지
유지되지만 kubelet은 사용 중인 공간으로 분류하지 않는다.
{{< /note >}}
{{% /tab %}}
{{% tab name="파일시스템 프로젝트 쿼터" %}}

{{< feature-state for_k8s_version="v1.15" state="alpha" >}}

프로젝트 쿼터는 파일시스템에서 스토리지 사용을 관리하기 위한
운영체제 레벨의 기능이다. 쿠버네티스를 사용하면, 스토리지 사용을
모니터링하기 위해 프로젝트 쿼터를 사용할 수 있다. 노드에서 'emptyDir' 볼륨을
지원하는 파일시스템이 프로젝트 쿼터 지원을 제공하는지 확인한다.
예를 들어, XFS와 ext4fs는 프로젝트 쿼터를 지원한다.

{{< note >}}
프로젝트 쿼터를 통해 스토리지 사용을 모니터링할 수 있다. 이는 제한을 강제하지 않는다.
{{< /note >}}

쿠버네티스는 `1048576` 부터 프로젝트 ID를 사용한다. 사용 중인 ID는
`/etc/projects` 와 `/etc/projid` 에 등록되어 있다. 이 범위의 프로젝트 ID가
시스템에서 다른 목적으로 사용되는 경우, 쿠버네티스가
이를 사용하지 않도록 해당 프로젝트 ID를 `/etc/projects` 와 `/etc/projid` 에
등록해야 한다.

쿼터는 디렉터리 검색보다 빠르고 정확하다. 디렉터리가
프로젝트에 할당되면, 디렉터리 아래에 생성된
모든 파일이 해당 프로젝트에 생성되며, 커널은 해당 프로젝트의
파일에서 사용 중인 블록 수를 추적하기만 하면 된다.
파일이 생성되고 삭제되었지만, 열린 파일 디스크립터가 있으면,
계속 공간을 소비한다. 쿼터 추적은 공간을 정확하게 기록하는 반면
디렉터리 스캔은 삭제된 파일이 사용한 스토리지를 간과한다.

프로젝트 쿼터를 사용하려면, 다음을 수행해야 한다.

* [kubelet 구성](/docs/reference/config-api/kubelet-config.v1beta1/)의
  `featureGates` 필드 또는 `--feature-gates` 커맨드 라인 플래그를 사용하여
  `LocalStorageCapacityIsolationFSQuotaMonitoring=true`
  [기능 게이트](/ko/docs/reference/command-line-tools-reference/feature-gates/)를
  활성화한다.

* 루트 파일시스템(또는 선택적인 런타임 파일시스템)에
  프로젝트 쿼터가 활성화되어 있는지 확인한다. 모든 XFS 파일시스템은 프로젝트 쿼터를 지원한다.
  ext4 파일시스템의 경우, 파일시스템이 마운트되지 않은 상태에서 프로젝트 쿼터
  추적 기능을 활성화해야 한다.

  ```bash
  # ext4인 /dev/block-device가 마운트되지 않은 경우
  sudo tune2fs -O project -Q prjquota /dev/block-device
  ```

* 루트 파일시스템(또는 선택적인 런타임 파일시스템)은 프로젝트 쿼터를
  활성화한 상태에서 마운트해야 힌다. XFS와 ext4fs 모두에서,
  마운트 옵션의 이름은 `prjquota` 이다.

{{% /tab %}}
{{< /tabs >}}

## 확장된 리소스

확장된 리소스는 `kubernetes.io` 도메인 외부의 전체 주소(fully-qualified)
리소스 이름이다. 쿠버네티스에 내장되지 않은 리소스를 클러스터 운영자가 알리고
사용자는 사용할 수 있다.

확장된 리소스를 사용하려면 두 단계가 필요한다. 먼저, 클러스터
운영자는 확장된 리소스를 알려야 한다. 둘째, 사용자는 파드의
확장된 리소스를 요청해야 한다.

### 확장된 리소스 관리

#### 노드-레벨의 확장된 리소스

노드-레벨의 확장된 리소스는 노드에 연결된다.

##### 장치 플러그인 관리 리소스
각 노드에서
장치 플러그인 관리 리소스를 알리는 방법은
[장치 플러그인](/ko/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/)을 참조한다.

##### 기타 리소스

새로운 노드-레벨의 확장된 리소스를 알리기 위해, 클러스터 운영자는
API 서버에 `PATCH` HTTP 요청을 제출하여 클러스터의
노드에 대해 `status.capacity` 에서 사용할 수 있는 수량을 지정할 수 있다. 이 작업
후에는, 노드의 `status.capacity` 에 새로운 리소스가 포함된다. 이
`status.allocatable` 필드는 kubelet에 의해 비동기적으로 새로운
리소스로 자동 업데이트된다. 

스케줄러가 파드 적합성을 평가할 때 노드의 `status.allocatable` 값을 사용하므로, 
스케줄러는 해당 비동기 업데이트 이후의 새로운 값만을 고려한다. 
따라서 노드 용량을 새 리소스로 패치하는 시점과 
해당 자원을 요청하는 첫 파드가 해당 노드에 스케줄될 수 있는 시점 사이에 
약간의 지연이 있을 수 있다.

**예제:**

다음은 `curl` 을 사용하여 마스터가 `k8s-master` 인 노드 `k8s-node-1` 에
5개의 "example.com/foo" 리소스를 알리는 HTTP 요청을 구성하는 방법을
보여주는 예이다.

```shell
curl --header "Content-Type: application/json-patch+json" \
--request PATCH \
--data '[{"op": "add", "path": "/status/capacity/example.com~1foo", "value": "5"}]' \
http://k8s-master:8080/api/v1/nodes/k8s-node-1/status
```

{{< note >}}
앞의 요청에서, `~1` 은 패치 경로에서 문자 `/` 의
인코딩이다. JSON-Patch의 작업 경로 값은
JSON-Pointer로 해석된다. 더 자세한 내용은,
[IETF RFC 6901, 섹션 3](https://tools.ietf.org/html/rfc6901#section-3)을 참조한다.
{{< /note >}}

#### 클러스터-레벨의 확장된 리소스

클러스터-레벨의 확장된 리소스는 노드에 연결되지 않는다. 이들은 일반적으로
리소스 소비와 리소스 쿼터를 처리하는 스케줄러 익스텐더(extender)에 의해 관리된다.

[스케줄러 구성](/docs/reference/config-api/kube-scheduler-config.v1beta3/)에서
스케줄러 익스텐더가 처리하는 확장된 리소스를 지정할 수 있다.

**예제:**

스케줄러 정책에 대한 다음의 구성은 클러스터-레벨의 확장된 리소스
"example.com/foo"가 스케줄러 익스텐더에 의해 처리됨을
나타낸다.

- 파드가 "example.com/foo"를 요청하는 경우에만 스케줄러가 파드를 스케줄러
     익스텐더로 보낸다.
- 이 `ignoredByScheduler` 필드는 스케줄러가 `PodFitsResources` 속성에서
     "example.com/foo" 리소스를 확인하지 않도록 지정한다.

```json
{
  "kind": "Policy",
  "apiVersion": "v1",
  "extenders": [
    {
      "urlPrefix":"<extender-endpoint>",
      "bindVerb": "bind",
      "managedResources": [
        {
          "name": "example.com/foo",
          "ignoredByScheduler": true
        }
      ]
    }
  ]
}
```

### 확장된 리소스 소비

사용자는 CPU와 메모리 같은 파드 스펙의 확장된 리소스를 사용할 수 있다.
스케줄러는 리소스 어카운팅(resource accounting)을 관리하여 사용 가능한 양보다
많은 양의 리소스가 여러 파드에 동시에 할당되지 않도록 한다.

API 서버는 확장된 리소스의 수량을 정수로 제한한다.
_유효한_ 수량의 예로는 `3`, `3000m` 그리고 `3Ki` 를 들 수 있다. _유효하지 않은_
수량의 예는 `0.5` 와 `1500m` 이다.

{{< note >}}
확장된 리소스는 불명확한 정수 리소스를 대체한다.
사용자는 예약된 `kubernetes.io` 이외의 모든 도메인 이름 접두사를 사용할 수 있다.
{{< /note >}}

파드에서 확장된 리소스를 사용하려면, 컨테이너 사양에서 `spec.containers[].resources.limits`
맵에 리소스 이름을 키로 포함한다.

{{< note >}}
확장된 리소스는 오버커밋할 수 없으므로, 컨테이너 사양에
둘 다 있으면 요청과 제한이 동일해야 한다.
{{< /note >}}

파드는 CPU, 메모리 및 확장된 리소스를 포함하여 모든 리소스 요청이
충족되는 경우에만 예약된다. 리소스 요청을 충족할 수 없다면
파드는 `PENDING` 상태를 유지한다.

**예제:**

아래의 파드는 2개의 CPU와 1개의 "example.com/foo"(확장된 리소스)를 요청한다.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-pod
spec:
  containers:
  - name: my-container
    image: myimage
    resources:
      requests:
        cpu: 2
        example.com/foo: 1
      limits:
        example.com/foo: 1
```

## PID 제한

프로세스 ID(PID) 제한은 kubelet의 구성에 대해 
주어진 파드가 사용할 수 있는 PID 수를 제한할 수 있도록 허용한다. 
자세한 내용은 [PID 제한](/ko/docs/concepts/policy/pid-limiting/)을 참고한다.

## 문제 해결

### 내 파드가 `FailedScheduling` 이벤트 메시지로 보류 중이다

파드가 배치될 수 있는 노드를 스케줄러가 찾을 수 없으면, 
노드를 찾을 수 있을 때까지 파드는 스케줄되지 않은 상태로 유지한다. 
파드가 할당될 곳을 스케줄러가 찾지 못하면 
[Event](/docs/reference/kubernetes-api/cluster-resources/event-v1/)가 생성된다. 
다음과 같이 `kubectl`을 사용하여 파드의 이벤트를 볼 수 있다.

```shell
kubectl describe pod frontend | grep -A 9999999999 Events
```
```
Events:
  Type     Reason            Age   From               Message
  ----     ------            ----  ----               -------
  Warning  FailedScheduling  23s   default-scheduler  0/42 nodes available: insufficient cpu
```

위의 예에서, 모든 노드의 CPU 리소스가 충분하지 않아 이름이
"frontend"인 파드를 스케줄하지 못했다. 비슷한 메시지로
메모리 부족(PodExceedsFreeMemory)으로 인한 장애도 알릴 수 있다. 일반적으로, 파드가
이 타입의 메시지로 보류 중인 경우, 몇 가지 시도해 볼 것들이 있다.

- 클러스터에 더 많은 노드를 추가한다.
- 불필요한 파드를 종료하여 보류 중인 파드를 위한 공간을 확보한다.
- 파드가 모든 노드보다 크지 않은지 확인한다. 예를 들어, 모든
  노드의 용량이 `cpu: 1` 인 경우, `cpu: 1.1` 요청이 있는 파드는
  절대 스케줄되지 않는다.
- 노드 테인트를 확인한다. 
  대부분의 노드에 테인트가 걸려 있고, 신규 파드가 해당 테인트에 배척된다면, 
  스케줄러는 해당 테인트가 걸려 있지 않은 나머지 노드에만 배치를 고려할 것이다.

`kubectl describe nodes` 명령으로 노드 용량과 할당된 양을
확인할 수 있다. 예를 들면, 다음과 같다.

```shell
kubectl describe nodes e2e-test-node-pool-4lw4
```
```
Name:            e2e-test-node-pool-4lw4
[ ... 명확하게 하기 위해 라인들을 제거함 ...]
Capacity:
 cpu:                               2
 memory:                            7679792Ki
 pods:                              110
Allocatable:
 cpu:                               1800m
 memory:                            7474992Ki
 pods:                              110
[ ... 명확하게 하기 위해 라인들을 제거함 ...]
Non-terminated Pods:        (5 in total)
  Namespace    Name                                  CPU Requests  CPU Limits  Memory Requests  Memory Limits
  ---------    ----                                  ------------  ----------  ---------------  -------------
  kube-system  fluentd-gcp-v1.38-28bv1               100m (5%)     0 (0%)      200Mi (2%)       200Mi (2%)
  kube-system  kube-dns-3297075139-61lj3             260m (13%)    0 (0%)      100Mi (1%)       170Mi (2%)
  kube-system  kube-proxy-e2e-test-...               100m (5%)     0 (0%)      0 (0%)           0 (0%)
  kube-system  monitoring-influxdb-grafana-v4-z1m12  200m (10%)    200m (10%)  600Mi (8%)       600Mi (8%)
  kube-system  node-problem-detector-v0.1-fj7m3      20m (1%)      200m (10%)  20Mi (0%)        100Mi (1%)
Allocated resources:
  (Total limits may be over 100 percent, i.e., overcommitted.)
  CPU Requests    CPU Limits    Memory Requests    Memory Limits
  ------------    ----------    ---------------    -------------
  680m (34%)      400m (20%)    920Mi (11%)        1070Mi (13%)
```

위의 출력에서, 1.120 이상의 CPU 또는 6.23 Gi 이상의 메모리를 요청하는 파드는 
노드에 할당될 수 없음을 확인할 수 있다.

"Pods" 섹션을 살펴보면, 어떤 파드가 노드에서 공간을 차지하고 있는지를
볼 수 있다.

사용 가능한 리소스의 일부를 시스템 데몬이 사용하기 때문에, 
파드에 사용 가능한 리소스의 양은 노드 총 용량보다 적다. 
쿠버네티스 API에서, 각 노드는 `.status.allocatable` 필드(상세 사항은 
[NodeStatus](/docs/reference/kubernetes-api/cluster-resources/node-v1/#NodeStatus) 참조)를 
갖는다.

`.status.allocatable` 필드는 해당 노드에서 파드가 사용할 수 있는 
리소스의 양을 표시한다(예: 15 vCPUs 및 7538 MiB 메모리).
쿠버네티스의 노드 할당 가능 리소스에 대한 상세 사항은 
[시스템 데몬을 위한 컴퓨트 자원 예약하기](/docs/tasks/administer-cluster/reserve-compute-resources/)를 참고한다.

[리소스 쿼터](/ko/docs/concepts/policy/resource-quotas/)를 설정하여, 
한 네임스페이스가 사용할 수 있는 리소스 총량을 제한할 수 있다. 
특정 네임스페이스 내에 ResourceQuota가 설정되어 있으면 
쿠버네티스는 오브젝트에 대해 해당 쿼터를 적용한다. 
예를 들어, 각 팀에 네임스페이스를 할당한다면, 각 네임스페이스에 ResourceQuota를 설정할 수 있다. 
리소스 쿼터를 설정함으로써 한 팀이 지나치게 많은 리소스를 사용하여 
다른 팀에 영향을 주는 것을 막을 수 있다.

해당 네임스페이스에 어떤 접근을 허용할지도 고려해야 한다. 
네임스페이스에 대한 **완전한** 쓰기 권한을 가진 사람은 
어떠한 리소스(네임스페이스에 설정된 ResourceQuota 포함)라도 삭제할 수 있다.

### 내 컨테이너가 종료되었다

리소스가 부족하여 컨테이너가 종료될 수 있다. 리소스
제한에 도달하여 컨테이너가 종료되고 있는지 확인하려면,
관심있는 파드에 대해 `kubectl describe pod` 를 호출한다.

```shell
kubectl describe pod simmemleak-hra99
```

출력은 다음과 같다.
```
Name:                           simmemleak-hra99
Namespace:                      default
Image(s):                       saadali/simmemleak
Node:                           kubernetes-node-tf0f/10.240.216.66
Labels:                         name=simmemleak
Status:                         Running
Reason:
Message:
IP:                             10.244.2.75
Containers:
  simmemleak:
    Image:  saadali/simmemleak:latest
    Limits:
      cpu:          100m
      memory:       50Mi
    State:          Running
      Started:      Tue, 07 Jul 2019 12:54:41 -0700
    Last State:     Terminated
      Reason:       OOMKilled
      Exit Code:    137
      Started:      Fri, 07 Jul 2019 12:54:30 -0700
      Finished:     Fri, 07 Jul 2019 12:54:33 -0700
    Ready:          False
    Restart Count:  5
Conditions:
  Type      Status
  Ready     False
Events:
  Type    Reason     Age   From               Message
  ----    ------     ----  ----               -------
  Normal  Scheduled  42s   default-scheduler  Successfully assigned simmemleak-hra99 to kubernetes-node-tf0f
  Normal  Pulled     41s   kubelet            Container image "saadali/simmemleak:latest" already present on machine
  Normal  Created    41s   kubelet            Created container simmemleak
  Normal  Started    40s   kubelet            Started container simmemleak
  Normal  Killing    32s   kubelet            Killing container with id ead3fb35-5cf5-44ed-9ae1-488115be66c6: Need to kill Pod
```

앞의 예제에서, `Restart Count:  5` 표시는 파드의 `simmemleak`
컨테이너가 종료되고 (지금까지) 5번 다시 시작되었음을 나타낸다.
`Reason: OOMKilled`를 통해 컨테이너가 제한보다 많은 양의 메모리를 사용하려고 했다는 것을 확인할 수 있다.

다음 단계로 메모리 누수가 있는지 애플리케이션 코드를 확인해 볼 수 있다. 
애플리케이션이 예상한 대로 동작하는 것을 확인했다면, 
해당 컨테이너의 메모리 제한(및 요청)을 더 높게 설정해 본다.

## {{% heading "whatsnext" %}}

* [컨테이너와 파드에 메모리 리소스를 할당](/ko/docs/tasks/configure-pod-container/assign-memory-resource/)하는 핸즈온 경험을 해보자.
* [컨테이너와 파드에 CPU 리소스를 할당](/ko/docs/tasks/configure-pod-container/assign-cpu-resource/)하는 핸즈온 경험을 해보자.
* API 레퍼런스에 [컨테이너](/docs/reference/kubernetes-api/workload-resources/pod-v1/#Container)와 
  [컨테이너 리소스 요구사항](/docs/reference/kubernetes-api/workload-resources/pod-v1/#resources)이 어떻게 정의되어 있는지 확인한다.
* XFS의 [프로젝트 쿼터](https://xfs.org/index.php/XFS_FAQ#Q:_Quota:_Do_quotas_work_on_XFS.3F)에 대해 읽어보기
* [kube-scheduler 정책 레퍼런스 (v1beta3)](/docs/reference/config-api/kube-scheduler-config.v1beta3/)에 대해 더 읽어보기
