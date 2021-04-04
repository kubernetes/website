---
title: 클러스터 내 실행되는 모든 컨테이너 이미지 보기
content_type: task
weight: 100
---

<!-- overview -->

이 문서는 kubectl 을 이용하여 클러스터 내 실행되는 모든 컨테이너 이미지를
보는 방법에 관해 설명한다.

## 시작하기 전에
<!--
{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}
-->
<!-- steps -->

이 작업에서는 kubectl 을 사용하여 클러스터 내 실행되는 파드의
모든 정보에 대해서 가져올 것이며, 각각의 컨테이너 리스트를
가져오기 위해 결과값을 포맷할 것이다.

## 모든 네임스페이스의 모든 컨테이너 이미지 가져오기

- `kubectl get pods --all-namespaces` 를 사용하여 모든 네임스페이스의 모든 파드의 정보를 가져온다.
- 컨테이너 이미지 명 리스트만 확인할 수 있도록 결과값을 출력하기 위해서
  `-o jsonpath={..image}` 를 사용한다. 이 명령어는 반복적으로 파싱하여
  결과값으로 받은 json 으로부터 `'image` 필드만 포맷하여 출력한다.
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

The above command will recursively return all fields named `image`
for all items returned.

As an alternative, it is possible to use the absolute path to the image
field within the Pod.  This ensures the correct field is retrieved
even when the field name is repeated,
e.g. many fields are called `name` within a given item:

```shell
kubectl get pods --all-namespaces -o jsonpath="{.items[*].spec.containers[*].image}"
```

The jsonpath is interpreted as follows:

- `.items[*]`: for each returned value
- `.spec`: get the spec
- `.containers[*]`: for each container
- `.image`: get the image

{{< note >}}
When fetching a single Pod by name, for example `kubectl get pod nginx`,
the `.items[*]` portion of the path should be omitted because a single
Pod is returned instead of a list of items.
{{< /note >}}

## List Container images by Pod

The formatting can be controlled further by using the `range` operation to
iterate over elements individually.

```shell
kubectl get pods --all-namespaces -o=jsonpath='{range .items[*]}{"\n"}{.metadata.name}{":\t"}{range .spec.containers[*]}{.image}{", "}{end}{end}' |\
sort
```

## List Container images filtering by Pod label

To target only Pods matching a specific label, use the -l flag.  The
following matches only Pods with labels matching `app=nginx`.

```shell
kubectl get pods --all-namespaces -o=jsonpath="{..image}" -l app=nginx
```

## List Container images filtering by Pod namespace

To target only pods in a specific namespace, use the namespace flag. The
following matches only Pods in the `kube-system` namespace.

```shell
kubectl get pods --namespace kube-system -o jsonpath="{..image}"
```

## List Container images using a go-template instead of jsonpath

As an alternative to jsonpath, Kubectl supports using [go-templates](https://golang.org/pkg/text/template/)
for formatting the output:

```shell
kubectl get pods --all-namespaces -o go-template --template="{{range .items}}{{range .spec.containers}}{{.image}} {{end}}{{end}}"
```

## {{% heading "whatsnext" %}}

### Reference

* [Jsonpath](/docs/reference/kubectl/jsonpath/) reference guide
* [Go template](https://golang.org/pkg/text/template/) reference guide
