---
title: kubeadm 설치하기
content_type: task
weight: 10
card:
  name: setup
  weight: 40
  title: kubeadm 설정 도구 설치
---

<!-- overview -->

<img src="/images/kubeadm-stacked-color.png" align="right" width="150px"></img>
이 페이지에서는 `kubeadm` 툴박스 설치 방법을 보여준다.
이 설치 프로세스를 수행한 후 kubeadm으로 클러스터를 만드는 방법에 대한 자세한 내용은 
[kubeadm으로 클러스터 생성하기](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/) 페이지를 참고한다.

{{< doc-versions-list "installation guide" >}}

## {{% heading "prerequisites" %}}

* 호환되는 리눅스 호스트. 쿠버네티스 프로젝트는 데비안 및 레드햇 기반 리눅스 배포판과
   패키지 매니저가 없는 배포판에 대한 일반적인 지침을 제공한다.
* 머신당 2GB 이상의 RAM (이보다 적으면 앱을 위한 공간이 거의 남지 않는다).
* 컨트롤 플레인 머신에는 2개 이상의 CPU.
* 클러스터의 모든 머신 간 완전한 네트워크 연결 (공용 또는 사설 네트워크 무관).
* 모든 노드에 대해 고유한 호스트네임, MAC 주소, 그리고 product_uuid. 자세한 내용은 [여기](#verify-mac-address)를 참고한다.
* 머신에 특정 포트들이 열려있어야 한다. 자세한 내용은 [여기](#check-required-ports)를 참고한다.

{{< note >}}
`kubeadm` 설치는 동적 링킹을 사용하는 바이너리를 통해 수행되며 대상 시스템이 `glibc`를 제공한다고 가정한다.
이는 많은 리눅스 배포판(데비안, 우분투, 페도라, CentOS 등 포함)에서 합리적인 가정이지만
알파인 리눅스(Alpine Linux)와 같이 기본적으로 `glibc`를 
포함하지 않는 커스텀 및 경량 배포판에서는 항상 그런 것은 아니다.
배포판이 `glibc`를 포함하거나 예상되는 심볼을 제공하는
[호환성 레이어](https://wiki.alpinelinux.org/wiki/Running_glibc_programs)를 포함할 것으로 예상된다.
{{< /note >}}

<!-- steps -->

## OS 버전 확인

{{% thirdparty-content %}}

{{< tabs name="operating_system_version_check" >}}
{{% tab name="Linux" %}}

* kubeadm 프로젝트는 LTS 커널을 지원한다. [LTS 커널 목록](https://www.kernel.org/category/releases.html)을 참고한다.
* `uname -r` 명령을 사용하여 커널 버전을 확인할 수 있다

자세한 정보는 [리눅스 커널 요구사항](/docs/reference/node/kernel-version-requirements/)을 참고한다.

{{% /tab %}}

{{% tab name="Windows" %}}

* kubeadm 프로젝트는 최신 커널 버전을 지원한다. 최신 커널 목록은 [윈도우 서버 릴리스 정보](https://learn.microsoft.com/ko-kr/windows/release-health/windows-server-release-info)를 참고한다.
* `systeminfo` 명령을 사용하여 커널 버전(OS 버전이라고도 함)을 확인할 수 있다

자세한 정보는 [윈도우 OS 버전 호환성](https://kubernetes.io/ko/docs/concepts/windows/intro/)을 참고한다.

{{% /tab %}}
{{< /tabs >}}

kubeadm으로 생성된 쿠버네티스 클러스터는 커널 기능을 사용하는 소프트웨어에 의존한다.
이 소프트웨어에는 {{< glossary_tooltip text="컨테이너 런타임" term_id="container-runtime" >}},
{{< glossary_tooltip term_id="kubelet" text="kubelet">}}, 
그리고 {{< glossary_tooltip text="컨테이너 네트워크 인터페이스" term_id="cni" >}} 플러그인이 포함되지만 이에 국한되지 않는다.

지원되지 않는 커널 버전으로 인한 예기치 않은 오류를 방지하기 위해, kubeadm은 `SystemVerification` 사전 검사를 실행한다. 
이 검사는 커널 버전이 지원되지 않으면 실패한다.

kubeadm이 커널 버전을 지원하지 않더라도, 
커널이 필요한 기능을 제공한다는 것을 알고 있다면 검사를 건너뛰도록 선택할 수 있다.

## 모든 노드에서 MAC 주소와 product_uuid가 고유한지 확인 {#verify-mac-address}

* `ip link` 또는 `ifconfig -a` 명령을 사용하여 네트워크 인터페이스의 MAC 주소를 확인할 수 있다
* `sudo cat /sys/class/dmi/id/product_uuid` 명령을 사용하여 product_uuid를 확인할 수 있다

하드웨어 장치는 고유한 주소를 가질 가능성이 매우 높지만, 일부 가상 머신은 동일한 값을 가질 수 있다. 
쿠버네티스는 이러한 값을 사용하여 클러스터의 노드를 고유하게 식별한다.
이러한 값이 각 노드에서 고유하지 않으면 설치 과정이 
[실패](https://github.com/kubernetes/kubeadm/issues/31)할 수 있다.

## 네트워크 어댑터 확인

네트워크 어댑터가 두 개 이상이고, 쿠버네티스 컴포넌트가 디폴트 라우트(default route)에서 도달할 수 없는
경우, 쿠버네티스 클러스터 주소가 적절한 어댑터를 통해 이동하도록 IP 경로를 추가하는 것이 좋다.

## 필수 포트 확인 {#check-required-ports}

쿠버네티스 컴포넌트가 서로 통신하려면 이러한 
[필수 포트](https://kubernetes.io/ko/docs/reference/networking/ports-and-protocols/)가 열려 있어야 한다.
[netcat](https://netcat.sourceforge.net)과 같은 도구를 사용하여 포트가 열려 있는지 확인할 수 있다. 예를 들어

```shell
nc 127.0.0.1 6443 -zv -w 2
```

사용하는 파드 네트워크 플러그인도 특정 포트가 열려 있어야 할 수 있다.
각 파드 네트워크 플러그인마다 다르므로, 
해당 플러그인이 필요로 하는 포트에 대해서는 플러그인 문서를 참고한다.

## 스왑 구성 {#swap-configuration}

노드에서 스왑 메모리가 감지되면 kubelet의 기본 동작은 시작에 실패하는 것이다.
이는 스왑이 비활성화되거나 kubelet에 의해 용인되어야 함을 의미한다.

* 스왑을 용인하려면, kubelet 구성에 `failSwapOn: false`를 추가하거나 커맨드라인 인수로 설정한다.
  참고: `failSwapOn: false`가 제공되더라도 워크로드는 기본적으로 스왑에 접근할 수 없다.
  이는 kubelet 구성 파일에서 다시 `swapBehavior`를 설정하여 변경할 수 있다. 스왑을 사용하려면,
  기본 `NoSwap` 설정이 아닌 다른 `swapBehavior`를 설정한다.
  자세한 내용은 [스왑 메모리 관리](/docs/concepts/architecture/nodes/#swap-memory)를 참고한다.
* 스왑을 비활성화하려면, `sudo swapoff -a`를 사용하여 일시적으로 스와핑을 비활성화할 수 있다.
  재부팅 후에도 이 변경사항을 유지하려면, 시스템 구성 방법에 따라
  `/etc/fstab`, `systemd.swap`과 같은 구성 파일에서 스왑이 비활성화되어 있는지 확인한다.


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

자세한 정보는 [컨테이너 런타임](/ko/docs/setup/production-environment/container-runtimes/)
을 참고한다.

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

{{% legacy-repos-deprecation %}}

{{< note >}}
각 쿠버네티스 마이너 버전마다 전용 패키지 저장소가 있다. 
v{{< skew currentVersion >}}가 아닌 다른 마이너 버전을 설치하려면, 
원하는 마이너 버전에 대한 설치 가이드를 참고한다.
{{< /note >}}

{{< tabs name="k8s_install" >}}
{{% tab name="데비안 기반 배포판" %}}

다음 지침은 쿠버네티스 v{{< skew currentVersion >}}에 대한 것이다.

1. `apt` 패키지 인덱스를 업데이트하고 쿠버네티스 `apt` 리포지터리를 사용하는 데 필요한 패키지를 설치한다.

   ```shell
   sudo apt-get update
   # apt-transport-https는 더미 패키지일 수 있다. 그렇다면 해당 패키지를 건너뛸 수 있다
   sudo apt-get install -y apt-transport-https ca-certificates curl gpg
   ```

2. 쿠버네티스 패키지 리포지터리용 공개 샤이닝 키를 다운로드한다.
   모든 리포지터리에 동일한 서명 키가 사용되므로 URL의 버전은 무시할 수 있다.

   ```shell
   # `/etc/apt/keyrings` 디렉터리가 존재하지 않으면, curl 명령 전에 생성해야 한다. 아래 참고사항을 읽어본다.
   # sudo mkdir -p -m 755 /etc/apt/keyrings
   curl -fsSL https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/deb/Release.key | sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg
   ```

{{< note >}}
데비안 12와 우분투 22.04보다 오래된 릴리스에서는 `/etc/apt/keyrings` 
디렉터리가 기본적으로 존재하지 않으며, curl 명령 전에 생성되어야 한다.
{{< /note >}}

3. 적절한 쿠버네티스 `apt` 리포지터리를 추가한다. 이 리포지터리에는 쿠버네티스 {{< skew currentVersion >}}에 대한 
   패키지만 있다는 점에 유의한다. 다른 쿠버네티스 마이너 버전의 경우, 원하는 마이너 버전과 일치하도록 
   URL의 쿠버네티스 마이너 버전을 변경해야 한다
   (설치할 계획인 쿠버네티스 버전에 대한 문서를 읽고 있는지도 
   확인해야 한다).

   ```shell
   # 이 명령어는 /etc/apt/sources.list.d/kubernetes.list 에 있는 기존 구성을 덮어쓴다.
   echo 'deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/deb/ /' | sudo tee /etc/apt/sources.list.d/kubernetes.list
   ```

4. `apt` 패키지 색인을 업데이트하고, kubelet, kubeadm, kubectl을 설치하고 해당 버전을 고정한다.

   ```shell
   sudo apt-get update
   sudo apt-get install -y kubelet kubeadm kubectl
   sudo apt-mark hold kubelet kubeadm kubectl
   ```

5. (선택사항) kubeadm을 실행하기 전에 kubelet 서비스를 활성화한다.

   ```shell
   sudo systemctl enable --now kubelet
   ```

{{% /tab %}}
{{% tab name="레드햇 기반 배포판" %}}

1. SELinux를 `permissive` 모드로 설정한다.

   다음 지침은 쿠버네티스 {{< skew currentVersion >}}에 대한 것이다.

   ```shell
   # SELinux를 permissive 모드로 설정한다 (효과적으로 비활성화)
   sudo setenforce 0
   sudo sed -i 's/^SELINUX=enforcing$/SELINUX=permissive/' /etc/selinux/config
   ```

{{< caution >}}
- `setenforce 0` 및 `sed ...` 실행으로 SELinux를 permissive 모드로 설정하면 효과적으로 비활성화된다.
   이는 컨테이너가 호스트 파일시스템에 접근할 수 있도록 하기 위해 필요하다.
   예를 들어, 일부 클러스터 네트워크 플러그인에서 이를 요구한다.
   kubelet에서 SELinux 지원이 개선될 때까지 이렇게 해야 한다.
- SELinux를 구성하는 방법을 알고 있다면 SELinux를 활성화된 상태로 둘 수 있지만 
   kubeadm에서 지원하지 않는 설정이 필요할 수 있다.
{{< /caution >}}

2. 쿠버네티스 `yum` 리포지터리를 추가한다. 
   리포지터리 정의의 `exclude` 파라미터는 쿠버네티스를 업그레이드하기 위해 
   따라야 하는 특별한 절차가 있으므로 `yum update` 실행 시 쿠버네티스와 관련된 
   패키지가 업그레이드되지 않도록 한다. 
   이 리포지터리에는 쿠버네티스 {{< skew currentVersion >}}에
   대한 패키지만 있다는 점에 유의한다.
   다른 쿠버네티스 마이너 버전의 경우, 원하는 마이너 버전과 일치하도록
   URL의 쿠버네티스 마이너 버전을 변경해야 한다
   (설치할 계획인 쿠버네티스 버전에 대한 문서를 읽고 있는지도 확인해야 한다).

   ```shell
   # 이것은 /etc/yum.repos.d/kubernetes.repo에 있는 기존 구성을 덮어쓴다
   cat <<EOF | sudo tee /etc/yum.repos.d/kubernetes.repo
   [kubernetes]
   name=Kubernetes
   baseurl=https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/rpm/
   enabled=1
   gpgcheck=1
   gpgkey=https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/rpm/repodata/repomd.xml.key
   exclude=kubelet kubeadm kubectl cri-tools kubernetes-cni
   EOF
   ```

3. kubelet, kubeadm 및 kubectl을 설치한다.

   ```shell
   sudo yum install -y kubelet kubeadm kubectl --disableexcludes=kubernetes
   ```

4. (선택사항) kubeadm을 실행하기 전에 kubelet 서비스를 활성화한다.

   ```shell
   sudo systemctl enable --now kubelet
   ```

{{% /tab %}}
{{% tab name="패키지 매니저를 사용하지 않는 경우" %}}
CNI 플러그인 설치(대부분의 파드 네트워크에 필요)

```bash
CNI_PLUGINS_VERSION="v1.3.0"
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

선택적으로 crictl을 설치한다 (컨테이너 런타임 인터페이스(CRI)와의 상호작용에 필요, kubeadm에는 선택사항).

```bash
CRICTL_VERSION="v1.31.0"
ARCH="amd64"
curl -L "https://github.com/kubernetes-sigs/cri-tools/releases/download/${CRICTL_VERSION}/crictl-${CRICTL_VERSION}-linux-${ARCH}.tar.gz" | sudo tar -C $DOWNLOAD_DIR -xz
```

`kubeadm`, `kubelet`을 설치하고 `kubelet` systemd 서비스를 추가한다.

```bash
RELEASE="$(curl -sSL https://dl.k8s.io/release/stable.txt)"
ARCH="amd64"
cd $DOWNLOAD_DIR
sudo curl -L --remote-name-all https://dl.k8s.io/release/${RELEASE}/bin/linux/${ARCH}/{kubeadm,kubelet}
sudo chmod +x {kubeadm,kubelet}

RELEASE_VERSION="v0.16.2"
curl -sSL "https://raw.githubusercontent.com/kubernetes/release/${RELEASE_VERSION}/cmd/krel/templates/latest/kubelet/kubelet.service" | sed "s:/usr/bin:${DOWNLOAD_DIR}:g" | sudo tee /usr/lib/systemd/system/kubelet.service
sudo mkdir -p /usr/lib/systemd/system/kubelet.service.d
curl -sSL "https://raw.githubusercontent.com/kubernetes/release/${RELEASE_VERSION}/cmd/krel/templates/latest/kubeadm/10-kubeadm.conf" | sed "s:/usr/bin:${DOWNLOAD_DIR}:g" | sudo tee /usr/lib/systemd/system/kubelet.service.d/10-kubeadm.conf
```

{{< note >}}
기본적으로 `glibc`를 포함하지 않는 리눅스 배포판에 대해서는 
[시작하기 전에](#before-you-begin) 섹션의 참고사항을 참고한다.
{{< /note >}}

[도구 설치 페이지](/docs/tasks/tools/#kubectl)의 지침에 따라 `kubectl`을 설치한다.

선택적으로, kubeadm을 실행하기 전에 kubelet 서비스를 활성화한다.

```bash
sudo systemctl enable --now kubelet
```

{{< note >}}
Flatcar Container Linux 배포판은 `/usr` 디렉터리를 읽기 전용 파일시스템으로 마운트한다.
클러스터를 부트스트랩하기 전에, 쓰기 가능한 디렉터리를 구성하기 위한 추가 단계를 수행해야 한다.
쓰기 가능한 디렉터리를 설정하는 방법을 알아 보려면 
[Kubeadm 문제 해결 가이드](/docs/setup/production-environment/tools/kubeadm/troubleshooting-kubeadm/#usr-mounted-read-only/)를 참고한다.
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

kubeadm에 문제가 있는 경우, 
[문제 해결 문서](/docs/setup/production-environment/tools/kubeadm/troubleshooting-kubeadm/)를 참고한다.

## {{% heading "whatsnext" %}}

* [kubeadm을 사용하여 클러스터 생성](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/)
