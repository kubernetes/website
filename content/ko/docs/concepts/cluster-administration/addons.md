---
title: 애드온 설치
content_type: concept
---

<!-- overview -->

{{% thirdparty-content %}}

애드온은 쿠버네티스의 기능을 확장한다.

이 페이지는 사용 가능한 일부 애드온과 관련 설치 지침 링크를 나열한다.

<!-- body -->

## 네트워킹과 네트워크 폴리시

* [ACI](https://www.github.com/noironetworks/aci-containers)는 Cisco ACI로 통합 컨테이너 네트워킹 및 네트워크 보안을 제공한다.
* [Antrea](https://antrea.io/)는 레이어 3/4에서 작동하여 쿠버네티스를 위한 네트워킹 및 보안 서비스를 제공하며, Open vSwitch를 네트워킹 데이터 플레인으로 활용한다.
* [Calico](https://docs.projectcalico.org/latest/introduction/)는 네트워킹 및 네트워크 폴리시 제공자이다. Calico는 유연한 네트워킹 옵션을 지원하므로 BGP 유무에 관계없이 비-오버레이 및 오버레이 네트워크를 포함하여 가장 상황에 맞는 옵션을 선택할 수 있다. Calico는 동일한 엔진을 사용하여 서비스 메시 계층(service mesh layer)에서 호스트, 파드 및 (이스티오(istio)와 Envoy를 사용하는 경우) 애플리케이션에 대한 네트워크 폴리시를 적용한다.
* [Canal](https://github.com/tigera/canal/tree/master/k8s-install)은 Flannel과 Calico를 통합하여 네트워킹 및 네트워크 폴리시를 제공한다.
* [Cilium](https://github.com/cilium/cilium)은 L3 네트워크 및 네트워크 폴리시 플러그인으로 HTTP/API/L7 폴리시를 투명하게 시행할 수 있다. 라우팅 및 오버레이/캡슐화 모드를 모두 지원하며, 다른 CNI 플러그인 위에서 작동할 수 있다.
* [CNI-Genie](https://github.com/Huawei-PaaS/CNI-Genie)를 사용하면 쿠버네티스는 Calico, Canal, Flannel, Romana 또는 Weave와 같은 CNI 플러그인을 완벽하게 연결할 수 있다.
* [Contiv](https://contiv.github.io)는 다양한 유스케이스와 풍부한 폴리시 프레임워크를 위해 구성 가능한 네트워킹(BGP를 사용하는 네이티브 L3, vxlan을 사용하는 오버레이, 클래식 L2 그리고 Cisco-SDN/ACI)을 제공한다. Contiv 프로젝트는 완전히 [오픈소스](https://github.com/contiv)이다. [인스톨러](https://github.com/contiv/install)는 kubeadm을 이용하거나, 그렇지 않은 경우에 대해서도 설치 옵션을 모두 제공한다.
* [Contrail](https://www.juniper.net/us/en/products-services/sdn/contrail/contrail-networking/)은 [Tungsten Fabric](https://tungsten.io)을 기반으로 하며, 오픈소스이고, 멀티 클라우드 네트워크 가상화 및 폴리시 관리 플랫폼이다. Contrail과 Tungsten Fabric은 쿠버네티스, OpenShift, OpenStack 및 Mesos와 같은 오케스트레이션 시스템과 통합되어 있으며, 가상 머신, 컨테이너/파드 및 베어 메탈 워크로드에 대한 격리 모드를 제공한다.
* [Flannel](https://github.com/coreos/flannel/blob/master/Documentation/kubernetes.md)은 쿠버네티스와 함께 사용할 수 있는 오버레이 네트워크 제공자이다.
* [Knitter](https://github.com/ZTE/Knitter/)는 쿠버네티스 파드에서 여러 네트워크 인터페이스를 지원하는 플러그인이다.
* [Multus](https://github.com/Intel-Corp/multus-cni)는 쿠버네티스에서 SRIOV, DPDK, OVS-DPDK 및 VPP 기반 워크로드 외에 모든 CNI 플러그인(예: Calico, Cilium, Contiv, Flannel)을 지원하기 위해 쿠버네티스에서 다중 네트워크 지원을 위한 멀티 플러그인이다.
* [OVN-Kubernetes](https://github.com/ovn-org/ovn-kubernetes/)는 Open vSwitch(OVS) 프로젝트에서 나온 가상 네트워킹 구현인 [OVN(Open Virtual Network)](https://github.com/ovn-org/ovn/)을 기반으로 하는 쿠버네티스용 네트워킹 제공자이다. OVN-Kubernetes는 OVS 기반 로드 밸런싱과 네트워크 폴리시 구현을 포함하여 쿠버네티스용 오버레이 기반 네트워킹 구현을 제공한다.
* [OVN4NFV-K8S-Plugin](https://github.com/opnfv/ovn4nfv-k8s-plugin)은 OVN 기반의 CNI 컨트롤러 플러그인으로 클라우드 네이티브 기반 서비스 기능 체인(Service function chaining(SFC)), 다중 OVN 오버레이 네트워킹, 동적 서브넷 생성, 동적 가상 네트워크 생성, VLAN 공급자 네트워크, 직접 공급자 네트워크와 멀티 클러스터 네트워킹의 엣지 기반 클라우드 등 네이티브 워크로드에 이상적인 멀티 네티워크 플러그인이다.
* [NSX-T](https://docs.vmware.com/en/VMware-NSX-T/2.0/nsxt_20_ncp_kubernetes.pdf) 컨테이너 플러그인(NCP)은 VMware NSX-T와 쿠버네티스와 같은 컨테이너 오케스트레이터 간의 통합은 물론 NSX-T와 PKS(Pivotal 컨테이너 서비스) 및 OpenShift와 같은 컨테이너 기반 CaaS/PaaS 플랫폼 간의 통합을 제공한다.
* [Nuage](https://github.com/nuagenetworks/nuage-kubernetes/blob/v5.1.1-1/docs/kubernetes-1-installation.rst)는 가시성과 보안 모니터링 기능을 통해 쿠버네티스 파드와 비-쿠버네티스 환경 간에 폴리시 기반 네트워킹을 제공하는 SDN 플랫폼이다.
* [Romana](https://romana.io)는 [네트워크폴리시 API](/ko/docs/concepts/services-networking/network-policies/)도 지원하는 파드 네트워크용 Layer 3 네트워킹 솔루션이다. Kubeadm 애드온 설치에 대한 세부 정보는 [여기](https://github.com/romana/romana/tree/master/containerize)에 있다.
* [Weave Net](https://www.weave.works/docs/net/latest/kubernetes/kube-addon/)은 네트워킹 및 네트워크 폴리시를 제공하고, 네트워크 파티션의 양면에서 작업을 수행하며, 외부 데이터베이스는 필요하지 않다.

## 서비스 검색

* [CoreDNS](https://coredns.io)는 유연하고 확장 가능한 DNS 서버로, 파드를 위한 클러스터 내 DNS로 [설치](https://github.com/coredns/deployment/tree/master/kubernetes)할 수 있다.

## 시각화 &amp; 제어

* [대시보드](https://github.com/kubernetes/dashboard#kubernetes-dashboard)는 쿠버네티스를 위한 대시보드 웹 인터페이스이다.
* [Weave Scope](https://www.weave.works/documentation/scope-latest-installing/#k8s)는 컨테이너, 파드, 서비스 등을 그래픽으로 시각화하는 도구이다. [Weave Cloud 어카운트](https://cloud.weave.works/)와 함께 사용하거나 UI를 직접 호스팅한다.

## 인프라스트럭처

* [KubeVirt](https://kubevirt.io/user-guide/#/installation/installation)는 쿠버네티스에서 가상 머신을 실행하기 위한 애드온이다. 일반적으로 베어 메탈 클러스터에서 실행한다.

## 레거시 애드온

더 이상 사용되지 않는 [cluster/addons](https://git.k8s.io/kubernetes/cluster/addons) 디렉터리에 다른 여러 애드온이 문서화되어 있다.

잘 관리된 것들이 여기에 연결되어 있어야 한다. PR을 환영한다!
