---
title: IPv4/IPv6 이중 스택
description: >-
  쿠버네티스에서는 단일 스택 IPv4 네트워킹,
  단일 스택 IPv6 네트워킹, 또는 두 네트워크 패밀리가 모두 활성화된
  이중 스택 네트워킹을 구성할 수 있다. 이 페이지는 그 방법을 설명한다.
feature:
  title: IPv4/IPv6 이중 스택
  description: >
    파드와 서비스에 IPv4와 IPv6 주소 할당
content_type: concept
# reviewers:
#   - lachie83
#   - khenidak
#   - aramase
#   - bridgetkromhout
weight: 90
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.23" state="stable" >}}

IPv4/IPv6 이중 스택 네트워킹을 사용하면 {{< glossary_tooltip text="파드" term_id="pod" >}}와
{{< glossary_tooltip text="서비스" term_id="service" >}}에 IPv4와 IPv6 주소를 모두 할당할 수 있다.

IPv4/IPv6 이중 스택 네트워킹은 1.21부터 쿠버네티스 클러스터에 기본적으로
활성화되어 있고, IPv4 및 IPv6 주소를 동시에 할당할 수 있다.

<!-- body -->

## 지원되는 기능

쿠버네티스 클러스터의 IPv4/IPv6 이중 스택은 다음의 기능을 제공한다.

   * 이중 스택 파드 네트워킹(파드당 단일 IPv4와 IPv6 주소 할당)
   * IPv4와 IPv6를 지원하는 서비스
   * IPv4와 IPv6 인터페이스를 통한 파드의 클러스터 외부(예: 인터넷)로의 이그레스 라우팅

## 필수 구성 요소

IPv4/IPv6 이중 스택 쿠버네티스 클러스터를 활용하려면 다음의 필수 구성 요소가 필요하다.

* 쿠버네티스 1.20 이상

  이전 버전 쿠버네티스에서 이중 스택 서비스를 사용하는
  방법에 대한 정보는 해당 버전의 쿠버네티스
  문서를 참조한다.

* 이중 스택 네트워킹을 지원하는 공급자 (클라우드 공급자 또는 기타 공급자는
  쿠버네티스 노드에 라우팅 가능한 IPv4/IPv6 네트워크 인터페이스를 제공할 수 있어야 한다.)
* 이중 스택 네트워킹을 지원하는
  [네트워크 플러그인](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/)

## IPv4/IPv6 이중 스택 구성

IPv4/IPv6 이중 스택을 구성하려면, 이중 스택 클러스터 네트워크 할당을 설정한다.

* kube-apiserver:
  * `--service-cluster-ip-range=<IPv4 CIDR>,<IPv6 CIDR>`
* kube-controller-manager:
  * `--cluster-cidr=<IPv4 CIDR>,<IPv6 CIDR>`
  * `--service-cluster-ip-range=<IPv4 CIDR>,<IPv6 CIDR>`
  * `--node-cidr-mask-size-ipv4|--node-cidr-mask-size-ipv6`는 IPv4의 경우 /24, IPv6의 경우 /64가 기본값이다.
* kube-proxy:
  * `--cluster-cidr=<IPv4 CIDR>,<IPv6 CIDR>`
* kubelet:
  * `--node-ip=<IPv4 IP>,<IPv6 IP>`
    * 이 옵션은 베어메탈 이중 스택 노드(`--cloud-provider` 플래그로 클라우드 
      공급자를 정의하지 않은 노드)에 필요하다.
      클라우드 공급자를 사용 중이고 클라우드 공급자가 선택한 노드 IP를 재정의하고 싶다면,
      `--node-ip` 옵션을 설정한다.
    * (레거시 내장 클라우드 공급자는 이중 스택 `--node-ip`를 지원하지 않는다.)

{{< note >}}
IPv4 CIDR의 예: `10.244.0.0/16` (예시일 뿐이며, 실제로는 자신의 주소 범위를 지정해야 한다.)

