---





title: 쿠버네티스에서 윈도우 컨테이너
content_type: concept
weight: 65
---

<!-- overview -->

{{< note >}}
본 문서의 영어 원문([Windows containers in Kubernetes](/docs/setup/production-environment/windows/intro-windows-in-kubernetes/))은 변경되었습니다.

최신 내용은 원문을 통해 확인하시기 바랍니다.

본 문서에 대한 갱신은 기여를 통해 진행되며, 갱신이 완료되면 해당 알림은 제거됩니다.
{{< /note >}}

윈도우 애플리케이션은 많은 조직에서 실행되는 서비스 및
애플리케이션의 상당 부분을 구성한다.
[윈도우 컨테이너](https://aka.ms/windowscontainers)는 프로세스와 패키지 종속성을
캡슐화하는 현대적인 방법을 제공하여, 데브옵스(DevOps)
사례를 더욱 쉽게 사용하고 윈도우 애플리케이션의 클라우드 네이티브 패턴을 따르도록 한다.
쿠버네티스는 사실상의 표준 컨테이너 오케스트레이터가 되었으며,
쿠버네티스 1.14 릴리스에는 쿠버네티스 클러스터의 윈도우 노드에서 윈도우
컨테이너 스케줄링을 위한 프로덕션 지원이 포함되어 있어, 광범위한 윈도우 애플리케이션 생태계가
쿠버네티스의 강력한 기능을 활용할 수 있다. 윈도우 기반 애플리케이션과
리눅스 기반 애플리케이션에 투자한 조직은 워크로드를 관리하기 위해
별도의 오케스트레이터를 찾을 필요가 없으므로,
운영 체제와 관계없이 배포 전반에 걸쳐
운영 효율성이 향상된다.

<!-- body -->

## 쿠버네티스의 윈도우 컨테이너

쿠버네티스에서 윈도우 컨테이너 오케스트레이션을 활성화하려면, 기존
리눅스 클러스터에 윈도우 노드를 포함한다. 쿠버네티스의
{{< glossary_tooltip text="파드" term_id="pod" >}}에서 윈도우 컨테이너를 스케줄링하는 것은
리눅스 기반 컨테이너를 스케줄링하는 것과 유사하다.

윈도우 컨테이너를 실행하려면, 쿠버네티스 클러스터에 리눅스를
실행하는 컨트롤 플레인 노드와 사용자의 워크로드 요구에 따라 윈도우 또는 리눅스를
실행하는 워커가 있는 여러 운영 체제가 포함되어 있어야 한다. 윈도우
서버 2019는 윈도우에서
[쿠버네티스 노드](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/architecture/architecture.md#the-kubernetes-node)를
활성화하는 유일한 윈도우 운영 체제이다(kubelet,
[컨테이너 런타임](https://docs.microsoft.com/ko-kr/virtualization/windowscontainers/deploy-containers/containerd)
및 kube-proxy 포함). 윈도우 배포 채널에 대한 자세한 설명은
[Microsoft 문서](https://docs.microsoft.com/ko-kr/windows-server/get-started-19/servicing-channels-19)를 참고한다.

[마스터 컴포넌트](/ko/docs/concepts/overview/components/)를 포함한
쿠버네티스 컨트롤 플레인은
리눅스에서 계속 실행된다.
윈도우 전용 쿠버네티스 클러스터는 계획이 없다.

이 문서에서 윈도우 컨테이너에 대해 이야기할 때
프로세스 격리된 윈도우 컨테이너를 의미한다.
[Hyper-V 격리](https://docs.microsoft.com/ko-kr/virtualization/windowscontainers/manage-containers/hyperv-container)가
있는 윈도우 컨테이너는 향후 릴리스로 계획되어 있다.

## 지원되는 기능 및 제한

### 지원되는 기능

#### 윈도우 OS 버전 지원

쿠버네티스의 윈도우 운영 체제 지원은 다음 표를
참조한다. 단일 이기종 쿠버네티스 클러스터에는 윈도우 및
리눅스 워커 노드가 모두 있을 수 있다. 윈도우 컨테이너는 윈도우 노드에서,
리눅스 컨테이너는 리눅스 노드에서 스케줄되어야 한다.

| 쿠버네티스 버전 | 윈도우 서버 LTSC 릴리스 | 윈도우 서버 SAC 릴리스 |
| --- | --- | --- | --- |
| *Kubernetes v1.20* | Windows Server 2019 | Windows Server ver 1909, Windows Server ver 2004 |
| *Kubernetes v1.21* | Windows Server 2019 | Windows Server ver 2004, Windows Server ver 20H2 |
| *Kubernetes v1.22* | Windows Server 2019 | Windows Server ver 2004, Windows Server ver 20H2 |

지원 모델을 포함한 다양한 윈도우 서버
서비스 채널에 대한 정보는
[윈도우 서버 서비스 채널](https://docs.microsoft.com/ko-kr/windows-server/get-started-19/servicing-channels-19)에서 확인할 수 있다.

모든 윈도우 고객이 앱의 운영 체제를 자주 업데이트하는 것은
아니다. 애플리케이션 업그레이드를 위해서는 클러스터에 새 노드를
업그레이드하거나 도입하는 것이 필요하다. 이 문서에서
쿠버네티스에서 실행되는 컨테이너의 운영 체제를 업그레이드하기로 선택한
고객을 위해 새 운영 체제 버전에 대한 지원을 추가할 때의 가이드와
단계별 지침을 제공한다. 이 가이드에는 클러스터 노드와 함께 사용자 애플리케이션을
업그레이드하기 위한 권장 업그레이드 절차가 포함된다.
윈도우 노드는 현재 리눅스 노드와 동일한 방식으로 쿠버네티스
[버전-차이(skew) 정책](/ko/releases/version-skew-policy/)(노드 대 컨트롤 플레인
버전 관리)을 준수한다.


윈도우 서버 호스트 운영 체제에는
[윈도우 서버](https://www.microsoft.com/ko-kr/cloud-platform/windows-server-pricing)
라이선스가 적용된다. 윈도우 컨테이너 이미지에는
[윈도우 컨테이너에 대한 추가 사용 조건](https://docs.microsoft.com/en-us/virtualization/windowscontainers/images-eula)이 적용된다.

프로세스 격리가 포함된 윈도우 컨테이너에는 엄격한 호환성 규칙이 있으며,
[여기서 호스트 OS 버전은 컨테이너 베이스 이미지 OS 버전과 일치해야 한다](https://docs.microsoft.com/ko-kr/virtualization/windowscontainers/deploy-containers/version-compatibility).
일단 쿠버네티스에서 Hyper-V 격리가 포함된 윈도우 컨테이너를 지원하면,
제한 및 호환성 규칙이 변경될 것이다.

#### 퍼즈(Pause) 이미지 {#pause-image}

쿠버네티스는 윈도우 지원을 포함하는 다중 아키텍처 이미지를 유지보수한다.
쿠버네티스 v1.22의 경우 권장 퍼즈 이미지는 `k8s.gcr.io/pause:3.5`이다.
[소스 코드](https://github.com/kubernetes/kubernetes/tree/master/build/pause)는 
GitHub에서 찾을 수 있다.

Microsoft는 리눅스, 윈도우 amd64를 지원하는 다중 아키텍처 이미지를 `mcr.microsoft.com/oss/kubernetes/pause:3.5`에서 유지보수하고 있다.
이 이미지는 쿠버네티스가 유지 관리하는 이미지와 동일한 소스코드에서 생성되었지만, 모든 윈도우 바이너리는 Microsoft에 의해 서명된 [인증 코드](https://docs.microsoft.com/en-us/windows-hardware/drivers/install/authenticode)이다.
프로덕션 환경에서 서명된 바이너리가 필요한 경우, Microsoft가 유지 관리하는 이미지를 사용하는 것을 권장한다.

#### 컴퓨트

API 및 kubectl의 관점에서, 윈도우 컨테이너는
리눅스 기반 컨테이너와 거의 같은 방식으로 작동한다. 그러나
[제한 섹션](#제한)에 요약된 주요 기능에는
몇 가지 눈에 띄는 차이점이 있다.

윈도우에서 주요 쿠버네티스 요소는 리눅스와 동일한 방식으로 작동한다. 이
섹션에서는, 주요 워크로드 인에이블러(enabler) 일부와 이들이 윈도우에 매핑되는 방법에
대해 설명한다.

* [파드](/ko/docs/concepts/workloads/pods/)

  파드는 쿠버네티스의 기본 빌딩 블록이다 - 쿠버네티스 오브젝트 모델에서
  생성하고 배포하는 가장 작고 간단한 단위. 동일한 파드에
  윈도우 및 리눅스 컨테이너를 배포할 수 없다. 파드의 모든 컨테이너는
  단일 노드로 스케줄되며 각 노드는 특정 플랫폼 및
  아키텍처를 나타낸다. 다음과 같은 파드 기능, 속성 및
  이벤트가 윈도우 컨테이너에서 지원된다.

  * 프로세스 분리 및 볼륨 공유 기능을 갖춘 파드 당 하나 또는 여러 개의 컨테이너
  * 파드 상태 필드
  * 준비성(readiness) 및 활성 프로브(liveness probe)
  * postStart 및 preStop 컨테이너 라이프사이클 이벤트
  * 컨피그맵(ConfigMap), 시크릿(Secrets): 환경 변수 또는 볼륨으로
  * EmptyDir
  * 명명된 파이프 호스트 마운트
  * 리소스 제한
* [컨트롤러](/ko/docs/concepts/workloads/controllers/)

  쿠버네티스 컨트롤러는 파드의 의도한 상태(desired state)를 처리한다. 윈도우
  컨테이너에서 지원되는 워크로드 컨트롤러는 다음과 같다.

  * 레플리카셋(ReplicaSet)
  * 레플리케이션컨트롤러(ReplicationController)
  * 디플로이먼트(Deployment)
  * 스테이트풀셋(StatefulSet)
  * 데몬셋(DaemonSet)
  * 잡(Job)
  * 크론잡(CronJob)
* [서비스](/ko/docs/concepts/services-networking/service/)

  쿠버네티스 서비스는 논리적인 파드 집합과 그것에(마이크로 서비스라고도 함)
  접근하는 정책을 정의하는 추상화 개념이다. 상호-운영 체제
  연결을 위해 서비스를 사용할 수 있다. 윈도우에서 서비스는
  다음의 유형, 속성 및 기능을 활용할 수 있다.

  * 서비스 환경 변수
  * 노드포트(NodePort)
  * 클러스터IP(ClusterIP)
  * 로드밸런서(LoadBalancer)
  * ExternalName
  * 헤드리스 서비스(Headless services)

파드, 컨트롤러 및 서비스는 쿠버네티스에서 윈도우 워크로드를
관리하는데 중요한 요소이다. 그러나 그 자체로는 동적 클라우드 네이티브 환경에서
윈도우 워크로드의 적절한 수명 주기 관리를 수행하기에
충분하지 않다. 다음 기능에 대한 지원이 추가되었다.

* 파드와 컨테이너 메트릭
* Horizontal Pod Autoscaler 지원
* kubectl Exec
* 리소스쿼터(Resource Quotas)
* 스케쥴러 선점(preemption)

#### 컨테이너 런타임

##### Docker EE

{{< feature-state for_k8s_version="v1.14" state="stable" >}}

Docker EE-basic 19.03 이상은 모든 윈도우 서버 버전에 대해 권장되는
컨테이너 런타임이다. 이것은 kubelet에 포함된 dockershim 코드와 함께 작동한다.

##### CRI-ContainerD

{{< feature-state for_k8s_version="v1.20" state="stable" >}}

{{< glossary_tooltip term_id="containerd" text="ContainerD" >}} 1.4.0+는
윈도우 쿠버네티스 노드의 컨테이너 런타임으로도 사용할 수 있다.

[윈도우에 ContainerD 설치](/ko/docs/setup/production-environment/container-runtimes/#containerd-설치)
방법을 확인한다.


#### IPv4/IPv6 이중 스택

`IPv6DualStack` [기능 게이트](/ko/docs/reference/command-line-tools-reference/feature-gates/)를
사용하여 `l2bridge` 네트워크에 IPv4/IPv6 이중 스택 네트워킹을 활성화할 수 있다. 자세한 내용은
[IPv4/IPv6 이중 스택 활성화](/ko/docs/concepts/services-networking/dual-stack/#ipv4-ipv6-이중-스택-활성화)를
참조한다.

윈도우에서 쿠버네티스와 함께 IPv6를 사용하려면 윈도우 서버 버전 2004
(커널 버전 10.0.19041.610) 이상이 필요하다.

윈도우의 오버레이(VXLAN) 네트워크는 현재 이중 스택 네트워킹을 지원하지 않는다.

### 제한

윈도우는 쿠버네티스 아키텍처 및 컴포넌트 매트릭스에서 워커
노드로만 지원된다. 즉, 쿠버네티스 클러스터에는 항상 리눅스 마스터 노드가 반드시
포함되어야 하고, 0개 이상의 리눅스 워커 노드 및 0개 이상의 윈도우
워커 노드가 포함된다.

#### 기능 제한

* TerminationGracePeriod: 구현되지 않음
* 단일 파일 매핑: CRI-ContainerD로 구현 예정
* 종료 메시지: CRI-ContainerD로 구현 예정
* 특권을 가진(Privileged) 컨테이너: 현재 윈도우 컨테이너에서 지원되지 않음
* HugePages: 현재 윈도우 컨테이너에서 지원되지 않음
* 기존 노드 문제 감지기는 리눅스 전용이며 특권을 가진
  컨테이너가 필요하다. 윈도우에서 특권을 가진 컨테이너를 지원하지 않기 때문에
  일반적으로 윈도우에서 이 기능이 사용될 것으로 예상하지 않는다.
* 공유 네임스페이스의 모든 기능이 지원되는 것은 아니다. (자세한 내용은
  API 섹션 참조).

#### 각 플래그의 리눅스와의 차이점

윈도우 노드에서의 kubelet 플래그의 동작은 아래에 설명된 대로 다르게 동작한다.

* `--kubelet-reserve`, `--system-reserve`, `--eviction-hard` 플래그는
  Node Allocatable 업데이트

* `--enforce-node-allocable`을 사용한 축출(Eviction)은 구현되지 않았다.

* `--eviction-hard`와 `--eviction-soft`를 사용한 축출은 구현되지 않았다.

* MemoryPressure 조건은 구현되지 않았다.

* kubelet이 취한 OOM 축출 조치가 없다.

* 윈도우 노드에서 실행되는 Kubelet에는 메모리 제한이 없다.
  `--kubelet-reserve`와 `--system-reserve`는 호스트에서 실행되는 kubelet 또는
  프로세스에 제한을 설정하지 않는다. 이는 호스트의 kubelet 또는 프로세스가
  node-allocatable 및 스케줄러 외부에서 메모리 리소스 부족을 유발할 수 있음을
  의미한다.

* kubelet 프로세스의 우선 순위를 설정하는 추가 플래그는
  `--windows-priorityclass`라는 윈도우 노드에서 사용할 수 있다. 이 플래그를 사용하면
  kubelet 프로세스가 윈도우 호스트에서 실행중인 다른 프로세스와 비교할 때 더 많은 CPU 시간
  슬라이스을 얻을 수 있다. 허용되는 값과 그 의미에 대한 자세한 내용은
  [윈도우 우선순위 클래스](https://docs.microsoft.com/en-us/windows/win32/procthread/scheduling-priorities#priority-class)에서
  확인할 수 있다.
  kubelet이 항상 충분한 CPU주기를 갖도록 하려면
  이 플래그를 `ABOVE_NORMAL_PRIORITY_CLASS` 이상으로 설정하는 것이 좋다.

#### 스토리지

윈도우에는 컨테이너 계층을 마운트하고 NTFS를 기반으로 하는 복제 파일시스템을
만드는 레이어드(layered) 파일시스템 드라이버가 있다. 컨테이너의 모든 파일 경로는
해당 컨테이너의 컨텍스트 내에서만 확인된다.

* 도커 볼륨 마운트는 개별 파일이 아닌 컨테이너의
  디렉터리만 대상으로 할 수 있다. 이 제한은 CRI-containerD에는 존재하지 않는다.

* 볼륨 마운트는 파일이나 디렉터리를 호스트 파일시스템으로 다시
  투영할 수 없다.

* 읽기 전용 파일시스템은 윈도우 레지스트리 및 SAM 데이터베이스에 항상
  쓰기 접근이 필요하기 때문에 지원되지 않는다. 그러나 읽기 전용
  볼륨은 지원된다.

* 볼륨 사용자 마스크(user-masks) 및 권한은 사용할 수 없다. SAM은
  호스트와 컨테이너 간에 공유되지 않기 때문에 이들 간에 매핑이 없다. 모든
  권한은 컨테이너 컨텍스트 내에서 해결된다.

결과적으로, 다음 스토리지 기능은 윈도우 노드에서 지원되지 않는다.

* 볼륨 하위 경로(subpath) 마운트. 전체 볼륨만 윈도우 컨테이너에 마운트할 수 있다.
* 시크릿에 대한 하위 경로 볼륨 마운트
* 호스트 마운트 프로젝션
* DefaultMode(UID/GID 종속성에 기인함)
* 읽기 전용 루트 파일시스템. 매핑된 볼륨은 여전히 읽기 전용을 지원한다.
* 블록 디바이스 매핑
* 저장 매체로서의 메모리
* uui/guid, 사용자별 리눅스 파일시스템 권한과 같은 파일시스템 기능
* NFS 기반 스토리지/볼륨 지원
* 마운트된 볼륨 확장(resizefs)

#### API

대부분의 Kubernetes API가 윈도우에서 작동하는 방식은 차이가 없다.
중요한 차이점은 OS와 컨테이너 런타임의 차이로
귀결된다. 특정 상황에서 파드 또는 컨테이너와 같은 워크로드 API의
일부 속성은 리눅스에서 구현되고 윈도우에서 실행되지 않는다는 가정 하에
설계되었다.

높은 수준에서 이러한 OS 개념은 다르다.

* ID - 리눅스는 정수형으로 표시되는 userID(UID) 및 groupID(GID)를
  사용한다. 사용자와 그룹 이름은 정식 이름이 아니다. UID+GID에 대한
  `/etc/groups` 또는 `/etc/passwd`의 별칭일 뿐이다. 윈도우는 윈도우
  보안 계정 관리자(Security Account Manager, SAM) 데이터베이스에
  저장된 더 큰 이진 보안 식별자(SID)를 사용한다. 이 데이터베이스는 호스트와
  컨테이너 간에 또는 컨테이너들 간에 공유되지 않는다.

* 파일 퍼미션 - 윈도우는 권한 및 UUID+GID의 비트 마스크(bitmask) 대신
  SID를 기반으로 하는 접근 제어 목록을 사용한다.

* 파일 경로 - 윈도우의 규칙은 `/` 대신 `\`를 사용하는 것이다. Go IO
  라이브러리는 두 가지 파일 경로 분리자를 모두 허용한다. 하지만, 컨테이너
  내부에서 해석되는 경로 또는 커맨드 라인을 설정할 때 `\`가 필요할 수
  있다.

* 신호(Signals) - 윈도우 대화형(interactive) 앱은 종료를 다르게 처리하며, 다음 중
  하나 이상을 구현할 수 있다.

  * UI 스레드는 `WM_CLOSE`를 포함하여 잘 정의된(well-defined) 메시지를 처리한다.

  * 콘솔 앱은 컨트롤 핸들러(Control Handler)를 사용하여 ctrl-c 또는 ctrl-break를 처리한다.

  * 서비스는 `SERVICE_CONTROL_STOP` 제어 코드를 수용할 수 있는
    Service Control Handler 함수를 등록한다.

종료 코드는 0일 때 성공, 0이 아닌 경우 실패인 동일한 규칙을 따른다.
특정 오류 코드는 윈도우와 리눅스에서 다를 수 있다. 그러나
쿠버네티스 컴포넌트(kubelet, kube-proxy)에서 전달된 종료 코드는
변경되지 않는다.

##### V1.Container

* V1.Container.ResourceRequirements.limits.cpu 및
  V1.Container.ResourceRequirements.limits.memory - 윈도우는 CPU 할당에 하드
  리밋(hard limit)을 사용하지 않는다. 대신 공유 시스템이 사용된다. 밀리코어를
  기반으로 하는 기존 필드는 윈도우 스케줄러가 뒤따르는 상대적인 공유로
  스케일된다.
  [참고: kuberuntime/helpers_windows.go](https://github.com/kubernetes/kubernetes/blob/master/pkg/kubelet/kuberuntime/helpers_windows.go),
  [참고: Microsoft 문서 내 리소스 제어](https://docs.microsoft.com/ko-kr/virtualization/windowscontainers/manage-containers/resource-controls)

  * Huge page는 윈도우 컨테이너 런타임에서 구현되지 않으며,
    사용할 수 없다. 컨테이너에 대해 구성할 수 없는
    [사용자 권한(privilege) 어설트](https://docs.microsoft.com/en-us/windows/desktop/Memory/large-page-support)가
    필요하다.

* V1.Container.ResourceRequirements.requests.cpu 및
  V1.Container.ResourceRequirements.requests.memory - 노드의 사용 가능한
  리소스에서 요청(requests)을 빼서, 노드에 대한 오버 프로비저닝을 방지하는데 사용할 수
  있다. 그러나 오버 프로비저닝된 노드에서 리소스를 보장하는 데는
  사용할 수 없다. 운영자가 오버 프로비저닝을 완전히 피하려는 경우
  모범 사례로 모든 컨테이너에 적용해야 한다.

* V1.Container.SecurityContext.allowPrivilegeEscalation - 윈도우에서는
  불가능하며, 어떤 기능도 연결되지 않는다.

* V1.Container.SecurityContext.Capabilities - POSIX 기능은 윈도우에서
  구현되지 않는다.

* V1.Container.SecurityContext.privileged - 윈도우는 특권을 가진 컨테이너를
  지원하지 않는다.

* V1.Container.SecurityContext.procMount - 윈도우에는 /proc 파일시스템이 없다.

* V1.Container.SecurityContext.readOnlyRootFilesystem - 윈도우에서는 불가능하며,
  레지스트리 및 시스템 프로세스가 컨테이너 내부에서 실행되려면 쓰기 권한이
  필요하다.

* V1.Container.SecurityContext.runAsGroup - 윈도우에서는 불가능하며, GID 지원이 없다.

* V1.Container.SecurityContext.runAsNonRoot - 윈도우에는 root 사용자가
  없다. 가장 가까운 항목은 노드에 존재하지 않는 아이덴티티(identity)인
  ContainerAdministrator이다.

* V1.Container.SecurityContext.runAsUser - 윈도우에서는 불가능하며, 정수값으로의 UID
  지원이 없다.

* V1.Container.SecurityContext.seLinuxOptions - 윈도우에서는 불가능하며, SELinux가 없다.

* V1.Container.terminationMessagePath - 윈도우가 단일 파일 매핑을 지원하지
  않는다는 점에서 몇 가지 제한이 있다. 기본값은 /dev/termination-log이며, 기본적으로 윈도우에 존재하지 않기 때문에
  작동한다.

##### V1.Pod

* V1.Pod.hostIPC, v1.pod.hostpid - 윈도우에서 호스트 네임스페이스 공유가 불가능하다.

* V1.Pod.hostNetwork - 호스트 네트워크를 공유하기 위한 윈도우 OS 지원이 없다.

* V1.Pod.dnsPolicy - ClusterFirstWithHostNet - 윈도우에서 호스트 네트워킹이 지원되지 않기 때문에
  지원되지 않는다.

* V1.Pod.podSecurityContext - 아래 V1.PodSecurityContext 내용을 참고한다.

* V1.Pod.shareProcessNamespace - 이것은 베타 기능이며, 윈도우에서 구현되지 않은
  리눅스 네임스페이스에 따라 다르다. 윈도우는 프로세스 네임스페이스 또는
  컨테이너의 루트 파일시스템을 공유할 수 없다. 네트워크만 공유할 수
  있다.

* V1.Pod.terminationGracePeriodSeconds - 이것은 윈도우의 도커에서
  완전히 구현되지 않았다.
  [참조](https://github.com/moby/moby/issues/25982)의 내용을 참고한다. 현재 동작은
  `ENTRYPOINT` 프로세스가 `CTRL_SHUTDOWN_EVENT`로 전송된 다음, 윈도우가 기본적으로 5초를
  기다린 후, 마지막으로 정상적인 윈도우 종료 동작을 사용하여 모든 프로세스를
  종료하는 것이다. 5초 기본값은 실제로
  [컨테이너 내부](https://github.com/moby/moby/issues/25982#issuecomment-426441183)
  윈도우 레지스트리에 있으므로 컨테이너를 빌드할 때 재정의 할 수 있다.

* V1.Pod.volumeDevices - 이것은 베타 기능이며, 윈도우에서 구현되지
  않는다. 윈도우는 원시 블록 장치(raw block device)를 파드에 연결할 수 없다.

* V1.Pod.volumes - EmptyDir, 시크릿, 컨피그맵, HostPath - 모두 작동하며
  TestGrid에 테스트가 있다.

  * V1.emptyDirVolumeSource - 노드 기본 매체는 윈도우의 디스크이다.
    윈도우에는 내장 RAM 디스크가 없기 때문에 메모리는 지원되지 않는다.

* V1.VolumeMount.mountPropagation - 마운트 전파(propagation)는 윈도우에서 지원되지 않는다.

##### V1.PodSecurityContext

PodSecurityContext 필드는 윈도우에서 작동하지 않는다. 참조를 위해 여기에
나열한다.

* V1.PodSecurityContext.SELinuxOptions - SELinux는 윈도우에서 사용할 수 없다.

* V1.PodSecurityContext.RunAsUser - 윈도우에서는 사용할 수 없는 UID를 제공한다.

* V1.PodSecurityContext.RunAsGroup - 윈도우에서는 사용할 수 없는 GID를 제공한다.

* V1.PodSecurityContext.RunAsNonRoot - 윈도우에는 root 사용자가 없다. 가장
  가까운 항목은 노드에 존재하지 않는 아이덴티티인
  ContainerAdministrator이다.

* V1.PodSecurityContext.SupplementalGroups - 윈도우에서는 사용할 수 없는 GID를 제공한다.

* V1.PodSecurityContext.Sysctls - 이것들은 리눅스 sysctl 인터페이스의
  일부이다. 윈도우에는 이에 상응하는 것이 없다.

#### 운영 체제 버전 제한

윈도우에는 호스트 OS 버전이 컨테이너 베이스 이미지 OS 버전과 일치해야 하는
엄격한 호환성 규칙이 있다. 윈도우 서버 2019의 컨테이너
운영 체제가 있는 윈도우 컨테이너만 지원된다. 윈도우 컨테이너 이미지 버전의 일부
이전 버전과의 호환성을 가능하게 하는 컨테이너의 Hyper-V 격리는
향후 릴리스로 계획되어 있다.

## 도움 받기 및 트러블슈팅 {#troubleshooting}

쿠버네티스 클러스터 트러블슈팅을 위한 기본
도움말은 
[이 섹션](/ko/docs/tasks/debug/debug-cluster/)에서 먼저 찾아야 한다. 이
섹션에는 몇 가지 추가 윈도우 관련 트러블슈팅 도움말이 포함되어 있다.
로그는 쿠버네티스에서 트러블슈팅하는데 중요한 요소이다. 다른
기여자로부터 트러블슈팅 지원을 구할 때마다 이를 포함해야
한다. SIG-Windows
[로그 수집에 대한 기여 가이드](https://github.com/kubernetes/community/blob/master/sig-windows/CONTRIBUTING.md#gathering-logs)의 지침을 따른다.

## 이슈 리포팅 및 기능 요청

버그처럼 보이는 부분이 있거나 기능
요청을 하고 싶다면,
[GitHub 이슈 트래킹 시스템](https://github.com/kubernetes/kubernetes/issues)을
활용한다.
[GitHub](https://github.com/kubernetes/kubernetes/issues/new/choose)에서 이슈를 열고
SIG-Windows에 할당할 수 있다. 먼저 이전에 보고된 이슈 목록을 검색하고
이슈에 대한 경험을 언급하고 추가 로그를
첨부해야 한다. SIG-Windows 슬랙은 티켓을 만들기 전에 초기 지원 및
트러블슈팅 아이디어를 얻을 수 있는 좋은 방법이기도 하다.

## {{% heading "whatsnext" %}}

로드맵에는 많은 기능이 있다. 요약된 높은 수준의
목록이 아래에 포함되어 있지만,
[로드맵 프로젝트](https://github.com/orgs/kubernetes/projects/8)를 보고
[기여](https://github.com/kubernetes/community/blob/master/sig-windows/)하여
윈도우 지원을 개선하는데 도움이 주는 것이 좋다.

### Hyper-V 격리(isolation)

쿠버네티스에서 윈도우 컨테이너에 대해 다음 유스케이스를 사용하려면
Hyper-V 격리가 필요하다.

* 추가 보안을 위해 파드 간 하이퍼바이저 기반 격리

* 하위 호환성을 통해 컨테이너를 다시 빌드할 필요 없이 노드에서
  최신 윈도우 서버 버전을 실행할 수 있다.

* 파드에 대한 특정 CPU/NUMA 설정

* 메모리 격리 및 예약

Hyper-V 격리 지원은 이후 릴리스에 추가되며
CRI-Containerd가 필요하다.

### kubeadm 및 클러스터 API를 사용한 배포

Kubeadm은 사용자가 쿠버네티스 클러스터를 배포하기 위한 사실상의 표준이
되고 있다. kubeadm의 윈도우 노드 지원은 현재 작업 중이지만
[여기](/ko/docs/tasks/administer-cluster/kubeadm/adding-windows-nodes/)에서
가이드를 사용할 수 있다.
또한 윈도우 노드가 적절하게 프로비저닝되도록 클러스터 API에
투자하고 있다.
