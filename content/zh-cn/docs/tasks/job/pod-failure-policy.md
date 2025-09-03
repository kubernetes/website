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

{{< feature-state feature_gate_name="JobPodFailurePolicy" >}}

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
## Usage scenarios

Consider the following usage scenarios for Jobs that define a Pod failure policy :
- [Avoiding unnecessary Pod retries](#pod-failure-policy-failjob)
- [Ignoring Pod disruptions](#pod-failure-policy-ignore)
- [Avoiding unnecessary Pod retries based on custom Pod Conditions](#pod-failure-policy-config-issue)
- [Avoiding unnecessary Pod retries per index](#backoff-limit-per-index-failindex)
-->
## 使用场景   {#usage-scenarios}

针对定义了 Pod 失效策略的 Job，可以考虑以下一些使用场景：

- [避免不必要的 Pod 重试](#pod-failure-policy-failjob)  
- [忽略 Pod 干扰](#pod-failure-policy-ignore)  
- [基于自定义 Pod 状况避免不必要的 Pod 重试](#pod-failure-policy-config-issue)  
- [按索引避免不必要的 Pod 重试](#backoff-limit-per-index-failindex)

<!--
### Using Pod failure policy to avoid unnecessary Pod retries {#pod-failure-policy-failjob}

With the following example, you can learn how to use Pod failure policy to
avoid unnecessary Pod restarts when a Pod failure indicates a non-retriable
software bug.
-->
## 使用 Pod 失效策略以避免不必要的 Pod 重试  {#using-pod-failure-policy-to-avoid-unecessary-pod-retries}

借用以下示例，你可以学习在 Pod 失效表明有一个不可重试的软件漏洞时如何使用
Pod 失效策略来避免不必要的 Pod 重启。

<!--
1. Examine the following manifest:
-->
1. 检查以下清单文件：

   {{% code_sample file="/controllers/job-pod-failure-policy-failjob.yaml" %}}

<!--
1. Apply the manifest:
-->
2. 应用此清单：

   ```sh
   kubectl create -f https://k8s.io/examples/controllers/job-pod-failure-policy-failjob.yaml
   ```

<!--
1. After around 30 seconds the entire Job should be terminated. Inspect the status of the Job by running:
-->
3. 大约 30 秒后，整个 Job 应被终止。通过运行以下命令来查看 Job 的状态：

   ```sh
   kubectl get jobs -l job-name=job-pod-failure-policy-failjob -o yaml
   ```

   <!--
   In the Job status, the following conditions display:
   - `FailureTarget` condition: has a `reason` field set to `PodFailurePolicy` and
     a `message` field with more information about the termination, like
     `Container main for pod default/job-pod-failure-policy-failjob-8ckj8 failed with exit code 42 matching FailJob rule at index 0`.
     The Job controller adds this condition as soon as the Job is considered a failure.
     For details, see [Termination of Job Pods](/docs/concepts/workloads/controllers/job/#termination-of-job-pods).
   - `Failed` condition: same `reason` and `message` as the `FailureTarget`
     condition. The Job controller adds this condition after all of the Job's Pods
     are terminated.
   -->

   在 Job 状态中，显示以下状况信息：

   - `FailureTarget` 状况：有一个设置为 `PodFailurePolicy` 的 `reason`
     字段和一个包含更多有关终止信息的 `message` 字段，例如
    `Container main for pod default/job-pod-failure-policy-failjob-8ckj8 failed with exit code 42 matching FailJob rule at index 0`。
     一旦 Job 被视为失败，Job 控制器就会添加此状况。有关详细信息，请参阅
     [Job Pod 的终止](/zh-cn/docs/concepts/workloads/controllers/job/#termination-of-job-pods)。
   - `Failed`：与 `FailureTarget` 状况相同的 `reason` 和 `message`。
     Job 控制器会在 Job 的所有 Pod 终止后添加此状况。

   <!--
   For comparison, if the Pod failure policy was disabled it would take 6 retries
   of the Pod, taking at least 2 minutes.
   -->

   为了比较，如果 Pod 失效策略被禁用，将会让 Pod 重试 6 次，用时至少 2 分钟。

<!--
#### Clean up

Delete the Job you created:
-->
#### 清理

删除你创建的 Job：

```sh
kubectl delete jobs/job-pod-failure-policy-failjob
```

<!--
The cluster automatically cleans up the Pods.

### Using Pod failure policy to ignore Pod disruptions {#pod-failure-policy-ignore}

With the following example, you can learn how to use Pod failure policy to
ignore Pod disruptions from incrementing the Pod retry counter towards the
`.spec.backoffLimit` limit.
-->
集群自动清理这些 Pod。

### 使用 Pod 失效策略来忽略 Pod 干扰  {#pod-failure-policy-ignore}

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
1. Examine the following manifest:
-->
1. 检查以下清单文件：

   {{% code_sample file="/controllers/job-pod-failure-policy-ignore.yaml" %}}

<!--
1. Apply the manifest:
-->
2. 应用此清单：

   ```sh
   kubectl create -f https://k8s.io/examples/controllers/job-pod-failure-policy-ignore.yaml
   ```

<!--
1. Run this command to check the `nodeName` the Pod is scheduled to:
-->
3. 运行以下这条命令检查 Pod 被调度到的 `nodeName`：

   ```sh
   nodeName=$(kubectl get pods -l job-name=job-pod-failure-policy-ignore -o jsonpath='{.items[0].spec.nodeName}')
   ```

<!--
1. Drain the node to evict the Pod before it completes (within 90s):
-->
4. 腾空该节点以便在 Pod 完成任务之前将其驱逐（90 秒内）：

   ```sh
   kubectl drain nodes/$nodeName --ignore-daemonsets --grace-period=0
   ```

<!--
1. Inspect the `.status.failed` to check the counter for the Job is not incremented:
-->
5. 查看 `.status.failed` 以检查针对 Job 的计数器未递增：

   ```sh
   kubectl get jobs -l job-name=job-pod-failure-policy-ignore -o yaml
   ```

<!--
1. Uncordon the node:
-->
6. 解除节点的保护：

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
#### Cleaning up

Delete the Job you created:
-->
#### 清理

删除你创建的 Job：

```sh
kubectl delete jobs/job-pod-failure-policy-ignore
```

<!--
The cluster automatically cleans up the Pods.
-->
集群自动清理 Pod。

<!--
### Using Pod failure policy to avoid unnecessary Pod retries based on custom Pod Conditions {#pod-failure-policy-config-issue}

With the following example, you can learn how to use Pod failure policy to
avoid unnecessary Pod restarts based on custom Pod Conditions.
-->
### 基于自定义 Pod 状况使用 Pod 失效策略避免不必要的 Pod 重试   {#pod-failure-policy-config-issue}

根据以下示例，你可以学习如何基于自定义 Pod 状况使用 Pod 失效策略避免不必要的 Pod 重启。

{{< note >}}
<!--
The example below works since version 1.27 as it relies on transitioning of
deleted pods, in the `Pending` phase, to a terminal phase
(see: [Pod Phase](/docs/concepts/workloads/pods/pod-lifecycle/#pod-phase)).
-->
以下示例自 v1.27 起开始生效，因为它依赖于将已删除的 Pod 从 `Pending` 阶段过渡到终止阶段
（参阅 [Pod 阶段](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#pod-phase)）。
{{< /note >}}

<!--
1. Examine the following manifest:
-->
1. 检查以下清单文件：

   {{% code_sample file="/controllers/job-pod-failure-policy-config-issue.yaml" %}}

<!--
1. Apply the manifest:
-->
2. 应用此清单：

   ```sh
   kubectl create -f https://k8s.io/examples/controllers/job-pod-failure-policy-config-issue.yaml
   ```

   <!--
   Note that, the image is misconfigured, as it does not exist.
   -->
   请注意，镜像配置不正确，因为该镜像不存在。

<!--
1. Inspect the status of the job's Pods by running:
-->
3. 通过执行以下命令检查任务 Pod 的状态：

   ```sh
   kubectl get pods -l job-name=job-pod-failure-policy-config-issue -o yaml
   ```

   <!--
   You will see output similar to this:
   -->
   你将看到类似以下输出：

   ```yaml
   containerStatuses:
   - image: non-existing-repo/non-existing-image:example
      ...
      state:
      waiting:
         message: Back-off pulling image "non-existing-repo/non-existing-image:example"
         reason: ImagePullBackOff
         ...
   phase: Pending
   ```

   <!--
   Note that the pod remains in the `Pending` phase as it fails to pull the
   misconfigured image. This, in principle, could be a transient issue and the
   image could get pulled. However, in this case, the image does not exist so
   we indicate this fact by a custom condition.
   -->
   请注意，Pod 依然处于 `Pending` 阶段，因为它无法拉取错误配置的镜像。
   原则上讲这可能是一个暂时问题，镜像还是会被拉取。然而这种情况下，
   镜像不存在，因为我们通过一个自定义状况表明了这个事实。

<!--
1. Add the custom condition. First prepare the patch by running:
-->
4. 添加自定义状况。执行以下命令先准备补丁：

   ```sh
   cat <<EOF > patch.yaml
   status:
     conditions:
     - type: ConfigIssue
       status: "True"
       reason: "NonExistingImage"
       lastTransitionTime: "$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
   EOF
   ```

   <!--
   Second, select one of the pods created by the job by running:
   -->

   其次，执行以下命令选择通过任务创建的其中一个 Pod：

   ```
   podName=$(kubectl get pods -l job-name=job-pod-failure-policy-config-issue -o jsonpath='{.items[0].metadata.name}')
   ```

   <!--
   Then, apply the patch on one of the pods by running the following command:
   -->

   随后执行以下命令将补丁应用到其中一个 Pod 上：

   ```sh
   kubectl patch pod $podName --subresource=status --patch-file=patch.yaml
   ```

   <!--
   If applied successfully, you will get a notification like this:
   -->

   如果被成功应用，你将看到类似以下的一条通知：

   ```sh
   pod/job-pod-failure-policy-config-issue-k6pvp patched
   ```

<!--
1. Delete the pod to transition it to `Failed` phase, by running the command:
-->
5. 执行以下命令删除此 Pod 将其过渡到 `Failed` 阶段：

   ```sh
   kubectl delete pods/$podName
   ```

<!--
1. Inspect the status of the Job by running:
-->
6. 执行以下命令查验 Job 的状态：

   ```sh
   kubectl get jobs -l job-name=job-pod-failure-policy-config-issue -o yaml
   ```

   <!--
   In the Job status, see a job `Failed` condition with the field `reason`
   equal `PodFailurePolicy`. Additionally, the `message` field contains a
   more detailed information about the Job termination, such as:
   `Pod default/job-pod-failure-policy-config-issue-k6pvp has condition ConfigIssue matching FailJob rule at index 0`.
   -->

   在 Job 状态中，看到任务 `Failed` 状况的 `reason` 字段等于 `PodFailurePolicy`。
   此外，`message` 字段包含了与 Job 终止相关的更多详细信息，例如：
   `Pod default/job-pod-failure-policy-config-issue-k6pvp has condition ConfigIssue matching FailJob rule at index 0`。

{{< note >}}
<!--
In a production environment, the steps 3 and 4 should be automated by a
user-provided controller.
-->
在生产环境中，第 3 和 4 步应由用户提供的控制器进行自动化处理。
{{< /note >}}

<!--
#### Cleaning up

Delete the Job you created:
-->
#### 清理

删除你创建的 Job：

```sh
kubectl delete jobs/job-pod-failure-policy-config-issue
```

<!--
The cluster automatically cleans up the Pods.
-->
集群自动清理 Pod。

<!--
### Using Pod Failure Policy to avoid unnecessary Pod retries per index {#backoff-limit-per-index-failindex}

To avoid unnecessary Pod restarts per index, you can use the _Pod failure policy_ and
_backoff limit per index_ features. This section of the page shows how to use these features
together.
-->
### 使用 Pod 失效策略按索引避免不必要的 Pod 重试   {#backoff-limit-per-index-failindex}

为了按索引避免不必要的 Pod 重启，你可以结合使用 **Pod 失效策略**和**按索引的回退限制**特性。
本节将展示如何同时使用这两个特性。

<!--
1. Examine the following manifest:
-->
1. 检查以下清单文件：
   
   {{% code_sample file="/controllers/job-backoff-limit-per-index-failindex.yaml" %}}

<!--
1. Apply the manifest:
-->
2. 应用此清单：

   ```sh
   kubectl create -f https://k8s.io/examples/controllers/job-backoff-limit-per-index-failindex.yaml
   ```

<!--
1. After around 15 seconds, inspect the status of the Pods for the Job. You can do that by running:
-->
3. 大约 15 秒后，检查 Job 所对应的 Pod 状态。你可以运行以下命令：

   ```shell
   kubectl get pods -l job-name=job-backoff-limit-per-index-failindex -o yaml
   ```

   <!--
   You will see output similar to this:
   -->

   你将看到类似如下的输出：

   ```none
   NAME                                            READY   STATUS      RESTARTS   AGE
   job-backoff-limit-per-index-failindex-0-4g4cm   0/1     Error       0          4s
   job-backoff-limit-per-index-failindex-0-fkdzq   0/1     Error       0          15s
   job-backoff-limit-per-index-failindex-1-2bgdj   0/1     Error       0          15s
   job-backoff-limit-per-index-failindex-2-vs6lt   0/1     Completed   0          11s
   job-backoff-limit-per-index-failindex-3-s7s47   0/1     Completed   0          6s
   ```

   <!--
   Note that the output shows the following:

   * Two Pods have index 0, because of the backoff limit allowed for one retry
   of the index.
   * Only one Pod has index 1, because the exit code of the failed Pod matched
   the Pod failure policy with the `FailIndex` action.
   -->

   注意输出显示了以下几点：

   * 索引为 0 的 Pod 有两个，因为回退限制允许该索引重试一次。
   * 索引为 1 的 Pod 只有一个，因为失效 Pod 的退出码符合 Pod 失效策略中指定的 `FailIndex` 动作。


<!--
1. Inspect the status of the Job by running:
-->
4. 运行以下命令来查看 Job 的状态：

   ```sh
   kubectl get jobs -l job-name=job-backoff-limit-per-index-failindex -o yaml
   ```

   <!--
   In the Job status, see that the `failedIndexes` field shows "0,1", because
   both indexes failed. Because the index 1 was not retried the number of failed
   Pods, indicated by the status field "failed" equals 3.
   -->

   在 Job 的状态中，可以看到 `failedIndexes` 字段显示为 "0,1"，表示两个索引都失效了。
   由于索引 1 未被重试，状态字段中的 `failed` 值为 3，表示有 3 个失效的 Pod。

<!--
#### Cleaning up

Delete the Job you created:
-->
#### 清理

删除你创建的 Job：

```sh
kubectl delete jobs/job-backoff-limit-per-index-failindex
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
