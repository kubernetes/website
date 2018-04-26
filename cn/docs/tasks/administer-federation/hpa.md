---
title: 联邦横向 Pod 伸缩器（Horizontal Pod Autoscalers, HPA）
---
<!--
title: Pod  Horizontal Pod Autoscalers (HPA)
-->

{% capture overview %}

{% include feature-state-alpha.md %}

<!--
This guide explains how to use federated horizontal pod autoscalers (HPAs) in the federation control plane.
-->
本指南介绍了如何在联邦控制平面中使用联邦横向 pod 自动伸缩器（horizontal pod autoscalers, HPA）。

<!--
HPAs in the federation control plane are similar to the traditional [Kubernetes
HPAs](/docs/tasks/run-application/horizontal-pod-autoscale/), and provide the same functionality.
Creating an HPA targeting a federated object in the federation control plane ensures that the
desired number of replicas of the target object are scaled across the registered clusters,
instead of a single cluster. Also, the control plane keeps monitoring the status of each
individual HPA in the federated clusters and ensures the workload replicas move where they are
needed most by manipulating the min and max limits of the HPA objects in the federated clusters.
-->
联邦控制平面中的 HPA 与传统的 [Kubernetes HPA](/docs/tasks/run-application/horizontal-pod-autoscale/) 非常相似，提供相同的功能。
在联邦控制平面中针对联邦对象创建的 HPA 将保证目标对象的期望副本在所有注册集群上进行伸缩，而不是在单个集群上。此外，控制平面持续监控联邦集群中单个 HPA 的状态，通过操作联邦集群中 HPA 对象的最小和最大限制值来确保工作副本被移动到最需要的地方。
{% endcapture %}

{% capture prerequisites %}

<!--
* {% include federated-task-tutorial-prereqs.md %}
* You are also expected to have a basic
  [working knowledge of Kubernetes](/docs/setup/) in
  general and [HPAs](/docs/tasks/run-application/horizontal-pod-autoscale/) in particular.
-->
* {% include federated-task-tutorial-prereqs.md %}
* 通常您还应当拥有基本的 [Kubernetes 应用知识](/docs/setup/)，特别是  [HPA](/docs/tasks/run-application/horizontal-pod-autoscale/) 。

<!--
The federated HPA is an alpha feature. The API is not enabled by default on the
federated API server. To use this feature, the user or the admin deploying the federation control
plane needs to run the federated API server with option `--runtime-config=api/all=true` to
enable all APIs, including alpha APIs. Additionally, the federated HPA only works
when used with CPU utilization metrics.
-->
联邦 HPA 是一个 alpha 特性。默认情况下该 API 没有在联邦 API server 上启用。要使用此特性，部署联邦控制平面的用户或管理员需要使用 `--runtime-config=api/all=true` 选项运行联邦 API server 以启用所有 API（包括 alpha API）。此外，联邦 HPA 只能和 CPU 使用率度量（utilization metrics）一起使用。
{% endcapture %}

{% capture steps %}

<!--
## Creating a federated HPA
-->
## 创建联邦 HPA

<!--
The API for federated HPAs is 100% compatible with the
API for traditional Kubernetes HPA. You can create an HPA by sending
a request to the federation API server.
-->
联邦 HPA 的 API 100% 兼容传统 Kubernetes HPA 的 API。您可以通过向联邦 API server 发送请求来创建 HPA。 

<!--
You can do that with [kubectl](/docs/user-guide/kubectl/) by running:
-->
您可以使用 [kubectl](/docs/user-guide/kubectl/) 运行命令：

```shell
cat <<EOF | kubectl --context=federation-cluster create -f -
apiVersion: autoscaling/v1
kind: HorizontalPodAutoscaler
metadata:
  name: php-apache
  namespace: default
spec:
  scaleTargetRef:
    apiVersion: apps/v1beta1
    kind: Deployment
    name: php-apache
  minReplicas: 1
  maxReplicas: 10
  targetCPUUtilizationPercentage: 50
EOF
```

<!--
The `--context=federation-cluster` flag tells `kubectl` to submit the
request to the federation API server instead of sending it to a Kubernetes
cluster.
-->
`--context=federation-cluster` 参数告诉 `kubectl` 将请求提交到联邦 API server 而不是发送给某一个 Kubernetes 集群。

