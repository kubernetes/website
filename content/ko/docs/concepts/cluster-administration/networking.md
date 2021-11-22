---


title: 클러스터 네트워킹
content_type: concept
weight: 50
---

<!-- overview -->
네트워킹은 쿠버네티스의 중심적인 부분이지만, 어떻게 작동하는지 정확하게
이해하기가 어려울 수 있다. 쿠버네티스에는 4가지 대응해야 할 네트워킹
문제가 있다.

1. 고도로 결합된 컨테이너 간의 통신: 이 문제는
   {{< glossary_tooltip text="파드" term_id="pod" >}}와 `localhost` 통신으로 해결된다.
2. 파드 간 통신: 이 문제가 이 문서의 주요 초점이다.
3. 파드와 서비스 간 통신: 이 문제는 [서비스](/ko/docs/concepts/services-networking/service/)에서 다룬다.
4. 외부와 서비스 간 통신: 이 문제는 [서비스](/ko/docs/concepts/services-networking/service/)에서 다룬다.

<!-- body -->

쿠버네티스는 애플리케이션 간에 머신을 공유하는 것이다. 일반적으로,
머신을 공유하려면 두 애플리케이션이 동일한 포트를 사용하지 않도록
해야 한다. 여러 개발자 간에 포트를 조정하는 것은 대규모로 실시하기가 매우 어렵고,
사용자가 통제할 수 없는 클러스터 수준의 문제에 노출된다.

동적 포트 할당은 시스템에 많은 복잡성을 야기한다. 모든
애플리케이션은 포트를 플래그로 가져와야 하며, API 서버는 동적 포트 번호를
구성 블록에 삽입하는 방법을 알아야 하고, 서비스는 서로를
찾는 방법 등을 알아야 한다. 쿠버네티스는 이런 것들을 다루는 대신
다른 접근법을 취한다.

## 쿠버네티스 네트워크 모델

모든 `Pod` 에는 고유의 IP 주소가 있다. 즉, `Pod` 간에 링크를 명시적으로
생성할 필요가 없으며 컨테이너 포트를 호스트 포트에 매핑할
필요가 거의 없다. 이렇게 하면 포트 할당, 이름 지정, 서비스 검색, 로드 밸런싱,
애플리케이션 구성 및 마이그레이션 관점에서 `Pod` 를 VM 또는
물리적 호스트처럼 취급할 수 있는 깔끔하고, 하위 호환성
있는 모델이 생성된다.

쿠버네티스는 모든 네트워크 구현에 다음과 같은
기본 요구 사항을 적용한다(의도적 네트워크 세분화 정책 제외).

   * 노드의 파드는 NAT 없이 모든 노드의 모든 파드와 통신할 수 있다.
   * 노드의 에이전트(예: 시스템 데몬, kubelet)는 해당 노드의 모든
     파드와 통신할 수 있다.

참고: 호스트 네트워크에서 실행되는 `Pod` 를 지원하는 리눅스와 같은 플랫폼의 경우, 다음의 요구 사항을
적용한다.

   * 노드의 호스트 네트워크에 있는 파드는 NAT 없이 모든 노드에 있는 모든
     파드와 통신할 수 있다.

이 모델은 전체적으로 덜 복잡할 뿐만 아니라, 쿠버네티스를 위해 VM에서
컨테이너로 애플리케이션을 포팅할 때 충돌이 적게 구현하려는 요구와
주로 호환된다. 잡이 이전에 VM에서 실행된 경우, VM에 IP가 있고
프로젝트의 다른 VM과 통신할 수 있다. 이것은 동일한 기본 모델이다.

쿠버네티스의 IP 주소는 그것의 IP 주소와 MAC 주소를 포함하여 `Pod` 범위에 존재한다(`Pod` 내
컨테이너는 네트워크 네임스페이스를 공유함). 이것은 `Pod` 내 컨테이너가 모두
`localhost` 에서 서로의 포트에 도달할 수 있다는 것을 의미한다. 또한
`Pod` 내부의 컨테이너 포트의 사용을 조정해야하는 것을 의미하지만, 이것도
VM 내의 프로세스와 동일하다. 이것을 "IP-per-pod(파드별 IP)" 모델이라고 
한다.

