---
title: 쿠버네티스 API
content_type: concept
weight: 30
description: >
  쿠버네티스 API를 사용하면 쿠버네티스 오브젝트들의 상태를 쿼리하고 조작할 수 있다. 
  쿠버네티스 컨트롤 플레인의 핵심은 API 서버와 그것이 노출하는 HTTP API이다. 사용자와 클러스터의 다른 부분 및 모든 외부 컴포넌트는 API 서버를 통해 서로 통신한다.
card:
  name: concepts
  weight: 30
---

<!-- overview -->

쿠버네티스 {{< glossary_tooltip text="컨트롤 플레인" term_id="control-plane" >}}의 핵심은
{{< glossary_tooltip text="API 서버" term_id="kube-apiserver" >}}이다. API 서버는
최종 사용자, 클러스터의 다른 부분 그리고 외부 컴포넌트가 서로 통신할
수 있도록 HTTP API를 제공한다.

쿠버네티스 API를 사용하면 쿠버네티스 API 오브젝트(예:
파드(Pod), 네임스페이스(Namespace), 컨피그맵(ConfigMap) 그리고 이벤트(Event))를 질의하고 조작할 수 있다.

API 엔드포인트, 리소스 타입과 샘플은 [API Reference](/ko/docs/reference)에 기술되어 있다.




<!-- body -->

## API 변경

새로운 유스케이스가 등장하거나 기존 시스템이 변경됨에 따라 성공적인 시스템은 성장하고 변경될 필요가 있다.
따라서, 쿠버네티스는 쿠버네티스 API를 지속적으로 변경하고 성장시킬 수 있는 디자인 기능을 가지고 있다.
쿠버네티스 프로젝트는 기존 클라이언트와의 호환성을 중단하지 _않고_,
다른 프로젝트가 적응할 수 있도록 오랫동안 호환성을 유지하는 것을 목표로 한다.

일반적으로, 새로운 API 리소스와 새로운 리소스 필드가 주기적으로 추가될 것이다.
리소스나 필드를 없애는 일은 다음의
[API 사용 중단 정책](/docs/reference/using-api/deprecation-policy/)을 따른다.

