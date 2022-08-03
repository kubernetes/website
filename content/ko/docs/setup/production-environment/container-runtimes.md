---



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
_dockershim_ 이라는 구성 요소를 사용하여 도커 엔진과의 직접 통합을 지원했다. 
이 특별한 직접 통합은 
더 이상 쿠버네티스에 포함되지 않는다(이 제거는 
v1.20 릴리스의 일부로 [공지](/blog/2020/12/08/kubernetes-1-20-release-announcement/#dockershim-deprecation)되었다). 
이 제거가 어떻게 영향을 미치는지 알아보려면 
[Dockershim 사용 중단이 영향을 미치는지 확인하기](/docs/tasks/administer-cluster/migrating-from-dockershim/check-if-dockershim-removal-affects-you/) 문서를 확인한다. 
dockershim을 사용하던 환경에서 이전(migrating)하는 방법을 보려면, 
[dockershim에서 이전하기](/docs/tasks/administer-cluster/migrating-from-dockershim/)를 확인한다.

v{{< skew currentVersion >}} 이외의 쿠버네티스 버전을 사용하고 있다면, 
해당 버전의 문서를 참고한다.
{{< /note >}}


<!-- body -->

## cgroup 드라이버

리눅스에서, {{< glossary_tooltip text="control group" term_id="cgroup" >}}은 
프로세스에 할당된 리소스를 제한하는데 사용된다.

리눅스 배포판의 init 시스템이 [systemd](https://www.freedesktop.org/wiki/Software/systemd/)인
경우, init 프로세스는 root control group(`cgroup`)을
생성 및 사용하는 cgroup 관리자로 작동한다.
Systemd는 cgroup과의 긴밀한 통합을 통해 프로세스당 cgroup을 할당한다.
컨테이너 런타임과 kubelet이 `cgroupfs`를 사용하도록 설정할 수 있다. systemd와 함께
`cgroupfs`를 사용하면 두 개의 서로 다른 cgroup 관리자가 존재하게 된다는 뜻이다.

단일 cgroup 관리자는 할당되는 리소스가 무엇인지를 단순화하고,
기본적으로 사용할 수 있는 리소스와 사용 중인 리소스를 일관성있게 볼 수 있다.
시스템에 두 개의 cgroup 관리자가 있으면, 이런 리소스도 두 개의 관점에서 보게 된다.
현장에서 사람들은 kubelet과 도커에 `cgroupfs`를 사용하고,
나머지 프로세스는 `systemd`를 사용하도록 노드가 설정된 경우, 리소스가 부족할 때
불안정해지는 사례를 보고했다.

컨테이너 런타임과 kubelet이 `systemd`를 cgroup 드라이버로 사용하도록 설정을 변경하면
시스템이 안정화된다. 도커에 대해 구성하려면, `native.cgroupdriver=systemd`를 설정한다.

{{< caution >}}
클러스터에 결합되어 있는 노드의 cgroup 관리자를 변경하는 것은 신중하게 수행해야 한다.
하나의 cgroup 드라이버의 의미를 사용하여 kubelet이 파드를 생성해왔다면,
컨테이너 런타임을 다른 cgroup 드라이버로 변경하는 것은 존재하는 기존 파드에 대해 파드 샌드박스 재생성을 시도할 때, 에러가 발생할 수 있다.
kubelet을 재시작하는 것은 에러를 해결할 수 없을 것이다.

자동화가 가능하다면, 업데이트된 구성을 사용하여 노드를 다른 노드로
교체하거나, 자동화를 사용하여 다시 설치한다.
{{< /caution >}}

### Cgroup 버전 2 {#cgroup-v2}

cgroup v2는 cgroup Linux API의 다음 버전이다. 
cgroup v1과는 다르게 각 컨트롤러마다 다른 계층 대신 단일 계층이 있다.

새 버전은 cgroup v1에 비해 몇 가지 향상된 기능을 제공하며, 개선 사항 중 일부는 다음과 같다.

- API를 더 쉽고 깔끔하게 사용할 수 있음
- 컨테이너로의 안전한 하위 트리 위임
- 압력 중지 정보와 같은 새로운 기능

일부 컨트롤러는 cgroup v1에 의해 관리되고 다른 컨트롤러는 cgroup v2에 의해 관리되는 하이브리드 구성을 지원하더라도, 
쿠버네티스는 모든 컨트롤러를 관리하기 위해 
동일한 cgroup 버전만 지원한다.

systemd가 기본적으로 cgroup v2를 사용하지 않는 경우, 커널 명령줄에 `systemd.unified_cgroup_hierarchy=1`을 
추가하여 cgroup v2를 사용하도록 시스템을 구성할 수 있다.

```shell
# 이 예제는 리눅스 OS에서 DNF 패키지 관리자를 사용하는 경우에 대한 것이다.
# 리눅스 커널이 사용하는 커맨드 라인을 설정하기 위해 
# 사용자의 시스템이 다른 방법을 사용하고 있을 수도 있다.
sudo dnf install -y grubby && \
  sudo grubby \
  --update-kernel=ALL \
  --args="systemd.unified_cgroup_hierarchy=1"
```

커널이 사용하는 커맨드 라인을 업데이트하려면, 
변경 사항을 적용하기 위해 노드를 재시작해야 한다.

cgroup v2로 전환할 때 사용자가 노드 또는 컨테이너 내에서 
cgroup 파일 시스템에 직접 접근하지 않는 한 사용자 경험에 현저한 차이가 없어야 한다.

cgroup v2를 사용하려면 CRI 런타임에서도 cgroup v2를 지원해야 한다.

### kubeadm으로 생성한 클러스터의 드라이버를 `systemd`로 변경하기

기존에 kubeadm으로 생성한 클러스터의 cgroup 드라이버를 `systemd`로 변경하려면, 
[cgroup 드라이버 설정하기](/docs/tasks/administer-cluster/kubeadm/configure-cgroup-driver/)를 참고한다.

## CRI 버전 지원 {#cri-versions}

사용할 컨테이너 런타임이 적어도 CRI의 v1alpha2 이상을 지원해야 한다.

쿠버네티스 {{< skew currentVersion >}} 버전에서는 기본적으로 CRI API 중 v1을 사용한다.
컨테이너 런타임이 v1 API를 지원하지 않으면, 
kubelet은 대신 (사용 중단된) v1alpha2 API를 사용하도록 설정된다.

## 컨테이너 런타임

{{% thirdparty-content %}}


### containerd

이 섹션에는 containerd를 CRI 런타임으로 사용하는 데 필요한 단계를 간략하게 설명한다.

다음 명령을 사용하여 시스템에 containerd를 설치한다.

1. 필수 구성 요소를 설치 및 구성한다.

   (이 지침은 리눅스 노드에만 적용된다)

   ```shell
   cat <<EOF | sudo tee /etc/modules-load.d/containerd.conf
   overlay
   br_netfilter
   EOF

   sudo modprobe overlay
   sudo modprobe br_netfilter

   # 필요한 sysctl 파라미터를 설정하면 재부팅 후에도 유지된다.
   cat <<EOF | sudo tee /etc/sysctl.d/99-kubernetes-cri.conf
   net.bridge.bridge-nf-call-iptables  = 1
   net.ipv4.ip_forward                 = 1
   net.bridge.bridge-nf-call-ip6tables = 1
   EOF

   # 재부팅하지 않고 sysctl 파라미터 적용
   sudo sysctl --system
   ```

1. containerd를 설치한다.

   [containerd 시작하기](https://github.com/containerd/containerd/blob/main/docs/getting-started.md) 
   문서를 확인하고, 
   유효한 환경 설정 파일(`config.toml`)을 작성하는 부분까지의 
   가이드를 따른다. 
   리눅스에서, 이 파일은 `/etc/containerd/config.toml`에 존재한다. 
   윈도우에서, 이 파일은 `C:\Program Files\containerd\config.toml`에 존재한다.

리눅스에서, containerd를 위한 기본 CRI 소켓은 `/run/containerd/containerd.sock`이다.
윈도우에서, 기본 CRI 엔드포인트는 `npipe://./pipe/containerd-containerd`이다.

#### `systemd` cgroup 드라이버 환경 설정하기 {#containerd-systemd}

`/etc/containerd/config.toml` 의 `systemd` cgroup 드라이버를 `runc` 에서 사용하려면, 다음과 같이 설정한다.

```
[plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc]
  ...
  [plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc.options]
    SystemdCgroup = true
```

이 변경 사항을 적용하려면, containerd를 재시작한다.

```shell
sudo systemctl restart containerd
```

kubeadm을 사용하는 경우,
[kubelet용 cgroup 드라이버](/ko/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#컨트롤-플레인-노드에서-kubelet이-사용하는-cgroup-드라이버-구성)를 수동으로 구성한다.

### CRI-O

이 섹션은 CRI-O를 컨테이너 런타임으로 설치하는 필수적인 단계를 담고 있다.

CRI-O를 설치하려면, [CRI-O 설치 방법](https://github.com/cri-o/cri-o/blob/main/install.md#readme)을 따른다.

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

CRI-O의 경우, CRI 소켓은 기본적으로 `/var/run/crio/crio.sock`이다.

### 도커 엔진 {#docker}

{{< note >}}
아래의 지침은 
당신이 도커 엔진과 쿠버네티스를 통합하는 데 
[`cri-dockerd`](https://github.com/Mirantis/cri-dockerd) 어댑터를 사용하고 있다고 가정한다.
{{< /note >}}

1. 각 노드에서, [도커 엔진 설치하기](https://docs.docker.com/engine/install/#server)에 따라 
   리눅스 배포판에 맞게 도커를 설치한다.

2. [`cri-dockerd`](https://github.com/Mirantis/cri-dockerd) 소스 코드 저장소의 지침대로 
   `cri-dockerd`를 설치한다.

`cri-dockerd`의 경우, CRI 소켓은 기본적으로 `/run/cri-dockerd.sock`이다.

### 미란티스 컨테이너 런타임 {#mcr}

[미란티스 컨테이너 런타임](https://docs.mirantis.com/mcr/20.10/overview.html)(MCR)은 상용 컨테이너 런타임이며 
이전에는 도커 엔터프라이즈 에디션으로 알려져 있었다.

오픈소스인 [`cri-dockerd`](https://github.com/Mirantis/cri-dockerd) 컴포넌트를 이용하여 쿠버네티스에서 미란티스 컨테이너 런타임을 사용할 수 있으며, 
이 컴포넌트는 MCR에 포함되어 있다.

미란티스 컨테이너 런타임을 설치하는 방법에 대해 더 알아보려면, 
[MCR 배포 가이드](https://docs.mirantis.com/mcr/20.10/install.html)를 참고한다.

CRI 소켓의 경로를 찾으려면 
`cri-docker.socket`라는 이름의 systemd 유닛을 확인한다.

## {{% heading "whatsnext" %}}

컨테이너 런타임과 더불어, 클러스터에는 
동작하는 [네트워크 플러그인](/ko/docs/concepts/cluster-administration/networking/#쿠버네티스-네트워크-모델의-구현-방법)도 필요하다.
