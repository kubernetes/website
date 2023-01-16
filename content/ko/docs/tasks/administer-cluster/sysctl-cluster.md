---
title: 쿠버네티스 클러스터에서 sysctl 사용하기
# reviewers:
# - sttts
content_type: task
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.21" state="stable" >}}

이 문서는 쿠버네티스 클러스터에서 {{< glossary_tooltip term_id="sysctl" >}} 인터페이스를 사용하여 
커널 파라미터를 어떻게 구성하고, 사용하는지를 
설명한다.

{{< note >}}
쿠버네티스 버전 1.23부터, kubelet은 `/` 또는 `.`를 
sysctl 이름의 구분자로 사용하는 것을 지원한다.
쿠버네티스 1.25 버전부터, 파드에 대해서도 sysctl을 설정할 때 슬래시 구분자를 지원하기 시작하였다.
예를 들어, 동일한 sysctl 이름을 `kernel.shm_rmid_forced`와 같이 마침표를 구분자로 사용하여 나타내거나 
`kernel/shm_rmid_forced`와 같이 슬래시를 구분자로 사용하여 나타낼 수 있다. 
sysctl 파라미터 변환에 대한 세부 사항은 
리눅스 맨페이지 프로젝트의 
[sysctl.d(5)](https://man7.org/linux/man-pages/man5/sysctl.d.5.html) 페이지를 참고한다.
{{< /note >}}
## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}}

일부 단계에서는 실행 중인 클러스터의 kubelet에서 
커맨드 라인 옵션을 재구성할 필요가 있다.


<!-- steps -->

## 모든 sysctl 파라미터 나열

리눅스에서 sysctl 인터페이스는 관리자들이 런타임에 커널 파라미터를 수정할 수 있도록 
허용한다. 파라미터는 `/proc/sys` 가상 파일 시스템을 통해 이용할 수 있다. 파라미터는 
다음과 같은 다양한 서브 시스템을 포함한다.

- 커널 (공통 접두사: `kernel.`)
- 네트워크 (공통 접두사: `net.`)
- 가상 메모리 (공통 접두사: `vm.`)
- MDADM (공통 접두사: `dev.`)
- 더 많은 서브 시스템은 [커널 문서](https://www.kernel.org/doc/Documentation/sysctl/README)에 설명되어 있다.

모든 파라미터 리스트를 가져오려면 다음 명령을 실행한다.

```shell
sudo sysctl -a
```

## unsafe sysctl 활성화하기

sysctl은 _safe_ sysctl과 _unsafe_ sysctl로 구성되어 있다. _safe_ sysctl은 
적절한 네임스페이스 뿐만 아니라 동일한 노드의 파드 사이에 _고립_ 되어야 한다. 즉, 하나의 
파드에 _safe_ sysctl을 설정한다는 것은 다음을 의미한다.

- 노드의 다른 파드에 영향을 미치지 않아야 한다
- 노드의 상태를 손상시키지 않아야 한다
- CPU 또는 메모리 리소스가 파드의 리소스 제한에 벗어나는 것을 
  허용하지 않아야 한다

아직까지 대부분 _네임스페이스된_ sysctl은 _safe_ sysctl로 고려되지 않았다.
다음 sysctl은 _safe_ 명령을 지원한다.

- `kernel.shm_rmid_forced`,
- `net.ipv4.ip_local_port_range`,
- `net.ipv4.tcp_syncookies`,
- `net.ipv4.ping_group_range` (쿠버네티스 1.18 이후),
- `net.ipv4.ip_unprivileged_port_start` (쿠버네티스 1.22 이후).

{{< note >}}
`net.ipv4.tcp_syncookies` 예시는 리눅스 커널 버전 4.4 또는 이하에서 네임스페이스되지 않는다.
{{< /note >}}

kubelet이 더 고립된 방법을 지원하면 추후 쿠버네티스 버전에서 
확장될 것이다.

모든 _safe_ sysctl은 기본적으로 활성화된다.

모든 _unsafe_ sysctl은 기본적으로 비활성화되고, 노드별 기본 클러스터 관리자에 
의해 수동으로 메뉴얼로 허용되어야 한다.
unsafe sysctl이 비활성화된 파드는 스케줄링되지만, 시작에 실패한다.

위의 경고를 염두에 두고 클러스터 관리자는 
고성능 또는 실시간 애플리케이션 조정과 같은 
매우 특수한 상황에 대해 특정 _unsafe_ sysctl을 허용할 수 있다. _unsafe_ sysctl은 
kubelet 플래그를 사용하여 노드별로 활성화된다. 예를 들면, 다음과 같다.

```shell
kubelet --allowed-unsafe-sysctls \
  'kernel.msg*,net.core.somaxconn' ...
```

{{< glossary_tooltip term_id="minikube" >}}의 경우, `extra-config` 플래그를 통해 이 작업을 수행할 수 있다.

```shell
minikube start --extra-config="kubelet.allowed-unsafe-sysctls=kernel.msg*,net.core.somaxconn"...
```

_네임스페이스_ sysctl만 이 방법을 사용할 수 있다.

## 파드에 대한 sysctl 설정

수많은 sysctl은 최근 리눅스 커널에서 _네임스페이스_ 되어 있다. 이는 노드의 각 파드에 
대해 개별적으로 설정할 수 있다는 것이다. 쿠버네티스의 파드 securityContext를 통해 
네임스페이스 sysctl만 구성할 수 있다.

다음 sysctls는 네임스페이스로 알려져 있다. 
이 목록은 이후 버전의 Linux 커널에서 변경될 수 있다.

- `kernel.shm*`,
- `kernel.msg*`,
- `kernel.sem`,
- `fs.mqueue.*`,
- `net.*` 아래의 파라미터는 컨테이너 네트워킹 네임스페이스에서 설정할 수 있다. 
  그러나 예외가 존재한다. (예, `net.netfilter.nf_conntrack_max`와 `net.netfilter.nf_conntrack_expect_max`는 
  컨테이너 네트워킹 네임스페이스에서 설정되지만, 
  네임스페이스가 없다.)

네임스페이스가 없는 sysctl은 _node-level_ sysctl이라고 부른다. 
이를 설정해야 한다면, 각 노드의 OS에서 수동으로 구성하거나 
특권있는 컨테이너의 데몬셋을 사용하여야 한다.

네임스페이스 sysctl을 구성하기 위해서 파드 securityContext를 사용한다. 
securityContext는 동일한 파드의 모든 컨테이너에 적용된다.

이 예시는 safe sysctl `kernel.shm_rmid_forced`와 두 개의 unsafe sysctl인 
`net.core.somaxconn` 과 `kernel.msgmax` 를 설정하기 위해 파드 securityContext를 사용한다.
스펙에 따르면 _safe_ sysctl과 _unsafe_ sysctl 간 
차이는 없다.

{{< warning >}}
파라미터의 영향을 파악한 후에만 운영체제가 
불안정해지지 않도록 sysctl 파라미터를 수정한다.
{{< /warning >}}

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: sysctl-example
spec:
  securityContext:
    sysctls:
    - name: kernel.shm_rmid_forced
      value: "0"
    - name: net.core.somaxconn
      value: "1024"
    - name: kernel.msgmax
      value: "65536"
  ...
```


<!-- discussion -->

{{< warning >}}
_unsafe_의 특성으로 인해 _unsafe_sysctl는 위험 부담이 있으며 
컨테이너의 잘못된 동작, 리소스 부족 혹은 노드 완전 파손과 같은 
심각한 문제를 초래할 수 있다.
{{< /warning >}}

특별한 sysctl 설정이 있는 노드를 클러스터 내에서 _tainted_로 간주하고 
sysctl 설정이 필요한 노드에만 파드를 예약하는 것이 좋다. 
이를 구현하려면 쿠버네티스 [_테인트(taint)와 톨러레이션(toleration)_ 기능](/docs/reference/generated/kubectl/kubectl-commands/#taint) 을 
사용하는 것이 좋다.

두 _unsafe_ sysctl을 명시적으로 활성화하지 않은 노드에서 _unsafe_ sysctl을 사용하는 
파드가 시작되지 않는다. _node-level_ sysctl과 마찬가지로 
[_테인트와 톨러레이션_ 특징](/docs/reference/generated/kubectl/kubectl-commands/#taint) 또는 
[노드 테인트](/ko/docs/concepts/scheduling-eviction/taint-and-toleration/)를 
사용하여 해당 파드를 오른쪽 노드에 
스케줄하는 것을 추천한다.
