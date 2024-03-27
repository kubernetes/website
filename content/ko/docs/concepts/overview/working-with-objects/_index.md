---
title: 쿠버네티스 오브젝트
content_type: concept
weight: 10
description: >
  쿠버네티스 오브젝트는 쿠버네티스 시스템의 영속적인(persistent) 엔티티이다.
  쿠버네티스는 이러한 엔티티들을 사용하여 클러스터의 상태를 표현한다.
  이 페이지에서는 쿠버네티스 오브젝트 모델과 쿠버네티스 오브젝트를 사용하는 방법에 대해 학습한다.
simple_list: true
card:
  name: concepts
  weight: 40
---

<!-- overview -->

이 페이지에서는 쿠버네티스 오브젝트가 쿠버네티스 API에서 어떻게 표현되고, 그 오브젝트를 
어떻게 `.yaml` 형식으로 표현할 수 있는지에 대해 설명한다.

<!-- body -->

## 쿠버네티스 오브젝트 이해하기 {#kubernetes-objects}

*쿠버네티스 오브젝트* 는 쿠버네티스 시스템에서 영속성을 가지는 오브젝트이다. 쿠버네티스는 클러스터의 상태를 
나타내기 위해 이 오브젝트를 이용한다. 구체적으로 말하자면, 다음과 같이 기술할 수 있다.

* 어떤 컨테이너화된 애플리케이션이 동작 중인지 (그리고 어느 노드에서 동작 중인지)
* 그 애플리케이션이 이용할 수 있는 리소스
* 그 애플리케이션이 어떻게 재구동 정책, 업그레이드, 그리고 내고장성과 같은 것에 동작해야 하는지에 대한 정책

쿠버네티스 오브젝트는 하나의 "의도를 담은 레코드"이다. 오브젝트를 생성하게 되면, 쿠버네티스 시스템은 
그 오브젝트 생성을 보장하기 위해 지속적으로 작동할 것이다. 오브젝트를 생성함으로써, 여러분이 클러스터의 
워크로드를 어떤 형태로 보이고자 하는지에 대해 효과적으로 쿠버네티스 시스템에 전한다. 이것이 바로 여러분의 
클러스터에 대해 *의도한 상태* 가 된다.

생성이든, 수정이든, 또는 삭제든 쿠버네티스 오브젝트를 동작시키려면, 
[쿠버네티스 API](/ko/docs/concepts/overview/kubernetes-api/)를 이용해야 한다. 예를 들어, 
`kubectl` 커맨드-라인 인터페이스를 이용할 때, CLI는 여러분 대신 필요한 쿠버네티스 API를 호출해 준다. 
또한, 여러분은 [클라이언트 라이브러리](/ko/docs/reference/using-api/client-libraries/) 중 하나를 
이용하여 여러분만의 프로그램에서 쿠버네티스 API를 직접 이용할 수도 있다.

### 오브젝트 명세(spec)와 상태(status)

거의 모든 쿠버네티스 오브젝트는 오브젝트의 구성을 결정해주는
두 개의 중첩된 오브젝트 필드를 포함하는데 오브젝트 *`spec`* 과 오브젝트 *`status`* 이다.
`spec`을 가진 오브젝트는 오브젝트를 생성할 때 리소스에
원하는 특징(_의도한 상태_)에 대한 설명을
제공해서 설정한다.

`status` 는 쿠버네티스 시스템과 컴포넌트에 의해 제공되고
업데이트된 오브젝트의 _현재 상태_ 를 설명한다. 쿠버네티스
{{< glossary_tooltip text="컨트롤 플레인" term_id="control-plane" >}}은 모든 오브젝트의
실제 상태를 사용자가 의도한 상태와 일치시키기 위해 끊임없이 그리고
능동적으로 관리한다.

예를 들어, 쿠버네티스 디플로이먼트는 클러스터에서 동작하는 애플리케이션을
표현해줄 수 있는 오브젝트이다. 디플로이먼트를 생성할 때, 디플로이먼트
`spec`에 3개의 애플리케이션 레플리카가 동작되도록
설정할 수 있다. 쿠버네티스 시스템은 그 디플로이먼트 spec을 읽어
spec에 일치되도록 상태를 업데이트하여 3개의 의도한
애플리케이션 인스턴스를 구동시킨다. 만약, 그 인스턴스들 중 어느 하나가
어떤 문제로 인해 멈춘다면(상태 변화 발생), 쿠버네티스 시스템은 보정(이
경우에는 대체 인스턴스를 시작하여)을 통해
spec과 status간의 차이에 대응한다.

오브젝트 명세, 상태, 그리고 메타데이터에 대한 추가 정보는, 
[Kubernetes API Conventions](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md) 를 참조한다.

### 쿠버네티스 오브젝트 기술하기

쿠버네티스에서 오브젝트를 생성할 때, (이름과 같은)오브젝트에 대한 기본적인 정보와 더불어, 
의도한 상태를 기술한 오브젝트 spec을 제시해 줘야만 한다. 오브젝트를 생성하기 위해
(직접이든 또는 `kubectl`을 통해서든) 쿠버네티스 API를 이용할 때, API 요청은 요청 내용 안에 
JSON 형식으로 정보를 포함시켜 줘야만 한다. **대부분의 경우 정보를 .yaml 파일로 `kubectl`에 
제공한다.** `kubectl`은 API 요청이 이루어질 때, JSON 형식으로 정보를 
변환시켜 준다.

여기 쿠버네티스 디플로이먼트를 위한 필수 필드와 오브젝트 spec을 보여주는 `.yaml` 파일 예시가 있다.

{{< codenew file="application/deployment.yaml" >}}

