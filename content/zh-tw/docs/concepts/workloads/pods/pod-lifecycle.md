---
title: Pod 的生命週期
content_type: concept
weight: 30
---
<!--
title: Pod Lifecycle
content_type: concept
weight: 30
-->

<!-- overview -->

<!--
This page describes the lifecycle of a Pod. Pods follow a defined lifecycle, starting
in the `Pending` [phase](#pod-phase), moving through `Running` if at least one
of its primary containers starts OK, and then through either the `Succeeded` or
`Failed` phases depending on whether any container in the Pod terminated in failure.

Whilst a Pod is running, the kubelet is able to restart containers to handle some
kind of faults. Within a Pod, Kubernetes tracks different container
[states](#container-states) and determines what action to take to make the Pod
healthy again.
-->
本頁面講述 Pod 的生命週期。
Pod 遵循一個預定義的生命週期，起始於 `Pending` [階段](#pod-phase)，如果至少
其中有一個主要容器正常啟動，則進入 `Running`，之後取決於 Pod 中是否有容器以
失敗狀態結束而進入 `Succeeded` 或者 `Failed` 階段。

在 Pod 執行期間，`kubelet` 能夠重啟容器以處理一些失效場景。
在 Pod 內部，Kubernetes 跟蹤不同容器的[狀態](#container-states)
並確定使 Pod 重新變得健康所需要採取的動作。

<!--
In the Kubernetes API, Pods have both a specification and an actual status. The
status for a Pod object consists of a set of [Pod conditions](#pod-conditions).
You can also inject [custom readiness information](#pod-readiness-gate) into the
condition data for a Pod, if that is useful to your application.

Pods are only [scheduled](/docs/concepts/scheduling-eviction/) once in their lifetime.
Once a Pod is scheduled (assigned) to a Node, the Pod runs on that Node until it stops
or is [terminated](#pod-termination).
-->
在 Kubernetes API 中，Pod 包含規約部分和實際狀態部分。
Pod 物件的狀態包含了一組 [Pod 狀況（Conditions）](#pod-conditions)。
如果應用需要的話，你也可以向其中注入[自定義的就緒性資訊](#pod-readiness-gate)。

Pod 在其生命週期中只會被[排程](/zh-cn/docs/concepts/scheduling-eviction/)一次。
一旦 Pod 被排程（分派）到某個節點，Pod 會一直在該節點執行，直到 Pod 停止或者
被[終止](#pod-termination)。

<!-- body -->

<!--
## Pod lifetime

Like individual application containers, Pods are considered to be relatively
ephemeral (rather than durable) entities. Pods are created, assigned a unique
ID ([UID](/docs/concepts/overview/working-with-objects/names/#uids)), and scheduled
to nodes where they remain until termination (according to restart policy) or
deletion.  
If a {{< glossary_tooltip term_id="node" >}} dies, the Pods scheduled to that node
are [scheduled for deletion](#pod-garbage-collection) after a timeout period.
-->
## Pod 生命期   {#pod-lifetime}

和一個個獨立的應用容器一樣，Pod 也被認為是相對臨時性（而不是長期存在）的實體。
Pod 會被建立、賦予一個唯一的
ID（[UID](/zh-cn/docs/concepts/overview/working-with-objects/names/#uids)），
並被排程到節點，並在終止（根據重啟策略）或刪除之前一直執行在該節點。

如果一個{{< glossary_tooltip text="節點" term_id="node" >}}死掉了，排程到該節點
的 Pod 也被計劃在給定超時期限結束後[刪除](#pod-garbage-collection)。

<!--
Pods do not, by themselves, self-heal. If a Pod is scheduled to a
{{< glossary_tooltip text="node" term_id="node" >}} that then fails, the Pod is deleted; likewise, a Pod won't
survive an eviction due to a lack of resources or Node maintenance. Kubernetes uses a
higher-level abstraction, called a
{{< glossary_tooltip term_id="controller" text="controller" >}}, that handles the work of
managing the relatively disposable Pod instances.
-->
Pod 自身不具有自愈能力。如果 Pod 被排程到某{{< glossary_tooltip text="節點" term_id="node" >}}
而該節點之後失效，Pod 會被刪除；類似地，Pod 無法在因節點資源
耗盡或者節點維護而被驅逐期間繼續存活。Kubernetes 使用一種高階抽象
來管理這些相對而言可隨時丟棄的 Pod 例項，稱作
{{< glossary_tooltip term_id="controller" text="控制器" >}}。

<!--
A given Pod (as defined by a UID) is never "rescheduled" to a different node; instead,
that Pod can be replaced by a new, near-identical Pod, with even the same name if
desired, but with a different UID.

When something is said to have the same lifetime as a Pod, such as a
{{< glossary_tooltip term_id="volume" text="volume" >}},
that means that the thing exists as long as that specific Pod (with that exact UID)
exists. If that Pod is deleted for any reason, and even if an identical replacement
is created, the related thing (a volume, in this example) is also destroyed and
created anew.
-->
任何給定的 Pod （由 UID 定義）從不會被“重新排程（rescheduled）”到不同的節點；
相反，這一 Pod 可以被一個新的、幾乎完全相同的 Pod 替換掉。
如果需要，新 Pod 的名字可以不變，但是其 UID 會不同。

如果某物聲稱其生命期與某 Pod 相同，例如儲存{{< glossary_tooltip term_id="volume" text="卷" >}}，
這就意味著該物件在此 Pod （UID 亦相同）存在期間也一直存在。
如果 Pod 因為任何原因被刪除，甚至某完全相同的替代 Pod 被建立時，
這個相關的物件（例如這裡的卷）也會被刪除並重建。

{{< figure src="/images/docs/pod.svg" title="Pod 結構圖例" class="diagram-medium" >}}

*一個包含多個容器的 Pod 中包含一個用來拉取檔案的程式和一個 Web 伺服器，
均使用持久卷作為容器間共享的儲存。*

<!--
## Pod phase

A Pod's `status` field is a
[PodStatus](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podstatus-v1-core)
object, which has a `phase` field.

The phase of a Pod is a simple, high-level summary of where the Pod is in its
lifecycle. The phase is not intended to be a comprehensive rollup of observations
of container or Pod state, nor is it intended to be a comprehensive state machine.

The number and meanings of Pod phase values are tightly guarded.
Other than what is documented here, nothing should be assumed about Pods that
have a given `phase` value.

Here are the possible values for `phase`:
-->
## Pod 階段     {#pod-phase}

Pod 的 `status` 欄位是一個
[PodStatus](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podstatus-v1-core)
物件，其中包含一個 `phase` 欄位。

Pod 的階段（Phase）是 Pod 在其生命週期中所處位置的簡單宏觀概述。
該階段並不是對容器或 Pod 狀態的綜合彙總，也不是為了成為完整的狀態機。

Pod 階段的數量和含義是嚴格定義的。
除了本文件中列舉的內容外，不應該再假定 Pod 有其他的 `phase` 值。

下面是 `phase` 可能的值：

<!--
Value | Description
`Pending` | The Pod has been accepted by the Kubernetes cluster, but one or more of the containers has not been set up and made ready to run. This includes time a Pod spends waiting to bescheduled as well as the time spent downloading container images over the network.
`Running` | The Pod has been bound to a node, and all of the containers have been created. At least one container is still running, or is in the process of starting or restarting.
`Succeeded` | All containers in the Pod have terminated in success, and will not be restarted.
`Failed` | All containers in the Pod have terminated, and at least one container has terminated in failure. That is, the container either exited with non-zero status or was terminated by the system.
`Unknown` | For some reason the state of the Pod could not be obtained. This phase typically occurs due to an error in communicating with the node where the Pod should be running.
-->
取值 | 描述
:-----|:-----------
`Pending`（懸決）| Pod 已被 Kubernetes 系統接受，但有一個或者多個容器尚未建立亦未執行。此階段包括等待 Pod 被排程的時間和透過網路下載映象的時間。
`Running`（執行中） | Pod 已經繫結到了某個節點，Pod 中所有的容器都已被建立。至少有一個容器仍在執行，或者正處於啟動或重啟狀態。
`Succeeded`（成功） | Pod 中的所有容器都已成功終止，並且不會再重啟。
`Failed`（失敗） | Pod 中的所有容器都已終止，並且至少有一個容器是因為失敗終止。也就是說，容器以非 0 狀態退出或者被系統終止。
`Unknown`（未知） | 因為某些原因無法取得 Pod 的狀態。這種情況通常是因為與 Pod 所在主機通訊失敗。

<!--
If a node dies or is disconnected from the rest of the cluster, Kubernetes
applies a policy for setting the `phase` of all Pods on the lost node to Failed.
-->
如果某節點死掉或者與叢集中其他節點失聯，Kubernetes
會實施一種策略，將失去的節點上執行的所有 Pod 的 `phase` 設定為 `Failed`。

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
你可以使用[容器生命週期回撥](/zh-cn/docs/concepts/containers/container-lifecycle-hooks/) 
來在容器生命週期中的特定時間點觸發事件。

一旦{{< glossary_tooltip text="排程器" term_id="kube-scheduler" >}}將 Pod
分派給某個節點，`kubelet` 就透過
{{< glossary_tooltip text="容器執行時" term_id="container-runtime" >}}
開始為 Pod 建立容器。
容器的狀態有三種：`Waiting`（等待）、`Running`（執行中）和
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
### `Waiting` （等待）  {#container-state-waiting}

如果容器並不處在 `Running` 或 `Terminated` 狀態之一，它就處在 `Waiting` 狀態。
處於 `Waiting` 狀態的容器仍在執行它完成啟動所需要的操作：例如，從某個容器映象
倉庫拉取容器映象，或者向容器應用 {{< glossary_tooltip text="Secret" term_id="secret" >}}
資料等等。
當你使用 `kubectl` 來查詢包含 `Waiting` 狀態的容器的 Pod 時，你也會看到一個
Reason 欄位，其中給出了容器處於等待狀態的原因。

<!--
### `Running` {#container-state-running}

The `Running` status indicates that a container is executing without issues. If there
was a `postStart` hook configured, it has already executed and finished. When you use
`kubectl` to query a Pod with a container that is `Running`, you also see information
about when the container entered the `Running` state.
-->
### `Running`（執行中）     {#container-state-running}

`Running` 狀態表明容器正在執行狀態並且沒有問題發生。
如果配置了 `postStart` 回撥，那麼該回調已經執行且已完成。
如果你使用 `kubectl` 來查詢包含 `Running` 狀態的容器的 Pod 時，你也會看到
關於容器進入 `Running` 狀態的資訊。

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

處於 `Terminated` 狀態的容器已經開始執行並且或者正常結束或者因為某些原因失敗。
如果你使用 `kubectl` 來查詢包含 `Terminated` 狀態的容器的 Pod 時，你會看到
容器進入此狀態的原因、退出程式碼以及容器執行期間的起止時間。

如果容器配置了 `preStop` 回撥，則該回調會在容器進入 `Terminated`
狀態之前執行。

<!--
## Container restart policy {#restart-policy}

The `spec` of a Pod has a `restartPolicy` field with possible values Always, OnFailure,
and Never. The default value is Always.

The `restartPolicy` applies to all containers in the Pod. `restartPolicy` only
refers to restarts of the containers by the kubelet on the same node. After containers
in a Pod exit, the kubelet restarts them with an exponential back-off delay (10s, 20s,
40s, …), that is capped at five minutes. Once a container has executed for 10 minutes
without any problems, the kubelet resets the restart backoff timer for
that container.
-->
## 容器重啟策略 {#restart-policy}

Pod 的 `spec` 中包含一個 `restartPolicy` 欄位，其可能取值包括
Always、OnFailure 和 Never。預設值是 Always。

`restartPolicy` 適用於 Pod 中的所有容器。`restartPolicy` 僅針對同一節點上
`kubelet` 的容器重啟動作。當 Pod 中的容器退出時，`kubelet` 會按指數回退
方式計算重啟的延遲（10s、20s、40s、...），其最長延遲為 5 分鐘。
一旦某容器執行了 10 分鐘並且沒有出現問題，`kubelet` 對該容器的重啟回退計時器執行
重置操作。

<!--
## Pod conditions

A Pod has a PodStatus, which has an array of
[PodConditions](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podcondition-v1-core)
through which the Pod has or has not passed:
-->
## Pod 狀況  {#pod-conditions}

Pod 有一個 PodStatus 物件，其中包含一個
[PodConditions](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podcondition-v1-core)
陣列。Pod 可能透過也可能未透過其中的一些狀況測試。

<!--
* `PodScheduled`: the Pod has been scheduled to a node.
* `ContainersReady`: all containers in the Pod are ready.
* `Initialized`: all [init containers](/docs/concepts/workloads/pods/init-containers/)
  have completed successfully.
* `Ready`: the Pod is able to serve requests and should be added to the load
  balancing pools of all matching Services.
-->
* `PodScheduled`：Pod 已經被排程到某節點；
* `ContainersReady`：Pod 中所有容器都已就緒；
* `Initialized`：所有的 [Init 容器](/zh-cn/docs/concepts/workloads/pods/init-containers/)
  都已成功完成；
* `Ready`：Pod 可以為請求提供服務，並且應該被新增到對應服務的負載均衡池中。

<!--
Field name           | Description
`type`               | Name of this Pod condition.
`status`             | Indicates whether that condition is applicable, with possible values "`True`", "`False`", or "`Unknown`".
`lastProbeTime`      | Timestamp of when the Pod condition was last probed.
`lastTransitionTime` | Timestamp for when the Pod last transitioned from one status to another.
`reason`             | Machine-readable, UpperCamelCase text indicating the reason for the condition's last transition.
`message`            | Human-readable message indicating details about the last status transition.
-->
欄位名稱             | 描述
:--------------------|:-----------
`type`               | Pod 狀況的名稱
`status`             | 表明該狀況是否適用，可能的取值有 "`True`", "`False`" 或 "`Unknown`"
`lastProbeTime`      | 上次探測 Pod 狀況時的時間戳
`lastTransitionTime` | Pod 上次從一種狀態轉換到另一種狀態時的時間戳
`reason`             | 機器可讀的、駝峰編碼（UpperCamelCase）的文字，表述上次狀況變化的原因
`message`            | 人類可讀的訊息，給出上次狀態轉換的詳細資訊

<!--
### Pod readiness {#pod-readiness-gate}

Your application can inject extra feedback or signals into PodStatus:
_Pod readiness_. To use this, set `readinessGates` in the Pod's `spec` to
specify a list of additional conditions that the kubelet evaluates for Pod readiness.
-->
### Pod 就緒態        {#pod-readiness-gate}

{{< feature-state for_k8s_version="v1.14" state="stable" >}}

你的應用可以向 PodStatus 中注入額外的反饋或者訊號：_Pod Readiness（Pod 就緒態）_。
要使用這一特性，可以設定 Pod 規約中的 `readinessGates` 列表，為 kubelet
提供一組額外的狀況供其評估 Pod 就緒態時使用。

<!--
Readiness gates are determined by the current state of `status.condition`
fields for the Pod. If Kubernetes cannot find such a condition in the
`status.conditions` field of a Pod, the status of the condition
is defaulted to "`False`".

Here is an example:
-->
就緒態門控基於 Pod 的 `status.conditions` 欄位的當前值來做決定。
如果 Kubernetes 無法在 `status.conditions` 欄位中找到某狀況，則該狀況的
狀態值預設為 "`False`"。

這裡是一個例子：

```yaml
kind: Pod
...
spec:
  readinessGates:
    - conditionType: "www.example.com/feature-1"
status:
  conditions:
    - type: Ready                              # 內建的 Pod 狀況
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
The Pod conditions you add must have names that meet the Kubernetes [label key format](/docs/concepts/overview/working-with-objects/labels/#syntax-and-character-set).
-->
你所新增的 Pod 狀況名稱必須滿足 Kubernetes 
[標籤鍵名格式](/zh-cn/docs/concepts/overview/working-with-objects/labels/#syntax-and-character-set)。

<!--
### Status for Pod readiness {#pod-readiness-status}

The `kubectl patch` command does not support patching object status.
To set these `status.conditions` for the pod, applications and
{{< glossary_tooltip term_id="operator-pattern" text="operators">}} should use
the `PATCH` action.
You can use a [Kubernetes client library](/docs/reference/using-api/client-libraries/) to
write code that sets custom Pod conditions for Pod readiness.
-->
### Pod 就緒態的狀態 {#pod-readiness-status}

命令 `kubectl patch` 不支援修改物件的狀態。
如果需要設定 Pod 的 `status.conditions`，應用或者
{{< glossary_tooltip term_id="operator-pattern" text="Operators">}}
需要使用 `PATCH` 操作。
你可以使用 [Kubernetes 客戶端庫](/zh-cn/docs/reference/using-api/client-libraries/)
之一來編寫程式碼，針對 Pod 就緒態設定定製的 Pod 狀況。

<!--
For a Pod that uses custom conditions, that Pod is evaluated to be ready **only**
when both the following statements apply:

* All containers in the Pod are ready.
* All conditions specified in `readinessGates` are `True`.

When a Pod's containers are Ready but at least one custom condition is missing or
`False`, the kubelet sets the Pod's [condition](#pod-conditions) to `ContainersReady`.
-->
對於使用定製狀況的 Pod 而言，只有當下面的陳述都適用時，該 Pod 才會被評估為就緒：

* Pod 中所有容器都已就緒；
* `readinessGates` 中的所有狀況都為 `True` 值。

當 Pod 的容器都已就緒，但至少一個定製狀況沒有取值或者取值為 `False`，
`kubelet` 將 Pod 的[狀況](#pod-conditions)設定為 `ContainersReady`。

<!--
## Container probes

A _probe_ is a diagnostic
performed periodically by the
[kubelet](/docs/reference/command-line-tools-reference/kubelet/)
on a container. To perform a diagnostic,
the kubelet either executes code within the container, or makes
a network request.
-->
## 容器探針    {#container-probes}

probe 是由 [kubelet](/zh-cn/docs/reference/command-line-tools-reference/kubelet/) 對容器執行的定期診斷。
要執行診斷，kubelet 既可以在容器內執行程式碼，也可以發出一個網路請求。

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
  gRPC probes are an alpha feature and are only available if you
  enable the `GRPCContainerProbe`
  [feature gate](/docs/reference/command-line-tools-reference/feature-gates/).

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
每個探針都必須準確定義為這四種機制中的一種：

`exec`
: 在容器內執行指定命令。如果命令退出時返回碼為 0 則認為診斷成功。

`grpc`
: 使用 [gRPC](https://grpc.io/) 執行一個遠端過程呼叫。
  目標應該實現
  [gRPC健康檢查](https://grpc.io/grpc/core/md_doc_health-checking.html)。
  如果響應的狀態是 "SERVING"，則認為診斷成功。
  gRPC 探針是一個 alpha 特性，只有在你啟用了
  "GRPCContainerProbe" [特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gate/)時才能使用。

`httpGet`
: 對容器的 IP 地址上指定埠和路徑執行 HTTP `GET` 請求。如果響應的狀態碼大於等於 200
  且小於 400，則診斷被認為是成功的。

`tcpSocket`
: 對容器的 IP 地址上的指定埠執行 TCP 檢查。如果埠開啟，則診斷被認為是成功的。
  如果遠端系統（容器）在開啟連線後立即將其關閉，這算作是健康的。

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
: 容器未透過診斷。

`Unknown`（未知）
: 診斷失敗，因此不會採取任何行動。

<!--
### Types of probe
The kubelet can optionally perform and react to three kinds of probes on running
containers:
-->
### 探測型別    {#types-of-probe}
針對執行中的容器，`kubelet` 可以選擇是否執行以下三種探針，以及如何針對探測結果作出反應：

<!--
`livenessProbe`
: Indicates whether the container is running. If
  the liveness probe fails, the kubelet kills the container, and the container
  is subjected to its [restart policy](#restart-policy). If a container does not
  provide a liveness probe, the default state is `Success`.

`readinessProbe`
: Indicates whether the container is ready to respond to requests.
  If the readiness probe fails, the endpoints controller removes the Pod's IP
  address from the endpoints of all Services that match the Pod. The default
  state of readiness before the initial delay is `Failure`. If a container does
  not provide a readiness probe, the default state is `Success`.

`startupProbe`
: Indicates whether the application within the container is started.
  All other probes are disabled if a startup probe is provided, until it succeeds.
  If the startup probe fails, the kubelet kills the container, and the container
  is subjected to its [restart policy](#restart-policy). If a container does not
  provide a startup probe, the default state is `Success`.
-->

`livenessProbe`
: 指示容器是否正在執行。如果存活態探測失敗，則 kubelet 會殺死容器，
  並且容器將根據其[重啟策略](#restart-policy)決定未來。如果容器不提供存活探針，
  則預設狀態為 `Success`。

`readinessProbe`
: 指示容器是否準備好為請求提供服務。如果就緒態探測失敗，
  端點控制器將從與 Pod 匹配的所有服務的端點列表中刪除該 Pod 的 IP 地址。
  初始延遲之前的就緒態的狀態值預設為 `Failure`。
  如果容器不提供就緒態探針，則預設狀態為 `Success`。

`startupProbe`
: 指示容器中的應用是否已經啟動。如果提供了啟動探針，則所有其他探針都會被
  禁用，直到此探針成功為止。如果啟動探測失敗，`kubelet` 將殺死容器，而容器依其
  [重啟策略](#restart-policy)進行重啟。
  如果容器沒有提供啟動探測，則預設狀態為 `Success`。

<!--
For more information about how to set up a liveness, readiness, or startup probe,
see [Configure Liveness, Readiness and Startup Probes](/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/).
-->
如欲瞭解如何設定存活態、就緒態和啟動探針的進一步細節，可以參閱
[配置存活態、就緒態和啟動探針](/zh-cn/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/)。

<!--
#### When should you use a liveness probe?
-->
#### 何時該使用存活態探針?    {#when-should-you-use-a-liveness-probe}

{{< feature-state for_k8s_version="v1.0" state="stable" >}}

<!--
If the process in your container is able to crash on its own whenever it
encounters an issue or becomes unhealthy, you do not necessarily need a liveness
probe; the kubelet will automatically perform the correct action in accordance
with the Pod's `restartPolicy`.

If you'd like your container to be killed and restarted if a probe fails, then
specify a liveness probe, and specify a `restartPolicy` of Always or OnFailure.
-->
如果容器中的程序能夠在遇到問題或不健康的情況下自行崩潰，則不一定需要存活態探針; 
`kubelet` 將根據 Pod 的`restartPolicy` 自動執行修復操作。

如果你希望容器在探測失敗時被殺死並重新啟動，那麼請指定一個存活態探針，
並指定`restartPolicy` 為 "`Always`" 或 "`OnFailure`"。

<!--
#### When should you use a readiness probe?
-->
#### 何時該使用就緒態探針?      {#when-should-you-use-a-readiness-probe}

{{< feature-state for_k8s_version="v1.0" state="stable" >}}

<!--
If you'd like to start sending traffic to a Pod only when a probe succeeds,
specify a readiness probe. In this case, the readiness probe might be the same
as the liveness probe, but the existence of the readiness probe in the spec means
that the Pod will start without receiving any traffic and only start receiving
traffic after the probe starts succeeding.
-->
如果要僅在探測成功時才開始向 Pod 傳送請求流量，請指定就緒態探針。
在這種情況下，就緒態探針可能與存活態探針相同，但是規約中的就緒態探針的存在意味著
Pod 將在啟動階段不接收任何資料，並且只有在探針探測成功後才開始接收資料。

<!--
If you want your container to be able to take itself down for maintenance, you
can specify a readiness probe that checks an endpoint specific to readiness that
is different from the liveness probe.
-->
如果你希望容器能夠自行進入維護狀態，也可以指定一個就緒態探針，檢查某個特定於
就緒態的因此不同於存活態探測的端點。

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
如果你的應用程式對後端服務有嚴格的依賴性，你可以同時實現存活態和就緒態探針。
當應用程式本身是健康的，存活態探針檢測通過後，就緒態探針會額外檢查每個所需的後端服務是否可用。
這可以幫助你避免將流量導向只能返回錯誤資訊的 Pod。

如果你的容器需要在啟動期間載入大型資料、配置檔案或執行遷移，你可以使用
[啟動探針](#when-should-you-use-a-startup-probe)。
然而，如果你想區分已經失敗的應用和仍在處理其啟動資料的應用，你可能更傾向於使用就緒探針。

{{< note >}}
<!--
If you want to be able to drain requests when the Pod is deleted, you do not
necessarily need a readiness probe; on deletion, the Pod automatically puts itself
into an unready state regardless of whether the readiness probe exists.
The Pod remains in the unready state while it waits for the containers in the Pod
to stop.
-->
請注意，如果你只是想在 Pod 被刪除時能夠排空請求，則不一定需要使用就緒態探針；
在刪除 Pod 時，Pod 會自動將自身置於未就緒狀態，無論就緒態探針是否存在。
等待 Pod 中的容器停止期間，Pod 會一直處於未就緒狀態。
{{< /note >}}

<!--
#### When should you use a startup probe?
-->
#### 何時該使用啟動探針？   {#when-should-you-use-a-startup-probe}

{{< feature-state for_k8s_version="v1.18" state="beta" >}}

<!--
Startup probes are useful for Pods that have containers that take a long time to
come into service. Rather than set a long liveness interval, you can configure
a separate configuration for probing the container as it starts up, allowing
a time longer than the liveness interval would allow.
-->
對於所包含的容器需要較長時間才能啟動就緒的 Pod 而言，啟動探針是有用的。
你不再需要配置一個較長的存活態探測時間間隔，只需要設定另一個獨立的配置選定，
對啟動期間的容器執行探測，從而允許使用遠遠超出存活態時間間隔所允許的時長。

<!--
If your container usually starts in more than
`initialDelaySeconds + failureThreshold × periodSeconds`, you should specify a
startup probe that checks the same endpoint as the liveness probe. The default for
`periodSeconds` is 10s. You should then set its `failureThreshold` high enough to
allow the container to start, without changing the default values of the liveness
probe. This helps to protect against deadlocks.
-->
如果你的容器啟動時間通常超出  `initialDelaySeconds + failureThreshold × periodSeconds`
總值，你應該設定一個啟動探測，對存活態探針所使用的同一端點執行檢查。
`periodSeconds` 的預設值是 10 秒。你應該將其 `failureThreshold` 設定得足夠高，
以便容器有充足的時間完成啟動，並且避免更改存活態探針所使用的預設值。
這一設定有助於減少死鎖狀況的發生。

<!--
## Termination of Pods {#pod-termination}

Because Pods represent processes running on nodes in the cluster, it is important to
allow those processes to gracefully terminate when they are no longer needed (rather
than being abruptly stopped with a `KILL` signal and having no chance to clean up).
-->
## Pod 的終止    {#pod-termination}

由於 Pod 所代表的是在叢集中節點上執行的程序，當不再需要這些程序時允許其體面地
終止是很重要的。一般不應武斷地使用 `KILL` 訊號終止它們，導致這些程序沒有機會
完成清理操作。

<!--
The design aim is for you to be able to request deletion and know when processes
terminate, but also be able to ensure that deletes eventually complete.
When you request deletion of a Pod, the cluster records and tracks the intended grace period
before the Pod is allowed to be forcefully killed. With that forceful shutdown tracking in
place, the {< glossary_tooltip text="kubelet" term_id="kubelet" >}} attempts graceful
shutdown.
-->
設計的目標是令你能夠請求刪除程序，並且知道程序何時被終止，同時也能夠確保刪除
操作終將完成。當你請求刪除某個 Pod 時，叢集會記錄並跟蹤 Pod 的體面終止週期，
而不是直接強制地殺死 Pod。在存在強制關閉設施的前提下，
{{< glossary_tooltip text="kubelet" term_id="kubelet" >}} 會嘗試體面地終止
Pod。

<!--
Typically, the container runtime sends a TERM signal to the main process in each
container. Many container runtimes respect the `STOPSIGNAL` value defined in the container
image and send this instead of TERM.
Once the grace period has expired, the KILL signal is sent to any remainig
processes, and the Pod is then deleted from the
{{< glossary_tooltip text="API Server" term_id="kube-apiserver" >}}. If the kubelet or the
container runtime's management service is restarted while waiting for processes to terminate, the
cluster retries from the start including the full original grace period.
-->
通常情況下，容器執行時會發送一個 TERM 訊號到每個容器中的主程序。
很多容器執行時都能夠注意到容器映象中 `STOPSIGNAL` 的值，併發送該訊號而不是 TERM。
一旦超出了體面終止限期，容器執行時會向所有剩餘程序傳送 KILL 訊號，之後
Pod 就會被從 {{< glossary_tooltip text="API 伺服器" term_id="kube-apiserver" >}}
上移除。如果 `kubelet` 或者容器執行時的管理服務在等待程序終止期間被重啟，
叢集會從頭開始重試，賦予 Pod 完整的體面終止限期。

<!--
An example flow:

1. You use the `kubectl` tool to manually delete a specific Pod, with the default grace period
   (30 seconds).
1. The Pod in the API server is updated with the time beyond which the Pod is considered "dead"
   along with the grace period.
   If you use `kubectl describe` to check on the Pod you're deleting, that Pod shows up as
   "Terminating".
   On the node where the Pod is running: as soon as the kubelet sees that a Pod has been marked
   as terminating (a graceful shutdown duration has been set), the kubelet begins the local Pod
   shutdown process.
-->
下面是一個例子：

1. 你使用 `kubectl` 工具手動刪除某個特定的 Pod，而該 Pod 的體面終止限期是預設值（30 秒）。

2. API 伺服器中的 Pod 物件被更新，記錄涵蓋體面終止限期在內 Pod
   的最終死期，超出所計算時間點則認為 Pod 已死（dead）。
   如果你使用 `kubectl describe` 來查驗你正在刪除的 Pod，該 Pod 會顯示為
   "Terminating" （正在終止）。
   在 Pod 執行所在的節點上：`kubelet` 一旦看到 Pod
   被標記為正在終止（已經設定了體面終止限期），`kubelet` 即開始本地的 Pod 關閉過程。 

   <!--
   1. If one of the Pod's containers has defined a `preStop`
      [hook](/docs/concepts/containers/container-lifecycle-hooks), the kubelet
      runs that hook inside of the container. If the `preStop` hook is still running after the
      grace period expires, the kubelet requests a small, one-off grace period extension of 2
      seconds.
      If the `preStop` hook needs longer to complete than the default grace period allows,
      you must modify `terminationGracePeriodSeconds` to suit this.
   1. The kubelet triggers the container runtime to send a TERM signal to process 1 inside each
      container.
      The containers in the Pod receive the TERM signal at different times and in an arbitrary
      order. If the order of shutdowns matters, consider using a `preStop` hook to synchronize.
   -->
   1. 如果 Pod 中的容器之一定義了 `preStop`
      [回撥](/zh-cn/docs/concepts/containers/container-lifecycle-hooks)，
      `kubelet` 開始在容器內執行該回調邏輯。如果超出體面終止限期時，`preStop` 回撥邏輯
      仍在執行，`kubelet` 會請求給予該 Pod 的寬限期一次性增加 2 秒鐘。

      {{< note >}}
      如果 `preStop` 回撥所需要的時間長於預設的體面終止限期，你必須修改
      `terminationGracePeriodSeconds` 屬性值來使其正常工作。
      {{< /note >}}

   1. `kubelet` 接下來觸發容器執行時傳送 TERM 訊號給每個容器中的程序 1。

      {{< note >}}
      Pod 中的容器會在不同時刻收到 TERM 訊號，接收順序也是不確定的。
      如果關閉的順序很重要，可以考慮使用 `preStop` 回撥邏輯來協調。
      {{< /note >}}

<!--
1. At the same time as the kubelet is starting graceful shutdown, the control plane removes that
   shutting-down Pod from Endpoints (and, if enabled, EndpointSlice) objects where these represent
   a {{< glossary_tooltip term_id="service" text="Service" >}} with a configured
   {{< glossary_tooltip text="selector" term_id="selector" >}}.
   {{< glossary_tooltip text="ReplicaSets" term_id="replica-set" >}} and other workload resources
   no longer treat the shutting-down Pod as a valid, in-service replica. Pods that shut down slowly
   cannot continue to serve traffic as load balancers (like the service proxy) remove the Pod from
   the list of endpoints as soon as the termination grace period _begins_.
-->
3. 與此同時，`kubelet` 啟動體面關閉邏輯，控制面會將 Pod 從對應的端點列表（以及端點切片列表，
   如果啟用了的話）中移除，過濾條件是 Pod 被對應的
   {{< glossary_tooltip term_id="service" text="服務" >}}以某
   {{< glossary_tooltip text="選擇算符" term_id="selector" >}}選定。
   {{< glossary_tooltip text="ReplicaSets" term_id="replica-set" >}}和其他工作負載資源
   不再將關閉程序中的 Pod 視為合法的、能夠提供服務的副本。關閉動作很慢的 Pod
   也無法繼續處理請求資料，因為負載均衡器（例如服務代理）已經在終止寬限期開始的時候
   將其從端點列表中移除。

<!--
1. When the grace period expires, the kubelet triggers forcible shutdown. The container runtime sends
   `SIGKILL` to any processes still running in any container in the Pod.
   The kubelet also cleans up a hidden `pause` container if that container runtime uses one.
1. The kubelet triggers forcible removal of Pod object from the API server, by setting grace period
   to 0 (immediate deletion).
1. The API server deletes the Pod's API object, which is then no longer visible from any client.
-->
4. 超出終止寬限期限時，`kubelet` 會觸發強制關閉過程。容器執行時會向 Pod 中所有容器內
   仍在執行的程序傳送 `SIGKILL` 訊號。
   `kubelet` 也會清理隱藏的 `pause` 容器，如果容器執行時使用了這種容器的話。

5. `kubelet` 觸發強制從 API 伺服器上刪除 Pod 物件的邏輯，並將體面終止限期設定為 0
   （這意味著馬上刪除）。

6. API 伺服器刪除 Pod 的 API 物件，從任何客戶端都無法再看到該物件。

<!--
### Forced Pod termination {#pod-termination-forced}

Forced deletions can be potentially disruptive for some workloads and their Pods.

By default, all deletes are graceful within 30 seconds. The `kubectl delete` command supports
the `-grace-period=<seconds>` option which allows you to override the default and specify your
own value.
-->
### 強制終止 Pod     {#pod-termination-forced}

{{< caution >}}
對於某些工作負載及其 Pod 而言，強制刪除很可能會帶來某種破壞。
{{< /caution >}}

預設情況下，所有的刪除操作都會附有 30 秒鐘的寬限期限。
`kubectl delete` 命令支援 `--grace-period=<seconds>` 選項，允許你過載預設值，
設定自己希望的期限值。

<!--
Setting the grace period to `0` forcibly and immediately deletes the Pod from the API
server. If the pod was still running on a node, that forcible deletion triggers the kubelet to
begin immediate cleanup.
-->
將寬限期限強制設定為 `0` 意味著立即從 API 伺服器刪除 Pod。
如果 Pod 仍然運行於某節點上，強制刪除操作會觸發 `kubelet` 立即執行清理操作。

<!--
You must specify an additional flag `--force` along with `--grace-period=0` in order to perform force deletions.
-->
{{< note >}}
你必須在設定 `--grace-period=0` 的同時額外設定 `--force`
引數才能發起強制刪除請求。
{{< /note >}}

<!--
When a force deletion is performed, the API server does not wait for confirmation
from the kubelet that the Pod has been terminated on the node it was running on. It
removes the Pod in the API immediately so a new Pod can be created with the same
name. On the node, Pods that are set to terminate immediately will still be given
a small grace period before being force killed.

If you need to force-delete Pods that are part of a StatefulSet, refer to the task
documentation for
[deleting Pods from a StatefulSet](/docs/tasks/run-application/force-delete-stateful-set-pod/).
-->
執行強制刪除操作時，API 伺服器不再等待來自 `kubelet` 的、關於 Pod
已經在原來執行的節點上終止執行的確認訊息。
API 伺服器直接刪除 Pod 物件，這樣新的與之同名的 Pod 即可以被建立。
在節點側，被設定為立即終止的 Pod 仍然會在被強行殺死之前獲得一點點的寬限時間。

如果你需要強制刪除 StatefulSet 的 Pod，請參閱
[從 StatefulSet 中刪除 Pod](/zh-cn/docs/tasks/run-application/force-delete-stateful-set-pod/)
的任務文件。

<!--
### Garbage collection of failed Pods {#pod-garbage-collection}

For failed Pods, the API objects remain in the cluster's API until a human or
{{< glossary_tooltip term_id="controller" text="controller" >}} process
explicitly removes them.

The control plane cleans up terminated Pods (with a phase of `Succeeded` or
`Failed`), when the number of Pods exceeds the configured threshold
(determined by `terminated-pod-gc-threshold` in the kube-controller-manager).
This avoids a resource leak as Pods are created and terminated over time.
-->
### 失效 Pod 的垃圾收集    {#pod-garbage-collection}

對於已失敗的 Pod 而言，對應的 API 物件仍然會保留在叢集的 API 伺服器上，直到
使用者或者{{< glossary_tooltip term_id="controller" text="控制器" >}}程序顯式地
將其刪除。

控制面元件會在 Pod 個數超出所配置的閾值
（根據 `kube-controller-manager` 的 `terminated-pod-gc-threshold` 設定）時
刪除已終止的 Pod（階段值為 `Succeeded` 或 `Failed`）。
這一行為會避免隨著時間演進不斷建立和終止 Pod 而引起的資源洩露問題。

## {{% heading "whatsnext" %}}

<!--
* Get hands-on experience
  [attaching handlers to container lifecycle events](/docs/tasks/configure-pod-container/attach-handler-lifecycle-event/).

* Get hands-on experience
  [configuring Liveness, Readiness and Startup Probes](/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/).

* Learn more about [container lifecycle hooks](/docs/concepts/containers/container-lifecycle-hooks/).

* For detailed information about Pod and container status in the API, see
  the API reference documentation covering
  [`.status`](/docs/reference/kubernetes-api/workload-resources/pod-v1/#PodStatus) for Pod.
-->
* 動手實踐[為容器生命週期時間關聯處理程式](/zh-cn/docs/tasks/configure-pod-container/attach-handler-lifecycle-event/)。
* 動手實踐[配置存活態、就緒態和啟動探針](/zh-cn/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/)。
* 進一步瞭解[容器生命週期回撥](/zh-cn/docs/concepts/containers/container-lifecycle-hooks/)。
* 關於 API 中定義的有關 Pod 和容器狀態的詳細規範資訊，
  可參閱 API 參考文件中 Pod 的 [`.status`](/docs/reference/kubernetes-api/workload-resources/pod-v1/#PodStatus) 欄位。

