---
title: 節點關閉
content_type: concept
weight: 10
---
<!--
title: Node Shutdowns
content_type: concept
weight: 10
-->

<!-- overview -->
<!--
In a Kubernetes cluster, a {{< glossary_tooltip text="node" term_id="node" >}}
can be shut down in a planned graceful way or unexpectedly because of reasons such
as a power outage or something else external. A node shutdown could lead to workload
failure if the node is not drained before the shutdown. A node shutdown can be
either **graceful** or **non-graceful**.
-->
在 Kubernetes 叢集中，{{< glossary_tooltip text="節點" term_id="node" >}}可以按計劃的體面方式關閉，
也可能因斷電或其他某些外部原因被意外關閉。如果節點在關閉之前未被排空，則節點關閉可能會導致工作負載失敗。
節點可以**體面關閉**或**非體面關閉**。

<!-- body -->

<!-- 
## Graceful node shutdown {#graceful-node-shutdown}
-->
## 節點體面關閉 {#graceful-node-shutdown}

<!-- 
The kubelet attempts to detect node system shutdown and terminates pods running on the node.

Kubelet ensures that pods follow the normal
[pod termination process](/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination)
during the node shutdown. During node shutdown, the kubelet does not accept new
Pods (even if those Pods are already bound to the node).
-->
kubelet 會嘗試檢測節點系統關閉事件並終止在節點上運行的所有 Pod。

在節點終止期間，kubelet 保證 Pod 遵從常規的
[Pod 終止流程](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination)，
且不接受新的 Pod（即使這些 Pod 已經綁定到該節點）。

<!--
### Enabling graceful node shutdown
-->
## 啓用節點體面關閉 {#enabling-graceful-node-shutdown}

{{< tabs name="graceful_shutdown_os" >}}
{{% tab name="Linux" %}}
{{< feature-state feature_gate_name="GracefulNodeShutdown" >}}

<!--
On Linux, the graceful node shutdown feature is controlled with the `GracefulNodeShutdown`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/) which is
enabled by default in 1.21.
-->
在 Linux 上，節點體面關閉特性受 `GracefulNodeShutdown`
[特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)控制，
此特性在 1.21 版本中默認啓用。

