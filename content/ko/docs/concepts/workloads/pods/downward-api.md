---
title: 다운워드(Downward) API
content_type: concept
weight: 170
description: >
  실행 중인 컨테이너에 파드 및 컨테이너 필드를 노출하는 두 가지 방법이 있다.
  환경 변수를 활용하거나, 그리고 특수한 볼륨 타입으로 채워진 파일을 이용한다.
  파드 및 컨테이너 필드를 노출하는 이 두 가지 방법을 다운워드 API라고 한다.
---

<!-- overview -->

컨테이너가 쿠버네티스에 지나치게 종속되지 않으면서도
자기 자신에 대한 정보를 알고 있으면 유용할 때가 있다.
*다운워드 API*는 컨테이너가 자기 자신 혹은 클러스터에 대한 정보를,
쿠버네티스 클라이언트나 API 서버 없이도 사용할 수 있게 한다.

예를 들어, 잘 알려진 특정 환경 변수에다가 고유한 식별자를 넣어 사용하는 애플리케이션이 있다고 하자.
해당 애플리케이션에 맞게 작업할 수도 있겠지만,
이는 지루하고 오류가 나기 쉬울뿐더러, 낮은 결합이라는 원칙에도 위배된다.
대신, 파드의 이름을 식별자로 사용하고
잘 알려진 환경 변수에 파드의 이름을 넣는 것도 괜찮은 방법이다.

쿠버네티스에는 실행 중인 컨테이너에 파드 및 컨테이너 필드를 노출하는 두 가지 방법이 있다.

* [환경 변수](/ko/docs/tasks/inject-data-application/environment-variable-expose-pod-information/)
* [볼륨 파일](/ko/docs/tasks/inject-data-application/downward-api-volume-expose-pod-information/)

파드 및 컨테이너 필드를 노출하는 이 두 가지 방법을
*다운워드 API*라고 한다.

<!-- body -->

## 사용 가능한 필드

쿠버네티스 API 필드 중 일부만이 다운워드 API를 통해 접근 가능하다.
이 페이지에서는 사용 가능한 필드를 나열한다.

사용 가능한 파드 필드에 대한 정보는 `fieldRef`를 통해 넘겨줄 수 있다.
API 레벨에서, 파드의 `spec`은 항상 하나 이상의
[컨테이너](/docs/reference/kubernetes-api/workload-resources/pod-v1/#Container)를 정의한다.
사용 가능한 컨테이너 필드에 대한 정보는
`resourceFiledRef`를 통해 넘겨줄 수 있다.

### `fieldRef`를 통해 접근 가능한 정보 {#downwardapi-fieldRef}

대부분의 파드 필드는 환경 변수로써,
또는 `다운워드 API` 볼륨을 사용하여 컨테이너에 제공할 수 있다.
이런 두 가지 방법을 통해 사용 가능한 필드는 다음과 같다.

`metadata.name`
: 파드의 이름

`metadata.namespace`
: 파드가 속한 {{< glossary_tooltip text="네임스페이스" term_id="namespace" >}}

`metadata.uid`
: 파드의 고유 ID

`metadata.annotations['<KEY>']`
: 파드의 {{< glossary_tooltip text="어노테이션" term_id="annotation" >}}에서 `<KEY>`에 해당하는 값 (예를 들어, `metadata.annotations['myannotation']`)

`metadata.labels['<KEY>']`
: 파드의 {{< glossary_tooltip text="레이블" term_id="label" >}}에서 `<KEY>`에 해당하는 문자열 (예를 들어, `metadata.labels['mylabel']`)

`spec.serviceAccountName`
: 파드의 {{< glossary_tooltip text="서비스 어카운트" term_id="service-account" >}}

`spec.nodeName`
: 파드가 실행중인 {{< glossary_tooltip term_id="node" text="노드">}}명

`status.hostIP`
: 파드가 할당된 노드의 기본 IP 주소

`status.podIP`
: 파드의 기본 IP 주소 (일반적으로 IPv4 주소)

추가적으로 아래 필드는 **환경 변수가 아닌**,
`다운워드 API` 볼륨의 `fieldRef`로만 접근 가능하다.

`metadata.labels`
: 파드의 모든 레이블로, 한 줄마다 하나의 레이블을 갖는(`label-key="escaped-label-value"`) 형식을 취함

`metadata.annotations`
: 파드의 모든 어노테이션으로, 한 줄마다 하나의 어노테이션을 갖는(`annotation-key="escaped-annotation-value"`) 형식을 취함

### `resourceFieldRef`를 통해 접근 가능한 정보 {#downwardapi-resourceFieldRef}

컨테이너 필드는 CPU와 메모리 같은 리소스에 대한
[요청 및 제한](/ko/docs/concepts/configuration/manage-resources-containers/#요청-및-제한)
값을 제공한다.


`resource: limits.cpu`
: 컨테이너의 CPU 제한

`resource: requests.cpu`
: 컨테이너의 CPU 요청

`resource: limits.memory`
: 컨테이너의 메모리 제한

`resource: requests.memory`
: 컨테이너의 메모리 요청

`resource: limits.hugepages-*`
: 컨테이너의 hugepage 제한 (`DownwardAPIHugePages` [기능 게이트](/ko/docs/reference/command-line-tools-reference/feature-gates/)가 활성화 된 경우)

`resource: requests.hugepages-*`
: 컨테이너의 hugepage 요청 (`DownwardAPIHugePages` [기능 게이트](/ko/docs/reference/command-line-tools-reference/feature-gates/)가 활성화 된 경우)

`resource: limits.ephemeral-storage`
: 컨테이너의 임시 스토리지 제한

`resource: requests.ephemeral-storage`
: 컨테이너의 임시 스토리지 요청

#### 리소스 제한에 대한 참고 정보

컨테이너의 CPU와 메모리 제한을 명시하지 않고
다운워드 API로 이 정보들을 제공하려고 할 경우,
kubelet은 기본적으로
[노드의 할당 가능량](/docs/tasks/administer-cluster/reserve-compute-resources/#node-allocatable)에 기반하여
CPU와 메모리에 할당 가능한 최댓값을 노출시킨다.

## {{% heading "whatsnext" %}}

자세한 정보는 [`다운워드API` 볼륨](/ko/docs/concepts/storage/volumes/#downwardapi)를 참고한다.

다운워드 API를 사용하여 파드 및 컨테이너 정보를 노출시켜보자.
* [환경 변수](/ko/docs/tasks/inject-data-application/environment-variable-expose-pod-information/)
* [볼륨 파일](/ko/docs/tasks/inject-data-application/downward-api-volume-expose-pod-information/)
