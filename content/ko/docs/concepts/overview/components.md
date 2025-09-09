---
# reviewers:
# - lavalamp
title: 쿠버네티스 컴포넌트
content_type: concept
description: >
  쿠버네티스 클러스터를 구성하는 핵심 컴포넌트 개요.
weight: 10
card:
  title: 클러스터 컴포넌트
  name: concepts
  weight: 20
---

<!-- overview -->

이 페이지는 쿠버네티스 클러스터를 구성하는 필수 컴포넌트에 대한 상위 수준의 개요를 제공한다.

{{< figure src="/images/docs/components-of-kubernetes.svg" alt="쿠버네티스 컴포넌트" caption="쿠버네티스 클러스터 컴포넌트" class="diagram-large" clicktozoom="true" >}}

<!-- body -->

## 핵심 컴포넌트

쿠버네티스 클러스터는 컨트롤 플레인과 하나 이상의 워커 노드로 구성된다.
다음은 주요 컴포넌트에 대한 간략한 개요이다.

### 컨트롤 플레인 컴포넌트

클러스터 전체 상태를 관리한다.

[kube-apiserver](/docs/concepts/architecture/#kube-apiserver)
: 쿠버네티스 HTTP API를 노출하는 핵심 서버 컴포넌트이다.

[etcd](/docs/concepts/architecture/#etcd)
: 모든 API 서버 데이터를 위한 일관성과 고가용성을 갖춘 키-값 저장소이다.

[kube-scheduler](/docs/concepts/architecture/#kube-scheduler)
: 아직 노드에 할당되지 않은 파드를 찾아 적절한 노드에 할당한다.

[kube-controller-manager](/docs/concepts/architecture/#kube-controller-manager)
: {{< glossary_tooltip text="컨트롤러" term_id="controller" >}}를 실행하여 쿠버네티스 API 동작을 구현한다.

[cloud-controller-manager](/docs/concepts/architecture/#cloud-controller-manager) (선택 사항)
: 기본 클라우드 공급자와 통합한다.

## 노드 컴포넌트

모든 노드에서 실행되며, 실행 중인 파드를 유지하고 쿠버네티스 런타임 환경을 제공한다.

[kubelet](/docs/concepts/architecture/#kubelet)
: 파드와 그 안의 컨트롤러가 실행 중임을 보장한다.

[kube-proxy](/docs/concepts/architecture/#kube-proxy) (선택 사항)
: 노드에서 네트워크 규칙을 유지하여 {{< glossary_tooltip text="서비스" term_id="service" >}}를 구현한다.

[컨테이너 런타임](/docs/concepts/architecture/#container-runtime)
: 컨테이너 실행을 담당하는 소프트웨어이다. 자세한 내용은
 [컨테이너 런타임](/ko/docs/setup/production-environment/container-runtimes/)을 참고한다.

{{% thirdparty-content single="true" %}}

클러스터는 각 노드에 대한 추가적인 소프트웨어가 필요할 수 있다. 예를 들어, 리눅스 노드에서는
로컬 컴포넌트를 관리하기 위해 [systemd](https://systemd.io/)를 실행할 수 있다.

## 애드온

애드온은 쿠버네티스 기능을 확장한다. 몇 가지 중요한 예시는 다음과 같다.

[DNS](/docs/concepts/architecture/#dns)
: 클러스터 전반의 DNS 해석을 담당한다.

[웹 UI](/docs/concepts/architecture/#web-ui-dashboard) (대시보드)
: 웹 인터페이스를 통한 클러스터 관리를 제공한다.

[컨테이너 리소스 모니터링](/docs/concepts/architecture/#container-resource-monitoring)
: 컨테이너 매트릭을 수집하고 저장한다.

[클러스터-레벨 로깅](/docs/concepts/architecture/#cluster-level-logging)
: 컨테이너 로그를 중앙 로그 저장소에 저장한다.

## 아키텍처 유연성

쿠버네티스는 이러한 컴포넌트가 배포되고 관리되는 방식에 있어 유연성을 제공한다.
아키텍처는 소규모 개발 환경부터 대규모 프로덕션 개발 환경까지
다양한 요구에 맞게 조정될 수 있다.

각 컴포넌트에 대한 자세한 정보와 클러스터 아키텍처를 구성하는 다양한 방법은
[클러스터 아키텍처](/ko/docs/concepts/architecture/) 페이지를 참고한다.
