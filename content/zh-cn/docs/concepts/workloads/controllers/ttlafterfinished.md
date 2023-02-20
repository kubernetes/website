---
title: 已完成 Job 的自动清理
content_type: concept
weight: 70
description: >-
  一种用于清理已完成执行的旧 Job 的 TTL 机制。
---
<!--
reviewers:
- janetkuo
title: Automatic Cleanup for Finished Jobs
content_type: concept
weight: 70
description: >-
  A time-to-live mechanism to clean up old Jobs that have finished execution.
-->

<!-- overview -->

{{< feature-state for_k8s_version="v1.23" state="stable" >}}

<!--
When your Job has finished, it's useful to keep that Job in the API (and not immediately delete the Job)
so that you can tell whether the Job succeeded or failed.

Kubernetes' TTL-after-finished {{<glossary_tooltip text="controller" term_id="controller">}} provides a
TTL (time to live) mechanism to limit the lifetime of Job objects that
have finished execution.
-->
当你的 Job 已结束时，将 Job 保留在 API 中（而不是立即删除 Job）很有用，
这样你就可以判断 Job 是成功还是失败。

Kubernetes TTL-after-finished {{<glossary_tooltip text="控制器" term_id="controller">}}提供了一种
TTL 机制来限制已完成执行的 Job 对象的生命期。

<!-- body -->

<!--
## Cleanup for finished Jobs

