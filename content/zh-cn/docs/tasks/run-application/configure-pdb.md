---
title: 为应用程序设置干扰预算（Disruption Budget）
content_type: task
weight: 110
min-kubernetes-server-version: v1.21
---

<!--
title: Specifying a Disruption Budget for your Application
content_type: task
weight: 110
-->

<!-- overview -->

{{< feature-state for_k8s_version="v1.21" state="stable" >}}

<!--
This page shows how to limit the number of concurrent disruptions
that your application experiences, allowing for higher availability
while permitting the cluster administrator to manage the clusters
nodes.
-->
本文展示如何限制应用程序的并发干扰数量，在允许集群管理员管理集群节点的同时保证高可用。

## {{% heading "prerequisites" %}}

{{< version-check >}}

<!--
* You are the owner of an application running on a Kubernetes cluster that requires
  high availability.
* You should know how to deploy [Replicated Stateless Applications](/docs/tasks/run-application/run-stateless-application-deployment/)
  and/or [Replicated Stateful Applications](/docs/tasks/run-application/run-replicated-stateful-application/).
* You should have read about [Pod Disruptions](/docs/concepts/workloads/pods/disruptions/).
* You should confirm with your cluster owner or service provider that they respect
  Pod Disruption Budgets.
-->
* 你是 Kubernetes 集群中某应用的所有者，该应用有高可用要求。
* 你应了解如何部署[无状态应用](/zh-cn/docs/tasks/run-application/run-stateless-application-deployment/)
  和/或[有状态应用](/zh-cn/docs/tasks/run-application/run-replicated-stateful-application/)。
* 你应当已经阅读过关于 [Pod 干扰](/zh-cn/docs/concepts/workloads/pods/disruptions/) 的文档。
* 用户应当与集群所有者或服务提供者确认其遵从 Pod 干扰预算（Pod Disruption Budgets）的规则。

<!-- steps -->

<!--
## Protecting an Application with a PodDisruptionBudget

1. Identify what application you want to protect with a PodDisruptionBudget (PDB).
1. Think about how your application reacts to disruptions.
1. Create a PDB definition as a YAML file.
1. Create the PDB object from the YAML file.
-->
## 用 PodDisruptionBudget 来保护应用

1. 确定想要使用 PodDisruptionBudget (PDB) 来保护的应用。
1. 考虑应用对干扰的反应。
1. 以 YAML 文件形式定义 PDB 。
1. 通过 YAML 文件创建 PDB 对象。

<!-- discussion -->

<!--
## Identify an Application to Protect

The most common use case when you want to protect an application
specified by one of the built-in Kubernetes controllers:
-->
## 确定要保护的应用

用户想要保护通过内置的 Kubernetes 控制器指定的应用，这是最常见的使用场景：

- Deployment
- ReplicationController
- ReplicaSet
- StatefulSet

<!--
In this case, make a note of the controller's `.spec.selector`; the same
selector goes into the PDBs `.spec.selector`.
-->
在这种情况下，在控制器的 `.spec.selector` 字段中做记录，并在 PDB 的
`.spec.selector` 字段中加入同样的选择算符。

