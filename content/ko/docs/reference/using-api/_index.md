---
title: API 개요
content_type: concept
weight: 10
no_list: true
card:
  name: 레퍼런스
  weight: 50
  title: API 개요
---

<!-- overview -->

이 섹션은 쿠버네티스 API에 대한 참조 정보를 제공한다.

REST API는 쿠버네티스의 근본적인 구조이다. 모든 조작,
컴포넌트 간의 통신과 외부 사용자의 명령은 API 서버에서 처리할 수 있는
REST API 호출이다. 따라서, 쿠버네티스 플랫폼 안의 모든 것은
API 오브젝트로 취급되고,
[API](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/)에 상응하는 항목이 있다.

[쿠버네티스 API 참조](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/)는
쿠버네티스 버전 {{< param "version" >}}에 대한 API가 나열되어 있다.

일반적인 배경 정보를 보려면,
[쿠버네티스 API](/ko/docs/concepts/overview/kubernetes-api/)를 참고한다.
[쿠버네티스 API에 대한 접근 제어](/ko/docs/concepts/security/controlling-access/)는
클라이언트가 쿠버네티스 API 서버에 인증하는 방법과
요청이 승인되는 방법을 설명한다.


## API 버전 규칙

JSON과 Protobuf 직렬화 스키마 모두 스키마 변경에 대해서
동일한 가이드라인을 따른다. 이후 설명에서는 이 형식 모두를 다룬다.

API 버전 규칙과 소프트웨어 버전 규칙은 간접적으로 연관된다.
[API와 릴리스 버전 부여에 관한 제안](https://git.k8s.io/community/contributors/design-proposals/release/versioning.md)에는
API 버전 규칙과 소프트웨어 버전 규칙 간의 관계가 기술되어 있다.

API 버전의 차이는 수준의 안정성과 지원의 차이를 나타낸다.
[API 변경 문서](https://git.k8s.io/community/contributors/devel/sig-architecture/api_changes.md#alpha-beta-and-stable-versions)에서
각 수준의 기준에 대한 더 많은 정보를 찾을 수 있다.

아래는 각 수준의 기준에 대한 요약이다.

- 알파(Alpha):
  - 버전 이름에 `alpha`가 포함된다(예: `v1alpha1`).
  - 버그가 있을 수도 있다. 이 기능을 활성화하면 버그에 노출될 수 있다.
    기본적으로 비활성화되어 있다.
  - 기능에 대한 기술 지원이 언제든 공지 없이 중단될 수 있다.
  - 다음 소프트웨어를 릴리스할 때 공지 없이 API의 호환성이 깨지는 방식으로 변경될 수 있다.
  - 버그에 대한 위험이 높고 장기간 지원되지 않으므로
    단기간 테스트 용도의 클러스터에서만 사용하기를 권장한다.

- 베타(Beta):
  - 버전 이름에 `beta`가 포함된다(예: `v2beta3`).
  - 코드가 잘 테스트 되었다. 이 기능을 활성화해도 안전하다.
    기본적으로 활성화되어 있다.
  - 구체적인 내용이 바뀔 수는 있지만, 전반적인 기능에 대한 기술 지원이 중단되지 않는다.

  - 오브젝트에 대한 스키마나 문법이 다음 베타 또는 안정화 릴리스에서
    호환되지 않는 방식으로 바뀔 수도 있다. 이런 경우, 다음 버전으로
    이관할 수 있는 가이드가 제공된다. 스키마 변경은 API 오브젝트의 삭제, 편집 또는 재생성이
    필요할 수도 있다. 편집 절차는 좀 생각해볼 필요가 있다.
    이 기능에 의존하고 있는 애플리케이션은 다운타임이 필요할 수도 있다.
  - 이 소프트웨어는 프로덕션 용도로 권장하지 않는다. 이후 여러 버전에서
    호환되지 않는 변경 사항이 적용될 수 있다. 복수의 클러스터를 가지고 있어서
    독립적으로 업그레이드할 수 있다면, 이런 제약에서 벗어날 수도 있다.

  {{< note >}}
  베타 기능을 사용해보고 피드백을 제공하자. 기능이 베타 수준을 벗어난 이후에는
  실질적으로 더 많은 변경이 어렵다.
  {{< /note >}}

- 안정화(Stable):
  - 버전 이름이 `vX`이고 `X` 는 정수다.
  - 안정화 버전의 기능은 이후 여러 버전에 걸쳐서 소프트웨어 릴리스에 포함된다.

## API 그룹

[API 그룹](https://git.k8s.io/community/contributors/design-proposals/api-machinery/api-group.md)은
쿠버네티스 API를 더 쉽게 확장하게 해준다.
API 그룹은 REST 경로와 직렬화된 오브젝트의 `apiVersion` 필드에
명시된다.

쿠버네티스에는 다음과 같은 다양한 API 그룹이 있다.

*  *핵심* (또는 *레거시* 라고 불리는) 그룹은 REST 경로 `/api/v1`에 있다.
   핵심 그룹은 `apiVersion` 필드의 일부로 명시되지 않는다. 예를
   들어, `apiVersion: v1` 과 같다.
*  이름이 있는 그룹은 REST 경로 `/apis/$GROUP_NAME/$VERSION`에 있으며
   `apiVersion: $GROUP_NAME/$VERSION`을 사용한다(예를 들어, `apiVersion: batch/v1`).
   지원되는 API 그룹 전체의 목록은
   [쿠버네티스 API 참조 문서](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#-strong-api-groups-strong-)에서 확인할 수 있다.

## API 그룹 활성화 또는 비활성화

특정 리소스 및 API 그룹은 기본적으로 활성화된다. API 서버에서
`--runtime-config` 를 설정하여 활성화 또는 비활성화할 수 있다.
`--runtime-config` 플래그는 API 서버의 런타임 구성을 설명하는
쉼표로 구분된 `<key>=<value>` 쌍을 허용한다. 만약 `=<value>`
부분을 생략하면, `=true` 가 명시된 것처럼 취급한다. 예를 들면, 다음과 같다.

 - `batch/v1` 을 비활성화하려면, `--runtime-config=batch/v1=false` 로 설정
 - `batch/v2alpha1` 을 활성화하려면, `--runtime-config=batch/v2alpha1` 으로 설정

{{< note >}}
그룹이나 리소스를 활성화 또는 비활성화하려면, apiserver와 controller-manager를 재시작하여
`--runtime-config` 변경을 반영해야 한다.
{{< /note >}}

## 지속성

쿠버네티스는 {{< glossary_tooltip term_id="etcd" >}}에 기록하여 API 리소스 측면에서
직렬화된 상태를 저장한다.

## {{% heading "whatsnext" %}}

- [API 규칙](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#api-conventions)에 대해 자세히 알아보기
- [애그리게이터(aggregator)](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/api-machinery/aggregated-api-servers.md)에
  대한 디자인 문서 읽기
