---
cn-approvers:
- lichuqiang
title: 指定应用程序的中断预算（Disruption Budget）
---

{% capture overview %}

本文展示了如何限制应用程序的并发中断数量，在允许集群管理员管理集群节点的同时保证高可用。

{% endcapture %}

{% capture prerequisites %}
* 用户是 Kubernetes 集群中有高可用需求的应用的所有者。
* 用户应了解如何部署 [无状态应用](/docs/tasks/run-application/run-stateless-application-deployment/)
  和/或 [有状态应用](/docs/tasks/run-application/run-replicated-stateful-application/)。
* 用户应当已经阅读过关于 [Pod 中断](/docs/concepts/workloads/pods/disruptions/) 的文档。
* 用户应当与集群所有者或服务提供者确认其遵从 Pod 中断预算（Pod Disruption Budgets）的规则。
{% endcapture %}

{% capture steps %}

## 用 PodDisruptionBudget 来保护应用

1. 确定想要使用 PodDisruptionBudget (PDB) 来保护的应用。
1. 考虑应用对中断的反应。
1. 以 YAML 文件形式定义 PDB 。
1. 通过 YAML 文件创建 PDB 对象。

{% endcapture %}

{% capture discussion %}

## 确定要保护的应用

用户想要保护通过内置的 Kubernetes 控制器指定的应用，这是最常见的使用场景：

- Deployment
- ReplicationController
- ReplicaSet
- StatefulSet

在这种情况下，记录控制器的 `.spec.selector` 字段设置，并在 PDB 的 `.spec.selector`
字段中设置同样的选择器。