The TTL-after-finished controller is only supported for Jobs. You can use this mechanism to clean
up finished Jobs (either `Complete` or `Failed`) automatically by specifying the
`.spec.ttlSecondsAfterFinished` field of a Job, as in this
[example](/docs/concepts/workloads/controllers/job/#clean-up-finished-jobs-automatically).
-->
## 清理已完成的 Job   {#cleanup-for-finished-jobs}

TTL-after-finished 控制器只支持 Job。你可以通过指定 Job 的 `.spec.ttlSecondsAfterFinished`
字段来自动清理已结束的 Job（`Complete` 或 `Failed`），
如[示例](/zh-cn/docs/concepts/workloads/controllers/job/#clean-up-finished-jobs-automatically)所示。

<!--
The TTL-after-finished controller assumes that a Job is eligible to be cleaned up
TTL seconds after the Job has finished. The timer starts once the
status condition of the Job changes to show that the Job is either `Complete` or `Failed`; once the TTL has
expired, that Job becomes eligible for
[cascading](/docs/concepts/architecture/garbage-collection/#cascading-deletion) removal. When the
TTL-after-finished controller cleans up a job, it will delete it cascadingly, that is to say it will delete
its dependent objects together with it.
-->
TTL-after-finished 控制器假设 Job 能在执行完成后的 TTL 秒内被清理。一旦 Job
的状态条件发生变化表明该 Job 是 `Complete` 或 `Failed`，计时器就会启动；一旦 TTL 已过期，该 Job
就能被[级联删除](/zh-cn/docs/concepts/architecture/garbage-collection/#cascading-deletion)。
当 TTL 控制器清理作业时，它将做级联删除操作，即删除 Job 的同时也删除其依赖对象。

<!--
Kubernetes honors object lifecycle guarantees on the Job, such as waiting for
[finalizers](/docs/concepts/overview/working-with-objects/finalizers/).

You can set the TTL seconds at any time. Here are some examples for setting the
`.spec.ttlSecondsAfterFinished` field of a Job:
-->
Kubernetes 尊重 Job 对象的生命周期保证，例如等待
[Finalizer](/zh-cn/docs/concepts/overview/working-with-objects/finalizers/)。

你可以随时设置 TTL 秒。以下是设置 Job 的 `.spec.ttlSecondsAfterFinished` 字段的一些示例：

<!--
* Specify this field in the Job manifest, so that a Job can be cleaned up
  automatically some time after it finishes.
* Manually set this field of existing, already finished Jobs, so that they become eligible
  for cleanup.
* Use a
  [mutating admission webhook](/docs/reference/access-authn-authz/admission-controllers/#mutatingadmissionwebhook)
  to set this field dynamically at Job creation time. Cluster administrators can
  use this to enforce a TTL policy for finished jobs.
-->
* 在 Job 清单（manifest）中指定此字段，以便 Job 在完成后的某个时间被自动清理。
* 手动设置现有的、已完成的 Job 的此字段，以便这些 Job 可被清理。
* 在创建 Job 时使用[修改性质的准入 Webhook](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#mutatingadmissionwebhook)
  动态设置该字段。集群管理员可以使用它对已完成的作业强制执行 TTL 策略。
<!--
* Use a
  [mutating admission webhook](/docs/reference/access-authn-authz/admission-controllers/#mutatingadmissionwebhook)
  to set this field dynamically after the Job has finished, and choose
  different TTL values based on job status, labels. For this case, the webhook needs
  to detect changes to the `.status` of the Job and only set a TTL when the Job
  is being marked as completed.
* Write your own controller to manage the cleanup TTL for Jobs that match a particular
  {{< glossary_tooltip term_id="selector" text="selector-selector" >}}.
-->
* 使用[修改性质的准入 Webhook](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#mutatingadmissionwebhook)
  在 Job 完成后动态设置该字段，并根据 Job 状态、标签等选择不同的 TTL 值。
  对于这种情况，Webhook 需要检测 Job 的 `.status` 变化，并且仅在 Job 被标记为已完成时设置 TTL。
* 编写你自己的控制器来管理与特定{{< glossary_tooltip term_id="selector" text="选择算符" >}}匹配的
  Job 的清理 TTL。

<!--
## Caveats

### Updating TTL for finished Jobs

You can modify the TTL period, e.g. `.spec.ttlSecondsAfterFinished` field of Jobs,
after the job is created or has finished. If you extend the TTL period after the
existing `ttlSecondsAfterFinished` period has expired, Kubernetes doesn't guarantee
to retain that Job, even if an update to extend the TTL returns a successful API
response.
-->
## 警告  {#caveats}

### 更新已完成 Job 的 TTL  {#updating-ttl-for-finished-jobs}

在创建 Job 或已经执行结束后，你仍可以修改其 TTL 周期，例如 Job 的
`.spec.ttlSecondsAfterFinished` 字段。
如果你在当前 `ttlSecondsAfterFinished` 时长已过期后延长 TTL 周期，
即使延长 TTL 的更新得到了成功的 API 响应，Kubernetes 也不保证保留此 Job，

<!--
### Time skew

Because the TTL-after-finished controller uses timestamps stored in the Kubernetes jobs to
determine whether the TTL has expired or not, this feature is sensitive to time
skew in your cluster, which may cause the control plane to clean up Job objects
at the wrong time.
-->
### 时间偏差  {#time-skew}

由于 TTL-after-finished 控制器使用存储在 Kubernetes Job 中的时间戳来确定 TTL 是否已过期，
因此该功能对集群中的时间偏差很敏感，这可能导致控制平面在错误的时间清理 Job 对象。

<!--
Clocks aren't always correct, but the difference should be
very small. Please be aware of this risk when setting a non-zero TTL.
-->
时钟并不总是如此正确，但差异应该很小。
设置非零 TTL 时请注意避免这种风险。

## {{% heading "whatsnext" %}}

<!--
* Read [Clean up Jobs automatically](/docs/concepts/workloads/controllers/job/#clean-up-finished-jobs-automatically)

* Refer to the [Kubernetes Enhancement Proposal](https://github.com/kubernetes/enhancements/blob/master/keps/sig-apps/592-ttl-after-finish/README.md)
  (KEP) for adding this mechanism.
-->
* 阅读[自动清理 Job](/zh-cn/docs/concepts/workloads/controllers/job/#clean-up-finished-jobs-automatically)

* 参阅 [Kubernetes 增强提案](https://github.com/kubernetes/enhancements/blob/master/keps/sig-apps/592-ttl-after-finish/README.md)
  (KEP) 了解此机制的演进过程。

