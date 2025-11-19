---
title: Pod 調度就緒態
content_type: concept
weight: 40
---
<!--
title: Pod Scheduling Readiness
content_type: concept
weight: 40
-->

<!-- overview -->

{{< feature-state for_k8s_version="v1.30" state="stable" >}}

<!--
Pods were considered ready for scheduling once created. Kubernetes scheduler
does its due diligence to find nodes to place all pending Pods. However, in a
real-world case, some Pods may stay in a "miss-essential-resources" state for a long period.
These Pods actually churn the scheduler (and downstream integrators like Cluster AutoScaler)
in an unnecessary manner.

By specifying/removing a Pod's `.spec.schedulingGates`, you can control when a Pod is ready
to be considered for scheduling.
-->
Pod 一旦創建就被認爲準備好進行調度。
Kubernetes 調度程序盡職盡責地尋找節點來放置所有待處理的 Pod。
然而，在實際環境中，會有一些 Pod 可能會長時間處於"缺少必要資源"狀態。
這些 Pod 實際上以一種不必要的方式擾亂了調度器（以及 Cluster AutoScaler 這類下游的集成方）。

通過指定或刪除 Pod 的 `.spec.schedulingGates`，可以控制 Pod 何時準備好被納入考量進行調度。

<!-- body -->

<!--
## Configuring Pod schedulingGates

The `schedulingGates` field contains a list of strings, and each string literal is perceived as a
criteria that Pod should be satisfied before considered schedulable. This field can be initialized
only when a Pod is created (either by the client, or mutated during admission). After creation,
each schedulingGate can be removed in arbitrary order, but addition of a new scheduling gate is disallowed.
-->
## 設定 Pod schedulingGates  {#configuring-pod-schedulinggates}

`schedulingGates` 字段包含一個字符串列表，每個字符串文字都被視爲 Pod 在被認爲可調度之前應該滿足的標準。
該字段只能在創建 Pod 時初始化（由客戶端創建，或在准入期間更改）。
創建後，每個 schedulingGate 可以按任意順序刪除，但不允許添加新的調度門控。

{{< figure src="/zh-cn/docs/images/podSchedulingGates.svg" alt="pod-scheduling-gates-diagram" caption="<!--Figure. Pod SchedulingGates-->圖：Pod SchedulingGates" class="diagram-large" link="https://mermaid.live/edit#pako:eNplUctqFEEU_ZWispOejNPd6UxKcBVxJQjZabuo1KO7mO6upqo6GoZZCSIikp2KYuKDJApidKP0CP5Memay8hesfinBWt17zuHec-pOIZGUQQS1wYZtCxwpnA723DALM2CfHiFwW1JQff9WPX5VzcsOdlt4dfawKo-rd2-qJ0fn5aOL56eLZyedxLskOfu6nH_qGL9lFp_fV69PV78OVm-ftozgCOyQmNEiEVl00zoC5z_K5cfy98_DVnH3yj0wGFy3vnp_TSt476tr_5tjAyxP5hcvP_Sb2jE2R3VwfBmzxhcvvgDQ52hRvzfftNZH_UUkwVpvMw4mYw24SBK05rkBYRuONkpOGFrjnHf14L6gJkZ-_sAhMpGq4a51M2wQR7uO9hztO6KZF2bQgSlTKRbUHmha7w-hiVnKQohsSbGahDDMZlaHCyN39jMCkVEFc2CR03_3hIjjRFuUUWGkutVevDl8r7zRMH-FicSU2XYKzX5eiyOhjRUTmXER1XihEgvHxuQaDYc1vR4JExe760SmQy1ojJWJ97aCYeAGY-x6LNj08IbnUbI72hpz1x9xunl15GI4mzkwx9kdKXunsz8c5u0b" >}}

<!--
## Usage example

To mark a Pod not-ready for scheduling, you can create it with one or more scheduling gates like this:
-->
## 用法示例  {#usage-example}

要將 Pod 標記爲未準備好進行調度，你可以在創建 Pod 時附帶一個或多個調度門控，如下所示：

{{% code_sample file="pods/pod-with-scheduling-gates.yaml" %}}

<!--
After the Pod's creation, you can check its state using:
-->
Pod 創建後，你可以使用以下方法檢查其狀態：

```bash
kubectl get pod test-pod
```

<!--
The output reveals it's in `SchedulingGated` state:
-->
輸出顯示它處於 `SchedulingGated` 狀態：

```none
NAME       READY   STATUS            RESTARTS   AGE
test-pod   0/1     SchedulingGated   0          7s
```

<!--
You can also check its `schedulingGates` field by running:
-->
你還可以通過運行以下命令檢查其 `schedulingGates` 字段：

```bash
kubectl get pod test-pod -o jsonpath='{.spec.schedulingGates}'
```

<!--
The output is:
-->
輸出是：

```none
[{"name":"example.com/foo"},{"name":"example.com/bar"}]
```