호환되는 변경에 어떤 내용이 포함되는지, 어떻게 API를 변경하는지에 대한 자세한 내용은
[API 변경](https://git.k8s.io/community/contributors/devel/sig-architecture/api_changes.md#readme)을 참고한다.

## OpenAPI 명세 {#api-specification}

완전한 API 상세 내용은 [OpenAPI](https://www.openapis.org/)를 활용해서 문서화했다.

OpenAPI 규격은 `/openapi/v2` 엔드포인트에서만 제공된다.
다음과 같은 요청 헤더를 사용해서 응답 형식을 요청할 수 있다.

<table>
  <thead>
     <tr>
        <th>Header</th>
        <th style="min-width: 50%;">Possible values</th>
        <th>Notes</th>
     </tr>
  </thead>
  <tbody>
     <tr>
        <td><code>Accept-Encoding</code></td>
        <td><code>gzip</code></td>
        <td><em>not supplying this header is also acceptable</em></td>
     </tr>
     <tr>
        <td rowspan="3"><code>Accept</code></td>
        <td><code>application/com.github.proto-openapi.spec.v2@v1.0+protobuf</code></td>
        <td><em>mainly for intra-cluster use</em></td>
     </tr>
     <tr>
        <td><code>application/json</code></td>
        <td><em>default</em></td>
     </tr>
     <tr>
        <td><code>*</code></td>
        <td><em>serves </em><code>application/json</code></td>
     </tr>
  </tbody>
  <caption>Valid request header values for OpenAPI v2 queries</caption>
</table>

쿠버네티스는 주로 클러스터 내부 통신용 API를 위해 대안적인 Protobuf에 기반한 직렬화 형식을 구현한다. 해당 API는 [design proposal](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/api-machinery/protobuf.md) 문서와 IDL 파일에 문서화되어 있고 각각의 스키마를 담고 있는 IDL 파일은 API 오브젝트를 정의하는 Go 패키지에 들어있다.

## API 버전 규칙

필드를 없애거나 리소스 표현을 재구성하기 쉽도록,
쿠버네티스는 `/api/v1`이나 `/apis/extensions/v1beta1`과 같이
각각 다른 API 경로에서 복수의 API 버전을 지원한다.

버전 관리는 API가 시스템 리소스와 동작에 대해 명확하고 일관된 보기를
제공하고 수명 종료(end-of-life)와 실험적인 API에 대한 접근을 제어할 수 있도록
리소스 또는 필드 수준이 아닌 API 수준에서 수행된다.

JSON과 Protobuf 직렬화 스키마는 스키마 변경에 대한 동일한 지침을 따르며 아래의 모든 설명은 두 형식을 모두 포함한다.

참고로 API 버전 관리와 소프트웨어 버전 관리는 간접적으로만 연관이 있다.
[쿠버네티스 릴리스 버전 관리](https://git.k8s.io/community/contributors/design-proposals/release/versioning.md)
제안은 API 버전 관리와 소프트웨어 버전 관리 사이의 관계를 설명한다.

API 버전이 다른 경우는 안정성이나 기술 지원의 수준이 다르다는 것을 암시한다. 각각의 수준에 대한 조건은
[API 변경](https://git.k8s.io/community/contributors/devel/sig-architecture/api_changes.md#alpha-beta-and-stable-versions)에서
상세히 다룬다. 요약하자면 다음과 같다.

- 알파(Alpha) 수준:
  - 버전 이름에 `alpha`가 포함된다. (예: `v1alpha1`)
  - 버그가 있을 수도 있다. 이 기능을 활성화하면 버그가 노출될 수 있다. 기본적으로 비활성화되어 있다.
  - 기능에 대한 기술 지원이 언제든 공지 없이 중단될 수 있다.
  - 다음 소프트웨어를 릴리스할 때 공지 없이 API의 호환성이 깨지는 방식으로 변경될 수 있다.
  - 버그의 위험이 높고 장기간 지원되지 않으므로 단기간 테스트 용도의 클러스터에서만 사용하기를 권장한다.
- 베타(Beta) 수준:
  - 버전 이름에 `beta`가 포함된다. (예: `v2beta3`).
  - 코드가 잘 테스트되었다. 이 기능을 활성화 시켜도 안전하다. 기본적으로 활성화되어 있다.
  - 구체적인 내용이 바뀔 수는 있지만, 전반적인 기능에 대한 기술 지원이 중단되지 않는다.
  - 오브젝트에 대한 스키마나 문법이 다음 베타 또는 안정화 릴리스에서 호환되지 않는 방식으로 바뀔 수도 있다. 이런 경우,
    다음 버전으로 이관할 수 있는 가이드를 제공할 것이다.
    이 때 API 오브젝트의 삭제, 편집 또는 재생성이 필요할 수도 있다. 편집 절차는 좀 생각해볼 필요가 있다. 이 기능에 의존하고 있는 애플리케이션은 다운타임이 필요할 수도 있다.
  - 다음 릴리스에서 호환되지 않을 수도 있으므로 사업적으로 중요하지 않은 용도로만 사용하기를 권장한다.
    복수의 클러스터를 가지고 있어서 독립적으로 업그레이드할 수 있다면 이런 제약에서 안심이 될 수도 있겠다.
  - **베타 기능을 사용하고 피드백을 주기를 바란다! 일단 베타가 끝나면, 실질적으로 더 많은 변경이 어렵다.**
- 안정화(stable) 수준:
  - 버전 이름이 `vX`이고 `X` 는 정수다.
  - 안정화 버전의 기능은 이후 여러 버전에 걸쳐서 소프트웨어 릴리스에 포함된다.

## API 그룹

쿠버네티스 API를 보다 쉽게 확장하기 위해서, [*API 그룹*](https://git.k8s.io/community/contributors/design-proposals/api-machinery/api-group.md)을 구현했다.
API 그룹은 REST 경로와 직렬화된 객체의 `apiVersion` 필드에 명시된다.

클러스터에 다양한 API 그룹이 있다.

1. *레거시* 그룹이라고도 하는 *핵심* 그룹은 REST 경로인 `/api/v1/` 에 있고, `apiVersion: v1`을 사용한다.

1. 이름이 있는 그룹은 REST 경로 `/apis/$GROUP_NAME/$VERSION`에 있으며 `apiVersion: $GROUP_NAME/$VERSION`을 사용한다
  (예: `apiVersion: batch/v1`). 사용 가능한 API 그룹의 전체의 목록은
  [쿠버네티스 API 참조](/ko/docs/reference/)에 있다.


[사용자 지정 리소스](/ko/docs/concepts/extend-kubernetes/api-extension/custom-resources/)로 API를 확장하는 두 가지 방법이 있다.

1. [커스텀리소스데피니션(CustomResourceDefinition)](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/)은
   API 서버가 선택한 리소스 API를 제공하는 방법을 선언적으로 정의할 수 있다.
1. 또한, [자신의 확장 API 서버 구현](/docs/tasks/extend-kubernetes/setup-extension-api-server/)과
   [aggregator](/docs/tasks/extend-kubernetes/configure-aggregation-layer/)를
   사용해서 클라이언트를 원활하게 만들 수 있다.


## API 그룹 활성화 또는 비활성화하기

특정 리소스와 API 그룹은 기본적으로 활성화되어 있다. kube-apiserver에서 커맨드 라인 옵션으로 `--runtime-config` 를
설정해서 활성화하거나 비활성화할 수 있다.

`--runtime-config`는 쉼표로 분리된 값을 허용한다. 예를 들어서 batch/v1을 비활성화시키려면,
`--runtime-config=batch/v1=false`와 같이 설정하고, batch/v2alpha1을 활성화시키려면, `--runtime-config=batch/v2alpha1`을
설정한다. 이 플래그는 API 서버의 런타임 설정에 쉼표로 분리된 키=값 쌍의 집합을 허용한다.

{{< note >}}그룹이나 리소스를 활성화 또는 비활성화하려면 kube-apiserver와
controller-manager를 재시작해서 `--runtime-config` 변경 사항을 반영해야 한다. {{< /note >}}

## extensions/v1beta1 그룹 내 특정 리소스 활성화하기

데몬셋, 디플로이먼트, 스테이트풀셋, 네트워크폴리시, 파드시큐리티폴리시 그리고 레플리카셋은 `extensions/v1beta1` API 그룹에서 기본적으로 비활성화되어있다.
예시: 디플로이먼트와 데몬셋의 활성화 설정은
`--runtime-config=extensions/v1beta1/deployments=true,extensions/v1beta1/daemonsets=true` 를 입력한다.

{{< note >}}개별 리소스의 활성화/비활성화는 레거시 문제로 `extensions/v1beta1` API 그룹에서만 지원된다. {{< /note >}}

## 지속성

쿠버네티스는 API 리소스에 대한 직렬화된 상태를 {{< glossary_tooltip term_id="etcd" >}}에
기록하고 저장한다.


## {{% heading "whatsnext" %}}

[API 접근 제어하기](/docs/reference/access-authn-authz/controlling-access/)는 클러스터가
API 접근에 대한 인증과 권한을 관리하는 방법을 설명한다.

전체 API 규약은
[API 규약](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#api-conventions)
문서에 설명되어 있다.

API 엔드포인트, 리소스 타입과 샘플은 [API 참조](/docs/reference/kubernetes-api/)에 설명되어 있다.
