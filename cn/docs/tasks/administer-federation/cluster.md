---
title: 联邦集群
---
<!--
title: Federated Cluster
-->

{% capture overview %}

<!--
This guide explains how to use Clusters API resource in a Federation control plane.
-->
本指南介绍了如何在联邦（federation）控制平面中使用集群 API 资源。

<!--
Different than other Kubernetes resources, such as Deployments, Services and ConfigMaps,
clusters only exist in the federation context, i.e. those requests must be submitted to the
federation api-server.
-->
与其他 Kubernetes 资源（例如Deployment，Service 和 ConfigMap）不同，
集群资源仅存在于联邦上下文中，即这些请求必须提交给联邦 api-server。

{% endcapture %}

{% capture prerequisites %}

* {% include federated-task-tutorial-prereqs.md %}
<!--
* You should also have a basic [working knowledge of Kubernetes](/docs/setup/pick-right-solution/) in
  general.
-->
* 您还应该对  [Kubernetes 的工作方式](/docs/setup/pick-right-solution/)  有基本的认识。

{% endcapture %}

{% capture steps %}

<!--
## Listing Clusters
-->
## 列出集群

<!--
To list the clusters available in your federation, you can use [kubectl](/docs/user-guide/kubectl/) by
running:
-->
要列出联邦中可用的集群，可以使用 [kubectl](/docs/user-guide/kubectl/) 运行：

``` shell
kubectl --context=federation get clusters
```

<!--
The `--context=federation` flag tells kubectl to submit the
request to the Federation apiserver instead of sending it to a Kubernetes
cluster. If you submit it to a k8s cluster, you will receive an error saying
-->
`--context=federation` 参数告诉 kubectl 将请求提交到联邦 apiserver 而不是发送给 Kubernetes 集群。如果您将其提交给 k8s 集群，则会收到错误消息：

```the server doesn't have a resource type "clusters"```

<!--
If you passed the correct Federation context but received a message error saying
-->
如果您传递了正确的联邦上下文，但却收到错误消息：

```No resources found.```

<!--
it means that you haven't
added any cluster to the Federation yet.
-->
这表示您尚未将任何集群添加到联邦。

<!--
## Creating a Federated Cluster
-->
## 创建联邦集群 

<!--
Creating a `cluster` resource in federation means joining it to the federation. To do so, you can use
`kubefed join`. Basically, you need to give the new cluster a name and say what is the name of the
context that corresponds to a cluster that hosts the federation. The following example command adds
the cluster `gondor` to the federation running on host cluster `rivendell`:
-->
在联邦中创建 `cluster` 资源意味着将其加入联邦。您可以使用 `kubefed join` 命令实现该操作。大体上，您需要给新的集群一个名字，并指出联邦主集群对应的上下文名称。以下示例命令将集群 `gondor` 加入运行于主集群 `rivendell` 上的联邦中：

``` shell
kubefed join gondor --host-cluster-context=rivendell
```

