---
title: 联邦 ConfigMap
content_template: templates/task
---

<!--
---
title: Federated ConfigMap
content_template: templates/task
---
-->

{{% capture overview %}}

{{< deprecationfilewarning >}}
{{< include "federation-deprecation-warning-note.md" >}}
{{< /deprecationfilewarning >}}

<!--
This guide explains how to use ConfigMaps in a Federation control plane.

Federated ConfigMaps are very similar to the traditional [Kubernetes
ConfigMaps](/docs/tasks/configure-pod-container/configure-pod-configmap/) and provide the same functionality.
Creating them in the federation control plane ensures that they are synchronized
across all the clusters in federation.
-->

本指南介绍如何在联邦控制平面中使用 ConfigMap。

联邦 ConfigMap 与传统的 Kubernetes ConfigMap 非常相似，并提供相同的功能。在联邦控制平面中创建它们可确保它们在联邦中的所有集群之间同步。

{{% /capture %}}

{{% capture prerequisites %}}

* {{< include "federated-task-tutorial-prereqs.md" >}}
* 你应该具有基本的 [Kubernetes 工作知识](/docs/tutorials/kubernetes-basics/)，
尤其是 [configmap](/docs/tasks/configure-pod-container/configure-pod-configmap/)。
<!--
You should also have a basic
[working knowledge of Kubernetes](/docs/tutorials/kubernetes-basics/) in
general and [ConfigMaps](/docs/tasks/configure-pod-container/configure-pod-configmap/) in particular.
-->

{{% /capture %}}

{{% capture steps %}}

<!--
## Creating a Federated ConfigMap
-->

## 创建一个联邦 ConfigMap

<!--
The API for Federated ConfigMap is 100% compatible with the
API for traditional Kubernetes ConfigMap. You can create a ConfigMap by sending
a request to the federation apiserver.
-->
联邦 ConfigMap 的 API 与传统 Kubernetes ConfigMap 的 API 100％ 兼容。您可以通过向联邦身份验证程序发送请求来创建 ConfigMap。

<!-
You can do that using [kubectl](/docs/user-guide/kubectl/) by running:
-->
您可以通过运行以下命令使用 [kubectl](/docs/user-guide/kubectl/) 执行此操作：

``` shell
kubectl --context=federation-cluster create -f myconfigmap.yaml
```

<!--
The `--context=federation-cluster` flag tells kubectl to submit the
request to the Federation apiserver instead of sending it to a Kubernetes
cluster.
-->
`--context=federation-cluster` 参数通知 kubectl 将请求提交给联邦 apiserver，而不是发送到 Kubernetes 集群。

<!--
Once a Federated ConfigMap is created, the federation control plane will create
a matching ConfigMap in all underlying Kubernetes clusters.
You can verify this by checking each of the underlying clusters, for example:
-->
一旦创建了联邦 ConfigMap，就会创建联邦控制平面。所有底层 Kubernetes 集群中创建匹配的ConfigMap，
您可以通过检查每个底层集群来验证这一点，例如:

``` shell
kubectl --context=gce-asia-east1a get configmap myconfigmap
```

<!--
The above assumes that you have a context named 'gce-asia-east1a'
configured in your client for your cluster in that zone.
-->
以上假设您在客户端中为该区域中的集群配置了名为 'gce-asia-east1a' 的上下文。

<!--
These ConfigMaps in underlying clusters will match the Federated ConfigMap.
-->
底层集群中的这些 ConfigMap 将与联邦 ConfigMap 匹配。

<!--
## Updating a Federated ConfigMap
-->

## 更新联邦 ConfigMap

<!--
You can update a Federated ConfigMap as you would update a Kubernetes
ConfigMap; however, for a Federated ConfigMap, you must send the request to
the federation apiserver instead of sending it to a specific Kubernetes cluster.
The federation control plane ensures that whenever the Federated ConfigMap is
updated, it updates the corresponding ConfigMaps in all underlying clusters to
match it.
-->
您可以像更新 Kubernetes ConfigMap 一样更新Federated ConfigMap; 
但是，对于联邦 ConfigMap，您必须将请求发送到联邦 apiserver，而不是将其发送到指定的 Kubernetes 集群。
联邦控制平面确保每当更新联邦 ConfigMap 时，它都会更新所有基础集群中的相应 ConfigMaps 以匹配它。

<!--
## Deleting a Federated ConfigMap
-->

## 删除联邦 ConfigMap

<!--
You can delete a Federated ConfigMap as you would delete a Kubernetes
ConfigMap; however, for a Federated ConfigMap, you must send the request to
the federation apiserver instead of sending it to a specific Kubernetes cluster.
-->
您可以删除联邦 ConfigMap，就像删除 Kubernetes ConfigMap 一样; 
但是，对于联邦 ConfigMap，您必须将请求发送到联邦 apiserver，而不是将其发送到指定的 Kubernetes 集群。

<!--
For example, you can do that using kubectl by running:
-->
例如，您可以通过运行以下命令使用 kubectl 执行此操作：

```shell
kubectl --context=federation-cluster delete configmap
```

{{< note >}}
<!--
Deleting a Federated ConfigMap does not delete the corresponding ConfigMaps from underlying clusters. You must delete the underlying ConfigMaps manually.
-->
删除联邦 ConfigMap 不会从基础集群中删除相应的 ConfigMap。您必须手动删除基础 ConfigMap。
{{< /note >}}

{{% /capture %}}


