---
layout: blog
title: "Kubernetes 1.25：应用滚动上线所用的两个特性进入稳定阶段"
date: 2022-09-15
slug: "app-rollout-features-reach-stable"
---
<!--
layout: blog
title: "Kubernetes 1.25: Two Features for Apps Rollouts Graduate to Stable"
date: 2022-09-15
slug: "app-rollout-features-reach-stable"
-->

<!--
**Authors:** Ravi Gudimetla (Apple), Filip Křepinský (Red Hat), Maciej Szulik (Red Hat)
-->
**作者：** Ravi Gudimetla (Apple)、Filip Křepinský (Red Hat)、Maciej Szulik (Red Hat)

<!--
This blog describes the two features namely `minReadySeconds` for StatefulSets and `maxSurge` for DaemonSets that SIG Apps is happy to graduate to stable in Kubernetes 1.25.

Specifying `minReadySeconds` slows down a rollout of a StatefulSet, when using a `RollingUpdate` value in `.spec.updateStrategy` field, by waiting for each pod for a desired time.
This time can be used for initializing the pod (e.g. warming up the cache) or as a delay before acknowledging the pod.
-->
这篇博客描述了两个特性，即用于 StatefulSet 的 `minReadySeconds` 以及用于 DaemonSet 的 `maxSurge`，
SIG Apps 很高兴宣布这两个特性在 Kubernetes 1.25 进入稳定阶段。

当 `.spec.updateStrategy` 字段设置为 `RollingUpdate` 时，
你可以设置 `minReadySeconds`， 通过让每个 Pod 等待一段预期时间来减缓 StatefulSet 的滚动上线。

<!--
`maxSurge` allows a DaemonSet workload to run multiple instances of the same pod on a node during a rollout when using a `RollingUpdate` value in `.spec.updateStrategy` field.
This helps to minimize the downtime of the DaemonSet for consumers.

These features were already available in a Deployment and other workloads. This graduation helps to align this functionality across the workloads.
-->
当 `.spec.updateStrategy` 字段设置为 `RollingUpdate` 时，
`maxSurge` 允许 DaemonSet 工作负载在滚动上线期间在一个节点上运行同一 Pod 的多个实例。
这对于消费者而言有助于将 DaemonSet 的停机时间降到最低。

这两个特性也可用于 Deployment 和其他工作负载。此功能的提级有助于将这一功能在所有工作负载上对齐。

<!--
## What problems do these features solve?

### minReadySeconds for StatefulSets {#solved-problem-statefulset-minreadyseconds}
-->
## 这两个特性能解决什么问题？   {#what-problems-do-these-features-solve}

### 针对 StatefulSet 的 minReadySeconds   {#solved-problem-statefulset-minreadyseconds}

<!--
`minReadySeconds` ensures that the StatefulSet workload is `Ready` for the given number of seconds before reporting the
pod as `Available`. The notion of being `Ready` and `Available` is quite important for workloads. For example, some workloads, like Prometheus with multiple instances of Alertmanager, should be considered `Available` only when the Alertmanager's state transfer is complete. `minReadySeconds` also helps when using loadbalancers with cloud providers. Since the pod should be `Ready` for the given number of seconds, it provides buffer time to prevent killing pods in rotation before new pods show up.
-->
`minReadySeconds` 确保 StatefulSet 工作负载在给定的秒数内处于 `Ready`，
然后才会将该 Pod 报告为 `Available`。
处于 `Ready` 和 `Available` 状况的这种说法对工作负载相当重要。
例如 Prometheus 这些工作负载有多个 Alertmanager 实例，
只有 Alertmanager 的状态转换完成后才应该被视为 `Available`。
`minReadySeconds` 还有助于云驱动确定何时使用负载均衡器。
因为 Pod 应在给定的秒数内处于 `Ready`，所以这就提供了一段缓冲时间，
防止新 Pod 还没起来之前就在轮转过程中杀死了旧 Pod。

<!--
### maxSurge for DaemonSets {#how-use-daemonset-maxsurge}

Kubernetes system-level components like CNI, CSI are typically run as DaemonSets. These components can have impact on the availability of the workloads if those DaemonSets go down momentarily during the upgrades. The feature allows DaemonSet pods to temporarily increase their number, thereby ensuring zero-downtime for the DaemonSets.

Please note that the usage of `hostPort` in conjunction with `maxSurge` in DaemonSets is not allowed as DaemonSet pods are tied to a single node and two active pods cannot share the same port on the same node.
-->
### 针对 DaemonSet 的 maxSurge     {#how-use-daemonset-maxsurge}

CNI、CSI 这类 Kubernetes 系统级别的组件通常以 DaemonSet 方式运行。如果这些 DaemonSet 在升级期间瞬间挂掉，
对应的组件可能会影响工作负载的可用性。此特性允许 DaemonSet Pod 临时增加数量，以此确保 DaemonSet 的停机时间为零。

请注意在 DaemonSet 中不允许同时使用 `hostPort` 和 `maxSurge`，
因为 DaemonSet Pod 被捆绑到了一个节点，所以两个活跃的 Pod 无法共享同一节点上的相同端口。

<!--
## How does it work?

### minReadySeconds for StatefulSets {#how-does-statefulset-minreadyseconds-work}

The StatefulSet controller watches for the StatefulSet pods and counts how long a particular pod has been in the `Running` state, if this value is greater than or equal to the time specified in `.spec.minReadySeconds` field of the StatefulSet, the StatefulSet controller updates the `AvailableReplicas` field in the StatefulSet's status.
-->
## 工作原理    {#how-does-it-work}

