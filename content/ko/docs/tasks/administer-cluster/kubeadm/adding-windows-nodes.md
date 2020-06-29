---
title: Windows 노드 추가
min-kubernetes-server-version: 1.17
content_type: tutorial
weight: 30
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.18" state="beta" >}}

쿠버네티스를 사용하여 리눅스와 Windows 노드를 혼합하여 실행할 수 있으므로, 리눅스에서 실행되는 파드와 Windows에서 실행되는 파드를 혼합할 수 있다. 이 페이지는 Windows 노드를 클러스터에 등록하는 방법을 보여준다.




## {{% heading "prerequisites" %}}
 {{< version-check >}}

* Windows 컨테이너를 호스팅하는 Windows 노드를 구성하려면
[Windows Server 2019 라이선스](https://www.microsoft.com/en-us/cloud-platform/windows-server-pricing) 이상이 필요하다.
VXLAN/오버레이 네트워킹을 사용하는 경우 [KB4489899](https://support.microsoft.com/help/4489899)도 설치되어 있어야 한다.

* 컨트롤 플레인에 접근할 수 있는 리눅스 기반의 쿠버네티스 kubeadm 클러스터([kubeadm을 사용하여 단일 컨트롤 플레인 클러스터 생성](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/) 참고)가 필요하다.




## {{% heading "objectives" %}}


* 클러스터에 Windows 노드 등록
* 리눅스 및 Windows의 파드와 서비스가 서로 통신할 수 있도록 네트워킹 구성




<!-- lessoncontent -->

## 시작하기: 클러스터에 Windows 노드 추가

### 네트워킹 구성

리눅스 기반 쿠버네티스 컨트롤 플레인 노드가 있으면 네트워킹 솔루션을 선택할 수 있다. 이 가이드는 VXLAN 모드의 플란넬(Flannel)을 사용하는 방법을 짧막하게 보여준다.

#### 플란넬 구성

1. 플란넬을 위한 쿠버네티스 컨트롤 플레인 준비

    클러스터의 쿠버네티스 컨트롤 플레인에서 약간의 준비가 필요하다. 플란넬을 사용할 때 iptables 체인에 브릿지된 IPv4 트래픽을 활성화하는 것을 권장한다. 아래 명령을 모든 리눅스 노드에서 실행해야만 한다.

    ```bash
    sudo sysctl net.bridge.bridge-nf-call-iptables=1
    ```

1. 리눅스용 플란넬 다운로드 및 구성

    가장 최근의 플란넬 매니페스트를 다운로드한다.

    ```bash
    wget https://raw.githubusercontent.com/coreos/flannel/master/Documentation/kube-flannel.yml
    ```

    VNI를 4096으로 설정하고 포트를 4789로 설정하려면 플란넬 매니페스트의 `net-conf.json` 섹션을 수정한다. 다음과 같을 것이다.

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

    {{< note >}}리눅스의 플란넬이 Windows의 플란넬과 상호 운용되도록 하려면 VNI를 4096으로, 포트를 4789로 설정해야 한다. 이 필드들에 대한 설명은 [VXLAN 문서](https://github.com/coreos/flannel/blob/master/Documentation/backends.md#vxlan)를
    참고한다.{{< /note >}}

    {{< note >}}L2Bridge/Host-gateway 모드를 대신 사용하려면 `Type` 의 값을 `"host-gw"` 로 변경하고 `VNI` 와 `Port` 를 생략한다.{{< /note >}}

1. 플란넬 매니페스트 적용 및 유효성 검사

    플란넬 구성을 적용해보자.

    ```bash
    kubectl apply -f kube-flannel.yml
    ```

    몇 분 후에, 플란넬 파드 네트워크가 배포되었다면 모든 파드가 실행 중인 것으로 표시된다.

    ```bash
    kubectl get pods -n kube-system
    ```

    출력 결과에 리눅스 flannel 데몬셋(DaemonSet)이 실행 중인 것으로 나와야 한다.

    ```
    NAMESPACE     NAME                                      READY        STATUS    RESTARTS   AGE
    ...
    kube-system   kube-flannel-ds-54954                     1/1          Running   0          1m
    ```

1. Windows 플란넬 및 kube-proxy 데몬셋 추가

    이제 Windows 호환 버전의 플란넬과 kube-proxy를 추가할 수 있다. 호환 가능한
    kube-proxy 버전을 얻으려면, 이미지의 태그를
    대체해야 한다. 다음의 예시는 쿠버네티스 {{< param "fullversion" >}}의 사용법을 보여주지만,
    사용자의 배포에 맞게 버전을 조정해야 한다.

    ```bash
    curl -L https://github.com/kubernetes-sigs/sig-windows-tools/releases/latest/download/kube-proxy.yml | sed 's/VERSION/{{< param "fullversion" >}}/g' | kubectl apply -f -
    kubectl apply -f https://github.com/kubernetes-sigs/sig-windows-tools/releases/latest/download/flannel-overlay.yml
    ```
    {{< note >}}
    host-gateway를 사용하는 경우 https://github.com/kubernetes-sigs/sig-windows-tools/releases/latest/download/flannel-host-gw.yml 을 대신 사용한다.
    {{< /note >}}

    {{< note >}}
Windows 노드에서 이더넷이 아닌 다른 인터페이스(예: "Ethernet0 2")를 사용하는 경우, flannel-host-gw.yml이나 flannel-overlay.yml 파일에서 다음 라인을 수정한다.

```powershell
wins cli process run --path /k/flannel/setup.exe --args "--mode=overlay --interface=Ethernet"
```

그리고, 이에 따라 인터페이스를 지정해야 한다.

```bash
# 예시
curl -L https://github.com/kubernetes-sigs/sig-windows-tools/releases/latest/download/flannel-overlay.yml | sed 's/Ethernet/Ethernet0 2/g' | kubectl apply -f -
```
    {{< /note >}}



### Windows 워커 노드 조인(joining)
{{< note >}}
`Containers` 기능을 설치하고 도커를 설치해야 한다.
[Windows Server에 Docker Engine - Enterprise 설치](https://docs.docker.com/ee/docker-ee/windows/docker-ee/#install-docker-engine---enterprise)에서 설치에 대한 내용을 참고할 수 있다.
{{< /note >}}

{{< note >}}
Windows 섹션의 모든 코드 스니펫(snippet)은 Windows 워커 노드의
높은 권한(관리자)이 있는 PowerShell 환경에서 실행해야 한다.
{{< /note >}}

1. wins, kubelet 및 kubeadm 설치

   ```PowerShell
   curl.exe -LO https://github.com/kubernetes-sigs/sig-windows-tools/releases/latest/download/PrepareNode.ps1
   .\PrepareNode.ps1 -KubernetesVersion {{< param "fullversion" >}}
   ```

1. 노드에 조인하기 위해 `kubeadm` 실행

    컨트롤 플레인 호스트에서 `kubeadm init` 실행할 때 제공된 명령을 사용한다.
    이 명령이 더 이상 없거나, 토큰이 만료된 경우, `kubeadm token create --print-join-command`
    (컨트롤 플레인 호스트에서)를 실행하여 새 토큰 및 조인 명령을 생성할 수 있다.


#### 설치 확인
이제 다음을 실행하여 클러스터에서 Windows 노드를 볼 수 있다.

```bash
kubectl get nodes -o wide
```

새 노드가 `NotReady` 상태인 경우 플란넬 이미지가 여전히 다운로드 중일 수 있다.
`kube-system` 네임스페이스에서 flannel 파드를 확인하여 이전과 같이 진행 상황을 확인할 수 있다.

```shell
kubectl -n kube-system get pods -l app=flannel
```

flannel 파드가 실행되면, 노드는 `Ready` 상태가 되고 워크로드를 처리할 수 있어야 한다.



## {{% heading "whatsnext" %}}


- [Windows kubeadm 노드 업그레이드](/ko/docs/tasks/administer-cluster/kubeadm/upgrading-windows-nodes)


