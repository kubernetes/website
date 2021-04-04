---
title: 클러스터 내 실행되는 모든 컨테이너 이미지 목록 보기
content_type: task
weight: 100
---

<!-- overview -->

이 문서는 kubectl 을 이용하여 클러스터 내 실행되는 모든 컨테이너 이미지 목록을
보는 방법에 관해 설명한다.

## 시작하기 전에
<!--
{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}
-->
<!-- steps -->

이 작업에서는 kubectl 을 사용하여 클러스터 내 실행되는 파드의
모든 정보에 대해서 가져올 것이며, 각각의 컨테이너 목록을
가져오기 위해 결과값을 포맷할 것이다.

## 모든 네임스페이스의 모든 컨테이너 이미지 가져오기

- `kubectl get pods --all-namespaces` 를 사용하여 모든 네임스페이스의 모든 파드의 정보를 가져온다.
- 컨테이너 이미지 명 목록만 확인할 수 있도록 결과값을 출력하기 위해서
  `-o jsonpath={..image}` 를 사용한다. 이 명령어는 반복적으로 파싱하여
  결과값으로 받은 json 으로부터 `image` 필드만 포맷하여 출력한다.
  - jsonpath를 사용하는 방법에 대해 더 많은 정보를 얻고 싶다면
    [jsonpath reference](/docs/reference/kubectl/jsonpath/) 를 확인한다.
- 다음의 표준 툴을 이용해서 결과값을 포맷한다.: `tr`, `sort`, `uniq`
  - `tr` 을 사용하여 공백을 줄바꾸기로 대체한다.
  - `sort` 를 사용하여 결과값을 정렬한다.
  - `uniq` 를 사용하여 이미지 카운트를 합산한다.

```shell
kubectl get pods --all-namespaces -o jsonpath="{..image}" |\
tr -s '[[:space:]]' '\n' |\
sort |\
uniq -c
```

이 커맨드는 모든 아이템 결과값 중에 `image` 라고 명명된 모든 필드들을
반복적으로 출력한다.

대안으로써, Pod 내의 이미지 필드에 절대 경로를 사용하는 것이 가능하다.
이것은 필드명이 반복될 때에도 정확한 값을 출력하도록 보장해준다.
예를 들어서, 결과값 중에서 많은 필드들이 `name`으로 명명되었을 때:

```shell
kubectl get pods --all-namespaces -o jsonpath="{.items[*].spec.containers[*].image}"
```

이 jsonpath 는 다음과 같이 해석된다.

- `.items[*]`: 각 결과값에 대하여
- `.spec`: spec 값을 가져온다.
- `.containers[*]`: 각 컨테이너에 대하여
- `.image`: image 값을 가져온다.

{{< note >}}
명령어로 하나의 파드를 가져올 때, 예를 들어 `kubectl get pod nginx` 를 사용할 때,
`.items[*]` 표현은 생략되어야 한다. 왜냐하면 모든 아이템의 목록을 가져오는
대신에 하나의 파드에 대한 결과값만 출력되기 때문이다.
{{< /note >}}

## 각 파드의 컨테이너 이미지 보기

아래의 포맷은 `range` 명령어를 사용하여 각각의 요소들을 반복하여 출력할 수
있도록 수정할 수 있다.

```shell
kubectl get pods --all-namespaces -o=jsonpath='{range .items[*]}{"\n"}{.metadata.name}{":\t"}{range .spec.containers[*]}{.image}{", "}{end}{end}' |\
sort
```

## 파드 라벨로 필터링된 컨테이너 이미지 목록 보기

특정 라벨에 맞는 파드들을 특정하기 위해서 -l 플래그를 사용한다. 아래의
명령어 결과값은 `app=nginx` 라벨에 맞는 파드들만 출력한다.

```shell
kubectl get pods --all-namespaces -o=jsonpath="{..image}" -l app=nginx
```

## 파드 네임스페이스로 필터링된 컨테이너 이미지 목록 보기

특정 네임스페이스의 파드를 특정하기 위해서, 네임스페이스 플래그를 사용한다.
아래의 명령어 결과값은 `kube-system` 네임스페이스에 있는 파드만 출력한다.

```shell
kubectl get pods --namespace kube-system -o jsonpath="{..image}"
```

## jsonpath 대신 go-template 을 사용하여 컨테이너 이미지 목록 보기

jsonpath 의 대안으로 Kubectl 은 [go-templates](https://golang.org/pkg/text/template/) 를 지원한다.
다음과 같이 결과값을 포맷할 수 있다:

```shell
kubectl get pods --all-namespaces -o go-template --template="{{range .items}}{{range .spec.containers}}{{.image}} {{end}}{{end}}"
```

## {{% heading "whatsnext" %}}

### Reference

* [Jsonpath](/docs/reference/kubectl/jsonpath/) reference guide
* [Go template](https://golang.org/pkg/text/template/) reference guide
