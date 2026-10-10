---
title: cgroup v2에 대하여
content_type: concept
weight: 50
---

<!-- overview -->

리눅스에서, {{< glossary_tooltip text="컨트롤 그룹" term_id="cgroup" >}}은
프로세스에 할당되는 자원을 제한한다.

{{< glossary_tooltip text="kubelet" term_id="kubelet" >}}과
기반 컨테이너 런타임은 컨테이너화된 워크로드에 대한 CPU/메모리 요청 및 제한을 포함하는
[파드와 컨테이너를 위한 자원 관리](/ko/docs/concepts/configuration/manage-resources-containers/)를
강제하기 위해 cgroup과 연동해야 한다.

리눅스에는 두 가지 버전의 cgroup이 있다. cgroup v1과 cgroup v2. cgroup v2는
`cgroup` API의 새로운 세대이다.

<!-- body -->


## cgroup v2란 무엇인가 {#cgroup-v2}
{{< feature-state for_k8s_version="v1.25" state="stable" >}}

cgroup v2는 리눅스 `cgroup` API의 다음 버전이다. cgroup v2는 향상된
자원 관리 기능을 갖춘 통합 제어 시스템을
제공한다.

cgroup v2는 cgroup v1에 비해 다음과 같은 여러 개선 사항을 제공한다.

