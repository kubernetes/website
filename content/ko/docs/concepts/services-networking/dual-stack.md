---
title: IPv4/IPv6 이중 스택
feature:
  title: IPv4/IPv6 이중 스택
  description: >
    파드와 서비스에 IPv4와 IPv6 주소 할당

content_type: concept
weight: 70
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.16" state="alpha" >}}

 IPv4/IPv6 이중 스택을 사용하면 {{< glossary_tooltip text="파드" term_id="pod" >}} 와 {{< glossary_tooltip text="서비스" term_id="service" >}} 에 IPv4와 IPv6 주소를 모두 할당 할 수 있다.

만약 쿠버네티스 클러스터에서 IPv4/IPv6 이중 스택 네트워킹을 활성화하면, 클러스터는 IPv4와 IPv6 주소의 동시 할당을 지원하게 된다.



<!-- body -->

## 지원되는 기능

쿠버네티스 클러스터에서 IPv4/IPv6 이중 스택을 활성화하면 다음의 기능을 제공한다.

   * 이중 스택 파드 네트워킹(파드 당 단일 IPv4와 IPv6 주소 할당)
   * IPv4와 IPv6 지원 서비스
   * IPv4와 IPv6 인터페이스를 통한 파드 오프(off) 클러스터 이그레스 라우팅(예: 인터넷)

## 필수 구성 요소

IPv4/IPv6 이중 스택 쿠버네티스 클러스터를 활용하려면 다음의 필수 구성 요소가 필요하다.

   * 쿠버네티스 1.20 이상
     이전 버전과 함께 이중 스택 서비스를 사용하는 방법에 대한 정보
     쿠버네티스 버전, 쿠버네티스 해당 버전에 대한 
     문서 참조
   * 이중 스택 네트워킹을 위한 공급자의 지원(클라우드 공급자 또는 다른 방식으로 쿠버네티스 노드에 라우팅 가능한 IPv4/IPv6 네트워크 인터페이스를 제공할 수 있어야 한다.)
   * 이중 스택(예: Kubenet 또는 Calico)을 지원하는 네트워크 플러그인

## IPv4/IPv6 이중 스택 활성화

IPv4/IPv6 이중 스택을 활성화 하려면, 클러스터의 관련 구성요소에 대해 `IPv6DualStack` [기능 게이트](/ko/docs/reference/command-line-tools-reference/feature-gates/) 를 활성화 하고, 이중 스택 클러스터 네트워크 할당을 설정한다.

   * kube-apiserver:
      * `--feature-gates="IPv6DualStack=true"`
      * `--service-cluster-ip-range=<IPv4 CIDR>,<IPv6 CIDR>`
   * kube-controller-manager:
      * `--feature-gates="IPv6DualStack=true"`
      * `--cluster-cidr=<IPv4 CIDR>,<IPv6 CIDR>`
      * `--service-cluster-ip-range=<IPv4 CIDR>,<IPv6 CIDR>`
      * `--node-cidr-mask-size-ipv4|--node-cidr-mask-size-ipv6` IPv4의 기본값은 /24 이고 IPv6의 기본값은 /64 이다.
   * kubelet:
      * `--feature-gates="IPv6DualStack=true"`
   * kube-proxy:
      * `--cluster-cidr=<IPv4 CIDR>,<IPv6 CIDR>`
      * `--feature-gates="IPv6DualStack=true"`

{{< note >}}
IPv4 CIDR의 예: `10.244.0.0/16` (자신의 주소 범위를 제공하더라도)

