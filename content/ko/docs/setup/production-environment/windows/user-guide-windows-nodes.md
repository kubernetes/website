---
reviewers:
title: 쿠버네티스에서 윈도우 노드 추가 가이드
content_template: templates/concept
weight: 70
---

{{% capture overview %}}

쿠버네티스 플랫폼은 이제 리눅스와 윈도우 컨테이너 모두 운영할 수 있다. 윈도우 노드도 클러스터에 등록할 수 있다. 이 가이드는 다음을 어떻게 하는지 보여준다.

* 윈도우 노드를 클러스터에 등록하기
* 리눅스와 윈도우에서 동작하는 파드가 상호 간에 통신할 수 있게 네트워크를 구성하기

{{% /capture %}}

{{% capture body %}}

## 시작하기 전에

* 윈도우 컨테이너를 호스트하는 윈도우 노드를 구성하려면 [윈도우 서버 라이선스](https://www.microsoft.com/en-us/cloud-platform/windows-server-pricing)를 소유해야 한다. 클러스터를 위해서 소속 기관의 라이선스를 사용하거나, Microsoft, 리셀러로 부터 취득할 수 있으며, GCP, AWS, Azure와 같은 주요 클라우드 제공자의 마켓플레이스를 통해 윈도우 서버를 운영하는 가상머신을 프로비저닝하여 취득할 수도 있다. [사용시간이 제한된 시험판](https://www.microsoft.com/en-us/cloud-platform/windows-server-trial)도 활용 가능하다.

* 컨트롤 플레인에 접근할 수 있는 리눅스 기반의 쿠버네티스 클러스터를 구축한다.(몇 가지 예시는 [kubeadm으로 단일 컨트롤플레인 클러스터 만들기](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/), [AKS Engine](/docs/setup/production-environment/turnkey/azure/), [GCE](/docs/setup/production-environment/turnkey/gce/), [AWS](/docs/setup/production-environment/turnkey/aws/)를 포함한다)

## 시작하기: 사용자 클러스터에 윈도우 노드 추가하기

### IP 주소 체계 설계하기

쿠버네티스 클러스터 관리를 위해 실수로 네트워크 충돌을 일으키지 않도록 IP 주소에 대해 신중히 설계해야 한다. 이 가이드는 [쿠버네티스 네트워킹 개념](/docs/concepts/cluster-administration/networking/)에 익숙하다 가정한다.

클러스터를 배포하려면 다음 주소 공간이 필요하다.

| 서브넷 / 주소 범위 | 비고 | 기본값 |
| --- | --- | --- |
| 서비스 서브넷 | 라우트 불가한 순수한 가상 서브넷으로 네트워크 토플로지에 관계없이 파드에서 서비스로 단일화된 접근을 제공하기 위해 사용한다. 서비스 서브넷은 노드에서 실행 중인 `kube-proxy`에 의해서 라우팅 가능한 주소 공간으로(또는 반대로) 번역된다. | 10.96.0.0/12 |
| 클러스터 서브넷 | 클러스터 내에 모든 파드에 사용되는 글로벌 서브넷이다. 각 노드에는 파드가 사용하기 위한 /24 보다 작거나 같은 서브넷을 할당한다. 서브넷은 클러스터 내에 모든 파드를 수용할 수 있을 정도로 충분히 큰 값이어야 한다. *최소 서브넷*의 크기를 계산하려면: `(노드의 개수) + (노드의 개수 * 구성하려는 노드 당 최대 파드 개수)`. 예: 노드 당 100개 파드인 5 노드짜리 클러스터 = `(5) + (5 * 100) = 505.` | 10.244.0.0/16 |
| 쿠버네티스 DNS 서비스 IP | DNS 확인 및 클러스터 서비스 검색에 사용되는 서비스인 `kube-dns`의 IP 주소이다. | 10.96.0.10 |

클러스터에 IP 주소를 얼마나 할당해야 할지 결정하기 위해 '쿠버네티스에서 윈도우 컨테이너: 지원되는 기능: 네트워킹'에서 소개한 네트워킹 선택 사항을 검토하자.

### 윈도우에서 실행되는 구성 요소

쿠버네티스 컨트롤 플레인이 리눅스 노드에서 운영되는 반면, 다음 요소는 윈도우 노드에서 구성되고 운영된다.

1. kubelet
2. kube-proxy
3. kubectl (선택적)
4. 컨테이너 런타임

v1.14 이후의 최신 바이너리를 [https://github.com/kubernetes/kubernetes/releases](https://github.com/kubernetes/kubernetes/releases)에서 받아온다. kubeadm, kubectl, kubelet, kube-proxy의 Windows-amd64 바이너리는 CHANGELOG 링크에서 찾아볼 수 있다.

### 네트워크 구성

리눅스 기반의 쿠버네티스 마스터 노드를 가지고 있다면 네트워킹 솔루션을 선택할 준비가 된 것이다. 이 가이드는 단순화를 위해 VXLAN 방식의 플라넬(Flannel)을 사용하여 설명한다.

#### 리눅스 컨트롤러에서 VXLAN 방식으로 플라넬 구성하기

1. 플라넬을 위해 쿠버네티스 마스터를 준비한다.

    클러스터의 쿠버네티스 마스터에서 사소한 준비를 권장한다. 플라넬을 사용할 때에 iptables 체인으로 IPv4 트래픽을 브릿지할 수 있게 하는 것은 추천한다. 이는 다음 커맨드를 이용하여 수행할 수 있다.

    ```bash
    sudo sysctl net.bridge.bridge-nf-call-iptables=1
    ```

1. 플라넬 다운로드 받고 구성하기

    가장 최신의 플라넬 메니페스트를 다운로드한다.

    ```bash
    wget https://raw.githubusercontent.com/coreos/flannel/master/Documentation/kube-flannel.yml
    ```

    VXLAN 네트워킹 벡엔드를 가능하게 하기 위해 수정할 곳은 두 곳이다.

    아래 단계를 적용하면 `kube-flannel.yml`의 `net-conf.json`부분을 다음과 같게 된다.

    ```json
    net-conf.json: |
        {
          "Network": "10.244.0.0/16",
          "Backend": {
            "Type": "vxlan",
            "VNI" : 4096,
            "Port": 4789
          }
        }
    ```

    {{< note >}}리눅스의 플라넬과 윈도우의 플라넬이 상호운용하기 위해서 `VNI`는 반드시 4096이고, `Port`는 4789여야 한다. 다른 VNI는 곧 지원될 예정이다. [VXLAN 문서](https://github.com/coreos/flannel/blob/master/Documentation/backends.md#vxlan)에서
     이 필드의 설명 부분을 보자.{{< /note >}}

1. `kube-flannel.yml`의 `net-conf.json` 부분을 거듭 확인하자.
    1. 클러스터 서브넷(예, "10.244.0.0/16")은 IP 주소 설계에 따라 설정되어야 한다.
      * VNI 4096 은 벡엔드에 설정한다.
      * Port 4789 는 벡엔드에 설정한다.
    1. `kube-flannel.yml`의 `cni-conf.json` 부분에서 네트워크 이름을 `vxlan0`로 바꾼다.

    `cni-conf.json`는 다음과 같다.

    ```json
    cni-conf.json: |
        {
          "name": "vxlan0",
          "plugins": [
            {
              "type": "flannel",
              "delegate": {
                "hairpinMode": true,
                "isDefaultGateway": true
              }
            },
            {
              "type": "portmap",
              "capabilities": {
                "portMappings": true
              }
            }
          ]
        }
    ```

1. 플라넬 yaml 을 적용하고 확인하기

    플라넬 구성을 적용하자.

    ```bash
    kubectl apply -f kube-flannel.yml
    ```

    다음은 플라넬 파드는 리눅스 기반이라 [여기](https://github.com/Microsoft/SDN/blob/1d5c055bb195fecba07ad094d2d7c18c188f9d2d/Kubernetes/flannel/l2bridge/manifests/node-selector-patch.yml) 나온 노드 셀렉터 패치를 플라넬 데몬셋 파드에 적용한다.

    ```bash
    kubectl patch ds/kube-flannel-ds-amd64 --patch "$(cat node-selector-patch.yml)" -n=kube-system
    ```

    몇 분 뒤에 플라넬 파드 네트워크가 배포되었다면, 모든 파드에서 운영 중인 것을 확인할 수 있다.

    ```bash
    kubectl get pods --all-namespaces
    ```

    결과는 다음과 같다.

    ```
    NAMESPACE     NAME                                      READY        STATUS    RESTARTS   AGE
    kube-system   etcd-flannel-master                       1/1          Running   0          1m
    kube-system   kube-apiserver-flannel-master             1/1          Running   0          1m
    kube-system   kube-controller-manager-flannel-master    1/1          Running   0          1m
    kube-system   kube-dns-86f4d74b45-hcx8x                 3/3          Running   0          12m
    kube-system   kube-flannel-ds-54954                     1/1          Running   0          1m
    kube-system   kube-proxy-Zjlxz                          1/1          Running   0          1m
    kube-system   kube-scheduler-flannel-master             1/1          Running   0          1m
    ```

    플라넬 데몬셋에 노드 셀렉터가 적용되었음을 확인한다.

    ```bash
    kubectl get ds -n kube-system
    ```

    결과는 다음과 같다. 노드 셀렉터 `beta.kubernetes.io/os=linux`가 적용되었다.

    ```
    NAME              DESIRED   CURRENT   READY   UP-TO-DATE   AVAILABLE   NODE SELECTOR                                               AGE
    kube-flannel-ds   2         2         2       2            2           beta.kubernetes.io/arch=amd64,beta.kubernetes.io/os=linux   21d
    kube-proxy        2         2         2       2            2           beta.kubernetes.io/os=linux                                 26d
    ```

#### 윈도우 워커 조인

이번 단원은 맨 땅에서부터 온프레미스 클러스터에 가입하기까지 윈도우 노드 구성을 다룬다. 클러스터가 클라우드상에 있다면, 다음 단원에 있는 클라우드에 특정한 가이드를 따르도록 된다.

#### 윈도우 노드 준비하기

{{< note >}}
윈도우 단원에서 모든 코드 부분은 높은 권한(Admin)으로 파워쉘(PowerShell) 환경에서 구동한다.
{{< /note >}}

1. 도커(Docker) 설치(시스템 리부팅 필요)

    쿠버네티스는 [도커](https://www.docker.com/)를 컨테이너 엔진으로 사용하므로, 도커를 설치해야 한다. [공식 문서 설치 요령](https://docs.microsoft.com/en-us/virtualization/windowscontainers/manage-docker/configure-docker-daemon#install-docker), [도커 명령](https://store.docker.com/editions/enterprise/docker-ee-server-windows)을 따라 해보거나 다음의 *권장하는* 단계를 시도하자.

    ```PowerShell
    Enable-WindowsOptionalFeature -FeatureName Containers
    Restart-Computer -Force
    Install-Module -Name DockerMsftProvider -Repository PSGallery -Force
    Install-Package -Name Docker -ProviderName DockerMsftProvider
    ```

    네트워크 프록시 안쪽에서 작업한다면 다음 파워쉘 환경 변수를 반드시 정의하자.

    ```PowerShell
    [Environment]::SetEnvironmentVariable("HTTP_PROXY", "http://proxy.example.com:80/", [EnvironmentVariableTarget]::Machine)
    [Environment]::SetEnvironmentVariable("HTTPS_PROXY", "http://proxy.example.com:443/", [EnvironmentVariableTarget]::Machine)
    ```

    리부팅 후에 다음 오류를 보게되면, 도커 서비스를 수동으로 재시작해야 한다.

    ```PowerShell
    docker version
    ```

    만약 다음과 같은 에러 메시지를 보게되면, 도커 서비스를 수동으로 시작해야 한다.

    ```
    Client:
     Version: 17.06.2-ee-11
     API version: 1.30
     Go version: go1.8.7
     Git commit: 06fc007
     Built: Thu May 17 06:14:39 2018
     OS/Arch: windows / amd64
    error during connect: Get http://%2F%2F.%2Fpipe%2Fdocker_engine/v1.30/version: open //./pipe/docker_engine: The system c
    annot find the file specified. In the default daemon configuration on Windows, the docker client must be run elevated to
    connect. This error may also indicate that the docker daemon is not running.
    ```

    다음과 같이 도커 서비스를 수동으로 시작할 수 있다. 

    ```PowerShell
    Start-Service docker
    ```

{{< note >}}
`pause`(인프라스트럭처) 이미지는 Microsoft 컨테이너 레지스트리(MCR)에 등록되어 있다. `docker pull mcr.microsoft.com/k8s/core/pause:1.2.0`로 접근할 수 있다. `DOCKERFILE`은 https://github.com/kubernetes-sigs/sig-windows-tools/tree/master/cmd/wincat 에 있다.
{{< /note >}}

1. 쿠버네티스를 위한 윈도우 디렉터리 준비하기

    쿠버네티스 바이너리와 배포 스크립트와 구성 파일을 저장할 "윈도우를 위한 쿠버네티스" 디렉터리를 생성한다.

    ```PowerShell
    mkdir c:\k
    ```

1. 쿠버네티스 인증서 복사하기

    쿠버네티스 인증서 파일인 `$HOME/.kube/config`을 [리눅스 컨트롤러](https://docs.microsoft.com/en-us/virtualization/windowscontainers/kubernetes/creating-a-linux-master#collect-cluster-information)에서 윈도우 노드의 새로운 `C:\k` 디렉터리로 복사한다.

    팁: 노드 간에 구성 파일 전송을 위해 [xcopy](https://docs.microsoft.com/en-us/windows-server/administration/windows-commands/xcopy), [WinSCP](https://winscp.net/eng/download.php)나 [WinSCP 파워쉘 래퍼](https://www.powershellgallery.com/packages/WinSCP/5.13.2.0)같은 도구를 이용할 수 있다.

1. 쿠버네티스 바이너리 다운로드 하기

    쿠버네티스르 운영을 가능하게 하기 위해 먼저 `kubelet`과 `kube-proxy` 바이너리를 다운로드해야 한다. 이 바이너리를 [최신 릴리스](https://github.com/kubernetes/kubernetes/releases/)의 CHANGELOG.md 파일에 노드 바이너리 링크에서 다운로드 한다. 예를 들어 'kubernetes-node-windows-amd64.tar.gz'. 또한 클라이언트 바이너리 항목에서 찾을 수 있는 윈도우에서 실행되는 `kubectl`을 선택적으로 다운로드 받을 수 있다.

    압축 파일을 풀고, `C:\k`로 바이너리를 위치하기 위해 [Expand-Archive](https://docs.microsoft.com/en-us/powershell/module/microsoft.powershell.archive/expand-archive?view=powershell-6) 파워쉘 커맨드를 이용할 수 있다.

#### 윈도우 노드를 플라넬 클러스터에 가입하기

플라넬 오버레이 배포 스크립트와 문서는 [이 리포지터리](https://github.com/Microsoft/SDN/tree/master/Kubernetes/flannel/overlay)에 있다. 다음 단계는 그곳에 있는 자세한 요령을 따라서 단순히 진행하는 것이다.

[Flannel start.ps1](https://github.com/Microsoft/SDN/blob/master/Kubernetes/flannel/start.ps1) 스크립트를 다운로드받고, 그 내용을 `C:\k`에 풀어 넣자.

```PowerShell
cd c:\k
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
wget https://raw.githubusercontent.com/Microsoft/SDN/master/Kubernetes/flannel/start.ps1 -o c:\k\start.ps1
```

{{< note >}}
[start.ps1](https://github.com/Microsoft/SDN/blob/master/Kubernetes/flannel/start.ps1)은 [install.ps1](https://github.com/Microsoft/SDN/blob/master/Kubernetes/windows/install.ps1)을 참고하는데, 이는 사용자를 위해 `flanneld` 실행 **파일 같은** 추가 파일과 [인프라스트럭처 파드를 위한 Dockerfile](https://github.com/Microsoft/SDN/blob/master/Kubernetes/windows/Dockerfile)을 다운로드하고 설치한다. 오버레이 네트워킹 방식에서 [방화벽](https://github.com/Microsoft/SDN/blob/master/Kubernetes/windows/helper.psm1#L111)은 지역 UDP 4789 포트에 대해 열려있다. 여러 파워쉘 윈도우가 열렸다 닫히며, 포드 네트워크를 위한 새로운 외부 vSwitch가 처음 생성되는 동안 몇 초간은 네트워크가 중단된다. 아래 지정한 인수를 사용하여 스크립트를 실행하자.
{{< /note >}}

```PowerShell
cd c:\k
.\start.ps1 -ManagementIP <Windows Node IP> `
  -NetworkMode overlay `
  -ClusterCIDR <Cluster CIDR> `
  -ServiceCIDR <Service CIDR> `
  -KubeDnsServiceIP <Kube-dns Service IP> `
  -LogDir <Log directory>
```

| 파라미터 | 기본값 | 비고 |
| --- | --- | --- |
| -ManagementIP | N/A (필요함) | 윈도우 노드에 할당할 IP 주소. 이 값을 찾기 위해 `ipconfig` 이용할 수 있다. |
| -NetworkMode | l2bridge | 여기서는 `overlay`를 사용한다. |
| -ClusterCIDR | 10.244.0.0/16 | 클러스터 IP 설계을 참고한다. |
| -ServiceCIDR | 10.96.0.0/12 | 클러스터 IP 설계을 참고한다. |
| -KubeDnsServiceIP | 10.96.0.10 | |
| -InterfaceName | Ethernet | 윈도우 호스트의 네트워크 인터페이스 이름. 이 값을 찾기 위해 <code>ipconfig</code> 이용할 수 있다. |
| -LogDir | C:\k | Kubelet과 Kube-proxy가 각각의 로그 출력 파일을 리다이렉션하는 디렉터리이다. |

이제 다음을 실행하여 사용자 클러스터 내에 윈도우 노드를 볼 수 있다.

```bash
kubectl get nodes
```

{{< note >}}
Kubelet, kueb-proxy 같은 윈도우 노드 구성요소를 윈도우 서비스로 구성할 수 있다. 추가적인 방법은 [문제 해결](#troubleshooting)의 서비스와 백그라운드 프로세스 단원을 보자. 노드의 구성요소를 서비스로 실행하면 로그 수집하는 것이 문제 해결에 있어 중요한 부분이 된다. 추가 지침으로 기여 가이드에서 [로그 수집하기](https://github.com/kubernetes/community/blob/master/sig-windows/CONTRIBUTING.md#gathering-logs) 단원을 보자.
{{< /note >}}

### 공개 클라우드 제공자

#### Azure

AKS-Engine은 완전하고, 맞춤 설정이 가능한 쿠버네티스 클러스터를 리눅스와 윈도우 노드에 배포할 수 있다. 단계별 안내가 [GitHub에 있는 문서](https://github.com/Azure/aks-engine/blob/master/docs/topics/windows.md)로 제공된다.

#### GCP

사용자가 [GitHub](https://github.com/kubernetes/kubernetes/blob/master/cluster/gce/windows/README-GCE-Windows-kube-up.md)에 있는 단계별 안내를 따라서 완전한 쿠버네티스 클러스터를 GCE 상에 쉽게 배포할 수 있다.

#### kubeadm과 클러스터 API로 배포하기

Kubeadm은 쿠버네티스 클러스터를 배포하는 사용자에게 산업 표준이 되었다. Kubeadm에서 윈도우 노드 지원은 미래 릴리스에 나올 것이다. 또한 윈도우 노드가 올바르게 프로비저닝되도록 클러스터 API에 투자하고 있다.

### 다음 단계

이제 클러스터 내에 윈도우 컨테이너를 실행하도록 윈도우 워커를 구성했으니, 리눅스 컨테이너를 실행할 리눅스 노드를 1개 이상 추가할 수 있다. 이제 윈도우 컨테이너를 클러스터에 스케줄링할 준비가 됬다.

{{% /capture %}}
