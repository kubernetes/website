---
title: 쿠버네티스 오브젝트
content_type: concept
weight: 30
description: >
  쿠버네티스 오브젝트는 쿠버네티스 시스템의 영속성을 가진 엔티티이다.
  쿠버네티스는 이러한 엔티티를 사용하여 클러스터의 상태를 나타낸다.
  쿠버네티스 오브젝트 모델에 대해 알아보고 이를 다루는 방법을 알아본다. 
simple_list: true
card:
  name: concepts
  weight: 40
---

<!-- overview -->

이 페이지는 쿠버네티스 오브젝트가 쿠버네티스 API에서 어떻게 표현되는지와 
이를 `.yaml` 형식으로 작성하는 방법을 설명한다.

<!-- body -->

## 쿠버네티스 오브젝트 이해하기 {#kubernetes-objects}

*쿠버네티스 오브젝트*는 쿠버네티스 시스템의 영속성을 가진 엔티티이다. 쿠버네티스는 이러한
엔티티를 사용하여 클러스터의 상태를 나타낸다. 구체적으로, 다음을 설명할 수 있다.

* 어떤 컨테이너화된 애플리케이션이 실행 중인지 (그리고 어떤 노드에서 실행되는지)
* 해당 애플리케이션에서 사용 가능한 리소스
* 재시작 정책, 업그레이드, 내결함성과 같은 애플리케이션의 동작 방식에 대한 정책 

쿠버네티스 오브젝트는 "의도의 기록"이다. 오브젝트를 생성하면, 쿠버네티스 시스템은
오브젝트가 존재하도록 지속적으로 동작한다. 오브젝트를 생성한다는 것은 곧 
쿠버네티스 시스템에 클러스터의 워크로드가 어떤 모습이어야 하는지를 알려주는 것이며, 이것이
클러스터의 *의도한 상태(desired state)* 이다.

쿠버네티스 오브젝트를 생성, 수정 또는 삭제하려면 [쿠버네티스 API](/ko/docs/concepts/overview/kubernetes-api/)를
사용해야 한다. `kubectl` 명령줄 인터페이스를 사용하면, 
예를 들어, CLI가 필요한 쿠버네티스 API 호출을 대신 수행한다. 또한 
[클라이언트 라이브러리](/ko/docs/reference/using-api/client-libraries/) 중 하나를 이용해 
직접 작성한 프로그램에서 쿠버네티스 API를 호출할 수 있다. 

### 오브젝트 명세(spec)과 상태(status) 

대부분의 쿠버네티스 오브젝트에는 오브젝트 구성을 정의하는 
*`spec`* 와 *`status`* 두 가지 중첩 필드가 있다. 
`spec`을 가진 오브젝트의 경우, 오브젝트를 생성할 때 이를 설정해야 하며,
리소스에 원하는 특성에 대한 설명을 제공해야 한다.
이를 _의도한 상태_ 라고 한다.

`status`는 쿠버네티스 시스템과 그 컴포넌트가 제공하고 업데이트하는
오브젝트의 _현재 상태_ 를 설명한다. 쿠버네티스 
{{< glossary_tooltip text="컨트롤 플레인" term_id="control-plane" >}} 은 모든 오브젝트의 
실제 상태가 사용자가 제공한 원하는 상태와 일치하도록 지속적이고 능동적으로 
관리한다. 

예를 들어, 쿠버네티스에서 디플로이먼트(Deployment)는 클러스터에서 
실행 중인 애플리케이션을 나타낼 수 있는 오브젝트이다. 디플로이먼트를 생성할 때, 
디플로이먼트 `spec`을 설정하여 애플리케이션 복제본 세 개를 실행하도록 
지정할 수 있다. 쿠버네티스 시스템은 디플로이먼트 
명세를 읽고 원하는 애플리케이션 인스턴스 세 개를 시작하며, 
명세에 맞게 상태를 업데이트 한다. 인스턴스 중 하나라도 실패하면
(상태 변경), 쿠버네티스 시스템은
명세와 상태 차이에 대응하여 수정 작업을 수행한다. 이 경우에는 
대체 인스턴스를 시작한다.

오브젝트 명세, 상태, 그리고 메타데이터에 대한 자세한 내용은 
[쿠버네티스 API 컨벤션](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md)을 참고한다.

### 쿠버네티스 오브젝트 설명

쿠버네티스에서 오브젝트를 생성할 때는 원하는 상태를 설명하는 
오브젝트 명세와 오브젝트에 대한 기본 정보 (예: 이름)을 제공해야 한다. 쿠버네티스 API를 
사용하여 오브젝트를 생성할 때 (직접 또는 `kubectl`을 통해), 해당 API 요청은 
요청 본문에 해당 정보를 JSON 형식으로 포함해야 한다.
대부분의 경우, `kubectl`에 _매니페스트_ 라는 파일로 정보를 제공한다.
관례적으로, 매니페스트는 YAML 형식이다 (JSON 형식을 사용할 수도 있다).
`kubectl`과 같은 도구는 HTTP를 통해 API 요청을 할 때 매니페스트의 정보를
JSON이나 다른 지원되는 직렬화 형식으로 변환한다.

다음은 쿠버네티스 배포에 필요한 필드와 오브젝트 명세를 보여주는 매니페스트 
예시이다.

{{% code_sample file="application/deployment.yaml" %}}

