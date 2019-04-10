---
title: 联邦 Cluster
content_template: templates/task
---

<!--
---
title: Federated Cluster
content_template: templates/task
---
-->

{{% capture overview %}}

{{< note >}}
{{< include "federation-current-state.md" >}}
{{< /note >}}

<!--
This guide explains how to use Clusters API resource in a Federation control plane.

Different than other Kubernetes resources, such as Deployments, Services and ConfigMaps,
clusters only exist in the federation context, i.e. those requests must be submitted to the
federation api-server.
-->
本指南介绍了如何在联邦控制平面中使用集群 API 资源。

与 Deployment、Service 和 ConfigMap 等 Kubernetes 资源不同，cluster 只存在于联邦上下文中，即这些请求必须提交给联邦 api-server。

{{% /capture %}}

{{% capture prerequisites %}}

* {{< include "federated-task-tutorial-prereqs.md" >}}

<!--
* You should also have a basic [working knowledge of Kubernetes](/docs/setup/pick-right-solution/) in
general.
-->

* 你需要具备基本的 [Kubernetes 工作知识](/docs/setup/pick-right-solution/)。

{{% /capture %}}

{{% capture steps %}}

<!--
## Listing Clusters
-->

## 集群列表

<!--
To list the clusters available in your federation, you can use [kubectl](/docs/user-guide/kubectl/) by
running:
-->

要列出联邦中可用的 cluster，可以使用 [kubectl](/docs/user-guide/kubectl/)
运行:

``` shell
kubectl --context=federation get clusters
```

<!--
The `--context=federation` flag tells kubectl to submit the
request to the Federation apiserver instead of sending it to a Kubernetes
cluster. If you submit it to a k8s cluster, you will receive an error saying
-->
`--context=federation` 参数告诉 kubectl 将请求提交给联邦 apiserver，
而不是将其发送给 Kubernetes 集群。如果您将其提交给 k8s 集群，则会收到错误消息


```the server doesn't have a resource type "clusters"```

<!--
If you passed the correct Federation context but received a message error saying
-->

如果您传递了正确的联邦上下文，但是收到了一条消息错误

```No resources found.```

<!--
it means that you haven't
added any cluster to the Federation yet.
-->
这表示着没有向联邦添加任何集群。

<!--
## Creating a Federated Cluster
-->

## 创建一个联邦集群

<!--
Creating a `cluster` resource in federation means joining it to the federation. To do so, you can use
`kubefed join`. Basically, you need to give the new cluster a name and say what is the name of the
context that corresponds to a cluster that hosts the federation. The following example command adds
the cluster `gondor` to the federation running on host cluster `rivendell`:
-->
在联邦中创建`集群`资源意味着将其加入到联邦中。因此，您可以使用 `kubefed join`。基本上，您需要为新群集指定一个名称，
并说明与承载联邦的集群相对应的上下文的名称。下面的示例命令将集群 `gondor` 添加到运行在主机集群 `rivendell` 上的联邦：


``` shell
kubefed join gondor --host-cluster-context=rivendell
```

