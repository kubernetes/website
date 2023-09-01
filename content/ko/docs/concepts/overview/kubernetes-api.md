---
# reviewers:
# - chenopis
title: 쿠버네티스 API
content_type: concept
weight: 40
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

쿠버네티스 API를 사용하면 쿠버네티스의 API 오브젝트(예:
파드(Pod), 네임스페이스(Namespace), 컨피그맵(ConfigMap) 그리고 이벤트(Event))를 질의(query)하고 조작할 수 있다.

대부분의 작업은 [kubectl](/ko/docs/reference/kubectl/)
커맨드 라인 인터페이스 또는 API를 사용하는
[kubeadm](/ko/docs/reference/setup-tools/kubeadm/)과
같은 다른 커맨드 라인 도구를 통해 수행할 수 있다.
그러나, REST 호출을 사용하여 API에 직접 접근할 수도 있다.

쿠버네티스 API를 사용하여 애플리케이션을 작성하는 경우
[클라이언트 라이브러리](/ko/docs/reference/using-api/client-libraries/) 중 하나를 사용하는 것이 좋다.

<!-- body -->

## OpenAPI 명세 {#api-specification}

완전한 API 상세 내용은 [OpenAPI](https://www.openapis.org/)를 활용해서 문서화했다.

### OpenAPI V2

쿠버네티스 API 서버는 `/openapi/v2` 엔드포인트를 통해 
통합된(aggregated) OpenAPI v2 스펙을 제공한다. 
요청 헤더에 다음과 같이 기재하여 응답 형식을 지정할 수 있다.

<table>
  <caption style="display:none"> OpenAPI v2 질의에 사용할 수 있는 유효한 요청 헤더 값</caption>
  <thead>
     <tr>
        <th>헤더</th>
        <th style="min-width: 50%;">사용할 수 있는 값</th>
        <th>참고</th>
     </tr>
  </thead>
  <tbody>
     <tr>
        <td><code>Accept-Encoding</code></td>
        <td><code>gzip</code></td>
        <td><em>이 헤더를 제공하지 않는 것도 가능</em></td>
     </tr>
     <tr>
        <td rowspan="3"><code>Accept</code></td>
        <td><code>application/com.github.proto-openapi.spec.v2@v1.0+protobuf</code></td>
        <td><em>주로 클러스터 내부 용도로 사용</em></td>
     </tr>
     <tr>
        <td><code>application/json</code></td>
        <td><em>기본값</em></td>
     </tr>
     <tr>
        <td><code>*</code></td>
        <td><code>JSON으로 응답</em></td>
     </tr>
  </tbody>
</table>

쿠버네티스는 주로 클러스터 내부 통신을 위해 대안적인
Protobuf에 기반한 직렬화 형식을 구현한다. 이 형식에 대한
자세한 내용은 [쿠버네티스 Protobuf 직렬화](https://git.k8s.io/design-proposals-archive/api-machinery/protobuf.md) 디자인 제안과
API 오브젝트를 정의하는 Go 패키지에 들어있는 각각의 스키마에 대한
IDL(인터페이스 정의 언어) 파일을 참고한다.

### OpenAPI V3

{{< feature-state state="beta"  for_k8s_version="v1.24" >}}

쿠버네티스 {{< param "version" >}} 버전은 OpenAPI v3 API 발행(publishing)에 대한 베타 지원을 제공한다. 
이는 베타 기능이며 기본적으로 활성화되어 있다.
kube-apiserver 구성 요소에 
`OpenAPIV3` [기능 게이트](/ko/docs/reference/command-line-tools-reference/feature-gates/)를 비활성화하여 
이 베타 기능을 비활성화할 수 있다.

`/openapi/v3` 디스커버리 엔드포인트는 사용 가능한 모든 
그룹/버전의 목록을 제공한다. 이 엔드포인트는 JSON 만을 반환한다.
이러한 그룹/버전은 다음과 같은 형식으로 제공된다.

```yaml
{
    "paths": {
        ...,
        "api/v1": {
            "serverRelativeURL": "/openapi/v3/api/v1?hash=CC0E9BFD992D8C59AEC98A1E2336F899E8318D3CF4C68944C3DEC640AF5AB52D864AC50DAA8D145B3494F75FA3CFF939FCBDDA431DAD3CA79738B297795818CF"
        },
        "apis/admissionregistration.k8s.io/v1": {
            "serverRelativeURL": "/openapi/v3/apis/admissionregistration.k8s.io/v1?hash=E19CC93A116982CE5422FC42B590A8AFAD92CDE9AE4D59B5CAAD568F083AD07946E6CB5817531680BCE6E215C16973CD39003B0425F3477CFD854E89A9DB6597"
        },
        ....
    }
}
```
<!-- for editors: intentionally use yaml instead of json here, to prevent syntax highlight error. -->

위의 상대 URL은 변경 불가능한(immutable) OpenAPI 상세를 가리키고 있으며, 
이는 클라이언트에서의 캐싱을 향상시키기 위함이다. 
같은 목적을 위해 API 서버는 적절한 HTTP 캐싱 헤더를 
설정한다(`Expires`를 1년 뒤로, `Cache-Control`을 `immutable`). 
사용 중단된 URL이 사용되면, API 서버는 최신 URL로의 리다이렉트를 반환한다.

쿠버네티스 API 서버는 
쿠버네티스 그룹 버전에 따른 OpenAPI v3 스펙을 
`/openapi/v3/apis/<group>/<version>?hash=<hash>` 엔드포인트에 게시한다.

사용 가능한 요청 헤더 목록은 아래의 표를 참고한다.

<table>
  <caption style="display:none"> OpenAPI v3 질의에 사용할 수 있는 유효한 요청 헤더 값</caption>
  <thead>
     <tr>
        <th>헤더</th>
        <th style="min-width: 50%;">사용할 수 있는 값</th>
        <th>참고</th>
     </tr>
  </thead>
  <tbody>
     <tr>
        <td><code>Accept-Encoding</code></td>
        <td><code>gzip</code></td>
        <td><em>이 헤더를 제공하지 않는 것도 가능</em></td>
     </tr>
     <tr>
        <td rowspan="3"><code>Accept</code></td>
        <td><code>application/com.github.proto-openapi.spec.v3@v1.0+protobuf</code></td>
        <td><em>주로 클러스터 내부 용도로 사용</em></td>
     </tr>
     <tr>
        <td><code>application/json</code></td>
        <td><em>기본값</em></td>
     </tr>
     <tr>
        <td><code>*</code></td>
        <td><code>JSON으로 응답</em></td>
     </tr>
  </tbody>
</table>

## 지속성

쿠버네티스는 오브젝트의 직렬화된 상태를
{{< glossary_tooltip term_id="etcd" >}}에 기록하여 저장한다.

## API 그룹과 버전 규칙

필드를 쉽게 제거하거나 리소스 표현을 재구성하기 위해,
쿠버네티스는 각각 `/api/v1` 또는 `/apis/rbac.authorization.k8s.io/v1alpha1` 과
같은 서로 다른 API 경로에서 여러 API 버전을 지원한다.

버전 규칙은 리소스나 필드 수준이 아닌 API 수준에서 수행되어
API가 시스템 리소스 및 동작에 대한 명확하고 일관된 보기를 제공하고
수명 종료 및/또는 실험적 API에 대한 접근을
제어할 수 있도록 한다.

보다 쉽게 발전하고 API를 확장하기 위해, 쿠버네티스는
[활성화 또는 비활성화](/ko/docs/reference/using-api/#api-그룹-활성화-또는-비활성화)가
가능한 [API 그룹](/ko/docs/reference/using-api/#api-그룹)을 구현한다.

API 리소스는 API 그룹, 리소스 유형, 네임스페이스
(네임스페이스 리소스용) 및 이름으로 구분된다. API 서버는 API 버전 간의
변환을 투명하게 처리한다. 서로 다른 모든 버전은 실제로
동일한 지속 데이터의 표현이다. API 서버는 여러 API 버전을 통해
동일한 기본 데이터를 제공할 수 있다.

예를 들어, 동일한 리소스에 대해  `v1` 과 `v1beta1` 이라는 두 가지 API 버전이
있다고 가정하자. API의 `v1beta1` 버전을 사용하여 오브젝트를 만든 경우,
`v1beta1` 버전이 사용 중단(deprecated)되고 제거될 때까지는
`v1beta1` 또는 `v1` API 버전을 사용하여 해당 오브젝트를 읽거나, 업데이트하거나, 삭제할 수 있다.
그 이후부터는 `v1` API를 사용하여 계속 오브젝트에 접근하고 수정할 수 있다.

## API 변경 사항

성공적인 시스템은 새로운 유스케이스가 등장하거나 기존 사례가 변경됨에 따라 성장하고 변화해야 한다.
따라서, 쿠버네티스는 쿠버네티스 API가 지속적으로 변경되고 성장할 수 있도록 설계했다.
쿠버네티스 프로젝트는 기존 클라이언트와의 호환성을 깨지 _않고_ 다른 프로젝트가
적응할 기회를 가질 수 있도록 장기간 해당 호환성을 유지하는 것을 목표로 한다.

일반적으로, 새 API 리소스와 새 리소스 필드는 자주 추가될 수 있다.
리소스 또는 필드를 제거하려면
[API 지원 중단 정책](/docs/reference/using-api/deprecation-policy/)을 따라야 한다.

쿠버네티스는 일반적으로 API 버전 `v1` 에서 안정 버전(GA)에 도달하면, 공식 쿠버네티스 API에
대한 호환성 유지를 강력하게 이행한다. 또한,
쿠버네티스는 공식 쿠버네티스 API의 _베타_ API 버전으로 만들어진 데이터와도 호환성을 유지하며,
해당 기능이 안정화되었을 때 해당 데이터가 안정 버전(GA)의 API 버전들에 의해 변환되고 접근될 수 있도록 보장한다.

만약 베타 API 버전을 사용했다면, 해당 API가 승급했을 때 후속 베타 버전 혹은 안정된 버전의 API로 전환해야 한다.
해당 작업은 오브젝트 접근을 위해 두 API 버전 모두 사용할 수 있는 베타 API의 사용 중단(deprecation) 시기일 때 진행하는 것이 최선이다.
베타 API의 사용 중단(deprecation) 시기가 끝나고 더 이상 사용될 수 없다면 반드시 대체 API 버전을 사용해야 한다.

{{< note >}}
비록 쿠버네티스는 _알파_ API 버전에 대한 호환성을 유지하는 것을 목표로 하지만, 일부
상황에서 이는 불가능하다. 알파 API 버전을 사용하는 경우, 클러스터를 업그레이드해야 할 때에는 
API 변경으로 인해 호환성이 깨지고 업그레이드 전에 기존 오브젝트를 전부 제거해야 하는 상황에 대비하기 위해
쿠버네티스의 릴리스 정보를 확인하자.
{{< /note >}}

API 버전 수준 정의에 대한 자세한 내용은
[API 버전 레퍼런스](/ko/docs/reference/using-api/#api-버전-규칙)를 참조한다.



## API 확장

쿠버네티스 API는 다음 두 가지 방법 중 하나로 확장할 수 있다.

1. [커스텀 리소스](/ko/docs/concepts/extend-kubernetes/api-extension/custom-resources/)를
   사용하면 API 서버가 선택한 리소스 API를 제공하는 방법을 선언적으로 정의할 수 있다.
1. [애그리게이션 레이어(aggregation layer)](/ko/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/)를
   구현하여 쿠버네티스 API를 확장할 수도 있다.

## {{% heading "whatsnext" %}}

- 자체 [CustomResourceDefinition](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/)을
  추가하여 쿠버네티스 API를 확장하는 방법에 대해 배우기.
- [쿠버네티스 API 접근 제어하기](/ko/docs/concepts/security/controlling-access/)는
  클러스터가 API 접근을 위한 인증 및 권한을 관리하는 방법을 설명한다.
- [API 레퍼런스](/docs/reference/kubernetes-api/)를
  읽고 API 엔드포인트, 리소스 유형 및 샘플에 대해 배우기.
- [API 변경 사항](https://git.k8s.io/community/contributors/devel/sig-architecture/api_changes.md#readme)에서
  호환 가능한 변경 사항을 구성하고, API를 변경하는 방법에 대해 알아본다.
