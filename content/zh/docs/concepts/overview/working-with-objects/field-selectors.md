---
title: 字段选择器
weight: 60
---

<!--
---
title: Field Selectors
weight: 60
---
-->

字段选择器允许您根据一个或多个资源字段的值[筛选 Kubernetes 资源](/docs/concepts/overview/working-with-objects/kubernetes-objects)。
下面是一些使用字段选择器查询的例子：
<!--
_Field selectors_ let you [select Kubernetes resources](/docs/concepts/overview/working-with-objects/kubernetes-objects) based on the value of one or more resource fields. Here are some example field selector queries:
-->

* `metadata.name=my-service`
* `metadata.namespace!=default`
* `status.phase=Pending`

下面这个 `kubectl` 命令将筛选出[`status.phase`](/docs/concepts/workloads/pods/pod-lifecycle/#pod-phase)字段值为 `Running` 的所有 Pod：
<!--
This `kubectl` command selects all Pods for which the value of the [`status.phase`](/docs/concepts/workloads/pods/pod-lifecycle/#pod-phase) field is `Running`:
-->

```shell
kubectl get pods --field-selector status.phase=Running
```

{{< note >}}

字段选择器本质上是资源*过滤器*。默认情况下，字段选择器/过滤器是未被应用的，这意味着指定类型的所有资源都会被筛选出来。
这使得以下的两个 `kubectl` 查询是等价的：
<!--
Field selectors are essentially resource *filters*. By default, no selectors/filters are applied, meaning that all resources of the specified type are selected. This makes the following `kubectl` queries equivalent:
-->

```shell
kubectl get pods
kubectl get pods --field-selector ""
```
{{< /note >}}

## 支持的字段
<!--
## Supported fields
-->

不同的 Kubernetes 资源类型支持不同的字段选择器。
所有资源类型都支持 `metadata.name` 和 `metadata.namespace` 字段。
使用不被支持的字段选择器会产生错误，例如：
<!--
Supported field selectors vary by Kubernetes resource type. All resource types support the `metadata.name` and `metadata.namespace` fields. Using unsupported field selectors produces an error. For example:
-->

```shell
kubectl get ingress --field-selector foo.bar=baz
```
```
Error from server (BadRequest): Unable to find "ingresses" that match label selector "", field selector "foo.bar=baz": "foo.bar" is not a known field selector: only "metadata.name", "metadata.namespace"
```

## 支持的运算符
<!--
## Supported operators
-->

您可以使用 `=`、`==`和 `!=` 对字段选择器进行运算（`=` 和 `==` 的意义是相同的）。
例如，下面这个 `kubectl` 命令将筛选所有不属于 `default` 名称空间的 Kubernetes Service：
<!--
You can use the `=`, `==`, and `!=` operators with field selectors (`=` and `==` mean the same thing). This `kubectl` command, for example, selects all Kubernetes Services that aren't in the `default` namespace:
-->

```shell
kubectl get services  --all-namespaces --field-selector metadata.namespace!=default
```

## 链式选择器
<!--
## Chained selectors
-->

同[标签](/docs/concepts/overview/working-with-objects/labels)和其他选择器一样，字段选择器可以通过使用逗号分隔的列表组成一个选择链。
下面这个 `kubectl` 命令将筛选 `status.phase` 字段不等于 `Running` 同时 `spec.restartPolicy` 字段等于 `Always` 的所有 Pod：
<!--
As with [label](/docs/concepts/overview/working-with-objects/labels) and other selectors, field selectors can be chained together as a comma-separated list. This `kubectl` command selects all Pods for which the `status.phase` does not equal `Running` and the `spec.restartPolicy` field equals `Always`:
-->

```shell
kubectl get pods --field-selector=status.phase!=Running,spec.restartPolicy=Always
```

## 多种资源类型
<!--
## Multiple resource types
-->

您能够跨多种资源类型来使用字段选择器。
下面这个 `kubectl` 命令将筛选出所有不在 `default` 命名空间中的 StatefulSet 和 Service：
<!--
You use field selectors across multiple resource types. This `kubectl` command selects all Statefulsets and Services that are not in the `default` namespace:
-->

```shell
kubectl get statefulsets,services --all-namespaces --field-selector metadata.namespace!=default
```