<!--
You can find more details on how to do that in the respective section in the
[kubefed guide](/docs/tutorials/federation/set-up-cluster-federation-kubefed/#adding-a-cluster-to-a-federation).
-->
您可以在 [kubefed 指南](/docs/tutorials/federation/set-up-cluster-federation-kubefed/#adding-a-cluster-to-a-federation)的相关章节中找到更多关于如何实现这一点的详细信息。

<!--
## Deleting a Federated Cluster
-->

## 删除一个联邦集群

<!--
Converse to creating a cluster, deleting a cluster means unjoining this cluster from the
federation. This can be done with `kubefed unjoin` command. To remove the `gondor` cluster, just do:
-->
与创建集群相反，删除集群意味着从联邦中取消加入这个集群。这可以通过 `kubefed unjoin` 命令完成。要删除 `gondor` 群集，需要执行以下操作：

``` shell
kubefed unjoin gondor --host-cluster-context=rivendell
```

<!--
You can find more details on unjoin in the
[kubefed guide](/docs/tutorials/federation/set-up-cluster-federation-kubefed/#removing-a-cluster-from-a-federation).
-->
你可以在 [kubefed 指南](/docs/tutorials/federation/set-up-cluster-federation-kubefed/#removing-a-cluster-from-a-federation)中找到更多关于取消加入的详细信息。

<!--
## Labeling Clusters
-->

## 标记集群

<!--
You can label clusters the same way as any other Kubernetes object, which can help with grouping clusters and can also be leveraged by the ClusterSelector.
-->
您可以使用与其他任何 Kubernetes 对象相同的方法标记集群，这有助于对集群进行分组，也可以配合使用 ClusterSelector。

``` shell
kubectl --context=rivendell label cluster gondor key1=value1 key2=value2
```

<!--
## ClusterSelector Annotation
-->

## ClusterSelector 注解

<!--
Starting in Kubernetes 1.7, there is alpha support for directing objects across the federated clusters with the annotation `federation.alpha.kubernetes.io/cluster-selector`. The *ClusterSelector* is conceptually similar to `nodeSelector`, but instead of selecting against labels on nodes, it selects against labels on federated clusters.

The annotation value must be JSON formatted and must be parsable into the [ClusterSelector API type](/docs/reference/federation/v1beta1/definitions/#_v1beta1_clusterselector). For example: `[{"key": "load", "operator": "Lt", "values": ["10"]}]`. Content that doesn't parse correctly will throw an error and prevent distribution of the object to any federated clusters. Objects of type ConfigMap, Secret, Daemonset, Service and Ingress are included in the alpha implementation.

Here is an example ClusterSelector annotation, which will only select clusters WITH the label `pci=true` and WITHOUT the label `environment=test`:
-->

从 Kubernetes 1.7 开始，alpha 支持通过注解 `federation.alpha.kubernetes.io/cluster-selector` 在联邦集群中引导对象。。
*ClusterSelector* 在概念上类似于 `nodeSelector`，但是它不是针对节点上的标签进行选择，而是针对联邦集群上的标签进行选择。

注解值必须是 JSON 格式并且必须可解析为 [ClusterSelector API 类型](/docs/reference/federation/v1beta1/definitions/#_v1beta1_clusterselector)。
例如：`[{"key": "load", "operator": "Lt", "values": ["10"]}]`，不能正确解析的内容将抛出一个错误，并阻止将对象分发到任何联邦集群。alpha 实现包含 ConfigMap、Secret、Daemonset、Service 和 Ingress 类型的对象。

下面是一个 ClusterSelector 注释示例，它只会选择带有标签 `pci=true` 不选择标签为 `environment=test` 的集群：

``` yaml
  metadata:
    annotations:
      federation.alpha.kubernetes.io/cluster-selector: '[{"key": "pci", "operator":
        "In", "values": ["true"]}, {"key": "environment", "operator": "NotIn", "values":
        ["test"]}]'
```

<!--
The *key* is matched against label names on the federated clusters.

The *values* are matched against the label values on the federated clusters.

The possible *operators* are: `In`, `NotIn`, `Exists`, `DoesNotExist`, `Gt`, `Lt`.

The *values* field is expected to be empty when `Exists` or `DoesNotExist` is specified and may include more than one string when `In` or `NotIn` are used.

Currently, only integers are supported with `Gt` or `Lt`.
-->

*key* 与联邦集群上的标签名称匹配。

*values* 与联邦集群上的标签值匹配。

可能的*操作符*有：`In`、`NotIn`、`Exists`、`DoesNotExist`、`Gt`、`Lt`。

*values* 字段在指定 `Exists` 或 `DoesNotExist` 时为空，在使用 `In` 或 `NotIn` 时可能包含多个字符串。

目前，`Gt` 和 `Lt` 操作符只支持整数。

<!--
## Clusters API reference

The full clusters API reference is currently in `federation/v1beta1` and more details can be found in the
[Federation API reference page](/docs/reference/federation/).
-->

## 集群 API 参考

完整的集群 API 参考目前在 `federation/v1beta1` 中，更多细节可以在[联邦 API 参考页面](/docs/reference/federation/)中找到。

{{% /capture %}}


