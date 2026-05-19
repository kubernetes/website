---
# reviewers:
# - aravindhp
# - jayunit100
# - jsturtevant
# - marosset
title: 윈도우에서의 네트워킹
content_type: concept
weight: 110
---

<!-- overview -->

쿠버네티스는 리눅스 및 윈도우 노드를 지원한다. 
단일 클러스터 내에 두 종류의 노드를 혼합할 수 있다.
이 페이지에서는 윈도우 운영 체제에서의 네트워킹에 대한 개요를 제공한다.

<!-- body -->
## 윈도우에서의 컨테이너 네트워킹 {#networking}

윈도우 컨테이너에 대한 네트워킹은 
[CNI 플러그인](/ko/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/)을 통해 노출된다. 
윈도우 컨테이너는 네트워킹과 관련하여 가상 머신과 유사하게 작동한다. 
각 컨테이너에는 Hyper-V 가상 스위치(vSwitch)에 연결된 가상 네트워크 어댑터(vNIC)가 있다. 
호스트 네트워킹 서비스(HNS)와 호스트 컴퓨팅 서비스(HCS)는 함께 작동하여 
컨테이너를 만들고 컨테이너 vNIC을 네트워크에 연결한다. 
HCS는 컨테이너 관리를 담당하는 반면 
HNS는 다음과 같은 네트워킹 리소스 관리를 담당한다.

* 가상 네트워크(vSwitch 생성 포함)
* 엔드포인트 / vNIC
* 네임스페이스
* 정책(패킷 캡슐화, 로드 밸런싱 규칙, ACL, NAT 규칙 등)

윈도우 HNS(호스트 네트워킹 서비스)와 가상 스위치는 
네임스페이스를 구현하고 파드 또는 컨테이너에 필요한 가상 NIC을 만들 수 있다. 
그러나 DNS, 라우트, 메트릭과 같은 많은 구성은 
리눅스에서와 같이 `/etc/` 내의 파일이 아닌 윈도우 레지스트리 데이터베이스에 저장된다. 
컨테이너의 윈도우 레지스트리는 호스트 레지스트리와 별개이므로 
호스트에서 컨테이너로 `/etc/resolv.conf`를 매핑하는 것과 같은 개념은 리눅스에서와 동일한 효과를 갖지 않는다. 
해당 컨테이너의 컨텍스트에서 실행되는 윈도우 API를 사용하여 구성해야 한다. 
따라서 CNI 구현에서는 파일 매핑에 의존하는 대신 
HNS를 호출하여 네트워크 세부 정보를 파드 또는 컨테이너로 전달해야 한다.

## 네트워크 모드

윈도우는 L2bridge, L2tunnel, Overlay, Transparent 및 NAT의 다섯 가지 네트워킹 드라이버/모드를 지원한다. 
윈도우와 리눅스 워커 노드가 있는 이기종 클러스터에서는 
윈도우와 리눅스 모두에서 호환되는 네트워킹 솔루션을 선택해야 한다. 
윈도우에서 다음과 같은 out-of-tree 플러그인이 지원되며, 
어떠한 경우에 각 CNI를 사용하면 좋은지도 소개한다.