이것이 어떻게 구현되는 지는 사용 중인 특정 컨테이너 런타임의 세부 사항이다.

`Pod` 로 전달하는 `Node` 자체의 포트(호스트 포트라고 함)를
요청할 수 있지만, 이는 매우 틈새 작업이다. 전달이 구현되는 방법은
컨테이너 런타임의 세부 사항이기도 하다. `Pod` 자체는
호스트 포트의 존재 여부에 대해 인식하지 못한다.

## 쿠버네티스 네트워크 모델의 구현 방법

이 네트워크 모델을 구현할 수 있는 방법에는 여러 가지가 있다. 이
문서는 다양한 방법에 대한 철저한 연구는 아니지만, 다양한 기술에 대한
소개로 활용되며 도약하는 포인트로 사용되기를 바란다.

이 목록은 알파벳 순으로 정렬되어 있으며, 정렬된 순서가
우선 상태를 의미하는 것은 아니다.

{{% thirdparty-content %}}

### ACI

[Cisco 애플리케이션 센트릭 인프라스트럭처(Application Centric Infrastructure)](https://www.cisco.com/c/en/us/solutions/data-center-virtualization/application-centric-infrastructure/index.html)는 컨테이너, 가상 머신 및 베어메탈 서버를 지원하는 통합 오버레이 및 언더레이 SDN 솔루션을 제공한다. [ACI](https://www.github.com/noironetworks/aci-containers)는 ACI를 위한 컨테이너 네트워킹 통합을 제공한다. 통합의 개요는 [여기](https://www.cisco.com/c/dam/en/us/solutions/collateral/data-center-virtualization/application-centric-infrastructure/solution-overview-c22-739493.pdf)에서 제공된다.

### Antrea

프로젝트 [Antrea](https://github.com/vmware-tanzu/antrea)는 쿠버네티스 고유의 오픈소스 쿠버네티스 네트워킹 솔루션이다. 네트워킹 데이터 플레인으로 Open vSwitch를 활용한다. Open vSwitch는 리눅스와 윈도우를 모두 지원하는 고성능의 프로그래밍이 가능한 가상 스위치이다. Antrea는 Open vSwitch를 통해 쿠버네티스 네트워크 정책을 고성능의 효율적인 방식으로 구현할 수 있다.
Antrea는 Open vSwitch의 "프로그래밍이 가능한" 특성으로 인해 Open vSwitch 위에 광범위한 네트워킹 및 보안 기능과 서비스를 구현할 수 있다.

### 쿠버네티스용 AWS VPC CNI

[AWS VPC CNI](https://github.com/aws/amazon-vpc-cni-k8s)는 쿠버네티스 클러스터를 위한 통합된 AWS 버추얼 프라이빗 클라우드(Virtual Private Cloud, VPC) 네트워킹을 제공한다. 이 CNI 플러그인은 높은 처리량과 가용성, 낮은 레이턴시(latency) 그리고 최소 네트워크 지터(jitter)를 제공한다. 또한, 사용자는 쿠버네티스 클러스터를 구축하기 위한 기존의 AWS VPC 네트워킹 및 보안 모범 사례를 적용할 수 있다. 여기에는 VPC 플로우 로그, VPC 라우팅 정책과 네트워크 트래픽 격리를 위한 보안 그룹을 사용하는 기능이 포함되어 있다.

이 CNI 플러그인을 사용하면 쿠버네티스 파드는 VPC 네트워크와 동일한 IP 주소를 파드 내부에 가질 수 있다. CNI는 각 쿠버네티스 노드에 AWS 엘라스틱 네트워킹 인터페이스(Elastic Networking Interfaces, ENI)를 할당하고 노드의 파드에 대해 각 ENI의 보조 IP 범위를 사용한다. CNI에는 파드를 빠르게 시작하기 위해 ENI와 IP 주소의 사전 할당 제어 기능이 포함되어 있으며 최대 2,000개의 노드로 구성된 대규모 클러스터가 가능하다.

또한, CNI는 [네트워크 폴리시 적용을 위해 캘리코(Calico)](https://docs.aws.amazon.com/eks/latest/userguide/calico.html)와 함께 실행할 수 있다. AWS VPC CNI 프로젝트는 [GitHub의 문서](https://github.com/aws/amazon-vpc-cni-k8s)와 함께 오픈소스로 공개되어 있다.

### 쿠버네티스용 Azure CNI
[Azure CNI](https://docs.microsoft.com/en-us/azure/virtual-network/container-networking-overview)는 VM과 동등한 네트워크 성능을 제공하는 Azure 버추얼 네트워크(VNet이라고도 알려진)와 쿠버네티스 파드를 통합하는 [오픈소스](https://github.com/Azure/azure-container-networking/blob/master/docs/cni.md) 플러그인이다. 파드는 피어링된 VNet과 Express Route 또는 사이트 간 VPN을 통해 온-프레미스에 연결할 수 있으며 이러한 네트워크에서 직접 연결할 수도 있다. 파드는 서비스 엔드포인트 또는 프라이빗 링크로 보호되는 스토리지와 SQL과 같은 Azure 서비스에 접근할 수 있다. VNet 보안 정책과 라우팅을 사용하여 파드 트래픽을 필터링할 수 있다. 플러그인은 쿠버네티스 노드의 네트워크 인터페이스에 사전 구성된 보조 IP 풀을 활용하여 VNet IP를 파드에 할당한다.

Azure CNI는 [Azure 쿠버네티스 서비스(Azure Kubernetes Service, AKS)](https://docs.microsoft.com/en-us/azure/aks/configure-azure-cni)에서 기본적으로 사용할 수 있다.

### 캘리코

[캘리코](https://docs.projectcalico.org/)는 컨테이너, 가상 시스템 및 기본 호스트 기반 워크로드를 위한 오픈소스 네트워킹 및 네트워크 보안 솔루션이다. 캘리코는 순수 리눅스 eBPF 데이터플레인, 표준 리눅스 네트워킹 데이터플레인, 윈도우 HNS 데이터플레인을 포함한 여러 데이터플레인을 지원한다. 캘리코는 완전한 네트워킹 스택을 제공하지만, [클라우드 제공자 CNI](https://docs.projectcalico.org/networking/determine-best-networking#calico-compatible-cni-plugins-and-cloud-provider-integrations)와 함께 사용하여 네트워크 정책 시행을 제공할 수도 있다.

### 실리움(Cilium)

[실리움](https://github.com/cilium/cilium)은 애플리케이션 컨테이너 간에
네트워크 연결을 제공하고 투명하게 보호하기 위한 오픈소스 소프트웨어이다.
실리움은 L7/HTTP를 인식하며 네트워크 주소 지정에서 분리된 ID 기반 보안 모델을 사용하여 L3-L7에서
네트워크 정책을 적용할 수 있으며,
다른 CNI 플러그인과 함께 사용할 수 있다.

### 화웨이의 CNI-Genie

[CNI-Genie](https://github.com/Huawei-PaaS/CNI-Genie)는 쿠버네티스가 런타임 시 [쿠버네티스 네트워크 모델](https://github.com/kubernetes/website/blob/master/content/en/docs/concepts/cluster-administration/networking.md#the-kubernetes-network-model)의 [서로 다른 구현에 동시에 접근](https://github.com/Huawei-PaaS/CNI-Genie/blob/master/docs/multiple-cni-plugins/README.md#what-cni-genie-feature-1-multiple-cni-plugins-enables)할 수 있는 CNI 플러그인이다. 여기에는 [플라넬(Flannel)](https://github.com/coreos/flannel#flannel), [캘리코](https://docs.projectcalico.org/), [로마나(Romana)](https://romana.io), [위브넷(Weave-net)](https://www.weave.works/products/weave-net/)과 같은 [CNI 플러그인](https://github.com/containernetworking/cni#3rd-party-plugins)으로 실행되는 모든 구현이 포함된다.

CNI-Genie는 각각 다른 CNI 플러그인에서 [하나의 파드에 여러 IP 주소를 할당](https://github.com/Huawei-PaaS/CNI-Genie/blob/master/docs/multiple-ips/README.md#feature-2-extension-cni-genie-multiple-ip-addresses-per-pod)하는 것도 지원한다.

### cni-ipvlan-vpc-k8s
[cni-ipvlan-vpc-k8s](https://github.com/lyft/cni-ipvlan-vpc-k8s)는
L2 모드에서 리눅스 커널의 IPvlan 드라이버를 사용하여 Amazon 엘라스틱 네트워크 인터페이스(ENI)를
사용하고 AWS 매니지드 IP를 파드에 바인딩하는
Amazon 버추얼 프라이빗 클라우드(VPC) 환경 내에서 쿠버네티스를 위한
간단하고, 호스트 로컬, 낮은 레이턴시, 높은 처리량 및 호환 네트워킹 스택을 제공하는
CNI와 IPAM 플러그인 셋을 포함한다.

플러그인은 VPC 내에서 구성하고 배포할 수 있도록 간단하게 설계되었다.
Kubelets는 오버레이 네트워크 관리, BGP 관리, 소스/대상 확인 비활성화 또는
VPC 라우팅 테이블을 조정하여 각 호스트에 인스턴스별 서브넷을
제공(VPC별 50-100개 항목으로 제한)하는 등의 자주 권장되는 복잡성을 요구하지 않고
부팅한 다음 필요에 따라 IP 사용량을 자체 구성하고 확장할
수 있다. 즉, cni-ipvlan-vpc-k8s는 AWS 내에서 쿠버네티스를
대규모로 배포하는 데 필요한 네트워크 복잡성을 크게 줄인다.

### Coil

[Coil](https://github.com/cybozu-go/coil)은 통합이 용이하도록 설계된 CNI 플러그인으로 유연한 이그레스(egress) 네트워킹을 제공한다.
Coil은 베어메탈에 비해 낮은 오버헤드로 작동하며, 외부 네트워크에 대해 임의의 이그레스 NAT 게이트웨이를 정의할 수 있다.

### 콘티브(Contiv)

[콘티브](https://github.com/contiv/netplugin)는 다양한 적용 사례에서 구성 가능한 네트워킹(BGP를 사용하는 네이티브 L3, vxlan을 사용하는 오버레이, 클래식 L2 또는 Cisco-SDN/ACI)을 제공한다.

### 콘트레일(Contrail) / 텅스텐 패브릭(Tungsten Fabric)

[텅스텐 패브릭](https://tungsten.io)을 기반으로 하는 [콘트레일](https://www.juniper.net/us/en/products-services/sdn/contrail/contrail-networking/)은 진정한 개방형 멀티 클라우드 네트워크 가상화 및 정책 관리 플랫폼이다. 콘트레일 및 텅스텐 패브릭은 쿠버네티스, OpenShift, OpenStack 및 Mesos와 같은 다양한 오케스트레이션 시스템과 통합되어 있으며, 가상 머신, 컨테이너/파드 및 베어메탈 워크로드에 대해 서로 다른 격리 모드를 제공한다.

### DANM

[DANM](https://github.com/nokia/danm)은 쿠버네티스 클러스터에서 실행되는 통신사 워크로드를 위한 네트워킹 솔루션이다. 다음의 컴포넌트로 구성된다.

   * 고급 기능들로 IPVLAN 인터페이스를 프로비저닝할 수 있는 CNI 플러그인
   * 여러 클러스터 전체의 불연속 L3 네트워크를 관리하고 요청 시 동적, 정적 또는 IP를 할당하지 않는 방식을 제공하는 내장 IPAM 모듈
   * 자체 CNI를 통해서, 또는 SRI-OV나 플라넬과 같은 널리 사용되는 CNI 솔루션에 잡을 동시에 위임하여 여러 네트워크 인터페이스를 컨테이너에 연결할 수 있는 CNI 메타플러그인
   * 모든 쿠버네티스 호스트의 VxLAN 및 VLAN 인터페이스를 중앙에서 관리할 수 있는 쿠버네티스 컨트롤러
   * 쿠버네티스의 서비스 기반의 서비스 검색 개념을 확장하여 파드의 모든 네트워크 인터페이스에서 작동하는 다른 쿠버네티스 컨트롤러

이 도구 셋을 통해 DANM은 여러 개의 분리된 네트워크 인터페이스를 제공할 수 있으며, 파드에 다른 네트워킹 백엔드 및 고급 IPAM 기능을 사용할 수 있다.

### 플라넬

[플라넬](https://github.com/coreos/flannel#flannel)은 쿠버네티스 요구 사항을
충족하는 매우 간단한 오버레이 네트워크이다. 많은
경우에 쿠버네티스와 플라넬은 성공적으로 적용이 가능하다.

### Google 컴퓨트 엔진(GCE)

Google 컴퓨트 엔진 클러스터 구성 스크립트의 경우, [고급
라우팅](https://cloud.google.com/vpc/docs/routes)을 사용하여
각 VM에 서브넷을 할당한다(기본값은 `/24` - 254개 IP). 해당 서브넷에 바인딩된
모든 트래픽은 GCE 네트워크 패브릭에 의해 VM으로 직접 라우팅된다. 이는
아웃 바운드 인터넷 접근을 위해 NAT로 구성된 VM에 할당된 "기본"
IP 주소에 추가된다. 리눅스 브릿지(`cbr0`)는 해당 서브넷에 존재하도록
구성되며, 도커의 `--bridge` 플래그로 전달된다.

도커는 다음의 설정으로 시작한다.

```shell
DOCKER_OPTS="--bridge=cbr0 --iptables=false --ip-masq=false"
```

이 브릿지는 노드의 `.spec.podCIDR`에 따라 Kubelet(`--network-plugin=kubenet`
플래그로 제어되는)에 의해 생성된다.

도커는 이제 `cbr-cidr` 블록에서 IP를 할당한다. 컨테이너는 `cbr0` 브릿지를
통해 서로 `Node` 에 도달할 수 있다. 이러한 IP는 모두 GCE 프로젝트 네트워크
내에서 라우팅할 수 있다.

그러나, GCE 자체는 이러한 IP에 대해 전혀 알지 못하므로, 아웃 바운드 인터넷 트래픽을 위해
IP를 NAT하지 않는다. 그것을 달성하기 위해 iptables 규칙을 사용하여
GCE 프로젝트 네트워크(10.0.0.0/8) 외부의 IP에 바인딩된 트래픽을
마스커레이드(일명 SNAT - 마치 패킷이 `Node` 자체에서 온 것처럼
보이게 함)한다.

```shell
iptables -t nat -A POSTROUTING ! -d 10.0.0.0/8 -o eth0 -j MASQUERADE
```

마지막으로 커널에서 IP 포워딩이 활성화되어 있으므로, 커널은 브릿지된 컨테이너에
대한 패킷을 처리한다.

```shell
sysctl net.ipv4.ip_forward=1
```

이 모든 것의 결과는 모든 `Pod` 가 서로에게 도달할 수 있고 인터넷으로 트래픽을
송신할 수 있다는 것이다.

### 재규어(Jaguar)

[재규어](https://gitlab.com/sdnlab/jaguar)는 OpenDaylight 기반의 쿠버네티스 네트워크를 위한 오픈소스 솔루션이다. 재규어는 vxlan을 사용하여 오버레이 네트워크를 제공하고 재규어 CNI 플러그인은 파드별로 하나의 IP 주소를 제공한다.

### k-vswitch

[k-vswitch](https://github.com/k-vswitch/k-vswitch)는 [Open vSwitch](https://www.openvswitch.org/) 기반의 간단한 쿠버네티스 네트워킹 플러그인이다. Open vSwitch의 기존 기능을 활용하여 운영하기 쉽고, 성능이 뛰어나고 안전한 강력한 네트워킹 플러그인을 제공한다.

### Knitter

[Knitter](https://github.com/ZTE/Knitter/)는 쿠버네티스에서 여러 네트워킹을 지원하는 네트워크 솔루션이다. 테넌트 관리 및 네트워크 관리 기능을 제공한다. Knitter에는 애플리케이션의 IP 주소 유지, IP 주소 마이그레이션 등과 같은 여러 네트워크 플레인 외에 엔드-투-엔드 NFV 컨테이너 네트워킹 솔루션 셋이 포함되어 있다.

### Kube-OVN

[Kube-OVN](https://github.com/alauda/kube-ovn)은 기업을 위한 OVN 기반 쿠버네티스 네트워크 패브릭이다. OVN/OVS의 도움으로, 서브넷, QoS, 고정 IP 할당, 트래픽 미러링, 게이트웨이, 오픈플로우 기반 네트워크 정책 및 서비스 프록시와 같은 고급 오버레이 네트워크 기능을 제공한다.

### Kube-router

[kube-router](https://github.com/cloudnativelabs/kube-router)는 쿠버네티스를 위한 특수 목적의 네트워킹 솔루션으로 고성능 및 운영 단순성을 제공한다. 큐브 라우터는 리눅스 [LVS/IPVS](https://www.linuxvirtualserver.org/software/ipvs.html) 기반 서비스 프록시, 오버레이가 없는 리눅스 커널 포워딩 기반의 파드 간 네트워킹 솔루션 그리고 iptables/ipset 기반 네트워크 정책 집행도구를 제공한다.

### L2 네트워크 및 리눅스 브릿지

"베어메탈" 환경의 간단한 스위치와 같은 "더미(dumb)" L2 네트워크가 있는 경우,
위의 GCE 설정과 비슷한 작업을 수행할 수 있어야 한다.
이 방법은 매우 우연히 시도되었고 작동하는 것으로 보이지만
철저히 테스트되지 않았다. 이 기술을 사용하여
프로세스를 완료한 경우, 알려주길 바란다.

Lars Kellogg-Stedman이 제공하는
[이 훌륭한 튜토리얼](https://blog.oddbit.com/2014/08/11/four-ways-to-connect-a-docker/)의
"With Linux Bridge devices" 섹션을 참고한다.

### Multus(멀티 네트워크 플러그인)

[Multus](https://github.com/Intel-Corp/multus-cni)는 쿠버네티스의 CRD 기반 네트워크 오브젝트를 사용하여 쿠버네티스에서 멀티 네트워킹 기능을 지원하는 멀티 CNI 플러그인이다.

Multus는 CNI 명세를 구현하는 모든 [레퍼런스 플러그인](https://github.com/containernetworking/plugins)(예: [플라넬](https://github.com/containernetworking/cni.dev/blob/main/content/plugins/v0.9/meta/flannel.md), [DHCP](https://github.com/containernetworking/plugins/tree/master/plugins/ipam/dhcp), [Macvlan](https://github.com/containernetworking/plugins/tree/master/plugins/main/macvlan)) 및 써드파티 플러그인(예: [캘리코](https://github.com/projectcalico/cni-plugin), [위브(Weave)](https://github.com/weaveworks/weave), [실리움](https://github.com/cilium/cilium), [콘티브](https://github.com/contiv/netplugin))을 지원한다. 또한, Multus는 쿠버네티스의 클라우드 네이티브 애플리케이션과 NFV 기반 애플리케이션을 통해 쿠버네티스의 [SRIOV](https://github.com/hustcat/sriov-cni), [DPDK](https://github.com/Intel-Corp/sriov-cni), [OVS-DPDK 및 VPP](https://github.com/intel/vhost-user-net-plugin) 워크로드를 지원한다.

### OVN4NFV-K8s-Plugin (OVN 기반의 CNI 컨트롤러 & 플러그인)

[OVN4NFV-K8S-Plugin](https://github.com/opnfv/ovn4nfv-k8s-plugin)은 OVN 기반의 CNI 컨트롤러 플러그인으로 클라우드 네이티브 기반 서비스 기능 체인(Service function chaining(SFC)), 다중 OVN 오버레이 네트워킹, 동적 서브넷 생성, 동적 가상 네트워크 생성, VLAN 공급자 네트워크, 직접 공급자 네트워크와 멀티 클러스터 네트워킹의 엣지 기반 클라우드 등 네이티브 워크로드에 이상적인 멀티 네티워크 플러그인이다.

### NSX-T

[VMware NSX-T](https://docs.vmware.com/en/VMware-NSX-T/index.html)는 네트워크 가상화 및 보안 플랫폼이다. NSX-T는 멀티 클라우드 및 멀티 하이퍼바이저 환경에 네트워크 가상화를 제공할 수 있으며 이기종 엔드포인트와 기술 스택이 있는 새로운 애플리케이션 프레임워크 및 아키텍처에 중점을 둔다. vSphere 하이퍼바이저 외에도, 이러한 환경에는 KVM, 컨테이너 및 베어메탈과 같은 다른 하이퍼바이저가 포함된다.

[NSX-T 컨테이너 플러그인(NCP)](https://docs.vmware.com/en/VMware-NSX-T/2.0/nsxt_20_ncp_kubernetes.pdf)은 NSX-T와 쿠버네티스와 같은 컨테이너 오케스트레이터 사이의 통합은 물론, NSX-T와 Pivotal 컨테이너 서비스(PKS) 및 OpenShift와 같은 컨테이너 기반 CaaS/PaaS 플랫폼 간의 통합을 제공한다.

### OpenVSwitch

[OpenVSwitch](https://www.openvswitch.org/)는 다소 성숙하지만
오버레이 네트워크를 구축하는 복잡한 방법이다. 이것은 네트워킹 분야의 몇몇
"대형 벤더"에 의해 승인되었다.

### OVN(오픈 버추얼 네트워킹)

OVN은 Open vSwitch 커뮤니티에서 개발한 오픈소스 네트워크
가상화 솔루션이다. 논리적 스위치, 논리적 라우터, 스테이트풀 ACL, 로드 밸런서 등을 생성하여
서로 다른 가상 네트워킹 토폴로지를 구축할 수 있다. 이 프로젝트에는
[ovn-kubernetes](https://github.com/openvswitch/ovn-kubernetes)에
특정 쿠버네티스 플러그인 및 문서가 있다.

### 로마나

[로마나](https://romana.io)는 오버레이 네트워크 없이 쿠버네티스를 배포할 수 있는 오픈소스 네트워크 및 보안 자동화 솔루션이다. 로마나는 쿠버네티스 [네트워크 폴리시](/ko/docs/concepts/services-networking/network-policies/)를 지원하여 네트워크 네임스페이스에서 격리를 제공한다.

### Weaveworks의 위브넷

[위브넷](https://www.weave.works/products/weave-net/)은
쿠버네티스 및 호스팅된 애플리케이션을 위한 탄력적이고 사용하기 쉬운 네트워크이다.
위브넷은 [CNI 플러그인](https://www.weave.works/docs/net/latest/cni-plugin/) 또는
독립형으로 실행된다. 두 버전에서, 실행하기 위해 구성이나 추가 코드가 필요하지 않으며,
두 경우 모두, 쿠버네티스의 표준과 같이 네트워크에서 파드별로 하나의 IP 주소를 제공한다.

## {{% heading "whatsnext" %}}

네트워크 모델의 초기 설계와 그 근거 및 미래의 계획은
[네트워킹 디자인 문서](https://git.k8s.io/community/contributors/design-proposals/network/networking.md)에
자세히 설명되어 있다.
