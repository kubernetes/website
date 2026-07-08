---
#reviewers:
#- thockin
#- dwinship
min-kubernetes-server-version: v1.33
title: 쿠버네티스 기본 서비스 CIDR 재구성
content_type: task
---

<!-- overview -->
{{< feature-state feature_gate_name="MultiCIDRServiceAllocator" >}}

이 문서는 클러스터에 할당된 기본 서비스 IP 범위를 재구성하는 
방법을 다룬다.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

{{< version-check >}}

<!-- steps -->

## 쿠버네티스 기본 서비스 CIDR 재구성

이 문서는 쿠버네티스 클러스터 내 서비스 IP 주소 범위를 관리하는 
방법을 설명하며, 이는 클러스터가 서비스에 대해 지원하는 IP 패밀리에도
영향을 준다.

서비스 ClusterIPs에 사용 가능한 IP 패밀리는 kube-apiserver의 `--service-cluster-ip-range` 
플래그에 의해 결정된다. 서비스 IP 주소 할당에 대해 더 잘 이해하려면
[가상 IP 및 서비스 프록시](https://kubernetes.io/ko/docs/reference/networking/virtual-ips/#ip-address-objects) 문서를 참고한다.

쿠버네티스 1.33부터, 클러스터에 대해 설정된 서비스 IP 패밀리는
`kubernetes`라는 이름의 `ServiceCIDR` 오브젝트로 반영된다. `kubernetes` `ServiceCIDR` 
오브젝트는 최초로 실행된 kube-apiserver 인스턴스가 자신에게 설정된 `--service-cluster-ip-range` 플래그를
기반으로 생성한다. 일관된 클러스터 동작을 보장하기 위해, 모든 kube-apiserver 인스턴스는 동일한 `--service-cluster-ip-range` 값으로 설정되어야 하며, 이는 기본 쿠버네티스 ServiceCIDR 오브젝트와 일치해야 한다.

### 쿠버네티스 서비스 CIDR 재구성 유형

서비스 CIDR 재구성은 다음과 같은 시나리오로 구분할 수 있다.

* **기존 서비스 CIDR 확장:** 이는 kube-apiserver를 재구성할 필요 없이 
    새 ServiceCIDR 오브젝트를 추가하여 동적으로 
    수행할 수 있다. 자세한 내용은 
    [서비스 IP 범위 확장]
    (https://kubernetes.io/ko/docs/tasks/network/extend-service-ip-ranges/) 문서를 참고한다.

* **단일 스택에서 기본 서비스 CIDR을 유지한 채 이중 스택으로 전환:** 이는
    원래의 IP 패밀리를 기본으로 유지하면서 보조 IP 패밀리(IPv4 전용 클러스터에 IPv6 추가, 
    또는 IPv6 전용 클러스터에 IPv4 추가)를 도입하는 것을 
    의미한다. 이를 위해 kube-apiserver 구성을 업데이트해야 하며 
    이 추가된 IP 패밀리를 처리해야 하는 다양한 클러스터 컴포넌트들도 함께 
    수정해야 한다. 이러한 컴포넌트에는 kube-proxy, CNI 또는 네트워크 
    플러그인, 서비스 메시 구현체, DNS 서비스 등이 포함되지만 이에 국한되지는 
    않는다.

* **이중 스택에서 기본 서비스 CIDR을 유지한 채 단일 스택으로 전환:** 이는
    이중 스택 클러스터에서 보조 IP 패밀리를 제거하고,
    원래의 기본 IP 패밀리를 유지한 채 단일 IP 패밀리로
    되돌리는 것을 의미한다. 컴포넌트를 새 IP 패밀리에 맞게
    재구성하는 것뿐 아니라, 제거된 IP 패밀리를 사용하도록
    명시적으로 설정된 서비스들을 처리해야 할 수도 있다.

* **기본 서비스 CIDR를 변경하는 경우:** 기본
  ServiceCIDR 전체를 교체하는 것은 복잡한 작업이다. 새로운 
  ServiceCIDR이 기존 범위와 겹치지 않는다면 [기존 서비스들의 
  재번호 부여와 `kubernetes.default` 서비스의 변경]
  (#illustrative-reconfiguration-steps)이 필요하다. 
  기본 IP 패밀리 자체가 변경되는 경우에는 훨씬 더 복잡해지며,
  새로운 기본 IP 패밀리에 맞추기 위해 (kubelet, 네트워크 플러그인 등)
  여러 클러스터 구성 요소를 변경해야 할 수도 있다.

### 기본 서비스 CIDR 교체를 위한 수동 작업

기본 서비스 CIDR을 재구성하려면 클러스터 운영자, 관리자, 
또는 클러스터 라이프사이클을 관리하는 소프트웨어가 수행하는 
수동 절차가 필요하다. 일반적으로 다음과 같은 작업을 포함한다.

1.  kube-apiserver 구성 **업데이트**: 새로운 IP 범위로 
    `--service-cluster-ip-range` 플래그를 수정한다.
2.  네트워크 컴포넌트 **재구성**: 이는 중요한 단계이며, 
    구체적인 절차는 사용 중인 네트워크 컴포넌트에 따라 다르다. 
    구성 파일 업데이트, 에이전트 파드 재시작, 또는 새 서비스 
    CIDR과 파드의 원하는 IP 패밀리 구성을 처리하도록 
    컴포넌트를 업데이트하는 작업이 포함될 수 있다. 일반적으로 
    kube-proxy와 같은 쿠버네티스 서비스 구현체, 구성된 네트워크
    플러그인, 그리고 서비스 메시 컨트롤러와 DNS 서버와 같은 다른 
    네트워킹 컴포넌트가 이에 해당하며, 이들이 새 IP 패밀리 
    구성에서 트래픽을 올바르게 처리하고 서비스 디스커버리를 수행할 수 있어야 한다.
3.  **기존 서비스 관리:** 이전 CIDR에서 할당된 서비스 IP가 새로 구성된 
    범위에 속하지 않는 경우 이를 처리해야 한다. 방법으로는 
    (다운타임과 새 IP 할당을 수반하는) 재생성 또는 
    더 복잡한 재구성 전략이 있다.
4.  **내부 쿠버네티스 서비스 재생성:** 기본 IP 패밀리가 
    변경되었거나 다른 네트워크로 교체된 경우, `kubernetes.default` 
    서비스는 새 서비스 CIDR에서 IP를 할당받도록 삭제 후 재생성해야 
    한다.

### 재구성 단계 예시

다음 단계들은 기본 서비스 CIDR을 완전히 교체하고
`kubernetes.default` 서비스 재생성에 초점을 
맞춘 제어된 재구성 절차를 설명한다.

1.  초기 `--service-cluster-ip-range` 값으로 kube-apiserver를 시작한다.
2.  이 범위에서 IP를 할당받는 초기 서비스를 생성한다.
3.  재구성을 위한 임시 대상으로 새로운 서비스 CIDR을 추가한다.
4.  `kubernetes` 기본 서비스 CIDR을 삭제 대상으로 표시한다(기존 IP와 
    파이널라이저(finalizer)로 인해 삭제 대기 상태로 남는다). 이렇게 하면 이전 범위에서 
    새 할당이 이루어지는 것을 방지한다.
5.  기존 서비스를 재생성한다. 이제 새 임시 서비스 CIDR에서
    IP가 할당된다.
6.  새 서비스 CIDR로 설정된 kube-apiserver를 재시작하고
    이전 인스턴스를 종료한다.
7.  `kubernetes.default` 서비스를 삭제한다. 새 kube-apiserver가 
    이를 새 서비스 CIDR 내에서 재생성한다.

## {{% heading "whatsnext" %}}

* **쿠버네티스 네트워킹 개념:**
  [https://kubernetes.io/ko/docs/concepts/cluster-administration/networking/](https://kubernetes.io/ko/docs/concepts/cluster-administration/networking/)
* **쿠버네티스 이중 스택 서비스:**
  [https://kubernetes.io/ko/docs/concepts/services-networking/dual-stack/](https://kubernetes.io/ko/docs/concepts/services-networking/dual-stack/)
* **쿠버네티스 서비스 IP 범위 확장:**
  [https://kubernetes.io/ko/docs/tasks/network/extend-service-ip-ranges/](https://kubernetes.io/ko/docs/tasks/network/extend-service-ip-ranges/)