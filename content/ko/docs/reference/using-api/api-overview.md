---
title: 쿠버네티스 API 개요
content_template: templates/concept
weight: 10
card:
  name: 레퍼런스
  weight: 50
  title: API 개요
---

{{% capture overview %}}
이 페이지는 쿠버네티스 API에 대한 개요를 제공한다.
{{% /capture %}}

{{% capture body %}}
REST API는 쿠버네티스의 근본적인 구조이다. 모든 조작, 컴포넌트 간의 통신과 외부 사용자의 명령은 API 서버에서 처리할 수 있는 REST API 호출이다. 따라서, 쿠버네티스 플랫폼 안의 모든 것은
API 오브젝트로 취급되고,
[API](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/)에 상응하는 항목이 있다.

대부분의 작업은 API에 의존하고 있는
[kubectl](/docs/reference/kubectl/overview/) 커맨드라인 인터페이스 또는
[kubeadm](/docs/reference/setup-tools/kubeadm/kubeadm/)과 같은 다른 커맨드라인 툴을 통해 수행할 수 있다.
그러나, REST 호출 사용을 통해서 API에 직접 접근할 수도 있다.

쿠버네티스 API를 사용하는 애플리케이션을 작성하는 경우
[클라이언트 라이브러리](/docs/reference/using-api/client-libraries/)중 하나의 사용을 고려한다.

## API 버전 규칙

필드를 없애거나 리소스 표현을 재구성하기 쉽도록,
쿠버네티스는 `/api/v1`이나 `/apis/extensions/v1beta1`과 같이
각각 다른 API 경로에서 복수의 API 버전을 지원한다.

아래를 위해 버전은 리소스나 필드 수준보다는 API 수준에서 설정된다.

- API가 시스템 리소스와 동작에 대해 명확하고 일관성 있게 표현하는 것을 보장
- 수명 종료(end-of-life) 또는 실험적인 API 접근 제어 활성화

JSON과 Protobuf 직렬화 스키마 모두 스키마 변경에 대해서 동일한 가이드라인을 따른다. 이후 설명에서는 이 형식 모두를 다룬다.

{{< note >}}
API 버전 규칙과 소프트웨어 버전 규칙은 간접적으로 연관된다.
[API와 릴리스 버전 부여에 관한 제안](https://git.k8s.io/community/contributors/design-proposals/release/versioning.md)에는 API 버전 규칙과 소프트웨어 버전 규칙 간의 관계가 기술되어 있다.
{{< /note >}}

API 버전의 차이는 수준의 안정성과 지원의 차이를 나타낸다. [API 변경 문서](https://git.k8s.io/community/contributors/devel/sig-architecture/api_changes.md#alpha-beta-and-stable-versions)에서 각 수준의 기준에 대한 더 많은 정보를 찾을 수 있다.

아래는 각 수준의 기준에 대한 요약이다.

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
  - 오브젝트에 대한 스키마나 문법이 다음 베타 또는 안정화 릴리스에서 호환되지 않는 방식으로 바뀔 수도 있다. 이런 경우, 다음 버전으로 이관할 수 있는 가이드가 제공된다. 이때 API 오브젝트의 삭제, 편집 또는 재생성이
    필요할 수도 있다. 편집 절차는 좀 생각해볼 필요가 있다. 이 기능에 의존하고 있는 애플리케이션은 다운타임이 필요할 수도 있다.
  - 이후 여러 버전에서 잠재적으로 호환되지 않을 수도 있으므로 사업적으로 중요하지 않은 용도로만 사용하기를 권장한다. 복수의 클러스터를 가지고 있어서 독립적으로 업그레이드할 수 있다면, 이런 제약에서 안심이 될 수도 있겠다.

 {{< note >}}
베타 기능을 사용해보고 피드백을 제공하자. 일단 베타가 끝나면, 실질적으로 더 많은 변경이 어렵다.
 {{< /note >}}

- 안정화(stable) 수준:
  - 버전 이름이 `vX`이고 `X` 는 정수다.
  - 안정화 버전의 기능은 이후 여러 버전에 걸쳐서 소프트웨어 릴리스에 포함된다.

## API 그룹

[*API 그룹*](https://git.k8s.io/community/contributors/design-proposals/api-machinery/api-group.md)은 쿠버네티스 API를 더 쉽게 확장하게 해준다. API 그룹은 REST 경로와 직렬화된 객체의 `apiVersion` 필드에 명시된다.

현재 다음과 같은 다양한 API 그룹이 사용되고 있다:

*  *핵심* (또는 *레거시*라고 불리는) 그룹은 `apiVersion: v1`와 같이 `apiVersion` 필드에 명시되지 않고 REST 경로 `/api/v1`에 있다.
*  이름이 있는 그룹은 REST 경로 `/apis/$GROUP_NAME/$VERSION`에 있으며 `apiVersion: $GROUP_NAME/$VERSION`을 사용한다
   (예를 들어 `apiVersion: batch/v1`).  지원되는 API 그룹 전체의 목록은 [쿠버네티스 API 참조 문서](/docs/reference/)에서 확인할 수 있다.

[사용자 정의 리소스](/docs/concepts/api-extension/custom-resources/)로 API를 확장하는 경우에는 다음 두 종류의 경로가 지원된다.

 - 기본적인 CRUD 요구에는
   [CustomResourceDefinition](/docs/tasks/access-kubernetes-api/extend-api-custom-resource-definitions/)
 - 쿠버네티스 API의 의미론적 전체 집합으로 사용자만의 Apiserver를 구현하려는 경우에는 [aggregator](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/api-machinery/aggregated-api-servers.md)


## API 그룹 활성화 시키기

특정 리소스와 API 그룹은 기본적으로 활성화되어 있다. 이들은 apiserver에서 `--runtime-config`를 설정해서 활성화하거나
비활성화 시킬 수 있다. `--runtime-config`는 쉼표로 분리된 값을 허용한다. 예를 들어:
 - batch/v1을 비활성화하려면 `--runtime-config=batch/v1=false`로 설정
 - batch/v2alpha1을 활성화하려면 `--runtime-config=batch/v2alpha1`로 설정
이 플래그는 apiserver의 런타임 구성을 설명하는 쉼표로 분리된 키=값 쌍의 집합을 허용한다.

{{< note >}}
그룹이나 리소스를 활성화 또는 비활성화하려면, apiserver와 controller-manager를 재시작하여
`--runtime-config` 변경을 반영해야 한다.
{{< /note >}}

## 그룹 내 리소스 활성화 시키기

데몬셋, 디플로이먼트, HorizontalPodAutoscaler, 인그레스, 잡 및 레플리카셋이 기본적으로 활성화되어 있다.
다른 확장 리소스는 apiserver의 `--runtime-config`를 설정해서
활성화할 수 있다. `--runtime-config`는 쉼표로 분리된 값을 허용한다. 예를 들어 디플로이먼트와 잡을 비활성화하려면,
`--runtime-config=extensions/v1beta1/deployments=false,extensions/v1beta1/ingresses=false`와 같이 설정한다.
{{% /capture %}}


