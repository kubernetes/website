---
# reviewers:
# - aravindhp
# - jayunit100
# - jsturtevant
# - marosset
title: 윈도우 디버깅 팁
content_type: concept
---

<!-- overview -->

<!-- body -->

## 노드-수준 트러블슈팅 {#troubleshooting-node}

1. 내 파드가 "Container Creating"에서 멈췄거나 계속해서 다시 시작된다.

   퍼즈(pause) 이미지가 OS 버전과 호환되는지 확인한다. 
   [퍼즈 컨테이너](/ko/docs/concepts/windows/intro/#퍼즈-pause-컨테이너)에서 
   최신 / 추천 퍼즈 이미지 및 추가 정보를 확인한다.

   {{< note >}}
   컨테이너 런타임으로 containerd를 사용하고 있다면, 퍼즈 이미지는 
   `config.toml` 환경 설정 파일의 `plugins.plugins.cri.sandbox_image` 필드에 명시되어 있다.
   {{< /note >}}

1. 내 파드의 상태가 `ErrImgPull` 또는 `ImagePullBackOff`이다.

   파드가 
   [호환되는](https://docs.microsoft.com/virtualization/windowscontainers/deploy-containers/version-compatibility) 윈도우 노드에 
   스케줄링되었는지 확인한다.

   각 파드와 호환되는 노드를 찾는 방법에 대한 추가 정보는 
   [이 가이드](/ko/docs/concepts/windows/user-guide/#특정-OS-워크로드를-적절한-컨테이너-호스트에서-처리하도록-보장하기)를 참고한다.

## 네트워크 트러블슈팅 {#troubleshooting-network}

1. 내 윈도우 파드에 네트워크 연결이 없다.

   가상 머신을 사용하는 경우, 
   모든 VM 네트워크 어댑터에 MAC 스푸핑이 **활성화**되어 있는지 확인한다.

1. 내 윈도우 파드가 외부 리소스를 ping 할 수 없다.

   윈도우 파드에는 현재 ICMP 프로토콜용으로 프로그래밍된 아웃바운드 규칙이 없다. 
   그러나 TCP/UDP는 지원된다. 
   클러스터 외부 리소스에 대한 연결을 시연하려는 경우, 
   `ping <IP>`를 대응되는 `curl <IP>`명령으로 대체한다.

   여전히 문제가 발생하는 경우, 
   [cni.conf](https://github.com/Microsoft/SDN/blob/master/Kubernetes/flannel/l2bridge/cni/config/cni.conf)의 네트워크 구성에 특별히 추가 확인이 필요하다. 
   언제든지 이 정적 파일을 편집할 수 있다. 
   구성 업데이트는 새로 생성된 모든 쿠버네티스 리소스에 적용된다.

   쿠버네티스 네트워킹 요구 
   사항([쿠버네티스 모델](/ko/docs/concepts/cluster-administration/networking/) 참조) 
   중 하나는 
   클러스터 통신이 NAT 없이 내부적으로 발생해야 한다는 것이다. 
   이 요구 사항을 준수하기 위해 
   아웃바운드 NAT가 발생하지 않도록 하는 
   모든 통신에 대한 [ExceptionList](https://github.com/Microsoft/SDN/blob/master/Kubernetes/flannel/l2bridge/cni/config/cni.conf#L20)가 있다. 
   그러나 이것은 쿼리하려는 외부 IP를 `ExceptionList`에서 제외해야 함도 의미한다. 
   그래야만 윈도우 파드에서 발생하는 트래픽이 제대로 SNAT 되어 외부에서 응답을 받는다. 
   이와 관련하여 `cni.conf`의 `ExceptionList`는 다음과 같아야 한다.

   ```conf
   "ExceptionList": [
                   "10.244.0.0/16",  # 클러스터 서브넷
                   "10.96.0.0/12",   # 서비스 서브넷
                   "10.127.130.0/24" # 관리(호스트) 서브넷
               ]
   ```

1. 내 윈도우 노드가 `NodePort` 서비스에 접근할 수 없다.

   노드 자체에서는 로컬 NodePort 접근이 실패한다. 이것은 알려진 제약사항이다. 
   NodePort 접근은 다른 노드 또는 외부 클라이언트에서는 가능하다.

1. 컨테이너의 vNIC 및 HNS 엔드포인트가 삭제된다.

   이 문제는 `hostname-override` 파라미터가 
   [kube-proxy](/ko/docs/reference/command-line-tools-reference/kube-proxy/)에 전달되지 않은 경우 발생할 수 있다. 
   이를 해결하려면 사용자는 다음과 같이 hostname을 kube-proxy에 전달해야 한다.

   ```powershell
   C:\k\kube-proxy.exe --hostname-override=$(hostname)
   ```

1. 내 윈도우 노드가 서비스 IP를 사용하여 내 서비스에 접근할 수 없다.

   이는 윈도우에서 현재 네트워킹 스택의 알려진 제약 사항이다. 그러나 윈도우 파드는 서비스 IP에 접근할 수 있다.

1. kubelet을 시작할 때 네트워크 어댑터를 찾을 수 없다.

   윈도우 네트워킹 스택에는 쿠버네티스 네트워킹이 작동하기 위한 가상 어댑터가 필요하다. 
   (어드민 셸에서) 다음 명령이 결과를 반환하지 않으면, 
   Kubelet이 작동하는 데 필요한 필수 구성 요소인 가상 네트워크 생성이 실패한 것이다.

   ```powershell
   Get-HnsNetwork | ? Name -ieq "cbr0"
   Get-NetAdapter | ? Name -Like "vEthernet (Ethernet*"
   ```

   호스트 네트워크 어댑터가 "Ethernet"이 아닌 경우, 종종 `start.ps1` 스크립트의 
   [InterfaceName](https://github.com/microsoft/SDN/blob/master/Kubernetes/flannel/start.ps1#L7) 파라미터를 수정하는 것이 좋다. 
   그렇지 않으면 `start-kubelet.ps1` 스크립트의 출력을 참조하여 가상 네트워크 생성 중에 오류가 있는지 확인한다.

1. DNS 해석(resolution)이 제대로 작동하지 않는다.

   이 [섹션](/ko/docs/concepts/services-networking/dns-pod-service/#dns-windows)에서 윈도우에서의 DNS 제한을 확인한다.

1. `kubectl port-forward`가 "unable to do port forwarding: wincat not found" 에러와 함께 실패한다.

   이 기능은 퍼즈 인프라 컨테이너 `mcr.microsoft.com/oss/kubernetes/pause:3.6`에 
   `wincat.exe`를 포함시킴으로써 쿠버네티스 1.15에서 구현되었다. 
   지원되는 쿠버네티스 버전을 사용하고 있는지 확인한다. 
   퍼즈 인프라 컨테이너를 직접 빌드하려면 
   [wincat](https://github.com/kubernetes/kubernetes/tree/master/build/pause/windows/wincat)을 포함시켜야 한다.

1. 내 윈도우 서버 노드가 프록시 뒤에 있기 때문에 쿠버네티스 설치에 실패한다.

   프록시 뒤에 있는 경우, 다음 PowerShell 환경 변수를 정의해야 한다.

   ```PowerShell
   [Environment]::SetEnvironmentVariable("HTTP_PROXY", "http://proxy.example.com:80/", [EnvironmentVariableTarget]::Machine)
   [Environment]::SetEnvironmentVariable("HTTPS_PROXY", "http://proxy.example.com:443/", [EnvironmentVariableTarget]::Machine)
   ```

### 플란넬 트러블슈팅

1. 플란넬(flannel)을 사용하면 클러스터에 다시 조인(join)한 후 노드에 이슈가 발생한다.

   이전에 삭제된 노드가 클러스터에 다시 조인될 때마다,
   flannelD는 새 파드 서브넷을 노드에 할당하려고 한다. 
   사용자는 다음 경로에서 이전 파드 서브넷 구성 파일을 제거해야 한다.

   ```powershell
   Remove-Item C:\k\SourceVip.json
   Remove-Item C:\k\SourceVipRequest.json
   ```

1. flanneld가 "Waiting for the Network to be created" 상태에서 멈춘다.

   이 [이슈](https://github.com/coreos/flannel/issues/1066)에 대한 수많은 보고가 있다. 
   플란넬 네트워크의 관리 IP가 설정될 때의 타이밍 이슈일 가능성이 높다. 
   해결 방법은 start.ps1을 다시 시작하거나 다음과 같이 수동으로 다시 시작하는 것이다.

   ```powershell
   [Environment]::SetEnvironmentVariable("NODE_NAME", "<Windows_Worker_Hostname>")
   C:\flannel\flanneld.exe --kubeconfig-file=c:\k\config --iface=<Windows_Worker_Node_IP> --ip-masq=1 --kube-subnet-mgr=1
   ```

1. `/run/flannel/subnet.env` 누락으로 인해 윈도우 파드를 시작할 수 없다.

   이것은 플란넬이 제대로 실행되지 않았음을 나타낸다. 
   `flanneld.exe`를 다시 시작하거나 
   쿠버네티스 마스터의 `/run/flannel/subnet.env`에서 윈도우 워커 노드의 `C:\run\flannel\subnet.env`로 파일을 수동으로 복사할 수 있고, 
   `FLANNEL_SUBNET` 행을 다른 숫자로 수정한다. 
   예를 들어, 노드 서브넷 10.244.4.1/24가 필요한 경우 다음과 같이 설정한다.

   ```env
   FLANNEL_NETWORK=10.244.0.0/16
   FLANNEL_SUBNET=10.244.4.1/24
   FLANNEL_MTU=1500
   FLANNEL_IPMASQ=true
   ```

### 추가 조사

이러한 단계로 문제가 해결되지 않으면, 다음을 통해 쿠버네티스의 윈도우 노드에서 윈도우 컨테이너를 실행하는 데 도움을 받을 수 있다.

* 스택오버플로우 [윈도우 서버 컨테이너](https://stackoverflow.com/questions/tagged/windows-server-container) 주제
* 쿠버네티스 공식 포럼 [discuss.kubernetes.io](https://discuss.kubernetes.io/)
* 쿠버네티스 슬랙 [#SIG-Windows Channel](https://kubernetes.slack.com/messages/sig-windows)