IPv6 CIDR의 예: `fdXY:IJKL:MNOP:15::/64` (형식을 보여 주기 위한 예시이며, 유효한
주소는 아니다. [RFC 4193](https://tools.ietf.org/html/rfc4193)을 참조한다.)
{{< /note >}}

## 서비스

IPv4, IPv6 또는 둘 다를 사용할 수 있는 {{< glossary_tooltip text="서비스" term_id="service" >}}를 생성할 수 있다.

서비스의 주소 패밀리는 기본적으로 첫 번째 서비스 클러스터 IP 범위
(kube-apiserver의 `--service-cluster-ip-range` 플래그로 지정)의 주소 패밀리로 설정된다.

서비스를 정의할 때 선택적으로 이중 스택으로 구성할 수 있다. 원하는 동작을 지정하려면 `.spec.ipFamilyPolicy` 필드를
다음 값 중 하나로 설정한다.

* `SingleStack`: 단일 스택 서비스. 컨트롤 플레인은 첫 번째로 설정된 서비스
클러스터 IP 범위를 사용하여 서비스의 클러스터 IP를 할당한다.
* `PreferDualStack`: 이중 스택이 활성화되면, 서비스에 IPv4 및 IPv6 클러스터 IP가 모두 할당된다. 이중 스택이 활성화되어 있지 않거나 지원되지 않는 경우에는 단일 스택 방식으로 동작한다.
* `RequireDualStack`: 이중 스택이 활성화되면, IPv4 및 IPv6 각 주소 범위에서 서비스의 `.spec.clusterIPs`가 할당된다. 이중 스택이 활성화되어 있지 않거나 지원되지 않는 경우에는 서비스 API 오브젝트 생성에 실패한다.
  * `.spec.ipFamilies` 배열의 첫 번째 요소의 주소 패밀리를 기준으로
    `.spec.clusterIPs` 목록에서 `.spec.clusterIP`를 선택한다.

단일 스택에 사용할 IP 패밀리를 정의하거나 이중 스택에 대한 IP 패밀리의
순서를 정의하려는 경우, 서비스의 선택적 필드인
`.spec.ipFamilies`를 설정하여 주소 패밀리를 선택할 수 있다.

{{< note >}}
`.spec.ipFamilies` 필드는 조건부로 수정할 수 있다. 보조 IP 패밀리는 추가하거나 제거할 수
있지만, 기존 서비스의 기본 IP 패밀리는 변경할 수 없다.
{{< /note >}}

`.spec.ipFamilies`를 다음 배열 값 중 하나로 설정할 수 있다.

- `["IPv4"]`
- `["IPv6"]`
- `["IPv4","IPv6"]` (이중 스택)
- `["IPv6","IPv4"]` (이중 스택)

나열한 첫 번째 패밀리가 레거시`.spec.clusterIP` 필드에 사용된다.

### 이중 스택 서비스 구성 시나리오

이 예시들은 다양한 이중 스택 서비스 구성 시나리오의 동작을 보여준다.

#### 새로운 서비스에 대한 이중 스택 옵션

1. 이 서비스 명세는 `.spec.ipFamilyPolicy`를 명시적으로 지정하지 않는다.
   이 서비스를 생성하면, 쿠버네티스는 첫 번째로 설정된 `service-cluster-ip-range`에서
   서비스의 클러스터 IP를 할당하고 `.spec.ipFamilyPolicy`를
   `SingleStack`으로 설정한다. ([셀렉터가 없는 서비스](/docs/concepts/services-networking/service/#셀렉터가-없는-서비스)와
   셀렉터가 있는 [헤드리스 서비스](/docs/concepts/services-networking/service/#헤드리스-headless-서비스)도
   같은 방식으로 동작한다.)

   {{% code_sample file="service/networking/dual-stack-default-svc.yaml" %}}

1. 이 서비스 명세는 `.spec.ipFamilyPolicy`에 `PreferDualStack`을
   명시적으로 지정한다. 이중 스택 클러스터에서 이 서비스를 생성하면 쿠버네티스는
   해당 서비스에 IPv4 및 IPv6 주소를 모두 할당한다. 컨트롤 플레인은 서비스의
   `.spec`을 업데이트하여 할당된 IP 주소를 기록한다. `.spec.clusterIPs` 필드가
   기본 필드이며 할당된 IP 주소를 모두 포함한다. `.spec.clusterIP`는
   `.spec.clusterIPs`로부터 값이 계산되는 보조 필드이다.

   * `.spec.clusterIP` 필드에는 컨트롤 플레인이 첫 번째 서비스 클러스터 IP
     범위와 동일한 주소 패밀리의 IP 주소를 기록한다.
   * 단일 스택 클러스터에서는 `.spec.clusterIPs`와 `.spec.clusterIP` 필드
     모두 하나의 주소만 포함한다.
   * 이중 스택이 활성화된 클러스터에서 `.spec.ipFamilyPolicy`에 `RequireDualStack`을
     지정하면 `PreferDualStack`과 동일하게 동작한다.

   {{% code_sample file="service/networking/dual-stack-preferred-svc.yaml" %}}

1. 이 서비스 명세는 `.spec.ipFamilies`에` IPv6`과 `IPv4`를 명시적으로 지정하고,
   `.spec.ipFamilyPolicy`에 `PreferDualStack`을 지정한다. 쿠버네티스가 `.spec.clusterIPs`에
   IPv6 및 IPv4 주소를 할당하면, `.spec.clusterIPs` 배열의 첫 번째 요소가 IPv6 주소이므로
   `.spec.clusterIP`에도 IPv6 주소가 설정되어 기본 동작이 재정의된다.

   {{% code_sample file="service/networking/dual-stack-preferred-ipfamilies-svc.yaml" %}}

#### 기존 서비스의 이중 스택 기본값

이 예시들은 이미 서비스가 존재하는 클러스터에서 이중 스택이 새로 활성화된
경우의 기본 동작을 보여준다. (기존 클러스터를 1.21 이상으로 업그레이드하면
이중 스택이 활성화된다.)

1. 클러스터에서 이중 스택이 활성화되면, 기존 서비스 (`IPv4` 또는 `IPv6`)는 컨트롤 플레인에 의해
   `.spec.ipFamilyPolicy`가 `SingleStack`으로 설정되고, `.spec.ipFamilies`는 기존 서비스의 주소
   패밀리로 설정된다. 기존 서비스의 클러스터 IP는
   `.spec.clusterIPs`에 저장된다.

   {{< codenew file="service/networking/dual-stack-default-svc.yaml" >}}

   kubectl로 기존 서비스를 확인하여 이 동작을 검증할 수 있다.

   ```shell
   kubectl get svc my-service -o yaml
   ```

   ```yaml
   apiVersion: v1
   kind: Service
   metadata:
     labels:
       app.kubernetes.io/name: MyApp
     name: my-service
   spec:
     clusterIP: 10.0.197.123
     clusterIPs:
     - 10.0.197.123
     ipFamilies:
     - IPv4
     ipFamilyPolicy: SingleStack
     ports:
     - port: 80
       protocol: TCP
       targetPort: 80
     selector:
       app.kubernetes.io/name: MyApp
     type: ClusterIP
   status:
     loadBalancer: {}
   ```

1. 클러스터에서 이중 스택이 활성화되면, 셀렉터가 있는 기존
   [헤드리스 서비스](/docs/concepts/services-networking/service/#헤드리스-headless-서비스)는
   `.spec.clusterIP`가 `None`으로 설정되어 있더라도 컨트롤 플레인에 의해
   `.spec.ipFamilyPolicy`는 `SingleStack`으로, `.spec.ipFamilies`는 첫 번째 서비스
   클러스터 IP 범위(kube-apiserver의 `--service-cluster-ip-range` 플래그로 지정)의
   주소 패밀리로 설정된다.

   {{% code_sample file="service/networking/dual-stack-default-svc.yaml" %}}

   kubectl로 셀렉터가 있는 기존 헤드리스 서비스를 확인하여 이 동작을 검증할 수 있다.

   ```shell
   kubectl get svc my-service -o yaml
   ```

   ```yaml
   apiVersion: v1
   kind: Service
   metadata:
     labels:
       app.kubernetes.io/name: MyApp
     name: my-service
   spec:
     clusterIP: None
     clusterIPs:
     - None
     ipFamilies:
     - IPv4
     ipFamilyPolicy: SingleStack
     ports:
     - port: 80
       protocol: TCP
       targetPort: 80
     selector:
       app.kubernetes.io/name: MyApp
   ```

#### 단일 스택과 이중 스택 간 서비스 전환

서비스는 단일 스택에서 이중 스택으로, 이중 스택에서 단일 스택으로 변경할 수 있다.

1. 서비스를 단일 스택에서 이중 스택으로 변경하려면, `.spec.ipFamilyPolicy`를
   `SingleStack`에서 `PreferDualStack` 또는 `RequireDualStack`으로 변경한다.
   이 서비스를 단일 스택에서 이중 스택으로 변경하면 쿠버네티스는 누락된 주소 패밀리를 할당하여
   이제 서비스가 IPv4와 IPv6 주소를 모두 갖도록 한다.

   서비스 명세에서 `.spec.ipFamilyPolicy`를 `SingleStack`에서 `PreferDualStack`으로 수정한다.

   이전:

   ```yaml
   spec:
     ipFamilyPolicy: SingleStack
   ```

   이후:

   ```yaml
   spec:
     ipFamilyPolicy: PreferDualStack
   ```

1. 서비스를 이중 스택에서 단일 스택으로 변경하려면, `.spec.ipFamilyPolicy`를
   `PreferDualStack` 또는 `RequireDualStack`에서 `SingleStack`으로 변경한다.
   이 서비스를 이중 스택에서 단일 스택으로 변경하면 쿠버네티스는 `.spec.clusterIPs`
   배열의 첫 번째 요소만 유지하고, 그 IP 주소를 `.spec.clusterIP`로 설정하며,
   `.spec.ipFamilies`를 `.spec.clusterIPs`의 주소 패밀리로 설정한다.

### 셀렉터가 없는 헤드리스 서비스

[셀렉터가 없는 헤드리스 서비스](/docs/concepts/services-networking/service/#셀렉터가-없는-서비스)에서
`.spec.ipFamilyPolicy`를 명시적으로 설정하지 않으면, `.spec.ipFamilyPolicy` 필드의 기본값은
`RequireDualStack` 이다.

### 로드밸런서 서비스 유형

서비스에 이중 스택 로드밸런서를 프로비저닝하려면

* `.spec.type` 필드를 `LoadBalancer`로 설정
* `.spec.ipFamilyPolicy` 필드를 `PreferDualStack` 또는 `RequireDualStack`으로 설정

{{< note >}}
이중 스택 `LoadBalancer` 유형 서비스를 사용하려면 클라우드 공급자가
IPv4 및 IPv6 로드 밸런서를 지원해야 한다.
{{< /note >}}

## 이그레스 트래픽

공개적으로 라우팅되지 않는 IPv6 주소를 사용하는 파드에서 클러스터 외부 목적지
(예: 공용 인터넷)에 도달하기 위해 이그레스 트래픽을 활성화하고 싶다면, 투명 프록시 또는
IP 마스커레이딩과 같은 메커니즘을 통해 해당 파드가 공개적으로 라우팅되는 IPv6 주소를 사용할 수 있도록 해야 한다.
[ip-masq-agent](https://github.com/kubernetes-sigs/ip-masq-agent)
프로젝트는 이중 스택 클러스터에서 IP 마스커레이딩을 지원한다.

{{< note >}}
{{< glossary_tooltip text="CNI" term_id="cni" >}} 공급자가 IPv6를 지원하는지 확인한다.
{{< /note >}}

## 윈도우 지원

윈도우에서 동작하는 쿠버네티스는 단일 스택 "IPv6 전용" 네트워킹을 지원하지 않는다. 그러나 단일 패밀리(single-family)
서비스를 사용하는 파드와 노드에 대해서는 이중 스택 IPv4/IPv6 네트워킹을
지원한다.

`l2bridge` 네트워크에서 IPv4/IPv6 이중 스택 네트워킹을 사용할 수 있다.

{{< note >}}
윈도우에서 오버레이 (VXLAN) 네트워크는 이중 스택 네트워킹을 **지원하지 않는다.**
{{< /note >}}

윈도우의 다른 네트워크 모드에 대한 내용은
[윈도우에서의 네트워킹](/docs/concepts/services-networking/windows-networking/#네트워크-모드) 문서를 참조한다.

## {{% heading "whatsnext" %}}

* [IPv4/IPv6 이중 스택 검증](/docs/tasks/network/validate-dual-stack) 네트워킹
* [kubeadm을 사용하여 이중 스택 네트워킹 활성화](/docs/setup/production-environment/tools/kubeadm/dual-stack-support/)