{{< note >}}
<!--
The graceful node shutdown feature depends on systemd since it takes advantage of
[systemd inhibitor locks](https://www.freedesktop.org/wiki/Software/systemd/inhibit/) to
delay the node shutdown with a given duration.
-->
節點體面關閉特性依賴於 systemd，因爲它要利用
[systemd 抑制器鎖](https://www.freedesktop.org/wiki/Software/systemd/inhibit/)機制，
在給定的期限內延遲節點關閉。
{{</ note >}}
{{% /tab %}}

{{% tab name="Windows" %}}
{{< feature-state feature_gate_name="WindowsGracefulNodeShutdown" >}}

<!--
On Windows, the graceful node shutdown feature is controlled with the `WindowsGracefulNodeShutdown`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
which is introduced in 1.32 as an alpha feature. In Kubernetes 1.34 the feature is Beta
and is enabled by default.
-->
在 Windows 上，節點體面關閉特性受 `WindowsGracefulNodeShutdown`
[特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)控制，
此特性在 1.32 版本中作爲 Alpha 特性引入，在 1.34 版本中變爲 Beta 並且默認啓用。

<!--
The Windows graceful node shutdown feature depends on kubelet running as a Windows service,
it will then have a registered [service control handler](https://learn.microsoft.com/en-us/windows/win32/services/service-control-handler-function)
to delay the preshutdown event with a given duration.
-->
此服務會使用一個註冊的[服務控制處理程序函數](https://learn.microsoft.com/zh-cn/windows/win32/services/service-control-handler-function)將
preshutdown 事件延遲一段時間。

<!--
Windows graceful node shutdown can not be cancelled.

If kubelet is not running as a Windows service, it will not be able to set and monitor
the [Preshutdown](https://learn.microsoft.com/en-us/windows/win32/api/winsvc/ns-winsvc-service_preshutdown_info) event,
the node will have to go through the [Non-Graceful Node Shutdown](#non-graceful-node-shutdown) procedure mentioned above.
-->
Windows 節點體面關閉無法被取消。

如果 kubelet 不是作爲 Windows 服務運行，它將不能設置和監控
[Preshutdown](https://learn.microsoft.com/zh-cn/windows/win32/api/winsvc/ns-winsvc-service_preshutdown_info)
事件，對應節點將不得不跑完上述[節點非體面關閉](#non-graceful-node-shutdown)的流程。

<!--
In the case where the Windows graceful node shutdown feature is enabled, but the kubelet is not
running as a Windows service, the kubelet will continue running instead of failing. However,
it will log an error indicating that it needs to be run as a Windows service.
-->
在啓用 Windows 節點體面關閉特性但 kubelet 未作爲 Windows 服務運行的情況下，kubelet 將繼續運行而不會失敗。
但是，kubelet 將在日誌中記錄一個錯誤，表明它需要作爲一個 Windows 服務來運行。
{{% /tab %}}

{{< /tabs >}}

<!--
### Configuring graceful node shutdown

Note that by default, both configuration options described below,
`shutdownGracePeriod` and `shutdownGracePeriodCriticalPods`, are set to zero,
thus not activating the graceful node shutdown functionality.
To activate the feature, both options should be configured appropriately and
set to non-zero values.
-->
## 設定節點體面關閉

注意，默認情況下，下面描述的兩個設定選項，`shutdownGracePeriod` 和
`shutdownGracePeriodCriticalPods` 都是被設置爲 0 的，因此不會激活節點體面關閉特性。
要激活此功能特性，這兩個選項要適當設定，並設置爲非零值。

<!--
Once the kubelet is notified of a node shutdown, it sets a `NotReady` condition on
the Node, with the `reason` set to `"node is shutting down"`. The kube-scheduler honors this condition
and does not schedule any Pods onto the affected node; other third-party schedulers are
expected to follow the same logic. This means that new Pods won't be scheduled onto that node
and therefore none will start.
-->
一旦 kubelet 收到節點關閉的通知，就會在節點上設置一個
`NotReady` 狀況，並將 `reason` 設置爲 `"node is shutting down"`。
kube-scheduler 會重視此狀況，不將 Pod 調度到受影響的節點上；
其他第三方調度程序也應當遵循相同的邏輯。這意味着新的 Pod 不會被調度到該節點上，
因此不會有新 Pod 啓動。

<!--
The kubelet **also** rejects Pods during the `PodAdmission` phase if an ongoing
node shutdown has been detected, so that even Pods with a
{{< glossary_tooltip text="toleration" term_id="toleration" >}} for
`node.kubernetes.io/not-ready:NoSchedule` do not start there.
-->
如果檢測到節點關閉正在進行中，kubelet **也會**在 `PodAdmission`
階段拒絕 Pod，即使是該 Pod 帶有 `node.kubernetes.io/not-ready:NoSchedule`
的{{< glossary_tooltip text="容忍度" term_id="toleration" >}}，也不會在此節點上啓動。

<!--
When kubelet is setting that condition on its Node via the API,
the kubelet also begins terminating any Pods that are running locally.
-->
當 kubelet 通過 API 在其 Node 上設置該狀況時，kubelet
也開始終止在本地運行的所有 Pod。

<!-- 
During a graceful shutdown, kubelet terminates pods in two phases:

1. Terminate regular pods running on the node.
1. Terminate [critical pods](/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/#marking-pod-as-critical)
   running on the node.
-->
在體面關閉過程中，kubelet 分兩個階段來終止 Pod：

1. 終止在節點上運行的常規 Pod。
2. 終止在節點上運行的[關鍵 Pod](/zh-cn/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/#marking-pod-as-critical)。

<!-- 
The graceful node shutdown feature is configured with two
[`KubeletConfiguration`](/docs/tasks/administer-cluster/kubelet-config-file/) options:
-->
節點體面關閉的特性對應兩個
[`KubeletConfiguration`](/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/) 選項：

<!--
- `shutdownGracePeriod`:

  Specifies the total duration that the node should delay the shutdown by. This is the total
  grace period for pod termination for both regular and
  [critical pods](/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/#marking-pod-as-critical).
-->
- `shutdownGracePeriod`：

  指定節點應延遲關閉的總持續時間。這是 Pod 體面終止的時間總和，不區分常規 Pod
  還是[關鍵 Pod](/zh-cn/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/#marking-pod-as-critical)。

<!--
- `shutdownGracePeriodCriticalPods`:

  Specifies the duration used to terminate
  [critical pods](/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/#marking-pod-as-critical)
  during a node shutdown. This value should be less than `shutdownGracePeriod`.
-->
- `shutdownGracePeriodCriticalPods`：

  在節點關閉期間指定用於終止[關鍵 Pod](/zh-cn/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/#marking-pod-as-critical)
  的持續時間。該值應小於 `shutdownGracePeriod`。

{{< note >}}
<!--
There are cases when Node termination was cancelled by the system (or perhaps manually
by an administrator). In either of those situations the Node will return to the `Ready` state.
However, Pods which already started the process of termination will not be restored by kubelet
and will need to be re-scheduled.
-->
在某些情況下，節點終止過程會被系統取消（或者可能由管理員手動取消）。
無論哪種情況下，節點都將返回到 `Ready` 狀態。然而，已經開始終止進程的
Pod 將不會被 kubelet 恢復，需要被重新調度。
{{< /note >}}

<!--  
For example, if `shutdownGracePeriod=30s`, and
`shutdownGracePeriodCriticalPods=10s`, kubelet will delay the node shutdown by
30 seconds. During the shutdown, the first 20 (30-10) seconds would be reserved
for gracefully terminating normal pods, and the last 10 seconds would be
reserved for terminating [critical pods](/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/#marking-pod-as-critical).
-->
例如，如果設置了 `shutdownGracePeriod=30s` 和 `shutdownGracePeriodCriticalPods=10s`，
則 kubelet 將延遲 30 秒關閉節點。在關閉期間，將保留前 20（30 - 10）秒用於體面終止常規 Pod，
而保留最後 10 秒用於終止[關鍵 Pod](/zh-cn/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/#marking-pod-as-critical)。

{{< note >}}
<!--
When pods were evicted during the graceful node shutdown, they are marked as shutdown.
Running `kubectl get pods` shows the status of the evicted pods as `Terminated`.
And `kubectl describe pod` indicates that the pod was evicted because of node shutdown:
-->
當 Pod 在正常節點關閉期間被驅逐時，它們會被標記爲關閉。
運行 `kubectl get pods` 時，被驅逐的 Pod 的狀態顯示爲 `Terminated`。
並且 `kubectl describe pod` 表示 Pod 因節點關閉而被驅逐：

```
Reason:         Terminated
Message:        Pod was terminated in response to imminent node shutdown.
```
{{< /note >}}

<!--
### Pod Priority based graceful node shutdown {#pod-priority-graceful-node-shutdown}
-->
### 基於 Pod 優先級的節點體面關閉    {#pod-priority-graceful-node-shutdown}

{{< feature-state feature_gate_name="GracefulNodeShutdownBasedOnPodPriority" >}}

<!--
To provide more flexibility during graceful node shutdown around the ordering
of pods during shutdown, graceful node shutdown honors the PriorityClass for
Pods, provided that you enabled this feature in your cluster. The feature
allows cluster administrators to explicitly define the ordering of pods
during graceful node shutdown based on
[priority classes](/docs/concepts/scheduling-eviction/pod-priority-preemption/#priorityclass).
-->
爲了在節點體面關閉期間提供更多的靈活性，尤其是處理關閉期間的 Pod 排序問題，
節點體面關閉機制能夠關注 Pod 的 PriorityClass 設置，前提是你已經在叢集中啓用了此功能特性。
此特性允許叢集管理員基於 Pod
的[優先級類（Priority Class）](/zh-cn/docs/concepts/scheduling-eviction/pod-priority-preemption/#priorityclass)
顯式地定義節點體面關閉期間 Pod 的處理順序。

<!--
The [Graceful Node Shutdown](#graceful-node-shutdown) feature, as described
above, shuts down pods in two phases, non-critical pods, followed by critical
pods. If additional flexibility is needed to explicitly define the ordering of
pods during shutdown in a more granular way, pod priority based graceful
shutdown can be used.
-->
前文所述的[節點體面關閉](#graceful-node-shutdown)特性能夠分兩個階段關閉 Pod，
首先關閉的是非關鍵的 Pod，之後再處理關鍵 Pod。
如果需要顯式地以更細粒度定義關閉期間 Pod 的處理順序，需要一定的靈活度，
這時可以使用基於 Pod 優先級的體面關閉機制。

<!--
When graceful node shutdown honors pod priorities, this makes it possible to do
graceful node shutdown in multiple phases, each phase shutting down a
particular priority class of pods. The kubelet can be configured with the exact
phases and shutdown time per phase.
-->
當節點體面關閉能夠處理 Pod 優先級時，節點體面關閉的處理可以分爲多個階段，
每個階段關閉特定優先級類的 Pod。可以設定 kubelet 按確切的階段處理 Pod，
且每個階段可以獨立設置關閉時間。

<!--
Assuming the following custom pod
[priority classes](/docs/concepts/scheduling-eviction/pod-priority-preemption/#priorityclass)
in a cluster,
-->
假設叢集中存在以下自定義的 Pod
[優先級類](/zh-cn/docs/concepts/scheduling-eviction/pod-priority-preemption/#priorityclass)。

<!--
| Pod priority class name | Pod priority class value |
| ----------------------- | ------------------------ |
| `custom-class-a`        | 100000                   |
| `custom-class-b`        | 10000                    |
| `custom-class-c`        | 1000                     |
| `regular/unset`         | 0                        |
-->
| Pod 優先級類名稱        | Pod 優先級類數值       |
|-------------------------|------------------------|
|`custom-class-a`         | 100000                 |
|`custom-class-b`         | 10000                  |
|`custom-class-c`         | 1000                   |
|`regular/unset`          | 0                      |

<!--
Within the [kubelet configuration](/docs/reference/config-api/kubelet-config.v1beta1/)
the settings for `shutdownGracePeriodByPodPriority` could look like:
-->
在 [kubelet 設定](/zh-cn/docs/reference/config-api/kubelet-config.v1beta1/)中，
`shutdownGracePeriodByPodPriority` 看起來可能是這樣：

<!--
| Pod priority class value | Shutdown period |
| ------------------------ | --------------- |
| 100000                   | 10 seconds      |
| 10000                    | 180 seconds     |
| 1000                     | 120 seconds     |
| 0                        | 60 seconds      |
-->
| Pod 優先級類數值       | 關閉期限  |
|------------------------|-----------|
| 100000                 | 10 秒     |
| 10000                  | 180 秒    |
| 1000                   | 120 秒    |
| 0                      | 60 秒     |

<!--
The corresponding kubelet config YAML configuration would be:
-->
對應的 kubelet 設定 YAML 將會是：

```yaml
shutdownGracePeriodByPodPriority:
  - priority: 100000
    shutdownGracePeriodSeconds: 10
  - priority: 10000
    shutdownGracePeriodSeconds: 180
  - priority: 1000
    shutdownGracePeriodSeconds: 120
  - priority: 0
    shutdownGracePeriodSeconds: 60
```

<!--
The above table implies that any pod with `priority` value >= 100000 will get
just 10 seconds to shut down, any pod with value >= 10000 and < 100000 will get 180
seconds to shut down, any pod with value >= 1000 and < 10000 will get 120 seconds to shut down.
Finally, all other pods will get 60 seconds to shut down.

One doesn't have to specify values corresponding to all of the classes. For
example, you could instead use these settings:
-->
上面的表格表明，所有 `priority` 值大於等於 100000 的 Pod 關閉期限只有 10 秒，
所有 `priority` 值介於 10000 和 100000 之間的 Pod 關閉期限是 180 秒，
所有 `priority` 值介於 1000 和 10000 之間的 Pod 關閉期限是 120 秒，
其他所有 Pod 關閉期限是 60 秒。

使用者不需要爲所有的優先級類都設置數值。例如，你也可以使用下面這種設定：

<!--
| Pod priority class value | Shutdown period |
| ------------------------ | --------------- |
| 100000                   | 300 seconds     |
| 1000                     | 120 seconds     |
| 0                        | 60 seconds      |
-->
| Pod 優先級類數值       | 關閉期限  |
|------------------------|-----------|
| 100000                 | 300 秒    |
| 1000                   | 120 秒    |
| 0                      | 60 秒     |

<!--
In the above case, the pods with `custom-class-b` will go into the same bucket
as `custom-class-c` for shutdown.

If there are no pods in a particular range, then the kubelet does not wait
for pods in that priority range. Instead, the kubelet immediately skips to the
next priority class value range.
-->
在上面這個場景中，優先級類爲 `custom-class-b` 的 Pod 會與優先級類爲 `custom-class-c`
的 Pod 在關閉時按相同期限處理。

如果在特定的範圍內不存在 Pod，則 kubelet 不會等待對應優先級範圍的 Pod。
kubelet 會直接跳到下一個優先級數值範圍進行處理。

<!--
If this feature is enabled and no configuration is provided, then no ordering
action will be taken.

Using this feature requires enabling the `GracefulNodeShutdownBasedOnPodPriority`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
, and setting `ShutdownGracePeriodByPodPriority` in the
[kubelet config](/docs/reference/config-api/kubelet-config.v1beta1/)
to the desired configuration containing the pod priority class values and
their respective shutdown periods.
-->
如果此功能特性被啓用，但沒有提供設定數據，則不會出現排序操作。

使用此功能特性需要啓用 `GracefulNodeShutdownBasedOnPodPriority`
[特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)，
並將 [kubelet 設定](/zh-cn/docs/reference/config-api/kubelet-config.v1beta1/)中的
`shutdownGracePeriodByPodPriority` 設置爲期望的設定，
其中包含 Pod 的優先級類數值以及對應的關閉期限。

{{< note >}}
<!-- 
The ability to take Pod priority into account during graceful node shutdown was introduced
as an Alpha feature in Kubernetes v1.23. In Kubernetes {{< skew currentVersion >}}
the feature is Beta and is enabled by default.
-->
在節點體面關閉期間考慮 Pod 優先級的能力是作爲 Kubernetes v1.23 中的 Alpha 特性引入的。
在 Kubernetes {{< skew currentVersion >}} 中此特性處於 Beta 階段，默認啓用。
{{< /note >}}

<!--
Metrics `graceful_shutdown_start_time_seconds` and `graceful_shutdown_end_time_seconds`
are emitted under the kubelet subsystem to monitor node shutdowns.
-->
kubelet 子系統中會生成 `graceful_shutdown_start_time_seconds` 和
`graceful_shutdown_end_time_seconds` 度量指標以便監視節點關閉行爲。

<!--
## Non-graceful node shutdown handling {#non-graceful-node-shutdown}
-->
## 處理節點非體面關閉 {#non-graceful-node-shutdown}

{{< feature-state feature_gate_name="NodeOutOfServiceVolumeDetach" >}}

<!--
A node shutdown action may not be detected by kubelet's Node Shutdown Manager,
either because the command does not trigger the inhibitor locks mechanism used by
kubelet or because of a user error, i.e., the ShutdownGracePeriod and
ShutdownGracePeriodCriticalPods are not configured properly. Please refer to above
section [Graceful Node Shutdown](#graceful-node-shutdown) for more details.
-->
節點關閉的操作可能無法被 kubelet 的節點關閉管理器檢測到，
或是因爲該命令沒有觸發 kubelet 所使用的抑制器鎖機制，或是因爲使用者錯誤，
即 ShutdownGracePeriod 和 ShutdownGracePeriodCriticalPod 設定不正確。
請參考以上[節點體面關閉](#graceful-node-shutdown)部分了解更多詳細信息。

<!--
When a node is shutdown but not detected by kubelet's Node Shutdown Manager, the pods
that are part of a {{< glossary_tooltip text="StatefulSet" term_id="statefulset" >}} will be stuck in terminating status on
the shutdown node and cannot move to a new running node. This is because kubelet on
the shutdown node is not available to delete the pods so the StatefulSet cannot
create a new pod with the same name. If there are volumes used by the pods, the
VolumeAttachments will not be deleted from the original shutdown node so the volumes
used by these pods cannot be attached to a new running node. As a result, the
application running on the StatefulSet cannot function properly. If the original
shutdown node comes up, the pods will be deleted by kubelet and new pods will be
created on a different running node. If the original shutdown node does not come up,
these pods will be stuck in terminating status on the shutdown node forever.
-->
當某節點關閉但 kubelet 的節點關閉管理器未檢測到這一事件時，
在那個已關閉節點上、屬於 {{< glossary_tooltip text="StatefulSet" term_id="statefulset" >}}
的 Pod 將停滯於終止狀態，並且不能移動到新的運行節點上。
這是因爲已關閉節點上的 kubelet 已不存在，亦無法刪除 Pod，
因此 StatefulSet 無法創建同名的新 Pod。
如果 Pod 使用了卷，則 VolumeAttachments 無法從原來的已關閉節點上刪除，
因此這些 Pod 所使用的卷也無法掛接到新的運行節點上。
最終，那些以 StatefulSet 形式運行的應用無法正常工作。
如果原來的已關閉節點被恢復，kubelet 將刪除 Pod，新的 Pod 將被在不同的運行節點上創建。
如果原來的已關閉節點沒有被恢復，那些在已關閉節點上的 Pod 將永遠滯留在終止狀態。

<!--
To mitigate the above situation, a user can manually add the taint `node.kubernetes.io/out-of-service`
with either `NoExecute` or `NoSchedule` effect to a Node marking it out-of-service.
If a Node is marked out-of-service with this taint, the pods on the node will be forcefully deleted
if there are no matching tolerations on it and volume detach operations for the pods terminating on
the node will happen immediately. This allows the Pods on the out-of-service node to recover quickly
on a different node.
-->
爲了緩解上述情況，使用者可以手動將具有 `NoExecute` 或 `NoSchedule` 效果的
`node.kubernetes.io/out-of-service` 污點添加到節點上，標記其無法提供服務。
如果 Node 被污點標記爲無法提供服務，且節點上的 Pod 沒有設置對應的容忍度，
那麼這樣的 Pod 將被強制刪除，並且在節點上被終止的 Pod 將立即進行卷分離操作。
這樣就允許那些在無法提供服務節點上的 Pod 能在其他節點上快速恢復。

<!--
During a non-graceful shutdown, Pods are terminated in the two phases:

1. Force delete the Pods that do not have matching `out-of-service` tolerations.
1. Immediately perform detach volume operation for such pods.
-->
在非體面關閉期間，Pod 分兩個階段終止：

1. 強制刪除沒有匹配的 `out-of-service` 容忍度的 Pod。
2. 立即對此類 Pod 執行分離卷操作。

{{< note >}}
<!--
- Before adding the taint `node.kubernetes.io/out-of-service`, it should be verified
  that the node is already in shutdown or power off state (not in the middle of restarting).
- The user is required to manually remove the out-of-service taint after the pods are
  moved to a new node and the user has checked that the shutdown node has been
  recovered since the user was the one who originally added the taint.
-->
- 在添加 `node.kubernetes.io/out-of-service` 污點之前，
  應該驗證節點已經處於關閉或斷電狀態（而不是在重新啓動中）。
- 將 Pod 移動到新節點後，使用者需要手動移除停止服務的污點，
  並且使用者要檢查關閉節點是否已恢復，因爲該使用者是最初添加污點的使用者。
{{< /note >}}

<!--
### Forced storage detach on timeout {#storage-force-detach-on-timeout}

In any situation where a pod deletion has not succeeded for 6 minutes, kubernetes will
force detach volumes being unmounted if the node is unhealthy at that instant. Any
workload still running on the node that uses a force-detached volume will cause a
violation of the
[CSI specification](https://github.com/container-storage-interface/spec/blob/master/spec.md#controllerunpublishvolume),
which states that `ControllerUnpublishVolume` "**must** be called after all
`NodeUnstageVolume` and `NodeUnpublishVolume` on the volume are called and succeed".
In such circumstances, volumes on the node in question might encounter data corruption.
-->
### 存儲超時強制解除掛接  {#storage-force-detach-on-timeout}

在任何情況下，當 Pod 未能在 6 分鐘內刪除成功，如果節點當時不健康，
Kubernetes 將強制解除掛接正在被卸載的卷。
任何運行在使用了強制解除掛接卷的節點之上的工作負載，
都將違反 [CSI 規範](https://github.com/container-storage-interface/spec/blob/master/spec.md#controllerunpublishvolume)，
該規範指出 `ControllerUnpublishVolume`
"**必須**在調用捲上的所有 `NodeUnstageVolume` 和 `NodeUnpublishVolume` 執行且成功後被調用"。
在這種情況下，相關節點上的卷可能會遇到數據損壞。

<!--
The forced storage detach behaviour is optional; users might opt to use the "Non-graceful
node shutdown" feature instead.
-->
強制存儲解除掛接行爲是可選的；使用者可以選擇使用"節點非體面關閉"特性。

<!--
Force storage detach on timeout can be disabled by setting the `disable-force-detach-on-timeout`
config field in `kube-controller-manager`. Disabling the force detach on timeout feature means
that a volume that is hosted on a node that is unhealthy for more than 6 minutes will not have
its associated
[VolumeAttachment](/docs/reference/kubernetes-api/config-and-storage-resources/volume-attachment-v1/)
deleted.
-->
可以通過在 `kube-controller-manager` 中設置 `disable-force-detach-on-timeout`
設定字段來禁用超時時存儲強制解除掛接。
禁用超時強制解除掛接特性意味着，託管在異常超過 6 分鐘的節點上的卷將不會保留其關聯的
[VolumeAttachment](/zh-cn/docs/reference/kubernetes-api/config-and-storage-resources/volume-attachment-v1/)。

<!--
After this setting has been applied, unhealthy pods still attached to volumes must be recovered
via the [Non-Graceful Node Shutdown](#non-graceful-node-shutdown) procedure mentioned above.
-->
應用此設置後，仍然關聯捲到不健康 Pod 必須通過上述[節點非體面關閉](#non-graceful-node-shutdown)過程進行恢復。

{{< note >}}
<!--
- Caution must be taken while using the [Non-Graceful Node Shutdown](#non-graceful-node-shutdown) procedure.
- Deviation from the steps documented above can result in data corruption.
-->
- 使用[節點非體面關閉](#non-graceful-node-shutdown)過程時必須小心。
- 偏離上述步驟可能會導致數據損壞。
{{< /note >}}

## {{% heading "whatsnext" %}}

<!--
Learn more about the following:

- Blog: [Non-Graceful Node Shutdown](/blog/2023/08/16/kubernetes-1-28-non-graceful-node-shutdown-ga/).
- Cluster Architecture: [Nodes](/docs/concepts/architecture/nodes/).
-->
瞭解更多以下信息：

- 博客：[節點非體面關閉](/zh-cn/blog/2023/08/16/kubernetes-1-28-non-graceful-node-shutdown-ga/)。
- 叢集架構：[節點](/zh-cn/docs/concepts/architecture/nodes/)。
