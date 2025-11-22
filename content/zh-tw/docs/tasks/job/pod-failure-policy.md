---
title: 使用 Pod 失效策略處理可重試和不可重試的 Pod 失效
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
本文向你展示如何結合預設的 [Pod 回退失效策略](/zh-cn/docs/concepts/workloads/controllers/job#pod-backoff-failure-policy)來使用
[Pod 失效策略](/zh-cn/docs/concepts/workloads/controllers/job#pod-failure-policy)，
以改善 {{<glossary_tooltip text="Job" term_id="job">}} 內處理容器級別或 Pod 級別的失效。

<!--
The definition of Pod failure policy may help you to:
* better utilize the computational resources by avoiding unnecessary Pod retries.
* avoid Job failures due to Pod disruptions (such {{<glossary_tooltip text="preemption" term_id="preemption" >}},
{{<glossary_tooltip text="API-initiated eviction" term_id="api-eviction" >}}
or {{<glossary_tooltip text="taint" term_id="taint" >}}-based eviction).
-->
Pod 失效策略的定義可以幫助你：
* 避免不必要的 Pod 重試，以更好地利用計算資源。
* 避免由於 Pod 干擾（例如{{<glossary_tooltip text="搶佔" term_id="preemption" >}}、
  {{<glossary_tooltip text="API 發起的驅逐" term_id="api-eviction" >}}或基於{{<glossary_tooltip text="污點" term_id="taint" >}}的驅逐）
  而造成的 Job 失敗。

## {{% heading "prerequisites" %}}

<!--
You should already be familiar with the basic use of [Job](/docs/concepts/workloads/controllers/job/).
-->
你應該已熟悉了 [Job](/zh-cn/docs/concepts/workloads/controllers/job/) 的基本用法。

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!--
## Usage scenarios

Consider the following usage scenarios for Jobs that define a Pod failure policy :
- [Avoiding unnecessary Pod retries](#pod-failure-policy-failjob)
- [Ignoring Pod disruptions](#pod-failure-policy-ignore)
- [Avoiding unnecessary Pod retries based on custom Pod Conditions](#pod-failure-policy-config-issue)
- [Avoiding unnecessary Pod retries per index](#backoff-limit-per-index-failindex)
-->
## 使用場景   {#usage-scenarios}

針對定義了 Pod 失效策略的 Job，可以考慮以下一些使用場景：

- [避免不必要的 Pod 重試](#pod-failure-policy-failjob)  
- [忽略 Pod 干擾](#pod-failure-policy-ignore)  
- [基於自定義 Pod 狀況避免不必要的 Pod 重試](#pod-failure-policy-config-issue)  
- [按索引避免不必要的 Pod 重試](#backoff-limit-per-index-failindex)

<!--
### Using Pod failure policy to avoid unnecessary Pod retries {#pod-failure-policy-failjob}

With the following example, you can learn how to use Pod failure policy to
avoid unnecessary Pod restarts when a Pod failure indicates a non-retriable
software bug.
-->
## 使用 Pod 失效策略以避免不必要的 Pod 重試  {#using-pod-failure-policy-to-avoid-unecessary-pod-retries}

借用以下示例，你可以學習在 Pod 失效表明有一個不可重試的軟體漏洞時如何使用
Pod 失效策略來避免不必要的 Pod 重啓。

<!--
1. Examine the following manifest:
-->
1. 檢查以下清單檔案：

   {{% code_sample file="/controllers/job-pod-failure-policy-failjob.yaml" %}}

<!--
1. Apply the manifest:
-->
2. 應用此清單：

   ```sh
   kubectl create -f https://k8s.io/examples/controllers/job-pod-failure-policy-failjob.yaml
   ```

<!--
1. After around 30 seconds the entire Job should be terminated. Inspect the status of the Job by running:
-->
3. 大約 30 秒後，整個 Job 應被終止。通過運行以下命令來查看 Job 的狀態：

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

   在 Job 狀態中，顯示以下狀況資訊：

   - `FailureTarget` 狀況：有一個設置爲 `PodFailurePolicy` 的 `reason`
     字段和一個包含更多有關終止資訊的 `message` 字段，例如
    `Container main for pod default/job-pod-failure-policy-failjob-8ckj8 failed with exit code 42 matching FailJob rule at index 0`。
     一旦 Job 被視爲失敗，Job 控制器就會添加此狀況。有關詳細資訊，請參閱
     [Job Pod 的終止](/zh-cn/docs/concepts/workloads/controllers/job/#termination-of-job-pods)。
   - `Failed`：與 `FailureTarget` 狀況相同的 `reason` 和 `message`。
     Job 控制器會在 Job 的所有 Pod 終止後添加此狀況。

   <!--
   For comparison, if the Pod failure policy was disabled it would take 6 retries
   of the Pod, taking at least 2 minutes.
   -->

   爲了比較，如果 Pod 失效策略被禁用，將會讓 Pod 重試 6 次，用時至少 2 分鐘。

<!--
#### Clean up

Delete the Job you created:
-->
#### 清理

刪除你創建的 Job：

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
叢集自動清理這些 Pod。

### 使用 Pod 失效策略來忽略 Pod 干擾  {#pod-failure-policy-ignore}

通過以下示例，你可以學習如何使用 Pod 失效策略將 Pod 重試計數器朝着 `.spec.backoffLimit` 限制遞增來忽略 Pod 干擾。

{{< caution >}}
<!--
Timing is important for this example, so you may want to read the steps before
execution. In order to trigger a Pod disruption it is important to drain the
node while the Pod is running on it (within 90s since the Pod is scheduled).
-->
這個示例的時機比較重要，因此你可能需要在執行之前閱讀這些步驟。
爲了觸發 Pod 干擾，重要的是在 Pod 在其上運行時（自 Pod 調度後的 90 秒內）騰空節點。
{{< /caution >}}

<!--
1. Examine the following manifest:
-->
1. 檢查以下清單檔案：

   {{% code_sample file="/controllers/job-pod-failure-policy-ignore.yaml" %}}

<!--
1. Apply the manifest:
-->
2. 應用此清單：

   ```sh
   kubectl create -f https://k8s.io/examples/controllers/job-pod-failure-policy-ignore.yaml
   ```

<!--
1. Run this command to check the `nodeName` the Pod is scheduled to:
-->
3. 運行以下這條命令檢查 Pod 被調度到的 `nodeName`：

   ```sh
   nodeName=$(kubectl get pods -l job-name=job-pod-failure-policy-ignore -o jsonpath='{.items[0].spec.nodeName}')
   ```

<!--
1. Drain the node to evict the Pod before it completes (within 90s):
-->
4. 騰空該節點以便在 Pod 完成任務之前將其驅逐（90 秒內）：

   ```sh
   kubectl drain nodes/$nodeName --ignore-daemonsets --grace-period=0
   ```

<!--
1. Inspect the `.status.failed` to check the counter for the Job is not incremented:
-->
5. 查看 `.status.failed` 以檢查針對 Job 的計數器未遞增：

   ```sh
   kubectl get jobs -l job-name=job-pod-failure-policy-ignore -o yaml
   ```

<!--
1. Uncordon the node:
-->
6. 解除節點的保護：

   ```sh
   kubectl uncordon nodes/$nodeName
   ```

<!--
The Job resumes and succeeds.

For comparison, if the Pod failure policy was disabled the Pod disruption would
result in terminating the entire Job (as the `.spec.backoffLimit` is set to 0).
-->
Job 恢復併成功完成。

爲了比較，如果 Pod 失效策略被禁用，Pod 干擾將使得整個 Job 終止（隨着 `.spec.backoffLimit` 設置爲 0）。

<!--
#### Cleaning up

Delete the Job you created:
-->
#### 清理

刪除你創建的 Job：

```sh
kubectl delete jobs/job-pod-failure-policy-ignore
```

<!--
The cluster automatically cleans up the Pods.
-->
叢集自動清理 Pod。

<!--
### Using Pod failure policy to avoid unnecessary Pod retries based on custom Pod Conditions {#pod-failure-policy-config-issue}

With the following example, you can learn how to use Pod failure policy to
avoid unnecessary Pod restarts based on custom Pod Conditions.
-->
### 基於自定義 Pod 狀況使用 Pod 失效策略避免不必要的 Pod 重試   {#pod-failure-policy-config-issue}

根據以下示例，你可以學習如何基於自定義 Pod 狀況使用 Pod 失效策略避免不必要的 Pod 重啓。

{{< note >}}
<!--
The example below works since version 1.27 as it relies on transitioning of
deleted pods, in the `Pending` phase, to a terminal phase
(see: [Pod Phase](/docs/concepts/workloads/pods/pod-lifecycle/#pod-phase)).
-->
以下示例自 v1.27 起開始生效，因爲它依賴於將已刪除的 Pod 從 `Pending` 階段過渡到終止階段
（參閱 [Pod 階段](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#pod-phase)）。
{{< /note >}}

<!--
1. Examine the following manifest:
-->
1. 檢查以下清單檔案：

   {{% code_sample file="/controllers/job-pod-failure-policy-config-issue.yaml" %}}

<!--
1. Apply the manifest:
-->
2. 應用此清單：

   ```sh
   kubectl create -f https://k8s.io/examples/controllers/job-pod-failure-policy-config-issue.yaml
   ```

   <!--
   Note that, the image is misconfigured, as it does not exist.
   -->
   請注意，映像檔設定不正確，因爲該映像檔不存在。

<!--
1. Inspect the status of the job's Pods by running:
-->
3. 通過執行以下命令檢查任務 Pod 的狀態：

   ```sh
   kubectl get pods -l job-name=job-pod-failure-policy-config-issue -o yaml
   ```

   <!--
   You will see output similar to this:
   -->
   你將看到類似以下輸出：

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
   請注意，Pod 依然處於 `Pending` 階段，因爲它無法拉取錯誤設定的映像檔。
   原則上講這可能是一個暫時問題，映像檔還是會被拉取。然而這種情況下，
   映像檔不存在，因爲我們通過一個自定義狀況表明了這個事實。

<!--
1. Add the custom condition. First prepare the patch by running:
-->
4. 添加自定義狀況。執行以下命令先準備補丁：

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

   其次，執行以下命令選擇通過任務創建的其中一個 Pod：

   ```
   podName=$(kubectl get pods -l job-name=job-pod-failure-policy-config-issue -o jsonpath='{.items[0].metadata.name}')
   ```

   <!--
   Then, apply the patch on one of the pods by running the following command:
   -->

   隨後執行以下命令將補丁應用到其中一個 Pod 上：

   ```sh
   kubectl patch pod $podName --subresource=status --patch-file=patch.yaml
   ```

   <!--
   If applied successfully, you will get a notification like this:
   -->

   如果被成功應用，你將看到類似以下的一條通知：

   ```sh
   pod/job-pod-failure-policy-config-issue-k6pvp patched
   ```

<!--
1. Delete the pod to transition it to `Failed` phase, by running the command:
-->
5. 執行以下命令刪除此 Pod 將其過渡到 `Failed` 階段：

   ```sh
   kubectl delete pods/$podName
   ```

<!--
1. Inspect the status of the Job by running:
-->
6. 執行以下命令查驗 Job 的狀態：

   ```sh
   kubectl get jobs -l job-name=job-pod-failure-policy-config-issue -o yaml
   ```

   <!--
   In the Job status, see a job `Failed` condition with the field `reason`
   equal `PodFailurePolicy`. Additionally, the `message` field contains a
   more detailed information about the Job termination, such as:
   `Pod default/job-pod-failure-policy-config-issue-k6pvp has condition ConfigIssue matching FailJob rule at index 0`.
   -->

   在 Job 狀態中，看到任務 `Failed` 狀況的 `reason` 字段等於 `PodFailurePolicy`。
   此外，`message` 字段包含了與 Job 終止相關的更多詳細資訊，例如：
   `Pod default/job-pod-failure-policy-config-issue-k6pvp has condition ConfigIssue matching FailJob rule at index 0`。

{{< note >}}
<!--
In a production environment, the steps 3 and 4 should be automated by a
user-provided controller.
-->
在生產環境中，第 3 和 4 步應由使用者提供的控制器進行自動化處理。
{{< /note >}}

<!--
#### Cleaning up

Delete the Job you created:
-->
#### 清理

刪除你創建的 Job：

```sh
kubectl delete jobs/job-pod-failure-policy-config-issue
```

<!--
The cluster automatically cleans up the Pods.
-->
叢集自動清理 Pod。

<!--
### Using Pod Failure Policy to avoid unnecessary Pod retries per index {#backoff-limit-per-index-failindex}

To avoid unnecessary Pod restarts per index, you can use the _Pod failure policy_ and
_backoff limit per index_ features. This section of the page shows how to use these features
together.
-->
### 使用 Pod 失效策略按索引避免不必要的 Pod 重試   {#backoff-limit-per-index-failindex}

爲了按索引避免不必要的 Pod 重啓，你可以結合使用 **Pod 失效策略**和**按索引的回退限制**特性。
本節將展示如何同時使用這兩個特性。

<!--
1. Examine the following manifest:
-->
1. 檢查以下清單檔案：
   
   {{% code_sample file="/controllers/job-backoff-limit-per-index-failindex.yaml" %}}

<!--
1. Apply the manifest:
-->
2. 應用此清單：

   ```sh
   kubectl create -f https://k8s.io/examples/controllers/job-backoff-limit-per-index-failindex.yaml
   ```

<!--
1. After around 15 seconds, inspect the status of the Pods for the Job. You can do that by running:
-->
3. 大約 15 秒後，檢查 Job 所對應的 Pod 狀態。你可以運行以下命令：

   ```shell
   kubectl get pods -l job-name=job-backoff-limit-per-index-failindex -o yaml
   ```

   <!--
   You will see output similar to this:
   -->

   你將看到類似如下的輸出：

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

   注意輸出顯示了以下幾點：

   * 索引爲 0 的 Pod 有兩個，因爲回退限制允許該索引重試一次。
   * 索引爲 1 的 Pod 只有一個，因爲失效 Pod 的退出碼符合 Pod 失效策略中指定的 `FailIndex` 動作。


<!--
1. Inspect the status of the Job by running:
-->
4. 運行以下命令來查看 Job 的狀態：

   ```sh
   kubectl get jobs -l job-name=job-backoff-limit-per-index-failindex -o yaml
   ```

   <!--
   In the Job status, see that the `failedIndexes` field shows "0,1", because
   both indexes failed. Because the index 1 was not retried the number of failed
   Pods, indicated by the status field "failed" equals 3.
   -->

   在 Job 的狀態中，可以看到 `failedIndexes` 字段顯示爲 "0,1"，表示兩個索引都失效了。
   由於索引 1 未被重試，狀態字段中的 `failed` 值爲 3，表示有 3 個失效的 Pod。

<!--
#### Cleaning up

Delete the Job you created:
-->
#### 清理

刪除你創建的 Job：

```sh
kubectl delete jobs/job-backoff-limit-per-index-failindex
```

<!--
The cluster automatically cleans up the Pods.
-->
叢集自動清理 Pod。

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

通過指定 Job 的 `.spec.backoffLimit` 字段，你可以完全依賴
[Pod 回退失效策略](/zh-cn/docs/concepts/workloads/controllers/job#pod-backoff-failure-policy)。
然而在許多情況下，難題在於如何找到一個平衡，爲 `.spec.backoffLimit` 設置一個較小的值以避免不必要的 Pod 重試，
同時這個值又足以確保 Job 不會因 Pod 干擾而終止。
