---
layout: blog
title: "Kubernetes 1.26：Pod 調度就緒態"
date: 2022-12-26
slug: pod-scheduling-readiness-alpha
---

<!--
layout: blog
title: "Kubernetes 1.26: Pod Scheduling Readiness"
date: 2022-12-26
slug: pod-scheduling-readiness-alpha
-->

<!--
**Author:** Wei Huang (Apple), Abdullah Gharaibeh (Google)
-->
**作者：** Wei Huang (Apple), Abdullah Gharaibeh (Google)

**譯者：** XiaoYang Zhang (HuaWei)

<!--
Kubernetes 1.26 introduced a new Pod feature: _scheduling gates_. In Kubernetes, scheduling gates
are keys that tell the scheduler when a Pod is ready to be considered for scheduling.
-->
Kubernetes 1.26 引入了一個新的 Pod 特性：**調度門控**。
在 Kubernetes 中，調度門控是通知調度器何時可以考慮 Pod 調度的關鍵。

<!--
## What problem does it solve?

When a Pod is created, the scheduler will continuously attempt to find a node that fits it. This
infinite loop continues until the scheduler either finds a node for the Pod, or the Pod gets deleted.
-->
## 它解決了什麼問題？

當 Pod 被創建時，調度器會不斷嘗試尋找適合它的節點。這個無限循環一直持續到調度程式爲 Pod 找到節點，或者 Pod 被刪除。

<!--
Pods that remain unschedulable for long periods of time (e.g., ones that are blocked on some external event) 
waste scheduling cycles. A scheduling cycle may take ≅20ms or more depending on the complexity of
the Pod's scheduling constraints. Therefore, at scale, those wasted cycles significantly impact the
scheduler's performance. See the arrows in the "scheduler" box below.
-->
長時間無法被調度的 Pod（例如，被某些外部事件阻塞的 Pod）會浪費調度週期。
一個調度週期可能需要約 20ms 或更長時間，這取決於 Pod 的調度約束的複雜度。
因此，大量浪費的被調度週期會嚴重影響調度器的性能。請參閱下面 “調度器” 框中的箭頭。

{{< mermaid >}}
graph LR;
  pod((新 Pod))-->queue
  subgraph 調度器
    queue(調度器隊列)
    sched_cycle[/調度週期/]
    schedulable{可調度?}
    
    queue==>|彈出|sched_cycle
    sched_cycle==>schedulable
    schedulable==>|否|queue
    subgraph note [循環浪費在不斷重新安排 'unready' 狀態的 Pod 上]
    end
  end
  
 classDef plain fill:#ddd,stroke:#fff,stroke-width:1px,color:#000;
 classDef k8s fill:#326ce5,stroke:#fff,stroke-width:1px,color:#fff;
 classDef Scheduler fill:#fff,stroke:#bbb,stroke-width:2px,color:#326ce5;
 classDef note fill:#edf2ae,stroke:#fff,stroke-width:1px;
 class queue,sched_cycle,schedulable k8s;
 class pod plain;
 class note note;
 class Scheduler Scheduler;
{{< /mermaid >}}

<!--
Scheduling gates helps address this problem. It allows declaring that newly created Pods are not
ready for scheduling. When scheduling gates are present on a Pod, the scheduler ignores the Pod
and therefore saves unnecessary scheduling attempts. Those Pods will also be ignored by Cluster
Autoscaler if you have it installed in the cluster.
-->
調度門控有助於解決這個問題。它允許聲明新創建的 Pod 尚未準備好進行調度。
當 Pod 上設置了調度門控時，調度程式會忽略該 Pod，從而避免不必要的調度嘗試。
如果你在叢集中安裝了 Cluster Autoscaler，這些 Pod 也將被忽略。

<!--
Clearing the gates is the responsibility of external controllers with knowledge of when the Pod
should be considered for scheduling (e.g., a quota manager).
-->
清除門控是外部控制器的責任，外部控制器知道何時應考慮對 Pod 進行調度（例如，配額管理器）。

{{< mermaid >}}
graph LR;
  pod((新 Pod))-->queue
  subgraph 調度器
    queue(調度器隊列)
    sched_cycle[/調度週期/]
    schedulable{可調度?}
    popout{彈出?}
    
    queue==>|PreEnqueue 檢查|popout
    popout-->|是|sched_cycle
    popout==>|否|queue
    sched_cycle-->schedulable
    schedulable-->|否|queue
    subgraph note [控制 Pod 調度的開關]
    end
  end
  
 classDef plain fill:#ddd,stroke:#fff,stroke-width:1px,color:#000;
 classDef k8s fill:#326ce5,stroke:#fff,stroke-width:1px,color:#fff;
 classDef Scheduler fill:#fff,stroke:#bbb,stroke-width:2px,color:#326ce5;
 classDef note fill:#edf2ae,stroke:#fff,stroke-width:1px;
 classDef popout fill:#f96,stroke:#fff,stroke-width:1px;
 class queue,sched_cycle,schedulable k8s;
 class pod plain;
 class note note;
 class popout popout;
 class Scheduler Scheduler;
{{< /mermaid >}}

