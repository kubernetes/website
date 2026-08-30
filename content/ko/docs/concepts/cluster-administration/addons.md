---
title: 애드온 설치
content_type: concept
weight: 150
---

<!-- overview -->

{{% thirdparty-content %}}

애드온은 쿠버네티스의 기능을 확장한다.

이 페이지는 사용 가능한 일부 애드온과 관련 설치 지침 링크를 나열한다.
이 목록은 모든 애드온을 다루지는 않는다.

<!-- body -->

## 네트워킹과 네트워크 폴리시

* [ACI](https://www.github.com/noironetworks/aci-containers)는 Cisco ACI를 통해 통합된
  컨테이너 네트워킹과 네트워크 보안을 제공한다.
* [Antrea](https://antrea.io/)는 레이어 3/4에서 동작하며, Open vSwitch를 네트워킹
  데이터 플레인으로 활용하여 쿠버네티스에 네트워킹 및 보안 서비스를 제공한다.
  Antrea는 [샌드박스 단계의 CNCF 프로젝트](https://www.cncf.io/projects/antrea/)이다.
* [Calico](https://www.tigera.io/project-calico/)는 네트워킹 및 네트워크
  폴리시 제공자이다. Calico는 유연한 네트워킹 옵션을 지원하므로
  BGP 사용 여부와 관계없이 비오버레이 네트워크와 오버레이 네트워크를 포함하여
  상황에 가장 효율적인 옵션을 선택할 수 있다. Calico는 동일한 엔진을 사용하여
  호스트, 파드 및 (Istio와 Envoy를 사용하는 경우) 서비스 메시 계층의
  애플리케이션에 네트워크 폴리시를 적용한다.
* [Canal](https://projectcalico.docs.tigera.io/getting-started/kubernetes/flannel/flannel)은
  Flannel과 Calico를 통합하여 네트워킹 및 네트워크 폴리시를 제공한다.
* [Cilium](https://github.com/cilium/cilium)은 eBPF 기반 데이터 플레인을 사용하는 네트워킹, 가시성
  및 보안 솔루션이다. Cilium은 여러 클러스터에 걸쳐 사용할 수 있는
  단순한 플랫 레이어 3 네트워크를 네이티브 라우팅 또는 오버레이/캡슐화 모드로
  제공하며, 네트워크 주소 지정과 분리된 신원 기반 보안 모델을 사용하여
  L3-L7에서 네트워크 폴리시를 적용할 수 있다. Cilium은
  kube-proxy를 대체할 수 있으며, 선택적으로 사용할 수 있는 추가 가시성 및 보안 기능도 제공한다.
  Cilium은 [졸업 단계의 CNCF 프로젝트](https://www.cncf.io/projects/cilium/)이다.
* [CNI-Genie](https://github.com/cni-genie/CNI-Genie)를 사용하면 쿠버네티스가 Calico, Canal, Flannel 또는 Weave와 같은
  CNI 플러그인 중 하나를 선택하여 원활하게 연결할 수 있다.
  CNI-Genie는 [샌드박스 단계의 CNCF 프로젝트](https://www.cncf.io/projects/cni-genie/)이다.
* [Contiv](https://contivpp.io/)는 다양한 사용 사례와 풍부한
  폴리시 프레임워크를 위해 구성 가능한 네트워킹(BGP를 사용하는 네이티브 L3,
  VXLAN을 사용하는 오버레이, 클래식 L2, Cisco-SDN/ACI)을 제공한다. Contiv 프로젝트는 완전히
  [오픈 소스](https://github.com/contiv)로 공개되어 있다.
  [인스톨러](https://github.com/contiv/install)는 kubeadm 기반 및
  비-kubeadm 기반 설치 옵션을 모두 제공한다.
* [Contrail](https://www.juniper.net/us/en/products-services/sdn/contrail/contrail-networking/)은
  [Tungsten Fabric](https://tungsten.io)을 기반으로 하는 오픈 소스 멀티 클라우드
  네트워크 가상화 및 폴리시 관리 플랫폼이다. Contrail과 Tungsten
  Fabric은 쿠버네티스, OpenShift,
  OpenStack, Mesos와 같은 오케스트레이션 시스템과 통합되며, 가상 머신, 컨테이너/파드
  및 베어 메탈 워크로드를 위한 격리 모드를 제공한다.
* [Flannel](https://github.com/flannel-io/flannel#deploying-flannel-manually)은
  쿠버네티스와 함께 사용할 수 있는 오버레이 네트워크 제공자이다.
* [Gateway API](/docs/concepts/services-networking/gateway/)는
  [SIG Network](https://github.com/kubernetes/community/tree/main/sig-network) 커뮤니티가 관리하는 오픈 소스 프로젝트이며,
  서비스 네트워킹을 모델링하기 위한 표현력 있고 확장 가능하며 역할 지향적인 API를 제공한다.
* [Knitter](https://github.com/ZTE/Knitter/)는 쿠버네티스 파드에서 여러 네트워크
  인터페이스를 지원하는 플러그인이다.
* [kube-router](https://github.com/cloudnativelabs/kube-router)는 쿠버네티스 네트워킹을 위한 오픈
  소스 턴키 솔루션으로, 운영 단순성과 고성능을 제공하는 것을 목표로 한다.
  제어 경로에는 쿠버네티스 API,
  BGP 및 Golang을 활용하고 데이터 경로에는 리눅스 네트워킹 기본 요소(IPVS,
  nftables 등)를 활용한다. 오버헤드가 적은 대안을 제공하며
  k0s와 k3s 모두에서 사용된다.
* [Multus](https://github.com/k8snetworkplumbingwg/multus-cni)는 쿠버네티스의
  다중 네트워크 지원을 위한 멀티 플러그인으로, 모든 CNI 플러그인
  (예: Calico, Cilium, Contiv, Flannel)뿐만 아니라 SRIOV, DPDK, OVS-DPDK 및
  쿠버네티스의 VPP 기반 워크로드도 지원한다.
* [OVN-Kubernetes](https://github.com/ovn-org/ovn-kubernetes/)는
  Open vSwitch(OVS) 프로젝트에서 나온 가상 네트워킹 구현인
  [OVN(Open Virtual Network)](https://github.com/ovn-org/ovn/)을 기반으로 하는 쿠버네티스용 네트워킹 제공자이다.
  OVN-Kubernetes는 쿠버네티스를 위한 오버레이 기반 네트워킹 구현을 제공하며,
  여기에는 OVS 기반 로드 밸런싱 및 네트워크 폴리시 구현이 포함된다.
* [Nodus](https://github.com/akraino-edge-stack/icn-nodus)는 클라우드 네이티브 기반 서비스 기능 체이닝(SFC)을
  제공하는 OVN 기반 CNI 컨트롤러 플러그인이다.
* [NSX-T](https://docs.vmware.com/en/VMware-NSX-T-Data-Center/index.html) 컨테이너 플러그인(NCP)은
  VMware NSX-T와 쿠버네티스 같은 컨테이너 오케스트레이터 간의 통합뿐만 아니라
  NSX-T와 Pivotal Container Service(PKS), OpenShift 같은 컨테이너 기반 CaaS/PaaS
  플랫폼 간의 통합도 제공한다.
* [Nuage](https://github.com/nuagenetworks/nuage-kubernetes/blob/v5.1.1-1/docs/kubernetes-1-installation.rst)는
  쿠버네티스 파드와 비-쿠버네티스 환경 간에 가시성 및 보안 모니터링을 갖춘
  폴리시 기반 네트워킹을 제공하는 SDN 플랫폼이다.
* [Romana](https://github.com/romana)는 파드
  네트워크를 위한 레이어 3 네트워킹 솔루션이며 [NetworkPolicy](/docs/concepts/services-networking/network-policies/) API도 지원한다.
* [Spiderpool](https://github.com/spidernet-io/spiderpool)은 쿠버네티스를 위한 언더레이 및 RDMA
  네트워킹 솔루션이다. Spiderpool은 베어 메탈, 가상 머신 및
  퍼블릭 클라우드 환경에서 지원된다.
* [Terway](https://github.com/AliyunContainerService/terway/)는
  AlibabaCloud의 VPC 및 ECS 네트워크 제품을 기반으로 하는 CNI 플러그인 모음이다. AlibabaCloud 환경에서 네이티브 VPC 네트워킹과
  네트워크 폴리시를 제공한다.
* [Weave Net](https://github.com/rajch/weave#using-weave-on-kubernetes)은
  네트워킹과 네트워크 폴리시를 제공하고, 네트워크 파티션 양쪽에서 계속 동작하며,
  외부 데이터베이스를 필요로 하지 않는다.

## 서비스 디스커버리

* [CoreDNS](https://coredns.io)는 유연하고 확장 가능한 DNS 서버로,
  파드를 위한 클러스터 내 DNS로 [설치](https://github.com/coredns/helm)할 수
  있다.

## 시각화 및 제어

* [대시보드](https://github.com/kubernetes/dashboard#kubernetes-dashboard)는
  쿠버네티스를 위한 대시보드 웹 인터페이스이다.
* [Headlamp](https://headlamp.dev/)는 확장 가능한 쿠버네티스 UI로,
  클러스터 내에 배포하거나 데스크톱 애플리케이션으로 사용할 수 있다.

## 인프라스트럭처

* [KubeVirt](https://kubevirt.io/user-guide/#/installation/installation)는 쿠버네티스에서
  가상 머신을 실행하기 위한 애드온이다. 일반적으로 베어 메탈 클러스터에서 실행한다.
* 쿠버네티스의
  [node problem detector](https://github.com/kubernetes/node-problem-detector)는
  리눅스 노드에서 실행되며 시스템 문제를
  [이벤트](/docs/reference/kubernetes-api/cluster-resources/event-v1/) 또는
  [노드 컨디션](/docs/concepts/architecture/nodes/#condition)으로 보고한다.

## 계측

* [kube-state-metrics](/docs/concepts/cluster-administration/kube-state-metrics)

## 레거시 애드온

사용 중단된 [cluster/addons](https://git.k8s.io/kubernetes/cluster/addons)
디렉터리에는 여러 다른 애드온이 문서화되어 있다.

잘 관리되는 애드온은 여기에 연결되어야 한다. PR을 환영한다!
