---
title: 列出集群中所有运行容器的镜像
content_type: task
weight: 100
---

<!--
title: List All Container Images Running in a Cluster
content_type: task
weight: 100
-->

<!-- overview -->

<!--
This page shows how to use kubectl to list all of the Container images
for Pods running in a cluster.
-->
本文展示如何使用 kubectl 来列出集群中所有运行 Pod 的容器的镜像

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

<!--
In this exercise you will use kubectl to fetch all of the Pods
running in a cluster, and format the output to pull out the list
of Containers for each.
-->
在本练习中，你将使用 kubectl 来获取集群中运行的所有 Pod，并格式化输出来提取每个 Pod 中的容器列表。

<!--
## List all Container images in all namespaces

- Fetch all Pods in all namespaces using `kubectl get pods --all-namespaces`
- Format the output to include only the list of Container image names
  using `-o jsonpath={.items[*].spec['initContainers', 'containers'][*].image}`.  This will recursively parse out the
  `image` field from the returned json.
  - See the [jsonpath reference](/docs/reference/kubectl/jsonpath/)
    for further information on how to use jsonpath.
- Format the output using standard tools: `tr`, `sort`, `uniq`
  - Use `tr` to replace spaces with newlines
  - Use `sort` to sort the results
  - Use `uniq` to aggregate image counts
-->
## 列出所有命名空间下的所有容器镜像   {#list-all-container-images-in-all-namespaces}

- 使用 `kubectl get pods --all-namespaces` 获取所有命名空间下的所有 Pod
- 使用 `-o jsonpath={.items[*].spec['initContainers', 'containers'][*].image}` 来格式化输出，以仅包含容器镜像名称。
  这将以递归方式从返回的 json 中解析出 `image` 字段。
  - 参阅 [jsonpath 说明](/zh-cn/docs/reference/kubectl/jsonpath/)
    获取更多关于如何使用 jsonpath 的信息。
- 使用标准化工具来格式化输出：`tr`, `sort`, `uniq`
  - 使用 `tr` 以用换行符替换空格
  - 使用 `sort` 来对结果进行排序
  - 使用 `uniq` 来聚合镜像计数

```shell
kubectl get pods --all-namespaces -o jsonpath="{.items[*].spec.containers[*].image}" |\
tr -s '[[:space:]]' '\n' |\
sort |\
uniq -c
```

<!--
The jsonpath is interpreted as follows:

- `.items[*]`: for each returned value
- `.spec`: get the spec
- `['initContainers', 'containers'][*]`: for each container
- `.image`: get the image
-->
jsonpath 解释如下：

- `.items[*]`: 对于每个返回的值
- `.spec`: 获取 spec
- `['initContainers', 'containers'][*]`: 对于每个容器
- `.image`: 获取镜像

<!--
When fetching a single Pod by name, for example `kubectl get pod nginx`,
the `.items[*]` portion of the path should be omitted because a single
Pod is returned instead of a list of items.
-->
{{< note >}}
按名字获取单个 Pod 时，例如 `kubectl get pod nginx`，路径的 `.items[*]` 部分应该省略，
因为返回的是一个 Pod 而不是一个项目列表。
{{< /note >}}

<!--
## List Container images by Pod

The formatting can be controlled further by using the `range` operation to
iterate over elements individually.
-->
## 按 Pod 列出容器镜像   {#list-container-images-by-pod}

可以使用 `range` 操作进一步控制格式化，以单独操作每个元素。

```shell
kubectl get pods --all-namespaces -o jsonpath='{range .items[*]}{"\n"}{.metadata.name}{":\t"}{range .spec.containers[*]}{.image}{", "}{end}{end}' |\
sort
```

<!--
## List Container images filtering by Pod label

To target only Pods matching a specific label, use the -l flag.  The
following matches only Pods with labels matching `app=nginx`.
-->
## 列出以标签过滤后的 Pod 的所有容器镜像   {#list-container-images-filtering-by-pod-label}

要获取匹配特定标签的 Pod，请使用 -l 参数。以下匹配仅与标签 `app=nginx` 相符的 Pod。

```shell
kubectl get pods --all-namespaces -o jsonpath="{.items[*].spec.containers[*].image}" -l app=nginx
```

<!--
## List Container images filtering by Pod namespace

To target only pods in a specific namespace, use the namespace flag. The
following matches only Pods in the `kube-system` namespace.
-->
## 列出以命名空间过滤后的 Pod 的所有容器镜像   {#list-container-images-filtering-by-pod-namespace}

要获取匹配特定命名空间的 Pod，请使用 namespace 参数。以下仅匹配 `kube-system` 命名空间下的 Pod。

```shell
kubectl get pods --namespace kube-system -o jsonpath="{.items[*].spec.containers[*].image}"
```

<!--
## List Container images using a go-template instead of jsonpath

As an alternative to jsonpath, Kubectl supports using [go-templates](https://pkg.go.dev/text/template)
for formatting the output:
-->
## 使用 go-template 代替 jsonpath 来获取容器镜像   {#list-container-images-using-a-go-template-instead-of-jsonpath}

作为 jsonpath 的替代，Kubectl 支持使用 [go-templates](https://pkg.go.dev/text/template) 来格式化输出：

```shell
kubectl get pods --all-namespaces -o go-template --template="{{range .items}}{{range .spec.containers}}{{.image}} {{end}}{{end}}"
```

## {{% heading "whatsnext" %}}

<!--
### Reference

* [Jsonpath](/docs/reference/kubectl/jsonpath/) reference guide
* [Go template](https://pkg.go.dev/text/template) reference guide
-->
### 参考   {#reference}

* [Jsonpath](/zh-cn/docs/reference/kubectl/jsonpath/) 参考指南
* [Go template](https://pkg.go.dev/text/template) 参考指南

