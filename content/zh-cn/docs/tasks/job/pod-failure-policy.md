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

{{< feature-state for_k8s_version="v1.26" state="beta" >}}

<!-- overview -->

<!--
This document shows you how to use the
[Pod failure policy](/docs/concepts/workloads/controllers/job#pod-failure-policy),
in combination with the default
[Pod backoff failure policy](/docs/concepts/workloads/controllers/job#pod-backoff-failure-policy),
to improve the control over the handling of container- or Pod-level failure
within a {{<glossary_tooltip text="Job" term_id="job">}}.
-->
本文向你展示如何结合默认的 [Pod 回退失效策略](/zh-cn/docs/concepts/workloads/controllers/job#pod-backoff-failure-policy)来使用
[Pod 失效策略](/zh-cn/docs/concepts/workloads/controllers/job#pod-failure-policy)，
以改善 {{<glossary_tooltip text="Job" term_id="job">}} 内处理容器级别或 Pod 级别的失效。

<!--
The definition of Pod failure policy may help you to:
* better utilize the computational resources by avoiding unnecessary Pod retries.
* avoid Job failures due to Pod disruptions (such {{<glossary_tooltip text="preemption" term_id="preemption" >}},
{{<glossary_tooltip text="API-initiated eviction" term_id="api-eviction" >}}
or {{<glossary_tooltip text="taint" term_id="taint" >}}-based eviction).
-->
Pod 失效策略的定义可以帮助你：
* 避免不必要的 Pod 重试，以更好地利用计算资源。
* 避免由于 Pod 干扰（例如{{<glossary_tooltip text="抢占" term_id="preemption" >}}、
  {{<glossary_tooltip text="API 发起的驱逐" term_id="api-eviction" >}}或基于{{<glossary_tooltip text="污点" term_id="taint" >}}的驱逐）
  而造成的 Job 失败。

## {{% heading "prerequisites" %}}

<!--
You should already be familiar with the basic use of [Job](/docs/concepts/workloads/controllers/job/).
-->
你应该已熟悉了 [Job](/zh-cn/docs/concepts/workloads/controllers/job/) 的基本用法。

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!--
## Using Pod failure policy to avoid unnecessary Pod retries

With the following example, you can learn how to use Pod failure policy to
avoid unnecessary Pod restarts when a Pod failure indicates a non-retriable
software bug.

First, create a Job based on the config:
-->
## 使用 Pod 失效策略以避免不必要的 Pod 重试  {#using-pod-failure-policy-to-avoid-unecessary-pod-retries}

借用以下示例，你可以学习在 Pod 失效表明有一个不可重试的软件漏洞时如何使用
Pod 失效策略来避免不必要的 Pod 重启。

首先，基于配置创建一个 Job：

{{< codenew file="/controllers/job-pod-failure-policy-failjob.yaml" >}}

<!--
by running:
-->
运行以下命令：

```sh
kubectl create -f job-pod-failure-policy-failjob.yaml
```

<!--
After around 30s the entire Job should be terminated. Inspect the status of the Job by running:
-->
大约 30 秒后，整个 Job 应被终止。通过运行以下命令来查看 Job 的状态：

```sh
kubectl get jobs -l job-name=job-pod-failure-policy-failjob -o yaml
```

<!--
In the Job status, see a job `Failed` condition with the field `reason`
equal `PodFailurePolicy`. Additionally, the `message` field contains a
more detailed information about the Job termination, such as:
`Container main for pod default/job-pod-failure-policy-failjob-8ckj8 failed with exit code 42 matching FailJob rule at index 0`.

For comparison, if the Pod failure policy was disabled it would take 6 retries
of the Pod, taking at least 2 minutes.
-->
在 Job 状态中，看到一个任务状况为 `Failed`，其 `reason` 字段等于 `PodFailurePolicy`。
此外，`message` 字段包含有关 Job 终止更详细的信息，例如：
`Container main for pod default/job-pod-failure-policy-failjob-8ckj8 failed with exit code 42 matching FailJob rule at index 0`。

为了比较，如果 Pod 失效策略被禁用，将会让 Pod 重试 6 次，用时至少 2 分钟。

<!--
### Clean up

Delete the Job you created:
-->
### 清理

删除你创建的 Job：

```sh
kubectl delete jobs/job-pod-failure-policy-failjob
```

<!--
The cluster automatically cleans up the Pods.

## Using Pod failure policy to ignore Pod disruptions

With the following example, you can learn how to use Pod failure policy to
ignore Pod disruptions from incrementing the Pod retry counter towards the
`.spec.backoffLimit` limit.
-->
集群自动清理这些 Pod。

## 使用 Pod 失效策略来忽略 Pod 干扰  {#using-pod-failure-policy-to-ignore-pod-disruptions}

通过以下示例，你可以学习如何使用 Pod 失效策略将 Pod 重试计数器朝着 `.spec.backoffLimit` 限制递增来忽略 Pod 干扰。

{{< caution >}}
<!--
Timing is important for this example, so you may want to read the steps before
execution. In order to trigger a Pod disruption it is important to drain the
node while the Pod is running on it (within 90s since the Pod is scheduled).
-->
这个示例的时机比较重要，因此你可能需要在执行之前阅读这些步骤。
为了触发 Pod 干扰，重要的是在 Pod 在其上运行时（自 Pod 调度后的 90 秒内）腾空节点。
{{< /caution >}}

<!--
1. Create a Job based on the config:
-->
1. 基于配置创建 Job：

   {{< codenew file="/controllers/job-pod-failure-policy-ignore.yaml" >}}

   <!--
   by running:
   -->
   运行以下命令：

   ```sh
   kubectl create -f job-pod-failure-policy-ignore.yaml
   ```

<!--
2. Run this command to check the `nodeName` the Pod is scheduled to:
-->
2. 运行以下这条命令检查将 Pod 调度到的 `nodeName`：

   ```sh
   nodeName=$(kubectl get pods -l job-name=job-pod-failure-policy-ignore -o jsonpath='{.items[0].spec.nodeName}')
   ```

<!--
3. Drain the node to evict the Pod before it completes (within 90s):
-->
3. 腾空该节点以便在 Pod 完成任务之前将其驱逐（90 秒内）：

   ```sh
   kubectl drain nodes/$nodeName --ignore-daemonsets --grace-period=0
   ```

<!--
4. Inspect the `.status.failed` to check the counter for the Job is not incremented:
-->
4. 查看 `.status.failed` 以检查针对 Job 的计数器未递增：

   ```sh
   kubectl get jobs -l job-name=job-pod-failure-policy-ignore -o yaml
   ```

<!--
5. Uncordon the node:
-->
5. 解除节点的保护：

   ```sh
   kubectl uncordon nodes/$nodeName
   ```

<!--
The Job resumes and succeeds.

For comparison, if the Pod failure policy was disabled the Pod disruption would
result in terminating the entire Job (as the `.spec.backoffLimit` is set to 0).
-->
Job 恢复并成功完成。

为了比较，如果 Pod 失效策略被禁用，Pod 干扰将使得整个 Job 终止（随着 `.spec.backoffLimit` 设置为 0）。

<!--
### Cleaning up

Delete the Job you created:
-->
### 清理

删除你创建的 Job：

```sh
kubectl delete jobs/job-pod-failure-policy-ignore
```

<!--
The cluster automatically cleans up the Pods.
-->
集群自动清理 Pod。

<!--
## Alternatives

You could rely solely on the
[Pod backoff failure policy](/docs/concepts/workloads/controllers/job#pod-backoff-failure-policy),
by specifying the Job's `.spec.backoffLimit` field. However, in many situations
it is problematic to find a balance between setting a low value for `.spec.backoffLimit`
 to avoid unnecessary Pod retries, yet high enough to make sure the Job would
not be terminated by Pod disruptions.
-->
## 替代方案  {#alternatives}

通过指定 Job 的 `.spec.backoffLimit` 字段，你可以完全依赖
[Pod 回退失效策略](/zh-cn/docs/concepts/workloads/controllers/job#pod-backoff-failure-policy)。
然而在许多情况下，难题在于如何找到一个平衡，为 `.spec.backoffLimit` 设置一个较小的值以避免不必要的 Pod 重试，
同时这个值又足以确保 Job 不会因 Pod 干扰而终止。