위 예시와 같이 .yaml 파일을 이용하여 디플로이먼트를 생성하기 위한 하나의 방식으로는
`kubectl` 커맨드-라인 인터페이스에 인자값으로 `.yaml` 파일을 건네
[`kubectl apply`](/docs/reference/generated/kubectl/kubectl-commands#apply) 커맨드를 이용하는 것이다. 다음 예시와 같다.

```shell
kubectl apply -f https://k8s.io/examples/application/deployment.yaml
```

그 출력 내용은 다음과 유사하다.

```
deployment.apps/nginx-deployment created
```

### 필요한 필드

생성하고자 하는 쿠버네티스 오브젝트에 대한 `.yaml` 파일 내, 다음 필드를 위한 값들을 설정해 줘야한다.

* `apiVersion` - 이 오브젝트를 생성하기 위해 사용하고 있는 쿠버네티스 API 버전이 어떤 것인지
* `kind` - 어떤 종류의 오브젝트를 생성하고자 하는지
* `metadata` - `이름` 문자열, `UID`, 그리고 선택적인 `네임스페이스`를 포함하여 오브젝트를 유일하게 구분지어 줄 데이터
* `spec` - 오브젝트에 대해 어떤 상태를 의도하는지

오브젝트 `spec`에 대한 정확한 포맷은 모든 쿠버네티스 오브젝트마다 다르고, 그 오브젝트 특유의 
중첩된 필드를 포함한다. [쿠버네티스 API 레퍼런스](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/) 는 
쿠버네티스를 이용하여 생성할 수 있는 오브젝트에 대한 모든 spec 포맷을 살펴볼 수 있도록 해준다.

예를 들어, 파드 API 레퍼런스를 보려면 
[`spec` 필드](/docs/reference/kubernetes-api/workload-resources/pod-v1/#PodSpec)를 참조한다. 
각 파드에 대해, `.spec` 필드는 파드 및 파드의 원하는 상태(desired state)를 
기술한다(예: 파드의 각 컨테이너에 대한 컨테이너 이미지). 
오브젝트 상세에 대한 또 다른 예시는 스테이트풀셋 API의 
[`spec` 필드](/docs/reference/kubernetes-api/workload-resources/stateful-set-v1/#StatefulSetSpec)이다. 
스테이트풀셋의 경우, `.spec` 필드는 스테이트풀셋 및 스테이트풀셋의 원하는 상태(desired state)를 기술한다. 
스테이트풀셋의 `.spec`에는 파드 오브젝트에 대한 
[템플릿](/ko/docs/concepts/workloads/pods/#파드-템플릿)이 존재한다. 
이 템플릿은 스테이트풀셋 명세를 만족시키기 위해 
스테이트풀셋 컨트롤러가 생성할 파드에 대한 상세 사항을 설명한다.
서로 다른 종류의 오브젝트는 서로 다른 `.status`를 가질 수 있다. 
다시 한번 말하자면, 각 API 레퍼런스 페이지는 각 오브젝트 타입에 대해 해당 `.status` 필드의 구조와 내용에 대해 소개한다. 

## 서버 측 필드 검증

쿠버네티스 v1.25부터, API 서버는 
서버 측 [필드 검증](/docs/reference/using-api/api-concepts/#field-validation)을 통해 
오브젝트 내의 인식 불가능하거나 중복된 필드를 감지한다. 
이 기능은 `kubectl --validate` 의 모든 기능을 서버 측에서 제공한다.

`kubectl` 도구를 사용할 때 `--validate` 플래그를 사용하여 필드 검증 수준을 지정할 수 있다. 
이 플래그는 `ignore`, `warn`, `strict` 값을 받을 수 있으며, 또한 `true` (`strict` 와 동일) 
및 `false` (`ignore` 와 동일) 도 사용할 수 있다. `kubectl`의 검증 수준 기본값은 `--validate=true` 이다.

`Strict`
: 엄격한 필드 검증이며, 검증 실패 시 오류를 반환한다

`Warn`
: 필드 검증이 수행되지만, 오류가 발생해도 요청이 실패하지 않고 대신 오류가 경고(warning)의 형태로 표시된다

`Ignore`
: 서버 측 필드 검증을 수행하지 않는다

`kubectl`이 필드 검증을 지원하는 API 서버에 연결하지 못하면, 
클라이언트 측 검증을 사용하도록 폴백(fall back)한다. 
쿠버네티스 1.27 부터는 항상 필드 검증을 제공하지만, 그 전 버전은 그렇지 않을 수 있다. 
사용 중인 클러스터의 버전이 v1.27 이전이라면, 해당 쿠버네티스 버전의 문서를 확인한다.

## {{% heading "whatsnext" %}}

쿠버네티스가 처음이라면, 다음 항목들을 더 읽어본다.

* [파드](/ko/docs/concepts/workloads/pods/)는 가장 중요한 쿠버네티스 기본 오브젝트이다.
* [디플로이먼트](/ko/docs/concepts/workloads/controllers/deployment/) 오브젝트.
* 쿠버네티스의 [컨트롤러](/ko/docs/concepts/architecture/controller/).
* [kubectl](/ko/docs/reference/kubectl/) 및 [kubectl 명령어](/docs/reference/generated/kubectl/kubectl-commands).

쿠버네티스 API의 일반적인 사항에 대해 더 알아보려면, 다음 페이지를 방문한다.

* [쿠버네티스 API 개요](/ko/docs/reference/using-api/)

쿠버네티스 오브젝트에 대해 더 깊이있게 알고 싶다면, 이 섹션의 다른 페이지를 읽어 본다.
<!-- Docsy automatically includes a list of pages in the section -->