### 针对 StatefulSet 的 minReadySeconds  {#how-does-statefulset-minreadyseconds-work}

StatefulSet 控制器监视 StatefulSet Pod 并统计特定的 Pod 已处于 `Running` 状态多长时间了，
如果这个值大于或等于 StatefulSet 的 `.spec.minReadySeconds` 字段中指定的时间，
StatefulSet 控制器将更新 StatefulSet 的状态中的 `AvailableReplicas` 字段。

<!--
### maxSurge for DaemonSets {#how-does-daemonset-maxsurge-work}

The DaemonSet controller creates the additional pods (above the desired number resulting from DaemonSet spec) based on the value given in `.spec.strategy.rollingUpdate.maxSurge`. The additional pods would run on the same node where the old DaemonSet pod is running till the old pod gets killed.
-->
### 针对 DaemonSet 的 maxSurge  {#how-does-daemonset-maxsurge-work}

DaemonSet 控制器根据 `.spec.strategy.rollingUpdate.maxSurge` 中给出的值创建额外 Pod
（超出 DaemonSet 规约所设定的预期数量）。
这些 Pod 将运行在旧 DaemonSet Pod 运行所在的同一节点上，直到这个旧 Pod 被杀死为止。

<!--
- The default value is 0.
- The value cannot be `0` when `MaxUnavailable` is 0.
- The value can be specified either as an absolute number of pods, or a percentage (rounded up) of desired pods.
-->
- 默认值为 0。
- 当 `MaxUnavailable` 为 0 时此值不能为 `0`。
- 此值可以指定为一个绝对的 Pod 个数或预期 Pod 总数的百分比（向上取整）。

<!--
## How do I use it?

### minReadySeconds for StatefulSets {#how-use-statefulset-minreadyseconds}

Specify a value for `minReadySeconds` for any StatefulSet and check if pods are available or not by inspecting
`AvailableReplicas` field using:
-->
## 我如何使用它？   {#how-do-i-use-it}

### 针对 StatefulSet 的 minReadySeconds   {#how-use-statefulset-minreadyseconds}

执行以下命令为任意 StatefulSet 指定一个 `minReadySeconds` 值，
通过检验 `AvailableReplicas` 字段查看这些 Pod 是否可用：

```
kubectl get statefulset/<StatefulSet 名称> -o yaml
```

<!--
Please note that the default value of `minReadySeconds` is 0.

### maxSurge for DaemonSets {#how-use-daemonset-maxsurge}

Specify a value for `.spec.updateStrategy.rollingUpdate.maxSurge` and set `.spec.updateStrategy.rollingUpdate.maxUnavailable` to `0`. 

Then observe a faster rollout and higher number of pods running at the same time in the next rollout.
-->
请注意 `minReadySeconds` 的默认值为 0。

### 针对 DaemonSet 的 maxSurge  {#how-use-daemonset-maxsurge}

为 `.spec.updateStrategy.rollingUpdate.maxSurge` 指定一个值并将
`.spec.updateStrategy.rollingUpdate.maxUnavailable` 设置为 `0`。

然后观察下一次滚动上线是不是更快，同时运行的 Pod 数量是不是更多。

```
kubectl rollout restart daemonset <name_of_the_daemonset>
kubectl get pods -w
```

<!--
## How can I learn more?

### minReadySeconds for StatefulSets {#learn-more-statefulset-minreadyseconds}

- Documentation: https://k8s.io/docs/concepts/workloads/controllers/statefulset/#minimum-ready-seconds
- KEP: https://github.com/kubernetes/enhancements/issues/2599
- API Changes: https://github.com/kubernetes/kubernetes/pull/100842
-->
## 我如何才能了解更多？   {#how-can-i-learn-more}

### 针对 StatefulSet 的 minReadySeconds   {#learn-more-statefulset-minreadyseconds}

- 文档： https://k8s.io/zh-cn/docs/concepts/workloads/controllers/statefulset/#minimum-ready-seconds
- KEP： https://github.com/kubernetes/enhancements/issues/2599
- API 变更： https://github.com/kubernetes/kubernetes/pull/100842

<!--
### maxSurge for DaemonSets {#learn-more-daemonset-maxsurge}

- Documentation: https://k8s.io/docs/tasks/manage-daemon/update-daemon-set/
- KEP: https://github.com/kubernetes/enhancements/issues/1591
- API Changes: https://github.com/kubernetes/kubernetes/pull/96375
-->
### 针对 DaemonSet 的 maxSurge   {#learn-more-daemonset-maxsurge}

- 文档： https://k8s.io/zh-cn/docs/tasks/manage-daemon/update-daemon-set/
- KEP： https://github.com/kubernetes/enhancements/issues/1591
- API 变更： https://github.com/kubernetes/kubernetes/pull/96375

<!--
## How do I get involved?

Please reach out to us on [#sig-apps](https://kubernetes.slack.com/archives/C18NZM5K9) channel on Slack, or through the SIG Apps mailing list [kubernetes-sig-apps@googlegroups.com](https://groups.google.com/g/kubernetes-sig-apps).
-->
## 我如何参与？   {#how-do-i-get-involved}

请通过 Slack [#sig-apps](https://kubernetes.slack.com/archives/C18NZM5K9) 频道或通过 SIG Apps
邮件列表 [kubernetes-sig-apps@googlegroups.com](https://groups.google.com/g/kubernetes-sig-apps) 联系我们。