<!--
## How does it work?

Scheduling gates in general works very similar to Finalizers. Pods with a non-empty 
`spec.schedulingGates` field will show as status `SchedulingGated` and be blocked from
scheduling. Note that more than one gate can be added, but they all should be added upon Pod
creation (e.g., you can add them as part of the spec or via a mutating webhook).
-->
## 它是如何工作的？

總體而言，調度門控的工作方式與 Finalizer 非常相似。具有非空 `spec.schedulingGates` 字段的 Pod
的狀態將顯示爲 `SchedulingGated`，並阻止被調度。請注意，添加多個門控是可以的，但它們都應該在創建 Pod
時添加（例如，你可以將它們作爲規約的一部分或者通過變更性質的 Webhook）。

```
NAME       READY   STATUS            RESTARTS   AGE
test-pod   0/1     SchedulingGated   0          10s
```

<!--
To clear the gates, you update the Pod by removing all of the items from the Pod's `schedulingGates`
field. The gates do not need to be removed all at once, but only when all the gates are removed the
scheduler will start to consider the Pod for scheduling.
-->
要清除這些門控，你可以通過刪除 Pod 的 `schedulingGates` 字段中的所有條目來更新 Pod。
不需要一次性移除所有門控，但是，只有當所有門控都移除後，調度器纔會開始考慮對 Pod 進行調度。

<!--
Under the hood, scheduling gates are implemented as a PreEnqueue scheduler plugin, a new scheduler
framework extension point that is invoked at the beginning of each scheduling cycle.
-->
在後臺，調度門控以 PreEnqueue 調度器插件的方式實現，這是調度器框架的新擴展點，在每個調度週期開始時調用。

<!--
## Use Cases

An important use case this feature enables is dynamic quota management. Kubernetes supports
[ResourceQuota](/docs/concepts/policy/resource-quotas/), however the API Server enforces quota at
the time you attempt Pod creation. For example, if a new Pod exceeds the CPU quota, it gets rejected.
The API Server doesn't queue the Pod; therefore, whoever created the Pod needs to continuously attempt
to recreate it again. This either means a delay between resources becoming available and the Pod
actually running, or it means load on the API server and Scheduler due to constant attempts.
-->
## 用例

此特性所支持的一個重要使用場景是動態配額管理。Kubernetes 支持[資源配額](/zh-cn/docs/concepts/policy/resource-quotas/)，
但是 API Server 會在你嘗試創建 Pod 時強制執行配額。例如，如果一個新的 Pod 超過了 CPU 配額，它就會被拒絕。
API Server 不會對 Pod 進行排隊；因此，無論是誰創建了 Pod，都需要不斷嘗試重新創建它。
這意味着在資源可用和 Pod 實際運行之間會有延遲，或者意味着由於不斷嘗試，會增加 API Server 和 Scheduler 的負載。

<!--
Scheduling gates allows an external quota manager to address the above limitation of ResourceQuota.
Specifically, the manager could add a `example.com/quota-check` scheduling gate to all Pods created in the
cluster (using a mutating webhook). The manager would then remove the gate when there is quota to
start the Pod.
-->
調度門控允許外部配額管理器解決 ResourceQuota 的上述限制。具體來說，
管理員可以（使用變更性質的 Webhook）爲叢集中創建的所有 Pod 添加一個
`example.com/quota-check` 調度門控。當存在用於啓動 Pod 的配額時，管理器將移除此門控

<!--
## Whats next?

To use this feature, the `PodSchedulingReadiness` feature gate must be enabled in the API Server
and scheduler. You're more than welcome to test it out and tell us (SIG Scheduling) what you think!
-->
## 接下來

要使用此特性，必須在 API Server 和調度器中啓用 `PodScheduleingReadiness` 特性門控。
非常歡迎你對其進行測試並告訴我們（SIG Scheduling）你的想法！

<!--
## Additional resources

- [Pod Scheduling Readiness](https://kubernetes.io/docs/concepts/scheduling-eviction/pod-scheduling-readiness/)
 in the Kubernetes documentation
- [Kubernetes Enhancement Proposal](https://github.com/kubernetes/enhancements/blob/master/keps/sig-scheduling/3521-pod-scheduling-readiness/README.md)
-->
## 附加資源

- Kubernetes 文檔中的 [Pod 調度就緒態](/zh-cn/docs/concepts/scheduling-eviction/pod-scheduling-readiness/)
- [Kubernetes 增強提案](https://github.com/kubernetes/enhancements/blob/master/keps/sig-scheduling/3521-pod-scheduling-readiness/README.md)