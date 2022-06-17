---
title: 已完成 Job 的自動清理
content_type: concept
weight: 70
---
<!--
title: Automatic Clean-up for Finished Jobs
content_type: concept
weight: 70
-->

<!-- overview -->

{{< feature-state for_k8s_version="v1.23" state="stable" >}}

<!--
TTL-after-finished {{<glossary_tooltip text="controller" term_id="controller">}} provides a 
TTL (time to live) mechanism to limit the lifetime of resource objects that 
have finished execution. TTL controller only handles 
{{< glossary_tooltip text="Jobs" term_id="job" >}}.
-->
TTL-after-finished {{<glossary_tooltip text="控制器" term_id="controller">}} 提供了一種 TTL 機制來限制已完成執行的資源物件的生命週期。
TTL 控制器目前只處理 {{< glossary_tooltip text="Job" term_id="job" >}}。


<!-- body -->

<!--
## TTL-after-finished Controller

The TTL-after-finished controller is only supported for Jobs. A cluster operator can use this feature to clean
up finished Jobs (either `Complete` or `Failed`) automatically by specifying the
`.spec.ttlSecondsAfterFinished` field of a Job, as in this
[example](/docs/concepts/workloads/controllers/job/#clean-up-finished-jobs-automatically).
-->
## TTL-after-finished 控制器

TTL-after-finished 控制器只支援 Job。叢集操作員可以透過指定 Job 的 `.spec.ttlSecondsAfterFinished`
欄位來自動清理已結束的作業（`Complete` 或 `Failed`），如
[示例](/zh-cn/docs/concepts/workloads/controllers/job/#clean-up-finished-jobs-automatically)
所示。

<!--
The TTL-after-finished controller will assume that a job is eligible to be cleaned up
TTL seconds after the job has finished, in other words, when the TTL has expired. When the
TTL-after-finished controller cleans up a job, it will delete it cascadingly, that is to say it will delete
its dependent objects together with it. Note that when the job is deleted,
its lifecycle guarantees, such as finalizers, will be honored.
-->
TTL-after-finished 控制器假設作業能在執行完成後的 TTL 秒內被清理，也就是當 TTL 過期後。
當 TTL 控制器清理作業時，它將做級聯刪除操作，即刪除資源物件的同時也刪除其依賴物件。
注意，當資源被刪除時，由該資源的生命週期保證其終結器（Finalizers）等被執行。

<!--
The TTL seconds can be set at any time. Here are some examples for setting the
`.spec.ttlSecondsAfterFinished` field of a Job:
-->
可以隨時設定 TTL 秒。以下是設定 Job 的 `.spec.ttlSecondsAfterFinished` 欄位的一些示例：

<!--
* Specify this field in the job manifest, so that a Job can be cleaned up
  automatically some time after it finishes.
* Set this field of existing, already finished jobs, to adopt this new feature.
* Use a
  [mutating admission webhook](/docs/reference/access-authn-authz/extensible-admission-controllers/#admission-webhooks)
  to set this field dynamically at job creation time. Cluster administrators can
  use this to enforce a TTL policy for finished jobs.
* Use a
  [mutating admission webhook](/docs/reference/access-authn-authz/extensible-admission-controllers/#admission-webhooks)
  to set this field dynamically after the job has finished, and choose
  different TTL values based on job status, labels, etc.
-->
* 在作業清單（manifest）中指定此欄位，以便 Job 在完成後的某個時間被自動清除。
* 將此欄位設定為現有的、已完成的作業，以採用此新功能。
* 在建立作業時使用 [mutating admission webhook](/zh-cn/docs/reference/access-authn-authz/extensible-admission-controllers/#admission-webhooks)
  動態設定該欄位。叢集管理員可以使用它對完成的作業強制執行 TTL 策略。
* 使用 [mutating admission webhook](/zh-cn/docs/reference/access-authn-authz/extensible-admission-controllers/#admission-webhooks)
  在作業完成後動態設定該欄位，並根據作業狀態、標籤等選擇不同的 TTL 值。

<!--
## Caveat

### Updating TTL Seconds

Note that the TTL period, e.g. `.spec.ttlSecondsAfterFinished` field of Jobs,
can be modified after the job is created or has finished. However, once the
Job becomes eligible to be deleted (when the TTL has expired), the system won't
guarantee that the Jobs will be kept, even if an update to extend the TTL
returns a successful API response.
-->
## 警告

### 更新 TTL 秒數

請注意，在建立 Job 或已經執行結束後，仍可以修改其 TTL 週期，例如 Job 的
`.spec.ttlSecondsAfterFinished` 欄位。
但是一旦 Job 變為可被刪除狀態（當其 TTL 已過期時），即使你透過 API 增加其 TTL
時長得到了成功的響應，系統也不保證 Job 將被保留。

<!--
### Time Skew

Because TTL-after-finished controller uses timestamps stored in the Kubernetes resources to
determine whether the TTL has expired or not, this feature is sensitive to time
skew in the cluster, which may cause TTL-after-finished controller to clean up resource objects
at the wrong time.
-->
### 時間偏差  {#time-skew}

由於 TTL-after-finished 控制器使用儲存在 Kubernetes 資源中的時間戳來確定 TTL 是否已過期，
因此該功能對叢集中的時間偏差很敏感，這可能導致 TTL-after-finished 控制器在錯誤的時間清理資源物件。

<!--
Clocks aren't always correct, but the difference should be
very small. Please be aware of this risk when setting a non-zero TTL.
-->
時鐘並不總是如此正確，但差異應該很小。
設定非零 TTL 時請注意避免這種風險。

## {{% heading "whatsnext" %}}

<!--
* [Clean up Jobs automatically](/docs/concepts/workloads/controllers/jobs-run-to-completion/#clean-up-finished-jobs-automatically)
* [Design doc](https://github.com/kubernetes/enhancements/blob/master/keps/sig-apps/592-ttl-after-finish/README.md)
-->
* [自動清理 Job](/zh-cn/docs/concepts/workloads/controllers/job/#clean-up-finished-jobs-automatically)
* [設計文件](https://github.com/kubernetes/enhancements/blob/master/keps/sig-apps/592-ttl-after-finish/README.md)