<!--
Once a federated HPA is created, the federation control plane partitions and
creates the HPA in all underlying Kubernetes clusters. As of Kubernetes V1.7,
[cluster selectors](/docs/tasks/administer-federation/cluster/#clusterselector-annotation)
can also be used to restrict any federated object, including the HPAs in a subset
of clusters.
-->
一旦创建了联邦 HPA，联邦控制平面就会对其进行分区，并在所有基础集群中创建 HPA。从 Kubernetes v1.7 开始，[cluster selectors](/docs/tasks/administer-federation/cluster/#clusterselector-annotation) 同样可以用来限制任何联邦对象，包括集群子集中的 HPA。

<!--
You can verify the creation by checking each of the underlying clusters. For example, with a context named `gce-asia-east1a`
configured in your client for your cluster in that zone:
-->
您可以通过检查每个基础集群来验证创建是否成功。例如，您的客户端配置了名为 'gce-asia-east1a' 的上下文，集群处于该区域中：

```shell
kubectl --context=gce-asia-east1a get HPA php-apache
```

<!--
The HPA in the underlying clusters will match the federation HPA
except in the number of min and max replicas. The federation control plane ensures that the sum of max replicas in each cluster matches the specified
max replicas on the federated HPA object, and the sum of minimum replicas will be greater
than or equal to the minimum specified on the federated HPA object. 
-->
除了最小和最大副本的数量之外，基础集群中的 HPA 将与联邦 HPA 相匹配。联邦控制平面将保证每个集群的最大副本数总和等于联邦 HPA 对象的最大副本数，并且最小副本总和大于等于联邦 HPA 对象的最小副本数。

<!--
**Note:** A particular cluster cannot have a minimum replica sum of 0.
-->
**注意：**集群的最小副本总和不能为 0。
{: .note}

<!--
### Spreading HPA min and max replicas in underlying clusters
-->
### 在基础集群中分发 HPA 的最小和最大副本数

<!--
By default, first max replicas are spread equally in all the underlying clusters, then min replicas are distributed to those clusters that received their maximum value. This means
that each cluster will get an HPA if the specified max replicas are greater than
the total clusters participating in this federation, and some clusters will be
skipped if specified max replicas are less than the total clusters participating
in the federation.
-->
默认情况下，首先将最大副本数在所有基础集群中平均分布，然后再将最小副本数分发给已接收了最大副本数的集群。这意味着，如果指定的最大副本数大于联邦的集群数，则每个集群都将获得一个 HPA。反之，如果指定的最大副本数小于联邦的集群数，则会跳过某些集群。

<!--
For example: if you have 3 registered clusters and you create a federated HPA with
`spec.maxReplicas = 9`, and `spec.minReplicas = 2`, then each HPA in the 3 clusters
will get `spec.maxReplicas=3` and `spec.minReplicas = 1`.
-->
举例说明：如果您有3个注册集群，并且您使用参数 `spec.maxReplicas = 9` 和  `spec.minReplicas = 2` 创建了一个联邦 HPA，那么3个集群中的每个 HPA 都将获得 
`spec.maxReplicas=3` 和 `spec.minReplicas = 1` 的参数。
<!--
Currently the default distribution is only available on the federated HPA, but in the
future, users preferences could also be specified to control and/or restrict this
distribution.
-->
目前，联邦 HPA 仅可以使用默认的分发机制，但在将来，用户将可以设置偏好来控制和/或限制分发过程。

<!--
## Updating a federated ReplicaSet
-->
## 更新联邦 ReplicaSet

<!--
You can update a federated HPA as you would update a Kubernetes
HPA; however, for a federated HPA, you must send the request to
the federation API server instead of sending it to a specific Kubernetes cluster.
The Federation control plane ensures that whenever the federated HPA is
updated, it updates the corresponding HPA in all underlying clusters to
match it.
-->
您可以像更新 Kubernetes HPA 一样更新联邦 HPA；但是，对于联邦 HPA 您必须将请求发送给联邦 API server 而不是发送到一个特定的 Kubernetes 集群。联邦控制平面将保证在联邦 HPA 被更新后，它会对所有基础集群中与之对应的 HPA 进行更新。

<!--
If your update includes a change in the number of replicas, the federation
control plane will change the number of replicas in underlying clusters to
ensure that the sum of the max and min replicas remains matched as specified
in the previous section.
-->
如果您的更新修改了副本数量，联邦控制平面将修改基础集群中的副本数量，保证最小副本总数和最大副本总数仍然符合要求（如前文所述）。

<!--
## Deleting a federated HPA
-->
## 删除联邦 HPA

<!--
You can delete a federated HPA as you would delete a Kubernetes
HPA; however, for a federated HPA, you must send the request to
the federation API server instead of sending it to a specific Kubernetes cluster.
It should also be noted that for the federated resource to be deleted from
all underlying clusters, [cascading deletion](/docs/concepts/cluster-administration/federation/#cascading-deletion)
should be used.
-->
您可以像删除 Kubernetes HPA 一样删除联邦 HPA；但是，对于联邦 HPA， 您必须将请求发送给联邦 API server 而不是发送到一个特定的 Kubernetes 集群。还需要注意的是，如果要删除所有基础集群中的联邦资源，应该使用 [级联删除](/docs/concepts/cluster-administration/federation/#cascading-deletion)。

<!--
For example, you can do that using `kubectl` by running:
-->
例如，您可以使用 `kubectl` 运行命令：

```shell
kubectl --context=federation-cluster delete HPA php-apache
```

<!--
## Alternative ways to use federated HPA
-->
## 使用联邦 HPA 的其他方法

<!--
To a federation user interacting with federated control plane (or simply federation),
the interaction is almost identical to interacting with a normal Kubernetes cluster (but
with a limited set of APIs that are federated). As both Deployments and
HorizontalPodAutoscalers are now federated, `kubectl` commands like `kubectl run`
and `kubectl autoscale` work on federation. Given this fact, the mechanism specified in
[horizontal pod autoscaler walkthrough](/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/)
will also work when used with federation.
Care however will need to be taken that when
[generating load on a target deployment](/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/#step-three-increase-load),
it should be done against a specific federated cluster (or multiple clusters) not the federation.
-->
对于和联邦控制平面（或简称联邦）交互的用户，这种交互几乎和与一个普通 Kubernetes 集群的交互完全相同（但只能使用有限的联邦 API 集合）。由于目前 Deployment 和 HorizontalPodAutoscaler 都有联邦版本，类似 `kubectl run` 和 `kubectl autoscale` 的 `kubectl` 命令都可以在联邦上运行。鉴于这个事实，[horizontal pod autoscaler walkthrough](/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/) 中指定的机制同样可以在联邦中运行。但也需要注意，当 [在目标 deployment 上生成负载](/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/#step-three-increase-load) 时，应该针对一个特定的联邦集群（或多个集群）而不是整个联邦。

<!--
## Conclusion
-->
## 结论

<!--
The use of federated HPA is to ensure workload replicas move to the cluster(s) where
they are needed most, or in other words where the load is beyond expected threshold.
The federated HPA feature achieves this by manipulating the min and max replicas on the
HPAs it creates in the federated clusters. It does not directly monitor the target
object metrics from the federated clusters. It actually relies on the in-cluster HPA
controllers to monitor the metrics and update relevant fields. The in-cluster HPA
controller monitors the target pod metrics and updates the fields like desired
replicas (after metrics based calculations) and current replicas (observing the
current status of in cluster pods). The federated HPA controller, on the other hand,
monitors only the cluster-specific HPA object fields and updates the min replica and
max replica fields of those in cluster HPA objects, which have replicas matching thresholds.
-->
使用联邦 HPA 是为了保证工作副本移动到最需要它们的地方，换句话说，是移动到负载超过期望阈值的地方。联邦 HPA 功能通过操作其在联邦集群中创建的 HPA 的最小和最大副本数来实现此目的。它并不直接监控联邦集群中目标对象的度量值，实际上依赖于集群内部的 HPA 控制器来监控目标 pod 的度量值并更新相关字段。集群内部的 HPA 控制器监控目标 pod 的度量值并更新相关字段，如期望的副本数（在基于度量的计算之后）和当前副本数（通过观察集群中 pod 的当前状态）。另一方面，联邦 HPA 控制器只监控集群特定的 HPA 对象字段并更新集群中 HPA 对象的最小和最大副本数字段，这些对象的副本数和阈值匹配。 

<!--
For example, if a cluster has both desired replicas and current replicas the same as the max replicas,
and averaged current CPU utilization still higher than the target CPU utilization (all of which
are fields on local HPA object), then the target app in this cluster
needs more replicas, and the scaling is currently restricted by max replicas set on this local
HPA object. In such a scenario, the federated HPA controller scans all clusters and tries to
find clusters which do not have such a condition (meaning the desired replicas are less
than the max, and current averaged CPU utilization is lower then the threshold). If it finds such
a cluster, it reduces the max replica on the HPA in this cluster and increases the max replicas
on the HPA in the cluster which needed the replicas.
-->
例如，如果一个集群同时拥有期望副本数和当前副本数，其值与最大副本数相同，但当前 CPU 的平均利用率仍然高于目标使用率（它们都是本地 HPA 对象上的字段）时，集群中的目标应用程序就需要更多的副本，但是扩容动作被本地 HPA 对象上设置的最大副本数限制。在这种场景下，联邦 HPA 控制器将会扫描所有集群并尝试查找没有这种条件的集群——期望副本数小于最大值且当前 CPU 平均使用率低于阈值。如果找到了这样的集群，它会减少该集群中 HPA 的最大副本数，并增加最需要副本的集群上的 HPA 的最大副本数。

<!--
There are many other similar conditions which the federated HPA controller checks and moves the max
replicas and min replicas around the local HPAs in federated clusters to eventually ensure that
the replicas move (or remain) in the cluster(s) which need them.
-->
还存在许多类似的情况导致联邦 HPA 控制器检查并移动联邦集群中本地 HPA 的最大和最小副本数，以确保副本最终移动（或保留）到最需要它们的集群中。

<!--
For more information, see ["federated HPA design proposal"](https://github.com/kubernetes/community/pull/593).
-->
更多相关信息请参考 [“联邦 HPA 设计提议”](https://github.com/kubernetes/community/pull/593)。

{% endcapture %}

{% include templates/task.md %}
