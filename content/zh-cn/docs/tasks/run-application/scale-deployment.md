---
title: 手动水平扩缩 Deployment
content_type: task
weight: 15
---
<!--
title: Horizontal Manual Scaling for a Deployment
content_type: task
weight: 15
-->

<!-- overview -->

<!--
This page shows how to manually scale a Deployment horizontally, by changing its replica count.
Manual scaling lets you directly control the number of running Pods for predictable load changes or cost management.

This is different from _vertical scaling_: leaving the replica count the same, but adjusting
the amount of resources available to each Pod.
-->
本文介绍如何通过更改副本数，手动对 Deployment 执行水平扩缩。
手动扩缩使你能够直接控制正在运行的 Pod 数量，以应对可预测的负载变化或进行成本管理。

这不同于**垂直扩缩**：垂直扩缩保持副本数不变，而调整每个 Pod 可用的资源量。

## {{% heading "objectives" %}}

<!--
- Scaling up a Deployment to handle more traffic.
- Scaling down a Deployment to conserve resources.
- Scaling a Deployment to zero to suspend a workload.
- Understanding when to use manual scaling versus a HorizontalPodAutoscaler.
-->
- 扩容 Deployment 以处理更多流量。
- 缩容 Deployment 以节省资源。
- 将 Deployment 缩容至零以暂停工作负载。
- 了解何时应使用手动扩缩，以及何时应使用 HorizontalPodAutoscaler。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!--
You need an existing Deployment. If you do not have one, and you just want to practice,
you can create the nginx Deployment from
[Run a Stateless Application Using a Deployment](/docs/tasks/run-application/run-stateless-application-deployment/):
-->
你需要一个已有的 Deployment。如果你还没有 Deployment，只是想进行练习，
可以按照[使用 Deployment 运行无状态应用](/zh-cn/docs/tasks/run-application/run-stateless-application-deployment/)创建
nginx Deployment：

```shell
kubectl apply -f https://k8s.io/examples/application/deployment.yaml
```

<!--
Verify the Deployment runs two Pods:
-->
验证该 Deployment 运行了两个 Pod：

```shell
kubectl get deployment nginx-deployment
```

<!--
The output is similar to:
-->
输出类似于：

```
NAME               READY   UP-TO-DATE   AVAILABLE   AGE
nginx-deployment   2/2     2            2           10s
```

<!-- steps -->

<!--
## Scaling up a Deployment

There are several different ways you can change the replica count for an
existing Deployment.
-->
## 扩容 Deployment {#scaling-up-a-deployment}

可以通过多种方式更改已有 Deployment 的副本数。

<!--
### Scaling up using `kubectl scale`

Use `kubectl scale` to set the replica count:
-->
### 使用 `kubectl scale` 扩容 {#scaling-up-using-kubectl-scale}

使用 `kubectl scale` 设置副本数：

```shell
kubectl scale deployment/nginx-deployment --replicas=4
```

<!--
The output is similar to:
-->
输出类似于：

```
deployment.apps/nginx-deployment scaled
```

<!--
Verify that the Deployment has four Pods:
-->
验证该 Deployment 有四个 Pod：

```shell
kubectl get deployment nginx-deployment
```

<!--
The output is similar to:
-->
输出类似于：

```
NAME               READY   UP-TO-DATE   AVAILABLE   AGE
nginx-deployment   4/4     4            4           1m
```

<!--
### Declarative scaling using `kubectl apply`

Instead of running an imperative command, you can update the manifest file and
apply it. This approach fits well with version-controlled configuration
workflows.
-->
### 使用 `kubectl apply` 声明式扩缩 {#declarative-scaling-using-kubectl-apply}

除了运行命令式命令，你还可以更新清单文件并应用它。
这种方法适合采用版本控制管理配置的工作流程。

<!--
Save the current Deployment configuration to a local file:
-->
将当前 Deployment 配置保存到本地文件：

```shell
kubectl get deployment nginx-deployment -o yaml > /tmp/nginx-deployment.yaml
```

<!--
Edit `/tmp/nginx-deployment.yaml` and change `.spec.replicas` to `4`.
-->
编辑 `/tmp/nginx-deployment.yaml`，将 `.spec.replicas` 改为 `4`。

<!--
Before applying, compare your local changes against the cluster state:
-->
应用前，将本地变更与集群状态进行比较：

```shell
kubectl diff -f /tmp/nginx-deployment.yaml
```

<!--
Apply the edited manifest:
-->
应用编辑后的清单：

```shell
kubectl apply -f /tmp/nginx-deployment.yaml
```

<!--
## Scaling down a Deployment

To reduce the number of Pods, set `--replicas` to a lower value:
-->
## 缩容 Deployment {#scaling-down-a-deployment}

要减少 Pod 数量，请将 `--replicas` 设置为较小的值：

```shell
kubectl scale deployment/nginx-deployment --replicas=2
```

<!--
Kubernetes gracefully terminates the excess Pods, respecting each Pod's
`terminationGracePeriodSeconds` setting.
-->
Kubernetes 会优雅地终止多余的 Pod，并遵从每个 Pod 的 `terminationGracePeriodSeconds` 设置。

<!--
Verify that the Deployment has two Pods:
-->
验证该 Deployment 有两个 Pod：

```shell
kubectl get pods -l app=nginx
```

<!--
The output is similar to:
-->
输出类似于：

```
NAME                                READY   STATUS    RESTARTS   AGE
nginx-deployment-66b6c48dd5-7gl6h   1/1     Running   0          2m
nginx-deployment-66b6c48dd5-v8mkd   1/1     Running   0          2m
```

<!--
## Scaling to zero

You can scale a Deployment to zero to temporarily suspend the workload without
deleting the Deployment itself:
-->
## 缩容至零 {#scaling-to-zero}