<!--
From version 1.15 PDBs support custom controllers where the [scale subresource](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#scale-subresource) is enabled.
-->
从 1.15 版本开始，PDB 支持启用
[Scale 子资源](/zh-cn/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#scale-subresource)
的自定义控制器。

<!--
You can also use PDBs with pods which are not controlled by one of the above
controllers, or arbitrary groups of pods, but there are some restrictions,
described in [Arbitrary Controllers and Selectors](#arbitrary-controllers-and-selectors).
-->
用户也可以用 PDB 来保护不受上述控制器控制的 Pod，或任意的 Pod 集合，但是正如
[任意控制器和选择算符](#arbitrary-controllers-and-selectors)中描述的，这里存在一些限制。

<!--
## Think about how your application reacts to disruptions

Decide how many instances can be down at the same time for a short period
due to a voluntary disruption.
-->
## 考虑应用对干扰的反应

确定在自发干扰时，多少实例可以在短时间内同时关闭。

<!--
- Stateless frontends:
  - Concern: don't reduce serving capacity by more than 10%.
    - Solution: use PDB with minAvailable 90% for example.
- Single-instance Stateful Application:
  - Concern: do not terminate this application without talking to me.
    - Possible Solution 1: Do not use a PDB and tolerate occasional downtime.
    - Possible Solution 2: Set PDB with maxUnavailable=0.  Have an understanding
      (outside of Kubernetes) that the cluster operator needs to consult you before
      termination.  When the cluster operator contacts you, prepare for downtime,
      and then delete the PDB to indicate readiness for disruption.  Recreate afterwards.
- Multiple-instance Stateful application such as Consul, ZooKeeper, or etcd:
  - Concern: Do not reduce number of instances below quorum, otherwise writes fail.
    - Possible Solution 1: set maxUnavailable to 1 (works with varying scale of application).
    - Possible Solution 2: set minAvailable to quorum-size (e.g. 3 when scale is 5).  (Allows more disruptions at once).
- Restartable Batch Job:
  - Concern: Job needs to complete in case of voluntary disruption.
    - Possible solution: Do not create a PDB.  The Job controller will create a replacement pod.
-->
- 无状态的前端：
  - 关注：不能降低服务能力 10% 以上。
    - 解决方案：例如，使用 PDB，指定其 minAvailable 值为 90%。
- 单实例有状态应用：
  - 关注：不要在不通知的情况下终止该应用。
    - 可能的解决方案 1：不使用 PDB，并忍受偶尔的停机。
    - 可能的解决方案 2：设置 maxUnavailable=0 的 PDB。
      意为（Kubernetes 范畴之外的）集群操作人员需要在终止应用前与用户协商，
      协商后准备停机，然后删除 PDB 表示准备接受干扰，后续再重新创建。
- 多实例有状态应用，如 Consul、ZooKeeper 或 etcd：
  - 关注：不要将实例数量减少至低于仲裁规模，否则将出现写入失败。
    - 可能的解决方案 1：设置 maxUnavailable 值为 1 (适用于不同规模的应用)。
    - 可能的解决方案 2：设置 minAvailable 值为仲裁规模（例如规模为 5 时设置为 3）。
      (允许同时出现更多的干扰)。
- 可重新启动的批处理任务：
  - 关注：自发干扰的情况下，需要确保任务完成。
    - 可能的解决方案：不创建 PDB。 任务控制器会创建一个替换 Pod。

<!--
### Rounding logic when specifying percentages

Values for `minAvailable` or `maxUnavailable` can be expressed as integers or as a percentage.
-->
### 指定百分比时的舍入逻辑

`minAvailable` 或 `maxUnavailable` 的值可以表示为整数或百分比。

<!--
- When you specify an integer, it represents a number of Pods. For instance, if you set `minAvailable` to 10, then 10
  Pods must always be available, even during a disruption.
- When you specify a percentage by setting the value to a string representation of a percentage (eg. `"50%"`), it represents a percentage of
  total Pods. For instance, if you set `maxUnavailable` to `"50%"`, then only 50% of the Pods can be unavailable during a
  disruption.
-->
- 指定整数值时，它表示 Pod 个数。例如，如果将 minAvailable 设置为 10，
  那么即使在干扰期间，也必须始终有 10 个Pod可用。
- 通过将值设置为百分比的字符串表示形式（例如 “50％”）来指定百分比时，它表示占总 Pod 数的百分比。
  例如，如果将 "maxUnavailable" 设置为 “50％”，则干扰期间只允许 50％ 的 Pod 不可用。

<!--
When you specify the value as a percentage, it may not map to an exact number of Pods. For example, if you have 7 Pods and
you set `minAvailable` to `"50%"`, it's not immediately obvious whether that means 3 Pods or 4 Pods must be available.
Kubernetes rounds up to the nearest integer, so in this case, 4 Pods must be available. You can examine the
[code](https://github.com/kubernetes/kubernetes/blob/23be9587a0f8677eb8091464098881df939c44a9/pkg/controller/disruption/disruption.go#L539)
that controls this behavior.
-->
如果将值指定为百分比，则可能无法映射到确切数量的 Pod。例如，如果你有 7 个 Pod，
并且你将 `minAvailable` 设置为 `"50％"`，具体是 3 个 Pod 或 4 个 Pod 必须可用
并非显而易见。
Kubernetes 采用向上取整到最接近的整数的办法，因此在这种情况下，必须有 4 个 Pod。
你可以检查控制此行为的
[代码](https://github.com/kubernetes/kubernetes/blob/23be9587a0f8677eb8091464098881df939c44a9/pkg/controller/disruption/disruption.go#L539)。

<!--
## Specifying a PodDisruptionBudget

A `PodDisruptionBudget` has three fields: 
-->
## 指定 PodDisruptionBudget

一个 `PodDisruptionBudget` 有 3 个字段：

<!--
* A label selector `.spec.selector` to specify the set of
pods to which it applies. This field is required.
* `.spec.minAvailable` which is a description of the number of pods from that
set that must still be available after the eviction, even in the absence
of the evicted pod. `minAvailable` can be either an absolute number or a percentage.
* `.spec.maxUnavailable` (available in Kubernetes 1.7 and higher) which is a description
of the number of pods from that set that can be unavailable after the eviction.
It can be either an absolute number or a percentage.
-->
* 标签选择算符 `.spec.selector` 用于指定其所作用的 Pod 集合，该字段为必需字段。
* `.spec.minAvailable` 表示驱逐后仍须保证可用的 Pod 数量。即使因此影响到 Pod 驱逐
  （即该条件在和 Pod 驱逐发生冲突时优先保证）。
  `minAvailable` 值可以是绝对值，也可以是百分比。
* `.spec.maxUnavailable` （Kubernetes 1.7 及更高的版本中可用）表示驱逐后允许不可用的
  Pod 的最大数量。其值可以是绝对值或是百分比。

{{< note >}}
<!--
The behavior for an empty selector differs between the policy/v1beta1 and policy/v1 APIs for
PodDisruptionBudgets. For policy/v1beta1 an empty selector matches zero pods, while
for policy/v1 an empty selector matches every pod in the namespace.
-->
`policy/v1beta1` 和 `policy/v1` API 中 PodDisruptionBudget 的空选择算符的行为
略有不同。在 `policy/v1beta1` 中，空的选择算符不会匹配任何 Pods，而
`policy/v1` 中，空的选择算符会匹配名字空间中所有 Pods。
{{< /note >}}

<!--
You can specify only one of `maxUnavailable` and `minAvailable` in a single `PodDisruptionBudget`.
`maxUnavailable` can only be used to control the eviction of pods
that have an associated controller managing them. In the examples below, "desired replicas"
is the `scale` of the controller managing the pods being selected by the
`PodDisruptionBudget`.
-->
用户在同一个 `PodDisruptionBudget` 中只能够指定 `maxUnavailable` 和 `minAvailable` 中的一个。
`maxUnavailable` 只能够用于控制存在相应控制器的 Pod 的驱逐（即不受控制器控制的 Pod 不在
`maxUnavailable` 控制范围内）。在下面的示例中，
“所需副本” 指的是相应控制器的 `scale`，控制器对 `PodDisruptionBudget` 所选择的 Pod 进行管理。

<!--
Example 1: With a `minAvailable` of 5, evictions are allowed as long as they leave behind
5 or more healthy pods among those selected by the PodDisruptionBudget's `selector`.
-->
示例 1：设置 `minAvailable` 值为 5 的情况下，驱逐时需保证 PodDisruptionBudget 的 `selector`
选中的 Pod 中 5 个或 5 个以上处于健康状态。

<!--
Example 2: With a `minAvailable` of 30%, evictions are allowed as long as at least 30%
of the number of desired replicas are healthy. 
-->
示例 2：设置 `minAvailable` 值为 30% 的情况下，驱逐时需保证 Pod 所需副本的至少 30% 处于健康状态。

<!--
Example 3: With a `maxUnavailable` of 5, evictions are allowed as long as there are at most 5
unhealthy replicas among the total number of desired replicas.
-->
示例 3：设置 `maxUnavailable` 值为 5 的情况下，驱逐时需保证所需副本中最多 5 个处于不可用状态。

<!--
Example 4: With a `maxUnavailable` of 30%, evictions are allowed as long as no more than 30%
of the desired replicas are unhealthy.
-->
示例 4：设置 `maxUnavailable` 值为 30% 的情况下，驱逐时需保证所需副本中最多 30% 处于不可用状态。

<!--
In typical usage, a single budget would be used for a collection of pods managed by
a controller—for example, the pods in a single ReplicaSet or StatefulSet. 
-->
在典型用法中，干扰预算会被用于一个控制器管理的一组 Pod 中 —— 例如：一个 ReplicaSet 或 StatefulSet
中的 Pod。

<!--
A disruption budget does not truly guarantee that the specified
number/percentage of pods will always be up.  For example, a node that hosts a
pod from the collection may fail when the collection is at the minimum size
specified in the budget, thus bringing the number of available pods from the
collection below the specified size. The budget can only protect against
voluntary evictions, not all causes of unavailability.
-->
{{< note >}}
干扰预算并不能真正保证指定数量/百分比的 Pod 一直处于运行状态。例如： 当 Pod 集合的
规模处于预算指定的最小值时，承载集合中某个 Pod 的节点发生了故障，这样就导致集合中可用 Pod 的
数量低于预算指定值。预算只能够针对自发的驱逐提供保护，而不能针对所有 Pod 不可用的诱因。
{{< /note >}}

<!--
If you set `maxUnavailable` to 0% or 0, or you set `minAvailable` to 100% or the number of replicas,
you are requiring zero voluntary evictions. When you set zero voluntary evictions for a workload
object such as ReplicaSet, then you cannot successfully drain a Node running one of those Pods.
If you try to drain a Node where an unevictable Pod is running, the drain never completes. This is permitted as per the
semantics of `PodDisruptionBudget`.
-->
如果你将 `maxUnavailable` 的值设置为 0%（或 0）或设置 `minAvailable` 值为 100%（或等于副本数）
则会阻止所有的自愿驱逐。
当你为 ReplicaSet 等工作负载对象设置阻止自愿驱逐时，你将无法成功地腾空运行其中一个 Pod 的节点。
如果你尝试腾空正在运行着被阻止驱逐的 Pod 的节点，则腾空永远不会完成。
按照 `PodDisruptionBudget` 的语义，这是允许的。

<!--
You can find examples of pod disruption budgets defined below. They match pods with the label
`app: zookeeper`.
-->
用户可以在下面看到 pod 干扰预算定义的示例，它们与带有 `app: zookeeper` 标签的 pod 相匹配：

<!--
Example PDB Using minAvailable:
-->
使用 minAvailable 的PDB 示例：

{{< codenew file="policy/zookeeper-pod-disruption-budget-minavailable.yaml" >}}

<!--
Example PDB Using maxUnavailable:
-->
使用 maxUnavailable 的 PDB 示例：

{{< codenew file="policy/zookeeper-pod-disruption-budget-maxunavailable.yaml" >}}

<!--
For example, if the above `zk-pdb` object selects the pods of a StatefulSet of size 3, both
specifications have the exact same meaning. The use of `maxUnavailable` is recommended as it
automatically responds to changes in the number of replicas of the corresponding controller.
-->
例如，如果上述 `zk-pdb` 选择的是一个规格为 3 的 StatefulSet 对应的 Pod，
那么上面两种规范的含义完全相同。
推荐使用 `maxUnavailable` ，因为它自动响应控制器副本数量的变化。

<!--
## Create the PDB object

You can create or update the PDB object using kubectl.
```shell
kubectl apply -f mypdb.yaml
```
-->
## 创建 PDB 对象

你可以使用 kubectl 创建或更新 PDB 对象。
```shell
kubectl apply -f mypdb.yaml
```

<!--
You cannot update PDB objects.  They must be deleted and re-created.
-->
PDB 对象无法更新，必须删除后重新创建。

<!--
## Check the status of the PDB

Use kubectl to check that your PDB is created.
-->
## 检查 PDB 的状态

使用 kubectl 来确认 PDB 被创建。

<!--
Assuming you don't actually have pods matching `app: zookeeper` in your namespace,
then you'll see something like this:
-->
假设用户的名字空间下没有匹配 `app: zookeeper` 的 Pod，用户会看到类似下面的信息：

```shell
kubectl get poddisruptionbudgets
```
```
NAME     MIN AVAILABLE   MAX UNAVAILABLE   ALLOWED DISRUPTIONS   AGE
zk-pdb   2               N/A               0                     7s
```

<!--
If there are matching pods (say, 3), then you would see something like this:
-->
假设有匹配的 Pod (比如说 3 个), 那么用户会看到类似下面的信息：

```shell
kubectl get poddisruptionbudgets
```
```
NAME     MIN AVAILABLE   MAX UNAVAILABLE   ALLOWED DISRUPTIONS   AGE
zk-pdb   2               N/A               1                     7s

```

<!--
The non-zero value for `ALLOWED DISRUPTIONS` means that the disruption controller has seen the pods,
counted the matching pods, and updated the status of the PDB.

You can get more information about the status of a PDB with this command:
-->
`ALLOWED DISRUPTIONS` 值非 0 意味着干扰控制器已经感知到相应的 Pod，对匹配的 Pod 进行统计，
并更新了 PDB 的状态。

用户可以通过以下命令获取更多 PDB 状态相关信息：

```shell
kubectl get poddisruptionbudgets zk-pdb -o yaml
```

```yaml
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  annotations:
…
  creationTimestamp: "2020-03-04T04:22:56Z"
  generation: 1
  name: zk-pdb
…
status:
  currentHealthy: 3
  desiredHealthy: 2
  disruptionsAllowed: 1
  expectedPods: 3
  observedGeneration: 1
```

<!--
## Arbitrary Controllers and Selectors

You can skip this section if you only use PDBs with the built-in
application controllers (Deployment, ReplicationController, ReplicaSet, and StatefulSet),
with the PDB selector matching the controller's selector.
-->
## 任意控制器和选择算符   {#arbitrary-controllers-and-selectors}

如果你只使用与内置的应用控制器（Deployment、ReplicationController、ReplicaSet 和 StatefulSet）
对应的 PDB，也就是 PDB 的选择算符与 控制器的选择算符相匹配，那么可以跳过这一节。

<!--
You can use a PDB with pods controlled by another type of controller, by an
"operator", or bare pods, but with these restrictions:
-->
你可以使用这样的 PDB：它对应的 Pod 可能由其他类型的控制器控制，可能由 "operator" 控制，
也可能为“裸的（不受控制器控制）” Pod，但该类 PDB 存在以下限制：

<!--
- only `.spec.minAvailable` can be used, not `.spec.maxUnavailable`.
- only an integer value can be used with `.spec.minAvailable`, not a percentage.
-->
- 只能够使用 `.spec.minAvailable` ，而不能够使用 `.spec.maxUnavailable。`
- 只能够使用整数作为 `.spec.minAvailable` 的值，而不能使用百分比。

<!--
You can use a selector which selects a subset or superset of the pods belonging to a built-in
controller.  The eviction API will disallow eviction of any pod covered by multiple PDBs,
so most users will want to avoid overlapping selectors.  One reasonable use of overlapping
PDBs is when pods are being transitioned from one PDB to another.
-->
你可以令选择算符选择一个内置控制器所控制 Pod 的子集或父集。
驱逐 API 将不允许驱逐被多个 PDB 覆盖的任何 Pod，因此大多数用户都希望避免重叠的选择算符。重叠 PDB 的一种合理用途是当 Pod 从一个 PDB 过渡到另一个 PDB 时再使用。