| 네트워크 드라이버 | 설명 | 컨테이너 패킷 수정 | 네트워크 플러그인 | 네트워크 플러그인 특성 |
| -------------- | ----------- | ------------------------------ | --------------- | ------------------------------ |
| L2bridge       | 컨테이너는 외부 vSwitch에 연결된다. 컨테이너는 언더레이 네트워크에 연결된다. 하지만 인그레스/이그레스시에 재작성되기 때문에 물리적 네트워크가 컨테이너 MAC을 학습할 필요가 없다. | MAC은 호스트 MAC에 다시 쓰여지고, IP는 HNS OutboundNAT 정책을 사용하여 호스트 IP에 다시 쓰여질 수 있다. | [win-bridge](https://github.com/containernetworking/plugins/tree/master/plugins/main/windows/win-bridge), [Azure-CNI](https://github.com/Azure/azure-container-networking/blob/master/docs/cni.md), Flannel 호스트-게이트웨이는 win-bridge를 사용한다. | win-bridge는 L2bridge 네트워크 모드를 사용하고, 컨테이너를 호스트의 언더레이에 연결하여 최상의 성능을 제공한다. 노드 간 연결을 위해 사용자 정의 경로(user-defined routes, UDR)가 필요하다. |
| L2Tunnel | 이것은 Azure에서만 사용되는 l2bridge의 특별 케이스다. 모든 패킷은 SDN 정책이 적용되는 가상화 호스트로 전송된다. | MAC 재작성되고, 언더레이 네트워크 상에서 IP가 보인다. | [Azure-CNI](https://github.com/Azure/azure-container-networking/blob/master/docs/cni.md) | Azure-CNI를 사용하면 컨테이너를 Azure vNET과 통합할 수 있으며, [Azure Virtual Network](https://azure.microsoft.com/en-us/services/virtual-network/)에서 제공하는 기능 집합을 활용할 수 있다. 예를 들어, Azure 서비스에 안전하게 연결하거나 Azure NSG를 사용한다. [azure-cni](https://docs.microsoft.com/azure/aks/concepts-network#azure-cni-advanced-networking) 예제를 참고한다. |
| Overlay | 컨테이너에는 외부 vSwitch에 연결된 vNIC이 제공된다. 각 오버레이 네트워크는 사용자 지정 IP 접두사로 정의된 자체 IP 서브넷을 가져온다. 오버레이 네트워크 드라이버는 VXLAN 캡슐화를 사용한다. | 외부 헤더로 캡슐화된다. | [win-overlay](https://github.com/containernetworking/plugins/tree/master/plugins/main/windows/win-overlay), Flannel VXLAN (win-overlay 사용) | win-overlay는 가상 컨테이너 네트워크를 호스트의 언더레이에서 격리하려는 경우(예: 보안 상의 이유로) 사용해야 한다. 데이터 센터의 IP에 제한이 있는 경우, (다른 VNID 태그가 있는) 다른 오버레이 네트워크에 IP를 재사용할 수 있다. 이 옵션을 사용하려면 Windows Server 2019에서 [KB4489899](https://support.microsoft.com/help/4489899)가 필요하다. |
| Transparent ([ovn-kubernetes](https://github.com/openvswitch/ovn-kubernetes)의 특수한 유스케이스) | 외부 vSwitch가 필요하다. 컨테이너는 논리적 네트워크(논리적 스위치 및 라우터)를 통해 파드 내 통신을 가능하게 하는 외부 vSwitch에 연결된다. | 패킷은 [GENEVE](https://datatracker.ietf.org/doc/draft-gross-geneve/) 또는 [STT](https://datatracker.ietf.org/doc/draft-davie-stt/) 터널링을 통해 캡슐화되는데, 동일한 호스트에 있지 않은 파드에 도달하기 위한 터널링을 한다. <br/> 패킷은 ovn 네트워크 컨트롤러에서 제공하는 터널 메타데이터 정보를 통해 전달되거나 삭제된다. <br/> NAT는 north-south 통신(데이터 센터와 클라이언트, 네트워크 상의 데이터 센터 외부와의 통신)을 위해 수행된다. | [ovn-kubernetes](https://github.com/openvswitch/ovn-kubernetes) | [Ansible을 통해 배포](https://github.com/openvswitch/ovn-kubernetes/tree/master/contrib)한다. 분산 ACL은 쿠버네티스 정책을 통해 적용할 수 있다. IPAM을 지원한다. kube-proxy 없이 로드 밸런싱을 수행할 수 있다. NAT를 수행할 때 iptables/netsh를 사용하지 않고 수행된다. |
| NAT (*쿠버네티스에서 사용되지 않음*) | 컨테이너에는 내부 vSwitch에 연결된 vNIC이 제공된다. DNS/DHCP는 [WinNAT](https://techcommunity.microsoft.com/t5/virtualization/windows-nat-winnat-capabilities-and-limitations/ba-p/382303)라는 내부 컴포넌트를 사용하여 제공된다. | MAC 및 IP는 호스트 MAC/IP에 다시 작성된다. | [nat](https://github.com/Microsoft/windows-container-networking/tree/master/plugins/nat) | 완전성을 위해 여기에 포함되었다. |

위에서 설명한 대로, [플란넬(Flannel)](https://github.com/coreos/flannel) 
[CNI 플러그인](https://github.com/flannel-io/cni-plugin)은 
[VXLAN 네트워크 백엔드](https://github.com/coreos/flannel/blob/master/Documentation/backends.md#vxlan)(**베타 지원**, win-overlay에 위임) 및 
[host-gateway network backend](https://github.com/coreos/flannel/blob/master/Documentation/backends.md#host-gw)(안정적인 지원, win-bridge에 위임)를 통해 
윈도우에서도 [지원](https://github.com/flannel-io/cni-plugin#windows-support-experimental)한다.

이 플러그인은 자동 노드 서브넷 임대 할당과 HNS 네트워크 생성을 위해 
윈도우의 Flannel 데몬(Flanneld)과 함께 작동할 수 있도록 
참조 CNI 플러그인(win-overlay, win-bridge) 중 하나에 대한 위임을 지원한다. 
이 플러그인은 자체 구성 파일 (cni.conf)을 읽고, 
이를 FlannelD가 생성한 `subnet.env` 파일의 환경 변수와 결합한다. 
이후 이를 네트워크 연결을 위한 참조 CNI 플러그인 중 하나에 위임하고, 
노드-할당 서브넷을 포함하는 올바른 구성을 IPAM 플러그인(예: `host-local`)으로 보낸다.

노드, 파드 및 서비스 오브젝트의 경우, 
TCP/UDP 트래픽에 대해 다음 네트워크 흐름이 지원된다.

* 파드 → 파드(IP)
* 파드 → 파드(이름)
* 파드 → 서비스(Cluster IP)
* 파드 → 서비스(PQDN, 단 "."이 없는 경우에만)
* 파드 → 서비스(FQDN)
* 파드 → External(IP)
* 파드 → External(DNS)
* 노드 → 파드
* 파드 → 노드

## IP 주소 관리 (IPAM) {#ipam}

The following IPAM options are supported on Windows:

* [host-local](https://github.com/containernetworking/plugins/tree/master/plugins/ipam/host-local)
* [azure-vnet-ipam](https://github.com/Azure/azure-container-networking/blob/master/docs/ipam.md)(azure-cni 전용)
* [Windows Server IPAM](https://docs.microsoft.com/windows-server/networking/technologies/ipam/ipam-top) (IPAM이 설정되지 않은 경우에 대한 폴백(fallback) 옵션)

## Load balancing and Services

쿠버네티스 {{< glossary_tooltip text="서비스" term_id="service" >}}는 
논리적 파드 집합 및 네트워크에서 해당 파드로 접근할 수 있는 수단을 정의하는 추상화이다. 
윈도우 노드가 포함된 클러스터에서, 다음과 같은 종류의 서비스를 사용할 수 있다.

* `NodePort`
* `ClusterIP`
* `LoadBalancer`
* `ExternalName`

윈도우 컨테이너 네트워킹은 리눅스 네트워킹과 몇 가지 중요한 차이점을 갖는다. 
[윈도우 컨테이너 네트워킹에 대한 마이크로소프트 문서](https://docs.microsoft.com/en-us/virtualization/windowscontainers/container-networking/architecture)에서 
상세 사항과 배경 지식을 제공한다.

윈도우에서는 다음 설정을 사용하여 
서비스 및 로드 밸런싱 동작을 구성할 수 있다.

{{< table caption="윈도우 서비스 구성" >}}
| 기능 | 설명 | 지원하는 최소 윈도우 OS 빌드 | 활성화하는 방법 |
| ------- | ----------- | -------------------------- | ------------- |
| 세션 어피니티 | 특정 클라이언트의 연결이 매번 동일한 파드로 전달되도록 한다. | Windows Server 2022 | `service.spec.sessionAffinity`를 "ClientIP"로 설정 |
| 서버 직접 반환 (DSR, Direct Server Return) | IP 주소 수정 및 LBNAT가 컨테이너 vSwitch 포트에서 직접 발생하는 로드 밸런싱 모드. 서비스 트래픽은 소스 IP가 원래 파드 IP로 설정된 상태로 도착한다. | Windows Server 2019 | kube-proxy에 `--feature-gates="WinDSR=true" --enable-dsr=true` 플래그를 설정한다. |
| 목적지 보존(Preserve-Destination) | 서비스 트래픽의 DNAT를 스킵하여, 백엔드 파드에 도달하는 패킷에서 목적지 서비스의 가상 IP를 보존한다. 또한 노드-노드 전달을 비활성화한다. | Windows Server, version 1903 | 서비스 어노테이션에 `"preserve-destination": "true"`를 설정하고 kube-proxy에 DSR을 활성화한다. |
| IPv4/IPv6 이중 스택 네트워킹 | 클러스터 내/외부에 네이티브 IPv4-to-IPv4 통신 및 IPv6-to-IPv6 통신 활성화 | Windows Server 2019 | [IPv4/IPv6 이중 스택](#ipv4ipv6-dual-stack)을 참고한다. |
| 클라이언트 IP 보존 | 인그레스 트래픽의 소스 IP가 유지되도록 한다. 또한 노드-노드 전달을 비활성화한다. |  Windows Server 2019  | Set `service.spec.externalTrafficPolicy`를 "Local"로 설정하고 kube-proxy에 DSR을 활성화한다. |
{{< /table >}}

{{< warning >}}
목적지 노드가 Windows Server 2022를 실행 중인 경우, 오버레이 네트워킹에서 NodePort 서비스에 문제가 있음이 알려져 있다. 
이 이슈를 완전히 피하려면, 서비스에 `externalTrafficPolicy: Local`를 설정한다.

KB5005619 또는 그 이상이 설치된 Windows Server 2022의 경우, l2bridge 네트워크에서 파드 간 연결성에 문제가 있음이 알려져 있다. 
이 이슈를 우회하고 파드 간 연결성을 복구하기 위해, kube-proxy의 WinDSR 기능을 비활성화할 수 있다.

이 이슈들을 해결하기 위해서는 운영 체제를 패치해야 한다. 
이와 관련해서는 https://github.com/microsoft/Windows-Containers/issues/204 를 참고한다.
{{< /warning >}}

## 제한

다음 네트워킹 기능은 윈도우 노드에서 지원되지 _않는다_.

* 호스트 네트워킹 모드
* 노드 자체에서 로컬 NodePort로의 접근(다른 노드 또는 외부 클라이언트에서는 가능)
* 단일 서비스에 대해 64개를 초과하는 백엔드 파드 (또는 고유한 목적지 주소)
* 오버레이 네트워크에 연결된 윈도우 파드 간의 IPv6 통신
* non-DSR 모드에서의 로컬 트래픽 정책(Local Traffic Policy)
* win-overlay, win-bridge, Azure-CNI 플러그인을 통해 ICMP 프로토콜을 사용하는 아웃바운드 통신.
  특히, 윈도우 데이터 플레인([VFP](https://www.microsoft.com/en-us/research/project/azure-virtual-filtering-platform/))은 
  ICMP 패킷 치환을 지원하지 않는다. 이것은 다음을 의미한다.
  * 동일한 네트워크 내의 목적지로 전달되는 ICMP 패킷(예: ping을 통한 파드 간 통신)은 
    예상대로 제한 없이 작동한다.
  * TCP/UDP 패킷은 예상대로 제한 없이 작동한다.
  * 원격 네트워크를 통과하도록 지정된 ICMP 패킷(예: ping을 통한 파드에서 외부 인터넷으로의 통신)은 
    치환될 수 없으므로 소스로 다시 라우팅되지 않는다.
  * TCP/UDP 패킷은 여전히 치환될 수 있기 때문에 `ping <destination>`을 
    `curl <destination>`으로 대체하여 외부와의 연결을 디버깅할 수 있다.

다른 제한도 존재한다.

* 윈도우 참조 네트워크 플러그인 win-bridge와 win-overlay는
  현재 `CHECK` 구현 누락으로 인해 
  [CNI 사양](https://github.com/containernetworking/cni/blob/master/SPEC.md) v0.4.0을 구현하지 않는다.
* Flannel VXLAN CNI는 윈도우에서 다음과 같은 제한이 있다.
  * 노드-파드 연결은 Flannel v0.12.0(또는 그 이상) 상의 로컬 파드에서만 가능하다.
  * Flannel은 VNI 4096 및 UDP 4789 포트만 사용하도록 제한된다. 
    이 파라미터에 대한 더 자세한 사항은 
    공식 [Flannel VXLAN](https://github.com/coreos/flannel/blob/master/Documentation/backends.md#vxlan) 백엔드 문서를 참조한다.
