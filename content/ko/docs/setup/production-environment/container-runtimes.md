---
title: 컨테이너 런타임
content_template: templates/concept
weight: 10
---
{{% capture overview %}}
{{< feature-state for_k8s_version="v1.6" state="stable" >}}
파드에서 컨테이너를 실행하기 위해 쿠버네티스는 컨테이너 런타임을 사용한다.
이 페이지는 다양한 런타임들에 대한 설치 지침을 담고 있다.

{{% /capture %}}

{{% capture body %}}


{{< caution >}}
컨테이너를 실행할 때 runc가 시스템 파일 디스크립터를 처리하는 방식에서 결함이 발견되었다.
악성 컨테이너는 이 결함을 사용하여 runc 바이너리의 내용을 덮어쓸 수 있으며 
따라서 컨테이너 호스트 시스템에서 임의의 명령을 실행할 수 있다.

이 문제에 대한 자세한 내용은
[cve-2019-5736 : runc 취약점 ] (https://access.redhat.com/security/cve/cve-2019-5736) 참고하자.
{{< /caution >}}

### 적용 가능성

{{< note >}}
이 문서는 Linux에 CRI를 설치하는 사용자를 위해 작성되었다.
다른 운영 체제의 경우, 해당 플랫폼과 관련된 문서를 찾아보자.
{{< /note >}}

이 가이드의 모든 명령은 `root`로 실행해야 한다.
예를 들어,`sudo`로 접두사를 붙이거나, `root` 사용자가 되어 명령을 실행한다.

### Cgroup 드라이버

Linux 배포판의 init 시스템이 systemd인 경우, init 프로세스는 
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
시스템이 안정화된다. 아래의 Docker 설정에서 `native.cgroupdriver=systemd` 옵션을 확인하라.

{{< caution >}}
클러스터에 결합되어 있는 노드의 cgroup 관리자를 변경하는 것은 권장하지 않는다.
하나의 cgroup 드라이버의 의미를 사용하여 kubelet이 파드를 생성해왔다면, 
컨테이너 런타임을 다른 cgroup 드라이버로 변경하는 것은 존재하는 기존 파드에 대해 PodSandBox를 재생성을 시도할 때, 에러가 발생할 수 있다.
kubelet을 재시작 하는 것은 에러를 해결할 수 없을 것이다.
추천하는 방법은 워크로드에서 노드를 제거하고, 클러스터에서 제거한 다음 다시 결합시키는 것이다.
{{< /caution >}}

## Docker

각 머신들에 대해서, Docker를 설치한다.
버전 18.06.2가 추천된다. 그러나 1.11, 1.12, 1.13, 17.03 그리고 18.09도 동작하는 것으로 알려져 있다. 
쿠버네티스 릴리스 노트를 통해서, 최신에 검증된 Docker 버전의 지속적인 파악이 필요하다.

시스템에 Docker를 설치하기 위해서 아래의 커맨드들을 사용한다.

{{< tabs name="tab-cri-docker-installation" >}}
{{< tab name="Ubuntu 16.04" codelang="bash" >}}
# Docker CE 설치
## 리포지터리 설정
### apt가 HTTPS 리포지터리를 사용할 수 있도록 해주는 패키지 설치
apt-get update && apt-get install apt-transport-https ca-certificates curl software-properties-common

### Docker의 공식 GPG 키 추가
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add -

### Docker apt 리포지터리 추가.
add-apt-repository \
  "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) \
  stable"

## Docker CE 설치.
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
## 리포지터리 설정
### 필요한 패키지 설치.
yum install yum-utils device-mapper-persistent-data lvm2

### Docker 리포지터리 추가
yum-config-manager \
  --add-repo \
  https://download.docker.com/linux/centos/docker-ce.repo

## Docker CE 설치.
yum update && yum install docker-ce-18.06.2.ce

## /etc/docker 디렉터리 생성.
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
apt-get install cri-o-1.13

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

### containerd 설치

{{< tabs name="tab-cri-containerd-installation" >}}
{{< tab name="Ubuntu 16.04" codelang="bash" >}}
# containerd 설치
## 리포지터리 설정
### apt가 HTTPS로 리포지터리를 사용하는 것을 허용하기 위한 패키지 설치
apt-get update && apt-get install -y apt-transport-https ca-certificates curl software-properties-common

### Docker의 공식 GPG 키 추가
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add -

### Docker apt 리포지터리 추가.
add-apt-repository \
    "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
    $(lsb_release -cs) \
    stable"

## containerd 설치
apt-get update && apt-get install -y containerd.io

# containerd 설정
mkdir -p /etc/containerd
containerd config default > /etc/containerd/config.toml

# containerd 재시작
systemctl restart containerd
{{< /tab >}}
{{< tab name="CentOS/RHEL 7.4+" codelang="bash" >}}
# containerd 설치
## 리포지터리 설정
### 필요한 패키지 설치
yum install yum-utils device-mapper-persistent-data lvm2

### Docker 리포지터리 추가리
yum-config-manager \
    --add-repo \
    https://download.docker.com/linux/centos/docker-ce.repo

## containerd 설치
yum update && yum install containerd.io

# containerd 설정
mkdir -p /etc/containerd
containerd config default > /etc/containerd/config.toml

# containerd 재시작
systemctl restart containerd
{{< /tab >}}
{{< /tabs >}}

### systemd

`systemd` cgroup driver를 사용하려면, `/etc/containerd/config.toml`의 `plugins.cri.systemd_cgroup = true`을 설정한다.
kubeadm을 사용하는 경우에도 마찬가지로, 수동으로
[cgroup driver for kubelet](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#configure-cgroup-driver-used-by-kubelet-on-master-node)을 
설정해준다.

## 다른 CRI 런타임: frakti

자세한 정보는 [Frakti 빠른 시작 가이드](https://github.com/kubernetes/frakti#quickstart)를 참고한다.

{{% /capture %}}