- API의 단일 통합 계층 구조 설계
- 컨테이너에 대한 더 안전한 서브트리 위임
- [Pressure Stall Information](https://www.kernel.org/doc/html/latest/accounting/psi.html)과 같은 새로운 기능
- 다중 자원에 걸친 향상된 자원 할당 관리 및 격리
  - 다양한 유형의 메모리 할당(네트워크 메모리, 커널 메모리 등)에 대한 통합 집계
  - 페이지 캐시 라이트백(write back)과 같은 즉각적이지 않은 자원 변경에 대한 집계

일부 쿠버네티스 기능은 향상된 자원 관리 및 격리를 위해
오직 cgroup v2만을 사용한다. 예를 들어,
[MemoryQoS](/ko/docs/concepts/workloads/pods/pod-qos/#memory-qos-with-cgroup-v2) 기능은 메모리 QoS를 향상시키고
cgroup v2 기본 요소에 의존한다.


## cgorup v2 사용하기 {#using-cgroupv2}

cgroup v2를 사용하는 권장 방식은 cgroup v2를 기본적으로 활성화하고 사용하는
리눅스 배포판을 이용하는 것이다.

사용 중인 배포판이 cgroup v2를 사용하는지 확인하려면, [리눅스 노드에서 cgroup 버전 확인하기](#check-cgroup-version)를 참조한다.

### 요구사항

cgroup v2에는 다음과 같은 요구 사항이 있다.

* OS 배포판에서 cgroup v2가 활성화되어 있어야 한다.
* 리눅스 커널 버전은 5.8 이상이어야 한다.
* 컨테이너 런타임이 cgroup v2를 지원해야 한다. 예를 들어,
  * [containerd](https://containerd.io/) v1.4 이상
  * [cri-o](https://cri-o.io/) v1.20 이상
* kubelet과 컨테이너 런타임은 [systemd cgroup 드라이버](/ko/docs/setup/production-environment/container-runtimes#systemd-cgroup-driver)를 사용하도록 구성되어야 한다.

### 리눅스 배포판 cgroup v2 지원

cgroup v2를 사용하는 리눅스 배포판 목록은, [cgroup v2 문서](https://github.com/opencontainers/runc/blob/main/docs/cgroup-v2.md)를 참조한다.

<!-- the list should be kept in sync with https://github.com/opencontainers/runc/blob/main/docs/cgroup-v2.md -->
* Container Optimized OS (M97 버전부터)
* Ubuntu (21.10 버전부터, 22.04+ 권장)
* Debian GNU/Linux (Debian 11 bullseye 버전부터)
* Fedora (31 버전부터)
* Arch Linux (2021년 4월부터)
* RHEL 및 RHEL 기반 배포판 (9 버전부터)

사용 중인 배포판이 cgroup v2를 사용하는지 확인하려면, 해당 배포판의
문서를 참조하거나 [리눅스 노드에서 cgroup 버전 확인하기](#check-cgroup-version)의 지침을 따른다.

또한 커널 cmdline 부트 인자를 수정하여 리눅스 배포판에서
cgroup v2를 수동으로 활성화할 수 있다. 사용 중인 배포판이 GRUB을 사용하는 경우,
`/etc/default/grub` 파일의 `GRUB_CMDLINE_LINUX`에
`systemd.unified_cgroup_hierarchy=1`을 추가한 다음, `sudo update-grub`을 실행해야 한다. 그러나,
권장되는 접근 방법은 cgroup v2를 기본적으로 활성화하는 배포판을 사용하는
것이다.

### cgroup v2로 마이그레이션 {#migrating-cgroupv2}

cgroup v2로 마이그레이션하려면, [요구 사항](#requirements)을 충족하는지 확인한 다음, cgroup v2를
기본적으로 활성화하는 커널 버전으로 업그레이드한다.

kubelet은 OS가 cgroup v2에서 실행 중임을 자동으로 감지하며
추가 구성 없이 그에 맞춰 작동한다.

사용자들이 노드나 컨테이너 내부에서
cgroup 파일 시스템에 직접 접근하지 않는 한,
cgroup v2로 전환할 때 사용자 경험에서 뚜렷한 차이는 없을 것이다.

cgroup v2는 cgroup v1과 다른 API를 사용하므로, cgroup 파일 시스템에
직접 접근하는 애플리케이션이 있다면, cgroup v2를
지원하는 새로운 버전으로 업데이트해야 한다. 예를 들어,

* 일부 서드파티 모니터링 및 보안 에이전트는 cgroup 파일 시스템에 의존할 수 있다.
 이러한 에이전트들을 cgroup v2를 지원하는 버전으로 업데이트 한다.
* [cAdvisor](https://github.com/google/cadvisor)를
 파드 및 컨테이너 모니터링을 위한 독립형 DaemonSet으로 실행하는 경우, v0.43.0 이상으로 업데이트 한다.
* 자바 애플리케이션을 배포하는 경우, cgroup v2를 완전히 지원하는 버전을 선호한다.
    * [OpenJDK / HotSpot](https://bugs.openjdk.org/browse/JDK-8230305): jdk8u372, 11.0.16, 15 이상
    * [IBM Semeru Runtimes](https://www.ibm.com/support/pages/apar/IJ46681): 8.0.382.0, 11.0.20.0, 17.0.8.0 이상
    * [IBM Java](https://www.ibm.com/support/pages/apar/IJ46681): 8.0.8.6 이상
* [uber-go/automaxprocs](https://github.com/uber-go/automaxprocs) 패키지를 사용하는 경우, 사용하는
  버전이 v1.5.1 이상인지 확인한다.

## 리눅스 노드에서 cgroup 버전 확인하기  {#check-cgroup-version}

cgroup 버전은 사용 중인 리눅스 배포판과 OS에 설정된
기본 cgroup 버전에 따라 결정된다. 배포판이 어떤 cgroup 버전을 사용하는지
확인하려면, 노드에서 `stat -fc %T /sys/fs/cgroup/` 명령을 
실행한다.

```shell
stat -fc %T /sys/fs/cgroup/
```

cgroup v2의 경우, 출력은 `cgroup2fs`이다.

cgroup v1의 경우, 출력은 `tmpfs`이다.

## {{% heading "whatsnext" %}}

- [cgroup](https://man7.org/linux/man-pages/man7/cgroups.7.html)에 대해 더 알아보기
- [컨테이너 런타임](/ko/docs/concepts/architecture/cri)에 대해 더 알아보기
- [cgroup 드라이버](/ko/docs/setup/production-environment/container-runtimes#cgroup-드라이버)에 대해 더 알아보기