IPv6 CIDR의 예: `fdXY:IJKL:MNOP:15::/64` (이 형식으로 표시되지만, 유효한 주소는 아니다 - [RFC 4193](https://tools.ietf.org/html/rfc4193)을 본다.)

{{< /note >}}

## 서비스

클러스터에 이중 스택이 활성화된 경우 IPv4, IPv6 또는 둘 다를 사용할 수 있는 {{< glossary_tooltip text="서비스" term_id="service" >}}를 만들 수 있다.

서비스의 주소 계열은 기본적으로 첫 번째 서비스 클러스터 IP 범위의 주소 계열로 설정된다. (`--service-cluster-ip-range` 플래그를 통해 kube-controller-manager에 구성)

서비스를 정의할 때 선택적으로 이중 스택으로 구성할 수 있다. 원하는 동작을 지정하려면 `.spec.ipFamilyPolicy` 필드를 
다음 값 중 하나로 설정한다.

* `SingleStack`: 단일 스택 서비스. 컨트롤 플레인은 첫 번째로 구성된 서비스 클러스터 IP 범위를 사용하여 서비스에 대한 클러스터 IP를 할당한다.
* `PreferDualStack`:
  * 클러스터에 이중 스택이 활성화된 경우에만 사용된다. 서비스에 대해 IPv4 및 IPv6 클러스터 IP를 할당한다.
  * 클러스터에 이중 스택이 활성화되지 않은 경우, 이 설정은 `SingleStack`과 동일한 동작을 따른다.
* `RequireDualStack`: IPv4 및 IPv6 주소 범위 모두에서 서비스 `.spec.ClusterIPs`를 할당한다.
  * `.spec.ipFamilies` 배열의 첫 번째 요소의 주소 계열을 기반으로 `.spec.ClusterIPs` 목록에서 `.spec.ClusterIP`를 선택한다.
  * 클러스터에는 이중 스택 네트워킹이 구성되어 있어야 한다.

단일 스택에 사용할 IP 계열을 정의하거나 이중 스택에 대한 IP 군의 순서를 정의하려는 경우, 서비스에서 옵션 필드 `.spec.ipFamilies`를 설정하여 주소 군을 선택할 수 있다.

{{< note >}}
`.spec.ipFamilies` 필드는 이미 존재하는 서비스에 `.spec.ClusterIP`를 재할당할 수 없기 때문에 변경할 수 없다. `.spec.ipFamilies`를 변경하려면 서비스를 삭제하고 다시 생성한다.
{{< /note >}}

`.spec.ipFamilies`를 다음 배열 값 중 하나로 설정할 수 있다.

- `["IPv4"]`
- `["IPv6"]`
- `["IPv4","IPv6"]` (이중 스택)
- `["IPv6","IPv4"]` (이중 스택)

나열한 첫 번째 군은 레거시`.spec.ClusterIP` 필드에 사용된다.

### 이중 스택 서비스 구성 시나리오

이 예제는 다양한 이중 스택 서비스 구성 시나리오의 동작을 보여준다.

#### 새로운 서비스에 대한 이중 스택 옵션

1. 이 서비스 사양은 `.spec.ipFamilyPolicy`를 명시적으로 정의하지 않는다. 이 서비스를 만들 때 쿠버네티스는 처음 구성된 `service-cluster-ip-range`에서 서비스에 대한 클러스터 IP를 할당하고 `.spec.ipFamilyPolicy`를 `SingleStack`으로 설정한다. ([셀렉터가 없는 서비스](/ko/docs/concepts/services-networking/service/#셀렉터가-없는-서비스) 및 [헤드리스 서비스](/ko/docs/concepts/services-networking/service/#헤드리스-headless-서비스)와 같은 방식으로 동작한다.)

{{< codenew file="service/networking/dual-stack-default-svc.yaml" >}}

1. 이 서비스 사양은 `.spec.ipFamilyPolicy`에 `PreferDualStack`을 명시적으로 정의한다. 이중 스택 클러스터에서 이 서비스를 생성하면 쿠버네티스는 서비스에 대해 IPv4 및 IPv6 주소를 모두 할당한다. 컨트롤 플레인은 서비스의 `.spec`을 업데이트하여 IP 주소 할당을 기록한다. 필드 `.spec.ClusterIPs`는 기본 필드이며 할당된 IP 주소를 모두 포함한다. `.spec.ClusterIP`는 값이 `.spec.ClusterIPs`에서 계산된 보조 필드이다.

      * `.spec.ClusterIP` 필드의 경우 컨트롤 플레인은 첫 번째 서비스 클러스터 IP 범위와 동일한 주소 계열의 IP 주소를 기록한다.
      * 단일 스택 클러스터에서 `.spec.ClusterIPs` 및 `.spec.ClusterIP` 필드는 모두 하나의 주소만 나열한다.
      * 이중 스택이 활성화된 클러스터에서 `.spec.ipFamilyPolicy`에 `RequireDualStack`을 지정하면 `PreferDualStack`과 동일하게 작동한다.

{{< codenew file="service/networking/dual-stack-preferred-svc.yaml" >}}

1. 이 서비스 사양은 `.spec.ipFamilies`에` IPv6`과 `IPv4`를 명시적으로 정의하고 `.spec.ipFamilyPolicy`에 `PreferDualStack`을 정의한다. 쿠버네티스가 `.spec.ClusterIPs`에 IPv6 및 IPv4 주소를 할당할 때 `.spec.ClusterIP`는 `.spec.ClusterIPs` 배열의 첫 번째 요소이므로 IPv6 주소로 설정되어 기본값을 재정의한다.

{{< codenew file="service/networking/dual-stack-preferred-ipfamilies-svc.yaml" >}}

#### 기존 서비스의 이중 스택 기본값

이 예제는 서비스가 이미있는 클러스터에서 이중 스택이 새로 활성화된 경우의 기본 동작을 보여준다.

1. 클러스터에서 이중 스택이 활성화된 경우 기존 서비스 (`IPv4` 또는 `IPv6`)는 컨트롤 플레인이 `.spec.ipFamilyPolicy`를 `SingleStack`으로 지정하고 `.spec.ipFamilies`를 기존 서비스의 주소 계열로 설정한다. 기존 서비스 클러스터 IP는 `.spec.ClusterIPs`에 저장한다.

{{< codenew file="service/networking/dual-stack-default-svc.yaml" >}}

   kubectl을 사용하여 기존 서비스를 검사하여 이 동작을 검증할 수 있다.

```shell
kubectl get svc my-service -o yaml
```

```yaml
apiVersion: v1
kind: Service
metadata:
  labels:
    app: MyApp
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
    app: MyApp
  type: ClusterIP
status:
  loadBalancer: {}
```

1. 클러스터에서 이중 스택이 활성화된 경우, 셀렉터가 있는 기존 [헤드리스 서비스](/ko/docs/concepts/services-networking/service/#헤드리스-headless-서비스)는 `.spec.ClusterIP`가 `None`이라도 컨트롤 플레인이 `.spec.ipFamilyPolicy`을 `SingleStack`으로 지정하고 `.spec.ipFamilies`는 첫 번째 서비스 클러스터 IP 범위(kube-controller-manager에 대한 `--service-cluster-ip-range` 플래그를 통해 구성)의 주소 계열으로 지정한다.

{{< codenew file="service/networking/dual-stack-default-svc.yaml" >}}

   kubectl을 사용하여 셀렉터로 기존 헤드리스 서비스를 검사하여 이 동작의 유효성을 검사 할 수 있다.

```shell
kubectl get svc my-service -o yaml
```

```yaml
apiVersion: v1
kind: Service
metadata:
  labels:
    app: MyApp
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
    app: MyApp
```

#### 단일 스택과 이중 스택 간 서비스 전환

서비스는 단일 스택에서 이중 스택으로, 이중 스택에서 단일 스택으로 변경할 수 있다.

1. 서비스를 단일 스택에서 이중 스택으로 변경하려면 원하는 대로 `.spec.ipFamilyPolicy`를 `SingleStack`에서 `PreferDualStack` 또는 `RequireDualStack`으로 변경한다. 이 서비스를 단일 스택에서 이중 스택으로 변경하면 쿠버네티스는 누락된 주소 계열의 것을 배정하므로 해당 서비스는 이제 IPv4와 IPv6 주소를 갖게된다.

   `.spec.ipFamilyPolicy`를 `SingleStack`에서 `PreferDualStack`으로 업데이트하는 서비스 사양을 편집한다.

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

1. 서비스를 이중 스택에서 단일 스택으로 변경하려면 `.spec.ipFamilyPolicy`를 `PreferDualStack`에서 또는 `RequireDualStack`을 `SingleStack`으로 변경한다. 이 서비스를 이중 스택에서 단일 스택으로 변경하면 쿠버네티스는 `.spec.ClusterIPs` 배열의 첫 번째 요소 만 유지하고 `.spec.ClusterIP`를 해당 IP 주소로 설정하고 `.spec.ipFamilies`를 `.spec.ClusterIPs`의 주소 계열로 설정한다.

### 셀렉터가 없는 헤드리스 서비스

[셀렉터가 없는 서비스](/ko/docs/concepts/services-networking/service/#셀렉터가-없는-서비스) 및 `.spec.ipFamilyPolicy`가 명시적으로 설정되지 않은 경우 `.spec.ipFamilyPolicy` 필드의 기본값은 `RequireDualStack` 이다.

### 로드밸런서 서비스 유형

서비스에 이중 스택 로드밸런서를 프로비저닝하려면
   * `.spec.type` 필드를 `LoadBalancer`로 설정
   * `.spec.ipFamilyPolicy` 필드를 `PreferDualStack` 또는 `RequireDualStack`으로 설정

{{< note >}}
이중 스택 `LoadBalancer` 유형 서비스를 사용하려면 클라우드 공급자가 IPv4 및 IPv6로드 밸런서를 지원해야 한다.
{{< /note >}}

## 이그레스(Egress) 트래픽

비공개로 라우팅할 수 있는 IPv6 주소를 사용하는 파드에서 클러스터 외부 대상 (예: 공용 인터넷)에 도달하기 위해 이그레스 트래픽을 활성화하려면 투명 프록시 또는 IP 위장과 같은 메커니즘을 통해 공개적으로 라우팅한 IPv6 주소를 사용하도록 파드를 활성화해야 한다. [ip-masq-agent](https://github.com/kubernetes-sigs/ip-masq-agent) 프로젝트는 이중 스택 클러스터에서 IP 위장을 지원한다.

{{< note >}}
{{< glossary_tooltip text="CNI" term_id="cni" >}} 공급자가 IPv6를 지원하는지 확인한다.
{{< /note >}}

## {{% heading "whatsnext" %}}


* [IPv4/IPv6 이중 스택 검증](/ko/docs/tasks/network/validate-dual-stack) 네트워킹
