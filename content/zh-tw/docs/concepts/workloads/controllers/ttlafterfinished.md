---
title: 已完成 Job 的自動清理
content_type: concept
weight: 70
description: >-
  一種用於清理已完成執行的舊 Job 的 TTL 機制。
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
當你的 Job 已結束時，將 Job 保留在 API 中（而不是立即刪除 Job）很有用，
這樣你就可以判斷 Job 是成功還是失敗。

Kubernetes TTL-after-finished {{<glossary_tooltip text="控制器" term_id="controller">}}提供了一種
TTL 機制來限制已完成執行的 Job 對象的生命期。

<!-- body -->

<!--
## Cleanup for finished Jobs

The TTL-after-finished controller is only supported for Jobs. You can use this mechanism to clean
up finished Jobs (either `Complete` or `Failed`) automatically by specifying the
`.spec.ttlSecondsAfterFinished` field of a Job, as in this
[example](/docs/concepts/workloads/controllers/job/#clean-up-finished-jobs-automatically).
-->
## 清理已完成的 Job   {#cleanup-for-finished-jobs}

TTL-after-finished 控制器只支持 Job。你可以通過指定 Job 的 `.spec.ttlSecondsAfterFinished`
字段來自動清理已結束的 Job（`Complete` 或 `Failed`），
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
TTL-after-finished 控制器假設 Job 能在執行完成後的 TTL 秒內被清理。一旦 Job
的狀態條件發生變化表明該 Job 是 `Complete` 或 `Failed`，計時器就會啓動；一旦 TTL 已過期，該 Job
就能被[級聯刪除](/zh-cn/docs/concepts/architecture/garbage-collection/#cascading-deletion)。
當 TTL 控制器清理作業時，它將做級聯刪除操作，即刪除 Job 的同時也刪除其依賴對象。

<!--
Kubernetes honors object lifecycle guarantees on the Job, such as waiting for
[finalizers](/docs/concepts/overview/working-with-objects/finalizers/).

You can set the TTL seconds at any time. Here are some examples for setting the
`.spec.ttlSecondsAfterFinished` field of a Job:
-->
Kubernetes 尊重 Job 對象的生命週期保證，例如等待
[Finalizer](/zh-cn/docs/concepts/overview/working-with-objects/finalizers/)。

你可以隨時設置 TTL 秒。以下是設置 Job 的 `.spec.ttlSecondsAfterFinished` 字段的一些示例：

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
* 在 Job 清單（manifest）中指定此字段，以便 Job 在完成後的某個時間被自動清理。
* 手動設置現有的、已完成的 Job 的此字段，以便這些 Job 可被清理。
* 在創建 Job 時使用[修改性質的准入 Webhook](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#mutatingadmissionwebhook)
  動態設置該字段。叢集管理員可以使用它對已完成的作業強制執行 TTL 策略。
<!--
* Use a
  [mutating admission webhook](/docs/reference/access-authn-authz/admission-controllers/#mutatingadmissionwebhook)
  to set this field dynamically after the Job has finished, and choose
  different TTL values based on job status, labels. For this case, the webhook needs
  to detect changes to the `.status` of the Job and only set a TTL when the Job
  is being marked as completed.
* Write your own controller to manage the cleanup TTL for Jobs that match a particular
  {{< glossary_tooltip term_id="selector" text="selector" >}}.
-->
* 使用[修改性質的准入 Webhook](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#mutatingadmissionwebhook)
  在 Job 完成後動態設置該字段，並根據 Job 狀態、標籤等選擇不同的 TTL 值。
  對於這種情況，Webhook 需要檢測 Job 的 `.status` 變化，並且僅在 Job 被標記爲已完成時設置 TTL。
* 編寫你自己的控制器來管理與特定{{< glossary_tooltip term_id="selector" text="選擇算符" >}}匹配的
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

在創建 Job 或已經執行結束後，你仍可以修改其 TTL 週期，例如 Job 的
`.spec.ttlSecondsAfterFinished` 字段。
如果你在當前 `ttlSecondsAfterFinished` 時長已過期後延長 TTL 週期，
即使延長 TTL 的更新得到了成功的 API 響應，Kubernetes 也不保證保留此 Job，

<!--
### Time skew

Because the TTL-after-finished controller uses timestamps stored in the Kubernetes jobs to
determine whether the TTL has expired or not, this feature is sensitive to time
skew in your cluster, which may cause the control plane to clean up Job objects
at the wrong time.
-->
### 時間偏差  {#time-skew}

由於 TTL-after-finished 控制器使用存儲在 Kubernetes Job 中的時間戳來確定 TTL 是否已過期，
因此該功能對叢集中的時間偏差很敏感，這可能導致控制平面在錯誤的時間清理 Job 對象。

<!--
Clocks aren't always correct, but the difference should be
very small. Please be aware of this risk when setting a non-zero TTL.
-->
時鐘並不總是如此正確，但差異應該很小。
設置非零 TTL 時請注意避免這種風險。

## {{% heading "whatsnext" %}}

<!--
* Read [Clean up Jobs automatically](/docs/concepts/workloads/controllers/job/#clean-up-finished-jobs-automatically)

* Refer to the [Kubernetes Enhancement Proposal](https://github.com/kubernetes/enhancements/blob/master/keps/sig-apps/592-ttl-after-finish/README.md)
  (KEP) for adding this mechanism.
-->
* 閱讀[自動清理 Job](/zh-cn/docs/concepts/workloads/controllers/job/#clean-up-finished-jobs-automatically)

* 參閱 [Kubernetes 增強提案](https://github.com/kubernetes/enhancements/blob/master/keps/sig-apps/592-ttl-after-finish/README.md)
  (KEP) 瞭解此機制的演進過程。

