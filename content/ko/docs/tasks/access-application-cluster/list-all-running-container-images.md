---
title: 클러스터 내 실행되는 모든 컨테이너 이미지 보기
content_type: task
weight: 100
---

<!-- overview -->

This page shows how to use kubectl to list all of the Container images
for Pods running in a cluster.
이 문서는 kubectl 을 이용하여 클러스터 내 실행되는 모든 컨테이너 이미지를
보는 방법에 관해 설명한다.

## {{% heading "시작하기 전에" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

In this exercise you will use kubectl to fetch all of the Pods
running in a cluster, and format the output to pull out the list
of Containers for each.

## List all Container images in all namespaces

- Fetch all Pods in all namespaces using `kubectl get pods --all-namespaces`
- Format the output to include only the list of Container image names
  using `-o jsonpath={..image}`.  This will recursively parse out the
  `image` field from the returned json.
  - See the [jsonpath reference](/docs/reference/kubectl/jsonpath/)
    for further information on how to use jsonpath.
- Format the output using standard tools: `tr`, `sort`, `uniq`
  - Use `tr` to replace spaces with newlines
  - Use `sort` to sort the results
  - Use `uniq` to aggregate image counts

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
