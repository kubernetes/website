---
title: 列出叢集中所有執行容器的映象
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
本文展示如何使用 kubectl 來列出叢集中所有執行 Pod 的容器的映象

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

<!--
In this exercise you will use kubectl to fetch all of the Pods
running in a cluster, and format the output to pull out the list
of Containers for each.
-->
在本練習中，你將使用 kubectl 來獲取叢集中執行的所有 Pod，並格式化輸出來提取每個 Pod 中的容器列表。

<!--
## List all Containers in all namespaces

- Fetch all Pods in all namespaces using `kubectl get pods --all-namespaces`
- Format the output to include only the list of Container image names
  using `-o jsonpath={.items[*].spec.containers[*].image}`.  This will recursively parse out the
  `image` field from the returned json.
  - See the [jsonpath reference](/docs/user-guide/jsonpath/)
    for further information on how to use jsonpath.
- Format the output using standard tools: `tr`, `sort`, `uniq`
  - Use `tr` to replace spaces with newlines
  - Use `sort` to sort the results
  - Use `uniq` to aggregate image counts
-->
## 列出所有名稱空間下的所有容器

- 使用 `kubectl get pods --all-namespaces` 獲取所有名稱空間下的所有 Pod
- 使用 `-o jsonpath={.items[*].spec.containers[*].image}` 來格式化輸出，以僅包含容器映象名稱。
  這將以遞迴方式從返回的 json 中解析出 `image` 欄位。
  - 參閱 [jsonpath 說明](/zh-cn/docs/reference/kubectl/jsonpath/)
    獲取更多關於如何使用 jsonpath 的資訊。
- 使用標準化工具來格式化輸出：`tr`, `sort`, `uniq`
  - 使用 `tr` 以用換行符替換空格
  - 使用 `sort` 來對結果進行排序
  - 使用 `uniq` 來聚合映象計數

```shell
kubectl get pods --all-namespaces -o jsonpath="{.items[*].spec.containers[*].image}" |\
tr -s '[[:space:]]' '\n' |\
sort |\
uniq -c
```

<!--
The above command will recursively return all fields named `image`
for all items returned.

As an alternative, it is possible to use the absolute path to the image
field within the Pod.  This ensures the correct field is retrieved
even when the field name is repeated,
e.g. many fields are called `name` within a given item:
-->
上面的命令將遞迴獲取所有返回專案的名為 `image` 的欄位。

作為替代方案，可以使用 Pod 的映象欄位的絕對路徑。這確保即使欄位名稱重複的情況下也能檢索到正確的欄位，例如，特定專案中的許多欄位都稱為 `name`：

```shell
kubectl get pods --all-namespaces -o jsonpath="{.items[*].spec.containers[*].image}"
```

<!--
The jsonpath is interpreted as follows:

- `.items[*]`: for each returned value
- `.spec`: get the spec
- `.containers[*]`: for each container
- `.image`: get the image
-->
jsonpath 解釋如下：

- `.items[*]`: 對於每個返回的值
- `.spec`: 獲取 spec
- `.containers[*]`: 對於每個容器
- `.image`: 獲取映象

<!--
When fetching a single Pod by name, e.g. `kubectl get pod nginx`,
the `.items[*]` portion of the path should be omitted because a single
Pod is returned instead of a list of items.
-->
{{< note >}}
按名字獲取單個 Pod 時，例如 `kubectl get pod nginx`，路徑的 `.items[*]` 部分應該省略，
因為返回的是一個 Pod 而不是一個專案列表。
{{< /note >}}

<!--
## List Container images by Pod

The formatting can be controlled further by using the `range` operation to
iterate over elements individually.
-->
## 按 Pod 列出容器映象

可以使用 `range` 操作進一步控制格式化，以單獨操作每個元素。

```shell
kubectl get pods --all-namespaces -o jsonpath='{range .items[*]}{"\n"}{.metadata.name}{":\t"}{range .spec.containers[*]}{.image}{", "}{end}{end}' |\
sort
```

<!--
## List Containers filtering by Pod label

To target only Pods matching a specific label, use the -l flag.  The
following matches only Pods with labels matching `app=nginx`.
-->
## 列出以標籤過濾後的 Pod 的所有容器

要獲取匹配特定標籤的 Pod，請使用 -l 引數。以下匹配僅與標籤 `app=nginx` 相符的 Pod。

```shell
kubectl get pods --all-namespaces -o jsonpath="{.items[*].spec.containers[*].image}" -l app=nginx
```

<!--
## List Containers filtering by Pod namespace

To target only pods in a specific namespace, use the namespace flag. The
following matches only Pods in the `kube-system` namespace.
-->
## 列出以名稱空間過濾後的 Pod 的所有容器

要獲取匹配特定名稱空間的 Pod，請使用 namespace 引數。以下僅匹配 `kube-system` 名稱空間下的 Pod。

```shell
kubectl get pods --namespace kube-system -o jsonpath="{.items[*].spec.containers[*].image}"
```

<!--
## List Containers using a go-template instead of jsonpath

As an alternative to jsonpath, Kubectl supports using [go-templates](https://golang.org/pkg/text/template/)
for formatting the output:
-->
## 使用 go-template 代替 jsonpath 來獲取容器

作為 jsonpath 的替代，Kubectl 支援使用 [go-templates](https://golang.org/pkg/text/template/) 來格式化輸出：

```shell
kubectl get pods --all-namespaces -o go-template --template="{{range .items}}{{range .spec.containers}}{{.image}} {{end}}{{end}}"
```

## {{% heading "whatsnext" %}}

<!--
### Reference

* [Jsonpath](/docs/reference/kubectl/jsonpath/) reference guide
* [Go template](https://golang.org/pkg/text/template/) reference guide
-->
### 參考

* [Jsonpath](/zh-cn/docs/reference/kubectl/jsonpath/) 參考指南
* [Go template](https://golang.org/pkg/text/template/) 參考指南

