---
# reviewers:
# - thockin
title: 클러스터 네트워킹
content_type: concept
weight: 50
---

<!-- overview -->
네트워킹은 쿠버네티스의 중심적인 부분이지만, 어떻게 작동하는지 정확하게
이해하기가 어려울 수 있다. 쿠버네티스에는 대응해야 할 별개의 네트워킹
문제가 4가지 있다.

1. 고도로 결합된 컨테이너 간의 통신: 이 문제는
   {{< glossary_tooltip text="파드" term_id="pod" >}}와 `localhost` 통신으로 해결된다.
2. 파드 간 통신: 이 문제가 이 문서의 주요 초점이다.
3. 파드와 서비스 간 통신: 이 문제는 [서비스](/docs/concepts/services-networking/service/)에서 다룬다.
4. 외부와 서비스 간 통신: 이 문제도 서비스에서 다룬다.

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

쿠버네티스 네트워킹 모델에 대한 상세 정보는 [여기](/docs/concepts/services-networking/)를 참고한다.

## 쿠버네티스 IP 주소 범위

쿠버네티스 클러스터는 다음 컴포넌트들에 설정된 가용 주소 범위 내에서
파드, 서비스, 노드에 서로 겹치지 않는 IP 주소를 할당해야 한다.

- 네트워크 플러그인은 파드에 IP 주소를 할당하도록 설정되어 있다.
- kube-apiserver는 서비스에 IP 주소를 할당하도록 설정되어 있다.
- kubelet 또는 cloud-controller-manager는 노드에 IP 주소를 할당하도록 설정되어 있다.

{{< figure src="/docs/images/kubernetes-cluster-network.svg" alt="쿠버네티스 클러스터 내 서로 다른 네트워크 범위를 보여주는 그림" class="diagram-medium" >}}

## 클러스터 네트워킹 유형 {#cluster-network-ipfamilies}

쿠버네티스 클러스터는 설정된 IP 패밀리에 따라 다음과 같이 분류할 수 있다.

- IPv4만 사용: 네트워크 플러그인, kube-apiserver, kubelet/cloud-controller-manager는 IPv4 주소만 할당하도록 설정되어 있다.
- IPv6만 사용: 네트워크 플러그인, kube-apiserver, kubelet/cloud-controller-manager는 IPv6 주소만 할당하도록 설정되어 있다.
- IPv4/IPv6 또는 IPv6/IPv4 [이중 스택](/docs/concepts/services-networking/dual-stack/):
  - 네트워크 플러그인은 IPv4 및 IPv6 주소를 할당하도록 설정되어 있다.
  - kube-apiserver는 IPv4 및 IPv6 주소를 할당하도록 설정되어 있다.
  - kubelet 또는 cloud-controller-manager는 IPv4 및 IPv6 주소를 할당하도록 설정되어 있다.
  - 모든 컴포넌트는 동일한 기본 IP 패밀리를 사용하도록 설정되어야 한다.

쿠버네티스 클러스터는 파드, 서비스, 노드 오브젝트에 나타난 IP 패밀리만 고려하며,
해당 오브젝트가 가지고 있는 기존 IP와는 무관하다. 예를 들어, 서버나 파드는
자신의 인터페이스에 여러 IP 주소가 할당되어 있을 수 있지만, 쿠버네티스 네트워크 모델을
구현하고 클러스터 유형을 정의할 때 고려되는 것은 `node.status.addresses` 또는 `pod.status.ips`에 있는 IP 주소뿐이다.

## 쿠버네티스 네트워크 모델의 구현 방법

네트워크 모델은 각 노드의 컨테이너 런타임에 의해 구현된다.
가장 일반적인 컨테이너 런타임은 [컨테이너 네트워크 인터페이스](https://github.com/containernetworking/cni)(CNI) 플러그인을 사용하여 네트워크 및 보안 기능을 관리한다.
여러 공급업체의 다양한 CNI 플러그인이 존재하며,
이들 중 일부는 네트워크 인터페이스를 추가 및 제거하는 기본 기능만 제공하는 반면,
다른 일부는 다른 컨테이너 오케스트레이션 시스템과의 통합, 여러 CNI 플러그인 실행,
고급 IPAM 기능 등과 같은 보다 정교한 솔루션을 제공한다.

쿠버네티스에서 지원하는 네트워킹 애드온의 일부 목록은
[이 페이지](/docs/concepts/cluster-administration/addons/#networking-and-network-policy)를 참조한다.

## {{% heading "whatsnext" %}}

네트워킹 모델의 초기 설계와 그 근거는
[네트워킹 설계 문서](https://git.k8s.io/design-proposals-archive/network/networking.md)에 자세히 설명되어 있다.
쿠버네티스 네트워킹을 개선하기 위한 미래 계획 및 진행 중인 작업들에 대해서는
SIG-Network의
[KEP 목록](https://github.com/kubernetes/enhancements/tree/master/keps/sig-network)에서 확인할 수 있다.