<!--
You can find more details on how to do that in the respective section in the
[kubefed guide](/docs/tutorials/federation/set-up-cluster-federation-kubefed/#adding-a-cluster-to-a-federation).
-->
您可以在 [kubefed 指南](/docs/tutorials/federation/set-up-cluster-federation-kubefed/#adding-a-cluster-to-a-federation) 的相应部分找到更多关于如何做到这一点的详细介绍。

<!--
## Deleting a Federated Cluster
-->
## 删除联邦集群

<!--
Converse to creating a cluster, deleting a cluster means unjoining this cluster from the
federation. This can be done with `kubefed unjoin` command. To remove the `gondor` cluster, just do:
-->
与创建集群相反，删除集群表示将集群从联邦中退出。这可以通过 `kubefed unjoin` 完成。要删除 `gondor` 集群，只需要执行：

``` shell
kubefed unjoin gondor --host-cluster-context=rivendell
```

<!--
You can find more details on unjoin in the
[kubefed guide](/docs/tutorials/federation/set-up-cluster-federation-kubefed/#removing-a-cluster-from-a-federation).
-->
您可以在 [kubefed 指南](/docs/tutorials/federation/set-up-cluster-federation-kubefed/#removing-a-cluster-from-a-federation) 中找到更多关于 unjoin 的详细介绍。

<!--
## Labeling Clusters
-->
## 标记集群

<!--
You can label clusters the same way as any other Kubernetes object, which can help with grouping clusters and can also be leveraged by the ClusterSelector.
-->
您可以使用与其它 Kubernetes 对象相同的方式标记集群，这有助于集群分组，也可以被 ClusterSelector 利用。

``` shell
kubectl --context=rivendell label cluster gondor key1=value1 key2=value2
```

<!--
## ClusterSelector Annotation
-->
## ClusterSelector 注解

<!--
Starting in Kubernetes 1.7, there is alpha support for directing objects across the federated clusters with the annotation `federation.alpha.kubernetes.io/cluster-selector`. The *ClusterSelector* is conceptually similar to `nodeSelector`, but instead of selecting against labels on nodes, it selects against labels on federated clusters.
-->
从 Kubernetes 1.7 版本开始，支持通过注解 `federation.alpha.kubernetes.io/cluster-selector` 来指示跨联邦集群的对象（alpha 特性）。*ClusterSelector* 在概念上与 `nodeSelector` 类似，但不是针对节点上的标签进行选择，而是针对联邦集群上的标签进行选择。

<!--
The annotation value must be JSON formatted and must be parsable into the [ClusterSelector API type](/docs/reference/federation/v1beta1/definitions/#_v1beta1_clusterselector). For example: `[{"key": "load", "operator": "Lt", "values": ["10"]}]`. Content that doesn't parse correctly will throw an error and prevent distribution of the object to any federated clusters. Objects of type ConfigMap, Secret, Daemonset, Service and Ingress are included in the alpha implementation.
-->
注解值必须为 JSON 格式，并且必须可以解析为 [ClusterSelector API 类型](/docs/reference/federation/v1beta1/definitions/#_v1beta1_clusterselector)。例如：`[{"key": "load", "operator": "Lt", "values": ["10"]}]`。无法正确解析的内容将引发错误并阻止将对象分发到任何联邦集群。Alpha 实现中包含 ConfigMap、Secret、Daemonset、Service 和 Ingress 类型的对象。

<!--
Here is an example ClusterSelector annotation, which will only select clusters WITH the label `pci=true` and WITHOUT the label `environment=test`:
-->
下面是一个 ClusterSelector 注解的示例，它只会选择带有`pci=true` 且没有 `environment=test`的集群：

``` yaml
  metadata:
    annotations:
      federation.alpha.kubernetes.io/cluster-selector: '[{"key": "pci", "operator":
        "In", "values": ["true"]}, {"key": "environment", "operator": "NotIn", "values":
        ["test"]}]'
```

<!--
The *key* is matched against label names on the federated clusters.
-->
*key* 用于匹配联邦集群上的标签名。

<!--
The *values* are matched against the label values on the federated clusters.
-->
*values* 用于匹配联邦集群上的标签值。

<!--
The possible *operators* are: `In`, `NotIn`, `Exists`, `DoesNotExist`, `Gt`, `Lt`.
-->
可能的 *operator* 有：`In`、`NotIn`、`Exists`、`DoesNotExist`、`Gt`、`Lt`。

<!--
The *values* field is expected to be empty when `Exists` or `DoesNotExist` is specified and may include more than one string when `In` or `NotIn` are used.
-->
当指定 `Exists` 或 `DoesNotExist` 时，*values* 字段应为空。使用 `In` 或 `NotIn` 时，可能包含多个字符串。

<!--
Currently, only integers are supported with `Gt` or `Lt`.
-->
目前，`Gt` 或 `Lt` 仅支持整数。

<!--
## Clusters API reference
-->
## 集群 API 参考

<!--
The full clusters API reference is currently in `federation/v1beta1` and more details can be found in the
[Federation API reference page](/docs/reference/federation/).
-->
完整的集群 API 参考在 `federation/v1beta1` 中，更多细节可以在 [联邦 API 参考页面](/docs/reference/federation/) 找到。

{% endcapture %}

{% include templates/task.md %}
