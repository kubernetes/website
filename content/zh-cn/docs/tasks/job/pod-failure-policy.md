---
title: 使用 Pod 失效策略处理可重试和不可重试的 Pod 失效
content_type: task
min-kubernetes-server-version: v1.25
weight: 60
---
<!--
title: Handling retriable and non-retriable pod failures with Pod failure policy
content_type: task
min-kubernetes-server-version: v1.25
weight: 60
-->

<!--
{{< feature-state for_k8s_version="v1.25" state="alpha" >}}
-->
{{< feature-state for_k8s_version="v1.25" state="alpha" >}}

<!--
This document shows you how to use the
[Pod failure policy](/docs/concepts/workloads/controllers/job#pod-failure-policy),
in combination with the default
[Pod backoff failure policy](/docs/concepts/workloads/controllers/job#pod-backoff-failure-policy),
to improve the control over the handling of container- or Pod-level failure
within a {{<glossary_tooltip text="Job" term_id="job">}}.
-->
本文介绍了如何使用 [Pod 失效策略](/zh-cn/docs/concepts/workloads/controllers/job#pod-failure-policy)，
结合默认的 [Pod 回退失效策略](/zh-cn/docs/concepts/workloads/controllers/job#pod-backoff-failure-policy)，
来提高对同一 {{<glossary_tooltip text="Job" term_id="job">}} 中容器级或 Pod 级失效处理的控制。

<!--
The definition of Pod failure policy may help you to:
* better utilize the computational resources by avoiding unnecessary Pod retries.
* avoid Job failures due to Pod disruptions (such {{<glossary_tooltip text="preemption" term_id="preemption" >}},
{{<glossary_tooltip text="API-initiated eviction" term_id="api-eviction" >}}
or {{<glossary_tooltip text="taint" term_id="taint" >}}-based eviction).
-->
定义 Pod 失效策略可以帮助你：
* 通过避免不必要的 Pod 重试，更好地利用计算资源。
* 避免由于 Pod 中断（例如 {{<glossary_tooltip text="抢占" term_id="preemption" >}}, 
{{<glossary_tooltip text="API 发起的驱逐" term_id="api-eviction" >}}
或者基于 {{<glossary_tooltip text="污点" term_id="taint" >}} 的驱逐）而导致 Job 失效。

## {{% heading "prerequisites" %}}

<!--
You should already be familiar with the basic use of [Job](/docs/concepts/workloads/controllers/job/).
-->
您应该已经熟悉 [Job](/zh-cn/docs/concepts/workloads/controllers/job/) 的基本用法。

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

{{< note >}}
<!--
As the features are in Alpha, prepare the Kubernetes cluster with the two
[feature gates](/docs/reference/command-line-tools-reference/feature-gates/)
enabled: `JobPodFailurePolicy` and `PodDisruptionsCondition`.
-->
由于功能处于 Alpha 阶段，因此要准备带有两个[特性门](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)的集群，
开启：`JobPodFailurePolicy` 和 `PodDisruptionsCondition`。
{{< /note >}}

<!--
## Using Pod failure policy to avoid unnecessary Pod retries
-->
## 使用 Pod 失效策略避免不必要的 Pod 重试

<!--
With the following example, you can learn how to use Pod failure policy to
avoid unnecessary Pod restarts when a Pod failure indicates a non-retriable
software bug.
-->
通过以下示例，你可以了解在 Pod 故障表明存在不可重试的软件错误时，如何使用 Pod 失效策略来避免不必要的 Pod 重试。

<!--
First, create a Job based on the config:
-->
首先，基于配置创建一个 Job：

{{< codenew file="/controllers/job-pod-failure-policy-failjob.yaml" >}}

<!--
by running:

```sh
kubectl create -f job-pod-failure-policy-failjob.yaml
```
-->
通过运行：

```sh
kubectl create -f job-pod-failure-policy-failjob.yaml
```

<!--
After around 30s the entire Job should be terminated. Inspect the status of the Job by running:
```sh
kubectl get jobs -l job-name=job-pod-failure-policy-failjob -o yaml
```
-->
整个 Job 应该在大约 30 秒后被终止。通过运行以下命令检查 Job 的状态：
```sh
kubectl get jobs -l job-name=job-pod-failure-policy-failjob -o yaml
```

<!--
In the Job status, see a job `Failed` condition with the field `reason`
equal `PodFailurePolicy`. Additionally, the `message` field contains a
more detailed information about the Job termination, such as:
`Container main for pod default/job-pod-failure-policy-failjob-8ckj8 failed with exit code 42 matching FailJob rule at index 0`.
-->
在 Job 状态中，如果字段 `reason` 等于 `PodFailurePolicy`，表示一个 Job `Failed`。
此外，`message` 字段包含有关 Job 终止的更详细信息，例如：
`Container main for pod default/job-pod-failure-policy-failjob-8ckj8 failed with exit code 42 matching FailJob rule at index 0`。

<!--
For comparison, if the Pod failure policy was disabled it would take 6 retries
of the Pod, taking at least 2 minutes.
-->
作为比较，如果禁用 Pod 失效策略，则需要进行 6 次 Pod 重试，至少需要 2 分钟。

<!--
### Clean up
-->
### 清理

<!--
Delete the Job you created:
```sh
kubectl delete jobs/job-pod-failure-policy-failjob
```
-->
删除创建的 Job:
```sh
kubectl delete jobs/job-pod-failure-policy-failjob
```
<!--
The cluster automatically cleans up the Pods.
-->
集群会自动清理 Pod。

<!--
## Using Pod failure policy to ignore Pod disruptions
-->
## 使用 Pod 失效策略忽略 Pod 中断

<!--
With the following example, you can learn how to use Pod failure policy to
ignore Pod disruptions from incrementing the Pod retry counter towards the
`.spec.backoffLimit` limit.
-->
通过以下示例，你可以了解如何使用 Pod 失效策略来忽略因为将 Pod 重试计数器增加到 `.spec.backoffLimit` 边界而造成的 Pod 中断。

{{< caution >}}
<!--
Timing is important for this example, so you may want to read the steps before
execution. In order to trigger a Pod disruption it is important to drain the
node while the Pod is running on it (within 90s since the Pod is scheduled).
-->
时间对于这个例子很重要，因此你需要在执行之前阅读这些步骤。
为了触发 Pod 中断，需要当 Pod 在节点上运行时清空节点（自 Pod 调度后的 90 秒内）。
{{< /caution >}}

<!--
1. Create a Job based on the config:
-->
1. 基于配置创建一个 Job：

{{< codenew file="/controllers/job-pod-failure-policy-ignore.yaml" >}}

<!--
by running:

```sh
kubectl create -f job-pod-failure-policy-ignore.yaml
```
-->
通过运行：

```sh
kubectl create -f job-pod-failure-policy-ignore.yaml
```

<!--
2. Run this command to check the `nodeName` the Pod is scheduled to:

```sh
nodeName=$(kubectl get pods -l job-name=job-pod-failure-policy-ignore -o jsonpath='{.items[0].spec.nodeName}')
```
-->
2. 运行这个命令来检查 Pod 被调度到的 `nodeName`：

```sh
nodeName=$(kubectl get pods -l job-name=job-pod-failure-policy-ignore -o jsonpath='{.items[0].spec.nodeName}')
```

<!--
3. Drain the node to evict the Pod before it completes (within 90s):
```sh
kubectl drain nodes/$nodeName --ignore-daemonsets --grace-period=0
```
-->
3. 在 Pod 完成之前（90 秒内）清空节点以驱逐 Pod：
```sh
kubectl drain nodes/$nodeName --ignore-daemonsets --grace-period=0
```

<!--
4. Inspect the `.status.failed` to check the counter for the Job is not incremented:
```sh
kubectl get jobs -l job-name=job-pod-failure-policy-ignore -o yaml
```
-->
4. 审视 `.status.failed` 以检查 Job 的计数器未增加：
```sh
kubectl get jobs -l job-name=job-pod-failure-policy-ignore -o yaml
```

<!--
5. Uncordon the node:
```sh
kubectl uncordon nodes/$nodeName
```
-->
5. 解封节点:
```sh
kubectl uncordon nodes/$nodeName
```

<!--
The Job resumes and succeeds.
-->
Job 恢复并成功。

<!--
For comparison, if the Pod failure policy was disabled the Pod disruption would
result in terminating the entire Job (as the `.spec.backoffLimit` is set to 0).
-->
作为比较，如果禁用 Pod 失效策略，Pod 中断将导致整个 Job 终止（因为 `.spec.backoffLimit` 设置为 0）。

<!--
### Cleaning up
-->
### 清理

<!--
Delete the Job you created:
```sh
kubectl delete jobs/job-pod-failure-policy-ignore
```
The cluster automatically cleans up the Pods.
-->
删除创建的 Job：
```sh
kubectl delete jobs/job-pod-failure-policy-ignore
```
集群会自动清理 Pod。

<!--
## Alternatives
-->
## 替代方案

<!--
You could rely solely on the
[Pod backoff failure policy](/docs/concepts/workloads/controllers/job#pod-backoff-failure-policy),
by specifying the Job's `.spec.backoffLimit` field. However, in many situations
it is problematic to find a balance between setting the a low value for `.spec.backoffLimit`
 to avoid unnecessary Pod retries, yet high enough to make sure the Job would
not be terminated by Pod disruptions.
-->
通过指定 Job 的 `.spec.backoffLimit` 字段，
你可以完全依赖 [Pod 回退失效策略](/zh-cn/docs/concepts/workloads/controllers/job#pod-backoff-failure-policy)。
然而在许多情况下，在给 `.spec.backoffLimit` 设置一个低值中寻找平衡点来避免不必要的 Pod 重试是有问题的，
但要设置的足够高以确保 Job 不会因 Pod 中断而终止。
