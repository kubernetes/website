---
layout: blog
title: "kube-scheduler-simulator 介绍"
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
Kubernetes 调度器（Scheduler）是一个关键的控制平面组件，负责决定 Pod 将运行在哪个节点上。  
因此，任何使用 Kubernetes 的人都依赖于调度器。

[kube-scheduler-simulator](https://github.com/kubernetes-sigs/kube-scheduler-simulator)
是一个 Kubernetes 调度器的**模拟器**，最初是作为
[Google Summer of Code 2021](https://summerofcode.withgoogle.com/)
项目由我（Kensei Nakada）开发的，后来收到了许多贡献。  
该工具允许用户深入检查调度器的行为和决策。

<!--
It is useful for casual users who employ scheduling constraints (for example, [inter-Pod affinity](/docs/concepts/scheduling-eviction/assign-pod-node/#affinity-and-anti-affinity/#affinity-and-anti-affinity))
and experts who extend the scheduler with custom plugins.
-->
对于使用调度约束（例如，
[Pod 间亲和性](/zh-cn/docs/concepts/scheduling-eviction/assign-pod-node/#affinity-and-anti-affinity)）
的普通用户和通过自定义插件扩展调度器的专家来说，它都是非常有用的。

<!--
## Motivation

The scheduler often appears as a black box, 
composed of many plugins that each contribute to the scheduling decision-making process from their unique perspectives. 
Understanding its behavior can be challenging due to the multitude of factors it considers. 

Even if a Pod appears to be scheduled correctly in a simple test cluster, it might have been scheduled based on different calculations than expected. This discrepancy could lead to unexpected scheduling outcomes when deployed in a large production environment.
-->
## 出发点

调度器通常被视为一个“黑箱”，  
由许多插件组成，每个插件从其独特的角度对调度决策过程做出贡献。  
由于调度器考虑的因素繁多，理解其行为可能会非常具有挑战性。

即使在一个简单的测试集群中，Pod 似乎被正确调度，它也可能基于与预期不同的计算逻辑进行调度。
这种差异可能会在大规模生产环境中导致意外的调度结果。

<!--
Also, testing a scheduler is a complex challenge.
There are countless patterns of operations executed within a real cluster, making it unfeasible to anticipate every scenario with a finite number of tests. 
More often than not, bugs are discovered only when the scheduler is deployed in an actual cluster.
Actually, many bugs are found by users after shipping the release, 
even in the upstream kube-scheduler. 
-->
此外，测试调度器是一个复杂的挑战。  
在实际集群中执行的操作模式数不胜数，使得通过有限数量的测试来预见每种场景变得不可行。  
通常，只有当调度器部署到实际集群时，才会发现其中的 Bug。

实际上，许多 Bug 是在发布版本后由用户发现的，即使是在上游 kube-scheduler 中也是如此。

<!--
Having a development or sandbox environment for testing the scheduler — or, indeed, any Kubernetes controllers — is a common practice.
However, this approach falls short of capturing all the potential scenarios that might arise in a production cluster 
because a development cluster is often much smaller with notable differences in workload sizes and scaling dynamics.
It never sees the exact same use or exhibits the same behavior as its production counterpart.
-->
拥有一个用于测试调度器或任何 Kubernetes 控制器的开发或沙箱环境是常见做法。  
然而，这种方法不足以捕捉生产集群中可能出现的所有潜在场景，因为开发集群通常规模要小得多，
在工作负载大小和扩展动态方面存在显著差异。  
它永远不会看到与生产环境中完全相同的使用情况或表现出相同的行为。

<!--
The kube-scheduler-simulator aims to solve those problems.
It enables users to test their scheduling constraints, scheduler configurations, 
and custom plugins while checking every detailed part of scheduling decisions.
It also allows users to create a simulated cluster environment, where they can test their scheduler
with the same resources as their production cluster without affecting actual workloads.
-->
kube-scheduler-simulator 旨在解决这些问题。  
它使用户能够在检查调度决策每一个细节的同时，测试他们的调度约束、调度器配置和自定义插件。  
它还允许用户创建一个模拟集群环境，在该环境中，他们可以使用与生产集群相同的资源来测试其调度器，
而不会影响实际的工作负载。

<!--
## Features of the kube-scheduler-simulator

The kube-scheduler-simulator’s core feature is its ability to expose the scheduler's internal decisions.
The scheduler operates based on the [scheduling framework](/docs/concepts/scheduling-eviction/scheduling-framework/), 
using various plugins at different extension points,
filter nodes (Filter phase), score nodes (Score phase), and ultimately determine the best node for the Pod.
-->
## kube-scheduler-simulator 的特性

kube-scheduler-simulator 的核心特性在于它能够揭示调度器的内部决策过程。  
调度器基于 [scheduling framework](/zh-cn/docs/concepts/scheduling-eviction/scheduling-framework/)
运作，在不同的扩展点使用各种插件，过滤节点（Filter 阶段）、为节点打分（Score 阶段），
并最终确定最适合 Pod 的节点。

<!--
The simulator allows users to create Kubernetes resources and observe how each plugin influences the scheduling decisions for Pods.
This visibility helps users understand the scheduler’s workings and define appropriate scheduling constraints.

{{< figure src="/images/blog/2025-04-07-kube-scheduler-simulator/simulator.png" alt="Screenshot of the simulator web frontend that shows the detailed scheduling results per node and per extension point" title="The simulator web frontend" >}}
-->
模拟器允许用户创建 Kubernetes 资源，并观察每个插件如何影响 Pod 的调度决策。  
这种可见性帮助用户理解调度器的工作机制并定义适当的调度约束。

{{< figure src="/images/blog/2025-04-07-kube-scheduler-simulator/simulator.png" alt="模拟器 Web 前端的截图，显示了每个节点和每个扩展点的详细调度结果" title="模拟器 Web 前端" >}}

<!--
Inside the simulator, a debuggable scheduler runs instead of the vanilla scheduler. 
This debuggable scheduler outputs the results of each scheduler plugin at every extension point to the Pod’s annotations like the following manifest shows
and the web front end formats/visualizes the scheduling results based on these annotations.
-->
在模拟器内部，运行的是一个可调试的调度器，而不是普通的调度器。  
这个可调试的调度器会将每个调度器插件在各个扩展点的结果输出到 Pod 的注解中，
如下所示的清单所示，而 Web 前端则基于这些注解对调度结果进行格式化和可视化。

<!--
# The JSONs within these annotations are manually formatted for clarity in the blog post. 
-->
```yaml
kind: Pod
apiVersion: v1
metadata:
  # 为了使博客文章更清晰，这些注释中的 JSON 都是手动格式化的。
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
用户还可以将[其自定义插件](/zh-cn/docs/concepts/scheduling-eviction/scheduling-framework/)
或[扩展器](https://github.com/kubernetes/design-proposals-archive/blob/main/scheduling/scheduler_extender.md)
集成到可调试调度器中，并可视化其结果。

这个可调试调度器还可以独立运行，例如，在任何 Kubernetes 集群上或在集成测试中运行。  
这对于希望测试其插件或在真实集群中以更好的可调试性检查其自定义调度器的插件开发者来说非常有用。

<!--
## The simulator as a better dev cluster

As mentioned earlier, with a limited set of tests, it is impossible to predict every possible scenario in a real-world cluster.
Typically, users will test the scheduler in a small, development cluster before deploying it to production, hoping that no issues arise.
-->
## 作为更优开发集群的模拟器

如前所述，由于测试用例的数量有限，不可能预测真实世界集群中的每一种可能场景。  
通常，用户会在一个小型开发集群中测试调度器，然后再将其部署到生产环境中，
希望能不出现任何问题。

<!--
[The simulator’s importing feature](https://github.com/kubernetes-sigs/kube-scheduler-simulator/blob/master/simulator/docs/import-cluster-resources.md)
provides a solution by allowing users to simulate deploying a new scheduler version in a production-like environment without impacting their live workloads.

By continuously syncing between a production cluster and the simulator, users can safely test a new scheduler version with the same resources their production cluster handles. 
Once confident in its performance, they can proceed with the production deployment, reducing the risk of unexpected issues.
-->
[模拟器的导入功能](https://github.com/kubernetes-sigs/kube-scheduler-simulator/blob/master/simulator/docs/import-cluster-resources.md)
通过允许用户在类似生产环境的模拟中部署新的调度器版本而不影响其线上工作负载，
提供了一种解决方案。

通过在生产集群和模拟器之间进行持续同步，用户可以安全地使用与生产集群相同的资源测试新的调度器版本。
一旦对其性能感到满意，便可以继续进行生产部署，从而减少意外问题的风险。

<!--
## What are the use cases?

1. **Cluster users**: Examine if scheduling constraints (for example, PodAffinity, PodTopologySpread) work as intended.
1. **Cluster admins**: Assess how a cluster would behave with changes to the scheduler configuration.
1. **Scheduler plugin developers**: Test a custom scheduler plugins or extenders, use the debuggable scheduler in integration tests or development clusters, or use the [syncing](https://github.com/kubernetes-sigs/kube-scheduler-simulator/blob/simulator/v0.3.0/simulator/docs/import-cluster-resources.md) feature for testing within a production-like environment.
-->
## 有哪些使用场景？

1. **集群用户**：检查调度约束（例如，PodAffinity、PodTopologySpread）是否按预期工作。
2. **集群管理员**：评估在调度器配置更改后集群的行为表现。
3. **调度器插件开发者**：测试自定义调度器插件或扩展器，在集成测试或开发集群中使用可调试调度器，
   或利用[同步](https://github.com/kubernetes-sigs/kube-scheduler-simulator/blob/simulator/v0.3.0/simulator/docs/import-cluster-resources.md)
   功能在类似生产环境的环境中进行测试。

<!--
## Getting started

The simulator only requires Docker to be installed on a machine; a Kubernetes cluster is not necessary.
-->
## 入门指南

模拟器仅要求在机器上安装 Docker；并不需要 Kubernetes 集群。

```
git clone git@github.com:kubernetes-sigs/kube-scheduler-simulator.git
cd kube-scheduler-simulator
make docker_up
```

<!--
You can then access the simulator's web UI at `http://localhost:3000`.

Visit the [kube-scheduler-simulator repository](https://sigs.k8s.io/kube-scheduler-simulator) for more details!
-->
然后，你可以通过访问 `http://localhost:3000` 来使用模拟器的 Web UI。

更多详情，请访问 [kube-scheduler-simulator 仓库](https://sigs.k8s.io/kube-scheduler-simulator)！

<!--
## Getting involved 

The scheduler simulator is developed by [Kubernetes SIG Scheduling](https://github.com/kubernetes/community/blob/master/sig-scheduling/README.md#kube-scheduler-simulator). Your feedback and contributions are welcome!
-->
## 参与其中

调度器模拟器由
[Kubernetes SIG Scheduling](https://github.com/kubernetes/community/blob/master/sig-scheduling/README.md#kube-scheduler-simulator)
开发。欢迎你提供反馈并参与贡献！

<!--
Open issues or PRs at the [kube-scheduler-simulator repository](https://sigs.k8s.io/kube-scheduler-simulator).
Join the conversation on the [#sig-scheduling](https://kubernetes.slack.com/messages/sig-scheduling) slack channel.
-->
在 [kube-scheduler-simulator 仓库](https://sigs.k8s.io/kube-scheduler-simulator)开启问题或提交 PR。

加入 [#sig-scheduling](https://kubernetes.slack.com/messages/sig-scheduling)
Slack 频道参与讨论。

<!--
## Acknowledgments

The simulator has been maintained by dedicated volunteer engineers, overcoming many challenges to reach its current form. 

A big shout out to all [the awesome contributors](https://github.com/kubernetes-sigs/kube-scheduler-simulator/graphs/contributors)!
-->
## 致谢

模拟器由致力于该项目的志愿者工程师们维护，克服了许多挑战才达到了现在的形式。

特别感谢所有[杰出的贡献者](https://github.com/kubernetes-sigs/kube-scheduler-simulator/graphs/contributors)！
