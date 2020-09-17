---
title: 컨테이너 런타임
content_type: concept
weight: 10
---
<!-- overview -->
{{< feature-state for_k8s_version="v1.6" state="stable" >}}
파드에서 컨테이너를 실행하기 위해 쿠버네티스는 컨테이너 런타임을 사용한다.
이 페이지는 다양한 런타임들에 대한 설치 지침을 담고 있다.



<!-- body -->


{{< caution >}}
컨테이너를 실행할 때 runc가 시스템 파일 디스크립터를 처리하는 방식에서 결함이 발견되었다.
악성 컨테이너는 이 결함을 사용하여 runc 바이너리의 내용을 덮어쓸 수 있으며
따라서 컨테이너 호스트 시스템에서 임의의 명령을 실행할 수 있다.

문제에 대한 자세한 내용은 [CVE-2019-5736](https://access.redhat.com/security/cve/cve-2019-5736)
를 참고한다.
{{< /caution >}}

### 적용 가능성

{{< note >}}
이 문서는 리눅스에 CRI를 설치하는 사용자를 위해 작성되었다.
다른 운영 체제의 경우, 해당 플랫폼과 관련된 문서를 찾아보자.
{{< /note >}}

이 가이드의 모든 명령은 `root`로 실행해야 한다.
예를 들어,`sudo`로 접두사를 붙이거나, `root` 사용자가 되어 명령을 실행한다.

### Cgroup 드라이버

리눅스 배포판의 init 시스템이 systemd인 경우, init 프로세스는
root control group(`cgroup`)을 생성 및 사용하는 cgroup 관리자로 작동한다.
Systemd는 cgroup과의 긴밀한 통합을 통해 프로세스당 cgroup을 할당한다.
컨테이너 런타임과 kubelet이 `cgroupfs`를 사용하도록 설정할 수 있다.
systemd와 함께`cgroupfs`를 사용하면 두 개의 서로 다른 cgroup 관리자가 존재하게 된다는 뜻이다.

Control group은 프로세스에 할당된 리소스를 제한하는데 사용된다.
단일 cgroup 관리자는 할당된 리소스가 무엇인지를 단순화하고,
기본적으로 사용가능한 리소스와 사용중인 리소스를 일관성있게 볼 수 있다.
관리자가 두 개인 경우, 이런 리소스도 두 개의 관점에서 보게 된다. kubelet과 Docker는
`cgroupfs`를 사용하고 나머지 프로세스는
`systemd`를 사용하도록 노드가 설정된 경우,
리소스가 부족할 때 불안정해지는 사례를 본 적이 있다.

컨테이너 런타임과 kubelet이 `systemd`를 cgroup 드라이버로 사용하도록 설정을 변경하면
시스템이 안정화된다. 아래의 도커 설정에서 `native.cgroupdriver=systemd` 옵션을 확인하라.

{{< caution >}}
클러스터에 결합되어 있는 노드의 cgroup 관리자를 변경하는 것은 권장하지 않는다.
하나의 cgroup 드라이버의 의미를 사용하여 kubelet이 파드를 생성해왔다면,
컨테이너 런타임을 다른 cgroup 드라이버로 변경하는 것은 존재하는 기존 파드에 대해 PodSandBox를 재생성을 시도할 때, 에러가 발생할 수 있다.
kubelet을 재시작 하는 것은 에러를 해결할 수 없을 것이다.
추천하는 방법은 워크로드에서 노드를 제거하고, 클러스터에서 제거한 다음 다시 결합시키는 것이다.
{{< /caution >}}

## 도커

각 머신들에 대해서, 도커를 설치한다.
버전 19.03.11이 추천된다. 그러나 1.13.1, 17.03, 17.06, 17.09, 18.06 그리고 18.09도 동작하는 것으로 알려져 있다.
쿠버네티스 릴리스 노트를 통해서, 최신에 검증된 도커 버전의 지속적인 파악이 필요하다.

시스템에 도커를 설치하기 위해서 아래의 커맨드들을 사용한다.

{{< tabs name="tab-cri-docker-installation" >}}
{{% tab name="Ubuntu 16.04+" %}}

```shell
# (도커 CE 설치)
## 리포지터리 설정
### apt가 HTTPS 리포지터리를 사용할 수 있도록 해주는 패키지 설치
apt-get update && apt-get install -y \
  apt-transport-https ca-certificates curl software-properties-common gnupg2
```

```shell
# 도커 공식 GPG 키 추가
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add -
```

```shell
# 도커 apt 리포지터리 추가.
add-apt-repository \
  "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) \
  stable"
```

```shell
# 도커 CE 설치.
apt-get update && apt-get install -y \
  containerd.io=1.2.13-2 \
  docker-ce=5:19.03.11~3-0~ubuntu-$(lsb_release -cs) \
  docker-ce-cli=5:19.03.11~3-0~ubuntu-$(lsb_release -cs)
```

```shell
# 도커 데몬 설정
cat > /etc/docker/daemon.json <<EOF
{
  "exec-opts": ["native.cgroupdriver=systemd"],
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "100m"
  },
  "storage-driver": "overlay2"
}
EOF
```

```shell
mkdir -p /etc/systemd/system/docker.service.d
```

```shell
# 도커 재시작.
systemctl daemon-reload
systemctl restart docker
```
{{% /tab %}}
{{% tab name="CentOS/RHEL 7.4+" %}}

```shell
# (도커 CE 설치)
## 리포지터리 설정
### 필요한 패키지 설치
yum install -y yum-utils device-mapper-persistent-data lvm2
```

```shell
## 도커 리포지터리 추가
yum-config-manager --add-repo \
  https://download.docker.com/linux/centos/docker-ce.repo
```

```shell
# 도커 CE 설치.
yum update -y && yum install -y \
  containerd.io-1.2.13 \
  docker-ce-19.03.11 \
  docker-ce-cli-19.03.11
```

```shell
## /etc/docker 생성.
mkdir /etc/docker
```

```shell
# 도커 데몬 설정.
cat > /etc/docker/daemon.json <<EOF
{
  "exec-opts": ["native.cgroupdriver=systemd"],
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "100m"
  },
  "storage-driver": "overlay2",
  "storage-opts": [
    "overlay2.override_kernel_check=true"
  ]
}
EOF
```

```shell
mkdir -p /etc/systemd/system/docker.service.d
```

```shell
# 도커 재시작.
systemctl daemon-reload
systemctl restart docker
```
{{% /tab %}}
{{< /tabs >}}

부팅 시 도커 서비스를 시작하려면, 다음 명령을 실행한다.

```shell
sudo systemctl enable docker
```

자세한 내용은 [공식 도커 설치 가이드](https://docs.docker.com/engine/installation/)
를 참고한다.

## CRI-O

이 섹션은 `CRI-O`를 CRI 런타임으로 설치하는 필수적인 단계를 담고 있다.

시스템에 CRI-O를 설치하기 위해서 다음의 커맨드를 사용한다.

{{< note >}}
CRI-O 메이저와 마이너 버전은 쿠버네티스 메이저와 마이너 버전이 일치해야 한다.
더 자세한 정보는 [CRI-O 호환 매트릭스](https://github.com/cri-o/cri-o)를 본다.
{{< /note >}}

### 선행 조건

```shell
modprobe overlay
modprobe br_netfilter

# 요구되는 sysctl 파라미터 설정, 이 설정은 재부팅 간에도 유지된다.
cat > /etc/sysctl.d/99-kubernetes-cri.conf <<EOF
net.bridge.bridge-nf-call-iptables  = 1
net.ipv4.ip_forward                 = 1
net.bridge.bridge-nf-call-ip6tables = 1
EOF

sysctl --system
```

{{< tabs name="tab-cri-cri-o-installation" >}}
{{% tab name="Debian" %}}

다음의 운영 체제에서 CRI-O를 설치하려면, 환경 변수 $OS를 아래의 표에서 적절한 필드로 설정한다.

| 운영 체제          | $OS               |
| ---------------- | ----------------- |
| Debian Unstable  | `Debian_Unstable` |
| Debian Testing   | `Debian_Testing`  |

<br />
그런 다음, `$VERSION` 을 사용자의 쿠버네티스 버전과 일치하는 CRI-O 버전으로 설정한다.
예를 들어, CRI-O 1.18을 설치하려면, `VERSION=1.18` 로 설정한다.
사용자의 설치를 특정 릴리스에 고정할 수 있다.
버전 1.18.3을 설치하려면, `VERSION=1.18:1.18.3` 을 설정한다.
<br />

그런 다음, 아래를 실행한다.
```shell
echo "deb https://download.opensuse.org/repositories/devel:/kubic:/libcontainers:/stable/$OS/ /" > /etc/apt/sources.list.d/devel:kubic:libcontainers:stable.list
echo "deb http://download.opensuse.org/repositories/devel:/kubic:/libcontainers:/stable:/cri-o:/$VERSION/$OS/ /" > /etc/apt/sources.list.d/devel:kubic:libcontainers:stable:cri-o:$VERSION.list

curl -L https://download.opensuse.org/repositories/devel:kubic:libcontainers:stable:cri-o:$VERSION/$OS/Release.key | apt-key add -
curl -L https://download.opensuse.org/repositories/devel:/kubic:/libcontainers:/stable/$OS/Release.key | apt-key add -

apt-get update
apt-get install cri-o cri-o-runc
```

{{% /tab %}}

{{% tab name="Ubuntu" %}}

다음의 운영 체제에서 CRI-O를 설치하려면, 환경 변수 $OS를 아래의 표에서 적절한 필드로 설정한다.

| 운영 체제          | $OS               |
| ---------------- | ----------------- |
| Ubuntu 20.04     | `xUbuntu_20.04`   |
| Ubuntu 19.10     | `xUbuntu_19.10`   |
| Ubuntu 19.04     | `xUbuntu_19.04`   |
| Ubuntu 18.04     | `xUbuntu_18.04`   |

<br />
그런 다음, `$VERSION` 을 사용자의 쿠버네티스 버전과 일치하는 CRI-O 버전으로 설정한다.
예를 들어, CRI-O 1.18을 설치하려면, `VERSION=1.18` 로 설정한다.
사용자의 설치를 특정 릴리스에 고정할 수 있다.
버전 1.18.3을 설치하려면, `VERSION=1.18:1.18.3` 을 설정한다.
<br />

그런 다음, 아래를 실행한다.
```shell
echo "deb https://download.opensuse.org/repositories/devel:/kubic:/libcontainers:/stable/$OS/ /" > /etc/apt/sources.list.d/devel:kubic:libcontainers:stable.list
echo "deb http://download.opensuse.org/repositories/devel:/kubic:/libcontainers:/stable:/cri-o:/$VERSION/$OS/ /" > /etc/apt/sources.list.d/devel:kubic:libcontainers:stable:cri-o:$VERSION.list

curl -L https://download.opensuse.org/repositories/devel:kubic:libcontainers:stable:cri-o:$VERSION/$OS/Release.key | apt-key add -
curl -L https://download.opensuse.org/repositories/devel:/kubic:/libcontainers:/stable/$OS/Release.key | apt-key add -

apt-get update
apt-get install cri-o cri-o-runc
```
{{% /tab %}}

{{% tab name="CentOS" %}}

다음의 운영 체제에서 CRI-O를 설치하려면, 환경 변수 $OS를 아래의 표에서 적절한 필드로 설정한다.

| 운영 체제          | $OS               |
| ---------------- | ----------------- |
| Centos 8         | `CentOS_8`        |
| Centos 8 Stream  | `CentOS_8_Stream` |
| Centos 7         | `CentOS_7`        |

<br />
그런 다음, `$VERSION` 을 사용자의 쿠버네티스 버전과 일치하는 CRI-O 버전으로 설정한다.
예를 들어, CRI-O 1.18을 설치하려면, `VERSION=1.18` 로 설정한다.
사용자의 설치를 특정 릴리스에 고정할 수 있다.
버전 1.18.3을 설치하려면, `VERSION=1.18:1.18.3` 을 설정한다.
<br />

그런 다음, 아래를 실행한다.
```shell
curl -L -o /etc/yum.repos.d/devel:kubic:libcontainers:stable.repo https://download.opensuse.org/repositories/devel:/kubic:/libcontainers:/stable/$OS/devel:kubic:libcontainers:stable.repo
curl -L -o /etc/yum.repos.d/devel:kubic:libcontainers:stable:cri-o:$VERSION.repo https://download.opensuse.org/repositories/devel:kubic:libcontainers:stable:cri-o:$VERSION/$OS/devel:kubic:libcontainers:stable:cri-o:$VERSION.repo
yum install cri-o
```

{{% /tab %}}

{{% tab name="openSUSE Tumbleweed" %}}

```shell
sudo zypper install cri-o
```
{{% /tab %}}
{{% tab name="Fedora" %}}

`$VERSION` 을 사용자의 쿠버네티스 버전과 일치하는 CRI-O 버전으로 설정한다.
예를 들어, CRI-O 1.18을 설치하려면, `VERSION=1.18` 로 설정한다.

사용할 수 있는 버전을 찾으려면 다음을 실행한다.
```shell
dnf module list cri-o
```
CRI-O는 Fedora에서 특정 릴리스를 고정하여 설치하는 방법은 지원하지 않는다.

그런 다음, 아래를 실행한다.
```shell
dnf module enable cri-o:$VERSION
dnf install cri-o
```

{{% /tab %}}
{{< /tabs >}}

### CRI-O 시작

```shell
systemctl daemon-reload
systemctl start crio
```

자세한 사항은 [CRI-O 설치 가이드](https://github.com/kubernetes-sigs/cri-o#getting-started)를
참고한다.

## Containerd

이 섹션은 `containerd`를 CRI 런타임으로써 사용하는데 필요한 단계를 담고 있다.

Containerd를 시스템에 설치하기 위해서 다음의 커맨드들을 사용한다.

### 선행 조건

```shell
cat > /etc/modules-load.d/containerd.conf <<EOF
overlay
br_netfilter
EOF

modprobe overlay
modprobe br_netfilter

# 요구되는 sysctl 파라미터 설정, 이 설정은 재부팅에서도 유지된다.
cat > /etc/sysctl.d/99-kubernetes-cri.conf <<EOF
net.bridge.bridge-nf-call-iptables  = 1
net.ipv4.ip_forward                 = 1
net.bridge.bridge-nf-call-ip6tables = 1
EOF

sysctl --system
```

### containerd 설치

{{< tabs name="tab-cri-containerd-installation" >}}
{{% tab name="Ubuntu 16.04" %}}

```shell
# (containerd 설치)
## 리포지터리 설정
### apt가 HTTPS로 리포지터리를 사용하는 것을 허용하기 위한 패키지 설치
apt-get update && apt-get install -y apt-transport-https ca-certificates curl software-properties-common
```

```shell
## 도커 공식 GPG 키 추가
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add -
```

```shell
## 도커 apt 리포지터리 추가.
add-apt-repository \
    "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
    $(lsb_release -cs) \
    stable"
```

```shell
## containerd 설치
apt-get update && apt-get install -y containerd.io
```

```shell
# containerd 설정
mkdir -p /etc/containerd
containerd config default > /etc/containerd/config.toml
```

```shell
# containerd 재시작
systemctl restart containerd
```
{{% /tab %}}
{{% tab name="CentOS/RHEL 7.4+" %}}

```shell
# (containerd 설치)
## 리포지터리 설정
### 필요한 패키지 설치
yum install -y yum-utils device-mapper-persistent-data lvm2
```

```shell
## 도커 리포지터리 추가
yum-config-manager \
    --add-repo \
    https://download.docker.com/linux/centos/docker-ce.repo
```

```shell
## containerd 설치
yum update -y && yum install -y containerd.io
```

```shell
## containerd 설정
mkdir -p /etc/containerd
containerd config default > /etc/containerd/config.toml
```

```shell
# containerd 재시작
systemctl restart containerd
```
{{% /tab %}}
{{% tab name="윈도우 (PowerShell)" %}}
```powershell
# (containerd 설치)
# containerd 다운로드
cmd /c curl -OL https://github.com/containerd/containerd/releases/download/v1.4.0-beta.2/containerd-1.4.0-beta.2-windows-amd64.tar.gz
cmd /c tar xvf .\containerd-1.4.0-beta.2-windows-amd64.tar.gz
```

```powershell
# 압축을 풀고 구성
Copy-Item -Path ".\bin\" -Destination "$Env:ProgramFiles\containerd" -Recurse -Force
cd $Env:ProgramFiles\containerd\
.\containerd.exe config default | Out-File config.toml -Encoding ascii

# 구성을 검토한다. 설정에 따라 아래를 조정할 수 있다.
# - sandbox_image (쿠버네티스 pause 이미지)
# - cni bin_dir 및 conf_dir 위치
Get-Content config.toml
```

```powershell
# containerd 시작
.\containerd.exe --register-service
Start-Service containerd
```
{{% /tab %}}
{{< /tabs >}}

### systemd

`systemd` cgroup driver를 사용하려면, `/etc/containerd/config.toml`에 다음을 설정한다.

```
[plugins.cri]
systemd_cgroup = true
```
kubeadm을 사용하는 경우에도 마찬가지로, 수동으로
[kubelet을 위한 cgroup 드라이버](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#configure-cgroup-driver-used-by-kubelet-on-control-plane-node)를 설정한다.

## 다른 CRI 런타임: frakti

자세한 정보는 [Frakti 빠른 시작 가이드](https://github.com/kubernetes/frakti#quickstart)를 참고한다.
