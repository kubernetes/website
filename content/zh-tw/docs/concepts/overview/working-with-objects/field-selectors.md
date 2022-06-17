---
title: 欄位選擇器
weight: 60
---
<!--
title: Field Selectors
weight: 60
-->

<!--
_Field selectors_ let you [select Kubernetes resources](/docs/concepts/overview/working-with-objects/kubernetes-objects) based on the value of one or more resource fields. Here are some example field selector queries:
-->
“欄位選擇器（Field selectors）”允許你根據一個或多個資源欄位的值
[篩選 Kubernetes 資源](/zh-cn/docs/concepts/overview/working-with-objects/kubernetes-objects)。
下面是一些使用欄位選擇器查詢的例子：

* `metadata.name=my-service`
* `metadata.namespace!=default`
* `status.phase=Pending`

<!--
This `kubectl` command selects all Pods for which the value of the [`status.phase`](/docs/concepts/workloads/pods/pod-lifecycle/#pod-phase) field is `Running`:
-->
下面這個 `kubectl` 命令將篩選出 [`status.phase`](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#pod-phase)
欄位值為 `Running` 的所有 Pod：

```shell
kubectl get pods --field-selector status.phase=Running
```
<!--
Field selectors are essentially resource *filters*. By default, no selectors/filters are applied, meaning that all resources of the specified type are selected. This makes the following `kubectl` queries equivalent:
-->
{{< note >}}
欄位選擇器本質上是資源“過濾器（Filters）”。預設情況下，欄位選擇器/過濾器是未被應用的，
這意味著指定型別的所有資源都會被篩選出來。
這使得以下的兩個 `kubectl` 查詢是等價的：

```shell
kubectl get pods
kubectl get pods --field-selector ""
```
{{< /note >}}

<!--
## Supported fields

Supported field selectors vary by Kubernetes resource type. All resource types support the `metadata.name` and `metadata.namespace` fields. Using unsupported field selectors produces an error. For example:
-->
## 支援的欄位  {#supported-fields}

不同的 Kubernetes 資源型別支援不同的欄位選擇器。
所有資源型別都支援 `metadata.name` 和 `metadata.namespace` 欄位。
使用不被支援的欄位選擇器會產生錯誤。例如：

```shell
kubectl get ingress --field-selector foo.bar=baz
```

```
Error from server (BadRequest): Unable to find "ingresses" that match label selector "", field selector "foo.bar=baz": "foo.bar" is not a known field selector: only "metadata.name", "metadata.namespace"
```

<!--
## Supported operators

You can use the `=`, `==`, and `!=` operators with field selectors (`=` and `==` mean the same thing). This `kubectl` command, for example, selects all Kubernetes Services that aren't in the `default` namespace:
-->
## 支援的運算子   {#supported-operators}

你可在欄位選擇器中使用 `=`、`==` 和 `!=` （`=` 和 `==` 的意義是相同的）運算子。
例如，下面這個 `kubectl` 命令將篩選所有不屬於 `default` 名稱空間的 Kubernetes 服務：

```shell
kubectl get services  --all-namespaces --field-selector metadata.namespace!=default
```

<!--
## Chained selectors

As with [label](/docs/concepts/overview/working-with-objects/labels) and other selectors, field selectors can be chained together as a comma-separated list. This `kubectl` command selects all Pods for which the `status.phase` does not equal `Running` and the `spec.restartPolicy` field equals `Always`:
-->
## 鏈式選擇器   {#chained-selectors}

同[標籤](/zh-cn/docs/concepts/overview/working-with-objects/labels/)和其他選擇器一樣，
欄位選擇器可以透過使用逗號分隔的列表組成一個選擇鏈。
下面這個 `kubectl` 命令將篩選 `status.phase` 欄位不等於 `Running` 同時
`spec.restartPolicy` 欄位等於 `Always` 的所有 Pod：

```shell
kubectl get pods --field-selector=status.phase!=Running,spec.restartPolicy=Always
```

<!--
## Multiple resource types

You can use field selectors across multiple resource types. This `kubectl` command selects all Statefulsets and Services that are not in the `default` namespace:
-->
## 多種資源型別   {#multiple-resource-types}

你能夠跨多種資源型別來使用欄位選擇器。
下面這個 `kubectl` 命令將篩選出所有不在 `default` 名稱空間中的 StatefulSet 和 Service：

```shell
kubectl get statefulsets,services --all-namespaces --field-selector metadata.namespace!=default
```
