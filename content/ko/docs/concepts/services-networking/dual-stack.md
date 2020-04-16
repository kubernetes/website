---
title: IPv4/IPv6 이중 스택
feature:
  title: IPv4/IPv6 이중 스택
  description: >
    파드와 서비스에 IPv4와 IPv6 주소 할당

content_template: templates/concept
weight: 70
---

{{% capture overview %}}

{{< feature-state for_k8s_version="v1.16" state="alpha" >}}

 IPv4/IPv6 이중 스택을 사용하면 {{< glossary_tooltip text="파드" term_id="pod" >}} 와 {{< glossary_tooltip text="서비스" term_id="service" >}} 에 IPv4와 IPv6 주소를 모두 할당 할 수 있다.

만약 쿠버네티스 클러스터에서 IPv4/IPv6 이중 스택 네트워킹을 활성화하면, 클러스터는 IPv4와 IPv6 주소의 동시 할당을 지원하게 된다.

{{% /capture %}}

{{% capture body %}}

## 지원되는 기능

쿠버네티스 클러스터에서 IPv4/IPv6 이중 스택을 활성화하면 다음의 기능을 제공한다.

   * 이중 스택 파드 네트워킹(파드 당 단일 IPv4와 IPv6 주소 할당)
   * IPv4와 IPv6 지원 서비스(각 서비스는 단일 주소 패밀리이어야 한다.)
   * IPv4와 IPv6 인터페이스를 통한 파드 오프(off) 클러스터 이그레스 라우팅(예: 인터넷)

## 필수 구성 요소

IPv4/IPv6 이중 스택 쿠버네티스 클러스터를 활용하려면 다음의 필수 구성 요소가 필요하다.

   * 쿠버네티스 1.16 또는 이후 버전
   * 이중 스택 네트워킹을 위한 공급자의 지원(클라우드 공급자 또는 다른 방식으로 쿠버네티스 노드에 라우팅 가능한 IPv4/IPv6 네트워크 인터페이스를 제공할 수 있어야 한다.)
   * 이중 스택(예: Kubenet 또는 Calico)을 지원하는 네트워크 플러그인
   * IPVS 모드에서 구동 중인 Kube-Proxy

## IPv4/IPv6 이중 스택 활성화

IPv4/IPv6 이중 스택을 활성화 하려면, 클러스터의 관련 구성요소에 대해 `IPv6DualStack` [기능 게이트](/docs/reference/command-line-tools-reference/feature-gates/) 를 활성화 하고, 이중 스택 클러스터 네트워크 할당을 설정한다.

   * kube-controller-manager:
      * `--feature-gates="IPv6DualStack=true"`
      * `--cluster-cidr=<IPv4 CIDR>,<IPv6 CIDR>` 예: `--cluster-cidr=10.244.0.0/16,fc00::/24`
      * `--service-cluster-ip-range=<IPv4 CIDR>,<IPv6 CIDR>`
      * `--node-cidr-mask-size-ipv4|--node-cidr-mask-size-ipv6` IPv4의 기본값은 /24 이고 IPv6의 기본값은 /64이다.
   * kubelet:
      * `--feature-gates="IPv6DualStack=true"`
   * kube-proxy:
      * `--proxy-mode=ipvs`
      * `--cluster-cidr=<IPv4 CIDR>,<IPv6 CIDR>`
      * `--feature-gates="IPv6DualStack=true"`

{{< caution >}}
명령줄에서 `--cluster-cidr` 를 통해 /24보다 큰 IPv6 주소 블럭을 지정하면 할당이 실패한다.
{{< /caution >}}

## 서비스

만약 클러스터 IPv4/IPv6 이중 스택 네트워킹을 활성화한 경우, IPv4 또는 IPv6 주소로 {{< glossary_tooltip text="서비스" term_id="service" >}} 를 만들 수 있다. 해당 서비스에서 `.spec.ipFamily` 필드를 설정하면, 서비스 클러스터 IP의 주소 패밀리를 선택할 수 있다.
새 서비스를 생성할 때만 이 필드를 설정할 수 있다. `.spec.ipFamily` 필드는 선택 사항이며 클러스터에서 {{< glossary_tooltip text="서비스" term_id="service" >}} 와 {{< glossary_tooltip text="인그레스" term_id="ingress" >}} 를 IPv4와 IPv6로 사용하도록 설정할 경우에만 사용해야 한다. 이 필드의 구성은 [이그레스](#이그레스-트래픽)에 대한 요구사항이 아니다.

{{< note >}}
클러스터의 기본 주소 패밀리는 `--service-cluster-ip-range` 플래그로 kube-controller-manager에 구성된 첫 번째 서비스 클러스터 IP 범위의 주소 패밀리이다.
{{< /note >}}

`.spec.ipFamily` 를 다음 중 하나로 설정할 수 있다.

   * `IPv4`: API 서버는 `ipv4` 인 `service-cluster-ip-range` 의 IP를 할당 한다.
   * `IPv6`: API 서버는 `ipv6` 인 `service-cluster-ip-range` 의 IP를 할당 한다.

다음 서비스 사양에는 `ipFamily` 필드가 포함되어 있지 않다. 쿠버네티스는 처음 구성된 `service-cluster-ip-range` 의 IP 주소("클러스터 IP" 라고도 함)를 이 서비스에 할당 한다.

{{< codenew file="service/networking/dual-stack-default-svc.yaml" >}}

다음 서비스 명세에는 `ipFamily` 필드가 포함되어 있다. 쿠버네티스는 구성된 `service-cluster-ip-range` 의 IPv6 주소("클러스터 IP" 라고도 함)를 이 서비스에 할당 한다.

{{< codenew file="service/networking/dual-stack-ipv6-svc.yaml" >}}

비교를 위해, 다음 서비스 명세에는 구성된 `service-cluster-ip-range` 의 IPv4 주소("클러스터 IP" 라고도 함)를 이 서비스에 할당한다.

{{< codenew file="service/networking/dual-stack-ipv4-svc.yaml" >}}

### 로드밸런서 유형

IPv6가 활성화된 외부 로드 밸런서를 지원하는 클라우드 공급자들은 `type` 필드를 `LoadBalancer` 로 설정하고, 추가적으로 `ipFamily` 필드를 `IPv6` 로 설정하면 서비스에 대한 클라우드 로드 밸런서가 구축된다.

## 이그레스 트래픽

근본적으로 {{< glossary_tooltip text="CNI" term_id="cni" >}} 공급자가 전송을 구현할 수 있는 경우 공개적으로 라우팅 하거나 비공개 라우팅만 가능한 IPv6 주소 블록의 사용은 허용된다. 만약 비공개 라우팅만 가능한 IPv6를 사용하는 파드가 있고, 해당 파드가 오프 클러스터 목적지(예: 공용 인터넷)에 도달하기를 원하는 경우에는 이그레스 트래픽과 모든 응답을 위한 마스커레이딩 IP를 설정해야 한다. [ip-masq-agent](https://github.com/kubernetes-incubator/ip-masq-agent) 는 이중 스택을 인식하기에, 이중 스택 클러스터에서 마스커레이딩 IP에 ip-masq-agent 를 사용할 수 있다.

## 알려진 이슈들

   * Kubenet은 IP의 IPv4,IPv6의 위치 보고를 강제로 수행한다. (--cluster-cidr)

{{% /capture %}}

{{% capture whatsnext %}}

* [IPv4/IPv6 이중 스택 확인](/docs/tasks/network/validate-dual-stack) 네트워킹

{{% /capture %}}
