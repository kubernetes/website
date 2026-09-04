---
title: "정책"
weight: 90
no_list: true
description: >
  정책을 사용하여 보안과 모범 사례를 관리한다.
---

<!-- overview -->

쿠버네티스 정책은 다른 구성이나 런타임 동작을 관리하는 설정이다. 쿠버네티스는 아래에서 설명하는 다양한 형태의 정책을 제공한다.

<!-- body -->

## API 오브젝트를 사용하여 정책 적용하기

 일부 API 오브젝트는 정책 역할을 한다. 다음은 몇 가지 예시이다.
* [네트워크폴리시(NetworkPolicy)](/docs/concepts/services-networking/network-policies/)는 워크로드의 인그레스 및 이그레스 트래픽을 제한하는 데 사용할 수 있다.
* [리밋레인지(LimitRange)](/docs/concepts/policy/limit-range/)는 서로 다른 오브젝트 종류의 리소스 할당 제약 조건을 관리한다.
* [리소스쿼터(ResourceQuota)](/docs/concepts/policy/resource-quotas/)는 {{< glossary_tooltip text="네임스페이스" term_id="namespace" >}}의 리소스 소비를 제한한다.

## 어드미션 컨트롤러를 사용하여 정책 적용하기

{{< glossary_tooltip text="어드미션 컨트롤러" term_id="admission-controller" >}}는
API 서버에서 실행되며
API 요청의 유효성을 검사하거나 요청을 변형할 수 있다. 일부 어드미션 컨트롤러는 정책을 적용하는 역할을 한다.
예를 들어, [AlwaysPullImages](/docs/reference/access-authn-authz/admission-controllers/#alwayspullimages) 어드미션 컨트롤러는 새 파드를 수정하여 이미지 풀 정책을 `Always`로 설정한다.

쿠버네티스에는 API 서버의 `--enable-admission-plugins` 플래그로 구성할 수 있는 여러 빌트인 어드미션 컨트롤러가 있다.

어드미션 컨트롤러에 대한 세부 정보와 사용 가능한 어드미션 컨트롤러의 전체 목록은 별도 섹션에 문서화되어 있다.

* [어드미션 컨트롤러](/docs/reference/access-authn-authz/admission-controllers/)

## ValidatingAdmissionPolicy를 사용하여 정책 적용하기

Validating Admission Policy를 사용하면 Common Expression Language (CEL)를 이용해 구성 가능한 유효성 검사를 API 서버에서 실행할 수 있다. 예를 들어, `ValidatingAdmissionPolicy`를 사용하여 `latest` 이미지 태그의 사용을 금지할 수 있다.

`ValidatingAdmissionPolicy`는 API 요청을 대상으로 동작하며, 규정을 준수하지 않는 구성을 차단하거나 감사(audit)하고, 해당 구성에 대해 사용자에게 경고하는 데 사용할 수 있다.

`ValidatingAdmissionPolicy` API에 대한 세부 정보와 예시는 별도 섹션에 문서화되어 있다.
* [Validating Admission Policy](/docs/reference/access-authn-authz/validating-admission-policy/)


## 동적 어드미션 컨트롤을 사용하여 정책 적용하기

동적 어드미션 컨트롤러(또는 어드미션 웹훅)는 API 서버 외부에서 별도의 애플리케이션으로 실행되며, API 요청의 유효성을 검사하거나 요청을 변형하기 위해 웹훅 요청을 수신하도록 등록된다.

동적 어드미션 컨트롤러는 API 요청에 정책을 적용하고 다른 정책 기반 워크플로를 트리거하는 데 사용할 수 있다. 동적 어드미션 컨트롤러는 클러스터의 다른 리소스와 외부 데이터를 조회해야 하는 경우를 포함하여 복잡한 검사를 수행할 수 있다. 예를 들어, 이미지 검증 시 OCI 레지스트리에서 데이터를 조회하여 컨테이너 이미지의 서명과 증명(attestation)을 검증할 수 있다.

동적 어드미션 컨트롤에 대한 세부 정보는 별도 섹션에 문서화되어 있다.
* [동적 어드미션 컨트롤](/docs/reference/access-authn-authz/extensible-admission-controllers/)

### 구현 {#implementations-admission-control}

{{% thirdparty-content %}}

쿠버네티스 생태계에서는 유연한 정책 엔진 역할을 하는 다음과 같은 동적 어드미션 컨트롤러가 개발되고 있다.
- [Kubewarden](https://github.com/kubewarden)
- [Kyverno](https://kyverno.io)
- [OPA Gatekeeper](https://github.com/open-policy-agent/gatekeeper)
- [Polaris](https://polaris.docs.fairwinds.com/admission-controller/)

## Kubelet 구성을 사용하여 정책 적용하기

쿠버네티스에서는 각 워커 노드의 Kubelet을 구성할 수 있다. 일부 Kubelet 구성은 정책 역할을 한다.
* [프로세스 ID 제한 및 예약](/docs/concepts/policy/pid-limiting/)은 할당 가능한 PID 수를 제한하고 예약하는 데 사용된다.
* [노드 리소스 매니저](/docs/concepts/policy/node-resource-managers/)는 지연 시간에 민감하고 처리량이 많은 워크로드를 위한 컴퓨트, 메모리 및 장치 리소스를 관리할 수 있다.
