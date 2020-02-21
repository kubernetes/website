---
title: 쿠버네티스 API
content_template: templates/concept
weight: 30
card:
  name: concepts
  weight: 30
---

{{% capture overview %}}

전체 API 관례는 [API conventions doc](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md)에 기술되어 있다.

API 엔드포인트, 리소스 타입과 샘플은 [API Reference](/docs/reference)에 기술되어 있다.

API에 원격 접속하는 방법은 [Controlling API Access doc](/docs/reference/access-authn-authz/controlling-access/)에서 논의되었다.

쿠버네티스 API는 시스템을 위한 선언적 설정 스키마를 위한 기초가 되기도 한다. [kubectl](/docs/reference/kubectl/overview/) 커맨드라인 툴을 사용해서 API 오브젝트를 생성, 업데이트, 삭제 및 조회할 수 있다.

쿠버네티스는 또한 API 리소스에 대해 직렬화된 상태를 (현재는 [etcd](https://coreos.com/docs/distributed-configuration/getting-started-with-etcd/)에) 저장한다. 

쿠버네티스 자체는 여러 컴포넌트로 나뉘어져서 각각의 API를 통해 상호작용한다.

{{% /capture %}}


{{% capture body %}}

## API 변경

경험에 따르면, 성공적인 시스템은 새로운 유스케이스의 등장과 기존의 유스케이스의 변경에 맞춰 성장하고 변경될 필요가 있다. 그래서, 쿠버네티스 API가 지속적으로 변경되고 성장하기를 바란다. 그러나, 일정 기간 동안은 현존하는 클라이언트와의 호환성을 깨지 않으려고 한다. 일반적으로, 새로운 API 리소스와 새로운 리소스 필드가 주기적으로 추가될 것이다. 리소스나 필드를 없애는 일은 다음의 [API deprecation policy](/docs/reference/using-api/deprecation-policy/)를 따른다.

호환되는 변경에 어떤 내용이 포함되는지, 어떻게 API를 변경하는지에 대한 자세한 내용은 [API change document](https://git.k8s.io/community/contributors/devel/sig-architecture/api_changes.md)에 있다.

## OpenAPI 및 Swagger 정의

완전한 API 상세 내용은 [OpenAPI](https://www.openapis.org/)를 활용해서 문서화했다.

쿠버네티스 1.10부터, OpenAPI 규격은 `/openapi/v2` 엔드포인트에서만 제공된다.
요청 형식은 HTTP 헤더에 명시해서 설정할 수 있다.

헤더   | 가능한 값
------ | ---------
Accept | `application/json`, `application/com.github.proto-openapi.spec.v2@v1.0+protobuf` (기본 content-type은 `*/*`에 대해 `application/json`이거나 이 헤더를 전달하지 않음)
Accept-Encoding | `gzip` (이 헤더를 전달하지 않아도 됨)

1.14 이전 버전에서 형식이 구분된 엔드포인트(`/swagger.json`, `/swagger-2.0.0.json`, `/swagger-2.0.0.pb-v1`, `/swagger-2.0.0.pb-v1.gz`)는 OpenAPI 스펙을 다른 포맷으로 제공한다.
이러한 엔드포인트는 사용 중단되었으며, 쿠버네티스 1.14에서 제거됬다.

**OpenAPI 규격을 조회하는 예제**

1.10 이전 | 쿠버네티스 1.10 이상
----------- | -----------------------------
GET /swagger.json | GET /openapi/v2 **Accept**: application/json
GET /swagger-2.0.0.pb-v1 | GET /openapi/v2 **Accept**: application/com.github.proto-openapi.spec.v2@v1.0+protobuf
GET /swagger-2.0.0.pb-v1.gz | GET /openapi/v2 **Accept**: application/com.github.proto-openapi.spec.v2@v1.0+protobuf **Accept-Encoding**: gzip

쿠버네티스는 주로 클러스터 내부 통신용 API를 위해 대안적인 Protobuf에 기반한 직렬화 형식을 구현한다. 해당 API는 [design proposal](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/api-machinery/protobuf.md) 문서와 IDL 파일에 문서화되어 있고 각각의 스키마를 담고 있는 IDL 파일은 API 오브젝트를 정의하는 Go 패키지에 들어있다.

1.14 이전 버전에서 쿠버네티스 apiserver는 `/swaggerapi`에서 [Swagger v1.2](http://swagger.io/)
쿠버네티스 API 스펙을 검색하는데 사용할 수 있는 API도 제공한다.
이러한 엔드포인트는 사용 중단되었으며, 쿠버네티스 1.14에서 제거될 예정이다.

## API 버전 규칙

필드를 없애거나 리소스 표현을 재구성하기 쉽도록,
쿠버네티스는 `/api/v1`이나 `/apis/extensions/v1beta1`과 같이
각각 다른 API 경로에서 복수의 API 버전을 지원한다.

리소스나 필드 수준보다는 API 수준에서 버전을 선택했는데, API가 명료하고, 시스템 리소스와 행위 관점에서 일관성있으며, 더 이상 사용되지 않는 API나 실험적인 API에 접근을 제어할 수 있도록 하기 위함이다. 스키마 변경에 대해서 JSON과 Protobuf 직렬화 스키마 모두 동일한 가이드라인을 따른다. 다음에 이어지는 설명 모두는 이 두 가지 형식에 모두 해당한다.

API 버전 규칙과 소프트웨어 버전 규칙은 간접적으로 연관되어 있음을 알아두자.
[API and release versioning proposal](https://git.k8s.io/community/contributors/design-proposals/release/versioning.md)에는
API 버전 규칙과 소프트웨어 버전 규칙 간의 관계가 기술되어 있다.


API 버전이 다른 경우는 안정성이나 기술 지원의 수준이 다르다는 것을 암시한다.
각각의 수준에 대한 조건은 [API Changes documentation](https://git.k8s.io/community/contributors/devel/sig-architecture/api_changes.md#alpha-beta-and-stable-versions)에서 상세히 다룬다. 요약하자면 다음과 같다.

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

현재 다양한 API 그룹이 사용되고 있다.

1. *핵심* 그룹 또는 *레거시 그룹* 이라고 하는 그룹은 REST 경로 `/api/v1`에서 `apiVersion: v1`을 사용한다.

1. 이름이 있는 그룹은 REST 경로 `/apis/$GROUP_NAME/$VERSION`에 있으며 `apiVersion: $GROUP_NAME/$VERSION`을 사용한다
   (예: `apiVersion: batch/v1`).  지원되는 API 그룹 전체의 목록은 [Kubernetes API reference](/docs/reference/)에서 확인할 수 있다.


[Custom resources](/docs/concepts/api-extension/custom-resources/)로 API를 확장하는 경우에는 두 종류의 경로가 지원된다.

1. [CustomResourceDefinition](/docs/tasks/access-kubernetes-api/extend-api-custom-resource-definitions/)은 아주 기본적인
   CRUD 요구를 갖는 사용자에게 적합하다.
1. 쿠버네티스 API 의미론의 전체 셋을 가지고, 사용자만의 apiserver를 만들고자하는 사용자는
   [aggregator](/docs/tasks/access-kubernetes-api/configure-aggregation-layer/)를 사용해서 클라이언트 입장에서 매끄럽게 동작하도록
   만들 수 있다.


## API 그룹 활성화 시키기

특정 리소스와 API 그룹은 기본적으로 활성화되어 있다. 이들은 apiserver에서 `--runtime-config`를 설정해서 활성화하거나
비활성화 시킬 수 있다. `--runtime-config`는 쉼표로 분리된 값을 허용한다. 예를 들어서 batch/v1을 비활성화 시키려면
`--runtime-config=batch/v1=false`와 같이 설정하고, batch/v2alpha1을 활성화 시키려면 `--runtime-config=batch/v2alpha1`을
설정한다. 이 플래그는 apiserver의 런타임 설정에 쉼표로 분리된 키=값 쌍의 집합을 허용한다.

중요: 그룹이나 리소스를 활성화 또는 비활성화 시키기 위해서는 apiserver와 controller-manager를 재시작해서
`--runtime-config` 변경을 반영시켜야 한다.

## 그룹 내 리소스 활성화 시키기

데몬셋, 디플로이먼트, HorizontalPodAutoscaler, 인그레스, 잡 및 레플리카셋이 기본적으로 활성화되어 있다.
다른 확장 리소스는 apiserver의 `--runtime-config`를 설정해서 활성화 시킬 수 있다.
`--runtime-config`는 쉼표로 분리된 값을 허용한다. 예를 들어 디플로이먼트와 인그레스를 비활성화 시키려면,
`--runtime-config=extensions/v1beta1/deployments=false,extensions/v1beta1/ingresses=false`와 같이 설정한다.

{{% /capture %}}