用户也可以用 PDB 来保护不受上述控制器控制的 pod，或任意一组（arbitrary groups）pod，
但是这种做法存在一些限制，具体见 [任意控制器和选择器](#任意控制器和选择器) 一节的描述。


## 考虑应用对中断的反应

确定在自发中断时，多少实例可以在短时间内同时关闭。

- 无状态的前端：
  - 关注：不能降低服务能力 10% 以上。
    - 解决方案：例如，使用 PDB，指定其 minAvailable 值为 90%。
- 单实例有状态应用：
  - 关注：不要在不通知的情况下终止该应用。
    - 可能的解决方案 1：不使用 PDB，并忍受偶尔的停机。
    - 可能的解决方案 2：设置 maxUnavailable=0 的 PDB。意为（Kubernetes 范畴之外的）
      集群操作人员需要在终止应用前与用户协商，协商后准备停机，然后删除 PDB 表示准备中断，后续再重新创建。
- 多实例有状态应用， 如 Consul、ZooKeeper 或 etcd：
  - 关注：不要将实例数量减少至低于仲裁规模（below quorum），否则记录故障。
    - 可能的解决方案 1：设置 maxUnavailable 值为 1 (适用于不同规模的应用)。
    - 可能的解决方案 2：设置 minAvailable 值为仲裁规模（例如规模为 5 时设置为 3）。  (允许每次更多的中断)。
- 可重新启动的批处理任务：
  - 关注： 自发中断的情况下，需要确保任务完成。
    - 可能的解决方案：不创建 PDB。 任务控制器会创建一个替换的 pod。

## 指定 PodDisruptionBudget

`PodDisruptionBudget` 有3个字段：

* 标签选择器 `.spec.selector` ，用于指定其所作用的 pod 集合，
该字段为必需字段。
* `.spec.minAvailable` 表示驱逐后仍然保证可用的 pod 数量。即使因此影响到 pod 驱逐（即该条件在和 pod 驱逐发生冲突时优先保证）。
`minAvailable` 值可以是绝对值，也可以是百分比。
* `.spec.maxUnavailable` （Kubernetes 1.7 及更高的版本中可用）表示驱逐后允许不可用的 pod 的最大数量。 
其值可以是绝对值或是百分比。

用户在同一个 `PodDisruptionBudget` 中只能够指定 `maxUnavailable` 和 `minAvailable` 中的一个。 
`maxUnavailable` 只能够用于控制存在相应控制器的 pod 的驱逐（即不受控制器控制的 pod 不在 
`maxUnavailable` 控制范围内）。在下面的示例中，“所需副本” 指的是相应控制器的 `scale`，
控制器对 `PodDisruptionBudget` 所选择的 pod 进行管理。

示例 1： 设置 `minAvailable` 值为 5 的情况下， 驱逐时需保证 PodDisruptionBudget `selector` 选中的
pod 中 5 个 或 5 个以上处于健康状态。

示例 2： 设置 `minAvailable` 值为 30% 的情况下，驱逐时需保证 pod 所需副本的至少 30% 处于健康状态。 

示例 3： 设置 `maxUnavailable` 值为 5 的情况下，驱逐时需保证所需副本中最多 5 个处于不可用状态。

示例4： 设置 `maxUnavailable` 值为 30% 的情况下，驱逐时需保证所需副本中最多 30% 处于不可用状态。

在典型用法中，中断预算会被用于一个控制器管理的一组 pod 中——例如：一个 ReplicaSet 
或 StatefulSet 中的 pod。

**注意：** 中断预算并不能真正保证指定数量/百分比的 pod 一直处于运行状态。例如： 当 pod 
集合的规模处于预算指定的最小值时，承载集合中某个 pod 的节点发生了故障，这样就导致集合中可用 pod 
的数量低于预算指定值。预算只能够针对自发的驱逐提供保护，而不能针对所有 pod 不可用的诱因。

设置 `maxUnavailable` 值为 0% （或0）或设置 `minAvailable` 值为 100% （或等于副本数）
可能会阻塞节点，导致资源耗尽。按照 `PodDisruptionBudget` 的语义，这是允许的。

用户可以在下面看到 pod 中断预算定义的示例，它们与带有 `app: zookeeper` 标签的 pod 相匹配：

使用 minAvailable 的PDB 示例：

```yaml
apiVersion: policy/v1beta1
kind: PodDisruptionBudget
metadata:
  name: zk-pdb
spec:
  minAvailable: 2
  selector:
    matchLabels:
      app: zookeeper
```

使用 maxUnavailable 的 PDB 示例（Kubernetes 1.7 或更高的版本）：

```yaml
apiVersion: policy/v1beta1
kind: PodDisruptionBudget
metadata:
  name: zk-pdb
spec:
  maxUnavailable: 1
  selector:
    matchLabels:
      app: zookeeper
```

例如，如果上述 `zk-pdb` 选择的是一个规格为 3 的 StatefulSet 对应的 pod，那么上面两种规范的含义完全相同。
推荐使用 `maxUnavailable` ，因为它自动响应控制器副本数量的变化。

# 创建 PDB 对象

用户可以通过类似 `kubectl create -f mypdb.yaml` 的命令来创建 PDB。

PDB 对象无法更新，必须删除后重新创建。

# 检查 PDB 的状态

使用 kubectl 来确认 PDB 被创建。

假设用户的名字空间下没有匹配 `app: zookeeper` 的 pod，用户会看到类似下面的信息：

```shell
$ kubectl get poddisruptionbudgets
NAME      MIN-AVAILABLE   ALLOWED-DISRUPTIONS   AGE
zk-pdb    2               0                     7s
```

假设有匹配的 pod (比如说 3 个), 那么用户会看到类似下面的信息：

```shell
$ kubectl get poddisruptionbudgets
NAME      MIN-AVAILABLE   ALLOWED-DISRUPTIONS   AGE
zk-pdb    2               1                     7s
```

 `ALLOWED-DISRUPTIONS` 值非 0 意味着中断控制器已经感知到相应的 pod，
对匹配的 pod 进行统计，并更新了 PDB 的状态。

用户可以通过以下命令获取更多 PDB 状态相关信息：

```shell
$ kubectl get poddisruptionbudgets zk-pdb -o yaml
apiVersion: policy/v1beta1
kind: PodDisruptionBudget
metadata:
  creationTimestamp: 2017-08-28T02:38:26Z
  generation: 1
  name: zk-pdb
...
status:
  currentHealthy: 3
  desiredHealthy: 3
  disruptedPods: null
  disruptionsAllowed: 1
  expectedPods: 3
  observedGeneration: 1
```

# 任意控制器和选择器

如果用户只使用与内置的应用控制器（Deployment、ReplicationController、ReplicaSet 和 StatefulSet）
对应的 PDB，也就是 PDB 的选择器与 控制器的选择器相匹配，那么可以跳过这一节。

用户可以使用这样的 PDB：它对应的 pod 可能由其他类型的控制器控制，可能由 “operator” 控制，
也可能为“裸的（不受控制器控制）” pod，但该类 PDB 存在以下限制：

- 只能够使用 `.spec.minAvailable` ，而不能够使用 `.spec.maxUnavailable`。
- 只能够使用整数作为 `.spec.minAvailable` 的值，而不能使用百分比。

用户可以令选择器选择一个内置控制器所控制 pod 的子集或超集。然而，当名字空间下存在多个 PDB
时，用户必须小心，保证 PDB 的选择器之间不重叠。

{% endcapture %}

{% include templates/task.md %}
