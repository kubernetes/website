---
title: "정책(policy)"
weight: 90
no_list: true
description: >
  정책(policy)을 통한 보안 및 모범 사례 관리.
---

<!-- overview -->

쿠버네티스 정책은 다른 구성(configurations) 또는 런타임 동작 방식을 관리하는 구성이다. 쿠버네티스는 아래에 설명하는 것과 같은 다양한 형태의 정책을 제공한다.

<!-- body -->

## API 오브젝트를 사용한 정책 적용

 일부 API 오브젝트는 정책으로서 작동한다. 다음은 그 예시이다.
* [네트워크폴리시(NetworkPolicy)](/ko/docs/concepts/services-networking/network-policies/)를 사용하여 워크로드에 대한 인그레스 및 이그레스 트래픽을 제한할 수 있다.
* [리밋레인지(LimitRange)](/ko/docs/concepts/policy/limit-range/)는 서로 다른 오브젝트 종류 간에서 리소스 할당 제약사항을 관리한다.
* [리소스쿼터(ResourceQuota)](/ko/docs/concepts/policy/resource-quotas/)는 {{< glossary_tooltip text="네임스페이스" term_id="namespace" >}}의 리소스 소비량을 제한한다.

## 어드미션 컨트롤러를 사용한 정책 적용

{{< glossary_tooltip text="어드미션 컨트롤러" term_id="admission-controller" >}}는 API 서버 안에서 실행되며 API 요청을 검증하거나 변형(mutate)할 수 있다. 
일부 어드미션 컨트롤러는 정책 적용을 수행한다. 
예를 들어, [AlwaysPullImages](/docs/reference/access-authn-authz/admission-controllers/#alwayspullimages) 어드미션 컨트롤러는 
새로운 파드의 이미지 풀 정책을 `Always`로 수정한다.

쿠버네티스는 몇 가지 빌트인 어드미션 컨트롤러를 갖고 있으며 API 서버의 `--enable-admission-plugins` 플래그를 통해 구성할 수 있다.

어드미션 컨트롤러 상세 및 사용 가능한 전체 어드미션 컨트롤러 리스트는 다음의 별도 섹션에 문서화되어 있다.

* [어드미션 컨트롤러](/docs/reference/access-authn-authz/admission-controllers/)

## ValidatingAdmissionPolicy를 사용한 정책 적용

어드미션 정책 검증(Validating Admission Policy)은 Common Expression Language(CEL)를 사용하여 구성 가능한(configurable) 검증 확인을 API 서버 내에서 수행할 수 있게 해 준다. 예를 들어, `ValidatingAdmissionPolicy`를 사용해 이미지 태그에 `latest`를 사용하지 못하도록 할 수 있다.

`ValidatingAdmissionPolicy`는 API 요청에 대해 동작하며, 정책에 부합하지 않는(non-compliant) 구성에 대해 금지하거나, 감사(audit)하거나, 사용자에게 경고하는 데에 사용할 수 있다.

`ValidatingAdmissionPolicy` API에 대한 상세사항과 예시는 다음의 별도 섹션에 문서화되어 있다.
* [어드미션 정책 검증](/docs/reference/access-authn-authz/validating-admission-policy/)


## 동적 어드미션 컨트롤을 사용한 정책 적용

동적 어드미션 컨트롤러(또는 어드미션 웹훅)은 API 서버 외부에서 별도의 애플리케이션으로 동작하며, API 요청 검증 또는 변형(mutate)을 수행하기 위해 웹훅 요청의 수신 동작에 자신을 등록한다.

동적 어드미션 컨트롤러를 사용해 API 요청에 정책을 적용하고 다른 정책 기반 워크플로우를 트리거할 수 있다. 동적 어드미션 컨트롤러는 다른 클러스터 리소스 및 외부 데이터 다운로드 과정을 포함하는 등의 복잡한 체크를 수행할 수 있다. 예를 들어, 이미지 검증 체크 작업이 컨테이너 이미지 서명 및 증명서를 검증하기 위해 OCI 레지스트리의 데이터 조회 과정을 포함할 수도 있다.

동적 어드미션 컨트롤에 대한 상세사항은 다음의 별도 섹션에 문서화되어 있다.
* [동적 어드미션 컨트롤](/docs/reference/access-authn-authz/extensible-admission-controllers/)

### 구현 {#implementations-admission-control}

{{% thirdparty-content %}}

유연한 정책 엔진으로서 동작하는 동적 어드미션 컨트롤러가 쿠버네티스 생태계에서 개발되고 있으며, 예시는 다음과 같다.
- [Kubewarden](https://github.com/kubewarden)
- [Kyverno](https://kyverno.io)
- [OPA Gatekeeper](https://github.com/open-policy-agent/gatekeeper)
- [Polaris](https://polaris.docs.fairwinds.com/admission-controller/)

## kubelet 구성을 사용한 정책 적용

쿠버네티스에서는 각 워커 노드의 kubelet을 구성할 수 있다. 다음과 같은 일부 kubelet 구성은 정책으로서 동작한다.
* [프로세스 ID 제한 및 예약](/ko/docs/concepts/policy/pid-limiting/)으로 할당 가능(allocatable) PID를 제한하거나 예약할 수 있다.
* [노드 리소스 매니저](/ko/docs/concepts/policy/node-resource-managers/)를 사용하여 지연시간에 민감하고 높은 입출력의 워크로드를 위해 컴퓨트, 메모리, 장치 리소스를 관리할 수 있다.
