---
title: 联邦命名空间  
redirect_from:
- "/docs/user-guide/federation/namespaces/"
- "/docs/user-guide/federation/namespaces.html"
---
<!--
---
title: Federated Namespaces
redirect_from:
- "/docs/user-guide/federation/namespaces/"
- "/docs/user-guide/federation/namespaces.html"
---
-->

{% capture overview %}
<!--
This guide explains how to use Namespaces in Federation control plane.

Namespaces in federation control plane (referred to as "federated Namespaces" in
this guide) are very similar to the traditional [Kubernetes
Namespaces](/docs/concepts/overview/working-with-objects/namespaces/) providing the same functionality.
Creating them in the federation control plane ensures that they are synchronized
across all the clusters in federation.
-->
本指南介绍了如何在联邦的控制面板上使用命名空间。

联邦控制面板中的命名空间（在本指南中简称为“联邦命名空间”）与传统的Kubernetes命名空间十分相似，提供了相同的功能。  
在联邦控制面板中创建他们可确保他们在联邦的所有集群中是同步的。

{% endcapture %}

{% capture prerequisites %}

* {% include federated-task-tutorial-prereqs.md %}
<!--
* You are also expected to have a basic
[working knowledge of Kubernetes](/docs/setup/pick-right-solution/) in
general and [Namespaces](/docs/concepts/overview/working-with-objects/namespaces/) in particular.
-->

* 你应该有一些基本的[Kubernetes的大致工作知识](/docs/setup/pick-right-solution/)尤其是[命名空间](/docs/concepts/overview/working-with-objects/namespaces/)。

{% endcapture %}

{% capture steps %}

<!--
## Creating a Federated Namespace

The API for Federated Namespaces is 100% compatible with the
API for traditional Kubernetes Namespaces. You can create a Namespace by sending
a request to the federation apiserver.

You can do that using kubectl by running:
-->

## 创建一个联邦命名空间

联邦命名空间的API与传统的Kubernetes命名空间百分百兼容。你可以通过发送一个请求到联邦apiserver来创建一个命名空间。

你可以使用kubectl运行如下的命令来实现它：
``` shell
kubectl --context=federation-cluster create -f myns.yaml
```

<!--
The '--context=federation-cluster' flag tells kubectl to submit the
request to the Federation apiserver instead of sending it to a Kubernetes
cluster.

Once a federated Namespace is created, the federation control plane will create
a matching Namespace in all underlying Kubernetes clusters.
You can verify this by checking each of the underlying clusters, for example:
-->
这个'--context=federation-cluster'标志告诉kubectl提交这个请求到联邦apiserver而不是发送到一个Kubernetes集群。

一旦一个联邦命名空间被创建了，联邦控制面板将在它下面的所有Kubernetes集群中创建一个匹配的命名空间。  
你可以通过检查它下面的每一个集群来验证它，例如：

``` shell
kubectl --context=gce-asia-east1a get namespaces myns
```

<!--
The above assumes that you have a context named 'gce-asia-east1a'
configured in your client for your cluster in that zone. The name and
spec of the underlying Namespace will match those of
the Federated Namespace that you created above.
-->
上面假设你已经在那个区域中为你的集群在你的客户端配置了一个名称为'gce-asia-east1a'的上下文。  
这个底层命名空间的名称和规范将和你上面创建的联邦命名空间的这些匹配。

<!--
## Updating a Federated Namespace

You can update a federated Namespace as you would update a Kubernetes
Namespace, just send the request to federation apiserver instead of sending it
to a specific Kubernetes cluster.
Federation control plan will ensure that whenever the federated Namespace is
updated, it updates the corresponding Namespaces in all underlying clusters to
match it.
-->
## 更新一个联邦命名空间

你可以更新一个联邦命名空间就像你更新一个Kubernetes命名空间一样，仅仅发送这个请求到联邦apiserver而不是发送它到一个特定的Kubernetes集群。  
联邦控制面板将会确保每当联邦命名空间更新后，更新所有底层集群中相应的命名空间来匹配它。

<!--
## Deleting a Federated Namespace

You can delete a federated Namespace as you would delete a Kubernetes
Namespace, just send the request to federation apiserver instead of sending it
to a specific Kubernetes cluster.

For example, you can do that using kubectl by running:
-->
## 删除一个联邦命名空间

你可以删除一个联邦命名空间就像你删除一个Kubernetes命名空间那样，仅仅发送这个请求到联邦apiserver而不是发送它到一个特定的Kubernetes集群。

例如，你可以使用kubectl运行下面的命令来实现：

```shell
kubectl --context=federation-cluster delete ns myns
```

<!--
As in Kubernetes, deleting a federated Namespace will delete all resources in that
Namespace from the federation control plane.

Note that at this point, deleting a federated Namespace will not delete the
corresponding Namespace and resources in those Namespaces from underlying clusters.
Users are expected to delete them manually.
We intend to fix this in the future.
-->
与Kubernetes一样，删除一个联邦命名空间将会删除来自联邦控制面板的命名空间的所有资源。

请注意，此时删除一个联邦命名空间将不会删除那些命名空间中来自底层集群的相应的命名空间和资源。
用户需要手动地删除它们。我们打算在将来解决这个问题。

{% endcapture %}

{% include templates/task.md %}