위와 같은 매니페스트 파일을 사용하여 디플로이먼트를 생성하는 한 가지 방법은 `kubectl` 명령줄 인터페이스에서 
[`kubectl apply`](/docs/reference/generated/kubectl/kubectl-commands#apply) 명령을 사용하여 
`.yaml` 파일을 인수로 전달하는 것이다. 예를 들면 다음과 같다.

```shell
kubectl apply -f https://k8s.io/examples/application/deployment.yaml
```

출력은 다음과 유사하다.

```
deployment.apps/nginx-deployment created
```

### 필수 필드

생성하려는 쿠버네티스 오브젝트의 매니페스트 (YAML 또는 JSON 파일)에서 
다음 필드에 대한 값을 설정해야 한다.

* `apiVersion` - 이 오브젝트를 생성하는 데 사용하는 쿠버네티스 API 버전 
* `kind` - 생성하려는 오브젝트 종류 
* `metadata` - `name` 문자열, `UID` 및 선택적인 `namespace`을 포함하여 오브젝트를 고유하게 식별하는 데 도움이 되는 데이터
* `spec` - 오브젝트에 대해 원하는 상태 

오브젝트 `spec`의 정확한 형식은 모든 쿠버네티스 오브젝트마다 다르며, 해당 
오브젝트에 고유한 중첩 필드를 포함한다. [쿠버네티스 API 래퍼런스](/docs/reference/kubernetes-api/)를 통해
쿠버네티스를 사용하여 생성할 수 있는 모든 오브젝트 명세 형식을 찾을 수 있다.

예를 들어, 파드 API 레퍼런스의 
[`spec` 필드](/docs/reference/kubernetes-api/workload-resources/pod-v1/#PodSpec)를 참조한다.
각 파드에 대해, `.spec` 필드는 파드와 원하는 상태 (예: 해당 파드 내 
각 컨테이너의 컨테이너 이미지 이름)을 지정한다.
오브젝트 명세의 또 다른 예로는 스테이트풀셋(StatefulSet) API의 
[`spec` 필드](/docs/reference/kubernetes-api/workload-resources/stateful-set-v1/#StatefulSetSpec)가 
있다. 스테이트풀셋을 위해, `.spec` 필드는 스테이트풀셋과 원하는 상태를 
지정한다.
스테이트풀셋의 `.spec` 내에는 파드 오브젝트에 대한 
[템플릿](/ko/docs/concepts/workloads/pods/#파드-템플릿)이 있다. 이 템플릿은 스테이트풀셋 컨트롤러가 스테이트풀셋 명세를 충족하기 위해 
생성할 파드를 설명한다. 
다양한 유형의 오브젝트는 서로 다른 `.status`을 가진다. 다시 말하자면, API 래퍼런스 페이지에서는
해당 `.status` 필드의 구조와 각 유형의 오브젝트에 대한 내용을 자세히 설명한다.

{{< note >}}
YAML 구성 파일 작성에 대한 추가 정보는 [구성 모범 사례](/ko/docs/concepts/configuration/overview/)를 
참조한다. 
{{< /note >}} 

## 서버 측 필드 유효성 검사

쿠버네티스 v1.25부터, API 서버는 오브젝트에서 인식되지 않거나 중복된 필드를 감지하는 서버 측 
[필드 유효성 검사](/docs/reference/using-api/api-concepts/#field-validation) 
를 제공한다. 서버 측에서 `kubectl --validate` 의 
모든 기능을 제공한다. 

`kubectl` 도구는 `--validate` 플래그를 사용하여 필드 유효성 검사 수준을 설정한다. 
`ignore`, `warn`, 또는 `strict` 값을 사용할 수 있으며, `true` (`strict`와 동일) 와 `false` (`ignore`와 동일) 값도
사용할 수 있다. `kubectl` 의 기본 유효성 검사 설정은 `--validate=true`이다.

`Strict`
: 엄격한 필드 검증, 검증 실패 시 오류 발생

`Warn`
: 필드 검증이 수행되지만, 오류는 요청 실패가 아닌 경고로 표시된다.

`Ignore`
: 서버 측 필드 검증이 수행되지 않는다.

`kubectl`이 필드 검증을 지원하려는 API 서버에 연결할 수 없는 경우, 
클라이언트 측 검증을 사용한다. 쿠버네티스 1.27 이상 버전은 항상 필드 검증을 제공하지만,
이전 쿠버네티스 릴리즈에서는 그렇지 않을 수 있다. 클러스터가 v1.27 보다 이전 버전인 경우, 쿠버네티스 버전에 대한
문서를 확인한다.

## {{% heading "whatsnext" %}}

쿠버네티스를 처음 접한다면, 다음 내용을 자세히 참고한다.

* 쿠버네티스의 가장 중요한 기본 오브젝트인 [파드](/ko/docs/concepts/workloads/pods/).
* [디플로이먼트](/ko/docs/concepts/workloads/controllers/deployment/) 오브젝트.
* 쿠버네티스 [컨트롤러](/ko/docs/concepts/architecture/controller/).
* [kubectl](/ko/docs/reference/kubectl/) 과 [kubectl 명령어](/docs/reference/generated/kubectl/kubectl-commands).

[쿠버네티스 오브젝트 관리](/ko/docs/concepts/overview/working-with-objects/object-management/)는
`kubectl` 를 사용하여 오브젝트를 관리하는 방법에 대해 설명한다.
아직 설치되어 있지 않다면, [kubectl 설치하기](/ko/docs/tasks/tools/#kubectl)가 필요할 수 있다.

전반적으로 쿠버네티스 API 대해 알아보려면 다음을 방문한다.

* [쿠버네티스 API 개요](/ko/docs/reference/using-api/)

쿠버네티스의 오브젝트에 대해 더 깊이 이해하려면, 이 섹션의 다른 페이지를 읽어본다. 
<!-- Docsy automatically includes a list of pages in the section -->
