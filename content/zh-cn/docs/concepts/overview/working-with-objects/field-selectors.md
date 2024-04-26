---
title: 字段选择器
content_type: concept
weight: 70
---
<!--
title: Field Selectors
content_type: concept
weight: 70
-->

<!--
_Field selectors_ let you [select Kubernetes resources](/docs/concepts/overview/working-with-objects/kubernetes-objects) based on the value of one or more resource fields. Here are some examples of field selector queries:

_Field selectors_ let you select Kubernetes {{< glossary_tooltip text="objects" term_id="object" >}} based on the
value of one or more resource fields. Here are some examples of field selector queries:
-->
“字段选择器（Field selectors）”允许你根据一个或多个资源字段的值筛选
Kubernetes {{< glossary_tooltip text="对象" term_id="object" >}}。
下面是一些使用字段选择器查询的例子：

* `metadata.name=my-service`
* `metadata.namespace!=default`
* `status.phase=Pending`

<!--
This `kubectl` command selects all Pods for which the value of the [`status.phase`](/docs/concepts/workloads/pods/pod-lifecycle/#pod-phase) field is `Running`:
-->
下面这个 `kubectl` 命令将筛选出
[`status.phase`](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#pod-phase)
字段值为 `Running` 的所有 Pod：

```shell
kubectl get pods --field-selector status.phase=Running
```

{{< note >}}
<!--
Field selectors are essentially resource *filters*. By default, no selectors/filters are applied, meaning that all resources of the specified type are selected. This makes the `kubectl` queries `kubectl get pods` and `kubectl get pods --field-selector ""` equivalent.
-->
字段选择器本质上是资源“过滤器（Filters）”。默认情况下，字段选择器/过滤器是未被应用的，
这意味着指定类型的所有资源都会被筛选出来。
这使得 `kubectl get pods` 和 `kubectl get pods --field-selector ""`
这两个 `kubectl` 查询是等价的。

{{< /note >}}

<!--
## Supported fields

Supported field selectors vary by Kubernetes resource type. All resource types support the `metadata.name` and `metadata.namespace` fields. Using unsupported field selectors produces an error. For example:
-->
## 支持的字段  {#supported-fields}

不同的 Kubernetes 资源类型支持不同的字段选择器。
所有资源类型都支持 `metadata.name` 和 `metadata.namespace` 字段。
使用不被支持的字段选择器会产生错误。例如：

```shell
kubectl get ingress --field-selector foo.bar=baz
```

```
Error from server (BadRequest): Unable to find "ingresses" that match label selector "", field selector "foo.bar=baz": "foo.bar" is not a known field selector: only "metadata.name", "metadata.namespace"
```

<!--
### List of supported fields

| Kind                      | Fields                                                                                                                                                                                                                                                          |
-->
### 支持字段列表

| 类别                       | 字段                                                                                                                                                                                                                                                            |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Pod                       | `spec.nodeName`<br>`spec.restartPolicy`<br>`spec.schedulerName`<br>`spec.serviceAccountName`<br>`spec.hostNetwork`<br>`status.phase`<br>`status.podIP`<br>`status.nominatedNodeName`                                                                            |
| Event                     | `involvedObject.kind`<br>`involvedObject.namespace`<br>`involvedObject.name`<br>`involvedObject.uid`<br>`involvedObject.apiVersion`<br>`involvedObject.resourceVersion`<br>`involvedObject.fieldPath`<br>`reason`<br>`reportingComponent`<br>`source`<br>`type` |
| Secret                    | `type`                                                                                                                                                                                                                                                          |
| Namespace                 | `status.phase`                                                                                                                                                                                                                                                  |
| ReplicaSet                | `status.replicas`                                                                                                                                                                                                                                               |
| ReplicationController     | `status.replicas`                                                                                                                                                                                                                                               |
| Job                       | `status.successful`                                                                                                                                                                                                                                             |
| Node                      | `spec.unschedulable`                                                                                                                                                                                                                                            |
| CertificateSigningRequest | `spec.signerName`                                                                                                                                                                                                                                               |

<!--
## Supported operators

You can use the `=`, `==`, and `!=` operators with field selectors (`=` and `==` mean the same thing). This `kubectl` command, for example, selects all Kubernetes Services that aren't in the `default` namespace:
-->
## 支持的操作符   {#supported-operators}

你可在字段选择器中使用 `=`、`==` 和 `!=`（`=` 和 `==` 的意义是相同的）操作符。
例如，下面这个 `kubectl` 命令将筛选所有不属于 `default` 命名空间的 Kubernetes 服务：

```shell
kubectl get services  --all-namespaces --field-selector metadata.namespace!=default
```

{{< note >}}
<!--
[Set-based operators](/docs/concepts/overview/working-with-objects/labels/#set-based-requirement)
(`in`, `notin`, `exists`) are not supported for field selectors.
-->
[基于集合的操作符](/zh-cn/docs/concepts/overview/working-with-objects/labels/#set-based-requirement)
（`in`、`notin`、`exists`）不支持字段选择算符。
{{< /note >}}

<!--
## Chained selectors

As with [label](/docs/concepts/overview/working-with-objects/labels) and other selectors, field selectors can be chained together as a comma-separated list. This `kubectl` command selects all Pods for which the `status.phase` does not equal `Running` and the `spec.restartPolicy` field equals `Always`:
-->
## 链式选择器   {#chained-selectors}

同[标签](/zh-cn/docs/concepts/overview/working-with-objects/labels/)和其他选择器一样，
字段选择器可以通过使用逗号分隔的列表组成一个选择链。
下面这个 `kubectl` 命令将筛选 `status.phase` 字段不等于 `Running` 同时
`spec.restartPolicy` 字段等于 `Always` 的所有 Pod：

```shell
kubectl get pods --field-selector=status.phase!=Running,spec.restartPolicy=Always
```

<!--
## Multiple resource types

You can use field selectors across multiple resource types. This `kubectl` command selects all Statefulsets and Services that are not in the `default` namespace:
-->
## 多种资源类型   {#multiple-resource-types}

你能够跨多种资源类型来使用字段选择器。
下面这个 `kubectl` 命令将筛选出所有不在 `default` 命名空间中的 StatefulSet 和 Service：

```shell
kubectl get statefulsets,services --all-namespaces --field-selector metadata.namespace!=default
```
