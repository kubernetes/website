---
# reviewers:
# - jayunit100
# - jsturtevant
# - marosset
# - perithompson
title: 쿠버네티스에서의 윈도우 컨테이너
content_type: concept
weight: 65
---

<!-- overview -->

윈도우 애플리케이션은 많은 조직에서 실행되는 서비스 및 애플리케이션의 상당 부분을 구성한다. 
[윈도우 컨테이너](https://aka.ms/windowscontainers)는 
프로세스와 패키지 종속성을 캡슐화하는 현대적인 방법을 제공하여, 
데브옵스(DevOps) 사례를 더욱 쉽게 사용하고 윈도우 애플리케이션의 클라우드 네이티브 패턴을 따르도록 한다.

윈도우 기반 애플리케이션과 리눅스 기반 애플리케이션에 투자한 조직은 
워크로드를 관리하기 위해 별도의 오케스트레이터를 찾을 필요가 없으므로, 
운영 체제와 관계없이 
배포 전반에 걸쳐 운영 효율성이 향상된다.

<!-- body -->

## 쿠버네티스에서의 윈도우 노드

쿠버네티스에서 윈도우 컨테이너 오케스트레이션을 활성화하려면, 
기존 리눅스 클러스터에 윈도우 노드를 추가한다. 
쿠버네티스에서 {{< glossary_tooltip text="파드" term_id="pod" >}} 내의 윈도우 컨테이너를 스케줄링하는 것은 
리눅스 기반 컨테이너를 스케줄링하는 것과 유사하다.

윈도우 컨테이너를 실행하려면, 
쿠버네티스 클러스터가 여러 운영 체제를 포함하고 있어야 한다. 
{{< glossary_tooltip text="컨트롤 플레인" term_id="control-plane" >}}은 리눅스에서만 실행할 수 있는 반면, 
워커 노드는 윈도우 또는 리눅스를 실행할 수 있다.

{{< glossary_tooltip text="노드" term_id="node" >}}의 운영 체제가 
Windows Server 2019인 경우에만 
윈도우 노드로써 [사용할 수 있다](#windows-os-version-support).

이 문서에서 *윈도우 컨테이너*라는 용어는 프로세스 격리 기반의 윈도우 컨테이너를 의미한다. 
쿠버네티스는 [Hyper-V 격리](https://docs.microsoft.com/en-us/virtualization/windowscontainers/manage-containers/hyperv-container) 기반의 
윈도우 컨테이너를 지원하지 않는다.

## 호환성 및 제한 {#limitations}

일부 노드 기능은 특정 [컨테이너 런타임](#container-runtime)을 사용할 때에만 이용 가능하며, 
윈도우 노드에서 사용할 수 없는 기능도 있다. 
예시는 다음과 같다.

* HugePages: 윈도우 컨테이너에서 지원되지 않음
* 특권을 가진(Privileged) 컨테이너: 윈도우 컨테이너에서 지원되지 않음.
  [HostProcess 컨테이너](/docs/tasks/configure-pod-container/create-hostprocess-pod/)가 비슷한 기능을 제공한다.
* TerminationGracePeriod: containerD를 필요로 한다.

공유 네임스페이스(shared namespaces)의 모든 기능이 지원되는 것은 아니다. 
자세한 내용은 [API 호환성](#api)을 참조한다.

[윈도우 OS 버전 호환성](#windows-os-version-support)에서 
쿠버네티스와의 동작이 테스트된 윈도우 버전 상세사항을 확인한다.

API 및 kubectl의 관점에서, 윈도우 컨테이너는 리눅스 기반 컨테이너와 거의 같은 방식으로 작동한다. 
그러나, 주요 기능에서 몇 가지 주목할 만한 차이점이 있으며, 
이 섹션에서 소개된다.

### 리눅스와의 비교 {#compatibility-linux-similarities}

윈도우에서 주요 쿠버네티스 요소는 리눅스와 동일한 방식으로 작동한다. 
이 섹션에서는 몇 가지 주요 워크로드 추상화 및 이들이 윈도우에서 어떻게 매핑되는지를 다룬다.

* [파드](/ko/docs/concepts/workloads/pods/)

  파드는 쿠버네티스의 기본 빌딩 블록이며, 
  이는 쿠버네티스 오브젝트 모델에서 생성하고 배포하는 가장 작고 간단한 단위임을 의미한다. 
  동일한 파드에 윈도우 컨테이너와 리눅스 컨테이너를 배포할 수 없다. 
  파드의 모든 컨테이너는 단일 노드로 스케줄되며 이 때 각 노드는 특정 플랫폼 및 아키텍처를 갖는다. 
  다음과 같은 파드 기능, 속성 및 이벤트가 윈도우 컨테이너에서 지원된다.

  * 프로세스 격리 및 볼륨 공유 기능을 갖춘 파드 당 하나 또는 여러 개의 컨테이너
  * 파드의 `status` 필드
  * 준비성 프로브(readinessprobe), 활성 프로브(liveness probe) 및 시작 프로브(startup probe)
  * postStart 및 preStop 컨테이너 라이프사이클 훅
  * 컨피그맵(ConfigMap), 시크릿(Secrets): 환경 변수 또는 볼륨 형태로
  * `emptyDir` 볼륨
  * 명명된 파이프 호스트 마운트
  * 리소스 제한
  * OS 필드: 

    특정 파드가 윈도우 컨테이너를 사용하고 있다는 것을 나타내려면 `.spec.os.name` 필드를 `windows`로 설정해야 한다.

    {{< note >}}
    쿠버네티스 1.25부터, `IdentifyPodOS` 기능 게이트는 GA 단계이며 기본적으로 활성화되어 있다.
    {{< /note >}}

    `.spec.os.name` 필드를 `windows`로 설정했다면,
    해당 파드의 `.spec` 내의 다음 필드는 설정하지 않아야 한다.

    * `spec.hostPID`
    * `spec.hostIPC`
    * `spec.securityContext.seLinuxOptions`
    * `spec.securityContext.seccompProfile`
    * `spec.securityContext.fsGroup`
    * `spec.securityContext.fsGroupChangePolicy`
    * `spec.securityContext.sysctls`
    * `spec.shareProcessNamespace`
    * `spec.securityContext.runAsUser`
    * `spec.securityContext.runAsGroup`
    * `spec.securityContext.supplementalGroups`
    * `spec.containers[*].securityContext.seLinuxOptions`
    * `spec.containers[*].securityContext.seccompProfile`
    * `spec.containers[*].securityContext.capabilities`
    * `spec.containers[*].securityContext.readOnlyRootFilesystem`
    * `spec.containers[*].securityContext.privileged`
    * `spec.containers[*].securityContext.allowPrivilegeEscalation`
    * `spec.containers[*].securityContext.procMount`
    * `spec.containers[*].securityContext.runAsUser`
    * `spec.containers[*].securityContext.runAsGroup`

    위의 리스트에서 와일드카드(`*`)는 목록의 모든 요소를 가리킨다. 
    예를 들어, `spec.containers[*].securityContext`는 
    모든 컨테이너의 시큐리티컨텍스트(SecurityContext) 오브젝트를 나타낸다. 
    위의 필드 중 하나라도 설정되어 있으면, API 서버는 해당 파드는 수용하지 않을 것이다.

* 다음과 같은 [워크로드 리소스](/ko/docs/concepts/workloads/controllers/):
  * 레플리카셋(ReplicaSet)
  * 디플로이먼트(Deployment)
  * 스테이트풀셋(StatefulSet)
  * 데몬셋(DaemonSet)
  * 잡(Job)
  * 크론잡(CronJob)
  * 레플리케이션컨트롤러(ReplicationController)  
* {{< glossary_tooltip text="서비스" term_id="service" >}}
  [로드 밸런싱과 서비스](/ko/docs/concepts/services-networking/windows-networking/#load-balancing-and-services)에서 상세 사항을 확인한다.

파드, 워크로드 리소스 및 서비스는 
쿠버네티스에서 윈도우 워크로드를 관리하는 데 중요한 요소이다. 
그러나 그 자체만으로는 동적인 클라우드 네이티브 환경에서 
윈도우 워크로드의 적절한 라이프사이클 관리를 수행하기에 충분하지 않다.

* `kubectl exec`
* 파드 및 컨테이너 메트릭
* {{< glossary_tooltip text="Horizontal pod autoscaling" term_id="horizontal-pod-autoscaler" >}}
* {{< glossary_tooltip text="리소스 쿼터(Resource quota)" term_id="resource-quota" >}}
* 스케쥴러 선점(preemption)

### kubelet을 위한 명령줄 옵션 {#kubelet-compatibility}

윈도우에서는 일부 kubelet 명령줄 옵션이 다르게 동작하며, 아래에 설명되어 있다.

* `--windows-priorityclass`를 사용하여 kubelet 프로세스의 스케줄링 우선 순위를 설정할 수 있다. 
  ([CPU 리소스 관리](/ko/docs/concepts/configuration/windows-resource-management/#resource-management-cpu) 참고)
* `--kube-reserved`, `--system-reserved` 및 `--eviction-hard` 플래그는 
  [NodeAllocatable](/docs/tasks/administer-cluster/reserve-compute-resources/#node-allocatable)을 업데이트한다.
* `--enforce-node-allocable`을 이용한 축출은 구현되어 있지 않다.
* `--eviction-hard` 및 `--eviction-soft`를 이용한 축출은 구현되어 있지 않다.
* 윈도우 노드에서 실행되는 kubelet은 메모리 및 CPU 제한을 받지 않는다. 
  `NodeAllocatable`에서 `--kube-reserved`와 `--system-reserved`가 차감될 뿐이며 
  워크로드에 제공될 리소스는 보장되지 않는다. 
  추가 정보는 [윈도우 노드의 리소스 관리](/ko/docs/concepts/configuration/windows-resource-management/#resource-reservation)를 
  참고한다.
* `MemoryPressure` 컨디션은 구현되어 있지 않다.
* kubelet은 메모리 부족(OOM, Out-of-Memory) 축출 동작을 수행하지 않는다.

### API 호환성 {#api}

운영 체제와 컨테이너 런타임의 차이로 인해, 윈도우에 대해 쿠버네티스 API가 동작하는 방식에 미묘한 차이가 있다. 
일부 워크로드 속성은 리눅스에 맞게 설계되었으며, 이로 인해 윈도우에서 실행되지 않는다.

높은 수준에서, OS 개념에 대해 다음과 같은 차이점이 존재한다.

* ID - 리눅스는 정수형으로 표시되는 userID(UID) 및 groupID(GID)를 사용한다. 
  사용자와 그룹 이름은 정식 이름이 아니다. 
  UID+GID에 대한 `/etc/groups` 또는 `/etc/passwd`의 별칭일 뿐이다. 
  윈도우는 윈도우 보안 계정 관리자(Security Account Manager, SAM) 데이터베이스에 저장된 
  더 큰 이진 [보안 식별자](https://docs.microsoft.com/en-us/windows/security/identity-protection/access-control/security-identifiers)(SID)를 사용한다. 
  이 데이터베이스는 호스트와 컨테이너 간에 또는 
  컨테이너들 간에 공유되지 않는다.
* 파일 퍼미션 - 윈도우는 SID 기반 접근 제어 목록을 사용하는 반면, 
  리눅스와 같은 POSIX 시스템은 오브젝트 권한 및 UID+GID 기반의 비트마스크(bitmask)를 사용하며, 
  접근 제어 목록도 선택적으로 사용한다.
* 파일 경로 - 윈도우의 규칙은 `/` 대신 `\`를 사용하는 것이다. 
  Go IO 라이브러리는 두 가지 파일 경로 분리자를 모두 허용한다. 
  하지만, 컨테이너 내부에서 해석되는 경로 또는 커맨드 라인을 설정할 때 `\`가 필요할 수 있다.
* 신호(Signals) - 윈도우 대화형(interactive) 앱은 종료를 다르게 처리하며, 
  다음 중 하나 이상을 구현할 수 있다.
  * UI 스레드는 `WM_CLOSE` 등의 잘 정의된(well-defined) 메시지를 처리한다.
  * 콘솔 앱은 컨트롤 핸들러(Control Handler)를 사용하여 Ctrl-c 또는 Ctrl-break를 처리한다.
  * 서비스는 `SERVICE_CONTROL_STOP` 제어 코드를 수용할 수 있는
    Service Control Handler 함수를 등록한다.

컨테이너 종료 코드는 리눅스와 동일하게 성공이면 0, 실패이면 0이 아닌 디른 수이다. 
상세 오류 코드는 윈도우와 리눅스 간에 다를 수 있다. 
그러나 쿠버네티스 컴포넌트(kubelet, kube-proxy)에서 전달된 종료 코드는 변경되지 않는다.

#### 컨테이너 명세의 필드 호환성 {#compatibility-v1-pod-spec-containers}

다음 목록은 윈도우와 리눅스에서 
파드 컨테이너 명세가 어떻게 다르게 동작하는지 기술한다.

* Huge page는 윈도우 컨테이너 런타임에서 구현되지 않았으며,
  따라서 사용할 수 없다. 컨테이너에 대해 구성할 수 없는(not configurable)
  [사용자 권한(user privilege) 어설트(assert)](https://docs.microsoft.com/en-us/windows/desktop/Memory/large-page-support)가
  필요하다.
* `requests.cpu` 및 `requests.memory` - 요청(requests)이 노드의 사용 가능한 리소스에서 차감되며, 
  이는 노드 오버프로비저닝을 방지하기 위해 사용될 수 있다. 
  그러나, 오버프로비저닝된 노드 내에서 리소스를 보장하기 위해서는 사용될 수 없다. 
  운영자가 오버 프로비저닝을 완전히 피하려는 경우 
  모범 사례로 모든 컨테이너에 적용해야 한다.
* `securityContext.allowPrivilegeEscalation` - 
  어떠한 기능도 연결되지 않아서, 윈도우에서는 사용할 수 없다.
* `securityContext.capabilities` - 
  POSIX 기능은 윈도우에서 구현되지 않았다.
* `securityContext.privileged` - 
  윈도우는 특권을 가진(privileged) 컨테이너를 지원하지 않는다. 대신 [호스트 프로세스 컨테이너](/docs/tasks/configure-pod-container/create-hostprocess-pod/)를 사용한다.
* `securityContext.procMount` - 
  윈도우에는 `/proc` 파일시스템이 없다.
* `securityContext.readOnlyRootFilesystem` - 
  윈도우에서는 사용할 수 없으며, 
  이는 레지스트리 및 시스템 프로세스가 컨테이너 내부에서 실행될 때 쓰기 권한이 필요하기 때문이다.
* `securityContext.runAsGroup` - 
  윈도우에서는 GID가 지원되지 않으므로 사용할 수 없다.
* `securityContext.runAsNonRoot` - 
  이 설정은 컨테이너가 `ContainerAdministrator` 사용자로 실행되는 것을 방지하는데, 
  이는 리눅스의 root 사용자와 가장 가까운 윈도우 역할이다.
* `securityContext.runAsUser` - 
  대신 [`runAsUserName`](/ko/docs/tasks/configure-pod-container/configure-runasusername/)을 
  사용한다.
* `securityContext.seLinuxOptions` - 
  SELinux는 리눅스 전용이므로 윈도우에서는 사용할 수 없다.
* `terminationMessagePath` - 
  윈도우가 단일 파일 매핑을 지원하지 않음으로 인하여 몇 가지 제한이 있다. 
  기본값은 `/dev/termination-log`이며, 
  이 경로가 기본적으로 윈도우에 존재하지 않기 때문에 정상적으로 작동한다.

#### 파드 명세의 필드 호환성 {#compatibility-v1-pod}

다음 목록은 윈도우와 리눅스에서 파드 명세가 어떻게 다르게 동작하는지 기술한다.

* `hostIPC` 및 `hostpid` - 호스트 네임스페이스 공유 기능은 윈도우에서 사용할 수 없다.
* `hostNetwork` - [하단 참조](#compatibility-v1-pod-spec-containers-hostnetwork)
* `dnsPolicy` - 윈도우에서 호스트 네트워킹이 지원되지 않기 때문에 
  `dnsPolicy`를 `ClusterFirstWithHostNet`로 설정할 수 없다. 
  파드는 항상 컨테이너 네트워크와 함께 동작한다.
* `podSecurityContext` [하단 참조](#compatibility-v1-pod-spec-containers-securitycontext)
* `shareProcessNamespace` - 이것은 베타 기능이며, 윈도우에서 구현되지 않은 리눅스 네임스페이스에 의존한다. 
  윈도우는 프로세스 네임스페이스 또는 컨테이너의 루트 파일시스템을 공유할 수 없다. 
  네트워크만 공유할 수 있다.
* `terminationGracePeriodSeconds` - 이것은 윈도우용 도커에서 완전히 구현되지 않았다. 
  [GitHub 이슈](https://github.com/moby/moby/issues/25982)를 참고한다. 
  현재 동작은 `ENTRYPOINT` 프로세스가 `CTRL_SHUTDOWN_EVENT`로 전송된 다음, 
  윈도우가 기본적으로 5초를 기다린 후, 
  마지막으로 정상적인 윈도우 종료 동작을 사용하여 모든 프로세스를 종료하는 것이다. 
  5초 기본값은 실제로는 
  [컨테이너 내부](https://github.com/moby/moby/issues/25982#issuecomment-426441183) 윈도우 레지스트리에 있으므로 
  컨테이너를 빌드할 때 재정의할 수 있다.
* `volumeDevices` - 이것은 베타 기능이며, 윈도우에서 구현되지 않았다. 
  윈도우는 원시 블록 장치(raw block device)를 파드에 연결할 수 없다.
* `volumes`
  * `emptyDir` 볼륨을 정의한 경우, 이 볼륨의 소스(source)를 `memory`로 설정할 수는 없다.
* `mountPropagation` - 마운트 전파(propagation)는 윈도우에서 지원되지 않으므로 
  이 필드는 활성화할 수 없다.

#### 호스트 네트워크(hostNetwork)의 필드 호환성 {#compatibility-v1-pod-spec-containers-hostnetwork}

{{< feature-state for_k8s_version="v1.26" state="alpha" >}}

이제 kubelet은, 윈도우 노드에서 실행되는 파드가 새로운 파드 네트워크 네임스페이스를 생성하는 대신 호스트의 네트워크 네임스페이스를 사용하도록 요청할 수 있다.
이 기능을 활성화하려면 kubelet에 `--feature-gates=WindowsHostNetwork=true`를 전달한다.

{{< note >}}
이 기능을 지원하는 컨테이너 런타임을 필요로 한다.
{{< /note >}}

#### 파드 시큐리티 컨텍스트의 필드 호환성 {#compatibility-v1-pod-spec-containers-securitycontext}

파드 [`securityContext`](/docs/reference/kubernetes-api/workload-resources/pod-v1/#security-context)의 모든 필드는 윈도우에서 작동하지 않는다.

## 노드 문제 감지기

노드 문제 감지기([노드 헬스 모니터링하기](/ko/docs/tasks/debug/debug-cluster/monitor-node-health/) 참조)는 
기초적인 윈도우 지원을 포함한다. 
더 자세한 정보는 프로젝트의 
[GitHub 페이지](https://github.com/kubernetes/node-problem-detector#windows)를 참고한다.

## 퍼즈(pause) 컨테이너

쿠버네티스 파드에서, 컨테이너를 호스팅하기 위해 먼저 "퍼즈" 컨테이너라는 인프라 컨테이너가 생성된다. 
리눅스에서, 파드를 구성하는 cgroup과 네임스페이스가 계속 유지되기 위해서는 프로세스가 필요하며, 
퍼즈 프로세스가 이를 담당한다. 
동일한 파드에 속한 (인프라 및 워커) 컨테이너는 
공통의 네트워크 엔드포인트(공통 IPv4/IPv6 주소, 공통 네트워크 포트 공간)를 공유한다. 
쿠버네티스는 퍼즈 컨테이너를 사용하여 
워커 컨테이너가 충돌하거나 재시작하여도 네트워킹 구성을 잃지 않도록 한다.

쿠버네티스는 윈도우 지원을 포함하는 다중 아키텍처 이미지를 유지보수한다. 
쿠버네티스 v{{< skew currentVersion >}}의 경우 
권장 퍼즈 이미지는 `registry.k8s.io/pause:3.6`이다. 
[소스 코드](https://github.com/kubernetes/kubernetes/tree/master/build/pause)는 GitHub에서 찾을 수 있다.

Microsoft는 리눅스 및 윈도우 amd64를 지원하는 다중 아키텍처 이미지를 
`mcr.microsoft.com/oss/kubernetes/pause:3.6`에서 유지보수하고 있다. 
이 이미지는 쿠버네티스가 유지 관리하는 이미지와 동일한 소스코드에서 생성되었지만, 
모든 윈도우 바이너리가 Microsoft에 의해 
[인증 코드(authenticode)로 서명](https://docs.microsoft.com/en-us/windows-hardware/drivers/install/authenticode)되었다. 
서명된 바이너리를 필요로 하는 프로덕션 또는 프로덕션에 준하는 환경에 파드를 배포하는 경우, 
Microsoft가 유지 관리하는 이미지를 사용하는 것을 권장한다.

## 컨테이너 런타임 {#container-runtime}

파드가 각 노드에서 실행될 수 있도록, 
클러스터의 각 노드에 {{< glossary_tooltip text="컨테이너 런타임" term_id="container-runtime" >}}을 
설치해야 한다.

다음 컨테이너 런타임은 윈도우에서 동작한다.

{{% thirdparty-content %}}

### ContainerD

{{< feature-state for_k8s_version="v1.20" state="stable" >}}

{{< glossary_tooltip term_id="containerd" text="ContainerD" >}} 1.4.0+를
윈도우 노드의 컨테이너 런타임으로 사용할 수 있다.

[윈도우 노드에 ContainerD를 설치](/ko/docs/setup/production-environment/container-runtimes/#containerd-설치)하는 방법을 확인한다.

{{< note >}}
containerd와 GMSA 사용 시 윈도우 네트워크 공유 접근에 대한 
[알려진 제한](/ko/docs/tasks/configure-pod-container/configure-gmsa/#gmsa-limitations)이 있으며, 
이는 커널 패치를 필요로 한다.
{{< /note >}}

### Mirantis Container Runtime {#mcr}

[Mirantis Container Runtime](https://docs.mirantis.com/mcr/20.10/overview.html)(MCR)은 
Windows Server 2019 및 이후 버전을 지원하는 컨테이너 런타임이다.

더 많은 정보는 [Windows Server에 MCR 설치하기](https://docs.mirantis.com/mcr/20.10/install/mcr-windows.html)를 참고한다.

## 윈도우 운영 체제 버전 호환성 {#windows-os-version-support}

윈도우에는 호스트 OS 버전이 컨테이너 베이스 이미지 OS 버전과 일치해야 한다는 
엄격한 호환성 규칙이 있다. 
컨테이너 운영 체제가 Windows Server 2019인 윈도우 컨테이너만이 완전히 지원된다.

쿠버네티스 v{{< skew currentVersion >}}에서, 
윈도우 노드(및 파드)에 대한 운영 체제 호환성은 다음과 같다.

Windows Server LTSC 릴리스
: Windows Server 2019
: Windows Server 2022

Windows Server SAC 릴리스
:  Windows Server 버전 20H2

쿠버네티스 [버전 차이 정책](/ko/releases/version-skew-policy/) 또한 적용된다.

## 도움 받기 및 트러블슈팅 {#troubleshooting}

쿠버네티스 클러스터 트러블슈팅을 위한 
기본 도움말은 [이 섹션](/ko/docs/tasks/debug/)을 
먼저 찾아 본다.

이 섹션에는 몇 가지 추가 윈도우 관련 트러블슈팅 도움말이 포함되어 있다. 
로그는 쿠버네티스에서 트러블슈팅하는 데 중요한 요소이다. 
다른 기여자로부터 트러블슈팅 지원을 구할 때마다 이를 포함시켜야 한다. 
SIG Windows의 
[로그 수집에 대한 기여 가이드](https://github.com/kubernetes/community/blob/master/sig-windows/CONTRIBUTING.md#gathering-logs)의 
지침을 따른다.

### 이슈 리포팅 및 기능 요청

버그처럼 보이는 부분이 있거나 기능 요청을 하고 싶다면, 
[SIG Windows 기여 가이드](https://github.com/kubernetes/community/blob/master/sig-windows/CONTRIBUTING.md#reporting-issues-and-feature-requests)를 참고하여 
새 이슈를 연다. 먼저 이전에 이미 보고된 이슈가 있는지 검색하고, 
이슈에 대한 경험과 추가 로그를 기재해야 한다. 
티켓을 만들기 전에, 쿠버네티스 슬랙의 SIG Windows 채널 또한 
초기 지원 및 트러블슈팅 아이디어를 얻을 수 있는 좋은 곳이다.

## 배포 도구

kubeadm 도구는 클러스터를 관리할 컨트롤 플레인과 워크로드를 실행할 노드를 제공함으로써 
쿠버네티스 클러스터를 배포할 수 있게 해 준다. 
[윈도우 노드 추가하기](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/) 문서에서 
kubeadm을 사용해 어떻게 클러스터에 윈도우 노드를 배포하는지를 설명한다.

쿠버네티스 [클러스터 API](https://cluster-api.sigs.k8s.io/) 프로젝트는 윈도우 노드 배포를 자동화하는 수단을 제공한다.

## 윈도우 배포 채널

윈도우 배포 채널에 대한 자세한 설명은
[Microsoft 문서](https://docs.microsoft.com/ko-kr/windows-server/get-started-19/servicing-channels-19)를 참고한다.

각각의 Windows Server 서비스 채널 및 지원 모델은 
[Windows Server 서비스 채널](https://docs.microsoft.com/en-us/windows-server/get-started/servicing-channels-comparison)에서 
확인할 수 있다.
