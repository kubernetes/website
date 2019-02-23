---
title: CRI 설치
content_template: templates/concept
weight: 100
---
{{% capture overview %}}
v1.6.0에서부터, 쿠버네티스는 CRI(컨테이너 런타임 인터페이스) 사용을 기본으로 지원한다.
이 페이지는 다양한 런타임들에 대한 설치 지침을 담고 있다.

{{% /capture %}}

{{% capture body %}}

다음의 커맨드들은 사용자의 운영체제에 따라 root로서 실행하길 바란다.
각 호스트에 SSH 접속 후 `sudo -i` 실행을 통해서 root 사용자가 될 수 있을 것이다.

{{< caution >}}
A flaw was found in the way runc handled system file descriptors when running containers.
A malicious container could use this flaw to overwrite contents of the runc binary and 
consequently run arbitrary commands on the container host system.

Please refer to this link for more information about this issue 
[cve-2019-5736 : runc vulnerability ] (https://access.redhat.com/security/cve/cve-2019-5736)
{{< /caution >}}

## Cgroup 드라이버

Linux 배포판의 init 시스템이 systemd인 경우, init 프로세스는 루트 cgroup을 생성 및 사용하고   
cgroup 관리자로 작동한다. Systemd는 cgroup과의 긴밀한 통합을 통해 
프로세스당 cgroup을 할당한다. 컨테이너 런타임과 kubelet이 
`cgroupfs`를 사용하도록 설정할 수 있다. 이 경우는 두 개의 서로 다른 cgroup 관리자가 존재하게 된다는 뜻이다.

Cgroup은 프로세스에 할당된 리소스를 제한하는데 사용된다. 
단일 cgroup 관리자는 할당된 리소스가 무엇인지를 단순화하고, 
기본적으로 사용가능한 리소스와 사용중인 리소스를 일관성있게 볼 수 있다. 
관리자가 두 개인 경우, 이런 리소스도 두 개의 관점에서 보게 된다. kubelet과 Docker는 
`cgroupfs`를 사용하고 나머지 프로세스는 
`systemd`를 사용하도록 노드가 설정된 경우, 
리소스가 부족할 때 불안정해지는 사례를 본 적이 있다.

컨테이너 런타임과 kubelet이 `systemd`를 cgroup 드라이버로 사용하도록 설정을 변경하면
시스템이 안정화된다. 아래의 Docker 설정에서 `native.cgroupdriver=systemd` 옵션을 확인하라.

## Docker

각 머신들에 대해서, Docker를 설치한다.
버전 18.06.2가 추천된다. 그러나 1.11, 1.12, 1.13, 17.03 그리고 18.09도 동작하는 것으로 알려져 있다. 
쿠버네티스 릴리스 노트를 통해서, 최신에 검증된 Docker 버전의 지속적인 파악이 필요하다.

시스템에 Docker를 설치하기 위해서 아래의 커맨드들을 사용한다.

{{< tabs name="tab-cri-docker-installation" >}}
{{< tab name="Ubuntu 16.04" codelang="bash" >}}
# Docker CE 설치
## 저장소 설정
### apt 패키지 인덱스 업데이트
    apt-get update

### apt가 HTTPS 저장소를 사용할 수 있도록 해주는 패키지 설치
    apt-get update && apt-get install apt-transport-https ca-certificates curl software-properties-common

### Docker의 공식 GPG 키 추가
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add -

### Docker apt 저장소 추가.
    add-apt-repository \
    "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
    $(lsb_release -cs) \
    stable"

## Docker ce 설치.
apt-get update && apt-get install docker-ce=18.06.2~ce~3-0~ubuntu

# 데몬 설정.
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

mkdir -p /etc/systemd/system/docker.service.d

# Docker 재시작.
systemctl daemon-reload
systemctl restart docker
{{< /tab >}}
{{< tab name="CentOS/RHEL 7.4+" codelang="bash" >}}

# Docker CE 설치
## 저장소 설정
### 필요한 패키지 설치.
    yum install yum-utils device-mapper-persistent-data lvm2

### Docker 저장소 추가
yum-config-manager \
    --add-repo \
    https://download.docker.com/linux/centos/docker-ce.repo

## Docker ce 설치.
yum update && yum install docker-ce-18.06.2.ce

## /etc/docker 디렉토리 생성.
mkdir /etc/docker

# 데몬 설정.
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

mkdir -p /etc/systemd/system/docker.service.d

# Docker 재시작.
systemctl daemon-reload
systemctl restart docker
{{< /tab >}}
{{< /tabs >}}

자세한 내용은 [공식 Docker 설치 가이드](https://docs.docker.com/engine/installation/)
를 참고한다.

## CRI-O

이 섹션은 `CRI-O`를 CRI 런타임으로 설치하는 필수적인 단계를 담고 있다.

시스템에 CRI-O를 설치하기 위해서 다음의 커맨드를 사용한다.

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
{{< tab name="Ubuntu 16.04" codelang="bash" >}}

# 선행 조건 설치
apt-get update
apt-get install software-properties-common

add-apt-repository ppa:projectatomic/ppa
apt-get update

# CRI-O 설치
apt-get install cri-o-1.11

{{< /tab >}}
{{< tab name="CentOS/RHEL 7.4+" codelang="bash" >}}

# 선행 조건 설치
yum-config-manager --add-repo=https://cbs.centos.org/repos/paas7-crio-311-candidate/x86_64/os/

# CRI-O 설치
yum install --nogpgcheck cri-o

{{< /tab >}}
{{< /tabs >}}

### CRI-O 시작

```
systemctl start crio
```

자세한 사항은 [CRI-O 설치 가이드](https://github.com/kubernetes-sigs/cri-o#getting-started)
를 참고한다.

## Containerd

이 섹션은 `containerd`를 CRI 런타임으로써 사용하는데 필요한 단계를 담고 있다. 

Containerd를 시스템에 설치하기 위해서 다음의 커맨드들을 사용한다.

### 선행 조건

```shell
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

{{< tabs name="tab-cri-containerd-installation" >}}
{{< tab name="Ubuntu 16.04+" codelang="bash" >}}
apt-get install -y libseccomp2
{{< /tab >}}
{{< tab name="CentOS/RHEL 7.4+" codelang="bash" >}}
yum install -y libseccomp
{{< /tab >}}
{{< /tabs >}}

### Containerd 설치

[Containerd 릴리스](https://github.com/containerd/containerd/releases)는 주기적으로 출판된다. 아래의 값들은 작성 당시에 가용한 최신 버전을 기준으로 하드코드 되었다. 새로운 버전과 해시는 [여기](https://storage.googleapis.com/cri-containerd-release)에서 참고한다.

```shell
# 요구되는 환경 변수 export.
export CONTAINERD_VERSION="1.1.2"
export CONTAINERD_SHA256="d4ed54891e90a5d1a45e3e96464e2e8a4770cd380c21285ef5c9895c40549218"

# containerd tar 다운로드.
wget https://storage.googleapis.com/cri-containerd-release/cri-containerd-${CONTAINERD_VERSION}.linux-amd64.tar.gz

# 해시 확인.
echo "${CONTAINERD_SHA256} cri-containerd-${CONTAINERD_VERSION}.linux-amd64.tar.gz" | sha256sum --check -

# 풀기.
tar --no-overwrite-dir -C / -xzf cri-containerd-${CONTAINERD_VERSION}.linux-amd64.tar.gz

# containerd 시작.
systemctl start containerd
```

## 다른 CRI 런타임: frakti

자세한 정보는 [Frakti 빠른 시작 가이드](https://github.com/kubernetes/frakti#quickstart)를 참고한다.

{{% /capture %}}