<!--
To inform scheduler this Pod is ready for scheduling, you can remove its `schedulingGates` entirely
by reapplying a modified manifest:
-->
要通知調度程序此 Pod 已準備好進行調度，你可以通過重新應用修改後的清單來完全刪除其 `schedulingGates`：

{{% code_sample file="pods/pod-without-scheduling-gates.yaml" %}}

<!--
You can check if the `schedulingGates` is cleared by running:
-->
你可以通過運行以下命令檢查 `schedulingGates` 是否已被清空：

```bash
kubectl get pod test-pod -o jsonpath='{.spec.schedulingGates}'
```

<!--
The output is expected to be empty. And you can check its latest status by running:
-->
預計輸出爲空，你可以通過運行下面的命令來檢查它的最新狀態：

```bash
kubectl get pod test-pod -o wide
```

<!--
Given the test-pod doesn't request any CPU/memory resources, it's expected that this Pod's state get
transited from previous `SchedulingGated` to `Running`:
-->
鑑於 test-pod 不請求任何 CPU/內存資源，預計此 Pod 的狀態會從之前的
`SchedulingGated` 轉變爲 `Running`：

```none
NAME       READY   STATUS    RESTARTS   AGE   IP         NODE
test-pod   1/1     Running   0          15s   10.0.0.4   node-2
```

<!--
## Observability

The metric `scheduler_pending_pods` comes with a new label `"gated"` to distinguish whether a Pod
has been tried scheduling but claimed as unschedulable, or explicitly marked as not ready for
scheduling. You can use `scheduler_pending_pods{queue="gated"}` to check the metric result.
-->
## 可觀測性  {#observability}

指標 `scheduler_pending_pods` 帶有一個新標籤 `"gated"`，
以區分 Pod 是否已嘗試調度但被宣稱不可調度，或明確標記爲未準備好調度。
你可以使用 `scheduler_pending_pods{queue="gated"}` 來檢查指標結果。

<!--
## Mutable Pod scheduling directives
-->
## 可變 Pod 調度指令    {#mutable-pod-scheduling-directives}

<!--
You can mutate scheduling directives of Pods while they have scheduling gates, with certain constraints.
At a high level, you can only tighten the scheduling directives of a Pod. In other words, the updated
directives would cause the Pods to only be able to be scheduled on a subset of the nodes that it would
previously match. More concretely, the rules for updating a Pod's scheduling directives are as follows:
-->
當 Pod 具有調度門控時，你可以在某些約束條件下改變 Pod 的調度指令。
在高層次上，你只能收緊 Pod 的調度指令。換句話說，更新後的指令將導致
Pod 只能被調度到它之前匹配的節點子集上。
更具體地說，更新 Pod 的調度指令的規則如下：

<!--
1. For `.spec.nodeSelector`, only additions are allowed. If absent, it will be allowed to be set.

2. For `spec.affinity.nodeAffinity`, if nil, then setting anything is allowed.
-->
1. 對於 `.spec.nodeSelector`，只允許增加。如果原來未設置，則允許設置此字段。

2. 對於 `spec.affinity.nodeAffinity`，如果當前值爲 nil，則允許設置爲任意值。

<!--
3. If `NodeSelectorTerms` was empty, it will be allowed to be set.
   If not empty, then only additions of `NodeSelectorRequirements` to `matchExpressions`
   or `fieldExpressions` are allowed, and no changes to existing `matchExpressions`
   and `fieldExpressions` will be allowed. This is because the terms in
   `.requiredDuringSchedulingIgnoredDuringExecution.NodeSelectorTerms`, are ORed
   while the expressions in `nodeSelectorTerms[].matchExpressions` and
   `nodeSelectorTerms[].fieldExpressions` are ANDed.
-->
3. 如果 `NodeSelectorTerms` 之前爲空，則允許設置該字段。
   如果之前不爲空，則僅允許增加 `NodeSelectorRequirements` 到 `matchExpressions`
   或 `fieldExpressions`，且不允許更改當前的 `matchExpressions` 和 `fieldExpressions`。
   這是因爲 `.requiredDuringSchedulingIgnoredDuringExecution.NodeSelectorTerms`
   中的條目被執行邏輯或運算，而 `nodeSelectorTerms[].matchExpressions` 和
   `nodeSelectorTerms[].fieldExpressions` 中的表達式被執行邏輯與運算。

<!--
4. For `.preferredDuringSchedulingIgnoredDuringExecution`, all updates are allowed.
   This is because preferred terms are not authoritative, and so policy controllers
   don't validate those terms.
-->
4. 對於 `.preferredDuringSchedulingIgnoredDuringExecution`，所有更新都被允許。
   這是因爲首選條目不具有權威性，因此策略控制器不會驗證這些條目。

## {{% heading "whatsnext" %}}

<!--
* Read the [PodSchedulingReadiness KEP](https://github.com/kubernetes/enhancements/blob/master/keps/sig-scheduling/3521-pod-scheduling-readiness) for more details
-->
* 閱讀 [PodSchedulingReadiness KEP](https://github.com/kubernetes/enhancements/blob/master/keps/sig-scheduling/3521-pod-scheduling-readiness)
  瞭解更多詳情
