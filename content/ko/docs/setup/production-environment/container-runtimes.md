---
# reviewers:
# - vincepri
# - bart0sh
title: 컨테이너 런타임
content_type: concept
weight: 20
---
<!-- overview -->

{{% dockershim-removal %}}

파드가 노드에서 실행될 수 있도록 클러스터의 각 노드에
{{< glossary_tooltip text="컨테이너 런타임" term_id="container-runtime" >}}을
설치해야 한다. 이 페이지에서는 관련된 항목을 설명하고
노드 설정 관련 작업을 설명한다.

쿠버네티스 {{< skew currentVersion >}}에서는
{{< glossary_tooltip term_id="cri" text="컨테이너 런타임 인터페이스">}}(CRI) 요구사항을 만족하는
런타임을 사용해야 한다.

더 자세한 정보는 [CRI 버전 지원](#cri-versions)을 참조한다.

이 페이지는 쿠버네티스에서
여러 공통 컨테이너 런타임을 사용하는 방법에 대한 개요를 제공한다.

- [containerd](#containerd)
- [CRI-O](#cri-o)
- [도커 엔진](#docker)
- [미란티스 컨테이너 런타임](#mcr)

{{< note >}}
쿠버네티스 v1.24 이전 릴리스는
_도커심_ 이라는 구성 요소를 사용하여 도커 엔진과의 직접 통합을 지원했다.
이 특별한 직접 통합은
더 이상 쿠버네티스에 포함되지 않는다(이 제거는
v1.20 릴리스의 일부로 [공지](/blog/2020/12/08/kubernetes-1-20-release-announcement/#dockershim-deprecation)되었다).
이 제거가 어떻게 영향을 미치는지 알아보려면
[도커심 제거가 영향을 미치는지 확인하기](/docs/tasks/administer-cluster/migrating-from-dockershim/check-if-dockershim-removal-affects-you/) 문서를 확인한다.
도커심을 사용하던 환경에서 이전(migrating)하는 방법을 보려면,
[도커심에서 이전하기](/docs/tasks/administer-cluster/migrating-from-dockershim/)를 확인한다.

v{{< skew currentVersion >}} 이외의 쿠버네티스 버전을 사용하고 있다면,
해당 버전의 문서를 참고한다.
{{< /note >}}

<!-- body -->
## 필수 요소들 설치 및 구성하기

### 네트워크 구성

기본적으로 리눅스 커널은 인터페이스 간에 IPv4 패킷이
라우팅되는 것을 허용하지 않는다. 대부분의 쿠버네티스 클러스터 네트워킹 구현은
(필요한 경우) 이 설정을 변경하지만, 일부 구현은 관리자가 직접
설정해 주기를 기대할 수 있다. (일부 구현은 다른 sysctl 파라미터 설정이나
커널 모듈 로드 등을 기대할 수도 있으므로, 사용 중인 네트워크
구현의 문서를 확인한다.)

### IPv4 패킷 포워딩 활성화하기 {#prerequisite-ipv4-forwarding-optional}

IPv4 패킷 포워딩을 수동으로 활성화하려면 다음을 실행한다.

```bash
# 설정에 필요한 sysctl 파라미터이며, 재부팅 후에도 유지된다.
cat <<EOF | sudo tee /etc/sysctl.d/k8s.conf
net.ipv4.ip_forward = 1
EOF

# 재부팅 없이 sysctl 파라미터 적용
sudo sysctl --system
```

다음 명령으로 `net.ipv4.ip_forward`가 1로 설정되었는지 확인한다.

```bash
sysctl net.ipv4.ip_forward
```

## cgroup 드라이버

리눅스에서, {{< glossary_tooltip text="control group" term_id="cgroup" >}}은
프로세스에 할당된 리소스를 제한하는데 사용된다.

{{< glossary_tooltip text="kubelet" term_id="kubelet" >}}과
그에 연계된 컨테이너 런타임 모두 컨트롤 그룹(control group)들과 상호작용 해야 하는데, 이는
[파드 및 컨테이너 자원 관리](/docs/concepts/configuration/manage-resources-containers/)가 수정될 수 있도록 하고
cpu 혹은 메모리와 같은 자원의 요청(request)과 상한(limit)을 설정하기 위함이다. 컨트롤
그룹과 상호작용하기 위해서는, kubelet과 컨테이너 런타임이 *cgroup 드라이버*를 사용해야 한다.
매우 중요한 점은, kubelet과 컨테이너 런타임이 같은 cgroup 드라이버를
사용해야 하며 구성도 동일해야 한다는 것이다.

두 가지의 cgroup 드라이버가 이용 가능하다.

* [`cgroupfs`](#cgroupfs-cgroup-driver)
* [`systemd`](#systemd-cgroup-driver)

### cgroupfs 드라이버 {#cgroupfs-cgroup-driver}

`cgroupfs` 드라이버는 kubelet의 기본 cgroup 드라이버이다. `cgroupfs`
드라이버가 사용될 때, kubelet과 컨테이너 런타임은 직접적으로 
cgroup 파일시스템과 상호작용하여 cgroup들을 설정한다.

`cgroupfs` 드라이버가 권장되지 **않는** 때가 있는데,
[systemd](https://www.freedesktop.org/wiki/Software/systemd/)가
init 시스템인 경우이다. 이것은 systemd가 시스템에 단 하나의 cgroup 관리자만 있을 것으로 기대하기 때문이다.
또한, [cgroup v2](/docs/concepts/architecture/cgroups)를 사용할 경우에도 `cgroupfs` 대신
`systemd` cgroup 드라이버를 사용한다.

### systemd cgroup 드라이버 {#systemd-cgroup-driver}

리눅스 배포판의 init 시스템이 [systemd](https://www.freedesktop.org/wiki/Software/systemd/)인
경우, init 프로세스는 root control group(`cgroup`)을
생성 및 사용하는 cgroup 관리자로 작동한다.

systemd는 cgroup과 긴밀하게 통합되어 있으며 매 systemd 단위로 cgroup을
할당한다. 결과적으로, `systemd`를 init 시스템으로 사용하고 `cgroupfs`
드라이버를 사용하면, 그 시스템은 두 개의 다른 cgroup 관리자를 갖게 된다.

두 개의 cgroup 관리자는 시스템 상 사용 가능한 자원과 사용 중인 자원들에 대하여 두 가지 관점을 가져 혼동을
초래한다. 예를 들어, kubelet과 컨테이너 런타임은 `cgroupfs`를 사용하고
나머지 프로세스는 `systemd`를 사용하도록 노드를 구성한 경우, 노드가 
자원 압박으로 인해 불안정해질 수 있다.

이러한 불안정성을 줄이는 방법은, `systemd`가 init 시스템으로 선택되었을 때에는 `systemd`를
kubelet과 컨테이너 런타임의 cgroup 드라이버로 사용하는 것이다.

`systemd`를 cgroup 드라이버로 사용하려면,
[`KubeletConfiguration`](/docs/tasks/administer-cluster/kubelet-config-file/)의
`cgroupDriver` 옵션을 `systemd`로 설정한다. 예를 들면 다음과 같다.

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
...
cgroupDriver: systemd
```

{{< note >}}
v1.22 이후부터는 kubeadm으로 클러스터를 생성할 때 사용자가 `KubeletConfiguration` 하위의
`cgroupDriver` 필드를 설정하지 않으면, kubeadm이 기본값으로 `systemd`를 사용한다.
{{< /note >}}

`systemd`를 kubelet의 cgroup 드라이버로 구성했다면, 반드시
컨테이너 런타임의 cgroup 드라이버 또한 `systemd`로 설정해야 한다. 자세한 설명은
컨테이너 런타임에 대한 문서를 참조한다. 예를 들면 다음과 같다.

*  [containerd](#containerd-systemd)
*  [CRI-O](#cri-o)

쿠버네티스 {{< skew currentVersion >}}에서 `KubeletCgroupDriverFromCRI`
[기능 게이트](/docs/reference/command-line-tools-reference/feature-gates/)가 활성화되어 있고,
`RuntimeConfig` CRI RPC를 지원하는 컨테이너 런타임이 구동 중이라면, kubelet은 런타임으로부터
적절한 cgroup 드라이버를 자동으로 감지하고, kubelet 설정 안의
`cgroupDriver` 값을 무시한다.

하지만 오래된 컨테이너 런타임 버전(특히 containerd 1.y 이하)은
`RuntimeConfig` CRI RPC를 지원하지 않으며,
이 질의(query)에 올바르게 응답하지 못할 수 있다. 이 경우 kubelet은
자체 `--cgroup-driver` 플래그 값을 사용하도록 되돌아간다.

쿠버네티스 1.37에서는 이 폴백 동작이 제거되므로,
오래된 containerd 버전은 최신 kubelet에서 동작하지 않게 된다.

{{< caution >}}
클러스터에 결합되어 있는 노드의 cgroup 관리자를 변경하는 것은 신중하게 수행해야 한다.
하나의 cgroup 드라이버의 의미를 사용하여 kubelet이 파드를 생성해왔다면,
컨테이너 런타임을 다른 cgroup 드라이버로 변경하는 것은 존재하는 기존 파드에 대해 파드 샌드박스 재생성을 시도할 때, 에러가 발생할 수 있다.
kubelet을 재시작하는 것은 에러를 해결할 수 없을 것이다.

자동화가 가능하다면, 업데이트된 구성을 사용하여 노드를 다른 노드로
교체하거나, 자동화를 사용하여 다시 설치한다.
{{< /caution >}}


### kubeadm으로 생성한 클러스터의 드라이버를 `systemd`로 변경하기

기존에 kubeadm으로 생성한 클러스터의 cgroup 드라이버를 `systemd`로 변경하려면,
[cgroup 드라이버 설정하기](/docs/tasks/administer-cluster/kubeadm/configure-cgroup-driver/)를 참고한다.

## CRI 버전 지원 {#cri-versions}

컨테이너 런타임은 컨테이너 런타임 인터페이스 v1을 지원해야 한다.

쿠버네티스는 [v1.26부터](/blog/2022/11/18/upcoming-changes-in-kubernetes-1-26/#cri-api-removal)
CRI API의 v1 _만 지원한다._ 컨테이너 런타임이 v1 API를 지원하지 않으면,
kubelet은 노드로 등록되지 않는다.

## 컨테이너 런타임

{{% thirdparty-content %}}

### containerd

이 섹션에는 containerd를 CRI 런타임으로 사용하는 데 필요한 단계를 간략하게 설명한다.

시스템에 containerd를 설치하려면,
[containerd 시작하기](https://github.com/containerd/containerd/blob/main/docs/getting-started.md)의 지침에 따라 유효한
환경 설정 파일 `config.toml`을 생성한 뒤 이 단계로 돌아온다.

{{< tabs name="Finding your config.toml file" >}}
{{% tab name="Linux" %}}
`/etc/containerd/config.toml` 경로에서 파일을 찾을 수 있음.
{{% /tab %}}
{{< tab name="Windows" >}}
`C:\Program Files\containerd\config.toml` 경로에서 파일을 찾을 수 있음.
{{< /tab >}}
{{< /tabs >}}

리눅스에서, containerd를 위한 기본 CRI 소켓은 `/run/containerd/containerd.sock`이다.
윈도우에서, 기본 CRI 엔드포인트는 `npipe://./pipe/containerd-containerd`이다.

#### `systemd` cgroup 드라이버 환경 설정하기 {#containerd-systemd}

`runc`와 함께 `/etc/containerd/config.toml`에서 `systemd` cgroup 드라이버를 사용하려면,
사용 중인 containerd 버전에 따라 다음과 같이 설정한다.

Containerd 1.x 버전:

```
[plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc]
  ...
  [plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc.options]
    SystemdCgroup = true
```

Containerd 2.x 버전:

```
[plugins.'io.containerd.cri.v1.runtime'.containerd.runtimes.runc]
  ...
  [plugins.'io.containerd.cri.v1.runtime'.containerd.runtimes.runc.options]
    SystemdCgroup = true
```

[cgroup v2](/docs/concepts/architecture/cgroups)을 사용할 경우 `systemd` cgroup 드라이버가 권장된다.

{{< note >}}
만약 containerd를 패키지(RPM, `.deb` 등)를 통해 설치하였다면,
CRI integration 플러그인이 기본적으로 비활성화되어 있을 수 있다.

쿠버네티스에서 containerd를 사용하려면 CRI 지원이 활성화되어 있어야 한다.
`/etc/containerd/config.toml` 안의 `disabled_plugins` 목록에 `cri`가 포함되지 않도록 주의한다.
해당 파일을 변경했다면 `containerd`도 다시 시작한다.

초기 클러스터 설치 후 또는 CNI 설치 후 컨테이너 크래시 루프(crash loops)가 발생한다면,
패키지와 함께 제공된 containerd 설정에 호환되지 않는 설정 파라미터가 포함되어 있을 수 있다.
[getting-started.md](https://github.com/containerd/containerd/blob/main/docs/getting-started.md#advanced-topics)에
설명된 것처럼 `containerd config default > /etc/containerd/config.toml`로
containerd 설정을 초기화한 뒤,
위에서 설명한 설정 파라미터를 다시 적용하는 것을 고려한다.
{{< /note >}}

이 변경 사항을 적용하려면, containerd를 재시작한다.

```shell
sudo systemctl restart containerd
```

kubeadm을 사용하는 경우,
[kubelet용 cgroup driver](/docs/tasks/administer-cluster/kubeadm/configure-cgroup-driver/#configuring-the-kubelet-cgroup-driver)를 수동으로 구성한다.

쿠버네티스 v1.28에서는 cgroup 드라이버 자동 감지를 알파 기능으로
활성화할 수 있다. 자세한 내용은 [systemd cgroup 드라이버](#systemd-cgroup-driver)를
참조한다.

#### 샌드박스(pause) 이미지 덮어쓰기 {#override-pause-image-containerd}

[containerd 설정](https://github.com/containerd/containerd/blob/main/docs/cri/config.md)에서
아래와 같이 샌드박스 이미지를 덮어쓸 수 있다.

```toml
[plugins."io.containerd.grpc.v1.cri"]
  sandbox_image = "registry.k8s.io/pause:3.10"
```

설정 파일을 변경한 경우 역시 `systemctl restart containerd`를 통해 `containerd`를 재시작해야 할 수 있다.

### CRI-O

이 섹션은 CRI-O를 컨테이너 런타임으로 설치하는 필수적인 단계를 담고 있다.

CRI-O를 설치하려면, [CRI-O 설치 방법](https://github.com/cri-o/packaging/blob/main/README.md#usage)을 따른다.

#### cgroup 드라이버

CRI-O는 기본적으로 systemd cgroup 드라이버를 사용하며, 이는 대부분의 경우에 잘 동작할 것이다.
`cgroupfs` cgroup 드라이버로 전환하려면, `/etc/crio/crio.conf` 를 수정하거나
`/etc/crio/crio.conf.d/02-cgroup-manager.conf` 에 드롭-인(drop-in) 구성을 배치한다.
예를 들면 다음과 같다.

```toml
[crio.runtime]
conmon_cgroup = "pod"
cgroup_manager = "cgroupfs"
```

또한 `cgroupfs` 와 함께 CRI-O를 사용할 때 `pod` 값으로 설정해야 하는
변경된 `conmon_cgroup` 에 유의해야 한다. 일반적으로 kubelet(일반적으로 kubeadm을 통해 수행됨)과
CRI-O의 cgroup 드라이버 구성을 동기화 상태로
유지해야 한다.

쿠버네티스 v1.28에서는 cgroup 드라이버 자동 감지를 알파 기능으로
활성화할 수 있다. 자세한 내용은 [systemd cgroup 드라이버](#systemd-cgroup-driver)를
참조한다.

CRI-O의 경우, CRI 소켓은 기본적으로 `/var/run/crio/crio.sock`이다.

#### 샌드박스(pause) 이미지 덮어쓰기 {#override-pause-image-cri-o}

[CRI-O 설정](https://github.com/cri-o/cri-o/blob/main/docs/crio.conf.5.md)에서
아래와 같이 샌드박스 이미지를 덮어쓸 수 있다.

```toml
[crio.image]
pause_image="registry.k8s.io/pause:3.10"
```

이 옵션은 `systemctl reload crio` 혹은 `crio` 프로세스에 `SIGHUP`을 보내 변경사항을 적용하기 위한
live configuration reload 기능을 지원한다.

### 도커 엔진 {#docker}

{{< note >}}
아래의 지침은
당신이 도커 엔진과 쿠버네티스를 통합하는 데
[`cri-dockerd`](https://mirantis.github.io/cri-dockerd/) 어댑터를 사용하고 있다고 가정한다.
{{< /note >}}

1. 각 노드에서, [도커 엔진 설치하기](https://docs.docker.com/engine/install/#server)에 따라
   리눅스 배포판에 맞게 도커를 설치한다.

2. [`cri-dockerd`](https://mirantis.github.io/cri-dockerd/usage/install) 문서의 지침에 따라 설치를 진행한다.

`cri-dockerd`의 경우, CRI 소켓은 기본적으로 `/run/cri-dockerd.sock`이다.

### 미란티스 컨테이너 런타임 {#mcr}

[미란티스 컨테이너 런타임](https://docs.mirantis.com/mcr/25.0/overview.html)(MCR)은 상용 컨테이너 런타임이며
이전에는 도커 엔터프라이즈 에디션으로 알려져 있었다.

오픈소스 [`cri-dockerd`](https://mirantis.github.io/cri-dockerd/) 컴포넌트를 이용하여 쿠버네티스에서 미란티스 컨테이너 런타임을 사용할 수 있으며,
이 컴포넌트는 MCR에 포함되어 있다.

미란티스 컨테이너 런타임을 설치하는 방법에 대해 더 알아보려면,
[MCR 배포 가이드](https://docs.mirantis.com/mcr/25.0/install.html)를 참고한다.

CRI 소켓의 경로를 찾으려면
`cri-docker.socket`라는 이름의 systemd 유닛을 확인한다.

#### 샌드박스(pause) 이미지 덮어쓰기 {#override-pause-image-cri-dockerd-mcr}

`cri-dockerd` 어댑터는,
파드 인프라 컨테이너("pause image")를 위해 어떤 컨테이너 이미지를 사용할지 명시하는 커맨드라인 인자를 받는다.
해당 커맨드라인 인자는 `--pod-infra-container-image`이다.

## {{% heading "whatsnext" %}}

컨테이너 런타임과 더불어, 클러스터에는
[네트워크 플러그인](/docs/concepts/cluster-administration/networking/#쿠버네티스-네트워크-모델의-구현-방법)의 구동도 필요하다.
