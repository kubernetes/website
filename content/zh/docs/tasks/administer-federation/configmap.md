---
title: 联邦 ConfigMap
content_template: templates/task
---

<!-- ---
title: Federated ConfigMap
content_template: templates/task
--- -->

{{% capture overview %}}

{{< note >}}
{{< include "federation-current-state.md" >}}
{{< /note >}}

<!-- This guide explains how to use ConfigMaps in a Federation control plane. -->

这个指南介绍了如何在联邦控制平面中使用 ConfigMaps。

<!-- Federated ConfigMaps are very similar to the traditional [Kubernetes
ConfigMaps](/docs/tasks/configure-pod-container/configure-pod-configmap/) and provide the same functionality.
Creating them in the federation control plane ensures that they are synchronized
across all the clusters in federation. -->

联邦 ConfigMaps 与传统的 [Kubernetes
ConfigMaps](/docs/tasks/configure-pod-container/configure-pod-configmap/) 十分相似，并且提供相同的功能。
在联邦控制平面中创建它们可确保它们在联邦集群间的同步。

{{% /capture %}}

{{% capture prerequisites %}}

<!-- * {{< include "federated-task-tutorial-prereqs.md" >}} -->
<!-- * You should also have a basic
[working knowledge of Kubernetes](/docs/setup/pick-right-solution/) in
general and [ConfigMaps](/docs/tasks/configure-pod-container/configure-pod-configmap/) in particular. -->

* {{< include "federated-task-tutorial-prereqs.md" >}}
* 你还需要有基本的[Kubernetes 工作常识](/docs/setup/pick-right-solution/)，尤其是[ConfigMaps](/docs/tasks/configure-pod-container/configure-pod-configmap/)。

{{% /capture %}}

{{% capture steps %}}

<!-- ## Creating a Federated ConfigMap -->

## 创建一个 Federated ConfigMap

<!-- The API for Federated ConfigMap is 100% compatible with the
API for traditional Kubernetes ConfigMap. You can create a ConfigMap by sending
a request to the federation apiserver. -->

Federated ConfigMap 的 API 100% 兼容传统的 Kubernetes ConfigMap。你可以通过发送一个请求到联邦 apiserver 来创建一个 ConfigMap。

<!-- You can do that using [kubectl](/docs/user-guide/kubectl/) by running: -->

你可以使用[kubectl](/docs/user-guide/kubectl/)执行：

``` shell
kubectl --context=federation-cluster create -f myconfigmap.yaml
```

<!-- The `--context=federation-cluster` flag tells kubectl to submit the
request to the Federation apiserver instead of sending it to a Kubernetes
cluster. -->

`--context=federation-cluster` 参数告诉 kubectl 发送请求至联邦 apiserver 而不是 Kubernetes 集群。

<!-- Once a Federated ConfigMap is created, the federation control plane will create
a matching ConfigMap in all underlying Kubernetes clusters.
You can verify this by checking each of the underlying clusters, for example: -->

一旦联邦 ConfigMap 创建成功，联邦控制平面会在所有底层 Kubernetes 集群中创建匹配的 ConfigMap。你可以通过检查每个底层的集群来验证这点，例如：

``` shell
kubectl --context=gce-asia-east1a get configmap myconfigmap
```

<!-- The above assumes that you have a context named 'gce-asia-east1a'
configured in your client for your cluster in that zone. -->

以上是假设你在客户端中为该区域中的集群配置了一个名为 'gce-asia-east1a' 的上下文。

<!-- These ConfigMaps in underlying clusters will match the Federated ConfigMap. -->
这些在底层集群中的 ConfigMaps 会自动匹配联邦 ConfigMap。


<!-- ## Updating a Federated ConfigMap -->

## 更新一个联邦 ConfigMap

<!-- You can update a Federated ConfigMap as you would update a Kubernetes
ConfigMap; however, for a Federated ConfigMap, you must send the request to
the federation apiserver instead of sending it to a specific Kubernetes cluster.
The federation control plane ensures that whenever the Federated ConfigMap is
updated, it updates the corresponding ConfigMaps in all underlying clusters to
match it. -->

你可以像更新 Kubernetes ConfigMap 一样更新一个联邦 ConfigMap。然而，对于联邦 ConfigMap，你必须发送请求至联邦 apiserver 而不是指定的 Kubernetes 集群。
联邦控制平面会确保无论何时联邦 ConfigMap 被更新，它都会更新所有底层集群中想相匹配的 ConfigMaps。

<!-- ## Deleting a Federated ConfigMap -->

## 删除一个联邦 ConfigMap

<!-- You can delete a Federated ConfigMap as you would delete a Kubernetes
ConfigMap; however, for a Federated ConfigMap, you must send the request to
the federation apiserver instead of sending it to a specific Kubernetes cluster. -->

你可以像删除一个 Kubernetes ConfigMap 一样删除一个联邦 ConfigMap。然而，对于联邦 ConfigMap，你必须发送请求至联邦 apiserver 而不是指定的 Kubernetes 集群。

<!-- For example, you can do that using kubectl by running: -->

例如，你可以使用 kubectl 执行：

```shell
kubectl --context=federation-cluster delete configmap
```

{{< note >}}
<!-- Deleting a Federated ConfigMap does not delete the corresponding ConfigMaps from underlying clusters. You must delete the underlying ConfigMaps manually. -->

删除一个联邦 ConfigMap 不会从底层集群中删除相应的 ConfigMaps。你必须手动地删除底层 ConfigMaps。
{{< /note >}}

{{% /capture %}}


