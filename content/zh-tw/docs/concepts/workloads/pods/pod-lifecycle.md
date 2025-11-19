---
title: Pod 的生命週期
content_type: concept
weight: 30
math: true
---
<!--
title: Pod Lifecycle
content_type: concept
weight: 30
math: true
-->

<!-- overview -->

<!--
This page describes the lifecycle of a Pod. Pods follow a defined lifecycle, starting
in the `Pending` [phase](#pod-phase), moving through `Running` if at least one
of its primary containers starts OK, and then through either the `Succeeded` or
`Failed` phases depending on whether any container in the Pod terminated in failure.
-->
本頁面講述 Pod 的生命週期。
Pod 遵循預定義的生命週期，起始於 `Pending` [階段](#pod-phase)，
如果至少其中有一個主要容器正常啓動，則進入 `Running`，之後取決於 Pod
中是否有容器以失敗狀態結束而進入 `Succeeded` 或者 `Failed` 階段。

<!--
Like individual application containers, Pods are considered to be relatively
ephemeral (rather than durable) entities. Pods are created, assigned a unique
ID ([UID](/docs/concepts/overview/working-with-objects/names/#uids)), and scheduled
to run on nodes where they remain until termination (according to restart policy) or
deletion.
If a {{< glossary_tooltip term_id="node" >}} dies, the Pods running on (or scheduled
to run on) that node are [marked for deletion](#pod-garbage-collection). The control
plane marks the Pods for removal after a timeout period.
-->
和一個個獨立的應用容器一樣，Pod 也被認爲是相對臨時性（而不是長期存在）的實體。
Pod 會被創建、賦予一個唯一的
ID（[UID](/zh-cn/docs/concepts/overview/working-with-objects/names/#uids)），
並被調度到節點，並在終止（根據重啓策略）或刪除之前一直運行在該節點。
如果一個{{< glossary_tooltip text="節點" term_id="node" >}}死掉了，調度到該節點的
Pod 也被計劃在給定超時期限結束後[刪除](#pod-garbage-collection)。

<!-- body -->

<!--
## Pod lifetime

Whilst a Pod is running, the kubelet is able to restart containers to handle some
kind of faults. Within a Pod, Kubernetes tracks different container
[states](#container-states) and determines what action to take to make the Pod
healthy again.
-->
## Pod 生命期   {#pod-lifetime}

在 Pod 運行期間，`kubelet` 能夠重啓容器以處理一些失效場景。
在 Pod 內部，Kubernetes 跟蹤不同容器的[狀態](#container-states)並確定使
Pod 重新變得健康所需要採取的動作。

<!--
In the Kubernetes API, Pods have both a specification and an actual status. The
status for a Pod object consists of a set of [Pod conditions](#pod-conditions).
You can also inject [custom readiness information](#pod-readiness-gate) into the
condition data for a Pod, if that is useful to your application.
-->
在 Kubernetes API 中，Pod 包含規約部分和實際狀態部分。
Pod 對象的狀態包含了一組 [Pod 狀況（Conditions）](#pod-conditions)。
如果應用需要的話，你也可以向其中注入[自定義的就緒態信息](#pod-readiness-gate)。

<!--
Pods are only [scheduled](/docs/concepts/scheduling-eviction/) once in their lifetime;
assigning a Pod to a specific node is called _binding_, and the process of selecting
which node to use is called _scheduling_.
Once a Pod has been scheduled and is bound to a node, Kubernetes tries
to run that Pod on the node. The Pod runs on that node until it stops, or until the Pod
is [terminated](#pod-termination); if Kubernetes isn't able to start the Pod on the selected
node (for example, if the node crashes before the Pod starts), then that particular Pod
never starts.
-->
Pod 在其生命週期中只會被[調度](/zh-cn/docs/concepts/scheduling-eviction/)一次。
將 Pod 分配到特定節點的過程稱爲**綁定**，而選擇使用哪個節點的過程稱爲**調度**。
一旦 Pod 被調度並綁定到某個節點，Kubernetes 會嘗試在該節點上運行 Pod。
Pod 會在該節點上運行，直到 Pod 停止或者被[終止](#pod-termination)；
如果 Kubernetes 無法在選定的節點上啓動 Pod（例如，如果節點在 Pod 啓動前崩潰），
那麼特定的 Pod 將永遠不會啓動。

<!--
You can use [Pod Scheduling Readiness](/docs/concepts/scheduling-eviction/pod-scheduling-readiness/)
to delay scheduling for a Pod until all its _scheduling gates_ are removed. For example,
you might want to define a set of Pods but only trigger scheduling once all the Pods
have been created.
-->
你可以使用 [Pod 調度就緒態](/zh-cn/docs/concepts/scheduling-eviction/pod-scheduling-readiness/)來延遲
Pod 的調度，直到所有的**調度門控**都被移除。
例如，你可能想要定義一組 Pod，但只有在所有 Pod 都被創建完成後纔會觸發調度。

<!--
### Pods and fault recovery {#pod-fault-recovery}

If one of the containers in the Pod fails, then Kubernetes may try to restart that
specific container.
Read [How Pods handle problems with containers](#container-restarts) to learn more.
-->
### Pod 和故障恢復   {#pod-fault-recovery}

如果 Pod 中的某個容器失敗，Kubernetes 可能會嘗試重啓特定的容器。
有關細節參閱 [Pod 如何處理容器問題](#container-restarts)。

<!--
Pods can however fail in a way that the cluster cannot recover from, and in that case
Kubernetes does not attempt to heal the Pod further; instead, Kubernetes deletes the
Pod and relies on other components to provide automatic healing.

If a Pod is scheduled to a {{< glossary_tooltip text="node" term_id="node" >}} and that
node then fails, the Pod is treated as unhealthy and Kubernetes eventually deletes the Pod.
A Pod won't survive an {{< glossary_tooltip text="eviction" term_id="eviction" >}} due to
a lack of resources or Node maintenance.
-->
然而，Pod 也可能以叢集無法恢復的方式失敗，在這種情況下，Kubernetes 不會進一步嘗試修復 Pod；
相反，Kubernetes 會刪除 Pod 並依賴其他組件提供自動修復。

如果 Pod 被調度到某個{{< glossary_tooltip text="節點" term_id="node" >}}而該節點之後失效，
Pod 會被視爲不健康，最終 Kubernetes 會刪除 Pod。
Pod 無法在因節點資源耗盡或者節點維護而被{{< glossary_tooltip text="驅逐" term_id="eviction" >}}期間繼續存活。

<!--
Kubernetes uses a higher-level abstraction, called a
{{< glossary_tooltip term_id="controller" text="controller" >}}, that handles the work of
managing the relatively disposable Pod instances.
-->
Kubernetes 使用一種高級抽象來管理這些相對而言可隨時丟棄的 Pod 實例，
稱作{{< glossary_tooltip term_id="controller" text="控制器" >}}。

<!--
A given Pod (as defined by a UID) is never "rescheduled" to a different node; instead,
that Pod can be replaced by a new, near-identical Pod. If you make a replacement Pod, it can
even have same name (as in `.metadata.name`) that the old Pod had, but the replacement
would have a different `.metadata.uid` from the old Pod.

Kubernetes does not guarantee that a replacement for an existing Pod would be scheduled to
the same node as the old Pod that was being replaced.
-->
任何給定的 Pod （由 UID 定義）從不會被“重新調度（rescheduled）”到不同的節點；
相反，這一 Pod 可以被一個新的、幾乎完全相同的 Pod 替換掉。
如果你創建一個替換 Pod，它甚至可以擁有與舊 Pod 相同的名稱（如 `.metadata.name`），
但替換 Pod 將具有與舊 Pod 不同的 `.metadata.uid`。

Kubernetes 不保證現有 Pod 的替換 Pod 會被調度到與被替換的舊 Pod 相同的節點。

<!--
### Associated lifetimes

When something is said to have the same lifetime as a Pod, such as a
{{< glossary_tooltip term_id="volume" text="volume" >}},
that means that the thing exists as long as that specific Pod (with that exact UID)
exists. If that Pod is deleted for any reason, and even if an identical replacement
is created, the related thing (a volume, in this example) is also destroyed and
created anew.
-->
### 關聯的生命期    {#associated-lifetimes}

如果某物聲稱其生命期與某 Pod 相同，例如存儲{{< glossary_tooltip term_id="volume" text="卷" >}}，
這就意味着該對象在此 Pod （UID 亦相同）存在期間也一直存在。
如果 Pod 因爲任何原因被刪除，甚至某完全相同的替代 Pod 被創建時，
這個相關的對象（例如這裏的卷）也會被刪除並重建。

<!--
{{< figure src="/images/docs/pod.svg" title="Figure 1." class="diagram-medium" caption="A multi-container Pod that contains a file puller [sidecar](/docs/concepts/workloads/pods/sidecar-containers/) and a web server. The Pod uses an [ephemeral `emptyDir` volume](/docs/concepts/storage/volumes/#emptydir) for shared storage between the containers." >}}
-->
{{< figure src="/images/docs/pod.svg" title="圖 1" class="diagram-medium" caption="一個包含文件拉取程序 [Sidecar（邊車）](/zh-cn/docs/concepts/workloads/pods/sidecar-containers/) 和 Web 伺服器的多容器 Pod。此 Pod 使用[臨時 `emptyDir` 卷](/zh-cn/docs/concepts/storage/volumes/#emptydir)作爲容器之間的共享存儲。" >}}


<!--
## Pod phase

A Pod's `status` field is a
[PodStatus](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podstatus-v1-core)
object, which has a `phase` field.

The phase of a Pod is a simple, high-level summary of where the Pod is in its
lifecycle. The phase is not intended to be a comprehensive rollup of observations
of container or Pod state, nor is it intended to be a comprehensive state machine.
-->
## Pod 階段     {#pod-phase}

Pod 的 `status` 字段是一個
[PodStatus](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podstatus-v1-core)
對象，其中包含一個 `phase` 字段。

Pod 的階段（Phase）是 Pod 在其生命週期中所處位置的簡單宏觀概述。
該階段並不是對容器或 Pod 狀態的綜合彙總，也不是爲了成爲完整的狀態機。

<!--
The number and meanings of Pod phase values are tightly guarded.
Other than what is documented here, nothing should be assumed about Pods that
have a given `phase` value.

Here are the possible values for `phase`:
-->
Pod 階段的數量和含義是嚴格定義的。
除了本文檔中列舉的內容外，不應該再假定 Pod 有其他的 `phase` 值。

下面是 `phase` 可能的值：

<!--
Value       | Description
:-----------|:-----------
`Pending`   | The Pod has been accepted by the Kubernetes cluster, but one or more of the containers has not been set up and made ready to run. This includes time a Pod spends waiting to be scheduled as well as the time spent downloading container images over the network.
`Running`   | The Pod has been bound to a node, and all of the containers have been created. At least one container is still running, or is in the process of starting or restarting.
`Succeeded` | All containers in the Pod have terminated in success, and will not be restarted.
`Failed`    | All containers in the Pod have terminated, and at least one container has terminated in failure. That is, the container either exited with non-zero status or was terminated by the system, and is not set for automatic restarting.
`Unknown`   | For some reason the state of the Pod could not be obtained. This phase typically occurs due to an error in communicating with the node where the Pod should be running.
-->
取值 | 描述
:-----|:-----------
`Pending`（懸決）| Pod 已被 Kubernetes 系統接受，但有一個或者多個容器尚未創建亦未運行。此階段包括等待 Pod 被調度的時間和通過網路下載映像檔的時間。
`Running`（運行中） | Pod 已經綁定到了某個節點，Pod 中所有的容器都已被創建。至少有一個容器仍在運行，或者正處於啓動或重啓狀態。
`Succeeded`（成功） | Pod 中的所有容器都已成功結束，並且不會再重啓。
`Failed`（失敗） | Pod 中的所有容器都已終止，並且至少有一個容器是因爲失敗終止。也就是說，容器以非 0 狀態退出或者被系統終止，且未被設置爲自動重啓。
`Unknown`（未知） | 因爲某些原因無法取得 Pod 的狀態。這種情況通常是因爲與 Pod 所在主機通信失敗。

{{< note >}}
<!--
When a pod is failing to start repeatedly, `CrashLoopBackOff` may appear in the `Status` field of some kubectl commands.
Similarly, when a pod is being deleted, `Terminating` may appear in the `Status` field of some kubectl commands.

Make sure not to confuse _Status_, a kubectl display field for user intuition, with the pod's `phase`.
Pod phase is an explicit part of the Kubernetes data model and of the
[Pod API](/docs/reference/kubernetes-api/workload-resources/pod-v1/).
-->
當 Pod 反覆啓動失敗時，某些 kubectl 命令的 `Status` 字段中可能會出現 `CrashLoopBackOff`。
同樣，當 Pod 被刪除時，某些 kubectl 命令的 `Status` 字段中可能會出現 `Terminating`。

確保不要將 **Status**（kubectl 用於使用者直覺的顯示字段）與 Pod 的 `phase` 混淆。
Pod 階段（phase）是 Kubernetes 數據模型和
[Pod API](/zh-cn/docs/reference/kubernetes-api/workload-resources/pod-v1/)
的一個明確的部分。

```console
NAMESPACE               NAME               READY   STATUS             RESTARTS   AGE
alessandras-namespace   alessandras-pod    0/1     CrashLoopBackOff   200        2d9h
```

---

<!--
A Pod is granted a term to terminate gracefully, which defaults to 30 seconds.
You can use the flag `--force` to [terminate a Pod by force](/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination-forced).
-->
Pod 被賦予一個可以體面終止的期限，默認爲 30 秒。
你可以使用 `--force` 參數來[強制終止 Pod](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination-forced)。
{{< /note >}}

<!--
Since Kubernetes 1.27, the kubelet transitions deleted Pods, except for
[static Pods](/docs/tasks/configure-pod-container/static-pod/) and
[force-deleted Pods](/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination-forced)
without a finalizer, to a terminal phase (`Failed` or `Succeeded` depending on
the exit statuses of the pod containers) before their deletion from the API server.
-->
從 Kubernetes 1.27 開始，除了[靜態 Pod](/zh-cn/docs/tasks/configure-pod-container/static-pod/)
和沒有 Finalizer 的[強制終止 Pod](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination-forced)
之外，`kubelet` 會將已刪除的 Pod 轉換到終止階段
（`Failed` 或 `Succeeded` 具體取決於 Pod 容器的退出狀態），然後再從 API 伺服器中刪除。

<!--
If a node dies or is disconnected from the rest of the cluster, Kubernetes
applies a policy for setting the `phase` of all Pods on the lost node to Failed.
-->
如果某節點死掉或者與叢集中其他節點失聯，Kubernetes
會實施一種策略，將失去的節點上運行的所有 Pod 的 `phase` 設置爲 `Failed`。

<!--
## Container states

As well as the [phase](#pod-phase) of the Pod overall, Kubernetes tracks the state of
each container inside a Pod. You can use
[container lifecycle hooks](/docs/concepts/containers/container-lifecycle-hooks/) to
trigger events to run at certain points in a container's lifecycle.

Once the {{< glossary_tooltip text="scheduler" term_id="kube-scheduler" >}}
assigns a Pod to a Node, the kubelet starts creating containers for that Pod
using a {{< glossary_tooltip text="container runtime" term_id="container-runtime" >}}.
There are three possible container states: `Waiting`, `Running`, and `Terminated`.
-->
## 容器狀態  {#container-states}

Kubernetes 會跟蹤 Pod 中每個容器的狀態，就像它跟蹤 Pod 總體上的[階段](#pod-phase)一樣。
你可以使用[容器生命週期回調](/zh-cn/docs/concepts/containers/container-lifecycle-hooks/)
來在容器生命週期中的特定時間點觸發事件。

一旦{{< glossary_tooltip text="調度器" term_id="kube-scheduler" >}}將 Pod
分派給某個節點，`kubelet`
就通過{{< glossary_tooltip text="容器運行時" term_id="container-runtime" >}}開始爲
Pod 創建容器。容器的狀態有三種：`Waiting`（等待）、`Running`（運行中）和
`Terminated`（已終止）。

<!--
To check the state of a Pod's containers, you can use
`kubectl describe pod <name-of-pod>`. The output shows the state for each container
within that Pod.

Each state has a specific meaning:
-->
要檢查 Pod 中容器的狀態，你可以使用 `kubectl describe pod <pod 名稱>`。
其輸出中包含 Pod 中每個容器的狀態。

每種狀態都有特定的含義：

<!--
### `Waiting` {#container-state-waiting}

If a container is not in either the `Running` or `Terminated` state, it is `Waiting`.
A container in the `Waiting` state is still running the operations it requires in
order to complete start up: for example, pulling the container image from a container
image registry, or applying {{< glossary_tooltip text="Secret" term_id="secret" >}}
data.
When you use `kubectl` to query a Pod with a container that is `Waiting`, you also see
a Reason field to summarize why the container is in that state.
-->
### `Waiting`（等待）  {#container-state-waiting}

如果容器並不處在 `Running` 或 `Terminated` 狀態之一，它就處在 `Waiting` 狀態。
處於 `Waiting` 狀態的容器仍在運行它完成啓動所需要的操作：例如，
從某個容器映像檔倉庫拉取容器映像檔，或者向容器應用 {{< glossary_tooltip text="Secret" term_id="secret" >}}
數據等等。
當你使用 `kubectl` 來查詢包含 `Waiting` 狀態的容器的 Pod 時，你也會看到一個
Reason 字段，其中給出了容器處於等待狀態的原因。

<!--
### `Running` {#container-state-running}

The `Running` status indicates that a container is executing without issues. If there
was a `postStart` hook configured, it has already executed and finished. When you use
`kubectl` to query a Pod with a container that is `Running`, you also see information
about when the container entered the `Running` state.
-->
### `Running`（運行中）     {#container-state-running}

`Running` 狀態表明容器正在執行狀態並且沒有問題發生。
如果設定了 `postStart` 回調，那麼該回調已經執行且已完成。
如果你使用 `kubectl` 來查詢包含 `Running` 狀態的容器的 Pod 時，
你也會看到關於容器進入 `Running` 狀態的信息。

<!--
### `Terminated` {#container-state-terminated}

A container in the `Terminated` state began execution and then either ran to
completion or failed for some reason. When you use `kubectl` to query a Pod with
a container that is `Terminated`, you see a reason, an exit code, and the start and
finish time for that container's period of execution.

If a container has a `preStop` hook configured, this hook runs before the container enters
the `Terminated` state.
-->
### `Terminated`（已終止）   {#container-state-terminated}

處於 `Terminated` 狀態的容器開始執行後，或者運行至正常結束或者因爲某些原因失敗。
如果你使用 `kubectl` 來查詢包含 `Terminated` 狀態的容器的 Pod 時，
你會看到容器進入此狀態的原因、退出代碼以及容器執行期間的起止時間。

如果容器設定了 `preStop` 回調，則該回調會在容器進入 `Terminated`
狀態之前執行。

<!--
## How Pods handle problems with containers {#container-restarts}

Kubernetes manages container failures within Pods using a [`restartPolicy`](#restart-policy) defined in the Pod `spec`. This policy determines how Kubernetes reacts to containers exiting due to errors or other reasons, which falls in the following sequence:
-->

## Pod 如何處理容器問題 {#container-restarts}

Kubernetes 通過在 Pod `spec` 中定義的 [`restartPolicy`](#restart-policy) 管理 Pod 內容器出現的失效。 
該策略決定了 Kubernetes 如何對由於錯誤或其他原因而退出的容器做出反應，其順序如下：

<!--
1. **Initial crash**: Kubernetes attempts an immediate restart based on the Pod `restartPolicy`.
1. **Repeated crashes**: After the initial crash Kubernetes applies an exponential
   backoff delay for subsequent restarts, described in [`restartPolicy`](#restart-policy).
   This prevents rapid, repeated restart attempts from overloading the system.
1. **CrashLoopBackOff state**: This indicates that the backoff delay mechanism is currently
   in effect for a given container that is in a crash loop, failing and restarting repeatedly.
1. **Backoff reset**: If a container runs successfully for a certain duration
   (e.g., 10 minutes), Kubernetes resets the backoff delay, treating any new crash
   as the first one.
-->
1. **最初的崩潰**：Kubernetes 嘗試根據 Pod 的 `restartPolicy` 立即重新啓動。
1. **反覆的崩潰**：在最初的崩潰之後，Kubernetes 對於後續重新啓動的容器採用指數級回退延遲機制，
   如 [`restartPolicy`](#restart-policy) 中所述。
   這一機制可以防止快速、重複的重新啓動嘗試導致系統過載。
1. **CrashLoopBackOff 狀態**：這一狀態表明，對於一個給定的、處於崩潰循環、反覆失效並重啓的容器，
   回退延遲機制目前正在生效。
1. **回退重置**：如果容器成功運行了一定時間（如 10 分鐘），
  Kubernetes 會重置回退延遲機制，將新的崩潰視爲第一次崩潰。
<!--
In practice, a `CrashLoopBackOff` is a condition or event that might be seen as output
from the `kubectl` command, while describing or listing Pods, when a container in the Pod
fails to start properly and then continually tries and fails in a loop.
-->
在實際部署中，`CrashLoopBackOff` 是在描述或列出 Pod 時從 `kubectl` 命令輸出的一種狀況或事件。
當 Pod 中的容器無法正常啓動，並反覆進入嘗試與失敗的循環時就會出現。

<!--
In other words, when a container enters the crash loop, Kubernetes applies the
exponential backoff delay mentioned in the [Container restart policy](#restart-policy).
This mechanism prevents a faulty container from overwhelming the system with continuous
failed start attempts.
-->
換句話說，當容器進入崩潰循環時，Kubernetes 會應用[容器重啓策略](#restart-policy) 
中提到的指數級回退延遲機制。這種機制可以防止有問題的容器因不斷進行啓動失敗嘗試而導致系統不堪重負。

<!--
The `CrashLoopBackOff` can be caused by issues like the following:

* Application errors that cause the container to exit.
* Configuration errors, such as incorrect environment variables or missing
  configuration files.
* Resource constraints, where the container might not have enough memory or CPU
  to start properly.
* Health checks failing if the application doesn't start serving within the
  expected time.
* Container liveness probes or startup probes returning a `Failure` result
  as mentioned in the [probes section](#container-probes).
-->
下列問題可以導致 `CrashLoopBackOff`：

* 應用程序錯誤導致的容器退出。
* 設定錯誤，如環境變量不正確或設定文件丟失。
* 資源限制，容器可能沒有足夠的內存或 CPU 正常啓動。
* 如果應用程序沒有在預期時間內啓動服務，健康檢查就會失敗。
* 容器的存活探針或者啓動探針返回 `失敗` 結果，如[探針部分](#container-probes)所述。

<!--
To investigate the root cause of a `CrashLoopBackOff` issue, a user can:

1. **Check logs**: Use `kubectl logs <name-of-pod>` to check the logs of the container.
   This is often the most direct way to diagnose the issue causing the crashes.
1. **Inspect events**: Use `kubectl describe pod <name-of-pod>` to see events
   for the Pod, which can provide hints about configuration or resource issues.
1. **Review configuration**: Ensure that the Pod configuration, including
   environment variables and mounted volumes, is correct and that all required
   external resources are available.
1. **Check resource limits**: Make sure that the container has enough CPU
   and memory allocated. Sometimes, increasing the resources in the Pod definition
   can resolve the issue.
1. **Debug application**: There might exist bugs or misconfigurations in the
   application code. Running this container image locally or in a development
   environment can help diagnose application specific issues.
-->
要調查 `CrashLoopBackOff` 問題的根本原因，使用者可以：

1. **檢查日誌**：使用 `kubectl logs <pod名稱>` 檢查容器的日誌。
   這通常是診斷導致崩潰的問題的最直接方法。
1. **檢查事件**：使用 `kubectl describe pod <pod名稱>` 查看 Pod 的事件，
   這可以提供有關設定或資源問題的提示。
1. **審查設定**：確保 Pod 設定正確無誤，包括環境變量和掛載卷，並且所有必需的外部資源都可用。
1. **檢查資源限制**： 確保容器被分配了足夠的 CPU 和內存。有時，增加 Pod 定義中的資源可以解決問題。
1. **調試應用程序**：應用程序代碼中可能存在錯誤或設定不當。
   在本地或開發環境中運行此容器映像檔有助於診斷應用程序的特定問題。

<!--
### Container restarts {#restart-policy}

When a container in your Pod stops, or experiences failure, Kubernetes can restart it.
A restart isn't always appropriate; for example,
{{< glossary_tooltip text="init containers" term_id="init-container" >}} run only once,
during Pod startup.
-->
### 容器重啓   {#restart-policy}

當 Pod 中的某個容器停止或發生故障時，Kubernetes 可以重新啓動此容器。但重啓並不總是合適的；例如，
{{< glossary_tooltip text="Init 容器" term_id="init-container" >}}只在 Pod 啓動期間運行一次。
<!-- TODO reword when ContainerRestartRules graduates -->
<!--
You can configure restarts as a policy that applies to all Pods, or using container-level configuration (for example: when you define a 
{{< glossary_tooltip text="sidecar container" term_id="sidecar-container" >}}).
-->
你可以將重啓設定爲適用於所有 Pod 的策略，或者使用容器級別的設定（例如：
在你定義{{< glossary_tooltip text="邊車容器" term_id="sidecar-container" >}}時）。

<!--
#### Container restarts and resilience {#container-restart-resilience}

The Kubernetes project recommends following cloud-native principles, including resilient
design that accounts for unannounced or arbitrary restarts. You can achieve this either
by failing the Pod and relying on automatic
[replacement](/docs/concepts/workloads/controllers/), or you can design for container-level resilience.
Either approach helps to ensure that your overall workload remains available despite
partial failure.
-->
#### 容器重啓與彈性   {#container-restart-resilience}

Kubernetes 項目建議遵循雲原生原則，包括能夠應對未預告或隨意重啓的彈性設計。
你可以通過讓 Pod 失敗並依賴自動[替換](/zh-cn/docs/concepts/workloads/controllers/)，
或者通過容器級別的彈性設計來實現。
無論哪種方式，都有助於確保即使在部分故障的情況下，你的整體工作負載依然保持可用。

<!--
#### Pod-level container restart policy

The `spec` of a Pod has a `restartPolicy` field with possible values Always, OnFailure,
and Never. The default value is Always.

The `restartPolicy` applies to {{< glossary_tooltip text="app containers" term_id="app-container" >}}
in the Pod and to regular [init containers](/docs/concepts/workloads/pods/init-containers/).
[Sidecar containers](/docs/concepts/workloads/pods/sidecar-containers/)
ignore the Pod-level `restartPolicy` field: in Kubernetes, a sidecar is defined as an
entry inside `initContainers` that has its container-level `restartPolicy` set to `Always`.
For init containers that exit with an error, the kubelet restarts the init container if
the Pod level `restartPolicy` is either `OnFailure` or `Always`.

* `Always`: Automatically restarts the container after any termination.
* `OnFailure`: Only restarts the container if it exits with an error (non-zero exit status).
* `Never`: Does not automatically restart the terminated container.
-->
### Pod 級別容器重啓策略

Pod 的 `spec` 中包含一個 `restartPolicy` 字段，其可能取值包括
Always、OnFailure 和 Never。默認值是 Always。

`restartPolicy` 應用於 Pod
中的{{< glossary_tooltip text="應用容器" term_id="app-container" >}}和常規的
[Init 容器](/zh-cn/docs/concepts/workloads/pods/init-containers/)。
[Sidecar 容器](/zh-cn/docs/concepts/workloads/pods/sidecar-containers/)忽略
Pod 級別的 `restartPolicy` 字段：在 Kubernetes 中，Sidecar 被定義爲
`initContainers` 內的一個條目，其容器級別的 `restartPolicy` 被設置爲 `Always`。
對於因錯誤而退出的 Init 容器，如果 Pod 級別 `restartPolicy` 爲 `OnFailure` 或 `Always`，
則 kubelet 會重新啓動 Init 容器。

* `Always`：只要容器終止就自動重啓容器。
* `OnFailure`：只有在容器錯誤退出（退出狀態非零）時才重新啓動容器。
* `Never`：不會自動重啓已終止的容器。

<!--
When the kubelet is handling container restarts according to the configured restart
policy, that only applies to restarts that make replacement containers inside the
same Pod and running on the same node. After containers in a Pod exit, the kubelet
restarts them with an exponential backoff delay (10s, 20s, 40s, …), that is capped at
300 seconds (5 minutes). Once a container has executed for 10 minutes without any
problems, the kubelet resets the restart backoff timer for that container.
[Sidecar containers and Pod lifecycle](/docs/concepts/workloads/pods/sidecar-containers/#sidecar-containers-and-pod-lifecycle)
explains the behaviour of `init containers` when specify `restartpolicy` field on it.
-->
當 kubelet 根據設定的重啓策略處理容器重啓時，僅適用於同一 Pod
內替換容器並在同一節點上運行的重啓。當 Pod 中的容器退出時，`kubelet`
會以指數級回退延遲機制（10 秒、20 秒、40 秒......）重啓容器，
上限爲 300 秒（5 分鐘）。一旦容器順利執行了 10 分鐘，
kubelet 就會重置該容器的重啓延遲計時器。
[Sidecar 容器和 Pod 生命週期](/zh-cn/docs/concepts/workloads/pods/sidecar-containers/#sidecar-containers-and-pod-lifecycle)中解釋了
`init containers` 在指定 `restartpolicy` 字段時的行爲。

<!--
#### Individual container restart policy and rules {#container-restart-rules}
-->
#### 單個容器的重啓策略與規則   {#container-restart-rules}

{{< feature-state feature_gate_name="ContainerRestartRules" >}}

<!--
If your cluster has the feature gate `ContainerRestartRules` enabled, you can specify 
`restartPolicy` and `restartPolicyRules` on _inidividual containers_ to override the Pod
restart policy. Container restart policy and rules applies to {{< glossary_tooltip text="app containers" term_id="app-container" >}}
in the Pod and to regular [init containers](/docs/concepts/workloads/pods/init-containers/).

A Kubernetes-native [sidecar container](/docs/concepts/workloads/pods/sidecar-containers/)
has its container-level `restartPolicy` set to `Always`, and does not support `restartPolicyRules`.
-->
如果你的叢集啓用了 `ContainerRestartRules` 特性門控，你可以針對**單個容器**指定
`restartPolicy` 和 `restartPolicyRules` 來覆蓋 Pod 重啓策略。容器重啓策略和規則適用於 Pod
中的{{< glossary_tooltip text="應用容器" term_id="app-container" >}}以及常規的
[Init 容器](/zh-cn/docs/concepts/workloads/pods/init-containers/)。

Kubernetes 原生的[邊車容器](/zh-cn/docs/concepts/workloads/pods/sidecar-containers/)將其容器級別的
`restartPolicy` 設置爲 `Always`，並且不支持 `restartPolicyRules`。

<!--
The container restarts will follow the same exponential backoff as pod restart policy described above. 
Supported container restart policies:

* `Always`: Automatically restarts the container after any termination.
* `OnFailure`: Only restarts the container if it exits with an error (non-zero exit status).
* `Never`: Does not automatically restart the terminated container.
-->
容器重啓會遵循與前文所述的 Pod 重啓策略相同的指數回退機制。支持的容器重啓策略有：

* `Always`：在任何原因的容器終止後都會自動重啓容器。
* `OnFailure`：僅當容器因錯誤退出（非零退出狀態）時才重啓。
* `Never`：不自動重啓已終止的容器。

<!--
Additionally, _individual containers_ can specify `restartPolicyRules`. If the `restartPolicyRules`
field is specified, then container `restartPolicy` **must** also be specified. The `restartPolicyRules`
define a list of rules to apply on container exit. Each rule will consist of a condition
and an action. The supported condition is `exitCodes`, which compares the exit code of the container
with a list of given values. The supported action is `Restart`, which means the container will be
restarted. The rules will be evaluated in order. On the first match, the action will be applied.
If none of the rules’ conditions matched, Kubernetes fallback to container’s configured
`restartPolicy`.
-->
此外，**單個容器**可以指定 `restartPolicyRules`。如果指定了 `restartPolicyRules` 字段，
則**必須**同時指定容器的 `restartPolicy`。`restartPolicyRules` 定義了一系列在容器退出時應用的規則。
每條規則由條件和動作組成。支持的條件是 `exitCodes`，用於將容器的退出碼與給定值列表進行比較。
支持的動作是 `Restart`，表示容器將被重啓。這些規則會按順序進行評估。一旦匹配成功，立即執行相應動作。
如果沒有任何規則的狀況被匹配，Kubernetes 回退到容器設定的 `restartPolicy`。

<!--
For example, a Pod with OnFailure restart policy that have a `try-once` container. This allows
Pod to only restart certain containers:
-->
例如，重啓策略爲 OnFailure 的某個 Pod 包含一個 `try-once` 容器。
這樣可以讓 Pod 僅重啓某些容器：

<!--
# This container will run only once because the restartPolicy is Never.
# This container will be restarted on failure.
-->
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: on-failure-pod
spec:
  restartPolicy: OnFailure
  containers:
  - name: try-once-container    # 此容器只運行一次，因爲 restartPolicy 設置爲 Never。
    image: docker.io/library/busybox:1.28
    command: ['sh', '-c', 'echo "Only running once" && sleep 10 && exit 1']
    restartPolicy: Never     
  - name: on-failure-container  # 此容器將在失敗時重啓。
    image: docker.io/library/busybox:1.28
    command: ['sh', '-c', 'echo "Keep restarting" && sleep 1800 && exit 1']
```

<!--
A Pod with Always restart policy with an init container that only execute once. If the init
container fails, the Pod fails. This alllows the Pod to fail if the initialization failed,
but also keep running once the initialization succeeds:
-->
下面是一個重啓策略爲 Always 的 Pod，其中包含一個只執行一次的 Init 容器。
如果 Init 容器失敗，則 Pod 也會失敗。
這樣可以在初始化失敗時讓 Pod 失敗，但在初始化成功後保持 Pod 運行：

<!--
# This init container will only try once. If it fails, the pod will fail.
# This container will always be restarted once initialization succeeds.
-->
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: fail-pod-if-init-fails
spec:
  restartPolicy: Always
  initContainers:
  - name: init-once      # 這個 Init 容器只嘗試一次。如果失敗，Pod 將失敗。
    image: docker.io/library/busybox:1.28
    command: ['sh', '-c', 'echo "Failing initialization" && sleep 10 && exit 1']
    restartPolicy: Never
  containers:
  - name: main-container # 一旦初始化成功，此容器會始終被重啓。
    image: docker.io/library/busybox:1.28
    command: ['sh', '-c', 'sleep 1800 && exit 0']
```

<!--
A Pod with Never restart policy with a container that ignores and restarts on specific exit codes.
This is useful to differentiate between restartable errors and non-restartable errors:
-->
下面是一個重啓策略爲 Never 的 Pod，其中包含的容器會在遇到特定的退出碼時忽略之並重啓。
這種設定有助於區分可重啓錯誤和不可重啓錯誤：

<!--
# Container restart policy must be specified if rules are specified
# Only restart the container if it exits with code 42
-->
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: restart-on-exit-codes
spec:
  restartPolicy: Never
  containers:
  - name: restart-on-exit-codes
    image: docker.io/library/busybox:1.28
    command: ['sh', '-c', 'sleep 60 && exit 0']
    restartPolicy: Never     # 如果指定了規則，必須同時指定容器重啓策略
    restartPolicyRules:      # 僅當退出碼爲 42 時才重啓容器
    - action: Restart
      exitCodes:
        operator: In
        values: [42]
```

<!--
Restart rules can be used for many more advanced lifecycle management scenarios. Note, restart rules
are affected by the same inconsistencies as the regular restart policy. Kubelet restarts, container
runtime garbage collection, intermitted connectivity issues with the control plane may cause the state
loss and containers may be re-run even when you expect a container not to be restarted.
-->
重啓規則可用於許多其他高級的生命週期管理場景。
需要注意的是，重啓規則會受到不一致性影響，這一點上與常規的重啓策略相同。
kubelet 重啓、容器運行時垃圾收集、與控制平面的間歇性連接問題都可能導致狀態丟失，
容器可能會在你預期不應被重啓的情況下被再次運行。

<!--
### Reduced container restart delay

{{< feature-state
feature_gate_name="ReduceDefaultCrashLoopBackOffDecay" >}}

With the alpha feature gate `ReduceDefaultCrashLoopBackOffDecay` enabled,
container start retries across your cluster will be reduced to begin at 1s
(instead of 10s) and increase exponentially by 2x each restart until a maximum
delay of 60s (instead of 300s which is 5 minutes).

If you use this feature along with the alpha feature
`KubeletCrashLoopBackOffMax` (described below), individual nodes may have
different maximum delays.
-->
### 減少容器重啓延遲   {#Reduced-container-restart-delay}

{{< feature-state feature_gate_name="ReduceDefaultCrashLoopBackOffDecay" >}}

啓用 Alpha 特性開關 `ReduceDefaultCrashLoopBackOffDecay` 後，
叢集中容器啓動重試的初始延遲將從 10 秒減少到 1 秒，
之後每次重啓延遲時間按 2 倍指數增長，直到達到最大延遲 60 秒（之前爲 300 秒，即 5 分鐘）。

如果你同時使用了下面介紹的 Alpha 特性 `KubeletCrashLoopBackOffMax`，
那麼單個節點上可能會有不同的最大延遲值。

<!--
### Configurable container restart delay
-->
### 可設定的容器重啓延遲   {#configurable-container-restart-delay}

{{< feature-state feature_gate_name="KubeletCrashLoopBackOffMax" >}}

<!--
With the alpha feature gate `KubeletCrashLoopBackOffMax` enabled, you can
reconfigure the maximum delay between container start retries from the default
of 300s (5 minutes). This configuration is set per node using kubelet
configuration. In your [kubelet configuration](/docs/tasks/administer-cluster/kubelet-config-file/),
under `crashLoopBackOff` set the `maxContainerRestartPeriod` field between
`"1s"` and `"300s"`. As described above in [Container restart
policy](#restart-policy), delays on that node will still start at 10s and
increase exponentially by 2x each restart, but will now be capped at your
configured maximum. If the `maxContainerRestartPeriod` you configure is less
than the default initial value of 10s, the initial delay will instead be set to
the configured maximum.
-->
啓用 Alpha 特性門控 `KubeletCrashLoopBackOffMax` 後，
你可以重新設定容器啓動重試之間的最大延遲，默認值爲 300 秒（5 分鐘）。
此設定是針對每個節點使用 kubelet 設定進行設置的。
在你的 [kubelet 設定](/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/)中，
在 `crashLoopBackOff` 下設置 `maxContainerRestartPeriod` 字段，取值範圍在 `"1s"` 到 `"300s"` 之間。
如上文[容器重啓策略](#restart-policy)所述，該節點上的延遲仍將從 10 秒開始，並在每次重啓後以指數方式增加
2 倍，但現在其上限將被限制爲你所設定的最大值。如果你設定的 `maxContainerRestartPeriod` 小於默認初始值 10 秒，
則初始延遲將被設置爲設定的最大值。

<!--
See the following kubelet configuration examples:

```yaml
# container restart delays will start at 10s, increasing
# 2x each time they are restarted, to a maximum of 100s
kind: KubeletConfiguration
crashLoopBackOff:
    maxContainerRestartPeriod: "100s"
```
-->
參見以下 kubelet 設定示例：

```yaml
# 容器重啓延遲將從 10 秒開始，每次重啓增加 2 倍
# 最高達到 100 秒
kind: KubeletConfiguration
crashLoopBackOff:
    maxContainerRestartPeriod: "100s"
```

<!--
```yaml
# delays between container restarts will always be 2s
kind: KubeletConfiguration
crashLoopBackOff:
    maxContainerRestartPeriod: "2s"
```
-->
```yaml
# 容器重啓之間的延遲將始終爲 2 秒
kind: KubeletConfiguration
crashLoopBackOff:
    maxContainerRestartPeriod: "2s"
```

<!--
If you use this feature along with the alpha feature
`ReduceDefaultCrashLoopBackOffDecay` (described above), your cluster defaults
for initial backoff and maximum backoff will no longer be 10s and 300s, but 1s
and 60s. Per node configuration takes precedence over the defaults set by
`ReduceDefaultCrashLoopBackOffDecay`, even if this would result in a node having
a longer maximum backoff than other nodes in the cluster.
-->
如果你將此特性與上文提到的 Alpha 特性 `ReduceDefaultCrashLoopBackOffDecay` 一起使用，
那麼叢集的初始退避時間和最大退避時間默認值將不再是 10 秒和 300 秒，而是 1 秒和 60 秒。
每個節點上的設定優先於 `ReduceDefaultCrashLoopBackOffDecay` 所設置的默認值，
即使這會導致某些節點的最大退避時間比叢集中的其他節點更長。

<!--
## Pod conditions

A Pod has a PodStatus, which has an array of
[PodConditions](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podcondition-v1-core)
through which the Pod has or has not passed. Kubelet manages the following
PodConditions:
-->
## Pod 狀況  {#pod-conditions}

Pod 有一個 PodStatus 對象，其中包含一個
[PodConditions](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podcondition-v1-core)
數組。Pod 可能通過也可能未通過其中的一些狀況測試。
Kubelet 管理以下 PodCondition：

<!--
* `PodScheduled`: the Pod has been scheduled to a node.
* `PodReadyToStartContainers`: (beta feature; enabled by [default](#pod-has-network)) the
  Pod sandbox has been successfully created and networking configured.
* `ContainersReady`: all containers in the Pod are ready.
* `Initialized`: all [init containers](/docs/concepts/workloads/pods/init-containers/)
  have completed successfully.
* `Ready`: the Pod is able to serve requests and should be added to the load
  balancing pools of all matching Services.
* `DisruptionTarget`: the pod is about to be terminated due to a disruption
  (such as preemption, eviction or garbage-collection).
* `PodResizePending`: a pod resize was requested but cannot be applied.
  See [Pod resize status](/docs/tasks/configure-pod-container/resize-container-resources#pod-resize-status).
* `PodResizeInProgress`: the pod is in the process of resizing.
  See [Pod resize status](/docs/tasks/configure-pod-container/resize-container-resources#pod-resize-status).
-->
* `PodScheduled`：Pod 已經被調度到某節點；
* `PodReadyToStartContainers`：Pod 沙箱被成功創建並且設定了網路（Beta 特性，[默認](#pod-has-network)啓用）；
* `ContainersReady`：Pod 中所有容器都已就緒；
* `Initialized`：所有的 [Init 容器](/zh-cn/docs/concepts/workloads/pods/init-containers/)都已成功完成；
* `Ready`：Pod 可以爲請求提供服務，並且應該被添加到對應服務的負載均衡池中。
* `DisruptionTarget`：由於干擾（例如搶佔、驅逐或垃圾回收），Pod 即將被終止。
* `PodResizePending`：已請求對 Pod 進行調整大小，但尚無法應用。
  詳見 [Pod 調整大小狀態](/zh-cn/docs/tasks/configure-pod-container/resize-container-resources#pod-resize-status)。
* `PodResizeInProgress`：Pod 正在調整大小中。
  詳見 [Pod 調整大小狀態](/zh-cn/docs/tasks/configure-pod-container/resize-container-resources#pod-resize-status)。

<!--
Field name           | Description
:--------------------|:-----------
`type`               | Name of this Pod condition.
`status`             | Indicates whether that condition is applicable, with possible values "`True`", "`False`", or "`Unknown`".
`lastProbeTime`      | Timestamp of when the Pod condition was last probed.
`lastTransitionTime` | Timestamp for when the Pod last transitioned from one status to another.
`reason`             | Machine-readable, UpperCamelCase text indicating the reason for the condition's last transition.
`message`            | Human-readable message indicating details about the last status transition.
-->
字段名稱             | 描述
:--------------------|:-----------
`type`               | Pod 狀況的名稱
`status`             | 表明該狀況是否適用，可能的取值有 "`True`"、"`False`" 或 "`Unknown`"
`lastProbeTime`      | 上次探測 Pod 狀況時的時間戳
`lastTransitionTime` | Pod 上次從一種狀態轉換到另一種狀態時的時間戳
`reason`             | 機器可讀的、駝峯編碼（UpperCamelCase）的文字，表述上次狀況變化的原因
`message`            | 人類可讀的消息，給出上次狀態轉換的詳細信息

<!--
### Pod readiness {#pod-readiness-gate}

Your application can inject extra feedback or signals into PodStatus:
_Pod readiness_. To use this, set `readinessGates` in the Pod's `spec` to
specify a list of additional conditions that the kubelet evaluates for Pod readiness.
-->
### Pod 就緒態        {#pod-readiness-gate}

{{< feature-state for_k8s_version="v1.29" state="beta" >}}

你的應用可以向 PodStatus 中注入額外的反饋或者信號：**Pod Readiness（Pod 就緒態）**。
要使用這一特性，可以設置 Pod 規約中的 `readinessGates` 列表，爲 kubelet
提供一組額外的狀況供其評估 Pod 就緒態時使用。

<!--
Readiness gates are determined by the current state of `status.condition`
fields for the Pod. If Kubernetes cannot find such a condition in the
`status.conditions` field of a Pod, the status of the condition
is defaulted to "`False`".

Here is an example:
-->
就緒態門控基於 Pod 的 `status.conditions` 字段的當前值來做決定。
如果 Kubernetes 無法在 `status.conditions` 字段中找到某狀況，
則該狀況的狀態值默認爲 "`False`"。

這裏是一個例子：

```yaml
kind: Pod
...
spec:
  readinessGates:
    - conditionType: "www.example.com/feature-1"
status:
  conditions:
    - type: Ready                              # 內置的 Pod 狀況
      status: "False"
      lastProbeTime: null
      lastTransitionTime: 2018-01-01T00:00:00Z
    - type: "www.example.com/feature-1"        # 額外的 Pod 狀況
      status: "False"
      lastProbeTime: null
      lastTransitionTime: 2018-01-01T00:00:00Z
  containerStatuses:
    - containerID: docker://abcd...
      ready: true
...
```

<!--
The Pod conditions you add must have names that meet the Kubernetes
[label key format](/docs/concepts/overview/working-with-objects/labels/#syntax-and-character-set).
-->
你所添加的 Pod 狀況名稱必須滿足 Kubernetes
[標籤鍵名格式](/zh-cn/docs/concepts/overview/working-with-objects/labels/#syntax-and-character-set)。

<!--
### Status for Pod readiness {#pod-readiness-status}

The `kubectl patch` command does not support patching object status.
To set these `status.conditions` for the Pod, applications and
{{< glossary_tooltip term_id="operator-pattern" text="operators">}} should use
the `PATCH` action.
You can use a [Kubernetes client library](/docs/reference/using-api/client-libraries/) to
write code that sets custom Pod conditions for Pod readiness.
-->
### Pod 就緒態的狀態 {#pod-readiness-status}

命令 `kubectl patch` 不支持修改對象的狀態。
如果需要設置 Pod 的 `status.conditions`，應用或者
{{< glossary_tooltip term_id="operator-pattern" text="Operators">}}
需要使用 `PATCH` 操作。你可以使用
[Kubernetes 客戶端庫](/zh-cn/docs/reference/using-api/client-libraries/)之一來編寫代碼，
針對 Pod 就緒態設置定製的 Pod 狀況。

<!--
For a Pod that uses custom conditions, that Pod is evaluated to be ready **only**
when both the following statements apply:

* All containers in the Pod are ready.
* All conditions specified in `readinessGates` are `True`.

When a Pod's containers are Ready but at least one custom condition is missing or
`False`, the kubelet sets the Pod's [condition](#pod-conditions) to `ContainersReady`.
-->
對於使用定製狀況的 Pod 而言，只有當下面的陳述都適用時，該 Pod 纔會被評估爲就緒：

* Pod 中所有容器都已就緒；
* `readinessGates` 中的所有狀況都爲 `True` 值。

當 Pod 的容器都已就緒，但至少一個定製狀況沒有取值或者取值爲 `False`，
`kubelet` 將 Pod 的[狀況](#pod-conditions)設置爲 `ContainersReady`。

<!--
### Pod network readiness {#pod-has-network}
-->
### Pod 網路就緒 {#pod-has-network}

{{< feature-state for_k8s_version="v1.25" state="alpha" >}}

{{< note >}}
<!--
During its early development, this condition was named `PodHasNetwork`.
-->
在其早期開發過程中，這種狀況被命名爲 `PodHasNetwork`。
{{< /note >}}

<!--
After a Pod gets scheduled on a node, it needs to be admitted by the kubelet and
to have any required storage volumes mounted. Once these phases are complete,
the Kubelet works with
a container runtime (using {{< glossary_tooltip term_id="cri" >}}) to set up a
runtime sandbox and configure networking for the Pod. If the
`PodReadyToStartContainersCondition`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/) is enabled
(it is enabled by default for Kubernetes {{< skew currentVersion >}}), the
`PodReadyToStartContainers` condition will be added to the `status.conditions` field of a Pod.
-->
在 Pod 被調度到某節點後，它需要被 kubelet 接受並且掛載所需的存儲卷。
一旦這些階段完成，Kubelet 將與容器運行時（使用{{< glossary_tooltip term_id="cri" >}}）
一起爲 Pod 生成運行時沙箱並設定網路。如果啓用了 `PodReadyToStartContainersCondition` 
[特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)
（Kubernetes {{< skew currentVersion >}} 版本中默認啓用），
`PodReadyToStartContainers` 狀況會被添加到 Pod 的 `status.conditions` 字段中。

<!--
The `PodReadyToStartContainers` condition is set to `False` by the Kubelet when it detects a
Pod does not have a runtime sandbox with networking configured. This occurs in
the following scenarios:
-->
當 kubelet 檢測到 Pod 不具備設定了網路的運行時沙箱時，`PodReadyToStartContainers`
狀況將被設置爲 `False`。以下場景中將會發生這種狀況：

<!--
- Early in the lifecycle of the Pod, when the kubelet has not yet begun to set up a sandbox for
  the Pod using the container runtime.
- Later in the lifecycle of the Pod, when the Pod sandbox has been destroyed due to either:
  - the node rebooting, without the Pod getting evicted
  - for container runtimes that use virtual machines for isolation, the Pod
    sandbox virtual machine rebooting, which then requires creating a new sandbox and
    fresh container network configuration.
-->
* 在 Pod 生命週期的早期階段，kubelet 還沒有開始使用容器運行時爲 Pod 設置沙箱時。
* 在 Pod 生命週期的末期階段，Pod 的沙箱由於以下原因被銷燬時：
  * 節點重啓時 Pod 沒有被驅逐
  * 對於使用虛擬機進行隔離的容器運行時，Pod 沙箱虛擬機重啓時，需要創建一個新的沙箱和全新的容器網路設定。

<!--
The `PodReadyToStartContainers` condition is set to `True` by the kubelet after the
successful completion of sandbox creation and network configuration for the Pod
by the runtime plugin. The kubelet can start pulling container images and create
containers after `PodReadyToStartContainers` condition has been set to `True`.
-->
在運行時插件成功完成 Pod 的沙箱創建和網路設定後，
kubelet 會將 `PodReadyToStartContainers` 狀況設置爲 `True`。
當 `PodReadyToStartContainers` 狀況設置爲 `True` 後，
Kubelet 可以開始拉取容器映像檔和創建容器。

<!--
For a Pod with init containers, the kubelet sets the `Initialized` condition to
`True` after the init containers have successfully completed (which happens
after successful sandbox creation and network configuration by the runtime
plugin). For a Pod without init containers, the kubelet sets the `Initialized`
condition to `True` before sandbox creation and network configuration starts.
-->
對於帶有 Init 容器的 Pod，kubelet 會在 Init 容器成功完成後將 `Initialized` 狀況設置爲 `True`
（這發生在運行時成功創建沙箱和設定網路之後），
對於沒有 Init 容器的 Pod，kubelet 會在創建沙箱和網路設定開始之前將
`Initialized` 狀況設置爲 `True`。

<!--
## Container probes

A _probe_ is a diagnostic performed periodically by the [kubelet](/docs/reference/command-line-tools-reference/kubelet/)
on a container. To perform a diagnostic, the kubelet either executes code within the container,
or makes a network request.
-->
## 容器探針    {#container-probes}

**probe** 是由 [kubelet](/zh-cn/docs/reference/command-line-tools-reference/kubelet/) 對容器執行的定期診斷。
要執行診斷，kubelet 既可以在容器內執行代碼，也可以發出一個網路請求。

<!--
### Check mechanisms {#probe-check-methods}

There are four different ways to check a container using a probe.
Each probe must define exactly one of these four mechanisms:

`exec`
: Executes a specified command inside the container. The diagnostic
  is considered successful if the command exits with a status code of 0.

`grpc`
: Performs a remote procedure call using [gRPC](https://grpc.io/).
  The target should implement
  [gRPC health checks](https://grpc.io/grpc/core/md_doc_health-checking.html).
  The diagnostic is considered successful if the `status`
  of the response is `SERVING`.

`httpGet`
: Performs an HTTP `GET` request against the Pod's IP
  address on a specified port and path. The diagnostic is
  considered successful if the response has a status code
  greater than or equal to 200 and less than 400.

`tcpSocket`
: Performs a TCP check against the Pod's IP address on
  a specified port. The diagnostic is considered successful if
  the port is open. If the remote system (the container) closes
  the connection immediately after it opens, this counts as healthy.

-->
### 檢查機制    {#probe-check-methods}

使用探針來檢查容器有四種不同的方法。
每個探針都必須準確定義爲這四種機制中的一種：

`exec`
: 在容器內執行指定命令。如果命令退出時返回碼爲 0 則認爲診斷成功。

`grpc`
: 使用 [gRPC](https://grpc.io/) 執行一個遠程過程調用。
  目標應該實現
  [gRPC 健康檢查](https://grpc.io/grpc/core/md_doc_health-checking.html)。
  如果響應的狀態是 "SERVING"，則認爲診斷成功。

`httpGet`
: 對容器的 IP 地址上指定端口和路徑執行 HTTP `GET` 請求。如果響應的狀態碼大於等於 200
  且小於 400，則診斷被認爲是成功的。

`tcpSocket`
: 對容器的 IP 地址上的指定端口執行 TCP 檢查。如果端口打開，則診斷被認爲是成功的。
  如果遠程系統（容器）在打開連接後立即將其關閉，這算作是健康的。

<!--
{{< caution >}} Unlike the other mechanisms, `exec` probe's implementation involves the creation/forking of multiple processes each time when executed.
As a result, in case of the clusters having higher pod densities, lower intervals of `initialDelaySeconds`, `periodSeconds`, configuring any probe with exec mechanism might introduce an overhead on the cpu usage of the node.
In such scenarios, consider using the alternative probe mechanisms to avoid the overhead.{{< /caution >}}
-->
{{< caution >}}
和其他機制不同，`exec` 探針的實現涉及每次執行時創建/複製多個進程。
因此，在叢集中具有較高 pod 密度、較低的 `initialDelaySeconds` 和 `periodSeconds` 時長的時候，
設定任何使用 exec 機制的探針可能會增加節點的 CPU 負載。
這種場景下，請考慮使用其他探針機制以避免額外的開銷。
{{< /caution >}}

<!--
### Probe outcome
Each probe has one of three results:

`Success`
: The container passed the diagnostic.

`Failure`
: The container failed the diagnostic.

`Unknown`
: The diagnostic failed (no action should be taken, and the kubelet
  will make further checks).

-->
### 探測結果    {#probe-outcome}

每次探測都將獲得以下三種結果之一：

`Success`（成功）
: 容器通過了診斷。

`Failure`（失敗）
: 容器未通過診斷。

`Unknown`（未知）
: 診斷失敗，因此不會採取任何行動。

<!--
### Types of probe

The kubelet can optionally perform and react to three kinds of probes on running
containers:
-->
### 探測類型    {#types-of-probe}

針對運行中的容器，`kubelet` 可以選擇是否執行以下三種探針，以及如何針對探測結果作出反應：

<!--
`livenessProbe`
: Indicates whether the container is running. If
  the liveness probe fails, the kubelet kills the container, and the container
  is subjected to its [restart policy](#restart-policy). If a container does not
  provide a liveness probe, the default state is `Success`.

`readinessProbe`
: Indicates whether the container is ready to respond to requests.
  If the readiness probe fails, the {{< glossary_tooltip term_id="endpoint-slice" text="EndpointSlice" >}}
  controller removes the Pod's IP address from the EndpointSlices of all Services that match the Pod.
  The default state of readiness before the initial delay is `Failure`. If a container does
  not provide a readiness probe, the default state is `Success`.

`startupProbe`
: Indicates whether the application within the container is started.
  All other probes are disabled if a startup probe is provided, until it succeeds.
  If the startup probe fails, the kubelet kills the container, and the container
  is subjected to its [restart policy](#restart-policy). If a container does not
  provide a startup probe, the default state is `Success`.
-->

`livenessProbe`
: 指示容器是否正在運行。如果存活態探測失敗，則 kubelet 會殺死容器，
  並且容器將根據其[重啓策略](#restart-policy)決定未來。如果容器不提供存活探針，
  則默認狀態爲 `Success`。

`readinessProbe`
: 指示容器是否準備好爲請求提供服務。如果就緒態探測失敗，
  {{< glossary_tooltip term_id="endpoint-slice" text="EndpointSlice" >}} 
  控制器將從與該 Pod 匹配的所有 Service 的 EndpointSlice 中刪除該 Pod 的 IP 地址。
  初始延遲之前的就緒態的狀態值默認爲 `Failure`。
  如果容器不提供就緒態探針，則默認狀態爲 `Success`。

`startupProbe`
: 指示容器中的應用是否已經啓動。如果提供了啓動探針，則所有其他探針都會被
  禁用，直到此探針成功爲止。如果啓動探測失敗，`kubelet` 將殺死容器，
  而容器依其[重啓策略](#restart-policy)進行重啓。
  如果容器沒有提供啓動探測，則默認狀態爲 `Success`。

<!--
For more information about how to set up a liveness, readiness, or startup probe,
see [Configure Liveness, Readiness and Startup Probes](/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/).
-->
如欲瞭解如何設置存活態、就緒態和啓動探針的進一步細節，
可以參閱[設定存活態、就緒態和啓動探針](/zh-cn/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/)。

<!--
#### When should you use a liveness probe?
-->
#### 何時該使用存活態探針?    {#when-should-you-use-a-liveness-probe}

<!--
If the process in your container is able to crash on its own whenever it
encounters an issue or becomes unhealthy, you do not necessarily need a liveness
probe; the kubelet will automatically perform the correct action in accordance
with the Pod's `restartPolicy`.

If you'd like your container to be killed and restarted if a probe fails, then
specify a liveness probe, and specify a `restartPolicy` of Always or OnFailure.
-->
如果容器中的進程能夠在遇到問題或不健康的情況下自行崩潰，則不一定需要存活態探針；
`kubelet` 將根據 Pod 的 `restartPolicy` 自動執行修復操作。

如果你希望容器在探測失敗時被殺死並重新啓動，那麼請指定一個存活態探針，
並指定 `restartPolicy` 爲 "`Always`" 或 "`OnFailure`"。

<!--
#### When should you use a readiness probe?
-->
#### 何時該使用就緒態探針？      {#when-should-you-use-a-readiness-probe}

<!--
If you'd like to start sending traffic to a Pod only when a probe succeeds,
specify a readiness probe. In this case, the readiness probe might be the same
as the liveness probe, but the existence of the readiness probe in the spec means
that the Pod will start without receiving any traffic and only start receiving
traffic after the probe starts succeeding.
-->
如果要僅在探測成功時纔開始向 Pod 發送請求流量，請指定就緒態探針。
在這種情況下，就緒態探針可能與存活態探針相同，但是規約中的就緒態探針的存在意味着
Pod 將在啓動階段不接收任何數據，並且只有在探針探測成功後纔開始接收數據。

<!--
If you want your container to be able to take itself down for maintenance, you
can specify a readiness probe that checks an endpoint specific to readiness that
is different from the liveness probe.
-->
如果你希望容器能夠自行進入維護狀態，也可以指定一個就緒態探針，
檢查某個特定於就緒態的因此不同於存活態探測的端點。

<!--
If your app has a strict dependency on back-end services, you can implement both
a liveness and a readiness probe. The liveness probe passes when the app itself
is healthy, but the readiness probe additionally checks that each required
back-end service is available. This helps you avoid directing traffic to Pods
that can only respond with error messages.

If your container needs to work on loading large data, configuration files, or
migrations during startup, you can use a
[startup probe](#when-should-you-use-a-startup-probe). However, if you want to
detect the difference between an app that has failed and an app that is still
processing its startup data, you might prefer a readiness probe.
-->
如果你的應用程序對後端服務有嚴格的依賴性，你可以同時實現存活態和就緒態探針。
當應用程序本身是健康的，存活態探針檢測通過後，就緒態探針會額外檢查每個所需的後端服務是否可用。
這可以幫助你避免將流量導向只能返回錯誤信息的 Pod。

如果你的容器需要在啓動期間加載大型數據、設定文件或執行遷移，
你可以使用[啓動探針](#when-should-you-use-a-startup-probe)。
然而，如果你想區分已經失敗的應用和仍在處理其啓動數據的應用，你可能更傾向於使用就緒探針。

{{< note >}}
<!--
If you want to be able to drain requests when the Pod is deleted, you do not
necessarily need a readiness probe; when the Pod is deleted, the corresponding endpoint
in the `EndpointSlice` will update its [conditions](/docs/concepts/services-networking/endpoint-slices/#conditions):
the endpoint `ready` condition will be set to `false`, so load balancers
will not use the Pod for regular traffic. See [Pod termination](#pod-termination)
for more information about how the kubelet handles Pod deletion.
-->
請注意，如果你只是想在 Pod 被刪除時能夠排空請求，則不一定需要使用就緒態探針；
當 Pod 被刪除時，`EndpointSlice` 中對應的端點會更新其[狀況](/zh-cn/docs/concepts/services-networking/endpoint-slices/#conditions)：
該端點的 `ready` 狀況將被設置爲 `false`，因此負載均衡器不會再將該 Pod 用於常規流量。
關於 kubelet 如何處理 Pod 刪除的更多信息，請參見 [Pod 終止](#pod-termination)。
{{< /note >}}

<!--
#### When should you use a startup probe?
-->
#### 何時該使用啓動探針？   {#when-should-you-use-a-startup-probe}

<!--
Startup probes are useful for Pods that have containers that take a long time to
come into service. Rather than set a long liveness interval, you can configure
a separate configuration for probing the container as it starts up, allowing
a time longer than the liveness interval would allow.
-->
對於所包含的容器需要較長時間才能啓動就緒的 Pod 而言，啓動探針是有用的。
你不再需要設定一個較長的存活態探測時間間隔，只需要設置另一個獨立的設定選定，
對啓動期間的容器執行探測，從而允許使用遠遠超出存活態時間間隔所允許的時長。

<!-- ensure front matter contains math: true -->

<!--
If your container usually starts in more than
\\( initialDelaySeconds + failureThreshold \times  periodSeconds \\), you should specify a
startup probe that checks the same endpoint as the liveness probe. The default for
`periodSeconds` is 10s. You should then set its `failureThreshold` high enough to
allow the container to start, without changing the default values of the liveness
probe. This helps to protect against deadlocks.
-->
如果你的容器啓動時間通常超出 \\( initialDelaySeconds + failureThreshold \times  periodSeconds \\)
總值，你應該設置一個啓動探測，對存活態探針所使用的同一端點執行檢查。
`periodSeconds` 的默認值是 10 秒。你應該將其 `failureThreshold` 設置得足夠高，
以便容器有充足的時間完成啓動，並且避免更改存活態探針所使用的默認值。
這一設置有助於減少死鎖狀況的發生。

<!--
## Termination of Pods {#pod-termination}

Because Pods represent processes running on nodes in the cluster, it is important to
allow those processes to gracefully terminate when they are no longer needed (rather
than being abruptly stopped with a `KILL` signal and having no chance to clean up).
-->
## Pod 的終止    {#pod-termination}

由於 Pod 所代表的是在叢集中節點上運行的進程，當不再需要這些進程時允許其體面地終止是很重要的。
一般不應武斷地使用 `KILL` 信號終止它們，導致這些進程沒有機會完成清理操作。

<!--
The design aim is for you to be able to request deletion and know when processes
terminate, but also be able to ensure that deletes eventually complete.
When you request deletion of a Pod, the cluster records and tracks the intended grace period
before the Pod is allowed to be forcefully killed. With that forceful shutdown tracking in
place, the {{< glossary_tooltip text="kubelet" term_id="kubelet" >}} attempts graceful
shutdown.
-->
設計的目標是令你能夠請求刪除進程，並且知道進程何時被終止，同時也能夠確保刪除操作終將完成。
當你請求刪除某個 Pod 時，叢集會記錄並跟蹤 Pod 的體面終止週期，
而不是直接強制地殺死 Pod。在存在強制關閉設施的前提下，
{{< glossary_tooltip text="kubelet" term_id="kubelet" >}} 會嘗試體面地終止
Pod。

<!--
Typically, with this graceful termination of the pod, kubelet makes requests to the container runtime
to attempt to stop the containers in the pod by first sending a TERM (aka. SIGTERM) signal,
with a grace period timeout, to the main process in each container.
The requests to stop the containers are processed by the container runtime asynchronously.
There is no guarantee to the order of processing for these requests.
Many container runtimes respect the `STOPSIGNAL` value defined in the container image and,
if different, send the container image configured STOPSIGNAL instead of TERM.
Once the grace period has expired, the KILL signal is sent to any remaining
processes, and the Pod is then deleted from the
{{< glossary_tooltip text="API Server" term_id="kube-apiserver" >}}. If the kubelet or the
container runtime's management service is restarted while waiting for processes to terminate, the
cluster retries from the start including the full original grace period.
-->
通常 Pod 體面終止的過程爲：kubelet 先發送一個帶有體面超時限期的 TERM（又名 SIGTERM）
信號到每個容器中的主進程，將請求發送到容器運行時來嘗試停止 Pod 中的容器。
停止容器的這些請求由容器運行時以異步方式處理。
這些請求的處理順序無法被保證。許多容器運行時遵循容器映像檔內定義的 `STOPSIGNAL` 值，
如果不同，則發送容器映像檔中設定的 STOPSIGNAL，而不是 TERM 信號。
一旦超出了體面終止限期，容器運行時會向所有剩餘進程發送 KILL 信號，之後
Pod 就會被從 {{< glossary_tooltip text="API 伺服器" term_id="kube-apiserver" >}}上移除。
如果 `kubelet` 或者容器運行時的管理服務在等待進程終止期間被重啓，
叢集會從頭開始重試，賦予 Pod 完整的體面終止限期。

<!--
### Stop Signals {#pod-termination-stop-signals}

The stop signal used to kill the container can be defined in the container image with the `STOPSIGNAL` instruction.
If no stop signal is defined in the image, the default signal of the container runtime
(SIGTERM for both containerd and CRI-O) would be used to kill the container.
-->
### 停止信號 {#pod-termination-stop-signals}

用於終止容器的停止信號可以通過容器映像檔中的 `STOPSIGNAL` 指令進行定義。
如果映像檔中未定義停止信號，容器運行時（containerd 和 CRI-O 都是 SIGTERM）
會使用默認的停止信號來終止容器。

<!--
### Defining custom stop signals

{{< feature-state feature_gate_name="ContainerStopSignals" >}}

If the `ContainerStopSignals` feature gate is enabled, you can configure a custom stop signal
for your containers from the container Lifecycle. We require the Pod's `spec.os.name` field
to be present as a requirement for defining stop signals in the container lifecycle.
The list of signals that are valid depends on the OS the Pod is scheduled to.
For Pods scheduled to Windows nodes, we only support SIGTERM and SIGKILL as valid signals.

Here is an example Pod spec defining a custom stop signal:

```yaml
spec:
  os:
    name: linux
  containers:
    - name: my-container
      image: container-image:latest
      lifecycle:
        stopSignal: SIGUSR1
```

If a stop signal is defined in the lifecycle, this will override the signal defined in the container image.
If no stop signal is defined in the container spec, the container would fall back to the default behavior.
-->
### 定義自定義停止信號  {#Defining-custom-stop-signals}

{{< feature-state feature_gate_name="ContainerStopSignals" >}}

如果啓用了 `ContainerStopSignals` 特性門控（feature gate），
你可以通過容器的生命週期（Lifecycle）設定自定義的停止信號。
在容器生命週期中定義停止信號時，Pod 的 `spec.os.name` 字段必須存在。
可用的信號列表取決於 Pod 調度到的操作系統。
對於調度到 Windows 節點的 Pod，僅支持 SIGTERM 和 SIGKILL 信號。

以下是一個定義了自定義停止信號的 Pod 示例：

```yaml
spec:
  os:
    name: linux
  containers:
    - name: my-container
      image: container-image:latest
      lifecycle:
        stopSignal: SIGUSR1
```

<!--
### Pod Termination Flow {#pod-termination-flow}

Pod termination flow, illustrated with an example:

1. You use the `kubectl` tool to manually delete a specific Pod, with the default grace period
   (30 seconds).

1. The Pod in the API server is updated with the time beyond which the Pod is considered "dead"
   along with the grace period.
   If you use `kubectl describe` to check the Pod you're deleting, that Pod shows up as "Terminating".
   On the node where the Pod is running: as soon as the kubelet sees that a Pod has been marked
   as terminating (a graceful shutdown duration has been set), the kubelet begins the local Pod
   shutdown process.
-->
### Pod 終止流程 {#pod-termination-flow}

Pod 終止流程，如下例所示：

1. 你使用 `kubectl` 工具手動刪除某個特定的 Pod，而該 Pod 的體面終止限期是默認值（30 秒）。

2. API 伺服器中的 Pod 對象被更新，記錄涵蓋體面終止限期在內 Pod
   的最終死期，超出所計算時間點則認爲 Pod 已死（dead）。
   如果你使用 `kubectl describe` 來查驗你正在刪除的 Pod，該 Pod 會顯示爲
   "Terminating" （正在終止）。
   在 Pod 運行所在的節點上：`kubelet` 一旦看到 Pod
   被標記爲正在終止（已經設置了體面終止限期），`kubelet` 即開始本地的 Pod 關閉過程。

   <!--
   1. If one of the Pod's containers has defined a `preStop`
      [hook](/docs/concepts/containers/container-lifecycle-hooks) and the `terminationGracePeriodSeconds`
      in the Pod spec is not set to 0, the kubelet runs that hook inside of the container.
      The default `terminationGracePeriodSeconds` setting is 30 seconds.

      If the `preStop` hook is still running after the grace period expires, the kubelet requests
      a small, one-off grace period extension of 2 seconds.
   -->

   1. 如果 Pod 中的容器之一定義了 `preStop`
      [回調](/zh-cn/docs/concepts/containers/container-lifecycle-hooks)
      且 Pod 規約中的 `terminationGracePeriodSeconds` 未設爲 0，
      `kubelet` 開始在容器內運行該回調邏輯。默認的 `terminationGracePeriodSeconds`
      設置爲 30 秒.

      如果 `preStop` 回調在體面期結束後仍在運行，kubelet 將請求短暫的、一次性的體面期延長 2 秒。

   <!--
   If the `preStop` hook needs longer to complete than the default grace period allows,
   you must modify `terminationGracePeriodSeconds` to suit this.
   -->

   {{< note >}}
   如果 `preStop` 回調所需要的時間長於默認的體面終止限期，你必須修改
   `terminationGracePeriodSeconds` 屬性值來使其正常工作。
   {{< /note >}}

   <!--
   1. The kubelet triggers the container runtime to send a TERM signal to process 1 inside each
      container.
   -->

   2. `kubelet` 接下來觸發容器運行時發送 TERM 信號給每個容器中的進程 1。

      <!--
      There is [special ordering](#termination-with-sidecars) if the Pod has any
      {{< glossary_tooltip text="sidecar containers" term_id="sidecar-container" >}} defined.
      Otherwise, the containers in the Pod receive the TERM signal at different times and in
      an arbitrary order. If the order of shutdowns matters, consider using a `preStop` hook
      to synchronize (or switch to using sidecar containers).
      -->

      如果 Pod 中定義了{{< glossary_tooltip text="Sidecar 容器" term_id="sidecar-container" >}}，
      則存在[特殊排序](#termination-with-sidecars)。否則，Pod 中的容器會在不同的時間和任意的順序接收
      TERM 信號。如果關閉順序很重要，考慮使用 `preStop` 鉤子進行同步（或者切換爲使用 Sidecar 容器）。

<!--
1. At the same time as the kubelet is starting graceful shutdown of the Pod, the control plane
   evaluates whether to remove that shutting-down Pod from EndpointSlice objects,
   where those objects represent a {{< glossary_tooltip term_id="service" text="Service" >}}
   with a configured {{< glossary_tooltip text="selector" term_id="selector" >}}.
   {{< glossary_tooltip text="ReplicaSets" term_id="replica-set" >}} and other workload resources
   no longer treat the shutting-down Pod as a valid, in-service replica.

   Pods that shut down slowly should not continue to serve regular traffic and should start
   terminating and finish processing open connections.  Some applications need to go beyond
   finishing open connections and need more graceful termination, for example, session draining
   and completion.
-->
3. 在 `kubelet` 啓動 Pod 的體面關閉邏輯的同時，控制平面會評估是否將關閉的
   Pod 從對應的 EndpointSlice 對象中移除，過濾條件是 Pod
   被對應的{{< glossary_tooltip term_id="service" text="服務" >}}以某
   {{< glossary_tooltip text="選擇算符" term_id="selector" >}}選定。
   {{< glossary_tooltip text="ReplicaSet" term_id="replica-set" >}}
   和其他工作負載資源不再將關閉進程中的 Pod 視爲合法的、能夠提供服務的副本。

   關閉動作很慢的 Pod 不應繼續處理常規服務請求，而應開始終止並完成對打開的連接的處理。
   一些應用程序不僅需要完成對打開的連接的處理，還需要更進一步的體面終止邏輯 -
   比如：排空和完成會話。

   <!--
   Any endpoints that represent the terminating Pods are not immediately removed from
   EndpointSlices, and a status indicating [terminating state](/docs/concepts/services-networking/endpoint-slices/#conditions)
   is exposed from the EndpointSlice API.
   Terminating endpoints always have their `ready` status as `false` (for backward compatibility
   with versions before 1.26), so load balancers will not use it for regular traffic.

   If traffic draining on terminating Pod is needed, the actual readiness can be checked as a
   condition `serving`.  You can find more details on how to implement connections draining in the
   tutorial [Pods And Endpoints Termination Flow](/docs/tutorials/services/pods-and-endpoint-termination-flow/)
   -->
   任何正在終止的 Pod 所對應的端點都不會立即從 EndpointSlice
   中被刪除，EndpointSlice API 會公開一個狀態來指示其處於
   [終止狀態](/zh-cn/docs/concepts/services-networking/endpoint-slices/#conditions)。
   正在終止的端點始終將其 `ready` 狀態設置爲 `false`（爲了向後兼容 1.26 之前的版本），
   因此負載均衡器不會將其用於常規流量。

   如果需要排空正被終止的 Pod 上的流量，可以將 `serving` 狀況作爲實際的就緒狀態。你可以在教程
   [探索 Pod 及其端點的終止行爲](/zh-cn/docs/tutorials/services/pods-and-endpoint-termination-flow/)
   中找到有關如何實現連接排空的更多詳細信息。

   <a id="pod-termination-beyond-grace-period" />

<!--
1. The kubelet ensures the Pod is shut down and terminated
   1. When the grace period expires, if there is still any container running in the Pod, the
      kubelet triggers forcible shutdown.
      The container runtime sends `SIGKILL` to any processes still running in any container in the Pod.
      The kubelet also cleans up a hidden `pause` container if that container runtime uses one.
   1. The kubelet transitions the Pod into a terminal phase (`Failed` or `Succeeded` depending on
      the end state of its containers).
   1. The kubelet triggers forcible removal of the Pod object from the API server, by setting grace period
      to 0 (immediate deletion).
   1. The API server deletes the Pod's API object, which is then no longer visible from any client.
-->
4. kubelet 確保 Pod 被關閉和終止

   1. 超出終止寬限期限時，如果 Pod 中仍有容器在運行，kubelet 會觸發強制關閉過程。
      容器運行時會向 Pod 中所有容器內仍在運行的進程發送 `SIGKILL` 信號。
      `kubelet` 也會清理隱藏的 `pause` 容器，如果容器運行時使用了這種容器的話。

   1. `kubelet` 將 Pod 轉換到終止階段（`Failed` 或 `Succeeded`，具體取決於其容器的結束狀態）。

   1. kubelet 通過將寬限期設置爲 0（立即刪除），觸發從 API 伺服器強制移除 Pod 對象的操作。

   1. API 伺服器刪除 Pod 的 API 對象，從任何客戶端都無法再看到該對象。

<!--
### Forced Pod termination {#pod-termination-forced}
-->
### 強制終止 Pod     {#pod-termination-forced}

{{< caution >}}
<!--
Forced deletions can be potentially disruptive for some workloads and their Pods.
-->
對於某些工作負載及其 Pod 而言，強制刪除很可能會帶來某種破壞。
{{< /caution >}}

<!--
By default, all deletes are graceful within 30 seconds. The `kubectl delete` command supports
the `--grace-period=<seconds>` option which allows you to override the default and specify your
own value.
-->
默認情況下，所有的刪除操作都會附有 30 秒鐘的寬限期限。
`kubectl delete` 命令支持 `--grace-period=<seconds>` 選項，允許你重載默認值，
設定自己希望的期限值。

<!--
Setting the grace period to `0` forcibly and immediately deletes the Pod from the API
server. If the Pod was still running on a node, that forcible deletion triggers the kubelet to
begin immediate cleanup.
-->
將寬限期限強制設置爲 `0` 意味着立即從 API 伺服器刪除 Pod。
如果 Pod 仍然運行於某節點上，強制刪除操作會觸發 `kubelet` 立即執行清理操作。

<!--
Using kubectl, You must specify an additional flag `--force` along with `--grace-period=0`
in order to perform force deletions.
-->
使用 kubectl 時，你必須在設置 `--grace-period=0` 的同時額外設置 `--force` 參數才能發起強制刪除請求。

<!--
When a force deletion is performed, the API server does not wait for confirmation
from the kubelet that the Pod has been terminated on the node it was running on. It
removes the Pod in the API immediately so a new Pod can be created with the same
name. On the node, Pods that are set to terminate immediately will still be given
a small grace period before being force killed.
-->
執行強制刪除操作時，API 伺服器不再等待來自 `kubelet` 的、關於 Pod
已經在原來運行的節點上終止執行的確認消息。
API 伺服器直接刪除 Pod 對象，這樣新的與之同名的 Pod 即可以被創建。
在節點側，被設置爲立即終止的 Pod 仍然會在被強行殺死之前獲得一點點的寬限時間。

{{< caution >}}
<!--
Immediate deletion does not wait for confirmation that the running resource has been terminated.
The resource may continue to run on the cluster indefinitely.
-->
馬上刪除時不等待確認正在運行的資源已被終止。這些資源可能會無限期地繼續在叢集上運行。
{{< /caution >}}

<!--
If you need to force-delete Pods that are part of a StatefulSet, refer to the task
documentation for
[deleting Pods from a StatefulSet](/docs/tasks/run-application/force-delete-stateful-set-pod/).
-->
如果你需要強制刪除 StatefulSet 的 Pod，
請參閱[從 StatefulSet 中刪除 Pod](/zh-cn/docs/tasks/run-application/force-delete-stateful-set-pod/)
的任務文檔。

<!--
### Pod shutdown and sidecar containers {##termination-with-sidecars}

If your Pod includes one or more
[sidecar containers](/docs/concepts/workloads/pods/sidecar-containers/)
(init containers with an Always restart policy), the kubelet will delay sending
the TERM signal to these sidecar containers until the last main container has fully terminated.
The sidecar containers will be terminated in the reverse order they are defined in the Pod spec.
This ensures that sidecar containers continue serving the other containers in the Pod until they
are no longer needed.
-->
### Pod 關閉和 Sidecar 容器 {#termination-with-sidecars}

如果你的 Pod 包含一個或多個 [Sidecar 容器](/zh-cn/docs/concepts/workloads/pods/sidecar-containers/)
（重啓策略爲 Always 的 Init 容器），kubelet 將延遲向這些 Sidecar 容器發送 TERM 信號，
直到最後一個主容器已完全終止。Sidecar 容器將按照它們在 Pod 規約中被定義的相反順序被終止。
這樣確保了 Sidecar 容器繼續爲 Pod 中的其他容器提供服務，直到完全不再需要爲止。

<!--
This means that slow termination of a main container will also delay the termination of the sidecar containers.
If the grace period expires before the termination process is complete, the Pod may enter [forced termination](#pod-termination-beyond-grace-period).
In this case, all remaining containers in the Pod will be terminated simultaneously with a short grace period.

Similarly, if the Pod has a `preStop` hook that exceeds the termination grace period, emergency termination may occur.
In general, if you have used `preStop` hooks to control the termination order without sidecar containers, you can now
remove them and allow the kubelet to manage sidecar termination automatically.
-->
這意味着主容器的慢終止也會延遲 Sidecar 容器的終止。
如果在終止過程完成之前寬限期已到，Pod 可能會進入[強制終止](#pod-termination-beyond-grace-period)階段。
在這種情況下，Pod 中所有剩餘的容器將在某個短寬限期內被同時終止。

同樣地，如果 Pod 有一個 `preStop` 鉤子超過了終止寬限期，可能會發生緊急終止。
總體而言，如果你以前使用 `preStop` 鉤子來控制沒有 Sidecar 的 Pod 中容器的終止順序，
你現在可以移除這些鉤子，允許 kubelet 自動管理 Sidecar 的終止。

<!--
### Garbage collection of Pods {#pod-garbage-collection}

For failed Pods, the API objects remain in the cluster's API until a human or
{{< glossary_tooltip term_id="controller" text="controller" >}} process
explicitly removes them.

The Pod garbage collector (PodGC), which is a controller in the control plane, cleans up
terminated Pods (with a phase of `Succeeded` or `Failed`), when the number of Pods exceeds the
configured threshold (determined by `terminated-pod-gc-threshold` in the kube-controller-manager).
This avoids a resource leak as Pods are created and terminated over time.
-->
### Pod 的垃圾收集    {#pod-garbage-collection}

對於已失敗的 Pod 而言，對應的 API 對象仍然會保留在叢集的 API 伺服器上，
直到使用者或者{{< glossary_tooltip term_id="controller" text="控制器" >}}進程顯式地將其刪除。

Pod 的垃圾收集器（PodGC）是控制平面的控制器，它會在 Pod 個數超出所設定的閾值
（根據 `kube-controller-manager` 的 `terminated-pod-gc-threshold` 設置）時刪除已終止的
Pod（階段值爲 `Succeeded` 或 `Failed`）。
這一行爲會避免隨着時間演進不斷創建和終止 Pod 而引起的資源泄露問題。

<!--
Additionally, PodGC cleans up any Pods which satisfy any of the following conditions:

1. are orphan Pods - bound to a node which no longer exists,
1. are unscheduled terminating Pods,
1. are terminating Pods, bound to a non-ready node tainted with
   [`node.kubernetes.io/out-of-service`](/docs/reference/labels-annotations-taints/#node-kubernetes-io-out-of-service).

Along with cleaning up the Pods, PodGC will also mark them as failed if they are in a non-terminal
phase. Also, PodGC adds a Pod disruption condition when cleaning up an orphan Pod.
See [Pod disruption conditions](/docs/concepts/workloads/pods/disruptions#pod-disruption-conditions)
for more details.
-->
此外，PodGC 會清理滿足以下任一條件的所有 Pod：

1. 孤兒 Pod - 綁定到不再存在的節點，
2. 計劃外終止的 Pod
3. 終止過程中的 Pod，綁定到有
   [`node.kubernetes.io/out-of-service`](/zh-cn/docs/reference/labels-annotations-taints/#node-kubernetes-io-out-of-service)
   污點的未就緒節點。

在清理 Pod 的同時，如果它們處於非終止狀態階段，PodGC 也會將它們標記爲失敗。
此外，PodGC 在清理孤兒 Pod 時會添加 Pod 干擾狀況。參閱
[Pod 干擾狀況](/zh-cn/docs/concepts/workloads/pods/disruptions#pod-disruption-conditions) 瞭解更多詳情。

## {{% heading "whatsnext" %}}

<!--
* Get hands-on experience
  [attaching handlers to container lifecycle events](/docs/tasks/configure-pod-container/attach-handler-lifecycle-event/).

* Get hands-on experience
  [configuring Liveness, Readiness and Startup Probes](/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/).

* Learn more about [container lifecycle hooks](/docs/concepts/containers/container-lifecycle-hooks/).

* Learn more about [sidecar containers](/docs/concepts/workloads/pods/sidecar-containers/).

* For detailed information about Pod and container status in the API, see
  the API reference documentation covering
  [`status`](/docs/reference/kubernetes-api/workload-resources/pod-v1/#PodStatus) for Pod.
-->
* 動手實踐[爲容器生命週期時間關聯處理程序](/zh-cn/docs/tasks/configure-pod-container/attach-handler-lifecycle-event/)。
* 動手實踐[設定存活態、就緒態和啓動探針](/zh-cn/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/)。
* 進一步瞭解[容器生命週期回調](/zh-cn/docs/concepts/containers/container-lifecycle-hooks/)。
* 進一步瞭解 [Sidecar 容器](/zh-cn/docs/concepts/workloads/pods/sidecar-containers/)。
* 關於 API 中定義的有關 Pod 和容器狀態的詳細規範信息，
  可參閱 API 參考文檔中 Pod 的 [`status`](/zh-cn/docs/reference/kubernetes-api/workload-resources/pod-v1/#PodStatus) 字段。