你可以将 Deployment 缩容至零，以暂时暂停工作负载而不删除 Deployment 本身：

```shell
kubectl scale deployment/nginx-deployment --replicas=0
```

<!--
Verify that no Pods are running:
-->
验证没有正在运行的 Pod：

```shell
kubectl get deployment nginx-deployment
```

<!--
The output is similar to:
-->
输出类似于：

```
NAME               READY   UP-TO-DATE   AVAILABLE   AGE
nginx-deployment   0/0     0            0           5m
```

{{< note >}}
<!--
Scaling to zero removes all Pods but preserves the Deployment and its
ReplicaSet. Scale back up at any time by setting `--replicas` to a positive
number.
-->
缩容至零会删除所有 Pod，但会保留 Deployment 及其 ReplicaSet。
你可以随时将 `--replicas` 设置为正数来重新扩容。
{{< /note >}}

<!--
Common use cases for scaling to zero include:

- Temporarily suspending a workload to save resources
- Debugging or maintenance windows
- Cost control in development or staging environments
-->
缩容至零的常见使用场景包括：

- 暂停工作负载以节省资源
- 调试或维护窗口
- 开发或预发布环境中的成本控制

<!--
## Other ways to change the replica count

In addition to `kubectl scale`, you can change `.spec.replicas` with
`kubectl edit` or `kubectl patch`.
-->
## 更改副本数的其他方式 {#other-ways-to-change-the-replica-count}

除了 `kubectl scale`，你还可以使用 `kubectl edit` 或 `kubectl patch` 更改 `.spec.replicas`。

<!--
### Scale using `kubectl edit`
-->
### 使用 `kubectl edit` 扩缩 {#scale-using-kubectl-edit}

```shell
kubectl edit deployment nginx-deployment
```

<!--
Change the `.spec.replicas` field in the editor, then save and exit.
-->
在编辑器中更改 `.spec.replicas` 字段，然后保存并退出。

<!--
### Scale using `kubectl patch`

You can update `.spec.replicas` with a strategic merge patch:
-->
### 使用 `kubectl patch` 扩缩 {#scale-using-kubectl-patch}

你可以使用策略合并补丁更新 `.spec.replicas`：

```shell
kubectl patch deployment nginx-deployment -p '{"spec":{"replicas":4}}'
```

<!--
For scripting, use a JSON patch with a prerequisite test. The following command sets the replica count to 4, but only if the current count is 2:
-->
在脚本中，请使用带前置条件测试的 JSON 补丁。
以下命令将副本数设置为 4，但仅在当前副本数为 2 时执行：

```shell
kubectl patch deployment nginx-deployment --type=json -p='[
  {"op": "test", "path": "/spec/replicas", "value": 2},
  {"op": "replace", "path": "/spec/replicas", "value": 4}
]'
```

<!--
The `test` operation causes the patch to fail if the current value does not match, which prevents unintended changes when multiple people or scripts modify the same Deployment.
-->
如果当前值不匹配，`test` 操作会导致补丁失败，从而防止多人或多个脚本修改同一 Deployment 时发生意外变更。

<!--
## When to use manual versus automatic scaling
-->
## 何时使用手动扩缩或自动扩缩 {#when-to-use-manual-versus-automatic-scaling}

<!--
| Aspect | Manual scaling | Automatic scaling (HPA) |
|--------|---------------|------------------------|
| Best for | Predictable, scheduled, or one-off load changes | Variable or unpredictable demand |
| How it works | You set `.spec.replicas` directly | HPA adjusts replicas based on observed metrics |
| Response time | Immediate when you run the command | Reacts to metrics with a short delay |
| Metrics awareness | None — you decide the replica count | Monitors CPU, memory, or custom metrics |
| Maintenance | Requires manual intervention to adjust | Runs autonomously after configuration |
-->
| 方面 | 手动扩缩 | 自动扩缩（HPA） |
|------|--------|---------------|
| 最适合的场景 | 可预测、计划内或一次性的负载变化 | 可变或不可预测的需求 |
| 工作方式 | 直接设置 `.spec.replicas` | HPA 根据观测到的指标调整副本数 |
| 响应时间 | 运行命令后立即响应 | 根据指标稍有延迟地响应 |
| 指标感知 | 无；由你决定副本数 | 监控 CPU、内存或自定义指标 |
| 维护 | 需要手动干预来调整 | 配置后自动运行 |

{{< caution >}}
<!--
If a HorizontalPodAutoscaler manages a Deployment, do not set replicas manually.
The HPA continuously reconciles the replica count and overrides any manual
changes.
-->
如果 HorizontalPodAutoscaler 管理某个 Deployment，请不要手动设置副本数。
HPA 会持续协调副本数，并覆盖任何手动变更。
{{< /caution >}}

## {{% heading "cleanup" %}}

<!--
Delete the Deployment:
-->
删除 Deployment：

```shell
kubectl delete deployment nginx-deployment
```

## {{% heading "whatsnext" %}}

<!--
- Learn more about [Deployments](/docs/concepts/workloads/controllers/deployment/).
- Walk through [Horizontal Pod Autoscaling](/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/).
- Learn how to [scale a StatefulSet](/docs/tasks/run-application/scale-stateful-set/).
- Read about [managing resources](/docs/concepts/cluster-administration/manage-deployment/).
-->
- 进一步了解 [Deployment](/zh-cn/docs/concepts/workloads/controllers/deployment/)。
- 学习[水平 Pod 自动扩缩](/zh-cn/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/)。
- 了解如何[扩缩 StatefulSet](/zh-cn/docs/tasks/run-application/scale-stateful-set/)。
- 阅读[管理资源](/zh-cn/docs/concepts/workloads/management/)的相关内容。
