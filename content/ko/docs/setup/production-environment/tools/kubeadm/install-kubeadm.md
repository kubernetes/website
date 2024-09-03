---
title: kubeadm 설치하기
content_type: task
weight: 10
card:
  name: setup
  weight: 20
  title: kubeadm 설정 도구 설치
---

<!-- overview -->

<img src="/images/kubeadm-stacked-color.png" align="right" width="150px"></img>
이 페이지에서는 `kubeadm` 툴박스 설치 방법을 보여준다.
이 설치 프로세스를 수행한 후 kubeadm으로 클러스터를 만드는 방법에 대한 자세한 내용은 [kubeadm으로 클러스터 생성하기](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/) 페이지를 참고한다.


## {{% heading "prerequisites" %}}


* 호환되는 리눅스 머신. 쿠버네티스 프로젝트는 데비안 기반 배포판, 레드햇 기반 배포판, 그리고 패키지 매니저를 사용하지 않는 경우에 대한 일반적인 가이드를 제공한다.
* 2 GB 이상의 램을 장착한 머신. (이 보다 작으면 사용자의 앱을 위한 공간이 거의 남지 않음)
* 2 이상의 CPU.
* 클러스터의 모든 머신에 걸친 전체 네트워크 연결. (공용 또는 사설 네트워크면 괜찮음)
* 모든 노드에 대해 고유한 호스트 이름, MAC 주소 및 product_uuid. 자세한 내용은 [여기](#verify-mac-address)를 참고한다.
* 컴퓨터의 특정 포트들 개방. 자세한 내용은 [여기](#check-required-ports)를 참고한다.
* 스왑의 비활성화. kubelet이 제대로 작동하게 하려면 **반드시** 스왑을 사용하지 않도록 설정한다.



<!-- steps -->

## MAC 주소 및 product_uuid가 모든 노드에 대해 고유한지 확인 {#verify-mac-address}

* 사용자는 `ip link` 또는 `ifconfig -a` 명령을 사용하여 네트워크 인터페이스의 MAC 주소를 확인할 수 있다.
* product_uuid는 `sudo cat /sys/class/dmi/id/product_uuid` 명령을 사용하여 확인할 수 있다.

일부 가상 머신은 동일한 값을 가질 수 있지만 하드웨어 장치는 고유한 주소를 가질
가능성이 높다. 쿠버네티스는 이러한 값을 사용하여 클러스터의 노드를 고유하게 식별한다.
이러한 값이 각 노드에 고유하지 않으면 설치 프로세스가
[실패](https://github.com/kubernetes/kubeadm/issues/31)할 수 있다.  

## 네트워크 어댑터 확인

네트워크 어댑터가 두 개 이상이고, 쿠버네티스 컴포넌트가 디폴트 라우트(default route)에서 도달할 수 없는
경우, 쿠버네티스 클러스터 주소가 적절한 어댑터를 통해 이동하도록 IP 경로를 추가하는 것이 좋다.

## 필수 포트 확인 {#check-required-ports}
[필수 포트들](/ko/docs/reference/networking/ports-and-protocols/)은
쿠버네티스 컴포넌트들이 서로 통신하기 위해서 열려 있어야
한다. 다음과 같이 [netcat](https://netcat.sourceforge.net)과 같은 도구를 이용하여 포트가 열려 있는지 확인해 볼 수 있다.

```shell
nc 127.0.0.1 6443 -v
```

사용자가 사용하는 파드 네트워크 플러그인은 특정 포트를 열어야 할 수도
있다. 이것은 각 파드 네트워크 플러그인마다 다르므로, 필요한 포트에 대한
플러그인 문서를 참고한다.

## 컨테이너 런타임 설치 {#installing-runtime}

파드에서 컨테이너를 실행하기 위해, 쿠버네티스는
{{< glossary_tooltip term_id="container-runtime" text="컨테이너 런타임" >}}을 사용한다.

기본적으로, 쿠버네티스는
{{< glossary_tooltip term_id="cri" text="컨테이너 런타임 인터페이스">}}(CRI)를
사용하여 사용자가 선택한 컨테이너 런타임과 인터페이스한다.

런타임을 지정하지 않으면, kubeadm은 잘 알려진 엔드포인트를 스캐닝하여 
설치된 컨테이너 런타임을 자동으로 감지하려고 한다.

컨테이너 런타임이 여러 개 감지되거나 하나도 감지되지 않은 경우, 
kubeadm은 에러를 반환하고 사용자가 어떤 것을 사용할지를 명시하도록 요청할 것이다.

더 많은 정보는 
[컨테이너 런타임](/ko/docs/setup/production-environment/container-runtimes/)을 참고한다.

{{< note >}}
도커 엔진은 컨테이너 런타임이 쿠버네티스와 호환되기 위한 요구 사항인 
[CRI](/ko/docs/concepts/architecture/cri/)를 만족하지 않는다. 
이러한 이유로, 추가 서비스인 [cri-dockerd](https://github.com/Mirantis/cri-dockerd)가 설치되어야 한다. 
cri-dockerd는 쿠버네티스 버전 1.24부터 kubelet에서 [제거](/dockershim/)된 
기존 내장 도커 엔진 지원을 기반으로 한 프로젝트이다.
{{< /note >}}

아래 표는 지원 운영 체제에 대한 알려진 엔드포인트를 담고 있다.

{{< tabs name="container_runtime" >}}
{{% tab name="리눅스" %}}

{{< table caption="리눅스 컨테이너 런타임" >}}
| 런타임                            | 유닉스 도메인 소켓 경로                   |
|------------------------------------|----------------------------------------------|
| containerd                         | `unix:///var/run/containerd/containerd.sock` |
| CRI-O                              | `unix:///var/run/crio/crio.sock`             |
| 도커 엔진 (cri-dockerd 사용)  | `unix:///var/run/cri-dockerd.sock`           |
{{< /table >}}

{{% /tab %}}

{{% tab name="윈도우" %}}

{{< table caption="윈도우 컨테이너 런타임" >}}
| 런타임                            | 윈도우 네임드 파이프(named pipe) 경로                   |
|------------------------------------|----------------------------------------------|
| containerd                         | `npipe:////./pipe/containerd-containerd`     |
| 도커 엔진 (cri-dockerd 사용)  | `npipe:////./pipe/cri-dockerd`               |
{{< /table >}}

{{% /tab %}}
{{< /tabs >}}

## kubeadm, kubelet 및 kubectl 설치

모든 머신에 다음 패키지들을 설치한다.

* `kubeadm`: 클러스터를 부트스트랩하는 명령이다.

* `kubelet`: 클러스터의 모든 머신에서 실행되는 파드와 컨테이너 시작과
    같은 작업을 수행하는 컴포넌트이다.

* `kubectl`: 클러스터와 통신하기 위한 커맨드 라인 유틸리티이다.

kubeadm은 `kubelet` 또는 `kubectl` 을 설치하거나 관리하지 **않으므로**, kubeadm이
설치하려는 쿠버네티스 컨트롤 플레인의 버전과 일치하는지
확인해야 한다. 그렇지 않으면, 예상치 못한 버그 동작으로 이어질 수 있는
버전 차이(skew)가 발생할 위험이 있다. 그러나, kubelet과 컨트롤 플레인 사이에 _하나의_
마이너 버전 차이가 지원되지만, kubelet 버전은 API 서버 버전 보다
높을 수 없다. 예를 들어, 1.7.0 버전의 kubelet은 1.8.0 API 서버와 완전히 호환되어야 하지만,
그 반대의 경우는 아니다.

`kubectl` 설치에 대한 정보는 [kubectl 설치 및 설정](/ko/docs/tasks/tools/)을 참고한다.

{{< warning >}}
이 지침은 모든 시스템 업그레이드에서 모든 쿠버네티스 패키지를 제외한다.
이는 kubeadm 및 쿠버네티스를
[업그레이드 하는 데 특별한 주의](/ko/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/)가 필요하기 때문이다.
{{</ warning >}}

버전 차이에 대한 자세한 내용은 다음을 참고한다.

* 쿠버네티스 [버전 및 버전-차이 정책](/ko/releases/version-skew-policy/)
* Kubeadm 관련 [버전 차이 정책](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/#version-skew-policy)

{{< tabs name="k8s_install" >}}
{{% tab name="데비안 기반 배포판" %}}

1. `apt` 패키지 색인을 업데이트하고, 쿠버네티스 `apt` 리포지터리를 사용하는 데 필요한 패키지를 설치한다.

   ```shell
   sudo apt-get update
   sudo apt-get install -y apt-transport-https ca-certificates curl
   ```

2. 구글 클라우드의 공개 사이닝 키를 다운로드 한다.

   ```shell
   sudo curl -fsSLo /etc/apt/keyrings/kubernetes-archive-keyring.gpg https://packages.cloud.google.com/apt/doc/apt-key.gpg
   ```

3. 쿠버네티스 `apt` 리포지터리를 추가한다.

   ```shell
   echo "deb [signed-by=/etc/apt/keyrings/kubernetes-archive-keyring.gpg] https://apt.kubernetes.io/ kubernetes-xenial main" | sudo tee /etc/apt/sources.list.d/kubernetes.list
   ```

4. `apt` 패키지 색인을 업데이트하고, kubelet, kubeadm, kubectl을 설치하고 해당 버전을 고정한다.

   ```shell
   sudo apt-get update
   sudo apt-get install -y kubelet kubeadm kubectl
   sudo apt-mark hold kubelet kubeadm kubectl
   ```
{{< note >}}
Debian 12 및 Ubuntu 22.04 이전 릴리스에서는 `/etc/apt/keyring`이 기본적으로 존재하지 않는다.
필요한 경우 이 디렉토리를 생성하여, 누구나 읽을 수 있지만 관리자만 쓸 수 있도록 만들 수 있다.
{{< /note >}}

{{% /tab %}}
{{% tab name="레드햇 기반 배포판" %}}
```bash
cat <<EOF | sudo tee /etc/yum.repos.d/kubernetes.repo
[kubernetes]
name=Kubernetes
baseurl=https://packages.cloud.google.com/yum/repos/kubernetes-el7-\$basearch
enabled=1
gpgcheck=1
gpgkey=https://packages.cloud.google.com/yum/doc/yum-key.gpg https://packages.cloud.google.com/yum/doc/rpm-package-key.gpg
exclude=kubelet kubeadm kubectl
EOF

# permissive 모드로 SELinux 설정(효과적으로 비활성화)
sudo setenforce 0
sudo sed -i 's/^SELINUX=enforcing$/SELINUX=permissive/' /etc/selinux/config

sudo yum install -y kubelet kubeadm kubectl --disableexcludes=kubernetes

sudo systemctl enable --now kubelet
```

  **참고:**

  - `setenforce 0` 및 `sed ...` 를 실행하여 permissive 모드로 SELinux를 설정하면 효과적으로 비활성화된다.
    컨테이너가 호스트 파일시스템(예를 들어, 파드 네트워크에 필요한)에 접근하도록 허용하는 데 필요하다.
    kubelet에서 SELinux 지원이 개선될 때까지 이 작업을 수행해야 한다.

  - 구성 방법을 알고 있는 경우 SELinux를 활성화된 상태로 둘 수 있지만 kubeadm에서 지원하지 않는 설정이 필요할 수 있다.

  - 사용 중인 레드햇 배포판이 `basearch`를 해석하지 못하여 `baseurl`이 실패하면, `\$basearch`를 당신의 컴퓨터의 아키텍처로 치환한다.
    `uname -m` 명령을 실행하여 해당 값을 확인한다.
    예를 들어, `x86_64`에 대한 `baseurl` URL은 `https://packages.cloud.google.com/yum/repos/kubernetes-el7-x86_64` 이다.

{{% /tab %}}
{{% tab name="패키지 매니저를 사용하지 않는 경우" %}}
CNI 플러그인 설치(대부분의 파드 네트워크에 필요)

```bash
CNI_PLUGINS_VERSION="v1.1.1"
ARCH="amd64"
DEST="/opt/cni/bin"
sudo mkdir -p "$DEST"
curl -L "https://github.com/containernetworking/plugins/releases/download/${CNI_PLUGINS_VERSION}/cni-plugins-linux-${ARCH}-${CNI_PLUGINS_VERSION}.tgz" | sudo tar -C "$DEST" -xz
```

명령어 파일을 다운로드할 디렉터리 정의

{{< note >}}
`DOWNLOAD_DIR` 변수는 쓰기 가능한 디렉터리로 설정되어야 한다.
Flatcar Container Linux를 실행 중인 경우, `DOWNLOAD_DIR="/opt/bin"` 을 설정한다.
{{< /note >}}

```bash
DOWNLOAD_DIR="/usr/local/bin"
sudo mkdir -p "$DOWNLOAD_DIR"
```

crictl 설치(kubeadm / Kubelet 컨테이너 런타임 인터페이스(CRI)에 필요)

```bash
CRICTL_VERSION="v1.25.0"
ARCH="amd64"
curl -L "https://github.com/kubernetes-sigs/cri-tools/releases/download/${CRICTL_VERSION}/crictl-${CRICTL_VERSION}-linux-${ARCH}.tar.gz" | sudo tar -C $DOWNLOAD_DIR -xz
```

`kubeadm`, `kubelet`, `kubectl` 설치 및 `kubelet` systemd 서비스 추가

```bash
RELEASE="$(curl -sSL https://dl.k8s.io/release/stable.txt)"
ARCH="amd64"
cd $DOWNLOAD_DIR
sudo curl -L --remote-name-all https://dl.k8s.io/release/${RELEASE}/bin/linux/${ARCH}/{kubeadm,kubelet,kubectl}
sudo chmod +x {kubeadm,kubelet,kubectl}

RELEASE_VERSION="v0.4.0"
curl -sSL "https://raw.githubusercontent.com/kubernetes/release/${RELEASE_VERSION}/cmd/kubepkg/templates/latest/deb/kubelet/lib/systemd/system/kubelet.service" | sed "s:/usr/bin:${DOWNLOAD_DIR}:g" | sudo tee /etc/systemd/system/kubelet.service
sudo mkdir -p /etc/systemd/system/kubelet.service.d
curl -sSL "https://raw.githubusercontent.com/kubernetes/release/${RELEASE_VERSION}/cmd/kubepkg/templates/latest/deb/kubeadm/10-kubeadm.conf" | sed "s:/usr/bin:${DOWNLOAD_DIR}:g" | sudo tee /etc/systemd/system/kubelet.service.d/10-kubeadm.conf
```

`kubelet` 활성화 및 시작

```bash
systemctl enable --now kubelet
```

{{< note >}}
Flatcar Container Linux 배포판은 `/usr` 디렉터리를 읽기 전용 파일시스템으로 마운트한다.
클러스터를 부트스트랩하기 전에, 쓰기 가능한 디렉터리를 구성하기 위한 추가 단계를 수행해야 한다.
쓰기 가능한 디렉터리를 설정하는 방법을 알아 보려면 [Kubeadm 문제 해결 가이드](/docs/setup/production-environment/tools/kubeadm/troubleshooting-kubeadm/#usr-mounted-read-only/)를 참고한다.
{{< /note >}}
{{% /tab %}}
{{< /tabs >}}


kubelet은 이제 kubeadm이 수행할 작업을 알려 줄 때까지 크래시루프(crashloop) 상태로
기다려야 하므로 몇 초마다 다시 시작된다.

## cgroup 드라이버 구성

컨테이너 런타임과 kubelet은 
["cgroup 드라이버"](/ko/docs/setup/production-environment/container-runtimes/)라는 속성을 갖고 있으며, 
cgroup 드라이버는 리눅스 머신의 cgroup 관리 측면에 있어서 중요하다.

{{< warning >}}
컨테이너 런타임과 kubelet의 cgroup 드라이버를 일치시켜야 하며, 그렇지 않으면 kubelet 프로세스에 오류가 발생한다.
 
더 자세한 사항은 [cgroup 드라이버 설정하기](/docs/tasks/administer-cluster/kubeadm/configure-cgroup-driver/)를 참고한다.
{{< /warning >}}

## 문제 해결

kubeadm에 문제가 있는 경우, [문제 해결 문서](/docs/setup/production-environment/tools/kubeadm/troubleshooting-kubeadm/)를 참고한다.

## {{% heading "whatsnext" %}}

* [kubeadm을 사용하여 클러스터 생성](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/)
