---
layout: blog
title: "kube-scheduler-simulator 介紹"
date: 2025-04-07
draft: false 
slug: introducing-kube-scheduler-simulator
author: Kensei Nakada (Tetrate)
translator: >
  [Xin Li](https://github.com/my-git9) (DaoCloud)
---
<!--
layout: blog
title: "Introducing kube-scheduler-simulator"
date: 2025-04-07
draft: false 
slug: introducing-kube-scheduler-simulator
author: Kensei Nakada (Tetrate)
-->

<!--
The Kubernetes Scheduler is a crucial control plane component that determines which node a Pod will run on. 
Thus, anyone utilizing Kubernetes relies on a scheduler.

[kube-scheduler-simulator](https://github.com/kubernetes-sigs/kube-scheduler-simulator) is a _simulator_ for the Kubernetes scheduler, that started as a [Google Summer of Code 2021](https://summerofcode.withgoogle.com/) project developed by me (Kensei Nakada) and later received a lot of contributions.
This tool allows users to closely examine the scheduler’s behavior and decisions. 
-->
Kubernetes 調度器（Scheduler）是一個關鍵的控制平面組件，負責決定 Pod 將運行在哪個節點上。  
因此，任何使用 Kubernetes 的人都依賴於調度器。

[kube-scheduler-simulator](https://github.com/kubernetes-sigs/kube-scheduler-simulator)
是一個 Kubernetes 調度器的**模擬器**，最初是作爲
[Google Summer of Code 2021](https://summerofcode.withgoogle.com/)
項目由我（Kensei Nakada）開發的，後來收到了許多貢獻。  
該工具允許用戶深入檢查調度器的行爲和決策。

<!--
It is useful for casual users who employ scheduling constraints (for example, [inter-Pod affinity](/docs/concepts/scheduling-eviction/assign-pod-node/#affinity-and-anti-affinity/#affinity-and-anti-affinity))
and experts who extend the scheduler with custom plugins.
-->
對於使用調度約束（例如，
[Pod 間親和性](/zh-cn/docs/concepts/scheduling-eviction/assign-pod-node/#affinity-and-anti-affinity)）
的普通用戶和通過自定義插件擴展調度器的專家來說，它都是非常有用的。

<!--
## Motivation

The scheduler often appears as a black box, 
composed of many plugins that each contribute to the scheduling decision-making process from their unique perspectives. 
Understanding its behavior can be challenging due to the multitude of factors it considers. 

Even if a Pod appears to be scheduled correctly in a simple test cluster, it might have been scheduled based on different calculations than expected. This discrepancy could lead to unexpected scheduling outcomes when deployed in a large production environment.
-->
## 出發點

調度器通常被視爲一個“黑箱”，  
由許多插件組成，每個插件從其獨特的角度對調度決策過程做出貢獻。  
由於調度器考慮的因素繁多，理解其行爲可能會非常具有挑戰性。

即使在一個簡單的測試集羣中，Pod 似乎被正確調度，它也可能基於與預期不同的計算邏輯進行調度。
這種差異可能會在大規模生產環境中導致意外的調度結果。

<!--
Also, testing a scheduler is a complex challenge.
There are countless patterns of operations executed within a real cluster, making it unfeasible to anticipate every scenario with a finite number of tests. 
More often than not, bugs are discovered only when the scheduler is deployed in an actual cluster.
Actually, many bugs are found by users after shipping the release, 
even in the upstream kube-scheduler. 
-->
此外，測試調度器是一個複雜的挑戰。  
在實際集羣中執行的操作模式數不勝數，使得通過有限數量的測試來預見每種場景變得不可行。  
通常，只有當調度器部署到實際集羣時，纔會發現其中的 Bug。

實際上，許多 Bug 是在發佈版本後由用戶發現的，即使是在上游 kube-scheduler 中也是如此。

<!--
Having a development or sandbox environment for testing the scheduler — or, indeed, any Kubernetes controllers — is a common practice.
However, this approach falls short of capturing all the potential scenarios that might arise in a production cluster 
because a development cluster is often much smaller with notable differences in workload sizes and scaling dynamics.
It never sees the exact same use or exhibits the same behavior as its production counterpart.
-->
擁有一個用於測試調度器或任何 Kubernetes 控制器的開發或沙箱環境是常見做法。  
然而，這種方法不足以捕捉生產集羣中可能出現的所有潛在場景，因爲開發集羣通常規模要小得多，
在工作負載大小和擴展動態方面存在顯著差異。  
它永遠不會看到與生產環境中完全相同的使用情況或表現出相同的行爲。

<!--
The kube-scheduler-simulator aims to solve those problems.
It enables users to test their scheduling constraints, scheduler configurations, 
and custom plugins while checking every detailed part of scheduling decisions.
It also allows users to create a simulated cluster environment, where they can test their scheduler
with the same resources as their production cluster without affecting actual workloads.
-->
kube-scheduler-simulator 旨在解決這些問題。  
它使用戶能夠在檢查調度決策每一個細節的同時，測試他們的調度約束、調度器配置和自定義插件。  
它還允許用戶創建一個模擬集羣環境，在該環境中，他們可以使用與生產集羣相同的資源來測試其調度器，
而不會影響實際的工作負載。

<!--
## Features of the kube-scheduler-simulator

The kube-scheduler-simulator’s core feature is its ability to expose the scheduler's internal decisions.
The scheduler operates based on the [scheduling framework](/docs/concepts/scheduling-eviction/scheduling-framework/), 
using various plugins at different extension points,
filter nodes (Filter phase), score nodes (Score phase), and ultimately determine the best node for the Pod.
-->
## kube-scheduler-simulator 的特性

kube-scheduler-simulator 的核心特性在於它能夠揭示調度器的內部決策過程。  
調度器基於 [scheduling framework](/zh-cn/docs/concepts/scheduling-eviction/scheduling-framework/)
運作，在不同的擴展點使用各種插件，過濾節點（Filter 階段）、爲節點打分（Score 階段），
並最終確定最適合 Pod 的節點。

<!--
The simulator allows users to create Kubernetes resources and observe how each plugin influences the scheduling decisions for Pods.
This visibility helps users understand the scheduler’s workings and define appropriate scheduling constraints.

{{< figure src="/images/blog/2025-04-07-kube-scheduler-simulator/simulator.png" alt="Screenshot of the simulator web frontend that shows the detailed scheduling results per node and per extension point" title="The simulator web frontend" >}}
-->
模擬器允許用戶創建 Kubernetes 資源，並觀察每個插件如何影響 Pod 的調度決策。  
這種可見性幫助用戶理解調度器的工作機制並定義適當的調度約束。

{{< figure src="/images/blog/2025-04-07-kube-scheduler-simulator/simulator.png" alt="模擬器 Web 前端的截圖，顯示了每個節點和每個擴展點的詳細調度結果" title="模擬器 Web 前端" >}}

<!--
Inside the simulator, a debuggable scheduler runs instead of the vanilla scheduler. 
This debuggable scheduler outputs the results of each scheduler plugin at every extension point to the Pod’s annotations like the following manifest shows
and the web front end formats/visualizes the scheduling results based on these annotations.
-->
在模擬器內部，運行的是一個可調試的調度器，而不是普通的調度器。  
這個可調試的調度器會將每個調度器插件在各個擴展點的結果輸出到 Pod 的註解中，
如下所示的清單所示，而 Web 前端則基於這些註解對調度結果進行格式化和可視化。

<!--
# The JSONs within these annotations are manually formatted for clarity in the blog post. 
-->
```yaml
kind: Pod
apiVersion: v1
metadata:
  # 爲了使博客文章更清晰，這些註釋中的 JSON 都是手動格式化的。
  annotations:
    kube-scheduler-simulator.sigs.k8s.io/bind-result: '{"DefaultBinder":"success"}'
    kube-scheduler-simulator.sigs.k8s.io/filter-result: >-
      {
        "node-jjfg5":{
            "NodeName":"passed",
            "NodeResourcesFit":"passed",
            "NodeUnschedulable":"passed",
            "TaintToleration":"passed"
        },
        "node-mtb5x":{
            "NodeName":"passed",
            "NodeResourcesFit":"passed",
            "NodeUnschedulable":"passed",
            "TaintToleration":"passed"
        }
      }
    kube-scheduler-simulator.sigs.k8s.io/finalscore-result: >-
      {
        "node-jjfg5":{
            "ImageLocality":"0",
            "NodeAffinity":"0",
            "NodeResourcesBalancedAllocation":"52",
            "NodeResourcesFit":"47",
            "TaintToleration":"300",
            "VolumeBinding":"0"
        },
        "node-mtb5x":{
            "ImageLocality":"0",
            "NodeAffinity":"0",
            "NodeResourcesBalancedAllocation":"76",
            "NodeResourcesFit":"73",
            "TaintToleration":"300",
            "VolumeBinding":"0"
        }
      } 
    kube-scheduler-simulator.sigs.k8s.io/permit-result: '{}'
    kube-scheduler-simulator.sigs.k8s.io/permit-result-timeout: '{}'
    kube-scheduler-simulator.sigs.k8s.io/postfilter-result: '{}'
    kube-scheduler-simulator.sigs.k8s.io/prebind-result: '{"VolumeBinding":"success"}'
    kube-scheduler-simulator.sigs.k8s.io/prefilter-result: '{}'
    kube-scheduler-simulator.sigs.k8s.io/prefilter-result-status: >-
      {
        "AzureDiskLimits":"",
        "EBSLimits":"",
        "GCEPDLimits":"",
        "InterPodAffinity":"",
        "NodeAffinity":"",
        "NodePorts":"",
        "NodeResourcesFit":"success",
        "NodeVolumeLimits":"",
        "PodTopologySpread":"",
        "VolumeBinding":"",
        "VolumeRestrictions":"",
        "VolumeZone":""
      }
    kube-scheduler-simulator.sigs.k8s.io/prescore-result: >-
      {
        "InterPodAffinity":"",
        "NodeAffinity":"success",
        "NodeResourcesBalancedAllocation":"success",
        "NodeResourcesFit":"success",
        "PodTopologySpread":"",
        "TaintToleration":"success"
      }
    kube-scheduler-simulator.sigs.k8s.io/reserve-result: '{"VolumeBinding":"success"}'
    kube-scheduler-simulator.sigs.k8s.io/result-history: >-
      [
        {
            "kube-scheduler-simulator.sigs.k8s.io/bind-result":"{\"DefaultBinder\":\"success\"}",
            "kube-scheduler-simulator.sigs.k8s.io/filter-result":"{\"node-jjfg5\":{\"NodeName\":\"passed\",\"NodeResourcesFit\":\"passed\",\"NodeUnschedulable\":\"passed\",\"TaintToleration\":\"passed\"},\"node-mtb5x\":{\"NodeName\":\"passed\",\"NodeResourcesFit\":\"passed\",\"NodeUnschedulable\":\"passed\",\"TaintToleration\":\"passed\"}}",
            "kube-scheduler-simulator.sigs.k8s.io/finalscore-result":"{\"node-jjfg5\":{\"ImageLocality\":\"0\",\"NodeAffinity\":\"0\",\"NodeResourcesBalancedAllocation\":\"52\",\"NodeResourcesFit\":\"47\",\"TaintToleration\":\"300\",\"VolumeBinding\":\"0\"},\"node-mtb5x\":{\"ImageLocality\":\"0\",\"NodeAffinity\":\"0\",\"NodeResourcesBalancedAllocation\":\"76\",\"NodeResourcesFit\":\"73\",\"TaintToleration\":\"300\",\"VolumeBinding\":\"0\"}}",
            "kube-scheduler-simulator.sigs.k8s.io/permit-result":"{}",
            "kube-scheduler-simulator.sigs.k8s.io/permit-result-timeout":"{}",
            "kube-scheduler-simulator.sigs.k8s.io/postfilter-result":"{}",
            "kube-scheduler-simulator.sigs.k8s.io/prebind-result":"{\"VolumeBinding\":\"success\"}",
            "kube-scheduler-simulator.sigs.k8s.io/prefilter-result":"{}",
            "kube-scheduler-simulator.sigs.k8s.io/prefilter-result-status":"{\"AzureDiskLimits\":\"\",\"EBSLimits\":\"\",\"GCEPDLimits\":\"\",\"InterPodAffinity\":\"\",\"NodeAffinity\":\"\",\"NodePorts\":\"\",\"NodeResourcesFit\":\"success\",\"NodeVolumeLimits\":\"\",\"PodTopologySpread\":\"\",\"VolumeBinding\":\"\",\"VolumeRestrictions\":\"\",\"VolumeZone\":\"\"}",
            "kube-scheduler-simulator.sigs.k8s.io/prescore-result":"{\"InterPodAffinity\":\"\",\"NodeAffinity\":\"success\",\"NodeResourcesBalancedAllocation\":\"success\",\"NodeResourcesFit\":\"success\",\"PodTopologySpread\":\"\",\"TaintToleration\":\"success\"}",
            "kube-scheduler-simulator.sigs.k8s.io/reserve-result":"{\"VolumeBinding\":\"success\"}",
            "kube-scheduler-simulator.sigs.k8s.io/score-result":"{\"node-jjfg5\":{\"ImageLocality\":\"0\",\"NodeAffinity\":\"0\",\"NodeResourcesBalancedAllocation\":\"52\",\"NodeResourcesFit\":\"47\",\"TaintToleration\":\"0\",\"VolumeBinding\":\"0\"},\"node-mtb5x\":{\"ImageLocality\":\"0\",\"NodeAffinity\":\"0\",\"NodeResourcesBalancedAllocation\":\"76\",\"NodeResourcesFit\":\"73\",\"TaintToleration\":\"0\",\"VolumeBinding\":\"0\"}}",
            "kube-scheduler-simulator.sigs.k8s.io/selected-node":"node-mtb5x"
        }
      ]
    kube-scheduler-simulator.sigs.k8s.io/score-result: >-
      {
        "node-jjfg5":{
            "ImageLocality":"0",
            "NodeAffinity":"0",
            "NodeResourcesBalancedAllocation":"52",
            "NodeResourcesFit":"47",
            "TaintToleration":"0",
            "VolumeBinding":"0"
        },
        "node-mtb5x":{
            "ImageLocality":"0",
            "NodeAffinity":"0",
            "NodeResourcesBalancedAllocation":"76",
            "NodeResourcesFit":"73",
            "TaintToleration":"0",
            "VolumeBinding":"0"
        }
      }
    kube-scheduler-simulator.sigs.k8s.io/selected-node: node-mtb5x
```

<!--
Users can also integrate [their custom plugins](/docs/concepts/scheduling-eviction/scheduling-framework/) or [extenders](https://github.com/kubernetes/design-proposals-archive/blob/main/scheduling/scheduler_extender.md), into the debuggable scheduler and visualize their results. 

This debuggable scheduler can also run standalone, for example, on any Kubernetes cluster or in integration tests. 
This would be useful to custom plugin developers who want to test their plugins or examine their custom scheduler in a real cluster with better debuggability.
-->
用戶還可以將[其自定義插件](/zh-cn/docs/concepts/scheduling-eviction/scheduling-framework/)
或[擴展器](https://github.com/kubernetes/design-proposals-archive/blob/main/scheduling/scheduler_extender.md)
集成到可調試調度器中，並可視化其結果。

這個可調試調度器還可以獨立運行，例如，在任何 Kubernetes 集羣上或在集成測試中運行。  
這對於希望測試其插件或在真實集羣中以更好的可調試性檢查其自定義調度器的插件開發者來說非常有用。

<!--
## The simulator as a better dev cluster

As mentioned earlier, with a limited set of tests, it is impossible to predict every possible scenario in a real-world cluster.
Typically, users will test the scheduler in a small, development cluster before deploying it to production, hoping that no issues arise.
-->
## 作爲更優開發集羣的模擬器

如前所述，由於測試用例的數量有限，不可能預測真實世界集羣中的每一種可能場景。  
通常，用戶會在一個小型開發集羣中測試調度器，然後再將其部署到生產環境中，
希望能不出現任何問題。

<!--
[The simulator’s importing feature](https://github.com/kubernetes-sigs/kube-scheduler-simulator/blob/master/simulator/docs/import-cluster-resources.md)
provides a solution by allowing users to simulate deploying a new scheduler version in a production-like environment without impacting their live workloads.

By continuously syncing between a production cluster and the simulator, users can safely test a new scheduler version with the same resources their production cluster handles. 
Once confident in its performance, they can proceed with the production deployment, reducing the risk of unexpected issues.
-->
[模擬器的導入功能](https://github.com/kubernetes-sigs/kube-scheduler-simulator/blob/master/simulator/docs/import-cluster-resources.md)
通過允許用戶在類似生產環境的模擬中部署新的調度器版本而不影響其線上工作負載，
提供了一種解決方案。

通過在生產集羣和模擬器之間進行持續同步，用戶可以安全地使用與生產集羣相同的資源測試新的調度器版本。
一旦對其性能感到滿意，便可以繼續進行生產部署，從而減少意外問題的風險。

<!--
## What are the use cases?

1. **Cluster users**: Examine if scheduling constraints (for example, PodAffinity, PodTopologySpread) work as intended.
1. **Cluster admins**: Assess how a cluster would behave with changes to the scheduler configuration.
1. **Scheduler plugin developers**: Test a custom scheduler plugins or extenders, use the debuggable scheduler in integration tests or development clusters, or use the [syncing](https://github.com/kubernetes-sigs/kube-scheduler-simulator/blob/simulator/v0.3.0/simulator/docs/import-cluster-resources.md) feature for testing within a production-like environment.
-->
## 有哪些使用場景？

1. **集羣用戶**：檢查調度約束（例如，PodAffinity、PodTopologySpread）是否按預期工作。
2. **集羣管理員**：評估在調度器配置更改後集羣的行爲表現。
3. **調度器插件開發者**：測試自定義調度器插件或擴展器，在集成測試或開發集羣中使用可調試調度器，
   或利用[同步](https://github.com/kubernetes-sigs/kube-scheduler-simulator/blob/simulator/v0.3.0/simulator/docs/import-cluster-resources.md)
   功能在類似生產環境的環境中進行測試。

<!--
## Getting started

The simulator only requires Docker to be installed on a machine; a Kubernetes cluster is not necessary.
-->
## 入門指南

模擬器僅要求在機器上安裝 Docker；並不需要 Kubernetes 集羣。

```
git clone git@github.com:kubernetes-sigs/kube-scheduler-simulator.git
cd kube-scheduler-simulator
make docker_up
```

<!--
You can then access the simulator's web UI at `http://localhost:3000`.

Visit the [kube-scheduler-simulator repository](https://sigs.k8s.io/kube-scheduler-simulator) for more details!
-->
然後，你可以通過訪問 `http://localhost:3000` 來使用模擬器的 Web UI。

更多詳情，請訪問 [kube-scheduler-simulator 倉庫](https://sigs.k8s.io/kube-scheduler-simulator)！

<!--
## Getting involved 

The scheduler simulator is developed by [Kubernetes SIG Scheduling](https://github.com/kubernetes/community/blob/master/sig-scheduling/README.md#kube-scheduler-simulator). Your feedback and contributions are welcome!
-->
## 參與其中

調度器模擬器由
[Kubernetes SIG Scheduling](https://github.com/kubernetes/community/blob/master/sig-scheduling/README.md#kube-scheduler-simulator)
開發。歡迎你提供反饋並參與貢獻！

<!--
Open issues or PRs at the [kube-scheduler-simulator repository](https://sigs.k8s.io/kube-scheduler-simulator).
Join the conversation on the [#sig-scheduling](https://kubernetes.slack.com/messages/sig-scheduling) slack channel.
-->
在 [kube-scheduler-simulator 倉庫](https://sigs.k8s.io/kube-scheduler-simulator)開啓問題或提交 PR。

加入 [#sig-scheduling](https://kubernetes.slack.com/messages/sig-scheduling)
Slack 頻道參與討論。

<!--
## Acknowledgments

The simulator has been maintained by dedicated volunteer engineers, overcoming many challenges to reach its current form. 

A big shout out to all [the awesome contributors](https://github.com/kubernetes-sigs/kube-scheduler-simulator/graphs/contributors)!
-->
## 致謝

模擬器由致力於該項目的志願者工程師們維護，克服了許多挑戰才達到了現在的形式。

特別感謝所有[傑出的貢獻者](https://github.com/kubernetes-sigs/kube-scheduler-simulator/graphs/contributors)！
