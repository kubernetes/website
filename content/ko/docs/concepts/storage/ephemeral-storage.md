---
title: 로컬 임시 스토리지
content_type: concept
weight: 95
---

노드는 로컬 임시 스토리지를 가지고 있으며,
 이 스토리지는 노드에 직접 연결된 쓰기 가능한 저장 장치 또는 경우에 따라 RAM을 기반으로 한다.
"임시"는 내구성에 대한 장기간의 보증이 없음을 의미한다.

파드는 스크래치 공간, 캐싱 및 로그에 대해 임시 로컬 스토리지를 사용한다.
kubelet은 로컬 임시 스토리지를 사용하여 컨테이너에
[`emptyDir`](/ko/docs/concepts/storage/volumes/#emptydir)
{{< glossary_tooltip term_id="volume" text="볼륨" >}}을 마운트하기 위해 파드에 스크래치 공간을 제공할 수 있다.

kubelet은 이러한 종류의 스토리지를 사용하여
[노드-레벨 컨테이너 로그](/ko/docs/concepts/cluster-administration/logging/#노드-레벨에서의-로깅),
컨테이너 이미지 및 실행 중인 컨테이너의 쓰기 가능한 레이어(writeable layer)를 보유한다.

{{< caution >}}
노드가 실패하면, 임시 스토리지의 데이터가 손실될 수 있다.
애플리케이션은 로컬 임시 스토리지에서 성능에 대한 SLA(예: 디스크 IOPS)를
기대할 수 없다.
{{< /caution >}}

{{< note >}}
임시 스토리지에 대해 리소스 쿼터가 적용되려면 다음 두 가지가 필요하다:

* 관리자는 네임스페이스에 임시 스토리지 리소스 쿼터를 설정해야한다.


* 사용자는 파드 명세에 임시 스토리지 리소스의 제한값을 지정해야한다.

사용자가 파드 명세에 임시 스토리지 리소스 제한을 지정하지 않으면, 임시 스토리지에 대한 리소스 쿼터는 적용되지 않는다.
{{< /note >}}

쿠버네티스는 파드가 사용할 수 있는 임시 로컬 스토리지의 양을
추적, 예약 및 제한할 수 있도록 해준다.

### 로컬 임시 스토리지 구성

쿠버네티스는 노드에서 로컬 임시 스토리지를 구성하는 두 가지 방법을 지원한다:

{{< tabs name="local_storage_configurations" >}}
{{% tab name="단일 파일시스템" %}}
이 구성에서는 모든 종류의 임시 로컬 데이터
 (`emptyDir` 볼륨, 쓰기 가능한 레이어, 컨테이너 이미지, 로그)를 하나의 파일시스템에 배치한다.

kubelet은 또한
[노드-레벨 컨테이너 로그](/ko/docs/concepts/cluster-administration/logging/#노드-레벨에서의-로깅)를
작성하고 임시 로컬 스토리지와 유사하게 처리한다.

kubelet은 구성된 로그 디렉터리 내의 파일에 로그를 기록한다
(기본적으로 `/var/log`). 그리고 로컬에 저장된 다른 데이터에 대한 기본 디렉터리가 있다
(기본적으로 `/var/lib/kubelet`).

일반적으로, `/var/lib/kubelet` 와 `/var/log` 모두 시스템 루트 파일시스템에 위치하고,
그리고 kubelet은 이런 레이아웃을 염두에 두고 설계되었다.

노드에는 쿠버네티스에서 사용하지 않는 다른 파일시스템을
 원하는 만큼 추가할 수 있다
{{% /tab %}}
{{% tab name="런타임 파일시스템" %}}
노드에서 실행 중인 파드의 임시 데이터를 저장하기 위해 하나의 파일시스템을 사용한다.
 여기에는 로그와 `emptyDir` 볼륨 등이 포함된다.
 또한 이 파일시스템은 쿠버네티스와 관련 없는 시스템 로그와 같은 다른 데이터 저장에도 사용할 수 있으며,
 심지어 노드의 루트 파일시스템일 수도 있다.

kubelet은 또한
[노드-레벨 컨테이너 로그](/ko/docs/concepts/cluster-administration/logging/#노드-레벨에서의-로깅)를
첫 번째 파일시스템에 기록하고, 임시 로컬 스토리지와 유사하게 처리한다.

또한 다른 논리 스토리지 장치가 지원하는 별도의 파일시스템을 사용한다.
이 구성에서, 컨테이너 이미지 레이어와 쓰기 가능한 레이어를 배치하도록
kubelet에 지시하는 디렉터리는 이 두 번째 파일시스템에 있다.
이 저장 위치는 kubelet이 아니라 컨테이너 런타임에서 설정해야한다.

첫 번째 파일시스템에는 이미지 레이어나 쓰기 가능한 레이어가 없다.

노드는 쿠버네티스에서 사용하지 않는 다른 많은 파일시스템을
가질 수 있다.
{{% /tab %}}
{{% tab name="분할 이미지 파일시스템" %}}
이 구성에서는 컨테이너 이미지 레이어가 별도의 파일 시스템에 저장되고,
 컨테이너의 쓰기 가능한 레이어는 로그 및  `emptyDir`  볼륨과 같은
 kubelet의 임시 데이터와 동일한 파일 시스템에 저장된다.

이러한 구성은 `containerfs`  축출(eviction) 신호를 지원해야 한다.
 기능 게이트와 이 구성을 지원하는 컨테이너 런타임에 대한 자세한 내용은
 [노드-압박 축출](/docs/concepts/scheduling-eviction/node-pressure-eviction/#filesystem-signals) 문서를 참고한다.
{{% /tab %}}
{{< /tabs >}}

[노드-압박 축출](/docs/concepts/scheduling-eviction/node-pressure-eviction/#filesystem-signals)
 문서에서는 이러한 관측 대상 파일 시스템을  `nodefs` ,  `imagefs` ,  `containerfs` 라고 부른다.
 이 명칭들이 항상 서로 분리된 마운트 지점을 의미하는 것은 아니다.

로컬 임시 스토리지에 대해 지원되는 구성 방식 중 하나로 노드를 설정하면,
 kubelet이 로컬 스토리지 사용량을 측정할 수 있다.

다른 구성을 사용하는 경우, kubelet은 임시 로컬 스토리지에 대한
 리소스 제한을 적용하지 않는다.

{{< note >}}
kubelet은  tmpfs 를 사용하는  emptyDir  볼륨을
 로컬 임시 스토리지 사용량이 아니라 컨테이너의 메모리 사용량으로 추적한다.
{{< /note >}}

{{< note >}}
kubelet은 지원되는 파일시스템 구성 방식에 따라 관찰할 수 있는 파일시스템에서만 임시 스토리지 사용량을 추적할 수 있다.
`/var/lib/kubelet`,  `/var/log`, 컨테이너 런타임 저장 디렉터리와
 같은 경로 아래에 별도의 파일시스템을 마운트하면,
 kubelet이 임시 스토리지(ephemeral storage)를 올바르게 보고하지 못할 수 있다.
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
[노드 할당 가능](/docs/tasks/administer-cluster/reserve-compute-resources/#node-allocatable)을 참고한다.

스케줄러는 스케줄링된 컨테이너들의 리소스 요청량 합계가 노드의 리소스 용량보다 작도록 보장한다.

### 임시 스토리지 소비 관리 {#resource-emphemeralstorage-consumption}

kubelet이 로컬 임시 스토리지를 리소스로 관리하는 경우,
kubelet은 다음에서 스토리지 사용을 측정한다.

- _tmpfs_ `emptyDir` 볼륨을 제외한 `emptyDir` 볼륨
- 노드-레벨 로그가 있는 디렉터리
- 쓰기 가능한 컨테이너 레이어

허용하는 것보다 더 많은 임시 스토리지를 파드가 사용하는 경우, kubelet은
파드 축출을 트리거하는 축출 신호를 설정한다.

컨테이너-레벨 격리의 경우, 컨테이너의 쓰기 가능한 이미지와 로그
사용량이 스토리지 제한을 초과하면, kubelet은 파드를 축출하도록 표시한다.

파드-레벨 격리의 경우, kubelet은 해당 파드의
컨테이너에 대한 제한을 합하여 전체 파드 스토리지 제한을 해결한다.
 이 경우, 모든 컨테이너와 파드의 `emptyDir` 볼륨의
로컬 임시 스토리지 사용량 합계가 전체 파드 스토리지 제한을 초과하면,
 kubelet은 파드를 축출 대상으로 표시한다.

{{< caution >}}
kubelet이 로컬 임시 스토리지를 측정하지 않는 경우,
로컬 스토리지 제한을 초과하는 파드는
 로컬 스토리지 리소스 제한을 위반해도 축출되지 않는다.

하지만 컨테이너의 쓰기 가능한 레이어, 노드 수준 로그 또는
 emptyDir  볼륨이 사용하는 파일시스템의 여유 공간이 부족해지면,
 노드는 스스로 로컬 스토리지가 부족한 상태라고 판단하여 {{< glossary_tooltip text="테인트" term_id="taint" >}}를 설정한다.
 이 테인트는 해당 테인트를 명시적으로 허용하지 않는 모든 파드의 축출을 유발한다.

임시 로컬 스토리지에 대해 지원되는 [구성](#로컬-임시-스토리지-구성)을 참조한다.
{{< /caution >}}

kubelet은 파드 스토리지 사용량을 측정하는 다양한 방법을 지원한다.

{{< tabs name="resource-emphemeralstorage-measurement" >}}

{{% tab name="주기적 스캐닝" %}}

kubelet은 각 `emptyDir` 볼륨, 컨테이너 로그 디렉터리 및 쓰기 가능한 컨테이너 레이어를
스캔하는 정기적인 스케줄 검사를 수행한다.

스캔은 얼마나 많은 공간이 사용되고 있는지를 측정한다.

{{< note >}}
이 모드에서는 kubelet은 삭제된 파일의 열린 파일 디스크립터를
추적하지 않는다.

여러분(또는 컨테이너)이 `emptyDir` 볼륨 안에 파일을 생성하면,
어떤 프로세스가 그 파일을 연 다음, 파일이 열려있는 동안 파일을 삭제하면,
 삭제된 파일의 inode는 해당 파일을 닫을 때까지 유지되지만
 kubelet은 사용 중인 공간으로 분류하지 않는다.

{{< /note >}}

{{% /tab %}}

{{% tab name="파일시스템 프로젝트 쿼터(기본적으로 비활성화됨" %}}

{{< feature-state for_k8s_version="v1.31" state="beta" >}}

프로젝트 쿼터는 파일시스템에서 스토리지 사용을 관리하기 위한
운영체제 레벨의 기능이다. 쿠버네티스를 사용하면, 스토리지 사용을
모니터링하기 위해 프로젝트 쿼터를 사용할 수 있다. 노드에서 `emptyDir` 볼륨을
지원하는 파일시스템이 프로젝트 쿼터 지원을 제공하는지 확인한다.
예를 들어, XFS와 ext4fs는 프로젝트 쿼터를 지원한다.

{{< note >}}
프로젝트 쿼터를 사용하면 스토리지 사용량을 모니터링할 수 있지만, 한도를 강제로 제한하지는 않는다.
{{< /note >}}

쿠버네티스는 `1048576` 부터 프로젝트 ID를 사용한다. 사용 중인 ID는
`/etc/projects` 와 `/etc/projid` 에 등록되어 있다. 이 범위의 프로젝트 ID가
시스템에서 다른 목적으로 사용되는 경우, 쿠버네티스가
이를 사용하지 않도록 해당 프로젝트 ID를 `/etc/projects` 와 `/etc/projid` 에
등록해야한다.

쿼터는 디렉터리 검색보다 빠르고 정확하다. 디렉터리가
프로젝트에 할당되면, 디렉터리 아래에 생성된
모든 파일이 해당 프로젝트에 생성되며, 커널은 해당 프로젝트의
파일에서 사용 중인 블록 수를 추적하기만 하면 된다.
파일이 생성되고 삭제되었지만, 열린 파일 디스크립터가 있으면,
계속 공간을 소비한다. 쿼터 추적은 공간을 정확하게 기록하는 반면
디렉터리 스캔은 삭제된 파일이 사용한 스토리지를 간과한다.

쿼터를 사용하여 파드의 리소스 사용량을 추적하려면
 해당 파드가 사용자 네임스페이스(user namespace) 안에서 실행되어야 한다.
 사용자 네임스페이스 내부에서는 커널이 파일시스템의  projectID  변경을 제한하므로,
 쿼터를 통해 계산되는 스토리지 메트릭의 신뢰성이 보장된드.

프로젝트 쿼터를 사용하려면, 다음을 수행해야 한다:

* [kubelet 구성](/docs/reference/config-api/kubelet-config.v1beta1/)의
  `featureGates` 필드 또는 `--feature-gates` 커맨드 라인 플래그를 사용하여
  `LocalStorageCapacityIsolationFSQuotaMonitoring=true`
  [기능 게이트](/ko/docs/reference/command-line-tools-reference/feature-gates/)를 활성화한다.

* `UserNamespacesSupport`
 [기능 게이트](/ko/docs/reference/command-line-tools-reference/feature-gates/)가 활성화되어 있는지 확인하고,
 커널, CRI 구현체, OCI 런타임이 모두 사용자 네임스페이스를 지원하는지 확인해야 한다.

* 루트 파일시스템(또는 선택적인 런타임 파일시스템)에
  프로젝트 쿼터가 활성화되어 있는지 확인한다. 모든 XFS 파일시스템은 프로젝트 쿼터를 지원한다.
  ext4 파일시스템의 경우, 파일시스템이 마운트되지 않은 상태에서
 프로젝트 쿼터 추적 기능을 활성화해야 한다.

  ```bash
  # ext4인 /dev/block-device가 마운트되지 않은 경우
  sudo tune2fs -O project -Q prjquota /dev/block-device
  ```

* 루트 파일시스템(또는 선택적인 런타임 파일시스템)은 프로젝트 쿼터를
  활성화한 상태에서 마운트해야 힌다. XFS와 ext4fs 모두에서,
  마운트 옵션의 이름은 `prjquota` 이다.

프로젝트 쿼터를 사용하지 않으려면 다음을 수행해야 한다:

* `LocalStorageCapacityIsolationFSQuotaMonitoring`
 [기능 게이트](/ko/docs/reference/command-line-tools-reference/feature-gates/)
를 비활성화하기 위해
[kubelet 구성](/docs/reference/config-api/kubelet-config.v1beta1/)
의 `featureGates` 필드를 사용한다.
{{% /tab %}}
{{< /tabs >}}

## {{% heading "whatsnext" %}}

* [XFS 파일시스템의 프로젝트 쿼터](https://www.linux.org/docs/man8/xfs_quota.html) 읽어보기
